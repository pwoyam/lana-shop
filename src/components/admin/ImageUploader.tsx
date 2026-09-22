'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  images: string[]
  onChange: (images: string[]) => void
  max?: number
}

export function ImageUploader({ images, onChange, max = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remaining = max - images.length

    if (remaining <= 0) {
      toast.error(`حداکثر ${max} تصویر می‌تونی داشته باشی`)
      return
    }

    setUploading(true)

    try {
      const uploaded: string[] = []

      for (const file of fileArray.slice(0, remaining)) {
        const fd = new FormData()
        fd.append('file', file)

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: fd,
        })

        const data = await res.json()
        if (!res.ok) {
          toast.error(data.error || `خطا در آپلود ${file.name}`)
          continue
        }

        uploaded.push(data.url)
      }

      if (uploaded.length > 0) {
        onChange([...images, ...uploaded])
        toast.success(`${uploaded.length} تصویر اضافه شد`)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files)
  }

  const removeImage = async (url: string) => {
    if (!confirm('این تصویر حذف بشه؟')) return

    onChange(images.filter((i) => i !== url))

    // اگه آپلود لوکال بود، از سرور هم پاک کن
    if (url.startsWith('/uploads/')) {
      await fetch('/api/admin/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      }).catch(() => {})
    }
  }

  const addByUrl = (url: string) => {
    if (!url.trim()) return
    onChange([...images, url.trim()])
  }

  return (
    <div className="space-y-3">
      {/* پیش‌نمایش تصاویر */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-brand-200 bg-brand-50 group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 left-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-brand-700 text-white text-[10px] rounded">
                  اصلی
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ناحیه drop */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition ${
          dragOver ? 'border-brand-600 bg-brand-50' : 'border-brand-200 hover:border-brand-400 bg-white'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-8 w-8 text-brand-600 animate-spin mb-2" />
            <span className="text-sm text-brand-600">در حال آپلود...</span>
          </>
        ) : (
          <>
            <Upload className="h-8 w-8 text-brand-400 mb-2" />
            <span className="text-sm font-medium text-brand-700">
              تصاویر رو اینجا بکش یا کلیک کن
            </span>
            <span className="text-xs text-brand-400 mt-1">
              JPG، PNG، WebP — حداکثر ۵ مگابایت — تا {max} تصویر
            </span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* افزودن با URL */}
      <details className="text-sm">
        <summary className="cursor-pointer text-brand-600 hover:text-brand-800 text-xs">
          یا با لینک تصویر اضافه کن
        </summary>
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            dir="ltr"
            className="flex-1 h-10 rounded-lg border border-brand-200 bg-white px-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addByUrl((e.target as HTMLInputElement).value)
                ;(e.target as HTMLInputElement).value = ''
              }
            }}
          />
        </div>
      </details>
    </div>
  )
}
