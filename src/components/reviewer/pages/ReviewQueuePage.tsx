import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Building2,
  RotateCcw,
  Eye,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';
import { RequestRowCorrectionModal } from '../modals/RequestRowCorrectionModal';

export const ReviewQueuePage: React.FC = () => {
  const {
    dossiers,
    assignments,
    organizations,
    users,
    markRowCorrect,
    requestRowCorrection,
  } = useNexusData();

  // Search & Filters state
  const [searchValue, setSearchValue] = useState('');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedPrinciple, setSelectedPrinciple] = useState('ALL');
  const [selectedRowStatus, setSelectedRowStatus] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'CORRECTION_REQUIRED'>('ALL');
  const [selectedDossierStatus, setSelectedDossierStatus] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'DOSSIERS' | 'ALL_ROWS'>('DOSSIERS');

  // Modal state for row-level correction
  const [correctionTarget, setCorrectionTarget] = useState<{
    dossierId: string;
    rowId: string;
    rowName: string;
    rowCode: string;
    currentValue: string | number;
    unit: string;
  } | null>(null);

  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const showNotice = (msg: string, type: 'success' | 'warning' = 'success') => {
    setToastNotice({ message: msg, type });
    setTimeout(() => setToastNotice(null), 3000);
  };

  // Summary counts calculated from real dossiers state
  const summaryMetrics = useMemo(() => {
    let pendingSubmissions = 0;
    let fullyReviewedSubmissions = 0;
    let partiallyReviewedSubmissions = 0;
    let totalPendingRows = 0;
    let totalVerifiedRows = 0;
    let totalCorrectionRows = 0;

    dossiers.forEach((d) => {
      if (d.status === 'Fully Reviewed' || d.status === 'Approved for Auditor') {
        fullyReviewedSubmissions++;
      } else if (d.status === 'Partially Reviewed') {
        partiallyReviewedSubmissions++;
      } else {
        pendingSubmissions++;
      }

      const rows = Object.values(d.rows || {});
      rows.forEach((r) => {
        if (r.reviewStatus === 'VERIFIED') totalVerifiedRows++;
        else if (r.reviewStatus === 'CORRECTION_REQUIRED') totalCorrectionRows++;
        else totalPendingRows++;
      });
    });

    return {
      pendingSubmissions,
      fullyReviewedSubmissions,
      partiallyReviewedSubmissions,
      totalPendingRows,
      totalVerifiedRows,
      totalCorrectionRows,
    };
  }, [dossiers]);

  // Filtered dossiers list
  const filteredDossiers = useMemo(() => {
    return dossiers.filter((d) => {
      if (selectedProject !== 'ALL' && d.projectId !== selectedProject) return false;
      if (selectedDossierStatus !== 'ALL' && d.status !== selectedDossierStatus) return false;
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchesProj = d.projectName.toLowerCase().includes(query);
        const matchesSite = d.siteName.toLowerCase().includes(query);
        const matchesUser = d.submittingUser.toLowerCase().includes(query);
        if (!matchesProj && !matchesSite && !matchesUser) return false;
      }
      return true;
    });
  }, [dossiers, selectedProject, selectedDossierStatus, searchValue]);

  // Flattened all submitted rows across all dossiers
  const allSubmittedRows = useMemo(() => {
    const list: {
      dossierId: string;
      projectName: string;
      projectCode: string;
      siteName: string;
      financialYear: string;
      monthName: string;
      submittingUser: string;
      row: any;
    }[] = [];

    dossiers.forEach((d) => {
      if (selectedProject !== 'ALL' && d.projectId !== selectedProject) return;
      Object.values(d.rows || {}).forEach((r: any) => {
        if (selectedPrinciple !== 'ALL' && String(r.principleId) !== selectedPrinciple) return;
        if (selectedRowStatus === 'VERIFIED' && r.reviewStatus !== 'VERIFIED') return;
        if (selectedRowStatus === 'CORRECTION_REQUIRED' && r.reviewStatus !== 'CORRECTION_REQUIRED') return;
        if (selectedRowStatus === 'PENDING' && (r.reviewStatus === 'VERIFIED' || r.reviewStatus === 'CORRECTION_REQUIRED')) return;

        if (searchValue.trim()) {
          const query = searchValue.toLowerCase();
          const matchesName = r.name.toLowerCase().includes(query);
          const matchesCode = (r.id || '').toLowerCase().includes(query);
          const matchesProj = d.projectName.toLowerCase().includes(query);
          if (!matchesName && !matchesCode && !matchesProj) return;
        }

        list.push({
          dossierId: d.dossierId,
          projectName: d.projectName,
          projectCode: d.projectCode,
          siteName: d.siteName,
          financialYear: d.financialYear,
          monthName: d.monthName,
          submittingUser: d.submittingUser,
          row: r,
        });
      });
    });

    return list;
  }, [dossiers, selectedProject, selectedPrinciple, selectedRowStatus, searchValue]);

  // Handlers for Row Correct / Incorrect
  const handleMarkRowCorrect = (dossierId: string, rowId: string, rowName: string) => {
    const res = markRowCorrect(dossierId, rowId, 'Aarav Patel (Review Lead)');
    if (res.success) {
      showNotice(`✓ Row "${rowName}" verified and published to Auditor view!`);
    } else {
      showNotice(res.message, 'warning');
    }
  };

  const handleOpenCorrectionModal = (dossierId: string, row: any) => {
    setCorrectionTarget({
      dossierId,
      rowId: row.id,
      rowName: row.name,
      rowCode: row.id,
      currentValue: row.currentValue,
      unit: row.unit,
    });
  };

  const handleConfirmRowCorrection = (details: {
    category: string;
    reason: string;
    suggestedCorrection?: string;
    supportingComment?: string;
  }) => {
    if (!correctionTarget) return;

    const res = requestRowCorrection(correctionTarget.dossierId, correctionTarget.rowId, {
      ...details,
      reviewerName: 'Aarav Patel (Review Lead)',
    });

    setCorrectionTarget(null);
    if (res.success) {
      showNotice(`Correction request dispatched to Data Contributor for "${correctionTarget.rowName}"!`);
    } else {
      showNotice(res.message, 'warning');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review Queue & Master Verification Workflow"
        description="Centralized Reviewer Portal synchronized with Data Contributor monthly reporting submissions, row-level assurance actions, and live Auditor publication."
      />

      {/* Floating Status Notification Toast */}
      {toastNotice && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg text-xs font-semibold animate-in fade-in slide-in-from-top duration-200 ${
            toastNotice.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : 'bg-amber-900 text-white border-amber-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            )}
            <span>{toastNotice.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastNotice(null)}
            className="text-white/70 hover:text-white ml-4 text-[11px] underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 6 Executive Summary Cards (Backend Enforced) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1 border-l-4 border-l-sky-500">
          <p className="text-[10px] uppercase font-bold text-slate-500">Pending Dossiers</p>
          <p className="text-xl font-extrabold text-slate-900">{summaryMetrics.pendingSubmissions}</p>
          <p className="text-[10px] text-slate-400">Awaiting reviewer queue</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1 border-l-4 border-l-amber-500">
          <p className="text-[10px] uppercase font-bold text-slate-500">Pending Row Decisions</p>
          <p className="text-xl font-extrabold text-amber-600">{summaryMetrics.totalPendingRows}</p>
          <p className="text-[10px] text-slate-400">Unreviewed indicators</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1 border-l-4 border-l-emerald-500">
          <p className="text-[10px] uppercase font-bold text-slate-500">Verified Rows</p>
          <p className="text-xl font-extrabold text-emerald-600">{summaryMetrics.totalVerifiedRows}</p>
          <p className="text-[10px] text-emerald-700 font-semibold">Published to Auditor</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1 border-l-4 border-l-rose-500">
          <p className="text-[10px] uppercase font-bold text-slate-500">Correction Required</p>
          <p className="text-xl font-extrabold text-rose-600">{summaryMetrics.totalCorrectionRows}</p>
          <p className="text-[10px] text-rose-700 font-semibold">In Contributor Center</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1 border-l-4 border-l-indigo-500">
          <p className="text-[10px] uppercase font-bold text-slate-500">Partially Reviewed</p>
          <p className="text-xl font-extrabold text-indigo-600">{summaryMetrics.partiallyReviewedSubmissions}</p>
          <p className="text-[10px] text-slate-400">Mixed row decisions</p>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-1 border-l-4 border-l-teal-600">
          <p className="text-[10px] uppercase font-bold text-slate-500">Fully Reviewed</p>
          <p className="text-xl font-extrabold text-teal-700">{summaryMetrics.fullyReviewedSubmissions}</p>
          <p className="text-[10px] text-teal-800 font-semibold">Ready for Sign-Off</p>
        </div>
      </div>

      {/* Filter and View Mode Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by indicator name, code, project, or contributor..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-700"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('DOSSIERS')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                activeTab === 'DOSSIERS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Submission Dossiers ({dossiers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ALL_ROWS')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                activeTab === 'ALL_ROWS'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Row-Level Master View ({allSubmittedRows.length})
            </button>
          </div>
        </div>

        {/* Multi-Dimensional Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Project</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="ALL">All Authorized Projects</option>
              <option value="proj_exp">Expressway Phase-II (Raipur)</option>
              <option value="proj_klis">KLIS Irrigation Lift Project</option>
              <option value="proj_solar_park">Pavagada 500MW Solar Park</option>
              <option value="proj_zojila">Zojila High-Altitude Tunnel</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">ESG Principle</label>
            <select
              value={selectedPrinciple}
              onChange={(e) => setSelectedPrinciple(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="ALL">All Principles (P1 - P9)</option>
              <option value="1">P1 Ethics & Governance</option>
              <option value="2">P2 Sustainable Products</option>
              <option value="3">P3 Employee Well-being & Safety</option>
              <option value="4">P4 Stakeholder Engagement</option>
              <option value="5">P5 Human Rights</option>
              <option value="6">P6 Environment & GHG</option>
              <option value="7">P7 Public Policy</option>
              <option value="8">P8 Inclusive Growth & CSR</option>
              <option value="9">P9 Customer Value</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Row Review Status</label>
            <select
              value={selectedRowStatus}
              onChange={(e) => setSelectedRowStatus(e.target.value as any)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="ALL">All Row Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="VERIFIED">Verified (Published)</option>
              <option value="CORRECTION_REQUIRED">Changes Requested</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Dossier Status</label>
            <select
              value={selectedDossierStatus}
              onChange={(e) => setSelectedDossierStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="ALL">All Dossier Statuses</option>
              <option value="Submitted">Submitted (New)</option>
              <option value="Under Review">Under Review</option>
              <option value="Partially Reviewed">Partially Reviewed</option>
              <option value="Changes Requested">Changes Requested</option>
              <option value="Fully Reviewed">Fully Reviewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* VIEW 1: SUBMISSION DOSSIERS */}
      {activeTab === 'DOSSIERS' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {filteredDossiers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <ClipboardList className="w-12 h-12 text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No monthly dossiers in review queue</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                When a Data Contributor submits monthly reporting records from the Data Capture portal, the submission package automatically streams here in real-time.
              </p>
              <Link
                to="/contributor/assignment"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200"
              >
                <span>Go to Data Contributor Capture Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3 text-left">Dossier &amp; Reporting Scope</th>
                    <th className="px-4 py-3 text-left">Period</th>
                    <th className="px-4 py-3 text-left">Contributor</th>
                    <th className="px-4 py-3 text-center">Progress (Rows)</th>
                    <th className="px-4 py-3 text-center">Dossier Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredDossiers.map((d) => {
                    const rowVals = Object.values(d.rows || {});
                    const total = d.totalRows || rowVals.length || 1;
                    const verified = d.verifiedRows || 0;
                    const pct = Math.round((verified / total) * 100);

                    return (
                      <tr key={d.dossierId} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-slate-900 text-xs">{d.projectName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {d.projectCode} &bull; {d.siteName}
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800">{d.monthName}</span>
                          <span className="text-slate-400 font-mono block text-[11px]">{d.financialYear}</span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="text-slate-800 font-medium">{d.submittingUser}</div>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {new Date(d.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <div className="w-32 mx-auto space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-emerald-700 font-bold">{verified} Ver</span>
                              <span className="text-rose-600 font-bold">{d.correctionRequiredRows} Cor</span>
                              <span className="text-slate-400 font-bold">{total} Tot</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden flex">
                              <div
                                style={{ width: `${(verified / total) * 100}%` }}
                                className="bg-emerald-500 h-full"
                              />
                              <div
                                style={{ width: `${(d.correctionRequiredRows / total) * 100}%` }}
                                className="bg-rose-500 h-full"
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                              d.status === 'Fully Reviewed'
                                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                                : d.status === 'Changes Requested'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : d.status === 'Partially Reviewed'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <Link
                            to={`/reviewer/submission-detail/${d.dossierId}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#003B73] hover:bg-[#002850] active:scale-95 rounded-lg transition-all shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review Full Dossier</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: ROW-LEVEL MASTER VIEW (Direct Row-by-Row Correct / Incorrect Actions) */}
      {activeTab === 'ALL_ROWS' && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {allSubmittedRows.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No rows matching selected filters</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try switching the filters or selecting "All Principles" to inspect submitted rows.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 font-semibold text-slate-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3.5 py-3 text-left">Code</th>
                    <th className="px-4 py-3 text-left">Indicator Name &amp; Category</th>
                    <th className="px-3.5 py-3 text-left">Project &amp; Site</th>
                    <th className="px-3 py-3 text-center">Submitted Value</th>
                    <th className="px-3 py-3 text-center">Evidence</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Row Review Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {allSubmittedRows.map(({ dossierId, projectName, siteName, monthName, row }) => {
                    const isVerified = row.reviewStatus === 'VERIFIED';
                    const isCorrection = row.reviewStatus === 'CORRECTION_REQUIRED';
                    const isPending = !isVerified && !isCorrection;

                    return (
                      <tr
                        key={`${dossierId}_${row.id}`}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isVerified ? 'bg-emerald-50/20' : isCorrection ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        <td className="px-3.5 py-3 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {row.id}
                        </td>

                        <td className="px-4 py-3 max-w-xs">
                          <div className="font-bold text-slate-900 leading-tight">{row.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <span>{row.principleTitle}</span>
                            <span>&bull;</span>
                            <span className="font-semibold text-slate-500">{row.category}</span>
                            {row.isBrsrCore && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[9px]">
                                CORE
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-3.5 py-3 text-slate-600">
                          <div className="font-medium text-slate-800 truncate max-w-[160px]">{projectName}</div>
                          <div className="text-[10px] text-slate-400">{siteName} &bull; {monthName}</div>
                        </td>

                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md font-mono font-bold bg-slate-100 border border-slate-200 text-slate-900 text-xs">
                            {row.currentValue} {row.unit}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          {row.evidenceFiles && row.evidenceFiles.length > 0 ? (
                            <span
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
                              title={row.evidenceFiles[0]?.name}
                            >
                              <FileCheck2 className="w-3.5 h-3.5 text-teal-600" />
                              <span>{row.evidenceFiles.length} file(s)</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">No file</span>
                          )}
                        </td>

                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          {isVerified ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                              ✓ Verified
                            </span>
                          ) : isCorrection ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-300">
                              ✕ Correction Req
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Correct Button */}
                            <button
                              type="button"
                              onClick={() => handleMarkRowCorrect(dossierId, row.id, row.name)}
                              disabled={isVerified}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                isVerified
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-xs'
                              }`}
                              title={isVerified ? 'Row already verified and published to Auditor view' : 'Mark row as Correct and publish to Auditor'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Correct</span>
                            </button>

                            {/* Incorrect Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenCorrectionModal(dossierId, row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition-all bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 active:scale-95 shadow-xs"
                              title="Flag row as Incorrect and send to Contributor Correction Center"
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
          )}
        </div>
      )}

      {/* Row Correction Modal */}
      {correctionTarget && (
        <RequestRowCorrectionModal
          isOpen={Boolean(correctionTarget)}
          onClose={() => setCorrectionTarget(null)}
          rowName={correctionTarget.rowName}
          rowCode={correctionTarget.rowCode}
          currentValue={correctionTarget.currentValue}
          unit={correctionTarget.unit}
          onConfirm={handleConfirmRowCorrection}
        />
      )}
    </div>
  );
};
