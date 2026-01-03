import React, { useMemo, useState } from "react";
import { sendToCoach } from "../lib/api";

export default function ChatCoach({ userName = "Mãe" }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([
    {
      role: "model",
      text:
        `Oi ${userName} 😄\n\n` +
        "Eu sou seu coach bem-humorado e firme.\n" +
        "Vou brincar quando der, mas também vou falar sério quando precisar.\n\n" +
        "Em UMA frase: o que está te preocupando agora?\n\n" +
        "🛡️ Modo Coragem: ON",
    },
  ]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function handleSend() {
    const message = input.trim();
    if (!message) return;

    const updatedHistory = [...history, { role: "user", text: message }];
    setHistory(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await sendToCoach({
        message,
        history: updatedHistory,
        userName,
      });

      setHistory((prev) => [...prev, { role: "model", text: response.text || "🤔" }]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
          role: "model",
          text:
            "🚨 Opa… deu ruim aqui 😅\n\n" +
            "Verifica se você está rodando com `netlify dev`.\n" +
            "Se estiver em produção, confira `GEMINI_API_KEY` nas Environment Variables do Netlify.\n\n" +
            "🛡️ Modo Coragem: ON",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  }

  return (
    <div className="card soft-card p-3">
      <div className="mb-2 text-muted small">
        💡 Dica: escreva curto. Ex: “Tenho medo do futuro dos meus filhos.”
      </div>

      <div className="mb-3" style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {history.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-2 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`chat-bubble ${msg.role === "user" ? "chat-user" : "chat-model"}`}
              style={{ maxWidth: "88%" }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading ? <div className="text-muted small">Digitando… 🤔</div> : null}
      </div>

      <div className="d-flex gap-2">
        <textarea
          className="form-control"
          rows={2}
          placeholder="Digite aqui… (Enter envia / Shift+Enter quebra linha)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn btn-primary" disabled={!canSend} onClick={handleSend}>
          Enviar
        </button>
      </div>

      <div className="mt-2 small text-muted">
        ⚠️ App de apoio emocional com humor. Não substitui terapia profissional.
      </div>
    </div>
  );
}
