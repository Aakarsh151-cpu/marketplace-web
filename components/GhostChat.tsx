// marketplace-web/components/GhostChat.tsx
"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, Bot, AlertTriangle } from 'lucide-react';

export default function GhostChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [workOrder, setWorkOrder] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      // Ping the FastAPI backend Ollama dispatcher
      const res = await axios.post('http://localhost:8000/api/triage/chat/', {
        customer_message: input
      });
      setWorkOrder(res.data.dispatch);
      setInput('');
    } catch (error) {
      console.error(error);
      alert('Ghost Assistant is currently offline.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-black text-white p-6 flex items-center gap-3">
        <Bot className="w-8 h-8 text-cyan-400" />
        <div>
          <h2 className="text-xl font-black tracking-tight">Ghost Assistant</h2>
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Autonomous Dispatch</p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {workOrder ? (
          <div className="bg-white border-l-4 border-cyan-500 p-6 rounded-xl shadow-sm animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {workOrder.category.replace('_', ' ')}
              </span>
              {workOrder.urgency === 'HIGH' && (
                <span className="flex items-center gap-1 text-red-600 text-xs font-bold uppercase">
                  <AlertTriangle className="w-4 h-4" /> High Priority
                </span>
              )}
            </div>
            <p className="text-gray-800 font-medium mb-4 leading-relaxed">"{workOrder.summary}"</p>
            <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
              Confirm & Dispatch Partner
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">How can I help?</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Describe your home repair issue or tell me where you want to travel today.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I need a cab to the airport..."
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 rounded-xl py-4 pl-4 pr-12 text-sm transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </form>
    </div>
  );
}