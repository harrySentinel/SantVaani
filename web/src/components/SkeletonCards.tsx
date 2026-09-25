import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function SaintCardSkeleton() {
  return (
    <Card className="border-0 shadow-lg bg-white overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-6 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-4/6" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BhajanCardSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="w-full aspect-square rounded-xl" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <Card className="border-0 shadow-md bg-white overflow-hidden">
      <Skeleton className="w-full h-5 rounded-none" />
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export function QuoteCardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100 space-y-4 animate-pulse">
      <Skeleton className="h-4 w-1/4 bg-orange-100" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-orange-100" />
        <Skeleton className="h-4 w-5/6 bg-orange-100" />
        <Skeleton className="h-4 w-4/6 bg-orange-100" />
      </div>
      <Skeleton className="h-3.5 w-1/3 bg-orange-100 ml-auto" />
    </div>
  );
}

export function SaintGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SaintCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BhajanGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BhajanCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}
