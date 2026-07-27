import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Clock,
  ChevronDown,
  Sparkles,
  ExternalLink,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  '📩 When will I receive my leads?',
  '💰 How much does the dataset cost?',
  '💳 How do I pay via Cash App?',
  '📋 What details are included in each lead?',
  '🔍 Can I filter leads by state or ZIP?'
];

// Fallback response engine in case server or API is temporarily unavailable
const getFallbackAnswer = (question: string): string => {
  const q = question.toLowerCase();

  if (q.includes('receive') || q.includes('when') || q.includes('delivery') || q.includes('time') || q.includes('email')) {
    return '⏱️ **Lead Delivery Timeframe:**\nAll purchased leads will be emailed directly to your specified email address within **24 to 48 hours** after payment completion via Cash App.';
  }
  if (q.includes('cost') || q.includes('price') || q.includes('how much') || q.includes('75') || q.includes('dollar')) {
    return '💰 **Pricing Information:**\nThe complete verified USA moving leads dataset (150 active leads across all 50 states) is available for a flat rate of **$75** via Cash App ($Movers312).';
  }
  if (q.includes('cash app') || q.includes('pay') || q.includes('buy') || q.includes('purchase') || q.includes('how to')) {
    return '💳 **How to Purchase:**\n1. Click any **Cash App Purchase ($75)** button on the site.\n2. Complete the short purchase form with your First Name, Last Name, Email, and Phone Number.\n3. Click **Submit Info & Pay $75 via Cash App**.\n4. Complete your $75 payment to **$Movers312** on Cash App.\n5. Your leads will be emailed to you within 24 to 48 hours!';
  }
  if (q.includes('details') || q.includes('include') || q.includes('what') || q.includes('data')) {
    return '📋 **Lead Information Included:**\nEach verified lead includes:\n- Full Name & Contact Phone / Email\n- Origin City, State & ZIP Code\n- Destination City & State\n- Residence Type & Square Footage (sq. ft.)\n- Move Date & Urgency Level\n- Estimated Job Value ($1,250 - $2,550+ depending on bedroom count)\n- Specialized Moving Notes & Truck Size Estimates';
  }
  if (q.includes('filter') || q.includes('zip') || q.includes('state') || q.includes('search')) {
    return '🔍 **Filtering & Search Capabilities:**\nYou can filter the dataset instantly using the Filters Bar at the top of the table:\n- Filter by State or City\n- Search specific ZIP codes or customer names\n- Filter by Urgency (Urgent, High, Standard) or Residence Type\n- View geographic concentration using the ZIP Clusters view!';
  }

  return 'Thank you for reaching out! For all purchases made on Moving Leads For Sale (MovingLeadsForSale.Org), please note that **all purchased leads will be emailed to you within 24 to 48 hours after payment completion** to $Movers312 on Cash App. If you have a specific question about states, square footage, or AI sales pitch generators, feel free to ask!';
};

export const AiSupportChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: '👋 Hello! Welcome to **Moving Leads For Sale** (MovingLeadsForSale.Org).\n\nI am your 24/7 AI Support Assistant. How can I help you today? Ask me anything about lead delivery, pricing, Cash App payments, or dataset details!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for backend API
      const history = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText.trim(),
          history,
        }),
      });

      if (!res.ok) {
        throw new Error('Support service endpoint error');
      }

      const data = await res.json();
      const botReply = data.reply || getFallbackAnswer(userText);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.warn('AI Support API call failed, using client fallback engine:', err);
      // Fallback
      const fallbackReply = getFallbackAnswer(userText);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Render message text with basic formatting
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1.5" />;

          // Process bold text **text**
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx} className="leading-snug">
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-bold">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Widget Launcher Button */}
      <div className="fixed bottom-24 right-4 sm:bottom-18 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group px-5 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-sm sm:text-base rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-300/40 cursor-pointer flex items-center gap-2.5"
          title="Open AI Support Chat"
        >
          {isOpen ? (
            <>
              <X className="w-6 h-6" />
              <span>Close AI Support</span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-ping" />
              </div>
              <span className="tracking-wide">AI Chat Support</span>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full border border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Floating Chat Box Panel */}
      {isOpen && (
        <div className="fixed bottom-38 right-4 sm:bottom-32 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/80 border border-indigo-400/40 flex items-center justify-center text-white shadow-xs">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                  <span>AI Support Assistant</span>
                  <span className="text-[10px] font-mono bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded border border-indigo-400/30">
                    24/7 Live
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300">MovingLeadsForSale.Org Helpdesk</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Notice Banner Inside Chat */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 py-2 text-[11px] text-amber-900 flex items-center gap-2 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Delivery Notice:</strong> Leads emailed within 24–48 hrs after Cash App payment.
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3 shadow-2xs ${
                      isAssistant
                        ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs'
                    }`}
                  >
                    {renderFormattedText(msg.text)}
                    <span
                      className={`text-[9px] block mt-1 text-right ${
                        isAssistant ? 'text-slate-400' : 'text-indigo-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isAssistant && (
                    <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-xs flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Questions */}
          <div className="p-2 border-t border-slate-200 bg-white shrink-0 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-medium rounded-full border border-indigo-200 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              disabled={isLoading}
              className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 text-white rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
