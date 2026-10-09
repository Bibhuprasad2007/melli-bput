import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  ArrowUpRight,
  ShieldCheck,
  PieChart as PieChartIcon,
  BarChart2,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { EvidenceDocumentItem } from '../../../types/reviewer';
import type { Assignment } from '../../../context/NexusDataContext';

interface EvidenceCompletionKPICardProps {
  evidence: EvidenceDocumentItem[];
  assignments?: Assignment[];
}

type EvidenceView = 'status' | 'pillars' | 'docTypes';

export const EvidenceCompletionKPICard: React.FC<EvidenceCompletionKPICardProps> = ({
  evidence,
}) => {
  const [activeView, setActiveView] = useState<EvidenceView>('status');

  const totalFiles = evidence.length || 1;
  const acceptedFiles = evidence.filter((e) => e.status === 'ACCEPTED').length;
  const underReviewFiles = evidence.filter(
    (e) => e.status === 'UNDER_REVIEW' || e.status === 'UPLOADED'
  ).length;
  const flaggedFiles = evidence.filter(
    (e) => e.status === 'REPLACEMENT_REQUESTED' || e.status === 'REJECTED'
  ).length;

  const completionRate = Math.round((acceptedFiles / totalFiles) * 100);

  // 1. Evidence Verification Status (Donut Chart)
  const statusPieData = [
    { name: 'Verified & Accepted', value: acceptedFiles, color: '#059669' },
    { name: 'Under Audit Review', value: underReviewFiles, color: '#F59E0B' },
    { name: 'Replacement Flagged', value: flaggedFiles, color: '#DC2626' },
  ].filter((item) => item.value > 0);

  const pieData =
    statusPieData.length > 0
      ? statusPieData
      : [{ name: 'Verified & Accepted', value: 1, color: '#059669' }];

  // 2. ESG Pillar Completeness Breakdown (Bar Chart)
  const pillarData = [
    { pillar: 'Environmental', short: 'Env (P6)', rate: 88, target: 100, fill: '#059669' },
    { pillar: 'Social & HR', short: 'Soc (P3/5)', rate: 75, target: 100, fill: '#0284C7' },
    { pillar: 'Governance', short: 'Gov (P1)', rate: 100, target: 100, fill: '#6366F1' },
    { pillar: 'Stakeholder', short: 'Stake (P4)', rate: 82, target: 100, fill: '#10B981' },
  ];

  // 3. Document Category Breakdown (Bar Chart)
  const docTypeData = [
    { type: 'Energy & Fuel Invoices', rate: 94, fill: '#003B73' },
    { type: 'ETP / CEMS Calibration', rate: 83, fill: '#0284C7' },
    { type: 'Third-Party Safety Audit', rate: 100, fill: '#059669' },
    { type: 'CSR Bank Vouchers', rate: 78, fill: '#D97706' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
      {/* Decorative top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-[#003B73]" />

      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-xs shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Statutory Assurance KPI
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  SEBI Tier-1 Core
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Evidence Upload Completion
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* View Switcher Buttons */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('status')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                  activeView === 'status'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Status Donut"
              >
                <PieChartIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Status</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('pillars')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                  activeView === 'pillars'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Pillar Breakdown"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pillars</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('docTypes')}
                className={`px-2 py-1 rounded-md font-semibold flex items-center gap-1 transition-all ${
                  activeView === 'docTypes'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Document Categories"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Doc Types</span>
              </button>
            </div>

            <Link
              to="/admin/evidence-configuration"
              className="text-xs font-semibold text-[#003B73] hover:text-[#002244] inline-flex items-center gap-0.5 group px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Manage Evidence Configuration"
            >
              <span>Vault</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Primary Metric & Context Summary Row */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 mb-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                {completionRate}%
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                {acceptedFiles} of {totalFiles} verified documents
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <strong className="text-emerald-700 font-bold">100%</strong> Gov Disclosures
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline">
                Flagged: <strong className="text-rose-600 font-bold">{flaggedFiles}</strong>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            Statutory evidence files (power bills, NABL lab test certs, water flow logs, human rights policies) verified for reasonable assurance.
          </p>
        </div>

        {/* Interactive Recharts Canvas */}
        <div className="bg-white p-3 rounded-xl border border-slate-100 mb-3">
          {activeView === 'status' && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Donut chart */}
              <div className="sm:col-span-6 flex flex-col items-center justify-center">
                <div className="w-40 h-40 relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          `${val ?? 0} Documents (${Math.round(((val ?? 0) / totalFiles) * 100)}%)`,
                          name ?? 'Status',
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
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Donut Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-base font-extrabold text-slate-900 leading-none font-mono">
                      {acceptedFiles}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
                      Verified
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Assurance Status Distribution</span>
              </div>

              {/* Legend & Breakdown stats */}
              <div className="sm:col-span-6 space-y-1.5 text-xs">
                {statusPieData.map((d) => (
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

          {activeView === 'pillars' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span className="font-semibold">Evidence Completeness by ESG Pillar</span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  100% Target for Board Audit
                </span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={pillarData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="short" tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip
                      formatter={(val: any, _, item: any) => [
                        `${val ?? 0}% Verified`,
                        item.payload.pillar,
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
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]} barSize={22}>
                      {pillarData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeView === 'docTypes' && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span className="font-semibold">Verification by Critical Statutory Category</span>
                <span className="text-[11px] text-slate-500 font-medium">SEBI BRSR Core Mandates</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart
                    data={docTypeData}
                    layout="vertical"
                    margin={{ top: 5, right: 15, left: 35, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis
                      dataKey="type"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#334155', fontWeight: 500 }}
                      width={100}
                    />
                    <Tooltip
                      formatter={(val: any) => [`${val ?? 0}%`, 'Attached & Verified']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                        padding: '6px 10px',
                      }}
                    />
                    <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={12}>
                      {docTypeData.map((entry, index) => (
                        <Cell key={`dt-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Badges Footer */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Accepted</span>
            <span className="font-bold text-emerald-900 font-mono text-sm">{acceptedFiles}</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded font-medium">Valid</span>
        </div>

        <div className="bg-amber-50/70 p-2.5 rounded-lg border border-amber-100 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Under Review</span>
            <span className="font-bold text-amber-900 font-mono text-sm">{underReviewFiles}</span>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded font-medium">Queue</span>
        </div>

        <div className="bg-rose-50/70 p-2.5 rounded-lg border border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Flagged</span>
            <span className="font-bold text-rose-900 font-mono text-sm">{flaggedFiles}</span>
          </div>
          <span className="text-[10px] text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded font-medium">Action</span>
        </div>

        <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-slate-500 text-[11px] block">Total In Vault</span>
            <span className="font-bold text-slate-800 font-mono text-sm">{totalFiles}</span>
          </div>
          <span className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded font-medium border border-slate-200">100%</span>
        </div>
      </div>
    </div>
  );
};
