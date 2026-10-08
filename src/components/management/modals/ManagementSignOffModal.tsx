import React, { useState } from 'react';
import { FileCheck2, AlertCircle } from 'lucide-react';
import { Modal } from '../../ui/Modal';

interface ManagementSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportVersion?: string;
  onConfirmSignOff: (note: string) => void;
}

export const ManagementSignOffModal: React.FC<ManagementSignOffModalProps> = ({
  isOpen,
  onClose,
  reportVersion = 'BRSR-FY26-V1.0',
  onConfirmSignOff,
}) => {
  const [confirmationAccepted, setConfirmationAccepted] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [managementNote, setManagementNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isTypedMatch = typedConfirmation.trim().toUpperCase() === 'CONFIRM';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationAccepted) {
      setError('You must check the authorization declaration checkbox.');
      return;
    }
    if (!isTypedMatch) {
      setError('Please type "CONFIRM" exactly to verify executive sign-off authorization.');
      return;
    }

    setError(null);
    onConfirmSignOff(managementNote);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Executive BRSR Report Sign-Off"
      subtitle={`Provide formal management authorization for consolidated report version ${reportVersion}.`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Report Version Info */}
        <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-center justify-between">
          <div>
            <span className="font-semibold block text-indigo-900">Consolidated BRSR Report</span>
            <span className="text-[11px] text-indigo-700">Target Version: {reportVersion}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200/70 text-indigo-900 uppercase">
            Sign-Off Review
          </span>
        </div>

        {/* Management Note */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Executive Remarks / Board Transmittal Note (Optional)
          </label>
          <textarea
            rows={3}
            value={managementNote}
            onChange={(e) => setManagementNote(e.target.value)}
            placeholder="Document executive oversight observations, committee review notes, or transmittal instructions…"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-700 transition-colors resize-none"
          />
        </div>

        {/* Mandatory Declaration Checkbox */}
        <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmationAccepted}
              onChange={(e) => {
                setConfirmationAccepted(e.target.checked);
                if (error) setError(null);
              }}
              className="mt-0.5 w-4 h-4 text-indigo-700 border-slate-300 rounded focus:ring-indigo-600"
            />
            <span className="text-xs text-slate-800 font-medium leading-relaxed">
              I confirm that I have reviewed the consolidated BRSR report and authorize it to proceed to the next configured stage.
            </span>
          </label>
        </div>

        {/* Typed Confirmation Requirement */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Type <span className="font-mono text-indigo-800 font-bold">CONFIRM</span> to Authorize <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={typedConfirmation}
            onChange={(e) => {
              setTypedConfirmation(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Type CONFIRM"
            className="w-full px-3 py-2 text-sm font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-700 transition-colors"
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </p>
        )}

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!confirmationAccepted || !isTypedMatch}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Authorize Sign-Off</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
