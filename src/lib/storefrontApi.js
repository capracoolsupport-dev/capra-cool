import { mockStorefront } from "./mockData";
import { hasSupabaseConfig, supabase } from "./supabase";

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
  if (!settings) {
    return mockStorefront.settings;
  }

  return {
    brandName: settings.brand_name || settings.brandName || mockStorefront.settings.brandName,
    brandSubline: settings.brand_subline || settings.brandSubline || mockStorefront.settings.brandSubline,
    supportEmail: settings.support_email || settings.supportEmail || mockStorefront.settings.supportEmail,
    supportPhone: settings.support_phone || settings.supportPhone || mockStorefront.settings.supportPhone,
    businessLocation:
      settings.business_location ||
      settings.businessLocation ||
      mockStorefront.settings.businessLocation,
    supportWindow: settings.support_window || settings.supportWindow || mockStorefront.settings.supportWindow,
    instagramUrl: settings.instagram_url || settings.instagramUrl || mockStorefront.settings.instagramUrl,
    facebookUrl: settings.facebook_url || settings.facebookUrl || mockStorefront.settings.facebookUrl,
    heroEyebrow: settings.hero_eyebrow || settings.heroEyebrow || mockStorefront.settings.heroEyebrow,
    heroTitle: settings.hero_title || settings.heroTitle || mockStorefront.settings.heroTitle,
    heroDescription:
      settings.hero_description ||
      settings.heroDescription ||
      mockStorefront.settings.heroDescription,
    heroPrimaryCtaLabel:
      settings.hero_primary_cta_label ||
      settings.heroPrimaryCtaLabel ||
      mockStorefront.settings.heroPrimaryCtaLabel,
    heroPrimaryCtaHref:
      settings.hero_primary_cta_href ||
      settings.heroPrimaryCtaHref ||
      mockStorefront.settings.heroPrimaryCtaHref,
    heroSecondaryCtaLabel:
      settings.hero_secondary_cta_label ||
      settings.heroSecondaryCtaLabel ||
      mockStorefront.settings.heroSecondaryCtaLabel,
    heroSecondaryCtaHref:
      settings.hero_secondary_cta_href ||
      settings.heroSecondaryCtaHref ||
      mockStorefront.settings.heroSecondaryCtaHref,
    heroStats: settings.hero_stats || settings.heroStats || mockStorefront.settings.heroStats,
    showcaseEyebrow:
      settings.showcase_eyebrow ||
      settings.showcaseEyebrow ||
      mockStorefront.settings.showcaseEyebrow,
    showcaseTitle:
      settings.showcase_title ||
      settings.showcaseTitle ||
      mockStorefront.settings.showcaseTitle,
    showcaseDescription:
      settings.showcase_description ||
      settings.showcaseDescription ||
      mockStorefront.settings.showcaseDescription,
    showcaseVideoUrl:
      settings.showcase_video_url ||
      settings.showcaseVideoUrl ||
      mockStorefront.settings.showcaseVideoUrl,
    showcasePosterUrl:
      settings.showcase_poster_url ||
      settings.showcasePosterUrl ||
      mockStorefront.settings.showcasePosterUrl,
    aboutTitle: settings.about_title || settings.aboutTitle || mockStorefront.settings.aboutTitle,
    aboutIntro: settings.about_intro || settings.aboutIntro || mockStorefront.settings.aboutIntro,
    aboutStory: settings.about_story || settings.aboutStory || mockStorefront.settings.aboutStory,
    qualityPromise:
      settings.quality_promise ||
      settings.qualityPromise ||
      mockStorefront.settings.qualityPromise,
    customizeTitle:
      settings.customize_title ||
      settings.customizeTitle ||
      mockStorefront.settings.customizeTitle,
    customizeDescription:
      settings.customize_description ||
      settings.customizeDescription ||
      mockStorefront.settings.customizeDescription,
    contactTitle:
      settings.contact_title ||
      settings.contactTitle ||
      mockStorefront.settings.contactTitle,
    contactDescription:
      settings.contact_description ||
      settings.contactDescription ||
      mockStorefront.settings.contactDescription
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
      data: mockStorefront,
      source: "mock",
      error: null
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

    if (!categoriesResult.data?.length || !productsResult.data?.length) {
      return {
        data: mockStorefront,
        source: "mock",
        error: new Error("No storefront content was found yet. Add catalog data to finish the collection.")
      };
    }

    return {
      data: normalizeStorefrontData({
        settings: settingsResult.data || mockStorefront.settings,
        announcements: announcementsResult.data || mockStorefront.announcements,
        categories: categoriesResult.data || mockStorefront.categories,
        trustBadges: trustBadgesResult.data || mockStorefront.trustBadges,
        homepageReviews: homepageReviewsResult.data || mockStorefront.homepageReviews,
        products: productsResult.data || mockStorefront.products
      }),
      source: "supabase",
      error: null
    };
  } catch (error) {
    return {
      data: mockStorefront,
      source: "mock",
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
