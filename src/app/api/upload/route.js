import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export async function POST(request) {
  // First verify content type
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid content type. Expected multipart/form-data" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Process the file (example for text files)
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = buffer.toString("utf-8");

    // For PDFs, you would use:
    // const { text } = await import('pdf-parse').then(m => m.default(buffer));

    const analysis = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze this medical report...",
        },
        { role: "user", content: text.substring(0, 10000) },
      ],
    });

    return NextResponse.json({ analysis: analysis.choices[0].message.content });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}