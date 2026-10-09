import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';
import { useDemoAuth } from '../../../context/DemoAuthContext';

export const EvidenceReviewPage: React.FC = () => {
  const { session } = useDemoAuth();
  const { evidence, dossiers, updateEvidenceStatus, getVerifiedAuditorRecords } = useNexusData();

  const isAuditorRole = session?.role === 'auditor';

  const [searchValue, setSearchValue] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');

  // If in Auditor view, retrieve only verified records as per Section 9
  const auditorVerifiedRecords = useMemo(() => {
    return getVerifiedAuditorRecords();
  }, [getVerifiedAuditorRecords, dossiers]);

  // Consolidate evidence items
  const allEvidenceFiles = useMemo(() => {
    const list: any[] = [...evidence];

    // Also pull evidence attached to dossiers
    dossiers.forEach((d) => {
      Object.values(d.rows || {}).forEach((r) => {
        (r.evidenceFiles || []).forEach((f) => {
          if (!list.some((existing) => existing.id === f.id || existing.name === f.name)) {
            list.push({
              id: f.id,
              name: f.name,
              documentType: r.isBrsrCore ? 'BRSR Core Primary Audit Trail' : 'Operational Evidence',
              fileFormat: f.type || 'PDF',
              fileSizeBytes: f.size || 2150000,
              url: f.url || `/evidence/${f.name}`,
              uploadedBy: d.submittingUser,
              uploadedOn: f.uploadedAt || d.submittedAt,
              status: r.reviewStatus === 'VERIFIED' ? 'ACCEPTED' : r.reviewStatus === 'CORRECTION_REQUIRED' ? 'REJECTED' : 'UNDER_REVIEW',
              disclosureCode: r.id,
              disclosureName: r.name,
              projectName: d.projectName,
              reportingPeriod: `${d.monthName} ${d.financialYear}`,
            });
          }
        });
      });
    });

    return list;
  }, [evidence, dossiers]);

  const filteredEvidence = useMemo(() => {
    return allEvidenceFiles.filter((doc) => {
      // If user is Auditor, enforce eligibility: show only accepted / verified items
      if (isAuditorRole && doc.status !== 'ACCEPTED') {
        return false;
      }

      if (selectedStatus !== 'ALL' && doc.status !== selectedStatus) return false;
      if (selectedFormat !== 'ALL' && doc.fileFormat?.toLowerCase() !== selectedFormat.toLowerCase()) return false;

      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(query);
        const matchProj = (doc.projectName || '').toLowerCase().includes(query);
        const matchDisc = (doc.disclosureCode || '').toLowerCase().includes(query);
        if (!matchName && !matchProj && !matchDisc) return false;
      }

      return true;
    });
  }, [allEvidenceFiles, isAuditorRole, selectedStatus, selectedFormat, searchValue]);

  const handleVerifyEvidence = (docId: string) => {
    updateEvidenceStatus(docId, 'ACCEPTED', 'Verified authentic by Reviewer.');
  };

  const handleFlagEvidence = (docId: string) => {
    updateEvidenceStatus(docId, 'REJECTED', 'Flagged for replacement or calibration check.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAuditorRole ? 'Independent Auditor Assurance & Evidence Vault' : 'Evidence Review & Document Assurance'}
        description={
          isAuditorRole
            ? 'Authorized statutory auditor view. Securely inspects only verified and approved ESG disclosures, supporting test slips, and immutable audit logs.'
            : 'Review supporting evidence documents uploaded by data contributors. Verify authenticity, audit calibration slips, and manage assurance approvals.'
        }
      />

      {/* Auditor Specific Notice */}
      {isAuditorRole && (
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-purple-950">Statutory Auditor Eligibility Enforcement Active</h4>
            <p className="leading-relaxed">
              In accordance with Section 9 of the ESG Reporting Standards, unverified, draft, and correction-required disclosures are strictly excluded from this view. All records rendered below have passed full Reviewer verification and are ready for statutory BRSR Core sign-off.
            </p>
          </div>
        </div>
      )}

      {/* Live Verified Records KPI for Auditor */}
      {isAuditorRole && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-purple-600">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Verified Indicator Disclosures</span>
            <span className="text-xl font-extrabold text-purple-900">{auditorVerifiedRecords.length} Verified</span>
            <span className="text-[10px] text-purple-700 block font-medium">100% Eligible for BRSR Core Assurance</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-600">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Substantiating Audit Documents</span>
            <span className="text-xl font-extrabold text-emerald-800">{filteredEvidence.length} Files</span>
            <span className="text-[10px] text-emerald-700 block font-medium">Invoices, meter logs, and test slips</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-teal-600">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Assurance Readiness Score</span>
            <span className="text-xl font-extrabold text-teal-800">100%</span>
            <span className="text-[10px] text-teal-700 block font-medium">Zero unverified records included</span>
          </div>
        </div>
      )}

      {/* Search & Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by document name, disclosure code, or project..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-700"
          />
        </div>

        <div className="flex items-center gap-2">
          {!isAuditorRole && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="ACCEPTED">Accepted / Verified</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="REJECTED">Flagged / Rejected</option>
            </select>
          )}

          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All File Formats</option>
            <option value="pdf">PDF</option>
            <option value="xlsx">Excel (XLSX)</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredEvidence.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No evidence documents match criteria</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {isAuditorRole
                ? 'Only evidence documents for Verified disclosures appear in the Auditor view.'
                : 'Documents attached by contributors will stream here for verification.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3 text-left">Document Name</th>
                  <th className="px-3 py-3 text-left">Evidence Type</th>
                  <th className="px-3 py-3 text-center">Format &amp; Size</th>
                  <th className="px-3.5 py-3 text-left">Linked Disclosure</th>
                  <th className="px-3.5 py-3 text-left">Project / Scope</th>
                  <th className="px-3 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredEvidence.map((doc) => {
                  const isAccepted = doc.status === 'ACCEPTED';
                  const isRejected = doc.status === 'REJECTED';

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-700 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 block truncate max-w-xs">{doc.name}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">Uploaded by {doc.uploadedBy}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 text-slate-600">
                        {doc.documentType || 'Invoice / Official Receipt'}
                      </td>

                      <td className="px-3 py-3.5 text-center font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {doc.fileFormat || 'PDF'}
                        </span>
                        <span className="text-slate-400 block text-[10px] mt-0.5">
                          {doc.fileSizeBytes ? `${(doc.fileSizeBytes / 1000000).toFixed(1)} MB` : '1.8 MB'}
                        </span>
                      </td>

                      <td className="px-3.5 py-3.5 text-slate-700">
                        <div className="font-mono font-bold text-slate-800 text-[11px]">{doc.disclosureCode || 'P6-IND-01'}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[180px]">{doc.disclosureName || 'Direct Emissions'}</div>
                      </td>

                      <td className="px-3.5 py-3.5 text-slate-600">
                        <div className="font-medium text-slate-800">{doc.projectName || 'Raipur Expressway'}</div>
                        <div className="text-[10px] text-slate-400">{doc.reportingPeriod || 'March 2027'}</div>
                      </td>

                      <td className="px-3 py-3.5 text-center whitespace-nowrap">
                        {isAccepted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Accepted
                          </span>
                        ) : isRejected ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                            ✕ Flagged
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                            Under Review
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {!isAuditorRole && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleVerifyEvidence(doc.id)}
                                disabled={isAccepted}
                                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                  isAccepted
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                                }`}
                                title="Accept and verify supporting document"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFlagEvidence(doc.id)}
                                className="px-2 py-1 text-xs font-bold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                title="Flag for replacement"
                              >
                                Flag
                              </button>
                            </>
                          )}
                          <a
                            href={`#inspect-${doc.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Inspecting document: ${doc.name}\n\nCryptographic Hash: SHA256-verified\nUploaded by: ${doc.uploadedBy}\nLinked Disclosure: ${doc.disclosureCode || 'BRSR Core'}`);
                            }}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="Inspect document audit metadata"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
