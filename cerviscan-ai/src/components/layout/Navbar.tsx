import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  EyeOff, 
  Bell, 
  Building2, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Microscope,
  ShieldCheck,
  X
} from 'lucide-react';
import { Patient } from '../../types/patient';
import { maskName, maskIC } from '../../lib/utils';

interface NavbarProps {
  privacyMode: boolean;
  onTogglePrivacyMode: () => void;
  selectedHospital: string;
  onSelectHospital: (hospital: string) => void;
  hospitals: string[];
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onNavigateToScan: (patientId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  privacyMode,
  onTogglePrivacyMode,
  selectedHospital,
  onSelectHospital,
  hospitals,
  patients,
  onSelectPatient,
  onNavigateToScan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHospitalMenuOpen, setIsHospitalMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const hospitalRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (hospitalRef.current && !hospitalRef.current.contains(event.target as Node)) {
        setIsHospitalMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter patients for global quick-search
  const filteredSearchResults = searchQuery.trim()
    ? patients.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.icNumber.replace(/-/g, '').includes(searchQuery.replace(/-/g, ''))
      ).slice(0, 5)
    : [];

  const pendingCount = patients.filter((p) => p.status === 'Pending Validation' || p.overallRisk === 'HIGH_RISK').length;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900 px-4 sm:px-6 text-white shadow-md">
      {/* Left Section: Branding & Hospital Switcher */}
      <div className="flex items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-inner">
            <Microscope className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">Cerviscan</span>
              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[11px] font-semibold tracking-wide text-cyan-400 border border-cyan-500/30">
                AI CLINICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">National Cervical Screening & Validation Workstation</p>
          </div>
        </div>

        {/* Hospital Switcher */}
        <div className="relative hidden md:block" ref={hospitalRef}>
          <button
            type="button"
            onClick={() => setIsHospitalMenuOpen(!isHospitalMenuOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition"
          >
            <Building2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span className="max-w-[190px] truncate">{selectedHospital}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isHospitalMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-72 rounded-lg border border-slate-700 bg-slate-900 p-1.5 shadow-xl z-50">
              <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1">
                Select Screening Facility
              </div>
              {hospitals.map((hosp) => (
                <button
                  key={hosp}
                  type="button"
                  onClick={() => {
                    onSelectHospital(hosp);
                    setIsHospitalMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition ${
                    selectedHospital === hosp
                      ? 'bg-cyan-500/10 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{hosp}</span>
                  {selectedHospital === hosp && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search Input */}
      <div className="relative flex-1 max-w-md mx-4" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search patient by Name, ID, or IC (e.g. 880315)..."
            className="w-full rounded-lg border border-slate-700 bg-slate-800/90 pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Instant Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 mt-1.5 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50 max-h-80 overflow-y-auto">
            {filteredSearchResults.length > 0 ? (
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Matching Clinical Records ({filteredSearchResults.length})
                </div>
                {filteredSearchResults.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => {
                      onSelectPatient(patient.id);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-slate-800 cursor-pointer transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">
                          {maskName(patient.fullName, privacyMode)}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50">
                          {patient.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>IC: {maskIC(patient.icNumber, privacyMode)}</span>
                        <span>•</span>
                        <span>Age: {patient.age}</span>
                        <span>•</span>
                        <span className="text-slate-300">{patient.assignedHospital}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          patient.overallRisk === 'HIGH_RISK'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : patient.overallRisk === 'MODERATE_RISK'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {patient.overallRisk.replace('_', ' ')}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToScan(patient.id);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="rounded bg-cyan-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-cyan-500 transition"
                      >
                        Scan Workspace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching patients found for "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Privacy Toggle, Notifications & Doctor Profile */}
      <div className="flex items-center gap-3">
        {/* Privacy Mode Toggle (PII Masking) */}
        <button
          type="button"
          onClick={onTogglePrivacyMode}
          title={privacyMode ? 'Privacy Mode Active (Patient names & ICs masked)' : 'Privacy Mode Disabled (Real patient data visible)'}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
            privacyMode
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {privacyMode ? (
            <>
              <EyeOff className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">PII Masked</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">PII Visible</span>
            </>
          )}
          <span className="rounded-full bg-slate-900/60 px-1.5 py-0.2 text-[9px] text-slate-300">
            {privacyMode ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Clinical Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <Bell className="h-4 w-4" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-1.5 w-80 rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-2xl z-50">
              <div className="flex items-center justify-between px-2.5 py-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Diagnostic Action Queue</span>
                </div>
                <span className="text-[10px] text-slate-400">{pendingCount} Actionable</span>
              </div>
              <div className="space-y-1 mt-1 max-h-64 overflow-y-auto">
                {patients
                  .filter((p) => p.overallRisk === 'HIGH_RISK')
                  .slice(0, 4)
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onNavigateToScan(p.id);
                        setIsNotificationsOpen(false);
                      }}
                      className="p-2 rounded hover:bg-slate-800 cursor-pointer transition text-left"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-rose-300">High Risk AI Flag</span>
                        <span className="text-[9px] text-slate-400">{p.lastScreeningDate}</span>
                      </div>
                      <p className="text-xs text-slate-200 mt-0.5">
                        {maskName(p.fullName, privacyMode)} ({p.id})
                      </p>
                      <p className="text-[10px] text-slate-400">Score: {p.aiConfidenceScore}% • {p.status}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctor Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-cyan-400 border border-slate-600">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold leading-none text-slate-200">Dr. Farah Hanim</div>
            <div className="text-[10px] text-cyan-400 mt-0.5 leading-none">Sp.OG (Gynae-Oncology)</div>
          </div>
        </div>
      </div>
    </header>
  );
};
