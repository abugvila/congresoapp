import SiteHeader from "../components/SiteHeader";
import VenuesMap from "../components/VenuesMap";

export const metadata = {
  title: "Sedes | XXXIII CNDP",
};

export default function SedesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-section venues-section">
          <div className="section-heading stacked">
            <p className="eyebrow">La Plata</p>
            <h1>Sedes e informacion util</h1>
            <p>
              Mapa interactivo, facultades, sedes posibles y guia turistica
              para asistentes al XXXIII Congreso Nacional de Derecho Procesal.
            </p>
          </div>
          <VenuesMap />
        </section>
      </main>
    </>
  );
}
