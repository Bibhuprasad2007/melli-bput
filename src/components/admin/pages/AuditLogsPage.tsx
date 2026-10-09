import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Download,
  Search,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { DataTableShell } from '../common/DataTableShell';
import { useNexusData } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AuditLogsPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const { systemAuditLogs } = useNexusData();

  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = systemAuditLogs.filter((log) => {
    if (moduleFilter !== 'all' && log.module !== moduleFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchActor = log.actorName.toLowerCase().includes(q) || log.actorEmail.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchId = log.recordId.toLowerCase().includes(q);
      if (!matchActor && !matchDetails && !matchId) return false;
    }
    return true;
  });

  const handleExportAuditCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Log ID,Timestamp,Actor,Role,Email,Module,Action,Record ID,Details,IP Address\n' +
      systemAuditLogs.map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorRole}","${l.actorEmail}","${l.module}","${l.action}","${l.recordId}","${l.details.replace(/"/g, '""')}","${l.ipAddress || '10.0.4.12'}"`
      ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MEIL_ESG_System_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Complete immutable audit log trail exported.', 'success');
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'UPDATE':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'APPROVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'REJECT':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'REMIND':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Immutable Statutory Audit Trail Logs"
        description="Tamper-evident record of all system events, data updates, user permission modifications, reviewer decisions, and administrative overrides across MEIL ESG Nexus."
        actionText="Export Audit CSV"
        actionIcon={Download}
        onAction={handleExportAuditCsv}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search audit trail by actor, email, record ID, or action details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
            />
          </div>

          <div className="w-36 sm:w-44">
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
            >
              <option value="all">All Modules</option>
              <option value="Workflow">Workflow</option>
              <option value="Users">Users</option>
              <option value="Organization">Organization</option>
              <option value="Reporting Cycle">Reporting Cycle</option>
              <option value="Validation">Validation</option>
              <option value="Settings">Settings</option>
            </select>
          </div>

          <div className="w-36 sm:w-44">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
            >
              <option value="all">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="APPROVE">APPROVE</option>
              <option value="REJECT">REJECT</option>
              <option value="REMIND">REMIND</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredLogs.length}</span> log records
        </div>
      </div>

      {/* Audit Logs Table */}
      <DataTableShell
        columns={[
          'Timestamp (UTC)',
          'Actor Details',
          'Module',
          'Action Type',
          'Record Ref',
          'Audit Event Description',
          'IP Origin',
        ]}
        emptyTitle="No audit logs found"
        emptyDescription="Try clearing filters or search terms."
      >
        {filteredLogs.map((log) => (
          <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
            <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">
              {new Date(log.timestamp).toLocaleString()}
            </td>

            <td className="px-4 py-3 text-xs">
              <div className="font-semibold text-slate-900">{log.actorName}</div>
              <div className="text-[11px] text-slate-400 font-mono">
                {log.actorEmail} • <span className="uppercase">{log.actorRole}</span>
              </div>
            </td>

            <td className="px-4 py-3 text-xs">
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {log.module}
              </span>
            </td>

            <td className="px-4 py-3 text-xs">
              <span
                className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded border ${getActionBadge(
                  log.action
                )}`}
              >
                {log.action}
              </span>
            </td>

            <td className="px-4 py-3 text-xs font-mono text-slate-600 font-medium truncate max-w-[120px]" title={log.recordId}>
              {log.recordId}
            </td>

            <td className="px-4 py-3 text-xs text-slate-700 max-w-md">
              <div className="line-clamp-2" title={log.details}>
                {log.details}
              </div>
            </td>

            <td className="px-4 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
              {log.ipAddress || '10.0.4.12'}
            </td>
          </tr>
        ))}
      </DataTableShell>
    </div>
  );
};
