
import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { StudyWorkspace } from './components/StudyWorkspace';
import { ChatInterface } from './components/ChatInterface';
import { FileUp, Youtube, ChevronRight, ChevronLeft, Sparkles, BrainCircuit, BookOpenCheck } from 'lucide-react';
import { StudyState, Message, ContentType, SidebarTab } from './types';
import { chatWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>('library');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [state, setState] = useState<StudyState>({
    view: 'landing',
    contentType: null,
    contentSource: '',
    pdfData: null,
    notes: '',
    messages: [],
    isThinking: false
  });

  const [isExpanding, setIsExpanding] = useState(false);
  const [ytUrl, setYtUrl] = useState('');

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        handleStartStudy('pdf', file.name, base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartStudy = (type: ContentType, source: string = '', pdfData: string | null = null) => {
    setState(prev => ({
      ...prev,
      view: 'study',
      contentType: type,
      contentSource: source,
      pdfData: pdfData,
      messages: [{ role: 'assistant', content: `### Analysis Ready\nI have successfully imported **${source || 'your document'}**. I am ready to help you analyze and summarize its contents in a professional textbook format.\n\nWhat section should we dive into first?` }]
    }));
  };

  const handleSendMessage = async (text: string) => {
    if (state.view === 'landing') {
      setIsExpanding(true);
      return;
    }

    const newUserMessage: Message = { role: 'user', content: text };
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      isThinking: true
    }));

    const responseText = await chatWithAI([...state.messages, newUserMessage], state.notes, state.pdfData);

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'assistant', content: responseText }],
      isThinking: false
    }));
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-inter text-white">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePdfUpload} 
        accept="application/pdf" 
        className="hidden" 
      />

      {/* OVERLAY SIDEBAR */}
      <div 
        className={`fixed inset-y-0 left-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Sidebar Backdrop */}
      <div 
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] transition-opacity duration-500 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-500 h-screen flex flex-col relative ${
        state.view === 'study' ? 'bg-white p-0' : 'ambient-bg px-8 pt-4 pb-12'
      }`}>
        
        {state.view === 'landing' && (
          <>
            <div className="ambient-glow top-[-200px] left-[-200px] opacity-40 animate-pulse" />
            <div className="ambient-glow bottom-[-200px] right-[-200px] opacity-30 animate-pulse" />
          </>
        )}

        {/* Minimalist Toggle Arrow Button for Study Mode */}
        {state.view === 'study' && (
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`fixed top-1/2 -translate-y-1/2 z-[110] h-20 w-8 flex items-center justify-center bg-zinc-950 border border-white/10 text-green-500 hover:text-white transition-all shadow-2xl rounded-r-2xl cursor-pointer ${
              sidebarOpen ? 'left-[100px]' : 'left-0'
            }`}
          >
            {sidebarOpen ? <ChevronLeft size={24} strokeWidth={3} /> : <ChevronRight size={24} strokeWidth={3} />}
          </button>
        )}

        {state.view === 'landing' ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
            {/* Header / Intro Section - Swaps content based on isExpanding */}
            <div className="text-center mb-8 animate-in fade-in duration-700">
              {!isExpanding ? (
                <>
                  <h1 className="text-7xl md:text-9xl font-playfair text-white mb-6 leading-[0.9] tracking-tighter">
                    Lumina Study <br />
                    <span className="italic text-white/40">Beyond Reading.</span>
                  </h1>
                  <p className="text-zinc-500 text-xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                    Transform passive consumption into active mastery. Import your materials and let Lumina build your personalized interactive textbook.
                  </p>
                </>
              ) : (
                <div className="animate-in slide-in-from-top-4 duration-700">
                  <h1 className="text-6xl md:text-8xl font-playfair text-white mb-4 leading-[0.9] tracking-tighter">
                    Bring your materials <br />
                    <span className="italic text-green-500/60">to life.</span>
                  </h1>
                  <p className="text-zinc-500 text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                    Select a source to begin your deep-dive session.
                  </p>
                </div>
              )}
            </div>

            {/* Interaction Area */}
            <div className={`w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center`}>
              {!isExpanding ? (
                <div 
                  onClick={() => setIsExpanding(true)}
                  className="w-full max-w-2xl glass rounded-[40px] p-10 cursor-text border border-white/10 hover:border-green-500/30 hover:shadow-[0_0_80px_rgba(34,197,94,0.1)] transition-all flex items-center justify-between group shadow-2xl mt-4"
                >
                  <div className="flex flex-col text-left">
                    <span className="text-zinc-400 text-4xl md:text-5xl font-playfair tracking-tighter">Start your session...</span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-2xl group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <ChevronRight size={32} />
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-5xl flex flex-col items-center gap-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full">
                    {/* PDF Card */}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="glass rounded-[40px] p-10 flex flex-col items-center justify-center gap-6 hover:bg-white/5 border border-white/10 hover:border-green-500/30 transition-all group min-h-[340px] relative overflow-hidden shadow-2xl"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-green-500 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <FileUp size={40} />
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">Upload Document</h3>
                        <p className="text-zinc-500 text-sm max-w-[220px] mx-auto leading-relaxed font-light">
                          Perfect for textbook chapters, research papers, and technical manuals.
                        </p>
                      </div>
                      <div className="px-5 py-1.5 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">
                        Choose PDF
                      </div>
                    </button>

                    {/* YouTube Card */}
                    <div className="glass rounded-[40px] p-10 flex flex-col items-center justify-center gap-6 border border-white/10 hover:border-red-500/30 transition-all min-h-[340px] group relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-red-500 group-hover:scale-110 transition-all duration-500 shadow-xl">
                        <Youtube size={40} />
                      </div>
                      <div className="w-full space-y-5">
                        <div className="text-center">
                          <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">Video Context</h3>
                          <p className="text-zinc-500 text-sm font-light max-w-[220px] mx-auto">
                            Paste a lecture link to watch and ask questions in real-time.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="Paste YouTube Link..."
                            value={ytUrl}
                            onChange={(e) => setYtUrl(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-red-500/30 outline-none transition-all placeholder:text-zinc-700 text-sm"
                          />
                          <button 
                            disabled={!ytUrl.includes('youtube.com') && !ytUrl.includes('youtu.be')}
                            onClick={() => handleStartStudy('youtube', ytUrl)}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl disabled:opacity-30 transition-all active:scale-95 hover:bg-red-600 hover:text-white flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                          >
                            Analyze Lecture
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsExpanding(false)}
                    className="group flex items-center gap-4 text-zinc-500 hover:text-white transition-all py-2"
                  >
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                      <ChevronLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Cancel & Return</span>
                  </button>
                </div>
              )}
            </div>
            
            {!isExpanding && (
              <div className="mt-12 flex items-center justify-center gap-12 text-zinc-600 animate-in fade-in duration-1000">
                <div className="flex flex-col items-center gap-2">
                  <BrainCircuit size={32} className="opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI Synthesis</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <BookOpenCheck size={32} className="opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Active Recall</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden">
            <StudyWorkspace 
              type={state.contentType} 
              source={state.contentSource} 
              pdfData={state.pdfData}
              notes={state.notes} 
              setNotes={(n) => setState(prev => ({...prev, notes: n}))}
              messages={state.messages}
            />

            <ChatInterface 
              onSendMessage={handleSendMessage} 
              isThinking={state.isThinking}
              messages={[]} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
