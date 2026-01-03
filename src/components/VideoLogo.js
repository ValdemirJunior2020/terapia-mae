import React from "react";

export default function VideoLogo() {
  return (
    <div className="video-logo-container">
      <video
        src="/logao.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="video-logo"
      />
    </div>
  );
}
