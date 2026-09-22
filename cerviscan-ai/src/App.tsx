import React, { useState, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { PatientTable } from './components/patients/PatientTable';
import { ScanViewerWorkspace } from './components/viewer/ScanViewerWorkspace';
import { ClinicalAnalyticsView } from './components/analytics/ClinicalAnalyticsView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { SettingsView } from './components/settings/SettingsView';
import { 
  INITIAL_PATIENTS, 
  INITIAL_SCANS, 
  INITIAL_HOSPITALS, 
  INITIAL_AUDIT_LOGS 
} from './lib/mock-data';
import { Patient, AIScanResult, AuditLogEntry, ValidationDecision } from './types/patient';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Global Context State
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [selectedHospital, setSelectedHospital] = useState<string>(INITIAL_HOSPITALS[0]);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [scans, setScans] = useState<Record<string, AIScanResult>>(INITIAL_SCANS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Active Selected Patient for Viewer
  const [activePatientId, setActivePatientId] = useState<string>('PAT-2026-8841');

  const activePatient = useMemo(() => {
    return patients.find((p) => p.id === activePatientId) || patients[0];
  }, [patients, activePatientId]);

  const activeScan = useMemo(() => {
    if (scans[activePatientId]) {
      return scans[activePatientId];
    }
    // Fallback dynamic scan if not explicitly configured in initial mock
    return {
      scanId: `SCN-2026-${activePatient.id.slice(-4)}`,
      patientId: activePatient.id,
      scanDate: `${activePatient.lastScreeningDate} 10:00 MYT`,
      originalImageUrl: '/scans/cervigram.jpg',
      heatmapOverlayUrl: '/scans/heatmap.png',
      detectedLesionCount: activePatient.overallRisk === 'HIGH_RISK' ? 2 : activePatient.overallRisk === 'MODERATE_RISK' ? 1 : 0,
      classification:
        activePatient.overallRisk === 'HIGH_RISK'
          ? 'HSIL / CIN2+ Detected (High-Grade Suspicion)'
          : activePatient.overallRisk === 'MODERATE_RISK'
          ? 'LSIL / CIN1 (Low-Grade Changes)'
          : 'Negative for Intraepithelial Lesion',
      confidenceScore: activePatient.aiConfidenceScore,
      doctorNotes: activePatient.clinicalNotesSummary || '',
      validationStatus: activePatient.status === 'Reviewed' ? 'CONFIRMED' : 'PENDING',
      swedeScore: activePatient.overallRisk === 'HIGH_RISK' ? 8 : activePatient.overallRisk === 'MODERATE_RISK' ? 4 : 1,
      transformationZoneType: 'Type 1 (Fully Ectocervical)',
      aceticAcidTimingSeconds: 60,
      lugolsIodineStaining: activePatient.overallRisk === 'HIGH_RISK' ? 'Iodine Negative (Mustard Yellow)' : 'Uniform Dark Brown (Normal)',
      recommendedAction: activePatient.status === 'Requires Biopsy' ? 'Direct Punch Biopsy' : 'Repeat Screening in 6 Months',
      lesionZones: activePatient.overallRisk === 'HIGH_RISK' ? [
        {
          id: 'LZ-GEN-1',
          zoneCode: 'Zone 1 (12 o\'clock SCJ)',
          x: 48,
          y: 38,
          width: 24,
          height: 22,
          severity: 'HSIL / CIN2+',
          confidence: activePatient.aiConfidenceScore,
          acetowhiteIntensity: 'Dense / Opaque',
          marginType: 'Sharp / Peeling',
          vessels: 'Coarse Punctation',
          biopsyRecommended: true
        }
      ] : []
    } as AIScanResult;
  }, [scans, activePatientId, activePatient]);

  // Navigate directly to scan workstation
  const handleNavigateToScan = (patientId: string) => {
    setActivePatientId(patientId);
    setCurrentTab('scans');
  };

  // Toggle privacy mode & add to audit log
  const handleTogglePrivacyMode = () => {
    const nextVal = !privacyMode;
    setPrivacyMode(nextVal);

    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }) + ' MYT',
      doctorName: 'Dr. Farah Hanim, Sp.OG',
      patientId: 'SYSTEM',
      patientName: 'Global Registry View',
      action: 'PRIVACY_MODE_TOGGLED',
      details: nextVal
        ? 'PII de-identification mode enabled for clinical presentation safety.'
        : 'PII de-identification disabled; real patient names and ICs revealed.',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Save clinical validation decision from Scan Viewer
  const handleSaveValidation = (
    patientId: string,
    decision: ValidationDecision,
    notes: string,
    biopsyRecommended: boolean
  ) => {
    const targetPatient = patients.find((p) => p.id === patientId);
    const prevStatus = targetPatient?.status;
    const newStatus = biopsyRecommended ? 'Requires Biopsy' : 'Reviewed';

    // Update patient status in state
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: newStatus,
          };
        }
        return p;
      })
    );

    // Update scan state
    setScans((prev) => ({
      ...prev,
      [patientId]: {
        ...(prev[patientId] || activeScan),
        validationStatus: decision,
        doctorNotes: notes,
        validatedByDoctor: 'Dr. Farah Hanim, Sp.OG (Gynae-Oncologist)',
        validatedAt: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }) + ' MYT',
      },
    }));

    // Record audit trail
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }) + ' MYT',
      doctorName: 'Dr. Farah Hanim, Sp.OG',
      patientId,
      patientName: targetPatient?.fullName || 'Patient',
      action: biopsyRecommended ? 'BIOPSY_ORDERED' : decision === 'OVERRIDDEN' ? 'DIAGNOSIS_OVERRIDDEN' : 'VALIDATION_CONFIRMED',
      details: `Specialist sign-off completed: ${decision}. Action plan: ${biopsyRecommended ? 'Directed punch biopsy' : 'Clinical monitoring'}. Notes: "${notes.slice(0, 75)}..."`,
      previousStatus: prevStatus,
      newStatus: newStatus,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const pendingReviewCount = patients.filter((p) => p.status === 'Pending Validation').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 antialiased font-sans">
      {/* Collapsible Clinical Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        pendingReviewCount={pendingReviewCount}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          privacyMode={privacyMode}
          onTogglePrivacyMode={handleTogglePrivacyMode}
          selectedHospital={selectedHospital}
          onSelectHospital={setSelectedHospital}
          hospitals={INITIAL_HOSPITALS}
          patients={patients}
          onSelectPatient={(pid) => {
            setActivePatientId(pid);
            setCurrentTab('patients');
          }}
          onNavigateToScan={handleNavigateToScan}
        />

        {/* Dynamic Route View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">
            {currentTab === 'overview' && (
              <OverviewDashboard
                patients={patients}
                privacyMode={privacyMode}
                onNavigateToScan={handleNavigateToScan}
                onNavigateToPatients={() => setCurrentTab('patients')}
              />
            )}

            {currentTab === 'patients' && (
              <PatientTable
                patients={patients}
                privacyMode={privacyMode}
                onNavigateToScan={handleNavigateToScan}
                selectedHospital={selectedHospital}
              />
            )}

            {currentTab === 'scans' && (
              <ScanViewerWorkspace
                patient={activePatient}
                scan={activeScan}
                allPatients={patients}
                privacyMode={privacyMode}
                onSelectPatient={(pid) => setActivePatientId(pid)}
                onBackToDirectory={() => setCurrentTab('patients')}
                onSaveValidation={handleSaveValidation}
              />
            )}

            {currentTab === 'analytics' && (
              <ClinicalAnalyticsView />
            )}

            {currentTab === 'audit' && (
              <AuditTrailView logs={auditLogs} privacyMode={privacyMode} />
            )}

            {currentTab === 'settings' && (
              <SettingsView />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
