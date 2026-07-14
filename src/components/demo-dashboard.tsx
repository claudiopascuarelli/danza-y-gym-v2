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

const demoRows = [
  { name: "Martina López", detail: "Danza contemporánea", status: "Al día" },
  { name: "Sofía Benítez", detail: "Clásico inicial", status: "Cuota pendiente" },
  { name: "Tomás García", detail: "Entrenamiento funcional", status: "Al día" },
  { name: "Valentina Ruiz", detail: "Jazz intermedio", status: "Revisar ficha" },
];

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

  return (
    <div className="dashboard-body">
      <section className="module-toolbar">
        <label><span>Buscar</span><input type="search" placeholder={`Buscar en ${module.label.toLowerCase()}`} /></label>
        <button type="button" className="primary-action">Agregar</button>
      </section>
      <section className="demo-table" aria-label={`Vista demo de ${module.label}`}>
        <div className="table-heading"><span>Nombre</span><span>Detalle</span><span>Estado</span></div>
        {demoRows.map((row) => (
          <div className="table-row" key={row.name}>
            <strong>{row.name}</strong><span>{row.detail}</span><b className={row.status === "Al día" ? "status-ok" : "status-review"}>{row.status}</b>
          </div>
        ))}
      </section>
      <p className="demo-explanation">Esta pantalla utiliza información de muestra. En la implementación del cliente mostrará sus datos reales y respetará los permisos de cada usuario.</p>
    </div>
  );
}
