import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ShieldCheck,
  Flame,
  Droplet,
  Zap,
  Recycle,
  HeartPulse,
  Users2,
  HandCoins,
  Scale,
  FileCheck2,
  Download,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const BRSRCorePage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();

  // SEBI Mandated 9 BRSR Core KPI Attributes
  const SEBI_CORE_KPIS = [
    {
      id: 'ghg',
      number: 1,
      title: 'Green-House Gas (GHG) Footprint',
      principle: 'P6',
      icon: Flame,
      color: 'rose',
      metric: '503.0 tCO2e Total (0.84 tCO2e/Cr turnover)',
      target: '< 0.90 tCO2e / Cr',
      progress: 93,
      priorYear: '0.98 tCO2e / Cr',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Scope 1 direct diesel combustion + Scope 2 location-based grid electricity across manufacturing plants and construction sites.',
      details: [
        { label: 'Scope 1 (Diesel combustion)', value: '134.0 tCO2e', verified: true },
        { label: 'Scope 2 (CEA Baseline Grid)', value: '369.0 tCO2e', verified: true },
        { label: 'Intensity Metric', value: '0.84 tCO2e per ₹ Cr turnover', verified: true },
      ],
    },
    {
      id: 'water',
      number: 2,
      title: 'Water Footprint & Zero Discharge',
      principle: 'P6',
      icon: Droplet,
      color: 'sky',
      metric: '18,500 KL Total (30.8 KL/Cr turnover)',
      target: '< 35.0 KL / Cr',
      progress: 88,
      priorYear: '34.2 KL / Cr',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Total water consumption by source, surface extraction, groundwater, and rainwater harvesting recovery in water-stressed basins.',
      details: [
        { label: 'Surface Water Withdrawal', value: '12,000 KL', verified: true },
        { label: 'Groundwater Permitted', value: '6,500 KL', verified: true },
        { label: 'Recycled / Reused Rate', value: '42.5%', verified: true },
      ],
    },
    {
      id: 'energy',
      number: 3,
      title: 'Energy Footprint & Renewable Share',
      principle: 'P6',
      icon: Zap,
      color: 'amber',
      metric: '2,840 GJ (18.4% Renewable Share)',
      target: '> 20.0% Renewable',
      progress: 92,
      priorYear: '14.1% Renewable',
      assuranceStatus: 'Under Review',
      assuranceBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'Direct & indirect energy consumption. Solar rooftop generation at Hyderabad manufacturing facilities + green power purchase.',
      details: [
        { label: 'Grid Electricity', value: '1,620 GJ', verified: true },
        { label: 'On-site Captive Solar', value: '522 GJ', verified: true },
        { label: 'Clean Energy Variance', value: '+4.3% YoY Growth', verified: true },
      ],
    },
    {
      id: 'circularity',
      number: 4,
      title: 'Embracing Circularity & Waste Diversion',
      principle: 'P2',
      icon: Recycle,
      color: 'teal',
      metric: '91.2% Fly-Ash & Slag Recycled',
      target: '> 90.0% Recycled',
      progress: 98,
      priorYear: '87.4% Recycled',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Zero waste to landfill initiative across heavy civil and manufacturing units. Fly-ash integration into Pozzolana blended cement concrete.',
      details: [
        { label: 'Non-Hazardous Diverted', value: '14,200 MT', verified: true },
        { label: 'Hazardous Waste Authorised Co-processed', value: '84 MT', verified: true },
        { label: 'Recycled Input Materials', value: '31.4%', verified: true },
      ],
    },
    {
      id: 'safety',
      number: 5,
      title: 'Employee Wellbeing & Safety (LTIFR)',
      principle: 'P3',
      icon: HeartPulse,
      color: 'emerald',
      metric: '0.12 LTIFR (Zero Fatalities)',
      target: 'Zero Fatalities / LTIFR < 0.20',
      progress: 96,
      priorYear: '0.18 LTIFR',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Lost Time Injury Frequency Rate per million man-hours worked across 42,000+ permanent and contract workers.',
      details: [
        { label: 'Fatalities Recorded', value: '0', verified: true },
        { label: 'High-Consequence Injuries', value: '0', verified: true },
        { label: 'OSHA / ISO 45001 Site Coverage', value: '100%', verified: true },
      ],
    },
    {
      id: 'diversity',
      number: 6,
      title: 'Gender Diversity & Equal Opportunity',
      principle: 'P3',
      icon: Users2,
      color: 'indigo',
      metric: '14.2% Female Engineers & Staff',
      target: '> 15.0%',
      progress: 89,
      priorYear: '11.8%',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Female workforce representation across board of directors, key managerial personnel (KMP), engineering design teams, and site staff.',
      details: [
        { label: 'Board Diversity', value: '25.0% Women', verified: true },
        { label: 'KMP & Executive Management', value: '18.2% Women', verified: true },
        { label: 'Equal Remuneration Ratio', value: '1.00 : 1.00', verified: true },
      ],
    },
    {
      id: 'csr',
      number: 7,
      title: 'Inclusive Development & CSR Reach',
      principle: 'P8',
      icon: HandCoins,
      color: 'violet',
      metric: '₹28.4 Cr Spent (102% Mandate Met)',
      target: '100% Statutory 2% Spend',
      progress: 100,
      priorYear: '₹24.1 Cr',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Section 135 CSR contributions focusing on skill development centres, healthcare dispensaries, and drinking water facilities in project areas.',
      details: [
        { label: 'Local Community Beneficiaries', value: '124,000 Persons', verified: true },
        { label: 'Aspirational Districts Impacted', value: '7 Districts', verified: true },
        { label: 'Third-Party Impact Assessment', value: 'Completed by IIT/TISS', verified: true },
      ],
    },
    {
      id: 'msme',
      number: 8,
      title: 'Fairness in Engaging Suppliers & MSMEs',
      principle: 'P5',
      icon: Scale,
      color: 'cyan',
      metric: '98.4% MSME Dues Cleared < 45 Days',
      target: '> 95.0% Compliance',
      progress: 99,
      priorYear: '96.2%',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Micro, Small and Medium Enterprises Development (MSMED) Act compliance. Value chain partner ESG code of conduct sign-off.',
      details: [
        { label: 'Active MSME Vendors', value: '1,420 Suppliers', verified: true },
        { label: 'Disputed Claims Overdue', value: '0 Cases', verified: true },
        { label: 'Supplier ESG Assessments', value: '88% Coverage', verified: true },
      ],
    },
    {
      id: 'governance',
      number: 9,
      title: 'Openness of Business & Transparency',
      principle: 'P1',
      icon: FileCheck2,
      color: 'slate',
      metric: '100% Grievances Resolved (0 Pending)',
      target: '100% Resolution',
      progress: 100,
      priorYear: '100%',
      assuranceStatus: 'Assurance Ready',
      assuranceBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Anti-corruption policy training, whistleblower hotline governance, stakeholder consultations, and regulatory compliance clearance.',
      details: [
        { label: 'Whistleblower Complaints', value: '3 Received, 3 Resolved', verified: true },
        { label: 'Anti-Bribery Training', value: '98.6% Staff', verified: true },
        { label: 'Regulatory Penalties / Fines', value: 'NIL', verified: true },
      ],
    },
  ];

  const handleExportCoreReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Attribute #,Title,Principle,Reported Metric,Target,Prior Year,Assurance Status\n' +
      SEBI_CORE_KPIS.map(
        (k) =>
          `"${k.number}","${k.title}","${k.principle}","${k.metric}","${k.target}","${k.priorYear}","${k.assuranceStatus}"`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'MEIL_SEBI_BRSR_Core_Assurance_Matrix_FY26-27.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('SEBI BRSR Core assurance metrics exported as CSV.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEBI BRSR Core Mandated Attributes"
        description="Statutory non-financial key performance indicators mandated by SEBI for top 1000 listed entities. Monitored for reasonable third-party assurance."
        actionText="Export Core Matrix"
        actionIcon={Download}
        onAction={handleExportCoreReport}
      />

      {/* Compliance Callout Banner */}
      <div className="bg-gradient-to-r from-[#003B73] to-[#002244] text-white p-5 rounded-2xl shadow-sm border border-sky-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SEBI Circular SEBI/HO/CFD/CFD-SEC-2/P/CIR/2023/122</span>
          </div>
          <h3 className="text-lg font-bold text-white mt-1">
            MEIL Consolidated BRSR Core Readiness: <span className="text-emerald-400">96.4% Compliant</span>
          </h3>
          <p className="text-xs text-sky-100 max-w-2xl mt-0.5 leading-relaxed">
            All 9 core environmental, social, and governance indicators have underlying audit trail logs, emission factor calibrations, and supporting documents ready for statutory assurance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-center">
            <span className="text-[10px] uppercase font-semibold text-sky-200 block">Core Attributes</span>
            <span className="text-xl font-black text-white">9 of 9</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/30 text-center">
            <span className="text-[10px] uppercase font-semibold text-emerald-300 block">Assurance Ready</span>
            <span className="text-xl font-black text-emerald-400">8 of 9</span>
          </div>
        </div>
      </div>

      {/* 9 Core Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEBI_CORE_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-[#003B73] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#003B73] flex items-center justify-center font-bold text-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                        Attribute {kpi.number} • {kpi.principle}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{kpi.title}</h4>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${kpi.assuranceBadge}`}>
                    {kpi.assuranceStatus}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">{kpi.description}</p>

                {/* Metric Display */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">FY26-27 Metric:</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{kpi.metric}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Internal Target:</span>
                    <span className="font-semibold text-emerald-700">{kpi.target}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Prior Year (FY25):</span>
                    <span className="font-mono text-slate-600">{kpi.priorYear}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#003B73] h-full rounded-full transition-all"
                        style={{ width: `${kpi.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Granular Sub-indicators */}
                <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
                  {kpi.details.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="font-semibold text-slate-800 font-mono">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Audit Trail Verified</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    addToast(`Viewing assurance methodology for ${kpi.title}`, 'info');
                  }}
                  className="text-xs font-semibold text-[#003B73] hover:underline cursor-pointer"
                >
                  View Evidence →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
