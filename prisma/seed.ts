import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const palettes = [
  { bg: '#6B4F3A', fg: '#FAF7F2' },
  { bg: '#9C7B5A', fg: '#FAF7F2' },
  { bg: '#3E2C1F', fg: '#F5EFE6' },
  { bg: '#D4C0A8', fg: '#3E2C1F' },
  { bg: '#B89B7A', fg: '#2A1D14' },
  { bg: '#4A3628', fg: '#FAF7F2' },
]

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function placeholderImage(text: string, index = 0): string {
  const palette = palettes[(hash(text) + index) % palettes.length]
  const initials = text.trim().split(' ').slice(0, 2).map(w => w[0]).join('')
  const safe = text.replace(/[<>&"']/g, '').slice(0, 30)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${palette.bg}"/><stop offset="100%" stop-color="${palette.bg}dd"/></linearGradient></defs><rect width="600" height="800" fill="url(#g)"/><circle cx="300" cy="320" r="110" fill="${palette.fg}" opacity="0.1"/><text x="300" y="350" font-family="sans-serif" font-size="80" font-weight="700" fill="${palette.fg}" text-anchor="middle" opacity="0.9">${initials}</text><text x="300" y="620" font-family="sans-serif" font-size="26" font-weight="500" fill="${palette.fg}" text-anchor="middle" opacity="0.85">${safe}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const categories = [
  { name: 'مانتو و پوشاک', slug: 'manto', description: 'مانتو، شومیز، بلوز و پوشاک زنانه' },
  { name: 'شال و روسری', slug: 'shal', description: 'شال، روسری و اکسسوری سر' },
  { name: 'کیف', slug: 'kif', description: 'کیف دستی، دوشی و کوله' },
  { name: 'کفش', slug: 'kafsh', description: 'کفش، صندل و بوت' },
  { name: 'زیورآلات', slug: 'zivar', description: 'گردنبند، گوشواره، دستبند و انگشتر' },
  { name: 'عینک', slug: 'eynak', description: 'عینک آفتابی و طبی' },
  { name: 'کمربند', slug: 'kamarband', description: 'کمربند چرم و پارچه‌ای' },
  { name: 'کلاه', slug: 'kolah', description: 'کلاه لبه‌دار، بافت و نقاب' },
]

const productNames: Record<string, string[]> = {
  manto: ['مانتو بلند کتان', 'مانتو جلوباز مدل النا', 'مانتو کوتاه اسپرت', 'شومیز ساتن آستین بلند', 'مانتو اداری کلاسیک'],
  shal: ['شال نخی طرح‌دار', 'روسری ابریشم', 'شال پشمی زمستانی', 'روسری حریر', 'شال موهر'],
  kif: ['کیف دوشی چرم', 'کیف دستی زنانه', 'کوله پشتی مینیمال', 'کیف پول چرم', 'کیف کلاچ شب'],
  kafsh: ['کفش لوفر زنانه', 'صندل تابستانی', 'بوت نیم‌ساق', 'کفش اسپرت', 'کفش پاشنه‌دار'],
  zivar: ['گردنبند طلاکوب', 'گوشواره حلقه‌ای', 'دستبند زنجیری', 'انگشتر مینیمال', 'ست گردنبند و گوشواره'],
  eynak: ['عینک آفتابی کت', 'عینک گربه‌ای', 'عینک گرد رترو', 'عینک مربعی مدرن', 'عینک خلبانی'],
  kamarband: ['کمربند چرم طبیعی', 'کمربند سگک طلایی', 'کمربند پارچه‌ای', 'کمربند بافت', 'کمربند کلاسیک'],
  kolah: ['کلاه لبه‌دار زنانه', 'کلاه بافت زمستانی', 'کلاه نقاب‌دار', 'کلاه ساحلی', 'کلاه پشمی'],
}

const sizes = [['S', 'M', 'L', 'XL'], ['36', '37', '38', '39', '40'], ['فری سایز'], ['M', 'L']]
const colors = [['مشکی', 'قهوه‌ای', 'کرم'], ['سفید', 'خاکستری', 'زیتونی'], ['مشکی', 'طلایی'], ['کرم', 'قهوه‌ای روشن', 'کاراملی']]

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

async function main() {
  console.log('🌱 شروع seed...')

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.discount.deleteMany()
  await prisma.setting.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 داده‌های قبلی پاک شدند')

  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: { name: 'مدیر سایت', email: 'admin@lana.ir', phone: '09120000000', passwordHash: adminPassword, role: Role.ADMIN },
  })
  console.log('👤 ادمین: admin@lana.ir / admin123')

  const customerPassword = await bcrypt.hash('customer123', 10)
  await prisma.user.create({
    data: { name: 'پویا تستی', email: 'customer@lana.ir', phone: '09121111111', passwordHash: customerPassword, role: Role.CUSTOMER },
  })
  console.log('👤 مشتری: customer@lana.ir / customer123')

  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl: placeholderImage(cat.name, 2),
      },
    })
    createdCategories[cat.slug] = created.id
  }
  console.log(`📁 ${categories.length} دسته‌بندی`)

  let productCount = 0
  for (const [catSlug, names] of Object.entries(productNames)) {
    for (const name of names) {
      const price = Math.floor(Math.random() * 1500000) + 200000
      const hasDiscount = Math.random() > 0.6
      const comparePrice = hasDiscount ? Math.floor(price * 1.3) : null

      await prisma.product.create({
        data: {
          name,
          slug: `product-${productCount}-${name.length}`,
          description: `${name} با کیفیت عالی و طراحی مدرن. مناسب برای استفاده روزمره و مجالس. جنس درجه یک و دوخت تمیز.`,
          price,
          comparePrice,
          stock: Math.floor(Math.random() * 50) + 5,
          images: JSON.stringify([
            placeholderImage(name, 0),
            placeholderImage(name, 1),
            placeholderImage(name, 2),
          ]),
          sizes: JSON.stringify(randomFrom(sizes)),
          colors: JSON.stringify(randomFrom(colors)),
          isFeatured: Math.random() > 0.7,
          isActive: true,
          categoryId: createdCategories[catSlug],
        },
      })
      productCount++
    }
  }
  console.log(`📦 ${productCount} محصول`)

  const settings = [
    { key: 'site_name', value: 'لَنا' },
    { key: 'site_tagline', value: 'فروشگاه لباس و اکسسوری' },
    { key: 'site_description', value: 'فروشگاه آنلاین لباس و اکسسوری با بهترین قیمت و کیفیت' },
    { key: 'site_logo', value: '' },
    { key: 'site_phone', value: '021-12345678' },
    { key: 'site_email', value: 'info@lana.ir' },
    { key: 'site_address', value: 'تهران، خیابان ولیعصر، پلاک ۱۲۳' },
    { key: 'site_instagram', value: 'https://instagram.com/lana' },
    { key: 'site_telegram', value: 'https://t.me/lana' },
    { key: 'primary_color', value: '#6B4F3A' },
    { key: 'secondary_color', value: '#FAF7F2' },
    { key: 'shipping_cost', value: '50000' },
    { key: 'free_shipping_threshold', value: '2000000' },
  ]
  for (const s of settings) {
    await prisma.setting.create({ data: s })
  }
  console.log(`⚙️  ${settings.length} تنظیمات`)

  await prisma.discount.create({ data: { code: 'WELCOME10', type: 'PERCENT', value: 10, minPurchase: 500000, isActive: true } })
  await prisma.discount.create({ data: { code: 'LANA50', type: 'FIXED', value: 50000, minPurchase: 1000000, isActive: true } })
  console.log('🎁 2 کد تخفیف')

  console.log('\n✅ Seed کامل شد!')
}

main()
  .catch((e) => { console.error('❌ خطا:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
