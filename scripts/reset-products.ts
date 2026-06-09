import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Deactivate all existing products
  const deactivated = await prisma.product.updateMany({
    data: { isActive: false },
  })
  console.log(`下架舊商品 ${deactivated.count} 筆`)

  // New products
  const newProducts = [
    {
      slug: 'blue-mountain-arabica',
      name: '特調藍山 阿拉比卡',
      origin: '配方 (阿拉比卡)',
      process: '水洗',
      roastLevel: '中焙',
      flavorNotes: ['可可', '焦糖', '堅果', '溫和回甘'],
      description: '經典藍山風味配方，平衡溫和、酸度低，口感乾淨柔順，是日常入門的好選擇。',
      priceRegular: 260,
      priceCommunity: 230,
      isSeasonal: false,
      sortOrder: 1,
    },
    {
      slug: 'ethiopia-yirgacheffe-g2',
      name: '衣索比亞 耶加雪菲 G2',
      origin: '衣索比亞 耶加雪菲',
      process: '水洗',
      roastLevel: '淺焙',
      flavorNotes: ['花香', '檸檬', '佛手柑', '紅茶感'],
      description: '經典水洗耶加，明亮的柑橘酸與細緻花香，尾韻乾淨如紅茶，手沖入門必喝。',
      priceRegular: 300,
      priceCommunity: 280,
      isSeasonal: false,
      sortOrder: 2,
    },
    {
      slug: 'ethiopia-guji-hambela-g1',
      name: '衣索比亞 古吉 罕貝拉 G1',
      origin: '衣索比亞 古吉 罕貝拉',
      process: '日曬',
      roastLevel: '淺焙',
      flavorNotes: ['莓果', '紅酒', '黑巧克力', '熱帶水果'],
      description: '日曬古吉的高完整度表現，豐厚的莓果與紅酒調性，餘韻帶巧克力與蜜甜，層次飽滿。',
      priceRegular: 380,
      priceCommunity: 340,
      isSeasonal: false,
      sortOrder: 3,
    },
  ]

  for (const p of newProducts) {
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    if (existing) {
      await prisma.product.update({
        where: { slug: p.slug },
        data: { ...p, isActive: true, price100g: 0, price200g: 0 },
      })
      console.log(`更新並上架：${p.name}`)
    } else {
      await prisma.product.create({
        data: { ...p, isActive: true, price100g: 0, price200g: 0 },
      })
      console.log(`新增：${p.name}`)
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
