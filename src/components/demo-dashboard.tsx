"use client";

import { useState } from "react";
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
  rows: Array<{ primary: string; secondary: string; status: string; tone: "ok" | "review" | "info" }>;
  action: string;
  search: string;
}

const tableDemos: Partial<Record<ModuleKey, TableDemo>> = {
  students: {
    headers: ["Alumno", "Inscripción", "Estado"], action: "Nuevo alumno", search: "Buscar por nombre, DNI o clase",
    rows: [
      { primary: "Martina López", secondary: "Danza contemporánea", status: "Al día", tone: "ok" },
      { primary: "Sofía Benítez", secondary: "Clásico inicial", status: "Cuota pendiente", tone: "review" },
      { primary: "Tomás García", secondary: "Entrenamiento funcional", status: "Al día", tone: "ok" },
      { primary: "Valentina Ruiz", secondary: "Jazz intermedio", status: "Revisar ficha", tone: "review" },
    ],
  },
  teachers: {
    headers: ["Profesor", "Clases asignadas", "Disponibilidad"], action: "Nuevo profesor", search: "Buscar profesor o disciplina",
    rows: [
      { primary: "Carolina Méndez", secondary: "Clásico inicial · Sala A", status: "Lun y mié", tone: "info" },
      { primary: "Diego Fernández", secondary: "Entrenamiento funcional", status: "Mar y jue", tone: "info" },
      { primary: "Lucía Romero", secondary: "Jazz intermedio · Taller coreográfico", status: "3 clases", tone: "ok" },
      { primary: "Julián Acosta", secondary: "Danza contemporánea", status: "Reemplazo", tone: "review" },
    ],
  },
  rooms: {
    headers: ["Sala", "Capacidad", "Próxima actividad"], action: "Nueva sala", search: "Buscar sala",
    rows: [
      { primary: "Sala A", secondary: "20 personas · Piso flotante", status: "16:00 Clásico", tone: "info" },
      { primary: "Sala B", secondary: "24 personas · Espejos", status: "17:30 Jazz", tone: "info" },
      { primary: "Sala C", secondary: "15 personas · Equipamiento", status: "19:00 Funcional", tone: "info" },
      { primary: "Sala virtual", secondary: "Acceso por enlace privado", status: "Disponible", tone: "ok" },
    ],
  },
  classes: {
    headers: ["Clase", "Grupo", "Cupo"], action: "Nueva clase", search: "Buscar clase, nivel o profesor",
    rows: [
      { primary: "Clásico inicial", secondary: "Carolina Méndez · Sala A", status: "14 de 20", tone: "ok" },
      { primary: "Jazz intermedio", secondary: "Lucía Romero · Sala B", status: "18 de 24", tone: "ok" },
      { primary: "Danza contemporánea", secondary: "Julián Acosta · Sala A", status: "20 de 20", tone: "review" },
      { primary: "Entrenamiento funcional", secondary: "Diego Fernández · Sala C", status: "12 de 15", tone: "info" },
    ],
  },
  workshops: {
    headers: ["Taller", "Modalidad", "Inscripciones"], action: "Nuevo taller", search: "Buscar taller",
    rows: [
      { primary: "Composición creativa", secondary: "Sábado · 2 encuentros", status: "16 inscriptos", tone: "ok" },
      { primary: "Maquillaje escénico", secondary: "Abierto al público", status: "8 lugares", tone: "info" },
      { primary: "Música y movimiento", secondary: "Obligatorio para formación", status: "Completo", tone: "review" },
    ],
  },
  formations: {
    headers: ["Formación", "Trayecto", "Alumnos"], action: "Nueva formación", search: "Buscar formación o año",
    rows: [
      { primary: "Formación en Jazz", secondary: "Primer año · 6 materias", status: "18 alumnos", tone: "ok" },
      { primary: "Formación Clásica", secondary: "Segundo año · 7 materias", status: "14 alumnos", tone: "ok" },
      { primary: "Danzas españolas", secondary: "Primer año · 5 materias", status: "9 alumnos", tone: "info" },
    ],
  },
  attendance: {
    headers: ["Clase de hoy", "Presentes", "Registro"], action: "Tomar asistencia", search: "Buscar clase o alumno",
    rows: [
      { primary: "Clásico inicial · 16:00", secondary: "13 de 14 presentes", status: "Completa", tone: "ok" },
      { primary: "Jazz intermedio · 17:30", secondary: "0 de 18 presentes", status: "Pendiente", tone: "review" },
      { primary: "Funcional · 19:00", secondary: "0 de 12 presentes", status: "Más tarde", tone: "info" },
    ],
  },
  fees: {
    headers: ["Responsable", "Período", "Saldo"], action: "Registrar cobro", search: "Buscar alumno, responsable o período",
    rows: [
      { primary: "Familia Benítez", secondary: "Julio · Venció el 15/07", status: "$ 38.500", tone: "review" },
      { primary: "Martina López", secondary: "Julio · Transferencia", status: "Pagada", tone: "ok" },
      { primary: "Valentina Ruiz", secondary: "Julio · Pago parcial", status: "$ 12.000", tone: "info" },
      { primary: "Tomás García", secondary: "Agosto · Próximo período", status: "Sin emitir", tone: "info" },
    ],
  },
  cash: {
    headers: ["Movimiento", "Medio", "Importe"], action: "Nuevo movimiento", search: "Buscar concepto o comprobante",
    rows: [
      { primary: "Cuota Martina López", secondary: "Transferencia · 15:42", status: "+ $ 42.000", tone: "ok" },
      { primary: "Cuota Tomás García", secondary: "Efectivo · 14:18", status: "+ $ 38.500", tone: "ok" },
      { primary: "Compra de insumos", secondary: "Efectivo · 12:05", status: "- $ 16.800", tone: "review" },
      { primary: "Apertura de caja", secondary: "Fondo inicial · 09:00", status: "$ 50.000", tone: "info" },
    ],
  },
  scholarships: {
    headers: ["Alumno", "Beneficio", "Vigencia"], action: "Nueva beca", search: "Buscar alumno o tipo de beca",
    rows: [
      { primary: "Camila Torres", secondary: "Beca completa", status: "Hasta diciembre", tone: "ok" },
      { primary: "Nicolás Vega", secondary: "Media beca", status: "Revisar en agosto", tone: "info" },
      { primary: "Abril Sosa", secondary: "Beca por mérito", status: "Último cuatrimestre", tone: "ok" },
    ],
  },
  teacherSettlements: {
    headers: ["Profesor", "Período", "Liquidación"], action: "Preparar liquidación", search: "Buscar profesor o período",
    rows: [
      { primary: "Carolina Méndez", secondary: "Julio · 42 alumnos", status: "A revisar", tone: "review" },
      { primary: "Diego Fernández", secondary: "Julio · 18 horas", status: "$ 324.000", tone: "info" },
      { primary: "Lucía Romero", secondary: "Junio · Transferencia", status: "Pagada", tone: "ok" },
    ],
  },
  additionalSales: {
    headers: ["Pedido", "Cliente", "Estado"], action: "Nueva venta", search: "Buscar pedido, producto o cliente",
    rows: [
      { primary: "Zapatos de jazz · Talle 37", secondary: "Martina López", status: "Entregado", tone: "ok" },
      { primary: "Medias de danza · Talle M", secondary: "Sofía Benítez", status: "Reservado", tone: "info" },
      { primary: "Zapatos clásicos · Talle 35", secondary: "Valentina Ruiz", status: "A pedir", tone: "review" },
    ],
  },
  arca: {
    headers: ["Comprobante", "Receptor", "Estado fiscal"], action: "Nuevo borrador", search: "Buscar comprobante o receptor",
    rows: [
      { primary: "Borrador B 0001-00000124", secondary: "Consumidor final", status: "Sin enviar", tone: "info" },
      { primary: "Configuración fiscal", secondary: "Credenciales no cargadas", status: "Desactivado", tone: "review" },
    ],
  },
};

export function DemoDashboard({ academyName, ownerName, selectedModules, onBackToSetup }: DemoDashboardProps) {
  const [activeSection, setActiveSection] = useState<DashboardSection>("home");
  const visibleModules = selectedModules.filter((module) => !module.internal);
  const activeModule = visibleModules.find((module) => module.key === activeSection);

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
            <span className="demo-badge">Datos de muestra</span>
            <button type="button" className="secondary-action" onClick={onBackToSetup}>Configuración</button>
          </div>
        </header>

        {activeSection === "home" ? <DashboardHome /> : <ModuleDemo module={activeModule} />}
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

function ModuleDemo({ module }: { module?: ProductModule }) {
  if (!module) return null;
  if (module.key === "schedule") return <ScheduleDemo />;
  if (module.key === "reports") return <ReportsDemo />;
  if (module.key === "studentPortal") return <StudentPortalDemo />;

  const demo = tableDemos[module.key];
  if (!demo) return <ModuleEmptyState module={module} />;

  return (
    <div className="dashboard-body">
      <section className="module-toolbar">
        <label><span>Buscar</span><input type="search" placeholder={demo.search} /></label>
        <button type="button" className="primary-action">{demo.action}</button>
      </section>
      <section className="demo-table" aria-label={`Vista demo de ${module.label}`}>
        <div className="table-heading"><span>{demo.headers[0]}</span><span>{demo.headers[1]}</span><span>{demo.headers[2]}</span></div>
        {demo.rows.map((row) => (
          <div className="table-row" key={`${row.primary}-${row.secondary}`}>
            <strong>{row.primary}</strong><span>{row.secondary}</span><b className={`status-${row.tone}`}>{row.status}</b>
          </div>
        ))}
      </section>
      <DemoExplanation />
    </div>
  );
}

function ScheduleDemo() {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  const schedule = [
    ["16:00", "Clásico inicial", "Sala A", "Carolina"],
    ["17:30", "Jazz intermedio", "Sala B", "Lucía"],
    ["19:00", "Funcional", "Sala C", "Diego"],
  ];
  return (
    <div className="dashboard-body">
      <section className="schedule-toolbar"><strong>Semana del 13 al 17 de julio</strong><button type="button" className="primary-action">Nueva clase</button></section>
      <section className="week-grid" aria-label="Grilla horaria de muestra">
        {days.map((day) => <div className="day-column" key={day}><h2>{day}</h2>{schedule.map((item) => <article key={`${day}-${item[0]}`}><time>{item[0]}</time><strong>{item[1]}</strong><span>{item[2]} · {item[3]}</span></article>)}</div>)}
      </section>
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
