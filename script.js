/**
 * CAPRA COOL — Official Visual Storefront Script
 * Brand: CAPRA COOL | Crest: Alpine Mountain Ibex | Tagline: WEAR HIGHER.
 * IIT Mandi, Himalayas | 31.7086° N, 76.9419° E
 */

// --- AUTHENTIC PRODUCT CATALOG (CAPRA BRAND BOARD + IIT MANDI ORDER FORM) ---
let PRODUCTS = [
  {
    id: "summit-tee",
    name: "Summit Tee",
    category: "tee",
    price: 799,
    image: "assets/product_summit_tee.jpg",
    color: "Ivory",
    fabric: "Premium 180 GSM Cotton",
    gsm: "180 GSM",
    fit: "Regular Everyday Explorer Fit",
    sku: "CC-TEE-001",
    badge: "BESTSELLER",
    rating: 4.8,
    reviews: 120,
    colors: ["#ede7d8", "#191a17", "#444d3d", "#505459"],
    desc: "A minimal tee for everyday explorers. Crafted with premium 180 GSM combed cotton for all-day breathability and comfort. Features the signature Capra Cool Mountain Ridge print.",
    care: "Machine wash cold with like colors. Line dry in shade. Warm iron.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "38-40\"", length: "27\"", shoulder: "18.5\"" },
      M: { chest: "40-42\"", length: "28\"", shoulder: "19.5\"" },
      L: { chest: "42-44\"", length: "29\"", shoulder: "20.5\"" },
      XL: { chest: "44-46\"", length: "30\"", shoulder: "21.5\"" },
      XXL: { chest: "46-48\"", length: "31\"", shoulder: "22.5\"" }
    }
  },
  {
    id: "alpine-hoodie",
    name: "Alpine Hoodie",
    category: "hoodie",
    price: 1499,
    image: "assets/product_alpine_hoodie.jpg",
    color: "Olive Drab",
    fabric: "380 GSM Brushed Cotton Fleece",
    gsm: "380 GSM",
    fit: "Structured Athletic Fit",
    sku: "CC-HD-001",
    badge: "SIGNATURE IBEX",
    rating: 4.9,
    reviews: 86,
    colors: ["#191a17", "#3f4a39", "#989386"],
    desc: "Built for higher days and chilly mountain morning roads. Premium brushed fleece with the iconic Capra Alpine Ibex emblem printed cleanly on the back.",
    care: "Gentle machine cycle. Hang dry in shade. Do not iron directly on emblem.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "42-44\"", length: "27\"", shoulder: "20\"" },
      M: { chest: "44-46\"", length: "28\"", shoulder: "21\"" },
      L: { chest: "46-48\"", length: "29\"", shoulder: "22\"" },
      XL: { chest: "48-50\"", length: "30\"", shoulder: "23\"" },
      XXL: { chest: "50-52\"", length: "31\"", shoulder: "24\"" }
    }
  },
  {
    id: "trail-tracksuit",
    name: "Trail Tracksuit",
    category: "track",
    price: 1999,
    image: "assets/product_trail_tracksuit.jpg",
    color: "Deep Olive",
    fabric: "Technical Double-Knit Poly-Cotton",
    gsm: "340 GSM",
    fit: "2-Piece Outerwear Set",
    sku: "CC-TRK-001",
    badge: "COMPLETE SUIT",
    rating: 4.7,
    reviews: 54,
    colors: ["#3d4937", "#1c1c1a"],
    desc: "The complete mountain uniform. Includes our mock-neck full-zip athletic jacket and matching tapered trackpants with the signature Capra mountain goat insignia.",
    care: "Machine wash cold. Fasten zips before washing. Air dry.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "Chest 40\" / Waist 30\"", length: "Top 27\" / Pants 39\"", shoulder: "Raglan" },
      M: { chest: "Chest 42\" / Waist 32\"", length: "Top 28\" / Pants 40\"", shoulder: "Raglan" },
      L: { chest: "Chest 44\" / Waist 34\"", length: "Top 29\" / Pants 41\"", shoulder: "Raglan" },
      XL: { chest: "Chest 46\" / Waist 36\"", length: "Top 30\" / Pants 42\"", shoulder: "Raglan" },
      XXL: { chest: "Chest 48\" / Waist 38\"", length: "Top 31\" / Pants 43\"", shoulder: "Raglan" }
    }
  },
  {
    id: "classic-tee",
    name: "Capra Classic Tee",
    category: "tee",
    price: 799,
    image: "assets/product_classic_tee.jpg",
    color: "Jet Black",
    fabric: "180 GSM Heavy Combed Cotton",
    gsm: "180 GSM",
    fit: "Relaxed Boxy Streetwear Cut",
    sku: "CC-TEE-002",
    badge: "CORE ICON",
    rating: 4.6,
    reviews: 78,
    colors: ["#191a17", "#ede7d8", "#444d3d"],
    desc: "A bold essential featuring the original CAPRA COOL chest typographical wordmark. Dense long-staple cotton engineered to resist collar stretching over years of repeat wear.",
    care: "Machine wash cold inside-out. Do not bleach. Cool iron.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "38-40\"", length: "27\"", shoulder: "18.5\"" },
      M: { chest: "40-42\"", length: "28\"", shoulder: "19.5\"" },
      L: { chest: "42-44\"", length: "29\"", shoulder: "20.5\"" },
      XL: { chest: "44-46\"", length: "30\"", shoulder: "21.5\"" },
      XXL: { chest: "46-48\"", length: "31\"", shoulder: "22.5\"" }
    }
  },
  {
    id: "horizon-hoodie",
    name: "Horizon Hoodie",
    category: "hoodie",
    price: 1499,
    image: "assets/product_horizon_hoodie.jpg",
    color: "Desert Cream",
    fabric: "380 GSM Heavy Fleece",
    gsm: "380 GSM",
    fit: "Structured Drop-Shoulder",
    sku: "CC-HD-002",
    badge: "MOUNTAIN ART",
    rating: 4.8,
    reviews: 91,
    colors: ["#d8d3c5", "#191a17", "#3f4a39"],
    desc: "Heavyweight brushed fleece featuring the scenic Himalayan Peaks backprint and CAPRA COOL graphic. Built for warmth on high Himalayan treks and urban transits.",
    care: "Cold gentle wash. Line dry in shade. Do not tumble dry.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "42-44\"", length: "27\"", shoulder: "20\"" },
      M: { chest: "44-46\"", length: "28\"", shoulder: "21\"" },
      L: { chest: "46-48\"", length: "29\"", shoulder: "22\"" },
      XL: { chest: "48-50\"", length: "30\"", shoulder: "23\"" },
      XXL: { chest: "50-52\"", length: "31\"", shoulder: "24\"" }
    }
  },
  {
    id: "peak-tracksuit",
    name: "Peak Tracksuit",
    category: "track",
    price: 1999,
    image: "assets/product_peak_tracksuit.jpg",
    color: "Basalt Black",
    fabric: "Technical Double-Knit Jersey",
    gsm: "340 GSM",
    fit: "Tapered Performance Cut",
    sku: "CC-TRK-002",
    badge: "UTILITY",
    rating: 4.7,
    reviews: 62,
    colors: ["#191a17", "#394134"],
    desc: "Technical tapered athletic suit with white piping, elasticated waistband, drawstring fastening, deep zippered utility pockets, and the white Capra mountain goat crest.",
    care: "Wash with like colors. Do not iron over logo. Low tumble dry.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    chart: {
      S: { chest: "Waist 28-30\"", length: "39\"", shoulder: "Thigh 23\"" },
      M: { chest: "Waist 31-33\"", length: "40\"", shoulder: "Thigh 24\"" },
      L: { chest: "Waist 34-36\"", length: "41\"", shoulder: "Thigh 25\"" },
      XL: { chest: "Waist 37-39\"", length: "42\"", shoulder: "Thigh 26\"" },
      XXL: { chest: "Waist 40-42\"", length: "43\"", shoulder: "Thigh 27\"" }
    }
  }
];

const IIT_MANDI_PRODUCTS = [
  {
    id: "iit-black-tshirt",
    name: "Black IIT T-Shirt",
    category: "tee",
    price: 469,
    image: "assets/iit-black-tshirt.png",
    color: "Black",
    fabric: "100% Pure Cotton",
    gsm: "230 GSM",
    fit: "Unisex Campus Fit",
    sku: "CC-IIT-TEE-001",
    badge: "IIT MANDI",
    colors: ["#171717"],
    desc: "A breathable 230 GSM pure-cotton black T-shirt from the IIT Mandi merchandise collection.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-gray-tshirt",
    name: "Gray IIT T-Shirt",
    category: "tee",
    price: 469,
    image: "assets/iit-gray-tshirt.png",
    color: "Gray",
    fabric: "100% Pure Cotton",
    gsm: "230 GSM",
    fit: "Unisex Campus Fit",
    sku: "CC-IIT-TEE-002",
    badge: "IIT MANDI",
    colors: ["#777777"],
    desc: "A breathable 230 GSM pure-cotton gray T-shirt from the IIT Mandi merchandise collection.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-maroon-tshirt",
    name: "Maroon IIT T-Shirt",
    category: "tee",
    price: 469,
    image: "assets/iit-maroon-tshirt.png",
    color: "Maroon",
    fabric: "100% Pure Cotton",
    gsm: "230 GSM",
    fit: "Unisex Campus Fit",
    sku: "CC-IIT-TEE-003",
    badge: "IIT MANDI",
    colors: ["#6f1d2b"],
    desc: "A breathable 230 GSM pure-cotton maroon T-shirt from the IIT Mandi merchandise collection.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-ith-black-tshirt",
    name: "All Black ITH T-Shirt",
    category: "tee",
    price: 469,
    image: "assets/iit-ith-black-tshirt.png",
    color: "All Black",
    fabric: "100% Pure Cotton",
    gsm: "230 GSM",
    fit: "Unisex Campus Fit",
    sku: "CC-IIT-TEE-004",
    badge: "ITH",
    colors: ["#111111"],
    desc: "An all-black 230 GSM pure-cotton T-shirt featuring the ITH design.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-mandi-black-tshirt",
    name: "All Black IIT Mandi T-Shirt",
    category: "tee",
    price: 469,
    image: "assets/iit-mandi-black-tshirt.png",
    color: "All Black",
    fabric: "100% Pure Cotton",
    gsm: "230 GSM",
    fit: "Unisex Campus Fit",
    sku: "CC-IIT-TEE-005",
    badge: "IIT MANDI",
    colors: ["#111111"],
    desc: "An all-black 230 GSM pure-cotton T-shirt featuring the IIT Mandi design.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-iiith-black-tshirt",
    name: "All Black IIITH T-Shirt",
    category: "tee",
    price: 469,
    image: "assets/iit-iiith-black-tshirt.png",
    color: "All Black",
    fabric: "100% Pure Cotton",
    gsm: "230 GSM",
    fit: "Unisex Campus Fit",
    sku: "CC-IIT-TEE-006",
    badge: "IIITH",
    colors: ["#111111"],
    desc: "An all-black 230 GSM pure-cotton T-shirt featuring the IIITH design.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-acid-wash-tshirt",
    name: "ITH Acid Wash T-Shirt",
    category: "tee",
    price: 649,
    image: "assets/iit-acid-wash-tshirt.png",
    color: "Acid Wash Black",
    fabric: "100% Pure Cotton",
    gsm: "230 GSM",
    fit: "Unisex Campus Fit",
    sku: "CC-IIT-TEE-007",
    badge: "ACID WASH",
    colors: ["#3e3e3e", "#777777"],
    desc: "A 230 GSM pure-cotton acid-wash T-shirt featuring the ITH design.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-iih-classic-hoodie",
    name: "IIH Classic Black Hoodie",
    category: "hoodie",
    price: 969,
    image: "assets/iit-iih-classic-hoodie.png",
    color: "Black",
    fabric: "100% Pure Cotton",
    gsm: "400 GSM",
    fit: "Unisex Hoodie Fit",
    sku: "CC-IIT-HD-001",
    badge: "IIH CLASSIC",
    colors: ["#111111"],
    desc: "The classic IIH black hoodie in heavyweight 400 GSM pure cotton.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-name-hoodie",
    name: "IIT Name Black Hoodie",
    category: "hoodie",
    price: 969,
    image: "assets/iit-name-hoodie.png",
    color: "Black",
    fabric: "100% Pure Cotton",
    gsm: "400 GSM",
    fit: "Unisex Hoodie Fit",
    sku: "CC-IIT-HD-002",
    badge: "CUSTOMIZABLE",
    colors: ["#111111"],
    desc: "A heavyweight IIT black hoodie with optional name or department printing available for an additional charge.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-iih-new-hoodie",
    name: "IIH New Black Hoodie",
    category: "hoodie",
    price: 969,
    image: "assets/iit-iih-new-hoodie.png",
    color: "Black",
    fabric: "100% Pure Cotton",
    gsm: "400 GSM",
    fit: "Unisex Hoodie Fit",
    sku: "CC-IIT-HD-003",
    badge: "NEW DESIGN",
    colors: ["#111111"],
    desc: "The new IIH black hoodie design in heavyweight 400 GSM pure cotton.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-iih-zipper",
    name: "IIH New Black Zipper",
    category: "hoodie",
    price: 1059,
    image: "assets/iit-iih-zipper.png",
    color: "Black",
    fabric: "100% Pure Cotton",
    gsm: "400 GSM",
    fit: "Unisex Full-Zip Fit",
    sku: "CC-IIT-HD-004",
    badge: "FULL ZIP",
    colors: ["#111111"],
    desc: "A heavyweight full-zip black layer featuring the new IIH design.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "iit-acid-wash-hoodie",
    name: "IIH Acid Wash Hoodie",
    category: "hoodie",
    price: 1150,
    image: "assets/iit-acid-wash-hoodie.png",
    color: "Acid Wash Black",
    fabric: "100% Pure Cotton",
    gsm: "400 GSM",
    fit: "Unisex Hoodie Fit",
    sku: "CC-IIT-HD-005",
    badge: "ACID WASH",
    colors: ["#343434", "#777777"],
    desc: "A heavyweight 400 GSM acid-wash hoodie featuring the new IIH design.",
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"]
  },
  {
    id: "handmade-muffler",
    name: "Handmade Muffler",
    category: "accessory",
    price: 460,
    image: "assets/handmade-muffler.jpg",
    color: "Custom Colour",
    fabric: "Handmade Textile",
    gsm: "HANDMADE",
    fit: "One Size",
    sku: "CC-ACC-001",
    badge: "ALL COLOURS",
    colors: ["#8c2633", "#384c72", "#c58b37"],
    desc: "A handmade winter muffler available in multiple colours.",
    sizes: ["One Size"]
  },
  {
    id: "handmade-winter-cap",
    name: "Handmade Winter Cap",
    category: "accessory",
    price: 210,
    image: "assets/handmade-winter-cap.jpg",
    color: "Custom Colour",
    fabric: "Handmade Textile",
    gsm: "HANDMADE",
    fit: "One Size",
    sku: "CC-ACC-002",
    badge: "ALL COLOURS",
    colors: ["#252525", "#7a2636", "#385b48"],
    desc: "A handmade winter cap available in multiple colours.",
    sizes: ["One Size"]
  },
  {
    id: "sunflower-keychain",
    name: "Sunflower Keychain",
    category: "accessory",
    price: 99,
    image: "assets/sunflower-keychain.jpg",
    color: "Yellow",
    fabric: "Handmade Crochet",
    gsm: "HANDMADE",
    fit: "One Size",
    sku: "CC-ACC-003",
    badge: "HANDMADE",
    colors: ["#e3b83c", "#6f4a2c"],
    desc: "A handmade sunflower keychain with a soft crochet finish.",
    sizes: ["One Size"]
  },
  {
    id: "spiderman-keychain",
    name: "Spider-Man Keychain",
    category: "accessory",
    price: 299,
    image: "assets/spiderman-keychain.jpg",
    color: "Red and Blue",
    fabric: "Handmade Crochet",
    gsm: "HANDMADE",
    fit: "One Size",
    sku: "CC-ACC-004",
    badge: "HANDMADE",
    colors: ["#b4202a", "#254d87"],
    desc: "A handmade Spider-Man-inspired crochet keychain.",
    sizes: ["One Size"]
  },
  {
    id: "handmade-octopus",
    name: "Handmade Octopus",
    category: "accessory",
    price: 399,
    image: "assets/handmade-octopus.jpg",
    color: "As Shown",
    fabric: "Handmade Crochet",
    gsm: "HANDMADE",
    fit: "One Size",
    sku: "CC-ACC-005",
    badge: "HANDMADE",
    colors: ["#b8567c", "#6b4f90"],
    desc: "A soft handmade crochet octopus.",
    sizes: ["One Size"]
  },
  {
    id: "handmade-krishna",
    name: "Handmade Krishna",
    category: "accessory",
    price: 1199,
    image: "assets/handmade-krishna.jpg",
    color: "As Shown",
    fabric: "Handmade Crochet",
    gsm: "HANDMADE",
    fit: "One Size",
    sku: "CC-ACC-006",
    badge: "HANDMADE",
    colors: ["#2c7398", "#e1b847"],
    desc: "A detailed handmade crochet Krishna figure.",
    sizes: ["One Size"]
  },
  {
    id: "handmade-charms",
    name: "Handmade Charms",
    category: "accessory",
    price: 99,
    image: "assets/handmade-charms.jpg",
    color: "Assorted",
    fabric: "Handmade Crochet",
    gsm: "HANDMADE",
    fit: "One Size",
    sku: "CC-ACC-007",
    badge: "HANDMADE",
    colors: ["#d9a83f", "#4d826d", "#aa4b55"],
    desc: "Small handmade crochet charms in assorted designs and colours.",
    sizes: ["One Size"]
  }
].map(product => ({
  rating: 4.8,
  reviews: 0,
  care: product.category === "accessory"
    ? "Spot clean gently and allow to air dry."
    : "Machine wash cold inside-out. Do not iron directly on the print.",
  imageFit: product.category === "accessory" ? "cover" : "contain",
  chart: {},
  ...product
}));

const REFERENCE_TEE_PRICE = 469;
const TARGET_TEE_MRP = 999;
const PRICE_MARKUP_MULTIPLIER = TARGET_TEE_MRP / REFERENCE_TEE_PRICE;
const SALE_DISCOUNT_PERCENT = 40;

const PRODUCT_GALLERIES = {
  "summit-tee": ["assets/product_summit_tee.jpg", "assets/product_summit_tee_portrait.jpg", "assets/pdp_summit_model.png"],
  "alpine-hoodie": ["assets/product_alpine_hoodie.jpg", "assets/crop_alpine_3x4.jpg", "assets/model_prod2_alpine.png"],
  "trail-tracksuit": ["assets/product_trail_tracksuit.jpg", "assets/crop_trail_3x4.jpg", "assets/model_prod3_trail.png"],
  "classic-tee": ["assets/product_classic_tee.jpg", "assets/sharp_product_classic_tee.jpg", "assets/model_prod4_classic.png"],
  "horizon-hoodie": ["assets/product_horizon_hoodie.jpg", "assets/sharp_product_horizon_hoodie.jpg", "assets/model_prod5_horizon.png"],
  "peak-tracksuit": ["assets/product_peak_tracksuit.jpg", "assets/sharp_product_peak_tracksuit.jpg", "assets/model_prod6_peak.png"]
};

const CATEGORY_NOTES = {
  tee: {
    edition: "EVERYDAY COTTON STUDY",
    material: "Combed cotton selected for a smooth hand feel and dependable breathability.",
    construction: "Reinforced neck rib and shoulder seams help the silhouette hold its shape."
  },
  hoodie: {
    edition: "HEAVYWEIGHT FLEECE STUDY",
    material: "Brushed fleece balances substantial warmth with a soft interior finish.",
    construction: "Structured shoulders, reinforced rib, and clean twin-needle finishing."
  },
  track: {
    edition: "TECHNICAL MOVEMENT STUDY",
    material: "Dense double-knit fabric gives stretch, recovery, and a clean technical drape.",
    construction: "Tapered patterning and reinforced high-movement seams support daily wear."
  },
  accessory: {
    edition: "SMALL OBJECTS EDIT",
    material: "Selected in small batches for tactile detail and everyday utility.",
    construction: "Each piece is inspected and packed by hand before dispatch."
  }
};

const STANDARD_SIZE_CHARTS = {
  tee: {
    S: { chest: '38-40"', length: '27"', shoulder: '18.5"' },
    M: { chest: '40-42"', length: '28"', shoulder: '19.5"' },
    L: { chest: '42-44"', length: '29"', shoulder: '20.5"' },
    XL: { chest: '44-46"', length: '30"', shoulder: '21.5"' },
    XXL: { chest: '46-48"', length: '31"', shoulder: '22.5"' },
    XXXL: { chest: '48-50"', length: '32"', shoulder: '23.5"' }
  },
  hoodie: {
    S: { chest: '42-44"', length: '27"', shoulder: '20"' },
    M: { chest: '44-46"', length: '28"', shoulder: '21"' },
    L: { chest: '46-48"', length: '29"', shoulder: '22"' },
    XL: { chest: '48-50"', length: '30"', shoulder: '23"' },
    XXL: { chest: '50-52"', length: '31"', shoulder: '24"' },
    XXXL: { chest: '52-54"', length: '32"', shoulder: '25"' }
  },
  track: {
    S: { chest: 'Chest 40" / Waist 30"', length: 'Top 27" / Pants 39"', shoulder: "Raglan" },
    M: { chest: 'Chest 42" / Waist 32"', length: 'Top 28" / Pants 40"', shoulder: "Raglan" },
    L: { chest: 'Chest 44" / Waist 34"', length: 'Top 29" / Pants 41"', shoulder: "Raglan" },
    XL: { chest: 'Chest 46" / Waist 36"', length: 'Top 30" / Pants 42"', shoulder: "Raglan" },
    XXL: { chest: 'Chest 48" / Waist 38"', length: 'Top 31" / Pants 43"', shoulder: "Raglan" },
    XXXL: { chest: 'Chest 50" / Waist 40"', length: 'Top 32" / Pants 44"', shoulder: "Raglan" }
  },
  accessory: {
    "One Size": { chest: "Universal fit", length: "Varies by design", shoulder: "Not applicable" }
  }
};

function applySalePricing(product) {
  const basePrice = Number(product.basePrice ?? product.price) || 0;
  const compareAtPrice = Math.round(basePrice * PRICE_MARKUP_MULTIPLIER);
  const price = Math.round(compareAtPrice * (1 - SALE_DISCOUNT_PERCENT / 100));
  const chart = Object.keys(product.chart || {}).length > 0
    ? product.chart
    : STANDARD_SIZE_CHARTS[product.category] || STANDARD_SIZE_CHARTS.accessory;

  const notes = CATEGORY_NOTES[product.category] || CATEGORY_NOTES.accessory;
  const categoryGallery = product.category === "tee"
    ? "assets/collection_tees.jpg"
    : product.category === "hoodie"
      ? "assets/collection_hoodies.jpg"
      : product.category === "track"
        ? "assets/collection_tracksuits.jpg"
        : product.image;

  return {
    ...product,
    chart,
    basePrice,
    compareAtPrice,
    price,
    discountPercent: SALE_DISCOUNT_PERCENT,
    edition: product.edition || notes.edition,
    materialNote: product.materialNote || notes.material,
    constructionNote: product.constructionNote || notes.construction,
    gallery: product.gallery || PRODUCT_GALLERIES[product.id] || [...new Set([product.image, categoryGallery])]
  };
}

PRODUCTS = [...PRODUCTS, ...IIT_MANDI_PRODUCTS].map(applySalePricing);
const LOCAL_PRODUCTS = [...PRODUCTS];

// --- STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem("capraCoolCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("capraCoolWishlist") || "[]");
let selectedProduct = null;
let selectedSize = null;
let activeCategory = "all";
let activeSort = "featured";

// Global Store Configuration
const CONFIG = {
  FREE_SHIPPING_THRESHOLD: 999, // As shown on brand board: Free Shipping (₹999+)
  SHIPPING_FEE: 99,
  WHATSAPP_NUMBER: "",
  STORE_EMAIL: "care@capracool.com",
  SUPABASE_URL: (typeof import.meta !== "undefined" && import.meta.env && (import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL)) || "https://qhaheskahldwcvggrvbu.supabase.co",
  SUPABASE_KEY: (typeof import.meta !== "undefined" && import.meta.env && (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) || "sb_publishable_kxaAQiApVfqqNI4mbR8tTw_AanAVrci"
};

// Utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);
const formatMoney = num => "₹" + Number(num).toLocaleString("en-IN");
const salePriceMarkup = (product, showTaxNote = false) => {
  const currentPrice = Number(product.price) || 0;
  const compareAtPrice = Number(product.compareAtPrice) || currentPrice;
  const discountPercent = Number(product.discountPercent) || SALE_DISCOUNT_PERCENT;

  return `
    <span class="sale-pricing">
      <span class="sale-price-line">
        <strong class="sale-price-current">${formatMoney(currentPrice)}</strong>
        <del class="sale-price-mrp">${formatMoney(compareAtPrice)}</del>
      </span>
      ${showTaxNote ? `<span class="sale-discount">Launch edit · ${discountPercent}% below MRP</span>` : ''}
      ${showTaxNote ? '<small class="sale-tax-note">Inclusive of all taxes</small>' : ''}
    </span>
  `;
};

function sizeChartMarkup(product) {
  const chartEntries = Object.entries(product.chart || {});
  if (chartEntries.length === 0) return "";

  const isAccessory = product.category === "accessory";
  const heading = isAccessory ? "Size & fit" : "Size chart · Measurements in inches";
  const headers = isAccessory
    ? ["Option", "Fit", "Dimensions", "Notes"]
    : ["Size", "Chest/Waist", "Length", "Shoulder"];
  const rows = chartEntries.map(([size, measurements]) => `
    <tr>
      <td><strong>${size}</strong></td>
      <td>${measurements.chest}</td>
      <td>${measurements.length}</td>
      <td>${measurements.shoulder}</td>
    </tr>
  `).join("");

  return `
    <div class="size-chart-title">${heading}</div>
    <div class="size-table-wrap">
      <table class="size-table">
        <thead><tr>${headers.map(header => `<th>${header}</th>`).join("")}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function syncCartPricing() {
  cart = cart.map(item => {
    const product = PRODUCTS.find(candidate => candidate.id === item.id);
    if (!product) return item;
    return {
      ...item,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      discountPercent: product.discountPercent
    };
  });
  localStorage.setItem("capraCoolCart", JSON.stringify(cart));
}

syncCartPricing();

// --- SUPABASE DATA SYNC ---
async function saveOrderToSupabase(orderData) {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_KEY) return;
  try {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/customer_orders`, {
      method: "POST",
      headers: {
        "apikey": CONFIG.SUPABASE_KEY,
        "Authorization": `Bearer ${CONFIG.SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(orderData)
    });
    if (res.ok) {
      console.log("Order successfully saved to Supabase:", orderData.order_number);
    } else {
      console.warn("Supabase order sync response:", res.status);
    }
  } catch (err) {
    console.warn("Supabase order sync error (order saved locally):", err);
  }
}

async function loadProductsFromSupabase() {
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_KEY) return;
  try {
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/products?select=*&is_active=eq.true&order=display_order.asc`, {
      headers: {
        "apikey": CONFIG.SUPABASE_KEY,
        "Authorization": `Bearer ${CONFIG.SUPABASE_KEY}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const remoteProducts = data.map(item => applySalePricing({
          id: item.id,
          name: item.name,
          category: item.category,
          price: Number(item.price),
          image: item.image,
          color: item.color,
          fabric: item.fabric,
          gsm: item.gsm,
          fit: item.fit,
          sku: item.sku,
          badge: item.badge,
          rating: Number(item.rating || 4.8),
          reviews: item.reviews_count || 50,
          colors: Array.isArray(item.colors) ? item.colors : ["#191a17"],
          desc: item.description,
          care: item.care,
          sizes: Array.isArray(item.sizes) ? item.sizes : ["S", "M", "L", "XL", "XXL"],
          chart: item.size_chart || {}
        }));
        const remoteProductIds = new Set(remoteProducts.map(product => product.id));
        PRODUCTS = [
          ...remoteProducts,
          ...LOCAL_PRODUCTS.filter(product => !remoteProductIds.has(product.id))
        ];
        syncCartPricing();
        renderProducts();
        renderCart();
        console.log(`Loaded ${data.length} Supabase products and ${PRODUCTS.length - data.length} local catalog products`);
      }
    }
  } catch (e) {
    console.log("Using built-in Capra Cool catalog");
  }
}

// --- PERSISTENCE & CART ---
function saveCart() {
  localStorage.setItem("capraCoolCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(productId, size, qty = 1) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;

  const existing = cart.find(item => item.id === productId && item.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice,
      discountPercent: prod.discountPercent,
      image: prod.image,
      color: prod.color,
      category: prod.category,
      size: size,
      qty: qty
    });
  }

  saveCart();
  showToast(`Added ${prod.name} (${size}) to bag`);
  openDrawer();
}

function updateItemQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function removeItem(index) {
  if (!cart[index]) return;
  const removedName = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  showToast(`Removed ${removedName} from bag`);
}

function clearCart() {
  cart = [];
  saveCart();
  showToast("Bag cleared");
}

// --- CART DRAWER RENDERING ---
function renderCart() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const headerCount = $("#headerBagCount");
  if (headerCount) headerCount.textContent = totalCount;

  const drawerCount = $("#drawerItemCount");
  if (drawerCount) drawerCount.textContent = `(${totalCount})`;

  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const trackerMsg = $("#shippingTrackerMsg");
  const trackerFill = $("#shippingTrackerFill");
  if (trackerMsg && trackerFill) {
    if (subtotal === 0) {
      trackerMsg.innerHTML = `<span>Free shipping on orders above ${formatMoney(CONFIG.FREE_SHIPPING_THRESHOLD)}</span>`;
      trackerFill.style.width = "0%";
      trackerFill.classList.remove("unlocked");
    } else if (isFreeShip) {
      trackerMsg.innerHTML = `<span style="color:var(--green);font-weight:700">✓ Free Express Shipping Unlocked!</span>`;
      trackerFill.style.width = "100%";
      trackerFill.classList.add("unlocked");
    } else {
      const remaining = CONFIG.FREE_SHIPPING_THRESHOLD - subtotal;
      const pct = Math.min(100, Math.round((subtotal / CONFIG.FREE_SHIPPING_THRESHOLD) * 100));
      trackerMsg.innerHTML = `<span>Add <strong>${formatMoney(remaining)}</strong> for FREE shipping</span> <span>${pct}%</span>`;
      trackerFill.style.width = `${pct}%`;
      trackerFill.classList.remove("unlocked");
    }
  }

  const itemsContainer = $("#cartItemsList");
  if (itemsContainer) {
    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;text-align:center;color:var(--muted);padding:40px 20px">
          <div style="font-size:44px;margin-bottom:14px;opacity:0.6">🏔️</div>
          <h3 style="font:800 18px var(--display);margin:0 0 8px;color:var(--ink)">Your bag is empty</h3>
          <p style="font-size:13px;max-width:240px;margin-bottom:20px">Discover our high-altitude essentials designed for everyday elevation.</p>
          <a href="#shop" class="btn dark" onclick="closeDrawer()">Shop Collection</a>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-info">
            <div>
              <h4 class="cart-item-title">${item.name}</h4>
              <div class="cart-item-variant">Size: <strong>${item.size}</strong> · ${item.color}</div>
            </div>
            <div class="cart-item-controls">
              <div class="qty-control">
                <button type="button" onclick="updateItemQty(${idx}, -1)" aria-label="Decrease">−</button>
                <span>${item.qty}</span>
                <button type="button" onclick="updateItemQty(${idx}, 1)" aria-label="Increase">+</button>
              </div>
              <div class="cart-item-price">${salePriceMarkup({
                price: item.price * item.qty,
                compareAtPrice: item.compareAtPrice * item.qty,
                discountPercent: item.discountPercent
              })}</div>
            </div>
            <button type="button" class="cart-remove-btn" onclick="removeItem(${idx})">Remove</button>
          </div>
        </div>
      `).join("");
    }
  }

  const subtotalEl = $("#cartSubtotal");
  const shippingEl = $("#cartShipping");
  const totalEl = $("#cartTotal");
  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (shippingEl) shippingEl.textContent = subtotal === 0 ? "—" : (isFreeShip ? "FREE" : formatMoney(CONFIG.SHIPPING_FEE));
  if (totalEl) totalEl.textContent = formatMoney(grandTotal);

  const checkoutBtn = $("#checkoutProceedBtn");
  const quickWaBtn = $("#quickWhatsAppBtn");
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  if (quickWaBtn) quickWaBtn.disabled = cart.length === 0;
}

// --- WISHLIST TOGGLE ---
function toggleWishlist(productId, btn) {
  const idx = wishlist.indexOf(productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove("active");
    btn.innerHTML = "♡";
    showToast("Removed from wishlist");
  } else {
    wishlist.push(productId);
    btn.classList.add("active");
    btn.innerHTML = "♥";
    showToast("Added to wishlist");
  }
  localStorage.setItem("capraCoolWishlist", JSON.stringify(wishlist));
}

// --- DYNAMIC PRODUCT GRID RENDERING ---
function renderProducts() {
  const container = $("#productsGrid");
  if (!container) return;

  // Filter
  let list = activeCategory === "all" ? [...PRODUCTS] : PRODUCTS.filter(p => p.category === activeCategory);

  // Sort
  if (activeSort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  } else if (activeSort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  container.innerHTML = list.map(p => {
    const isWished = wishlist.includes(p.id);
    const colorDots = p.colors ? p.colors.map(c => `<span class="color-dot" style="background:${c}"></span>`).join("") : "";

    return `
      <article class="product" data-product-id="${p.id}" data-cat="${p.category}" data-name="${p.name}" data-price="${p.price}">
        <div class="visual ${p.imageFit === "contain" ? "contain-image" : ""}" onclick="triggerQuickView('${p.id}')" role="button" tabindex="0" aria-label="View ${p.name}">
          <span class="visual-badge">${p.badge || p.gsm}</span>
          <button type="button" class="wish-btn ${isWished ? 'active' : ''}" onclick="toggleWishlist('${p.id}', this)" aria-label="Add to wishlist">
            ${isWished ? '♥' : '♡'}
          </button>
          <img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async">
        </div>
        <div class="product-meta">
          <div>
            <h3 onclick="triggerQuickView('${p.id}')">${p.name}</h3>
            <small>${p.category === "accessory" ? "Small object" : p.gsm} · ${p.color}</small>
          </div>
          <div class="product-price">${salePriceMarkup(p)}</div>
        </div>
        <div class="color-dots">${colorDots}</div>
        <div class="product-actions">
          <button type="button" class="add-btn" onclick="triggerSizeSelector('${p.id}')">
            <span>Add to Bag</span>
          </button>
          <button type="button" class="details-btn" onclick="triggerQuickView('${p.id}')">View piece</button>
        </div>
      </article>
    `;
  }).join("");

  const countEl = $("#catalogInfoCount");
  if (countEl) {
    countEl.textContent = `Showing ${list.length} item${list.length === 1 ? '' : 's'}`;
  }
}

// --- MODAL CONTROLS ---
function openModal(id) {
  const modal = $(id);
  const shade = $("#shade");
  if (modal) modal.classList.add("open");
  if (shade) shade.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = $(id);
  if (modal) modal.classList.remove("open");
  if (id === "#quickViewModal" && window.location.hash.startsWith("#product/")) {
    history.replaceState(null, "", "#shop");
  }
  if (!document.querySelector(".modal.open") && !$("#bagDrawer")?.classList.contains("open")) {
    const shade = $("#shade");
    if (shade) shade.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function closeAllModals() {
  $$(".modal.open").forEach(m => m.classList.remove("open"));
  closeDrawer();
  closeSearch();
  closeMobileNav();
  const shade = $("#shade");
  if (shade) shade.classList.remove("open");
  document.body.style.overflow = "";
}

function openDrawer() {
  const drawer = $("#bagDrawer");
  const shade = $("#shade");
  if (drawer) drawer.classList.add("open");
  if (shade) shade.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  const drawer = $("#bagDrawer");
  if (drawer) drawer.classList.remove("open");
  if (!document.querySelector(".modal.open")) {
    const shade = $("#shade");
    if (shade) shade.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function openMobileNav() {
  const drawer = $("#mobileNavDrawer");
  if (drawer) drawer.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMobileNav() {
  const drawer = $("#mobileNavDrawer");
  if (drawer) drawer.classList.remove("open");
  document.body.style.overflow = "";
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, duration = 3000) {
  let container = $("#toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span style="color:var(--accent);font-weight:bold">⌃</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- SIZE SELECTOR MODAL ---
function triggerSizeSelector(productId) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;
  selectedProduct = prod;
  selectedSize = null;

  $("#sizeModalTitle").textContent = prod.name;
  $("#sizeModalPrice").innerHTML = salePriceMarkup(prod);
  $("#sizeModalColor").textContent = `${prod.fabric} · ${prod.color}`;
  $("#sizeModalThumb").src = prod.image;
  $("#sizeModalThumb").alt = prod.name;

  const sizesGrid = $("#sizeModalButtons");
  sizesGrid.innerHTML = prod.sizes.map(s => `
    <button type="button" class="size-btn" data-size="${s}" onclick="selectSizeButton(this, '${s}')">${s}</button>
  `).join("");

  const tableContainer = $("#sizeModalChart");
  const chartToggle = $("#sizeGuideToggleText");
  const chartMarkup = sizeChartMarkup(prod);
  if (tableContainer && chartMarkup) {
    tableContainer.innerHTML = chartMarkup;
    tableContainer.style.display = "none";
    if (chartToggle) {
      chartToggle.style.display = "inline-block";
      chartToggle.textContent = "View garment size chart ▼";
    }
  } else if (tableContainer) {
    tableContainer.innerHTML = "";
    tableContainer.style.display = "none";
    if (chartToggle) chartToggle.style.display = "none";
  }

  openModal("#sizeModal");
}

function selectSizeButton(btn, size) {
  $$("#sizeModalButtons .size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedSize = size;
}

function toggleSizeGuide() {
  const chart = $("#sizeModalChart");
  if (chart) {
    const isHidden = chart.style.display === "none";
    chart.style.display = isHidden ? "block" : "none";
    $("#sizeGuideToggleText").textContent = isHidden ? "Hide size chart ▲" : "View garment size chart ▼";
  }
}

function confirmSizeSelection() {
  if (!selectedSize) {
    showToast("Please pick an option");
    return;
  }
  if (!selectedProduct) return;
  addToCart(selectedProduct.id, selectedSize, 1);
  closeModal("#sizeModal");
}

// --- QUICK VIEW MODAL ---
function setQuickViewImage(src, button) {
  const image = $("#quickViewImg");
  if (image) image.src = src;
  $$("#quickViewThumbnails .quickview-thumb").forEach(thumb => thumb.classList.remove("active"));
  if (button) button.classList.add("active");
}

function triggerQuickView(productId, updateUrl = true) {
  const prod = PRODUCTS.find(p => p.id === productId);
  if (!prod) return;
  selectedProduct = prod;
  selectedSize = null;

  $("#quickViewImg").src = prod.image;
  $("#quickViewImg").alt = prod.name;
  $("#quickViewImg").style.objectFit = prod.imageFit || "cover";
  $("#quickViewCategory").textContent = prod.category === "track" ? "TRACKSUITS" : `${prod.category.toUpperCase()}S`;
  $("#quickViewEdition").textContent = prod.edition;
  $("#quickViewTitle").textContent = prod.name;
  $("#quickViewPrice").innerHTML = salePriceMarkup(prod, true);
  $("#quickViewRating").textContent = `★ ${Number(prod.rating || 4.8).toFixed(1)} · ${prod.reviews || "New"} ${prod.reviews === 1 ? "review" : "reviews"}`;
  $("#quickViewDesc").textContent = prod.desc;
  $("#quickViewSpecs").innerHTML = `
    <div><strong>Fabric:</strong> ${prod.fabric}</div>
    <div><strong>Weight:</strong> ${prod.gsm}</div>
    <div><strong>Fit:</strong> ${prod.fit}</div>
    <div><strong>Colorway:</strong> ${prod.color}</div>
    <div><strong>SKU:</strong> ${prod.sku}</div>
    <div><strong>Care:</strong> ${prod.care}</div>
  `;

  const thumbnails = $("#quickViewThumbnails");
  if (thumbnails) {
    thumbnails.innerHTML = prod.gallery.map((src, index) => `
      <button type="button" class="quickview-thumb ${index === 0 ? "active" : ""}" onclick="setQuickViewImage('${src}', this)" aria-label="View image ${index + 1}">
        <img src="${src}" alt="" loading="lazy" decoding="async">
      </button>
    `).join("");
  }

  const notes = $("#quickViewNotes");
  if (notes) {
    notes.innerHTML = `
      <details open><summary>Material & hand feel</summary><p>${prod.materialNote}</p></details>
      <details><summary>Construction</summary><p>${prod.constructionNote}</p></details>
      <details><summary>Care</summary><p>${prod.care}</p></details>
    `;
  }

  const sizesGrid = $("#quickViewSizes");
  sizesGrid.innerHTML = prod.sizes.map(s => `
    <button type="button" class="size-btn" data-size="${s}" onclick="selectQuickViewSize(this, '${s}')">${s}</button>
  `).join("");

  const chartEl = $("#quickViewChart");
  if (chartEl) chartEl.innerHTML = sizeChartMarkup(prod);

  openModal("#quickViewModal");
  if (updateUrl && window.location.hash !== `#product/${prod.id}`) {
    history.replaceState({ productId: prod.id }, "", `#product/${prod.id}`);
  }
}

function selectQuickViewSize(btn, size) {
  $$("#quickViewSizes .size-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  selectedSize = size;
}

function confirmQuickViewAdd() {
  if (!selectedSize) {
    showToast("Please choose a size first");
    return;
  }
  if (!selectedProduct) return;
  addToCart(selectedProduct.id, selectedSize, 1);
  closeModal("#quickViewModal");
}

// --- BRAND BOARD MODAL ---
function openBrandBoardModal() {
  openModal("#brandBoardModal");
}

function openVideoTeaserModal() {
  openModal("#videoTeaserModal");
}

// --- SEARCH OVERLAY ---
function openSearch() {
  const panel = $("#searchPanel");
  const input = $("#searchInput");
  if (panel) panel.classList.add("open");
  if (input) {
    input.value = "";
    input.focus();
  }
  runSearch("");
  document.body.style.overflow = "hidden";
}

function closeSearch() {
  const panel = $("#searchPanel");
  if (panel) panel.classList.remove("open");
  document.body.style.overflow = "";
}

function runSearch(query) {
  const resultsContainer = $("#searchResults");
  if (!resultsContainer) return;

  const q = query.trim().toLowerCase();
  const matched = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) || 
    p.color.toLowerCase().includes(q) || 
    p.fabric.toLowerCase().includes(q)
  );

  if (matched.length === 0) {
    resultsContainer.innerHTML = `<p style="color:var(--muted);padding:20px 0">No pieces found matching "${query}". Try "tee", "hoodie", or "tracksuit".</p>`;
    return;
  }

  resultsContainer.innerHTML = matched.map(p => `
    <div class="search-result-item" onclick="jumpToProduct('${p.id}', '${p.category}')">
      <div style="display:flex;align-items:center;gap:14px">
        <div class="search-result-thumb"><img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async"></div>
        <div>
          <div style="font:700 15px var(--display)">${p.name}</div>
          <div style="font-size:11px;color:var(--muted)">${p.fabric} · ${p.color}</div>
        </div>
      </div>
      <div class="search-result-price">${salePriceMarkup(p)}</div>
    </div>
  `).join("");
}

function jumpToProduct(productId, category) {
  closeSearch();
  filterProducts(category);
  const el = $(`[data-product-id="${productId}"]`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.boxShadow = "0 0 0 2px var(--ink)";
    setTimeout(() => { el.style.boxShadow = ""; }, 1200);
  }
}

function filterProducts(cat) {
  activeCategory = cat;
  $$(".filter").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === cat);
  });
  renderProducts();
}

function sortProducts(sortBy) {
  activeSort = sortBy;
  renderProducts();
}

// --- CUSTOM CAMPUS MERCHANDISE ---
const CUSTOM_GARMENTS = {
  tshirt: {
    label: "T-Shirt",
    image: "assets/collection_tees.jpg"
  },
  hoodie: {
    label: "Hoodie",
    image: "assets/collection_hoodies.jpg"
  },
  tracksuit: {
    label: "Tracksuit",
    image: "assets/collection_tracksuits.jpg"
  }
};

const CUSTOM_PLACEMENTS = {
  "left-chest-back": "Left chest + back",
  "center-chest": "Centre chest",
  "sleeve-back": "Sleeve + back",
  "full-custom": "Full custom layout"
};

const CUSTOM_INSTITUTION_EXAMPLES = {
  IIT: "e.g. IIT Bombay",
  NIT: "e.g. NIT Trichy",
  IIIT: "e.g. IIIT Hyderabad",
  IISc: "e.g. IISc Bengaluru",
  IIM: "e.g. IIM Ahmedabad",
  AIIMS: "e.g. AIIMS Delhi",
  "Other College": "e.g. your college name"
};

function getCustomOrderData() {
  const form = $("#customOrderForm");
  if (!form) return null;

  const data = new FormData(form);
  const garmentKey = data.get("garment") || "hoodie";
  const colourInput = form.querySelector('input[name="colour"]:checked');

  return {
    institutionType: data.get("institutionType") || "IIT",
    instituteName: String(data.get("instituteName") || "").trim(),
    garmentKey,
    garment: CUSTOM_GARMENTS[garmentKey] || CUSTOM_GARMENTS.hoodie,
    colour: data.get("colour") || "Black",
    colourHex: colourInput?.dataset.hex || "#171717",
    placementKey: data.get("printPlacement") || "left-chest-back",
    quantity: Math.max(1, Number(data.get("quantity")) || 1),
    personalisation: data.get("personalisation") === "on"
  };
}

function getReadablePrintColour(hex) {
  const value = String(hex || "#171717").replace("#", "");
  const full = value.length === 3 ? value.split("").map(char => char + char).join("") : value;
  const red = parseInt(full.slice(0, 2), 16) || 0;
  const green = parseInt(full.slice(2, 4), 16) || 0;
  const blue = parseInt(full.slice(4, 6), 16) || 0;
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return brightness > 150 ? "#161613" : "#f7f2e8";
}

function updateCustomPreview() {
  const order = getCustomOrderData();
  if (!order) return;

  const previewFrame = $("#customPreviewFrame");
  const previewImage = $("#customPreviewImage");
  const previewInstitute = $("#customPreviewInstitute");
  const previewName = $("#customPreviewName");
  const previewFrontName = $("#customPreviewFrontName");
  const previewGarment = $("#customPreviewGarment");
  const previewPlacement = $("#customPreviewPlacement");
  const previewFrontType = $("#customPreviewFrontType");
  const summary = $("#customOrderSummary");
  const instituteInput = $("#customInstituteName");
  const placement = CUSTOM_PLACEMENTS[order.placementKey] || CUSTOM_PLACEMENTS["left-chest-back"];
  const defaultName = order.institutionType === "Other College" ? "YOUR COLLEGE" : `YOUR ${order.institutionType}`;
  const displayName = (order.instituteName || defaultName).toUpperCase();
  const printColour = getReadablePrintColour(order.colourHex);

  if (previewFrame) {
    previewFrame.style.setProperty("--custom-colour", order.colourHex);
    previewFrame.style.setProperty("--custom-print-colour", printColour);
    previewFrame.dataset.garment = order.garmentKey;
  }
  if (previewImage) {
    previewImage.src = order.garment.image;
    previewImage.alt = `Custom ${order.institutionType} campus ${order.garment.label.toLowerCase()} preview`;
  }
  if (previewInstitute) previewInstitute.textContent = order.institutionType;
  if (previewName) previewName.textContent = displayName;
  if (previewFrontName) previewFrontName.textContent = displayName;
  if (instituteInput) instituteInput.placeholder = CUSTOM_INSTITUTION_EXAMPLES[order.institutionType] || "e.g. your college name";
  if (previewGarment) previewGarment.textContent = `${order.garment.label.toUpperCase()} · ${placement.toUpperCase()}`;
  if (previewPlacement) previewPlacement.textContent = placement.toUpperCase();
  if (previewFrontType) previewFrontType.textContent = `${order.institutionType} · ${order.garment.label}`;
  if (summary) {
    const pieces = order.quantity === 1 ? "piece" : "pieces";
    summary.textContent = `${order.institutionType} · ${order.garment.label} · ${order.quantity} ${pieces}`;
  }
}

function handleCustomQuote(e) {
  e.preventDefault();
  const form = e.target;
  if (!form.reportValidity()) return;

  const order = getCustomOrderData();
  if (!order) return;
  const placement = CUSTOM_PLACEMENTS[order.placementKey] || CUSTOM_PLACEMENTS["left-chest-back"];
  const message =
`*CAPRA COOL — CUSTOM CAMPUS MERCH REQUEST*

*INSTITUTION:* ${order.instituteName} (${order.institutionType})
*GARMENT:* ${order.garment.label}
*BASE COLOUR:* ${order.colour}
*PRINT PLACEMENT:* ${placement}
*QUANTITY:* ${order.quantity}
*NAMES / DEPARTMENTS:* ${order.personalisation ? "Yes" : "No"}

Please share the available customization options and quote.`;

  const subject = encodeURIComponent("Capra Cool custom campus quote request");
  window.location.href = `mailto:${CONFIG.STORE_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
  showToast("Opening your custom quote by email");
}

let customStep = 1;

function showCustomStep(step) {
  customStep = Math.max(1, Math.min(3, Number(step) || 1));
  $$(".custom-step").forEach(panel => panel.classList.toggle("active", Number(panel.dataset.customStep) === customStep));
  $$(".custom-progress-step").forEach(button => {
    const target = Number(button.dataset.stepTarget);
    button.classList.toggle("active", target === customStep);
    button.classList.toggle("complete", target < customStep);
  });

  const back = $("#customStepBack");
  const next = $("#customStepNext");
  const submit = $("#customQuoteSubmit");
  if (back) back.disabled = customStep === 1;
  if (next) next.style.display = customStep === 3 ? "none" : "inline-flex";
  if (submit) submit.style.display = customStep === 3 ? "inline-flex" : "none";
}

function advanceCustomStep() {
  if (customStep === 1) {
    const institute = $("#customInstituteName");
    if (institute && !institute.reportValidity()) return;
  }
  showCustomStep(customStep + 1);
}

function setupCustomSteps() {
  $("#customStepBack")?.addEventListener("click", () => showCustomStep(customStep - 1));
  $("#customStepNext")?.addEventListener("click", advanceCustomStep);
  $$(".custom-progress-step").forEach(button => {
    button.addEventListener("click", () => {
      const target = Number(button.dataset.stepTarget);
      if (target <= customStep) showCustomStep(target);
    });
  });
  showCustomStep(1);
}

function setupScrollReveals() {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const sections = $$('main > section:not(.hero-wrapper)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px" });

  sections.forEach(section => {
    section.classList.add("reveal-ready");
    observer.observe(section);
  });
}

// --- CHECKOUT FLOW ---
function openCheckoutModal() {
  if (cart.length === 0) {
    showToast("Your bag is empty");
    return;
  }
  closeDrawer();
  renderCheckoutPreview();
  switchCheckoutTab("whatsapp");
  openModal("#checkoutModal");
}

function switchCheckoutTab(tab) {
  $$(".checkout-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  const isWa = tab === "whatsapp";
  $("#checkoutWhatsappTab").style.display = isWa ? "block" : "none";
  $("#checkoutDirectTab").style.display = isWa ? "none" : "block";
}

function renderCheckoutPreview() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const preview = $("#checkoutItemsPreview");
  if (preview) {
    preview.innerHTML = cart.map(i => `
      <div style="display:flex;justify-content:space-between;padding:4px 0">
        <span>${i.name} (${i.size}) × ${i.qty}</span>
        <strong>${formatMoney(i.price * i.qty)}</strong>
      </div>
    `).join("") + `
      <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px dashed var(--line)">
        <span>Subtotal</span>
        <span>${formatMoney(subtotal)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:4px 0">
        <span>Shipping ${isFreeShip ? '(Free above ₹999)' : ''}</span>
        <span>${isFreeShip ? 'FREE' : formatMoney(shippingFee)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-weight:800;font-size:15px;color:var(--ink);padding-top:6px">
        <span>Total Payable</span>
        <span>${formatMoney(grandTotal)}</span>
      </div>
    `;
  }
}

function handleWhatsAppOrder(e) {
  e.preventDefault();
  if (cart.length === 0) return;

  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();
  const pincode = form.pincode.value.trim();
  const notes = form.notes ? form.notes.value.trim() : "";

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const itemsList = cart.map((item, i) => 
    `${i + 1}. *${item.name}* (Size: ${item.size}) | Qty: ${item.qty} | ${formatMoney(item.price * item.qty)}`
  ).join("\n");

  const message = 
`🏔️ *CAPRA COOL — ASSISTED ORDER REQUEST*

*CUSTOMER DETAILS:*
• Name: ${name}
• Phone: ${phone}
• Delivery Address: ${address}
• PIN Code: ${pincode}
${notes ? `• Special Notes: ${notes}\n` : ''}
*ORDER ITEMS:*
${itemsList}

*SUMMARY:*
• Subtotal: ${formatMoney(subtotal)}
• Shipping: ${isFreeShip ? 'FREE' : formatMoney(shippingFee)}
• *TOTAL AMOUNT: ${formatMoney(grandTotal)}*

Please confirm availability, payment instructions, and delivery tracking once dispatched. Thank you!`;

  const orderId = `CC-${Date.now().toString().slice(-6)}`;
  const subject = encodeURIComponent(`Capra Cool order request ${orderId}`);
  const encodedUrl = `mailto:${CONFIG.STORE_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
  
  // Sync to Supabase
  saveOrderToSupabase({
    id: orderId,
    order_number: orderId,
    customer_name: name,
    customer_phone: phone,
    delivery_address: address,
    pincode: pincode,
    notes: notes,
    payment_method: "assisted_email",
    order_channel: "email_concierge",
    items: [...cart],
    subtotal: subtotal,
    shipping_fee: shippingFee,
    grand_total: grandTotal,
    order_status: "pending_email_confirmation"
  });

  showOrderSuccess(orderId, name, grandTotal, "Assisted Email Order");
  window.location.href = encodedUrl;
}

function handleDirectOrder(e) {
  e.preventDefault();
  if (cart.length === 0) return;

  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const address = form.address.value.trim();
  const city = form.city.value.trim();
  const state = form.state.value.trim();
  const pincode = form.pincode.value.trim();
  const paymentMethod = form.payment_method.value;

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const isFreeShip = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD;
  const shippingFee = (subtotal === 0 || isFreeShip) ? 0 : CONFIG.SHIPPING_FEE;
  const grandTotal = subtotal + shippingFee;

  const orderId = `CC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const orderRecord = {
    orderId,
    date: new Date().toISOString(),
    customer: { name, phone, email, address, city, state, pincode },
    paymentMethod,
    items: [...cart],
    subtotal,
    shippingFee,
    grandTotal
  };

  const existingOrders = JSON.parse(localStorage.getItem("capraCoolOrders") || "[]");
  existingOrders.unshift(orderRecord);
  localStorage.setItem("capraCoolOrders", JSON.stringify(existingOrders));

  // Sync to Supabase
  saveOrderToSupabase({
    id: orderId,
    order_number: orderId,
    customer_name: name,
    customer_phone: phone,
    customer_email: email,
    delivery_address: address,
    city: city,
    state: state,
    pincode: pincode,
    payment_method: paymentMethod,
    order_channel: "web_checkout",
    items: [...cart],
    subtotal: subtotal,
    shipping_fee: shippingFee,
    grand_total: grandTotal,
    order_status: "confirmed"
  });

  cart = [];
  saveCart();

  showOrderSuccess(orderId, name, grandTotal, paymentMethod);
}

function showOrderSuccess(orderId, customerName, total, paymentMethod) {
  closeModal("#checkoutModal");

  const successView = $("#orderSuccessModal");
  if (successView) {
    $("#successCustomerName").textContent = customerName;
    $("#successOrderId").textContent = orderId;
    $("#successOrderTotal").textContent = formatMoney(total);
    $("#successPaymentMethod").textContent = paymentMethod === "cod" ? "Cash on Delivery" : (paymentMethod === "assisted_email" ? "Assisted Email Order" : paymentMethod);
    
    const waShareBtn = $("#receiptWhatsAppShareBtn");
    if (waShareBtn) {
      waShareBtn.onclick = () => {
        const msg = `Hi Capra Cool, I placed order #${orderId} (${formatMoney(total)}). Please share dispatch tracking.`;
        window.location.href = `mailto:${CONFIG.STORE_EMAIL}?subject=${encodeURIComponent(`Capra Cool order ${orderId}`)}&body=${encodeURIComponent(msg)}`;
      };
    }

    openModal("#orderSuccessModal");
  } else {
    showToast(`Order confirmed! ID: ${orderId}`);
  }
}

// --- INITIALIZATION ---
function initApp() {
  renderProducts();
  renderCart();
  loadProductsFromSupabase();
  setupCustomSteps();
  setupScrollReveals();

  // Category filter clicks
  $$(".filter").forEach(btn => {
    btn.addEventListener("click", () => filterProducts(btn.dataset.filter));
  });

  // Sort dropdown
  const sortEl = $("#sortSelect");
  if (sortEl) {
    sortEl.addEventListener("change", e => sortProducts(e.target.value));
  }

  // Header Scroll Shrink & Back to Top visibility
  const header = $("#mainHeader");
  const backToTopBtn = $("#backToTopBtn");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (header) {
      if (y > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    if (backToTopBtn) {
      if (y > 400) backToTopBtn.classList.add("visible");
      else backToTopBtn.classList.remove("visible");
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Drawer & Search Toggles
  const bagBtn = $("#openBagBtn");
  if (bagBtn) bagBtn.addEventListener("click", openDrawer);

  const closeBagBtn = $("#closeBagBtn");
  if (closeBagBtn) closeBagBtn.addEventListener("click", closeDrawer);

  const searchBtn = $("#searchBtn");
  if (searchBtn) searchBtn.addEventListener("click", openSearch);

  const closeSearchBtn = $("#closeSearchBtn");
  if (closeSearchBtn) closeSearchBtn.addEventListener("click", closeSearch);

  const searchInput = $("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", e => runSearch(e.target.value));
  }

  // Keyboard shortcut
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Shade backdrop
  const shade = $("#shade");
  if (shade) shade.addEventListener("click", closeAllModals);

  // Mobile menu
  const mobileMenuBtn = $("#mobileMenuBtn");
  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", openMobileNav);

  const closeMobileNavBtn = $("#closeMobileNavBtn");
  if (closeMobileNavBtn) closeMobileNavBtn.addEventListener("click", closeMobileNav);

  // Forms
  const waForm = $("#whatsappOrderForm");
  if (waForm) waForm.addEventListener("submit", handleWhatsAppOrder);

  const directForm = $("#directOrderForm");
  if (directForm) directForm.addEventListener("submit", handleDirectOrder);

  const checkoutProceedBtn = $("#checkoutProceedBtn");
  if (checkoutProceedBtn) checkoutProceedBtn.addEventListener("click", openCheckoutModal);

  const quickWaBtn = $("#quickWhatsAppBtn");
  if (quickWaBtn) {
    quickWaBtn.addEventListener("click", () => {
      openCheckoutModal();
      switchCheckoutTab("whatsapp");
    });
  }

  const newsForm = $("#newsletterForm");
  if (newsForm) {
    newsForm.addEventListener("submit", e => {
      e.preventDefault();
      showToast("Thank you for joining the Capra Cool edit.");
      e.target.reset();
    });
  }

  const customOrderForm = $("#customOrderForm");
  if (customOrderForm) {
    customOrderForm.addEventListener("input", updateCustomPreview);
    customOrderForm.addEventListener("change", updateCustomPreview);
    customOrderForm.addEventListener("submit", handleCustomQuote);
    updateCustomPreview();
  }

  const productFromHash = window.location.hash.match(/^#product\/(.+)$/)?.[1];
  if (productFromHash) triggerQuickView(productFromHash, false);

}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Window exposure
window.addToCart = addToCart;
window.updateItemQty = updateItemQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.toggleWishlist = toggleWishlist;
window.triggerSizeSelector = triggerSizeSelector;
window.selectSizeButton = selectSizeButton;
window.toggleSizeGuide = toggleSizeGuide;
window.confirmSizeSelection = confirmSizeSelection;
window.triggerQuickView = triggerQuickView;
window.setQuickViewImage = setQuickViewImage;
window.selectQuickViewSize = selectQuickViewSize;
window.confirmQuickViewAdd = confirmQuickViewAdd;
window.openBrandBoardModal = openBrandBoardModal;
window.openVideoTeaserModal = openVideoTeaserModal;
window.openCheckoutModal = openCheckoutModal;
window.switchCheckoutTab = switchCheckoutTab;
window.closeModal = closeModal;
window.closeDrawer = closeDrawer;
window.openDrawer = openDrawer;
window.closeMobileNav = closeMobileNav;
window.jumpToProduct = jumpToProduct;
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
