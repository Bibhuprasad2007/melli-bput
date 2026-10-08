import React, { useState } from 'react';
import {
  Send,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { MetricCard } from '../../admin/common/MetricCard';
import { useContributorData } from '../context/ContributorDataContext';
import { PRINCIPLES_CONFIG } from '../data/contributorPrinciplesData';

export const ContributorSubmissionsPage: React.FC = () => {
  const {
    activeScope,
    fieldEntries,
    getCompletionStats,
    lastSavedTimestamp,
  } = useContributorData();

  const stats = getCompletionStats();

  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'HISTORY'>('SUMMARY');

  // GHG emissions calculation
  const dieselLitres = Number(fieldEntries['p6_diesel_litres']?.value || 5200);
  const gridKwh = Number(fieldEntries['p6_grid_electricity_kwh']?.value || 52500);
  const scope1Ghg = (dieselLitres * 2.68) / 1000;
  const scope2Ghg = (gridKwh * 0.716) / 1000;
  const totalGhg = scope1Ghg + scope2Ghg;

  const handleExportCsv = (type: 'esg_data' | 'ghg_inventory') => {
    let csvContent = '';

    if (type === 'ghg_inventory') {
      csvContent =
        'Reporting_Year,Project,Site,Scope,Activity,Quantity,Unit,Emission_Factor,Factor_Source,Calculated_tCO2e\n' +
        `"${activeScope.reportingYear}","${activeScope.projectName}","${activeScope.siteName}","Scope 1","Diesel Stationary/Mobile","${dieselLitres}","Litres","2.68 kg CO2e/L","IPCC Guidelines & MEIL Factor","${scope1Ghg.toFixed(2)}"\n` +
        `"${activeScope.reportingYear}","${activeScope.projectName}","${activeScope.siteName}","Scope 2","Purchased Grid Power","${gridKwh}","kWh","0.716 kg CO2e/kWh","CEA Grid Average CO2 Database","${scope2Ghg.toFixed(2)}"\n` +
        `"${activeScope.reportingYear}","${activeScope.projectName}","${activeScope.siteName}","Total","Scope 1 + 2 Footprint","--","--","--","Consolidated Project Total","${totalGhg.toFixed(2)}"\n`;
    } else {
      csvContent =
        'Indicator_Code,Principle,Metric_Name,Reported_Value,Unit,Reporting_Period,Data_Source,Evidence_Files,Status\n';
      for (const p of PRINCIPLES_CONFIG) {
        for (const sub of p.subsections) {
          for (const f of sub.fields) {
            const entry = fieldEntries[f.id];
            const val = entry?.value ?? (f.defaultValue ?? '');
            const evCount = entry?.evidence?.length || 0;
            const st = entry?.status || 'READY';
            csvContent += `"${f.code}","${f.principle}","${f.label}","${val}","${f.unit}","March 2027","${entry?.source || 'Invoice'}","${evCount} file(s)","${st}"\n`;
          }
        }
      }
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_${activeScope.projectCode}_${type}_${activeScope.reportingYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project ESG Summary & Submissions Monitor"
        description="Consolidated project-level ESG disclosure sign-off package, verification evidence audit status, and submission history for SEBI BRSR Core consolidation."
      />

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Mandatory Indicators"
          value={`${stats.completionPct}%`}
          icon={CheckCircle2}
          iconBg="bg-teal-50"
          iconColor="text-teal-700"
          accentBorder="border-l-teal-600"
        />
        <MetricCard
          title="Required Evidence Indexed"
          value={`${stats.evidencePct}%`}
          icon={ShieldCheck}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          accentBorder="border-l-emerald-500"
        />
        <MetricCard
          title="Consolidated GHG"
          value={`${totalGhg.toFixed(1)} tCO2e`}
          icon={Sparkles}
          iconBg="bg-sky-50"
          iconColor="text-sky-700"
          accentBorder="border-l-sky-600"
        />
        <MetricCard
          title="Submission Package Status"
          value="SUBMITTED"
          icon={Send}
          iconBg="bg-slate-50"
          iconColor="text-teal-800"
          accentBorder="border-l-teal-600"
        />
      </div>

      {/* Navigation Tabs & Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('SUMMARY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'SUMMARY'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Project ESG Summary (Section 46)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'HISTORY'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Submission History & Audit Packages
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleExportCsv('esg_data')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>Export ESG Report (.CSV)</span>
          </button>
          <button
            type="button"
            onClick={() => handleExportCsv('ghg_inventory')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-sky-700" />
            <span>Export GHG Inventory (.CSV)</span>
          </button>
        </div>
      </div>

      {activeTab === 'SUMMARY' ? (
        <div className="space-y-6">
          {/* Section 46: Project ESG Summary Rollup */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  SEBI BRSR Compliance Dossier
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  PROJECT ESG SUMMARY — {activeScope.projectName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Boundary: {activeScope.siteName} • Department: {activeScope.department} • Cycle: {activeScope.reportingYear}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Status: Submitted for Review
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Saved: {lastSavedTimestamp}
                </span>
              </div>
            </div>

            {/* 3 ESG Pillar Grids */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Environment */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-teal-900 uppercase tracking-wider">
                    Environment (P6, P2)
                  </h4>
                  <span className="text-xs font-bold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded">
                    95% Evidence
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Electricity (Grid)</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p6_grid_electricity_kwh']?.value || '52,500'} kWh
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Diesel (Fuel)</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p6_diesel_litres']?.value || '5,200'} Litres
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Scope 1 Direct GHG</span>
                    <span className="font-bold text-slate-800">{scope1Ghg.toFixed(2)} tCO2e</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Scope 2 Indirect GHG</span>
                    <span className="font-bold text-slate-800">{scope2Ghg.toFixed(2)} tCO2e</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Groundwater Extraction</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p6_groundwater_kl']?.value || '1,200'} KL
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Hazardous Waste</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p6_waste_hazardous_mt']?.value || '2.4'} MT
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Consent to Operate (CTO)</span>
                    <span className="font-bold text-emerald-700">Valid (CPCB Compliant)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Biodiversity Buffer</span>
                    <span className="font-bold text-slate-800">0.0 km (No eco-sensitive zone)</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Social */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">
                    Social (P3, P4, P5, P8)
                  </h4>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    98% Validated
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Permanent Employees</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p3_perm_employees_male']?.value || '450'} M / {fieldEntries['p3_perm_employees_female']?.value || '82'} F
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Contract Workers</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p3_contract_workers_male']?.value || '1,280'} Active
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Insurance & PF Coverage</span>
                    <span className="font-bold text-slate-800">100% Eligible Workforce</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">OHS Safety Training</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p3_training_safety_hours']?.value || '480'} Man-Hours
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Fatalities / High-Consequence</span>
                    <span className="font-bold text-emerald-700">0 (Zero Incidents)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Lost Time Injury (LTI)</span>
                    <span className="font-bold text-slate-800">
                      {fieldEntries['p3_lost_time_injuries']?.value || '1'} Case (Rehabilitated)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Human Rights / Child Labour</span>
                    <span className="font-bold text-emerald-700">0 Complaints Reported</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Local Community Outreach</span>
                    <span className="font-bold text-slate-800">Primary Health &amp; Skill Camps</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Governance */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                    Governance (P1, P7, P9)
                  </h4>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                    100% Ready
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Ethics / Code of Conduct</span>
                    <span className="font-bold text-slate-800">100% Workforce Trained</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Anti-Corruption Disciplinary</span>
                    <span className="font-bold text-emerald-700">0 Incidents (Clean)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Regulatory Monetary Fines</span>
                    <span className="font-bold text-slate-800">INR 0.00 Imposed</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Stakeholder Grievances</span>
                    <span className="font-bold text-slate-800">2 Received / 2 Closed</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Customer Safety Claims</span>
                    <span className="font-bold text-emerald-700">0 Defect Claims</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Cybersecurity Incidents</span>
                    <span className="font-bold text-emerald-700">0 Breach Events</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Public Policy Advocacy</span>
                    <span className="font-bold text-slate-800">Project SPCB Liaison Only</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Conflict of Interest</span>
                    <span className="font-bold text-emerald-700">0 Disclosures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Submission History Table */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Project Submission Dossier Archive
            </h3>
            <span className="text-xs text-slate-400">Total Packages: 1</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Package ID</th>
                  <th className="px-4 py-3">Project &amp; Site</th>
                  <th className="px-4 py-3">Reporting Period</th>
                  <th className="px-4 py-3">Submitted On</th>
                  <th className="px-4 py-3">Data Owner</th>
                  <th className="px-4 py-3">Attached Documents</th>
                  <th className="px-4 py-3">Review Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono font-bold text-teal-800">
                    SUB-MEIL-2027-01
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-800">{activeScope.projectName}</p>
                    <p className="text-[10px] text-slate-400">{activeScope.siteName}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{activeScope.reportingYear}</td>
                  <td className="px-4 py-3 text-slate-600">Today, 10:45 AM</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">Data Contributor (Environment Lead)</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-teal-700">
                      {stats.evidenceUploaded} verified files
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200">
                      <Clock className="w-3 h-3 text-teal-700" />
                      UNDER REVIEW
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleExportCsv('esg_data')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Archive</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
