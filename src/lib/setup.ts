export interface EconomicRules {
  dueDay: string;
  firstLateDays: string;
  firstLatePercent: string;
  secondLateDays: string;
  secondLatePercent: string;
  transferSurchargePercent: string;
  externalWorkshopPercent: string;
  familyDiscountPercent: string;
  formationDiscountPercent: string;
  teacherStudentDiscountPercent: string;
  teacherSettlementMode: "per_student_percent" | "per_student_fixed" | "per_hour" | "per_class" | "monthly";
  teacherSettlementValue: string;
}

export const emptyEconomicRules: EconomicRules = {
  dueDay: "",
  firstLateDays: "",
  firstLatePercent: "",
  secondLateDays: "",
  secondLatePercent: "",
  transferSurchargePercent: "",
  externalWorkshopPercent: "",
  familyDiscountPercent: "",
  formationDiscountPercent: "",
  teacherStudentDiscountPercent: "",
  teacherSettlementMode: "per_student_percent",
  teacherSettlementValue: "",
};

export const settlementModeLabels: Record<EconomicRules["teacherSettlementMode"], string> = {
  per_student_percent: "Porcentaje por alumno",
  per_student_fixed: "Importe fijo por alumno",
  per_hour: "Importe por hora",
  per_class: "Importe por clase",
  monthly: "Importe fijo mensual",
};

export function parseOptionalNumber(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
