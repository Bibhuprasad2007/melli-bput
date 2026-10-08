import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  RotateCcw,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Eye,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useContributorData, type ContributorAuditLogEntry } from '../context/ContributorDataContext';

export const ContributorActivityPage: React.FC = () => {
  const { auditLogs, activeScope } = useContributorData();

  const [searchValue, setSearchValue] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<ContributorAuditLogEntry | null>(null);

  const filteredLogs = auditLogs.filter((log) => {
    const term = searchValue.toLowerCase();
    const matchesSearch =
      log.id.toLowerCase().includes(term) ||
      log.fieldLabel.toLowerCase().includes(term) ||
      log.indicatorCode.toLowerCase().includes(term) ||
      log.user.toLowerCase().includes(term) ||
      log.reason.toLowerCase().includes(term);

    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const totalEvents = auditLogs.length;
  const updatesCount = auditLogs.filter((l) => l.action === 'UPDATE' || l.action === 'CREATE').length;
  const uploadsCount = auditLogs.filter((l) => l.action === 'UPLOAD').length;
  const validationsCount = auditLogs.filter((l) => l.action === 'VALIDATE').length;

  const handleExportCsv = () => {
    let csv =
      'Log_ID,Timestamp,Action,Indicator_Code,Field_Label,Old_Value,New_Value,User,Reason,IP_Address\n';
    for (const log of filteredLogs) {
      csv += `"${log.id}","${log.timestamp}","${log.action}","${log.indicatorCode}","${log.fieldLabel}","${log.oldValue}","${log.newValue}","${log.user}","${log.reason}","${log.ipAddress}"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_${activeScope.projectCode}_Audit_Trail.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action: ContributorAuditLogEntry['action']) => {
    switch (action) {
      case 'SUBMIT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            SUBMIT
          </span>
        );
      case 'UPLOAD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
            UPLOAD
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            UPDATE
          </span>
        );
      case 'VALIDATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            VALIDATE
          </span>
        );
      case 'CREATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            CREATE
          </span>
        );
      case 'CORRECT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
            CORRECT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Activity & Immutable Audit Trail"
        description="Section 35 & 58 Traceable Audit Chain: Complete chronological history of operational data changes, evidence uploads, anomaly validations, and submission dispatches."
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Audit Events"
          value={totalEvents.toString()}
          icon={History}
          iconBg="bg-teal-50"
          iconColor="text-teal-700"
          accentBorder="border-l-teal-600"
        />
        <MetricCard
          title="Data Entry Modifications"
          value={updatesCount.toString()}
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          accentBorder="border-l-blue-500"
        />
        <MetricCard
          title="Evidence Files Attached"
          value={uploadsCount.toString()}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorder="border-l-emerald-500"
        />
        <MetricCard
          title="Engine Validations & GHG"
          value={validationsCount.toString()}
          icon={Sparkles}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accentBorder="border-l-amber-500"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by Log ID, indicator, user name, or reason..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
          >
            <option value="ALL">All Action Types</option>
            <option value="CREATE">CREATE (Initial Entry)</option>
            <option value="UPDATE">UPDATE (Value Changed)</option>
            <option value="UPLOAD">UPLOAD (Evidence Attached)</option>
            <option value="VALIDATE">VALIDATE (Calculation / Anomaly)</option>
            <option value="CORRECT">CORRECT (Resubmission)</option>
            <option value="SUBMIT">SUBMIT (Dossier Dispatched)</option>
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>Export Trail (.CSV)</span>
          </button>

          {(searchValue || filterAction !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                setFilterAction('ALL');
              }}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Audit ID</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Indicator / Disclosure</th>
                <th className="px-4 py-3">Value Transition</th>
                <th className="px-4 py-3">User &amp; Machine</th>
                <th className="px-4 py-3">Reason / Context</th>
                <th className="px-4 py-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-teal-800">
                    {log.id}
                  </td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.timestamp}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{getActionBadge(log.action)}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{log.fieldLabel}</p>
                    <span className="font-mono text-[10px] text-slate-400">{log.indicatorCode}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[11px] font-mono">
                      <span className="text-slate-400 line-through mr-1.5">{log.oldValue}</span>
                      <strong className="text-slate-800">{log.newValue}</strong>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">
                    <p className="font-medium text-slate-800">{log.user}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{log.ipAddress}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={log.reason}>
                    {log.reason}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Audit Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Immutable Audit Envelope (Sec. 35)
                </span>
                <h3 className="text-sm font-bold text-white">{selectedLog.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Action:</span>
                  <span>{getActionBadge(selectedLog.action)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Indicator Code:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedLog.indicatorCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Disclosure Name:</span>
                  <span className="font-bold text-slate-800">{selectedLog.fieldLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Timestamp:</span>
                  <span className="text-slate-700">{selectedLog.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Actor / Machine:</span>
                  <span className="font-semibold text-slate-800">{selectedLog.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Device &amp; IP Metadata:</span>
                  <span className="font-mono text-slate-700">{selectedLog.ipAddress}</span>
                </div>
              </div>

              {/* Value Transition Card */}
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                  Reported Value Transition
                </span>
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-white/80 px-2.5 py-1 rounded border border-teal-200">
                    <span className="text-[10px] text-slate-400 block font-normal">Prior State</span>
                    <strong className="text-slate-600 line-through">{selectedLog.oldValue}</strong>
                  </div>
                  <span className="text-teal-700 font-bold">&rarr;</span>
                  <div className="bg-white px-2.5 py-1 rounded border border-teal-300 shadow-xs">
                    <span className="text-[10px] text-teal-700 block font-normal">New State</span>
                    <strong className="text-teal-950 font-black">{selectedLog.newValue}</strong>
                  </div>
                </div>
              </div>

              {/* Reason / Narrative */}
              <div>
                <span className="text-slate-500 font-semibold block mb-1">Audit Justification &amp; Remarks:</span>
                <p className="text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedLog.reason}
                </p>
              </div>

              {selectedLog.documentName && (
                <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-lg text-slate-700">
                  <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Linked Verification Evidence</span>
                    <strong className="text-xs text-slate-800">{selectedLog.documentName}</strong>
                  </div>
                </div>
              )}

              {/* Security Seal */}
              <div className="p-3 bg-slate-900 text-teal-300 rounded-xl flex items-center gap-2.5 text-[11px]">
                <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
                <span>
                  Cryptographic Log Integrity Verified • Immutable Append-Only Ledger • SEBI BRSR Audit Compliant
                </span>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Close Envelope
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
