import React, { useState } from 'react';
import {
  AlertTriangle,
  X,
  FileText,
  AlertCircle,
  HelpCircle,
  Send,
} from 'lucide-react';
import { Modal } from '../../ui/Modal';

export const REASON_CATEGORIES = [
  { id: 'Incorrect value', label: 'Incorrect value', desc: 'Reported numerical or categorical value deviates from source documents.' },
  { id: 'Evidence missing', label: 'Evidence missing', desc: 'Required statutory audit trail file, invoice or logbook not attached.' },
  { id: 'Supporting evidence does not match', label: 'Supporting evidence does not match', desc: 'Document attached does not substantiate the declared metric value.' },
  { id: 'Unit mismatch', label: 'Unit mismatch', desc: 'Data entered in wrong measurement unit (e.g. Litres vs KL, kWh vs MWh).' },
  { id: 'Calculation inconsistency', label: 'Calculation inconsistency', desc: 'Mathematical derivation or emission factor application error detected.' },
  { id: 'Missing information', label: 'Missing information', desc: 'Mandatory explanatory remark or statutory disclosure breakdown incomplete.' },
  { id: 'Other', label: 'Other', desc: 'Other review exception or compliance clarification required.' },
];

interface RequestRowCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowName: string;
  rowCode: string;
  currentValue: string | number;
  unit: string;
  onConfirm: (details: {
    category: string;
    reason: string;
    suggestedCorrection?: string;
    supportingComment?: string;
  }) => void;
}

export const RequestRowCorrectionModal: React.FC<RequestRowCorrectionModalProps> = ({
  isOpen,
  onClose,
  rowName,
  rowCode,
  currentValue,
  unit,
  onConfirm,
}) => {
  const [category, setCategory] = useState<string>('Incorrect value');
  const [reason, setReason] = useState<string>('');
  const [suggestedCorrection, setSuggestedCorrection] = useState<string>('');
  const [supportingComment, setSupportingComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('A specific reason for rejection is mandatory.');
      return;
    }

    onConfirm({
      category,
      reason: reason.trim(),
      suggestedCorrection: suggestedCorrection.trim() || undefined,
      supportingComment: supportingComment.trim() || undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Row Correction"
      subtitle="Flag this indicator row as incorrect and send a formal correction request to the Data Contributor"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row Context Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
            <span>Indicator Code: <strong className="text-slate-800">{rowCode}</strong></span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">Correction Workflow</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">{rowName}</h4>
          <div className="pt-1 flex items-center gap-2">
            <span className="text-slate-500">Submitted Value:</span>
            <span className="px-2 py-0.5 rounded font-mono font-bold bg-white border border-slate-300 text-slate-900">
              {currentValue} {unit}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Reason Category Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Correction Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REASON_CATEGORIES.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  category === cat.id
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="reason_category"
                  value={cat.id}
                  checked={category === cat.id}
                  onChange={() => setCategory(cat.id)}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div className="min-w-0">
                  <div className="truncate">{cat.label}</div>
                  <div className="text-[10px] text-slate-500 leading-tight line-clamp-1">{cat.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Mandatory Rejection Reason */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Specific Reason for Rejection <span className="text-rose-500">* (Mandatory)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Explain specifically why this reported value or evidence is incorrect..."
            rows={3}
            required
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
          />
        </div>

        {/* Suggested Correction or Guidance (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Expected Correction or Guidance <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={suggestedCorrection}
            onChange={(e) => setSuggestedCorrection(e.target.value)}
            placeholder="e.g. Upload weighbridge slip WB-980 or recompute Scope 1 with 2.68 factor"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
          />
        </div>

        {/* Supporting Comment */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Supporting Reviewer Remarks <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <textarea
            value={supportingComment}
            onChange={(e) => setSupportingComment(e.target.value)}
            placeholder="Additional internal audit notes or context for the contributor..."
            rows={2}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
          />
        </div>

        {/* Notice on Immutable Audit History */}
        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Data Integrity Assurance:</strong> Submitting this correction marks the row as <em>Correction Required</em>, immediately sends a notification to the Contributor Correction Center, and preserves the original value in the audit log. The incorrect value will remain excluded from verified Auditor views.
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-lg shadow-sm transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Correction Request</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
