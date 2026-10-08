import React, { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { Modal } from '../../ui/Modal';

interface RequestClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportVersion?: string;
  onSubmitClarification: (data: {
    category: string;
    section: string;
    comment: string;
    priority: string;
    dueDate: string;
  }) => void;
}

export const RequestClarificationModal: React.FC<RequestClarificationModalProps> = ({
  isOpen,
  onClose,
  reportVersion = 'BRSR-FY26-V1.0',
  onSubmitClarification,
}) => {
  const [category, setCategory] = useState('data_discrepancy');
  const [section, setSection] = useState('section_c_p6');
  const [comment, setComment] = useState('');
  const [priority, setPriority] = useState('high');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please provide specific details for your clarification request.');
      return;
    }

    setError(null);
    onSubmitClarification({
      category,
      section,
      comment,
      priority,
      dueDate,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request ESG Admin Clarification"
      subtitle={`Submit queries or clarification items regarding report version ${reportVersion}.`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Clarification Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Clarification Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-700"
            >
              <option value="data_discrepancy">Data Variance / Outlier Inquiry</option>
              <option value="missing_evidence">Evidence Adequacy Concern</option>
              <option value="methodology">Calculation Methodology Query</option>
              <option value="boundary_coverage">Boundary / Scope Inclusion</option>
              <option value="regulatory">SEBI / Audit Readiness Question</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Concerned BRSR Section <span className="text-rose-500">*</span>
            </label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-700"
            >
              <option value="section_a">Section A: General Disclosures</option>
              <option value="section_b">Section B: Management &amp; Process</option>
              <option value="section_c_p1">Section C: Principle 1 (Ethics)</option>
              <option value="section_c_p2">Section C: Principle 2 (Product Sustainability)</option>
              <option value="section_c_p3">Section C: Principle 3 (Employees)</option>
              <option value="section_c_p4">Section C: Principle 4 (Stakeholders)</option>
              <option value="section_c_p5">Section C: Principle 5 (Human Rights)</option>
              <option value="section_c_p6">Section C: Principle 6 (Environment)</option>
              <option value="section_c_p7">Section C: Principle 7 (Public Policy)</option>
              <option value="section_c_p8">Section C: Principle 8 (Inclusive Growth)</option>
              <option value="section_c_p9">Section C: Principle 9 (Customer Value)</option>
            </select>
          </div>
        </div>

        {/* Priority & Response Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-700"
            >
              <option value="critical">Critical / Blocking Sign-Off</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium</option>
              <option value="low">Low / Informational</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Target Response Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:border-indigo-700"
            />
          </div>
        </div>

        {/* Detailed Comment */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Clarification Notes <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Describe the discrepancy, metric anomaly, or explanation required from the ESG Administration team…"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-700 resize-none"
          />
        </div>

        {error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </p>
        )}

        {/* Actions */}
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
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Clarification Request</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
