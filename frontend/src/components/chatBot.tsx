import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles, Heart, Flower2, Loader2 } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Simple Message interface - only what we need
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  className?: string;
  initialMessage?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ 
  className = '',
  initialMessage = 'Hey 😊, I am SantVaani. If your heart feels heavy or things don’t make sense right now, I am here to listen and help through the Gita wisdom.',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔥 BACKEND CONFIGURATION - FIXED for Vite
  const getBackendUrl = () => {
    // For Vite, use VITE_ prefix for environment variables
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    
    // Default to localhost for development
    return import.meta.env.MODE === 'production' 
      ? 'https://your-backend-domain.com' // Replace with your production backend URL
      : 'http://localhost:5000';
  };
  
  const BACKEND_URL = getBackendUrl();

  // Smooth scrolling to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 🔥 CHECK BACKEND HEALTH ON COMPONENT MOUNT
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        setBackendStatus('checking');
        const response = await fetch(`${BACKEND_URL}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Backend health check:', data);
          setBackendStatus('connected');
        } else {
          console.error('Backend health check failed:', response.status);
          setBackendStatus('disconnected');
        }
      } catch (error) {
        console.error('Backend health check error:', error);
        setBackendStatus('disconnected');
      }
    };

    checkBackendHealth();
  }, [BACKEND_URL]);

  // Handle keyboard visibility changes for mobile
  useEffect(() => {
    const handleVisualViewportChange = () => {
      if (window.visualViewport && inputFocused) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        if (heightDiff > 100) {
          setKeyboardHeight(heightDiff);
        } else {
          setKeyboardHeight(0);
        }
      }
    };

    const handleResize = () => {
      if (!inputFocused) {
        setKeyboardHeight(0);
        return;
      }
      
      const heightDiff = window.screen.height - window.innerHeight;
      if (heightDiff > 200) {
        setKeyboardHeight(heightDiff);
      } else {
        setKeyboardHeight(0);
      }
    };

    // Listen to visual viewport changes (better for mobile keyboards)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [inputFocused]);

  // Handle input focus/blur with better timing
  const handleInputFocus = () => {
    setInputFocused(true);
    // Delay to allow keyboard animation
    setTimeout(() => {
      scrollToBottom();
    }, 150);
  };

  const handleInputBlur = () => {
    // Don't immediately hide keyboard height - let it animate
    setTimeout(() => {
      setInputFocused(false);
      setKeyboardHeight(0);
    }, 100);
  };

  // Handle clicking outside the chatbox to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 🔥 BACKEND API INTEGRATION - Replace direct Gemini calls
  const getBackendResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      // Check if backend is available
      if (backendStatus === 'disconnected') {
        return 'Backend सेवा अनुपलब्ध है। कृपया बाद में प्रयास करें। 🔌\n\n(Backend service is unavailable. Please try again later.)';
      }

      // Make API call to your backend
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage
        }),
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend API Error:', errorData);
        
        // Handle different error statuses
        if (response.status === 400) {
          return errorData.message || 'अमान्य संदेश। कृपया पुनः प्रयास करें। 📝';
        } else if (response.status === 429) {
          return errorData.message || 'बहुत से अनुरोध। कृपया कुछ समय बाद प्रयास करें। ⏰';
        } else if (response.status === 500) {
          return errorData.message || 'सर्वर की समस्या। कृपया बाद में प्रयास करें। 🛠️';
        } else {
          throw new Error(`Backend request failed: ${response.status}`);
        }
      }

      const data = await response.json();
      
      // Extract the response from backend
      if (data.success && data.response) {
        return data.response;
      } else if (data.error) {
        return data.message || 'Backend error occurred';
      } else {
        throw new Error('Invalid response format from backend');
      }
      
    } catch (error) {
      console.error('Error getting backend response:', error);
      
      // Provide helpful error messages based on error type
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          return 'Response timeout हो गया। कृपया पुनः प्रयास करें। ⏱️\n\n(Response timed out. Please try again.)';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          return 'इंटरनेट कनेक्शन की समस्या है। कृपया कनेक्शन जांचें। 🌐\n\n(Internet connection issue. Please check your connection.)';
        } else if (error.message.includes('CORS')) {
          return 'CORS error - कृपया backend configuration जांचें। 🔒';
        }
      }
      
      // Default spiritual fallback message
      return `मुझे खुशी है कि आपने प्रश्न पूछा। कृपया थोड़ी देर बाद पुनः प्रयास करें। 🙏

तब तक गीता के इस श्लोक पर मनन करें:
"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" (2.47)

(I'm happy you asked. Please try again in a moment. Until then, contemplate this Gita verse: "You have the right to perform actions, but not to the fruits of action.")`;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending messages with better UX
  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessageText = inputMessage.trim();
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessageText,
      timestamp: new Date()
    };

    // Add user message to chat and clear input immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Blur input to hide keyboard after sending
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }, 100);

    try {
      // Get AI response from backend
      const aiResponseContent = await getBackendResponse(userMessageText);
      
      // Create bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: aiResponseContent,
        timestamp: new Date()
      };

      // Add bot response to chat
      setMessages(prev => [...prev, botResponse]);
      
    } catch (error) {
      console.error('Error in chat:', error);
      // Enhanced error fallback message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `क्षमा करें, कुछ तकनीकी समस्या है। 🛠️

गीता कहती है: "योगस्थः कुरु कर्माणि" (2.48) - संयमित रहकर कर्म करो।

कृपया पुनः प्रयास करें। 🙏

(Sorry, there's a technical issue. The Gita says: "Yogasthah kuru karmani" - perform action with equanimity. Please try again.)`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Format timestamp for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 🎨 Custom animation styles
  const customStyles = {
    fadeIn: {
      animation: 'fadeIn 0.5s ease-out'
    },
    float: (delay: number) => ({
      animation: `float 3s ease-in-out infinite`,
      animationDelay: `${delay}s`
    })
  };

  // 💫 Inject CSS animations dynamically
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      .chat-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .chat-scrollbar::-webkit-scrollbar-thumb {
        background-color: #fed7aa;
        border-radius: 6px;
      }
      
      .chat-scrollbar::-webkit-scrollbar-track {
        background-color: #fff7ed;
      }

      /* Prevent zoom on input focus on iOS */
      input[type="text"] {
        font-size: 16px;
      }
      
      @media screen and (max-width: 768px) {
        input[type="text"]:focus {
          font-size: 16px;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Calculate dynamic positioning - Fixed logic
  const getChatPosition = () => {
    if (!isOpen) return { bottom: '5rem' };
    
    // When keyboard is open, position chat higher
    if (keyboardHeight > 0 && inputFocused) {
      return {
        bottom: `${Math.max(keyboardHeight + 20, 120)}px`,
        maxHeight: `calc(100vh - ${keyboardHeight + 100}px)`,
        transition: 'bottom 0.2s ease-out, max-height 0.2s ease-out'
      };
    }
    
    // Normal position when closed or no keyboard
    return {
      bottom: '5rem',
      maxHeight: 'calc(100vh - 8rem)',
      transition: 'bottom 0.2s ease-out, max-height 0.2s ease-out'
    };
  };

  // Get toggle button position
  const getToggleButtonPosition = () => {
    if (keyboardHeight > 0 && inputFocused && isOpen) {
      return {
        transform: `translateY(-${Math.min(keyboardHeight - 20, 300)}px) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
        transition: 'transform 0.2s ease-out'
      };
    }
    
    return {
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease-out'
    };
  };

  // Get status color based on backend connection
  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'bg-green-400';
      case 'disconnected': return 'bg-red-400';
      case 'checking': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected': return 'Backend Connected';
      case 'disconnected': return 'Backend Offline';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* 💬 Main Chat Window - Improved Positioning */}
      <div 
        ref={chatContainerRef}
        className={`absolute right-0 
          w-[350px] h-[500px] 
          sm:w-96 sm:h-[550px] 
          max-w-[calc(100vw-2rem)]
          bg-white rounded-3xl shadow-2xl border border-orange-200 
          origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{
          ...getChatPosition(),
          right: 'clamp(0.5rem, 0.5rem, calc(100vw - 350px - 0.5rem))',
          transformOrigin: 'bottom right',
          transition: isOpen 
            ? 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out, bottom 0.2s ease-out, max-height 0.2s ease-out' 
            : 'transform 0.2s ease-in, opacity 0.2s ease-in'
        }}
      >
        
        {/* 🔝 Header - Enhanced Design */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-t-3xl p-3 sm:p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Flower2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base flex items-center">
                SantVaani Guide
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-yellow-200" />
              </h3>
              <p className="text-white/90 text-xs sm:text-sm flex items-center">
                <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${getStatusColor()} rounded-full mr-1 sm:mr-2 ${backendStatus === 'connected' ? 'animate-pulse' : ''}`}></span>
                Bhagavad Gita Wisdom
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-all duration-200 p-1 rounded-full hover:bg-white/10 active:scale-95"
            aria-label="Close chat"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* 💬 Messages Area - Enhanced Styling */}
        <div 
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 
            bg-gradient-to-b from-orange-50/50 via-white to-orange-50/30 chat-scrollbar"
          style={{
            height: keyboardHeight > 0 && inputFocused
              ? `calc(100% - 160px)` 
              : `calc(100% - 140px)`,
            transition: 'height 0.2s ease-out'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              style={customStyles.fadeIn}
            >
              <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-2.5 sm:p-3 ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white ml-8 sm:ml-12 shadow-md'
                  : 'bg-white border border-orange-200 text-gray-800 mr-8 sm:mr-12 shadow-sm hover:shadow-md transition-shadow duration-200'
              }`}>
                <div className="flex items-start space-x-1.5 sm:space-x-2">
                  {message.type === 'bot' && (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      message.type === 'user' ? 'text-white' : 'text-gray-700'
                    }`}>
                      {message.content}
                    </p>
                    <p className={`text-[10px] sm:text-xs mt-1.5 ${
                      message.type === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* ⌨️ Enhanced Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start" style={customStyles.fadeIn}>
              <div className="bg-white border border-orange-200 rounded-2xl p-2.5 sm:p-3 mr-8 sm:mr-12 shadow-sm">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs sm:text-sm text-gray-600 mr-2">SantVaani is thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ⌨️ Input Area - Enhanced UX */}
        <div className="p-3 sm:p-4 border-t border-orange-100 bg-gradient-to-r from-orange-50/50 to-white rounded-b-3xl">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Ask about Bhagavad Gita teachings..."
                disabled={isLoading || backendStatus === 'disconnected'}
                className="w-full p-2.5 sm:p-3 pr-10 sm:pr-12 rounded-2xl border border-orange-200 
                  focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent 
                  bg-white/80 backdrop-blur-sm text-gray-700 placeholder-gray-500 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-sm sm:text-base transition-all duration-200 shadow-sm
                  hover:shadow-md focus:shadow-md"
                style={{ 
                  fontSize: '16px',
                  transform: keyboardHeight > 0 && inputFocused ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out'
                }}
              />
              <Heart className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading || backendStatus === 'disconnected'}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl 
                flex items-center justify-center text-white hover:from-orange-600 hover:to-red-600 
                transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
              aria-label="Send message"
              style={{
                transform: keyboardHeight > 0 && inputFocused 
                  ? 'translateY(-2px) scale(1)' 
                  : 'translateY(0) scale(1)',
                transition: 'transform 0.2s ease-out'
              }}
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          {/* Backend Status Indicator */}
          <div className="flex items-center justify-center mt-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Enhanced Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 
          rounded-full shadow-2xl flex items-center justify-center text-white 
          hover:from-orange-600 hover:via-red-600 hover:to-pink-600 
          active:scale-95 hover:scale-110 transition-all duration-300 
          hover:shadow-orange-500/25 border-2 border-white/20`}
        style={getToggleButtonPosition()}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-7 sm:h-7" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7" />
            <div className={`absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 ${getStatusColor()} rounded-full flex items-center justify-center ${backendStatus === 'connected' ? 'animate-pulse' : ''}`}>
              <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
            </div>
          </div>
        )}
      </button>

      {/* ✨ Enhanced Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full opacity-60 ${
              i % 2 === 0 ? 'bg-orange-300' : 'bg-pink-300'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              ...customStyles.float(i * 0.5)
               }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatBot;