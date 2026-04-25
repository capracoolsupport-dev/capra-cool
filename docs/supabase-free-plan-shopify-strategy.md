# Shopify Folder Strategy On Supabase Free

This project currently has a local `Shopify/` folder with:

- `243` files
- about `551 MB` total media
- several single files between `10 MB` and `17 MB`

That size is workable on Supabase Free only if we keep Postgres for metadata and use Storage very carefully.

## Current Supabase limits to design around

Official docs:

- Database size: `500 MB` per free project, with free projects entering read-only mode above that limit.
  https://supabase.com/docs/guides/platform/database-size
- Storage size: `1 GB` on the Free plan.
  https://supabase.com/docs/guides/platform/billing-on-supabase
- Bandwidth: the storage bandwidth doc says free organizations get `10 GB` total bandwidth split as `5 GB cached + 5 GB uncached`.
  https://supabase.com/docs/guides/storage/serving/bandwidth
- Max file size on Free Storage: `50 MB` per file.
  https://supabase.com/docs/guides/storage/uploads/file-limits
- Storage image transformations are not included on the Free plan.
  https://supabase.com/docs/guides/platform/billing-on-supabase

## Best way to use the Shopify folder in this app

Use Supabase like this:

1. Keep product metadata in Postgres.
2. Keep only optimized website images in Supabase Storage.
3. Keep original full-resolution source images outside Supabase Free.

For this app, that means:

- `categories`, `products`, `product_media`, `reviews`, and store content stay in Postgres.
- `product_media.storage_path` should point to compressed images in the `product-media` bucket.
- The website should load only one primary image for listing cards.
- Product pages should lazy-load the rest of the gallery.
- Originals should stay in your local archive, Google Drive, or another external asset store.

## Why raw uploads are a bad fit

If you upload the current folder as-is:

- you immediately consume roughly half of the free storage quota
- every page view downloads very large images
- the free bandwidth quota becomes the bottleneck before the database does
- you cannot rely on Supabase to transform images on the fly on the Free plan

## Recommended folder-to-catalog model

Treat each top-level folder under `Shopify/` as a collection source, for example:

- `Scrunchies`
- `Double color scrunchie`
- `Bag Charm`
- `bow clips`
- `flower`
- `hair band`
- `Gajra`
- `TOP`

Then map content like this:

- One `category` row for each website category you want customers to browse.
- One `product` row for each sellable product or product family.
- Multiple `product_media` rows for each product gallery.

Example:

- Product: `Lavender Scrunchie`
- Category: `Scrunchies`
- Media rows: `lav1.webp`, `lav2.webp`, `lav3.webp`

Do not create one database row per image file unless the image is actually a separate sellable product.

## Free-plan-safe media workflow

Before upload:

1. Resize originals offline.
2. Convert to WebP where possible.
3. Keep only `1` card image and `2-4` gallery images per product.
4. Target roughly `200 KB` to `400 KB` for card images.
5. Target roughly `500 KB` to `900 KB` for product gallery images.

Practical target:

- keep total uploaded storefront media below about `300 MB` to `400 MB`
- keep the rest as offline archive

That leaves room for:

- new uploads
- request-media files from custom orders
- normal bandwidth spikes

## What to avoid on Supabase Free

- Do not store image binaries inside Postgres rows or JSON.
- Do not upload every original file version.
- Do not serve multi-megabyte PNGs directly on listing pages.
- Do not fetch the full catalog with every image on the first screen.

## Recommended rollout for this repo

1. Run [rebuild_from_scratch.sql](/c:/Users/hp/E-Commerce%20Website/supabase/rebuild_from_scratch.sql).
2. Run [shopify_catalog_seed.sql](/c:/Users/hp/E-Commerce%20Website/supabase/shopify_catalog_seed.sql) for the processed real catalog.
3. Upload the optimized files from `Shopify_optimized/product-media/` into the Supabase `product-media` bucket.
4. Use [seed.sql](/c:/Users/hp/E-Commerce%20Website/supabase/seed.sql) only if you want starter/demo content instead of the Shopify-derived catalog.
5. Keep admin access controlled with either `admin_dev_access.sql` or `admin_production_access.sql`.

## Generated outputs in this repo

The terminal processing step generated:

- [shopify_catalog_seed.sql](/c:/Users/hp/E-Commerce%20Website/supabase/shopify_catalog_seed.sql)
- [shopify-import-report.md](/c:/Users/hp/E-Commerce%20Website/docs/shopify-import-report.md)
- optimized media under `Shopify_optimized/product-media/`

Current processed result:

- `89` products
- `227` optimized images
- about `27.11 MB` optimized media output

## Good long-term option

If you expect the full catalog and original media to keep growing, the cheapest stable setup is:

- Supabase Free for database and forms
- external image CDN or object storage for heavy media
- Supabase Storage only for a trimmed, optimized working set

That gives you a much better chance of staying inside the free quota while keeping the site fast.
