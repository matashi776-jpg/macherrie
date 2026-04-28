import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.cartItem.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: { name: 'Admin', email: 'admin@macherry.com', password: adminPassword, role: 'ADMIN', cherryPoints: 0 },
  })

  const userPassword = await bcrypt.hash('user123', 10)
  await prisma.user.create({
    data: { name: 'Cherry User', email: 'user@macherry.com', password: userPassword, role: 'USER', cherryPoints: 250 },
  })

  const products = [
    { name: 'Cherry Blossom Body Butter', description: 'Rich shea + African shea body butter infused with cherry extract for deep hydration. Melts into skin leaving a silky, non-greasy finish. Perfect for all skin types.', price: 38, category: 'BODY_CARE', stock: 50, featured: true },
    { name: 'African Cocoa Glow Cream', description: 'Deep moisturizing body cream with pure cocoa butter sourced from West Africa. Enriched with vitamin E and cherry seed oil for a radiant, healthy glow.', price: 42, category: 'BODY_CARE', stock: 45, featured: true },
    { name: 'Asian Camellia Oil Elixir', description: 'Lightweight luxury body oil with Japanese camellia oil, revered for centuries in Asian beauty rituals. Absorbs instantly, leaving skin luminous and deeply nourished.', price: 55, category: 'BODY_CARE', stock: 30, featured: false },
    { name: 'Ubuntu Nourish Body Lotion', description: 'Everyday hydrating lotion for all skin types. Inspired by African ubuntu philosophy. Light, fast-absorbing with a subtle cherry blossom scent.', price: 32, category: 'BODY_CARE', stock: 60, featured: false },
    { name: 'Desert Rose Moisture Shampoo', description: 'Sulfate-free intense hydration shampoo infused with rose water and desert botanicals. Gently cleanses while delivering moisture to parched strands.', price: 28, category: 'DRY_HAIR', stock: 55, featured: false },
    { name: 'Sahara Dew Conditioner', description: 'Deep moisturizing conditioner inspired by rare Saharan botanicals. Transforms dry, brittle hair into soft, supple silk. Detangles and adds luminous shine.', price: 30, category: 'DRY_HAIR', stock: 50, featured: false },
    { name: 'Oasis Hair Serum', description: 'Anti-frizz hydrating serum that creates a moisture oasis for dry hair. Infused with African marula oil and Japanese pearl extract. Controls frizz for up to 72 hours.', price: 45, category: 'DRY_HAIR', stock: 40, featured: true },
    { name: 'Nile Nectar Hair Oil', description: 'Luxurious argan + baobab oil blend inspired by the fertile Nile valley. This ancient recipe nourishes from root to tip, adding extraordinary shine and softness.', price: 38, category: 'DRY_HAIR', stock: 45, featured: false },
    { name: 'Curl Awakening Cream', description: 'Define and elongate curls with this creamy styler. Infused with shea butter and aloe vera, it enhances your natural curl pattern while fighting frizz and adding moisture.', price: 34, category: 'CURLY_HAIR', stock: 50, featured: true },
    { name: 'Bounce & Shine Gel', description: 'Medium hold gel that adds definition and shine to curly hair without crunch or flaking. Cherry extract provides antioxidant protection while locking in your curl pattern.', price: 26, category: 'CURLY_HAIR', stock: 55, featured: false },
    { name: 'Coil Refresh Mist', description: 'Leave-in refresh spray that revives second-day curls instantly. Infused with rosewater and glycerin, it reactivates curl pattern without weighing down.', price: 22, category: 'CURLY_HAIR', stock: 60, featured: false },
    { name: 'Curl Pattern Mask', description: 'Weekly deep treatment that repairs and redefines your natural curl pattern. Formulated with keratin, baobab protein, and cherry blossom extract for bouncy, healthy coils.', price: 40, category: 'CURLY_HAIR', stock: 40, featured: false },
    { name: 'Midnight Cherry Hair Mask', description: 'Overnight intensive repair mask that works while you sleep. Deeply penetrates each strand to repair damage, restore elasticity, and reveal glossy, healthy hair by morning.', price: 48, category: 'MASKS', stock: 35, featured: true },
    { name: 'Gold Infusion Face Mask', description: '24K gold collagen luxury face mask. This premium treatment firms, brightens, and intensely hydrates. Gold particles boost collagen production while cherry extract evens skin tone.', price: 65, category: 'MASKS', stock: 25, featured: true },
    { name: 'Volcanic Clay Purify Mask', description: 'Detoxifying and clarifying mask with volcanic ash clay and activated charcoal. Draws out impurities while cherry antioxidants protect and nourish the skin.', price: 38, category: 'MASKS', stock: 40, featured: false },
    { name: 'Rose Petal Glow Mask', description: 'Brightening and intensely hydrating mask with real rose petal extract. Fades dark spots, adds luminosity, and leaves skin dewy and plump.', price: 44, category: 'MASKS', stock: 35, featured: false },
    { name: 'Ritual Cleanse Shampoo', description: 'Gentle everyday shampoo for all hair types. A sacred blend of cherry extract, aloe vera, and botanicals that cleanses without stripping. Makes every wash feel like a ritual.', price: 26, category: 'SHAMPOOS', stock: 60, featured: false },
    { name: 'Scalp Renewal Shampoo', description: 'Exfoliating scalp treatment shampoo with micro-cherry seed powder and salicylic acid. Removes buildup, balances pH, and stimulates a healthy scalp environment for hair growth.', price: 32, category: 'SHAMPOOS', stock: 50, featured: false },
    { name: 'Protein Boost Shampoo', description: 'Strengthening formula packed with hydrolyzed keratin and silk proteins. Rebuilds damaged hair structure from the first wash. Ideal for over-processed or chemically treated hair.', price: 30, category: 'SHAMPOOS', stock: 55, featured: false },
    { name: 'Color Protect Shampoo', description: 'Specially formulated for color-treated hair to extend vibrancy and protect against fading. UV filters and cherry antioxidants shield color while maintaining moisture balance.', price: 34, category: 'SHAMPOOS', stock: 50, featured: false },
    { name: 'Cherry Bronze Box', description: '3-4 handpicked surprise products featuring body care essentials. Your introduction to the Ma Cherry luxury world. Each box contains full-size products worth over $80.', price: 49, category: 'SECRET_BOX', stock: 20, featured: false },
    { name: 'Cherry Silver Box', description: '5-6 carefully curated surprise products spanning hair and body care. A perfect mix of our best-loved formulas. Full-size products worth over $130. Free gift included.', price: 89, category: 'SECRET_BOX', stock: 15, featured: true },
    { name: 'Cherry Gold Box', description: '7-8 luxury surprise products from our full collection. The ultimate self-care haul featuring exclusive formulas and limited edition items. Full-size products worth over $220.', price: 149, category: 'SECRET_BOX', stock: 10, featured: true },
    { name: 'Cherry Diamond Box', description: '10+ exclusive and limited-edition products including items not available for individual sale. Our most prestigious collection, handpicked by our founders. Worth over $400+. Includes personalized note.', price: 249, category: 'SECRET_BOX', stock: 5, featured: true },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('Seed complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
