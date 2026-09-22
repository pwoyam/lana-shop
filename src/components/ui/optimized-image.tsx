import { cn } from '@/lib/utils'

type Props = {
  src: string
  alt: string
  className?: string
  fill?: boolean
  aspectRatio?: string
  priority?: boolean
}

/**
 * تصویر بهینه — از <img> استفاده می‌کنه چون:
 * ۱) تصاویر لوکال در public/uploads نیازی به بهینه‌سازی ندارن
 * ۲) از خطای next/image روی دامنه‌های خارجی جلوگیری می‌کنه
 * ویژگی‌های performance: loading="lazy", decoding="async"
 */
export function OptimizedImage({ src, alt, className, fill, aspectRatio, priority }: Props) {
  // اگه SVG یا data URI هست، مستقیم نمایش بده
  if (src.startsWith('data:') || src.endsWith('.svg')) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(fill ? 'absolute inset-0 w-full h-full object-cover' : '', className)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(fill ? 'absolute inset-0 w-full h-full object-cover' : '', className)}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}
