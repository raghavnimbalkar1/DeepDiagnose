import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { message } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      { 
        role: 'system', 
        content: `You are a highly skilled medical AI assistant that analyzes doctor's reports.
        - Provide a **brief analysis** of the key health parameters in the report.
        - Indicate if the values are **below, above, or within the healthy range** for a typical human.
        - Suggest **practical lifestyle and dietary changes** to help improve any abnormal values.
        - Keep the response clear, structured, and easy to understand.`
      },
      { role: 'user', content: message },
    ],
  });

  return NextResponse.json({ response: response.choices[0].message.content });
}