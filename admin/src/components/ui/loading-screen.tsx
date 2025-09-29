import React from 'react'

interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Beautiful Logo with Animation */}
        <div className="relative">
          <div className="w-20 h-20 mx-auto gradient-primary rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
            <span className="text-white font-bold text-3xl">🕉️</span>
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 animate-ping"></div>
        </div>

        {/* Brand Name */}
        <div>
          <h1 className="text-2xl font-bold text-gradient mb-2">SantVaani</h1>
          <p className="text-gray-600 font-medium">Admin Panel</p>
        </div>

        {/* Enhanced Loading Spinner */}
        <div className="relative">
          <div className="loading-spinner-enhanced mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 gradient-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-gray-500 font-medium animate-pulse">{message}</p>

        {/* Progress Dots */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}