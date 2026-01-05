
import React, { useState } from 'react';
import { ArrowUp, Sparkles, Mic, Paperclip, CircleDashed } from 'lucide-react';

interface ChatInterfaceProps {
  onSendMessage: (text: string) => void;
  isThinking: boolean;
  messages: any[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, isThinking }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isThinking) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50 animate-in slide-in-from-bottom-10 duration-1000">
      <div className="relative group">
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col bg-zinc-900/90 backdrop-blur-xl rounded-[32px] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,1)] border border-white/10 group-focus-within:border-green-500/60 group-focus-within:shadow-[0_0_60px_rgba(34,197,94,0.2)] transition-all duration-700"
        >
          <div className="flex items-center gap-6 px-10 py-6">
             <div className="shrink-0">
               {isThinking ? (
                 <CircleDashed className="animate-spin text-green-500" size={28} />
               ) : (
                 <div className="p-2 bg-green-500/15 rounded-xl">
                    <Sparkles className="text-green-500" size={24} />
                 </div>
               )}
             </div>
             <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the chapter..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-zinc-600 text-xl font-light outline-none"
            />
            <div className="flex items-center gap-4 shrink-0">
              <button type="button" className="hidden sm:block p-3 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-full">
                <Mic size={20} />
              </button>
              <button type="button" className="hidden sm:block p-3 text-zinc-500 hover:text-white transition-all hover:bg-white/5 rounded-full">
                <Paperclip size={20} />
              </button>
              <button 
                type="submit"
                disabled={!input.trim() || isThinking}
                className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 hover:bg-green-500 hover:text-white active:scale-95 transition-all disabled:opacity-20 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                <ArrowUp size={24} strokeWidth={3} />
              </button>
            </div>
          </div>
        </form>

        {/* Action Buttons: Moved slightly higher and spaced better for visibility */}
        <div className="absolute -bottom-12 left-0 w-full flex justify-center gap-4 sm:gap-8 pb-4">
          {['Synthesize Page', 'Concept Quiz', 'Visualize Data'].map((label) => (
            <button 
              key={label}
              onClick={() => onSendMessage(label)}
              className="px-4 sm:px-6 py-2 rounded-full bg-black/80 backdrop-blur border border-white/10 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/10 transition-all shadow-2xl active:scale-95"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
