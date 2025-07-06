import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  className, 
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      {/* Spiritual Om symbol spinner */}
      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-2 border-orange-200 border-t-orange-500",
          sizeClasses[size]
        )} />
        <div className={cn(
          "absolute inset-0 flex items-center justify-center text-orange-500 font-bold",
          textSizeClasses[size]
        )}>
          🕉️
        </div>
      </div>
      
      {text && (
        <p className={cn(
          "text-orange-600 font-medium animate-pulse",
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );
};

export const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-orange-100 rounded-lg", className)} />
);

export const LoadingCard = ({ className }: { className?: string }) => (
  <div className={cn("p-6 border border-orange-100 rounded-lg bg-white/50", className)}>
    <div className="space-y-4">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-20 w-full" />
      <div className="flex space-x-2">
        <LoadingSkeleton className="h-8 w-16" />
        <LoadingSkeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
);

export const LoadingPage = ({ text = "Loading..." }: { text?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
    <div className="text-center">
      <LoadingSpinner size="xl" text={text} />
      <p className="mt-4 text-orange-600 text-sm">
        धैर्य रखें... Please wait
      </p>
    </div>
  </div>
);
