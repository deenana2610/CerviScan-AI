import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Lock,
  Download
} from 'lucide-react';
import { AuditLogEntry } from '../../types/patient';
import { maskName } from '../../lib/utils';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
  privacyMode: boolean;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs, privacyMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.doctorName.toLowerCase().includes(q) ||
        log.patientName.toLowerCase().includes(q) ||
        log.patientId.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'VALIDATION_CONFIRMED':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Validated' };
      case 'DIAGNOSIS_OVERRIDDEN':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Override' };
      case 'BIOPSY_ORDERED':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Biopsy Ordered' };
      case 'REPORT_EXPORTED':
        return { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', label: 'PDF Report' };
      case 'PRIVACY_MODE_TOGGLED':
        return { bg: 'bg-slate-100 text-slate-700 border-slate-300', label: 'PII Policy' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', label: action };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Regulatory Audit & Clinical Decision Trail
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-300">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complies with Malaysian Medical Device Authority (MDA) and PDPA Healthcare Data Integrity standards.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by doctor, patient, ID..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Clinical Actions</option>
            <option value="VALIDATION_CONFIRMED">Validation Confirmed</option>
            <option value="BIOPSY_ORDERED">Biopsy Ordered</option>
            <option value="DIAGNOSIS_OVERRIDDEN">Diagnosis Overridden</option>
            <option value="REPORT_EXPORTED">Report Exported</option>
            <option value="PRIVACY_MODE_TOGGLED">PII Policy Toggled</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredLogs.length} audit entries
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp (MYT)</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Practitioner</th>
                <th className="py-3 px-4">Patient Record</th>
                <th className="py-3 px-4">Clinical Action Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const badge = getActionBadge(log.action);
                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {log.doctorName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">
                        {maskName(log.patientName, privacyMode)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">{log.patientId}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md">
                      {log.details}
                      {log.newStatus && (
                        <div className="mt-0.5 text-[10px] text-cyan-700 font-semibold">
                          Status Transition: {log.previousStatus} &rarr; {log.newStatus}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
