import { useEffect, useState } from 'react'

export default function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Hide splash after 1.5 seconds
    const timer = setTimeout(() => {
      setShow(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        animation: 'fadeOut 0.5s ease-in-out 1s forwards'
      }}
    >
      <style>
        {`
          @keyframes fadeOut {
            to {
              opacity: 0;
              visibility: hidden;
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>

      <div className="text-center">
        {/* App Icon */}
        <div
          className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl flex items-center justify-center shadow-2xl"
          style={{
            animation: 'bounce 1s ease-in-out infinite'
          }}
        >
          <span className="text-6xl">🕉️</span>
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-white mb-2">
          SantVaani
        </h1>
        <p className="text-orange-100 text-lg font-medium">
          Admin Panel
        </p>

        {/* Loading dots */}
        <div className="flex items-center justify-center mt-6 space-x-2">
          <div
            className="w-3 h-3 bg-white rounded-full"
            style={{
              animation: 'pulse 1s ease-in-out infinite',
              animationDelay: '0s'
            }}
          />
          <div
            className="w-3 h-3 bg-white rounded-full"
            style={{
              animation: 'pulse 1s ease-in-out infinite',
              animationDelay: '0.2s'
            }}
          />
          <div
            className="w-3 h-3 bg-white rounded-full"
            style={{
              animation: 'pulse 1s ease-in-out infinite',
              animationDelay: '0.4s'
            }}
          />
        </div>
      </div>
    </div>
  )
}
