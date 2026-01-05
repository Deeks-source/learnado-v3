
import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText, ExternalLink, AlertCircle } from 'lucide-react';

interface PDFViewerProps {
  pdfData: string | null;
  fileName: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ pdfData, fileName }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (pdfData) {
      try {
        setError(false);
        // Extract raw base64 from data URL if necessary
        const base64Content = pdfData.includes(',') ? pdfData.split(',')[1] : pdfData;
        const binaryString = atob(base64Content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        // Cleanup function to avoid memory leaks
        return () => {
          if (url) URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Failed to generate PDF Blob:", err);
        setError(true);
      }
    }
  }, [pdfData]);

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    }
  };

  if (!pdfData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 text-zinc-400">
        <FileText size={64} className="mb-4 opacity-20" />
        <p className="font-playfair italic text-xl">No document loaded</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 text-red-500 p-8 text-center">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <p className="font-bold text-lg mb-2">Failed to render PDF</p>
        <p className="text-zinc-500 text-sm max-w-xs">The document data might be corrupted or too large for this viewer. Try opening it in a new tab.</p>
        <button 
          onClick={handleOpenNewTab}
          className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
        >
          Open in New Tab
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white relative">
      {/* PDF Controls - Top Bar */}
      <div className="flex items-center justify-between px-10 py-4 bg-white border-b border-zinc-100 z-20 select-none shadow-sm">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
             <button className="text-zinc-400 hover:text-zinc-900 transition-colors"><ChevronLeft size={20} /></button>
             <span className="text-[10px] font-black tracking-[0.5em] text-zinc-400 uppercase truncate max-w-[200px]">{fileName}</span>
             <button className="text-zinc-400 hover:text-zinc-900 transition-colors"><ChevronRight size={20} /></button>
          </div>
          <div className="h-5 w-[1px] bg-zinc-100" />
          <div className="flex items-center gap-6">
             <button className="text-zinc-400 hover:text-zinc-900 transition-colors"><ZoomOut size={18} /></button>
             <span className="text-[11px] font-black tracking-widest text-zinc-900 uppercase">Native Viewer</span>
             <button className="text-zinc-400 hover:text-zinc-900 transition-colors"><ZoomIn size={18} /></button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleOpenNewTab}
            title="Open in new tab"
            className="text-zinc-400 hover:text-green-600 transition-colors p-2 hover:bg-zinc-50 rounded-full flex items-center gap-2"
          >
            <ExternalLink size={18} />
            <span className="hidden md:inline text-[9px] font-bold uppercase tracking-widest">Full Screen</span>
          </button>
          <button className="text-zinc-400 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-50 rounded-full">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* PDF Rendering Area */}
      <div className="flex-1 bg-zinc-200 overflow-hidden relative">
        {blobUrl ? (
          <iframe
            src={`${blobUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full border-none"
            title="PDF Document"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <div className="animate-pulse flex flex-col items-center">
              <FileText size={48} className="mb-4" />
              <p className="text-xs uppercase tracking-widest font-bold">Initializing Viewer...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
