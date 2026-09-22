import React from 'react';
import {
  Users,
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Filter,
  Microscope,
  FileCheck
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

  return (
    <div className="space-y-6">
      {/* Top Welcome & Diagnostic Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              National Cervical Screening Command Dashboard
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
            <span>View All Patients ({patients.length})</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateToScan(highRiskPatients[0]?.id || patients[0].id)}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-cyan-500 shadow-xs transition"
          >
            <Microscope className="h-3.5 w-3.5" />
            <span>Open AI Scan Workspace</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards (4 Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Patients Screened
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {ANALYTICS_METRICS.totalPatientsScreened.toLocaleString()}
            </span>
            <span className="flex items-center text-xs font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" />
              +14.2% MoM
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">PEKERTI National Program Year 2026</p>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-rose-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              High Risk Detected (HSIL+)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-rose-600">
              {ANALYTICS_METRICS.highRiskDetectedPercent}%
            </span>
            <span className="text-xs font-medium text-slate-600">
              ({(1246).toLocaleString()} positive cases)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">CIN2 / CIN3 / Invasive Suspicion</p>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Doctor Reviews
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-600">
              {pendingValidation.length}
            </span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Action Required
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Awaiting Gynaecologist sign-off</p>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-cyan-200 bg-white p-5 shadow-xs transition hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Average AI Inference Speed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100">
              <Zap className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              {ANALYTICS_METRICS.averageAiInferenceTimeSec}s
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Target &lt; 2.5s
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">96.2% Biopsy Histology Concordance</p>
        </div>
      </div>

      {/* Charts Section: Monthly Trends (2/3) & Risk Donut (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Monthly Screening Trend & Detection Volume</h2>
              <p className="text-xs text-slate-500">Total digital colposcopies vs. AI confirmed positive anomalies</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                <span className="text-slate-600 font-medium">Total Scans</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-600 font-medium">Positive Cases</span>
              </div>
            </div>
          </div>

          <div className="h-68 w-full">
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
              <h2 className="text-sm font-bold text-slate-900">Cervical Risk Stratification</h2>
              <span className="text-[11px] text-slate-400 font-mono">N = 14,820</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">AI automated classification distribution</p>

            <div className="h-48 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ANALYTICS_METRICS.riskDistribution}
                    innerRadius={55}
                    outerRadius={80}
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
                <span className="text-xl font-bold text-slate-900">74.0%</span>
                <span className="text-[10px] uppercase font-semibold text-emerald-600">Normal / Low</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {ANALYTICS_METRICS.riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                  <span className="text-slate-400 font-mono text-[11px]">({item.count.toLocaleString()})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Demographics & Actionable High-Risk Patients Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Group Demographics Bar Chart (1/3) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900">Age Group Risk Demographics</h2>
          <p className="text-xs text-slate-500 mb-4">Prevalence across age cohorts (Years)</p>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_METRICS.ageGroupDemographics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="ageGroup" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="lowRisk" fill="#10B981" name="Low Risk" radius={[2, 2, 0, 0]} />
                <Bar dataKey="moderateRisk" fill="#F59E0B" name="Moderate" radius={[2, 2, 0, 0]} />
                <Bar dataKey="highRisk" fill="#EF4444" name="High Risk" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-around pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Low</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500"></span> High Risk</span>
          </div>
        </div>

        {/* Immediate Specialist Review Queue (2/3) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">Urgent Specialist Action Queue</h2>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-300">
                    {highRiskPatients.length} High Risk Cases
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">High-grade lesion cases awaiting colposcopy review or biopsy sign-off</p>
              </div>
              <button
                type="button"
                onClick={onNavigateToPatients}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                Full Patient Directory <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Age / HPV DNA</th>
                    <th className="py-2.5 px-3">AI Confidence</th>
                    <th className="py-2.5 px-3">Risk Assessment</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Workstation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {highRiskPatients.slice(0, 4).map((p) => {
                    const riskBadge = getRiskBadgeClasses(p.overallRisk);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">
                            {maskName(p.fullName, privacyMode)}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {p.id} • IC: {maskIC(p.icNumber, privacyMode)}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-700">{p.age} yrs</div>
                          <span className="inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            {p.hpvDnaResult}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{p.aiConfidenceScore}%</span>
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-rose-500 h-full rounded-full"
                                style={{ width: `${p.aiConfidenceScore}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400">HSIL / CIN2+</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${riskBadge.bg} ${riskBadge.text} border ${riskBadge.border}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${riskBadge.dot}`} />
                            {riskBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-700">{p.status}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onNavigateToScan(p.id)}
                            className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-cyan-600 transition shadow-xs"
                          >
                            <span>Validate Scan</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automated AI Triage SLA: Urgent colposcopies flagged within 4 hours.</span>
            <span className="font-semibold text-slate-700">MOH Protocol 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};
