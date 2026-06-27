import axios from "axios";

/**
 * Calls Google Gemini (free tier) to estimate effort & due date.
 * Falls back to a deterministic mock if no key or the API fails,
 * so the feature always works for demos.
 */
export async function suggestEstimate({ title, description }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    return mockEstimate(title, description, "No API key set — using mock.");
  }

  const prompt = `You are a project planning assistant. Estimate the effort and a reasonable due date for this task.
Task title: "${title}"
Task description: "${description || "N/A"}"

Respond ONLY with strict JSON in this exact shape:
{"effort":"S|M|L","dueInDays":<integer>,"reasoning":"<one short sentence>"}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const { data } = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
      },
      { timeout: 12000 }
    );

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
    const parsed = JSON.parse(text);

    const dueInDays = Number.isFinite(parsed.dueInDays) ? parsed.dueInDays : 3;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueInDays);

    return {
      source: "ai",
      effort: ["S", "M", "L"].includes(parsed.effort) ? parsed.effort : "M",
      suggestedDueDate: dueDate.toISOString(),
      reasoning: parsed.reasoning || "Estimated by AI.",
    };
  } catch (err) {
    console.error("LLM error:", err.message);
    return mockEstimate(title, description, "AI unavailable — using fallback.");
  }
}

function mockEstimate(title = "", description = "", note = "") {
  const len = (title + " " + description).length;
  let effort = "S";
  let days = 2;
  if (len > 60) {
    effort = "M";
    days = 4;
  }
  if (len > 140) {
    effort = "L";
    days = 7;
  }
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + days);
  return {
    source: "fallback",
    effort,
    suggestedDueDate: dueDate.toISOString(),
    reasoning: `Heuristic estimate based on task length. ${note}`.trim(),
  };
}