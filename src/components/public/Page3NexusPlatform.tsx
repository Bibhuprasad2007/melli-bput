import React, { useState } from 'react';
import {
  FileText,
  FileCheck,
  CheckCircle2,
  Layers,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
  Eye,
  ArrowRight,
  ChevronRight,
  Database,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  Leaf,
  Activity,
  Award,
  Lock,
} from 'lucide-react';
import type { PortalRole } from '../../types/auth';

interface Page3NexusPlatformProps {
  onOpenLogin: (role?: PortalRole) => void;
}

export const Page3NexusPlatform: React.FC<Page3NexusPlatformProps> = ({ onOpenLogin }) => {
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [activeTraceTab, setActiveTraceTab] = useState<'diesel' | 'water' | 'csr'>('diesel');

  const platformCapabilities = [
    {
      num: '01',
      title: 'ESG DATA COLLECTION',
      desc: 'Collect structured Environmental, Social and Governance information with activity units and baseline validations.',
      icon: Database,
    },
    {
      num: '02',
      title: 'EVIDENCE MANAGEMENT',
      desc: 'Connect ESG values with supporting documents, weighbridge slips, lab test sheets, and official invoices.',
      icon: FileCheck,
    },
    {
      num: '03',
      title: 'VALIDATION',
      desc: 'Identify missing parameters, unit inconsistencies, and abnormal YoY variations before data reaches reviewers.',
      icon: CheckCircle2,
    },
    {
      num: '04',
      title: 'CONSOLIDATION',
      desc: 'Connect project-level data with business-unit aggregates, subsidiary ledgers, and group-wide summaries.',
      icon: Layers,
    },
    {
      num: '05',
      title: 'BRSR MANAGEMENT',
      desc: 'Organize ESG information around nine SEBI principles with customizable indicator templates and timelines.',
      icon: Settings,
    },
    {
      num: '06',
      title: 'AUDIT & ASSESSMENT',
      desc: 'Provide controlled, immutable access to evidence, review audit trails, correction histories, and assessor notes.',
      icon: ShieldCheck,
    },
  ];

  const workflowSteps = [
    { num: '01', stage: 'CONFIGURE', actor: 'ESG Admin', desc: 'Configures reporting period, organization nodes, indicators and workflow assignments.' },
    { num: '02', stage: 'COLLECT', actor: 'Data Contributor', desc: 'Enters operational activity data, emission factors, and parameter details.' },
    { num: '03', stage: 'EVIDENCE', actor: 'Data Contributor', desc: 'Attaches mandatory supporting documentation, fuel bills, and certificates.' },
    { num: '04', stage: 'VALIDATE', actor: 'Automated QC', desc: 'Automated checks flag unit mismatch, YoY anomalies, and missing entries.' },
    { num: '05', stage: 'REVIEW', actor: 'Reviewer', desc: 'Validates evidence authenticity, asks for corrections or approves submission.' },
    { num: '06', stage: 'APPROVE', actor: 'Management', desc: 'Reviews consolidated dashboards, risk thresholds, and executes executive sign-off.' },
    { num: '07', stage: 'ASSESS', actor: 'Auditor', desc: 'Performs sample spot-checks, inspects evidence chain and logs assurance findings.' },
    { num: '08', stage: 'REPORT', actor: 'Output System', desc: 'Produces validated SEBI BRSR reports, XBRL datasets, and ESG performance summaries.' },
  ];

  const roles = [
    {
      id: 'esg_admin',
      role: 'ESG ADMIN',
      portalRole: 'esg-admin' as PortalRole,
      title: 'Governance & Framework Setup',
      desc: 'Configures the reporting environment, users, indicators, reporting periods and workflow.',
      badge: 'System Admin',
      accent: 'border-indigo-500/30 hover:border-indigo-500 bg-indigo-950/20',
      icon: Settings,
    },
    {
      id: 'contributor',
      role: 'DATA CONTRIBUTOR',
      portalRole: 'data-contributor' as PortalRole,
      title: 'Field & Site Submissions',
      desc: 'Enters ESG information, maintains records and submits supporting evidence.',
      badge: 'Project & Plant Sites',
      accent: 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-950/20',
      icon: FileText,
    },
    {
      id: 'reviewer',
      role: 'REVIEWER',
      portalRole: 'reviewer-approver' as PortalRole,
      title: 'Quality Control & Review',
      desc: 'Checks data quality, validates evidence and manages corrections.',
      badge: 'Departmental Lead',
      accent: 'border-sky-500/30 hover:border-sky-500 bg-sky-950/20',
      icon: UserCheck,
    },
    {
      id: 'management',
      role: 'MANAGEMENT',
      portalRole: 'management' as PortalRole,
      title: 'Executive Sign-Off',
      desc: 'Monitors ESG performance, reviews risks and approves reporting outputs.',
      badge: 'Executive Oversight',
      accent: 'border-amber-500/30 hover:border-amber-500 bg-amber-950/20',
      icon: Award,
    },
    {
      id: 'auditor',
      role: 'AUDITOR',
      portalRole: 'auditor-assurer' as PortalRole,
      title: 'Assurance & Traceability',
      desc: 'Reviews assigned information, traces evidence and records observations.',
      badge: 'Assurance Partner',
      accent: 'border-purple-500/30 hover:border-purple-500 bg-purple-950/20',
      icon: Eye,
    },
  ];

  const platformBenefits = [
    { title: 'CENTRALIZED', desc: 'Bring ESG information into one controlled environment across all businesses.', icon: Database },
    { title: 'TRACEABLE', desc: 'Connect reported information with its underlying data, formulas, and evidence.', icon: Layers },
    { title: 'VALIDATED', desc: 'Identify data quality issues and unit anomalies before reporting deadlines.', icon: CheckCircle2 },
    { title: 'COLLABORATIVE', desc: 'Connect contributors, reviewers, management and auditors in single audit trail.', icon: Users },
    { title: 'SCALABLE', desc: 'Support group, subsidiary, business-unit and site project-level reporting.', icon: Activity },
    { title: 'REPORT-READY', desc: 'Turn validated information into structured SEBI BRSR and stakeholder outputs.', icon: FileCheck },
  ];

  return (
    <div className="relative w-full bg-[#060e1a] text-slate-100 overflow-hidden font-sans border-t border-slate-800">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#E31E24]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-sky-900/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 space-y-28">

        {/* HERO TITLE OF PAGE 3 */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase">
              ENTERPRISE ESG SYSTEM
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
            MEIL <span className="text-[#E31E24]">ESG NEXUS</span>
          </h2>
          <p className="text-lg sm:text-xl text-sky-300 font-semibold tracking-wide">
            From ESG Data to Trusted BRSR Reporting
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A centralized ESG and BRSR reporting platform designed to connect data collection, evidence, validation, review, consolidation, management approval and assessment across the enterprise.
          </p>
        </div>

        {/* SECTION 1 — WHAT THE PLATFORM DOES */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                System Capabilities
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What the Platform Does
            </h4>
            <p className="text-sm text-slate-400 max-w-3xl font-normal">
              Six modular pillars designed to enforce reporting precision, audit integrity, and governance transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {platformCapabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.num}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#E31E24]">
                        {cap.num}
                      </span>
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h5 className="text-sm sm:text-base font-bold text-white group-hover:text-slate-100">
                      {cap.title}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2 — HOW THE PLATFORM WORKS (WORKFLOW) */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                End-to-End Governance Lifecycle
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              One Connected ESG Reporting Workflow
            </h4>
            <p className="text-sm text-slate-400 max-w-2xl font-normal">
              Eight stages linking operational site engineers with executive directors and independent assurance.
            </p>
          </div>

          {/* Interactive Horizontal Workflow Bar */}
          <div className="bg-slate-950/80 p-5 sm:p-7 rounded-2xl border border-slate-800 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {workflowSteps.map((step, idx) => (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeWorkflowStep === idx
                      ? 'bg-[#003B73] border-sky-400 shadow-md ring-1 ring-sky-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400">{step.num}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeWorkflowStep === idx ? 'bg-sky-300' : 'bg-slate-700'}`} />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-white truncate">{step.stage}</h6>
                    <span className="text-[10px] text-slate-300 block truncate">{step.actor}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Stage Detail Card */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Stage {workflowSteps[activeWorkflowStep].num} &bull; {workflowSteps[activeWorkflowStep].stage}
                </span>
                <h5 className="text-base font-bold text-white">
                  Owner: {workflowSteps[activeWorkflowStep].actor}
                </h5>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal">
                  {workflowSteps[activeWorkflowStep].desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveWorkflowStep((prev) => (prev + 1) % workflowSteps.length)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg border border-slate-700 inline-flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
              >
                <span>Next Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3 — FIVE ROLE ECOSYSTEM */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                Access Governance
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Five Roles. One Controlled Reporting System.
            </h4>
            <p className="text-sm text-slate-400 max-w-2xl font-normal">
              Segregation of duties ensures data integrity, unbiased approval, and auditable verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.id}
                  className={`p-5 rounded-2xl border ${r.accent} transition-all flex flex-col justify-between group space-y-4 shadow-lg`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {r.badge}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-black text-white tracking-wide">
                        {r.role}
                      </h5>
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{r.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      &ldquo;{r.desc}&rdquo;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenLogin(r.portalRole)}
                    className="w-full py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Sign in as {r.role.split(' ')[0]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Workflow chain representation */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-300">
              <span className="text-indigo-400">ADMIN</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-emerald-400">CONTRIBUTOR</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-sky-400">REVIEWER</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-amber-400">MANAGEMENT</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-purple-400">AUDITOR</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[#E31E24] font-bold">BRSR DISCLOSURE</span>
            </div>
          </div>
        </section>

        {/* SECTION 4 — DATA TRACEABILITY */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                Audit Trail &amp; Verification
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Every Number Has a Traceable Journey
            </h4>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
              From an individual ESG data entry to the final consolidated reporting value, the platform is designed to preserve the context, evidence and workflow history behind reported information.
            </p>
          </div>

          {/* Flow Diagram */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 via-[#071322] to-slate-950 border border-slate-800 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block text-center">
              12-Point Lineage Chain
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium">
              {[
                'MEIL GROUP',
                'SUBSIDIARY',
                'BUSINESS UNIT',
                'PROJECT',
                'SITE',
                'DEPARTMENT',
                'ACTIVITY DATA',
                'CALCULATION',
                'EVIDENCE',
                'REVIEW',
                'APPROVAL',
                'BRSR',
              ].map((step, i, arr) => (
                <React.Fragment key={step}>
                  <span className={`px-2.5 py-1 rounded-md border ${
                    step === 'BRSR'
                      ? 'bg-[#E31E24] text-white border-[#E31E24] font-bold'
                      : step === 'EVIDENCE' || step === 'CALCULATION'
                      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/60 font-semibold'
                      : 'bg-slate-900 text-slate-200 border-slate-700'
                  }`}>
                    {step}
                  </span>
                  {i < arr.length - 1 && <span className="text-slate-600">&rarr;</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Interactive Scope 1 Example Showcase */}
            <div className="p-5 sm:p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Interactive Lineage Simulation:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTraceTab('diesel')}
                      className={`px-2.5 py-0.5 text-xs rounded transition-colors ${
                        activeTraceTab === 'diesel' ? 'bg-sky-600 text-white font-semibold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Scope 1 Diesel Fuel
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTraceTab('water')}
                      className={`px-2.5 py-0.5 text-xs rounded transition-colors ${
                        activeTraceTab === 'water' ? 'bg-sky-600 text-white font-semibold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Groundwater Withdrawal
                    </button>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Illustrative Demo Data
                </span>
              </div>

              {activeTraceTab === 'diesel' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">1. Operational Activity</span>
                    <strong className="text-white text-sm block">12,450 Litres</strong>
                    <span className="text-slate-400 text-[11px]">Diesel for site excavators &amp; gensets</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">2. Standard Factor &amp; Formula</span>
                    <strong className="text-sky-300 text-sm block">2.68 kg CO₂e / L</strong>
                    <span className="text-slate-400 text-[11px]">Formula: (12,450 &times; 2.68) / 1,000</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">3. Calculated Result</span>
                    <strong className="text-emerald-400 text-sm block">33.37 tCO₂e</strong>
                    <span className="text-slate-400 text-[11px]">Expressway Phase-II &rarr; Roads BU</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">4. Final Consolidation</span>
                    <strong className="text-white text-sm block">BRSR Principle 6</strong>
                    <span className="text-slate-400 text-[11px]">MEIL Infrastructure Ltd &rarr; Group BRSR</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">1. Site Meter Reading</span>
                    <strong className="text-white text-sm block">1,820 Kilolitres</strong>
                    <span className="text-slate-400 text-[11px]">Borewell logbook &amp; CGWA flowmeter</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">2. Evidence Attached</span>
                    <strong className="text-sky-300 text-sm block">CGWA_Log_Oct26.pdf</strong>
                    <span className="text-slate-400 text-[11px]">Signed by Environmental Officer</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">3. Reviewer Verification</span>
                    <strong className="text-emerald-400 text-sm block">Status: Validated</strong>
                    <span className="text-slate-400 text-[11px]">Kaleshwaram Lift Site 4 &rarr; Irrigation BU</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">4. Group Disclosure</span>
                    <strong className="text-white text-sm block">P6 Water Intensity</strong>
                    <span className="text-slate-400 text-[11px]">Consolidated into MEIL Water Footprint</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 5, 6, 7 — DOMAIN MODULES: ENVIRONMENTAL, SOCIAL, GOVERNANCE */}
        <section className="space-y-10">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                Reporting Domains
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Comprehensive ESG Disclosure Modules
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Illustrative Demo Data shown for architectural preview.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ENVIRONMENTAL */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#081820] border border-emerald-500/30 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-wide">Environmental</h5>
                </div>
                <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  Principle 2, 6
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Energy Consumption',
                  'Water Sourcing',
                  'Scope 1 Direct GHG',
                  'Scope 2 Electricity',
                  'Scope 3 Supply Chain',
                  'Hazardous Waste',
                  'Air Emissions (NOx/SOx)',
                  'Ecological Biodiversity',
                  'Climate Vulnerability',
                  'Green Approvals',
                ].map((item) => (
                  <div key={item} className="p-2 bg-slate-950/60 rounded border border-slate-800/80 text-slate-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SOCIAL */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#081726] border border-sky-500/30 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-400" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-wide">Social &amp; People</h5>
                </div>
                <span className="text-[10px] text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                  Principle 3, 5, 8
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Permanent Employees',
                  'Contractual Workers',
                  'Gender Diversity %',
                  'Health & Safety (LTIFR)',
                  'Human Rights Audits',
                  'Worker Training Hours',
                  'Grievance Redressal',
                  'CSR Expenditures',
                  'Local Hiring Share',
                  'Community Engagement',
                ].map((item) => (
                  <div key={item} className="p-2 bg-slate-950/60 rounded border border-slate-800/80 text-slate-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-sky-400 rounded-full" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GOVERNANCE */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-[#120f26] border border-indigo-500/30 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h5 className="text-sm font-bold text-white uppercase tracking-wide">Governance</h5>
                </div>
                <span className="text-[10px] text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  Principle 1, 7, 9
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'Code of Business Conduct',
                  'Anti-Corruption Controls',
                  'Whistleblower Portal',
                  'Regulatory Compliance',
                  'Cybersecurity Measures',
                  'Data Privacy Controls',
                  'Customer Responsibility',
                  'MSME Vendor Fairness',
                  'Responsible Public Policy',
                  'Board Oversight Matrix',
                ].map((item) => (
                  <div key={item} className="p-2 bg-slate-950/60 rounded border border-slate-800/80 text-slate-300 flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-indigo-400 rounded-full" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 — PLATFORM BENEFITS */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                Enterprise Value
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why MEIL ESG NEXUS?
            </h4>
            <p className="text-sm text-slate-400 max-w-2xl font-normal">
              Built for engineering and infrastructure complexity, designed for boardroom transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {platformBenefits.map((ben) => {
              const Icon = ben.icon;
              return (
                <div
                  key={ben.title}
                  className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center border border-slate-700 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 text-sky-400" />
                  </div>
                  <h5 className="text-sm sm:text-base font-bold text-white">
                    {ben.title}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {ben.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 9 — CORPORATE CONTACT & PORTAL ACCESS */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0a1728] to-[#071322] border border-slate-800 shadow-2xl space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Corporate Communications
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Connect With MEIL
            </h4>
            <p className="text-sm text-slate-300 font-normal">
              For corporate, ESG, sustainability and business enquiries.
            </p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                <MapPin className="w-4 h-4 text-[#E31E24]" />
                <span>Corporate Office</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                S-2, Technocrat Industrial Estate, Balanagar, Hyderabad - 500037, Telangana, India
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>Email Enquiries</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                <a href="mailto:info@meil.in" className="hover:text-sky-300 block">info@meil.in</a>
                <a href="mailto:esg@meil.in" className="hover:text-sky-300 block">esg@meil.in</a>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Telephone</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                +91 40 4433 6700
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Corporate Website</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                www.meil.in
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
            <a
              href="https://www.meil.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-semibold text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Visit MEIL Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => onOpenLogin()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#c9181d] text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-900/30 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Access ESG Portal</span>
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-10 border-t border-slate-800/80 space-y-8 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  MEIL <span className="text-[#E31E24]">BRSR REPORTING PORTAL</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="font-semibold text-sky-400 text-xs">MEIL ESG NEXUS</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Enterprise ESG &amp; BRSR Reporting Platform
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => {
                  const p2 = document.getElementById('page-2');
                  if (p2) p2.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                About MEIL
              </button>
              <button
                type="button"
                onClick={() => {
                  const p2 = document.getElementById('page-2');
                  if (p2) p2.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                ESG
              </button>
              <button
                type="button"
                onClick={() => {
                  const p2 = document.getElementById('page-2');
                  if (p2) p2.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                BRSR
              </button>
              <button
                type="button"
                onClick={() => {
                  const p3 = document.getElementById('page-3');
                  if (p3) p3.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Platform
              </button>
              <button
                type="button"
                onClick={() => {
                  const p3 = document.getElementById('page-3');
                  if (p3) p3.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Roles
              </button>
              <button
                type="button"
                onClick={() => onOpenLogin()}
                className="text-[#E31E24] hover:text-red-400 font-semibold transition-colors cursor-pointer"
              >
                Login
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-900 text-[11px] text-slate-400 leading-relaxed text-center">
            MEIL ESG NEXUS is a digital ESG reporting platform designed to support structured ESG and BRSR reporting workflows. It is not an official SEBI platform and does not constitute regulatory certification.
          </div>
        </footer>

      </div>
    </div>
  );
};
