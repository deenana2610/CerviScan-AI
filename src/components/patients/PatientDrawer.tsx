import React from 'react';
import { 
  X, 
  Microscope, 
  Calendar, 
  FileText, 
  Activity, 
  Building2, 
  Phone, 
  Mail, 
  ExternalLink, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Patient, AIScanResult } from '../../types/patient';
import { maskName, maskIC, getRiskBadgeClasses, getStatusBadgeClasses } from '../../lib/utils';

interface PatientDrawerProps {
  patient: Patient | null;
  scan?: AIScanResult;
  privacyMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenScanWorkspace: (patientId: string) => void;
}

export const PatientDrawer: React.FC<PatientDrawerProps> = ({
  patient,
  scan,
  privacyMode,
  isOpen,
  onClose,
  onOpenScanWorkspace,
}) => {
  if (!isOpen || !patient) return null;

  const riskBadge = getRiskBadgeClasses(patient.overallRisk);
  const statusBadge = getStatusBadgeClasses(patient.status);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  {patient.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  IC: {maskIC(patient.icNumber, privacyMode)}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {maskName(patient.fullName, privacyMode)}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span>Age: {patient.age}</span>
                <span>•</span>
                <span>Gravida/Para: {patient.gravidaPara}</span>
                <span>•</span>
                <span>{patient.ethnicity}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Primary Action Button */}
            <div className="rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-teal-50/40 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-cyan-900">Digital Colposcopy Available</div>
                  <div className="text-[11px] text-cyan-700 mt-0.5">
                    AI Scan completed on {patient.lastScreeningDate}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenScanWorkspace(patient.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-sm transition shrink-0"
                >
                  <Microscope className="h-4 w-4" />
                  <span>Open AI Scan Workspace</span>
                </button>
              </div>
            </div>

            {/* AI Risk & Diagnostic Card */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">AI Risk Assessment</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskBadge.bg} ${riskBadge.text} border ${riskBadge.border}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${riskBadge.dot}`} />
                  {riskBadge.label}
                </span>
              </div>

              {/* Confidence Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">AI Diagnostic Confidence</span>
                  <span className="font-bold text-slate-900">{patient.aiConfidenceScore}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      patient.overallRisk === 'HIGH_RISK'
                        ? 'bg-red-500'
                        : patient.overallRisk === 'MODERATE_RISK'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${patient.aiConfidenceScore}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary HPV DNA</span>
                  <span className="font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 inline-block mt-0.5">
                    {patient.hpvDnaResult}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Validation State</span>
                  <span className={`font-semibold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Hospital & Facility */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span>Screening Facility</span>
              </div>
              <div className="text-xs text-slate-700 font-medium">
                {patient.assignedHospital}
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" />
                  {privacyMode ? '+60 1*-*** ****' : patient.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-slate-400" />
                  {privacyMode ? 'p****@***.com' : patient.email}
                </span>
              </div>
            </div>

            {/* Clinical Synopsis & Symptoms */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs space-y-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-400" />
                <span>Clinical Notes & Presentation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {patient.clinicalNotesSummary || 'No acute symptoms reported. Routine surveillance under national program.'}
              </p>
            </div>

            {/* Historical Pap Smears / Screening Records */}
            <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Cytology & Pap Smear History</span>
                </div>
                <span className="text-[11px] text-slate-400">{patient.papSmearHistory?.length || 0} Records</span>
              </div>

              <div className="space-y-2">
                {patient.papSmearHistory && patient.papSmearHistory.length > 0 ? (
                  patient.papSmearHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 text-xs flex items-start justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{item.result}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.facility}</div>
                        <div className="text-[10px] text-slate-400">By: {item.cytotechnologist}</div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{item.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 py-2 text-center">No previous Pap records found.</div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Close Drawer
            </button>
            <button
              type="button"
              onClick={() => onOpenScanWorkspace(patient.id)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-600 transition"
            >
              <span>Launch Scan Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
