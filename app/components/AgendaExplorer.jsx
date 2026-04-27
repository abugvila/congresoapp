"use client";

import { useMemo, useState } from "react";
import { agenda, filters } from "../data";

export default function AgendaExplorer() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState(() => []);

  useState(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("cndpFavorites");
    if (stored) setFavoriteIds(JSON.parse(stored));
  }, []);

  function toggleFavorite(id) {
    setFavoriteIds((current) => {
      const next = current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id];
      window.localStorage.setItem("cndpFavorites", JSON.stringify(next));
      return next;
    });
  }

  const filteredAgenda = useMemo(() => {
    return agenda.filter((item) => {
      return activeFilter === "all" || item.day === activeFilter || item.type === activeFilter;
    });
  }, [activeFilter]);

  return (
    <>
      <div className="filters" role="group" aria-label="Filtros de agenda">
        {filters.map(([value, label]) => (
          <button
            className={`filter ${activeFilter === value ? "active" : ""}`}
            key={value}
            onClick={() => setActiveFilter(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="agenda-list">
        {filteredAgenda.map((item) => (
          <article className="agenda-card" key={item.id}>
            <div className="agenda-time">{item.time}<br /><small>{item.day} nov</small></div>
            <div>
              <h3>{item.title}</h3>
              <p>{item.topic}</p>
            </div>
            <button
              className={`favorite ${favoriteIds.includes(item.id) ? "active" : ""}`}
              onClick={() => toggleFavorite(item.id)}
              type="button"
              aria-label="Marcar actividad favorita"
            >
              &#9733;
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
