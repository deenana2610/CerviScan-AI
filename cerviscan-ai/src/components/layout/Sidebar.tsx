import React from 'react';
import {
  LayoutDashboard,
  Users,
  ScanEye,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Activity,
  Award
} from 'lucide-react';

export type NavigationTab = 'overview' | 'patients' | 'scans' | 'analytics' | 'audit' | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  pendingReviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  pendingReviewCount,
}) => {
  const navItems = [
    {
      id: 'overview' as NavigationTab,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'KPI metrics & trends',
    },
    {
      id: 'patients' as NavigationTab,
      label: 'Patient Directory',
      icon: Users,
      description: 'EHR database & records',
      badge: 20,
    },
    {
      id: 'scans' as NavigationTab,
      label: 'AI Scans Workspace',
      icon: ScanEye,
      description: 'Colposcopy & heatmap viewer',
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} pending` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Clinical Analytics',
      icon: BarChart3,
      description: 'Epidemiology & Swede scores',
    },
    {
      id: 'audit' as NavigationTab,
      label: 'Audit & Compliance',
      icon: ShieldCheck,
      description: 'Sign-off logs & clinical trace',
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Screening Protocols',
      icon: Settings,
      description: 'MOH guidelines & AI settings',
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-300 select-none z-30 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="absolute -right-3 top-5 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-md hover:bg-slate-700 hover:text-white"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Engine Status Banner */}
      <div className={`p-4 border-b border-slate-800/80 ${isCollapsed ? 'items-center text-center' : ''}`}>
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <span>AI Model v4.2 Ready</span>
                <Sparkles className="h-3 w-3 text-cyan-400" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">MOH Cervical Clinical Protocol</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-lg px-3 py-2.5 text-xs font-medium transition group relative ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 font-semibold border-l-2 border-cyan-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 transition ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && (
                  <div className="text-left">
                    <div>{item.label}</div>
                  </div>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Compliance Box */}
      {!isCollapsed && (
        <div className="p-3 mx-2 mb-3 rounded-lg border border-slate-800 bg-slate-800/40 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
            <Award className="h-3.5 w-3.5 text-cyan-400" />
            <span>Regulatory Certified</span>
          </div>
          <p className="text-[10px] leading-relaxed">
            MDA Medical Device Reg. No. MDA-2025-C19
            <br />
            ISO 13485:2016 Certified
          </p>
        </div>
      )}
    </aside>
  );
};
