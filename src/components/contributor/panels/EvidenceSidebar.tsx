import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
} from 'lucide-react';
import type { PrincipleSectionConfig } from '../data/contributorPrinciplesData';
import { useContributorData } from '../context/ContributorDataContext';
import { EvidenceUploadModal } from '../modals/EvidenceUploadModal';

interface EvidenceSidebarProps {
  activePrinciple: PrincipleSectionConfig;
}

export const EvidenceSidebar: React.FC<EvidenceSidebarProps> = ({ activePrinciple }) => {
  const { getFieldEntry, attachEvidenceToField } = useContributorData();
  const [selectedFieldForUpload, setSelectedFieldForUpload] = useState<any>(null);

  // Extract all fields in this principle
  const fields = activePrinciple.subsections.flatMap(s => s.fields);

  return (
    <aside className="w-full lg:w-80 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 shrink-0">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Evidence &amp; Documents
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {activePrinciple.principle}
        </span>
      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Verifiable document provenance directly attached to {activePrinciple.shortTitle} operational metrics.
      </p>

      {/* Field Evidence Status Feed */}
      <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
        {fields.map((f) => {
          const entry = getFieldEntry(f.id);
          const hasDoc = entry.evidence && entry.evidence.length > 0;

          return (
            <div
              key={f.id}
              className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                hasDoc
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : f.requiredEvidenceName
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-slate-900 line-clamp-1 text-[11px]">
                  {f.label}
                </span>
                {hasDoc ? (
                  <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-0.5 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Uploaded</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-800 font-bold flex items-center gap-0.5 shrink-0">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>Missing</span>
                  </span>
                )}
              </div>

              <div className="text-[10px] text-slate-600">
                <strong className="text-slate-700">Required:</strong> {f.requiredEvidenceName}
              </div>

              {hasDoc ? (
                <div className="p-2 bg-white rounded border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-mono text-emerald-900 font-semibold truncate">
                      {entry.evidence[0].documentName}
                    </span>
                    <span className="text-slate-500">v{entry.evidence[0].version}</span>
                  </div>
                  <div className="text-[9px] text-slate-500">
                    Status: <strong className="text-emerald-700">{entry.evidence[0].status}</strong>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedFieldForUpload(f)}
                  className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 border border-slate-300 rounded text-[11px] font-semibold text-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-teal-700" />
                  <span>Attach Document</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {selectedFieldForUpload && (
        <EvidenceUploadModal
          isOpen={Boolean(selectedFieldForUpload)}
          onClose={() => setSelectedFieldForUpload(null)}
          field={selectedFieldForUpload}
          onUploadSuccess={(docData) => {
            attachEvidenceToField(selectedFieldForUpload.id, docData);
            setSelectedFieldForUpload(null);
          }}
        />
      )}
    </aside>
  );
};
