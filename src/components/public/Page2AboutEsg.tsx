import React from 'react';
import {
  Droplet,
  Leaf,
  Users2,
  Zap,
  Globe,
  ArrowRight,
  FileCheck,
  Building,
  CheckCircle2,
  Layers,
  Database,
  Search,
  Scale,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import {
  TunnelIcon,
  HydrocarbonIcon,
  ManufacturingIcon,
} from '../ui/SectorIcons';

export const Page2AboutEsg: React.FC = () => {
  const timelineSteps = [
    { year: '1989', title: 'Foundation', desc: 'Inception in Hyderabad, commencing targeted irrigation and engineering works.' },
    { year: '2000s', title: 'Infrastructure Expansion', desc: 'Scaling into regional pipelines, canal networks, and heavy civil construction.' },
    { year: '2010s', title: 'Multi-Sector Growth', desc: 'Diversification across power generation, hydrocarbon infrastructure, and road transport.' },
    { year: '2018', title: 'National Projects', desc: 'Executing marquee national undertakings including the landmark Kaleshwaram Lift Irrigation.' },
    { year: '2022', title: 'Global Operations', desc: 'Expanding engineering footprints and specialized infrastructure projects internationally.' },
    { year: 'Present', title: 'Sustainable Infrastructure', desc: 'Embedding ESG principles and structured BRSR disclosures across group-wide operations.' },
  ];

  const sectors = [
    {
      id: 'water',
      name: 'Water & Irrigation',
      desc: 'Lifeline lift irrigation networks, water purification grids, and bulk piped distribution across India.',
      icon: Droplet,
      accent: 'text-sky-400',
    },
    {
      id: 'transport',
      name: 'Transport & Tunnels',
      desc: 'Complex high-altitude tunnel engineering, expressways, bridges, and regional road networks.',
      icon: TunnelIcon,
      accent: 'text-amber-400',
    },
    {
      id: 'power',
      name: 'Power & Renewables',
      desc: 'Utility-scale solar farms, transmission corridors, thermal substations, and clean power grids.',
      icon: Leaf,
      accent: 'text-emerald-400',
    },
    {
      id: 'hydrocarbons',
      name: 'Hydrocarbons',
      desc: 'High-pressure oil & gas pipelines, refinery installations, and petrochemical plant engineering.',
      icon: HydrocarbonIcon,
      accent: 'text-rose-400',
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      desc: 'Precision heavy machinery fabrication, spiral submerged arc welded (HSAW) pipes, and industrial components.',
      icon: ManufacturingIcon,
      accent: 'text-cyan-400',
    },
    {
      id: 'mobility',
      name: 'Electric Mobility',
      desc: 'Zero-emission electric transit buses, fleet electrification infrastructure, and charging ecosystems.',
      icon: Zap,
      accent: 'text-yellow-400',
    },
    {
      id: 'social',
      name: 'Social Infrastructure',
      desc: 'Modern healthcare facilities, urban development, community water stations, and civic public works.',
      icon: Users2,
      accent: 'text-purple-400',
    },
  ];

  const esgDimensions = [
    {
      tag: 'E',
      label: 'ENVIRONMENTAL',
      accent: 'from-emerald-500/20 to-emerald-950/30 border-emerald-500/30 text-emerald-400',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      description: 'Quantifying natural resource stewardship, greenhouse gas accounting, and ecological safeguards across projects.',
      aspects: [
        'Energy Consumption & Mix',
        'Greenhouse Gas Emissions (Scope 1, 2, 3)',
        'Water Withdrawal & Conservation',
        'Hazardous & Non-Hazardous Waste',
        'Air Emissions (SOx, NOx, PM)',
        'Ecological & Biodiversity Protection',
        'Physical & Transition Climate Risks',
      ],
    },
    {
      tag: 'S',
      label: 'SOCIAL',
      accent: 'from-sky-500/20 to-sky-950/30 border-sky-500/30 text-sky-400',
      badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
      description: 'Upholding workforce dignity, health, safety, inclusive development, and community stakeholder relationships.',
      aspects: [
        'Employee & Worker Well-being',
        'Occupational Health & Safety Metrics',
        'Human Rights & Fair Labour Practices',
        'Workforce Diversity & Inclusion',
        'Skill Development & Training Hours',
        'Local Community Impact Assessment',
        'Corporate Social Responsibility (CSR)',
      ],
    },
    {
      tag: 'G',
      label: 'GOVERNANCE',
      accent: 'from-indigo-500/20 to-indigo-950/30 border-indigo-500/30 text-indigo-400',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      description: 'Reinforcing transparent leadership, institutional compliance, integrity protocols, and ethical business stewardship.',
      aspects: [
        'Ethics, Anti-Corruption & Bribery Controls',
        'Regulatory Compliance & Risk Management',
        'Data Privacy & Cyber Infrastructure',
        'Robust Whistleblower Mechanisms',
        'Board Diversity & Independent Oversight',
        'Supplier Responsibility & Procurement Code',
        'Responsible Business & Fair Competition',
      ],
    },
  ];

  const brsrPrinciples = [
    { num: 'P1', title: 'Ethics, Transparency and Accountability', desc: 'Conducting business with integrity and core transparency across operations.' },
    { num: 'P2', title: 'Sustainable and Safe Goods and Services', desc: 'Engineering products and construction services that are safe and sustainable.' },
    { num: 'P3', title: 'Employee Well-being', desc: 'Promoting the safety, health, dignity, and personal growth of all workers.' },
    { num: 'P4', title: 'Stakeholder Responsiveness', desc: 'Engaging proactively with local communities, clients, partners, and regulators.' },
    { num: 'P5', title: 'Human Rights', desc: 'Respecting and upholding fundamental human rights across all operational boundaries.' },
    { num: 'P6', title: 'Environment', desc: 'Protecting and restoring environmental ecosystems and optimizing resource use.' },
    { num: 'P7', title: 'Responsible Public Policy', desc: 'Engaging responsibly and ethically with public authorities and industry bodies.' },
    { num: 'P8', title: 'Inclusive Growth & Development', desc: 'Promoting equitable socio-economic progress in surrounding project communities.' },
    { num: 'P9', title: 'Responsible Consumer Engagement', desc: 'Delivering dependable, honest, and high-quality value to clients and end-users.' },
  ];

  const platformProblems = [
    {
      id: '01',
      title: 'Fragmented Data',
      desc: 'ESG information originates from different subsidiaries, business units, mega projects, plant sites, and technical departments.',
      icon: Database,
    },
    {
      id: '02',
      title: 'Evidence Management',
      desc: 'Reported metrics require auditable supporting documents, lab tests, fuel registers, and official invoices for verified provenance.',
      icon: FileCheck,
    },
    {
      id: '03',
      title: 'Data Quality',
      desc: 'Missing indicator entries, inconsistent unit conversions, and unexplained YoY fluctuations compromise reporting credibility.',
      icon: Search,
    },
    {
      id: '04',
      title: 'Consolidation',
      desc: 'Information must accurately traverse from project sites to BU aggregates, subsidiary accounts, and final group-level reporting.',
      icon: Layers,
    },
  ];

  const brsrCoreCards = [
    { title: 'GHG Footprint', desc: 'Gross Scope 1 & 2 carbon intensity tracking across operational sites.' },
    { title: 'Water Footprint', desc: 'Consumption, withdrawal by source, and discharge water accounting.' },
    { title: 'Energy Footprint', desc: 'Total energy consumed, renewable energy share, and intensity ratios.' },
    { title: 'Circularity', desc: 'Recycled waste management, hazardous materials, and circular reuse.' },
    { title: 'Employee Well-being & Safety', desc: 'Lost Time Injury Frequency Rate (LTIFR), safety training, and benefits.' },
    { title: 'Gender Diversity', desc: 'Female representation across board, management, staff, and workforce.' },
    { title: 'Inclusive Development', desc: 'Local procurement share and aspirational district CSR investments.' },
    { title: 'Customer/Supplier Fairness', desc: 'On-time MSME vendor payouts, contractual equity, and fair terms.' },
    { title: 'Business Openness', desc: 'Grievance redressal resolution speed and anti-bribery training records.' },
  ];

  return (
    <div className="relative w-full bg-[#07111e] text-slate-100 overflow-hidden font-sans border-t border-slate-800/80">
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Page Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28 space-y-28">

        {/* PAGE 2 HEADER / HERO TITLE */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31E24]" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase">
              ABOUT MEIL &bull; ESG &bull; BRSR
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
            Engineering Infrastructure.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
              Creating Responsible Growth.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Understanding MEIL, ESG and the need for structured BRSR reporting across critical nationwide infrastructure.
          </p>
        </div>

        {/* SECTION 1 — ABOUT MEIL */}
        <section className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2.5">
                <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
                <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                  Corporate Background
                </h3>
              </div>
              <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                About Megha Engineering &amp; Infrastructures Limited
              </h4>
              <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                <p>
                  Megha Engineering &amp; Infrastructures Limited (MEIL) is an Indian infrastructure and engineering company with operations across multiple sectors including irrigation, drinking water, power, transport, hydrocarbons and electric mobility.
                </p>
                <p>
                  MEIL began its journey in Hyderabad in 1989 and has expanded into a multi-sector infrastructure group with operations extending beyond India.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                <Globe className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Verified Corporate Scope:</strong> Information sourced from official corporate documentation and verified public filings. Operations span civil infrastructure, renewable power, electric transport, and industrial manufacturing.
                </span>
              </div>
            </div>

            {/* Right Abstract Visual Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 to-[#0c1a2d]/90 p-7 rounded-2xl border border-slate-800/90 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E31E24]/10 rounded-full blur-2xl group-hover:bg-[#E31E24]/20 transition-all" />
              <div className="space-y-5 relative z-10">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Building className="w-5 h-5 text-[#E31E24]" />
                    <span className="text-xs font-bold text-white tracking-wide uppercase">MEIL at a Glance</span>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">Est. 1989</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[11px] text-slate-400 block mb-1">HQ Location</span>
                    <span className="text-sm font-semibold text-white">Hyderabad, India</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[11px] text-slate-400 block mb-1">Scale</span>
                    <span className="text-sm font-semibold text-white">Multi-Sector Group</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[11px] text-slate-400 block mb-1">Global Reach</span>
                    <span className="text-sm font-semibold text-white">Domestic &amp; Overseas</span>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                    <span className="text-[11px] text-slate-400 block mb-1">ESG Mandate</span>
                    <span className="text-sm font-semibold text-emerald-400">BRSR Aligned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Milestone Timeline */}
          <div className="pt-6">
            <h5 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-6 flex items-center gap-2">
              <span>Historical Evolution</span>
              <div className="h-px flex-1 bg-slate-800" />
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {timelineSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className="relative p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-[#E31E24] tracking-tight">{step.year}</span>
                    <span className="text-[10px] text-slate-500 font-mono">0{idx + 1}</span>
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                      {step.title}
                    </h6>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2 — MEIL SECTORS */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                Core Capabilities
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Building Across Critical Infrastructure Sectors
            </h4>
            <p className="text-sm text-slate-400 max-w-2xl font-normal">
              Specialized engineering and construction capabilities deployed across national priority sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.id}
                  className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-slate-700/60">
                      <Icon className={`w-5 h-5 ${sector.accent}`} />
                    </div>
                    <h5 className="text-sm font-bold text-white group-hover:text-slate-100 mb-2">
                      {sector.name}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {sector.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3 — WHAT IS ESG? */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                Sustainability Framework
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What is ESG?
            </h4>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
              ESG stands for Environmental, Social and Governance. It provides a structured way to understand an organization's environmental impact, treatment of people and communities, and governance practices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {esgDimensions.map((dim) => (
              <div
                key={dim.tag}
                className={`p-6 sm:p-7 rounded-2xl bg-gradient-to-b ${dim.accent} border backdrop-blur-sm space-y-6 flex flex-col justify-between shadow-xl`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${dim.badgeColor}`}>
                      {dim.tag} &bull; {dim.label}
                    </span>
                    <span className="text-2xl font-black opacity-30 font-mono">{dim.tag}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {dim.description}
                  </p>
                  <div className="border-t border-slate-700/60 pt-4 space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Core Metrics &amp; Disclosures:
                    </span>
                    <ul className="space-y-2">
                      {dim.aspects.map((asp) => (
                        <li key={asp} className="flex items-center gap-2 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{asp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4 — WHAT IS BRSR? */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                Regulatory Disclosure Architecture
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Understanding BRSR
            </h4>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
              BRSR stands for Business Responsibility and Sustainability Reporting. It provides a structured framework for listed entities to disclose information related to responsible business practices and sustainability.
            </p>
            <p className="text-xs text-slate-400 max-w-2xl font-normal">
              BRSR is organized around nine principles of responsible business conduct.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brsrPrinciples.map((principle) => (
              <div
                key={principle.num}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-[#E31E24] font-mono px-2 py-0.5 rounded bg-[#E31E24]/10 border border-[#E31E24]/20">
                      {principle.num}
                    </span>
                    <Scale className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                  </div>
                  <h5 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {principle.title}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {principle.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Support Statement */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 text-center max-w-3xl mx-auto">
            <span className="text-slate-300 font-semibold">Regulatory Alignment Note: </span>
            Designed to support BRSR reporting workflows aligned with applicable SEBI requirements.
          </div>
        </section>

        {/* SECTION 5 — WHY A DIGITAL ESG PLATFORM? */}
        <section className="space-y-10">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                The Enterprise Data Challenge
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why ESG Reporting Needs a Connected Data System
            </h4>
            <p className="text-sm text-slate-400 max-w-3xl font-normal">
              Managing non-financial metrics across mega infrastructure projects requires auditable data pipelines rather than ad-hoc spreadsheets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platformProblems.map((prob) => {
              const Icon = prob.icon;
              return (
                <div
                  key={prob.id}
                  className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-[#E31E24] transition-colors">
                        {prob.id}
                      </span>
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <h5 className="text-sm sm:text-base font-bold text-white">
                      {prob.title}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">
                      {prob.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consolidation Flow Hierarchy */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1728] to-slate-950 border border-slate-800 text-center space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Enterprise Aggregation Architecture
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold">
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white">PROJECT</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white">BUSINESS UNIT</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white">SUBSIDIARY</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1.5 rounded-lg bg-[#003B73] border border-sky-600 text-white font-bold">MEIL GROUP</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="px-3 py-1.5 rounded-lg bg-[#E31E24] text-white font-bold shadow-md">BRSR OUTPUT</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-400 font-medium">
              &ldquo;MEIL ESG NEXUS is designed to connect this entire journey.&rdquo;
            </p>
          </div>
        </section>

        {/* SECTION 6 — BRSR CORE */}
        <section className="space-y-8">
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 bg-[#E31E24] rounded-full" />
              <h3 className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase">
                High-Assurance Indicators
              </h3>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Beyond Data Collection — BRSR Core Readiness
            </h4>
            <p className="text-sm text-slate-400 max-w-3xl font-normal">
              BRSR Core focuses on selected key ESG performance indicators that require elevated assurance workflows, parameter verifiability, and disciplined calculation trails.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brsrCoreCards.map((core) => (
              <div
                key={core.title}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/90 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {core.title}
                  </h5>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {core.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center text-xs text-slate-500">
            * MEIL ESG NEXUS prepares data and evidence trails for independent assurance; it does not replace statutory assurance practitioners.
          </div>
        </section>

        {/* Bottom Transition Prompt into Page 3 */}
        <div className="text-center pt-8 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              const p3 = document.getElementById('page-3');
              if (p3) p3.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex flex-col items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span>Continue to MEIL ESG NEXUS Platform Workflow &darr;</span>
            <ChevronDown className="w-4 h-4 text-[#E31E24] group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
