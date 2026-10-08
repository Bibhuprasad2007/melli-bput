import React, { useState } from 'react';
import {
  Leaf,
  Users,
  ShieldCheck,
  Target,
  GitCompare,
  RotateCcw,
  Search,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { OrganizationDrillDown } from '../common/OrganizationDrillDown';
import { EmptyState } from '../../admin/common/EmptyState';

const ESG_CATEGORY_OPTIONS = [
  { label: 'Environmental (P2, P6)', value: 'environmental' },
  { label: 'Social (P3, P4, P5, P8, P9)', value: 'social' },
  { label: 'Governance (P1, P7)', value: 'governance' },
];

const BRSR_SECTION_OPTIONS = [
  { label: 'Section A — General Disclosures', value: 'section_a' },
  { label: 'Section B — Management & Process', value: 'section_b' },
  { label: 'Section C — Principle-wise Performance', value: 'section_c' },
];

export const ESGOverviewPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSearchValue('');
    setFilterValues({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consolidated ESG Overview"
        description="Comprehensive group-wide ESG performance summaries across environmental, social, and governance pillars with hierarchical drill-down capabilities."
      />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search across disclosures and metrics…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-700 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterValues.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-700"
            >
              <option value="">All ESG Categories</option>
              {ESG_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={filterValues.section || ''}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-indigo-700"
            >
              <option value="">All BRSR Sections</option>
              {BRSR_SECTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {(searchValue || Object.values(filterValues).some(Boolean)) && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset filters"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hierarchical Drilldown Component */}
      <OrganizationDrillDown />

      {/* ESG Summary Cards (Environmental, Social, Governance Scorecards - All values '--') */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Environmental Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Environmental Scorecard
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">--</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>GHG Emissions (Scope 1+2):</span>
              <span className="font-semibold text-slate-800">-- MT CO2e</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Renewable Energy Share:</span>
              <span className="font-semibold text-slate-800">-- %</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Water Recycled / Reused:</span>
              <span className="font-semibold text-slate-800">-- %</span>
            </div>
          </div>
        </div>

        {/* Social Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Social Scorecard
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">--</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gender Diversity Ratio:</span>
              <span className="font-semibold text-slate-800">-- %</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Safety Incident Rate (LTIFR):</span>
              <span className="font-semibold text-slate-800">--</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Training Coverage:</span>
              <span className="font-semibold text-slate-800">-- hrs/emp</span>
            </div>
          </div>
        </div>

        {/* Governance Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Governance Scorecard
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">--</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Independent Board Seats:</span>
              <span className="font-semibold text-slate-800">-- %</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Anti-Corruption Training:</span>
              <span className="font-semibold text-slate-800">-- %</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Open Compliance Grievances:</span>
              <span className="font-semibold text-slate-800">--</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Detail Panels (Empty States) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-indigo-600" />
            Previous Period Comparison &amp; Variance
          </h3>
          <EmptyState
            icon={GitCompare}
            title="No comparative data available."
            description="Historical period-over-period variance tracking across verified reporting cycles will appear here."
            compact
          />
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Performance Against Approved Targets
          </h3>
          <EmptyState
            icon={Target}
            title="No target tracking data available."
            description="Progress towards multi-year decarbonization, safety, and diversity targets will be plotted here."
            compact
          />
        </div>
      </div>
    </div>
  );
};
