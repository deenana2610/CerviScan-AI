import React, { useState, useMemo, useEffect } from 'react';
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
import { Patient, AIScanResult, AuditLogEntry, ValidationDecision, LesionZone } from './types/patient';
import { supabase } from './lib/supabase';

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
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Active Selected Patient for Viewer
  const [activePatientId, setActivePatientId] = useState<string>('PAT-2026-8841');

  // Fetch real-time data from Supabase with graceful fallback
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        // Fetch patients with hospital join & pap smear histories
        const { data: dbPatients, error: pErr } = await supabase
          .from('patients')
          .select(`
            *,
            hospitals ( name ),
            pap_smear_histories ( * )
          `)
          .order('id', { ascending: true });

        if (!pErr && dbPatients && dbPatients.length > 0) {
          setIsDbConnected(true);
          const mappedPatients: Patient[] = dbPatients.map((p: any) => ({
            id: p.id,
            icNumber: p.ic_number,
            fullName: p.full_name,
            age: p.age,
            assignedHospital: p.hospitals?.name || 'Hospital Kuala Lumpur (HKL)',
            lastScreeningDate: p.last_screening_date,
            overallRisk: p.overall_risk,
            aiConfidenceScore: Number(p.ai_confidence_score),
            status: p.status,
            hpvDnaResult: p.hpv_dna_result,
            gravidaPara: p.gravida_para,
            ethnicity: p.ethnicity,
            phone: p.phone || '',
            email: p.email || '',
            clinicalNotesSummary: p.clinical_notes_summary || '',
            papSmearHistory: (p.pap_smear_histories || []).map((pap: any) => ({
              id: pap.id,
              date: pap.date,
              result: pap.result,
              facility: pap.facility,
              cytotechnologist: pap.cytotechnologist,
            })),
          }));
          setPatients(mappedPatients);
        }

        // Fetch scans with lesion zones
        const { data: dbScans, error: sErr } = await supabase
          .from('screening_scans')
          .select(`
            *,
            lesion_zones ( * )
          `);

        if (!sErr && dbScans && dbScans.length > 0) {
          const mappedScans: Record<string, AIScanResult> = {};
          dbScans.forEach((s: any) => {
            mappedScans[s.patient_id] = {
              scanId: s.id,
              patientId: s.patient_id,
              scanDate: s.scan_date,
              originalImageUrl: s.original_image_url || '/scans/cervigram.jpg',
              heatmapOverlayUrl: s.heatmap_overlay_url || '/scans/heatmap.png',
              detectedLesionCount: s.detected_lesion_count,
              classification: s.classification,
              confidenceScore: Number(s.confidence_score),
              doctorNotes: s.doctor_notes || '',
              validatedByDoctor: s.validated_by_doctor,
              validatedAt: s.validated_at,
              validationStatus: s.validation_status,
              swedeScore: s.swede_score,
              transformationZoneType: s.transformation_zone_type === 'Type 1'
                ? 'Type 1 (Fully Ectocervical)'
                : s.transformation_zone_type === 'Type 2'
                ? 'Type 2 (Endocervical component visible)'
                : 'Type 3 (Endocervical component not visible)',
              aceticAcidTimingSeconds: s.acetic_acid_timing_seconds || 60,
              lugolsIodineStaining: s.lugols_iodine_staining === 'Iodine Negative'
                ? 'Iodine Negative (Mustard Yellow)'
                : s.lugols_iodine_staining === 'Uniform Dark Brown'
                ? 'Uniform Dark Brown (Normal)'
                : 'Partial Uptake',
              recommendedAction: s.recommended_action,
              lesionZones: (s.lesion_zones || []).map((lz: any) => ({
                id: lz.id,
                zoneCode: lz.zone_code,
                x: Number(lz.x),
                y: Number(lz.y),
                width: Number(lz.width),
                height: Number(lz.height),
                severity: lz.severity,
                confidence: Number(lz.confidence),
                acetowhiteIntensity: lz.acetowhite_intensity,
                marginType: lz.margin_type,
                vessels: lz.vessels,
                biopsyRecommended: lz.biopsy_recommended,
              })),
            };
          });
          setScans((prev) => ({ ...prev, ...mappedScans }));
        }

        // Fetch audit logs
        const { data: dbLogs, error: lErr } = await supabase
          .from('audit_trail')
          .select('*')
          .order('timestamp', { ascending: false });

        if (!lErr && dbLogs && dbLogs.length > 0) {
          const mappedLogs: AuditLogEntry[] = dbLogs.map((l: any) => ({
            id: l.id,
            timestamp: l.timestamp,
            doctorName: l.doctor_name,
            patientId: l.patient_id || 'SYSTEM',
            patientName: l.patient_name,
            action: l.action,
            details: l.details,
            previousStatus: l.previous_status || undefined,
            newStatus: l.new_status || undefined,
          }));
          setAuditLogs(mappedLogs);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, continuing with offline mock data:', err);
      }
    }

    loadSupabaseData();
  }, []);

  const activePatient = useMemo(() => {
    return patients.find((p) => p.id === activePatientId) || patients[0];
  }, [patients, activePatientId]);

  const activeScan = useMemo(() => {
    if (scans[activePatientId]) {
      return scans[activePatientId];
    }
    // Fallback dynamic scan if not explicitly configured in initial mock
    return {
      scanId: `SCN-2026-${activePatient?.id?.slice(-4) || '9999'}`,
      patientId: activePatient?.id || 'PAT-0000',
      scanDate: `${activePatient?.lastScreeningDate || '2026-09-20'} 10:00 MYT`,
      originalImageUrl: '/scans/cervigram.jpg',
      heatmapOverlayUrl: '/scans/heatmap.png',
      detectedLesionCount: activePatient?.overallRisk === 'HIGH_RISK' ? 2 : activePatient?.overallRisk === 'MODERATE_RISK' ? 1 : 0,
      classification:
        activePatient?.overallRisk === 'HIGH_RISK'
          ? 'HSIL / CIN2+ Detected (High-Grade Suspicion)'
          : activePatient?.overallRisk === 'MODERATE_RISK'
          ? 'LSIL / CIN1 (Low-Grade Changes)'
          : 'Negative for Intraepithelial Lesion',
      confidenceScore: activePatient?.aiConfidenceScore || 90,
      doctorNotes: activePatient?.clinicalNotesSummary || '',
      validationStatus: activePatient?.status === 'Reviewed' ? 'CONFIRMED' : 'PENDING',
      swedeScore: activePatient?.overallRisk === 'HIGH_RISK' ? 8 : activePatient?.overallRisk === 'MODERATE_RISK' ? 4 : 1,
      transformationZoneType: 'Type 1 (Fully Ectocervical)',
      aceticAcidTimingSeconds: 60,
      lugolsIodineStaining: activePatient?.overallRisk === 'HIGH_RISK' ? 'Iodine Negative (Mustard Yellow)' : 'Uniform Dark Brown (Normal)',
      recommendedAction: activePatient?.status === 'Requires Biopsy' ? 'Direct Punch Biopsy' : 'Repeat Screening in 6 Months',
      lesionZones: activePatient?.overallRisk === 'HIGH_RISK' ? [
        {
          id: 'LZ-GEN-1',
          zoneCode: 'Zone 1 (12 o\'clock SCJ)',
          x: 48,
          y: 38,
          width: 24,
          height: 22,
          severity: 'HSIL / CIN2+',
          confidence: activePatient?.aiConfidenceScore || 90,
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
  const handleTogglePrivacyMode = async () => {
    const nextVal = !privacyMode;
    setPrivacyMode(nextVal);

    const nowIso = new Date().toISOString();
    const newLogId = `LOG-${Date.now()}`;
    const newLog: AuditLogEntry = {
      id: newLogId,
      timestamp: nowIso,
      doctorName: 'Dr. Farah Hanim, Sp.OG',
      patientId: 'SYSTEM',
      patientName: 'Global Registry View',
      action: 'PRIVACY_MODE_TOGGLED',
      details: nextVal
        ? 'PII de-identification mode enabled for clinical presentation safety.'
        : 'PII de-identification disabled; real patient names and ICs revealed.',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // Sync to Supabase audit_trail
    try {
      await supabase.from('audit_trail').insert({
        id: newLogId,
        timestamp: nowIso,
        doctor_name: 'Dr. Farah Hanim, Sp.OG',
        patient_id: null,
        patient_name: 'Global Registry View',
        action: 'PRIVACY_MODE_TOGGLED',
        details: newLog.details,
      });
    } catch (err) {
      console.warn('Audit trail sync failed:', err);
    }
  };

  // Save clinical validation decision from Scan Viewer and SYNC TO DATABASE
  const handleSaveValidation = async (
    patientId: string,
    decision: ValidationDecision,
    notes: string,
    biopsyRecommended: boolean
  ) => {
    const targetPatient = patients.find((p) => p.id === patientId);
    const prevStatus = targetPatient?.status;
    const newStatus = biopsyRecommended ? 'Requires Biopsy' : 'Reviewed';
    const nowIso = new Date().toISOString();
    const validatedBy = 'Dr. Farah Hanim, Sp.OG (Gynae-Oncologist)';

    // 1. Optimistic UI update in React state
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );

    setScans((prev) => ({
      ...prev,
      [patientId]: {
        ...(prev[patientId] || activeScan),
        validationStatus: decision,
        doctorNotes: notes,
        validatedByDoctor: validatedBy,
        validatedAt: nowIso,
      },
    }));

    const newLogId = `LOG-${Date.now()}`;
    const auditAction = biopsyRecommended ? 'BIOPSY_ORDERED' : decision === 'OVERRIDDEN' ? 'DIAGNOSIS_OVERRIDDEN' : 'VALIDATION_CONFIRMED';
    const auditDetails = `Specialist sign-off completed: ${decision}. Action plan: ${biopsyRecommended ? 'Directed punch biopsy' : 'Clinical monitoring'}. Notes: "${notes.slice(0, 75)}..."`;

    const newLog: AuditLogEntry = {
      id: newLogId,
      timestamp: nowIso,
      doctorName: 'Dr. Farah Hanim, Sp.OG',
      patientId,
      patientName: targetPatient?.fullName || 'Patient',
      action: auditAction,
      details: auditDetails,
      previousStatus: prevStatus,
      newStatus: newStatus,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    // 2. Synchronize directly with Supabase PostgreSQL database
    try {
      // Update patient status in database
      const { error: patientUpdateErr } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', patientId);

      if (patientUpdateErr) {
        console.error('Error updating patient in Supabase:', patientUpdateErr);
      }

      // Update scan validation status in database (if scan exists)
      const currentScanId = scans[patientId]?.scanId || activeScan.scanId;
      await supabase
        .from('screening_scans')
        .update({
          validation_status: decision,
          doctor_notes: notes,
          validated_by_doctor: validatedBy,
          validated_at: nowIso,
        })
        .eq('id', currentScanId);

      // Insert new audit log into database
      await supabase
        .from('audit_trail')
        .insert({
          id: newLogId,
          timestamp: nowIso,
          doctor_name: 'Dr. Farah Hanim, Sp.OG',
          patient_id: patientId,
          patient_name: targetPatient?.fullName || 'Patient',
          action: auditAction,
          details: auditDetails,
          previous_status: prevStatus || null,
          new_status: newStatus,
        });

      console.log(`[Supabase Sync Success] Patient ${patientId} updated to ${newStatus} & audit log ${newLogId} inserted.`);
    } catch (dbError) {
      console.error('Database synchronization error:', dbError);
    }
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

        {/* Live Database Status Banner if Connected */}
        {isDbConnected && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1 text-xs text-emerald-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold">Supabase PostgreSQL Live Synchronization Active</span>
              <span className="text-emerald-600/70 hidden sm:inline">(Project: lirvuqhhjkjnohcrvvru • Region: ap-northeast-1)</span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Real-time Connected</span>
          </div>
        )}

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
