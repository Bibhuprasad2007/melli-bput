import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, X, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { useNexusData } from '../../../context/NexusDataContext';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useNexusData();

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      ref={popoverRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#003B73]" />
          <h3 className="text-sm font-semibold text-slate-800">Governance Alerts</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#E31E24] text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No active governance alerts.
          </div>
        ) : (
          notifications.slice(0, 6).map((notif) => {
            let Icon = Bell;
            let iconColor = 'text-sky-600 bg-sky-50';
            if (notif.type === 'anomaly' || notif.priority === 'high') {
              Icon = AlertTriangle;
              iconColor = 'text-amber-600 bg-amber-50';
            } else if (notif.type === 'submission') {
              Icon = FileText;
              iconColor = 'text-emerald-600 bg-emerald-50';
            } else if (notif.type === 'deadline') {
              Icon = CheckCircle2;
              iconColor = 'text-indigo-600 bg-indigo-50';
            }

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !notif.isRead ? 'bg-sky-50/40' : 'bg-white'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1" />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/admin/notifications');
          }}
          className="text-xs font-semibold text-[#003B73] hover:text-[#00264D] inline-flex items-center gap-1.5 cursor-pointer py-1 px-2"
        >
          <span>View All In Notification Center</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
