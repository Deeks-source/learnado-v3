
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

export async function chatWithAI(messages: Message[], notesContext: string, pdfBase64?: string | null) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const latestMessage = messages[messages.length - 1].content;
    
    // Prepare parts
    const parts: any[] = [];
    
    // If PDF is present, add it as the first part for context
    if (pdfBase64) {
      // Remove data URL prefix if present (e.g., data:application/pdf;base64,)
      const cleanBase64 = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;
      parts.push({
        inlineData: {
          mimeType: 'application/pdf',
          data: cleanBase64
        }
      });
    }

    // Add the user's text query
    parts.push({ text: latestMessage });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Use a recommended model that supports PDF
      contents: [{ parts }],
      config: {
        systemInstruction: `You are an expert Educational Content Architect. 
        Your goal is to answer questions about the provided document and transform information into a professional textbook format (NCERT/Pearson style).
        
        STRICT TEXTBOOK FORMATTING RULES:
        1. **Bold Definitions**: Always use **BOLD** for technical terms.
        2. **Mathematical Formulas**: Formulas MUST be on their own line.
        3. **Structured Tables**: Use Markdown Tables for data comparisons.
        4. **Hierarchical Headers**: Use '### Section Title' and '#### Subsection'.
        5. **Visual Hierarchy**: Use bullet points for characteristics.
        6. **Tone**: Direct, academic, and structured.
        7. **Integration**: If the user has notes: "${notesContext}", incorporate or clarify them.`,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return "I encountered an error while trying to process the document. Please ensure the PDF is not encrypted and try a smaller file if the issue persists.";
  }
}
