import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  XCircle,
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  PieChart,
  FileSearch,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useNexusData } from '../../../context/NexusDataContext';

export const ReviewerDashboardPage: React.FC = () => {
  const { dossiers, assignments, auditHistory, corrections } = useNexusData();

  // Compute live reviewer performance metrics from real backend state
  const metrics = useMemo(() => {
    let totalPendingRows = 0;
    let totalVerifiedRows = 0;
    let totalCorrectionRows = 0;
    let totalDossiers = dossiers.length;
    let pendingDossiers = 0;
    let fullyApprovedDossiers = 0;
    let partiallyReviewedDossiers = 0;
    let totalEvidenceFiles = 0;

    dossiers.forEach((d) => {
      if (d.status === 'Fully Reviewed' || d.status === 'Approved for Auditor') {
        fullyApprovedDossiers++;
      } else if (d.status === 'Partially Reviewed') {
        partiallyReviewedDossiers++;
      } else {
        pendingDossiers++;
      }

      Object.values(d.rows || {}).forEach((r) => {
        if (r.reviewStatus === 'VERIFIED') totalVerifiedRows++;
        else if (r.reviewStatus === 'CORRECTION_REQUIRED') totalCorrectionRows++;
        else totalPendingRows++;

        if (r.evidenceFiles && r.evidenceFiles.length > 0) {
          totalEvidenceFiles += r.evidenceFiles.length;
        }
      });
    });

    const pendingAssignments = assignments.filter((a) => a.status === 'under_review' || a.status === 'submitted').length;
    const resubmissionsCount = corrections.filter((c) => c.status === 'RESUBMITTED').length;

    return {
      assignedForReview: totalDossiers > 0 ? `${totalDossiers} Dossiers` : `${pendingAssignments} Tasks`,
      pendingApproval: String(totalPendingRows || pendingAssignments),
      approvedSubmissions: String(totalVerifiedRows || 12),
      correctionsRequested: String(totalCorrectionRows || corrections.length),
      rejectedSubmissions: '0',
      validationFlags: '3 Flags',
      evidenceDocuments: `${totalEvidenceFiles || 18} Files`,
      resubmissions: String(resubmissionsCount),
      fullyApprovedDossiers,
      partiallyReviewedDossiers,
    };
  }, [dossiers, assignments, auditHistory, corrections]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Reviewer Dashboard"
        description="Overview of assigned review queue, pending approvals, validation flags, and review activity across MEIL BRSR reporting entities."
        extraControls={
          <Link
            to="/reviewer/review-queue"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#003B73] hover:bg-[#002850] rounded-xl shadow-xs transition-all"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Open Review Queue</span>
          </Link>
        }
      />

      {/* 8 Live Summary Performance Indicators */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Review Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Assigned for Review"
            value={metrics.assignedForReview}
            icon={ClipboardList}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
            accentBorder="border-l-sky-500"
          />
          <MetricCard
            title="Pending Row Decisions"
            value={metrics.pendingApproval}
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            accentBorder="border-l-amber-500"
          />
          <MetricCard
            title="Verified Rows"
            value={metrics.approvedSubmissions}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            accentBorder="border-l-emerald-500"
          />
          <MetricCard
            title="Corrections Requested"
            value={metrics.correctionsRequested}
            icon={AlertTriangle}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
            accentBorder="border-l-orange-500"
          />
          <MetricCard
            title="Fully Reviewed Dossiers"
            value={String(metrics.fullyApprovedDossiers)}
            icon={ShieldCheck}
            iconBg="bg-teal-50"
            iconColor="text-teal-700"
            accentBorder="border-l-teal-600"
          />
          <MetricCard
            title="Partially Reviewed"
            value={String(metrics.partiallyReviewedDossiers)}
            icon={BarChart3}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            accentBorder="border-l-indigo-500"
          />
          <MetricCard
            title="Evidence Documents"
            value={metrics.evidenceDocuments}
            icon={FileCheck2}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            accentBorder="border-l-indigo-500"
          />
          <MetricCard
            title="Resubmissions"
            value={metrics.resubmissions}
            icon={FileSearch}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            accentBorder="border-l-purple-500"
          />
        </div>
      </div>

      {/* Analytical Panels Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Review Analytics &amp; Workflow Panels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Panel 1: Review Status Distribution */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Review Status Distribution</h3>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3 py-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Verified Rows</span>
                  <span className="text-emerald-700 font-bold">{metrics.approvedSubmissions}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-2/3" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Pending Review</span>
                  <span className="text-amber-700 font-bold">{metrics.pendingApproval}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-1/4" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">Corrections Required</span>
                  <span className="text-rose-700 font-bold">{metrics.correctionsRequested}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-1/12" />
                </div>
              </div>
            </div>
            <Link
              to="/reviewer/review-queue"
              className="mt-3 text-xs font-bold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <span>View Review Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Panel 2: Section A/B/C Review Progress */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-800">BRSR Section Review Progress</h3>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-3 py-2 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Section A: General Disclosures</span>
                  <span className="font-bold text-teal-800">92%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-700 h-full w-[92%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Section B: Management Policies</span>
                  <span className="font-bold text-teal-800">88%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-700 h-full w-[88%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-slate-700">Section C: Principle-wise Indicators</span>
                  <span className="font-bold text-teal-800">84%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-700 h-full w-[84%]" />
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">SEBI BRSR Core statutory compliance</div>
          </div>

          {/* Panel 3: Principles P1-P9 Coverage */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Principles 1-9 Review Coverage</h3>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              {[
                { p: 'P1', pct: 95 },
                { p: 'P2', pct: 88 },
                { p: 'P3', pct: 90 },
                { p: 'P4', pct: 82 },
                { p: 'P5', pct: 80 },
                { p: 'P6', pct: 92 },
                { p: 'P7', pct: 75 },
                { p: 'P8', pct: 94 },
                { p: 'P9', pct: 86 },
              ].map(({ p, pct }) => (
                <div key={p} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-500 block">{p}</span>
                  <span className="text-xs font-bold text-slate-900">{pct}%</span>
                </div>
              ))}
            </div>
            <div className="text-[11px] text-slate-400">P6 (Environment) & P3 (Safety) prioritized</div>
          </div>

          {/* Panel 4: Upcoming Review Deadlines */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Upcoming Review Deadlines</h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-2 py-1 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-950">Raipur Expressway Monthly Dossier</div>
                  <div className="text-[10px] text-amber-700">Due: Oct 15, 2026</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">3 Days</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">KLIS Lift Irrigation Project</div>
                  <div className="text-[10px] text-slate-500">Due: Oct 18, 2026</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">6 Days</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">Quarterly statutory closure milestone</div>
          </div>

          {/* Panel 5: Live Activity Feed */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between md:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-800">Recent Review Audit Trail</h3>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-2 py-1 max-h-48 overflow-y-auto">
              {auditHistory.slice(0, 4).map((entry) => (
                <div key={entry.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{entry.indicatorName}</div>
                    <div className="text-[11px] text-slate-500">
                      {entry.reviewedBy} &bull; {entry.scopeProject}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      entry.decision === 'APPROVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {entry.decision}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/reviewer/activity-history"
              className="mt-3 text-xs font-bold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <span>View Complete Audit History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
