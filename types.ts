
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ViewMode = 'landing' | 'study';
export type ContentType = 'pdf' | 'youtube' | null;
export type SidebarTab = 'library' | 'exams' | 'grades' | 'settings';

export interface StudyState {
  view: ViewMode;
  contentType: ContentType;
  contentSource: string; // Used for YouTube URL or File Name
  pdfData: string | null; // Base64 representation of the PDF
  notes: string;
  messages: Message[];
  isThinking: boolean;
}
