import SiteHeader from "../components/SiteHeader";
import { initials, speakers } from "../data";

export const metadata = {
  title: "Ponentes | XXXIII CNDP",
};

export default function PonentesPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-section">
          <div className="section-heading stacked">
            <p className="eyebrow">Expositores</p>
            <h1>Panel de ponentes</h1>
            <p>
              Listado inicial de expositores con especialidades y enlaces futuros a sus intervenciones.
            </p>
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
      </main>
    </>
  );
}
