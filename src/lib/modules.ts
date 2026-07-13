export type ModuleCategory = "operacion" | "administracion" | "servicios" | "fiscal";

export type ModuleKey =
  | "students"
  | "teachers"
  | "rooms"
  | "classes"
  | "schedule"
  | "workshops"
  | "formations"
  | "attendance"
  | "payments"
  | "fees"
  | "cash"
  | "scholarships"
  | "teacherSettlements"
  | "additionalSales"
  | "reports"
  | "studentPortal"
  | "billingCore"
  | "fiscalData"
  | "arca";

export interface ProductModule {
  key: ModuleKey;
  label: string;
  description: string;
  category: ModuleCategory;
  icon: string;
  requires: ModuleKey[];
  recommends?: ModuleKey[];
  internal?: boolean;
}

export const categoryLabels: Record<ModuleCategory, string> = {
  operacion: "Operación",
  administracion: "Administración",
  servicios: "Servicios al alumno",
  fiscal: "Fiscal",
};

export const modules: ProductModule[] = [
  { key: "students", label: "Alumnos", description: "Fichas, responsables e inscripciones", category: "operacion", icon: "AL", requires: [] },
  { key: "teachers", label: "Profesores", description: "Equipo docente y asignaciones", category: "operacion", icon: "PR", requires: [] },
  { key: "rooms", label: "Salas", description: "Espacios, capacidad y disponibilidad", category: "operacion", icon: "SA", requires: [] },
  { key: "classes", label: "Clases", description: "Actividades, niveles y grupos", category: "operacion", icon: "CL", requires: ["students", "teachers", "rooms"] },
  { key: "schedule", label: "Grilla horaria", description: "Cronograma semanal sin superposiciones", category: "operacion", icon: "GH", requires: ["classes", "rooms", "teachers"] },
  { key: "workshops", label: "Talleres", description: "Talleres internos, obligatorios o abiertos", category: "operacion", icon: "TA", requires: ["students", "teachers"] },
  { key: "formations", label: "Formaciones", description: "Carreras, años y trayectos obligatorios", category: "operacion", icon: "FO", requires: ["students", "classes", "workshops"], recommends: ["attendance", "scholarships"] },
  { key: "attendance", label: "Asistencias", description: "Registro rápido desde recepción o tablet", category: "operacion", icon: "AS", requires: ["students", "classes"] },
  { key: "payments", label: "Pagos", description: "Cobros parciales, confirmaciones y reversas", category: "administracion", icon: "PA", requires: [], internal: true },
  { key: "fees", label: "Cuotas", description: "Vencimientos, descuentos y recargos variables", category: "administracion", icon: "CU", requires: ["students", "payments"], recommends: ["cash", "studentPortal"] },
  { key: "cash", label: "Caja diaria", description: "Apertura, movimientos y cierre", category: "administracion", icon: "CA", requires: ["payments"], recommends: ["reports"] },
  { key: "scholarships", label: "Becas", description: "Porcentaje, cupo, alcance y vigencia", category: "administracion", icon: "BE", requires: ["students", "fees"] },
  { key: "teacherSettlements", label: "Liquidación de profesores", description: "Por alumno, hora, clase o recaudación", category: "administracion", icon: "LP", requires: ["teachers", "classes", "payments"], recommends: ["reports"] },
  { key: "additionalSales", label: "Ventas adicionales", description: "Productos, pedidos, comisiones y rendiciones", category: "administracion", icon: "VA", requires: ["payments"], recommends: ["cash"] },
  { key: "reports", label: "Reportes", description: "Deuda, asistencia, caja y liquidaciones", category: "administracion", icon: "RE", requires: [] },
  { key: "studentPortal", label: "Portal del alumno", description: "Cuenta, pagos, clases y calendario", category: "servicios", icon: "PO", requires: ["students"], recommends: ["fees", "attendance"] },
  { key: "billingCore", label: "Facturación", description: "Borradores y comprobantes fiscales", category: "fiscal", icon: "FA", requires: ["payments"], internal: true },
  { key: "fiscalData", label: "Datos fiscales", description: "Emisor, receptores y puntos de venta", category: "fiscal", icon: "DF", requires: [], internal: true },
  { key: "arca", label: "Facturación electrónica ARCA", description: "WSFE, CAE y auditoría fiscal", category: "fiscal", icon: "AR", requires: ["billingCore", "fiscalData", "payments"], recommends: ["fees", "additionalSales"] },
];

export const moduleMap = new Map(modules.map((module) => [module.key, module]));

export function resolveRequiredModules(selected: Iterable<ModuleKey>): Set<ModuleKey> {
  const resolved = new Set(selected);
  const pending = [...resolved];

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;

    for (const dependency of moduleMap.get(current)?.requires ?? []) {
      if (!resolved.has(dependency)) {
        resolved.add(dependency);
        pending.push(dependency);
      }
    }
  }

  return resolved;
}

export function getActiveDependents(key: ModuleKey, selected: Set<ModuleKey>): ProductModule[] {
  return modules.filter((module) => selected.has(module.key) && module.requires.includes(key));
}

export const starterSelection: ModuleKey[] = [
  "students",
  "teachers",
  "rooms",
  "classes",
  "schedule",
  "attendance",
  "fees",
  "cash",
  "reports",
  "studentPortal",
];
