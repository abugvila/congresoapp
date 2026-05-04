"use client";

import { useMemo, useState } from "react";

const locations = [
  {
    id: "jursoc",
    type: "Sede academica",
    name: "Facultad de Ciencias Juridicas y Sociales - UNLP",
    address: "Calle 48 N 582, entre 6 y 7",
    description:
      "Sede central propuesta para acreditaciones, comisiones, aulas de trabajo y actividades academicas vinculadas al congreso.",
    coords: [-34.9139, -57.9478],
    maps: "https://www.openstreetmap.org/?mlat=-34.9139&mlon=-57.9478#map=17/-34.9139/-57.9478",
  },
  {
    id: "pasaje",
    type: "Centro cultural",
    name: "Centro Cultural Pasaje Dardo Rocha",
    address: "Calle 50 entre 6 y 7",
    description:
      "Espacio patrimonial del centro platense, util para actividades culturales, recepciones institucionales o muestras paralelas.",
    coords: [-34.9132, -57.9495],
    maps: "https://www.openstreetmap.org/?mlat=-34.9132&mlon=-57.9495#map=17/-34.9132/-57.9495",
  },
  {
    id: "teatro",
    type: "Auditorio",
    name: "Teatro Argentino de La Plata",
    address: "Av. 51 entre 9 y 10",
    description:
      "Complejo cultural de gran escala, adecuado para actos de apertura, conferencias magistrales o actividades institucionales.",
    coords: [-34.9173, -57.9541],
    maps: "https://www.openstreetmap.org/?mlat=-34.9173&mlon=-57.9541#map=17/-34.9173/-57.9541",
  },
  {
    id: "catedral",
    type: "Punto turistico",
    name: "Catedral Inmaculada Concepcion",
    address: "Calle 14 entre 51 y 53, Plaza Moreno",
    description:
      "Uno de los simbolos arquitectonicos de La Plata. Su museo y entorno son una visita recomendada para asistentes.",
    coords: [-34.9215, -57.9566],
    maps: "https://www.openstreetmap.org/?mlat=-34.9215&mlon=-57.9566#map=17/-34.9215/-57.9566",
  },
  {
    id: "museo",
    type: "Punto turistico",
    name: "Museo de Ciencias Naturales",
    address: "Paseo del Bosque",
    description:
      "Museo universitario emblematico, con colecciones cientificas y patrimoniales de referencia regional e internacional.",
    coords: [-34.9094, -57.9329],
    maps: "https://www.openstreetmap.org/?mlat=-34.9094&mlon=-57.9329#map=16/-34.9094/-57.9329",
  },
  {
    id: "curutchet",
    type: "Patrimonio",
    name: "Casa Curutchet",
    address: "Av. 53 N 320, entre 1 y 2",
    description:
      "Obra de Le Corbusier y Patrimonio de la Humanidad UNESCO. Recomendable para recorridos de arquitectura.",
    coords: [-34.9069, -57.9402],
    maps: "https://www.openstreetmap.org/?mlat=-34.9069&mlon=-57.9402#map=17/-34.9069/-57.9402",
  },
  {
    id: "republica",
    type: "Paseo",
    name: "Republica de los Ninos",
    address: "Camino General Belgrano y 500, Gonnet",
    description:
      "Parque educativo y recreativo historico, ideal para visitas familiares fuera del casco urbano.",
    coords: [-34.8842, -58.0126],
    maps: "https://www.openstreetmap.org/?mlat=-34.8842&mlon=-58.0126#map=15/-34.8842/-58.0126",
  },
];

const usefulBlocks = [
  {
    title: "Como moverse",
    items: [
      "El casco urbano es caminable y se organiza por calles numeradas, avenidas y diagonales.",
      "Para traslados entre sedes centricas conviene taxi, remis, apps de movilidad o caminatas cortas.",
      "Para Republica de los Ninos y Gonnet, planificar traslado con mas tiempo.",
    ],
  },
  {
    title: "Zonas recomendadas",
    items: [
      "Centro civico: Plaza Moreno, Catedral, Municipalidad y eje de avenidas 51/53.",
      "Zona universitaria y Bosque: Museo, facultades, observatorio, espacios verdes.",
      "Calle 12 y diagonal 74: corredores comerciales y gastronomicos de referencia.",
    ],
  },
  {
    title: "Facultades y ambito UNLP",
    items: [
      "La UNLP cuenta con 17 facultades y una fuerte presencia academica en el casco urbano.",
      "Derecho funciona en el Edificio de la Reforma, en calle 48 entre 6 y 7.",
      "El entorno inmediato concentra otras unidades academicas y servicios universitarios.",
    ],
  },
];

export default function VenuesMap() {
  const [selectedId, setSelectedId] = useState("jursoc");
  const selected = useMemo(
    () => locations.find((location) => location.id === selectedId) || locations[0],
    [selectedId],
  );
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=-58.025%2C-34.94%2C-57.925%2C-34.875&layer=mapnik&marker=${selected.coords[0]}%2C${selected.coords[1]}`;

  return (
    <div className="venues-layout">
      <div className="interactive-map" aria-label="Mapa interactivo de La Plata">
        <iframe title={`Mapa de ${selected.name}`} src={mapSrc} loading="lazy" />
        <div className="selected-place">
          <span>{selected.type}</span>
          <h2>{selected.name}</h2>
          <p>{selected.address}</p>
          <a href={selected.maps} target="_blank" rel="noreferrer">Abrir en OpenStreetMap</a>
        </div>
      </div>

      <div className="venues-panel">
        <div className="section-heading stacked">
          <p className="eyebrow">Mapa y sedes</p>
          <h2>Ubicaciones clave</h2>
          <p>Selecciona una sede o punto turistico para ubicarlo en el mapa.</p>
        </div>
        <div className="venue-list">
          {locations.map((location) => (
            <button
              className={`venue-item ${selectedId === location.id ? "active" : ""}`}
              key={location.id}
              onClick={() => setSelectedId(location.id)}
              type="button"
            >
              <span>{location.type}</span>
              <strong>{location.name}</strong>
              <small>{location.address}</small>
            </button>
          ))}
        </div>
      </div>

      <article className="venue-detail">
        <p className="eyebrow">{selected.type}</p>
        <h2>{selected.name}</h2>
        <p>{selected.description}</p>
      </article>

      <div className="useful-grid">
        {usefulBlocks.map((block) => (
          <article className="info-card" key={block.title}>
            <h3>{block.title}</h3>
            <ul>
              {block.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
