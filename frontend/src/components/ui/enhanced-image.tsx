import { useState } from 'react';
import { cn } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/ui/loading-spinner";

interface EnhancedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const EnhancedImage = ({
  src,
  alt,
  className,
  fallbackSrc = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format",
  onLoad,
  onError
}: EnhancedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
    onError?.();
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <LoadingSkeleton className={cn("absolute inset-0 z-10", className)} />
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      {hasError && currentSrc === fallbackSrc && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-orange-50 text-orange-600",
          className
        )}>
          <div className="text-center">
            <span className="text-2xl mb-2 block">🖼️</span>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};
