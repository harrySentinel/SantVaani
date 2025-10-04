import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isAnimating?: boolean;
}

interface ChatBotProps {
  className?: string;
}

const INITIAL_MESSAGES = {
  en: 'Namaste 🙏\n\nI am SantVaani, your spiritual guide powered by the wisdom of the Bhagavad Gita.\n\nIf your heart feels heavy or things don\'t make sense right now, I am here to listen and help.\n\nAsk me anything about life, relationships, purpose, or spiritual guidance.',
  hi: 'नमस्ते 🙏\n\nमैं संतवाणी हूं, भगवद गीता के ज्ञान से संचालित आपका आध्यात्मिक मार्गदर्शक।\n\nयदि आपका मन भारी है या जीवन में कुछ समझ नहीं आ रहा है, तो मैं यहां हूं सुनने और मदद करने के लिए।\n\nजीवन, रिश्ते, उद्देश्य या आध्यात्मिक मार्गदर्शन के बारे में कुछ भी पूछें।'
};

const PLACEHOLDERS = {
  en: 'Ask about life, spirituality, or Gita wisdom...',
  hi: 'जीवन, आध्यात्मिकता या गीता ज्ञान के बारे में पूछें...'
};

const ChatBot: React.FC<ChatBotProps> = ({ className = '' }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Backend configuration
  const getBackendUrl = () => {
    if (import.meta.env.MODE === 'development') {
      return 'http://localhost:5000';
    }
    return import.meta.env.VITE_BACKEND_URL || 'https://santvaani-backend.onrender.com';
  };

  const BACKEND_URL = getBackendUrl();

  // Initialize messages based on language (only when chatbot first opens)
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMsg: Message = {
        id: '1',
        type: 'bot',
        content: INITIAL_MESSAGES[language as keyof typeof INITIAL_MESSAGES] || INITIAL_MESSAGES.en,
        timestamp: new Date()
      };
      setMessages([initialMsg]);
    }
  }, [isOpen, language]);

  // Smooth scrolling to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Check backend health
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        setBackendStatus('checking');
        const response = await fetch(`${BACKEND_URL}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      } catch (error) {
        console.error('Backend health check error:', error);
        setBackendStatus('disconnected');
      }
    };

    checkBackendHealth();
  }, [BACKEND_URL]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Get backend response
  const getBackendResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsLoading(true);

      if (backendStatus === 'disconnected') {
        return 'Backend service is unavailable. Please try again later. 🔌';
      }

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          return errorData.message || 'Too many requests. Please try again in a moment. ⏰';
        }
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.response) {
        return data.response;
      } else {
        throw new Error('Invalid response format from backend');
      }

    } catch (error) {
      console.error('Error getting backend response:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
          return 'Response timed out. Please try again. ⏱️';
        } else if (error.message.includes('fetch') || error.message.includes('network')) {
          return 'Internet connection issue. Please check your connection. 🌐';
        }
      }

      return `I'm happy you asked. Please try again in a moment. 🙏\n\nUntil then, contemplate this Gita verse:\n"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" (2.47)\n\n"You have the right to perform actions, but not to the fruits of action."`;
    } finally {
      setIsLoading(false);
    }
  };

  // Typing animation for bot messages
  const animateMessage = useCallback((content: string, messageId: string) => {
    let currentIndex = 0;
    const words = content.split(' ');

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        const displayContent = words.slice(0, currentIndex + 1).join(' ');
        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, content: displayContent, isAnimating: true }
            : msg
        ));
        currentIndex++;
      } else {
        clearInterval(interval);
        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? { ...msg, isAnimating: false }
            : msg
        ));
      }
    }, 30); // Speed of typing animation (30ms per word for smoother effect)

    return () => clearInterval(interval);
  }, []);

  // Handle sending messages
  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessageText = inputMessage.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponseContent = await getBackendResponse(userMessageText);

      const botResponseId = (Date.now() + 1).toString();
      const botResponse: Message = {
        id: botResponseId,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        isAnimating: true
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Start typing animation
      animateMessage(aiResponseContent, botResponseId);

    } catch (error) {
      console.error('Error in chat:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Sorry, there's a technical issue. 🛠️\n\nThe Gita says: "Yogasthah kuru karmani" - perform action with equanimity.\n\nPlease try again. 🙏`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle input focus - removed scroll behavior to fix keyboard overlap
  const handleInputFocus = () => {
    // Scroll to bottom of messages instead of input field
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Get status indicator
  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'checking': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500
          rounded-full shadow-2xl flex items-center justify-center text-white
          hover:from-orange-600 hover:via-red-600 hover:to-pink-600
          active:scale-95 hover:scale-110 transition-all duration-300
          border-2 border-white/20 ${isOpen ? 'hidden' : 'block'} ${className}`}
        aria-label="Open chat"
      >
        <div className="relative">
          <MessageCircle className="w-7 h-7" />
          <div className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusColor()} rounded-full flex items-center justify-center ${backendStatus === 'connected' ? 'animate-pulse' : ''}`}>
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </div>
      </button>

      {/* Full Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden">
          <div className="h-full flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">

              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 rounded-t-2xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/40 shadow-lg">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-2xl flex items-center drop-shadow-md">
                      SantVaani Guide
                    </h2>
                    <p className="text-white/95 text-sm flex items-center mt-1">
                      <span className={`w-2 h-2 ${getStatusColor()} rounded-full mr-2 shadow-lg ${backendStatus === 'connected' ? 'animate-pulse' : ''}`}></span>
                      Powered by Gita Wisdom
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/90 hover:text-white transition-all duration-200 p-2 rounded-full hover:bg-white/20 active:scale-95 relative z-10"
                  aria-label="Close chat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-orange-50/30 via-white to-orange-50/30"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#fed7aa #fff7ed' }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
                  >
                    <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                        : 'bg-white border border-orange-200 text-gray-800 shadow-md'
                    }`}>
                      {message.type === 'bot' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-semibold text-orange-600">SantVaani</span>
                        </div>
                      )}
                      <p className={`text-base leading-relaxed whitespace-pre-line ${
                        message.type === 'user' ? 'text-white' : 'text-gray-700'
                      }`}>
                        {message.content}
                        {message.isAnimating && (
                          <span className="inline-block w-1 h-4 ml-1 bg-orange-500 animate-pulse"></span>
                        )}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-in fade-in duration-200">
                    <div className="bg-white border border-orange-200 rounded-2xl p-4 shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">SantVaani is thinking</span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area - Fixed to bottom on mobile */}
              <div className="p-4 sm:p-6 border-t border-orange-100 bg-gradient-to-r from-orange-50/50 to-white rounded-b-2xl">
                <div className="flex items-center space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={handleInputFocus}
                    placeholder={PLACEHOLDERS[language as keyof typeof PLACEHOLDERS] || PLACEHOLDERS.en}
                    disabled={isLoading || backendStatus === 'disconnected'}
                    className="flex-1 p-3 sm:p-4 rounded-xl border-2 border-orange-200
                      focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
                      bg-white text-gray-700 placeholder-gray-400 text-base
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading || backendStatus === 'disconnected'}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl
                      flex items-center justify-center text-white hover:from-orange-600 hover:to-red-600
                      transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                    aria-label="Send message"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
