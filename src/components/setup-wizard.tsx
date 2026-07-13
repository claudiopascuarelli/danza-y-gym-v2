"use client";

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

const categories: ModuleCategory[] = ["operacion", "administracion", "servicios", "fiscal"];
const stepLabels = ["Identidad", "Módulos", "Reglas económicas", "Owner y acceso", "Confirmación"];

export function SetupWizard() {
  const [step, setStep] = useState(2);
  const [academyName, setAcademyName] = useState("Mi academia");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [rules, setRules] = useState<EconomicRules>(emptyEconomicRules);
  const [selected, setSelected] = useState<Set<ModuleKey>>(() => resolveRequiredModules(starterSelection));
  const [lastMessage, setLastMessage] = useState("Configuración base cargada. Podés adaptarla antes de continuar.");
  const [validated, setValidated] = useState(false);

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
    setStep(Math.min(5, Math.max(2, nextStep)));
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

  return (
    <main className="setup-shell">
      <aside className="setup-sidebar">
        <div className="brand-mark" aria-hidden="true">DG</div>
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
        {step === 2 && (
          <ModulesStep
            academyName={academyName}
            setAcademyName={setAcademyName}
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
            {step > 2 && <button type="button" className="secondary-action" onClick={() => goToStep(step - 1)}>Atrás</button>}
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
              <button type="button" className="primary-action" onClick={() => setValidated(true)}>
                Validar configuración demo
              </button>
            )}
          </div>
        </footer>
      </section>
    </main>
  );
}

interface ModulesStepProps {
  academyName: string;
  setAcademyName: (value: string) => void;
  selected: Set<ModuleKey>;
  visibleModules: typeof modules;
  requiredBySelection: Set<ModuleKey>;
  lastMessage: string;
  toggleModule: (key: ModuleKey) => void;
}

function ModulesStep({ academyName, setAcademyName, selected, visibleModules, requiredBySelection, lastMessage, toggleModule }: ModulesStepProps) {
  return (
    <>
      <PageHeader step="Paso 2 de 5" title={`Elegí los módulos de ${academyName || "la academia"}`} description="Las dependencias necesarias se activan automáticamente. Las recomendaciones quedan a elección del owner.">
        <label className="academy-field">
          <span>Nombre de la instalación</span>
          <input value={academyName} onChange={(event) => setAcademyName(event.target.value)} />
        </label>
      </PageHeader>

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
      <PageHeader step="Paso 4 de 5" title="Definí al owner de la instalación" description="Este usuario será el único responsable inicial. La invitación real se implementará cuando exista el Supabase del cliente." />
      <div className="owner-layout">
        <section className="form-section owner-form">
          <div className="section-copy"><h3>Datos de acceso</h3><p>No se genera ni almacena una contraseña en esta demo.</p></div>
          <label className="form-field wide-field"><span>Nombre completo</span><input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="Responsable de la academia" /></label>
          <label className="form-field wide-field"><span>Correo del owner</span><input type="email" value={ownerEmail} onChange={(event) => setOwnerEmail(event.target.value)} placeholder="owner@academia.com" /></label>
          <div className="system-message compact"><span aria-hidden="true">i</span>En producción recibirá un enlace para configurar su contraseña. No habrá registro público.</div>
        </section>
        <section className="ownership-panel">
          <p className="eyebrow">Propiedad del cliente</p>
          <h3>Una instalación, un responsable</h3>
          <ul className="check-list">
            <li><span>✓</span> GitHub del cliente</li>
            <li><span>✓</span> Supabase del cliente</li>
            <li><span>✓</span> Vercel del cliente</li>
            <li><span>✓</span> Dominio del cliente</li>
            <li><span>✓</span> Soporte con acceso temporal</li>
          </ul>
          <p>No se crea un superadmin global ni un acceso oculto para el proveedor.</p>
        </section>
      </div>
    </>
  );
}

interface ConfirmationStepProps {
  academyName: string;
  ownerName: string;
  ownerEmail: string;
  selectedModules: typeof modules;
  rules: EconomicRules;
  validated: boolean;
}

function ConfirmationStep({ academyName, ownerName, ownerEmail, selectedModules, rules, validated }: ConfirmationStepProps) {
  const configuredRuleCount = Object.entries(rules).filter(([key, value]) => key !== "teacherSettlementMode" && value !== "").length;
  const arcaEnabled = selectedModules.some((module) => module.key === "arca");
  return (
    <>
      <PageHeader step="Paso 5 de 5" title="Revisá la configuración" description="Esta validación es local. No crea usuarios, infraestructura ni registros externos." />
      {validated && <div className="success-message" role="status"><span aria-hidden="true">✓</span><div><strong>Configuración demo validada</strong><p>La próxima etapa podrá usar esta base para construir el panel administrativo.</p></div></div>}
      <div className="confirmation-grid">
        <section className="summary-block"><p className="eyebrow">Instalación</p><h3>{academyName || "Sin nombre"}</h3><dl><div><dt>Owner</dt><dd>{ownerName}</dd></div><div><dt>Correo</dt><dd>{ownerEmail}</dd></div><div><dt>Acceso</dt><dd>Privado, por invitación</dd></div></dl></section>
        <section className="summary-block"><p className="eyebrow">Alcance</p><h3>{selectedModules.filter((module) => !module.internal).length} módulos comerciales</h3><div className="module-chips">{selectedModules.filter((module) => !module.internal).map((module) => <span key={module.key}>{module.label}</span>)}</div></section>
        <section className="summary-block"><p className="eyebrow">Reglas</p><h3>{configuredRuleCount} valores configurados</h3><p>Los campos vacíos quedan sin regla. Todos los valores podrán tener vigencia y excepciones cuando exista persistencia.</p></section>
        <section className="summary-block"><p className="eyebrow">Fiscal</p><h3>{arcaEnabled ? "ARCA preparado" : "Sin integración ARCA"}</h3><p>{arcaEnabled ? "El módulo está seleccionado, pero permanece sin credenciales y fuera de producción hasta completar homologación." : "Los cobros usarán comprobantes internos, separados de una factura fiscal."}</p></section>
      </div>
      <div className="handoff-note"><strong>Sin efectos externos</strong><span>No se envió ninguna invitación ni se conectaron Supabase, Vercel, DNS o ARCA.</span></div>
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
