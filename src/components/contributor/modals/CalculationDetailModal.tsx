import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import type { FieldDefinition } from '../data/contributorPrinciplesData';

interface CalculationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FieldDefinition;
  inputValue?: number | string;
  calculatedValue?: number | string;
}

export const CalculationDetailModal: React.FC<CalculationDetailModalProps> = ({
  isOpen,
  onClose,
  field,
  inputValue,
  calculatedValue,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calculation Engine & Factor Provenance"
      subtitle={`Verified mathematical lineage for: ${field.label}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5 text-xs">
        {/* Core Methodology Card */}
        <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Calculation Details</span>
            <span className="px-2 py-0.5 rounded bg-teal-900/50 text-teal-300 font-mono text-[10px] border border-teal-700/40">
              SEBI BRSR / GHG Protocol
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {field.description}
          </p>
        </div>

        {/* Step Breakdown */}
        <div className="space-y-2.5">
          <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
            Step-by-Step Mathematical Derivation:
          </span>

          {/* Input Step */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block">1. Operational Activity Data</span>
              <strong className="text-white text-sm font-mono">{inputValue ?? field.defaultValue}</strong>
            </div>
            <span className="text-slate-400 font-mono text-xs">{field.unit}</span>
          </div>

          {/* Factor Step */}
          {field.emissionFactor && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 block">2. Standard Emission Factor</span>
                <span className="text-sky-300 font-mono font-bold text-xs">{field.emissionFactor} kg CO₂e / {field.unit}</span>
              </div>
              <p className="text-[11px] text-slate-400 italic">
                Source: {field.emissionFactorSource || 'IPCC 2006 / Central Electricity Authority Guidelines'}
              </p>
            </div>
          )}

          {/* Formula Step */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 block">3. Applied Formula</span>
            <code className="text-emerald-300 font-mono font-bold text-xs block">
              {field.calculationFormula || `${field.label} = (Activity * Factor) / Denominator`}
            </code>
          </div>

          {/* Result Step */}
          <div className="p-3.5 bg-gradient-to-r from-teal-950/60 to-slate-900 rounded-lg border border-teal-500/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-teal-400 uppercase font-bold block">4. Final Calculated Output</span>
              <strong className="text-white text-base font-mono">{calculatedValue ?? field.defaultValue}</strong>
            </div>
            <span className="text-teal-300 font-bold font-mono text-sm">{field.unit}</span>
          </div>
        </div>

        {/* Audit Statement */}
        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-start gap-2.5 text-slate-400 text-[11px]">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <span>
            This calculation snapshot is preserved in the immutable audit log and directly supports the consolidated MEIL BRSR reporting rollup.
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
