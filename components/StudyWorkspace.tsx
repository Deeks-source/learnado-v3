
import React from 'react';
import { PDFViewer } from './PDFViewer';
import { ContentType } from '../types';
import { GraduationCap } from 'lucide-react';

interface StudyWorkspaceProps {
  type: ContentType;
  source: string;
  pdfData: string | null;
  notes: string;
  setNotes: (n: string) => void;
  messages: any[];
}

export const StudyWorkspace: React.FC<StudyWorkspaceProps> = ({ type, source, pdfData, notes, setNotes, messages }) => {
  const getYouTubeId = (url: string) => {
    // Enhanced regex to capture standard videos, shorts, and shortened URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderFormattedText = (text: string) => {
    const blocks = text.split('\n');
    let tableRows: string[][] = [];

    return blocks.map((line, idx) => {
      if (line.trim().startsWith('|') && line.includes('|')) {
        const row = line.split('|').filter(c => c.trim() !== '').map(c => c.trim());
        if (line.includes('---')) return null;
        tableRows.push(row);
        
        const nextLine = blocks[idx + 1];
        if (!nextLine || !nextLine.trim().startsWith('|')) {
          const currentRows = [...tableRows];
          tableRows = [];
          return (
            <div key={`table-${idx}`} className="my-8 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    {currentRows[0].map((cell, i) => (
                      <th key={i} className="px-5 py-3 text-left font-black text-zinc-900 uppercase tracking-tighter text-[11px]">{processLine(cell)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentRows.slice(1).map((row, ri) => (
                    <tr key={ri} className="border-b border-zinc-100 last:border-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-5 py-3 text-zinc-700 text-sm">{processLine(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      }

      if (line.startsWith('###')) {
        return <h3 key={idx} className="text-3xl font-black mt-12 mb-6 text-zinc-950 tracking-tighter border-l-[6px] border-green-600 pl-5">{line.replace('###', '')}</h3>;
      }
      if (line.startsWith('####')) {
        return <h4 key={idx} className="text-xl font-bold mt-8 mb-4 text-zinc-900 tracking-tight">{line.replace('####', '')}</h4>;
      }

      if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        return (
          <li key={idx} className="ml-5 mb-4 flex items-start gap-4 text-zinc-800 list-none font-playfair text-[18px]">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 mt-2 shrink-0 shadow-sm" />
            <span>{processLine(line.replace(/^[*-]\s*/, ''))}</span>
          </li>
        );
      }

      if (line.trim() === '') return <div key={idx} className="h-4" />;

      return (
        <p key={idx} className="mb-6 text-zinc-800 leading-[1.8] font-playfair text-[19px]">
          {processLine(line)}
        </p>
      );
    });
  };

  const processLine = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-black text-green-950 bg-green-50 px-1.5 py-0.5 rounded-sm border border-green-100/50">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-zinc-600">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const videoId = getYouTubeId(source);

  return (
    <div className="flex-1 w-full flex min-h-0 bg-white overflow-hidden">
      <div className="flex-1 bg-white flex flex-col min-h-0 overflow-hidden">
        {type === 'youtube' ? (
          <div className="flex-1 flex flex-col bg-black overflow-hidden">
            <div className="w-full bg-zinc-900 shadow-2xl">
              <div className="aspect-video w-full max-h-[60vh]">
                {videoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-4">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">!</div>
                    <p className="text-xs font-bold uppercase tracking-widest">Invalid Video ID</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
               <div className="max-w-2xl mx-auto space-y-8 pb-32">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    Lecture Segments
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                     {[
                       { time: '05:00', title: 'Core Introduction' },
                       { time: '12:45', title: 'Advanced Analysis' },
                       { time: '22:10', title: 'Practical Application' }
                     ].map((item, i) => (
                        <div key={i} className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 hover:border-green-500/30 transition-all cursor-pointer group">
                           <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-green-500 transition-colors">Timestamp {item.time}</p>
                           <p className="text-white font-medium mt-1">{item.title}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <PDFViewer pdfData={pdfData} fileName={source} />
        )}
      </div>

      <div className="flex-1 flex flex-col bg-white overflow-hidden shadow-[-1px_0_20px_rgba(0,0,0,0.05)] z-10 border-l border-zinc-100">
        <div className="flex items-center justify-between px-10 py-5 bg-zinc-50 border-b border-zinc-200 select-none">
           <div className="flex items-center gap-4">
              <GraduationCap size={18} className="text-green-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-zinc-400">Study Board</span>
           </div>
           <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-100/50 px-3 py-1 rounded-full border border-green-200">Active Learning</span>
        </div>
        
        <div className="flex-1 p-14 overflow-y-auto scrollbar-hide bg-white bg-[radial-gradient(#f0f0f0_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="space-y-12 max-w-2xl mx-auto pb-64">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start animate-in fade-in slide-in-from-bottom-2 duration-500'}`}>
                {msg.role === 'user' ? (
                  <div className="bg-zinc-50 text-green-900 rounded-xl px-6 py-4 text-xl font-playfair italic border border-green-200 shadow-sm mb-6 max-w-[95%]">
                    {msg.content}
                  </div>
                ) : (
                  <div className="text-zinc-900 w-full mb-10">
                    {renderFormattedText(msg.content)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-12 py-5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between select-none">
           <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Textbook Analysis Mode</span>
           <div className="flex gap-8">
              <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-green-600 transition-colors">Export</button>
              <button className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-green-600 transition-colors">Save</button>
           </div>
        </div>
      </div>
    </div>
  );
};
