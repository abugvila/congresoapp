import AgendaExplorer from "../components/AgendaExplorer";
import SiteHeader from "../components/SiteHeader";

export const metadata = {
  title: "Agenda | XXXIII CNDP",
};

export default function AgendaPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="section page-section">
          <div className="section-heading stacked">
            <p className="eyebrow">Cronograma dinamico</p>
            <h1>Agenda del Congreso</h1>
            <p>
              Filtra las actividades por dia o tipo y marca favoritas para armar una agenda personal.
            </p>
          </div>
          <AgendaExplorer />
        </section>
      </main>
    </>
  );
}
