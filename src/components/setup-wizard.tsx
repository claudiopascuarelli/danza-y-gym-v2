"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  categoryLabels,
  getActiveDependents,
  moduleMap,
  modules,
  resolveRequiredModules,
  starterSelection,
  type ModuleCategory,
  type ModuleKey,
} from "@/lib/modules";
import { emptyEconomicRules, settlementModeLabels, type EconomicRules } from "@/lib/setup";
import { DemoDashboard } from "@/components/demo-dashboard";

const categories: ModuleCategory[] = ["operacion", "administracion", "servicios", "fiscal"];
const stepLabels = ["Identidad", "Módulos", "Reglas económicas", "Owner y acceso", "Confirmación"];

export function SetupWizard() {
  const [step, setStep] = useState(1);
  const [academyName, setAcademyName] = useState("Mi academia");
  const [organizationType, setOrganizationType] = useState("Academia de danza");
  const [ownerName, setOwnerName] = useState("Mi Nombre");
  const [ownerEmail, setOwnerEmail] = useState("minombre@gmail.com");
  const [rules, setRules] = useState<EconomicRules>(emptyEconomicRules);
  const [selected, setSelected] = useState<Set<ModuleKey>>(() => resolveRequiredModules(starterSelection));
  const [lastMessage, setLastMessage] = useState("Configuración base cargada. Podés adaptarla antes de continuar.");
  const [validated, setValidated] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const requiredBySelection = useMemo(() => {
    const required = new Set<ModuleKey>();
    for (const key of selected) {
      for (const dependency of moduleMap.get(key)?.requires ?? []) required.add(dependency);
    }
    return required;
  }, [selected]);

  const selectedModules = modules.filter((module) => selected.has(module.key));
  const visibleModules = modules.filter((module) => !module.internal || selected.has(module.key));
  const commercialCount = selectedModules.filter((module) => !module.internal).length;
  const internalCount = selectedModules.filter((module) => module.internal).length;
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerEmail);

  function updateRule<Key extends keyof EconomicRules>(key: Key, value: EconomicRules[Key]) {
    setRules((current) => ({ ...current, [key]: value }));
  }

  function goToStep(nextStep: number) {
    setValidated(false);
    setStep(Math.min(5, Math.max(1, nextStep)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleModule(key: ModuleKey) {
    if (selected.has(key)) {
      const dependents = getActiveDependents(key, selected);
      if (dependents.length > 0) {
        setLastMessage(`No se puede desactivar ${moduleMap.get(key)?.label}: lo utilizan ${dependents.map((item) => item.label).join(", ")}.`);
        return;
      }

      const next = new Set(selected);
      next.delete(key);
      setSelected(next);
      setLastMessage(`${moduleMap.get(key)?.label} se ocultará sin eliminar información.`);
      return;
    }

    const before = new Set(selected);
    const next = resolveRequiredModules([...selected, key]);
    const addedDependencies = [...next].filter((item) => !before.has(item) && item !== key);
    setSelected(next);
    setLastMessage(
      addedDependencies.length > 0
        ? `${moduleMap.get(key)?.label} activó también: ${addedDependencies.map((item) => moduleMap.get(item)?.label).join(", ")}.`
        : `${moduleMap.get(key)?.label} quedó activado.`,
    );
  }

  if (showDashboard) {
    return (
      <DemoDashboard
        academyName={academyName}
        ownerName={ownerName}
        selectedModules={selectedModules}
        onBackToSetup={() => setShowDashboard(false)}
      />
    );
  }

  return (
    <main className="setup-shell">
      <aside className="setup-sidebar">
        <div className="provider-brand">
          <Image src="/logo-aisistema.png" alt="AISistema" width={300} height={86} priority />
          <span>Implementador de Danza y Gym</span>
        </div>
        <div>
          <p className="eyebrow">Configuración inicial</p>
          <h1>Danza y Gym</h1>
          <p className="sidebar-copy">Definí cómo va a trabajar esta instalación. Las decisiones se pueden ajustar sin perder información.</p>
        </div>

        <ol className="steps" aria-label="Pasos de configuración">
          {stepLabels.map((label, index) => {
            const number = index + 1;
            return (
              <li className={number === step ? "active" : number < step ? "complete" : ""} key={label}>
                <span>{number}</span> {label}
              </li>
            );
          })}
        </ol>

        <div className="ownership-note">
          <strong>Instalación privada</strong>
          <span>Sin registro público ni superadmin global.</span>
        </div>
      </aside>

      <section className="setup-content">
        {step === 1 && (
          <section className="demo-notice" aria-label="Información sobre la demostración">
            <span className="demo-notice-label">Modo demo</span>
            <div>
              <strong>Estos datos son para una demostración</strong>
              <p>La información que se muestra o ingresa sirve únicamente para conocer el funcionamiento de Danza y Gym.</p>
            </div>
          </section>
        )}
        {step === 1 && (
          <IdentityStep
            academyName={academyName}
            organizationType={organizationType}
            setAcademyName={setAcademyName}
            setOrganizationType={setOrganizationType}
          />
        )}

        {step === 2 && (
          <ModulesStep
            academyName={academyName}
            selected={selected}
            visibleModules={visibleModules}
            requiredBySelection={requiredBySelection}
            lastMessage={lastMessage}
            toggleModule={toggleModule}
          />
        )}

        {step === 3 && <EconomicRulesStep selected={selected} rules={rules} updateRule={updateRule} />}

        {step === 4 && (
          <OwnerStep
            ownerName={ownerName}
            ownerEmail={ownerEmail}
            setOwnerName={setOwnerName}
            setOwnerEmail={setOwnerEmail}
          />
        )}

        {step === 5 && (
          <ConfirmationStep
            academyName={academyName}
            organizationType={organizationType}
            ownerName={ownerName}
            ownerEmail={ownerEmail}
            selectedModules={selectedModules}
            rules={rules}
            validated={validated}
          />
        )}

        <footer className="setup-footer">
          <div className="selection-summary">
            <strong>{commercialCount} módulos elegidos</strong>
            <span>{internalCount} capacidades internas agregadas automáticamente</span>
          </div>
          <div className="footer-actions">
            {step > 1 && <button type="button" className="secondary-action" onClick={() => goToStep(step - 1)}>Atrás</button>}
            {step === 2 && <button type="button" className="secondary-action">Guardar borrador local</button>}
            {step < 4 && (
              <button type="button" className="primary-action" onClick={() => goToStep(step + 1)}>
                Continuar <span aria-hidden="true">→</span>
              </button>
            )}
            {step === 4 && (
              <button type="button" className="primary-action" disabled={!ownerName.trim() || !emailIsValid} onClick={() => goToStep(5)}>
                Revisar configuración <span aria-hidden="true">→</span>
              </button>
            )}
            {step === 5 && (
              <button type="button" className="primary-action" onClick={() => validated ? setShowDashboard(true) : setValidated(true)}>
                {validated ? "Ingresar al panel demo" : "Confirmar configuración"}
              </button>
            )}
          </div>
        </footer>
      </section>
    </main>
  );
}

interface IdentityStepProps {
  academyName: string;
  organizationType: string;
  setAcademyName: (value: string) => void;
  setOrganizationType: (value: string) => void;
}

function IdentityStep({ academyName, organizationType, setAcademyName, setOrganizationType }: IdentityStepProps) {
  return (
    <>
      <PageHeader
        step="Paso 1 de 5"
        title="Identificá esta instalación"
        description="Estos datos personalizan la experiencia sin convertir el producto en un sistema multiempresa."
      />
      <div className="identity-layout">
        <section className="form-section identity-form">
          <div className="section-copy">
            <h3>Datos principales</h3>
            <p>Más adelante el owner podrá agregar su logo y ajustar la identidad visual.</p>
          </div>
          <div className="fields-grid">
            <label className="form-field wide-field">
              <span>Nombre de la instalación</span>
              <input value={academyName} onChange={(event) => setAcademyName(event.target.value)} placeholder="Nombre de la academia" />
            </label>
            <label className="form-field wide-field">
              <span>Tipo de organización</span>
              <select value={organizationType} onChange={(event) => setOrganizationType(event.target.value)}>
                <option>Academia de danza</option>
                <option>Estudio</option>
                <option>Gimnasio</option>
                <option>Espacio de actividades</option>
              </select>
            </label>
          </div>
        </section>
        <section className="identity-preview" aria-label="Vista previa de identidad">
          <div className="preview-mark" aria-hidden="true">DG</div>
          <p className="eyebrow">Instalación privada</p>
          <h3>{academyName || "Tu organización"}</h3>
          <p>{organizationType}</p>
          <span>Celeste argentino · Identidad inicial</span>
        </section>
      </div>
    </>
  );
}

interface ModulesStepProps {
  academyName: string;
  selected: Set<ModuleKey>;
  visibleModules: typeof modules;
  requiredBySelection: Set<ModuleKey>;
  lastMessage: string;
  toggleModule: (key: ModuleKey) => void;
}

function ModulesStep({ academyName, selected, visibleModules, requiredBySelection, lastMessage, toggleModule }: ModulesStepProps) {
  return (
    <>
      <PageHeader step="Paso 2 de 5" title={`Elegí los módulos de ${academyName || "la academia"}`} description="Las dependencias necesarias se activan automáticamente. Las recomendaciones quedan a elección del owner." />

      <div className="system-message" role="status" aria-live="polite"><span aria-hidden="true">i</span>{lastMessage}</div>
      <div className="module-groups">
        {categories.map((category) => {
          const categoryModules = visibleModules.filter((module) => module.category === category);
          if (categoryModules.length === 0) return null;
          return (
            <section className="module-group" key={category}>
              <div className="group-heading"><h3>{categoryLabels[category]}</h3><span>{categoryModules.filter((module) => selected.has(module.key)).length} activos</span></div>
              <div className="module-list">
                {categoryModules.map((module) => {
                  const enabled = selected.has(module.key);
                  const locked = enabled && requiredBySelection.has(module.key);
                  return (
                    <button type="button" className={`module-row ${enabled ? "enabled" : ""}`} key={module.key} onClick={() => toggleModule(module.key)} aria-pressed={enabled}>
                      <span className="module-icon" aria-hidden="true">{module.icon}</span>
                      <span className="module-text">
                        <strong>{module.label}</strong><small>{module.description}</small>
                        {module.requires.length > 0 && <em>Requiere: {module.requires.map((key) => moduleMap.get(key)?.label).join(", ")}</em>}
                      </span>
                      <span className={`switch ${enabled ? "on" : ""}`} aria-hidden="true"><span /></span>
                      {locked && <span className="locked-label">Dependencia</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

interface EconomicRulesStepProps {
  selected: Set<ModuleKey>;
  rules: EconomicRules;
  updateRule: <Key extends keyof EconomicRules>(key: Key, value: EconomicRules[Key]) => void;
}

function EconomicRulesStep({ selected, rules, updateRule }: EconomicRulesStepProps) {
  return (
    <>
      <PageHeader step="Paso 3 de 5" title="Definí las reglas económicas" description="Todos los valores son configurables. Los campos vacíos quedan sin regla hasta que el owner los complete." />
      <div className="rule-sections">
        {selected.has("fees") && (
          <FormSection title="Cuotas y vencimientos" description="Las reglas pueden modificarse más adelante y tendrán vigencia por período.">
            <NumberField label="Día de vencimiento" value={rules.dueDay} placeholder="Ej. 15" onChange={(value) => updateRule("dueDay", value)} suffix="del mes" />
            <NumberField label="Primer recargo" value={rules.firstLatePercent} placeholder="Ej. 10" onChange={(value) => updateRule("firstLatePercent", value)} suffix="%" />
            <NumberField label="Aplicar después de" value={rules.firstLateDays} placeholder="Ej. 1" onChange={(value) => updateRule("firstLateDays", value)} suffix="días" />
            <NumberField label="Segundo recargo" value={rules.secondLatePercent} placeholder="Ej. 15" onChange={(value) => updateRule("secondLatePercent", value)} suffix="%" />
            <NumberField label="Aplicar después de" value={rules.secondLateDays} placeholder="Ej. 30" onChange={(value) => updateRule("secondLateDays", value)} suffix="días" />
            <NumberField label="Recargo por transferencia" value={rules.transferSurchargePercent} placeholder="Opcional" onChange={(value) => updateRule("transferSurchargePercent", value)} suffix="%" />
          </FormSection>
        )}

        {(selected.has("workshops") || selected.has("formations")) && (
          <FormSection title="Talleres y formaciones" description="Estas reglas no quedan asociadas a nombres de carreras o talleres específicos.">
            <NumberField label="Recargo para externos" value={rules.externalWorkshopPercent} placeholder="Opcional" onChange={(value) => updateRule("externalWorkshopPercent", value)} suffix="%" />
            <NumberField label="Descuento de formación" value={rules.formationDiscountPercent} placeholder="Opcional" onChange={(value) => updateRule("formationDiscountPercent", value)} suffix="%" />
            <NumberField label="Descuento familiar" value={rules.familyDiscountPercent} placeholder="Opcional" onChange={(value) => updateRule("familyDiscountPercent", value)} suffix="%" />
          </FormSection>
        )}

        {selected.has("teachers") && (
          <FormSection title="Profesores" description="La regla general podrá reemplazarse por una condición específica para cada profesor, clase o taller.">
            <NumberField label="Descuento para profesor como alumno" value={rules.teacherStudentDiscountPercent} placeholder="Opcional" onChange={(value) => updateRule("teacherStudentDiscountPercent", value)} suffix="%" />
            {selected.has("teacherSettlements") && (
              <label className="form-field wide-field">
                <span>Modalidad inicial de liquidación</span>
                <select value={rules.teacherSettlementMode} onChange={(event) => updateRule("teacherSettlementMode", event.target.value as EconomicRules["teacherSettlementMode"])}>
                  {Object.entries(settlementModeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
            )}
            {selected.has("teacherSettlements") && <NumberField label="Valor inicial" value={rules.teacherSettlementValue} placeholder="Sin valor fijo" onChange={(value) => updateRule("teacherSettlementValue", value)} suffix={rules.teacherSettlementMode === "per_student_percent" ? "%" : "$"} />}
          </FormSection>
        )}

        {!selected.has("fees") && !selected.has("workshops") && !selected.has("teachers") && (
          <div className="empty-panel"><strong>No hay reglas económicas requeridas.</strong><span>Podés volver a Módulos para activar Cuotas, Talleres o Profesores.</span></div>
        )}
      </div>
    </>
  );
}

interface OwnerStepProps {
  ownerName: string;
  ownerEmail: string;
  setOwnerName: (value: string) => void;
  setOwnerEmail: (value: string) => void;
}

function OwnerStep({ ownerName, ownerEmail, setOwnerName, setOwnerEmail }: OwnerStepProps) {
  return (
    <>
      <PageHeader step="Paso 4 de 5" title="Definí al responsable principal" description="Esta persona administrará la configuración y los accesos del equipo." />
      <div className="owner-layout">
        <section className="form-section owner-form">
          <div className="section-copy"><h3>Datos de acceso</h3><p>La contraseña se configura de manera privada al activar la instalación.</p></div>
          <label className="form-field wide-field"><span>Nombre completo</span><input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="Responsable de la academia" /></label>
          <label className="form-field wide-field"><span>Correo del responsable</span><input type="email" value={ownerEmail} onChange={(event) => setOwnerEmail(event.target.value)} placeholder="responsable@academia.com" /></label>
          <div className="system-message compact"><span aria-hidden="true">i</span>Recibirá una invitación privada para crear su contraseña.</div>
        </section>
        <section className="ownership-panel">
          <p className="eyebrow">Tu sistema</p>
          <h3>Todo queda bajo el control del cliente</h3>
          <div className="control-symbol" aria-hidden="true">✓</div>
          <p>La información, los accesos y la configuración pertenecen al cliente.</p>
        </section>
      </div>
    </>
  );
}

interface ConfirmationStepProps {
  academyName: string;
  organizationType: string;
  ownerName: string;
  ownerEmail: string;
  selectedModules: typeof modules;
  rules: EconomicRules;
  validated: boolean;
}

function ConfirmationStep({ academyName, organizationType, ownerName, ownerEmail, selectedModules, rules, validated }: ConfirmationStepProps) {
  const configuredRuleCount = Object.entries(rules).filter(([key, value]) => key !== "teacherSettlementMode" && value !== "").length;
  const arcaEnabled = selectedModules.some((module) => module.key === "arca");
  return (
    <>
      <PageHeader step="Paso 5 de 5" title="Revisá la configuración" description="Confirmá que la información sea correcta antes de ingresar al panel." />
      {validated && <div className="success-message" role="status"><span aria-hidden="true">✓</span><div><strong>Todo quedó configurado</strong><p>El cliente tendrá el control total de su sistema.</p></div></div>}
      <div className="confirmation-grid">
        <section className="summary-block"><p className="eyebrow">Instalación</p><h3>{academyName || "Sin nombre"}</h3><dl><div><dt>Tipo</dt><dd>{organizationType}</dd></div><div><dt>Owner</dt><dd>{ownerName}</dd></div><div><dt>Correo</dt><dd>{ownerEmail}</dd></div><div><dt>Acceso</dt><dd>Privado, por invitación</dd></div></dl></section>
        <section className="summary-block"><p className="eyebrow">Alcance</p><h3>{selectedModules.filter((module) => !module.internal).length} módulos comerciales</h3><div className="module-chips">{selectedModules.filter((module) => !module.internal).map((module) => <span key={module.key}>{module.label}</span>)}</div></section>
        <section className="summary-block"><p className="eyebrow">Reglas</p><h3>{configuredRuleCount} valores configurados</h3><p>Los campos vacíos quedan sin regla. Todos los valores podrán tener vigencia y excepciones cuando exista persistencia.</p></section>
        <section className="summary-block"><p className="eyebrow">Fiscal</p><h3>{arcaEnabled ? "ARCA preparado" : "Sin integración ARCA"}</h3><p>{arcaEnabled ? "El módulo está seleccionado, pero permanece sin credenciales y fuera de producción hasta completar homologación." : "Los cobros usarán comprobantes internos, separados de una factura fiscal."}</p></section>
      </div>
      <div className="handoff-note"><strong>Demostración segura</strong><span>Podés recorrer el panel sin modificar información real.</span></div>
    </>
  );
}

function PageHeader({ step, title, description, children }: { step: string; title: string; description: string; children?: React.ReactNode }) {
  return <header className="content-header"><div><p className="eyebrow">{step}</p><h2>{title}</h2><p>{description}</p></div>{children}</header>;
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="form-section"><div className="section-copy"><h3>{title}</h3><p>{description}</p></div><div className="fields-grid">{children}</div></section>;
}

function NumberField({ label, value, placeholder, suffix, onChange }: { label: string; value: string; placeholder: string; suffix: string; onChange: (value: string) => void }) {
  return <label className="form-field"><span>{label}</span><span className="input-with-suffix"><input type="number" min="0" step="0.01" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /><b>{suffix}</b></span></label>;
}
