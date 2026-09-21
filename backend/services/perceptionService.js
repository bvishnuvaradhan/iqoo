

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
  if (!process.env.GROQ_API_KEY) {
    console.log("[Perception] GROQ_API_KEY is not configured. Returning demo_fallback.");
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
    const prompt = `You are the perception engine for Nexora. 
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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBuffer.toString('base64')}` } }
            ]
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API error");
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;

    let rawData;
    try {
      rawData = JSON.parse(content);
    } catch (parseErr) {
      console.error("[Perception] Groq returned malformed JSON:", content);
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
