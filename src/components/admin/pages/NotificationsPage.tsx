import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Bell,
  Send,
  CheckCheck,
  AlertTriangle,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const NotificationsPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const { notifications, markNotificationRead, markAllNotificationsRead, logSystemAction } = useNexusData();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'critical' | 'warning' | 'info'>('warning');

  const filteredNotifications = notifications.filter((n) => {
    const sev = n.severity || (n.priority === 'high' ? 'critical' : n.priority === 'medium' ? 'warning' : 'info');
    if (filterSeverity !== 'all' && sev !== filterSeverity) return false;
    if (filterUnreadOnly && n.isRead) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Workflow',
      action: 'REMIND',
      recordId: `BROADCAST_${Date.now()}`,
      details: `Dispatched system broadcast to [${broadcastTarget.toUpperCase()}]: "${broadcastMessage}"`,
    });

    addToast(`Broadcast notification dispatched to ${broadcastTarget} roles.`, 'success');
    setIsBroadcastOpen(false);
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & System Broadcast Center"
        description="Monitor system-wide workflow reminders, deadline escalations, audit discrepancy notices, and dispatch administrative alerts."
        actionText="Send Broadcast Alert"
        actionIcon={Send}
        onAction={() => setIsBroadcastOpen(true)}
        extraControls={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={() => {
                markAllNotificationsRead();
                addToast('All notifications marked as read.', 'success');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-xs transition-all"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark All as Read ({unreadCount})</span>
            </button>
          ) : undefined
        }
      />

      {/* Filter and stats bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Severity:</span>
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filterSeverity === sev
                  ? 'bg-[#003B73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filterUnreadOnly}
              onChange={(e) => setFilterUnreadOnly(e.target.checked)}
              className="rounded border-slate-300 text-[#003B73] focus:ring-[#003B73]"
            />
            <span>Unread Only ({unreadCount})</span>
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No notifications match filter</h4>
            <p className="text-xs text-slate-500 mt-1">All workflow reminders and messages are cleared.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const sev = notif.severity || (notif.priority === 'high' ? 'critical' : notif.priority === 'medium' ? 'warning' : 'info');
            const isCrit = sev === 'critical';
            const isWarn = sev === 'warning';

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-white border-slate-200'
                    : isCrit
                    ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                    : isWarn
                    ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                    : 'bg-sky-50/70 border-sky-200 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isCrit
                        ? 'bg-rose-100 text-rose-700'
                        : isWarn
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {isCrit ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : isWarn ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#E31E24]" title="Unread" />
                      )}
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {notif.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[11px] text-slate-400 font-mono mt-1.5 block">
                      {new Date(notif.timestamp || notif.createdAt || '2026-10-09T13:00:00Z').toLocaleString()}
                    </span>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    type="button"
                    onClick={() => markNotificationRead(notif.id)}
                    className="text-xs text-[#003B73] hover:underline font-semibold shrink-0 cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Broadcast Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-[#003B73]" />
                <span>Send Broadcast Alert</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Roles</label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                >
                  <option value="all">All Portal Users (Contributors, Reviewers, Auditors)</option>
                  <option value="contributors">Data Contributors Only</option>
                  <option value="reviewers">Quality Reviewers Only</option>
                  <option value="auditors">Assurance Auditors Only</option>
                  <option value="management">Executive Management Only</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Severity Level</label>
                <select
                  value={broadcastSeverity}
                  onChange={(e) => setBroadcastSeverity(e.target.value as 'critical' | 'warning' | 'info')}
                  className="w-full py-2 px-3 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                >
                  <option value="warning">Warning / Deadline Reminder</option>
                  <option value="critical">Critical / Statutory Blocker</option>
                  <option value="info">Informational Bulletin</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alert Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice content (e.g., Reporting period deadline is in 48 hours for Q2 Scope 1 fuel data)..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003B73] hover:bg-[#002B54] text-white font-semibold rounded-lg shadow-xs"
                >
                  Dispatch Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
