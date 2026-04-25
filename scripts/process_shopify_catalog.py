from __future__ import annotations

import hashlib
import json
import re
import shutil
from collections import OrderedDict
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SHOPIFY_DIR = ROOT / "Shopify"
OPTIMIZED_ROOT = ROOT / "Shopify_optimized" / "product-media"
SQL_OUTPUT = ROOT / "supabase" / "shopify_catalog_seed.sql"
REPORT_OUTPUT = ROOT / "docs" / "shopify-import-report.md"

MAX_IMAGES_PER_PRODUCT = 5
MAX_DIMENSION = 1600
TARGET_MAX_BYTES = 900_000
QUALITY_STEPS = (82, 78, 74, 70, 66, 62)

CATEGORY_CONFIG = OrderedDict(
    [
        (
            "bag",
            {
                "slug": "bags",
                "name": "Bags",
                "short_label": "BG",
                "accent_color": "#9b6a46",
                "tint_color": "#f4e3d5",
                "price_inr": 1499,
                "highlights": ["Handmade yarnwork", "Roomy everyday carry", "Statement crochet texture"],
            },
        ),
        (
            "Bag Charm",
            {
                "slug": "bag-charms",
                "name": "Bag Charms",
                "short_label": "BC",
                "accent_color": "#d38a6b",
                "tint_color": "#f9e6dc",
                "price_inr": 299,
                "highlights": ["Giftable mini format", "Playful bag styling", "Handmade crochet detail"],
            },
        ),
        (
            "bow clips",
            {
                "slug": "bow-clips",
                "name": "Bow Clips",
                "short_label": "BW",
                "accent_color": "#ba6d8d",
                "tint_color": "#f7e1ea",
                "price_inr": 259,
                "highlights": ["Lightweight clip base", "Soft bow silhouette", "Easy everyday styling"],
            },
        ),
        (
            "Case Cover",
            {
                "slug": "case-covers",
                "name": "Case Covers",
                "short_label": "CC",
                "accent_color": "#5072a7",
                "tint_color": "#dce8f8",
                "price_inr": 349,
                "highlights": ["Protective handmade layer", "Soft crochet finish", "Portable everyday use"],
            },
        ),
        (
            "Cleture",
            {
                "slug": "claw-clips",
                "name": "Claw Clips",
                "short_label": "CL",
                "accent_color": "#5d6d7e",
                "tint_color": "#e2e8ed",
                "price_inr": 329,
                "highlights": ["Crochet-wrapped clip", "Strong hold styling", "Statement accessory"],
            },
        ),
        (
            "combo",
            {
                "slug": "combo-sets",
                "name": "Combo Sets",
                "short_label": "CM",
                "accent_color": "#c57d48",
                "tint_color": "#fae5d3",
                "price_inr": 699,
                "highlights": ["Curated product pairing", "Gift-ready presentation", "Better value set"],
            },
        ),
        (
            "Double color scrunchie",
            {
                "slug": "double-color-scrunchies",
                "name": "Double Color Scrunchies",
                "short_label": "DS",
                "accent_color": "#7f6bb2",
                "tint_color": "#ece6f8",
                "price_inr": 429,
                "highlights": ["Dual-tone color story", "Soft elastic core", "Boutique handmade finish"],
            },
        ),
        (
            "flower",
            {
                "slug": "flowers",
                "name": "Flowers",
                "short_label": "FL",
                "accent_color": "#d76d8a",
                "tint_color": "#fde3ea",
                "price_inr": 599,
                "highlights": ["Long-lasting keepsake", "Decor-ready styling", "Thoughtful gifting pick"],
            },
        ),
        (
            "Gajra",
            {
                "slug": "gajra",
                "name": "Gajra",
                "short_label": "GJ",
                "accent_color": "#c68d5b",
                "tint_color": "#f7eadf",
                "price_inr": 499,
                "highlights": ["Festive styling", "Soft floral texture", "Hand-finished crochet detail"],
            },
        ),
        (
            "hair band",
            {
                "slug": "hair-bands",
                "name": "Hair Bands",
                "short_label": "HB",
                "accent_color": "#8f78c4",
                "tint_color": "#ece6fa",
                "price_inr": 389,
                "highlights": ["Comfort-first fit", "Boutique headband styling", "Soft yarn texture"],
            },
        ),
        (
            "hair tie",
            {
                "slug": "hair-ties",
                "name": "Hair Ties",
                "short_label": "HT",
                "accent_color": "#d6a151",
                "tint_color": "#faedcf",
                "price_inr": 249,
                "highlights": ["Gentle on hair", "Handmade floral detail", "Easy everyday wear"],
            },
        ),
        (
            "kaychain",
            {
                "slug": "keychains",
                "name": "Keychains",
                "short_label": "KC",
                "accent_color": "#4d8a7a",
                "tint_color": "#ddf1eb",
                "price_inr": 299,
                "highlights": ["Pocket-friendly format", "Cute gift add-on", "Durable handmade charm"],
            },
        ),
        (
            "Others",
            {
                "slug": "bookmarks",
                "name": "Bookmarks",
                "short_label": "BM",
                "accent_color": "#6f5b7a",
                "tint_color": "#ece3f0",
                "price_inr": 199,
                "highlights": ["Lightweight keepsake", "Cute reading accessory", "Handmade gifting extra"],
            },
        ),
        (
            "Scrunchies",
            {
                "slug": "scrunchies",
                "name": "Scrunchies",
                "short_label": "SC",
                "accent_color": "#d67a7a",
                "tint_color": "#fbe4e4",
                "price_inr": 349,
                "highlights": ["Soft everyday hold", "Gift-ready accessory", "Handmade texture"],
            },
        ),
        (
            "TOP",
            {
                "slug": "tops",
                "name": "Tops",
                "short_label": "TP",
                "accent_color": "#718f47",
                "tint_color": "#e6f0d9",
                "price_inr": 1499,
                "highlights": ["Statement handmade wear", "Soft yarn structure", "Boutique styling"],
            },
        ),
    ]
)

TOKEN_REPLACEMENTS = {
    "armygreen": "army green",
    "blushred": "blush red",
    "darkblue": "dark blue",
    "mintgreen": "mint green",
    "whitelavender": "white lavender",
    "dpink": "dark pink",
    "lpink": "light pink",
    "yello": "yellow",
    "yell": "yellow",
    "sunflo": "sunflower",
    "sunfl": "sunflower",
    "sunflow": "sunflower",
    "lav": "lavender",
    "purp": "purple",
}

CATEGORY_NOUNS = {
    "bags": "crochet bag",
    "bag-charms": "bag charm",
    "bow-clips": "bow clip",
    "case-covers": "case cover",
    "claw-clips": "claw clip",
    "combo-sets": "combo set",
    "double-color-scrunchies": "double color scrunchie",
    "flowers": "crochet flower arrangement",
    "gajra": "gajra piece",
    "hair-bands": "hair band",
    "hair-ties": "hair tie",
    "keychains": "keychain",
    "bookmarks": "bookmark",
    "scrunchies": "scrunchie",
    "tops": "crochet top",
}


def slugify(value: str) -> str:
    return re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9]+", "-", value.lower())).strip("-")


def sql_quote(value: str | None) -> str:
    if value is None:
        return "null"
    return "'" + value.replace("'", "''") + "'"


def sql_json(value: list[str]) -> str:
    return sql_quote(json.dumps(value, ensure_ascii=True))


def normalize_text(value: str) -> str:
    lowered = value.lower().strip()
    lowered = re.sub(r"\s*\(\d+\)$", "", lowered)
    lowered = lowered.replace("_", " ").replace("-", " ")
    lowered = re.sub(r"(?<=\D)\d+$", "", lowered)
    lowered = re.sub(r"\b\d+\b$", "", lowered)
    lowered = re.sub(r"\s+", " ", lowered).strip()
    return " ".join(TOKEN_REPLACEMENTS.get(token, token) for token in lowered.split())


def humanize_words(value: str) -> str:
    tokens = []
    for token in value.split():
        replaced = TOKEN_REPLACEMENTS.get(token, token)
        if replaced == "and":
            tokens.append("&")
        else:
            tokens.append(replaced.title())
    return " ".join(tokens).replace(" & ", " & ")


def category_key(path: Path) -> str:
    return path.name


def group_key_for_file(folder_name: str, relative_path: Path) -> str:
    if len(relative_path.parts) > 1:
        key = normalize_text(relative_path.parts[0])
    else:
        key = normalize_text(relative_path.stem)

    if folder_name == "bag":
        return "sun bag"
    if folder_name == "Cleture" and key in {"sunfl", "sunflo"}:
        return "sunflower"
    if folder_name == "hair tie":
        return "sunflower"
    if folder_name == "flower" and key.startswith("flo pot"):
        return "flower pot"
    if folder_name == "flower" and key.startswith("sunflower daisy bouquet"):
        return "sunflower daisy bouquet"
    if folder_name == "flower" and key.startswith("yellow double sunflower bouquet"):
        return "yellow double sunflower bouquet"
    if folder_name == "bow clips" and key == "blue clip":
        return "blue bow clip"
    if folder_name == "bow clips" and key == "red clip":
        return "red bow clip"
    if folder_name == "kaychain" and key == "sun":
        return "sunflower"
    return key


def title_for_group(folder_name: str, group_key: str, index: int) -> str:
    if folder_name == "bag":
        return "Sun Bag"
    if folder_name == "Bag Charm":
        return humanize_words(group_key)
    if folder_name == "bow clips":
        if group_key.startswith("ruid"):
            return f"Assorted Bow Clip {index:02d}"
        return humanize_words(group_key)
    if folder_name == "Case Cover":
        return f"Case Cover {index:02d}"
    if folder_name == "Cleture":
        return f"{humanize_words(group_key)} Claw Clip"
    if folder_name == "combo":
        return f"Combo Set {index:02d}"
    if folder_name == "Double color scrunchie":
        return f"{humanize_words(group_key).replace(' ', ' & ', 1)} Double Color Scrunchie"
    if folder_name == "flower":
        title = humanize_words(group_key)
        if title == "Flower Pot":
            return "Flower Pot"
        if title == "Lilly":
            return "Lily Bouquet"
        if "Bouquet" in title:
            return title
        if "Rose" in title:
            return title
        if "Sunflower" in title:
            return f"{title} Bouquet"
        return title
    if folder_name == "Gajra":
        return humanize_words(group_key)
    if folder_name == "hair band":
        if group_key == "combo2hero":
            return "Hair Band Combo"
        return f"{humanize_words(group_key)} Hair Band"
    if folder_name == "hair tie":
        return "Sunflower Hair Tie"
    if folder_name == "kaychain":
        if group_key == "face":
            return "Face Keychain"
        if "bow" in group_key:
            return f"{humanize_words(group_key)} Keychain"
        return f"{humanize_words(group_key)} Keychain"
    if folder_name == "Others":
        return f"Bookmark {index:02d}"
    if folder_name == "Scrunchies":
        title = humanize_words(group_key)
        if "Pack" in title:
            return "Scrunchie Pack"
        return f"{title} Scrunchie"
    if folder_name == "TOP":
        return humanize_words(group_key)
    return humanize_words(group_key)


def product_tagline(category_name: str) -> str:
    return f"Handmade {category_name.lower()} with a gift-ready finish."


def product_description(title: str, category_slug: str) -> str:
    noun = CATEGORY_NOUNS[category_slug]
    return (
        f"{title} is a handmade {noun} designed to feel polished, giftable, and easy to style. "
        f"It keeps the warmth of crochet while staying practical for everyday use, gifting, or festive moments."
    )


def product_highlights(category_config: dict[str, object]) -> list[str]:
    return list(category_config["highlights"])  # type: ignore[arg-type]


def sql_insert_list(rows: list[str]) -> str:
    return ",\n".join(rows)


def process_image(source_path: Path, output_path: Path) -> int:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as image:
        image = ImageOps.exif_transpose(image)
        if max(image.size) > MAX_DIMENSION:
            ratio = MAX_DIMENSION / max(image.size)
            image = image.resize(
                (max(1, int(image.size[0] * ratio)), max(1, int(image.size[1] * ratio))),
                Image.Resampling.LANCZOS,
            )

        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

        best_bytes = None
        best_quality = QUALITY_STEPS[-1]
        for quality in QUALITY_STEPS:
            buffer = BytesIO()
            image.save(buffer, format="WEBP", quality=quality, method=6)
            payload = buffer.getvalue()
            best_bytes = payload
            best_quality = quality
            if len(payload) <= TARGET_MAX_BYTES:
                break

        output_path.write_bytes(best_bytes or b"")
        return output_path.stat().st_size


def hashed_file(path: Path) -> str:
    digest = hashlib.sha1()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def collect_products() -> tuple[list[dict[str, object]], int]:
    products: list[dict[str, object]] = []
    original_total = 0

    for category_order, (folder_name, category_cfg) in enumerate(CATEGORY_CONFIG.items(), start=1):
        folder_path = SHOPIFY_DIR / folder_name
        if not folder_path.exists():
            continue

        grouped: OrderedDict[str, list[Path]] = OrderedDict()
        for file_path in sorted(folder_path.rglob("*")):
            if not file_path.is_file():
                continue
            if file_path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                continue
            relative = file_path.relative_to(folder_path)
            group_key = group_key_for_file(folder_name, relative)
            grouped.setdefault(group_key, []).append(file_path)

        group_items = list(grouped.items())
        fallback_index = 1
        for group_index, (group_key, file_paths) in enumerate(group_items, start=1):
            title_index = group_index
            if group_key.startswith("ruid"):
                title_index = fallback_index
                fallback_index += 1
            title = title_for_group(folder_name, group_key, title_index)
            slug = slugify(title)

            deduped_files: list[Path] = []
            seen_hashes: set[str] = set()
            for file_path in file_paths:
                file_hash = hashed_file(file_path)
                if file_hash in seen_hashes:
                    continue
                seen_hashes.add(file_hash)
                deduped_files.append(file_path)

            deduped_files = deduped_files[:MAX_IMAGES_PER_PRODUCT]
            original_total += sum(path.stat().st_size for path in deduped_files)

            products.append(
                {
                    "category_order": category_order,
                    "category": category_cfg,
                    "folder_name": folder_name,
                    "title": title,
                    "slug": slug,
                    "media_sources": deduped_files,
                }
            )

    seen_slugs: dict[str, int] = {}
    for product in products:
        base_slug = product["slug"]  # type: ignore[assignment]
        next_index = seen_slugs.get(base_slug, 0) + 1
        seen_slugs[base_slug] = next_index
        if next_index > 1:
            product["slug"] = f"{base_slug}-{next_index}"
            product["title"] = f"{product['title']} Variant {next_index}"

    return products, original_total


def build_outputs() -> dict[str, object]:
    products, original_total = collect_products()
    optimized_total = 0

    shopify_output_root = OPTIMIZED_ROOT / "shopify"
    if shopify_output_root.exists():
        shutil.rmtree(shopify_output_root)

    for product_index, product in enumerate(products, start=1):
        category_cfg = product["category"]  # type: ignore[assignment]
        category_slug = category_cfg["slug"]  # type: ignore[index]
        product["display_order"] = product_index
        product["is_featured_home"] = product_index <= 8
        product["featured_rank"] = product_index if product_index <= 8 else None
        product["price_inr"] = category_cfg["price_inr"]  # type: ignore[index]
        product["stock_quantity"] = 10
        product["tagline"] = product_tagline(category_cfg["name"])  # type: ignore[index]
        product["description"] = product_description(product["title"], category_slug)  # type: ignore[arg-type]
        product["highlights"] = product_highlights(category_cfg)
        product["badge_text"] = category_cfg["name"]  # type: ignore[index]

        media_rows = []
        media_sources = product["media_sources"]  # type: ignore[assignment]
        for media_index, source_path in enumerate(media_sources, start=1):
            storage_path = f"shopify/{category_slug}/{product['slug']}/{media_index:02d}.webp"
            output_path = OPTIMIZED_ROOT / storage_path
            optimized_total += process_image(source_path, output_path)
            media_rows.append(
                {
                    "storage_path": storage_path,
                    "alt_text": f"{product['title']} image {media_index}",
                    "sort_order": media_index,
                    "is_primary": media_index == 1,
                }
            )
        product["media"] = media_rows

    write_sql(products)
    write_report(products, original_total, optimized_total)

    return {
        "product_count": len(products),
        "category_count": len(CATEGORY_CONFIG),
        "image_count": sum(len(product["media"]) for product in products),
        "original_total": original_total,
        "optimized_total": optimized_total,
    }


def write_sql(products: list[dict[str, object]]) -> None:
    category_rows = []
    for display_order, (_, category_cfg) in enumerate(CATEGORY_CONFIG.items(), start=1):
        category_rows.append(
            f"  ({sql_quote(category_cfg['slug'])}, {sql_quote(category_cfg['name'])}, {sql_quote(category_cfg['short_label'])}, "
            f"{sql_quote(category_cfg['accent_color'])}, {sql_quote(category_cfg['tint_color'])}, {display_order})"
        )

    product_rows = []
    media_rows = []
    for product in products:
        category_cfg = product["category"]  # type: ignore[assignment]
        product_rows.append(
            "  ((select id from public.categories where slug = {category_slug}), {slug}, {title}, {price}, {stock}, 0.0, 0, null, {tagline}, {description}, {highlights}::jsonb, {badge}, {featured}, {rank}, {display_order})".format(
                category_slug=sql_quote(category_cfg["slug"]),  # type: ignore[index]
                slug=sql_quote(product["slug"]),  # type: ignore[arg-type]
                title=sql_quote(product["title"]),  # type: ignore[arg-type]
                price=product["price_inr"],
                stock=product["stock_quantity"],
                tagline=sql_quote(product["tagline"]),  # type: ignore[arg-type]
                description=sql_quote(product["description"]),  # type: ignore[arg-type]
                highlights=sql_json(product["highlights"]),  # type: ignore[arg-type]
                badge=sql_quote(product["badge_text"]),  # type: ignore[arg-type]
                featured=str(product["is_featured_home"]).lower(),
                rank="null" if product["featured_rank"] is None else product["featured_rank"],
                display_order=product["display_order"],
            )
        )

        for media in product["media"]:  # type: ignore[index]
            media_rows.append(
                "  ((select id from public.products where slug = {product_slug}), 'image', 'product-media', {storage_path}, null, {alt_text}, {sort_order}, {is_primary})".format(
                    product_slug=sql_quote(product["slug"]),  # type: ignore[arg-type]
                    storage_path=sql_quote(media["storage_path"]),  # type: ignore[index]
                    alt_text=sql_quote(media["alt_text"]),  # type: ignore[index]
                    sort_order=media["sort_order"],  # type: ignore[index]
                    is_primary=str(media["is_primary"]).lower(),  # type: ignore[index]
                )
            )

    sql = f"""-- Generated by scripts/process_shopify_catalog.py
-- Source folder: Shopify/
-- Placeholder prices and stock values were inferred automatically.
-- Review these values before production use.
-- Upload the processed files from Shopify_optimized/product-media/ into the
-- Supabase storage bucket named product-media, preserving the folder structure.

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
  'Loop & Love',
  'Handmade Crochet Studio',
  'hello@loopandlove.in',
  '+91 90000 00000',
  'Bengaluru, India',
  'Monday to Saturday, 10 AM to 7 PM',
  'https://www.instagram.com/',
  'https://www.facebook.com/',
  'Handmade crochet collected from your Shopify catalog',
  'A real crochet catalog, processed locally and prepared for a lightweight storefront.',
  'This catalog is built from your local Shopify folder so you can relaunch the website on Supabase without manually entering every product from scratch.',
  'Browse Collection',
  '/#featured',
  'Create Custom Order',
  '/customize',
  jsonb_build_array(
    jsonb_build_object('value', '{len(products)}', 'label', 'products imported'),
    jsonb_build_object('value', '{sum(len(product["media"]) for product in products)}', 'label', 'optimized images ready'),
    jsonb_build_object('value', 'Supabase', 'label', 'catalog prepared for relaunch')
  ),
  'Catalog',
  'A processed handmade collection prepared from the Shopify source folder.',
  'The current storefront uses optimized media paths and generated catalog rows so you can relaunch first, then refine prices, stock, and copy from the admin panel.',
  '',
  '',
  'Handmade crochet made easier to browse, manage, and relaunch.',
  'Loop & Love brings your existing product photography into one Supabase-ready catalog so the storefront can be rebuilt without re-entering each item manually.',
  'The imported collection keeps the raw craftsmanship visible while staying practical for a free-tier hosting setup through optimized images and structured product rows.',
  'Upload only optimized gallery assets, keep originals offline, and refine pricing and stock from the admin before launch.',
  'Need a custom crochet piece instead?',
  'Use the custom order form to collect colors, ideas, and reference images in one place.',
  'Have a question about a product or order?',
  'Reach out through the contact form and manage incoming messages from the admin dashboard.'
);

insert into public.categories (slug, name, short_label, accent_color, tint_color, display_order) values
{sql_insert_list(category_rows)};

insert into public.announcements (message, display_order) values
  ('Optimized Shopify catalog imported for relaunch', 1),
  ('Review prices and stock before going live', 2),
  ('Upload processed media to the product-media bucket', 3);

insert into public.trust_badges (title, detail, icon_name, display_order) values
  ('Handmade Finish', 'Each listing comes from your real crochet catalog and can be refined further in admin.', 'yarn', 1),
  ('Optimized Media', 'Images are prepared for a lighter storefront and better free-tier usage.', 'check', 2),
  ('Easy Relaunch', 'Database structure, products, and media paths are ready to reuse.', 'support', 3);

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
) values
{sql_insert_list(product_rows)};

insert into public.product_media (
  product_id,
  media_kind,
  bucket_name,
  storage_path,
  public_url,
  alt_text,
  sort_order,
  is_primary
) values
{sql_insert_list(media_rows)};
"""

    SQL_OUTPUT.write_text(sql, encoding="utf-8", newline="\n")


def write_report(products: list[dict[str, object]], original_total: int, optimized_total: int) -> None:
    def to_mb(size: int) -> str:
        return f"{size / (1024 * 1024):.2f} MB"

    REPORT_OUTPUT.write_text(
        "\n".join(
            [
                "# Shopify Import Report",
                "",
                f"- Products generated: `{len(products)}`",
                f"- Categories generated: `{len(CATEGORY_CONFIG)}`",
                f"- Optimized media files: `{sum(len(product['media']) for product in products)}`",
                f"- Original source size used for import: `{to_mb(original_total)}`",
                f"- Optimized export size: `{to_mb(optimized_total)}`",
                "",
                "## Outputs",
                "",
                f"- SQL seed: `{SQL_OUTPUT.relative_to(ROOT).as_posix()}`",
                f"- Optimized media root: `{OPTIMIZED_ROOT.relative_to(ROOT).as_posix()}`",
                "",
                "## Important",
                "",
                "- Prices and stock were inferred automatically and should be reviewed before launch.",
                "- The generated SQL uses `storage_path` values, so upload the optimized files into the Supabase `product-media` bucket with the same folder structure.",
                "- Original Shopify files remain unchanged.",
            ]
        )
        + "\n",
        encoding="utf-8",
        newline="\n",
    )


if __name__ == "__main__":
    if not SHOPIFY_DIR.exists():
        raise SystemExit("Shopify/ folder was not found.")

    summary = build_outputs()
    print(json.dumps(summary, indent=2))
