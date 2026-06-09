import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const updates = [
    { slug: 'blue-mountain-arabica', imageUrl: '/images/特調藍山 阿拉比卡.png' },
    { slug: 'ethiopia-yirgacheffe-g2', imageUrl: '/images/衣索比亞 耶加雪菲 G2.png' },
    { slug: 'ethiopia-guji-hambela-g1', imageUrl: '/images/衣索比亞 古吉 罕貝拉 G1.png' },
  ]
  for (const u of updates) {
    await prisma.product.update({ where: { slug: u.slug }, data: { imageUrl: u.imageUrl } })
    console.log(`設定圖片：${u.slug} → ${u.imageUrl}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
