import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNexusData } from '../../../context/NexusDataContext';
import {
  FileSearch,
  FileText,
  MessageSquare,
  ClipboardCheck,
  AlertTriangle,
  Paperclip,
  CheckCircle2,
  XCircle,
  CornerDownLeft,
  Info,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { EmptyState } from '../../admin/common/EmptyState';

type DetailTab = 'submitted-data' | 'validation-checks' | 'evidence' | 'comments' | 'decision';

const TABS: { id: DetailTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'submitted-data', label: 'Submitted Data', icon: FileText },
  { id: 'validation-checks', label: 'Validation Checks', icon: ClipboardCheck },
  { id: 'evidence', label: 'Evidence & Attachments', icon: Paperclip },
  { id: 'comments', label: 'Review Comments', icon: MessageSquare },
  { id: 'decision', label: 'Review Decision', icon: CheckCircle2 },
];

export const SubmissionDetailPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { assignments, submissions, users, organizations, approveSubmission, requestCorrection, rejectSubmission } = useNexusData();

  const [activeTab, setActiveTab] = useState<DetailTab>('submitted-data');
  const [decisionRemarks, setDecisionRemarks] = useState('');

  const currentAssignment = assignments.find(a => a.id === assignmentId);
  const currentSubmission = submissions.find(s => s.assignmentId === assignmentId);
  const currentUser = users.find(u => u.id === 'u_rev'); // assuming reviewer user
  const reviewerName = currentUser?.name;  
  const contributor = users.find(u => u.id === currentAssignment?.contributorId);
  const org = organizations.find(o => o.id === currentAssignment?.orgId);

  const handleDecision = (status: 'approved' | 'rejected' | 'correction_requested') => {
    if (!currentAssignment) return;
    if (status === 'approved') {
      approveSubmission(currentAssignment.id, reviewerName, decisionRemarks);
    } else if (status === 'rejected') {
      rejectSubmission(currentAssignment.id, decisionRemarks || 'Rejected by reviewer', reviewerName, decisionRemarks);
    } else if (status === 'correction_requested') {
      requestCorrection(currentAssignment.id, {
        problem: 'Data issue requiring correction',
        requiredCorrection: 'Provide correct data and supporting evidence',
        evidenceNeeded: 'Additional documents if needed',
        deadline: new Date().toISOString().split('T')[0],
        comment: decisionRemarks,
        reviewerName,
      });
    }
    navigate('/reviewer/review-queue');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submission Detail"
        description="Detailed view of a selected BRSR disclosure submission. Review submitted data, validation checks, evidence documents, and record your review decision."
      />

      {/* Submission Header Info Panel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
            <FileSearch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              {currentAssignment ? `Submission: ${currentAssignment.indicatorName}` : 'No Submission Selected'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentAssignment ? `Task ID: ${currentAssignment.id}` : 'Select a submission from the Review Queue to view its complete details here.'}
            </p>
          </div>
        </div>

        {/* Submission Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 border-t border-slate-100 pt-4">
          {[
            { label: 'Disclosure Code', value: currentAssignment?.indicatorCode || '--' },
            { label: 'Reporting Period', value: currentAssignment?.reportingPeriod || '--' },
            { label: 'Contributor', value: contributor?.name || '--' },
            { label: 'Review Status', value: currentAssignment?.status.replace('_', ' ').toUpperCase() || '--' },
            { label: 'Company / Entity', value: org?.name || '--' },
            { label: 'Due Date', value: currentAssignment?.dueDate || '--' },
          ].map((field) => (
            <div key={field.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
                {field.label}
              </p>
              <p className="text-xs font-medium text-slate-700">{field.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 overflow-x-auto">
          <nav className="flex" aria-label="Submission detail tabs">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#003B73] text-[#003B73] font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'submitted-data' && (
            currentSubmission ? (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Reported Values</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 uppercase">Value</label>
                    <p className="text-base font-medium">{currentSubmission.value}</p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase">Unit</label>
                    <p className="text-base font-medium">{currentSubmission.unit}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-slate-500 uppercase">Comments/Remarks</label>
                    <p className="text-sm">{currentSubmission.comments || 'No remarks.'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No Submitted Data"
                description="Submitted field values will appear here once a submission is loaded."
              />
            )
          )}

          {activeTab === 'validation-checks' && (
            <EmptyState
              icon={ClipboardCheck}
              title="No Validation Results"
              description="Automated validation check results (completeness, threshold, format, cross-disclosure consistency) will display here after backend validation rules execute."
            />
          )}

          {activeTab === 'evidence' && (
            <EmptyState
              icon={Paperclip}
              title="No Evidence Documents"
              description="Uploaded supporting documents, certificates, third-party reports, and audit evidence will be listed here with verification status once connected to the file storage backend."
            />
          )}

          {activeTab === 'comments' && (
            <div className="space-y-6">
              <EmptyState
                icon={MessageSquare}
                title="No Review Comments"
                description="The review comment thread for this submission will appear here. Comments from reviewers and contributors will be displayed chronologically."
                compact
              />

              {/* Comment Input (Disabled - Backend Required) */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0 mt-1">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      disabled
                      placeholder="Type a review comment… (Requires backend connection)"
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-400 placeholder-slate-400 cursor-not-allowed resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Info className="w-3 h-3" />
                        <span>Comments require backend service integration</span>
                      </div>
                      <button
                        type="button"
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#003B73] rounded-lg opacity-50 cursor-not-allowed"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                        <span>Post Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'decision' && (
            <div className="space-y-6">
              <EmptyState
                icon={CheckCircle2}
                title="No Review Decision"
                description="Record your review decision (Approve, Request Correction, or Reject) for the selected submission. All actions require backend service integration."
                compact
              />

              {/* Decision Actions */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleDecision('approved')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Submission</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('correction_requested')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Request Correction</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('rejected')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Submission</span>
                  </button>
                </div>

                {/* Decision Comment */}
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Decision Remarks
                  </label>
                  <textarea
                    value={decisionRemarks}
                    onChange={(e) => setDecisionRemarks(e.target.value)}
                    placeholder="Provide justification for your review decision…"
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:border-teal-700"
                  />
                </div>

                {/* Correction Category Selector */}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Correction Category (if applicable)
                  </label>
                  <select
                    disabled
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed"
                  >
                    <option>Select correction category…</option>
                    <option>Data Accuracy</option>
                    <option>Missing Evidence</option>
                    <option>Methodology Mismatch</option>
                    <option>Unit Conversion Error</option>
                    <option>Incomplete Disclosure</option>
                    <option>Cross-Disclosure Inconsistency</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
