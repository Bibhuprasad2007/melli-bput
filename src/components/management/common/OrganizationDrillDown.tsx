import React, { useState } from 'react';
import {
  ChevronRight,
  Layers,
  Search,
} from 'lucide-react';
import { EmptyState } from '../../admin/common/EmptyState';

interface OrganizationDrillDownProps {
  onScopeSelect?: (scopePath: string) => void;
}

export const OrganizationDrillDown: React.FC<OrganizationDrillDownProps> = () => {
  const [activeTier, setActiveTier] = useState<
    'group' | 'subsidiary' | 'business_unit' | 'project' | 'metric'
  >('group');
  const [searchQuery, setSearchQuery] = useState('');

  const tiers = [
    { id: 'group', label: 'MEIL Group', count: '--' },
    { id: 'subsidiary', label: 'Subsidiaries', count: '--' },
    { id: 'business_unit', label: 'Business Units', count: '--' },
    { id: 'project', label: 'Projects & Plants', count: '--' },
    { id: 'metric', label: 'BRSR Disclosures', count: '--' },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Hierarchical Performance Drill-Down
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Trace approved ESG performance metrics across organizational tiers
          </p>
        </div>

        {/* Tier Breadcrumb Selector */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
          {tiers.map((tier, idx) => (
            <React.Fragment key={tier.id}>
              <button
                type="button"
                onClick={() => setActiveTier(tier.id as typeof activeTier)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                  activeTier === tier.id
                    ? 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tier.label} ({tier.count})
              </button>
              {idx < tiers.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Search Input for Drilldown */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTier.replace('_', ' ')} tier records…`}
          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-700 transition-colors"
        />
      </div>

      {/* Read-Only Drill-down Content (Empty State) */}
      <EmptyState
        icon={Layers}
        title="No organizational performance data is available."
        description="Consolidated performance summaries across group subsidiaries, operational business units, and site plants will appear here once approved by Reviewers."
        compact
      />
    </div>
  );
};
