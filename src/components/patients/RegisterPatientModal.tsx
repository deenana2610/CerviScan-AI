import React, { useState } from 'react';
import { X, UserPlus, ShieldAlert, Building2, CheckCircle2 } from 'lucide-react';
import { Patient, RiskSeverity } from '../../types/patient';
import { INITIAL_HOSPITALS } from '../../lib/mock-data';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterPatient: (patientData: Omit<Patient, 'papSmearHistory'>) => Promise<void>;
  hospitals?: string[];
}

export const RegisterPatientModal: React.FC<RegisterPatientModalProps> = ({
  isOpen,
  onClose,
  onRegisterPatient,
  hospitals = INITIAL_HOSPITALS.filter(h => !h.includes('All Branches')),
}) => {
  const [fullName, setFullName] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [age, setAge] = useState<number>(35);
  const [assignedHospital, setAssignedHospital] = useState(hospitals[0] || 'Hospital Kuala Lumpur (HKL)');
  const [overallRisk, setOverallRisk] = useState<RiskSeverity>('PENDING');
  const [hpvDnaResult, setHpvDnaResult] = useState<'HPV 16+' | 'HPV 18+' | 'HPV 16/18 High Risk' | 'Other High Risk HPV' | 'Negative' | 'Sample Inconclusive'>('Negative');
  const [gravidaPara, setGravidaPara] = useState('G2P2');
  const [ethnicity, setEthnicity] = useState('Malay');
  const [phone, setPhone] = useState('+60 12-345 6789');
  const [email, setEmail] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !icNumber.trim()) {
      setErrorMsg('Patient full name and IC number are required.');
      return;
    }

    // Auto-generate patient ID: PAT-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `PAT-2026-${randomSuffix}`;

    const newPatientData: Omit<Patient, 'papSmearHistory'> = {
      id: newId,
      fullName: fullName.trim(),
      icNumber: icNumber.trim(),
      age: Number(age) || 30,
      assignedHospital,
      lastScreeningDate: new Date().toISOString().split('T')[0],
      overallRisk,
      aiConfidenceScore: overallRisk === 'HIGH_RISK' ? 92.5 : overallRisk === 'MODERATE_RISK' ? 78.0 : overallRisk === 'LOW_RISK' ? 97.0 : 65.0,
      status: overallRisk === 'HIGH_RISK' ? 'Requires Biopsy' : 'Pending Validation',
      hpvDnaResult,
      gravidaPara: gravidaPara.trim() || 'G1P0',
      ethnicity,
      phone: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      clinicalNotesSummary: clinicalNotes.trim() || 'Routine screening referral. New clinical entry registered.',
    };

    try {
      setIsSubmitting(true);
      await onRegisterPatient(newPatientData);
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to register patient.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Register New Cervical Screening Patient</h2>
              <p className="text-xs text-slate-400">National Cervical Screening Registry (PEKERTI / KKM EHR)</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Full Name (As per NRIC/Passport) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Siti Nurhaliza binti Tarudin"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                MyKad IC Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 910214-10-5820"
                value={icNumber}
                onChange={(e) => setIcNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Age
              </label>
              <input
                type="number"
                min="18"
                max="85"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Ethnicity
              </label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Malay">Malay</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Bumiputera Sabah/Sarawak">Bumiputera Sabah/Sarawak</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Parity / Gravida
              </label>
              <input
                type="text"
                placeholder="e.g. G2P2"
                value={gravidaPara}
                onChange={(e) => setGravidaPara(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Hospital / Facility
              </label>
              <select
                value={assignedHospital}
                onChange={(e) => setAssignedHospital(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
              >
                {hospitals.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Primary HPV DNA Result
              </label>
              <select
                value={hpvDnaResult}
                onChange={(e) => setHpvDnaResult(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
              >
                <option value="HPV 16+">HPV 16+ (High Risk)</option>
                <option value="HPV 18+">HPV 18+ (High Risk)</option>
                <option value="HPV 16/18 High Risk">HPV 16/18 High Risk</option>
                <option value="Other High Risk HPV">Other High Risk HPV</option>
                <option value="Negative">Negative</option>
                <option value="Sample Inconclusive">Sample Inconclusive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Initial Risk Triage Level
              </label>
              <select
                value={overallRisk}
                onChange={(e) => setOverallRisk(e.target.value as RiskSeverity)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-cyan-500 focus:outline-none"
              >
                <option value="PENDING">PENDING (Awaiting Colposcopy)</option>
                <option value="HIGH_RISK">HIGH_RISK (HSIL / CIN2+ Suspicion)</option>
                <option value="MODERATE_RISK">MODERATE_RISK (LSIL / CIN1)</option>
                <option value="LOW_RISK">LOW_RISK (Normal / NILM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Clinical Notes & Symptoms Summary
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Referred from LPPKN screening. Post-coital spotting, visual inspection scheduled."
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isSubmitting ? 'Registering...' : 'Save & Register Patient'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
