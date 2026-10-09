import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Layers,
  RefreshCw,
  Building,
  Download,
  Flame,
  Droplet,
  Zap,
  Users,
  ShieldCheck,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { DataTableShell } from '../common/DataTableShell';
import { useNexusData } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ConsolidationPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const { logSystemAction } = useNexusData();
  const [isConsolidating, setIsConsolidating] = useState(false);

  // Computed Rollup Figures across Entities
  const ENTITY_ROLLUP_DATA = [
    {
      id: 'sub_meil_infra',
      name: 'MEIL Infrastructure & Heavy Civil Ltd',
      type: 'Subsidiary',
      scope1Diesel: 82.4,
      scope2Grid: 215.0,
      totalGhg: 297.4,
      percentOfGroup: 59.1,
      waterWithdrawalKl: 11200,
      headcount: 24500,
      dataCompleteness: 98,
      status: 'Consolidated',
    },
    {
      id: 'sub_meil_hydro',
      name: 'MEIL Hydro & Tunneling Projects Ltd',
      type: 'Subsidiary',
      scope1Diesel: 34.6,
      scope2Grid: 88.0,
      totalGhg: 122.6,
      percentOfGroup: 24.4,
      waterWithdrawalKl: 4800,
      headcount: 11200,
      dataCompleteness: 95,
      status: 'Consolidated',
    },
    {
      id: 'sub_meil_energy',
      name: 'MEIL Solar & Clean Energy Ltd',
      type: 'Subsidiary',
      scope1Diesel: 12.0,
      scope2Grid: 45.0,
      totalGhg: 57.0,
      percentOfGroup: 11.3,
      waterWithdrawalKl: 1600,
      headcount: 4200,
      dataCompleteness: 100,
      status: 'Consolidated',
    },
    {
      id: 'sub_meil_mfg',
      name: 'MEIL Equipment & Engineering Works',
      type: 'Subsidiary',
      scope1Diesel: 5.0,
      scope2Grid: 21.0,
      totalGhg: 26.0,
      percentOfGroup: 5.2,
      waterWithdrawalKl: 900,
      headcount: 2100,
      dataCompleteness: 100,
      status: 'Consolidated',
    },
  ];

  const totalGroupScope1 = ENTITY_ROLLUP_DATA.reduce((acc, e) => acc + e.scope1Diesel, 0).toFixed(1);
  const totalGroupScope2 = ENTITY_ROLLUP_DATA.reduce((acc, e) => acc + e.scope2Grid, 0).toFixed(1);
  const totalGroupGhg = ENTITY_ROLLUP_DATA.reduce((acc, e) => acc + e.totalGhg, 0).toFixed(1);
  const totalGroupWater = ENTITY_ROLLUP_DATA.reduce((acc, e) => acc + e.waterWithdrawalKl, 0).toLocaleString();
  const totalGroupHeadcount = ENTITY_ROLLUP_DATA.reduce((acc, e) => acc + e.headcount, 0).toLocaleString();

  const handleRunConsolidation = () => {
    setIsConsolidating(true);
    setTimeout(() => {
      setIsConsolidating(false);
      logSystemAction({
        actorName: 'ESG Administrator',
        actorRole: 'admin',
        actorEmail: 'admin@demo.com',
        module: 'Workflow',
        action: 'UPDATE',
        recordId: 'CONSOLIDATION_RUN_Q2',
        details: `Automated consolidation run executed for 4 subsidiaries, 8 BUs, and 14 project sites. Total emissions rolled up: ${totalGroupGhg} tCO2e.`,
      });
      addToast('Consolidation run finished successfully. All entity metrics recalculated.', 'success');
    }, 1200);
  };

  const handleExportConsolidationSheet = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Entity Name,Entity Type,Scope 1 (tCO2e),Scope 2 (tCO2e),Total GHG (tCO2e),% Group Total,Water (KL),Headcount,Data Completeness\n' +
      ENTITY_ROLLUP_DATA.map(
        (e) =>
          `"${e.name}","${e.type}","${e.scope1Diesel}","${e.scope2Grid}","${e.totalGhg}","${e.percentOfGroup}%","${e.waterWithdrawalKl}","${e.headcount}","${e.dataCompleteness}%"`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'MEIL_Group_ESG_Consolidation_Rollup_FY26-27.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Consolidation dataset downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Tier Organizational Consolidation Engine"
        description="Consolidate ESG data from operational sites and projects up through business units and subsidiaries into MEIL Group corporate disclosures."
        actionText={isConsolidating ? 'Consolidating...' : 'Run Consolidation Rollup'}
        actionIcon={RefreshCw}
        onAction={handleRunConsolidation}
        extraControls={
          <button
            type="button"
            onClick={handleExportConsolidationSheet}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-xs transition-all"
          >
            <Download className="w-4 h-4 text-[#003B73]" />
            <span>Export Rollup CSV</span>
          </button>
        }
      />

      {/* Corporate Rollup Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Scope 1 Direct</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{totalGroupScope1} <span className="text-xs font-normal text-slate-500">tCO2e</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">Heavy plant diesel combustion</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-sky-500" />
            <span>Scope 2 Indirect</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{totalGroupScope2} <span className="text-xs font-normal text-slate-500">tCO2e</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">Grid electricity consumption</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Total Group GHG</span>
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono">{totalGroupGhg} <span className="text-xs font-normal text-slate-500">tCO2e</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">Consolidated emissions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Droplet className="w-3.5 h-3.5 text-teal-500" />
            <span>Water Withdrawal</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{totalGroupWater} <span className="text-xs font-normal text-slate-500">KL</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all river & borewells</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>Total Headcount</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">{totalGroupHeadcount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Permanent & site workforce</div>
        </div>
      </div>

      {/* Hierarchy Rollup Chain Visualization */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          <span>Hierarchy Consolidation Path</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Level 4 (Source)</span>
            <span className="font-bold text-slate-200">Operational Sites (36)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Level 3</span>
            <span className="font-bold text-slate-200">Project Packages (14)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Level 2</span>
            <span className="font-bold text-slate-200">Business Units (8)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          <div className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
            <span className="text-slate-400 block text-[10px]">Level 1</span>
            <span className="font-bold text-slate-200">Subsidiaries (4)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
          <div className="px-3.5 py-1.5 bg-[#003B73] rounded-lg border border-sky-400/40 text-white font-bold">
            <span className="text-sky-300 block text-[10px]">Consolidated</span>
            <span>MEIL Group Enterprise</span>
          </div>
        </div>
      </div>

      {/* Subsidiary Consolidation Table */}
      <DataTableShell
        columns={[
          'Subsidiary Entity',
          'Scope 1 (tCO2e)',
          'Scope 2 (tCO2e)',
          'Total GHG Emissions',
          '% Group Total',
          'Water Withdrawal',
          'Workforce Headcount',
          'Audit Completeness',
          'Status',
        ]}
        emptyTitle="No consolidation nodes found"
        emptyDescription="All entities have been aggregated."
      >
        {ENTITY_ROLLUP_DATA.map((row) => (
          <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
            <td className="px-4 py-3 text-xs">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#003B73]" />
                <span>{row.name}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">{row.type}</span>
            </td>

            <td className="px-4 py-3 text-xs font-mono font-medium text-slate-700">
              {row.scope1Diesel}
            </td>

            <td className="px-4 py-3 text-xs font-mono font-medium text-slate-700">
              {row.scope2Grid}
            </td>

            <td className="px-4 py-3 text-xs font-mono font-bold text-slate-900">
              {row.totalGhg}
            </td>

            <td className="px-4 py-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 text-[11px]">{row.percentOfGroup}%</span>
                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#003B73] h-full" style={{ width: `${row.percentOfGroup}%` }} />
                </div>
              </div>
            </td>

            <td className="px-4 py-3 text-xs font-mono text-slate-700">
              {row.waterWithdrawalKl.toLocaleString()} KL
            </td>

            <td className="px-4 py-3 text-xs font-mono text-slate-700">
              {row.headcount.toLocaleString()}
            </td>

            <td className="px-4 py-3 text-xs">
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                {row.dataCompleteness}% Reconciled
              </span>
            </td>

            <td className="px-4 py-3 text-xs">
              <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200 text-[11px] flex items-center gap-1 w-fit">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                <span>{row.status}</span>
              </span>
            </td>
          </tr>
        ))}
      </DataTableShell>
    </div>
  );
};
