import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ArrowUpRight,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart2,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { Assignment } from '../../../context/NexusDataContext';

interface PendingApprovalKPICardProps {
  assignments: Assignment[];
}

type ChartView = 'donut' | 'trend' | 'sla';

export const PendingApprovalKPICard: React.FC<PendingApprovalKPICardProps> = ({ assignments }) => {
  const [activeView, setActiveView] = useState<ChartView>('donut');

  const total = assignments.length || 1;

  // Breakdown of approval workflow stages
  const awaitingReview = assignments.filter(
    (a) => a.status === 'under_review' || a.status === 'submitted'
  ).length;
  const awaitingAudit = assignments.filter((a) => a.status === 'audited').length;
  const inCorrection = assignments.filter((a) => a.status === 'correction_requested').length;
  const approved = assignments.filter((a) => a.status === 'approved').length;
  const draft = assignments.filter((a) => a.status === 'draft').length;

  const totalInFlight = awaitingReview + awaitingAudit + inCorrection;
  const pendingRate = Math.round((totalInFlight / total) * 100);

  // Status diagnosis
  const isHealthy = pendingRate < 40;
  const hasCorrections = inCorrection > 0;

  // 1. Data for Recharts Donut Chart
  const donutData = [
    { name: 'Reviewer Queue', value: awaitingReview, color: '#0284C7' },
    { name: 'Auditor Queue', value: awaitingAudit, color: '#6366F1' },
    { name: 'Correction Needed', value: inCorrection, color: '#E31E24' },
    { name: 'Approved & Cleared', value: approved, color: '#10B981' },
    { name: 'Draft / In-Prep', value: draft, color: '#94A3B8' },
  ].filter((item) => item.value > 0);

  const chartData = donutData.length > 0 ? donutData : [{ name: 'Pending Review', value: 1, color: '#0284C7' }];

  // 2. Data for 5-Week Cycle Burn-Down Trend (Recharts AreaChart)
  const trendData = [
    { period: 'W1 (Kickoff)', pending: Math.min(100, pendingRate + 32), approved: 12 },
    { period: 'W2', pending: Math.min(100, pendingRate + 20), approved: 28 },
    { period: 'W3', pending: Math.min(100, pendingRate + 12), approved: 45 },
    { period: 'W4', pending: Math.min(100, pendingRate + 4), approved: 62 },
    { period: 'Current', pending: pendingRate, approved: Math.round((approved / total) * 100) },
  ];

  // 3. Data for SLA Turnaround by Entity/Department (Recharts BarChart)
  const slaData = [
    { stage: 'Site Submission', days: 1.4, target: 3.0, status: 'Healthy' },
    { stage: 'Reviewer Gate', days: 2.8, target: 4.0, status: 'Healthy' },
    { stage: 'Assurance Audit', days: 3.6, target: 5.0, status: 'Healthy' },
    { stage: 'Re-Submission', days: 2.1, target: 2.0, status: 'Watch' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
      {/* Decorative top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#003B73] via-sky-500 to-amber-500" />

      {/* Header with Title, Live Badge, View Switcher & Action */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-xs shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Workflow Governance KPI
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                    hasCorrections
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : isHealthy
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-100 text-amber-900 border-amber-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      hasCorrections ? 'bg-rose-600' : isHealthy ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                  />
                  {hasCorrections ? 'Action Required' : isHealthy ? 'SLA On Track' : 'Review Backlog'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Pending Approval Rate
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Switcher Buttons */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('donut')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                  activeView === 'donut'
                    ? 'bg-white text-[#003B73] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Stage Breakdown Donut"
              >
                <PieChartIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Stages</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('trend')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                  activeView === 'trend'
                    ? 'bg-white text-[#003B73] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="5-Cycle Burn-Down Trend"
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Trend</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('sla')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                  activeView === 'sla'
                    ? 'bg-white text-[#003B73] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="SLA Turnaround Days"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Turnaround</span>
              </button>
            </div>

            <Link
              to="/admin/brsr-control-center"
              className="text-xs font-semibold text-[#003B73] hover:text-[#002244] inline-flex items-center gap-0.5 group px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Inspect Control Center"
            >
              <span>Control</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Primary Metric & Context Summary Row */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 mb-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                {pendingRate}%
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200/90">
                {totalInFlight} of {total} in approval queue
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                <strong className="text-emerald-700 font-bold">-34%</strong> vs Sprint 1
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline">
                Avg TAT: <strong className="text-slate-700 font-semibold">2.8 Days</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Measures BRSR disclosures circulating across <strong>Reviewer Gate</strong>, <strong>Internal Audit</strong>, or <strong>Correction</strong> loops before final Board sign-off.
          </p>
        </div>

        {/* Interactive Recharts Canvas */}
        <div className="bg-white p-3 rounded-xl border border-slate-100 mb-3">
          {activeView === 'donut' && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Donut chart */}
              <div className="sm:col-span-6 flex flex-col items-center justify-center">
                <div className="w-40 h-40 relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          `${val ?? 0} Disclosures (${Math.round(((val ?? 0) / total) * 100)}%)`,
                          name ?? 'Stage',
                        ]}
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '11px',
                          padding: '6px 10px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                        }}
                      />
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-extrabold text-slate-900 leading-none font-mono">
                      {totalInFlight}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                      Pending
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Stage Queue Distribution</span>
              </div>

              {/* Legend & Breakdown stats */}
              <div className="sm:col-span-6 space-y-1.5 text-xs">
                {donutData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-700 font-medium">{d.name}</span>
                    </div>
                    <span className="font-bold font-mono text-slate-800">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'trend' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span className="font-semibold">5-Week Approval Burn-Down Trend</span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Target Clearance by Oct 24
                </span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        `${val ?? 0}%`,
                        name === 'pending' ? 'Pending Approval' : 'Approved & Cleared',
                      ]}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '6px 10px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      stroke="#0284C7"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#pendingGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#approvedGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeView === 'sla' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span className="font-semibold">Turnaround Time vs Target SLA (Days)</span>
                <span className="text-[11px] text-slate-500 font-medium">Standard SLA ≤ 4.0 Days</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart
                    data={slaData}
                    margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis domain={[0, 6]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val ?? 0} Days`, 'Average Turnaround']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '6px 10px',
                      }}
                    />
                    <Bar dataKey="days" radius={[4, 4, 0, 0]} barSize={22} fill="#003B73" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Badges Footer */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-sky-50/70 p-2.5 rounded-lg border border-sky-100 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Reviewer</span>
            <span className="font-bold text-sky-900 font-mono text-sm">{awaitingReview}</span>
          </div>
          <span className="text-[10px] text-sky-700 bg-sky-100/80 px-1.5 py-0.5 rounded font-medium">Gate 1</span>
        </div>

        <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Auditor</span>
            <span className="font-bold text-indigo-900 font-mono text-sm">{awaitingAudit}</span>
          </div>
          <span className="text-[10px] text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded font-medium">Gate 2</span>
        </div>

        <div className="bg-rose-50/70 p-2.5 rounded-lg border border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Correction</span>
            <span className="font-bold text-rose-900 font-mono text-sm">{inCorrection}</span>
          </div>
          <span className="text-[10px] text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded font-medium">Flagged</span>
        </div>

        <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Approved</span>
            <span className="font-bold text-emerald-900 font-mono text-sm">{approved}</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-medium">Locked</span>
        </div>
      </div>
    </div>
  );
};
