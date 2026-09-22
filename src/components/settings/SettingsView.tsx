import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Sliders,
  Bell,
  Building,
  CheckCircle2,
  Lock,
  Cpu,
  FileText,
  Save
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [sensitivityThreshold, setSensitivityThreshold] = useState<number>(85);
  const [swedeBiopsyCutoff, setSwedeBiopsyCutoff] = useState<number>(5);
  const [autoMaskPII, setAutoMaskPII] = useState<boolean>(true);
  const [urgentAlertSMS, setUrgentAlertSMS] = useState<boolean>(true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Clinical Protocols & Screening Thresholds
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated risk stratification parameters conforming to Ministry of Health (MOH) Malaysia cervical screening guidelines.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-cyan-500 shadow-xs transition"
        >
          <Save className="h-4 w-4" />
          <span>Save Protocol Parameters</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-300 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Clinical protocol parameters successfully saved and synchronized across all hospital endpoints.</span>
        </div>
      )}

      {/* Setting Sections */}
      <div className="space-y-4">
        {/* Section 1: AI Model Sensitivity Tuning */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Cpu className="h-4.5 w-4.5 text-cyan-600" />
            <span>AI Model Triage Sensitivity Threshold</span>
          </div>
          <p className="text-xs text-slate-500">
            Controls the cutoff probability at which automated colposcopy flags a patient as "High Risk / HSIL+". Higher sensitivity minimizes false negatives in high-risk HPV positive cohorts.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Sensitivity Threshold</span>
              <span className="font-mono font-bold text-cyan-600 text-sm">{sensitivityThreshold}%</span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={sensitivityThreshold}
              onChange={(e) => setSensitivityThreshold(Number(e.target.value))}
              className="w-full accent-cyan-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>70% (Higher Specificity)</span>
              <span>85% (MOH Standard Recommended)</span>
              <span>95% (Maximum Sensitivity)</span>
            </div>
          </div>
        </div>

        {/* Section 2: Swede Score Biopsy Recommendation */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Sliders className="h-4.5 w-4.5 text-cyan-600" />
            <span>Swede Score Colposcopy Biopsy Trigger</span>
          </div>
          <p className="text-xs text-slate-500">
            Colposcopy Swede score (0-10) cutoff for automated recommendation of punch biopsy or LEEP excision.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[4, 5, 6].map((score) => (
              <label
                key={score}
                className={`p-3 rounded-lg border cursor-pointer transition text-xs ${
                  swedeBiopsyCutoff === score
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-950 font-semibold ring-1 ring-cyan-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="swedeScore"
                  checked={swedeBiopsyCutoff === score}
                  onChange={() => setSwedeBiopsyCutoff(score)}
                  className="sr-only"
                />
                <div className="font-bold">Swede Score &ge; {score}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {score === 5 ? 'Recommended (95% CIN2+ capture)' : score === 4 ? 'Conservative triage' : 'Aggressive specificity'}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Data Privacy & HIPAA/PDPA */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Lock className="h-4.5 w-4.5 text-cyan-600" />
            <span>Patient Privacy & Presentation Safety (PDPA 2010)</span>
          </div>
          <p className="text-xs text-slate-500">
            Manage automatic PII masking defaults during multidisciplinary tumour board conferences and clinical demonstrations.
          </p>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-semibold text-slate-800">Auto-enable Privacy Mode on Public Screens</div>
              <div className="text-[11px] text-slate-500">Masks patient full name and MyKad numbers by default on external displays.</div>
            </div>
            <input
              type="checkbox"
              checked={autoMaskPII}
              onChange={(e) => setAutoMaskPII(e.target.checked)}
              className="h-4 w-4 rounded accent-cyan-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
