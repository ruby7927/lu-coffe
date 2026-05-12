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
        slug: 'ethiopia-yirgacheffe',
        name: '衣索比亞 耶加雪菲',
        origin: '衣索比亞・耶加雪菲',
        process: '水洗',
        roastLevel: '淺焙',
        flavorNotes: ['茉莉花', '檸檬', '蜂蜜', '桃子'],
        description: '來自衣索比亞高原的精品豆，細膩的花香與柑橘調性，是手沖入門的絕佳選擇。每一口都像是清晨的第一道陽光。',
        price100g: 380,
        price200g: 680,
        isActive: true,
        isSeasonal: false,
        sortOrder: 0,
      },
      {
        slug: 'colombia-huila',
        name: '哥倫比亞 薇拉',
        origin: '哥倫比亞・薇拉省',
        process: '蜜處理',
        roastLevel: '淺中焙',
        flavorNotes: ['紅糖', '蘋果', '杏仁', '奶油'],
        description: '薇拉省高海拔農場的蜜處理豆，甜感豐富，口感圓潤厚實，適合喜歡醇厚風味的你。',
        price100g: 350,
        price200g: 620,
        isActive: true,
        isSeasonal: false,
        sortOrder: 1,
      },
      {
        slug: 'seasonal',
        name: '本季精選 季節限定',
        origin: '肯亞・基里尼亞加',
        process: '雙重水洗',
        roastLevel: '淺焙',
        flavorNotes: ['黑醋栗', '番茄', '柳橙', '紅酒'],
        description: '每季精選一支限量豆。本季來自肯亞基里尼亞加，獨特的番茄與莓果酸質，充滿驚喜感。數量有限，售完為止。',
        price100g: 420,
        price200g: 760,
        isActive: true,
        isSeasonal: true,
        sortOrder: 2,
      },
    ],
  })

  console.log('種子資料建立完成')
}

main().catch(console.error).finally(() => prisma.$disconnect())
