import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Building2,
  FileCheck2,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useContributorData } from '../context/ContributorDataContext';
import { PRINCIPLES_CONFIG, type FieldDefinition } from '../data/contributorPrinciplesData';
import type { FieldEvidenceItem } from '../context/ContributorDataContext';

export const ContributorEvidencePage: React.FC = () => {
  const { fieldEntries, activeScope } = useContributorData();

  const [searchValue, setSearchValue] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPrinciple, setFilterPrinciple] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<{
    evidence: FieldEvidenceItem;
    field?: FieldDefinition;
  } | null>(null);

  // Flatten all fields across 9 Principles to map fieldId -> FieldDefinition
  const fieldMap: Record<string, FieldDefinition> = {};
  for (const p of PRINCIPLES_CONFIG) {
    for (const sub of p.subsections) {
      for (const f of sub.fields) {
        fieldMap[f.id] = f;
      }
    }
  }

  // Collect all attached evidence items
  const allEvidenceItems: Array<{
    evidence: FieldEvidenceItem;
    field?: FieldDefinition;
  }> = [];

  for (const [, entry] of Object.entries(fieldEntries)) {
    if (entry.evidence && entry.evidence.length > 0) {
      for (const ev of entry.evidence) {
        allEvidenceItems.push({
          evidence: ev,
          field: fieldMap[ev.fieldId],
        });
      }
    }
  }

  // Filter items
  const filteredItems = allEvidenceItems.filter(({ evidence, field }) => {
    const term = searchValue.toLowerCase();
    const matchesSearch =
      evidence.documentName.toLowerCase().includes(term) ||
      evidence.documentNumber.toLowerCase().includes(term) ||
      (field?.label.toLowerCase().includes(term) ?? false) ||
      (field?.code.toLowerCase().includes(term) ?? false);

    const matchesType = filterType === 'ALL' || evidence.documentType === filterType;
    const matchesStatus = filterStatus === 'ALL' || evidence.status === filterStatus;
    const matchesPrinciple = filterPrinciple === 'ALL' || field?.principle === filterPrinciple;

    return matchesSearch && matchesType && matchesStatus && matchesPrinciple;
  });

  const totalFiles = allEvidenceItems.length;
  const verifiedCount = allEvidenceItems.filter((i) => i.evidence.status === 'ACCEPTED').length;
  const pendingCount = allEvidenceItems.filter(
    (i) => i.evidence.status === 'UNDER_REVIEW' || i.evidence.status === 'UPLOADED'
  ).length;

  const handleExportIndexCsv = () => {
    let csv =
      'Evidence_ID,Indicator_Code,Indicator_Name,Document_Name,Document_Type,Document_Number,Document_Date,Uploaded_By,Verification_Status\n';
    for (const item of filteredItems) {
      csv += `"${item.evidence.id}","${item.field?.code || ''}","${item.field?.label || ''}","${item.evidence.documentName}","${item.evidence.documentType}","${item.evidence.documentNumber}","${item.evidence.documentDate}","${item.evidence.uploadedBy}","${item.evidence.status}"\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_Evidence_Index_${activeScope.projectCode}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supporting Evidence Index & Repository"
        description="Traceable repository of all audit-grade utility invoices, flow meter logs, incident investigations, and laboratory test reports supporting your BRSR data entries."
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Uploaded Documents"
          value={totalFiles.toString()}
          icon={FileText}
          iconBg="bg-teal-50"
          iconColor="text-teal-700"
          accentBorder="border-l-teal-600"
        />
        <MetricCard
          title="Accepted & Verified"
          value={verifiedCount.toString()}
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorder="border-l-emerald-500"
        />
        <MetricCard
          title="Under Reviewer Audit"
          value={pendingCount.toString()}
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          accentBorder="border-l-amber-500"
        />
        <MetricCard
          title="Reporting Facility"
          value={activeScope.siteName}
          icon={Building2}
          iconBg="bg-slate-50"
          iconColor="text-slate-600"
          accentBorder="border-l-slate-400"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by document name, invoice #, or indicator code..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPrinciple}
              onChange={(e) => setFilterPrinciple(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
            >
              <option value="ALL">All Principles (P1 - P9)</option>
              {PRINCIPLES_CONFIG.map((p) => (
                <option key={p.id} value={p.principle}>
                  {p.principle} — {p.shortTitle}
                </option>
              ))}
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
            >
              <option value="ALL">All Document Types</option>
              <option value="Fuel Invoice / Register">Fuel Invoice / Register</option>
              <option value="Electricity Tariff Bill">Electricity Tariff Bill</option>
              <option value="Flow Meter Extraction Log">Flow Meter Extraction Log</option>
              <option value="Hazardous Waste Manifest">Hazardous Waste Manifest</option>
              <option value="Incident Investigation Report">Incident Investigation Report</option>
              <option value="Attendance / Training Register">Attendance / Training Register</option>
              <option value="Pollution Control Board Clearance">Pollution Control Board Clearance</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
            >
              <option value="ALL">All Verification Statuses</option>
              <option value="ACCEPTED">ACCEPTED (Verified)</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="UPLOADED">UPLOADED</option>
              <option value="REJECTED">REJECTED</option>
            </select>

            <button
              type="button"
              onClick={handleExportIndexCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-700" />
              <span>Export Index (.CSV)</span>
            </button>

            {(searchValue || filterStatus !== 'ALL' || filterPrinciple !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchValue('');
                  setFilterStatus('ALL');
                  setFilterPrinciple('ALL');
                }}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Index Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Evidence ID</th>
                <th className="px-4 py-3">Linked Indicator</th>
                <th className="px-4 py-3">Document Title &amp; Number</th>
                <th className="px-4 py-3">Document Type</th>
                <th className="px-4 py-3">Document Date</th>
                <th className="px-4 py-3">Uploader</th>
                <th className="px-4 py-3">Verification Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-bold text-slate-700">No Evidence Documents Found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Documents uploaded in the Universal Data Entry rows will automatically populate this index.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(({ evidence, field }) => (
                  <tr key={evidence.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-teal-800">
                      {evidence.id.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {field?.code || evidence.fieldId}
                        </span>
                        <span className="font-medium text-slate-800 truncate max-w-xs">
                          {field?.label || evidence.fieldId}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900 truncate max-w-xs">{evidence.documentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Doc #: {evidence.documentNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{evidence.documentType}</td>
                    <td className="px-4 py-3 text-slate-600">{evidence.documentDate}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <p className="font-medium text-slate-800">{evidence.uploadedBy}</p>
                      <p className="text-[10px] text-slate-400">{evidence.uploadedOn}</p>
                    </td>
                    <td className="px-4 py-3">
                      {evidence.status === 'ACCEPTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          ACCEPTED
                        </span>
                      )}
                      {(evidence.status === 'UNDER_REVIEW' || evidence.status === 'UPLOADED') && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          UNDER REVIEW
                        </span>
                      )}
                      {evidence.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3" />
                          REJECTED
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedDoc({ evidence, field })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Evidence Metadata File
                </span>
                <h3 className="text-sm font-bold text-white">{selectedDoc.evidence.documentName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-white font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Evidence ID:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedDoc.evidence.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Document Number:</span>
                  <span className="font-bold text-slate-800">{selectedDoc.evidence.documentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Document Type:</span>
                  <span className="font-bold text-slate-800">{selectedDoc.evidence.documentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Document Date:</span>
                  <span className="text-slate-700">{selectedDoc.evidence.documentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Format &amp; Size:</span>
                  <span className="text-slate-700">
                    {selectedDoc.evidence.fileFormat} • {(selectedDoc.evidence.fileSizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Issuing Authority:</span>
                  <span className="text-slate-700">{selectedDoc.evidence.issuingAuthority || 'Third-Party Vendor'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold">Verification Status:</span>
                  <span className="font-bold text-emerald-700">{selectedDoc.evidence.status}</span>
                </div>
              </div>

              {selectedDoc.field && (
                <div className="p-3 bg-teal-50 rounded-xl border border-teal-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block mb-1">
                    Linked BRSR Disclosure
                  </span>
                  <p className="font-bold text-slate-900">
                    {selectedDoc.field.code} — {selectedDoc.field.label}
                  </p>
                  <p className="text-[11px] text-teal-700 mt-0.5">
                    {selectedDoc.field.principle} ({selectedDoc.field.essentialOrLeadership}) • Required: {selectedDoc.field.requiredEvidenceName}
                  </p>
                </div>
              )}

              {selectedDoc.evidence.description && (
                <div>
                  <span className="text-slate-500 font-semibold block mb-1">Audit Description / Remarks:</span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {selectedDoc.evidence.description}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
