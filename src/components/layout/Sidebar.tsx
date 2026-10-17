import React from 'react';
import {
  LayoutDashboard,
  Users,
  ScanEye,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award
} from 'lucide-react';

export type NavigationTab = 'overview' | 'patients' | 'scans' | 'audit';

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
      label: 'Overview & Analytics',
      icon: LayoutDashboard,
    },
    {
      id: 'patients' as NavigationTab,
      label: 'Patient Registry',
      icon: Users,
    },
    {
      id: 'scans' as NavigationTab,
      label: 'AI Scans Workspace',
      icon: ScanEye,
      badge: pendingReviewCount > 0 ? `${pendingReviewCount} pending` : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'audit' as NavigationTab,
      label: 'Audit & Compliance',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-300 select-none z-30 ${
        isCollapsed ? 'w-18' : 'w-60'
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
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <span>CerviScan CDSS</span>
                <Sparkles className="h-3 w-3 text-cyan-400" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">WHO 90-70-90 Protocol</p>
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
              className={`w-full flex items-center rounded-lg px-3 py-2.5 text-xs font-semibold transition group relative ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`h-4 w-4 shrink-0 transition ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
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
        <div className="p-3 mx-2 mb-3 rounded-lg border border-slate-800 bg-slate-800/40 text-[11px] text-slate-400 flex items-center gap-2">
          <Award className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="leading-tight">
            <div className="font-semibold text-slate-300 text-[10px]">SaMD IEC 62304</div>
            <div className="text-[9px] text-slate-500">MOH / LPPKN Compliant</div>
          </div>
        </div>
      )}
    </aside>
  );
};
