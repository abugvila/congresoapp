"use client";

import Link from "next/link";

const navItems = [
  ["/agenda", "Agenda"],
  ["/sedes", "Sedes"],
  ["/ponentes", "Ponentes"],
  ["/ponencias", "Ponencias"],
  ["/networking", "Networking"],
  ["/perfil", "Perfil/App"],
];

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Inicio XXXIII CNDP">
        <span className="brand-mark" aria-hidden="true" />
        <span>
          <strong>XXXIII CNDP</strong>
          <small>La Plata 2026</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Navegacion principal">
        <Link href="/">Inicio</Link>
        <details className="nav-dropdown">
          <summary>Secciones</summary>
          <div className="nav-dropdown-panel">
            {navItems.map(([href, label]) => (
              <Link href={href} key={href}>{label}</Link>
            ))}
          </div>
        </details>
      </nav>

      <Link className="nav-cta" href="/perfil">Ingresar</Link>
    </header>
  );
}
