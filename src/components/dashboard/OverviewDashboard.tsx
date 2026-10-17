import React from 'react';
import {
  Users,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Microscope,
  FileCheck,
  Award,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Patient } from '../../types/patient';
import { maskName, maskIC, getRiskBadgeClasses } from '../../lib/utils';
import { ANALYTICS_METRICS } from '../../lib/mock-data';

interface OverviewDashboardProps {
  patients: Patient[];
  privacyMode: boolean;
  onNavigateToScan: (patientId: string) => void;
  onNavigateToPatients: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  patients,
  privacyMode,
  onNavigateToScan,
  onNavigateToPatients,
}) => {
  const highRiskPatients = patients.filter((p) => p.overallRisk === 'HIGH_RISK');
  const pendingValidation = patients.filter((p) => p.status === 'Pending Validation');
  const biopsyOrdered = patients.filter((p) => p.status === 'Requires Biopsy');

  // Swede Score correlation with histology data (from Clinical Analytics)
  const swedeCorrelationData = [
    { score: '0 - 2', cin0Normal: 92, cin1Low: 7, cin2PlusHigh: 1 },
    { score: '3 - 4', cin0Normal: 45, cin1Low: 42, cin2PlusHigh: 13 },
    { score: '5 - 6', cin0Normal: 12, cin1Low: 28, cin2PlusHigh: 60 },
    { score: '7 - 8', cin0Normal: 3, cin1Low: 11, cin2PlusHigh: 86 },
    { score: '9 - 10', cin0Normal: 0, cin1Low: 4, cin2PlusHigh: 96 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Cervical Screening Command & Analytics Overview
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-300">
              Live Clinical Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time digital colposcopy classification, high-risk triage, and specialist validation pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateToPatients}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <span>Registry ({patients.length})</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateToScan(highRiskPatients[0]?.id || patients[0].id)}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-cyan-500 shadow-xs transition"
          >
            <Microscope className="h-3.5 w-3.5" />
            <span>AI Scan Workspace</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards (4 Compact Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Screened
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{patients.length}</span>
            <span className="text-[11px] font-semibold text-emerald-600">Active Registry</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Synchronized with Supabase</p>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              High Risk (HSIL / CIN2+)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">{highRiskPatients.length}</span>
            <span className="text-[11px] font-semibold text-rose-700">
              ({((highRiskPatients.length / Math.max(patients.length, 1)) * 100).toFixed(0)}%)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-rose-600/70">Urgent specialist colposcopy queue</p>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Pending Validation
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{pendingValidation.length}</span>
            <span className="text-[11px] font-semibold text-amber-700">Action Required</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-600/70">Awaiting specialist sign-off</p>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Biopsies / Reviewed
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{biopsyOrdered.length}</span>
            <span className="text-[11px] font-semibold text-emerald-700">Punch Biopsy</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600/70">Intervention protocol active</p>
        </div>
      </div>

      {/* Main Charts Row: Monthly Trend (2/3) & Risk Donut (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Screening Trend & Detection Volume</h2>
              <p className="text-xs text-slate-500">Total digital colposcopies vs. AI confirmed anomalies</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                <span className="text-slate-600 font-medium">Screenings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-600 font-medium">Positive (HSIL+)</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_METRICS.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="positivesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#E2E8F0' }}
                />
                <Area type="monotone" dataKey="totalScans" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#scansGradient)" name="Total Screenings" />
                <Area type="monotone" dataKey="positiveCases" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#positivesGradient)" name="Positive (HSIL+)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Risk Stratification</h2>
              <span className="text-[11px] text-slate-400 font-mono">N = {patients.length}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">AI automated classification distribution</p>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ANALYTICS_METRICS.riskDistribution}
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {ANALYTICS_METRICS.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`${val}%`, 'Prevalence']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-slate-900">
                  {highRiskPatients.length}
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase">High Risk</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-around text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Normal</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500"></span> High Risk</span>
          </div>
        </div>
      </div>

      {/* Integrated Clinical Analytics Section: Swede Score Correlation */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">Swede Score & Histopathology Correlation Model</h2>
              <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-cyan-800">
                AUC: 0.982
              </span>
            </div>
            <p className="text-xs text-slate-500">Colposcopic Swede Score (0-10) correlated with biopsy confirmed histology</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Normal (CIN0)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Low-Grade (CIN1)</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> High-Grade (CIN2+)</span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={swedeCorrelationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="score" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
              <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="cin0Normal" stackId="a" fill="#10B981" name="Normal (CIN0)" />
              <Bar dataKey="cin1Low" stackId="a" fill="#F59E0B" name="LSIL / CIN1" />
              <Bar dataKey="cin2PlusHigh" stackId="a" fill="#EF4444" name="HSIL / CIN2+" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
