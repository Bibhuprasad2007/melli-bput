import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ClipboardList, Plus, Send, BellRing, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { FilterBar } from '../common/FilterBar';
import { DataTableShell } from '../common/DataTableShell';
import { StatusBadge } from '../common/StatusBadge';
import { CreateAssignmentModal } from '../modals/CreateAssignmentModal';
import { SendReminderModal } from '../modals/SendReminderModal';
import { useNexusData } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const TaskAssignmentPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const { assignments, users, organizations, indicators, sendDeadlineReminder, updateAssignmentStatus } = useNexusData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filterOptions = [
    {
      label: 'BRSR Section',
      value: 'section',
      options: [
        { label: 'Section A - General', value: 'Section A' },
        { label: 'Section B - Management', value: 'Section B' },
        { label: 'Section C - Performance', value: 'Section C' },
      ],
      placeholder: 'All Sections',
    },
    {
      label: 'Principle',
      value: 'principle',
      options: [
        { label: 'P1 - Ethics', value: 'P1' },
        { label: 'P2 - Sustainable Products', value: 'P2' },
        { label: 'P3 - Employee Wellbeing', value: 'P3' },
        { label: 'P6 - Environment', value: 'P6' },
        { label: 'P8 - Inclusive Growth', value: 'P8' },
        { label: 'P9 - Customer Value', value: 'P9' },
      ],
      placeholder: 'All Principles',
    },
    {
      label: 'Status',
      value: 'status',
      options: [
        { label: 'Draft / In Progress', value: 'draft' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'under_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Correction Requested', value: 'correction_requested' },
      ],
      placeholder: 'All Statuses',
    },
  ];

  const tableColumns = [
    'Indicator / Disclosure',
    'Entity / Scope',
    'Contributor',
    'Reviewer',
    'Priority',
    'Deadline',
    'Status',
    'Actions',
  ];

  const filteredAssignments = assignments.filter((a) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const codeMatch = a.indicatorCode.toLowerCase().includes(q);
      const nameMatch = a.indicatorName.toLowerCase().includes(q);
      const orgMatch = (organizations.find((o) => o.id === a.orgId)?.name || '').toLowerCase().includes(q);
      const contrib = (users.find((u) => u.id === a.contributorId)?.name || '').toLowerCase().includes(q);
      if (!codeMatch && !nameMatch && !orgMatch && !contrib) return false;
    }
    if (filters.section && a.brsrSection !== filters.section) return false;
    if (filters.principle && a.brsrPrinciple !== filters.principle) return false;
    if (filters.status && a.status !== filters.status) return false;
    return true;
  });

  const handleQuickReminder = (assignmentId: string, indicatorCode: string) => {
    sendDeadlineReminder(assignmentId, `ESG Administrator reminder: please complete disclosure data for ${indicatorCode}.`);
    addToast(`Deadline reminder sent for ${indicatorCode}`, 'success');
  };

  const handleQuickAdvance = (assignmentId: string) => {
    updateAssignmentStatus(assignmentId, 'approved');
    addToast(`Assignment ${assignmentId} marked as approved.`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Task & Responsibility Assignment Matrix"
        description="Delegate ESG disclosure line items, data collection forms, and review assignments across departments, plants, and subsidiaries."
        actionText="Create Assignment"
        actionIcon={Plus}
        onAction={() => setIsModalOpen(true)}
        extraControls={
          <button
            type="button"
            onClick={() => setIsReminderOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-xs transition-all"
          >
            <Send className="w-4 h-4 text-[#003B73]" />
            <span>Send Reminder</span>
          </button>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        searchPlaceholder="Search assignments by code, name, plant, or owner..."
        searchValue={search}
        onSearchChange={setSearch}
        filters={filterOptions}
        activeFilterValues={filters}
        onFilterChange={(k, v) => setFilters((prev) => ({ ...prev, [k]: v }))}
        onResetFilters={() => {
          setSearch('');
          setFilters({});
        }}
      />

      {/* Assignments Table Shell */}
      <DataTableShell
        columns={tableColumns}
        emptyIcon={ClipboardList}
        emptyTitle="No task assignments found"
        emptyDescription="Create reporting cycles and task assignments to allocate ESG data points to plant contributors."
        emptyActionText="Create Assignment"
        onEmptyAction={() => setIsModalOpen(true)}
      >
        {filteredAssignments.map((assignment) => {
          const org = organizations.find((o) => o.id === assignment.orgId);
          const contributor = users.find((u) => u.id === assignment.contributorId);
          const reviewer = users.find((u) => u.id === (assignment.reviewerId || 'u_reviewer_1'));
          const indicator = indicators.find((i) => i.code === assignment.indicatorCode);

          return (
            <tr key={assignment.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-4 py-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#003B73] px-2 py-0.5 bg-sky-50 border border-sky-200 rounded">
                    {assignment.indicatorCode}
                  </span>
                  {assignment.isBrsrCore && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                      SEBI Core
                    </span>
                  )}
                </div>
                <div className="font-semibold text-slate-800 mt-1 max-w-xs truncate" title={assignment.indicatorName}>
                  {assignment.indicatorName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {assignment.brsrSection} • {assignment.brsrPrinciple} • {indicator?.category || 'General'}
                </div>
              </td>

              <td className="px-4 py-3.5 text-xs text-slate-700">
                <div className="font-medium text-slate-900">{org?.name || 'MEIL Group'}</div>
                <div className="text-[11px] text-slate-400">{org?.type || 'Entity'} • {org?.location || 'India'}</div>
              </td>

              <td className="px-4 py-3.5 text-xs text-slate-700">
                <div className="font-medium text-slate-900 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{contributor?.name || 'Unassigned'}</span>
                </div>
                <div className="text-[11px] text-slate-400">{contributor?.department || 'Operations'}</div>
              </td>

              <td className="px-4 py-3.5 text-xs text-slate-700">
                <div className="font-medium text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>{reviewer?.name || 'Quality Reviewer'}</span>
                </div>
                <div className="text-[11px] text-slate-400">{reviewer?.email || 'reviewer@demo.com'}</div>
              </td>

              <td className="px-4 py-3.5 text-xs">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    assignment.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : assignment.priority === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {assignment.priority}
                </span>
              </td>

              <td className="px-4 py-3.5 text-xs text-slate-600 font-mono">
                {assignment.dueDate}
              </td>

              <td className="px-4 py-3.5 text-xs">
                <StatusBadge status={assignment.status} />
              </td>

              <td className="px-4 py-3.5 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickReminder(assignment.id, assignment.indicatorCode)}
                    title="Send Contributor Reminder"
                    className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  >
                    <BellRing className="w-4 h-4" />
                  </button>
                  {assignment.status !== 'approved' && assignment.status !== 'locked' && (
                    <button
                      type="button"
                      onClick={() => handleQuickAdvance(assignment.id)}
                      title="Direct Admin Sign-off / Approve"
                      className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </DataTableShell>

      {/* Modals */}
      <CreateAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onShowToast={addToast}
      />
      <SendReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        onShowToast={addToast}
      />
    </div>
  );
};
