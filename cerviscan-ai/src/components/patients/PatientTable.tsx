import React, { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Microscope,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  FileSpreadsheet,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Patient, RiskSeverity, ClinicalStatus } from '../../types/patient';
import { maskName, maskIC, getRiskBadgeClasses, getStatusBadgeClasses } from '../../lib/utils';
import { PatientDrawer } from './PatientDrawer';

interface PatientTableProps {
  patients: Patient[];
  privacyMode: boolean;
  onNavigateToScan: (patientId: string) => void;
  selectedHospital: string;
}

const columnHelper = createColumnHelper<Patient>();

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  privacyMode,
  onNavigateToScan,
  selectedHospital,
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'lastScreeningDate', desc: true }
  ]);
  
  // Drawer state
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const selectedPatient = useMemo(() => {
    return patients.find((p) => p.id === selectedPatientId) || null;
  }, [patients, selectedPatientId]);

  // Filter patients based on hospital switcher, risk tabs, status, and search query
  const filteredData = useMemo(() => {
    return patients.filter((patient) => {
      // Hospital filter
      if (
        selectedHospital !== 'All Branches (National Registry)' &&
        patient.assignedHospital !== selectedHospital
      ) {
        return false;
      }

      // Risk tab filter
      if (riskFilter !== 'ALL' && patient.overallRisk !== riskFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && patient.status !== statusFilter) {
        return false;
      }

      // Search query
      if (globalFilter.trim()) {
        const query = globalFilter.toLowerCase();
        const matchesName = patient.fullName.toLowerCase().includes(query);
        const matchesId = patient.id.toLowerCase().includes(query);
        const matchesIC = patient.icNumber.replace(/-/g, '').includes(query.replace(/-/g, ''));
        const matchesHosp = patient.assignedHospital.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesIC && !matchesHosp) {
          return false;
        }
      }

      return true;
    });
  }, [patients, selectedHospital, riskFilter, statusFilter, globalFilter]);

  // Define Table Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Patient ID',
        cell: (info) => (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor('fullName', {
        header: 'Patient Name & IC Number',
        cell: (info) => {
          const patient = info.row.original;
          return (
            <div>
              <div className="font-semibold text-slate-900 hover:text-cyan-700 transition">
                {maskName(patient.fullName, privacyMode)}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                MyKad: {maskIC(patient.icNumber, privacyMode)}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('age', {
        header: 'Demographics',
        cell: (info) => {
          const patient = info.row.original;
          return (
            <div className="text-xs">
              <span className="font-medium text-slate-800">{patient.age} yrs</span>
              <div className="text-[10px] text-slate-400">
                {patient.gravidaPara} • {patient.ethnicity}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('lastScreeningDate', {
        header: 'Last Screening',
        cell: (info) => (
          <div className="text-xs">
            <span className="font-medium text-slate-700">{info.getValue()}</span>
            <div className="text-[10px] text-slate-400">Digital Colposcopy</div>
          </div>
        ),
      }),
      columnHelper.accessor('overallRisk', {
        header: 'AI Risk Level',
        cell: (info) => {
          const risk = info.getValue() as RiskSeverity;
          const badge = getRiskBadgeClasses(risk);
          return (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.bg} ${badge.text} border ${badge.border}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>
          );
        },
      }),
      columnHelper.accessor('aiConfidenceScore', {
        header: 'AI Confidence',
        cell: (info) => {
          const score = info.getValue();
          const risk = info.row.original.overallRisk;
          const barColor =
            risk === 'HIGH_RISK'
              ? 'bg-red-500'
              : risk === 'MODERATE_RISK'
              ? 'bg-amber-500'
              : 'bg-emerald-500';

          return (
            <div className="w-28 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{score}%</span>
                <span className="text-[10px] text-slate-400">Match</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as ClinicalStatus;
          const badge = getStatusBadgeClasses(status);
          return (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {status === 'Requires Biopsy' && <ShieldAlert className="h-3 w-3" />}
              {status === 'Pending Validation' && <Clock className="h-3 w-3" />}
              {status === 'Reviewed' && <CheckCircle2 className="h-3 w-3" />}
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: (info) => {
          const patient = info.row.original;
          return (
            <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => {
                  setSelectedPatientId(patient.id);
                  setIsDrawerOpen(true);
                }}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                title="Quick EHR Summary"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateToScan(patient.id)}
                className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-cyan-600 transition shadow-xs"
                title="Open Cerviscan AI Workspace"
              >
                <Microscope className="h-3.5 w-3.5" />
                <span>Scan</span>
              </button>
            </div>
          );
        },
      }),
    ],
    [privacyMode, onNavigateToScan]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Triage Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Patient Clinical Directory & Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time TanStack-powered EHR register with PII compliance, AI classification, and colposcopy history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setRiskFilter('ALL');
              setStatusFilter('ALL');
              setGlobalFilter('');
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-xs transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Search, Risk Tabs & Status Select */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Risk Filter Segmented Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium overflow-x-auto">
            <button
              type="button"
              onClick={() => setRiskFilter('ALL')}
              className={`rounded-md px-3 py-1.5 transition ${
                riskFilter === 'ALL'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Records ({patients.length})
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter('HIGH_RISK')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                riskFilter === 'HIGH_RISK'
                  ? 'bg-red-50 text-red-700 font-bold border border-red-200 shadow-xs'
                  : 'text-slate-600 hover:text-red-700'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-red-500" />
              High Risk ({patients.filter((p) => p.overallRisk === 'HIGH_RISK').length})
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter('MODERATE_RISK')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                riskFilter === 'MODERATE_RISK'
                  ? 'bg-amber-50 text-amber-700 font-bold border border-amber-200 shadow-xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Moderate ({patients.filter((p) => p.overallRisk === 'MODERATE_RISK').length})
            </button>
            <button
              type="button"
              onClick={() => setRiskFilter('LOW_RISK')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                riskFilter === 'LOW_RISK'
                  ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Low Risk ({patients.filter((p) => p.overallRisk === 'LOW_RISK').length})
            </button>
          </div>

          {/* Search and Secondary Dropdowns */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Filter name, IC, or ID..."
                className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Requires Biopsy">Requires Biopsy</option>
              <option value="Pending Validation">Pending Validation</option>
              <option value="Reviewed">Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main TanStack Data Table Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        className="py-3 px-4 select-none cursor-pointer hover:bg-slate-100 transition"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUp className="h-3.5 w-3.5 text-cyan-600" />,
                            desc: <ChevronDown className="h-3.5 w-3.5 text-cyan-600" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      setSelectedPatientId(row.original.id);
                      setIsDrawerOpen(true);
                    }}
                    className="hover:bg-slate-50/90 cursor-pointer transition"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                    No clinical records matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-900">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-900">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                filteredData.length
              )}
            </span>{' '}
            of <span className="font-bold text-slate-900">{filteredData.length}</span> patient records
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <span className="text-xs">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Patient Drawer */}
      <PatientDrawer
        patient={selectedPatient}
        isOpen={isDrawerOpen}
        privacyMode={privacyMode}
        onClose={() => setIsDrawerOpen(false)}
        onOpenScanWorkspace={(patientId) => {
          setIsDrawerOpen(false);
          onNavigateToScan(patientId);
        }}
      />
    </div>
  );
};
