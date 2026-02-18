import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.blogPost.deleteMany();

  const products = [
    { name: "Predator P3 Revo Shaft - Cobalt Blue", slug: "predator-p3-revo-cobalt-blue", description: "The Predator P3 features a stunning cobalt blue stained Curly Maple forearm and butt sleeve. Combined with the legendary Revo shaft, this cue delivers unmatched power and precision. Premium Irish linen wrap for superior grip and control.", price: 1489, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-p3-maple-bocote-sw-segment-1920x1080.webp","https://9ballshop.com/cdn/shop/files/25-p3-maple-bocote-sw-pin-detail-1920x1080.webp"]), featured: true },
    { name: "Predator P3 Revo Shaft - Burgundy", slug: "predator-p3-revo-burgundy", description: "The Predator P3 in a rich burgundy finish with premium Curly Maple construction. Features the revolutionary Revo carbon fiber shaft for maximum low-deflection performance.", price: 1489, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-p3-maple-bocote-nw-segment-1920x1080-_1.webp","https://9ballshop.com/cdn/shop/files/25-p3-maple-bocote-nw-butt-front-detail-1920x1080_1.webp"]), featured: true },
    { name: "Predator P3 Revo Shaft - Natural", slug: "predator-p3-revo-natural", description: "Clean and classic natural finish P3 with Revo shaft. The natural Curly Maple forearm showcases beautiful wood grain patterns.", price: 1489, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-p3-vietnam-nw-segment-1920x1080.webp","https://9ballshop.com/cdn/shop/files/25-p3-vietnam-nw-pin-detail-1920x1080.webp"]), featured: false },
    { name: "Predator P3 RACER - Black/Yellow", slug: "predator-p3-racer-black-yellow", description: "Bold racing-inspired design with black and yellow accents. Limited P3 RACER edition with Revo shaft included.", price: 1389, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-p3bw-pool-cue-leather-luxe-wrap-1920x1080_1_1.webp","https://9ballshop.com/cdn/shop/files/predator-p3-weight-cartridge-illustration_2.webp"]), featured: false },
    { name: "Predator P3 - Classic Black", slug: "predator-p3-classic-black", description: "Timeless black P3 with premium 314 shaft. The dark aesthetic makes a bold statement at any table.", price: 999, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-p3bn-pool-cue-no-wrap-1920x1080_1.webp","https://9ballshop.com/cdn/shop/files/predator-p3-weight-cartridge-illustration_2_1.webp"]), featured: false },
    { name: "Predator Throne3-1 - Birdseye Maple", slug: "predator-throne3-1-birdseye", description: "The flagship Throne3-1 features exquisite Birdseye Maple with intricate inlay work. Predator's most prestigious cue line. Includes Revo shaft.", price: 2229, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-predator-throne-3-1-main-pool-cue-1920wx1080h-web.webp","https://9ballshop.com/cdn/shop/files/22-predator-throne-3-1-joint-pool-cue-1920wx1080h-web.webp"]), featured: true },
    { name: "Predator Throne3-2 - Dark Stain", slug: "predator-throne3-2-dark", description: "The Throne3-2 combines dark wood stain with premium Birdseye Maple and detailed point work. A masterpiece with Revo 12.4mm shaft.", price: 2129, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-predator-throne-3-2-main-pool-cue-1920wx1080h-web_47fd87f2-386a-4ce1-9e97-cc9501b1c22e.webp","https://9ballshop.com/cdn/shop/files/22-predator-throne-3-2-joint-pool-cue-1920wx1080h-web_0bd7bf47-c909-4758-8003-a55287d97d03.webp"]), featured: true },
    { name: "Predator Throne3-3 - Maple/Ebony", slug: "predator-throne3-3-maple-ebony", description: "Stunning contrast of Maple and Ebony with premium inlays. Revo shaft delivers legendary low-deflection technology.", price: 2029, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-predator-throne-3-3-main-pool-cue-1920wx1080h-web.webp","https://9ballshop.com/cdn/shop/files/22-predator-throne-3-3-butt-pool-cue-1920wx1080h-web.webp"]), featured: false },
    { name: "Predator Throne3-4 - Rosewood", slug: "predator-throne3-4-rosewood", description: "Rich Rosewood construction with detailed point work and premium wrap. Includes Revo shaft.", price: 1829, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-predator-throne-3-4-main-pool-cue-1920wx1080h-web.webp","https://9ballshop.com/cdn/shop/files/22-predator-throne-3-4-butt-pool-cue-1920wx1080h-web.webp"]), featured: false },
    { name: "Predator SP2 Revo - Ember", slug: "predator-sp2-revo-ember", description: "The SP2 REVO in fiery Ember finish. Sport-oriented design with Predator's top-tier Revo carbon fiber shaft.", price: 1149, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-sp2-purp1-segment-1920x1080.webp","https://9ballshop.com/cdn/shop/files/25-pre-sp2-purp1-butt-back-detail-1920x1080.jpg"]), featured: false },
    { name: "Predator SP2 Revo - Ice", slug: "predator-sp2-revo-ice", description: "Cool Ice finish SP2 with the legendary Revo shaft. Sport-inspired design built for serious competitors.", price: 1149, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/Predator-Sport-Ice-SW-1-550x550.jpg","https://9ballshop.com/cdn/shop/files/Predator-Sport-Ice-SW-550x550w.jpg"]), featured: false },
    { name: "Predator SP2 - Forest", slug: "predator-sp2-forest", description: "Forest green SP2 with 314 shaft. Sport-style design with aggressive angles and modern aesthetics.", price: 949, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pred-sp2-seyberts-2-catalogue-lg_web_resize.webp","https://9ballshop.com/cdn/shop/files/25-pred-sp2-seyberts-2-detail-butt-sw.webp"]), featured: false },
    { name: "Predator Sang Lee LE - Dragon", slug: "predator-sang-lee-le-dragon", description: "Limited Edition Sang Lee signature cue with Dragon artwork. Hand-laid Dragon motifs with premium materials. Revo shaft included.", price: 1859, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-le-sanglee2-1-segment-1920x1080_1.webp","https://9ballshop.com/cdn/shop/files/25-pre-le-sanglee2-1-butt-front-detail-1920x1080.webp"]), featured: true },
    { name: "Predator Sang Lee LE - Phoenix", slug: "predator-sang-lee-le-phoenix", description: "Limited Edition Sang Lee Phoenix edition. Intricate Phoenix artwork with premium Birdseye Maple and Revo shaft.", price: 1759, category: "Cues", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-le-sanglee2-2-segment-1920x1080_1.webp","https://9ballshop.com/cdn/shop/files/25-pre-le-sanglee2-2-pin-detail-2920x2080.webp"]), featured: false },
    { name: "BC-16 Low-Deflection Cue", slug: "bc-16-low-deflection-cue", description: "Professional-grade low-deflection cue with advanced carbon fiber technology. Great value for players stepping up.", price: 620, category: "Cues", brand: "BC", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/bc-16-bear-cue-2-550x550.jpg","https://9ballshop.com/cdn/shop/files/bc-16-bear-cue-1-550x550w.jpg"]), featured: false },
    { name: "Sport 2 Playing Cue", slug: "sport-2-playing-cue", description: "Premium sport-oriented cue designed for competitive play with advanced shaft technology.", price: 764, category: "Cues", brand: "Sport", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/Predator_Sport_2-1-550x550.jpg","https://9ballshop.com/cdn/shop/files/Predator_Sport_2-550x550w.jpg"]), featured: false },
    { name: "Mezz Hybrid Pro II Shaft", slug: "mezz-hybrid-pro-ii-shaft", description: "One of the most acclaimed shafts in the industry. Combining traditional maple with advanced carbon technology. 11.75mm tip.", price: 369, category: "Shafts", brand: "Mezz", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/Mezz-cue-2-550x550.jpg","https://9ballshop.com/cdn/shop/files/Mezz-cue-1-550x550w.jpg"]), featured: true },
    { name: "Predator Revo 12.4mm Shaft", slug: "predator-revo-12-4-shaft", description: "The revolutionary Revo shaft. 100% carbon fiber construction delivers zero-deflection performance. The gold standard.", price: 499, category: "Shafts", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/Classic-5-16-18-2-550x550.jpg","https://9ballshop.com/cdn/shop/files/Classic-5-16-18-1-550x550w.jpg"]), featured: true },
    { name: "Predator Revo 12.9mm Shaft", slug: "predator-revo-12-9-shaft", description: "Slightly larger diameter Revo shaft for players who prefer more surface area. Same legendary carbon fiber construction.", price: 499, category: "Shafts", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/T8-quick-release-2-550x550.jpg","https://9ballshop.com/cdn/shop/files/T8-quick-release-1-550x550w.jpg"]), featured: false },
    { name: "Predator 314-3 Shaft", slug: "predator-314-3-shaft", description: "Classic 314-3 maple shaft with 10-piece construction. A favorite among professionals worldwide.", price: 299, category: "Shafts", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/Ag-series-fles-2-550x550.jpg","https://9ballshop.com/cdn/shop/files/Ag-series-fles-1-550x550w.jpg"]), featured: false },
    { name: "Aramith Premium Pool Ball Set", slug: "aramith-premium-pool-ball-set", description: "The standard for professional pool. Made from phenolic resin with superior durability and vibrant colors.", price: 199, category: "Balls", brand: "Aramith", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/1428138000_prenium-550x550w.jpg"]), featured: true },
    { name: "Aramith Super Pro Ball Set", slug: "aramith-super-pro-ball-set", description: "Tournament-grade set used in professional events worldwide. Precision-engineered for perfect roundness and balance.", price: 271, category: "Balls", brand: "Aramith", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/1427909440_suoer_aramith-550x550w.jpg"]), featured: false },
    { name: "Aramith Standard Pool Ball Set", slug: "aramith-standard-pool-ball-set", description: "Quality Aramith balls at an accessible price. Perfect for home tables and recreational play.", price: 134, category: "Balls", brand: "Aramith", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/classic-550x550w.jpg"]), featured: false },
    { name: "Aramith TV Tournament Ball Set", slug: "aramith-tv-tournament-ball-set", description: "Designed for television broadcasts with enhanced color contrast. Used in major televised pool events.", price: 249, category: "Balls", brand: "Aramith", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/71awtx_hVLL._AC_SX569_-550x550w.jpg"]), featured: false },
    { name: "Predator Second Skin Glove - Black/Grey - S/M", slug: "predator-second-skin-black-grey-sm", description: "Ultra-thin Second Skin glove for a natural feel. Breathable material. Left hand.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-second-skin-black-grey-billiard-glove-right-hand-02-1920x1080_cc41807f-70af-4db6-8233-83bdc6941b32.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Black/Grey - L/XL", slug: "predator-second-skin-black-grey-lxl", description: "Larger fit Second Skin glove in black/grey. Ultra-thin premium material. Left hand.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-second-skin-black-grey-billiard-glove-right-hand-02-1920x1080_cc41807f-70af-4db6-8233-83bdc6941b32.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Blue/Black - S/M", slug: "predator-second-skin-blue-black-sm", description: "Vibrant blue with black accents. Thinnest billiard glove on the market.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-secondskin-blue_teal-glove-bridge-1920x1080.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Blue/Black - L/XL", slug: "predator-second-skin-blue-black-lxl", description: "Large/XL blue and black Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-secondskin-blue_teal-glove-bridge-1920x1080.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Red/Black - S/M", slug: "predator-second-skin-red-black-sm", description: "Bold red and black colorway.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-pred-glove-uspbs-red-bridge-1920x1080-web_2_cd301dec-7f75-4a47-933f-42f26d605c7b.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Red/Black - L/XL", slug: "predator-second-skin-red-black-lxl", description: "Large/XL red and black Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-pred-glove-uspbs-red-bridge-1920x1080-web_2_cd301dec-7f75-4a47-933f-42f26d605c7b.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Dark Green - S/M", slug: "predator-second-skin-green-sm", description: "Elegant dark green Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-secondskin-grn_gld-glove-bridge-1920x1080_1_1.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Dark Green - L/XL", slug: "predator-second-skin-green-lxl", description: "Large/XL dark green Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-secondskin-grn_gld-glove-bridge-1920x1080_1_1.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Purple - S/M", slug: "predator-second-skin-purple-sm", description: "Unique purple colorway Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-pred-accessories-second-skin-glove-purple-bridge-1920x1080-web.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Purple - L/XL", slug: "predator-second-skin-purple-lxl", description: "Large/XL purple Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-pred-accessories-second-skin-glove-purple-bridge-1920x1080-web.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Orange - S/M", slug: "predator-second-skin-orange-sm", description: "Bright orange Second Skin glove for high visibility.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-second-skin-black-yellow-billiard-glove-04_1_3.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Orange - L/XL", slug: "predator-second-skin-orange-lxl", description: "Large/XL orange Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-second-skin-black-yellow-billiard-glove-04_1_3.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Yellow - S/M", slug: "predator-second-skin-yellow-sm", description: "Bright yellow Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-second-skin-yellow-billiard-glove-left-hand-02-1920x1080.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Yellow - L/XL", slug: "predator-second-skin-yellow-lxl", description: "Large/XL yellow Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-second-skin-yellow-billiard-glove-left-hand-02-1920x1080.webp"]), featured: false },
    { name: "Predator Second Skin Glove - White - S/M", slug: "predator-second-skin-white-sm", description: "Clean white Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-secondskin-glove-blu_wht-bridge-1920x1080_1.webp"]), featured: false },
    { name: "Predator Second Skin Glove - White - L/XL", slug: "predator-second-skin-white-lxl", description: "Large/XL white Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/25-pre-secondskin-glove-blu_wht-bridge-1920x1080_1.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Pink - S/M", slug: "predator-second-skin-pink-sm", description: "Stylish pink Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-pred-accessories-second-skin-glove-pink-bridge-1920x1080-web.webp"]), featured: false },
    { name: "Predator Second Skin Glove - Pink - L/XL", slug: "predator-second-skin-pink-lxl", description: "Large/XL pink Second Skin glove.", price: 29, category: "Gloves", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/22-pred-accessories-second-skin-glove-pink-bridge-1920x1080-web.webp"]), featured: false },
    { name: "Buffalo Billiard Glove - Black - Left Hand", slug: "buffalo-glove-black-left", description: "Affordable three-finger billiard glove from Buffalo.", price: 17.99, category: "Gloves", brand: "Buffalo", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/buffreversblack-550x550w.jpg"]), featured: false },
    { name: "Buffalo Billiard Glove - Black - Right Hand", slug: "buffalo-glove-black-right", description: "Right-hand version of Buffalo's popular billiard glove.", price: 17.99, category: "Gloves", brand: "Buffalo", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/buffreversblack-550x550w.jpg"]), featured: false },
    { name: "Predator Urbain 2x4 Hard Case - Black", slug: "predator-urbain-2x4-hard-case", description: "Premium hard case holding 2 butts and 4 shafts. Crush-resistant.", price: 189, category: "Cases", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/genuineleather-550x550w_1.jpg"]), featured: false },
    { name: "Standard 1x1 Soft Cue Case - Black", slug: "standard-1x1-soft-case-black", description: "Basic soft case for one butt and one shaft.", price: 12.49, category: "Cases", brand: "Standard", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/laperti-black-cheap-550x550w.jpg"]), featured: false },
    { name: "Standard 1x1 Hard Cue Case - Blue", slug: "standard-1x1-hard-case-blue", description: "Durable hard shell case in blue.", price: 24.99, category: "Cases", brand: "Standard", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/3104.010_main-550x550w.jpg"]), featured: false },
    { name: "Standard 2x2 Soft Cue Case - Black", slug: "standard-2x2-soft-case", description: "Holds two butts and two shafts.", price: 19.99, category: "Cases", brand: "Standard", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/stoxos-550x550w.jpg"]), featured: false },
    { name: "Dominator 9ft Professional Pool Table", slug: "dominator-9ft-pool-table", description: "Tournament-standard 9-foot pool table with Italian slate bed and premium cushions. Includes installation.", price: 3700, category: "Tables", brand: "Dominator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/dominator-blk-1-550x550w.jpg"]), featured: true },
    { name: "Europool Championship Cloth - 9ft - Blue", slug: "europool-cloth-9ft-blue", description: "Professional-grade worsted cloth for 9ft tables.", price: 150, category: "Accessories", brand: "Europool", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/europool-burgundy-550x550w.jpg"]), featured: false },
    { name: "Europool Championship Cloth - 9ft - Green", slug: "europool-cloth-9ft-green", description: "Classic green tournament-grade worsted cloth for 9ft tables.", price: 150, category: "Accessories", brand: "Europool", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/europool-burgundy-550x550w.jpg"]), featured: false },
    { name: "Predator 1080 Pure Chalk - 5 Pack", slug: "predator-1080-pure-chalk-5pack", description: "Premium performance chalk for maximum grip.", price: 39.99, category: "Accessories", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator-550x550w.jpg"]), featured: false },
    { name: "Kamui Roku Chalk - 1 Piece", slug: "kamui-roku-chalk", description: "Ultra-premium chalk from Japan.", price: 29.99, category: "Accessories", brand: "Kamui", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/taomPyroblue-550x550w.jpg"]), featured: false },
    { name: "Master Chalk - Blue - 12 Pack", slug: "master-chalk-blue-12pack", description: "Classic chalk trusted by millions.", price: 8.99, category: "Accessories", brand: "Master", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/masterbluepiece-550x550w.jpg"]), featured: false },
    { name: "Kamui Black Tip - Medium - 14mm", slug: "kamui-black-tip-medium-14mm", description: "Premium Japanese layered tip.", price: 24.99, category: "Accessories", brand: "Kamui", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/kamui-clear-tip-550x550.jpg"]), featured: false },
    { name: "Predator Victory Tip - Medium - 14mm", slug: "predator-victory-tip-medium-14mm", description: "Predator's 8-layer premium pigskin tip.", price: 19.99, category: "Accessories", brand: "Predator", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/predator_tip-550x550_3be6d1c1-68b4-4dea-899c-870e2aff8d72.jpg"]), featured: false },
    { name: "Cue Shaft Cleaner & Conditioner", slug: "shaft-cleaner-conditioner", description: "Professional shaft maintenance solution.", price: 12.99, category: "Accessories", brand: "Q-Wiz", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/s-l400_1_-550x550w.jpg"]), featured: false },
    { name: "Tip Shaper & Scuffer Tool", slug: "tip-shaper-scuffer-tool", description: "Multi-function tip maintenance tool.", price: 9.99, category: "Accessories", brand: "Willard", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/1616328760_6439-550x550w.jpg"]), featured: false },
    { name: "Magnetic Chalk Holder - Gold", slug: "magnetic-chalk-holder-gold", description: "Elegant gold magnetic chalk holder.", price: 14.99, category: "Accessories", brand: "Standard", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/gold-550x550w.jpg"]), featured: false },
    { name: "Joint Protector Set - Black", slug: "joint-protector-set-black", description: "Protect your cue's joint pin and insert.", price: 16.99, category: "Accessories", brand: "Standard", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/5935020-p-550x550w.jpg"]), featured: false },
    { name: "9BallShop Premium T-Shirt - Black", slug: "9ballshop-tshirt-black", description: "Premium cotton t-shirt with 9BallShop logo.", price: 34.99, category: "Apparel", brand: "9BallShop", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/bagiftsetedit-550x550w.jpg"]), featured: false },
    { name: "9BallShop Polo Shirt - Navy", slug: "9ballshop-polo-navy", description: "Professional polo shirt for tournament play.", price: 49.99, category: "Apparel", brand: "9BallShop", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/bagiftsetedit-550x550w.jpg"]), featured: false },
    { name: "9BallShop Cap - Black/Gold", slug: "9ballshop-cap-black-gold", description: "Stylish snapback cap with gold embroidery.", price: 24.99, category: "Apparel", brand: "9BallShop", images: JSON.stringify(["https://9ballshop.com/cdn/shop/files/bagiftsetedit-550x550w.jpg"]), featured: false },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`Seeded ${products.length} products`);

  const blogPosts = [
    {
      title: "7 Ways to Mentally Prepare for a High Performance Activity",
      slug: "7-ways-mentally-prepare-high-performance",
      excerpt: "Mental preparation is the difference between good and great performance. Here are 7 proven strategies I use before every major competition.",
      content: `# 7 Ways to Mentally Prepare for a High Performance Activity

Whether you're about to compete in a major pool tournament, give a keynote speech, or face any high-stakes situation, mental preparation is what separates the good from the great.

## 1. Visualization

Before any big match, I spend 15-20 minutes visualizing every aspect of the game. I see myself walking to the table with confidence, executing perfect shots, and handling pressure moments with calm precision.

**How to do it:** Find a quiet place, close your eyes, and run through your performance from start to finish.

## 2. Controlled Breathing

Box breathing: inhale for 4 seconds, hold for 4, exhale for 4, hold for 4. This activates your parasympathetic nervous system.

## 3. Pre-Performance Routine

Develop a consistent routine you follow before every performance. The routine creates a psychological trigger that tells your brain "it's time to perform."

## 4. Positive Self-Talk

Instead of "Don't miss this shot," think "I've made this shot a thousand times. Smooth stroke, center ball."

## 5. Focus on Process, Not Outcome

Focus on executing each moment to the best of your ability, not on the score.

## 6. Embrace the Pressure

Pressure is a privilege. Reframe it as excitement.

## 7. Mental Rehearsal of Adversity

Prepare for things going wrong. Have a mental plan for adversity.`,
      coverImage: "/images/blog/mental-preparation.jpg",
      tags: JSON.stringify(["Performance", "Mental Game", "Competition", "Mindset"]),
      mediumUrl: "https://medium.com/@marioskomninakis",
      publishedAt: new Date("2024-03-15"),
    },
    {
      title: "Gambling Addiction: How I Got Hooked and the 7 Things I Did to Quit",
      slug: "gambling-addiction-how-i-got-hooked",
      excerpt: "My honest story about falling into gambling addiction through pool and the 7 concrete steps that helped me break free.",
      content: `# Gambling Addiction: How I Got Hooked and the 7 Things I Did to Quit

This is the hardest article I've ever written.

## How It Started

I was 19 when I started playing pool for money. The rush of winning was intoxicating. Within a year, I wasn't playing for the love of the game anymore.

## The 7 Things I Did to Quit

### 1. Admitted the Problem
### 2. Cut Off Access
### 3. Found Professional Help
### 4. Replaced the Rush
### 5. Built an Accountability Circle
### 6. Developed Financial Discipline
### 7. Practiced Daily Reflection

Recovery isn't a destination - it's a daily choice.`,
      coverImage: "/images/blog/gambling-addiction.jpg",
      tags: JSON.stringify(["Personal Story", "Addiction", "Recovery", "Life Lessons"]),
      mediumUrl: "https://medium.com/@marioskomninakis",
      publishedAt: new Date("2024-01-22"),
    },
    {
      title: "How to Build Discipline Through Rewarding Yourself",
      slug: "build-discipline-through-rewarding-yourself",
      excerpt: "Discipline doesn't have to be punishment. Learn how strategic self-rewards can build ironclad habits.",
      content: `# How to Build Discipline Through Rewarding Yourself

Real, sustainable discipline is built on a foundation of strategic rewards.

## The Reward Framework

### Micro-Rewards (Daily)
### Meso-Rewards (Weekly)
### Macro-Rewards (Monthly/Quarterly)

The rewards were the bridge from "I have to" to "I get to."`,
      coverImage: "/images/blog/discipline-rewards.jpg",
      tags: JSON.stringify(["Discipline", "Habits", "Self-Improvement", "Mindset"]),
      mediumUrl: "https://medium.com/@marioskomninakis",
      publishedAt: new Date("2024-05-10"),
    },
    {
      title: "How Communication Skills Will Help You Achieve Mastery",
      slug: "communication-skills-achieve-mastery",
      excerpt: "The secret weapon of masters isn't just talent or practice - it's communication.",
      content: `# How Communication Skills Will Help You Achieve Mastery

Communication is the multiplier that accelerates everything.

## Why Communication Matters

- Learning from Masters
- Teaching What You Know
- Building Your Network
- Self-Communication

Communication skills compound over time.`,
      coverImage: "/images/blog/communication-mastery.jpg",
      tags: JSON.stringify(["Communication", "Mastery", "Self-Improvement", "Career"]),
      mediumUrl: "https://medium.com/@marioskomninakis",
      publishedAt: new Date("2024-06-18"),
    },
    {
      title: "How I Went from Greece to USA Without Money or Connections",
      slug: "greece-to-usa-without-money-or-connections",
      excerpt: "The raw, unfiltered story of how I left Greece with nothing and built a new life in America.",
      content: `# How I Went from Greece to USA Without Money or Connections

I was 21, living in Athens. I had a pool cue, a bag of clothes, and about 800 euros in savings.

## Lessons

1. Resourcefulness Beats Resources
2. Skill Is Universal Currency
3. Community Is Everything
4. Comfort Is the Enemy
5. The Story Isn't Over

Take the shot.`,
      coverImage: "/images/blog/greece-to-usa.jpg",
      tags: JSON.stringify(["Personal Story", "Immigration", "Entrepreneurship", "Motivation"]),
      mediumUrl: "https://medium.com/@marioskomninakis",
      publishedAt: new Date("2024-02-28"),
    },
    {
      title: "I Read All Robert Greene's Books - 5 Most Crucial Things I Learnt",
      slug: "robert-greene-books-5-crucial-lessons",
      excerpt: "After reading all of Robert Greene's masterworks, here are the 5 lessons that fundamentally changed how I approach life.",
      content: `# I Read All Robert Greene's Books - 5 Most Crucial Things I Learnt

## 1. Mastery Requires Deep, Deliberate Practice
## 2. Never Outshine the Master
## 3. Understand People's True Motivations
## 4. Turn Obstacles into Advantages
## 5. Play the Long Game

Knowledge without application is just entertainment.`,
      coverImage: "/images/blog/robert-greene.jpg",
      tags: JSON.stringify(["Books", "Self-Improvement", "Power", "Strategy"]),
      mediumUrl: "https://medium.com/@marioskomninakis",
      publishedAt: new Date("2024-04-12"),
    },
    {
      title: "5 Habits to Unlock 100% of Your Brain",
      slug: "5-habits-unlock-100-percent-brain",
      excerpt: "Science-backed habits that optimize your cognitive performance.",
      content: `# 5 Habits to Unlock 100% of Your Brain

## 1. Sleep Is Non-Negotiable
## 2. Exercise Your Body to Upgrade Your Brain
## 3. Feed Your Brain Properly
## 4. Practice Deep Focus Daily
## 5. Learn Something New Constantly

Your brain is the most powerful tool you have. Treat it like the high-performance machine it is.`,
      coverImage: "/images/blog/unlock-brain.jpg",
      tags: JSON.stringify(["Health", "Performance", "Habits", "Self-Improvement"]),
      mediumUrl: "https://medium.com/@marioskomninakis",
      publishedAt: new Date("2024-07-05"),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }
  console.log(`Seeded ${blogPosts.length} blog posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
