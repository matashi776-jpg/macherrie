import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@macherrie.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@macherrie.com',
      password: adminPassword,
      role: 'ADMIN',
      cherryPoints: 0,
    },
  })

  const products = [
    { name: 'African Queen Moisture Butter', slug: 'african-queen-moisture-butter', description: 'A luxurious whipped butter infused with African shea and marula oil. This ultra-rich formula seals in moisture for up to 72 hours, leaving hair silky and deeply nourished. Perfect for severely dry, brittle hair that needs intensive hydration.', price: 28, comparePrice: 38, category: 'hair-care', subcategory: 'dry-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop']), featured: true },
    { name: 'Desert Bloom Hair Milk', slug: 'desert-bloom-hair-milk', description: 'Inspired by the resilient flowers of the African desert, this lightweight hair milk penetrates each strand with intense hydration. Formulated with baobab oil and rose water to restore moisture balance and eliminate frizz.', price: 32, comparePrice: 44, category: 'hair-care', subcategory: 'dry-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop']), featured: true },
    { name: 'Sahara Hydration Cream', slug: 'sahara-hydration-cream', description: 'Drawing inspiration from the ancient Sahara trade routes, this cream combines argan oil, moringa, and aloe vera to create the ultimate hydration shield. Protects hair from environmental stressors while providing deep nourishment.', price: 38, comparePrice: 52, category: 'hair-care', subcategory: 'dry-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop']), featured: false },
    { name: 'Nile Valley Deep Conditioner', slug: 'nile-valley-deep-conditioner', description: 'A transformative deep conditioning treatment inspired by ancient Egyptian beauty rituals. Enriched with black seed oil, lotus extract, and Nile blue lotus, this conditioner restores damaged hair to its former glory in just 15 minutes.', price: 42, comparePrice: 58, category: 'hair-care', subcategory: 'dry-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1631730486784-74757f95f9b7?w=600&h=600&fit=crop']), featured: false },
    { name: 'Curl Defining Pudding', slug: 'curl-defining-pudding', description: 'This velvety pudding formula enhances your natural curl pattern with unparalleled definition. A fusion of East African butter and Asian camellia oil creates lasting hold without crunch, keeping curls bouncy and moisturized all day.', price: 26, comparePrice: 36, category: 'hair-care', subcategory: 'curly-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=600&fit=crop']), featured: true },
    { name: 'Bouncy Curl Activator', slug: 'bouncy-curl-activator', description: 'Awaken your curls with this lightweight activator spray. Infused with aloe vera juice, glycerin, and hibiscus flower extract, it refreshes day-old curls and defines new ones with a natural, touchable hold that lasts.', price: 34, comparePrice: 46, category: 'hair-care', subcategory: 'curly-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&h=600&fit=crop']), featured: false },
    { name: 'Spiral Goddess Cream', slug: 'spiral-goddess-cream', description: 'Celebrate your natural spirals with this luxurious goddess cream. A proprietary blend of mango butter, avocado oil, and cherry blossom extract enhances curl definition while providing heat protection up to 450°F.', price: 36, comparePrice: 50, category: 'hair-care', subcategory: 'curly-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=600&h=600&fit=crop']), featured: true },
    { name: 'Coil Revival Serum', slug: 'coil-revival-serum', description: 'Specially formulated for tight coils and kinks, this revival serum penetrates the hair shaft to restore elasticity and shine. Powered by a unique combination of Ethiopian coffee oil and Japanese camellia, it breathes life into the tightest textures.', price: 44, comparePrice: 60, category: 'hair-care', subcategory: 'curly-hair', images: JSON.stringify(['https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop']), featured: false },
    { name: 'Cherry Blossom Repair Mask', slug: 'cherry-blossom-repair-mask', description: 'A transcendent repair mask that bridges African and Asian beauty traditions. Cherry blossom extract from Japan meets shea butter from Ghana to create a mask that rebuilds damaged bonds, eliminates breakage, and leaves hair with a luminous, glass-like shine.', price: 48, comparePrice: 68, category: 'hair-care', subcategory: 'masks', images: JSON.stringify(['https://images.unsplash.com/photo-1570194065650-d99fb4a38c51?w=600&h=600&fit=crop']), featured: true },
    { name: 'Honey & Argan Deep Mask', slug: 'honey-argan-deep-mask', description: 'Pure Moroccan argan oil meets raw African honey in this intensely nourishing deep mask. The combination creates a powerful humectant shield that draws moisture into each strand while forming a protective barrier against future damage.', price: 52, comparePrice: 72, category: 'hair-care', subcategory: 'masks', images: JSON.stringify(['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop']), featured: true },
    { name: 'Volcanic Clay Purifying Mask', slug: 'volcanic-clay-purifying-mask', description: 'Harnessing the detoxifying power of African volcanic clay and Japanese white clay, this purifying mask draws out scalp impurities while conditioning the hair. Perfect for clarifying without stripping natural oils.', price: 38, comparePrice: 54, category: 'hair-care', subcategory: 'masks', images: JSON.stringify(['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&h=600&fit=crop']), featured: false },
    { name: 'Silk Protein Strengthening Mask', slug: 'silk-protein-strengthening-mask', description: 'Infused with hydrolyzed silk proteins from the finest silkworms and keratin extracted from ethically sourced sources, this mask rebuilds hair strength at the molecular level. Eliminates breakage and restores a mirror-like shine in one treatment.', price: 56, comparePrice: 78, category: 'hair-care', subcategory: 'masks', images: JSON.stringify(['https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600&h=600&fit=crop']), featured: false },
    { name: 'Gentle Rose Clarifying Shampoo', slug: 'gentle-rose-clarifying-shampoo', description: "A sulfate-free clarifying shampoo infused with Moroccan rose water and African rosehip oil. Gently removes product buildup and impurities without disrupting the scalp's natural moisture balance. Leaves hair clean, refreshed, and delicately scented.", price: 24, comparePrice: 34, category: 'hair-care', subcategory: 'shampoos', images: JSON.stringify(['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop']), featured: false },
    { name: 'Moisturizing Milk Shampoo', slug: 'moisturizing-milk-shampoo', description: 'This creamy, milk-based shampoo combines baobab milk and coconut milk to create an ultra-nourishing cleansing experience. Cleanses effectively while depositing moisture into each strand, leaving hair soft as cashmere.', price: 28, comparePrice: 38, category: 'hair-care', subcategory: 'shampoos', images: JSON.stringify(['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600&h=600&fit=crop']), featured: false },
    { name: 'Color Protect Cherry Shampoo', slug: 'color-protect-cherry-shampoo', description: 'Specially developed for color-treated hair, this cherry-infused shampoo locks in vibrancy while cleansing. Cherry extract acts as a natural color protector, extending the life of your hair color while keeping hair healthy and lustrous.', price: 32, comparePrice: 44, category: 'hair-care', subcategory: 'shampoos', images: JSON.stringify(['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop']), featured: false },
    { name: 'Scalp Balance Shampoo', slug: 'scalp-balance-shampoo', description: 'Formulated for those struggling with scalp issues, this balancing shampoo combines tea tree oil from Kenya and green tea extract to regulate sebum production, soothe irritation, and create the perfect environment for healthy hair growth.', price: 26, comparePrice: 36, category: 'hair-care', subcategory: 'shampoos', images: JSON.stringify(['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop']), featured: false },
    { name: 'Silk & Cherry Leave-In Conditioner', slug: 'silk-cherry-leave-in-conditioner', description: 'A weightless leave-in conditioner that combines silk amino acids with cherry blossom water to detangle, protect, and condition hair throughout the day. Spritz on damp or dry hair for instant softness and manageability.', price: 30, comparePrice: 42, category: 'hair-care', subcategory: 'conditioners', images: JSON.stringify(['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=600&fit=crop']), featured: false },
    { name: 'Argan Oil Rinse Conditioner', slug: 'argan-oil-rinse-conditioner', description: 'A rich rinse-out conditioner featuring 100% pure Moroccan argan oil blended with Japanese rice water. This powerful combination closes the hair cuticle, adds luminous shine, and provides long-lasting softness and frizz control.', price: 34, comparePrice: 46, category: 'hair-care', subcategory: 'conditioners', images: JSON.stringify(['https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&h=600&fit=crop']), featured: false },
    { name: 'Intense Moisture Conditioner', slug: 'intense-moisture-conditioner', description: 'Our most hydrating conditioner, formulated for the driest, most damaged hair. A potent blend of shea butter, avocado oil, and hyaluronic acid provides 10x the moisture of regular conditioners, transforming even the most parched strands into soft, supple locks.', price: 38, comparePrice: 52, category: 'hair-care', subcategory: 'conditioners', images: JSON.stringify(['https://images.unsplash.com/photo-1631730486784-74757f95f9b7?w=600&h=600&fit=crop']), featured: true },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  const secretBoxes = [
    {
      name: 'Bronze Mystery Box',
      tier: 'BRONZE',
      price: 49,
      description: 'Your journey into luxury begins here. The Bronze Box is curated with 3 full-size Ma Cherrie products, each hand-selected to introduce you to our signature blend of African and Asian beauty secrets.',
      items: JSON.stringify(['3 full-size products', 'Worth $80+ retail value', 'Curated for your hair type', 'Exclusive member discount card', 'Luxury gift packaging']),
      image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600&h=600&fit=crop',
    },
    {
      name: 'Silver Mystery Box',
      tier: 'SILVER',
      price: 89,
      description: 'Elevate your hair care ritual with the Silver Box. Five expertly chosen products spanning our most beloved collections, wrapped in our signature silver packaging with a personalized hair care guide.',
      items: JSON.stringify(['5 full-size products', 'Worth $150+ retail value', 'Personalized hair profile', 'Silk hair wrap included', 'Priority customer status', 'Monthly newsletter with tips']),
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop',
    },
    {
      name: 'Gold Mystery Box',
      tier: 'GOLD',
      price: 149,
      description: 'The Gold Box is our most popular tier for a reason. Seven premium products including our exclusive Gold Collection items not available elsewhere, plus a 24K gold-infused hair treatment as a bonus gift.',
      items: JSON.stringify(['7 full-size products', 'Worth $250+ retail value', '24K gold hair treatment bonus', 'Exclusive Gold Collection access', 'Luxury gold ribbon packaging', 'VIP customer lounge access', 'Double Cherry Points on order']),
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    },
    {
      name: 'Diamond Mystery Box',
      tier: 'DIAMOND',
      price: 249,
      description: 'The pinnacle of luxury hair care. Our Diamond Box is the ultimate Ma Cherrie experience, featuring our complete luxury set with full-size versions of our rarest, most coveted formulations, plus exclusive items never sold individually.',
      items: JSON.stringify(['Full luxury set - 10+ products', 'Worth $450+ retail value', 'Diamond-exclusive formulations', 'Personalized consultation call', 'Handwritten note from founder', 'Custom engraved accessory', 'Lifetime VIP membership', 'Triple Cherry Points forever']),
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop',
    },
  ]

  for (const box of secretBoxes) {
    const existing = await prisma.secretBox.findFirst({ where: { tier: box.tier } })
    if (!existing) {
      await prisma.secretBox.create({ data: box })
    }
  }

  console.log('Seeding completed!')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
