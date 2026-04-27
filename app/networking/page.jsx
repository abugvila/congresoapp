import NetworkingDirectory from "../components/NetworkingDirectory";
import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "Networking | XXXIII CNDP",
};

export default function NetworkingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-section">
          <div className="section-heading stacked">
            <p className="eyebrow">Comunidad academica</p>
            <h1>Networking</h1>
            <p>
              Directorio opt-in para encontrar participantes por nombre, ciudad o especialidad.
            </p>
          </div>
          <NetworkingDirectory />
        </section>
      </main>
    </>
  );
}
