import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "Ponencias | XXXIII CNDP",
};

export default function PonenciasPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section repository page-section">
          <div className="section-heading stacked">
            <p className="eyebrow">Acceso restringido</p>
            <h1>Repositorio de ponencias</h1>
            <p>
              Maqueta del flujo de validacion para descarga de documentos PDF por participantes inscriptos.
            </p>
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
      </main>
    </>
  );
}
