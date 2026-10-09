import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  AlertTriangle,
  Send,
  FileText,
  ArrowRight,
  ShieldCheck,
  FolderCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useContributorData } from '../context/ContributorDataContext';
import { PRINCIPLES_CONFIG } from '../data/contributorPrinciplesData';

export const ContributorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeScope,
    fieldEntries,
    corrections,
    lastSavedTimestamp,
    getCompletionStats,
  } = useContributorData();

  const stats = getCompletionStats();

  // Calculate principle progress breakdown from PRINCIPLES_CONFIG
  const principleProgress = PRINCIPLES_CONFIG.map((p) => {
    let totalFields = 0;
    let filledFields = 0;
    let evidenceCount = 0;
    let requiredEvidenceCount = 0;

    for (const sub of p.subsections) {
      for (const f of sub.fields) {
        totalFields++;
        const entry = fieldEntries[f.id];
        if (entry) {
          if (entry.isNotApplicable || (entry.value !== '' && entry.value !== undefined)) {
            filledFields++;
          }
          if (f.requiredEvidenceName) {
            requiredEvidenceCount++;
            if (entry.evidence && entry.evidence.length > 0) {
              evidenceCount++;
            }
          }
        }
      }
    }

    const pct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    const evPct = requiredEvidenceCount > 0 ? Math.round((evidenceCount / requiredEvidenceCount) * 100) : 100;

    return {
      id: p.id,
      code: p.principle,
      name: p.title,
      shortTitle: p.shortTitle,
      description: p.description,
      total: totalFields,
      filled: filledFields,
      pct,
      evPct,
    };
  });

  // Calculate environmental / social / governance sub-completion
  const envPrinciples = principleProgress.filter((p) => ['P6', 'P2'].includes(p.code));
  const socPrinciples = principleProgress.filter((p) => ['P3', 'P4', 'P5', 'P8'].includes(p.code));
  const govPrinciples = principleProgress.filter((p) => ['P1', 'P7', 'P9'].includes(p.code));

  const calcCatPct = (list: typeof principleProgress) => {
    const total = list.reduce((acc, curr) => acc + curr.total, 0);
    const filled = list.reduce((acc, curr) => acc + curr.filled, 0);
    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  const envPct = calcCatPct(envPrinciples);
  const socPct = calcCatPct(socPrinciples);
  const govPct = calcCatPct(govPrinciples);

  // GHG emissions calculation
  const dieselLitres = Number(fieldEntries['p6_diesel_litres']?.value || 5200);
  const gridKwh = Number(fieldEntries['p6_grid_electricity_kwh']?.value || 52500);
  const scope1Ghg = (dieselLitres * 2.68) / 1000; // tCO2e
  const scope2Ghg = (gridKwh * 0.716) / 1000; // tCO2e
  const totalGhg = scope1Ghg + scope2Ghg;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="MEIL ESG NEXUS — Data Contributor Portal"
        description="Project-level ESG data entry, verification evidence indexing, GHG activity calculations, and SEBI BRSR Core compliance reporting."
      />

      {/* Contributor Profile & Active Scope Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-5 text-white shadow-lg border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Data Contributor Role
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-200">
                Cycle: {activeScope.reportingYear}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Status: IN PROGRESS
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-400" />
                Autosaved: {lastSavedTimestamp}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{activeScope.projectName}</span>
              <span className="text-xs font-normal text-teal-300/80 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-700/50">
                {activeScope.projectCode}
              </span>
            </h2>
            <p className="text-xs text-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span><strong>Subsidiary:</strong> {activeScope.subsidiary}</span>
              <span>•</span>
              <span><strong>Business Unit:</strong> {activeScope.businessUnit}</span>
              <span>•</span>
              <span><strong>Assigned Site:</strong> {activeScope.siteName}</span>
              <span>•</span>
              <span><strong>Dept:</strong> {activeScope.department}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/contributor/assignments/meil-p01')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-slate-950" />
              <span>Continue Data Entry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/contributor/corrections')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Corrections ({corrections.filter((c) => c.status === 'PENDING_CONTRIBUTOR').length})</span>
            </button>
            
          </div>
        </div>
      </div>

      {/* Enterprise KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Indicators</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-800">{stats.totalFields}</span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">9 Principles</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">BRSR Essential &amp; Core</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Completed Data</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{stats.completedFields}</span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {stats.completionPct}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{stats.totalFields - stats.completedFields} pending entries</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-teal-300 transition-colors">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Evidence Indexed</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-teal-800">{stats.evidenceUploaded}</span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
              {stats.evidencePct}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{stats.evidenceTotal - stats.evidenceUploaded} missing files</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Validation Anomalies</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">{stats.anomaliesCount}</span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">YoY Flagged</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Require explanations</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-orange-300 transition-colors">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Review Corrections</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-orange-600">
              {corrections.filter((c) => c.status === 'PENDING_CONTRIBUTOR').length}
            </span>
            <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">Action Req</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Returned by Reviewer</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-colors">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Calculated GHG</p>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-sky-800">
              {totalGhg.toFixed(1)}
            </span>
            <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">tCO2e</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Scope 1 + Scope 2</p>
        </div>
      </div>

      {/* Main Section: Project ESG Progress Card & Principle Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Project Card & Principles */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project ESG Status Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-teal-700">Project Performance</span>
                <h3 className="text-base font-bold text-slate-800">
                  {activeScope.projectName} ({activeScope.siteName})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {activeScope.reportingYear}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  Target Deadline: 31 March 2027
                </span>
              </div>
            </div>

            {/* 4 Core Completion Progress Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-1">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Environment</span>
                  <span className="text-teal-700">{envPct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${envPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Energy, GHG, Water, Waste</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Social</span>
                  <span className="text-emerald-700">{socPct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${socPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Workforce, OHS, CSR, R&R</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Governance</span>
                  <span className="text-indigo-700">{govPct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${govPct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Ethics, Anti-Corruption, Cyber</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>Evidence Files</span>
                  <span className="text-sky-700">{stats.evidencePct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.evidencePct}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{stats.evidenceUploaded} of {stats.evidenceTotal} linked</span>
              </div>
            </div>

            {/* Warning & Readiness Alert Bar */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">Pre-Submission Readiness Check:</span>
                <span className="text-amber-700">
                  {stats.totalFields - stats.completedFields} pending entries • {stats.evidenceTotal - stats.evidenceUploaded} missing documents • {stats.anomaliesCount} validation warnings • {corrections.filter((c) => c.status === 'PENDING_CONTRIBUTOR').length} active corrections
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/contributor/assignments/meil-p01')}
                className="text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Inspect Issues
              </button>
            </div>
          </div>

          {/* 9 Principles Progress Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">9 NGRBC / SEBI BRSR Principles Progress</h3>
                <p className="text-xs text-slate-500">Operational data entry completion across project operational boundaries</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">P1 to P9</span>
            </div>

            <div className="space-y-3">
              {principleProgress.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate('/contributor/assignments/meil-p01')}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-teal-300 hover:bg-teal-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-800 text-xs font-bold flex items-center justify-center shrink-0 transition-colors">
                        {p.code}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-900 transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">{p.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-800">{p.filled} / {p.total}</span>
                        <span className="text-[10px] text-slate-400 block">{p.pct}% complete</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 transition-colors" />
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): GHG Preview, Traceability, Actions */}
        <div className="space-y-6">
          {/* Calculated GHG Inventory Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  GHG Activity Calculations
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Automated Engine
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Scope 1 (Direct Fuel)</span>
                  <span className="font-bold text-slate-900">
                    {scope1Ghg.toFixed(2)} tCO2e
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Diesel ({fieldEntries['p6_diesel_litres']?.value || '5,200'} L × 2.68 kg CO2e/L)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Scope 2 (Purchased Grid)</span>
                  <span className="font-bold text-slate-900">
                    {scope2Ghg.toFixed(2)} tCO2e
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Grid Power ({fieldEntries['p6_grid_electricity_kwh']?.value || '52,500'} kWh × 0.716 kg CO2e/kWh)
                </p>
              </div>

              <div className="p-3 bg-teal-900 text-white rounded-xl shadow-sm">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Total Scope 1 + 2 Footprint</span>
                  <span className="text-teal-300 text-sm">
                    {totalGhg.toFixed(2)} tCO2e
                  </span>
                </div>
                <p className="text-[10px] text-teal-200/80 mt-1">
                  Reconciles directly into MEIL Subsidiary &amp; Group BRSR disclosures
                </p>
              </div>
            </div>
          </div>

          {/* Traceable Data Chain Explainer */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 p-5 rounded-2xl text-white shadow-md space-y-3.5 border border-teal-800/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Traceable ESG Data Chain
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every figure entered at this project site is locked with supporting audit evidence, timestamp, and mathematical formula before consolidation into the SEBI BRSR Core report:
            </p>
            <div className="text-[11px] font-mono text-teal-200/90 bg-black/40 p-3 rounded-lg border border-teal-800/40 space-y-1">
              <div>Invoice / Meter Slip</div>
              <div className="text-slate-400 pl-2">↓ Verified by Contributor</div>
              <div>{activeScope.siteName} ({activeScope.projectName})</div>
              <div className="text-slate-400 pl-2">↓ Automated Aggregation</div>
              <div>{activeScope.businessUnit} → {activeScope.subsidiary}</div>
              <div className="text-slate-400 pl-2">↓ Consolidation</div>
              <div className="text-emerald-400 font-bold">MEIL Group BRSR Core Disclosure</div>
            </div>
          </div>

          {/* Quick Contributor Tools */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Contributor Actions
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => navigate('/contributor/assignments/meil-p01')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Universal Data Entry</p>
                    <p className="text-[10px] text-slate-400">Contextual uploads & formulas</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/contributor/evidence')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <FolderCheck className="w-4 h-4 text-sky-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Evidence Repository</p>
                    <p className="text-[10px] text-slate-400">{stats.evidenceUploaded} uploaded documents</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/contributor/submissions')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-indigo-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Project ESG Summary</p>
                    <p className="text-[10px] text-slate-400">Review & submit package</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
