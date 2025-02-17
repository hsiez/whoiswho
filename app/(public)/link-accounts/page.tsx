// app/(public)/link-accounts/page.tsx
import LinkAccountsFlow from "../../components/form-flow/form-flow-bento";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const metadata = {
  title: 'Link Accounts',
  description: 'Link your bluesky and x accounts so people can find you'
}

// Initialize Gemini outside the component
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-lite-preview-02-05",
});

export default async function LinkAccountsPage() {
  let initialPoem: string = '';
  
  try {
    const prompt = `Write a haiku (3 lines with 5-7-5 syllable pattern) about one of the following topics at random:
      - nature
      - friendship
      - love
      - creativity
      - dogs
      - love of life
      Make it thoughtful and poetic.
      Only respond with the haiku text, no additional explanation or formatting.`;
    
    const result = await model.generateContent(prompt);
    const poemText = result.response.text();
    initialPoem = poemText;
    
  } catch (error) {
    console.error('Failed to generate poem:', error);
    initialPoem = "Waves kiss the shore's embrace,\nSilent moon watches from high,\nPeace in night's soft grace."; // Fallback poem
  }

  return <LinkAccountsFlow initialPoem={initialPoem} />;
}
