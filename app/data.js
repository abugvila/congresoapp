export const congressStart = new Date("2026-11-05T09:00:00-03:00");

export const agenda = [
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

export const speakers = [
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

export const participants = [
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

export const filters = [
  ["all", "Todo"],
  ["5", "5 nov"],
  ["6", "6 nov"],
  ["7", "7 nov"],
  ["magistral", "Magistrales"],
  ["comision", "Comisiones"],
];

export function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}
