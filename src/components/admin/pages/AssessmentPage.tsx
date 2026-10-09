import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Scale,
  Award,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useNexusData } from '../../../context/NexusDataContext';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const AssessmentPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();
  const { logSystemAction } = useNexusData();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'c1_1': true,
    'c1_2': true,
    'c1_3': true,
    'c2_1': true,
    'c2_2': true,
    'c2_3': true,
    'c3_1': true,
    'c3_2': true,
    'c3_3': true,
    'c4_1': true,
    'c4_2': true,
    'c5_1': true,
    'c5_2': true,
    'c6_1': true,
    'c6_2': true,
  });

  const CHECKLIST_GROUPS = [
    {
      id: 'g1',
      title: '1. Boundary & Applicability Verification',
      description: 'Verification of in-scope subsidiaries, joint ventures, and materiality thresholds.',
      items: [
        { id: 'c1_1', text: 'Consolidation entity list validated against MCA corporate filings' },
        { id: 'c1_2', text: 'Materiality thresholds confirmed for SEBI BRSR Core indicators' },
        { id: 'c1_3', text: 'Boundary exclusion justifications documented and board-noted' },
      ],
    },
    {
      id: 'g2',
      title: '2. Mandatory Disclosure Completeness',
      description: 'Audit of essential and leadership indicators across Section A, B, and C.',
      items: [
        { id: 'c2_1', text: '100% completion of Section A general business disclosures' },
        { id: 'c2_2', text: 'Section B management policies signed off by Sustainability Committee' },
        { id: 'c2_3', text: 'Mandatory Principle P1-P9 essential indicators entered' },
      ],
    },
    {
      id: 'g3',
      title: '3. Multi-Tier Workflow Authorizations',
      description: 'Confirmation that all operational heads and designated reviewers have signed off.',
      items: [
        { id: 'c3_1', text: 'Plant / Site Lead sign-offs received for all operational projects' },
        { id: 'c3_2', text: 'Functional ESG Reviewer verification completed across all principles' },
        { id: 'c3_3', text: 'Independent internal auditor preliminary review completed' },
      ],
    },
    {
      id: 'g4',
      title: '4. Validation & Exception Clearance',
      description: 'Zero unresolved blocker exceptions or cross-table reconciliation failures.',
      items: [
        { id: 'c4_1', text: 'All critical validation exceptions marked as resolved' },
        { id: 'c4_2', text: 'Scope 1 & 2 GHG emission calculation cross-checks validated' },
      ],
    },
    {
      id: 'g5',
      title: '5. Evidence & Supporting Documentation',
      description: 'Adequate audit evidence uploaded for all verifiable ESG metrics.',
      items: [
        { id: 'c5_1', text: 'Mandatory evidence files attached to high-assurance disclosures' },
        { id: 'c5_2', text: 'Energy and water utility invoices matched with reported volumes' },
      ],
    },
    {
      id: 'g6',
      title: '6. Financial & Non-Financial Reconciliation',
      description: 'Alignment between audited annual financial statements and sustainability metrics.',
      items: [
        { id: 'c6_1', text: 'Revenue & turnover numbers match audited balance sheet' },
        { id: 'c6_2', text: 'Employee count reconciled with audited HR payroll records' },
      ],
    },
  ];

  const allItems = CHECKLIST_GROUPS.flatMap((g) => g.items);
  const totalCount = allItems.length;
  const completedCount = allItems.filter((i) => checkedItems[i.id]).length;
  const readinessPercent = Math.round((completedCount / totalCount) * 100);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleIssueClearance = () => {
    if (readinessPercent < 80) {
      addToast('Cannot issue clearance: readiness score must be at least 80%.', 'error');
      return;
    }
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Workflow',
      action: 'APPROVE',
      recordId: 'ESG_READINESS_CLEARANCE_FY26-27',
      details: `Pre-issuance ESG assessment clearance certified. Readiness score: ${readinessPercent}%. Cleared for Board Approval.`,
    });
    addToast('ESG Assurance Readiness Clearance successfully certified and recorded.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statutory ESG Assessment & Assurance Readiness"
        description="Comprehensive audit checklist, pre-issuance validation sanity checks, and third-party assurance verification for MEIL's annual BRSR submission."
        actionText="Issue Assurance Clearance"
        actionIcon={Award}
        onAction={handleIssueClearance}
      />

      {/* Readiness Gauge Banner */}
      <div className="bg-gradient-to-r from-[#0C192C] to-[#003B73] text-white p-6 rounded-2xl shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Assurance Standard: ISAE 3000 / AA1000AS Aligned</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Pre-Issuance Readiness Score: <span className="text-emerald-400">{readinessPercent}%</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            {completedCount} of {totalCount} statutory criteria completed. All critical checks are verified against SEBI BRSR guidelines.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="w-20 h-20 rounded-full border-4 border-emerald-400 flex items-center justify-center bg-white/5 backdrop-blur-xs">
            <span className="text-xl font-black text-white">{readinessPercent}%</span>
          </div>
        </div>
      </div>

      {/* External Assurance Partner Credentials */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Scale className="w-4 h-4 text-[#003B73]" />
            <span>Designated Statutory ESG Assurance Partner</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Mandate Contract Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Assurance Firm</span>
            <span className="font-bold text-slate-900 text-sm">KPMG Assurance & Consulting Services LLP</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Assurance Standard</span>
            <span className="font-semibold text-slate-800">ISAE 3000 (Revised) & SEBI Circular</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Scope of Engagement</span>
            <span className="font-semibold text-slate-800">Reasonable Assurance (Core) + Limited (All)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Target Board Delivery</span>
            <span className="font-mono font-semibold text-emerald-700">15 April 2027</span>
          </div>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHECKLIST_GROUPS.map((group) => {
          const groupCompleted = group.items.every((i) => checkedItems[i.id]);
          return (
            <div
              key={group.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-slate-900">{group.title}</h4>
                  {groupCompleted ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Complete
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4">{group.description}</p>

                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-start gap-2.5 cursor-pointer text-xs group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedItems[item.id])}
                        onChange={() => toggleItem(item.id)}
                        className="mt-0.5 rounded border-slate-300 text-[#003B73] focus:ring-[#003B73]"
                      />
                      <span
                        className={`leading-relaxed transition-colors ${
                          checkedItems[item.id]
                            ? 'text-slate-800 font-medium'
                            : 'text-slate-500 group-hover:text-slate-700'
                        }`}
                      >
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
