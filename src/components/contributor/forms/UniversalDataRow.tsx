import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  FileCheck,
  ChevronDown,
  Trash2,
  Ban,
  Eye,
} from 'lucide-react';
import type { FieldDefinition } from '../data/contributorPrinciplesData';
import { useContributorData, type FieldEntryState } from '../context/ContributorDataContext';
import { EvidenceUploadModal } from '../modals/EvidenceUploadModal';
import { CalculationDetailModal } from '../modals/CalculationDetailModal';

interface UniversalDataRowProps {
  field: FieldDefinition;
}

export const UniversalDataRow: React.FC<UniversalDataRowProps> = ({ field }) => {
  const { getFieldEntry, updateFieldEntry, attachEvidenceToField, removeEvidence, toggleNotApplicable } = useContributorData();
  const entry: FieldEntryState = getFieldEntry(field.id);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [showMetadataDrawer, setShowMetadataDrawer] = useState(false);

  const handleValueChange = (newVal: string) => {
    const parsed = field.type === 'number' || field.type === 'calculated'
      ? newVal === '' ? '' : Number(newVal)
      : newVal;
    updateFieldEntry(field.id, { value: parsed });
  };

  const handleEvidenceSuccess = (evidenceData: any, extractedValue?: number) => {
    attachEvidenceToField(field.id, evidenceData);
    if (extractedValue !== undefined) {
      updateFieldEntry(field.id, { value: extractedValue });
    }
  };

  const hasEvidence = entry.evidence && entry.evidence.length > 0;
  const isAnomaly = entry.isAnomaly;

  return (
    <div className={`p-4 sm:p-5 rounded-xl border transition-all ${
      entry.isNotApplicable
        ? 'bg-slate-900/40 border-slate-800 opacity-75'
        : isAnomaly
        ? 'bg-slate-900/90 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
        : hasEvidence
        ? 'bg-white border-slate-200 shadow-xs'
        : 'bg-white border-slate-200'
    }`}>
      {/* 3-Column Layout: Column 1 = Field & Meta, Column 2 = Value & Calc, Column 3 = Evidence & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* COLUMN 1: FIELD IDENTIFICATION & METADATA (Cols 1-4) */}
        <div className="lg:col-span-4 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {field.code}
            </span>
            {field.isBrsrCore && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                BRSR Core
              </span>
            )}
            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              {field.essentialOrLeadership}
            </span>
          </div>

          <label className="text-xs sm:text-sm font-bold text-slate-900 block leading-snug">
            {field.label} {field.required && <span className="text-rose-500">*</span>}
          </label>

          <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
            {field.description}
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <button
              type="button"
              onClick={() => toggleNotApplicable(field.id, !entry.isNotApplicable, 'Not applicable to site operations')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                entry.isNotApplicable
                  ? 'bg-rose-100 text-rose-800 font-bold border border-rose-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ban className="w-3 h-3" />
              <span>{entry.isNotApplicable ? 'Marked Not Applicable' : 'Mark N/A'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowMetadataDrawer(!showMetadataDrawer)}
              className="text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>Provenance &amp; Source</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showMetadataDrawer ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* COLUMN 2: VALUE & UNIT INPUT / CALCULATION (Cols 5-8) */}
        <div className="lg:col-span-4 space-y-2">
          {entry.isNotApplicable ? (
            <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs space-y-1">
              <span className="font-semibold text-rose-700 block">Status: Not Applicable</span>
              <input
                type="text"
                value={entry.naReason || ''}
                onChange={(e) => updateFieldEntry(field.id, { naReason: e.target.value })}
                placeholder="Reason for non-applicability..."
                className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={field.type === 'number' || field.type === 'calculated' ? 'number' : 'text'}
                    value={entry.value !== undefined ? entry.value : ''}
                    onChange={(e) => handleValueChange(e.target.value)}
                    disabled={field.type === 'calculated'}
                    placeholder={`e.g. ${field.defaultValue || '0.00'}`}
                    className={`w-full px-3 py-2 text-xs sm:text-sm font-mono font-semibold rounded-lg border transition-colors ${
                      field.type === 'calculated'
                        ? 'bg-teal-50/60 border-teal-300 text-teal-900 cursor-not-allowed'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                    }`}
                  />
                  {field.type === 'calculated' && (
                    <span className="absolute right-2.5 top-2.5 text-[10px] uppercase font-bold text-teal-700 bg-teal-100/80 px-1.5 py-0.5 rounded">
                      Auto
                    </span>
                  )}
                </div>

                <span className="px-2.5 py-2 text-xs font-semibold bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-mono shrink-0">
                  {field.unit}
                </span>
              </div>

              {/* Calculated View Button */}
              {field.type === 'calculated' && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 italic truncate max-w-[180px]">
                    Formula: {field.calculationFormula || 'Derived metric'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCalcModalOpen(true)}
                    className="text-teal-700 hover:text-teal-900 font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>View Formula</span>
                  </button>
                </div>
              )}

              {/* YoY Comparison pill */}
              {field.previousYearValue !== undefined && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>Previous Year: <strong className="text-slate-700">{field.previousYearValue} {field.unit}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* COLUMN 3: CONTEXTUAL EVIDENCE UPLOAD & STATUS (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Supporting Document
            </span>
            {hasEvidence ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Uploaded</span>
              </span>
            ) : field.requiredEvidenceName ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Missing Evidence</span>
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">Optional</span>
            )}
          </div>

          {/* Inline Upload Trigger & Attached Files Display */}
          <div className="space-y-1.5">
            {hasEvidence ? (
              <div className="space-y-1">
                {entry.evidence.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-800 font-semibold block truncate">{doc.documentName}</span>
                        <span className="text-[10px] text-slate-500">{doc.documentType} &bull; v{doc.version}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        title="Replace evidence"
                        className="p-1 text-slate-500 hover:text-teal-700 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeEvidence(field.id, doc.id)}
                        title="Remove evidence"
                        className="p-1 text-slate-500 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg text-xs font-semibold text-teal-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-teal-600" />
                <span>Upload {field.requiredEvidenceName.split('/')[0]}</span>
              </button>
            )}
          </div>

          {/* Remarks input */}
          <input
            type="text"
            value={entry.remarks || ''}
            onChange={(e) => updateFieldEntry(field.id, { remarks: e.target.value })}
            placeholder="Remarks / invoice reference..."
            className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 rounded text-slate-800 placeholder-slate-400"
          />
        </div>
      </div>

      {/* ANOMALY DETECTION ALERT BOX (Prompt Section 21) */}
      {isAnomaly && !entry.isNotApplicable && (
        <div className="mt-3.5 p-3 rounded-lg bg-amber-50 border border-amber-300 space-y-2">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-amber-900 block">
                DATA ANOMALY DETECTED: Value variance exceeds {field.benchmarkThreshold || 25}% threshold.
              </span>
              <span className="text-amber-800">
                Reported value differs significantly from previous year baseline ({field.previousYearValue} {field.unit}). Please provide operational explanation below.
              </span>
            </div>
          </div>
          <input
            type="text"
            value={entry.anomalyExplanation || ''}
            onChange={(e) => updateFieldEntry(field.id, { anomalyExplanation: e.target.value })}
            placeholder="Required anomaly explanation (e.g. pressure testing in Phase-2 milestone)..."
            className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded text-xs text-slate-900 font-medium placeholder-amber-700"
          />
        </div>
      )}

      {/* METADATA & DATA QUALITY DRAWER (Prompt Section 22) */}
      {showMetadataDrawer && (
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Data Source</label>
            <select
              value={entry.source}
              onChange={(e) => updateFieldEntry(field.id, { source: e.target.value as any })}
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
            >
              <option value="Invoice">Official Invoice</option>
              <option value="Meter">Meter Reading</option>
              <option value="ERP">SAP / ERP System</option>
              <option value="HR System">HR Attendance System</option>
              <option value="Manual Register">Manual Register</option>
              <option value="Supplier">Supplier Statement</option>
              <option value="Contractor">Contractor Logbook</option>
              <option value="Survey">Field Survey</option>
              <option value="Estimate">Engineering Estimate</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Data Quality Grade</label>
            <select
              value={entry.quality}
              onChange={(e) => updateFieldEntry(field.id, { quality: e.target.value as any })}
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs"
            >
              <option value="HIGH">HIGH (Metered / Invoiced)</option>
              <option value="MEDIUM">MEDIUM (Verified Register)</option>
              <option value="LOW">LOW (Spot Sampling)</option>
              <option value="ESTIMATED">ESTIMATED (Derived)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Reporting Period</label>
            <input
              type="text"
              value={entry.reportingPeriod}
              onChange={(e) => updateFieldEntry(field.id, { reportingPeriod: e.target.value })}
              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* Evidence Upload Modal */}
      <EvidenceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        field={field}
        currentValue={typeof entry.value === 'number' ? entry.value : undefined}
        onUploadSuccess={handleEvidenceSuccess}
      />

      {/* Calculation Detail Modal */}
      <CalculationDetailModal
        isOpen={isCalcModalOpen}
        onClose={() => setIsCalcModalOpen(false)}
        field={field}
        inputValue={entry.value}
        calculatedValue={entry.value}
      />
    </div>
  );
};
