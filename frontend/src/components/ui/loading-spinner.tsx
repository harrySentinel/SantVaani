import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const omSizeClasses = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl",
  xl: "text-8xl"
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-sm"
};

export const LoadingSpinner = ({
  size = "md",
  className,
  text
}: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      <span
        className={cn("text-orange-400 animate-pulse block leading-none", omSizeClasses[size])}
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        ॐ
      </span>
      {text && (
        <p className={cn("text-gray-400 tracking-wide", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );
};

export const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-100 rounded-lg", className)} />
);

export const LoadingCard = ({ className }: { className?: string }) => (
  <div className={cn("p-6 border border-gray-100 rounded-lg bg-white", className)}>
    <div className="space-y-3">
      <LoadingSkeleton className="h-4 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-16 w-full" />
      <div className="flex space-x-2">
        <LoadingSkeleton className="h-7 w-16" />
        <LoadingSkeleton className="h-7 w-16" />
      </div>
    </div>
  </div>
);

export const LoadingPage = ({ text = "Loading Santvaani..." }: { text?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center space-y-5">
      <span
        className="text-8xl text-orange-400 animate-pulse block leading-none"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        ॐ
      </span>
      <div className="space-y-2">
        <p className="text-gray-400 text-sm tracking-widest">{text}</p>
        <div className="flex justify-center items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-bounce" style={{ animationDelay: '180ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-bounce" style={{ animationDelay: '360ms' }} />
        </div>
      </div>
    </div>
  </div>
);
