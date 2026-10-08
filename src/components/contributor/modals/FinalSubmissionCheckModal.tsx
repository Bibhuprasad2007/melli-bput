import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Send,
  Building,
} from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { useContributorData } from '../context/ContributorDataContext';
import { PRINCIPLES_CONFIG } from '../data/contributorPrinciplesData';

interface FinalSubmissionCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
}

export const FinalSubmissionCheckModal: React.FC<FinalSubmissionCheckModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
}) => {
  const { activeScope, getCompletionStats } = useContributorData();
  const stats = getCompletionStats();

  const isBlocked = stats.validationErrorsCount > 0 || stats.completionPct < 80;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Project ESG Submission Pre-Check"
      subtitle={`Comprehensive regulatory compliance and evidence verification before sign-off submission`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 text-xs">
        {/* Project Profile Header */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-400" />
              <h4 className="font-bold text-white text-sm">{activeScope.projectName}</h4>
            </div>
            <span className="font-mono text-teal-300 font-bold bg-teal-950 px-2 py-0.5 rounded border border-teal-800 text-[10px]">
              {activeScope.projectCode}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px]">
            <span>Subsidiary: <strong className="text-slate-200">{activeScope.subsidiary}</strong></span>
            <span>BU: <strong className="text-slate-200">{activeScope.businessUnit}</strong></span>
            <span>Cycle: <strong className="text-slate-200">{activeScope.year}</strong></span>
          </div>
        </div>

        {/* 9-Principles Checklist Grid */}
        <div className="space-y-2">
          <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
            Principle Compliance &amp; Readiness Matrix:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRINCIPLES_CONFIG.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div className="truncate pr-2">
                  <span className="font-mono font-bold text-teal-400 block text-[10px]">{p.principle}</span>
                  <span className="text-white font-medium text-[11px] truncate block">{p.shortTitle}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Statistical Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Mandatory Data</span>
            <strong className="text-emerald-400 text-lg font-mono">{stats.completionPct}%</strong>
            <span className="text-[10px] text-slate-500 block">Complete</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Required Evidence</span>
            <strong className="text-teal-400 text-lg font-mono">{stats.evidencePct}%</strong>
            <span className="text-[10px] text-slate-500 block">Uploaded</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Blocking Errors</span>
            <strong className={`text-lg font-mono ${stats.validationErrorsCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {stats.validationErrorsCount}
            </strong>
            <span className="text-[10px] text-slate-500 block">Errors</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Anomalies / Warn</span>
            <strong className="text-amber-400 text-lg font-mono">{stats.anomaliesCount}</strong>
            <span className="text-[10px] text-slate-500 block">Flags</span>
          </div>
        </div>

        {/* Warning / Ready Banner */}
        {isBlocked ? (
          <div className="p-3.5 bg-rose-950/60 rounded-xl border border-rose-700/60 flex items-start gap-3 text-rose-300">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white block">Submission Blocked:</strong>
              <span>Please resolve all blocking validation errors and complete at least 80% of assigned disclosures before final sign-off.</span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-950/60 rounded-xl border border-emerald-700/60 flex items-start gap-3 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white block">Project Ready for Reviewer Sign-Off:</strong>
              <span>All mandatory fields satisfied. Attached evidence logs will be locked and routed to the Reviewer &amp; Approver work queue.</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Back to Editing
          </button>
          <button
            type="button"
            disabled={isBlocked}
            onClick={onConfirmSubmit}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-950/50"
          >
            <Send className="w-4 h-4" />
            <span>Submit Project to Reviewer</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
