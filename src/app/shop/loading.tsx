import { ProductGridSkeleton, Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-9 w-64 mb-3" />
      <Skeleton className="h-4 w-32 mb-8" />
      <div className="flex gap-8">
        <div className="hidden lg:block w-64 shrink-0 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <Skeleton className="h-10 w-40" />
          </div>
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  )
}
