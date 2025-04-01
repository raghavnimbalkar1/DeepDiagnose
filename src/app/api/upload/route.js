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
          content: `You are a medical analysis assistant. Analyze the provided medical report and provide:
          
    1. A structured summary with clear sections
    2. Use proper markdown formatting (## for section headers, **bold** for key terms)
    3. Avoid excessive header levels (only use ##, not ### or ####)
    4. Format findings as bullet points
    5. Highlight critical values in bold
    6. Keep language professional but accessible
    
    Structure your response like this:
    ## About the patient a short overview without the heading about the patient 
    also remove the ## fron the Headings and instead just have them inside ** **

    ## Summary of Key Findings
    - Finding 1 (with **important values** in bold)
    - Finding 2 (with **key terms** emphasized)
    
    ## Detailed Analysis
    [Your paragraph analysis here with proper line breaks between paragraphs]
    
    ## Recommendations
    - Recommendation 1
    - Recommendation 2
    you can add more if needed

    ## Vulnerabilities
    - Vulnerability 1
    - Vulnerability 2
    you can add more if needed
    ## Conclusion
    [Your conclusion here]  

    ## Add an disclaimer at the end of the report that this is not a substitute for professional medical advice in bold.
    
    Use exactly this format.`
        },
        { 
          role: "user", 
          content: `Medical Report for Analysis:
          
    ${text.substring(0, 10000)}` 
        },
      ],
      temperature: 0.3,  // Lower temperature for more focused results
      max_tokens: 2000   // Control length of response
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