"use client";

import { useState } from "react";

export default function CongressLogo({ compact = false }) {
  const [hasImage, setHasImage] = useState(true);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  if (hasImage) {
    return (
      <img
        className={compact ? "official-logo compact" : "official-logo"}
        src={`${basePath}/logo-cndp.svg`}
        alt="XXXIII Congreso Nacional de Derecho Procesal, La Plata 2026"
        onError={() => setHasImage(false)}
      />
    );
  }

  return (
    <div className={compact ? "congress-emblem compact" : "congress-emblem"} aria-label="Logo estilizado del Congreso">
      <span className="sun" />
      <span className="laurel left" />
      <span className="laurel right" />
    </div>
  );
}
