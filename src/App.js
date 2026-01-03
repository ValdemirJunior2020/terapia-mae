import React, { useState } from "react";
import HeaderBar from "./components/HeaderBar";
import Gate from "./components/Gate";
import ChatCoach from "./components/ChatCoach";
import VideoLogo from "./components/VideoLogo";

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);

  function handleUnlock() {
    setUnlocked(true);
    setPlayMusic(true); // 🎵 música começa aqui
  }

  return (
    <div className="app-shell">
      <VideoLogo playMusic={playMusic} />

      <HeaderBar
        title="MAE TERAPIA 😄"
        subtitle={
          unlocked
            ? "Coach bem-humorado e firme"
            : "Desbloqueie o portão primeiro"
        }
      />

      {!unlocked ? (
        <Gate onUnlocked={handleUnlock} />
      ) : (
        <ChatCoach userName="Mãe" />
      )}
    </div>
  );
}
