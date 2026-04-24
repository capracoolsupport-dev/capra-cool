-- This seed resets the storefront content tables and inserts starter data.
-- Replace `public_url` values in `product_media` with your own Supabase Storage paths
-- whenever you upload real product imagery into the `product-media` bucket.

truncate table
  public.reviews,
  public.product_media,
  public.products,
  public.trust_badges,
  public.announcements,
  public.categories,
  public.store_settings
restart identity cascade;

insert into public.store_settings (
  brand_name,
  brand_subline,
  support_email,
  support_phone,
  business_location,
  support_window,
  instagram_url,
  facebook_url,
  hero_eyebrow,
  hero_title,
  hero_description,
  hero_primary_cta_label,
  hero_primary_cta_href,
  hero_secondary_cta_label,
  hero_secondary_cta_href,
  hero_stats,
  showcase_eyebrow,
  showcase_title,
  showcase_description,
  showcase_video_url,
  showcase_poster_url,
  about_title,
  about_intro,
  about_story,
  quality_promise,
  customize_title,
  customize_description,
  contact_title,
  contact_description
) values (
  'Trendy Spice Store',
  'trendyspicestore.com',
  'trendyspicestore@gmail.com',
  '+91 90000 00000',
  'Indiranagar, Bengaluru, India',
  'Monday to Saturday, 10 AM to 7 PM',
  'https://www.instagram.com/',
  'https://www.facebook.com/',
  'Premium handmade crochet',
  'Handmade crochet that feels personal, polished, and beautifully gift-ready.',
  'Discover premium handmade crochet pieces with soft texture, curated color stories, and a shopping experience that feels calm, clear, and gift-ready.',
  'Explore Collection',
  '/#featured',
  'Create Custom Order',
  '/customize',
  jsonb_build_array(
    jsonb_build_object('value', '100%', 'label', 'handmade finish'),
    jsonb_build_object('value', '2-3 taps', 'label', 'to product discovery'),
    jsonb_build_object('value', '4.9/5', 'label', 'average product love')
  ),
  'Showcase',
  'Texture, color, and craftsmanship made visible on every screen.',
  'A warm visual moment to highlight texture, color, and the handcrafted finish behind each piece.',
  '',
  '',
  'Handmade crochet made to feel slow, warm, and intentionally premium.',
  'Trendy Spice Store began with the idea that crochet should feel giftable, tactile, and easy to explore without losing the story behind the product.',
  'Every collection is made in small runs so the colors stay curated, the texture stays soft, and each piece still carries the warmth of handmade work.',
  'Products are checked before dispatch, packed carefully, and supported with responsive customer service for custom orders and gifting guidance.',
  'Design a custom crochet piece that feels personal from the start.',
  'Share your colors, mood, occasion, and reference image so we can shape a piece that feels truly personal.',
  'Need help choosing a handmade piece or placing an order?',
  'Reach out for sizing help, gifting suggestions, order updates, or custom design questions.'
);

insert into public.categories (slug, name, short_label, accent_color, tint_color, display_order) values
  ('women', 'Women', 'WM', '#d96f71', '#fae0db', 1),
  ('men', 'Men', 'MN', '#457b9d', '#dcecf6', 2),
  ('unisex', 'Unisex', 'UX', '#58715f', '#dce8dd', 3),
  ('kids', 'Kids', 'KD', '#f2a65a', '#fde9d3', 4),
  ('gifting', 'Gifting', 'GF', '#8a5a97', '#ebdbef', 5);

insert into public.announcements (message, display_order) values
  ('Free Shipping on Selected Orders', 1),
  ('Use Code HANDMADE10 for Discount', 2),
  ('100% Handmade Crochet Products', 3),
  ('Perfect Gifts for Loved Ones', 4);

insert into public.trust_badges (title, detail, icon_name, display_order) values
  ('Secure Payment', 'Protected checkout experience with clear customer confidence.', 'shield', 1),
  ('Handmade Product', 'Designed and finished by hand for a more personal feel.', 'yarn', 2),
  ('Quality Checked', 'Every order is reviewed before packing and dispatch.', 'check', 3),
  ('Fast Support', 'Quick responses for gifting, custom orders, and care questions.', 'support', 4);

insert into public.products (
  category_id,
  slug,
  name,
  price_inr,
  stock_quantity,
  rating,
  review_count,
  review_snippet,
  tagline,
  description,
  highlights,
  badge_text,
  is_featured_home,
  featured_rank,
  display_order
)
values
  ((select id from public.categories where slug = 'women'), 'scrunchies', 'Scrunchies', 349, 12, 4.9, 128, 'Soft on hair and beautifully stitched.', 'Soft everyday crochet with a premium finish.', 'A soft, stretchy crochet scrunchie designed for effortless daily styling. The yarn is comfortable on hair and gives a handcrafted texture that feels elevated.', '["Cotton blend yarn","Gentle hold","Gift-ready wrap"]'::jsonb, 'Women', true, 1, 1),
  ((select id from public.categories where slug = 'women'), 'double-color-scrunchies', 'Double Color Scrunchies', 429, 8, 4.8, 94, 'Color pairing looks playful and premium.', 'Two-tone texture for a fuller handcrafted look.', 'These double color scrunchies bring contrast and depth into a simple daily accessory. The layered yarn styling makes the shape look fuller and more giftable.', '["Dual colorwork","Soft elastic core","Lightweight wear"]'::jsonb, 'Women', true, 2, 2),
  ((select id from public.categories where slug = 'unisex'), 'keychains', 'Keychains', 299, 16, 4.9, 156, 'Perfect gifting add-on with handmade charm.', 'Pocket-sized crochet details made to delight.', 'Small but memorable crochet keychains that work beautifully as personal keepsakes, bag charms, and lightweight gifts for loved ones.', '["Giftable mini format","Secure loop attachment","Easy add-on item"]'::jsonb, 'Unisex', true, 3, 3),
  ((select id from public.categories where slug = 'gifting'), 'flowers', 'Flowers', 499, 5, 4.9, 112, 'A forever bouquet with soft crochet texture.', 'Handmade floral stems that stay lovely year-round.', 'Crochet flowers designed as keepsakes for desks, celebrations, and thoughtful gifting. They bring warmth and color without fading over time.', '["Decor-ready","Long-lasting keepsake","Perfect for gifting"]'::jsonb, 'Gifting', true, 4, 4),
  ((select id from public.categories where slug = 'kids'), 'hair-clips', 'Hair Clips', 259, 3, 4.7, 84, 'Sweet finish for kids and gifting bundles.', 'Cute crochet accents for playful everyday styling.', 'Crochet hair clips made to feel gentle, colorful, and charming. They are especially easy to include in gift boxes for birthdays and festive moments.', '["Lightweight clip base","Kid-friendly styling","Bright gift appeal"]'::jsonb, 'Kids', false, null, 5),
  ((select id from public.categories where slug = 'women'), 'hair-bands', 'Hair Bands', 389, 7, 4.8, 73, 'Comfortable fit with visible handmade texture.', 'Crochet headbands that feel polished and easy to wear.', 'Designed to balance comfort with a boutique finish, these crochet hair bands bring soft structure and color to daily looks without feeling heavy.', '["Comfort-first fit","Boutique styling","Soft yarn texture"]'::jsonb, 'Women', false, null, 6),
  ((select id from public.categories where slug = 'men'), 'winter-clothes', 'Winter Clothes', 1199, 2, 4.9, 65, 'Warm, textured, and ideal for cozy gifting.', 'Handmade winter essentials with comfort at the center.', 'A cozy crochet winter collection built for softness, layered warmth, and visual depth. These pieces feel personal, seasonal, and premium for gifting.', '["Warm layered yarn","Seasonal gifting","Statement handmade texture"]'::jsonb, 'Men', false, null, 7),
  ((select id from public.categories where slug = 'gifting'), 'gifting-products', 'Gifting Products', 649, 4, 5.0, 91, 'Curated handmade sets ready to gift.', 'Ready-made crochet gifting bundles with thoughtful details.', 'Designed for birthdays, celebrations, and thank-you moments, these gifting products combine crochet charm with presentation that feels ready to delight.', '["Curated gift bundles","Ready to present","Premium handmade appeal"]'::jsonb, 'Gifting', false, null, 8),
  ((select id from public.categories where slug = 'kids'), 'crochet-bow', 'Crochet Bow', 279, 6, 4.8, 77, 'A cute finishing detail for styling or gifting.', 'Soft sculpted bow work with handcrafted charm.', 'A sweet crochet bow that adds warmth and personality to accessories, gifting sets, and playful styling moments. Lightweight and easy to love.', '["Soft sculpted form","Great for gifting","Playful premium styling"]'::jsonb, 'Kids', false, null, 9);

insert into public.product_media (product_id, media_kind, public_url, alt_text, sort_order, is_primary) values
  ((select id from public.products where slug = 'scrunchies'), 'image', 'https://placehold.co/900x900/f5d6d1/c96b70?text=Scrunchies+1', 'Scrunchies primary image', 1, true),
  ((select id from public.products where slug = 'scrunchies'), 'image', 'https://placehold.co/900x900/fff4f1/c96b70?text=Scrunchies+2', 'Scrunchies alternate image', 2, false),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'image', 'https://placehold.co/900x900/f6e5bd/c06c84?text=Double+Color+1', 'Double Color Scrunchies primary image', 1, true),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'image', 'https://placehold.co/900x900/fff9eb/c06c84?text=Double+Color+2', 'Double Color Scrunchies alternate image', 2, false),
  ((select id from public.products where slug = 'keychains'), 'image', 'https://placehold.co/900x900/f3d9bf/8f5b34?text=Keychains+1', 'Keychains primary image', 1, true),
  ((select id from public.products where slug = 'keychains'), 'image', 'https://placehold.co/900x900/fff7ee/8f5b34?text=Keychains+2', 'Keychains alternate image', 2, false),
  ((select id from public.products where slug = 'flowers'), 'image', 'https://placehold.co/900x900/f6c8d6/da627d?text=Flowers+1', 'Flowers primary image', 1, true),
  ((select id from public.products where slug = 'flowers'), 'image', 'https://placehold.co/900x900/fff3f7/da627d?text=Flowers+2', 'Flowers alternate image', 2, false),
  ((select id from public.products where slug = 'hair-clips'), 'image', 'https://placehold.co/900x900/f9ddb0/e28f41?text=Hair+Clips+1', 'Hair Clips primary image', 1, true),
  ((select id from public.products where slug = 'hair-clips'), 'image', 'https://placehold.co/900x900/fff6e8/e28f41?text=Hair+Clips+2', 'Hair Clips alternate image', 2, false),
  ((select id from public.products where slug = 'hair-bands'), 'image', 'https://placehold.co/900x900/e1d0f1/7e5b97?text=Hair+Bands+1', 'Hair Bands primary image', 1, true),
  ((select id from public.products where slug = 'hair-bands'), 'image', 'https://placehold.co/900x900/faf5ff/7e5b97?text=Hair+Bands+2', 'Hair Bands alternate image', 2, false),
  ((select id from public.products where slug = 'winter-clothes'), 'image', 'https://placehold.co/900x900/d7e4f2/496682?text=Winter+1', 'Winter Clothes primary image', 1, true),
  ((select id from public.products where slug = 'winter-clothes'), 'image', 'https://placehold.co/900x900/f6fbff/496682?text=Winter+2', 'Winter Clothes alternate image', 2, false),
  ((select id from public.products where slug = 'gifting-products'), 'image', 'https://placehold.co/900x900/f2d7df/9f546f?text=Gifting+1', 'Gifting Products primary image', 1, true),
  ((select id from public.products where slug = 'gifting-products'), 'image', 'https://placehold.co/900x900/fff6f9/9f546f?text=Gifting+2', 'Gifting Products alternate image', 2, false),
  ((select id from public.products where slug = 'crochet-bow'), 'image', 'https://placehold.co/900x900/f4c6d1/cb6380?text=Crochet+Bow+1', 'Crochet Bow primary image', 1, true),
  ((select id from public.products where slug = 'crochet-bow'), 'image', 'https://placehold.co/900x900/fff4f7/cb6380?text=Crochet+Bow+2', 'Crochet Bow alternate image', 2, false);

insert into public.reviews (product_id, reviewer_name, rating, headline, body, is_featured_home, display_order) values
  (null, 'Aanya', 5.0, 'Beautiful finishing', 'The yarn feels soft, the colors look premium, and the packaging made it feel like a thoughtful little gift.', true, 1),
  (null, 'Rohit', 5.0, 'Easy to browse', 'I found a gift in minutes. The categories are clear and the product cards gave me enough confidence to order quickly.', true, 2),
  (null, 'Mira', 4.9, 'Custom order was smooth', 'I shared a reference image and the team replied with helpful suggestions. The final crochet piece felt truly personal.', true, 3),
  ((select id from public.products where slug = 'scrunchies'), 'Sana', 5.0, 'Soft and polished', 'Feels soft and does not tug at all.', false, 1),
  ((select id from public.products where slug = 'scrunchies'), 'Neha', 4.8, 'Boutique finish', 'Looks boutique and the blush tone is gorgeous.', false, 2),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'Krisha', 4.8, 'Lovely contrast', 'The contrast colors make it stand out immediately.', false, 1),
  ((select id from public.products where slug = 'double-color-scrunchies'), 'Juhi', 5.0, 'Looks better in person', 'Looks even better in person than on the card.', false, 2),
  ((select id from public.products where slug = 'keychains'), 'Pooja', 5.0, 'Sweet little gift', 'Such a sweet little gift, beautifully finished.', false, 1),
  ((select id from public.products where slug = 'keychains'), 'Riya', 5.0, 'Charming detail', 'The handmade feel really comes through.', false, 2),
  ((select id from public.products where slug = 'flowers'), 'Mitali', 5.0, 'Forever bouquet', 'A beautiful alternative to fresh flowers.', false, 1),
  ((select id from public.products where slug = 'flowers'), 'Anvi', 4.8, 'Detailed petals', 'The petals feel detailed and premium.', false, 2),
  ((select id from public.products where slug = 'hair-clips'), 'Tara', 4.8, 'Playful and neat', 'My daughter loved the texture and colors.', false, 1),
  ((select id from public.products where slug = 'hair-clips'), 'Diya', 4.7, 'Very neat stitching', 'Very neat stitching for a small accessory.', false, 2),
  ((select id from public.products where slug = 'hair-bands'), 'Arohi', 4.8, 'Easy to wear', 'Easy to wear and looks very polished.', false, 1),
  ((select id from public.products where slug = 'hair-bands'), 'Megha', 4.9, 'Handcrafted texture', 'The handcrafted texture stands out beautifully.', false, 2),
  ((select id from public.products where slug = 'winter-clothes'), 'Harsh', 5.0, 'Warm right away', 'The weave looks rich and feels warm right away.', false, 1),
  ((select id from public.products where slug = 'winter-clothes'), 'Kian', 4.9, 'Beautiful texture', 'Beautiful texture and neat construction.', false, 2),
  ((select id from public.products where slug = 'gifting-products'), 'Lina', 5.0, 'Solved gifting fast', 'This solved gifting for me in one tap.', false, 1),
  ((select id from public.products where slug = 'gifting-products'), 'Vani', 5.0, 'Thoughtful bundle', 'The bundle looked thoughtful and premium.', false, 2),
  ((select id from public.products where slug = 'crochet-bow'), 'Inaaya', 4.8, 'Adorable look', 'Looks adorable and holds shape really well.', false, 1),
  ((select id from public.products where slug = 'crochet-bow'), 'Misha', 4.9, 'Lovely finishing', 'Sweet design and lovely finishing.', false, 2);
