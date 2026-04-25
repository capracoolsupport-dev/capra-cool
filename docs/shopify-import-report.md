# Shopify Import Report

- Products generated: `89`
- Categories generated: `15`
- Optimized media files: `227`
- Original source size used for import: `475.30 MB`
- Optimized export size: `27.11 MB`

## Outputs

- SQL seed: `supabase/shopify_catalog_seed.sql`
- Optimized media root: `Shopify_optimized/product-media`

## Important

- Prices and stock were inferred automatically and should be reviewed before launch.
- The generated SQL uses `storage_path` values, so upload the optimized files into the Supabase `product-media` bucket with the same folder structure.
- Original Shopify files remain unchanged.
