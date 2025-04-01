import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import pdf from "pdf-parse";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert PDF file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfData = await pdf(buffer);
    const text = pdfData.text.trim(); // Trim extra spaces

    if (!text || text.length < 10) {
      return NextResponse.json({ error: "PDF has no readable text" }, { status: 400 });
    }

    // Send extracted text to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are a medical AI. Analyze the following doctor's report:
            - Extract key health indicators (e.g., hemoglobin, cholesterol, sugar levels).
            - Indicate if values are above, below, or within the normal range.
            - Provide recommendations for improvement.
            - Keep it structured and easy to understand.`
        },
        { role: "user", content: text },
      ],
    });

    // Ensure response is valid
    if (!response || !response.choices || response.choices.length === 0) {
      return NextResponse.json({ error: "OpenAI did not return a valid response" }, { status: 500 });
    }

    return NextResponse.json({ analysis: response.choices[0].message.content });

  } catch (error) {
    console.error("Error processing file:", error);

    return NextResponse.json({ 
      error: "Server error: " + (error.message || "Unknown error") 
    }, { status: 500 });
  }
}