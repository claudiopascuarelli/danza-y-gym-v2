"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { ModuleKey, ProductModule } from "@/lib/modules";

type DashboardSection = "home" | ModuleKey;

interface DemoDashboardProps {
  academyName: string;
  ownerName: string;
  selectedModules: ProductModule[];
  onBackToSetup: () => void;
}

interface TableDemo {
  headers: [string, string, string];
  rows: DemoRecord[];
  action: string;
  search: string;
}

interface DemoRecord {
  id: string;
  primary: string;
  secondary: string;
  status: string;
  tone: "ok" | "review" | "info";
}

type DemoRecordsByModule = Partial<Record<ModuleKey, DemoRecord[]>>;

const storageKey = "danza-y-gym-demo-records-v1";

function record(id: string, primary: string, secondary: string, status: string, tone: DemoRecord["tone"]): DemoRecord {
  return { id, primary, secondary, status, tone };
}

const tableDemos: Partial<Record<ModuleKey, TableDemo>> = {
  students: {
    headers: ["Alumno", "Inscripción", "Estado"], action: "Nuevo alumno", search: "Buscar por nombre, DNI o clase",
    rows: [
      record("student-1", "Martina López", "Danza contemporánea", "Al día", "ok"),
      record("student-2", "Sofía Benítez", "Clásico inicial", "Cuota pendiente", "review"),
      record("student-3", "Tomás García", "Entrenamiento funcional", "Al día", "ok"),
      record("student-4", "Valentina Ruiz", "Jazz intermedio", "Revisar ficha", "review"),
    ],
  },
  teachers: {
    headers: ["Profesor", "Clases asignadas", "Disponibilidad"], action: "Nuevo profesor", search: "Buscar profesor o disciplina",
    rows: [
      record("teacher-1", "Carolina Méndez", "Clásico inicial · Sala A", "Lun y mié", "info"),
      record("teacher-2", "Diego Fernández", "Entrenamiento funcional", "Mar y jue", "info"),
      record("teacher-3", "Lucía Romero", "Jazz intermedio · Taller coreográfico", "3 clases", "ok"),
      record("teacher-4", "Julián Acosta", "Danza contemporánea", "Reemplazo", "review"),
    ],
  },
  rooms: {
    headers: ["Sala", "Capacidad", "Próxima actividad"], action: "Nueva sala", search: "Buscar sala",
    rows: [
      record("room-1", "Sala A", "20 personas · Piso flotante", "16:00 Clásico", "info"),
      record("room-2", "Sala B", "24 personas · Espejos", "17:30 Jazz", "info"),
      record("room-3", "Sala C", "15 personas · Equipamiento", "19:00 Funcional", "info"),
      record("room-4", "Sala virtual", "Acceso por enlace privado", "Disponible", "ok"),
    ],
  },
  classes: {
    headers: ["Clase", "Grupo", "Cupo"], action: "Nueva clase", search: "Buscar clase, nivel o profesor",
    rows: [
      record("class-1", "Clásico inicial", "Carolina Méndez · Sala A", "14 de 20", "ok"),
      record("class-2", "Jazz intermedio", "Lucía Romero · Sala B", "18 de 24", "ok"),
      record("class-3", "Danza contemporánea", "Julián Acosta · Sala A", "20 de 20", "review"),
      record("class-4", "Entrenamiento funcional", "Diego Fernández · Sala C", "12 de 15", "info"),
    ],
  },
  workshops: {
    headers: ["Taller", "Modalidad", "Inscripciones"], action: "Nuevo taller", search: "Buscar taller",
    rows: [
      record("workshop-1", "Composición creativa", "Sábado · 2 encuentros", "16 inscriptos", "ok"),
      record("workshop-2", "Maquillaje escénico", "Abierto al público", "8 lugares", "info"),
      record("workshop-3", "Música y movimiento", "Obligatorio para formación", "Completo", "review"),
    ],
  },
  formations: {
    headers: ["Formación", "Trayecto", "Alumnos"], action: "Nueva formación", search: "Buscar formación o año",
    rows: [
      record("formation-1", "Formación en Jazz", "Primer año · 6 materias", "18 alumnos", "ok"),
      record("formation-2", "Formación Clásica", "Segundo año · 7 materias", "14 alumnos", "ok"),
      record("formation-3", "Danzas españolas", "Primer año · 5 materias", "9 alumnos", "info"),
    ],
  },
  attendance: {
    headers: ["Clase de hoy", "Presentes", "Registro"], action: "Tomar asistencia", search: "Buscar clase o alumno",
    rows: [
      record("attendance-1", "Clásico inicial · 16:00", "13 de 14 presentes", "Completa", "ok"),
      record("attendance-2", "Jazz intermedio · 17:30", "0 de 18 presentes", "Pendiente", "review"),
      record("attendance-3", "Funcional · 19:00", "0 de 12 presentes", "Más tarde", "info"),
    ],
  },
  fees: {
    headers: ["Responsable", "Período", "Saldo"], action: "Registrar cobro", search: "Buscar alumno, responsable o período",
    rows: [
      record("fee-1", "Familia Benítez", "Julio · Venció el 15/07", "$ 38.500", "review"),
      record("fee-2", "Martina López", "Julio · Transferencia", "Pagada", "ok"),
      record("fee-3", "Valentina Ruiz", "Julio · Pago parcial", "$ 12.000", "info"),
      record("fee-4", "Tomás García", "Agosto · Próximo período", "Sin emitir", "info"),
    ],
  },
  cash: {
    headers: ["Movimiento", "Medio", "Importe"], action: "Nuevo movimiento", search: "Buscar concepto o comprobante",
    rows: [
      record("cash-1", "Cuota Martina López", "Transferencia · 15:42", "+ $ 42.000", "ok"),
      record("cash-2", "Cuota Tomás García", "Efectivo · 14:18", "+ $ 38.500", "ok"),
      record("cash-3", "Compra de insumos", "Efectivo · 12:05", "- $ 16.800", "review"),
      record("cash-4", "Apertura de caja", "Fondo inicial · 09:00", "$ 50.000", "info"),
    ],
  },
  scholarships: {
    headers: ["Alumno", "Beneficio", "Vigencia"], action: "Nueva beca", search: "Buscar alumno o tipo de beca",
    rows: [
      record("scholarship-1", "Camila Torres", "Beca completa", "Hasta diciembre", "ok"),
      record("scholarship-2", "Nicolás Vega", "Media beca", "Revisar en agosto", "info"),
      record("scholarship-3", "Abril Sosa", "Beca por mérito", "Último cuatrimestre", "ok"),
    ],
  },
  teacherSettlements: {
    headers: ["Profesor", "Período", "Liquidación"], action: "Preparar liquidación", search: "Buscar profesor o período",
    rows: [
      record("settlement-1", "Carolina Méndez", "Julio · 42 alumnos", "A revisar", "review"),
      record("settlement-2", "Diego Fernández", "Julio · 18 horas", "$ 324.000", "info"),
      record("settlement-3", "Lucía Romero", "Junio · Transferencia", "Pagada", "ok"),
    ],
  },
  additionalSales: {
    headers: ["Pedido", "Cliente", "Estado"], action: "Nueva venta", search: "Buscar pedido, producto o cliente",
    rows: [
      record("sale-1", "Zapatos de jazz · Talle 37", "Martina López", "Entregado", "ok"),
      record("sale-2", "Medias de danza · Talle M", "Sofía Benítez", "Reservado", "info"),
      record("sale-3", "Zapatos clásicos · Talle 35", "Valentina Ruiz", "A pedir", "review"),
    ],
  },
  arca: {
    headers: ["Comprobante", "Receptor", "Estado fiscal"], action: "Nuevo borrador", search: "Buscar comprobante o receptor",
    rows: [
      record("arca-1", "Borrador B 0001-00000124", "Consumidor final", "Sin enviar", "info"),
      record("arca-2", "Configuración fiscal", "Credenciales no cargadas", "Desactivado", "review"),
    ],
  },
};

function createSeedRecords(): DemoRecordsByModule {
  return Object.fromEntries(Object.entries(tableDemos).map(([key, demo]) => [key, demo?.rows.map((item) => ({ ...item })) ?? []])) as DemoRecordsByModule;
}

function loadDemoRecords(): DemoRecordsByModule {
  if (typeof window === "undefined") return createSeedRecords();
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) as DemoRecordsByModule : createSeedRecords();
  } catch {
    return createSeedRecords();
  }
}

export function DemoDashboard({ academyName, ownerName, selectedModules, onBackToSetup }: DemoDashboardProps) {
  const [activeSection, setActiveSection] = useState<DashboardSection>("home");
  const [recordsByModule, setRecordsByModule] = useState<DemoRecordsByModule>(loadDemoRecords);
  const [confirmReset, setConfirmReset] = useState(false);
  const visibleModules = selectedModules.filter((module) => !module.internal);
  const activeModule = visibleModules.find((module) => module.key === activeSection);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(recordsByModule));
  }, [recordsByModule]);

  function addRecord(moduleKey: ModuleKey, newRecord: DemoRecord) {
    setRecordsByModule((current) => ({ ...current, [moduleKey]: [...(current[moduleKey] ?? []), newRecord] }));
  }

  function resetDemo() {
    setRecordsByModule(createSeedRecords());
    setConfirmReset(false);
    setActiveSection("home");
  }

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="brand-mark" aria-hidden="true">DG</div>
          <div><strong>{academyName || "Mi academia"}</strong><span>Panel administrativo</span></div>
        </div>

        <nav className="dashboard-nav" aria-label="Módulos del panel">
          <button type="button" className={activeSection === "home" ? "active" : ""} onClick={() => setActiveSection("home")}>
            <span aria-hidden="true">IN</span><strong>Inicio</strong>
          </button>
          {visibleModules.map((module) => (
            <button type="button" className={activeSection === module.key ? "active" : ""} key={module.key} onClick={() => setActiveSection(module.key)}>
              <span aria-hidden="true">{module.icon}</span><strong>{module.label}</strong>
            </button>
          ))}
        </nav>

        <div className="dashboard-user">
          <span aria-hidden="true">{ownerName.trim().slice(0, 1).toUpperCase() || "O"}</span>
          <div><strong>{ownerName || "Owner"}</strong><small>Control total</small></div>
        </div>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <p className="eyebrow">Demo administrativa</p>
            <h1>{activeModule?.label ?? "Resumen de hoy"}</h1>
            <p>{activeModule?.description ?? "Información importante para organizar la jornada."}</p>
          </div>
          <div className="topbar-actions">
            <span className="demo-badge">Guardado en este navegador</span>
            <button type="button" className="secondary-action" onClick={() => setConfirmReset(true)}>Restablecer demo</button>
            <button type="button" className="secondary-action" onClick={onBackToSetup}>Configuración</button>
          </div>
        </header>

        {confirmReset && <section className="reset-strip" role="alert"><div><strong>¿Restablecer los datos de muestra?</strong><span>Se descartarán únicamente los cambios hechos en este navegador.</span></div><div><button type="button" onClick={() => setConfirmReset(false)}>Cancelar</button><button type="button" className="danger-action" onClick={resetDemo}>Sí, restablecer</button></div></section>}

        {activeSection === "home" ? <DashboardHome /> : <ModuleDemo module={activeModule} records={activeModule ? recordsByModule[activeModule.key] : undefined} onAdd={addRecord} />}
      </section>
    </main>
  );
}

function DashboardHome() {
  return (
    <div className="dashboard-body">
      <section className="daily-summary" aria-label="Resumen diario">
        <article><span>Alumnos activos</span><strong>186</strong><small>4 altas este mes</small></article>
        <article><span>Clases de hoy</span><strong>12</strong><small>3 salas en uso</small></article>
        <article><span>Cuotas pendientes</span><strong>23</strong><small>8 vencidas</small></article>
        <article><span>Caja del día</span><strong>$ 284.500</strong><small>18 movimientos</small></article>
      </section>

      <div className="dashboard-columns">
        <section className="activity-panel">
          <div className="panel-heading"><div><p className="eyebrow">Agenda</p><h2>Próximas clases</h2></div><button type="button">Ver grilla</button></div>
          <div className="class-list">
            <div><time>16:00</time><span><strong>Clásico inicial</strong><small>Sala A · 14 alumnos</small></span><b>En 25 min</b></div>
            <div><time>17:30</time><span><strong>Jazz intermedio</strong><small>Sala B · 18 alumnos</small></span><b>Hoy</b></div>
            <div><time>19:00</time><span><strong>Entrenamiento funcional</strong><small>Sala C · 12 alumnos</small></span><b>Hoy</b></div>
          </div>
        </section>

        <aside className="attention-panel">
          <p className="eyebrow">Para revisar</p><h2>5 tareas pendientes</h2>
          <ul>
            <li><span>8</span><div><strong>Cuotas vencidas</strong><small>Contactar responsables</small></div></li>
            <li><span>3</span><div><strong>Transferencias</strong><small>Esperan confirmación</small></div></li>
            <li><span>2</span><div><strong>Fichas incompletas</strong><small>Falta documentación</small></div></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function ModuleDemo({ module, records, onAdd }: { module?: ProductModule; records?: DemoRecord[]; onAdd: (moduleKey: ModuleKey, record: DemoRecord) => void }) {
  if (!module) return null;
  if (module.key === "schedule") return <ScheduleDemo />;
  if (module.key === "reports") return <ReportsDemo />;
  if (module.key === "studentPortal") return <StudentPortalDemo />;

  const demo = tableDemos[module.key];
  if (!demo) return <ModuleEmptyState module={module} />;

  return (
    <TableModuleDemo module={module} demo={demo} records={records ?? demo.rows} onAdd={onAdd} />
  );
}

function TableModuleDemo({ module, demo, records, onAdd }: { module: ProductModule; demo: TableDemo; records: DemoRecord[]; onAdd: (moduleKey: ModuleKey, record: DemoRecord) => void }) {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState({ primary: "", secondary: "", status: "" });
  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    if (!normalized) return records;
    return records.filter((item) => `${item.primary} ${item.secondary} ${item.status}`.toLocaleLowerCase("es").includes(normalized));
  }, [query, records]);

  function submitRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.primary.trim() || !draft.secondary.trim() || !draft.status.trim()) return;
    onAdd(module.key, record(`${module.key}-${Date.now()}`, draft.primary.trim(), draft.secondary.trim(), draft.status.trim(), "info"));
    setDraft({ primary: "", secondary: "", status: "" });
    setIsAdding(false);
  }

  return (
    <div className="dashboard-body">
      <section className="module-toolbar">
        <label><span>Buscar</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={demo.search} /></label>
        <button type="button" className="primary-action" onClick={() => setIsAdding((current) => !current)}>{isAdding ? "Cancelar" : demo.action}</button>
      </section>
      {isAdding && <form className="quick-entry" onSubmit={submitRecord}>
        <div><p className="eyebrow">Carga de demostración</p><h2>Agregar en {module.label.toLowerCase()}</h2></div>
        <label><span>{demo.headers[0]}</span><input value={draft.primary} onChange={(event) => setDraft((current) => ({ ...current, primary: event.target.value }))} required /></label>
        <label><span>{demo.headers[1]}</span><input value={draft.secondary} onChange={(event) => setDraft((current) => ({ ...current, secondary: event.target.value }))} required /></label>
        <label><span>{demo.headers[2]}</span><input value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} required /></label>
        <button type="submit" className="primary-action">Guardar</button>
      </form>}
      <section className="demo-table" aria-label={`Vista demo de ${module.label}`}>
        <div className="table-heading"><span>{demo.headers[0]}</span><span>{demo.headers[1]}</span><span>{demo.headers[2]}</span></div>
        {filteredRecords.map((row) => (
          <div className="table-row" key={row.id}>
            <strong>{row.primary}</strong><span>{row.secondary}</span><b className={`status-${row.tone}`}>{row.status}</b>
          </div>
        ))}
        {filteredRecords.length === 0 && <div className="table-empty"><strong>No encontramos resultados.</strong><span>Probá con otra búsqueda o agregá un registro de demostración.</span></div>}
      </section>
      <DemoExplanation />
    </div>
  );
}

function ScheduleDemo() {
  type ScheduleView = "day" | "week" | "month";
  type ScheduleEvent = {
    id: string;
    date: number;
    day: string;
    time: string;
    title: string;
    room: string;
    teacher: string;
    kind: "Clase regular" | "Seminario" | "Práctica";
    enrolled: number;
    capacity: number;
    status: string;
    tone: "regular" | "special" | "full" | "changed";
  };

  const [view, setView] = useState<ScheduleView>("week");
  const [selectedDay, setSelectedDay] = useState("Miércoles");
  const [roomFilter, setRoomFilter] = useState("Todas las salas");
  const [kindFilter, setKindFilter] = useState("Todas las actividades");
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const events: ScheduleEvent[] = [
    { id: "mon-1", date: 13, day: "Lunes", time: "16:00", title: "Clásico inicial", room: "Sala A", teacher: "Carolina Méndez", kind: "Clase regular", enrolled: 14, capacity: 20, status: "6 lugares", tone: "regular" },
    { id: "mon-2", date: 13, day: "Lunes", time: "19:00", title: "Práctica de tango", room: "Sala B", teacher: "Santiago León", kind: "Práctica", enrolled: 22, capacity: 24, status: "Reserva previa", tone: "special" },
    { id: "tue-1", date: 14, day: "Martes", time: "17:30", title: "Jazz intermedio", room: "Sala B", teacher: "Lucía Romero", kind: "Clase regular", enrolled: 18, capacity: 24, status: "6 lugares", tone: "regular" },
    { id: "tue-2", date: 14, day: "Martes", time: "19:45", title: "Figuras para la milonga", room: "Sala A", teacher: "Gisela Terella", kind: "Seminario", enrolled: 20, capacity: 20, status: "Completo", tone: "full" },
    { id: "wed-1", date: 15, day: "Miércoles", time: "16:00", title: "Danza contemporánea", room: "Sala A", teacher: "Julián Acosta", kind: "Clase regular", enrolled: 20, capacity: 20, status: "Completo", tone: "full" },
    { id: "wed-2", date: 15, day: "Miércoles", time: "18:30", title: "Tango estilo pista", room: "Sala C", teacher: "Orlando y Paula", kind: "Seminario", enrolled: 12, capacity: 15, status: "Reserva previa", tone: "special" },
    { id: "thu-1", date: 16, day: "Jueves", time: "18:00", title: "Entrenamiento funcional", room: "Sala C", teacher: "Diego Fernández", kind: "Clase regular", enrolled: 12, capacity: 15, status: "3 lugares", tone: "regular" },
    { id: "thu-2", date: 16, day: "Jueves", time: "19:30", title: "Tango y milonga", room: "Sala B", teacher: "Valeria Iñarra", kind: "Clase regular", enrolled: 16, capacity: 24, status: "Profesor reemplazante", tone: "changed" },
    { id: "fri-1", date: 17, day: "Viernes", time: "18:30", title: "La previa", room: "Sala A", teacher: "Santiago y Florencia", kind: "Práctica", enrolled: 19, capacity: 20, status: "Último lugar", tone: "special" },
    { id: "sat-1", date: 18, day: "Sábado", time: "12:00", title: "Técnica para los dos roles", room: "Sala A", teacher: "Claudia Codega", kind: "Seminario", enrolled: 17, capacity: 20, status: "3 lugares", tone: "special" },
    { id: "sat-2", date: 18, day: "Sábado", time: "15:00", title: "Giros, sacadas y barridas", room: "Sala B", teacher: "Orlando y Paula", kind: "Seminario", enrolled: 24, capacity: 24, status: "Lista de espera", tone: "full" },
  ];
  const filteredEvents = events.filter((event) => (roomFilter === "Todas las salas" || event.room === roomFilter) && (kindFilter === "Todas las actividades" || event.kind === kindFilter));
  const monthHighlights: Record<number, { label: string; tone: ScheduleEvent["tone"] }[]> = {
    13: [{ label: "Práctica 19:00", tone: "special" }],
    14: [{ label: "Seminario 19:45", tone: "special" }],
    15: [{ label: "Tango pista 18:30", tone: "special" }],
    17: [{ label: "La previa 18:30", tone: "special" }],
    18: [{ label: "3 seminarios", tone: "full" }],
    20: [{ label: "Grilla regular", tone: "regular" }],
    25: [{ label: "Taller intensivo", tone: "changed" }],
  };
  const monthCells = [...Array(2).fill(null), ...Array.from({ length: 31 }, (_, index) => index + 1), ...Array(2).fill(null)];

  function EventCard({ event, compact = false }: { event: ScheduleEvent; compact?: boolean }) {
    return <article className={`schedule-event event-${event.tone} ${compact ? "compact-event" : ""}`}>
      <div className="event-time"><time>{event.time}</time><span>{event.kind}</span></div>
      <strong>{event.title}</strong>
      <span>{event.room} · {event.teacher}</span>
      {!compact && <div className="event-capacity"><span><b style={{ width: `${Math.min(100, (event.enrolled / event.capacity) * 100)}%` }} /></span><small>{event.enrolled}/{event.capacity}</small></div>}
      <em>{event.status}</em>
    </article>;
  }

  return (
    <div className="dashboard-body schedule-demo">
      <section className="calendar-commandbar" aria-label="Controles de la grilla">
        <div className="calendar-period"><button type="button" aria-label="Período anterior">←</button><div><strong>13 al 18 de julio</strong><span>Invierno 2026</span></div><button type="button" aria-label="Período siguiente">→</button></div>
        <div className="view-switcher" aria-label="Vista del calendario">
          {(["day", "week", "month"] as ScheduleView[]).map((option) => <button type="button" aria-pressed={view === option} className={view === option ? "active" : ""} key={option} onClick={() => setView(option)}>{option === "day" ? "Día" : option === "week" ? "Semana" : "Mes"}</button>)}
        </div>
        <button type="button" className="primary-action">Nueva actividad</button>
      </section>

      <section className="calendar-filters" aria-label="Filtros de la grilla">
        <div><strong>{filteredEvents.length} actividades visibles</strong><span>3 salas · 8 profesores</span></div>
        <label><span>Sala</span><select value={roomFilter} onChange={(event) => setRoomFilter(event.target.value)}><option>Todas las salas</option><option>Sala A</option><option>Sala B</option><option>Sala C</option></select></label>
        <label><span>Actividad</span><select value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}><option>Todas las actividades</option><option>Clase regular</option><option>Seminario</option><option>Práctica</option></select></label>
        <div className="calendar-legend" aria-label="Referencias"><span><i className="legend-regular" />Regular</span><span><i className="legend-special" />Especial</span><span><i className="legend-full" />Completa</span></div>
      </section>

      {view === "day" && <section className="day-view" aria-label="Agenda diaria de muestra">
        <nav className="day-selector" aria-label="Seleccionar día">{days.map((day, index) => <button type="button" className={selectedDay === day ? "active" : ""} aria-pressed={selectedDay === day} onClick={() => setSelectedDay(day)} key={day}><span>{day.slice(0, 3)}</span><strong>{13 + index}</strong></button>)}</nav>
        <div className="day-agenda"><header><div><p className="eyebrow">Agenda del día</p><h2>{selectedDay} {13 + days.indexOf(selectedDay)} de julio</h2></div><span>{filteredEvents.filter((event) => event.day === selectedDay).length} actividades</span></header>{filteredEvents.filter((event) => event.day === selectedDay).map((event) => <EventCard event={event} key={event.id} />)}{filteredEvents.filter((event) => event.day === selectedDay).length === 0 && <div className="calendar-empty"><strong>No hay actividades con estos filtros.</strong><span>Probá mostrando todas las salas y actividades.</span></div>}</div>
      </section>}

      {view === "week" && <section className="week-grid" aria-label="Grilla semanal de muestra">
        {days.map((day, index) => <div className="day-column" key={day}><header><div><h2>{day}</h2><span>{13 + index} JUL</span></div><b>{filteredEvents.filter((event) => event.day === day).length}</b></header>{filteredEvents.filter((event) => event.day === day).map((event) => <EventCard compact event={event} key={event.id} />)}{filteredEvents.filter((event) => event.day === day).length === 0 && <p>Sin actividades</p>}</div>)}
      </section>}

      {view === "month" && <section className="month-view" aria-label="Calendario mensual de muestra">
        <div className="month-weekdays">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="month-grid">{monthCells.map((date, index) => <div className={`month-day ${date === 15 ? "today" : ""} ${date === null ? "empty" : ""}`} key={`${date ?? "empty"}-${index}`}>{date && <><time>{date}</time>{monthHighlights[date]?.map((item) => <span className={`month-event event-${item.tone}`} key={item.label}>{item.label}</span>)}</>}</div>)}</div>
      </section>}

      <section className="calendar-summary" aria-label="Resumen de ocupación"><div><span>Ocupación semanal</span><strong>82%</strong></div><div><span>Reservas previas</span><strong>41</strong></div><div><span>Listas de espera</span><strong>2</strong></div><p>La demo representa clases regulares, seminarios y prácticas. Los cambios se muestran visualmente antes de operar con datos reales.</p></section>
      <DemoExplanation />
    </div>
  );
}

function ReportsDemo() {
  return (
    <div className="dashboard-body">
      <section className="report-list" aria-label="Reportes disponibles">
        <article><span>DE</span><div><strong>Estado de deuda</strong><small>Cuotas vencidas y saldos pendientes por alumno</small></div><button type="button">Abrir</button></article>
        <article><span>AS</span><div><strong>Asistencias del mes</strong><small>Presentismo por clase, profesor y período</small></div><button type="button">Abrir</button></article>
        <article><span>CA</span><div><strong>Resumen de caja</strong><small>Ingresos, egresos y medios de pago</small></div><button type="button">Abrir</button></article>
        <article><span>AL</span><div><strong>Alumnos e inscripciones</strong><small>Altas, bajas y distribución por actividad</small></div><button type="button">Abrir</button></article>
      </section>
      <DemoExplanation />
    </div>
  );
}

function StudentPortalDemo() {
  return (
    <div className="dashboard-body portal-preview">
      <section className="portal-account"><p className="eyebrow">Vista del alumno</p><h2>Hola, Martina</h2><p>Desde aquí puede consultar su actividad sin acceder al panel administrativo.</p><dl><div><dt>Estado de cuenta</dt><dd>Al día</dd></div><div><dt>Próxima clase</dt><dd>Miércoles 17:30</dd></div><div><dt>Asistencia mensual</dt><dd>7 de 8 clases</dd></div></dl></section>
      <section className="portal-actions"><h2>Accesos disponibles</h2><div><button type="button">Ver mis pagos</button><button type="button">Consultar clases</button><button type="button">Revisar asistencias</button><button type="button">Abrir calendario</button></div></section>
      <DemoExplanation />
    </div>
  );
}

function ModuleEmptyState({ module }: { module: ProductModule }) {
  return <div className="dashboard-body"><section className="module-empty"><span>{module.icon}</span><h2>{module.label} está habilitado</h2><p>La vista comercial específica de este módulo se incorporará antes de activarlo para un cliente.</p></section><DemoExplanation /></div>;
}

function DemoExplanation() {
  return <p className="demo-explanation">Información de muestra. La implementación mostrará los datos reales del cliente y respetará los permisos de cada usuario.</p>;
}
