import { type Team } from "@/lib/football-data/types";

function team(
  id: string,
  name: string,
  shortName: string,
  code: string,
  city: string,
  categorySlug: Team["categorySlug"],
  color: string,
): Team {
  return { id, name, shortName, code, city, categorySlug, color };
}

export const teams: Team[] = [
  // Liga Profesional de Fútbol (Primera División)
  team("river-plate", "River Plate", "River", "RIV", "Buenos Aires", "liga-profesional", "#E30613"),
  team("boca-juniors", "Boca Juniors", "Boca", "BOC", "Buenos Aires", "liga-profesional", "#0A2C59"),
  team("racing-club", "Racing Club", "Racing", "RAC", "Avellaneda", "liga-profesional", "#63B8E5"),
  team("independiente", "Club Atlético Independiente", "Independiente", "IND", "Avellaneda", "liga-profesional", "#DA291C"),
  team("san-lorenzo", "San Lorenzo de Almagro", "San Lorenzo", "SLO", "Buenos Aires", "liga-profesional", "#00205B"),
  team("velez-sarsfield", "Vélez Sarsfield", "Vélez", "VEL", "Buenos Aires", "liga-profesional", "#0F4C93"),
  team("estudiantes-lp", "Estudiantes de La Plata", "Estudiantes", "EDLP", "La Plata", "liga-profesional", "#D2122E"),
  team("talleres", "Talleres de Córdoba", "Talleres", "TAL", "Córdoba", "liga-profesional", "#0033A0"),
  team("argentinos-juniors", "Argentinos Juniors", "Argentinos", "ARG", "Buenos Aires", "liga-profesional", "#B7003C"),
  team("rosario-central", "Rosario Central", "Central", "ROS", "Rosario", "liga-profesional", "#002E9E"),
  team("newells", "Newell's Old Boys", "Newell's", "NOB", "Rosario", "liga-profesional", "#DA291C"),
  team("huracan", "Club Atlético Huracán", "Huracán", "HUR", "Buenos Aires", "liga-profesional", "#DC5D14"),

  // Primera Nacional (Segunda División)
  team("atlanta", "Club Atlético Atlanta", "Atlanta", "ATL", "Buenos Aires", "primera-nacional", "#2B2E83"),
  team("chacarita", "Chacarita Juniors", "Chacarita", "CHA", "Buenos Aires", "primera-nacional", "#000000"),
  team("almirante-brown", "Almirante Brown", "Almirante Brown", "ALB", "Isidro Casanova", "primera-nacional", "#128A3E"),
  team("gimnasia-mendoza", "Gimnasia y Esgrima de Mendoza", "GEM", "GEM", "Mendoza", "primera-nacional", "#000000"),
  team("estudiantes-rc", "Estudiantes de Río Cuarto", "Estudiantes RC", "ERC", "Río Cuarto", "primera-nacional", "#E30613"),
  team("guillermo-brown", "Guillermo Brown", "Guillermo Brown", "GBR", "Puerto Madryn", "primera-nacional", "#128A3E"),
  team("quilmes", "Quilmes Atlético Club", "Quilmes", "QUI", "Quilmes", "primera-nacional", "#7EBC59"),
  team("san-telmo", "Club San Telmo", "San Telmo", "STE", "Buenos Aires", "primera-nacional", "#7A1F3D"),
  team("tristan-suarez", "Tristán Suárez", "Tristán Suárez", "TSU", "Ezeiza", "primera-nacional", "#00A551"),
  team("alvarado", "Alvarado", "Alvarado", "ALV", "Mar del Plata", "primera-nacional", "#E30613"),
  team("almagro", "Club Almagro", "Almagro", "ALM", "Buenos Aires", "primera-nacional", "#7A1F3D"),
  team("deportivo-madryn", "Deportivo Madryn", "D. Madryn", "DMA", "Puerto Madryn", "primera-nacional", "#00205B"),

  // Primera B Metropolitana (Tercera División - AFA)
  team("armenio", "Deportivo Armenio", "D. Armenio", "ARM", "Ingeniero Maschwitz", "primera-b-metropolitana", "#DA291C"),
  team("comunicaciones", "Comunicaciones", "Comunicaciones", "COM", "Villa Ballester", "primera-b-metropolitana", "#7EBC59"),
  team("deportivo-espanol", "Deportivo Español", "D. Español", "ESP", "Buenos Aires", "primera-b-metropolitana", "#DA291C"),
  team("sacachispas", "Sacachispas", "Sacachispas", "SAC", "Villa Soldati", "primera-b-metropolitana", "#F2B705"),
  team("uai-urquiza", "UAI Urquiza", "UAI Urquiza", "UAI", "Buenos Aires", "primera-b-metropolitana", "#0033A0"),
  team("argentino-merlo", "Argentino de Merlo", "Argentino (M)", "AGM", "Merlo", "primera-b-metropolitana", "#000000"),
  team("colegiales", "Colegiales", "Colegiales", "COL", "Munro", "primera-b-metropolitana", "#0033A0"),
  team("excursionistas", "Excursionistas", "Excursionistas", "EXC", "Buenos Aires", "primera-b-metropolitana", "#00A551"),
  team("canuelas", "Cañuelas", "Cañuelas", "CAN", "Cañuelas", "primera-b-metropolitana", "#0033A0"),
  team("liniers", "Liniers", "Liniers", "LIN", "Buenos Aires", "primera-b-metropolitana", "#DA291C"),
  team("berazategui", "Berazategui", "Berazategui", "BER", "Berazategui", "primera-b-metropolitana", "#000000"),
  team("deportivo-merlo", "Deportivo Merlo", "D. Merlo", "DME", "Merlo", "primera-b-metropolitana", "#7EBC59"),

  // Torneo Federal A (Tercera División - interior)
  team("belgrano-sf", "Sportivo Belgrano (S.F.)", "Belgrano (SF)", "BSF", "San Francisco", "federal-a", "#DA291C"),
  team("racing-cordoba", "Racing de Córdoba", "Racing (Cba.)", "RCO", "Córdoba", "federal-a", "#63B8E5"),
  team("boca-unidos", "Boca Unidos", "Boca Unidos", "BUN", "Corrientes", "federal-a", "#0033A0"),
  team("sarmiento-resistencia", "Sarmiento de Resistencia", "Sarmiento (Chaco)", "SRE", "Resistencia", "federal-a", "#00A551"),
  team("guarani-antonio-franco", "Guaraní Antonio Franco", "Guaraní A. Franco", "GAF", "Posadas", "federal-a", "#DA291C"),
  team("gimnasia-y-tiro", "Gimnasia y Tiro", "Gimnasia y Tiro", "GYT", "Salta", "federal-a", "#000000"),
  team("chaco-for-ever", "Chaco For Ever", "Chaco For Ever", "CFE", "Resistencia", "federal-a", "#DA291C"),
  team("sportivo-penarol", "Sportivo Peñarol", "Peñarol (Cba.)", "SPE", "Córdoba", "federal-a", "#F2B705"),
  team("crucero-del-norte", "Crucero del Norte", "Crucero del Norte", "CDN", "Garupá", "federal-a", "#0033A0"),
  team("douglas-haig", "Douglas Haig", "Douglas Haig", "DHA", "Pergamino", "federal-a", "#000000"),
  team("camioneros", "Club Camioneros", "Camioneros", "CAM", "San Martín", "federal-a", "#DA291C"),
  team("ferrocarril-midland", "Ferrocarril Midland", "F. Midland", "FMI", "Villa Ballester", "federal-a", "#7EBC59"),
];

export function teamsByCategory(categorySlug: Team["categorySlug"]) {
  return teams.filter((t) => t.categorySlug === categorySlug);
}

export function teamById(id: string) {
  return teams.find((t) => t.id === id);
}
