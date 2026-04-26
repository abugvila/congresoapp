"use client";

import { useEffect, useMemo, useState } from "react";

const congressStart = new Date("2026-11-05T09:00:00-03:00");

const agenda = [
  {
    id: 1,
    day: "5",
    time: "09:00",
    type: "institucional",
    title: "Acreditacion y apertura institucional",
    topic: "Autoridades del Congreso - Salon principal",
  },
  {
    id: 2,
    day: "5",
    time: "11:00",
    type: "magistral",
    title: "Conferencia Magistral: Nuevos desafios del proceso civil",
    topic: "Reformas procesales - Auditorio central",
  },
  {
    id: 3,
    day: "6",
    time: "10:00",
    type: "comision",
    title: "Comision: Tecnologia, prueba y debido proceso",
    topic: "Derecho procesal y evidencia digital",
  },
  {
    id: 4,
    day: "6",
    time: "15:30",
    type: "panel",
    title: "Panel federal de justicia y acceso jurisdiccional",
    topic: "Federalismo judicial - Aula magna",
  },
  {
    id: 5,
    day: "7",
    time: "12:00",
    type: "magistral",
    title: "Conferencia de cierre: proceso, democracia e instituciones",
    topic: "Perspectivas contemporaneas",
  },
];

const speakers = [
  {
    name: "Dra. Mariana Etcheverry",
    role: "Profesora de Derecho Procesal",
    bio: "Especialista en litigacion civil, reformas judiciales y ensenanza clinica.",
    tags: ["Proceso civil", "Docencia"],
  },
  {
    name: "Dr. Federico Salvatierra",
    role: "Magistrado",
    bio: "Investigador en prueba digital, oralidad y gestion judicial.",
    tags: ["Prueba", "Tecnologia"],
  },
  {
    name: "Dra. Lucia Pereyra",
    role: "Investigadora CONICET",
    bio: "Autora de trabajos sobre acceso a justicia y garantias constitucionales.",
    tags: ["Garantias", "Acceso a justicia"],
  },
];

const participants = [
  {
    name: "Ana Belen Rivas",
    specialty: "Derecho procesal civil",
    city: "Rosario",
  },
  {
    name: "Carlos Medina",
    specialty: "Litigacion oral",
    city: "Mendoza",
  },
  {
    name: "Sofia Ledesma",
    specialty: "Prueba digital",
    city: "La Plata",
  },
];

const filters = [
  ["all", "Todo"],
  ["5", "5 nov"],
  ["6", "6 nov"],
  ["7", "7 nov"],
  ["magistral", "Magistrales"],
  ["comision", "Comisiones"],
];

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function getCountdown() {
  const diff = Math.max(congressStart - new Date(), 0);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
  };
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [networkQuery, setNetworkQuery] = useState("");
  const [countdown, setCountdown] = useState({ days: "--", hours: "--", minutes: "--" });

  useEffect(() => {
    const stored = window.localStorage.getItem("cndpFavorites");
    if (stored) setFavoriteIds(JSON.parse(stored));

    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 60_000);
    return () => window.clearInterval(timer);
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
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Inicio XXXIII CNDP">
          <span className="brand-mark" aria-hidden="true" />
          <span>
            <strong>XXXIII CNDP</strong>
            <small>La Plata 2026</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Navegacion principal">
          <a href="#agenda">Agenda</a>
          <a href="#sedes">Sedes</a>
          <a href="#ponentes">Ponentes</a>
          <a href="#ponencias">Ponencias</a>
          <a href="#networking">Networking</a>
        </nav>
        <a className="nav-cta" href="#perfil">Ingresar</a>
      </header>

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="congress-emblem" aria-label="Logo estilizado del Congreso">
              <span className="sun" />
              <span className="laurel left" />
              <span className="laurel right" />
            </div>
            <p className="eyebrow">5, 6 y 7 de noviembre de 2026 &middot; La Plata</p>
            <h1>XXXIII Congreso Nacional de Derecho Procesal</h1>
            <p className="hero-copy">
              Una plataforma integral para acompanar la experiencia academica,
              institucional y profesional del congreso antes, durante y despues del encuentro.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#agenda">Ver agenda</a>
              <a className="button secondary" href="#ponencias">Repositorio</a>
            </div>
          </div>

          <aside className="countdown-panel" aria-label="Cuenta regresiva">
            <p>Inicio del Congreso</p>
            <div className="countdown">
              <span><strong>{String(countdown.days).padStart(2, "0")}</strong><small>dias</small></span>
              <span><strong>{String(countdown.hours).padStart(2, "0")}</strong><small>horas</small></span>
              <span><strong>{String(countdown.minutes).padStart(2, "0")}</strong><small>min</small></span>
            </div>
            <div className="authority-note">
              <h2>Carta de presentacion</h2>
              <p>
                Bienvenidos a un espacio federal de intercambio academico,
                actualizacion profesional y construccion colectiva del derecho procesal argentino.
              </p>
            </div>
          </aside>
        </section>

        <section className="quick-grid" aria-label="Accesos rapidos">
          <a href="#agenda"><strong>Agenda personal</strong><span>Favoritos, filtros y recordatorios.</span></a>
          <a href="#sedes"><strong>Sedes y ciudad</strong><span>Mapa, alojamientos y transporte.</span></a>
          <a href="#networking"><strong>Networking</strong><span>Directorio opt-in de participantes.</span></a>
        </section>

        <section id="agenda" className="section">
          <div className="section-heading">
            <p className="eyebrow">Cronograma dinamico</p>
            <h2>Agenda del Congreso</h2>
          </div>
          <div className="filters" role="group" aria-label="Filtros de agenda">
            {filters.map(([value, label]) => (
              <button
                className={`filter ${activeFilter === value ? "active" : ""}`}
                data-filter={value}
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
        </section>

        <section id="sedes" className="section split-section">
          <div>
            <p className="eyebrow">La Plata</p>
            <h2>Sedes e informacion util</h2>
            <p>
              Mapa interactivo conceptual con puntos clave para facultades,
              auditorios, transporte y recomendaciones urbanas para asistentes.
            </p>
            <div className="info-list">
              <span>Facultad de Ciencias Juridicas y Sociales</span>
              <span>Teatro Argentino</span>
              <span>Hoteles recomendados</span>
              <span>Corredores gastronomicos</span>
            </div>
          </div>
          <div className="map-card" aria-label="Mapa esquematico de sedes">
            <span className="map-pin pin-one">Facultad</span>
            <span className="map-pin pin-two">Teatro</span>
            <span className="map-pin pin-three">Hotel</span>
          </div>
        </section>

        <section id="ponentes" className="section">
          <div className="section-heading">
            <p className="eyebrow">Expositores</p>
            <h2>Panel de ponentes</h2>
          </div>
          <div className="speaker-grid">
            {speakers.map((speaker) => (
              <article className="speaker-card" key={speaker.name}>
                <div className="speaker-photo" aria-hidden="true">{initials(speaker.name)}</div>
                <h3>{speaker.name}</h3>
                <p><strong>{speaker.role}</strong><br />{speaker.bio}</p>
                <div className="tag-row">
                  {speaker.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="ponencias" className="section repository">
          <div className="section-heading">
            <p className="eyebrow">Acceso restringido</p>
            <h2>Repositorio de ponencias</h2>
          </div>
          <div className="repository-shell">
            <div>
              <h3>Validacion de inscripcion</h3>
              <p>
                Los documentos PDF estaran disponibles para participantes autenticados con inscripcion confirmada.
              </p>
            </div>
            <form className="login-card">
              <label>Correo profesional<input type="email" placeholder="nombre@institucion.org" /></label>
              <label>Codigo de inscripcion<input type="password" placeholder="CNDP-2026" /></label>
              <button className="button primary" type="button">Validar acceso</button>
            </form>
          </div>
        </section>

        <section id="networking" className="section networking">
          <div className="section-heading">
            <p className="eyebrow">Comunidad academica</p>
            <h2>Networking</h2>
          </div>
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
        </section>

        <section id="perfil" className="section profile-section">
          <div>
            <p className="eyebrow">App movil</p>
            <h2>Navegacion principal</h2>
            <p>
              La experiencia movil prioriza cuatro accesos de uso frecuente:
              agenda, ponentes, networking y perfil personal.
            </p>
          </div>
          <div className="phone-frame" aria-label="Vista conceptual de app movil">
            <div className="phone-top" />
            <div className="phone-content">
              <h3>Mi agenda</h3>
              <p>2 actividades favoritas hoy</p>
              <div className="mini-card">Conferencia Magistral &middot; 10:00</div>
              <div className="mini-card">Comision Derecho Procesal Civil &middot; 15:30</div>
            </div>
            <nav className="bottom-nav" aria-label="Navegacion de app">
              <span>Agenda</span><span>Ponentes</span><span>Red</span><span>Perfil</span>
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
