import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sliders,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileText,
  Printer,
  ChevronRight,
  ChevronDown,
  Info,
  Microscope,
  ShieldAlert,
  Calendar,
  Check,
  Building2,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  Flame,
  Split,
  ArrowRight
} from 'lucide-react';
import { Patient, AIScanResult, LesionZone, ValidationDecision } from '../../types/patient';
import { maskName, maskIC, getRiskBadgeClasses } from '../../lib/utils';
import { DiagnosticReportModal } from '../common/DiagnosticReportModal';

interface ScanViewerWorkspaceProps {
  patient: Patient;
  scan: AIScanResult;
  allPatients: Patient[];
  privacyMode: boolean;
  onSelectPatient: (patientId: string) => void;
  onBackToDirectory: () => void;
  onSaveValidation: (
    patientId: string,
    decision: ValidationDecision,
    notes: string,
    biopsyRecommended: boolean
  ) => void;
}

export const ScanViewerWorkspace: React.FC<ScanViewerWorkspaceProps> = ({
  patient,
  scan,
  allPatients,
  privacyMode,
  onSelectPatient,
  onBackToDirectory,
  onSaveValidation,
}) => {
  // Viewer View Modes
  const [viewMode, setViewMode] = useState<'overlay' | 'original' | 'heatmap_only' | 'split'>('overlay');
  const [filterMode, setFilterMode] = useState<'white_light' | 'green_filter' | 'lugol_iodine'>('white_light');
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(75);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(
    scan.lesionZones && scan.lesionZones[0] ? scan.lesionZones[0].id : null
  );

  // Specialist Validation Form State
  const [decision, setDecision] = useState<ValidationDecision>(
    scan.validationStatus !== 'PENDING' ? scan.validationStatus : 'CONFIRMED'
  );
  const [actionRecommendation, setActionRecommendation] = useState<string>(
    scan.recommendedAction || 'Direct Punch Biopsy'
  );
  const [doctorNotes, setDoctorNotes] = useState<string>(
    scan.doctorNotes || 'Corroborates high-risk cytology with dense acetowhite epithelium at 12 o\'clock SCJ. Direct punch biopsy indicated.'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState<boolean>(false);

  const riskBadge = getRiskBadgeClasses(patient.overallRisk);

  // Pan interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setPanStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanPosition({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 75));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setPanPosition({ x: 0, y: 0 });
  };

  // Submit clinical validation
  const handleSubmitValidation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSaveValidation(
        patient.id,
        decision,
        doctorNotes,
        actionRecommendation.includes('Biopsy') || actionRecommendation.includes('LEEP')
      );
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 450);
  };

  const activeZone = scan.lesionZones?.find((z) => z.id === selectedZoneId) || scan.lesionZones?.[0];

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] min-h-[700px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
      {/* Top Patient Context & Workstation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-slate-200 bg-slate-900 text-white select-none">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToDirectory}
            className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Patients Directory</span>
          </button>

          {/* Patient Quick Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
            >
              <span className="font-mono text-cyan-400 font-bold">{patient.id}</span>
              <span className="font-semibold text-white">{maskName(patient.fullName, privacyMode)}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isPatientDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-80 rounded-lg border border-slate-700 bg-slate-900 p-1.5 shadow-2xl z-50 max-h-72 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                  Switch Active Cervigram
                </div>
                {allPatients.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onSelectPatient(p.id);
                      setIsPatientDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded text-left text-xs transition ${
                      p.id === patient.id ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-white">{maskName(p.fullName, privacyMode)}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.id} • {p.overallRisk.replace('_', ' ')}</div>
                    </div>
                    {p.id === patient.id && <Check className="h-4 w-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-300 pl-2 border-l border-slate-800">
            <span>IC: <strong className="font-mono text-slate-100">{maskIC(patient.icNumber, privacyMode)}</strong></span>
            <span>•</span>
            <span>Age: <strong className="text-slate-100">{patient.age}</strong></span>
            <span>•</span>
            <span>Facility: <strong className="text-slate-100">{patient.assignedHospital}</strong></span>
          </div>
        </div>

        {/* Quick Diagnostic Actions */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${riskBadge.bg} ${riskBadge.text} border ${riskBadge.border}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${riskBadge.dot}`} />
            {patient.overallRisk.replace('_', ' ')} ({scan.confidenceScore}%)
          </span>

          <button
            type="button"
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition shadow-xs"
          >
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            <span>Generate Clinical PDF</span>
          </button>
        </div>
      </div>

      {/* Main Split-View Workspace (Left 25%, Center 55%, Right 20%) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ================= LEFT PANEL (25%): Clinical Background & Colposcopy Scoring ================= */}
        <div className="w-full lg:w-1/4 border-r border-slate-200 bg-slate-50/70 p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Clinical Background & History
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">EHR Sync: Live</span>
          </div>

          {/* Primary HPV DNA Genotyping Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">HPV DNA Genotype</span>
              <span className="text-[10px] font-mono text-slate-400">PCR Lab</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                {patient.hpvDnaResult}
              </span>
              <span className="text-[11px] text-slate-500">High Oncogenic Risk</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
              Primary HPV genotyping indicates persistent E6/E7 viral integration potential.
            </p>
          </div>

          {/* Colposcopic Swede Score Evaluation */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Swede Score Index</span>
              <span className="text-xs font-bold text-rose-600 font-mono">
                {scan.swedeScore} / 10 Points
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  scan.swedeScore >= 8
                    ? 'bg-rose-600'
                    : scan.swedeScore >= 5
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${(scan.swedeScore / 10) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Acetowhitening:</span>
                <span className="font-semibold text-slate-800">Dense / Opaque (+2)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Margins & Surface:</span>
                <span className="font-semibold text-slate-800">Sharp / Peeling (+2)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Vessels:</span>
                <span className="font-semibold text-slate-800">Coarse Punctation (+2)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Iodine Staining:</span>
                <span className="font-semibold text-slate-800">Mustard Yellow (+2)</span>
              </div>
            </div>
            <div className="bg-amber-50 p-2 rounded text-[11px] text-amber-800 border border-amber-200">
              <strong>Clinical Guide:</strong> Swede score &ge; 5 indicates high likelihood of CIN2+ (biopsy recommended). Score &ge; 8 justifies "see-and-treat" LEEP under MOH protocols.
            </div>
          </div>

          {/* Transformation Zone Classification */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-1.5 text-xs">
            <span className="font-bold text-slate-900 block">Transformation Zone (TZ)</span>
            <div className="font-semibold text-cyan-700 bg-cyan-50 px-2 py-1 rounded border border-cyan-200 inline-block">
              {scan.transformationZoneType}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Squamocolumnar Junction completely visible on ectocervical face. Acetic acid timing: {scan.aceticAcidTimingSeconds}s.
            </p>
          </div>

          {/* Historical Pap Smear Timeline */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Cytology & Pap Smears</span>
              <span className="text-[10px] text-slate-400">{patient.papSmearHistory?.length} Prior Visits</span>
            </div>
            <div className="space-y-2 text-xs">
              {patient.papSmearHistory?.map((p, idx) => (
                <div key={p.id} className="relative pl-3 border-l-2 border-cyan-400 text-xs">
                  <div className="font-semibold text-slate-800">{p.result}</div>
                  <div className="text-[11px] text-slate-500">{p.facility}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{p.date} • {p.cytotechnologist}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Symptoms & Parity */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-1 text-xs">
            <span className="font-bold text-slate-900">Clinical Synopsis</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {patient.clinicalNotesSummary}
            </p>
          </div>
        </div>

        {/* ================= CENTER CANVAS (55%): Interactive Medical Image Viewer ================= */}
        <div className="w-full lg:w-[55%] flex flex-col bg-slate-950 text-white relative select-none">
          {/* Viewer Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 z-20">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('original')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewMode === 'original' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Original Cervigram
              </button>
              <button
                type="button"
                onClick={() => setViewMode('overlay')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  viewMode === 'overlay' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                AI Heatmap Overlay
              </button>
              <button
                type="button"
                onClick={() => setViewMode('heatmap_only')}
                className={`px-2.5 py-1 rounded-md transition ${
                  viewMode === 'heatmap_only' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Heatmap Only
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                  viewMode === 'split' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Split className="h-3 w-3" />
                Split
              </button>
            </div>

            {/* Filter Optical Mode */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Optical:</span>
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value as any)}
                className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:outline-none"
              >
                <option value="white_light">White Light (3% Acetic)</option>
                <option value="green_filter">Green Filter (Vascular)</option>
                <option value="lugol_iodine">Lugol's Iodine (Schiller)</option>
              </select>
            </div>

            {/* Opacity Slider for Overlay Mode */}
            {viewMode === 'overlay' && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[11px] text-slate-400">Opacity:</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={heatmapOpacity}
                  onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                  className="w-20 accent-cyan-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <span className="font-mono text-[10px] w-6">{heatmapOpacity}%</span>
              </div>
            )}

            {/* Zoom & Pan Controls */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-cyan-400">{zoomLevel}%</span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-700"
                title="Reset View"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Medical Cervigram SVG Canvas */}
          <div
            className="flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-slate-950"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="relative transition-transform duration-75 origin-center"
              style={{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel / 100})`,
                width: '540px',
                height: '540px',
              }}
            >
              {/* Colposcopy Cervical Anatomy Canvas SVG */}
              <svg
                viewBox="0 0 540 540"
                className="w-full h-full rounded-2xl shadow-2xl overflow-hidden border border-slate-800"
              >
                <defs>
                  {/* Radial Shading for Cervix Epithelium */}
                  <radialGradient id="cervixBase" cx="50%" cy="50%" r="50%" fx="48%" fy="48%">
                    <stop
                      offset="0%"
                      stopColor={
                        filterMode === 'green_filter'
                          ? '#2a4436'
                          : filterMode === 'lugol_iodine'
                          ? '#451a03'
                          : '#e17076'
                      }
                    />
                    <stop
                      offset="50%"
                      stopColor={
                        filterMode === 'green_filter'
                          ? '#192e22'
                          : filterMode === 'lugol_iodine'
                          ? '#351402'
                          : '#c74d56'
                      }
                    />
                    <stop
                      offset="85%"
                      stopColor={
                        filterMode === 'green_filter'
                          ? '#0e1f16'
                          : filterMode === 'lugol_iodine'
                          ? '#220b00'
                          : '#9f2d36'
                      }
                    />
                    <stop offset="100%" stopColor="#1e080b" />
                  </radialGradient>

                  {/* External Cervical Os (Cervical Canal) */}
                  <radialGradient id="cervicalOs" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#2c050a" />
                    <stop offset="70%" stopColor="#4c0e15" />
                    <stop offset="100%" stopColor="#7a1e27" />
                  </radialGradient>

                  {/* Acetowhite Lesion High-Grade Plaque */}
                  <radialGradient id="acetowhiteDense" cx="45%" cy="40%" r="60%">
                    <stop
                      offset="0%"
                      stopColor={
                        filterMode === 'lugol_iodine'
                          ? '#eab308' // Mustard yellow for iodine-negative non-staining dysplastic zone!
                          : '#fefefe'
                      }
                      stopOpacity="0.95"
                    />
                    <stop
                      offset="60%"
                      stopColor={
                        filterMode === 'lugol_iodine'
                          ? '#ca8a04'
                          : '#f1f5f9'
                      }
                      stopOpacity="0.88"
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        filterMode === 'lugol_iodine'
                          ? '#854d0e'
                          : '#cbd5e1'
                      }
                      stopOpacity="0.3"
                    />
                  </radialGradient>

                  {/* Heatmap Multi-stop Gradient */}
                  <radialGradient id="aiHeatmapGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.92" />
                    <stop offset="35%" stopColor="#f97316" stopOpacity="0.80" />
                    <stop offset="65%" stopColor="#eab308" stopOpacity="0.55" />
                    <stop offset="85%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </radialGradient>

                  {/* Vascular Punctation Pattern */}
                  <pattern id="punctationPattern" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle
                      cx="6"
                      cy="6"
                      r="1.2"
                      fill={filterMode === 'green_filter' ? '#000000' : '#881337'}
                    />
                  </pattern>

                  {/* Vascular Mosaicism Pattern */}
                  <pattern id="mosaicPattern" width="18" height="18" patternUnits="userSpaceOnUse">
                    <path
                      d="M 0 0 L 18 0 L 18 18 L 0 18 Z"
                      fill="none"
                      stroke={filterMode === 'green_filter' ? '#000000' : '#991b1b'}
                      strokeWidth="0.8"
                      strokeDasharray="2,2"
                    />
                  </pattern>
                </defs>

                {/* Vaginal Wall & Speculum Ring Rim */}
                <rect width="540" height="540" fill="#090d16" />
                <circle cx="270" cy="270" r="255" fill="#1e1014" stroke="#334155" strokeWidth="3" />
                <circle cx="270" cy="270" r="235" fill="url(#cervixBase)" />

                {/* Cervical Os (Center Endocervical Orifice) */}
                <ellipse cx="270" cy="270" rx="36" ry="24" fill="url(#cervicalOs)" stroke="#581c24" strokeWidth="2" />
                <ellipse cx="270" cy="270" rx="20" ry="10" fill="#140204" />

                {/* Squamocolumnar Junction (SCJ) & Transformation Zone Ring */}
                <circle
                  cx="270"
                  cy="270"
                  r="95"
                  fill="none"
                  stroke={filterMode === 'green_filter' ? '#4ade80' : '#fda4af'}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />

                {/* Dense Acetowhite Lesion 1 (11 to 1 o'clock) */}
                {(viewMode !== 'heatmap_only') && (
                  <g>
                    <path
                      d="M 230 190 C 250 140, 310 145, 335 185 C 345 220, 315 245, 275 240 C 235 235, 215 220, 230 190 Z"
                      fill="url(#acetowhiteDense)"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      strokeOpacity="0.7"
                    />
                    {/* Vascular coarse punctation inside Zone 1 */}
                    <path
                      d="M 245 180 C 260 155, 300 160, 320 190 C 310 220, 280 230, 255 210 Z"
                      fill="url(#punctationPattern)"
                      opacity="0.85"
                    />
                  </g>
                )}

                {/* Dense Acetowhite Lesion 2 (2 o'clock SCJ) */}
                {(viewMode !== 'heatmap_only') && (
                  <g>
                    <path
                      d="M 320 230 C 360 215, 385 250, 375 285 C 350 300, 320 280, 315 255 Z"
                      fill="url(#acetowhiteDense)"
                      stroke="#ffffff"
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                    {/* Mosaicism inside Zone 2 */}
                    <path
                      d="M 325 235 C 355 225, 375 255, 365 280 C 345 290, 325 275, 320 255 Z"
                      fill="url(#mosaicPattern)"
                      opacity="0.7"
                    />
                  </g>
                )}

                {/* AI Thermal Heatmap Overlay Layer */}
                {(viewMode === 'overlay' || viewMode === 'heatmap_only') && (
                  <g opacity={viewMode === 'heatmap_only' ? 1 : heatmapOpacity / 100}>
                    {/* Zone 1 Heatmap Blob */}
                    <ellipse cx="282" cy="195" rx="85" ry="70" fill="url(#aiHeatmapGradient)" />
                    {/* Zone 2 Heatmap Blob */}
                    <ellipse cx="345" cy="260" rx="55" ry="50" fill="url(#aiHeatmapGradient)" />
                  </g>
                )}

                {/* Split Comparison Mode Vertical Divider */}
                {viewMode === 'split' && (
                  <g>
                    <line x1="270" y1="15" x2="270" y2="525" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="6 4" />
                    <rect x="270" y="35" width="235" height="470" fill="url(#aiHeatmapGradient)" opacity="0.65" clipPath="url(#splitClip)" />
                    <text x="160" y="45" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Original</text>
                    <text x="380" y="45" fill="#06b6d4" fontSize="11" fontWeight="bold" textAnchor="middle">AI Heatmap</text>
                  </g>
                )}

                {/* Detected Lesion Bounding Boxes & Pointers */}
                {scan.lesionZones?.map((lz) => {
                  const isSelected = selectedZoneId === lz.id;
                  // Map percentage coordinates (0-100) to SVG viewbox (540x540)
                  const boxX = (lz.x / 100) * 540 - 20;
                  const boxY = (lz.y / 100) * 540 - 20;
                  const boxW = (lz.width / 100) * 540 + 40;
                  const boxH = (lz.height / 100) * 540 + 40;

                  return (
                    <g
                      key={lz.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZoneId(lz.id);
                      }}
                      className="cursor-pointer"
                    >
                      {/* Bounding Rectangle */}
                      <rect
                        x={boxX}
                        y={boxY}
                        width={boxW}
                        height={boxH}
                        rx="8"
                        fill={isSelected ? 'rgba(6, 182, 212, 0.15)' : 'none'}
                        stroke={isSelected ? '#06b6d4' : '#ef4444'}
                        strokeWidth={isSelected ? '3' : '2'}
                        strokeDasharray={isSelected ? 'none' : '4 3'}
                        className="transition-all"
                      />

                      {/* Header Tag on Bounding Box */}
                      <rect
                        x={boxX}
                        y={boxY - 22}
                        width="140"
                        height="20"
                        rx="4"
                        fill={isSelected ? '#06b6d4' : '#0f172a'}
                        stroke={isSelected ? '#06b6d4' : '#ef4444'}
                        strokeWidth="1"
                      />
                      <text
                        x={boxX + 6}
                        y={boxY - 8}
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {lz.zoneCode} • {lz.confidence}%
                      </text>

                      {/* Pointer Crosshair Target */}
                      <circle
                        cx={boxX + boxW / 2}
                        cy={boxY + boxH / 2}
                        r="4"
                        fill={isSelected ? '#06b6d4' : '#ef4444'}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom Overlay Info Banner: Selected Zone Diagnostic Data */}
            {activeZone && (
              <div className="absolute bottom-3 left-4 right-4 z-20 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md p-3 text-xs shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{activeZone.zoneCode}</span>
                      <span className="rounded bg-rose-500/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                        {activeZone.severity}
                      </span>
                      <span className="font-mono text-cyan-400 font-bold">{activeZone.confidence}% AI Probability</span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 flex flex-wrap gap-2">
                      <span>Margin: <strong>{activeZone.marginType}</strong></span>
                      <span>•</span>
                      <span>Whitening: <strong>{activeZone.acetowhiteIntensity}</strong></span>
                      <span>•</span>
                      <span>Vessels: <strong>{activeZone.vessels}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className="text-[11px] font-semibold text-rose-300 bg-rose-950/60 px-2 py-1 rounded border border-rose-800">
                    Directed Biopsy Target
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT PANEL (20%): Diagnostic Decision & Specialist Validation Card ================= */}
        <div className="w-full lg:w-1/4 border-l border-slate-200 bg-white p-4 overflow-y-auto space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Specialist Validation
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Clinical Decision Sign-Off
            </h2>
          </div>

          {/* AI Confidence Radial Score Card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-xs text-center space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Automated Model Triage</span>
              <span className="font-mono font-bold text-slate-700">ResNet-Colpo v4.2</span>
            </div>

            {/* Radial Meter Visual */}
            <div className="relative flex items-center justify-center py-2">
              <svg className="h-28 w-28 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-200"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-rose-500 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * scan.confidenceScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {scan.confidenceScore}%
                </span>
                <span className="text-[10px] font-bold text-rose-600 uppercase mt-0.5">
                  High Risk
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-800 leading-snug">
              {scan.classification}
            </p>
          </div>

          {/* Clinical Sign-Off Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1.5">
                Specialist Validation Decision
              </label>
              <div className="space-y-1.5">
                {[
                  {
                    id: 'CONFIRMED' as ValidationDecision,
                    title: 'Confirm AI Finding (HSIL / CIN2+)',
                    desc: 'Corroborates high grade lesion; proceed with intervention.',
                    color: 'border-rose-300 bg-rose-50/50 text-rose-900',
                  },
                  {
                    id: 'OVERRIDDEN' as ValidationDecision,
                    title: 'Mark as False Positive / Benign',
                    desc: 'Benign squamous metaplasia or severe cervicitis.',
                    color: 'border-amber-300 bg-amber-50/50 text-amber-900',
                  },
                  {
                    id: 'REJECTED' as ValidationDecision,
                    title: 'Inconclusive / Reject Scan',
                    desc: 'Sub-optimal visibility or requires repeat imaging.',
                    color: 'border-slate-300 bg-slate-50 text-slate-800',
                  },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                      decision === opt.id
                        ? `${opt.color} ring-1 ring-cyan-500 font-medium`
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="clinicalDecision"
                      value={opt.id}
                      checked={decision === opt.id}
                      onChange={() => setDecision(opt.id)}
                      className="mt-0.5 accent-cyan-600"
                    />
                    <div>
                      <div className="text-xs font-semibold">{opt.title}</div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Recommended Clinical Action Dropdown */}
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Triage Action Plan
              </label>
              <select
                value={actionRecommendation}
                onChange={(e) => setActionRecommendation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs font-medium text-slate-800 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Direct Punch Biopsy">Direct Colposcopy Punch Biopsy (Zone 1 & 2)</option>
                <option value="LEEP / LLETZ">Immediate LEEP / LLETZ Excision (See-and-Treat)</option>
                <option value="Endocervical Curettage (ECC)">Endocervical Curettage (ECC)</option>
                <option value="Repeat Screening in 6 Months">Repeat Screening in 6 Months with HPV Triage</option>
                <option value="Routine 3-Year Recall">Routine 3-Year Recall (Discharge)</option>
              </select>
            </div>

            {/* Doctor Notes Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">
                Specialist Diagnostic Notes
              </label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Enter clinical observations, anatomical orientation, biopsy plan..."
                className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
              />
            </div>

            {/* Submit Validation CTA Button */}
            <button
              type="button"
              onClick={handleSubmitValidation}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-cyan-600 shadow-md transition disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4 text-cyan-400" />
              <span>{isSubmitting ? 'Recording Validation...' : 'Submit Clinical Validation'}</span>
            </button>

            {/* Success Toast */}
            {showSuccessToast && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-2.5 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Validation recorded by <strong>Dr. Farah Hanim</strong>. Audit trail updated!
                </span>
              </div>
            )}

            {/* Doctor Credentials Footer */}
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Gynaecologist: Dr. Farah Hanim</span>
              <span>MMC #41920</span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Report Modal */}
      <DiagnosticReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        patient={patient}
        scan={scan}
        privacyMode={privacyMode}
      />
    </div>
  );
};
