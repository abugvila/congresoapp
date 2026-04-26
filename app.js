const congressStart = new Date("2026-11-05T09:00:00-03:00");

const agenda = [
  {
    id: 1,
    day: "5",
    time: "09:00",
    type: "institucional",
    title: "Acreditacion y apertura institucional",
    topic: "Autoridades del Congreso - Salon principal",
  },
  {
    id: 2,
    day: "5",
    time: "11:00",
    type: "magistral",
    title: "Conferencia Magistral: Nuevos desafios del proceso civil",
    topic: "Reformas procesales - Auditorio central",
  },
  {
    id: 3,
    day: "6",
    time: "10:00",
    type: "comision",
    title: "Comision: Tecnologia, prueba y debido proceso",
    topic: "Derecho procesal y evidencia digital",
  },
  {
    id: 4,
    day: "6",
    time: "15:30",
    type: "panel",
    title: "Panel federal de justicia y acceso jurisdiccional",
    topic: "Federalismo judicial - Aula magna",
  },
  {
    id: 5,
    day: "7",
    time: "12:00",
    type: "magistral",
    title: "Conferencia de cierre: proceso, democracia e instituciones",
    topic: "Perspectivas contemporaneas",
  },
];

const speakers = [
  {
    name: "Dra. Mariana Etcheverry",
    role: "Profesora de Derecho Procesal",
    bio: "Especialista en litigacion civil, reformas judiciales y ensenanza clinica.",
    tags: ["Proceso civil", "Docencia"],
  },
  {
    name: "Dr. Federico Salvatierra",
    role: "Magistrado",
    bio: "Investigador en prueba digital, oralidad y gestion judicial.",
    tags: ["Prueba", "Tecnologia"],
  },
  {
    name: "Dra. Lucia Pereyra",
    role: "Investigadora CONICET",
    bio: "Autora de trabajos sobre acceso a justicia y garantias constitucionales.",
    tags: ["Garantias", "Acceso a justicia"],
  },
];

const participants = [
  {
    name: "Ana Belen Rivas",
    specialty: "Derecho procesal civil",
    city: "Rosario",
  },
  {
    name: "Carlos Medina",
    specialty: "Litigacion oral",
    city: "Mendoza",
  },
  {
    name: "Sofia Ledesma",
    specialty: "Prueba digital",
    city: "La Plata",
  },
];

const favoriteIds = new Set(JSON.parse(localStorage.getItem("cndpFavorites") || "[]"));

function saveFavorites() {
  localStorage.setItem("cndpFavorites", JSON.stringify([...favoriteIds]));
}

function renderAgenda(filter = "all") {
  const agendaList = document.querySelector("#agendaList");
  const filtered = agenda.filter((item) => {
    return filter === "all" || item.day === filter || item.type === filter;
  });

  agendaList.innerHTML = filtered
    .map(
      (item) => `
        <article class="agenda-card">
          <div class="agenda-time">${item.time}<br><small>${item.day} nov</small></div>
          <div>
            <h3>${item.title}</h3>
            <p>${item.topic}</p>
          </div>
          <button class="favorite ${favoriteIds.has(item.id) ? "active" : ""}" data-id="${item.id}" aria-label="Marcar actividad favorita">
            &#9733;
          </button>
        </article>
      `,
    )
    .join("");
}

function renderSpeakers() {
  document.querySelector("#speakerGrid").innerHTML = speakers
    .map(
      (speaker) => `
        <article class="speaker-card">
          <div class="speaker-photo" aria-hidden="true">${speaker.name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}</div>
          <h3>${speaker.name}</h3>
          <p><strong>${speaker.role}</strong><br>${speaker.bio}</p>
          <div class="tag-row">
            ${speaker.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderParticipants(query = "") {
  const normalized = query.trim().toLowerCase();
  const visible = participants.filter((participant) => {
    return `${participant.name} ${participant.specialty} ${participant.city}`
      .toLowerCase()
      .includes(normalized);
  });

  document.querySelector("#participantList").innerHTML = visible
    .map(
      (participant) => `
        <article class="participant-card">
          <h3>${participant.name}</h3>
          <p>${participant.specialty}<br>${participant.city}</p>
          <a class="button secondary" href="mailto:contacto@cndp2026.org">Conectar</a>
        </article>
      `,
    )
    .join("");
}

function updateCountdown() {
  const diff = congressStart - new Date();
  const safeDiff = Math.max(diff, 0);
  const days = Math.floor(safeDiff / 86_400_000);
  const hours = Math.floor((safeDiff / 3_600_000) % 24);
  const minutes = Math.floor((safeDiff / 60_000) % 60);
  const values = [days, hours, minutes];

  document.querySelectorAll("#countdown strong").forEach((node, index) => {
    node.textContent = String(values[index]).padStart(2, "0");
  });
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderAgenda(button.dataset.filter);
  });
});

document.querySelector("#agendaList").addEventListener("click", (event) => {
  const favoriteButton = event.target.closest(".favorite");
  if (!favoriteButton) return;

  const id = Number(favoriteButton.dataset.id);
  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
  } else {
    favoriteIds.add(id);
  }

  favoriteButton.classList.toggle("active");
  saveFavorites();
});

document.querySelector("#networkSearch").addEventListener("input", (event) => {
  renderParticipants(event.target.value);
});

renderAgenda();
renderSpeakers();
renderParticipants();
updateCountdown();
setInterval(updateCountdown, 60_000);
