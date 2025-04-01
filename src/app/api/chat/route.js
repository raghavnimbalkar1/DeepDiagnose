import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { message, context } = await req.json(); // Add context from upload

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { 
          role: 'system', 
          content: `You are a medical AI analyzing reports. Current report context: ${context || 'No report uploaded yet'}. 
          - Analyze key health parameters
          - Compare values to healthy ranges
          - Suggest lifestyle changes
          - Keep responses clear and structured`
        },
        { role: 'user', content: message },
      ],
      temperature: 0.3, // Lower for more factual responses
    });

    if (!response.choices?.[0]?.message) {
      throw new Error("Invalid response from OpenAI");
    }

    return NextResponse.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat" },
      { status: 500 }
    );
  }
}