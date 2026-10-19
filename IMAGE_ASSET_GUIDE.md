# CAPRA COOL image library

The user-requested export is at `C:\Users\hp\OneDrive\Desktop\App Image\Website Assets`. Existing files in App Image are preserved.

- Campus: eleven named IIT Mandi product mockups. Earlier institute artwork is under Campus/Archive.
- Handmade: the original knit and keepsake images.
- Brand: existing CAPRA COOL catalog and lifestyle sources, retained separately.
- Logos: the new monochrome campus mountain mark and separate monochrome ibex mark, SVG originals, transparent PNG exports and wordmark lockups. Original multicolour artwork is retained under Logos/Originals.
- Editorial: two new generated collection styling concepts. These do not replace the original product mockups or document actual manufacturing.
- Web-ready: optimized WebP and AVIF variants.
- Archive: existing experimental/cropped source material, kept apart from active catalog imagery.

`image-manifest.json` maps every exported filename back to its project source. Hyphens replace underscores in exported filenames. Existing destination files are never overwritten by the export script.

Campus and Handmade remain separate destinations. The Campus header uses the original mountain identity; the Brand and Handmade headers use the simplified ibex. Header layout and navigation stay consistent. Marks are single-colour with transparent backgrounds; original garment artwork is preserved.

## New assets and generation

Built-in imagegen was used for the two raster editorials. Logo SVGs were edited directly and PNG exports rendered with Sharp. Project files:

- `assets/editorial/campus-collection-editorial.png`
- `assets/editorial/handmade-knits-editorial.png`
- `assets/identity/campus-mountain-monochrome.svg`
- `assets/identity/capra-ibex-monochrome.svg`

### Campus editorial prompt

Create one photorealistic editorial merchandise photograph for a minimal college campus clothing website, landscape 1536x1024. Reference images are garment design references; preserve black hoodie and maroon cream polo colours, silhouette and back artwork. Show only the BACK of one black hoodie and BACK of one maroon polo, neatly hanging side by side on simple wooden hangers from a matte dark metal rail. Their cream back graphics read exactly 'IIT MANDI', with the existing mountain design underneath; retain tiny tagline only if accurately possible. Do not show or invent chest emblems. Calm light warm-grey studio wall, soft natural window light, honest cotton and fleece texture, restrained collegiate look, balanced large garment silhouettes, no people, no props other than rail, no graphic overlays, no extra logos, no discount or title text, no institutional building or claims of endorsement. This is a collection editorial, not a change to the product design. Keep all garment hems visible, clean high-quality photography.

References: `assets/campus/mandi-mountain-hoodie.png`, `assets/campus/mandi-maroon-polo.png`.

### Handmade editorial prompt

Create one photorealistic editorial still-life for a restrained handmade knits and keepsakes ecommerce section. Landscape 1536x1024. Reference 1 is the exact burgundy crocheted fringed muffler design. Reference 2 is the exact yellow sunflower crochet keychain with green centre, green leaf and gold ring. Preserve their colours, crochet texture and recognizable shapes, no invented accessories for sale. Place the folded burgundy muffler on a light natural oak table, fringe draping gently over the front edge. Place the sunflower keychain clearly beside it. Soft warm natural side light, off-white plaster wall, quietly tactile, realistic yarn fibres, no person, no hands, no text, no logos, no packaging, no tools, no artificial bokeh, no collage. Leave a little empty breathing room around the objects; they should occupy the central two thirds and remain fully visible. This is a styled collection concept, not evidence of actual manufacturing.

References: `assets/handmade-muffler.jpg`, `assets/sunflower-keychain.jpg`.
