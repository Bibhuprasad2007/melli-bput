import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Activity,
  CheckCircle2,
  Clock,
  RotateCcw,
  Send,
  Eye,
  Search,
  Layers,
  Building,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { DataTableShell } from '../common/DataTableShell';
import { useNexusData, type Assignment } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const BRSRControlCenterPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const {
    assignments,
    users,
    organizations,
    submissions,
    evidence,
    updateAssignmentStatus,
    sendDeadlineReminder,
    approveSubmission,
  } = useNexusData();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Assignment | null>(null);

  const total = assignments.length;
  const draft = assignments.filter((a) => a.status === 'draft').length;
  const underReview = assignments.filter((a) => a.status === 'under_review' || a.status === 'submitted').length;
  const approved = assignments.filter((a) => a.status === 'approved' || a.status === 'audited' || a.status === 'management_pending').length;

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === 'pending' && a.status !== 'draft') return false;
    if (activeTab === 'review' && a.status !== 'under_review' && a.status !== 'submitted') return false;
    if (activeTab === 'corrections' && a.status !== 'correction_requested') return false;
    if (activeTab === 'approved' && a.status !== 'approved' && a.status !== 'audited' && a.status !== 'management_pending') return false;

    if (selectedEntity !== 'all' && a.orgId !== selectedEntity) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const codeMatch = a.indicatorCode.toLowerCase().includes(q);
      const nameMatch = a.indicatorName.toLowerCase().includes(q);
      const orgName = (organizations.find((o) => o.id === a.orgId)?.name || '').toLowerCase();
      if (!codeMatch && !nameMatch && !orgName.includes(q)) return false;
    }
    return true;
  });

  const handleSendReminder = (id: string, code: string) => {
    sendDeadlineReminder(id, `ESG Admin reminder for disclosure ${code}`);
    addToast(`Reminder dispatched to data contributor for ${code}`, 'success');
  };

  const handleAdminApprove = (id: string, code: string) => {
    approveSubmission(id, 'ESG Admin', 'Direct admin authorization applied.');
    addToast(`Submission ${code} approved by Admin.`, 'success');
  };

  const handleReturnCorrection = (id: string, code: string) => {
    updateAssignmentStatus(id, 'correction_requested');
    addToast(`Submission ${code} returned to contributor for revision.`, 'warning');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="BRSR Workflow Control Center"
        description="Unified live orchestration across Contributors, Reviewers, Auditors, and Management. Real-time submission status, SLA tracking, and audit verification."
      />

      {/* Workflow Stage Pipeline Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'all'
              ? 'bg-[#003B73] text-white border-[#003B73] shadow-sm'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">
            <span>Total Disclosures</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-[11px] opacity-75 mt-1">Across all MEIL entities</div>
        </div>

        <div
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">
            <span>Data Entry Pending</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold">{draft}</div>
          <div className="text-[11px] opacity-75 mt-1">With plant contributors</div>
        </div>

        <div
          onClick={() => setActiveTab('review')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'review'
              ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">
            <span>Review & Audit Queue</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold">{underReview}</div>
          <div className="text-[11px] opacity-75 mt-1">Quality verification stage</div>
        </div>

        <div
          onClick={() => setActiveTab('approved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'approved'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold mb-1 opacity-80 uppercase tracking-wider">
            <span>Verified & Approved</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold">{approved}</div>
          <div className="text-[11px] opacity-75 mt-1">Ready for board sign-off</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by indicator code, name, or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
            />
          </div>

          <div className="w-48 sm:w-64">
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
            >
              <option value="all">All Subsidiaries & Sites</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredAssignments.length}</span> submissions
        </div>
      </div>

      {/* Submissions Pipeline Table */}
      <DataTableShell
        columns={[
          'Disclosure Line Item',
          'Reporting Scope / Entity',
          'Reported Value',
          'Supporting Evidence',
          'Workflow Stage',
          'Quick Actions',
        ]}
        emptyTitle="No submissions match criteria"
        emptyDescription="Change filters or search terms to inspect other workflow records."
      >
        {filteredAssignments.map((assignment) => {
          const org = organizations.find((o) => o.id === assignment.orgId);
          const subData = submissions.find((s) => s.assignmentId === assignment.id);
          const attachedEvidence = evidence.filter((e) => subData?.evidenceIds?.includes(e.id));
          const contributor = users.find((u) => u.id === assignment.contributorId);

          return (
            <tr key={assignment.id} className="hover:bg-slate-50/70 transition-colors">
              <td className="px-4 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#003B73] px-2 py-0.5 bg-sky-50 rounded border border-sky-200">
                    {assignment.indicatorCode}
                  </span>
                  {assignment.isBrsrCore && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      SEBI Core
                    </span>
                  )}
                </div>
                <div className="font-semibold text-slate-900 mt-1 max-w-xs truncate" title={assignment.indicatorName}>
                  {assignment.indicatorName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {assignment.brsrSection} • {assignment.brsrPrinciple} • Contributor: {contributor?.name || 'Assigned'}
                </div>
              </td>

              <td className="px-4 py-3 text-xs text-slate-700">
                <div className="font-semibold text-slate-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{org?.name || 'MEIL Enterprise'}</span>
                </div>
                <div className="text-[11px] text-slate-400">{org?.type || 'Entity'} • {org?.location || 'India'}</div>
              </td>

              <td className="px-4 py-3 text-xs">
                {subData ? (
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {typeof subData.value === 'number' ? subData.value.toLocaleString() : subData.value}
                    </span>{' '}
                    <span className="text-slate-500 font-medium">{subData.unit}</span>
                    {subData.yoyVariancePercent !== undefined && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        YoY: {subData.yoyVarianceDirection === 'increase' ? '+' : '-'}
                        {subData.yoyVariancePercent}% vs FY25
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No value submitted yet</span>
                )}
              </td>

              <td className="px-4 py-3 text-xs">
                {attachedEvidence.length > 0 ? (
                  <div className="space-y-0.5">
                    {attachedEvidence.map((ev) => (
                      <div key={ev.id} className="text-[11px] text-slate-700 flex items-center gap-1 truncate max-w-[180px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{ev.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Evidence Required
                  </span>
                )}
              </td>

              <td className="px-4 py-3 text-xs">
                <StatusBadge status={assignment.status} />
                <div className="text-[10px] text-slate-400 mt-1 font-mono">Due: {assignment.dueDate}</div>
              </td>

              <td className="px-4 py-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(assignment)}
                    title="View Inspection Drawer"
                    className="p-1.5 text-slate-600 hover:text-[#003B73] hover:bg-sky-50 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendReminder(assignment.id, assignment.indicatorCode)}
                    title="Dispatch Deadline Reminder"
                    className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>

                  {assignment.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => handleAdminApprove(assignment.id, assignment.indicatorCode)}
                      title="Admin Direct Approve"
                      className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}

                  {assignment.status === 'under_review' && (
                    <button
                      type="button"
                      onClick={() => handleReturnCorrection(assignment.id, assignment.indicatorCode)}
                      title="Request Correction"
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </DataTableShell>

      {/* Modal / Inspection Details Drawer */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#003B73] px-2 py-0.5 bg-sky-50 rounded border border-sky-200">
                  {selectedSubmission.indicatorCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedSubmission.indicatorName}</h3>
                <p className="text-xs text-slate-500">
                  {selectedSubmission.brsrSection} • {selectedSubmission.brsrPrinciple} • Priority: {selectedSubmission.priority}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Submission values and calculation details */}
            {(() => {
              const sub = submissions.find((s) => s.assignmentId === selectedSubmission.id);
              const org = organizations.find((o) => o.id === selectedSubmission.orgId);
              return (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Reporting Entity</span>
                      <span className="font-semibold text-slate-800">{org?.name}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Reporting Status</span>
                      <StatusBadge status={selectedSubmission.status} />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Recorded Value</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {sub ? `${sub.value} ${sub.unit}` : 'Not yet entered'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Reporting Period</span>
                      <span className="font-semibold text-slate-800">{selectedSubmission.reportingPeriod}</span>
                    </div>
                  </div>

                  {sub?.calculationSteps && sub.calculationSteps.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-semibold text-slate-800 text-xs block">Audit Calculation Formula Steps</span>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 font-mono text-[11px]">
                        {sub.calculationSteps.map((step, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-slate-600">{step.label}:</span>
                            <span className="font-semibold text-[#003B73]">{step.value || step.outputValue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sub?.comments && (
                    <div>
                      <span className="font-semibold text-slate-800 text-xs block mb-1">Contributor Remarks</span>
                      <p className="bg-amber-50/60 border border-amber-200 p-2.5 rounded-lg text-amber-900 text-xs leading-relaxed">
                        {sub.comments}
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        handleReturnCorrection(selectedSubmission.id, selectedSubmission.indicatorCode);
                        setSelectedSubmission(null);
                      }}
                      className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      Return for Correction
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleAdminApprove(selectedSubmission.id, selectedSubmission.indicatorCode);
                        setSelectedSubmission(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                      Admin Sign-Off & Approve
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
