import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import {
  Award,
  TrendingUp,
  Activity,
  CheckCircle2,
  Building2,
  FileCheck,
  ShieldCheck,
  Microscope
} from 'lucide-react';
import { ANALYTICS_METRICS } from '../../lib/mock-data';

export const ClinicalAnalyticsView: React.FC = () => {
  // Swede Score correlation with histology data
  const swedeCorrelationData = [
    { score: '0 - 2', cin0Normal: 92, cin1Low: 7, cin2PlusHigh: 1 },
    { score: '3 - 4', cin0Normal: 45, cin1Low: 42, cin2PlusHigh: 13 },
    { score: '5 - 6', cin0Normal: 12, cin1Low: 28, cin2PlusHigh: 60 },
    { score: '7 - 8', cin0Normal: 3, cin1Low: 11, cin2PlusHigh: 86 },
    { score: '9 - 10', cin0Normal: 0, cin1Low: 4, cin2PlusHigh: 96 },
  ];

  const rocCurveData = [
    { falsePositiveRate: 0, truePositiveRate: 0 },
    { falsePositiveRate: 0.02, truePositiveRate: 0.82 },
    { falsePositiveRate: 0.04, truePositiveRate: 0.92 },
    { falsePositiveRate: 0.06, truePositiveRate: 0.96 },
    { falsePositiveRate: 0.10, truePositiveRate: 0.98 },
    { falsePositiveRate: 0.20, truePositiveRate: 0.99 },
    { falsePositiveRate: 1.0, truePositiveRate: 1.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              National Clinical Epidemiology & Model Validation Analytics
            </h1>
            <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 border border-cyan-300">
              AUC: 0.982
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Multicenter statistical benchmark, Swede score histology correlation, and algorithmic sensitivity auditing.
          </p>
        </div>
      </div>

      {/* 3 Core Statistical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
            <span>Clinical Sensitivity (HSIL+)</span>
            <Microscope className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">98.4%</span>
            <span className="text-xs text-emerald-600 font-semibold">CI 97.6 - 99.1%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Evaluated across 14,820 patient cervical scans</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
            <span>Specialist Concordance</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">96.2%</span>
            <span className="text-xs text-emerald-600 font-semibold">+1.8% vs Manual</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Correlation with histological biopsy gold-standard</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 uppercase font-semibold">
            <span>Average Diagnostic Turnaround</span>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">1.8 hrs</span>
            <span className="text-xs text-cyan-600 font-semibold">SLA &lt; 4.0 hrs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">From digital image capture to specialist validation</p>
        </div>
      </div>

      {/* Visual Charts: Swede Score Correlation & ROC Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swede Score Histology Correlation */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Colposcopic Swede Score vs. Histology Outcome
              </h2>
              <p className="text-xs text-slate-500">Distribution of CIN grades across Swede score bands (%)</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={swedeCorrelationData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="score" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="cin0Normal" fill="#10B981" name="Normal / CIN0" stackId="a" />
                <Bar dataKey="cin1Low" fill="#F59E0B" name="Low Grade (CIN1)" stackId="a" />
                <Bar dataKey="cin2PlusHigh" fill="#EF4444" name="High Grade (CIN2+)" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <strong>Key Insight:</strong> Patients with Swede Score &ge; 7 exhibit &gt; 86% CIN2+ positive predictive value, validating expedited biopsy protocols without repeat cytology.
          </div>
        </div>

        {/* Hospital Facility Benchmark Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Screening Facility Operational Performance
                </h2>
                <p className="text-xs text-slate-500">Center-specific screening volume & AI sensitivity audit</p>
              </div>
              <Building2 className="h-4 w-4 text-slate-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Hospital / Clinic</th>
                    <th className="py-2.5 px-3">Scans</th>
                    <th className="py-2.5 px-3">Sensitivity</th>
                    <th className="py-2.5 px-3 text-right">Avg Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ANALYTICS_METRICS.hospitalPerformance.map((hosp) => (
                    <tr key={hosp.hospital} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {hosp.hospital}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {hosp.scans.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-600">
                        {hosp.sensitivity}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-800">
                        {hosp.avgReviewTimeHours} hrs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>National QA Audit Frequency: Monthly</span>
            <span className="font-semibold text-cyan-600">Ministry of Health Malaysia</span>
          </div>
        </div>
      </div>
    </div>
  );
};
