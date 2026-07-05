import Lottie from 'lottie-react';
import { cn } from "@/lib/utils";
import animationData from '@/assets/loading.json';

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-40 h-40",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-sm",
};

export const LoadingSpinner = ({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <Lottie animationData={animationData} loop className={sizeClasses[size]} />
      {text && (
        <p className={cn("text-gray-400 tracking-wide", textSizeClasses[size])}>{text}</p>
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
    <div className="flex flex-col items-center gap-3">
      <Lottie animationData={animationData} loop className="w-36 h-36" />
      <p className="text-gray-400 text-sm tracking-widest">{text}</p>
    </div>
  </div>
);
