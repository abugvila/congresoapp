import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const colors = {
  navy: "#002350",
  steel: "#4682B4",
  pale: "#D9E8F4",
  paler: "#EEF6FB",
  ink: "#0D2242",
  muted: "#637188",
  line: "#D7E2EC",
  white: "#FFFFFF",
};

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
  },
  {
    name: "Dr. Federico Salvatierra",
    role: "Magistrado",
    bio: "Investigador en prueba digital, oralidad y gestion judicial.",
  },
  {
    name: "Dra. Lucia Pereyra",
    role: "Investigadora CONICET",
    bio: "Autora de trabajos sobre acceso a justicia y garantias constitucionales.",
  },
];

const participants = [
  { name: "Ana Belen Rivas", specialty: "Derecho procesal civil", city: "Rosario" },
  { name: "Carlos Medina", specialty: "Litigacion oral", city: "Mendoza" },
  { name: "Sofia Ledesma", specialty: "Prueba digital", city: "La Plata" },
];

const filters = ["Todo", "5 nov", "6 nov", "7 nov", "Magistral", "Comision"];
const tabs = ["Agenda", "Ponentes", "Networking", "Perfil"];

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function Header({ title, eyebrow }) {
  return (
    <View style={styles.headerBlock}>
      <View style={styles.logoMark}>
        <View style={styles.sunCore} />
      </View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.screenTitle}>{title}</Text>
    </View>
  );
}

function AgendaScreen() {
  const [activeFilter, setActiveFilter] = useState("Todo");
  const [favoriteIds, setFavoriteIds] = useState([]);

  const visibleAgenda = useMemo(() => {
    return agenda.filter((item) => {
      if (activeFilter === "Todo") return true;
      if (activeFilter.includes("nov")) return item.day === activeFilter.split(" ")[0];
      return item.type === activeFilter.toLowerCase();
    });
  }, [activeFilter]);

  function toggleFavorite(id) {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Header eyebrow="Cronograma dinamico" title="Agenda del Congreso" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {visibleAgenda.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.time}>{item.time} · {item.day} nov</Text>
            <TouchableOpacity style={styles.starButton} onPress={() => toggleFavorite(item.id)}>
              <Text style={[styles.starText, favoriteIds.includes(item.id) && styles.starTextActive]}>★</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.topic}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function SpeakersScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Header eyebrow="Expositores" title="Panel de ponentes" />
      {speakers.map((speaker) => (
        <View key={speaker.name} style={styles.card}>
          <View style={styles.speakerRow}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{initials(speaker.name)}</Text></View>
            <View style={styles.flexOne}>
              <Text style={styles.cardTitle}>{speaker.name}</Text>
              <Text style={styles.cardMeta}>{speaker.role}</Text>
            </View>
          </View>
          <Text style={styles.cardBody}>{speaker.bio}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function NetworkingScreen() {
  const [query, setQuery] = useState("");
  const visibleParticipants = participants.filter((participant) =>
    `${participant.name} ${participant.specialty} ${participant.city}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Header eyebrow="Comunidad academica" title="Networking" />
      <TextInput
        style={styles.input}
        placeholder="Buscar por nombre o especialidad"
        placeholderTextColor={colors.muted}
        value={query}
        onChangeText={setQuery}
      />
      {visibleParticipants.map((participant) => (
        <View key={participant.name} style={styles.card}>
          <Text style={styles.cardTitle}>{participant.name}</Text>
          <Text style={styles.cardBody}>{participant.specialty}</Text>
          <Text style={styles.cardMeta}>{participant.city}</Text>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Conectar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <Header eyebrow="Perfil" title="Mi Congreso" />
      <View style={styles.profilePanel}>
        <Text style={styles.profileName}>Participante invitado</Text>
        <Text style={styles.cardBody}>Inscripcion pendiente de validacion</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Agenda personal</Text>
        <Text style={styles.cardBody}>2 actividades favoritas hoy</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Repositorio</Text>
        <Text style={styles.cardBody}>Acceso a ponencias PDF con codigo de inscripcion.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notificaciones</Text>
        <Text style={styles.cardBody}>Recordatorios de paneles, cambios de horario y anuncios institucionales.</Text>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Agenda");

  const screen = {
    Agenda: <AgendaScreen />,
    Ponentes: <SpeakersScreen />,
    Networking: <NetworkingScreen />,
    Perfil: <ProfileScreen />,
  }[activeTab];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        {screen}
        <View style={styles.bottomNav}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} style={styles.navItem} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.navIcon, activeTab === tab && styles.navIconActive]}>
                {tab === "Agenda" ? "▦" : tab === "Ponentes" ? "◉" : tab === "Networking" ? "◇" : "◎"}
              </Text>
              <Text style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  appShell: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screenContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 104,
  },
  headerBlock: {
    marginBottom: 22,
  },
  logoMark: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderTopWidth: 5,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  sunCore: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 8,
    borderColor: colors.steel,
  },
  eyebrow: {
    color: colors.steel,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  screenTitle: {
    color: colors.navy,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
  },
  filterRow: {
    gap: 8,
    paddingBottom: 16,
  },
  filterChip: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  filterChipActive: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  filterText: {
    color: colors.navy,
    fontWeight: "800",
  },
  filterTextActive: {
    color: colors.white,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.white,
    shadowColor: colors.navy,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  time: {
    color: colors.steel,
    fontWeight: "800",
  },
  starButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
  },
  starText: {
    color: colors.steel,
    fontSize: 18,
  },
  starTextActive: {
    color: colors.navy,
  },
  cardTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  cardBody: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  cardMeta: {
    color: colors.steel,
    fontSize: 13,
    fontWeight: "700",
  },
  speakerRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontWeight: "800",
  },
  flexOne: {
    flex: 1,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 14,
    color: colors.ink,
    marginBottom: 16,
  },
  outlineButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    color: colors.navy,
    fontWeight: "800",
  },
  profilePanel: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: colors.paler,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 12,
  },
  profileName: {
    color: colors.navy,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.white,
    paddingTop: 8,
    paddingBottom: 14,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navIcon: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: "800",
  },
  navIconActive: {
    color: colors.navy,
  },
  navLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  navLabelActive: {
    color: colors.navy,
  },
});
