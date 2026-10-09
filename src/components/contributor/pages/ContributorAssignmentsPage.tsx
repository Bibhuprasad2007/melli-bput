import React, { useState } from 'react';
import { ClipboardList, Filter, RotateCcw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNexusData } from '../../../context/NexusDataContext';
import { PageHeader } from '../../admin/common/PageHeader';

const ASSIGNMENT_STATUS_OPTIONS = [
  { label: 'Not Started', value: 'not_started' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Draft', value: 'draft' },
  { label: 'Ready to Submit', value: 'ready_to_submit' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Correction Requested', value: 'correction_requested' },
  { label: 'Resubmitted', value: 'resubmitted' },
  { label: 'Approved', value: 'approved' },
  { label: 'Overdue', value: 'overdue' },
];

const BRSR_SECTION_OPTIONS = [
  { label: 'Section A — General Disclosures', value: 'section_a' },
  { label: 'Section B — Management & Process', value: 'section_b' },
  { label: 'Section C — Principle-wise Performance', value: 'section_c' },
];

const BRSR_PRINCIPLE_OPTIONS = [
  { label: 'P1 — Ethics & Transparency', value: 'P1' },
  { label: 'P2 — Product Lifecycle Sustainability', value: 'P2' },
  { label: 'P3 — Employee Well-being', value: 'P3' },
  { label: 'P4 — Stakeholder Engagement', value: 'P4' },
  { label: 'P5 — Human Rights', value: 'P5' },
  { label: 'P6 — Environment', value: 'P6' },
  { label: 'P7 — Public Policy', value: 'P7' },
  { label: 'P8 — Inclusive Growth', value: 'P8' },
  { label: 'P9 — Customer Value', value: 'P9' },
];

const DATA_CATEGORY_OPTIONS = [
  { label: 'Quantitative Metric', value: 'quantitative' },
  { label: 'Qualitative Policy', value: 'qualitative' },
  { label: 'Governance & Compliance', value: 'governance' },
  { label: 'Resource Consumption', value: 'consumption' },
  { label: 'Emissions & Waste', value: 'emissions' },
];

const FREQUENCY_OPTIONS = [
  { label: 'Annual', value: 'annual' },
  { label: 'Half-Yearly', value: 'half_yearly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Monthly', value: 'monthly' },
];

export const ContributorAssignmentsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const { assignments, organizations } = useNexusData();

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setFilterValues({});
  };

  const hasActiveFilters = searchValue || Object.values(filterValues).some(Boolean);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Reporting Assignments"
        description="All ESG and BRSR disclosure metrics assigned to you by the ESG Administrator. Open an assignment to enter operational data and attach verification evidence."
      />

      {/* Master ESG Principles Data Capture Workflow Launch Card */}
      <div className="bg-gradient-to-r from-[#003B73] via-teal-800 to-teal-900 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-400 text-slate-950 uppercase tracking-wider">
              Statutory Reporting Workflow
            </span>
            <span className="text-xs text-teal-200">SEBI BRSR Core Principles 1 to 9</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            ESG Principles Data Capture &amp; Automated Review Workflow
          </h2>
          <p className="text-xs text-slate-200 max-w-2xl leading-relaxed">
            Select project, site, and reporting month context to enter operational data across all 9 statutory principles, compare month-over-month variances, attach evidence documents, and submit for assurance.
          </p>
        </div>

        <Link
          to="/contributor/assignment"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-teal-950 hover:bg-teal-50 transition-all shadow-sm shrink-0 active:scale-95"
        >
          <ClipboardList className="w-4 h-4 text-teal-800" />
          <span>Launch Master ESG Data Capture</span>
        </Link>
      </div>

      {/* Comprehensive Filter Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        {/* Primary Search & Quick Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by Task ID, disclosure code, or title…"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFilterExpanded((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                isFilterExpanded
                  ? 'bg-teal-50 border-teal-300 text-teal-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{isFilterExpanded ? 'Hide Advanced Filters' : 'Advanced Filters'}</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset all filters"
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filter Fields */}
        {isFilterExpanded && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Reporting Cycle */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Reporting Cycle
              </label>
              <select
                value={filterValues.reportingCycle || ''}
                onChange={(e) => handleFilterChange('reportingCycle', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Cycles</option>
                <option value="FY2025_2026">FY 2025-2026 (Annual BRSR)</option>
                <option value="FY2024_2025">FY 2024-2025 (Annual BRSR)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Assignment Status
              </label>
              <select
                value={filterValues.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Statuses</option>
                {ASSIGNMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* BRSR Section */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                BRSR Section
              </label>
              <select
                value={filterValues.brsrSection || ''}
                onChange={(e) => handleFilterChange('brsrSection', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Sections</option>
                {BRSR_SECTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* BRSR Principle */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                BRSR Principle
              </label>
              <select
                value={filterValues.principle || ''}
                onChange={(e) => handleFilterChange('principle', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Principles</option>
                {BRSR_PRINCIPLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Company / Subsidiary */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Company / Subsidiary
              </label>
              <select
                value={filterValues.company || ''}
                onChange={(e) => handleFilterChange('company', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Companies</option>
              </select>
            </div>

            {/* Business Unit */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Business Unit
              </label>
              <select
                value={filterValues.businessUnit || ''}
                onChange={(e) => handleFilterChange('businessUnit', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Business Units</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Department
              </label>
              <select
                value={filterValues.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Departments</option>
              </select>
            </div>

            {/* Project / Plant */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Project / Plant
              </label>
              <select
                value={filterValues.projectPlant || ''}
                onChange={(e) => handleFilterChange('projectPlant', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Projects &amp; Plants</option>
              </select>
            </div>

            {/* Data Category */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Data Category
              </label>
              <select
                value={filterValues.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Categories</option>
                {DATA_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Reporting Frequency
              </label>
              <select
                value={filterValues.frequency || ''}
                onChange={(e) => handleFilterChange('frequency', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              >
                <option value="">All Frequencies</option>
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Filter */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={filterValues.dueDate || ''}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-700"
              />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No reporting assignments are available.</h3>
            <p className="text-gray-500 max-w-sm">
              Assignments created by the ESG Admin will appear here.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project / BU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((assignment) => {
                const org = organizations.find(o => o.id === assignment.orgId);
                return (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {assignment.indicatorCode} - {assignment.indicatorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {org?.name || assignment.orgId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.reportingPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {assignment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs space-x-3">
                      <Link
                        to={`/contributor/assignments/${assignment.id}`}
                        className="text-teal-700 hover:text-teal-900 font-bold hover:underline"
                      >
                        Open Task
                      </Link>
                      <Link
                        to="/contributor/assignment"
                        className="text-slate-500 hover:text-slate-800 font-medium hover:underline"
                        title="Open in full 9-principles data capture table"
                      >
                        All Principles
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar (Disabled when empty) */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-xs text-xs text-slate-500">
        <span>Showing 0 to 0 of 0 assignments</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="p-1.5 rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-semibold text-slate-400">Page 1 of 1</span>
          <button
            type="button"
            disabled
            className="p-1.5 rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
