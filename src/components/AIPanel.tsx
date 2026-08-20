import React, { useState, useRef, useEffect } from 'react';
import { RoxiMessage, Transaction } from '../types';
import { 
  Send, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  PieChart, 
  PiggyBank, 
  Coffee, 
  HelpCircle,
  Flame,
  ArrowRight,
  TrendingUp,
  Wallet
} from 'lucide-react';

interface AIPanelProps {
  transactions: Transaction[];
  monthlyBudgetLimit: number;
  isFullTab?: boolean;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  transactions,
  monthlyBudgetLimit,
  isFullTab = false,
}) => {
  const [messages, setMessages] = useState<RoxiMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Hello! I am your AI Financial Advisor. I have analyzed your transactions and current monthly limit. How can I assist with your budgeting, expense forecasting, or savings goals today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Financial calculations
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;
  const remainingBudget = monthlyBudgetLimit - totalExpense;
  const budgetPercent = Math.min(Math.round((totalExpense / monthlyBudgetLimit) * 100), 100);

  const quickPrompts = [
    { icon: PieChart, label: 'Monthly Budget Status' },
    { icon: PiggyBank, label: 'Savings & Cutback Tips' },
    { icon: Flame, label: 'Daily Burn Rate Analysis' },
    { icon: Wallet, label: 'Cash Flow Projection' },
  ];

  // Smart local advisor response generator
  const generateAIResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();

    if (q.includes('burn') || q.includes('daily') || q.includes('rate')) {
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const remainingDays = Math.max(daysInMonth - now.getDate() + 1, 1);
      const safeDailySpend = Math.max(Math.round(remainingBudget / remainingDays), 0);
      return `Daily Burn Rate Analysis:\n\n• Current Month Total Expense: ৳${totalExpense.toLocaleString('en-BD')}\n• Remaining Days in Month: ${remainingDays} days\n• Maximum Recommended Daily Spend: ৳${safeDailySpend.toLocaleString('en-BD')}/day to remain within your ৳${monthlyBudgetLimit.toLocaleString('en-BD')} monthly allowance.`;
    }

    if (q.includes('out of money') || q.includes('low balance')) {
      return `Your current net balance is ৳${currentBalance.toLocaleString('en-BD')}.\n\nKey actions:\n1. Limit dining out and non-essential shopping.\n2. Prioritize necessary transport and university meals.\n3. Track daily small cash items (Tea, Snacks, Cigarettes).`;
    }

    if (q.includes('budget') || q.includes('status')) {
      return `Current Budget Overview:\n\n• Total Income Logged: ৳${totalIncome.toLocaleString('en-BD')}\n• Total Expense Logged: ৳${totalExpense.toLocaleString('en-BD')}\n• Budget Consumed: ${budgetPercent}%\n• Remaining Budget Allowance: ৳${remainingBudget.toLocaleString('en-BD')}\n\n${
        budgetPercent > 80
          ? '⚠️ Notice: You have used more than 80% of your monthly limit. Please throttle non-essential expenses.'
          : '✅ Your spending pace is healthy and well within budget.'
      }`;
    }

    if (q.includes('savings') || q.includes('save') || q.includes('cutback')) {
      return `Smart Financial Advice:\n• Automate: Set aside 10%–20% of your allowance upon receipt.\n• Audit: Review frequent small expenses (Tea & snacks, printouts).\n• Target: Keep monthly dining out under 25% of total budget.`;
    }

    return `Thank you for asking! Your current net balance is ৳${currentBalance.toLocaleString('en-BD')} with ৳${remainingBudget.toLocaleString('en-BD')} remaining in your monthly budget. Feel free to ask about specific loan EMI calculations, savings ratios, or category breakdowns.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: RoxiMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/roxi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          context: { currentBalance, totalExpense, remainingBudget, monthlyBudgetLimit, totalIncome },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || generateAIResponse(query);
        const aiMsg: RoxiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      setTimeout(() => {
        const fallbackText = generateAIResponse(query);
        const aiMsg: RoxiMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 400);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-24 animate-slide-in">
      {/* Header Banner */}
      <div className="bento-card p-5 flex items-center justify-between bg-[#12131A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Bot className="w-5 h-5 text-[#041E11]" strokeWidth={2.4} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-display">
                Finance AI Advisor
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              Real-time financial guidance powered by Gemini & local context
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono-nums font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            ৳{currentBalance.toLocaleString('en-BD')} Net Balance
          </span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="bento-card p-4 sm:p-6 flex flex-col gap-3 min-h-[380px] max-h-[500px] overflow-y-auto bg-[#12131A]">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] sm:max-w-[75%] gap-1 ${
                isAI ? 'self-start' : 'self-end items-end'
              }`}
            >
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAI
                    ? 'bg-[#181A24] text-zinc-100 rounded-tl-sm border border-white/[0.08]'
                    : 'bg-emerald-500 text-[#041E11] rounded-tr-sm font-semibold shadow-md shadow-emerald-500/10'
                }`}
              >
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                    {line}
                  </p>
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono-nums px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="self-start flex items-center gap-1.5 p-3 rounded-2xl bg-[#181A24] text-emerald-400 border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts & Query Input */}
      <div className="bento-card p-4 flex flex-col gap-3 bg-[#12131A]">
        {/* Suggestion Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {quickPrompts.map((prompt, idx) => {
            const Icon = prompt.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.label)}
                className="p-2.5 rounded-xl bento-inner-box hover:border-emerald-500/30 text-xs font-semibold text-zinc-300 hover:text-white transition-all flex items-center gap-2 truncate"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{prompt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 mt-1"
        >
          <input
            type="text"
            placeholder="Ask your financial advisor anything (budget, savings, tips)..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border border-white/[0.12] bg-[#0E0F15] text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-emerald-500 text-[#041E11] font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:bg-emerald-400 disabled:opacity-40 transition-all shrink-0 shadow-md shadow-emerald-500/20"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
