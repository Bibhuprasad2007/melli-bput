import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  Send,
  Building,
  Smartphone,
} from 'lucide-react';
import { useContributorData } from '../context/ContributorDataContext';
import { useNexusData } from '../../../context/NexusDataContext';
import { PRINCIPLES_CONFIG, type PrincipleSectionConfig } from '../data/contributorPrinciplesData';
import { UniversalDataRow } from '../forms/UniversalDataRow';

import { FinalSubmissionCheckModal } from '../modals/FinalSubmissionCheckModal';
import { MobileQuickEntryModal } from '../modals/MobileQuickEntryModal';

export const AssignmentDataEntryPage: React.FC = () => {
  // Metric names for ESG data entry (used across all principles)
  const metricNames = [
    'Product/Service Name',
    'Total Production',
    'Sustainable Raw Materials (%)',
    'Water Consumption (KL)',
    'Carbon Emissions Scope',
    'Carbon Emissions (tCO₂e)',
    'Energy Consumption (kWh)',
    'Waste Generated (tonnes)',
    'Sustainable Sourcing (%)',
    'Product Recycling & Reclamation (tonnes/units)',
    'Environmental Investment (₹)'
  ];
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId?: string }>();
  const { assignments } = useNexusData();
  const {
    activeScope,
    setProjectScope,
    availableProjects,
    saveDraft,
    lastSavedTimestamp,
    submitProjectForReview,
    getCompletionStats,
  } = useContributorData();

  const { addToast } = useOutletContext<{
    addToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  }>();

  const [activePrincipleId, setActivePrincipleId] = useState<string>('p6'); // Default to Environment (most detailed)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      const match = assignments.find((a) => a.id === assignmentId);
      if (match) {
        setActivePrincipleId(match.brsrPrinciple.toLowerCase());
      } else if (assignmentId.startsWith('p') && PRINCIPLES_CONFIG.some((p) => p.id === assignmentId)) {
        setActivePrincipleId(assignmentId);
      }
    }
  }, [assignmentId, assignments]);

  // State for aggregated metrics across all principles
  const allPrincipleIds = ['p1','p2','p3','p4','p5','p6','p7','p8','p9'];
  const [allMetrics, setAllMetrics] = useState(() => {
    const init: Record<string, { reportingPeriod: string; value: string; evidence: string; explanation: string; status: string }[]> = {};
    allPrincipleIds.forEach(id => {
      init[id] = metricNames.map(() => ({
        reportingPeriod: '',
        value: '',
        evidence: '',
        explanation: '',
        status: 'Draft',
      }));
    });
    return init;
  });

  const handleAllMetricChange = (pid: string, idx: number, field: keyof typeof allMetrics['p1'][0], val: string) => {
    setAllMetrics(prev => {
      const updated = { ...prev };
      const rows = [...updated[pid]];
      rows[idx] = { ...rows[idx], [field]: val };
      updated[pid] = rows;
      return updated;
    });
  };

  const activePrinciple: PrincipleSectionConfig =
    PRINCIPLES_CONFIG.find((p) => p.id === activePrincipleId) || PRINCIPLES_CONFIG[5];

  const stats = getCompletionStats();

  const handleManualSaveDraft = () => {
    saveDraft();
    addToast(`Project ESG draft saved successfully at ${lastSavedTimestamp}`, 'success');
  };

  const handleConfirmFinalSubmit = () => {
    const res = submitProjectForReview();
    if (res.success) {
      addToast(res.message, 'success');
      setIsSubmitModalOpen(false);
      navigate('/contributor/submissions');
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Scope Configuration Selector Bar (Section 5) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-teal-700" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {activeScope.projectName}
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                {activeScope.projectCode} &bull; {activeScope.subsidiary} &bull; {activeScope.businessUnit}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Completion: <strong className="text-teal-800">{stats.completionPct}%</strong> ({stats.evidencePct}% Ev) &bull; <strong className="text-slate-800">{lastSavedTimestamp}</strong></span>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-700" />
              <span>Mobile Field Entry</span>
            </button>

            <button
              type="button"
              onClick={handleManualSaveDraft}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pre-Check &amp; Submit</span>
            </button>
          </div>
        </div>

        {/* Dynamic Project, Site & Department Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Assigned Project
            </label>
            <select
              value={activeScope.projectId}
              onChange={(e) => {
                const found = availableProjects.find(p => p.projectId === e.target.value);
                if (found) setProjectScope(found);
              }}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-semibold text-xs"
            >
              {availableProjects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Reporting Cycle
            </label>
            <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-mono font-semibold text-xs flex items-center justify-between">
              <span>{activeScope.year}</span>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 rounded">Active</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Active Site / Section
            </label>
            <select
              value={activeScope.site}
              onChange={(e) => setProjectScope({ site: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
            >
              <option value="Site 02 (Km 42 - Km 88)">Site 02 (Km 42 - Km 88)</option>
              <option value="Site 01 (Camp Yard 01)">Site 01 (Camp Yard 01)</option>
              <option value="Batching Plant Complex">Batching Plant Complex</option>
              <option value="Central Workshop">Central Workshop</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
              Contributor Department
            </label>
            <select
              value={activeScope.department}
              onChange={(e) => setProjectScope({ department: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 text-xs"
            >
              <option value="Environment">Environment &amp; Ecology</option>
              <option value="Health & Safety">Health &amp; Safety (EHS)</option>
              <option value="Civil Operations">Civil Site Engineering</option>
              <option value="HR & Administration">HR &amp; Workforce Admin</option>
              <option value="CSR & Community">CSR &amp; Stakeholder Relations</option>
            </select>
          </div>
        </div>
      </div>

      {/* 9-Principles Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs font-semibold">
          {PRINCIPLES_CONFIG.map((p) => {
            const isActive = activePrincipleId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePrincipleId(p.id)}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#003B73] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-sky-500/30 text-sky-200' : 'bg-slate-200 text-slate-700'
                }`}>
                  {p.principle}
                </span>
                <span>{p.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Layout: Data Entry Canvas (Left) + Persistent Evidence Sidebar (Right) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">

        {/* LEFT COLUMN: UNIVERSAL DATA ENTRY CANVAS */}
        <div className="flex-1 w-full space-y-6 min-w-0">
          {/* Principle Header Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {activePrinciple.principle} &bull; SEBI BRSR DISCLOSURES
              </span>
              <span className="text-xs text-slate-500">
                {activePrinciple.subsections.reduce((acc, s) => acc + s.fields.length, 0)} Operational Metrics
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {activePrinciple.title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              &ldquo;{activePrinciple.brsrTitle}&rdquo;
            </p>
          </div>

          {/* Subsections & Universal Rows */}
          {activePrinciple.subsections.map((subsection) => (
            <div
              key={subsection.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
            >
              <div className="pb-3 border-b border-slate-100 space-y-1">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  {subsection.title}
                </h4>
                <p className="text-xs text-slate-500">
                  {subsection.description}
                </p>
              </div>

              {/* Data Rows with Contextual Inline Evidence Upload */}
              <div className="space-y-3">
                {subsection.fields.map((field) => (
                  <UniversalDataRow key={field.id} field={field} />
                ))}
              </div>
            </div>
          ))}
        </div>

          {/* Consolidated ESG Metrics Table for All Principles */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">All Principles Metrics</h3>
            {allPrincipleIds.map(pid => (
              <div key={pid} className="mb-4">
                <h4 className="font-semibold text-slate-800">
                  {PRINCIPLES_CONFIG.find(p => p.id === pid)?.shortTitle || pid.toUpperCase()}
                </h4>
                <table className="min-w-full text-xs border">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-2 py-1">Metric</th>
                      <th className="px-2 py-1">Reporting Period</th>
                      <th className="px-2 py-1">Value &amp; Unit</th>
                      <th className="px-2 py-1">Evidence</th>
                      <th className="px-2 py-1">Explanation</th>
                      <th className="px-2 py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricNames.map((name, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-2 py-1">{name}</td>
                        <td className="px-2 py-1">
                          <input className="w-full border rounded" value={allMetrics[pid][idx].reportingPeriod}
                            onChange={e => handleAllMetricChange(pid, idx, 'reportingPeriod', e.target.value)} />
                        </td>
                        <td className="px-2 py-1">
                          <input className="w-full border rounded" value={allMetrics[pid][idx].value}
                            onChange={e => handleAllMetricChange(pid, idx, 'value', e.target.value)} />
                        </td>
                        <td className="px-2 py-1">
                          <input className="w-full border rounded" value={allMetrics[pid][idx].evidence}
                            onChange={e => handleAllMetricChange(pid, idx, 'evidence', e.target.value)} />
                        </td>
                        <td className="px-2 py-1">
                          <input className="w-full border rounded" value={allMetrics[pid][idx].explanation}
                            onChange={e => handleAllMetricChange(pid, idx, 'explanation', e.target.value)} />
                        </td>
                        <td className="px-2 py-1">
                          <select className="w-full border rounded" value={allMetrics[pid][idx].status}
                            onChange={e => handleAllMetricChange(pid, idx, 'status', e.target.value)}>
                            <option>Draft</option>
                            <option>Submitted</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

        {/* RIGHT COLUMN: PERSISTENT EVIDENCE & DOCUMENTS SIDEBAR (Section 19) */}
        
      </div>

      {/* Pre-Submission Checklist Modal */}
      <FinalSubmissionCheckModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmFinalSubmit}
      />

      {/* Mobile Quick Entry Modal */}
      <MobileQuickEntryModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        onSuccess={(msg) => addToast(msg, 'success')}
      />
    </div>
  );
};
