

// Lightweight heuristic filter
function isPotentiallyRelevant(text) {
  if (!text || text.length < 4) return false;
  const lower = text.toLowerCase();
  
  // Exclude obvious noise
  if (/^(ok|thanks|thx|bro|lol|lmao|😂|🔥|👍)$/.test(lower)) return false;
  
  // Academic keywords
  const keywords = ['assignment', 'exam', 'deadline', 'due', 'sir', 'prof', 'madam', 'class', 'internal', 'external', 'quiz', 'lab', 'project', 'submission', 'upload', 'syllabus', 'notes', 'moved', 'postponed', 'schedule', 'tomorrow', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'sep', 'oct', 'nov'];
  
  for (const kw of keywords) {
    if (lower.includes(kw)) return true;
  }
  
  // If uncertain, keep it just in case, but for MVP let's require at least one keyword or a reasonable length
  if (text.length > 20) return true;
  
  return false;
}

function parseTelegramExport(jsonData) {
  if (!jsonData || !jsonData.messages) {
    throw new Error("Invalid Telegram JSON structure.");
  }
  
  const allMessages = jsonData.messages;
  let scannedCount = 0;
  const relevantMessages = [];

  for (const msg of allMessages) {
    if (msg.type !== 'message') continue;
    scannedCount++;
    
    // Normalize text (Telegram sometimes exports text as an array of objects)
    let text = "";
    if (typeof msg.text === 'string') {
      text = msg.text;
    } else if (Array.isArray(msg.text)) {
      text = msg.text.map(t => typeof t === 'string' ? t : t.text).join("");
    }
    
    if (isPotentiallyRelevant(text)) {
      relevantMessages.push({
        messageId: msg.id,
        sender: msg.from,
        senderId: msg.from_id,
        timestamp: msg.date,
        text: text.trim(),
        replyTo: msg.reply_to_message_id || null,
        source: "telegram"
      });
    }
  }

  return {
    scannedCount,
    relevantCount: relevantMessages.length,
    messages: relevantMessages
  };
}

async function extractAcademicInfo(messagesChunk) {
  if (messagesChunk.length === 0) return [];
  
  if (!process.env.GROQ_API_KEY) {
    console.log("[Telegram] GROQ_API_KEY missing. Using demo mock extraction.");
    // Demo mock matching the fixture provided
    return [
      {
        type: 'ASSIGNMENT',
        subject: 'DBMS',
        activity: 'Assignment 3',
        deadline: 'Friday',
        action: 'due',
        confidence: 0.9,
        sourceMessageIds: [1003, 1004, 1005]
      },
      {
        type: 'EXAM',
        subject: 'OS',
        activity: 'Internal Exam',
        deadline: 'Monday',
        action: 'moved',
        confidence: 0.95,
        sourceMessageIds: [1007]
      },
      {
        type: 'EXAM',
        subject: 'ALM',
        activity: 'Internal Exam',
        deadline: 'Sep 20',
        action: null,
        confidence: 0.95,
        sourceMessageIds: [1012]
      },
      {
        type: 'EXAM',
        subject: 'OS',
        activity: 'Internal Exam',
        deadline: 'Sep 24',
        action: null,
        confidence: 0.85,
        sourceMessageIds: [1013]
      },
      {
        type: 'PROJECT_TASK',
        subject: 'AI Medical Prediction System',
        activity: 'API integration',
        deadline: 'Sep 27',
        action: 'pending, assign Rahul',
        confidence: 0.95,
        sourceMessageIds: [1014]
      }
    ];
  }

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const prompt = `You are a strict academic context parser.
I will provide a JSON array of recent Telegram messages.
Identify any academic events, deadlines, assignments, schedule updates, or project tasks. 
A conversation might span multiple messages (e.g. asking "which assignment?" and answering "Assignment 3").
Ignore casual talk.

Return a JSON object with a single key "items" containing an array of extracted academic items, matching this exact schema:
{
  "items": [
    {
      "type": "string (e.g. 'ASSIGNMENT', 'EXAM', 'ANNOUNCEMENT', 'PROJECT_TASK', 'PROJECT')",
      "subject": "string or null (e.g. 'DBMS', 'OS', or the Project Name like 'AI Medical Prediction System')",
      "activity": "string (e.g. 'Assignment 3', 'Internal Exam', 'API integration')",
      "deadline": "string or null (e.g. 'Friday', 'Sep 25')",
      "action": "string or null (e.g. 'moved', 'postponed', 'due', 'uploaded', 'completed', 'pending')",
      "confidence": "number (0.0 to 1.0)",
      "sourceMessageIds": ["array of integer message IDs that contribute to this finding"]
    }
  ]
}

Input Messages:
${JSON.stringify(messagesChunk, null, 2)}

Output strictly valid JSON.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Groq API error");
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch (err) {
    console.error("[TelegramService] Groq extraction failed:", err);
    return [];
  }
}

async function processTelegramData(jsonData) {
  const { scannedCount, relevantCount, messages } = parseTelegramExport(jsonData);
  
  // Chunking
  const CHUNK_SIZE = 30;
  let allExtracted = [];
  
  for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
    const chunk = messages.slice(i, i + CHUNK_SIZE);
    const extracted = await extractAcademicInfo(chunk);
    
    // Attach source text for tracing
    for (const item of extracted) {
       item.sourceMessages = chunk.filter(m => item.sourceMessageIds.includes(m.messageId));
       allExtracted.push(item);
    }
  }

  return {
    scannedCount,
    relevantCount,
    extractedItems: allExtracted
  };
}

module.exports = { processTelegramData };
