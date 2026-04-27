"use client";

import { useMemo, useState } from "react";
import { participants } from "../data";

export default function NetworkingDirectory() {
  const [networkQuery, setNetworkQuery] = useState("");

  const visibleParticipants = useMemo(() => {
    const query = networkQuery.trim().toLowerCase();
    return participants.filter((participant) => {
      return `${participant.name} ${participant.specialty} ${participant.city}`
        .toLowerCase()
        .includes(query);
    });
  }, [networkQuery]);

  return (
    <>
      <div className="search-bar">
        <input
          type="search"
          placeholder="Buscar por nombre o especialidad"
          value={networkQuery}
          onChange={(event) => setNetworkQuery(event.target.value)}
        />
      </div>
      <div className="participant-list">
        {visibleParticipants.map((participant) => (
          <article className="participant-card" key={participant.name}>
            <h3>{participant.name}</h3>
            <p>{participant.specialty}<br />{participant.city}</p>
            <a className="button secondary" href="mailto:contacto@cndp2026.org">Conectar</a>
          </article>
        ))}
      </div>
    </>
  );
}
