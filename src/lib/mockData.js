const artTemplates = {
  scrunchies: (colors) => `
    <circle cx="160" cy="160" r="72" fill="none" stroke="${colors[1]}" stroke-width="32" />
    <circle cx="160" cy="160" r="38" fill="${colors[2]}" />
  `,
  "double-color-scrunchies": (colors) => `
    <circle cx="128" cy="168" r="60" fill="none" stroke="${colors[1]}" stroke-width="28" />
    <circle cx="196" cy="152" r="60" fill="none" stroke="${colors[0]}" stroke-width="28" />
  `,
  keychains: (colors) => `
    <circle cx="160" cy="112" r="34" fill="none" stroke="${colors[1]}" stroke-width="14" />
    <path d="M160 146 L196 210 Q160 252 124 210 Z" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="8" />
  `,
  flowers: (colors) => `
    <circle cx="160" cy="150" r="20" fill="${colors[1]}" />
    <circle cx="122" cy="150" r="30" fill="${colors[0]}" />
    <circle cx="198" cy="150" r="30" fill="${colors[0]}" />
    <circle cx="160" cy="112" r="30" fill="${colors[0]}" />
    <circle cx="160" cy="188" r="30" fill="${colors[0]}" />
    <path d="M160 214 L160 286" stroke="#5d8a61" stroke-width="10" stroke-linecap="round" />
  `,
  "hair-clips": (colors) => `
    <rect x="82" y="126" width="156" height="68" rx="34" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="10" />
    <rect x="116" y="144" width="88" height="32" rx="16" fill="${colors[2]}" />
  `,
  "hair-bands": (colors) => `
    <path d="M86 232 Q160 66 234 232" fill="none" stroke="${colors[1]}" stroke-width="22" stroke-linecap="round" />
    <path d="M110 228 Q160 116 210 228" fill="none" stroke="${colors[0]}" stroke-width="20" stroke-linecap="round" />
  `,
  "winter-clothes": (colors) => `
    <path d="M112 118 L88 156 L112 174 L124 136 L132 136 L132 236 L188 236 L188 136 L196 136 L208 174 L232 156 L208 118 L186 130 L134 130 Z" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="10" stroke-linejoin="round" />
    <path d="M132 166 L188 166" stroke="${colors[1]}" stroke-width="8" stroke-linecap="round" />
    <path d="M132 192 L188 192" stroke="${colors[1]}" stroke-width="8" stroke-linecap="round" />
  `,
  "gifting-products": (colors) => `
    <rect x="96" y="126" width="128" height="104" rx="12" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="10" />
    <path d="M160 126 L160 230" stroke="${colors[1]}" stroke-width="10" />
    <path d="M96 172 L224 172" stroke="${colors[1]}" stroke-width="10" />
    <path d="M160 108 C148 86 116 92 122 122 C140 124 150 120 160 108 Z" fill="${colors[2]}" stroke="${colors[1]}" stroke-width="6" />
    <path d="M160 108 C172 86 204 92 198 122 C180 124 170 120 160 108 Z" fill="${colors[2]}" stroke="${colors[1]}" stroke-width="6" />
  `,
  "crochet-bow": (colors) => `
    <path d="M160 166 C132 104 78 118 86 166 C90 192 116 202 142 188 Z" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="10" />
    <path d="M160 166 C188 104 242 118 234 166 C230 192 204 202 178 188 Z" fill="${colors[0]}" stroke="${colors[1]}" stroke-width="10" />
    <rect x="144" y="142" width="32" height="48" rx="12" fill="${colors[1]}" />
  `
};

function buildSvgDataUrl(name, palette, templateKey, variant = 0) {
  const template = artTemplates[templateKey] || artTemplates.scrunchies;
  const rotation = variant * 5 - 5;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" role="img" aria-label="${name}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette[2]}" />
          <stop offset="100%" stop-color="${palette[0]}" />
        </linearGradient>
      </defs>
      <rect width="320" height="320" rx="36" fill="url(#bg)" />
      <circle cx="72" cy="62" r="30" fill="${palette[2]}" opacity="0.7" />
      <circle cx="256" cy="252" r="42" fill="${palette[2]}" opacity="0.55" />
      <g transform="rotate(${rotation} 160 160)">
        ${template(palette)}
      </g>
      <text x="26" y="286" font-family="Trebuchet MS, sans-serif" font-size="18" fill="#3b2727">${name}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const categories = [
  { id: "women", slug: "women", name: "Women", shortLabel: "WM", accentColor: "#d96f71", tintColor: "#fae0db" },
  { id: "men", slug: "men", name: "Men", shortLabel: "MN", accentColor: "#457b9d", tintColor: "#dcecf6" },
  { id: "unisex", slug: "unisex", name: "Unisex", shortLabel: "UX", accentColor: "#58715f", tintColor: "#dce8dd" },
  { id: "kids", slug: "kids", name: "Kids", shortLabel: "KD", accentColor: "#f2a65a", tintColor: "#fde9d3" },
  { id: "gifting", slug: "gifting", name: "Gifting", shortLabel: "GF", accentColor: "#8a5a97", tintColor: "#ebdbef" }
];

const productSeeds = [
  {
    slug: "scrunchies",
    name: "Scrunchies",
    categorySlug: "women",
    price: 349,
    rating: 4.9,
    reviewCount: 128,
    reviewSnippet: "Soft on hair and beautifully stitched.",
    tagline: "Soft everyday crochet with a premium finish.",
    description: "A soft, stretchy crochet scrunchie designed for effortless daily styling. The yarn is comfortable on hair and gives a handcrafted texture that feels elevated.",
    highlights: ["Cotton blend yarn", "Gentle hold", "Gift-ready wrap"],
    palette: ["#f5d6d1", "#c96b70", "#fff4f1"],
    reviews: [
      { reviewerName: "Sana", rating: 5, headline: "Soft and polished", body: "Feels soft and does not tug at all." },
      { reviewerName: "Neha", rating: 4.8, headline: "Boutique finish", body: "Looks boutique and the blush tone is gorgeous." }
    ]
  },
  {
    slug: "double-color-scrunchies",
    name: "Double Color Scrunchies",
    categorySlug: "women",
    price: 429,
    rating: 4.8,
    reviewCount: 94,
    reviewSnippet: "Color pairing looks playful and premium.",
    tagline: "Two-tone texture for a fuller handcrafted look.",
    description: "These double color scrunchies bring contrast and depth into a simple daily accessory. The layered yarn styling makes the shape look fuller and more giftable.",
    highlights: ["Dual colorwork", "Soft elastic core", "Lightweight wear"],
    palette: ["#f6e5bd", "#c06c84", "#fff9eb"],
    reviews: [
      { reviewerName: "Krisha", rating: 4.8, headline: "Lovely contrast", body: "The contrast colors make it stand out immediately." },
      { reviewerName: "Juhi", rating: 5, headline: "Looks better in person", body: "Looks even better in person than on the card." }
    ]
  },
  {
    slug: "keychains",
    name: "Keychains",
    categorySlug: "unisex",
    price: 299,
    rating: 4.9,
    reviewCount: 156,
    reviewSnippet: "Perfect gifting add-on with handmade charm.",
    tagline: "Pocket-sized crochet details made to delight.",
    description: "Small but memorable crochet keychains that work beautifully as personal keepsakes, bag charms, and lightweight gifts for loved ones.",
    highlights: ["Giftable mini format", "Secure loop attachment", "Easy add-on item"],
    palette: ["#f3d9bf", "#8f5b34", "#fff7ee"],
    reviews: [
      { reviewerName: "Pooja", rating: 5, headline: "Sweet little gift", body: "Such a sweet little gift, beautifully finished." },
      { reviewerName: "Riya", rating: 5, headline: "Charming detail", body: "The handmade feel really comes through." }
    ]
  },
  {
    slug: "flowers",
    name: "Flowers",
    categorySlug: "gifting",
    price: 499,
    rating: 4.9,
    reviewCount: 112,
    reviewSnippet: "A forever bouquet with soft crochet texture.",
    tagline: "Handmade floral stems that stay lovely year-round.",
    description: "Crochet flowers designed as keepsakes for desks, celebrations, and thoughtful gifting. They bring warmth and color without fading over time.",
    highlights: ["Decor-ready", "Long-lasting keepsake", "Perfect for gifting"],
    palette: ["#f6c8d6", "#da627d", "#fff3f7"],
    reviews: [
      { reviewerName: "Mitali", rating: 5, headline: "Forever bouquet", body: "A beautiful alternative to fresh flowers." },
      { reviewerName: "Anvi", rating: 4.8, headline: "Detailed petals", body: "The petals feel detailed and premium." }
    ]
  },
  {
    slug: "hair-clips",
    name: "Hair Clips",
    categorySlug: "kids",
    price: 259,
    rating: 4.7,
    reviewCount: 84,
    reviewSnippet: "Sweet finish for kids and gifting bundles.",
    tagline: "Cute crochet accents for playful everyday styling.",
    description: "Crochet hair clips made to feel gentle, colorful, and charming. They are especially easy to include in gift boxes for birthdays and festive moments.",
    highlights: ["Lightweight clip base", "Kid-friendly styling", "Bright gift appeal"],
    palette: ["#f9ddb0", "#e28f41", "#fff6e8"],
    reviews: [
      { reviewerName: "Tara", rating: 4.8, headline: "Playful and neat", body: "My daughter loved the texture and colors." },
      { reviewerName: "Diya", rating: 4.7, headline: "Very neat stitching", body: "Very neat stitching for a small accessory." }
    ]
  },
  {
    slug: "hair-bands",
    name: "Hair Bands",
    categorySlug: "women",
    price: 389,
    rating: 4.8,
    reviewCount: 73,
    reviewSnippet: "Comfortable fit with visible handmade texture.",
    tagline: "Crochet headbands that feel polished and easy to wear.",
    description: "Designed to balance comfort with a boutique finish, these crochet hair bands bring soft structure and color to daily looks without feeling heavy.",
    highlights: ["Comfort-first fit", "Boutique styling", "Soft yarn texture"],
    palette: ["#e1d0f1", "#7e5b97", "#faf5ff"],
    reviews: [
      { reviewerName: "Arohi", rating: 4.8, headline: "Easy to wear", body: "Easy to wear and looks very polished." },
      { reviewerName: "Megha", rating: 4.9, headline: "Handcrafted texture", body: "The handcrafted texture stands out beautifully." }
    ]
  },
  {
    slug: "winter-clothes",
    name: "Winter Clothes",
    categorySlug: "men",
    price: 1199,
    rating: 4.9,
    reviewCount: 65,
    reviewSnippet: "Warm, textured, and ideal for cozy gifting.",
    tagline: "Handmade winter essentials with comfort at the center.",
    description: "A cozy crochet winter collection built for softness, layered warmth, and visual depth. These pieces feel personal, seasonal, and premium for gifting.",
    highlights: ["Warm layered yarn", "Seasonal gifting", "Statement handmade texture"],
    palette: ["#d7e4f2", "#496682", "#f6fbff"],
    reviews: [
      { reviewerName: "Harsh", rating: 5, headline: "Warm right away", body: "The weave looks rich and feels warm right away." },
      { reviewerName: "Kian", rating: 4.9, headline: "Beautiful texture", body: "Beautiful texture and neat construction." }
    ]
  },
  {
    slug: "gifting-products",
    name: "Gifting Products",
    categorySlug: "gifting",
    price: 649,
    rating: 5,
    reviewCount: 91,
    reviewSnippet: "Curated handmade sets ready to gift.",
    tagline: "Ready-made crochet gifting bundles with thoughtful details.",
    description: "Designed for birthdays, celebrations, and thank-you moments, these gifting products combine crochet charm with presentation that feels ready to delight.",
    highlights: ["Curated gift bundles", "Ready to present", "Premium handmade appeal"],
    palette: ["#f2d7df", "#9f546f", "#fff6f9"],
    reviews: [
      { reviewerName: "Lina", rating: 5, headline: "Solved gifting fast", body: "This solved gifting for me in one tap." },
      { reviewerName: "Vani", rating: 5, headline: "Thoughtful bundle", body: "The bundle looked thoughtful and premium." }
    ]
  },
  {
    slug: "crochet-bow",
    name: "Crochet Bow",
    categorySlug: "kids",
    price: 279,
    rating: 4.8,
    reviewCount: 77,
    reviewSnippet: "A cute finishing detail for styling or gifting.",
    tagline: "Soft sculpted bow work with handcrafted charm.",
    description: "A sweet crochet bow that adds warmth and personality to accessories, gifting sets, and playful styling moments. Lightweight and easy to love.",
    highlights: ["Soft sculpted form", "Great for gifting", "Playful premium styling"],
    palette: ["#f4c6d1", "#cb6380", "#fff4f7"],
    reviews: [
      { reviewerName: "Inaaya", rating: 4.8, headline: "Adorable look", body: "Looks adorable and holds shape really well." },
      { reviewerName: "Misha", rating: 4.9, headline: "Lovely finishing", body: "Sweet design and lovely finishing." }
    ]
  }
];

const settings = {
  brandName: "Trendy Spice Store",
  brandSubline: "trendyspicestore.com",
  supportEmail: "trendyspicestore@gmail.com",
  supportPhone: "+91 90000 00000",
  businessLocation: "Indiranagar, Bengaluru, India",
  supportWindow: "Monday to Saturday, 10 AM to 7 PM",
  instagramUrl: "https://www.instagram.com/",
  facebookUrl: "https://www.facebook.com/",
  heroEyebrow: "Premium handmade crochet",
  heroTitle: "Handmade crochet that feels personal, polished, and beautifully gift-ready.",
  heroDescription: "Discover premium handmade crochet pieces with soft texture, curated color stories, and a shopping experience that feels calm, clear, and gift-ready.",
  heroPrimaryCtaLabel: "Explore Collection",
  heroPrimaryCtaHref: "/#featured",
  heroSecondaryCtaLabel: "Create Custom Order",
  heroSecondaryCtaHref: "/customize",
  heroStats: [
    { value: "100%", label: "handmade finish" },
    { value: "2-3 taps", label: "to product discovery" },
    { value: "4.9/5", label: "average product love" }
  ],
  showcaseEyebrow: "Showcase",
  showcaseTitle: "Texture, color, and craftsmanship made visible on every screen.",
  showcaseDescription: "A warm visual moment to highlight texture, color, and the handcrafted finish behind each piece.",
  showcaseVideoUrl: "",
  showcasePosterUrl: "",
  aboutTitle: "Handmade crochet made to feel slow, warm, and intentionally premium.",
  aboutIntro: "Trendy Spice Store began with the idea that crochet should feel giftable, tactile, and easy to explore without losing the story behind the product.",
  aboutStory: "Every collection is made in small runs so the colors stay curated, the texture stays soft, and each piece still carries the warmth of handmade work.",
  qualityPromise: "Products are checked before dispatch, packed carefully, and supported with responsive customer service for custom orders and gifting guidance.",
  customizeTitle: "Design a custom crochet piece that feels personal from the start.",
  customizeDescription: "Share your colors, mood, occasion, and reference image so we can shape a piece that feels truly personal.",
  contactTitle: "Need help choosing a handmade piece or placing an order?",
  contactDescription: "Reach out for sizing help, gifting suggestions, order updates, or custom design questions."
};

const announcements = [
  { id: "a1", message: "Free Shipping on Selected Orders", displayOrder: 1 },
  { id: "a2", message: "Use Code HANDMADE10 for Discount", displayOrder: 2 },
  { id: "a3", message: "100% Handmade Crochet Products", displayOrder: 3 },
  { id: "a4", message: "Perfect Gifts for Loved Ones", displayOrder: 4 }
];

const trustBadges = [
  { id: "t1", title: "Secure Payment", detail: "Protected checkout experience with clear customer confidence.", iconName: "shield", displayOrder: 1 },
  { id: "t2", title: "Handmade Product", detail: "Designed and finished by hand for a more personal feel.", iconName: "yarn", displayOrder: 2 },
  { id: "t3", title: "Quality Checked", detail: "Every order is reviewed before packing and dispatch.", iconName: "check", displayOrder: 3 },
  { id: "t4", title: "Fast Support", detail: "Quick responses for gifting, custom orders, and care questions.", iconName: "support", displayOrder: 4 }
];

const homepageReviews = [
  { id: "hr1", reviewerName: "Aanya", rating: 5, headline: "Beautiful finishing", body: "The yarn feels soft, the colors look premium, and the packaging made it feel like a thoughtful little gift.", displayOrder: 1 },
  { id: "hr2", reviewerName: "Rohit", rating: 5, headline: "Easy to browse", body: "I found a gift in minutes. The categories are clear and the product cards gave me enough confidence to order quickly.", displayOrder: 2 },
  { id: "hr3", reviewerName: "Mira", rating: 4.9, headline: "Custom order was smooth", body: "I shared a reference image and the team replied with helpful suggestions. The final crochet piece felt truly personal.", displayOrder: 3 }
];

const products = productSeeds.map((product, index) => {
  const category = categories.find((item) => item.slug === product.categorySlug);
  const media = [0, 1, 2].map((variant) => ({
    id: `${product.slug}-${variant + 1}`,
    kind: "image",
    url: buildSvgDataUrl(product.name, product.palette, product.slug, variant),
    altText: `${product.name} view ${variant + 1}`,
    isPrimary: variant === 0,
    sortOrder: variant + 1
  }));

  return {
    id: product.slug,
    slug: product.slug,
    name: product.name,
    priceInr: product.price,
    stockQuantity: Math.max(2, 18 - index * 2),
    rating: product.rating,
    reviewCount: product.reviewCount,
    reviewSnippet: product.reviewSnippet,
    tagline: product.tagline,
    description: product.description,
    highlights: product.highlights,
    badgeText: category?.name || "Handmade",
    isFeaturedHome: index < 4,
    featuredRank: index < 4 ? index + 1 : null,
    displayOrder: index + 1,
    category,
    media,
    primaryImage: media[0].url,
    reviews: product.reviews.map((review, reviewIndex) => ({
      id: `${product.slug}-review-${reviewIndex + 1}`,
      ...review,
      displayOrder: reviewIndex + 1
    }))
  };
});

export const mockStorefront = {
  settings,
  announcements,
  categories,
  trustBadges,
  homepageReviews,
  products
};
