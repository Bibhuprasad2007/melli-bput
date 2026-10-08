import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type {
  ValidationCheckItem,
  AnomalyInfo,
  CalculationStep,
  EvidenceDocumentItem,
  EvidenceStatus,
  CorrectionRequestDetails,
  ReviewCommentItem,
  ReviewAuditEntry,
  ReviewerNotification,
  RollupComparisonItem,
} from '../types/reviewer';

// Core entity types
export interface OrganizationNode {
  id: string;
  name: string;
  type: 'Group' | 'Subsidiary' | 'BusinessUnit' | 'Project' | 'Department';
  parentId: string | null;
  sector?: string;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'reviewer' | 'contributor' | 'management' | 'auditor';
  email: string;
  orgId: string;
  orgScopeId?: string;
  department?: string;
}

export interface Assignment {
  id: string;
  contributorId: string;
  indicatorCode: string;
  indicatorName: string;
  brsrSection: 'Section A' | 'Section B' | 'Section C';
  brsrPrinciple: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9';
  isBrsrCore: boolean;
  orgId: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'draft' | 'submitted' | 'under_review' | 'correction_requested' | 'resubmitted' | 'approved' | 'rejected';
  dueDate: string;
  reportingPeriod: string;
  submittedAt?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
}

export interface SubmissionData {
  assignmentId: string;
  value: number | string;
  unit: string;
  activityValue?: number;
  activityUnit?: string;
  emissionFactor?: number;
  emissionFactorUnit?: string;
  calculatedValue?: number;
  previousYearValue?: number | string;
  yoyVariancePercent?: number;
  yoyVarianceDirection?: 'increase' | 'decrease' | 'stable';
  calculationSteps?: CalculationStep[];
  validationChecks?: ValidationCheckItem[];
  anomaly?: AnomalyInfo;
  rollupHierarchy?: RollupComparisonItem[];
  evidenceIds?: string[];
  comments?: string;
  submittedAt?: string;
  submittedBy?: string;
  previousSubmission?: {
    value: number | string;
    unit: string;
    submittedAt: string;
    comments?: string;
  };
}

interface NexusContextType {
  organizations: OrganizationNode[];
  users: User[];
  assignments: Assignment[];
  submissions: SubmissionData[];
  evidence: EvidenceDocumentItem[];
  comments: ReviewCommentItem[];
  auditHistory: ReviewAuditEntry[];
  corrections: CorrectionRequestDetails[];
  notifications: ReviewerNotification[];
  createAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
  submitData: (data: SubmissionData) => void;
  uploadEvidence: (evidence: Omit<EvidenceDocumentItem, 'id'>) => string;
  approveSubmission: (assignmentId: string, reviewerName?: string, comments?: string) => { success: boolean; message: string };
  requestCorrection: (assignmentId: string, details: { problem: string; requiredCorrection: string; evidenceNeeded: string; deadline: string; comment: string; reviewerName?: string }) => void;
  rejectSubmission: (assignmentId: string, reason: string, reviewerName?: string, comments?: string) => void;
  updateEvidenceStatus: (evidenceId: string, status: EvidenceStatus, reason?: string) => void;
  requestEvidenceReplacement: (evidenceId: string, reason: string) => void;
  addReviewComment: (comment: { assignmentId: string; targetType: ReviewCommentItem['targetType']; targetId?: string; commentText: string; authorName?: string; authorRole?: string; authorEmail?: string }) => void;
  acceptAnomalyExplanation: (assignmentId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
}

// Initial Demo Organizations
const initialOrganizations: OrganizationNode[] = [
  { id: 'org_meil', name: 'MEIL Group (Corporate HQ)', type: 'Group', parentId: null },
  { id: 'sub_infra', name: 'MEIL Infrastructure Ltd', type: 'Subsidiary', parentId: 'org_meil' },
  { id: 'sub_energy', name: 'MEIL Clean Energy Ltd', type: 'Subsidiary', parentId: 'org_meil' },
  { id: 'bu_highways', name: 'Roads & Expressways BU', type: 'BusinessUnit', parentId: 'sub_infra' },
  { id: 'bu_irrigation', name: 'Water & Irrigation BU', type: 'BusinessUnit', parentId: 'sub_infra' },
  { id: 'bu_solar', name: 'Solar & Wind BU', type: 'BusinessUnit', parentId: 'sub_energy' },
  { id: 'proj_exp', name: 'Expressway Project Phase-II (Raipur)', type: 'Project', parentId: 'bu_highways' },
  { id: 'proj_klis', name: 'Kaleshwaram Lift Irrigation Site 4', type: 'Project', parentId: 'bu_irrigation' },
  { id: 'proj_solar_park', name: 'Pavagada 500MW Solar Park', type: 'Project', parentId: 'bu_solar' },
];

// Initial Demo Users
const initialUsers: User[] = [
  { id: 'u_admin', name: 'Rajesh Sharma', role: 'admin', email: 'admin@meil.in', orgId: 'org_meil' },
  { id: 'u_rev', name: 'Aarav Patel (Review Lead)', role: 'reviewer', email: 'reviewer@meil.in', orgId: 'org_meil' },
  { id: 'u_cont1', name: 'Suresh Kumar (Site Engineer)', role: 'contributor', email: 'suresh.k@meil.in', orgId: 'proj_exp' },
  { id: 'u_cont2', name: 'Ananya Roy (Environmental Officer)', role: 'contributor', email: 'ananya.r@meil.in', orgId: 'proj_klis' },
  { id: 'u_cont3', name: 'Vikram Joshi (Plant Manager)', role: 'contributor', email: 'vikram.j@meil.in', orgId: 'proj_solar_park' },
  { id: 'u_mgmt', name: 'Dr. V. Rao (Chief Sustainability Officer)', role: 'management', email: 'cso@meil.in', orgId: 'org_meil' },
  { id: 'u_auditor', name: 'Sanjay Deshmukh (Lead BRSR Assurer)', role: 'auditor', email: 'auditor.brsr@deloitte-partner.com', orgId: 'org_meil' },
];

// Initial Demo Evidence
const initialEvidence: EvidenceDocumentItem[] = [
  {
    id: 'ev_diesel_1',
    name: 'IOCL_Diesel_Logbook_Oct2026.pdf',
    documentType: 'Fuel Register & Invoices',
    fileFormat: 'PDF',
    fileSizeBytes: 2450000,
    url: '/evidence/IOCL_Diesel_Logbook_Oct2026.pdf',
    uploadedBy: 'Suresh Kumar',
    uploadedOn: '2026-10-02 11:30 AM',
    status: 'UNDER_REVIEW',
    comments: ['Meter slips verified with GST invoices from IOCL dealer.'],
  },
  {
    id: 'ev_elec_1',
    name: 'CSPDCL_High_Tension_Bill_Q3.pdf',
    documentType: 'Electricity Utility Bill',
    fileFormat: 'PDF',
    fileSizeBytes: 1890000,
    url: '/evidence/CSPDCL_High_Tension_Bill_Q3.pdf',
    uploadedBy: 'Suresh Kumar',
    uploadedOn: '2026-10-02 02:15 PM',
    status: 'UNDER_REVIEW',
    comments: ['Grid tariff invoice reflecting commercial power tariff.'],
  },
  {
    id: 'ev_water_1',
    name: 'Groundwater_FlowMeter_Calibration_Cert.pdf',
    documentType: 'Flow Meter Calibration & CGWA NOC',
    fileFormat: 'PDF',
    fileSizeBytes: 3120000,
    url: '/evidence/Groundwater_FlowMeter_Calibration_Cert.pdf',
    uploadedBy: 'Ananya Roy',
    uploadedOn: '2026-10-01 04:00 PM',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'ev_waste_1',
    name: 'StatePCB_Hazardous_Manifest_Form10.pdf',
    documentType: 'SPCB Hazardous Waste Manifest Form 10',
    fileFormat: 'PDF',
    fileSizeBytes: 1450000,
    url: '/evidence/StatePCB_Hazardous_Manifest_Form10.pdf',
    uploadedBy: 'Ananya Roy',
    uploadedOn: '2026-10-03 09:45 AM',
    status: 'UNDER_REVIEW',
  },
  {
    id: 'ev_solar_1',
    name: 'Pavagada_Solar_Generation_Cert_CEA.pdf',
    documentType: 'CEA Generation Certificate',
    fileFormat: 'PDF',
    fileSizeBytes: 4200000,
    url: '/evidence/Pavagada_Solar_Generation_Cert_CEA.pdf',
    uploadedBy: 'Vikram Joshi',
    uploadedOn: '2026-09-28 10:15 AM',
    status: 'ACCEPTED',
  },
  {
    id: 'ev_csr_1',
    name: 'CSR_Committee_Sanction_School_Dev.pdf',
    documentType: 'Bank Remittance & Committee Minutes',
    fileFormat: 'PDF',
    fileSizeBytes: 2100000,
    url: '/evidence/CSR_Committee_Sanction_School_Dev.pdf',
    uploadedBy: 'Rajesh Sharma',
    uploadedOn: '2026-09-25 03:00 PM',
    status: 'ACCEPTED',
  },
];

// Initial Demo Assignments
const initialAssignments: Assignment[] = [
  {
    id: 'a_scope1_diesel',
    contributorId: 'u_cont1',
    indicatorCode: 'ENV_GHG_S1',
    indicatorName: 'Scope 1 GHG Emissions (Direct - Diesel Combustion)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_exp',
    priority: 'High',
    status: 'under_review',
    dueDate: '2026-10-25',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-02T11:45:00Z',
    riskLevel: 'Medium',
  },
  {
    id: 'a_scope2_elec',
    contributorId: 'u_cont1',
    indicatorCode: 'ENV_GHG_S2',
    indicatorName: 'Scope 2 GHG Emissions (Indirect - Purchased Grid Electricity)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_exp',
    priority: 'High',
    status: 'under_review',
    dueDate: '2026-10-25',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-02T14:30:00Z',
    riskLevel: 'High',
  },
  {
    id: 'a_water_cons',
    contributorId: 'u_cont2',
    indicatorCode: 'ENV_WAT_01',
    indicatorName: 'Total Water Withdrawal & Consumption (Groundwater + Surface)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_klis',
    priority: 'High',
    status: 'under_review',
    dueDate: '2026-10-28',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-01T16:20:00Z',
    riskLevel: 'High',
  },
  {
    id: 'a_haz_waste',
    contributorId: 'u_cont2',
    indicatorCode: 'ENV_WAS_HZ',
    indicatorName: 'Hazardous Waste Generated & Disposed to Authorized Recyclers',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_klis',
    priority: 'Medium',
    status: 'under_review',
    dueDate: '2026-10-30',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-03T10:00:00Z',
    riskLevel: 'Medium',
  },
  {
    id: 'a_female_div',
    contributorId: 'u_cont1',
    indicatorCode: 'SOC_DIV_FEM',
    indicatorName: 'Permanent Employees - Female Diversity Ratio (%)',
    brsrSection: 'Section A',
    brsrPrinciple: 'P5',
    isBrsrCore: true,
    orgId: 'proj_exp',
    priority: 'High',
    status: 'under_review',
    dueDate: '2026-10-20',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-04T08:30:00Z',
    riskLevel: 'High',
  },
  {
    id: 'a_safety_ltifr',
    contributorId: 'u_cont2',
    indicatorCode: 'SOC_SAF_LTIFR',
    indicatorName: 'Lost Time Injury Frequency Rate (LTIFR) per Million Man-Hours',
    brsrSection: 'Section C',
    brsrPrinciple: 'P3',
    isBrsrCore: true,
    orgId: 'proj_klis',
    priority: 'High',
    status: 'correction_requested',
    dueDate: '2026-10-18',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-09-29T11:00:00Z',
    riskLevel: 'High',
  },
  {
    id: 'a_csr_spend',
    contributorId: 'u_admin',
    indicatorCode: 'SOC_CSR_01',
    indicatorName: 'Total CSR Expenditure on Local Community Infrastructure',
    brsrSection: 'Section C',
    brsrPrinciple: 'P8',
    isBrsrCore: true,
    orgId: 'org_meil',
    priority: 'Medium',
    status: 'approved',
    dueDate: '2026-10-15',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-09-25T15:30:00Z',
    riskLevel: 'Low',
  },
  {
    id: 'a_renew_share',
    contributorId: 'u_cont3',
    indicatorCode: 'ENV_NRG_REN',
    indicatorName: 'Renewable Energy Consumption Share (%)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_solar_park',
    priority: 'Low',
    status: 'approved',
    dueDate: '2026-10-15',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-09-28T10:45:00Z',
    riskLevel: 'Low',
  },
  {
    id: 'a_ethics_griev',
    contributorId: 'u_admin',
    indicatorCode: 'GOV_ETH_01',
    indicatorName: 'Number of Bribery / Anti-Corruption Grievances Received',
    brsrSection: 'Section B',
    brsrPrinciple: 'P1',
    isBrsrCore: false,
    orgId: 'org_meil',
    priority: 'Medium',
    status: 'under_review',
    dueDate: '2026-10-29',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-04T12:00:00Z',
    riskLevel: 'Low',
  },
];

// Initial Demo Submissions with Calculations, Validations, and Anomalies
const initialSubmissions: SubmissionData[] = [
  {
    assignmentId: 'a_scope1_diesel',
    value: 134.0,
    unit: 'tCO2e',
    activityValue: 50000,
    activityUnit: 'Liters Diesel',
    emissionFactor: 2.68,
    emissionFactorUnit: 'kg CO2e/L',
    calculatedValue: 134.0,
    previousYearValue: 100.0,
    yoyVariancePercent: 34.0,
    yoyVarianceDirection: 'increase',
    calculationSteps: [
      {
        label: 'Fuel Activity Data',
        formula: 'Fuel Volume consumed across site DG sets and heavy excavators',
        inputValue: 50000,
        factorUsed: 1,
        outputValue: 50000,
        unit: 'Liters',
      },
      {
        label: 'CEA / IPCC Emission Factor',
        formula: 'Liters Diesel × 2.68 kg CO2e/L ÷ 1,000 (kg to Metric Ton conversion)',
        inputValue: '50,000 L',
        factorUsed: '2.68 kg CO2e/L',
        outputValue: 134.0,
        unit: 'tCO2e',
      },
    ],
    validationChecks: [
      {
        id: 'val_1',
        code: 'V_NOT_NULL',
        ruleName: 'Completeness & Non-Zero Check',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Value is present and within non-zero physical boundary.',
      },
      {
        id: 'val_2',
        code: 'V_UNIT_MATCH',
        ruleName: 'Standard Unit Verification',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Unit matches BRSR Core Greenhouse Gas metric standard (tCO2e).',
      },
      {
        id: 'val_3',
        code: 'V_EVID_MATCH',
        ruleName: 'Supporting Evidence Presence',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Verified 1 uploaded document: IOCL Diesel Register & GST Invoices.',
      },
      {
        id: 'val_4',
        code: 'V_CALC_RECON',
        ruleName: 'Calculation Formula Consistency',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Calculated 134.0 tCO2e matches reported total exactly.',
      },
      {
        id: 'val_5',
        code: 'V_YOY_VAR',
        ruleName: 'YoY Growth Boundary Check',
        severity: 'WARNING',
        status: 'WARNING',
        message: 'YoY increase of +34.0% exceeds normal 25% boundary. Verified with project excavation phase ramp-up.',
      },
    ],
    anomaly: {
      isAnomaly: false,
      yoyChangePercent: 34.0,
      direction: 'increase',
      thresholdPercent: 50.0,
      explanationProvided: 'Increased generator runtime due to high-intensity tunneling excavation milestone in Q2.',
    },
    rollupHierarchy: [
      {
        level: 'Project',
        name: 'Expressway Project Phase-II (Raipur)',
        value: 134.0,
        unit: 'tCO2e',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Direct site fuel meter logs',
      },
      {
        level: 'Business Unit',
        name: 'Roads & Expressways BU (3 Projects)',
        value: 420.5,
        unit: 'tCO2e',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Sum of Raipur, Nagpur, and Vijayawada expressway packages',
      },
      {
        level: 'Subsidiary',
        name: 'MEIL Infrastructure Ltd',
        value: 1180.0,
        unit: 'tCO2e',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Aggregated direct emissions across all infra verticals',
      },
      {
        level: 'Group',
        name: 'MEIL Group (Consolidated)',
        value: 3450.0,
        unit: 'tCO2e',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Group Scope 1 consolidated reporting baseline',
      },
    ],
    evidenceIds: ['ev_diesel_1'],
    comments: 'Fuel consumption logged from on-site automated bowser system and calibrated DG fuel meters.',
    submittedAt: '2026-10-02T11:45:00Z',
    submittedBy: 'Suresh Kumar',
  },
  {
    assignmentId: 'a_scope2_elec',
    value: 369.0,
    unit: 'tCO2e',
    activityValue: 450000,
    activityUnit: 'kWh (Purchased Electricity)',
    emissionFactor: 0.82,
    emissionFactorUnit: 'kg CO2e/kWh',
    calculatedValue: 369.0,
    previousYearValue: 205.0,
    yoyVariancePercent: 80.0,
    yoyVarianceDirection: 'increase',
    calculationSteps: [
      {
        label: 'Grid Electricity Metered Consumption',
        formula: 'Total kilowatt-hours billed by CSPDCL HT connection',
        inputValue: 450000,
        factorUsed: 1,
        outputValue: 450000,
        unit: 'kWh',
      },
      {
        label: 'CEA Grid Emission Factor v20',
        formula: '450,000 kWh × 0.82 kg CO2e/kWh ÷ 1,000',
        inputValue: '450,000 kWh',
        factorUsed: '0.82 kg CO2e/kWh',
        outputValue: 369.0,
        unit: 'tCO2e',
      },
    ],
    validationChecks: [
      {
        id: 'val_21',
        code: 'V_NOT_NULL',
        ruleName: 'Non-Zero Entry Check',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Valid metered value present.',
      },
      {
        id: 'val_22',
        code: 'V_ANOMALY_YOY',
        ruleName: 'YoY Anomaly Detection Trigger',
        severity: 'WARNING',
        status: 'WARNING',
        message: 'YoY increase (+80.0%) exceeds 50% anomaly alert threshold.',
      },
    ],
    anomaly: {
      isAnomaly: true,
      yoyChangePercent: 80.0,
      direction: 'increase',
      thresholdPercent: 50.0,
      explanationProvided: 'Added two 400 kW electric batching plants to replace older diesel units in July 2026.',
      anomalyReason: 'Large expansion in electrified batching operations (+80% power draw).',
      isExplanationAccepted: false,
    },
    rollupHierarchy: [
      {
        level: 'Project',
        name: 'Expressway Project Phase-II (Raipur)',
        value: 369.0,
        unit: 'tCO2e',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'CSPDCL meter account #HT-4482',
      },
      {
        level: 'Business Unit',
        name: 'Roads & Expressways BU',
        value: 890.0,
        unit: 'tCO2e',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Sum across active packages',
      },
      {
        level: 'Group',
        name: 'MEIL Group (Consolidated)',
        value: 5120.0,
        unit: 'tCO2e',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Corporate electricity baseline',
      },
    ],
    evidenceIds: ['ev_elec_1'],
    comments: 'Electricity bill Q3 attached with breakdown per meter.',
    submittedAt: '2026-10-02T14:30:00Z',
    submittedBy: 'Suresh Kumar',
  },
  {
    assignmentId: 'a_water_cons',
    value: 18500,
    unit: 'Kiloliters (KL)',
    previousYearValue: 11200,
    yoyVariancePercent: 65.2,
    yoyVarianceDirection: 'increase',
    validationChecks: [
      {
        id: 'val_31',
        code: 'V_NOT_NULL',
        ruleName: 'Completeness Check',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Water meter volume recorded.',
      },
      {
        id: 'val_32',
        code: 'V_ANOMALY_WATER',
        ruleName: 'High Water Consumption Anomaly',
        severity: 'WARNING',
        status: 'WARNING',
        message: 'YoY increase (+65.2%) triggers high-variance quality alert.',
      },
    ],
    anomaly: {
      isAnomaly: true,
      yoyChangePercent: 65.2,
      direction: 'increase',
      thresholdPercent: 40.0,
      explanationProvided: 'Hydro-testing of 14 km lift pipeline executed during August-September 2026.',
      anomalyReason: 'Hydrostatic pressure testing requirements for major canal pump line.',
      isExplanationAccepted: false,
    },
    rollupHierarchy: [
      {
        level: 'Project',
        name: 'Kaleshwaram Lift Irrigation Site 4',
        value: 18500,
        unit: 'KL',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Electromagnetic flow meter logs',
      },
      {
        level: 'Business Unit',
        name: 'Water & Irrigation BU',
        value: 54000,
        unit: 'KL',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Sum of all lift irrigation & canal packages',
      },
      {
        level: 'Group',
        name: 'MEIL Group Total',
        value: 142000,
        unit: 'KL',
        aggregationMethod: 'SUM',
        isReconciled: true,
        notes: 'Total corporate water consumption',
      },
    ],
    evidenceIds: ['ev_water_1'],
    comments: 'Water flow meter logbook certified by CGWA accredited third party.',
    submittedAt: '2026-10-01T16:20:00Z',
    submittedBy: 'Ananya Roy',
  },
  {
    assignmentId: 'a_haz_waste',
    value: 12.5,
    unit: 'Metric Tonnes (MT)',
    previousYearValue: 50.0,
    yoyVariancePercent: -75.0,
    yoyVarianceDirection: 'decrease',
    validationChecks: [
      {
        id: 'val_41',
        code: 'V_NOT_NULL',
        ruleName: 'Manifest Record Check',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Hazardous waste tonnage documented.',
      },
      {
        id: 'val_42',
        code: 'V_ANOMALY_WASTE',
        ruleName: 'Steep Waste Reduction Anomaly',
        severity: 'WARNING',
        status: 'WARNING',
        message: 'YoY decrease (-75.0%) flagged for verification of disposal manifest.',
      },
    ],
    anomaly: {
      isAnomaly: true,
      yoyChangePercent: -75.0,
      direction: 'decrease',
      thresholdPercent: 50.0,
      explanationProvided: 'Switched to reusable synthetic hydraulic fluids with extended filter life cycle.',
      anomalyReason: 'Fluid recycling program drastically reduced hazardous oil waste generation.',
      isExplanationAccepted: false,
    },
    evidenceIds: ['ev_waste_1'],
    comments: 'State Pollution Control Board Form 10 manifest verified.',
    submittedAt: '2026-10-03T10:00:00Z',
    submittedBy: 'Ananya Roy',
  },
  {
    assignmentId: 'a_female_div',
    value: 105.0,
    unit: '%',
    previousYearValue: 18.5,
    yoyVariancePercent: 467.5,
    yoyVarianceDirection: 'increase',
    validationChecks: [
      {
        id: 'val_51',
        code: 'V_PERCENT_CAP',
        ruleName: 'Percentage Maximum Boundary (>100%)',
        severity: 'CRITICAL',
        status: 'FAILED',
        message: 'CRITICAL ERROR: Reported ratio (105%) exceeds 100%. Impossible value detected.',
        details: 'Calculated female employees (210) against permanent headcount (200) indicates data entry error.',
        blocksApproval: true,
      },
      {
        id: 'val_52',
        code: 'V_ANOMALY_EMP',
        ruleName: 'Employee Demographic Outlier',
        severity: 'WARNING',
        status: 'WARNING',
        message: 'YoY swing (+467.5%) flagged alongside invalid percentage boundary.',
      },
    ],
    anomaly: {
      isAnomaly: true,
      yoyChangePercent: 467.5,
      direction: 'increase',
      thresholdPercent: 50.0,
      explanationProvided: 'Typo in numerator during headcount entry. Correction will be supplied.',
    },
    comments: 'Site HR reported 21 female staff out of 200 total; inadvertent 10x typo entered in system.',
    submittedAt: '2026-10-04T08:30:00Z',
    submittedBy: 'Suresh Kumar',
  },
  {
    assignmentId: 'a_safety_ltifr',
    value: 0.12,
    unit: 'Injuries per Million Hours',
    previousYearValue: 0.15,
    yoyVariancePercent: -20.0,
    yoyVarianceDirection: 'decrease',
    validationChecks: [
      {
        id: 'val_61',
        code: 'V_EVID_PEND',
        ruleName: 'Safety Incident Register Attachment',
        severity: 'ERROR',
        status: 'FAILED',
        message: 'Mandatory Safety Committee signed incident log is missing from upload.',
        blocksApproval: true,
      },
    ],
    comments: 'Safety metrics submitted. Awaiting upload of signed minutes.',
    submittedAt: '2026-09-29T11:00:00Z',
    submittedBy: 'Ananya Roy',
  },
  {
    assignmentId: 'a_csr_spend',
    value: 4500000,
    unit: 'INR (Indian Rupees)',
    previousYearValue: 4200000,
    yoyVariancePercent: 7.1,
    yoyVarianceDirection: 'increase',
    validationChecks: [
      {
        id: 'val_71',
        code: 'V_ALL_PASS',
        ruleName: 'Financial Sanction & Bank Receipt Verification',
        severity: 'INFO',
        status: 'PASSED',
        message: 'CSR statutory allocation reconciled with Schedule VII items.',
      },
    ],
    evidenceIds: ['ev_csr_1'],
    comments: 'Approved by CSR Board Committee. Bank transaction advice attached.',
    submittedAt: '2026-09-25T15:30:00Z',
    submittedBy: 'Rajesh Sharma',
  },
  {
    assignmentId: 'a_renew_share',
    value: 24.5,
    unit: '%',
    previousYearValue: 18.0,
    yoyVariancePercent: 36.1,
    yoyVarianceDirection: 'increase',
    validationChecks: [
      {
        id: 'val_81',
        code: 'V_RATIO_PASS',
        ruleName: 'Energy Mix Balance Check',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Renewable share reconciled with total group energy portfolio.',
      },
    ],
    evidenceIds: ['ev_solar_1'],
    comments: 'Solar park captive generation certified by regional load dispatch centre.',
    submittedAt: '2026-09-28T10:45:00Z',
    submittedBy: 'Vikram Joshi',
  },
  {
    assignmentId: 'a_ethics_griev',
    value: 0,
    unit: 'Grievance Count',
    previousYearValue: 0,
    yoyVariancePercent: 0,
    yoyVarianceDirection: 'stable',
    validationChecks: [
      {
        id: 'val_91',
        code: 'V_ZERO_VERIF',
        ruleName: 'Zero Grievance Declaration',
        severity: 'INFO',
        status: 'PASSED',
        message: 'Vigil mechanism quarterly compliance report confirmed zero incidents.',
      },
    ],
    comments: 'Audit Committee signed report confirmed nil whistleblower grievances for Q2.',
    submittedAt: '2026-10-04T12:00:00Z',
    submittedBy: 'Rajesh Sharma',
  },
];

// Initial Demo Corrections Tracker
const initialCorrections: CorrectionRequestDetails[] = [
  {
    id: 'corr_ltifr_1',
    assignmentId: 'a_safety_ltifr',
    problem: 'Missing Signed Safety Committee Minutes & Man-Hour Breakdown Sheet',
    requiredCorrection: 'Upload the official monthly safety audit report signed by the Lead EHS Officer with exact total man-hours worked.',
    evidenceNeeded: 'Signed Form 28 / EHS Committee Minutes + HR Biometric Man-Hour Summary',
    deadline: '2026-10-18',
    reviewerComment: 'LTIFR calculation cannot be verified without audited contractor man-hours.',
    requestedAt: '2026-10-02 16:30',
    requestedBy: 'Aarav Patel (Review Lead)',
    status: 'PENDING_CONTRIBUTOR',
    previousValue: 0.12,
  },
];

// Initial Demo Audit History
const initialAuditHistory: ReviewAuditEntry[] = [
  {
    id: 'aud_csr_1',
    assignmentId: 'a_csr_spend',
    indicatorCode: 'SOC_CSR_01',
    indicatorName: 'Total CSR Expenditure on Local Community Infrastructure',
    submittedBy: 'Rajesh Sharma',
    reviewedBy: 'Aarav Patel (Review Lead)',
    reviewDate: '2026-09-26 14:10',
    decision: 'APPROVE',
    previousValue: '42,00,000',
    newValue: '45,00,000',
    unit: 'INR',
    reason: 'Verified against Bank Transfer Receipt & CSR Board Committee sanction letter.',
    evidenceSummary: 'CSR_Committee_Sanction_School_Dev.pdf (Verified)',
    comments: 'Compliant with Section 135 Companies Act requirements.',
    scopeProject: 'MEIL Group (Corporate HQ)',
    reportingPeriod: 'FY 2026-27 (Q2)',
  },
  {
    id: 'aud_renew_1',
    assignmentId: 'a_renew_share',
    indicatorCode: 'ENV_NRG_REN',
    indicatorName: 'Renewable Energy Consumption Share (%)',
    submittedBy: 'Vikram Joshi',
    reviewedBy: 'Aarav Patel (Review Lead)',
    reviewDate: '2026-09-29 11:30',
    decision: 'APPROVE',
    previousValue: '18.0%',
    newValue: '24.5%',
    unit: '%',
    reason: 'CEA generation certificates and grid wheeling statements verified.',
    evidenceSummary: 'Pavagada_Solar_Generation_Cert_CEA.pdf (Verified)',
    comments: 'Solar captive generation verified with CEA logs.',
    scopeProject: 'Pavagada 500MW Solar Park',
    reportingPeriod: 'FY 2026-27 (Q2)',
  },
];

// Initial Demo Comments
const initialComments: ReviewCommentItem[] = [
  {
    id: 'c_1',
    targetType: 'submission',
    targetId: 'a_scope1_diesel',
    authorName: 'Aarav Patel',
    authorRole: 'Reviewer',
    authorEmail: 'reviewer@meil.in',
    commentText: 'Please double-check whether DG generator fuel usage for subcontractor earthmovers is fully captured in the 50,000 L volume.',
    createdAt: '2026-10-03 10:15 AM',
  },
  {
    id: 'c_2',
    targetType: 'submission',
    targetId: 'a_scope1_diesel',
    authorName: 'Suresh Kumar',
    authorRole: 'Contributor',
    authorEmail: 'suresh.k@meil.in',
    commentText: 'Confirmed. Subcontractor diesel allocations are issued directly from our site fuel bowsers and tracked on page 4 of the invoice attachment.',
    createdAt: '2026-10-03 11:40 AM',
  },
  {
    id: 'c_3',
    targetType: 'validation_issue',
    targetId: 'a_female_div',
    authorName: 'Aarav Patel',
    authorRole: 'Reviewer',
    authorEmail: 'reviewer@meil.in',
    commentText: 'CRITICAL: Female diversity percentage is entered as 105%. Please resubmit with corrected headcount.',
    createdAt: '2026-10-04 09:00 AM',
  },
];

// Initial Demo Notifications
const initialNotifications: ReviewerNotification[] = [
  {
    id: 'notif_1',
    title: 'New Disclosure Submission',
    message: 'Suresh Kumar submitted Scope 1 GHG emissions (50,000 L Diesel) for Raipur Expressway.',
    type: 'submission',
    timestamp: '2 hours ago',
    isRead: false,
    assignmentId: 'a_scope1_diesel',
    priority: 'high',
  },
  {
    id: 'notif_2',
    title: 'Critical Validation Alert',
    message: 'Permanent Employees Female Diversity Ratio exceeded 100% boundary (Reported: 105%).',
    type: 'validation',
    timestamp: '3 hours ago',
    isRead: false,
    assignmentId: 'a_female_div',
    priority: 'high',
  },
  {
    id: 'notif_3',
    title: 'Anomaly Detected (+80% Power)',
    message: 'Purchased Electricity for Raipur Expressway increased by +80% YoY.',
    type: 'anomaly',
    timestamp: '5 hours ago',
    isRead: false,
    assignmentId: 'a_scope2_elec',
    priority: 'medium',
  },
  {
    id: 'notif_4',
    title: 'Pending Correction Reminder',
    message: 'LTIFR Safety disclosure correction requested from Ananya Roy (Due: Oct 18).',
    type: 'deadline',
    timestamp: '1 day ago',
    isRead: true,
    assignmentId: 'a_safety_ltifr',
    priority: 'medium',
  },
];

const NexusDataContext = createContext<NexusContextType | undefined>(undefined);

export const NexusDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations] = useState<OrganizationNode[]>(initialOrganizations);
  const [users] = useState<User[]>(initialUsers);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [submissions, setSubmissions] = useState<SubmissionData[]>(initialSubmissions);
  const [evidence, setEvidence] = useState<EvidenceDocumentItem[]>(initialEvidence);
  const [comments, setComments] = useState<ReviewCommentItem[]>(initialComments);
  const [auditHistory, setAuditHistory] = useState<ReviewAuditEntry[]>(initialAuditHistory);
  const [corrections, setCorrections] = useState<CorrectionRequestDetails[]>(initialCorrections);
  const [notifications, setNotifications] = useState<ReviewerNotification[]>(initialNotifications);

  const createAssignment = (assignmentData: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `a_${Date.now()}`
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const updateAssignmentStatus = (id: string, status: Assignment['status']) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const submitData = (data: SubmissionData) => {
    setSubmissions(prev => {
      const existing = prev.find(s => s.assignmentId === data.assignmentId);
      const filtered = prev.filter(s => s.assignmentId !== data.assignmentId);
      const updated: SubmissionData = {
        ...data,
        previousSubmission: existing ? {
          value: existing.value,
          unit: existing.unit,
          submittedAt: existing.submittedAt || new Date().toISOString(),
          comments: existing.comments,
        } : undefined,
      };
      return [...filtered, updated];
    });
    updateAssignmentStatus(data.assignmentId, 'under_review');
  };

  const uploadEvidence = (evidenceData: Omit<EvidenceDocumentItem, 'id'>) => {
    const id = `ev_${Date.now()}`;
    const newDoc: EvidenceDocumentItem = { ...evidenceData, id };
    setEvidence(prev => [...prev, newDoc]);
    return id;
  };

  // 1. Approve Submission (SUBMITTED / UNDER_REVIEW -> APPROVED / VERIFIED)
  const approveSubmission = (assignmentId: string, reviewerName = 'Aarav Patel (Review Lead)', commentText = 'Approved and verified for BRSR reporting.'): { success: boolean; message: string } => {
    const assign = assignments.find(a => a.id === assignmentId);
    const sub = submissions.find(s => s.assignmentId === assignmentId);
    if (!assign) return { success: false, message: 'Assignment not found' };

    // Check for Critical Validation blocks
    const criticalCheck = sub?.validationChecks?.find(v => v.severity === 'CRITICAL' && v.status === 'FAILED');
    if (criticalCheck) {
      return {
        success: false,
        message: `Approval blocked: Critical validation check failed (${criticalCheck.ruleName} - ${criticalCheck.message})`,
      };
    }

    // Update assignment status to approved
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'approved' } : a));

    // Update attached evidence to ACCEPTED
    if (sub?.evidenceIds) {
      setEvidence(prev => prev.map(e => sub.evidenceIds?.includes(e.id) ? { ...e, status: 'ACCEPTED' } : e));
    }

    // Append to Audit History
    const contributor = users.find(u => u.id === assign.contributorId);
    const org = organizations.find(o => o.id === assign.orgId);
    const auditEntry: ReviewAuditEntry = {
      id: `aud_${Date.now()}`,
      assignmentId,
      indicatorCode: assign.indicatorCode,
      indicatorName: assign.indicatorName,
      submittedBy: contributor?.name || 'Contributor',
      reviewedBy: reviewerName,
      reviewDate: new Date().toLocaleString(),
      decision: 'APPROVE',
      previousValue: sub?.previousYearValue,
      newValue: sub?.value,
      unit: sub?.unit || '',
      reason: 'All automated quality validations passed and evidence authenticity verified.',
      evidenceSummary: sub?.evidenceIds?.length ? `${sub.evidenceIds.length} file(s) accepted` : 'No evidence attached',
      comments: commentText,
      scopeProject: org?.name || 'Project Site',
      reportingPeriod: assign.reportingPeriod,
    };
    setAuditHistory(prev => [auditEntry, ...prev]);

    // Add comment
    if (commentText) {
      setComments(prev => [
        ...prev,
        {
          id: `c_${Date.now()}`,
          targetType: 'submission',
          targetId: assignmentId,
          authorName: reviewerName,
          authorRole: 'Reviewer',
          authorEmail: 'reviewer@meil.in',
          commentText: `[APPROVED] ${commentText}`,
          createdAt: new Date().toLocaleString(),
        },
      ]);
    }

    return { success: true, message: 'Submission successfully verified and approved.' };
  };

  // 2. Request Correction (SUBMITTED -> CORRECTION_REQUESTED)
  const requestCorrection = (assignmentId: string, details: { problem: string; requiredCorrection: string; evidenceNeeded: string; deadline: string; comment: string; reviewerName?: string }) => {
    const assign = assignments.find(a => a.id === assignmentId);
    const sub = submissions.find(s => s.assignmentId === assignmentId);
    if (!assign) return;

    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'correction_requested' } : a));

    const corrId = `corr_${Date.now()}`;
    const newCorr: CorrectionRequestDetails = {
      id: corrId,
      assignmentId,
      problem: details.problem,
      requiredCorrection: details.requiredCorrection,
      evidenceNeeded: details.evidenceNeeded,
      deadline: details.deadline,
      reviewerComment: details.comment,
      requestedAt: new Date().toLocaleString(),
      requestedBy: details.reviewerName || 'Aarav Patel (Review Lead)',
      status: 'PENDING_CONTRIBUTOR',
      previousValue: sub?.value || 0,
    };
    setCorrections(prev => [newCorr, ...prev]);

    // Audit Entry
    const contributor = users.find(u => u.id === assign.contributorId);
    const org = organizations.find(o => o.id === assign.orgId);
    setAuditHistory(prev => [
      {
        id: `aud_${Date.now()}`,
        assignmentId,
        indicatorCode: assign.indicatorCode,
        indicatorName: assign.indicatorName,
        submittedBy: contributor?.name || 'Contributor',
        reviewedBy: details.reviewerName || 'Aarav Patel (Review Lead)',
        reviewDate: new Date().toLocaleString(),
        decision: 'CORRECTION_REQUIRED',
        previousValue: sub?.value,
        newValue: 'Awaiting Resubmission',
        unit: sub?.unit || '',
        reason: details.problem,
        evidenceSummary: `Required: ${details.evidenceNeeded}`,
        comments: details.comment,
        scopeProject: org?.name || 'Project Site',
        reportingPeriod: assign.reportingPeriod,
      },
      ...prev,
    ]);

    // Add comment thread
    setComments(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        targetType: 'submission',
        targetId: assignmentId,
        authorName: details.reviewerName || 'Aarav Patel',
        authorRole: 'Reviewer',
        authorEmail: 'reviewer@meil.in',
        commentText: `[CORRECTION REQUESTED] Problem: ${details.problem}. Required: ${details.requiredCorrection}. Deadline: ${details.deadline}`,
        createdAt: new Date().toLocaleString(),
      },
    ]);
  };

  // 3. Reject Submission (SUBMITTED -> REJECTED)
  const rejectSubmission = (assignmentId: string, reason: string, reviewerName = 'Aarav Patel (Review Lead)', comments = '') => {
    const assign = assignments.find(a => a.id === assignmentId);
    const sub = submissions.find(s => s.assignmentId === assignmentId);
    if (!assign) return;

    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'rejected' } : a));

    const contributor = users.find(u => u.id === assign.contributorId);
    const org = organizations.find(o => o.id === assign.orgId);
    setAuditHistory(prev => [
      {
        id: `aud_${Date.now()}`,
        assignmentId,
        indicatorCode: assign.indicatorCode,
        indicatorName: assign.indicatorName,
        submittedBy: contributor?.name || 'Contributor',
        reviewedBy: reviewerName,
        reviewDate: new Date().toLocaleString(),
        decision: 'REJECT',
        previousValue: sub?.value,
        newValue: 'REJECTED',
        unit: sub?.unit || '',
        reason,
        evidenceSummary: 'Rejected',
        comments,
        scopeProject: org?.name || 'Project Site',
        reportingPeriod: assign.reportingPeriod,
      },
      ...prev,
    ]);

    setComments(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        targetType: 'submission',
        targetId: assignmentId,
        authorName: reviewerName,
        authorRole: 'Reviewer',
        authorEmail: 'reviewer@meil.in',
        commentText: `[SUBMISSION REJECTED] Reason: ${reason}. ${comments}`,
        createdAt: new Date().toLocaleString(),
      },
    ]);
  };

  // 4. Evidence Management
  const updateEvidenceStatus = (evidenceId: string, status: EvidenceStatus, reason?: string) => {
    setEvidence(prev =>
      prev.map(e => (e.id === evidenceId ? { ...e, status, rejectionReason: reason } : e))
    );
  };

  const requestEvidenceReplacement = (evidenceId: string, reason: string) => {
    setEvidence(prev =>
      prev.map(e =>
        e.id === evidenceId
          ? {
              ...e,
              status: 'REJECTED',
              rejectionReason: reason,
              replacementRequested: true,
            }
          : e
      )
    );
  };

  // 5. Comments
  const addReviewComment = (item: { assignmentId: string; targetType: ReviewCommentItem['targetType']; targetId?: string; commentText: string; authorName?: string; authorRole?: string; authorEmail?: string }) => {
    const newComment: ReviewCommentItem = {
      id: `c_${Date.now()}`,
      targetType: item.targetType,
      targetId: item.targetId || item.assignmentId,
      authorName: item.authorName || 'Aarav Patel',
      authorRole: item.authorRole || 'Reviewer',
      authorEmail: item.authorEmail || 'reviewer@meil.in',
      commentText: item.commentText,
      createdAt: new Date().toLocaleString(),
    };
    setComments(prev => [...prev, newComment]);
  };

  // 6. Anomaly Resolution
  const acceptAnomalyExplanation = (assignmentId: string) => {
    setSubmissions(prev =>
      prev.map(s => {
        if (s.assignmentId === assignmentId && s.anomaly) {
          return {
            ...s,
            anomaly: {
              ...s.anomaly,
              isExplanationAccepted: true,
            },
          };
        }
        return s;
      })
    );
  };

  // 7. Notifications
  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <NexusDataContext.Provider
      value={{
        organizations,
        users,
        assignments,
        submissions,
        evidence,
        comments,
        auditHistory,
        corrections,
        notifications,
        createAssignment,
        updateAssignmentStatus,
        submitData,
        uploadEvidence,
        approveSubmission,
        requestCorrection,
        rejectSubmission,
        updateEvidenceStatus,
        requestEvidenceReplacement,
        addReviewComment,
        acceptAnomalyExplanation,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </NexusDataContext.Provider>
  );
};

export const useNexusData = () => {
  const context = useContext(NexusDataContext);
  if (!context) {
    throw new Error('useNexusData must be used within a NexusDataProvider');
  }
  return context;
};

