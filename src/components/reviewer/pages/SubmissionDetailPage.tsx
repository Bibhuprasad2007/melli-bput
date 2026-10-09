import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileCheck2,
  Building2,
  Calendar,
  Layers,
  Send,
  Info,
  Clock,
  ShieldCheck,
  RotateCcw,
  User,
  Paperclip,
  Check,
  HelpCircle,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useNexusData, type ESGSubmissionRowItem } from '../../../context/NexusDataContext';
import { RequestRowCorrectionModal } from '../modals/RequestRowCorrectionModal';

export const SubmissionDetailPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const {
    dossiers,
    assignments,
    users,
    organizations,
    markRowCorrect,
    requestRowCorrection,
  } = useNexusData();

  // Find dossier by ID or by projectId matching assignmentId
  const currentDossier = useMemo(() => {
    return (
      dossiers.find((d) => d.dossierId === assignmentId) ||
      dossiers.find((d) => d.projectId === assignmentId) ||
      dossiers[0]
    );
  }, [dossiers, assignmentId]);

  // Tab filter inside submission detail
  const [activePrincipleTab, setActivePrincipleTab] = useState<number | 'ALL'>('ALL');
  const [rowStatusFilter, setRowStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'CORRECTION_REQUIRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Row correction modal
  const [selectedCorrectionRow, setSelectedCorrectionRow] = useState<ESGSubmissionRowItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!currentDossier) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Submission Detail"
          description="Detailed view of a selected BRSR disclosure dossier."
        />
        <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-3">
          <FileSearch className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No submission found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The requested submission does not exist or has not yet been submitted by the Data Contributor.
          </p>
          <button
            type="button"
            onClick={() => navigate('/reviewer/review-queue')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#003B73] rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Review Queue</span>
          </button>
        </div>
      </div>
    );
  }

  const rowsList: ESGSubmissionRowItem[] = Object.values(currentDossier.rows || {});

  // Computed summary metrics for this specific submission
  const totalCount = currentDossier.totalRows || rowsList.length || 1;
  const verifiedCount = rowsList.filter((r) => r.reviewStatus === 'VERIFIED').length;
  const correctionCount = rowsList.filter((r) => r.reviewStatus === 'CORRECTION_REQUIRED').length;
  const pendingCount = rowsList.filter(
    (r) => r.reviewStatus === 'SUBMITTED' || r.reviewStatus === 'UNDER_REVIEW' || r.reviewStatus === 'RESUBMITTED'
  ).length;

  // Filtered rows for the table
  const filteredRows = rowsList.filter((r) => {
    if (activePrincipleTab !== 'ALL' && r.principleId !== activePrincipleTab) return false;
    if (rowStatusFilter === 'VERIFIED' && r.reviewStatus !== 'VERIFIED') return false;
    if (rowStatusFilter === 'CORRECTION_REQUIRED' && r.reviewStatus !== 'CORRECTION_REQUIRED') return false;
    if (rowStatusFilter === 'PENDING' && (r.reviewStatus === 'VERIFIED' || r.reviewStatus === 'CORRECTION_REQUIRED')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCode = (r.id || '').toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }
    return true;
  });

  const handleCorrectRow = (row: ESGSubmissionRowItem) => {
    const res = markRowCorrect(currentDossier.dossierId, row.id, 'Aarav Patel (Review Lead)');
    if (res.success) {
      showToast(`✓ Row "${row.name}" verified and published to authorized Auditor view!`);
    } else {
      showToast(res.message, 'warning');
    }
  };

  const handleOpenCorrection = (row: ESGSubmissionRowItem) => {
    setSelectedCorrectionRow(row);
  };

  const handleConfirmCorrection = (details: {
    category: string;
    reason: string;
    suggestedCorrection?: string;
    supportingComment?: string;
  }) => {
    if (!selectedCorrectionRow) return;

    const res = requestRowCorrection(currentDossier.dossierId, selectedCorrectionRow.id, {
      ...details,
      reviewerName: 'Aarav Patel (Review Lead)',
    });

    setSelectedCorrectionRow(null);
    if (res.success) {
      showToast(`Correction request dispatched to Data Contributor for "${selectedCorrectionRow.name}".`);
    } else {
      showToast(res.message, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/reviewer/review-queue"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Review Queue</span>
        </Link>

        <span className="text-xs text-slate-400 font-mono">
          Dossier ID: <strong className="text-slate-700">{currentDossier.dossierId}</strong>
        </span>
      </div>

      {toastMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold shadow-md ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-amber-900 text-white border-amber-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Submission Header Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
                Statutory Reporting Package
              </span>
              <span className="text-xs text-slate-500 font-medium">SEBI BRSR Principles 1 to 9</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {currentDossier.projectName}
            </h2>
            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 font-medium">
              <span>Code: <strong className="text-slate-700 font-mono">{currentDossier.projectCode}</strong></span>
              <span>&bull;</span>
              <span>Site: <strong className="text-slate-700">{currentDossier.siteName}</strong></span>
              <span>&bull;</span>
              <span>Period: <strong className="text-slate-700">{currentDossier.monthName} ({currentDossier.financialYear})</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Submission Status</span>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  currentDossier.status === 'Fully Reviewed'
                    ? 'text-teal-700'
                    : currentDossier.status === 'Changes Requested'
                    ? 'text-rose-600'
                    : currentDossier.status === 'Partially Reviewed'
                    ? 'text-indigo-600'
                    : 'text-amber-600'
                }`}
              >
                {currentDossier.status}
              </span>
            </div>

            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-right">
              <span className="block text-[10px] uppercase font-bold text-slate-400">Submitting User</span>
              <span className="text-xs font-semibold text-slate-800">{currentDossier.submittingUser}</span>
            </div>
          </div>
        </div>

        {/* Verification Progress Bar & Row Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Indicators</span>
            <span className="text-lg font-bold text-slate-900">{totalCount}</span>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80">
            <span className="text-emerald-700 block text-[10px] uppercase font-bold">Verified Rows</span>
            <span className="text-lg font-bold text-emerald-800">{verifiedCount}</span>
            <span className="text-[10px] text-emerald-600 block">Published to Auditor</span>
          </div>

          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
            <span className="text-amber-700 block text-[10px] uppercase font-bold">Pending Decisions</span>
            <span className="text-lg font-bold text-amber-800">{pendingCount}</span>
            <span className="text-[10px] text-amber-600 block">Awaiting Reviewer action</span>
          </div>

          <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/80">
            <span className="text-rose-700 block text-[10px] uppercase font-bold">Correction Required</span>
            <span className="text-lg font-bold text-rose-800">{correctionCount}</span>
            <span className="text-[10px] text-rose-600 block">Sent to Contributor Center</span>
          </div>
        </div>
      </div>

      {/* Principle Tabs & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search indicators by name or code..."
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-700"
            />
          </div>

          {/* Row Status Filter */}
          <div className="flex items-center gap-1">
            {(['ALL', 'PENDING', 'VERIFIED', 'CORRECTION_REQUIRED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setRowStatusFilter(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  rowStatusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL'
                  ? 'All Rows'
                  : st === 'PENDING'
                  ? `Pending (${pendingCount})`
                  : st === 'VERIFIED'
                  ? `Verified (${verifiedCount})`
                  : `Changes (${correctionCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* 9 Principles Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-slate-100 pt-2.5">
          <button
            type="button"
            onClick={() => setActivePrincipleTab('ALL')}
            className={`px-3 py-1 rounded-lg font-bold text-xs shrink-0 transition-colors ${
              activePrincipleTab === 'ALL'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Principles (9)
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pNum) => (
            <button
              key={pNum}
              type="button"
              onClick={() => setActivePrincipleTab(pNum)}
              className={`px-3 py-1 rounded-lg font-bold text-xs shrink-0 transition-colors ${
                activePrincipleTab === pNum
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              P{pNum}
            </button>
          ))}
        </div>
      </div>

      {/* Complete Submitted ESG Table with Row-Level Actions */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-3.5 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Indicator Name &amp; Description</th>
                <th className="px-3 py-3 text-center">Unit</th>
                <th className="px-3 py-3 text-center">Previous Month</th>
                <th className="px-3 py-3 text-center">Submitted Value</th>
                <th className="px-3 py-3 text-center">Evidence</th>
                <th className="px-4 py-3 text-left">Contributor Remarks</th>
                <th className="px-3 py-3 text-center">Row Status</th>
                <th className="px-4 py-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRows.map((row) => {
                const isVerified = row.reviewStatus === 'VERIFIED';
                const isCorrection = row.reviewStatus === 'CORRECTION_REQUIRED';
                const isPending = !isVerified && !isCorrection;

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isVerified ? 'bg-emerald-50/20' : isCorrection ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="px-3.5 py-3.5 font-mono font-bold text-slate-700 whitespace-nowrap">
                      {row.id}
                      {row.version && row.version > 1 && (
                        <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                          v{row.version}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-bold text-slate-900 leading-tight">{row.name}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{row.description}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-600">{row.principleTitle}</span>
                        {row.isBrsrCore && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[9px]">
                            BRSR CORE
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-center text-slate-500 font-medium">
                      {row.unit}
                    </td>

                    <td className="px-3 py-3.5 text-center font-mono text-slate-500">
                      {row.previousMonthValue}
                    </td>

                    <td className="px-3 py-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-md font-mono font-bold bg-slate-100 border border-slate-200 text-slate-900 text-xs">
                        {row.currentValue}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      {row.evidenceFiles && row.evidenceFiles.length > 0 ? (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
                          title={row.evidenceFiles[0]?.name}
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                          <span>{row.evidenceFiles.length} file(s)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">None</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 max-w-[200px]">
                      <span className="text-[11px] text-slate-600 block line-clamp-2">
                        {row.remarks || '--'}
                      </span>
                      {row.reviewerDecision?.correctionReason && (
                        <div className="mt-1 p-1.5 rounded bg-rose-50 border border-rose-200 text-[10px] text-rose-800">
                          <strong>Rejection Note:</strong> {row.reviewerDecision.correctionReason}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3.5 text-center whitespace-nowrap">
                      {isVerified ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Verified
                        </span>
                      ) : isCorrection ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                          ✕ Correction Req
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                          Pending Review
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Correct button */}
                        <button
                          type="button"
                          onClick={() => handleCorrectRow(row)}
                          disabled={isVerified}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            isVerified
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs'
                          }`}
                          title={isVerified ? 'Row verified and published' : 'Mark row as Correct and publish to Auditor'}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </button>

                        {/* Incorrect button */}
                        <button
                          type="button"
                          onClick={() => handleOpenCorrection(row)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 active:scale-95 shadow-xs"
                          title="Require correction from Data Contributor"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Incorrect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Correction Modal */}
      {selectedCorrectionRow && (
        <RequestRowCorrectionModal
          isOpen={Boolean(selectedCorrectionRow)}
          onClose={() => setSelectedCorrectionRow(null)}
          rowName={selectedCorrectionRow.name}
          rowCode={selectedCorrectionRow.id}
          currentValue={selectedCorrectionRow.currentValue}
          unit={selectedCorrectionRow.unit}
          onConfirm={handleConfirmCorrection}
        />
      )}
    </div>
  );
};
