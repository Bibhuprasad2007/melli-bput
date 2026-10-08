import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  X,
} from 'lucide-react';
import { Logo } from '../../ui/Logo';
import { useDemoAuth } from '../../../context/DemoAuthContext';
import { useNexusData } from '../../../context/NexusDataContext';
import { REVIEWER_NAV_ITEMS } from '../../../constants/reviewerNav';

interface ReviewerSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const ReviewerSidebar: React.FC<ReviewerSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { logout, session } = useDemoAuth();
  const { assignments, submissions, notifications } = useNexusData();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#0B1D33] text-slate-200 border-r border-[#152d4a] select-none">
      {/* Top Header / Branding */}
      <div>
        <div className="h-[68px] px-4 flex items-center justify-between border-b border-[#152d4a]">
          <div className="flex items-center gap-3 overflow-hidden">
            <Logo className="w-8 h-8 shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200">
                <span className="font-bold text-sm tracking-tight text-white truncate">
                  MEIL <span className="text-[#E31E24]">BRSR</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-sky-300 truncate">
                  Reviewer / Approver
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          aria-label="Reviewer Navigation"
          className="p-3 space-y-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-210px)]"
        >
          {REVIEWER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            
            // Dynamic badge count
            let badgeCount = 0;
            if (item.badgeKey === 'pending') {
              badgeCount = assignments.filter(a => a.status === 'under_review' || a.status === 'submitted' || a.status === 'resubmitted').length;
            } else if (item.badgeKey === 'corrections') {
              badgeCount = assignments.filter(a => a.status === 'correction_requested').length;
            } else if (item.badgeKey === 'anomalies') {
              badgeCount = submissions.filter(s => s.anomaly?.isAnomaly && !s.anomaly?.isExplanationAccepted).length;
            } else if (item.badgeKey === 'notifications') {
              badgeCount = notifications.filter(n => !n.isRead).length;
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-[#003B73] text-white shadow-xs font-semibold'
                      : 'text-slate-300 hover:bg-[#162c48] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="truncate flex-1">{item.name}</span>
                    )}
                    {badgeCount > 0 && !isCollapsed && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        item.badgeKey === 'anomalies' 
                          ? 'bg-amber-500 text-slate-900' 
                          : item.badgeKey === 'corrections'
                          ? 'bg-orange-500 text-white'
                          : 'bg-[#E31E24] text-white'
                      }`}>
                        {badgeCount}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-sky-400 rounded-r-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-3 border-t border-[#152d4a] bg-[#081525] space-y-2">
        {/* Reviewer Profile Details */}
        <div
          className={`flex items-center gap-2.5 p-2 rounded-lg bg-[#0f1f35] border border-[#1a3050] ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={session?.user?.email || 'Reviewer'}
        >
          <div className="w-8 h-8 rounded-full bg-sky-700 border border-sky-400/30 flex items-center justify-center text-white shrink-0">
            <UserCheck className="w-4 h-4 text-sky-200" />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {session?.user?.name || 'Demo Reviewer'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {session?.user?.email || 'demo.reviewer@meil.test'}
              </p>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleLogout}
            title="Logout of Reviewer Portal"
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-950/40 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-rose-400 flex-1 ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-400" />
            {!isCollapsed && <span>Logout</span>}
          </button>

          {/* Desktop Collapse Toggle Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-[#162c48] rounded-lg transition-colors focus:outline-none"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[80px]' : 'w-[272px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Out Drawer with Backdrop */}
      {isMobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden flex"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-[280px] max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
