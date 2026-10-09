import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download, FileText, Search } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const BRSRFrameworkPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const { indicators } = useNexusData();
  const [activeSection, setActiveSection] = useState<'ALL' | 'Section A' | 'Section B' | 'Section C' | 'CORE'>('Section C');
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>('P6');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const PRINCIPLES = [
    { id: 'ALL', code: 'All', title: 'All Principles (P1 - P9)' },
    { id: 'P1', code: 'Principle 1', title: 'Ethics and Accountability' },
    { id: 'P2', code: 'Principle 2', title: 'Sustainable Products & Services' },
    { id: 'P3', code: 'Principle 3', title: 'Employee Wellbeing' },
    { id: 'P4', code: 'Principle 4', title: 'Stakeholder Interests' },
    { id: 'P5', code: 'Principle 5', title: 'Human Rights' },
    { id: 'P6', code: 'Principle 6', title: 'Environment & Climate Change' },
    { id: 'P7', code: 'Principle 7', title: 'Public Policy' },
    { id: 'P8', code: 'Principle 8', title: 'Inclusive Growth & CSR' },
    { id: 'P9', code: 'Principle 9', title: 'Customer Value & Protection' },
  ];

  const handleExportTaxonomy = () => {
    const jsonStr = JSON.stringify(indicators, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_BRSR_Framework_Taxonomy_FY26-27.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('BRSR taxonomy framework exported successfully.', 'success');
  };

  const filteredIndicators = indicators.filter((ind) => {
    if (activeSection === 'CORE' && !ind.isCore) return false;
    if (activeSection !== 'ALL' && activeSection !== 'CORE' && ind.section !== activeSection) return false;
    if (selectedPrinciple !== 'ALL' && ind.principle !== selectedPrinciple) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const codeMatch = ind.code.toLowerCase().includes(q);
      const nameMatch = ind.name.toLowerCase().includes(q);
      const catMatch = ind.category.toLowerCase().includes(q);
      const descMatch = ind.description.toLowerCase().includes(q);
      if (!codeMatch && !nameMatch && !catMatch && !descMatch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="BRSR Framework & Indicator Master"
        description="SEBI Business Responsibility and Sustainability Reporting (BRSR) framework structure, essential & leadership indicators, conversion factors, and audit evidence requirements."
        actionText="Export Taxonomy"
        actionIcon={Download}
        onAction={handleExportTaxonomy}
      />

      {/* Structural Section Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveSection('ALL')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'ALL'
              ? 'bg-[#003B73] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Disclosures ({indicators.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('Section A')}
          className={`flex-1 min-w-[160px] py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'Section A'
              ? 'bg-[#003B73] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Section A: General
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('Section B')}
          className={`flex-1 min-w-[160px] py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'Section B'
              ? 'bg-[#003B73] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Section B: Management
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('Section C')}
          className={`flex-1 min-w-[180px] py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'Section C'
              ? 'bg-[#003B73] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Section C: Performance (P1-P9)
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('CORE')}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'CORE'
              ? 'bg-[#E31E24] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          SEBI BRSR Core
        </button>
      </div>

      {/* Principle Selector Strip (Active in Section C & BRSR Core & All) */}
      {(activeSection === 'Section C' || activeSection === 'CORE' || activeSection === 'ALL') && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              National Voluntary Guidelines (NVG) Principles
            </span>
            <span className="text-xs text-slate-400">P1 through P9</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {PRINCIPLES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPrinciple(p.id)}
                className={`p-2 text-left rounded-lg border text-xs transition-all ${
                  selectedPrinciple === p.id
                    ? 'border-[#003B73] bg-sky-50/80 font-bold text-[#003B73] shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="font-semibold block text-[10px] text-slate-500 uppercase">
                  {p.code}
                </span>
                <span className="truncate block text-[11px]">{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search and summary bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search indicator code, name, category, formula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredIndicators.length}</span> indicators
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIndicators.map((ind) => (
          <div
            key={ind.id}
            className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#003B73] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#003B73] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {ind.code}
                  </span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {ind.principle}
                  </span>
                  {ind.isCore && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      SEBI Core
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                  {ind.assignedDepartment}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2.5 mb-1">{ind.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{ind.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100 mb-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Unit of Measure</span>
                  <span className="font-semibold text-slate-800">{ind.unit}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Category</span>
                  <span className="font-semibold text-slate-800">{ind.category}</span>
                </div>
                {ind.emissionFactor && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 block font-medium">Emission / Conversion Factor</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {ind.emissionFactor} {ind.emissionFactorUnit}
                    </span>
                  </div>
                )}
                {ind.calculationMethod && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 block font-medium">Calculation Method</span>
                    <span className="font-mono text-[11px] text-slate-700">{ind.calculationMethod}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1 text-[11px] text-slate-600 truncate mr-2" title={ind.requiredEvidence}>
                <FileText className="w-3.5 h-3.5 text-[#003B73] shrink-0" />
                <span className="truncate">Evidence: {ind.requiredEvidence}</span>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Verified Rule
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
