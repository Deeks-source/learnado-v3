
import React from 'react';
import { PenLine, Save, Share2, MoreHorizontal } from 'lucide-react';

interface NotebookProps {
  notes: string;
  setNotes: (notes: string) => void;
}

export const Notebook: React.FC<NotebookProps> = ({ notes, setNotes }) => {
  return (
    <div className="flex flex-col h-full glass rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-green-500/20 rounded-lg text-green-400">
            <PenLine size={18} />
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-100">Student Notebook</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"><Save size={18} /></button>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"><Share2 size={18} /></button>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      <div className="flex-1 p-6 relative group">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Start summarizing the chapter here..."
          className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-zinc-300 placeholder:text-zinc-600 leading-relaxed font-light text-lg scrollbar-hide"
        />
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-zinc-500 font-medium bg-black/40 px-2 py-1 rounded border border-white/5">Auto-saving...</span>
          <span className="text-[10px] text-zinc-500 font-medium bg-black/40 px-2 py-1 rounded border border-white/5">{notes.split(/\s+/).filter(Boolean).length} Words</span>
        </div>
      </div>
    </div>
  );
};
