const { GoogleGenAI } = require('@google/genai');

function validatePerception(data) {
  // Validate and clamp fields
  return {
    raw_text: typeof data.raw_text === 'string' ? data.raw_text : "Unknown text",
    content_type: typeof data.content_type === 'string' ? data.content_type : "unknown",
    subject_hint: typeof data.subject_hint === 'string' ? data.subject_hint : null,
    topic_hint: typeof data.topic_hint === 'string' ? data.topic_hint : null,
    action_hint: typeof data.action_hint === 'string' ? data.action_hint : null,
    target_date: typeof data.target_date === 'string' ? data.target_date : (data.deadline_hint || null),
    target_item: typeof data.target_item === 'string' ? data.target_item : (data.exam_hint || null),
    confidence: typeof data.confidence === 'number' ? Math.max(0, Math.min(1, data.confidence)) : 0
  };
}

async function analyzeImage(imageBuffer, mimeType) {
  if (!process.env.GEMINI_API_KEY) {
    console.log("[Perception] GEMINI_API_KEY is not configured. Returning demo_fallback.");
    return {
      mode: "demo_fallback",
      perception: {
        raw_text: "ALM internal has been moved to September 22.",
        content_type: "schedule_update",
        subject_hint: "ALM",
        topic_hint: null,
        action_hint: "moved",
        target_date: "Sep 22",
        target_item: "ALM Internal Exam",
        confidence: 0.95
      }
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const prompt = `You are the perception engine for ContextAI. 
    Analyze the uploaded image and extract any academic information, handwriting, or text.
    Return a structured JSON object exactly matching this schema:
    {
      "raw_text": "string (the exact text you perceive, even if incomplete, e.g., 'Round R...')",
      "content_type": "string (e.g., 'academic_topic', 'schedule_update', 'unknown')",
      "subject_hint": "string or null (e.g., 'Operating Systems' or 'ALM' if obvious, else null)",
      "topic_hint": "string or null",
      "action_hint": "string or null (e.g., 'postponed', 'scheduled', 'update')",
      "target_date": "string or null (e.g., 'Sep 22', 'Monday')",
      "target_item": "string or null (e.g., 'ALM Internal Exam', 'Assignment')",
      "confidence": "number (0.0 to 1.0 representing how clearly you can read the raw text)"
    }
    IMPORTANT: Report EXACTLY what you see. Do NOT invent context or automatically complete incomplete words. Output ONLY valid JSON without markdown formatting blocks.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        prompt,
        { inlineData: { data: imageBuffer.toString("base64"), mimeType } }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    let rawData;
    try {
      rawData = JSON.parse(response.text);
    } catch (parseErr) {
      console.error("[Perception] Gemini returned malformed JSON:", response.text);
      throw new Error("Received malformed response from AI perception engine.");
    }

    const validData = validatePerception(rawData);
    
    return {
      mode: "live",
      perception: validData
    };
  } catch (err) {
    console.error("[Perception] API error:", err.message);
    throw new Error("AI perception is temporarily unavailable.");
  }
}

module.exports = { analyzeImage };
