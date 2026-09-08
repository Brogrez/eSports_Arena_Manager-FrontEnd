/**
 * eSports Arena Manager - Datos simulados (EP1)
 * En EP3 estas estructuras se reemplazan por llamadas a la API REST.
 * Se exponen en window.EAM_DATA para que cada vista los consuma.
 */

const juegos = [
  { id: "g1", nombre: "Valorion Strike", integrantesPorEquipo: 5 },
  { id: "g2", nombre: "Rift Legends", integrantesPorEquipo: 5 },
  { id: "g3", nombre: "Turbo Kart Rivals", integrantesPorEquipo: 1 },
];

const jugadores = [
  { id: "j1", nombre: "Camila Rojas", apodo: "camiRJ", email: "camila.rojas@correo.cl", victorias: 18, derrotas: 6 },
  { id: "j2", nombre: "Matías Fuentes", apodo: "matifun", email: "matias.fuentes@correo.cl", victorias: 12, derrotas: 9 },
  { id: "j3", nombre: "Valentina Soto", apodo: "valeS", email: "valentina.soto@correo.cl", victorias: 22, derrotas: 4 },
  { id: "j4", nombre: "Ignacio Pérez", apodo: "nachop", email: "ignacio.perez@correo.cl", victorias: 5, derrotas: 14 },
  { id: "j5", nombre: "Florencia Díaz", apodo: "flodiaz", email: "florencia.diaz@correo.cl", victorias: 9, derrotas: 9 },
  { id: "j6", nombre: "Benjamín Vidal", apodo: "benvidal", email: "benjamin.vidal@correo.cl", victorias: 3, derrotas: 11 },
];

const equipos = [
  {
    id: "e1",
    nombre: "Nova Reapers",
    juegoId: "g1",
    capitanId: "j1",
    activo: true,
    integrantes: [
      { jugadorId: "j1", rol: "Capitán / Entry" },
      { jugadorId: "j2", rol: "Soporte" },
      { jugadorId: "j5", rol: "Francotirador" },
    ],
  },
  {
    id: "e2",
    nombre: "Silencio Absoluto",
    juegoId: "g2",
    capitanId: "j3",
    activo: true,
    integrantes: [
      { jugadorId: "j3", rol: "Capitana / Mid" },
      { jugadorId: "j4", rol: "Jungla" },
    ],
  },
  {
    id: "e3",
    nombre: "Circuito Fantasma",
    juegoId: "g3",
    capitanId: "j6",
    activo: false,
    integrantes: [{ jugadorId: "j6", rol: "Piloto" }],
  },
];

const sanciones = [
  { id: "s1", jugadorId: "j4", motivo: "Lenguaje ofensivo en chat de partida", duracionDias: 7, fechaInicio: "2026-08-20", vigente: true },
  { id: "s2", jugadorId: "j6", motivo: "Inasistencia injustificada a partida programada", duracionDias: 14, fechaInicio: "2026-07-01", vigente: false },
];

const torneos = [
  {
    id: "t1",
    nombre: "Copa Apertura Valorion",
    juegoId: "g1",
    modalidad: "Equipos",
    estado: "abierto",
    cupoMaximo: 16,
    cupoOcupado: 9,
    fechaCierreInscripcion: "2026-09-12",
    fechaInicio: "2026-09-20",
    descripcion: "Torneo clasificatorio de apertura de temporada para escuadras de Valorion Strike.",
  },
  {
    id: "t2",
    nombre: "Liga Rift Legends - Semana 3",
    juegoId: "g2",
    modalidad: "Equipos",
    estado: "en-curso",
    cupoMaximo: 8,
    cupoOcupado: 8,
    fechaCierreInscripcion: "2026-08-15",
    fechaInicio: "2026-08-25",
    descripcion: "Tercera fecha de la liga regular de Rift Legends, formato todos contra todos.",
  },
  {
    id: "t3",
    nombre: "Gran Premio Turbo Kart",
    juegoId: "g3",
    modalidad: "Individual",
    estado: "en-curso",
    cupoMaximo: 20,
    cupoOcupado: 17,
    fechaCierreInscripcion: "2026-08-10",
    fechaInicio: "2026-08-18",
    descripcion: "Circuito individual de Turbo Kart Rivals con puntaje acumulado por carrera.",
  },
  {
    id: "t4",
    nombre: "Copa Fundación Valorion",
    juegoId: "g1",
    modalidad: "Equipos",
    estado: "finalizado",
    cupoMaximo: 12,
    cupoOcupado: 12,
    fechaCierreInscripcion: "2026-06-01",
    fechaInicio: "2026-06-10",
    descripcion: "Primer torneo oficial de Valorion Strike en la plataforma, ya finalizado.",
  },
  {
    id: "t5",
    nombre: "Clasificatorio Rift Legends Sur",
    juegoId: "g2",
    modalidad: "Equipos",
    estado: "abierto",
    cupoMaximo: 6,
    cupoOcupado: 2,
    fechaCierreInscripcion: "2026-09-30",
    fechaInicio: "2026-10-05",
    descripcion: "Clasificatorio zonal para el regional sur de Rift Legends.",
  },
];

const inscripciones = [
  { id: "i1", torneoId: "t1", participanteId: "e1", tipoParticipante: "equipo", fecha: "2026-08-20" },
  { id: "i2", torneoId: "t2", participanteId: "e2", tipoParticipante: "equipo", fecha: "2026-07-30" },
  { id: "i3", torneoId: "t3", participanteId: "j2", tipoParticipante: "jugador", fecha: "2026-08-01" },
];

const partidas = [
  { id: "p1", torneoId: "t2", ronda: 1, participanteA: "Silencio Absoluto", participanteB: "Por definir", horario: "2026-08-25 18:00", estado: "jugada" },
  { id: "p2", torneoId: "t2", ronda: 2, participanteA: "Silencio Absoluto", participanteB: "Vórtice Norte", horario: "2026-09-01 18:00", estado: "programada" },
  { id: "p3", torneoId: "t4", ronda: 1, participanteA: "Nova Reapers", participanteB: "Escuadra Ceniza", horario: "2026-06-10 17:00", estado: "jugada" },
  { id: "p4", torneoId: "t4", ronda: 2, participanteA: "Nova Reapers", participanteB: "Rango Cero", horario: "2026-06-14 17:00", estado: "jugada" },
];

const resultados = [
  { id: "r1", partidaId: "p1", puntajeA: 13, puntajeB: 7, ganador: "Silencio Absoluto", validado: true },
  { id: "r2", partidaId: "p3", puntajeA: 13, puntajeB: 9, ganador: "Nova Reapers", validado: true },
  { id: "r3", partidaId: "p4", puntajeA: 13, puntajeB: 11, ganador: "Nova Reapers", validado: true },
];

const rankings = {
  t4: [
    { posicion: 1, participante: "Nova Reapers", puntos: 6, diferenciaPuntaje: 6 },
    { posicion: 2, participante: "Rango Cero", puntos: 3, diferenciaPuntaje: -2 },
    { posicion: 3, participante: "Escuadra Ceniza", puntos: 0, diferenciaPuntaje: -6 },
  ],
  t2: [
    { posicion: 1, participante: "Silencio Absoluto", puntos: 3, diferenciaPuntaje: 6 },
    { posicion: 2, participante: "Vórtice Norte", puntos: 0, diferenciaPuntaje: 0 },
  ],
};

const premios = [
  { torneoId: "t4", posicion: 1, premio: "Trofeo Fundación + $400.000 en crédito de plataforma" },
  { torneoId: "t4", posicion: 2, premio: "$150.000 en crédito de plataforma" },
  { torneoId: "t4", posicion: 3, premio: "Set de periféricos patrocinado" },
];

// Se expone todo en un único espacio de nombres global simple.
window.EAM_DATA = {
  juegos,
  jugadores,
  equipos,
  sanciones,
  torneos,
  inscripciones,
  partidas,
  resultados,
  rankings,
  premios,
};
