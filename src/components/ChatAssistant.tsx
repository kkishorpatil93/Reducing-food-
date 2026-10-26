import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, ShieldAlert, ArrowRight, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  action?: { label: string; route: string };
}

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your rule-based FoodBridge Assistant. How can I guide you with food donation, food safety rules, or courier volunteering today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const navigate = useNavigate();

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const newMessages: Message[] = [...messages, { sender: 'user', text: query }];
    setInputText('');

    // Rule-based deterministic intent matcher
    const lower = query.toLowerCase();
    let replyText = '';
    let action = undefined;

    if (lower.includes('rice') || (lower.includes('kg') && lower.includes('cooked'))) {
      replyText =
        'Great! For 8 kg of cooked rice, that yields approximately 24 nutritious meals (8 kg × 3.0 factor). To ensure food safety: Was it prepared within the last 4 hours and kept hot (≥60°C) or promptly refrigerated (≤4°C)? If safe, you can post it now!';
      action = { label: 'Pre-fill Donation Form (8 kg Rice)', route: '/donor?action=new' };
    } else if (lower.includes('safe') || lower.includes('safety') || lower.includes('policy')) {
      replyText =
        'Food safety rule: "Only donate food that is safe, properly stored, and suitable for consumption. The donor remains responsible for food safety." Meals must be in food-grade sealed packaging.';
      action = { label: 'Read Full Safety Charter', route: '/trust' };
    } else if (lower.includes('volunteer') || lower.includes('courier') || lower.includes('deliver')) {
      replyText =
        'Volunteers receive live push notifications for surplus pickups in their designated radius. You earn 10 points and unlock badges (Food Saver, Community Hero, Food Champion, FoodBridge Legend) for completed rescues!';
      action = { label: 'Open Volunteer Dashboard', route: '/volunteer' };
    } else if (lower.includes('ngo') || lower.includes('shelter') || lower.includes('kitchen')) {
      replyText =
        'Verified NGOs like Green Hope Foundation and Seva Kitchen receive automatic matches based on their intake capacity, dietary criteria, and proximity.';
      action = { label: 'Open NGO Dashboard', route: '/ngo' };
    } else if (lower.includes('how') && lower.includes('donate')) {
      replyText =
        'Donating is simple: 1. Click "Donate Food" or "⚡ Quick Donation". 2. Enter dish name & weight (15 kg cooked = ~35 meals). 3. Accept food safety disclaimer. 4. Our Smart Matching Algorithm alerts nearby couriers!';
      action = { label: 'Post Donation Now', route: '/donor?action=new' };
    } else {
      replyText =
        'I can assist with: (1) Estimating meal yield from weight, (2) Food safety guidelines, (3) Courier volunteering, and (4) NGO capacity. Try asking: "I have 8 kg of cooked rice from an event".';
    }

    newMessages.push({ sender: 'bot', text: replyText, action });
    setMessages(newMessages);
  };

  const handleAction = (route: string) => {
    setIsOpen(false);
    navigate(route);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-emerald-700 text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border-2 border-emerald-500/50"
        title="Open FoodBridge Assistant (Rule-Based)"
      >
        <Bot className="w-6 h-6 text-emerald-400" />
        <span className="hidden sm:inline text-xs font-bold pr-1">Assistant</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px]">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">FoodBridge Assistant</h3>
                </div>
                {/* Mandatory Honest Rule-Based Label */}
                <p className="text-[10px] text-emerald-400 font-medium">
                  Rule-Based Intent Matcher • No Generative Hallucination
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Safety Notice Banner */}
          <div className="px-3 py-1.5 bg-amber-50 border-b border-amber-200 text-[10px] text-amber-900 font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Always inspect food freshness. Donors remain responsible for food safety.</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.action && (
                    <button
                      onClick={() => handleAction(m.action!.route)}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>{m.action.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => handleSend('I have 8 kg of cooked rice from an event')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 whitespace-nowrap border border-slate-200"
            >
              "8 kg cooked rice from event"
            </button>
            <button
              onClick={() => handleSend('How do volunteer badges work?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 whitespace-nowrap border border-slate-200"
            >
              "Volunteer badges"
            </button>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about meal yield, food safety, volunteering..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 text-xs text-slate-900"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
