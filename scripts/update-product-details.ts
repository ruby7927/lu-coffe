import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const updates = [
    {
      slug: 'blue-mountain-arabica',
      data: {
        process: '配方',
        roastLevel: '中焙',
        flavorNotes: ['堅果', '焦糖', '巧克力'],
        description: '堅果、焦糖、巧克力香氣，順口耐喝，適合每天喝的一款。',
      },
    },
    {
      slug: 'ethiopia-guji-hambela-g1',
      data: {
        process: '日曬',
        roastLevel: '淺中焙',
        flavorNotes: ['葡萄', '柑橘', '蜜桃'],
        description: '帶有葡萄、柑橘與蜜桃香氣，果香較明顯。',
      },
    },
    {
      slug: 'ethiopia-yirgacheffe-g2',
      data: {
        process: '水洗',
        roastLevel: '淺中焙',
        flavorNotes: ['檸檬', '花香', '紅茶尾韻'],
        description: '檸檬、花香與紅茶尾韻，風味清新。',
      },
    },
  ]
  for (const u of updates) {
    await prisma.product.update({ where: { slug: u.slug }, data: u.data })
    console.log(`更新：${u.slug}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
