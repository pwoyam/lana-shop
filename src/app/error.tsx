'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-xl p-8 border border-red-200">
        <h1 className="text-2xl font-bold text-red-700 mb-4">خطایی رخ داد</h1>
        <div className="bg-red-50 p-4 rounded-lg mb-4 text-sm">
          <p className="font-mono text-red-900 break-all">{error.message}</p>
          {error.digest && <p className="text-xs text-red-500 mt-2">Digest: {error.digest}</p>}
        </div>
        <button
          onClick={reset}
          className="h-11 px-6 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  )
}
