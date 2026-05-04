"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CongressLogo from "./components/CongressLogo";
import SiteHeader from "./components/SiteHeader";
import { congressStart } from "./data";

function getCountdown() {
  const diff = Math.max(congressStart - new Date(), 0);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
  };
}

export default function Home() {
  const [countdown, setCountdown] = useState({ days: "--", hours: "--", minutes: "--" });

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <SiteHeader />
      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <CongressLogo />
            <p className="eyebrow">5, 6 y 7 de noviembre de 2026 &middot; La Plata</p>
            <h1>XXXIII Congreso Nacional de Derecho Procesal</h1>
            <p className="hero-copy">
              Una plataforma integral para acompanar la experiencia academica,
              institucional y profesional del congreso antes, durante y despues del encuentro.
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/agenda">Ver agenda</Link>
              <Link className="button secondary" href="/ponencias">Repositorio</Link>
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
          <Link href="/agenda"><strong>Agenda personal</strong><span>Favoritos, filtros y recordatorios.</span></Link>
          <Link href="/sedes"><strong>Sedes y ciudad</strong><span>Mapa, alojamientos y transporte.</span></Link>
          <Link href="/ponentes"><strong>Ponentes</strong><span>Biografias y especialidades.</span></Link>
          <Link href="/ponencias"><strong>Ponencias</strong><span>Repositorio restringido de PDFs.</span></Link>
          <Link href="/networking"><strong>Networking</strong><span>Directorio opt-in de participantes.</span></Link>
          <Link href="/perfil"><strong>Maqueta app</strong><span>Vista conceptual mobile.</span></Link>
        </section>
      </main>
    </>
  );
}
