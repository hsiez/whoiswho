import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('GEMINI_API_KEY is not defined');

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite-preview-02-05",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const prompt = `Write a haiku (3 lines with 5-7-5 syllable pattern) about one of the following topics at random:
- nature
- friendship
- love
- creativity
- dogs
- love of life
Make it thoughtful and poetic.
Only respond with the haiku text, no additional explanation or formatting.`;

export async function GET() {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const poemText = result.response.text();

    return NextResponse.json({ poem: poemText }, { status: 200 });
  } catch (error) {
    console.error('Error generating poem:', error);
    return NextResponse.json(
      { error: 'Failed to generate poem' },
      { status: 500 }
    );
  }
}
