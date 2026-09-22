export type RiskSeverity = 'HIGH_RISK' | 'MODERATE_RISK' | 'LOW_RISK' | 'PENDING';

export type ClinicalStatus = 'Reviewed' | 'Pending Validation' | 'Requires Biopsy';

export type ValidationDecision = 'CONFIRMED' | 'OVERRIDDEN' | 'REJECTED' | 'PENDING';

export interface PapSmearHistoryItem {
  id: string;
  date: string;
  result: string; // e.g., "ASC-US", "NILM", "LSIL", "HSIL"
  facility: string;
  cytotechnologist: string;
}

export interface Patient {
  id: string; // E.g., PAT-2026-8841
  icNumber: string; // E.g., 880315-10-5432
  fullName: string;
  age: number;
  assignedHospital: string;
  lastScreeningDate: string;
  overallRisk: RiskSeverity;
  aiConfidenceScore: number; // 0 - 100%
  status: ClinicalStatus;
  
  // Clinical background details
  hpvDnaResult: 'HPV 16+' | 'HPV 18+' | 'HPV 16/18 High Risk' | 'Other High Risk HPV' | 'Negative' | 'Sample Inconclusive';
  gravidaPara: string; // e.g., "G2P2"
  ethnicity: string;
  phone: string;
  email: string;
  papSmearHistory: PapSmearHistoryItem[];
  clinicalNotesSummary?: string;
}

export interface LesionZone {
  id: string;
  zoneCode: string; // e.g., "Zone A (12-2 o'clock)"
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
  width: number;
  height: number;
  severity: 'HSIL / CIN2+' | 'LSIL / CIN1' | 'Atypical Squamous';
  confidence: number; // 0 - 100%
  acetowhiteIntensity: 'Dense / Opaque' | 'Faint / Translucent' | 'None';
  marginType: 'Sharp / Peeling' | 'Feathered / Diffuse' | 'Smooth';
  vessels: 'Coarse Punctation' | 'Fine Mosaic' | 'Normal / Absent';
  biopsyRecommended: boolean;
}

export interface AIScanResult {
  scanId: string;
  patientId: string;
  scanDate: string;
  originalImageUrl: string;
  heatmapOverlayUrl: string;
  detectedLesionCount: number;
  classification: string; // e.g., "HSIL / CIN2+", "LSIL", "Negative", "Atypical / ASC-H"
  confidenceScore: number;
  doctorNotes?: string;
  validatedByDoctor?: string;
  validatedAt?: string;
  validationStatus: ValidationDecision;
  
  // Colposcopy clinical parameters
  swedeScore: number; // 0 to 10
  transformationZoneType: 'Type 1 (Fully Ectocervical)' | 'Type 2 (Endocervical component visible)' | 'Type 3 (Endocervical component not visible)';
  aceticAcidTimingSeconds: number;
  lugolsIodineStaining: 'Iodine Negative (Mustard Yellow)' | 'Partial Uptake' | 'Uniform Dark Brown (Normal)';
  lesionZones: LesionZone[];
  recommendedAction: 'Direct Punch Biopsy' | 'LEEP / LLETZ' | 'Repeat Screening in 6 Months' | 'Routine 3-Year Recall';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  action: 'VALIDATION_CONFIRMED' | 'DIAGNOSIS_OVERRIDDEN' | 'BIOPSY_ORDERED' | 'REPORT_EXPORTED' | 'PRIVACY_MODE_TOGGLED';
  details: string;
  previousStatus?: string;
  newStatus?: string;
}
