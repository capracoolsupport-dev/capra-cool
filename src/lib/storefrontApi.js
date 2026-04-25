import { hasSupabaseConfig, supabase } from "./supabase";

const defaultStoreSettings = {
  brandName: "Trendy Spice Store",
  brandSubline: "trendyspicestore.com",
  supportEmail: "trendyspicestore@gmail.com",
  supportPhone: "7067491668",
  businessLocation: "MOG lines, Mahu naka, Indore Madhya Pradesh, 452002",
  supportWindow: "Monday to Saturday, 10 AM to 7 PM",
  instagramUrl: "https://www.instagram.com/muskan_crochet_?igsh=MWk1eWdvYTR6NDR5",
  facebookUrl: "https://www.facebook.com/share/1CDKXCNsFq/",
  heroEyebrow: "Premium handmade crochet",
  heroTitle: "Handmade crochet that feels personal, polished, and beautifully gift-ready.",
  heroDescription:
    "Discover premium handmade crochet pieces with soft texture, curated color stories, and a shopping experience that feels calm, clear, and gift-ready.",
  heroPrimaryCtaLabel: "Explore Collection",
  heroPrimaryCtaHref: "/#featured",
  heroSecondaryCtaLabel: "Create Custom Order",
  heroSecondaryCtaHref: "/customize",
  heroStats: [],
  showcaseEyebrow: "Showcase",
  showcaseTitle: "",
  showcaseDescription: "",
  showcaseVideoUrl: "",
  showcasePosterUrl: "",
  aboutTitle: "Handmade crochet made to feel slow, warm, and intentionally premium.",
  aboutIntro: "",
  aboutStory: "",
  qualityPromise: "",
  customizeTitle: "Design a custom crochet piece that feels personal from the start.",
  customizeDescription: "",
  contactTitle: "Need help choosing a handmade piece or placing an order?",
  contactDescription: ""
};

function mapStorageUrl(bucketName, storagePath) {
  if (!supabase || !bucketName || !storagePath) {
    return "";
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
  return data.publicUrl;
}

function normalizeProduct(product, categoriesById) {
  const category =
    product.category ||
    product.categories ||
    categoriesById[product.category_id] ||
    categoriesById[product.category_slug] ||
    null;

  const media = (product.media || product.product_media || [])
    .map((item) => ({
      id: item.id,
      kind: item.media_kind || item.kind || "image",
      url: item.public_url || item.url || mapStorageUrl(item.bucket_name || "product-media", item.storage_path),
      altText: item.alt_text || item.altText || product.name,
      isPrimary: Boolean(item.is_primary || item.isPrimary),
      sortOrder: item.sort_order || item.sortOrder || 0
    }))
    .filter((item) => item.url)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const reviews = (product.reviews || [])
    .map((item) => ({
      id: item.id,
      reviewerName: item.reviewer_name || item.reviewerName,
      rating: Number(item.rating),
      headline: item.headline,
      body: item.body,
      displayOrder: item.display_order || item.displayOrder || 0
    }))
    .sort((left, right) => left.displayOrder - right.displayOrder);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    priceInr: Number(product.price_inr ?? product.priceInr ?? 0),
    stockQuantity: Number(product.stock_quantity ?? product.stockQuantity ?? 0),
    rating: Number(product.rating ?? 0),
    reviewCount: Number(product.review_count ?? product.reviewCount ?? reviews.length),
    reviewSnippet: product.review_snippet || product.reviewSnippet || "",
    tagline: product.tagline || "",
    description: product.description || "",
    highlights: Array.isArray(product.highlights) ? product.highlights : [],
    badgeText: product.badge_text || product.badgeText || category?.name || "Handmade",
    isFeaturedHome: Boolean(product.is_featured_home ?? product.isFeaturedHome),
    featuredRank: product.featured_rank ?? product.featuredRank ?? null,
    displayOrder: product.display_order ?? product.displayOrder ?? 0,
    category,
    media,
    primaryImage: media.find((item) => item.isPrimary)?.url || media[0]?.url || "",
    reviews
  };
}

function normalizeSettings(settings) {
  const resolveSetting = (value, placeholders, fallback) => {
    if (!value || placeholders.includes(value)) {
      return fallback;
    }

    return value;
  };

  return {
    brandName: settings.brand_name || settings.brandName || defaultStoreSettings.brandName,
    brandSubline: settings.brand_subline || settings.brandSubline || defaultStoreSettings.brandSubline,
    supportEmail: settings.support_email || settings.supportEmail || defaultStoreSettings.supportEmail,
    supportPhone: resolveSetting(
      settings.support_phone || settings.supportPhone,
      ["+91 90000 00000"],
      defaultStoreSettings.supportPhone
    ),
    businessLocation: resolveSetting(
      settings.business_location || settings.businessLocation,
      ["Bengaluru, India", "Indiranagar, Bengaluru, India"],
      defaultStoreSettings.businessLocation
    ),
    supportWindow: settings.support_window || settings.supportWindow || defaultStoreSettings.supportWindow,
    instagramUrl: resolveSetting(
      settings.instagram_url || settings.instagramUrl,
      ["https://www.instagram.com/"],
      defaultStoreSettings.instagramUrl
    ),
    facebookUrl: resolveSetting(
      settings.facebook_url || settings.facebookUrl,
      ["https://www.facebook.com/"],
      defaultStoreSettings.facebookUrl
    ),
    heroEyebrow: settings.hero_eyebrow || settings.heroEyebrow || defaultStoreSettings.heroEyebrow,
    heroTitle: settings.hero_title || settings.heroTitle || defaultStoreSettings.heroTitle,
    heroDescription:
      settings.hero_description ||
      settings.heroDescription ||
      defaultStoreSettings.heroDescription,
    heroPrimaryCtaLabel:
      settings.hero_primary_cta_label ||
      settings.heroPrimaryCtaLabel ||
      defaultStoreSettings.heroPrimaryCtaLabel,
    heroPrimaryCtaHref:
      settings.hero_primary_cta_href ||
      settings.heroPrimaryCtaHref ||
      defaultStoreSettings.heroPrimaryCtaHref,
    heroSecondaryCtaLabel:
      settings.hero_secondary_cta_label ||
      settings.heroSecondaryCtaLabel ||
      defaultStoreSettings.heroSecondaryCtaLabel,
    heroSecondaryCtaHref:
      settings.hero_secondary_cta_href ||
      settings.heroSecondaryCtaHref ||
      defaultStoreSettings.heroSecondaryCtaHref,
    heroStats: settings.hero_stats || settings.heroStats || defaultStoreSettings.heroStats,
    showcaseEyebrow:
      settings.showcase_eyebrow ||
      settings.showcaseEyebrow ||
      defaultStoreSettings.showcaseEyebrow,
    showcaseTitle:
      settings.showcase_title ||
      settings.showcaseTitle ||
      defaultStoreSettings.showcaseTitle,
    showcaseDescription:
      settings.showcase_description ||
      settings.showcaseDescription ||
      defaultStoreSettings.showcaseDescription,
    showcaseVideoUrl:
      settings.showcase_video_url ||
      settings.showcaseVideoUrl ||
      defaultStoreSettings.showcaseVideoUrl,
    showcasePosterUrl:
      settings.showcase_poster_url ||
      settings.showcasePosterUrl ||
      defaultStoreSettings.showcasePosterUrl,
    aboutTitle: settings.about_title || settings.aboutTitle || defaultStoreSettings.aboutTitle,
    aboutIntro: settings.about_intro || settings.aboutIntro || defaultStoreSettings.aboutIntro,
    aboutStory: settings.about_story || settings.aboutStory || defaultStoreSettings.aboutStory,
    qualityPromise:
      settings.quality_promise ||
      settings.qualityPromise ||
      defaultStoreSettings.qualityPromise,
    customizeTitle:
      settings.customize_title ||
      settings.customizeTitle ||
      defaultStoreSettings.customizeTitle,
    customizeDescription:
      settings.customize_description ||
      settings.customizeDescription ||
      defaultStoreSettings.customizeDescription,
    contactTitle:
      settings.contact_title ||
      settings.contactTitle ||
      defaultStoreSettings.contactTitle,
    contactDescription:
      settings.contact_description ||
      settings.contactDescription ||
      defaultStoreSettings.contactDescription
  };
}

function normalizeStorefrontData(payload) {
  const categories = (payload.categories || []).map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    shortLabel: category.short_label || category.shortLabel,
    accentColor: category.accent_color || category.accentColor,
    tintColor: category.tint_color || category.tintColor
  }));

  const categoriesById = categories.reduce((accumulator, category) => {
    accumulator[category.id] = category;
    accumulator[category.slug] = category;
    return accumulator;
  }, {});

  const products = (payload.products || [])
    .map((product) => normalizeProduct(product, categoriesById))
    .sort((left, right) => left.displayOrder - right.displayOrder);

  return {
    settings: normalizeSettings(payload.settings),
    announcements: (payload.announcements || [])
      .map((item) => ({
        id: item.id,
        message: item.message,
        displayOrder: item.display_order || item.displayOrder || 0
      }))
      .sort((left, right) => left.displayOrder - right.displayOrder),
    categories,
    trustBadges: (payload.trustBadges || [])
      .map((item) => ({
        id: item.id,
        title: item.title,
        detail: item.detail,
        iconName: item.icon_name || item.iconName || "shield",
        displayOrder: item.display_order || item.displayOrder || 0
      }))
      .sort((left, right) => left.displayOrder - right.displayOrder),
    homepageReviews: (payload.homepageReviews || [])
      .map((item) => ({
        id: item.id,
        reviewerName: item.reviewer_name || item.reviewerName,
        rating: Number(item.rating),
        headline: item.headline,
        body: item.body,
        displayOrder: item.display_order || item.displayOrder || 0
      }))
      .sort((left, right) => left.displayOrder - right.displayOrder),
    products
  };
}

function humanizeSupabaseError(error, fallback) {
  if (!error) {
    return fallback;
  }

  if (error.code === "23505") {
    return "That entry already exists.";
  }

  return error.message || fallback;
}

export async function loadStorefrontData() {
  if (!hasSupabaseConfig || !supabase) {
    return {
      ok: false,
      data: null,
      source: "supabase",
      error: new Error("Supabase credentials are required to load the storefront.")
    };
  }

  try {
    const [
      settingsResult,
      announcementsResult,
      categoriesResult,
      trustBadgesResult,
      homepageReviewsResult,
      productsResult
    ] = await Promise.all([
      supabase.from("store_settings").select("*").limit(1).maybeSingle(),
      supabase.from("announcements").select("*").eq("is_active", true).order("display_order"),
      supabase.from("categories").select("*").eq("is_active", true).order("display_order"),
      supabase.from("trust_badges").select("*").eq("is_active", true).order("display_order"),
      supabase.from("reviews").select("*").eq("is_featured_home", true).order("display_order"),
      supabase
        .from("products")
        .select(`
          *,
          category:categories(*),
          media:product_media(*),
          reviews(*)
        `)
        .eq("is_active", true)
        .order("display_order")
    ]);

    const error =
      settingsResult.error ||
      announcementsResult.error ||
      categoriesResult.error ||
      trustBadgesResult.error ||
      homepageReviewsResult.error ||
      productsResult.error;

    if (error) {
      throw error;
    }

    if (!settingsResult.data) {
      throw new Error("Store settings are missing.");
    }

    if (!categoriesResult.data?.length || !productsResult.data?.length) {
      throw new Error("The storefront catalog is incomplete.");
    }

    return {
      ok: true,
      data: normalizeStorefrontData({
        settings: settingsResult.data,
        announcements: announcementsResult.data || [],
        categories: categoriesResult.data || [],
        trustBadges: trustBadgesResult.data || [],
        homepageReviews: homepageReviewsResult.data || [],
        products: productsResult.data || []
      }),
      source: "supabase",
      error: null
    };
  } catch (error) {
    return {
      ok: false,
      data: null,
      source: "supabase",
      error
    };
  }
}

function slugifyFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function submitCustomOrderRequest(payload) {
  if (!supabase) {
    return {
      ok: false,
      message: "Custom orders are not available right now. Please try again soon."
    };
  }

  let referenceStoragePath = null;

  if (payload.referenceFile) {
    const timestamp = Date.now();
    const cleanName = slugifyFileName(payload.referenceFile.name);
    referenceStoragePath = `custom-orders/${timestamp}-${cleanName}`;

    const { error: uploadError } = await supabase.storage
      .from("request-media")
      .upload(referenceStoragePath, payload.referenceFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      return {
        ok: false,
        message: humanizeSupabaseError(uploadError, "We could not upload the reference image.")
      };
    }
  }

  const { error } = await supabase.from("custom_order_requests").insert({
    name: payload.name,
    email: payload.email,
    product_type: payload.productType,
    customization_details: payload.details,
    reference_storage_path: referenceStoragePath
  });

  return {
    ok: !error,
    message: error
      ? humanizeSupabaseError(error, "We could not save your custom order request.")
      : "Your custom order request is in. We will review it and get back to you soon."
  };
}

export async function submitContactMessage(payload) {
  if (!supabase) {
    return {
      ok: false,
      message: "Messages are not available right now. Please try again soon."
    };
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: payload.name,
    email: payload.email,
    phone: payload.phone || null,
    message: payload.message
  });

  return {
    ok: !error,
    message: error
      ? humanizeSupabaseError(error, "We could not send your message right now.")
      : "Thanks for reaching out. We will get back to you soon."
  };
}
