import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "Sedes | XXXIII CNDP",
};

export default function SedesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section split-section page-section">
          <div>
            <p className="eyebrow">La Plata</p>
            <h1>Sedes e informacion util</h1>
            <p>
              Mapa interactivo conceptual con puntos clave para facultades, auditorios, transporte y recomendaciones urbanas para asistentes.
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
      </main>
    </>
  );
}
