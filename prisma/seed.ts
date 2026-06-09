import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
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
        price100g: 0,
        price200g: 0,
        isActive: true,
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
        price100g: 0,
        price200g: 0,
        isActive: true,
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
        price100g: 0,
        price200g: 0,
        isActive: true,
        isSeasonal: false,
        sortOrder: 3,
      },
    ],
  })

  console.log('種子資料建立完成')
}

main().catch(console.error).finally(() => prisma.$disconnect())
