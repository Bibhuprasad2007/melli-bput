import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useNexusData } from '../../../context/NexusDataContext';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertOctagon,
  AlertTriangle,
  FileCheck,
  Lock,
  PlusCircle,
  UserPlus,
  ClipboardList,
  Send,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { PageHeader } from '../common/PageHeader';
import { MetricCard } from '../common/MetricCard';
import { PendingApprovalKPICard } from '../dashboard/PendingApprovalKPICard';
import { EvidenceCompletionKPICard } from '../dashboard/EvidenceCompletionKPICard';
import { CreateCycleModal } from '../modals/CreateCycleModal';
import { CreateUserModal } from '../modals/CreateUserModal';
import { CreateAssignmentModal } from '../modals/CreateAssignmentModal';
import { SendReminderModal } from '../modals/SendReminderModal';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const DashboardPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();

  const [isCreateCycleOpen, setIsCreateCycleOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isSendReminderOpen, setIsSendReminderOpen] = useState(false);

  const {
    users,
    organizations,
    assignments,
    evidence,
    reportingCycles,
    systemAuditLogs,
  } = useNexusData();

  const totalUsers = users.length;
  const totalProjects = organizations.filter((o) => o.type === 'Project').length;

  const totalAssignments = assignments.length || 1;
  const pendingSubmissions = assignments.filter((a) => a.status === 'draft').length;
  const awaitingReview = assignments.filter((a) => a.status === 'under_review').length;
  const approved = assignments.filter((a) => a.status === 'approved').length;
  const brsrCompletion = Math.round((approved / totalAssignments) * 100);

  // Section A/B/C completion data for recharts
  const sectionData = [
    { section: 'Section A', name: 'General Disclosures', complete: 85 },
    { section: 'Section B', name: 'Management & Process', complete: 72 },
    { section: 'Section C', name: 'Principle-wise Perf.', complete: Math.max(brsrCompletion, 64) },
  ];

  // Principles P1-P9 compliance progress data for recharts
  const principlesData = [
    { principle: 'P1', name: 'Ethics & Governance', score: 88, fill: '#003B73' },
    { principle: 'P2', name: 'Product Lifecycle', score: 74, fill: '#0284C7' },
    { principle: 'P3', name: 'Employee Well-being', score: 82, fill: '#059669' },
    { principle: 'P4', name: 'Stakeholder Engagement', score: 79, fill: '#10B981' },
    { principle: 'P5', name: 'Human Rights', score: 92, fill: '#6366F1' },
    { principle: 'P6', name: 'Environmental Care', score: 68, fill: '#F59E0B' },
    { principle: 'P7', name: 'Policy Advocacy', score: 86, fill: '#003B73' },
    { principle: 'P8', name: 'Inclusive Growth', score: 81, fill: '#059669' },
    { principle: 'P9', name: 'Consumer Value', score: 85, fill: '#0284C7' },
  ];

  // Entity comparison data for recharts
  const entityData = [
    { name: 'MEIL Infra Ltd', rate: 82, fill: '#003B73' },
    { name: 'Clean Energy', rate: 75, fill: '#059669' },
    { name: 'Hydrocarbons', rate: 64, fill: '#D97706' },
    { name: 'Irrigation BU', rate: 58, fill: '#0284C7' },
  ];

  // Validation / Exception trend data for recharts
  const validationTrend = [
    { cycle: 'Sprint 1', passed: 38, exceptions: 5 },
    { cycle: 'Sprint 2', passed: 52, exceptions: 4 },
    { cycle: 'Sprint 3', passed: 67, exceptions: 3 },
    { cycle: 'Sprint 4', passed: 81, exceptions: 2 },
    { cycle: 'Sprint 5', passed: 94, exceptions: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="ESG Administration Dashboard"
        description="Enterprise ESG reporting command center, statutory BRSR performance indicators, evidence audits, and organizational workflow tracking across MEIL entities."
      />

      {/* Quick Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#003B73]" />
            <span>Quick Governance Actions</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateCycleOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Reporting Cycle</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateUserOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateAssignmentOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Assign Tasks</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSendReminderOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        FEATURED VISUAL KPI CARDS (Recharts Powered)
        - 'Pending Approval Rate' Visual KPI Card
        - 'Evidence Upload Completion' Visual KPI Card
        ========================================================================
      */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Statutory Assurance &amp; Workflow Visual KPIs
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live data analytics powered by Recharts for real-time bottleneck detection and evidence compliance
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-lg">
            <span>Cycle:</span>
            <strong className="text-slate-900 font-semibold">
              {reportingCycles[0]?.name || 'FY 2026-27 (Q2)'}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Visual KPI Card 1: Pending Approval Rate */}
          <PendingApprovalKPICard assignments={assignments} />

          {/* Visual KPI Card 2: Evidence Upload Completion */}
          <EvidenceCompletionKPICard evidence={evidence} assignments={assignments} />
        </div>
      </div>

      {/* Secondary Standard Metric Cards Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Platform Summary Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Projects / Plants"
            value={totalProjects.toString()}
            icon={Building2}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
            accentBorder="border-l-[#003B73]"
            note="Active infrastructure sites"
          />
          <MetricCard
            title="Total Users"
            value={totalUsers.toString()}
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            accentBorder="border-l-blue-600"
            note="5-tier authorized accounts"
          />
          <MetricCard
            title="BRSR Completion"
            value={`${brsrCompletion}%`}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            accentBorder="border-l-emerald-500"
            note="FY 2026-27 Core Progress"
          />
          <MetricCard
            title="Pending Submissions"
            value={pendingSubmissions.toString()}
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            accentBorder="border-l-amber-500"
            note="Draft items in progress"
          />
          <MetricCard
            title="Overdue Tasks"
            value="0"
            icon={AlertOctagon}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
            accentBorder="border-l-rose-500"
            note="0 deadline breaches"
          />
          <MetricCard
            title="Validation Errors"
            value="0"
            icon={AlertTriangle}
            iconBg="bg-red-50"
            iconColor="text-red-600"
            accentBorder="border-l-[#E31E24]"
            note="Zero fatal checksum errors"
          />
          <MetricCard
            title="Awaiting Review"
            value={awaitingReview.toString()}
            icon={FileCheck}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            accentBorder="border-l-indigo-500"
            note="Quality control queue"
          />
          <MetricCard
            title="Approved / Locked"
            value={approved.toString()}
            icon={Lock}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            accentBorder="border-l-slate-600"
            note="Audited & statutory locked"
          />
        </div>
      </div>

      {/* 
        ========================================================================
        ANALYTICAL & GOVERNANCE PANELS (Recharts Visualizations)
        ========================================================================
      */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Analytical &amp; Governance Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Panel 1: Section A/B/C Completion */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-[#003B73]" />
                  <h3 className="text-sm font-bold text-slate-800">Section A/B/C Completion</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">SEBI Structure</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Completion rates across General Disclosures, Management Processes, and Principle Metrics.
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <XAxis dataKey="section" tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val ?? 0}%`, 'Completion']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="complete" radius={[4, 4, 0, 0]} barSize={26}>
                      {sectionData.map((_, index) => (
                        <Cell
                          key={`sec-${index}`}
                          fill={index === 0 ? '#003B73' : index === 1 ? '#0284C7' : '#059669'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Section A: <strong>85%</strong></span>
              <span>Section B: <strong>72%</strong></span>
              <span>Section C: <strong>{brsrCompletion}%</strong></span>
            </div>
          </div>

          {/* Panel 2: Principles P1-P9 Completion */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-800">Principles P1-P9 Performance</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">Core 9</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Compliance score distribution across all 9 statutory Business Responsibility principles.
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={principlesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="principle" tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip
                      formatter={(val: any, _, item: any) => [
                        `${val ?? 0}%`,
                        item.payload.name,
                      ]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="score" radius={[3, 3, 0, 0]} barSize={14}>
                      {principlesData.map((entry, index) => (
                        <Cell key={`p-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-emerald-700 font-semibold">Top: P5 Human Rights (92%)</span>
              <span className="text-amber-700 font-semibold">Priority: P6 Env (68%)</span>
            </div>
          </div>

          {/* Panel 3: Project / Department Progress */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-800">Subsidiary &amp; BU Rollup</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">Consolidated</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Comparative ESG reporting completion across main MEIL operating subsidiaries.
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={entityData}
                    layout="vertical"
                    margin={{ top: 5, right: 15, left: 35, bottom: 0 }}
                  >
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 10, fill: '#334155', fontWeight: 500 }}
                      width={70}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val ?? 0}%`, 'Submission Progress']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={14}>
                      {entityData.map((entry, index) => (
                        <Cell key={`ent-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <Link to="/admin/consolidation" className="text-[#003B73] font-semibold hover:underline flex items-center gap-1">
                <span>View Multi-Tier Rollup</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <span>4 Entities Tracked</span>
            </div>
          </div>

          {/* Panel 4: Upcoming Governance Deadlines */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-800">Statutory Reporting Calendar</h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  On Schedule
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Key statutory deadlines for data lock, internal audit sign-off, and Board submission.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <div>
                      <p className="font-semibold text-slate-800">Q2 Data Collection Freeze</p>
                      <p className="text-[11px] text-slate-500">All Site Contributors</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-700 font-bold bg-white px-2 py-1 rounded border border-slate-200">
                    Oct 15, 2026
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <div>
                      <p className="font-semibold text-slate-800">Auditor Sign-off Deadline</p>
                      <p className="text-[11px] text-slate-500">Quality &amp; Assurance Wing</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-700 font-bold bg-white px-2 py-1 rounded border border-slate-200">
                    Oct 24, 2026
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-semibold text-slate-800">Board CSR &amp; ESG Approval</p>
                      <p className="text-[11px] text-slate-500">Executive Committee</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-700 font-bold bg-white px-2 py-1 rounded border border-slate-200">
                    Oct 30, 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <Link to="/admin/reporting-periods" className="text-[#003B73] font-semibold hover:underline flex items-center gap-1">
                <span>Configure Cycles</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <span>3 Milestones Active</span>
            </div>
          </div>

          {/* Panel 5: Exception & Validation Trends */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800">Validation Pass Rate Trend</h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  98.4% Pass
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Automated rule verification pass rate across formula checks, units, and year-over-year bounds.
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={validationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="valPassGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="cycle" tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val ?? 0}%`, 'Clean Pass Rate']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="passed"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#valPassGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <Link to="/admin/validation-rules" className="text-[#003B73] font-semibold hover:underline flex items-center gap-1">
                <span>Validation Rule Master</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <span className="text-emerald-700 font-semibold">Zero Fatal Errors</span>
            </div>
          </div>

          {/* Panel 6: Recent Audit & Activity Stream */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800">Immutable Audit Stream</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">Live Feed</span>
              </div>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Real-time governance activity logs recording submissions, evidence checks, and approvals.
              </p>

              <div className="space-y-2 text-xs">
                {systemAuditLogs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="font-semibold text-slate-800 leading-tight">{log.action}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
                      <span className="text-[10px] text-slate-400 font-mono">
                        by {log.actorName} ({log.actorRole})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <Link to="/admin/audit-logs" className="text-[#003B73] font-semibold hover:underline flex items-center gap-1">
                <span>View Full Audit Trail</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <span>{systemAuditLogs.length} Events Logged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals for Quick Actions */}
      <CreateCycleModal
        isOpen={isCreateCycleOpen}
        onClose={() => setIsCreateCycleOpen(false)}
        onShowToast={addToast}
      />
      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onShowToast={addToast}
      />
      <CreateAssignmentModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
        onShowToast={addToast}
      />
      <SendReminderModal
        isOpen={isSendReminderOpen}
        onClose={() => setIsSendReminderOpen(false)}
        onShowToast={addToast}
      />
    </div>
  );
};
