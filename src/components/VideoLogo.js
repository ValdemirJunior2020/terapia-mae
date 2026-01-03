import React, { useEffect, useRef } from "react";

export default function VideoLogo({ playMusic }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (playMusic && audioRef.current) {
      audioRef.current.play().catch(() => {
        // autoplay pode falhar se não houver interação
      });
    }
  }, [playMusic]);

  return (
    <div className="video-logo-container">
      <video
        className="video-logo"
        src="/logao.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Música */}
      <audio ref={audioRef} src="/Mae.mp3" loop />
    </div>
  );
}
