import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-700 mb-4">۴۰۴</h1>
        <h2 className="text-xl font-semibold text-brand-900 mb-2">صفحه مورد نظر پیدا نشد</h2>
        <p className="text-brand-500 mb-6">متأسفانه صفحه‌ای که دنبالش هستید وجود ندارد</p>
        <Link href="/" className="inline-flex items-center h-11 px-6 rounded-lg bg-brand-700 text-white hover:bg-brand-800">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  )
}
