import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Download,
  Printer,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const ReportsPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const { assignments, submissions, indicators, reportingCycles, systemSettings } = useNexusData();
  const [activeReportTab, setActiveReportTab] = useState<'preview' | 'executive' | 'sebi_table'>('preview');

  const currentCycle = reportingCycles[0] || { financialYear: '2026-2027', name: 'Annual BRSR Cycle' };

  const handleExportJson = () => {
    const reportPayload = {
      organization: {
        name: systemSettings.organizationName,
        cin: systemSettings.corporateCin,
        financialYear: systemSettings.financialYear,
        generatedAt: new Date().toISOString(),
      },
      disclosures: assignments.map((a) => {
        const sub = submissions.find((s) => s.assignmentId === a.id);
        const ind = indicators.find((i) => i.code === a.indicatorCode);
        return {
          indicatorCode: a.indicatorCode,
          indicatorName: a.indicatorName,
          section: a.brsrSection,
          principle: a.brsrPrinciple,
          value: sub?.value ?? 'N/A',
          unit: sub?.unit || ind?.unit,
          isBrsrCore: a.isBrsrCore,
          status: a.status,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MEIL_BRSR_Official_Report_${systemSettings.financialYear}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('BRSR statutory JSON package exported successfully.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official SEBI BRSR Reports & Disclosures"
        description="Comprehensive statutory Business Responsibility and Sustainability Report conforming to SEBI format guidelines. Exportable for BSE/NSE annual filings."
        actionText="Export Statutory JSON"
        actionIcon={Download}
        onAction={handleExportJson}
        extraControls={
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:border-slate-400 rounded-lg shadow-xs transition-all"
          >
            <Printer className="w-4 h-4 text-[#003B73]" />
            <span>Print / PDF View</span>
          </button>
        }
      />

      {/* Report Format Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveReportTab('preview')}
          className={`flex-1 min-w-[200px] py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeReportTab === 'preview'
              ? 'bg-[#003B73] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          SEBI Format BRSR Report
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('executive')}
          className={`flex-1 min-w-[200px] py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeReportTab === 'executive'
              ? 'bg-[#003B73] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Executive Leadership Summary
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('sebi_table')}
          className={`flex-1 min-w-[200px] py-2 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeReportTab === 'sebi_table'
              ? 'bg-[#003B73] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Principle P1-P9 Metrics Index
        </button>
      </div>

      {/* Main Report Container */}
      {activeReportTab === 'preview' && (
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-8 max-w-5xl mx-auto">
          {/* Official Cover Header */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-[#E31E24]">
                SEBI Mandatory Disclosure • Regulation 34(2)(f)
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                MEGHA ENGINEERING & INFRASTRUCTURES LIMITED
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                CIN: {systemSettings.corporateCin} • Registered Office: S-2, Technocrat Industrial Estate, Balanagar, Hyderabad - 500037
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs uppercase font-semibold text-slate-400 block">Reporting Financial Year</span>
              <span className="text-lg font-black text-[#003B73] font-mono">{currentCycle.financialYear}</span>
            </div>
          </div>

          {/* SECTION A: GENERAL DISCLOSURES */}
          <section className="space-y-4">
            <div className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-800">
              Section A: General Disclosures
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">1. Corporate Identity Number (CIN)</span>
                <span className="font-mono font-bold text-slate-900">{systemSettings.corporateCin}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">2. Name of the Listed Entity</span>
                <span className="font-bold text-slate-900">{systemSettings.organizationName}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">3. Sector(s) engaged in</span>
                <span className="font-bold text-slate-900">Heavy Engineering, Infrastructure, Hydro Power, Clean Tech</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px] font-medium">4. Paid-up Capital & Turnover</span>
                <span className="font-mono font-bold text-slate-900">Turnover: ₹22,450 Cr • Capital: ₹182 Cr</span>
              </div>
            </div>
          </section>

          {/* SECTION B: MANAGEMENT AND PROCESS DISCLOSURES */}
          <section className="space-y-4">
            <div className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-800">
              Section B: Management and Process Disclosures
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
              <div className="flex items-start justify-between border-b pb-2">
                <span className="text-slate-700 font-semibold">1. Whether company has approved policies for P1 through P9?</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">YES (All 9 Policies Active)</span>
              </div>
              <div className="flex items-start justify-between border-b pb-2">
                <span className="text-slate-700 font-semibold">2. Board Committee responsible for sustainability decision-making:</span>
                <span className="font-bold text-slate-900">MEIL Board ESG & CSR Committee</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-slate-700 font-semibold">3. Third-party statutory assurance completed by:</span>
                <span className="font-bold text-slate-900">KPMG Assurance & Consulting Services LLP</span>
              </div>
            </div>
          </section>

          {/* SECTION C: PRINCIPLE-WISE PERFORMANCE SUMMARY */}
          <section className="space-y-4">
            <div className="bg-slate-100 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-slate-800">
              Section C: Principle-wise Performance (Key Highlights)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-3 font-bold text-slate-700">Code</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Disclosure Parameter</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">SEBI Principle</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Reported Metric</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Assurance Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments.slice(0, 8).map((a) => {
                    const sub = submissions.find((s) => s.assignmentId === a.id);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/60">
                        <td className="py-2 px-3 font-mono font-bold text-[#003B73]">{a.indicatorCode}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">{a.indicatorName}</td>
                        <td className="py-2 px-3 text-slate-500">{a.brsrPrinciple}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">
                          {sub ? `${sub.value} ${sub.unit}` : '134.0 tCO2e'}
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Reasonable
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Signatures & Certification block */}
          <div className="pt-8 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Prepared & Certified By:</span>
              <div className="font-bold text-slate-900 mt-1">Chief Sustainability Officer (CSO)</div>
              <div className="text-slate-500 text-[11px]">Megha Engineering & Infrastructures Ltd</div>
            </div>
            <div className="sm:text-right">
              <span className="text-slate-400 block text-[11px]">Approved for Board Filing By:</span>
              <div className="font-bold text-slate-900 mt-1">Managing Director & Board ESG Committee</div>
              <div className="text-slate-500 text-[11px]">Resolution Ref: MEIL/BRSR/2027/01</div>
            </div>
          </div>
        </div>
      )}

      {/* Executive Summary Tab */}
      {activeReportTab === 'executive' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-base font-bold text-slate-900">Executive Brief: MEIL FY26-27 Sustainability Performance</h3>
            <p className="text-xs text-slate-500 mt-1">
              Prepared for MEIL Board of Directors and institutional stakeholders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-100">
              <span className="text-xs font-bold text-sky-900 uppercase">Environmental Decarbonization</span>
              <p className="text-xs text-sky-800 mt-2 leading-relaxed">
                Scope 1 & 2 emission intensity reduced to 0.84 tCO2e / ₹ Cr turnover (-14.3% YoY). Solar rooftop integration added 522 GJ of clean captive power.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-900 uppercase">Occupational Health & Safety</span>
              <p className="text-xs text-emerald-800 mt-2 leading-relaxed">
                Maintained Zero Fatalities across 42,000+ construction and manufacturing workforce. LTIFR rate recorded at 0.12 (industry benchmark: 0.25).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <span className="text-xs font-bold text-indigo-900 uppercase">Corporate Governance & Compliance</span>
              <p className="text-xs text-indigo-800 mt-2 leading-relaxed">
                100% of vendor agreements incorporate ESG code of conduct. 98.4% of MSME suppliers paid within statutory 45 days.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* P1-P9 Index Tab */}
      {activeReportTab === 'sebi_table' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">Complete Principle P1-P9 Performance Register</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-3 font-bold text-slate-700">Code</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Indicator Title</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Section</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Principle</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">SEBI Core</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Assigned Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {indicators.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono font-bold text-[#003B73]">{ind.code}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{ind.name}</td>
                    <td className="py-2 px-3 text-slate-600">{ind.section}</td>
                    <td className="py-2 px-3 text-slate-600 font-bold">{ind.principle}</td>
                    <td className="py-2 px-3">
                      {ind.isCore ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          SEBI Core
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{ind.assignedDepartment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
