// import { NextRequest, NextResponse } from 'next/server';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// export async function POST(req: NextRequest) {
//   try {
//     const { prompt } = await req.json();
//     if (!prompt) {
//       return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
//     }

//     if (!process.env.GEMINI_API_KEY) {
//       return NextResponse.json({ error: 'No Gemini API key set' }, { status: 500 });
//     }

//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//     const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     return NextResponse.json({ text });
//   } catch (error) {
//     console.error('Gemini API error:', error);
//     return NextResponse.json({ error: 'Gemini API error', details: `${error}` }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'No Gemini API key set' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Använd det modellnamn Google visar i sitt exempel!
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Gemini API error', details: `${error}` }, { status: 500 });
  }
}