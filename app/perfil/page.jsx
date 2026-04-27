import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "Perfil y App | XXXIII CNDP",
};

export default function PerfilPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section profile-section page-section">
          <div>
            <p className="eyebrow">Maqueta de app movil</p>
            <h1>Navegacion principal</h1>
            <p>
              Prototipo visual de la experiencia mobile con accesos a agenda, ponentes, networking y perfil personal.
            </p>
            <div className="info-list">
              <span>React Native o Flutter para app final</span>
              <span>Expo Preview o TestFlight para maqueta instalable</span>
              <span>GitHub Pages para maqueta web responsive</span>
            </div>
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
