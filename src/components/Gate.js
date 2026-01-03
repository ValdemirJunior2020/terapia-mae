import React, { useMemo, useState } from "react";

export default function Gate({ onUnlocked }) {
  const [count, setCount] = useState(0);

  const question = "Você é teimosa?";

  const lines = useMemo(() => {
    if (count === 0) return "Sem passar pelo portão, sem terapia. Regras são regras 😌";
    if (count === 1) return "Ok… agora mais duas vezes. Sem desculpinha 🙈";
    if (count === 2) return "Última! Aí sim… assumindo com coragem 😎";
    return "Liberado! 🚪✨";
  }, [count]);

  const handleYes = () => {
    const next = count + 1;
    setCount(next);
    if (next >= 3) setTimeout(() => onUnlocked(), 300);
  };

  return (
    <div className="card soft-card p-3">
      <div className="text-muted mb-2">Portão do App (nível: {count}/3)</div>

      <h5 className="mb-2">{question}</h5>
      <div className="text-muted mb-3">{lines}</div>

      <div className="d-grid gap-2">
        <button className="btn btn-success btn-lg" onClick={handleYes}>
          ✅ Sim
        </button>

        <button
          className="btn btn-outline-secondary"
          onClick={() => alert("Hoje não tem 'Não' 😄 (só pra brincar)")}
        >
          ❌ Não
        </button>
      </div>

      <div className="mt-3 small text-muted">
        Obs: app divertido de apoio — não substitui terapia profissional.
      </div>
    </div>
  );
}
