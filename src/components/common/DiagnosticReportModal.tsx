import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2, Calendar, FileText } from 'lucide-react';
import { Patient, AIScanResult } from '../../types/patient';
import { maskName, maskIC, getRiskBadgeClasses } from '../../lib/utils';

interface DiagnosticReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  scan: AIScanResult;
  privacyMode: boolean;
}

export const DiagnosticReportModal: React.FC<DiagnosticReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  scan,
  privacyMode,
}) => {
  if (!isOpen) return null;

  const riskBadge = getRiskBadgeClasses(patient.overallRisk);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Actions Bar (Not printed) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-sm">Cerviscan Clinical Diagnostic Report Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 space-y-6 text-slate-900 bg-white" id="printable-report">
          {/* Official Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                Ministry of Health Malaysia • National Cervical Screening Registry
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-0.5">
                CERVISCAN AI CLINICAL REPORT
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Automated Colposcopy Risk Stratification & Histology Correlation Report
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs font-bold text-slate-900">REF: {scan.scanId}</div>
              <div className="text-xs text-slate-500 mt-0.5">Date: {scan.scanDate}</div>
              <div className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                MOH Approved Device v4.2
              </div>
            </div>
          </div>

          {/* Patient Demographic & Clinical Context Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{maskName(patient.fullName, privacyMode)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">MyKad IC Number</span>
              <span className="font-mono font-bold text-slate-800">{maskIC(patient.icNumber, privacyMode)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Age / Parity</span>
              <span className="font-bold text-slate-800">{patient.age} Yrs • {patient.gravidaPara}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Hospital Facility</span>
              <span className="font-semibold text-slate-800">{patient.assignedHospital}</span>
            </div>
          </div>

          {/* Screening Test Results Matrix */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">HPV DNA Genotyping</span>
              <span className="text-sm font-bold text-rose-700 mt-1 block">{patient.hpvDnaResult}</span>
              <span className="text-[10px] text-slate-500">Polymerase Chain Reaction (PCR)</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Swede Colposcopy Score</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-bold text-slate-900">{scan.swedeScore} / 10</span>
                <span className="text-[10px] font-semibold text-rose-600">High Swede Score</span>
              </div>
              <span className="text-[10px] text-slate-500">CIN2+ Threshold &gt; 5</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Overall AI Assessment</span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold ${riskBadge.bg} ${riskBadge.text} border ${riskBadge.border}`}>
                {patient.overallRisk.replace('_', ' ')} ({scan.confidenceScore}%)
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Automated Deep ResNet-Colpo</span>
            </div>
          </div>

          {/* AI Finding & Lesion Analysis */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-xs uppercase tracking-wide text-slate-900">
                Automated Colposcopic Classification
              </span>
              <span className="font-mono text-xs font-semibold text-slate-600">
                {scan.detectedLesionCount} Lesion Zones Identified
              </span>
            </div>
            <p className="text-xs font-medium text-slate-800 leading-relaxed">
              <strong>Primary Impression:</strong> {scan.classification}. AI inference identified dense acetowhite changes, sharp margins, and vascular punctation pattern at the squamocolumnar junction.
            </p>
            {scan.lesionZones && scan.lesionZones.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {scan.lesionZones.map((lz) => (
                  <div key={lz.id} className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="font-semibold text-slate-800">{lz.zoneCode}</span>
                    <span className="text-slate-600">Acetowhite: {lz.acetowhiteIntensity} • Vessel: {lz.vessels}</span>
                    <span className="font-bold text-rose-600 font-mono">{lz.confidence}% Confidence</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specialist Clinical Validation Section */}
          <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wide text-slate-900">
                Specialist Diagnostic Sign-Off & Action Plan
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                STATUS: {scan.validationStatus}
              </span>
            </div>

            <div className="text-xs text-slate-800 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-900">Specialist Clinical Notes:</div>
              <p className="text-slate-600 italic">
                "{scan.doctorNotes || 'Corroborates high-risk cytology. Directed punch biopsy recommended for squamocolumnar transformation zone.'}"
              </p>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Recommended Action: <strong>{scan.recommendedAction}</strong></span>
                <span>Transformation Zone: <strong>{scan.transformationZoneType}</strong></span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-4 flex items-end justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {scan.validatedByDoctor || 'Dr. Farah Hanim, Sp.OG'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Gynaecological Oncologist • MMC No. 41920
                </div>
                <div className="text-[10px] text-slate-400">
                  Signed on: {scan.validatedAt || '2026-09-22 08:30 MYT'} (Cryptographically Verified)
                </div>
              </div>
              <div className="text-right">
                <div className="border border-slate-300 rounded px-3 py-1.5 text-[10px] font-mono text-slate-500 bg-white inline-block">
                  CERVISCAN DIGITAL STAMP #MOH-MY-9941
                </div>
              </div>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="text-[9px] text-slate-400 text-center border-t border-slate-100 pt-3">
            CONFIDENTIAL MEDICAL RECORD • Intended solely for the clinical care team • Cerviscan AI decision-support system is certified under Medical Device Authority Malaysia (Act 737).
          </div>
        </div>
      </div>
    </div>
  );
};
