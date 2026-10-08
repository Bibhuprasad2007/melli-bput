import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Search,
  UploadCloud,
  FileText,
  RotateCcw,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useContributorData } from '../context/ContributorDataContext';
import { findFieldById } from '../data/contributorPrinciplesData';
import { EvidenceUploadModal } from '../modals/EvidenceUploadModal';

export const ContributorCorrectionsPage: React.FC = () => {
  const {
    corrections,
    fieldEntries,
    updateFieldEntry,
    attachEvidenceToField,
    respondToCorrection,
    activeScope,
  } = useContributorData();

  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeCorrectionId, setActiveCorrectionId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [contributorNote, setContributorNote] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const activeCorrection = corrections.find((c) => c.id === activeCorrectionId);

  const pendingCount = corrections.filter((c) => c.status === 'PENDING_CONTRIBUTOR').length;
  const resubmittedCount = corrections.filter((c) => c.status === 'RESUBMITTED').length;
  const resolvedCount = corrections.filter((c) => c.status === 'RESOLVED').length;

  const filteredCorrections = corrections.filter((c) => {
    const matchesSearch =
      c.fieldLabel.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.reviewerComment.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.principle.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'pending' && c.status === 'PENDING_CONTRIBUTOR') ||
      (selectedStatus === 'resubmitted' && c.status === 'RESUBMITTED') ||
      (selectedStatus === 'resolved' && c.status === 'RESOLVED');
    return matchesSearch && matchesStatus;
  });

  const handleOpenCorrection = (corrId: string) => {
    const corr = corrections.find((c) => c.id === corrId);
    if (!corr) return;
    setActiveCorrectionId(corrId);
    const currEntry = fieldEntries[corr.fieldId];
    setEditValue(currEntry?.value ? String(currEntry.value) : '');
    setContributorNote(corr.contributorResponse || '');
    setActionSuccessMessage(null);
  };

  const handleSaveAndResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCorrection) return;

    if (!contributorNote.trim()) {
      alert('Please provide a contributor explanation before resubmitting.');
      return;
    }

    // 1. Update field value
    updateFieldEntry(activeCorrection.fieldId, {
      value: editValue,
      anomalyExplanation: contributorNote,
      status: 'RESUBMITTED',
    });

    // 2. Mark correction as resubmitted
    respondToCorrection(activeCorrection.id, contributorNote);

    setActionSuccessMessage(`Successfully resubmitted ${activeCorrection.fieldLabel} for Reviewer audit!`);
    setTimeout(() => {
      setActiveCorrectionId(null);
      setActionSuccessMessage(null);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Returned Corrections & Action Items"
        description="Reviewer-flagged ESG values, anomaly inquiries, and missing audit documents requiring contributor action and resubmission."
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Action Required"
          value={pendingCount.toString()}
          icon={AlertTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accentBorder="border-l-amber-500"
        />
        <MetricCard
          title="Resubmitted for Review"
          value={resubmittedCount.toString()}
          icon={Send}
          iconBg="bg-teal-50"
          iconColor="text-teal-700"
          accentBorder="border-l-teal-600"
        />
        <MetricCard
          title="Resolved & Verified"
          value={resolvedCount.toString()}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorder="border-l-emerald-500"
        />
        <MetricCard
          title="Active Project Scope"
          value={activeScope.projectCode}
          icon={Clock}
          iconBg="bg-slate-50"
          iconColor="text-slate-600"
          accentBorder="border-l-slate-400"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search corrections by indicator or reviewer comment..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-700 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
          >
            <option value="all">All Statuses ({corrections.length})</option>
            <option value="pending">Action Required ({pendingCount})</option>
            <option value="resubmitted">Resubmitted ({resubmittedCount})</option>
            <option value="resolved">Resolved ({resolvedCount})</option>
          </select>

          {(searchValue || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                setSelectedStatus('all');
              }}
              title="Reset filters"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Corrections List */}
      <div className="space-y-4">
        {filteredCorrections.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No Pending Corrections</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              All submitted data points have been reviewed and approved by the ESG Reviewer. No discrepancies are currently open for this project.
            </p>
          </div>
        ) : (
          filteredCorrections.map((corr) => {
            const entry = fieldEntries[corr.fieldId];
            const isPending = corr.status === 'PENDING_CONTRIBUTOR';

            return (
              <div
                key={corr.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-xs ${
                  isPending
                    ? 'border-amber-300 ring-1 ring-amber-200/60 hover:shadow-md'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isPending ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'
                      }`}
                    >
                      {isPending ? <ShieldAlert className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{corr.fieldLabel}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {corr.principle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Requested by <strong>{corr.reviewerName}</strong> on {corr.requestedDate} • Deadline: {corr.deadline}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isPending ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                        Action Required
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-300">
                        Resubmitted
                      </span>
                    )}
                  </div>
                </div>

                {/* Reviewer Comment Box */}
                <div className="mt-3.5 bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reviewer Comment:</span>
                  </div>
                  <p className="leading-relaxed">{corr.reviewerComment}</p>
                </div>

                {/* Current Value & Evidence Status */}
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Entered Value</span>
                    <span className="font-bold text-slate-800">
                      {entry?.value ? `${entry.value} ${entry.unit || ''}` : 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Attached Evidence</span>
                    <span className="font-semibold text-teal-700">
                      {entry?.evidence && entry.evidence.length > 0
                        ? `${entry.evidence.length} file(s) attached`
                        : 'No evidence attached'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Reporting Boundary</span>
                    <span className="text-slate-700">{activeScope.siteName}</span>
                  </div>
                </div>

                {/* Contributor Action Strip */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500">
                    {corr.contributorResponse && (
                      <span>Last Response: <em>&quot;{corr.contributorResponse}&quot;</em></span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenCorrection(corr.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isPending ? 'Resolve & Resubmit' : 'View / Edit Response'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution & Resubmission Modal */}
      {activeCorrection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Correction Workflow
                </span>
                <h3 className="text-base font-bold text-white">{activeCorrection.fieldLabel}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCorrectionId(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveAndResubmit} className="p-6 space-y-4 text-xs">
              {actionSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* Reviewer Comment Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-900 space-y-1">
                <span className="font-bold flex items-center gap-1 text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Reviewer Inquiry from {activeCorrection.reviewerName}:
                </span>
                <p className="leading-relaxed">{activeCorrection.reviewerComment}</p>
              </div>

              {/* Field Value Adjustment */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adjusted Value ({fieldEntries[activeCorrection.fieldId]?.unit || 'Metric'}):
                </label>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:bg-white focus:outline-none focus:border-teal-700"
                  placeholder="Enter corrected value..."
                />
              </div>

              {/* Inline Document Upload Trigger */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 block">Supporting Evidence Document:</span>
                  <p className="text-[11px] text-slate-500">
                    {fieldEntries[activeCorrection.fieldId]?.evidence?.length
                      ? `${fieldEntries[activeCorrection.fieldId]?.evidence.length} file(s) attached`
                      : 'Attach calibrated meter log or invoice'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-teal-700" />
                  <span>Upload Document</span>
                </button>
              </div>

              {/* Contributor Explanation Textarea */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contributor Response & Justification: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={contributorNote}
                  onChange={(e) => setContributorNote(e.target.value)}
                  placeholder="Explain why the value was adjusted or clarify operational anomaly (e.g. 'Calibrated meter log attached. Auxiliary pump utilized during excavation dewatering.')..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700 leading-relaxed"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveCorrectionId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Resubmit to Reviewer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal (if triggered from within resolution) */}
      {showUploadModal && activeCorrection && (
        <EvidenceUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          field={
            findFieldById(activeCorrection.fieldId) || {
              id: activeCorrection.fieldId,
              code: activeCorrection.fieldId,
              label: activeCorrection.fieldLabel,
              category: 'General',
              principle: 'P6',
              section: 'Section C',
              type: 'number',
              unit: 'Metric',
              required: true,
              essentialOrLeadership: 'Essential',
              requiredEvidenceName: 'Supporting Document / Calibration Slip',
              acceptedFileTypes: 'PDF, XLSX, CSV, JPG',
              description: activeCorrection.fieldLabel,
            }
          }
          currentValue={editValue}
          onUploadSuccess={(evData) => {
            attachEvidenceToField(activeCorrection.fieldId, evData);
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
};
