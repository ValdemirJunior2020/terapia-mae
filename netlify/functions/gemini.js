// netlify/functions/gemini.js  (CommonJS - works reliably on Netlify)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, history = [], userName = "Mãe" } = JSON.parse(event.body || "{}");

    if (!message || typeof message !== "string") {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "message is required" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Missing GEMINI_API_KEY in Netlify environment variables.",
        }),
      };
    }

    const systemStyle = `
Você é um Coach bem-humorado, direto e firme para uma mãe ansiosa e superprotetora.

Regras IMPORTANTES:
- Humor leve e ironia gentil, mas NUNCA humilhar, ofender ou xingar.
- Confronte com clareza vitimismo, catastrofização, culpa e medo excessivo, com respeito.
- Faça apenas UMA pergunta curta por resposta.
- Dê UMA micro-ação prática de 5 minutos.
- Linguagem simples e objetiva.
- Não dê diagnósticos; não substitui terapia.
- Ajude a separar: "perigo real" vs "preocupação imaginada".
- Incentive limites saudáveis e autocuidado sem culpa.
- Finalize com: "🛡️ Modo Coragem: ON"
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: `Contexto: usuária é ${userName}. Instruções: ${systemStyle}` }],
      },
      ...history.map((h) => ({
        role: h.role === "model" ? "model" : "user",
        parts: [{ text: h.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.85, maxOutputTokens: 900 },
      }),
    });

    const raw = await resp.text();

    if (!resp.ok) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Gemini API error",
          details: raw,
          usedModel: model,
        }),
      };
    }

    const data = JSON.parse(raw);
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "Tive um branco 😅 tenta de novo.\n\n🛡️ Modo Coragem: ON";

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ text }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Function failed." }),
    };
  }
};
