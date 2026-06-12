import 'dotenv/config'
import { PrismaClient } from '../app/generated/prisma/client/index.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const slug = 'how-to-choose-coffee-beans'

const content = `走進精品咖啡的世界，最常被問的就是：

「我剛開始喝，要選哪一支才不會踩雷？」

其實只要記住三個關鍵字，就能挑到適合自己的那一支豆。

# 1. 從產地開始：每個地方都有個性

不同產地的咖啡豆，個性差很多。剛入門的話，可以從這幾個方向挑：

- 衣索比亞：花香、柑橘、紅茶尾韻，喝起來輕盈乾淨
- 哥倫比亞、瓜地馬拉：堅果、巧克力、焦糖，順口耐喝
- 印尼曼特寧：草本、低酸、口感厚實，重口味愛好者首選
- 巴西為主的中南美洲：可可、堅果、平衡，無腦好喝

如果你喜歡水果香、清爽的口感，從衣索比亞下手。喜歡濃郁、像吃巧克力的甜感，選中南美洲那一掛。

![嚕咪陪喝咖啡](/images/lumee3.jpg)

# 2. 烘焙度：左右口感的關鍵

同一支豆子，烘深一點、烘淺一點，喝起來完全不一樣：

- 淺焙：酸度明亮、花果香突出
- 中焙：酸甜平衡、層次豐富
- 深焙：苦味厚實、巧克力與堅果感為主

第一次喝精品豆，建議從中焙或淺中焙開始，不會被酸度嚇到，也能嚐到豆子本身的香氣。

# 3. 風味標籤：別被那些詞嚇到

精品豆包裝上常會寫「柑橘、桃子、紅茶尾韻」，意思不是裡面真的加了水果，而是品飲時你會聞到、嚐到的層次感。

挑選的時候，看到自己喜歡的關鍵字就大膽試：

- 喜歡水果味：找有「莓果」「柑橘」「桃子」標籤的
- 喜歡甜感：找「焦糖」「巧克力」「蜂蜜」
- 喜歡乾淨感：找「花香」「茶感」「檸檬」

# 嚕咖目前的推薦

如果還沒頭緒，我們現在固定供應的三支豆，剛好涵蓋三種不同需求：

- 特調藍山 阿拉比卡（中焙）：堅果、焦糖、巧克力，順口耐喝的日常款
- 衣索比亞 耶加雪菲 G2（淺中焙）：花香、檸檬與紅茶尾韻，乾淨清新
- 衣索比亞 古吉 罕貝拉 G1（淺中焙）：葡萄、柑橘、蜜桃，果香飽滿

![古吉 罕貝拉 G1](/images/衣索比亞 古吉 罕貝拉 G1.png)

# 最後想說

選咖啡這件事，沒有標準答案。就跟挑香水、挑酒一樣，找到自己喜歡的味道才是重點。

別給自己壓力，慢慢喝、慢慢試。

你會找到那一支，陪你度過早晨、午後或加班夜的咖啡。`

async function main() {
  const post = await prisma.post.upsert({
    where: { slug },
    update: {
      title: '新手選咖啡：記住這三個關鍵字',
      category: 'BEAN',
      excerpt: '走進精品咖啡的世界，其實只要掌握三個關鍵字——產地、烘焙度、風味標籤，就能挑到適合自己的那一支豆。',
      content,
      coverImage: '/images/lumee3.jpg',
      isPublished: true,
    },
    create: {
      slug,
      title: '新手選咖啡：記住這三個關鍵字',
      category: 'BEAN',
      excerpt: '走進精品咖啡的世界，其實只要掌握三個關鍵字——產地、烘焙度、風味標籤，就能挑到適合自己的那一支豆。',
      content,
      coverImage: '/images/lumee3.jpg',
      isPublished: true,
    },
  })
  console.log('文章已建立/更新：', post.slug)
}

main().catch(console.error).finally(() => prisma.$disconnect())
