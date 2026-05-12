import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.product.update({
    where: { slug: 'ethiopia-yirgacheffe' },
    data: { imageUrl: '/images/衣索比亞 耶加雪菲.jpg' },
  })
  console.log('完成')
}

main().catch(console.error).finally(() => prisma.$disconnect())
