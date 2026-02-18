import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
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
  en: 'Namaste 🙏\n\nI am Santvaani, your spiritual guide powered by the wisdom of the Bhagavad Gita.\n\nIf your heart feels heavy or things don\'t make sense right now, I am here to listen and help.\n\nAsk me anything about life, relationships, purpose, or spiritual guidance.',
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

  const getBackendUrl = () => {
    if (import.meta.env.MODE === 'development') return 'http://localhost:5000';
    return import.meta.env.VITE_BACKEND_URL || 'https://santvaani-backend.onrender.com';
  };

  const BACKEND_URL = getBackendUrl();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: INITIAL_MESSAGES[language as keyof typeof INITIAL_MESSAGES] || INITIAL_MESSAGES.en,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length > 0 && messages[0].type === 'bot') {
      const first = messages[0];
      const isGreeting = first.content.includes('Namaste') || first.content.includes('नमस्ते');
      if (isGreeting) {
        setMessages(prev => {
          const updated = [...prev];
          updated[0] = { ...updated[0], content: INITIAL_MESSAGES[language as keyof typeof INITIAL_MESSAGES] || INITIAL_MESSAGES.en };
          return updated;
        });
      }
    }
  }, [language, isOpen]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    const check = async () => {
      try {
        setBackendStatus('checking');
        const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(10000) });
        setBackendStatus(res.ok ? 'connected' : 'disconnected');
      } catch {
        setBackendStatus('disconnected');
      }
    };
    check();
  }, [BACKEND_URL]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const getBackendResponse = async (userMessage: string): Promise<string> => {
    try {
      setIsLoading(true);
      if (backendStatus === 'disconnected') return 'Service is unavailable right now. Please try again later. 🙏';

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 429) return err.message || 'Too many requests. Please wait a moment. ⏰';
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.response) return data.response;
      throw new Error('Invalid response format');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message.includes('timeout')) return 'Response timed out. Please try again. ⏱️';
        if (error.message.includes('fetch') || error.message.includes('network')) return 'Check your internet connection and try again. 🌐';
      }
      return `Please try again in a moment. 🙏\n\n"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन" (Gita 2.47)\n\n"You have the right to act, but never to the fruits of action."`;
    } finally {
      setIsLoading(false);
    }
  };

  const animateMessage = useCallback((content: string, messageId: string) => {
    let index = 0;
    const words = content.split(' ');
    const interval = setInterval(() => {
      if (index < words.length) {
        const display = words.slice(0, index + 1).join(' ');
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: display, isAnimating: true } : m));
        index++;
      } else {
        clearInterval(interval);
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isAnimating: false } : m));
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim() || isLoading) return;
    const text = inputMessage.trim();
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiContent = await getBackendResponse(text);
      const botId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botId, type: 'bot', content: '', timestamp: new Date(), isAnimating: true }]);
      setIsTyping(false);
      animateMessage(aiContent, botId);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), type: 'bot',
        content: `Sorry, a technical issue occurred. 🛠️\n\nPlease try again. 🙏`,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleInputFocus = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const isConnected = backendStatus === 'connected';

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-600
            rounded-full shadow-xl flex items-center justify-center
            transition-all duration-300 active:scale-95 hover:scale-105
            border-2 border-orange-300/40 ${className}`}
          aria-label="Open Gita Guide"
        >
          <span className="text-white text-2xl font-bold leading-none" style={{ fontFamily: 'serif' }}>ॐ</span>
          {/* Status dot */}
          <span className={`absolute top-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white
            ${isConnected ? 'bg-green-400' : backendStatus === 'checking' ? 'bg-yellow-400' : 'bg-red-400'}
            ${isConnected ? 'animate-pulse' : ''}`}
          />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className={`
            fixed z-50 bg-white flex flex-col overflow-hidden
            /* Mobile: full screen */
            inset-0
            /* Desktop: compact panel bottom-right */
            sm:inset-auto sm:bottom-6 sm:right-6
            sm:w-[400px] sm:h-[600px]
            sm:rounded-2xl sm:shadow-2xl
            transition-all duration-300
          `}
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
          >

            {/* Header */}
            <div className="bg-orange-500 px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                  <span className="text-white text-lg font-bold" style={{ fontFamily: 'serif' }}>ॐ</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base leading-tight">Gita Guide</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-300 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="text-white/75 text-xs">
                      {isConnected ? 'Online' : backendStatus === 'checking' ? 'Connecting...' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/15 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-orange-50/20"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#fed7aa transparent' }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>

                  {/* Bot avatar */}
                  {msg.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-orange-600 text-sm font-bold" style={{ fontFamily: 'serif' }}>ॐ</span>
                    </div>
                  )}

                  <div className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                    msg.type === 'user'
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}>
                    <p className={`text-base sm:text-sm leading-relaxed whitespace-pre-line ${msg.type === 'user' ? 'text-white' : 'text-gray-700'}`}>
                      {msg.content}
                      {msg.isAnimating && (
                        <span className="inline-block w-0.5 h-4 ml-0.5 bg-orange-400 animate-pulse align-middle" />
                      )}
                    </p>
                    <p className={`text-xs mt-1.5 ${msg.type === 'user' ? 'text-orange-100' : 'text-gray-300'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {/* User avatar */}
                  {msg.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-semibold">You</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 text-sm font-bold" style={{ fontFamily: 'serif' }}>ॐ</span>
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={handleInputFocus}
                  placeholder={PLACEHOLDERS[language as keyof typeof PLACEHOLDERS] || PLACEHOLDERS.en}
                  disabled={isLoading || backendStatus === 'disconnected'}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-base sm:text-sm text-gray-700
                    placeholder-gray-400 bg-gray-50 focus:bg-white
                    focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || backendStatus === 'disconnected'}
                  className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center
                    text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  aria-label="Send"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-center text-xs text-gray-300 mt-2">Powered by Bhagavad Gita wisdom</p>
            </div>

          </div>
        </>
      )}
    </>
  );
};

export default ChatBot;
