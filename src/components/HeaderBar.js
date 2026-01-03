import React from "react";

export default function HeaderBar({ title, subtitle }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div>
        <div className="fw-bold" style={{ fontSize: 18 }}>
          {title}
        </div>
        {subtitle ? (
          <div className="text-muted" style={{ fontSize: 13 }}>
            {subtitle}
          </div>
        ) : null}
      </div>

      <span className="badge bg-dark badge-fun">🛡️ Modo Coragem</span>
    </div>
  );
}
