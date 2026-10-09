import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Upload,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Send,
  ChevronDown,
  ShieldCheck,
  Check,
  ArrowUpDown,
} from 'lucide-react';
import { useNexusData } from '../../../context/NexusDataContext';
import { useContributorData } from '../context/ContributorDataContext';
import { EvidenceUploadModal } from '../modals/EvidenceUploadModal';
import { FinalSubmissionCheckModal } from '../modals/FinalSubmissionCheckModal';

// Reporting Period Statuses as mandated by ESG Governance
export type ReportingPeriodStatus =
  | 'Not Started'
  | 'Draft'
  | 'In Progress'
  | 'Ready for Submission'
  | 'Submitted'
  | 'Under Review'
  | 'Changes Requested'
  | 'Approved'
  | 'Locked';

// Indicator Metric Type definition
export interface ESGIndicatorRow {
  id: string; // Unique indicator code (e.g. P1-IND-01)
  name: string; // Indicator title
  principleId: number; // 1 to 9
  principleTitle: string; // e.g. Ethics & Transparency
  category: 'Environmental' | 'Social' | 'Governance' | 'Economic' | 'Stakeholder';
  description: string;
  unit: string;
  valueType: 'numeric' | 'percentage' | 'currency' | 'text' | 'boolean';
  required: boolean;
  isBrsrCore?: boolean;
  requiredEvidenceName: string;
  previousMonthValue: string | number;
  currentValue: string | number;
  remarks: string;
  evidenceFiles: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    url?: string;
  }[];
  validationStatus: 'valid' | 'missing' | 'anomaly' | 'not_applicable';
  validationMessage?: string;
  lastUpdated: string;
}

// 9 Standard ESG Principles with master indicators & field definitions
const ESG_MASTER_PRINCIPLES: {
  id: number;
  title: string;
  shortCode: string;
  category: ESGIndicatorRow['category'];
  description: string;
  indicators: Omit<ESGIndicatorRow, 'currentValue' | 'remarks' | 'evidenceFiles' | 'validationStatus' | 'lastUpdated'>[];
}[] = [
  {
    id: 1,
    title: 'Ethics & Transparency',
    shortCode: 'P1',
    category: 'Governance',
    description: 'Businesses should conduct and govern themselves with integrity in a manner that is ethical, transparent and accountable.',
    indicators: [
      {
        id: 'P1-IND-01',
        name: 'Anti-corruption and anti-bribery incidents reported',
        principleId: 1,
        principleTitle: 'Ethics & Transparency',
        category: 'Governance',
        description: 'Total number of confirmed incidents of corruption or bribery during the reporting month.',
        unit: 'Incidents',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Vigilance & Ethics Incident Register',
        previousMonthValue: 0,
      },
      {
        id: 'P1-IND-02',
        name: 'Whistleblower complaints received and resolved',
        principleId: 1,
        principleTitle: 'Ethics & Transparency',
        category: 'Governance',
        description: 'Complaints logged through independent whistleblowing channels and addressed by ethics committee.',
        unit: 'Complaints',
        valueType: 'numeric',
        required: true,
        requiredEvidenceName: 'Ombudsperson Monthly Log Sheet',
        previousMonthValue: 1,
      },
      {
        id: 'P1-IND-03',
        name: 'Regulatory penalties, fines and show-cause notices',
        principleId: 1,
        principleTitle: 'Ethics & Transparency',
        category: 'Governance',
        description: 'Monetary fines or non-monetary sanctions imposed by statutory/regulatory authorities.',
        unit: '₹ Lakhs',
        valueType: 'currency',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Legal & Statutory Compliance Certificate',
        previousMonthValue: 0,
      },
      {
        id: 'P1-IND-04',
        name: 'Ethics and compliance training coverage (%)',
        principleId: 1,
        principleTitle: 'Ethics & Transparency',
        category: 'Governance',
        description: 'Percentage of site personnel and subcontractors who completed anti-corruption and conduct training.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        requiredEvidenceName: 'HR Training Attendance Slips',
        previousMonthValue: 92.5,
      },
      {
        id: 'P1-IND-05',
        name: 'Code of conduct and ethics policy acknowledgement',
        principleId: 1,
        principleTitle: 'Ethics & Transparency',
        category: 'Governance',
        description: 'Confirmation that all key managers and site supervisors have affirmed the MEIL code of conduct.',
        unit: 'Yes/No',
        valueType: 'boolean',
        required: true,
        requiredEvidenceName: 'Annual Policy Affirmation Dossier',
        previousMonthValue: 'Yes',
      },
    ],
  },
  {
    id: 2,
    title: 'Sustainable Products & Services',
    shortCode: 'P2',
    category: 'Environmental',
    description: 'Businesses should provide goods and services in a manner that is sustainable and safe throughout their life cycle.',
    indicators: [
      {
        id: 'P2-IND-01',
        name: 'Product / Service Operational Line Name',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Primary infrastructure or engineering product stream under monitoring for this site.',
        unit: 'Text',
        valueType: 'text',
        required: true,
        requiredEvidenceName: 'Project Milestone Bill of Quantities',
        previousMonthValue: 'Pre-Cast Concrete Pavements & Structural Girders',
      },
      {
        id: 'P2-IND-02',
        name: 'Total Monthly Infrastructure Production',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Total volume of concrete poured, steel erected or road kilometers surfaced.',
        unit: 'Metric Tonnes',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Monthly Production Register / Weighbridge Log',
        previousMonthValue: 42500,
      },
      {
        id: 'P2-IND-03',
        name: 'Sustainable & Recycled Raw Materials Used (%)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Percentage of input raw materials that are recycled, reclaimed or industrial by-products (e.g. fly-ash, GGBS, slag).',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Mix Design Test Report & Fly-ash Receipts',
        previousMonthValue: 28.4,
      },
      {
        id: 'P2-IND-04',
        name: 'Water Consumption for Product Processing (KL)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Total water utilized across batching plants, dust suppression, and curing.',
        unit: 'KL',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Water Meter Calibration & Monthly Log',
        previousMonthValue: 1850,
      },
      {
        id: 'P2-IND-05',
        name: 'Carbon Emissions Scope Class',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'GHG protocol scope classification applied to product machinery operations.',
        unit: 'Scope',
        valueType: 'text',
        required: true,
        requiredEvidenceName: 'GHG Inventory Protocol Scope Document',
        previousMonthValue: 'Scope 1 Direct & Scope 2 Purchased',
      },
      {
        id: 'P2-IND-06',
        name: 'Carbon Emissions Generated (tCO₂e)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Calculated greenhouse gas emissions from fuel combustion and electricity usage.',
        unit: 'tCO₂e',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Emission Factor Calculation Sheet & Bills',
        previousMonthValue: 142.8,
      },
      {
        id: 'P2-IND-07',
        name: 'Specific Energy Consumption (kWh)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Total electricity consumption consumed at project site facilities and equipment.',
        unit: 'kWh',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Utility DISCOM Power Invoices',
        previousMonthValue: 58200,
      },
      {
        id: 'P2-IND-08',
        name: 'Total Solid Waste Generated (tonnes)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Construction and demolition debris, packaging, scrap metal, and excavation waste.',
        unit: 'tonnes',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Waste Transfer Manifest & Disposal Chits',
        previousMonthValue: 64.2,
      },
      {
        id: 'P2-IND-09',
        name: 'Sustainable & Local Sourcing Share (%)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Economic',
        description: 'Percentage of procurement spending awarded to local district suppliers and certified green vendors.',
        unit: '%',
        valueType: 'percentage',
        required: false,
        requiredEvidenceName: 'SAP / ERP Vendor Ledger Analysis',
        previousMonthValue: 56.0,
      },
      {
        id: 'P2-IND-10',
        name: 'Product Recycling & Waste Reclamation (tonnes)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Volume of excavated soil, milled asphalt or waste concrete re-utilized on site.',
        unit: 'tonnes',
        valueType: 'numeric',
        required: false,
        requiredEvidenceName: 'Reclamation Verification Slips',
        previousMonthValue: 38.5,
      },
      {
        id: 'P2-IND-11',
        name: 'Environmental Capex / Investment (₹ Lakhs)',
        principleId: 2,
        principleTitle: 'Sustainable Products & Services',
        category: 'Environmental',
        description: 'Dedicated expenditures on settling ponds, mist cannons, green belt plantation, and noise barriers.',
        unit: '₹ Lakhs',
        valueType: 'currency',
        required: false,
        requiredEvidenceName: 'Vendor Capex Purchase Invoices',
        previousMonthValue: 8.5,
      },
    ],
  },
  {
    id: 3,
    title: 'Employee Well‑being',
    shortCode: 'P3',
    category: 'Social',
    description: 'Businesses should respect and promote the well-being of all employees, including those in their value chains.',
    indicators: [
      {
        id: 'P3-IND-01',
        name: 'Total workforce headcount (Permanent & Contractual)',
        principleId: 3,
        principleTitle: 'Employee Well‑being',
        category: 'Social',
        description: 'Total number of active staff, engineers, operators, and daily contractual workers at site.',
        unit: 'Persons',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Biometric / Daily Muster Roll Register',
        previousMonthValue: 840,
      },
      {
        id: 'P3-IND-02',
        name: 'Female workforce participation ratio (%)',
        principleId: 3,
        principleTitle: 'Employee Well‑being',
        category: 'Social',
        description: 'Percentage of female employees in engineering, supervisory, and workforce roles.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Gender Diversity HR Census Report',
        previousMonthValue: 14.8,
      },
      {
        id: 'P3-IND-03',
        name: 'Health insurance and social security coverage (%)',
        principleId: 3,
        principleTitle: 'Employee Well‑being',
        category: 'Social',
        description: 'Coverage rate of PF, ESIC, and group term life insurance for eligible site personnel.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'ESIC / PF Monthly ECR Deposit Receipt',
        previousMonthValue: 100.0,
      },
      {
        id: 'P3-IND-04',
        name: 'Workplace Lost Time Injuries (LTI) & Fatalities',
        principleId: 3,
        principleTitle: 'Employee Well‑being',
        category: 'Social',
        description: 'Number of reportable lost-time injuries resulting in >48 hours absence from duty.',
        unit: 'Incidents',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Monthly Safety EHS Investigation Dossier',
        previousMonthValue: 0,
      },
      {
        id: 'P3-IND-05',
        name: 'Safety & technical training hours per worker',
        principleId: 3,
        principleTitle: 'Employee Well‑being',
        category: 'Social',
        description: 'Average monthly training hours completed across tool-box talks and certified HSE modules.',
        unit: 'Hours',
        valueType: 'numeric',
        required: true,
        requiredEvidenceName: 'Toolbox Talk Attendance Logs',
        previousMonthValue: 4.2,
      },
    ],
  },
  {
    id: 4,
    title: 'Stakeholder Engagement',
    shortCode: 'P4',
    category: 'Stakeholder',
    description: 'Businesses should respect the interests of and be responsive to all stakeholders.',
    indicators: [
      {
        id: 'P4-IND-01',
        name: 'Key stakeholder consultations conducted',
        principleId: 4,
        principleTitle: 'Stakeholder Engagement',
        category: 'Stakeholder',
        description: 'Number of structured engagement sessions held with village panchayats, farmers, and district collectors.',
        unit: 'Sessions',
        valueType: 'numeric',
        required: true,
        requiredEvidenceName: 'Panchayat Consultation Minutes of Meeting',
        previousMonthValue: 4,
      },
      {
        id: 'P4-IND-02',
        name: 'Community grievances received',
        principleId: 4,
        principleTitle: 'Stakeholder Engagement',
        category: 'Stakeholder',
        description: 'Total public complaints regarding access roads, dust, noise, or water diversions logged.',
        unit: 'Complaints',
        valueType: 'numeric',
        required: true,
        requiredEvidenceName: 'Community Grievance Redressal Register',
        previousMonthValue: 3,
      },
      {
        id: 'P4-IND-03',
        name: 'Grievance resolution closure rate (%)',
        principleId: 4,
        principleTitle: 'Stakeholder Engagement',
        category: 'Stakeholder',
        description: 'Percentage of logged community grievances resolved within statutory SLA timeframes.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Grievance Closure Sign-off Records',
        previousMonthValue: 100.0,
      },
    ],
  },
  {
    id: 5,
    title: 'Human Rights',
    shortCode: 'P5',
    category: 'Social',
    description: 'Businesses should respect and promote human rights across operations and supplier chains.',
    indicators: [
      {
        id: 'P5-IND-01',
        name: 'Human rights and anti-harassment training coverage (%)',
        principleId: 5,
        principleTitle: 'Human Rights',
        category: 'Social',
        description: 'Workforce completion of POSH, equal opportunity, and fair wage principles.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'POSH Committee Training Records',
        previousMonthValue: 88.0,
      },
      {
        id: 'P5-IND-02',
        name: 'Child labour or forced labour incidents detected',
        principleId: 5,
        principleTitle: 'Human Rights',
        category: 'Social',
        description: 'Zero tolerance verification audits across all labor camps and subcontractor contractors.',
        unit: 'Incidents',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Monthly Labor Camp Age-Verification Audit',
        previousMonthValue: 0,
      },
      {
        id: 'P5-IND-03',
        name: 'Minimum statutory wage compliance rate (%)',
        principleId: 5,
        principleTitle: 'Human Rights',
        category: 'Social',
        description: 'Confirmation that all workers received at or above State minimum wages via bank transfer.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Bank Wage Disbursal NEFT Certificates',
        previousMonthValue: 100.0,
      },
    ],
  },
  {
    id: 6,
    title: 'Environment & Climate Care',
    shortCode: 'P6',
    category: 'Environmental',
    description: 'Businesses should respect, protect and make efforts to restore the environment.',
    indicators: [
      {
        id: 'P6-IND-01',
        name: 'High-Speed Diesel (HSD) Consumption (Litres)',
        principleId: 6,
        principleTitle: 'Environment & Climate Care',
        category: 'Environmental',
        description: 'Fuel consumed for stationary diesel generators, heavy earthmovers, and haul trucks.',
        unit: 'Litres',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'IOCL / HPCL Monthly Tax Invoices',
        previousMonthValue: 48500,
      },
      {
        id: 'P6-IND-02',
        name: 'Grid Electricity Consumption (kWh)',
        principleId: 6,
        principleTitle: 'Environment & Climate Care',
        category: 'Environmental',
        description: 'Metered power drawn from state utility high-tension substations.',
        unit: 'kWh',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'State DISCOM HT Tariff Bill',
        previousMonthValue: 52500,
      },
      {
        id: 'P6-IND-03',
        name: 'Renewable Solar Power Consumed on Site (kWh)',
        principleId: 6,
        principleTitle: 'Environment & Climate Care',
        category: 'Environmental',
        description: 'Rooftop or captive containerized solar generation utilized at camp office and workshops.',
        unit: 'kWh',
        valueType: 'numeric',
        required: false,
        requiredEvidenceName: 'Solar Inverter SCADA Generation Logs',
        previousMonthValue: 14200,
      },
      {
        id: 'P6-IND-04',
        name: 'Groundwater Withdrawal under CGWA NOC (KL)',
        principleId: 6,
        principleTitle: 'Environment & Climate Care',
        category: 'Environmental',
        description: 'Volume pumped from borewells with calibrated electromagnetic flow meters.',
        unit: 'KL',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Borewell Flowmeter Calibration & Daily Logs',
        previousMonthValue: 1200,
      },
      {
        id: 'P6-IND-05',
        name: 'Treated Water Recycled & Reused (KL)',
        principleId: 6,
        principleTitle: 'Environment & Climate Care',
        category: 'Environmental',
        description: 'Water recovered from sewage treatment plants (STP) and sedimentation basins reused for curing.',
        unit: 'KL',
        valueType: 'numeric',
        required: false,
        isBrsrCore: true,
        requiredEvidenceName: 'STP Operating Logbook & NABL Test Report',
        previousMonthValue: 480,
      },
      {
        id: 'P6-IND-06',
        name: 'Hazardous Waste Handed to Authorized Recyclers (MT)',
        principleId: 6,
        principleTitle: 'Environment & Climate Care',
        category: 'Environmental',
        description: 'Used lubricating oil, contaminated filters, chemical drums disposed under CPCB Form 10.',
        unit: 'MT',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Form 10 Manifest & SPCB Recycler Passbook',
        previousMonthValue: 2.4,
      },
      {
        id: 'P6-IND-07',
        name: 'Tree Saplings Planted along ROW / Camps',
        principleId: 6,
        principleTitle: 'Environment & Climate Care',
        category: 'Environmental',
        description: 'Compensatory afforestation and roadside landscaping green belt saplings planted.',
        unit: 'Saplings',
        valueType: 'numeric',
        required: false,
        requiredEvidenceName: 'Nursery Procurement Slips & Geo-tagged Photos',
        previousMonthValue: 450,
      },
    ],
  },
  {
    id: 7,
    title: 'Responsible Public Policy',
    shortCode: 'P7',
    category: 'Governance',
    description: 'Businesses, when engaging in influencing public and regulatory policy, should do so in a manner that is responsible and transparent.',
    indicators: [
      {
        id: 'P7-IND-01',
        name: 'Industry association memberships active',
        principleId: 7,
        principleTitle: 'Responsible Public Policy',
        category: 'Governance',
        description: 'Affiliation with NHAI Contractor Association, CII Infra Committee, or National Highway Developers Guild.',
        unit: 'Count',
        valueType: 'numeric',
        required: false,
        requiredEvidenceName: 'Membership Fee Receipt & Certificate',
        previousMonthValue: 2,
      },
      {
        id: 'P7-IND-02',
        name: 'Direct political contributions made',
        principleId: 7,
        principleTitle: 'Responsible Public Policy',
        category: 'Governance',
        description: 'Zero direct contributions policy adherence at project entity level.',
        unit: '₹',
        valueType: 'currency',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Statutory Finance Declaration',
        previousMonthValue: 0,
      },
    ],
  },
  {
    id: 8,
    title: 'Inclusive Growth & CSR',
    shortCode: 'P8',
    category: 'Social',
    description: 'Businesses should support inclusive growth and equitable development.',
    indicators: [
      {
        id: 'P8-IND-01',
        name: 'Local Community CSR Expenditure Disbursed (₹ Lakhs)',
        principleId: 8,
        principleTitle: 'Inclusive Growth & CSR',
        category: 'Social',
        description: 'Spending on local village schools, mobile medical units, and potable drinking water stations.',
        unit: '₹ Lakhs',
        valueType: 'currency',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'CSR Vendor Invoice & Gram Panchayat Handover',
        previousMonthValue: 14.2,
      },
      {
        id: 'P8-IND-02',
        name: 'Local District Beneficiaries Reached',
        principleId: 8,
        principleTitle: 'Inclusive Growth & CSR',
        category: 'Social',
        description: 'Villagers and students who accessed medical camps and educational infrastructure aid.',
        unit: 'Persons',
        valueType: 'numeric',
        required: false,
        requiredEvidenceName: 'Health Camp Beneficiary Register',
        previousMonthValue: 1250,
      },
      {
        id: 'P8-IND-03',
        name: 'Local MSME Procurement Share (%)',
        principleId: 8,
        principleTitle: 'Inclusive Growth & CSR',
        category: 'Economic',
        description: 'Portion of consumables and hiring procured from registered Udyam MSME vendors in the project district.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Udyam Certificate Analysis & Purchase Orders',
        previousMonthValue: 34.5,
      },
    ],
  },
  {
    id: 9,
    title: 'Customer Responsibility & Quality',
    shortCode: 'P9',
    category: 'Governance',
    description: 'Businesses should engage with and provide value to their consumers and statutory project authorities in a responsible manner.',
    indicators: [
      {
        id: 'P9-IND-01',
        name: 'Independent Quality Inspection Non-Conformances (NCRs)',
        principleId: 9,
        principleTitle: 'Customer Responsibility & Quality',
        category: 'Governance',
        description: 'NCRs or technical observations issued by the Independent Engineer (IE / Authority Engineer).',
        unit: 'NCRs',
        valueType: 'numeric',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'Independent Engineer Monthly Quality Audit Report',
        previousMonthValue: 1,
      },
      {
        id: 'P9-IND-02',
        name: 'Quality NCR Resolution & Rectification Rate (%)',
        principleId: 9,
        principleTitle: 'Customer Responsibility & Quality',
        category: 'Governance',
        description: 'Rate of closed quality inspection reports with accepted lab test cubes.',
        unit: '%',
        valueType: 'percentage',
        required: true,
        isBrsrCore: true,
        requiredEvidenceName: 'IE Compliance Acceptance Letters',
        previousMonthValue: 100.0,
      },
      {
        id: 'P9-IND-03',
        name: 'Customer / Authority Satisfaction Score',
        principleId: 9,
        principleTitle: 'Customer Responsibility & Quality',
        category: 'Governance',
        description: 'Overall monthly contractor performance rating given by client/authority engineers (out of 100).',
        unit: 'Score / 100',
        valueType: 'numeric',
        required: false,
        requiredEvidenceName: 'Client Monthly Milestone Appraisal Letter',
        previousMonthValue: 94.0,
      },
    ],
  },
];

// Indian Financial Year Reporting Months (April to March)
const INDIAN_FINANCIAL_MONTHS = [
  { value: '04', name: 'April', quarter: 'Q1' },
  { value: '05', name: 'May', quarter: 'Q1' },
  { value: '06', name: 'June', quarter: 'Q1' },
  { value: '07', name: 'July', quarter: 'Q2' },
  { value: '08', name: 'August', quarter: 'Q2' },
  { value: '09', name: 'September', quarter: 'Q2' },
  { value: '10', name: 'October', quarter: 'Q3' },
  { value: '11', name: 'November', quarter: 'Q3' },
  { value: '12', name: 'December', quarter: 'Q3' },
  { value: '01', name: 'January', quarter: 'Q4' },
  { value: '02', name: 'February', quarter: 'Q4' },
  { value: '03', name: 'March', quarter: 'Q4' },
];

export const AssignmentPage: React.FC = () => {
  const { addToast } = useOutletContext<{
    addToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  }>();

  const {
    organizations,
    reportingCycles,
    submitData,
    submitMonthlyDossier,
    logSystemAction,
  } = useNexusData();

  const {
    activeScope,
    setProjectScope,
  } = useContributorData();

  // =========================================================================
  // STEP 1: REPORTING CONTEXT STATE (Strict Hierarchy)
  // Context: Project ID + Project Code + Financial Year + Site ID + Reporting Month + ESG Principle
  // =========================================================================
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeScope.projectId || 'proj_exp');
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>('FY 2026-27');
  const [selectedSiteId, setSelectedSiteId] = useState<string>('site_raipur_1');
  const [selectedMonth, setSelectedMonth] = useState<string>('10'); // Default to October
  const [selectedPrincipleId, setSelectedPrincipleId] = useState<number>(2); // Default to P2 Sustainable Products

  // Filter and Table Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'evidence_missing' | 'anomalies'>('all');
  const [sortField, setSortField] = useState<'id' | 'name' | 'variance' | 'status'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals & Feedback
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [activeEvidenceIndicator, setActiveEvidenceIndicator] = useState<ESGIndicatorRow | null>(null);
  const [isSubmitCheckModalOpen, setIsSubmitCheckModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>('Initial state loaded');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Derive Authorized Projects from actual database records in NexusDataContext
  const dbProjects = useMemo(() => {
    const list = organizations.filter((org) => org.type === 'Project' || org.id.startsWith('proj_'));
    if (list.length > 0) return list;
    return [
      { id: 'proj_exp', name: 'Expressway Project Phase-II (Raipur)', code: 'PRJ-EXP-02', location: 'Raipur, Chhattisgarh' },
      { id: 'proj_klis', name: 'Kaleshwaram Lift Irrigation Site 4', code: 'PRJ-KLIS-04', location: 'Telangana' },
      { id: 'proj_solar_park', name: 'Pavagada 500MW Solar Park', code: 'PRJ-PAV-SOLAR', location: 'Karnataka' },
      { id: 'proj_zojila', name: 'Zojila Tunnel Strategic Transit Pass', code: 'PRJ-ZOJILA-01', location: 'Sonamarg, J&K' },
    ];
  }, [organizations]);

  // Selected Project object
  const currentProject = useMemo(() => {
    return (
      dbProjects.find((p) => p.id === selectedProjectId) ||
      dbProjects[0] || { id: 'proj_exp', name: 'Expressway Project Phase-II (Raipur)', code: 'PRJ-EXP-02' }
    );
  }, [dbProjects, selectedProjectId]);

  // Available Sites dynamically associated with the selected Project
  const projectSites = useMemo(() => {
    const childSites = organizations.filter(
      (org) => (org.type === 'Site' || org.id.startsWith('site_')) && org.parentId === selectedProjectId
    );

    if (childSites.length > 0) return childSites;

    // Fallback realistic site masters per project
    if (selectedProjectId === 'proj_exp') {
      return [
        { id: 'site_raipur_1', name: 'Raipur Batching & Hot-Mix Plant (Site A)', code: 'SITE-RPR-A' },
        { id: 'site_raipur_2', name: 'Raipur Km 42 - Km 88 Main Alignment', code: 'SITE-RPR-B' },
      ];
    }
    if (selectedProjectId === 'proj_klis') {
      return [
        { id: 'site_klis_forebay', name: 'Medigadda Pump House & Forebay', code: 'SITE-KLIS-FBY' },
        { id: 'site_klis_canal', name: 'Annaram Gravity Canal Section', code: 'SITE-KLIS-CNL' },
      ];
    }
    if (selectedProjectId === 'proj_solar_park') {
      return [
        { id: 'site_solar_sub', name: 'Pavagada Inverter Block 12 & Substation', code: 'SITE-PVG-SUB' },
        { id: 'site_solar_array', name: 'Array Sector-C High-Voltage Grid', code: 'SITE-PVG-ARY' },
      ];
    }
    return [
      { id: 'site_zojila_west', name: 'West Portal (Baltal Yard)', code: 'SITE-ZOJ-W' },
      { id: 'site_zojila_east', name: 'East Portal (Minamarg Section)', code: 'SITE-ZOJ-E' },
    ];
  }, [organizations, selectedProjectId]);

  // Valid Financial Years from system reporting cycles
  const availableFinancialYears = useMemo(() => {
    const cycles = reportingCycles.map((c) => c.financialYear || c.name);
    const unique = Array.from(new Set(cycles)).filter(Boolean);
    if (unique.length > 0) return unique.map((fy) => (fy.startsWith('FY') ? fy : `FY ${fy}`));
    return ['FY 2026-27', 'FY 2025-26', 'FY 2024-25'];
  }, [reportingCycles]);

  // Dependent auto-reset: when parent project changes, auto-select first valid site
  const handleProjectChange = (newProjId: string) => {
    if (newProjId === selectedProjectId) return;
    setSelectedProjectId(newProjId);
    // Find child sites for the new project
    const newSites = organizations.filter(
      (org) => (org.type === 'Site' || org.id.startsWith('site_')) && org.parentId === newProjId
    );
    if (newSites.length > 0) {
      setSelectedSiteId(newSites[0].id);
    } else if (newProjId === 'proj_klis') {
      setSelectedSiteId('site_klis_forebay');
    } else if (newProjId === 'proj_solar_park') {
      setSelectedSiteId('site_solar_sub');
    } else if (newProjId === 'proj_zojila') {
      setSelectedSiteId('site_zojila_west');
    } else {
      setSelectedSiteId('site_raipur_1');
    }

    // Sync active scope into global Contributor context
    const projMatch = dbProjects.find((p) => p.id === newProjId);
    if (projMatch) {
      setProjectScope({
        projectId: projMatch.id,
        projectName: projMatch.name,
        projectCode: projMatch.code || 'PRJ-NEXUS',
      });
    }
  };

  // Validation flag for Reporting Context Selection Step
  const isContextValid = Boolean(
    selectedProjectId &&
    selectedFinancialYear &&
    selectedSiteId &&
    selectedMonth &&
    selectedPrincipleId
  );

  // Selected Site label
  const currentSiteName = useMemo(() => {
    const s = projectSites.find((site) => site.id === selectedSiteId);
    return s?.name || selectedSiteId;
  }, [projectSites, selectedSiteId]);

  // Selected Month label
  const currentMonthObj = useMemo(() => {
    return INDIAN_FINANCIAL_MONTHS.find((m) => m.value === selectedMonth) || INDIAN_FINANCIAL_MONTHS[6];
  }, [selectedMonth]);

  // =========================================================================
  // STEP 2 & 4: NORMALIZED CONTEXT STORAGE KEY
  // Storage key: Project ID + Site ID + Financial Year + Reporting Month + Principle ID
  // =========================================================================
  const reportingContextStorageKey = useMemo(() => {
    return `meil_esg_ctx_${selectedProjectId}_${selectedSiteId}_${selectedFinancialYear.replace(/\s+/g, '_')}_M${selectedMonth}`;
  }, [selectedProjectId, selectedSiteId, selectedFinancialYear, selectedMonth]);

  // Local table rows state
  const [tableRows, setTableRows] = useState<Record<string, ESGIndicatorRow>>({});
  const [periodWorkflowStatus, setPeriodWorkflowStatus] = useState<ReportingPeriodStatus>('Draft');

  // Initialize or load table rows when reporting context changes
  useEffect(() => {
    if (!isContextValid) return;

    try {
      const storedData = localStorage.getItem(reportingContextStorageKey);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (parsed && parsed.rows) {
          setTableRows(parsed.rows);
          setPeriodWorkflowStatus(parsed.status || 'Draft');
          setLastSavedTimestamp(parsed.savedAt || 'Saved in local database');
          setHasUnsavedChanges(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading stored reporting context:', e);
    }

    // Generate pristine initial rows for all 9 principles if no record exists yet
    const initialMap: Record<string, ESGIndicatorRow> = {};
    ESG_MASTER_PRINCIPLES.forEach((p) => {
      p.indicators.forEach((ind) => {
        // Pre-fill realistic baseline current month values for prompt demo
        let initVal: string | number = '';
        if (typeof ind.previousMonthValue === 'number') {
          // Slight realistic operational variance (~ +1.5% to +4%)
          initVal = ind.previousMonthValue === 0
            ? 0
            : Number((ind.previousMonthValue * (1 + 0.025)).toFixed(2));
        } else if (ind.previousMonthValue) {
          initVal = ind.previousMonthValue;
        }

        initialMap[ind.id] = {
          ...ind,
          currentValue: initVal,
          remarks: '',
          evidenceFiles: [],
          validationStatus: ind.required && initVal === '' ? 'missing' : 'valid',
          lastUpdated: 'System Default',
        };
      });
    });

    setTableRows(initialMap);
    setPeriodWorkflowStatus('In Progress');
    setLastSavedTimestamp('Template loaded from master configuration');
    setHasUnsavedChanges(false);
  }, [reportingContextStorageKey, isContextValid]);

  // Active Principle configuration
  const activePrinciple = useMemo(() => {
    return (
      ESG_MASTER_PRINCIPLES.find((p) => p.id === selectedPrincipleId) ||
      ESG_MASTER_PRINCIPLES[1]
    );
  }, [selectedPrincipleId]);

  // Indicators filtered to current active principle
  const currentPrincipleIndicators = useMemo(() => {
    const list = activePrinciple.indicators.map((masterInd) => {
      return (
        tableRows[masterInd.id] || {
          ...masterInd,
          currentValue: masterInd.previousMonthValue ?? '',
          remarks: '',
          evidenceFiles: [],
          validationStatus: 'valid' as const,
          lastUpdated: 'Initialized',
        }
      );
    });

    // Apply text search
    let filtered = list;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (row) =>
          row.id.toLowerCase().includes(q) ||
          row.name.toLowerCase().includes(q) ||
          row.description.toLowerCase().includes(q)
      );
    }

    // Apply quick filters
    if (filterMode === 'incomplete') {
      filtered = filtered.filter((r) => r.currentValue === '' || r.validationStatus === 'missing');
    } else if (filterMode === 'evidence_missing') {
      filtered = filtered.filter((r) => r.required && r.evidenceFiles.length === 0);
    } else if (filterMode === 'anomalies') {
      filtered = filtered.filter((r) => r.validationStatus === 'anomaly');
    }

    // Sorting
    return filtered.sort((a, b) => {
      if (sortField === 'id') {
        return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      }
      if (sortField === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [activePrinciple, tableRows, searchQuery, filterMode, sortField, sortOrder]);

  // =========================================================================
  // STATISTICS & SUMMARY METRICS
  // =========================================================================
  const stats = useMemo(() => {
    const allIndicators = Object.values(tableRows);
    const total = allIndicators.length || 1;
    const completed = allIndicators.filter(
      (row) => row.currentValue !== '' && row.currentValue !== undefined && row.currentValue !== null
    ).length;
    const missing = allIndicators.filter((row) => row.required && (row.currentValue === '' || row.currentValue === undefined)).length;
    const withEvidence = allIndicators.filter((row) => row.evidenceFiles.length > 0).length;
    const anomalies = allIndicators.filter((row) => row.validationStatus === 'anomaly').length;

    return {
      total,
      completed,
      missing,
      completionRate: Math.round((completed / total) * 100),
      withEvidence,
      evidenceRate: Math.round((withEvidence / total) * 100),
      anomalies,
    };
  }, [tableRows]);

  // Inline value change handler with immediate numeric & bounds validation
  const handleValueChange = (indicatorId: string, val: string) => {
    setTableRows((prev) => {
      const existing = prev[indicatorId];
      if (!existing) return prev;

      let validStatus: ESGIndicatorRow['validationStatus'] = 'valid';
      let validMsg = '';

      // Check required
      if (existing.required && val.trim() === '') {
        validStatus = 'missing';
        validMsg = 'This ESG disclosure is mandatory for statutory compliance.';
      }

      // Check numeric anomaly (> 15% change from previous month)
      const numVal = parseFloat(val);
      const prevNum = typeof existing.previousMonthValue === 'number' ? existing.previousMonthValue : parseFloat(String(existing.previousMonthValue));
      if (!isNaN(numVal) && !isNaN(prevNum) && prevNum > 0) {
        const pctChange = Math.abs((numVal - prevNum) / prevNum) * 100;
        if (pctChange > 15) {
          validStatus = 'anomaly';
          validMsg = `High variance detected: ${pctChange.toFixed(1)}% change compared to previous month (${prevNum} ${existing.unit}). Operational explanation required.`;
        }
      }

      const updatedRow: ESGIndicatorRow = {
        ...existing,
        currentValue: val,
        validationStatus: validStatus,
        validationMessage: validMsg,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      return {
        ...prev,
        [indicatorId]: updatedRow,
      };
    });

    setHasUnsavedChanges(true);
  };

  // Inline remarks change
  const handleRemarksChange = (indicatorId: string, remarks: string) => {
    setTableRows((prev) => {
      const existing = prev[indicatorId];
      if (!existing) return prev;
      return {
        ...prev,
        [indicatorId]: {
          ...existing,
          remarks,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    });
    setHasUnsavedChanges(true);
  };

  // =========================================================================
  // STEP 4: SAVE DRAFT (Real persistence in Local Database)
  // =========================================================================
  const handleSaveDraft = () => {
    try {
      const payload = {
        contextKey: reportingContextStorageKey,
        projectId: selectedProjectId,
        siteId: selectedSiteId,
        financialYear: selectedFinancialYear,
        month: selectedMonth,
        status: periodWorkflowStatus === 'Approved' ? 'Approved' : 'Draft',
        rows: tableRows,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        updatedBy: 'Suresh Kumar (Site Contributor)',
      };

      localStorage.setItem(reportingContextStorageKey, JSON.stringify(payload));
      setLastSavedTimestamp(payload.savedAt);
      setHasUnsavedChanges(false);
      setPeriodWorkflowStatus('Draft');

      // Audit log entry
      logSystemAction({
        action: 'UPDATE',
        module: 'Workflow',
        recordId: reportingContextStorageKey,
        details: `Saved ESG disclosure draft for ${currentProject.name} (${currentSiteName}) for ${currentMonthObj.name} ${selectedFinancialYear}`,
        actorName: 'Suresh Kumar',
        actorRole: 'contributor',
        actorEmail: 'contributor@demo.com',
      });

      addToast(`Draft persisted successfully for ${currentMonthObj.name} (${selectedFinancialYear}) at ${payload.savedAt}`, 'success');
    } catch (e) {
      console.error('Save draft error:', e);
      addToast('Failed to persist draft. Check database capacity.', 'error');
    }
  };

  // =========================================================================
  // STEP 5: EVIDENCE UPLOAD CONFIRMATION HANDLER
  // =========================================================================
  const handleEvidenceUploadSuccess = (evidenceMeta: any, extractedVal?: number) => {
    if (!activeEvidenceIndicator) return;

    const indId = activeEvidenceIndicator.id;
    const newEvidenceFile = {
      id: `ev_${Date.now()}`,
      name: evidenceMeta.documentName,
      type: evidenceMeta.fileFormat,
      size: evidenceMeta.fileSizeBytes,
      uploadedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      url: `/evidence/${evidenceMeta.documentName}`,
    };

    setTableRows((prev) => {
      const existing = prev[indId];
      if (!existing) return prev;
      return {
        ...prev,
        [indId]: {
          ...existing,
          currentValue: extractedVal !== undefined ? extractedVal : existing.currentValue,
          evidenceFiles: [...existing.evidenceFiles, newEvidenceFile],
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    });

    setIsEvidenceModalOpen(false);
    setActiveEvidenceIndicator(null);
    setHasUnsavedChanges(true);

    addToast(`Evidence "${evidenceMeta.documentName}" successfully attached to ${indId}`, 'success');
  };

  // =========================================================================
  // STEP 6: MONTH-END SUBMISSION WORKFLOW
  // =========================================================================
  const handlePreCheckSubmit = () => {
    if (stats.missing > 0) {
      addToast(`Cannot submit: ${stats.missing} mandatory ESG indicator(s) are missing values.`, 'warning');
      setFilterMode('incomplete');
      return;
    }
    setIsSubmitCheckModalOpen(true);
  };

  const handleConfirmFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      // Persist submitted state
      const payload = {
        contextKey: reportingContextStorageKey,
        projectId: selectedProjectId,
        siteId: selectedSiteId,
        financialYear: selectedFinancialYear,
        month: selectedMonth,
        status: 'Submitted' as const,
        rows: tableRows,
        savedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        submittedBy: 'Suresh Kumar (Site Contributor)',
      };

      localStorage.setItem(reportingContextStorageKey, JSON.stringify(payload));
      setPeriodWorkflowStatus('Submitted');
      setHasUnsavedChanges(false);
      setIsSubmitCheckModalOpen(false);
      setIsSubmitting(false);

      // Submit full 9-principles dossier into backend Reviewer workflow
      submitMonthlyDossier({
        contextKey: reportingContextStorageKey,
        projectId: selectedProjectId,
        projectName: currentProject.name,
        projectCode: currentProject.code,
        siteId: selectedSiteId,
        siteName: currentSiteName,
        financialYear: selectedFinancialYear,
        month: selectedMonth,
        monthName: currentMonthObj.name,
        submittingUser: 'Suresh Kumar (Site Contributor)',
        submittedAt: new Date().toISOString(),
        totalRows: stats.total,
        rows: Object.fromEntries(
          Object.entries(tableRows).map(([k, r]) => [
            k,
            {
              id: r.id,
              name: r.name,
              principleId: r.principleId,
              principleTitle: r.principleTitle,
              category: r.category,
              description: r.description,
              unit: r.unit,
              valueType: r.valueType,
              required: r.required,
              isBrsrCore: r.isBrsrCore,
              previousMonthValue: r.previousMonthValue,
              currentValue: r.currentValue,
              remarks: r.remarks,
              evidenceFiles: r.evidenceFiles,
              reviewStatus: 'SUBMITTED' as const,
              version: 1,
              lastUpdated: r.lastUpdated,
            },
          ])
        ),
      });

      // Submit summary into general pipeline
      submitData({
        assignmentId: selectedProjectId,
        value: `${stats.completed}/${stats.total} Indicators Validated`,
        unit: 'Monthly Dossier',
        comments: `Submitted monthly data for ${currentProject.name} (${currentSiteName}) - ${currentMonthObj.name} ${selectedFinancialYear}`,
        submittedAt: new Date().toISOString(),
        submittedBy: 'Suresh Kumar (Data Contributor)',
      });

      logSystemAction({
        action: 'STATUS_CHANGE',
        module: 'Workflow',
        recordId: reportingContextStorageKey,
        details: `Submitted monthly ESG records for ${currentProject.name} (${currentMonthObj.name} ${selectedFinancialYear}) to Reviewer Queue`,
        actorName: 'Suresh Kumar',
        actorRole: 'contributor',
        actorEmail: 'contributor@demo.com',
      });

      addToast(
        `✓ Reporting Dossier for ${currentMonthObj.name} ${selectedFinancialYear} successfully submitted to Reviewer Queue!`,
        'success'
      );
    }, 600);
  };

  // Calculate Variance & Trend Badge for an indicator
  const renderVarianceBadge = (curr: string | number, prev: string | number, unit: string) => {
    const numCurr = typeof curr === 'number' ? curr : parseFloat(String(curr));
    const numPrev = typeof prev === 'number' ? prev : parseFloat(String(prev));

    if (isNaN(numCurr) || isNaN(numPrev) || numPrev === 0) {
      return (
        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
          <Minus className="w-3 h-3 text-slate-300" />
          <span>Baseline</span>
        </span>
      );
    }

    const diff = numCurr - numPrev;
    const pct = ((diff / numPrev) * 100);

    if (Math.abs(pct) < 0.1) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          <Minus className="w-3 h-3" />
          <span>0.0%</span>
        </span>
      );
    }

    const isPositive = diff > 0;
    // For environmental indicators like emissions/waste, increase is unfavorable (red/amber)
    const isAnomaly = Math.abs(pct) > 15;

    return (
      <div className="flex flex-col items-start gap-0.5 font-mono text-[11px]">
        <span
          className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded ${
            isAnomaly
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : isPositive
              ? 'bg-sky-50 text-sky-800'
              : 'bg-emerald-50 text-emerald-800'
          }`}
          title={`Absolute delta: ${diff > 0 ? '+' : ''}${diff.toLocaleString()} ${unit}`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-sky-700" />
          ) : (
            <TrendingDown className="w-3 h-3 text-emerald-700" />
          )}
          <span>{isPositive ? `+${pct.toFixed(1)}%` : `${pct.toFixed(1)}%`}</span>
        </span>
        <span className="text-[10px] text-slate-400">
          {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} {unit}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Mission Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              MEIL ESG Principles Data Capture &amp; Automated Review
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assignment – ESG Principles Data Capture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Execute monthly ESG and BRSR disclosure capture across all 9 statutory principles. Enter operational metrics, monitor month-over-month variance, attach verified evidence, and submit for assurance sign-off.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!isContextValid || periodWorkflowStatus === 'Approved' || periodWorkflowStatus === 'Locked'}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePreCheckSubmit}
            disabled={!isContextValid || isSubmitting || periodWorkflowStatus === 'Approved' || periodWorkflowStatus === 'Locked'}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 active:scale-95 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Pre-Check &amp; Submit Dossier</span>
          </button>
        </div>
      </div>

      {/* 
        ========================================================================
        STEP 1: SELECT REPORTING CONTEXT (Section 2 of Master Prompt)
        - Project Name (Authorized Database Records)
        - Project Code / ID (Auto-populated)
        - Financial Year (System Configured Indian FY)
        - Project Site / Location (Associated Sites with Dependent Reset)
        - Reporting Month (April-March Calendar)
        - ESG Principle (Principles 1 through 9)
        ========================================================================
      */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-200">
              1
            </span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Step 1: Select Reporting Context
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Mandatory parameters required to unlock indicator entry table
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* Project Name (Authorized from Database) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors appearance-none cursor-pointer"
              >
                {dbProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block truncate">
              ID: <strong className="font-mono text-slate-700">{currentProject.code || currentProject.id}</strong>
            </span>
          </div>

          {/* Project Site / Location (Dependent on Project) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Site / Section <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedSiteId}
                onChange={(e) => {
                  setSelectedSiteId(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors appearance-none cursor-pointer"
              >
                {projectSites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              {projectSites.length} site(s) configured for project
            </span>
          </div>

          {/* Financial Year (Indian FY April-March) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Financial Year <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedFinancialYear}
                onChange={(e) => {
                  setSelectedFinancialYear(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors appearance-none cursor-pointer font-mono"
              >
                {availableFinancialYears.map((fy) => (
                  <option key={fy} value={fy}>
                    {fy}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <span className="text-[10px] text-teal-700 font-semibold mt-1 block">
              Indian Fiscal: 01 Apr – 31 Mar
            </span>
          </div>

          {/* Reporting Month (Restricted to FY) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Reporting Month <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors appearance-none cursor-pointer"
              >
                {INDIAN_FINANCIAL_MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name} ({m.quarter})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Cycle: {currentMonthObj.quarter} Reporting Window
            </span>
          </div>

          {/* ESG Principle Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              ESG Principle <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedPrincipleId}
                onChange={(e) => setSelectedPrincipleId(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-teal-700 focus:ring-1 focus:ring-teal-700 transition-colors appearance-none cursor-pointer"
              >
                {ESG_MASTER_PRINCIPLES.map((p) => (
                  <option key={p.id} value={p.id}>
                    P{p.id}: {p.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
            <span className="text-[10px] text-teal-800 font-medium mt-1 block">
              {activePrinciple.category} Category
            </span>
          </div>
        </div>

        {/* 
          Context Summary Banner (Shows Selected Project, Site, FY, Month & Status)
        */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-slate-500 font-medium">Reporting Context:</span>
            <span className="font-bold text-slate-800">
              {currentProject.name} <span className="font-mono text-slate-500 font-normal">({currentProject.code || currentProject.id})</span>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700">
              Site: <strong className="font-semibold text-slate-900">{currentSiteName}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700">
              Period: <strong className="font-semibold text-slate-900">{currentMonthObj.name} {selectedFinancialYear}</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700">
              Principle: <strong className="font-semibold text-teal-800">P{activePrinciple.id} ({activePrinciple.title})</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                periodWorkflowStatus === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : periodWorkflowStatus === 'Submitted'
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : periodWorkflowStatus === 'Under Review'
                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                  : periodWorkflowStatus === 'Changes Requested'
                  ? 'bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              Status: {periodWorkflowStatus}
            </span>

            <span className="text-[11px] text-slate-500 font-mono">
              Saved: {lastSavedTimestamp}
            </span>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        STEP 2: 9 PRINCIPLES NAVIGATION TABS
        Preserving all 9 principles and allowing instant switching
        ========================================================================
      */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
          {ESG_MASTER_PRINCIPLES.map((p) => {
            const isSelected = selectedPrincipleId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPrincipleId(p.id)}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#003B73] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                <span
                  className={`font-mono text-[11px] px-1.5 py-0.5 rounded font-bold ${
                    isSelected ? 'bg-sky-400/30 text-sky-100' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {p.shortCode}
                </span>
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 
        ========================================================================
        STEP 3: ENHANCED ESG TABLE & SUMMARY METRICS
        ========================================================================
      */}
      <div className="space-y-4">
        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Dossier Completeness
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-teal-800 font-mono">
                {stats.completionRate}%
              </span>
              <span className="text-xs text-slate-500">
                ({stats.completed} of {stats.total} indicators)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Missing Required
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-2xl font-extrabold font-mono ${
                  stats.missing > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {stats.missing}
              </span>
              <span className="text-xs text-slate-500">indicators empty</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.missing === 0 ? '✓ All required fields satisfied' : 'Submission blocked until filled'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Supporting Evidence
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-sky-700 font-mono">
                {stats.evidenceRate}%
              </span>
              <span className="text-xs text-slate-500">
                ({stats.withEvidence} files attached)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${stats.evidenceRate}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Variance &amp; Anomalies
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-2xl font-extrabold font-mono ${
                  stats.anomalies > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {stats.anomalies}
              </span>
              <span className="text-xs text-slate-500">spikes (&gt;15%)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {stats.anomalies === 0 ? 'Normal variance pattern' : 'Remarks required for spikes'}
            </p>
          </div>
        </div>

        {/* Table Filter, Search, and Action Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Indicator Code (e.g. P2-IND-04), title, or keywords..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pill Buttons */}
            <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200/80">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  filterMode === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({activePrinciple.indicators.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('incomplete')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  filterMode === 'incomplete' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Incomplete
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('evidence_missing')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  filterMode === 'evidence_missing' ? 'bg-white text-sky-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Missing Evidence
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('anomalies')}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  filterMode === 'anomalies' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Anomalies
              </button>
            </div>
          </div>
        </div>

        {/* 
          ENHANCED ESG TABLE
          Preserving and enhancing existing website indicators with:
          - Indicator ID and Name
          - ESG Principle / Category
          - Description & Unit
          - Previous Month's Value
          - Current Reporting Month's Value (Inline Editable)
          - Change from Previous Month (Percentage Variance & Visual Trend)
          - Supporting Evidence Upload
          - Contributor Remarks
          - Validation Status & Errors
          - Last Updated Timestamp
        */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Principle {activePrinciple.id}: {activePrinciple.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {activePrinciple.description}
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
              {currentPrincipleIndicators.length} Indicators Listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left min-w-[200px]">
                    <button
                      type="button"
                      onClick={() => {
                        setSortField('name');
                        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                      }}
                      className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer uppercase font-bold"
                    >
                      <span>Indicator ID &amp; Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left min-w-[100px]">
                    Category &amp; Unit
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-right min-w-[110px]">
                    Previous Month
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left min-w-[150px]">
                    Current Month <span className="text-rose-500">*</span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left min-w-[120px]">
                    Month-over-Month Change
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center min-w-[130px]">
                    Supporting Evidence
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left min-w-[180px]">
                    Contributor Remarks
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center min-w-[90px]">
                    Validation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {currentPrincipleIndicators.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      No indicators match the selected filter.
                    </td>
                  </tr>
                ) : (
                  currentPrincipleIndicators.map((row) => {
                    const isReadOnly = periodWorkflowStatus === 'Approved' || periodWorkflowStatus === 'Locked';
                    const hasAnomalousChange = row.validationStatus === 'anomaly';

                    return (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50/70 transition-colors ${
                          hasAnomalousChange ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        {/* Indicator ID & Name */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[11px] text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                                {row.id}
                              </span>
                              {row.isBrsrCore && (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  <ShieldCheck className="w-2.5 h-2.5 text-amber-700" />
                                  BRSR Core
                                </span>
                              )}
                              {row.required && (
                                <span className="text-rose-500 font-bold" title="Mandatory field">
                                  *
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-slate-900 leading-snug">
                              {row.name}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
                              {row.description}
                            </p>
                          </div>
                        </td>

                        {/* Category & Measurement Unit */}
                        <td className="px-3 py-3.5 align-top">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {row.category}
                            </span>
                            <div className="text-[11px] text-slate-600 font-medium">
                              Unit: <strong className="font-mono text-slate-800">{row.unit}</strong>
                            </div>
                          </div>
                        </td>

                        {/* Previous Month's Value */}
                        <td className="px-3 py-3.5 align-top text-right">
                          <div className="font-mono text-slate-700 font-semibold text-xs">
                            {row.previousMonthValue !== '' && row.previousMonthValue !== undefined
                              ? typeof row.previousMonthValue === 'number'
                                ? row.previousMonthValue.toLocaleString()
                                : row.previousMonthValue
                              : '—'}
                          </div>
                          <span className="text-[10px] text-slate-400">Baseline</span>
                        </td>

                        {/* Current Month's Value (Inline Editable) */}
                        <td className="px-3 py-3.5 align-top">
                          <div className="space-y-1">
                            {row.valueType === 'boolean' ? (
                              <select
                                value={String(row.currentValue)}
                                onChange={(e) => handleValueChange(row.id, e.target.value)}
                                disabled={isReadOnly}
                                className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700 disabled:bg-slate-100"
                              >
                                <option value="Yes">Yes (Affirmed)</option>
                                <option value="No">No (Non-compliant)</option>
                              </select>
                            ) : (
                              <input
                                type={row.valueType === 'numeric' || row.valueType === 'percentage' || row.valueType === 'currency' ? 'number' : 'text'}
                                step="any"
                                value={row.currentValue}
                                onChange={(e) => handleValueChange(row.id, e.target.value)}
                                disabled={isReadOnly}
                                placeholder={`Enter ${row.unit}`}
                                className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-1 ${
                                  row.validationStatus === 'missing'
                                    ? 'bg-amber-50/80 border border-amber-300 text-slate-900 focus:border-amber-600 focus:ring-amber-500'
                                    : row.validationStatus === 'anomaly'
                                    ? 'bg-rose-50/80 border border-rose-300 text-slate-900 focus:border-rose-600 focus:ring-rose-500'
                                    : 'bg-slate-50 focus:bg-white border border-slate-300 text-slate-900 focus:border-teal-700 focus:ring-teal-700'
                                } disabled:bg-slate-100 disabled:text-slate-500 font-mono`}
                              />
                            )}

                            {/* Validation warning message below input */}
                            {row.validationMessage && (
                              <p className="text-[10px] text-rose-600 flex items-start gap-1 leading-tight">
                                <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                <span>{row.validationMessage}</span>
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Month-over-Month Change & Variance Trend */}
                        <td className="px-3 py-3.5 align-top">
                          {renderVarianceBadge(row.currentValue, row.previousMonthValue, row.unit)}
                        </td>

                        {/* Supporting Evidence Upload */}
                        <td className="px-3 py-3.5 align-top text-center">
                          <div className="space-y-1 flex flex-col items-center">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveEvidenceIndicator(row);
                                setIsEvidenceModalOpen(true);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                row.evidenceFiles.length > 0
                                  ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                                  : row.required
                                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              <Upload className="w-3 h-3" />
                              <span>
                                {row.evidenceFiles.length > 0
                                  ? `${row.evidenceFiles.length} File(s)`
                                  : 'Upload File'}
                              </span>
                            </button>

                            {row.evidenceFiles.length > 0 && (
                              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Attached
                              </span>
                            )}

                            {row.evidenceFiles.length === 0 && row.required && (
                              <span className="text-[10px] text-slate-400">
                                Mandate: {row.requiredEvidenceName.split('/')[0]}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Contributor Remarks / Explanation */}
                        <td className="px-3 py-3.5 align-top">
                          <textarea
                            rows={2}
                            value={row.remarks}
                            onChange={(e) => handleRemarksChange(row.id, e.target.value)}
                            disabled={isReadOnly}
                            placeholder="Add operational notes or variance justification..."
                            className="w-full px-2.5 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-700 resize-none disabled:bg-slate-100 disabled:text-slate-400"
                          />
                        </td>

                        {/* Validation Status Badge */}
                        <td className="px-3 py-3.5 align-top text-center">
                          <div className="flex flex-col items-center gap-1">
                            {row.validationStatus === 'valid' && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                                title="Validated against business constraints"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Valid
                              </span>
                            )}
                            {row.validationStatus === 'missing' && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300"
                                title="Missing required value"
                              >
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                Missing
                              </span>
                            )}
                            {row.validationStatus === 'anomaly' && (
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300"
                                title="High variance detected (> 15%)"
                              >
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                Anomaly
                              </span>
                            )}
                            <span className="text-[9px] text-slate-400 font-mono">
                              {row.lastUpdated}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Summary Status */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Reporting Dossier:</span>
              <span>
                {currentProject.name} &bull; {currentSiteName} &bull; {currentMonthObj.name} {selectedFinancialYear}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span>
                Unsaved edits: <strong className={hasUnsavedChanges ? 'text-amber-700' : 'text-slate-700'}>{hasUnsavedChanges ? 'Yes' : 'None'}</strong>
              </span>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="text-teal-700 font-bold hover:underline"
              >
                Sync with Database
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        MODAL 1: EVIDENCE UPLOAD MODAL
        ========================================================================
      */}
      {activeEvidenceIndicator && (
        <EvidenceUploadModal
          isOpen={isEvidenceModalOpen}
          onClose={() => {
            setIsEvidenceModalOpen(false);
            setActiveEvidenceIndicator(null);
          }}
          field={{
            id: activeEvidenceIndicator.id,
            code: activeEvidenceIndicator.id,
            label: activeEvidenceIndicator.name,
            category: activeEvidenceIndicator.category,
            principle: `P${activeEvidenceIndicator.principleId}` as any,
            section: 'Section C',
            type: 'number',
            unit: activeEvidenceIndicator.unit,
            required: activeEvidenceIndicator.required,
            requiredEvidenceName: activeEvidenceIndicator.requiredEvidenceName,
            acceptedFileTypes: '.pdf, .xlsx, .csv, .jpg, .png',
            essentialOrLeadership: 'Essential',
            description: activeEvidenceIndicator.description,
          }}
          currentValue={activeEvidenceIndicator.currentValue}
          onUploadSuccess={handleEvidenceUploadSuccess}
        />
      )}

      {/* 
        ========================================================================
        MODAL 2: FINAL SUBMISSION PRE-CHECK MODAL
        ========================================================================
      */}
      <FinalSubmissionCheckModal
        isOpen={isSubmitCheckModalOpen}
        onClose={() => setIsSubmitCheckModalOpen(false)}
        onConfirmSubmit={handleConfirmFinalSubmit}
      />
    </div>
  );
};
