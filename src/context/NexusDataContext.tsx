import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
  code?: string;
  type: 'Group' | 'Subsidiary' | 'BusinessUnit' | 'Project' | 'Site' | 'Department';
  parentId: string | null;
  sector?: string;
  location?: string;
  isActive?: boolean;
  headcount?: number;
  contactPerson?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'reviewer' | 'contributor' | 'management' | 'auditor';
  email: string;
  orgId: string;
  orgScopeId?: string;
  department?: string;
  status?: 'active' | 'pending' | 'suspended' | 'expired';
  mobile?: string;
  lastLogin?: string;
}

export interface ReportingCycle {
  id: string;
  name: string;
  financialYear: string;
  boundary: string;
  packageType: 'Comprehensive (SEBI)' | 'Core (Key KPIs)' | 'Lite (Internal)';
  contributorDue: string;
  reviewerDue: string;
  auditorDue: string;
  managementDue: string;
  lockDate: string;
  status: 'Draft' | 'Active' | 'Under Review' | 'Audited' | 'Approved' | 'Locked' | 'Archived';
  description?: string;
}

export interface IndicatorDefinition {
  id: string;
  code: string;
  name: string;
  section: 'Section A' | 'Section B' | 'Section C';
  principle: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9';
  category: 'Environmental' | 'Social' | 'Governance' | 'Workforce' | 'Occupational Safety' | 'Supplier' | 'CSR';
  isCore: boolean;
  isMandatory: boolean;
  unit: string;
  allowedUnits: string[];
  emissionFactor?: number;
  emissionFactorUnit?: string;
  calculationMethod?: string;
  requiredEvidence: string;
  assignedDepartment: string;
  description: string;
}

export interface ValidationRule {
  id: string;
  code: string;
  name: string;
  category: 'Completeness' | 'Range & Bounds' | 'YoY Variance' | 'Evidence' | 'Cross-Entity';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  thresholdPercent?: number;
  description: string;
  isActive: boolean;
  scope: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actorEmail: string;
  module: 'Users' | 'Organization' | 'Workflow' | 'Reporting Cycle' | 'Indicators' | 'Validation' | 'Evidence' | 'Settings';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'LOCK' | 'APPROVE' | 'REJECT' | 'ESCALATE' | 'REMIND';
  recordId: string;
  details: string;
  ipAddress?: string;
}

export interface SystemSettings {
  organizationName: string;
  corporateCin: string;
  financialYear: string;
  sessionTimeoutMinutes: number;
  mfaRequired: boolean;
  autoEscalateOverdueDays: number;
  fileUploadLimitMb: number;
  allowedFileTypes: string[];
  maintenanceMode: boolean;
  emailAlertsEnabled: boolean;
  autoLockApprovedCycles: boolean;
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
  status: 'draft' | 'submitted' | 'under_review' | 'correction_requested' | 'resubmitted' | 'approved' | 'rejected' | 'audited' | 'management_pending' | 'locked';
  dueDate: string;
  reportingPeriod: string;
  submittedAt?: string;
  riskLevel?: 'Low' | 'Medium' | 'High';
  reviewerId?: string;
  auditorId?: string;
  managementId?: string;
  auditedAt?: string;
  auditorNotes?: string;
  managementApprovedAt?: string;
  managementRemarks?: string;
}

export interface RowReviewDecision {
  rowId: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'CORRECTION_REQUIRED' | 'RESUBMITTED' | 'REJECTED';
  reviewerName?: string;
  reviewerId?: string;
  reviewTimestamp?: string;
  correctionReasonCategory?: string;
  correctionReason?: string;
  suggestedCorrection?: string;
  supportingComment?: string;
  version: number;
  history?: {
    action: 'VERIFIED' | 'CORRECTION_REQUIRED' | 'RESUBMITTED';
    actorName: string;
    timestamp: string;
    comment?: string;
    value: string | number;
    version: number;
  }[];
}

export interface ESGSubmissionRowItem {
  id: string; // e.g. P1-IND-01
  name: string;
  principleId: number;
  principleTitle: string;
  category: string;
  description: string;
  unit: string;
  valueType: string;
  required: boolean;
  isBrsrCore?: boolean;
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
  reviewStatus: 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'CORRECTION_REQUIRED' | 'RESUBMITTED' | 'REJECTED';
  reviewerDecision?: RowReviewDecision;
  version: number;
  lastUpdated: string;
}

export interface ESGReportingDossier {
  dossierId: string;
  contextKey: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  siteId: string;
  siteName: string;
  financialYear: string;
  month: number;
  monthName: string;
  status: 'Submitted' | 'Under Review' | 'Partially Reviewed' | 'Changes Requested' | 'Fully Reviewed' | 'Resubmitted' | 'Approved for Auditor';
  submittingUser: string;
  submittedAt: string;
  lastReviewedAt?: string;
  reviewerName?: string;
  totalRows: number;
  verifiedRows: number;
  correctionRequiredRows: number;
  pendingRows: number;
  rows: Record<string, ESGSubmissionRowItem>;
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
  dossierId?: string;
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
  reportingCycles: ReportingCycle[];
  indicators: IndicatorDefinition[];
  validationRules: ValidationRule[];
  assignments: Assignment[];
  submissions: SubmissionData[];
  evidence: EvidenceDocumentItem[];
  comments: ReviewCommentItem[];
  dossiers: ESGReportingDossier[];
  submitMonthlyDossier: (dossier: Omit<ESGReportingDossier, 'dossierId' | 'status' | 'verifiedRows' | 'correctionRequiredRows' | 'pendingRows'>) => string;
  markRowCorrect: (dossierId: string, rowId: string, reviewerName?: string) => { success: boolean; message: string };
  requestRowCorrection: (
    dossierId: string,
    rowId: string,
    details: {
      category: string;
      reason: string;
      suggestedCorrection?: string;
      supportingComment?: string;
      reviewerName?: string;
    }
  ) => { success: boolean; message: string };
  resubmitRowCorrection: (
    dossierId: string,
    rowId: string,
    newValue: string | number,
    contributorRemarks?: string,
    evidenceFile?: { id: string; name: string; type: string; size: number; url?: string }
  ) => { success: boolean; message: string };
  getVerifiedAuditorRecords: () => {
    dossierId: string;
    projectName: string;
    projectCode: string;
    siteName: string;
    financialYear: string;
    monthName: string;
    row: ESGSubmissionRowItem;
    verifiedAt: string;
    verifiedBy: string;
    version: number;
  }[];

  // Organization CRUD
  addOrganization: (org: Omit<OrganizationNode, 'id'>) => string;
  updateOrganization: (id: string, updates: Partial<OrganizationNode>) => void;
  deleteOrganization: (id: string) => { success: boolean; error?: string };

  // User CRUD
  addUser: (user: Omit<User, 'id'>) => string;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  resetUserPassword: (id: string) => string;

  // Reporting Cycle CRUD
  addReportingCycle: (cycle: Omit<ReportingCycle, 'id'>) => string;
  updateReportingCycle: (id: string, updates: Partial<ReportingCycle>) => void;
  deleteReportingCycle: (id: string) => void;

  // Indicators CRUD
  addIndicator: (ind: Omit<IndicatorDefinition, 'id'>) => string;
  updateIndicator: (id: string, updates: Partial<IndicatorDefinition>) => void;
  deleteIndicator: (id: string) => void;

  // Validation Rules
  toggleValidationRule: (ruleId: string) => void;
  updateValidationRule: (ruleId: string, updates: Partial<ValidationRule>) => void;

  // Workflow actions
  createAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  updateAssignmentStatus: (id: string, status: Assignment['status']) => void;
  submitData: (data: SubmissionData) => void;
  uploadEvidence: (evidence: Omit<EvidenceDocumentItem, 'id'>) => string;
  approveSubmission: (assignmentId: string, reviewerName?: string, comments?: string) => { success: boolean; message: string };
  auditSubmission: (assignmentId: string, auditorName?: string, notes?: string) => { success: boolean; message: string };
  managementSignOff: (assignmentId: string, approverName?: string, remarks?: string) => { success: boolean; message: string };
  requestCorrection: (assignmentId: string, details: { problem: string; requiredCorrection: string; evidenceNeeded: string; deadline: string; comment: string; reviewerName?: string }) => void;
  rejectSubmission: (assignmentId: string, reason: string, reviewerName?: string, comments?: string) => void;
  updateEvidenceStatus: (evidenceId: string, status: EvidenceStatus, reason?: string) => void;
  requestEvidenceReplacement: (evidenceId: string, reason: string) => void;
  addReviewComment: (comment: { assignmentId: string; targetType: ReviewCommentItem['targetType']; targetId?: string; commentText: string; authorName?: string; authorRole?: string; authorEmail?: string }) => void;
  acceptAnomalyExplanation: (assignmentId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  reassignAssignment: (assignmentId: string, newContributorId: string, reassignedBy?: string) => void;
  sendDeadlineReminder: (assignmentId: string, message?: string) => void;
  escalateAssignment: (assignmentId: string, reason?: string) => void;
  logSystemAction: (log: Omit<SystemAuditLog, 'id' | 'timestamp'>) => void;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  resetToFactoryDefaults: () => void;
}

// Helper for localStorage sync
const getStorageItem = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(`Failed reading ${key} from storage:`, e);
  }
  return fallback;
};

const setStorageItem = (key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed saving ${key} to storage:`, e);
  }
};

// Initial Enterprise Organizations
const initialOrganizations: OrganizationNode[] = [
  { id: 'org_meil', name: 'MEIL Group (Corporate HQ)', code: 'MEIL-GRP', type: 'Group', parentId: null, sector: 'Corporate / Infrastructure', location: 'Hyderabad, Telangana', isActive: true, headcount: 14500, contactPerson: 'P. Rao' },
  { id: 'sub_infra', name: 'MEIL Infrastructure Ltd', code: 'MEIL-INFRA', type: 'Subsidiary', parentId: 'org_meil', sector: 'Transportation & Civil', location: 'Hyderabad, Telangana', isActive: true, headcount: 6200, contactPerson: 'K. Reddy' },
  { id: 'sub_energy', name: 'MEIL Clean Energy Ltd', code: 'MEIL-ENERGY', type: 'Subsidiary', parentId: 'org_meil', sector: 'Solar, Wind & Hydro', location: 'Bengaluru, Karnataka', isActive: true, headcount: 3100, contactPerson: 'V. Joshi' },
  { id: 'sub_hydro', name: 'MEIL Hydrocarbons & Drilling', code: 'MEIL-PETRO', type: 'Subsidiary', parentId: 'org_meil', sector: 'Oil & Gas Pipeline', location: 'Ahmedabad, Gujarat', isActive: true, headcount: 2200, contactPerson: 'A. Singhal' },
  { id: 'bu_highways', name: 'Roads & Expressways BU', code: 'BU-HIGHWAYS', type: 'BusinessUnit', parentId: 'sub_infra', sector: 'Expressways & Bridges', location: 'Raipur & Nagpur', isActive: true, headcount: 2400, contactPerson: 'M. Verma' },
  { id: 'bu_irrigation', name: 'Water & Irrigation BU', code: 'BU-WATER', type: 'BusinessUnit', parentId: 'sub_infra', sector: 'Canals & Lift Pumping', location: 'Karimnagar, Telangana', isActive: true, headcount: 1950, contactPerson: 'R. Chander' },
  { id: 'bu_solar', name: 'Solar & Wind BU', code: 'BU-SOLAR', type: 'BusinessUnit', parentId: 'sub_energy', sector: 'Photovoltaic Utility', location: 'Tumkur, Karnataka', isActive: true, headcount: 1200, contactPerson: 'S. Nambiar' },
  { id: 'bu_urban', name: 'Urban Infra & Metro BU', code: 'BU-METRO', type: 'BusinessUnit', parentId: 'sub_infra', sector: 'Rail & Urban Transit', location: 'Hyderabad & Mumbai', isActive: true, headcount: 1850, contactPerson: 'G. Menon' },
  { id: 'proj_exp', name: 'Expressway Project Phase-II (Raipur)', code: 'PRJ-EXP-02', type: 'Project', parentId: 'bu_highways', sector: 'Highways', location: 'Raipur, Chhattisgarh', isActive: true, headcount: 850, contactPerson: 'Suresh Kumar' },
  { id: 'proj_klis', name: 'Kaleshwaram Lift Irrigation Site 4', code: 'PRJ-KLIS-04', type: 'Project', parentId: 'bu_irrigation', sector: 'Water Resources', location: 'Bhopalpally, Telangana', isActive: true, headcount: 920, contactPerson: 'Ananya Roy' },
  { id: 'proj_solar_park', name: 'Pavagada 500MW Solar Park', code: 'PRJ-PAV-SOLAR', type: 'Project', parentId: 'bu_solar', sector: 'Renewables', location: 'Pavagada, Karnataka', isActive: true, headcount: 410, contactPerson: 'Vikram Joshi' },
  { id: 'proj_zojila', name: 'Zojila Tunnel Strategic Transit Pass', code: 'PRJ-ZOJILA-01', type: 'Project', parentId: 'bu_highways', sector: 'Strategic Tunnels', location: 'Sonamarg, J&K', isActive: true, headcount: 1100, contactPerson: 'H. Sharma' },
  { id: 'site_raipur_1', name: 'Raipur Batching & Hot-Mix Plant (Site A)', code: 'SITE-RPR-A', type: 'Site', parentId: 'proj_exp', sector: 'Pavement Works', location: 'Arang, Raipur', isActive: true, headcount: 320, contactPerson: 'Suresh Kumar' },
  { id: 'site_klis_forebay', name: 'Medigadda Pump House & Forebay', code: 'SITE-KLIS-FBY', type: 'Site', parentId: 'proj_klis', sector: 'Heavy Electro-Mechanical', location: 'Medigadda, Telangana', isActive: true, headcount: 450, contactPerson: 'Ananya Roy' },
  { id: 'site_solar_sub', name: 'Pavagada Inverter Block 12 & Substation', code: 'SITE-PVG-SUB', type: 'Site', parentId: 'proj_solar_park', sector: 'Transmission Grid', location: 'Pavagada, Karnataka', isActive: true, headcount: 180, contactPerson: 'Vikram Joshi' },
];

// Initial Enterprise Users
const initialUsers: User[] = [
  { id: 'u_admin', name: 'Rajesh Sharma', role: 'admin', email: 'admin@demo.com', orgId: 'org_meil', department: 'Corporate ESG & Governance', status: 'active', mobile: '+91 98490 12001', lastLogin: 'Today, 09:15 AM' },
  { id: 'u_rev', name: 'Aarav Patel (Review Lead)', role: 'reviewer', email: 'reviewer@demo.com', orgId: 'org_meil', department: 'Quality Assurance & Sustainability', status: 'active', mobile: '+91 98490 12002', lastLogin: 'Today, 10:20 AM' },
  { id: 'u_cont1', name: 'Suresh Kumar (Site Engineer)', role: 'contributor', email: 'contributor@demo.com', orgId: 'proj_exp', orgScopeId: 'proj_exp', department: 'Civil Engineering / Roads', status: 'active', mobile: '+91 98490 12003', lastLogin: 'Yesterday, 04:30 PM' },
  { id: 'u_cont2', name: 'Ananya Roy (Environmental Officer)', role: 'contributor', email: 'ananya.r@meil.in', orgId: 'proj_klis', orgScopeId: 'proj_klis', department: 'EHS & Water Compliance', status: 'active', mobile: '+91 98490 12004', lastLogin: '2 days ago' },
  { id: 'u_cont3', name: 'Vikram Joshi (Plant Manager)', role: 'contributor', email: 'vikram.j@meil.in', orgId: 'proj_solar_park', orgScopeId: 'proj_solar_park', department: 'Renewable Operations', status: 'active', mobile: '+91 98490 12005', lastLogin: 'Oct 04, 2026' },
  { id: 'u_mgmt', name: 'Dr. V. Rao (Chief Sustainability Officer)', role: 'management', email: 'management@demo.com', orgId: 'org_meil', department: 'Executive Board Secretariat', status: 'active', mobile: '+91 98490 12006', lastLogin: 'Today, 08:45 AM' },
  { id: 'u_auditor', name: 'Sanjay Deshmukh (Lead BRSR Assurer)', role: 'auditor', email: 'auditor@demo.com', orgId: 'org_meil', department: 'Independent ESG Assurance', status: 'active', mobile: '+91 98490 12007', lastLogin: 'Today, 11:00 AM' },
  { id: 'u_hr', name: 'Priya Nair (Chief People Officer)', role: 'contributor', email: 'priya.n@meil.in', orgId: 'org_meil', department: 'Human Capital Management', status: 'active', mobile: '+91 98490 12008', lastLogin: 'Oct 01, 2026' },
  { id: 'u_safety', name: 'Arun Verma (Safety Director)', role: 'reviewer', email: 'arun.v@meil.in', orgId: 'org_meil', department: 'Occupational Health & Safety', status: 'active', mobile: '+91 98490 12009', lastLogin: 'Oct 03, 2026' },
];

// Initial Reporting Cycles
const initialReportingCycles: ReportingCycle[] = [
  {
    id: 'cycle_fy27_annual',
    name: 'FY 2026-27 Annual Statutory BRSR Reporting',
    financialYear: '2026-2027',
    boundary: 'MEIL Group Consolidated (100% Subsidiaries)',
    packageType: 'Comprehensive (SEBI)',
    contributorDue: '2027-04-15',
    reviewerDue: '2027-04-30',
    auditorDue: '2027-05-15',
    managementDue: '2027-05-30',
    lockDate: '2027-06-15',
    status: 'Active',
    description: 'Mandatory statutory reporting under SEBI LODR Regulation 34(2)(f) for Top 1000 listed entities.',
  },
  {
    id: 'cycle_fy27_h1',
    name: 'FY 2026-27 H1 Interim Review & BRSR Core Check',
    financialYear: '2026-2027',
    boundary: 'Major Project Sites & High-Impact Plants',
    packageType: 'Core (Key KPIs)',
    contributorDue: '2026-10-15',
    reviewerDue: '2026-10-25',
    auditorDue: '2026-11-05',
    managementDue: '2026-11-15',
    lockDate: '2026-11-30',
    status: 'Under Review',
    description: 'Mid-year ESG performance audit evaluating Scope 1 & 2 emissions, safety LTIFR, and diversity ratios.',
  },
  {
    id: 'cycle_fy26_statutory',
    name: 'FY 2025-26 Annual Statutory BRSR Report',
    financialYear: '2025-2026',
    boundary: 'MEIL Group Consolidated',
    packageType: 'Comprehensive (SEBI)',
    contributorDue: '2026-04-15',
    reviewerDue: '2026-04-30',
    auditorDue: '2026-05-15',
    managementDue: '2026-05-28',
    lockDate: '2026-06-10',
    status: 'Locked',
    description: 'Archived statutory disclosure signed off by the Board of Directors and filed with stock exchanges.',
  },
];

// Initial Master Indicators (BRSR 9 Principles)
const initialIndicators: IndicatorDefinition[] = [
  {
    id: 'ind_scope1_diesel',
    code: 'ENV_GHG_S1',
    name: 'Scope 1 Direct GHG Emissions (Fuel / Diesel)',
    section: 'Section C',
    principle: 'P6',
    category: 'Environmental',
    isCore: true,
    isMandatory: true,
    unit: 'tCO2e',
    allowedUnits: ['tCO2e', 'kgCO2e', 'Liters'],
    emissionFactor: 2.68,
    emissionFactorUnit: 'kg CO2e / Liter diesel',
    calculationMethod: 'Activity Volume (Liters) * 2.68 / 1000',
    requiredEvidence: 'IOCL/BPCL Fuel Registers, Fuel Bowsers Logs, Weighbridge Slips',
    assignedDepartment: 'Plant & Machinery / Site Logistics',
    description: 'Direct greenhouse gas emissions resulting from stationary generators, heavy excavators, and construction fleet.',
  },
  {
    id: 'ind_scope2_elec',
    code: 'ENV_GHG_S2',
    name: 'Scope 2 Location-Based Indirect GHG Emissions (Grid Electricity)',
    section: 'Section C',
    principle: 'P6',
    category: 'Environmental',
    isCore: true,
    isMandatory: true,
    unit: 'tCO2e',
    allowedUnits: ['tCO2e', 'MWh', 'kWh'],
    emissionFactor: 0.82,
    emissionFactorUnit: 'tCO2e / MWh CEA grid factor',
    calculationMethod: 'Purchased Electricity (MWh) * CEA Baseline Emission Factor',
    requiredEvidence: 'High-Tension Utility Bills, DISCOM Invoices, Meter Audit Slips',
    assignedDepartment: 'Electrical & Utility Infrastructure',
    description: 'Indirect emissions from grid electricity consumed at base camp sites, pre-cast yards, and project offices.',
  },
  {
    id: 'ind_water_withdrawal',
    code: 'ENV_WAT_01',
    name: 'Total Water Withdrawal by Source (Groundwater & Surface Water)',
    section: 'Section C',
    principle: 'P6',
    category: 'Environmental',
    isCore: true,
    isMandatory: true,
    unit: 'Kiloliters (KL)',
    allowedUnits: ['Kiloliters (KL)', 'Mega Liters', 'Cubic Meters'],
    calculationMethod: 'Sum of meter logs across borewells, river intake pumps, and tankers',
    requiredEvidence: 'CGWA Flow Meter Calibration Certificate, Tanker Manifests, River Intake Logs',
    assignedDepartment: 'Water Resources & Environmental Cell',
    description: 'Aggregate water withdrawal categorized by groundwater borewells, surface water extraction, and municipality supply.',
  },
  {
    id: 'ind_haz_waste',
    code: 'ENV_WST_HAZ',
    name: 'Hazardous Waste Generated & Disposed (Form 10 Manifest)',
    section: 'Section C',
    principle: 'P6',
    category: 'Environmental',
    isCore: true,
    isMandatory: true,
    unit: 'Metric Tonnes (MT)',
    allowedUnits: ['Metric Tonnes (MT)', 'Kilograms (KG)'],
    calculationMethod: 'Weight documented on Authorized SPCB Form 10 Consignment Slips',
    requiredEvidence: 'State Pollution Control Board Form 10 Manifests, TSDF Disposal Receipts',
    assignedDepartment: 'Health, Safety & Environment (HSE)',
    description: 'Used transformer oil, spent filters, lead-acid batteries, and contaminated chemical packaging generated at sites.',
  },
  {
    id: 'ind_renew_energy',
    code: 'ENV_NRG_REN',
    name: 'Renewable Energy Consumption Share (%)',
    section: 'Section C',
    principle: 'P6',
    category: 'Environmental',
    isCore: true,
    isMandatory: true,
    unit: '%',
    allowedUnits: ['%', 'MWh'],
    calculationMethod: '(Captive Solar Generation / Total Energy Consumed) * 100',
    requiredEvidence: 'CEA Generation Statements, Grid Wheeling Invoices, Inverter SCADA Logs',
    assignedDepartment: 'Solar & Clean Energy Plant Operations',
    description: 'Percentage of total operational energy sourced from solar, wind, and small hydro generation assets.',
  },
  {
    id: 'ind_female_ratio',
    code: 'SOC_DIV_FEM',
    name: 'Permanent Employees Female Diversity Ratio (%)',
    section: 'Section A',
    principle: 'P3',
    category: 'Workforce',
    isCore: true,
    isMandatory: true,
    unit: '%',
    allowedUnits: ['%', 'Headcount'],
    calculationMethod: '(Female Permanent Employees / Total Permanent Headcount) * 100',
    requiredEvidence: 'Audited HR Biometric Database, Statutory PF Register, Form A Employee Register',
    assignedDepartment: 'Corporate Human Resources',
    description: 'Proportion of permanent female staff across engineering, managerial, administrative, and site functions.',
  },
  {
    id: 'ind_ltifr_safety',
    code: 'SOC_SAF_LTI',
    name: 'Lost Time Injury Frequency Rate (LTIFR) per 1M Man-Hours',
    section: 'Section C',
    principle: 'P3',
    category: 'Occupational Safety',
    isCore: true,
    isMandatory: true,
    unit: 'Per Million Man-Hours',
    allowedUnits: ['Per Million Man-Hours', 'Incident Count'],
    calculationMethod: '(Lost Time Injuries * 1,000,000) / Total Man-Hours Worked',
    requiredEvidence: 'Monthly EHS Committee Review Minutes, Form 28 Accident Log, HR Biometric Shift Logs',
    assignedDepartment: 'Corporate Safety & Loss Prevention',
    description: 'Safety performance metric measuring the frequency of lost-time work injuries per 1,000,000 safe man-hours worked.',
  },
  {
    id: 'ind_csr_expenditure',
    code: 'SOC_CSR_01',
    name: 'Total CSR Expenditure on Local Community Development',
    section: 'Section C',
    principle: 'P8',
    category: 'CSR',
    isCore: true,
    isMandatory: true,
    unit: 'INR',
    allowedUnits: ['INR', 'Lakhs INR', 'Crores INR'],
    calculationMethod: 'Sum of disbursements audited under Section 135 Companies Act',
    requiredEvidence: 'Board CSR Committee Approval, Bank Transfer Receipts, Utilization Certs',
    assignedDepartment: 'Corporate Social Responsibility Cell',
    description: 'Community infrastructure investments including rural roads, healthcare clinics, drinking water kiosks, and schools.',
  },
  {
    id: 'ind_code_ethics',
    code: 'GOV_ETH_TRN',
    name: 'Anti-Corruption & Anti-Bribery Code of Conduct Training Coverage (%)',
    section: 'Section C',
    principle: 'P1',
    category: 'Governance',
    isCore: true,
    isMandatory: true,
    unit: '%',
    allowedUnits: ['%', 'Trained Count'],
    calculationMethod: '(Employees completing anti-bribery modules / Total Active Staff) * 100',
    requiredEvidence: 'LMS Completion Records, Employee Code of Conduct Sign-off Sheets',
    assignedDepartment: 'Corporate Legal & Compliance',
    description: 'Percentage of directors, senior executives, and operational engineers trained on MEIL anti-corruption policies.',
  },
];

// Initial Validation Rules Engine
const initialValidationRules: ValidationRule[] = [
  {
    id: 'val_rule_not_null',
    code: 'V_NOT_NULL',
    name: 'Mandatory Field Completeness Check',
    category: 'Completeness',
    severity: 'CRITICAL',
    description: 'Blocks submissions where reported value, activity volume, or reporting unit is empty.',
    isActive: true,
    scope: 'All Principles (P1-P9)',
  },
  {
    id: 'val_rule_diversity_bound',
    code: 'V_DIVERSITY_MAX',
    name: 'Percentage Upper Bound Validator (<= 100%)',
    category: 'Range & Bounds',
    severity: 'CRITICAL',
    description: 'Flags any percentage metric exceeding 100.0% as a critical mathematical invalidation.',
    isActive: true,
    scope: 'Principle 3 (Gender Diversity, Training Share)',
  },
  {
    id: 'val_rule_yoy_variance_40',
    code: 'V_YOY_VARIANCE_40',
    name: 'High Year-on-Year Deviation Threshold (>40%)',
    category: 'YoY Variance',
    severity: 'WARNING',
    thresholdPercent: 40.0,
    description: 'Requires mandatory contributor justification note when reported value varies by >40% from previous year.',
    isActive: true,
    scope: 'Scope 1, Scope 2, Water Withdrawal, Waste',
  },
  {
    id: 'val_rule_mandatory_evidence',
    code: 'V_MANDATORY_EVIDENCE',
    name: 'Required Audit Evidence File Enforcement',
    category: 'Evidence',
    severity: 'CRITICAL',
    description: 'Ensures that disclosures flagged as high statutory materiality must include at least one verified audit file.',
    isActive: true,
    scope: 'Scope 1 GHG, Scope 2 GHG, LTIFR Safety, CSR Spend',
  },
  {
    id: 'val_rule_positive_value',
    code: 'V_POSITIVE_VALUE',
    name: 'Non-Negative Physical Activity Verification',
    category: 'Range & Bounds',
    severity: 'CRITICAL',
    description: 'Guarantees that physical volumes (fuel liters, electricity MWh, water kiloliters) cannot be less than zero.',
    isActive: true,
    scope: 'All Environmental Metrics',
  },
  {
    id: 'val_rule_overdue_alert',
    code: 'V_OVERDUE_ALERT',
    name: 'Reporting Deadline Breach Notification',
    category: 'Completeness',
    severity: 'WARNING',
    description: 'Generates automated governance alert when task remains in draft beyond scheduled due date.',
    isActive: true,
    scope: 'All Assignments',
  },
];

// Initial Assignments
const initialAssignments: Assignment[] = [
  {
    id: 'a_scope1_diesel',
    contributorId: 'u_cont1',
    indicatorCode: 'ENV_GHG_S1',
    indicatorName: 'Scope 1 Direct GHG Emissions (Fuel / Diesel)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_exp',
    priority: 'High',
    status: 'submitted',
    dueDate: '2026-10-15',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-02T11:30:00Z',
    riskLevel: 'Low',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
  },
  {
    id: 'a_scope2_elec',
    contributorId: 'u_cont1',
    indicatorCode: 'ENV_GHG_S2',
    indicatorName: 'Scope 2 Location-Based Indirect GHG Emissions (Grid Electricity)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_exp',
    priority: 'High',
    status: 'under_review',
    dueDate: '2026-10-15',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-02T14:30:00Z',
    riskLevel: 'Medium',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
  },
  {
    id: 'a_water_cons',
    contributorId: 'u_cont2',
    indicatorCode: 'ENV_WAT_01',
    indicatorName: 'Total Water Withdrawal by Source (Groundwater & Surface Water)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_klis',
    priority: 'High',
    status: 'audited',
    dueDate: '2026-10-15',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-01T16:20:00Z',
    riskLevel: 'Medium',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
    auditedAt: '2026-10-05T15:00:00Z',
    auditorNotes: 'Water meters audited against CGWA NOC flow meter logs. Fully substantiated.',
  },
  {
    id: 'a_haz_waste',
    contributorId: 'u_cont2',
    indicatorCode: 'ENV_WST_HAZ',
    indicatorName: 'Hazardous Waste Generated & Disposed (Form 10 Manifest)',
    brsrSection: 'Section C',
    brsrPrinciple: 'P6',
    isBrsrCore: true,
    orgId: 'proj_klis',
    priority: 'Medium',
    status: 'under_review',
    dueDate: '2026-10-15',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-03T09:45:00Z',
    riskLevel: 'Low',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
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
    priority: 'Medium',
    status: 'approved',
    dueDate: '2026-10-15',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-09-29T11:00:00Z',
    riskLevel: 'Low',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
    auditedAt: '2026-10-02T10:00:00Z',
    managementApprovedAt: '2026-10-04T16:00:00Z',
    managementRemarks: 'Approved for BRSR Chapter 6 publication.',
  },
  {
    id: 'a_safety_ltifr',
    contributorId: 'u_cont2',
    indicatorCode: 'SOC_SAF_LTI',
    indicatorName: 'Lost Time Injury Frequency Rate (LTIFR) per 1M Man-Hours',
    brsrSection: 'Section C',
    brsrPrinciple: 'P3',
    isBrsrCore: true,
    orgId: 'proj_klis',
    priority: 'High',
    status: 'correction_requested',
    dueDate: '2026-10-18',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-10-02T16:00:00Z',
    riskLevel: 'High',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
  },
  {
    id: 'a_female_div',
    contributorId: 'u_admin',
    indicatorCode: 'SOC_DIV_FEM',
    indicatorName: 'Permanent Employees Female Diversity Ratio (%)',
    brsrSection: 'Section A',
    brsrPrinciple: 'P3',
    isBrsrCore: true,
    orgId: 'org_meil',
    priority: 'High',
    status: 'draft',
    dueDate: '2026-10-20',
    reportingPeriod: 'FY 2026-27 (Q2)',
    riskLevel: 'High',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
  },
  {
    id: 'a_csr_spend',
    contributorId: 'u_admin',
    indicatorCode: 'SOC_CSR_01',
    indicatorName: 'Total CSR Expenditure on Local Community Development',
    brsrSection: 'Section C',
    brsrPrinciple: 'P8',
    isBrsrCore: true,
    orgId: 'org_meil',
    priority: 'Medium',
    status: 'approved',
    dueDate: '2026-10-20',
    reportingPeriod: 'FY 2026-27 (Q2)',
    submittedAt: '2026-09-26T14:00:00Z',
    riskLevel: 'Low',
    reviewerId: 'u_rev',
    auditorId: 'u_auditor',
    managementId: 'u_mgmt',
    auditedAt: '2026-09-28T11:00:00Z',
    managementApprovedAt: '2026-09-30T17:00:00Z',
  },
];

// Initial Submissions
const initialSubmissions: SubmissionData[] = [
  {
    assignmentId: 'a_scope1_diesel',
    value: 134.0,
    unit: 'tCO2e',
    activityValue: 50000,
    activityUnit: 'Liters',
    emissionFactor: 2.68,
    emissionFactorUnit: 'kg CO2e / Liter diesel',
    calculatedValue: 134.0,
    previousYearValue: 120.0,
    yoyVariancePercent: 11.67,
    yoyVarianceDirection: 'increase',
    calculationSteps: [
      { stepNumber: 1, label: 'Diesel Fuel Consumption', formula: 'Activity Data', value: '50,000 Liters' },
      { stepNumber: 2, label: 'IPCC Emission Factor', formula: 'Constant', value: '2.68 kg CO2e / L' },
      { stepNumber: 3, label: 'Scope 1 Total', formula: '(50,000 * 2.68) / 1,000', value: '134.00 tCO2e' },
    ],
    validationChecks: [
      { id: 'v_1', code: 'V_NOT_NULL', ruleName: 'Completeness Check', severity: 'INFO', status: 'PASSED', message: 'Fuel volume and unit verified.' },
      { id: 'v_2', code: 'V_EVIDENCE_ATTACHED', ruleName: 'Audit File Check', severity: 'INFO', status: 'PASSED', message: 'Fuel logbook PDF attached.' },
    ],
    evidenceIds: ['ev_diesel_1'],
    comments: 'Operational diesel consumed by CAT excavators and batching plant bowsers during Q2 earthworks.',
    submittedAt: '2026-10-02T11:30:00Z',
    submittedBy: 'Suresh Kumar',
  },
  {
    assignmentId: 'a_scope2_elec',
    value: 369.0,
    unit: 'tCO2e',
    activityValue: 450,
    activityUnit: 'MWh',
    emissionFactor: 0.82,
    emissionFactorUnit: 'tCO2e / MWh CEA grid factor',
    calculatedValue: 369.0,
    previousYearValue: 205.0,
    yoyVariancePercent: 80.0,
    yoyVarianceDirection: 'increase',
    calculationSteps: [
      { stepNumber: 1, label: 'Purchased Electricity', formula: 'Meter readings', value: '450.0 MWh' },
      { stepNumber: 2, label: 'Grid Baseline Factor', formula: 'CEA Version 19', value: '0.82 tCO2e / MWh' },
      { stepNumber: 3, label: 'Scope 2 Location-Based', formula: '450.0 * 0.82', value: '369.00 tCO2e' },
    ],
    validationChecks: [
      { id: 'v_11', code: 'V_NOT_NULL', ruleName: 'Completeness Check', severity: 'INFO', status: 'PASSED', message: 'MWh recorded.' },
      { id: 'v_12', code: 'V_YOY_VARIANCE_40', ruleName: 'High YoY Variance Alert', severity: 'WARNING', status: 'WARNING', message: 'YoY surge (+80.0%) exceeds 40% anomaly threshold.' },
    ],
    anomaly: {
      isAnomaly: true,
      yoyChangePercent: 80.0,
      direction: 'increase',
      thresholdPercent: 40.0,
      explanationProvided: 'Commissioned new high-speed asphalt hot mix batching plant operating 20 hours/day.',
      anomalyReason: 'Commissioning of heavy continuous electric asphalt plant.',
      isExplanationAccepted: true,
    },
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
      { id: 'val_31', code: 'V_NOT_NULL', ruleName: 'Completeness Check', severity: 'INFO', status: 'PASSED', message: 'Water meter volume recorded.' },
      { id: 'val_32', code: 'V_YOY_VARIANCE_40', ruleName: 'Water Surge Alert', severity: 'WARNING', status: 'WARNING', message: 'YoY increase (+65.2%) triggers variance check.' },
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
      { id: 'val_41', code: 'V_NOT_NULL', ruleName: 'Manifest Record Check', severity: 'INFO', status: 'PASSED', message: 'Hazardous waste tonnage documented.' },
    ],
    evidenceIds: ['ev_waste_1'],
    comments: 'Form 10 manifest slips signed by approved TSDF operator.',
    submittedAt: '2026-10-03T09:45:00Z',
    submittedBy: 'Ananya Roy',
  },
  {
    assignmentId: 'a_renew_share',
    value: 24.5,
    unit: '%',
    previousYearValue: 18.0,
    yoyVariancePercent: 36.1,
    yoyVarianceDirection: 'increase',
    validationChecks: [
      { id: 'val_51', code: 'V_NOT_NULL', ruleName: 'Completeness Check', severity: 'INFO', status: 'PASSED', message: 'Solar ratio certified.' },
    ],
    evidenceIds: ['ev_solar_1'],
    comments: 'Captive solar power wheeling approved by state electricity regulatory commission.',
    submittedAt: '2026-09-29T11:00:00Z',
    submittedBy: 'Vikram Joshi',
  },
  {
    assignmentId: 'a_csr_spend',
    value: 4500000,
    unit: 'INR',
    previousYearValue: 4200000,
    yoyVariancePercent: 7.14,
    yoyVarianceDirection: 'increase',
    validationChecks: [
      { id: 'val_61', code: 'V_NOT_NULL', ruleName: 'Completeness Check', severity: 'INFO', status: 'PASSED', message: 'CSR disbursement receipt validated.' },
    ],
    evidenceIds: ['ev_diesel_1'],
    comments: 'Disbursed towards construction of secondary school building and solar drinking water kiosk in Arang taluk.',
    submittedAt: '2026-09-26T14:00:00Z',
    submittedBy: 'Rajesh Sharma',
  },
];

// Initial Evidence Documents
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
    status: 'ACCEPTED',
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
    status: 'ACCEPTED',
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
    fileSizeBytes: 2150000,
    url: '/evidence/Pavagada_Solar_Generation_Cert_CEA.pdf',
    uploadedBy: 'Vikram Joshi',
    uploadedOn: '2026-09-29 11:15 AM',
    status: 'ACCEPTED',
  },
];

// Initial Audit History
const initialAuditHistory: ReviewAuditEntry[] = [
  {
    id: 'aud_csr_1',
    assignmentId: 'a_csr_spend',
    indicatorCode: 'SOC_CSR_01',
    indicatorName: 'Total CSR Expenditure on Local Community Development',
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

// Initial System Audit Logs
const initialSystemAuditLogs: SystemAuditLog[] = [
  { id: 'log_1', timestamp: '2026-10-09 11:20 AM', actorName: 'Rajesh Sharma', actorRole: 'ESG Admin', actorEmail: 'admin@demo.com', module: 'Reporting Cycle', action: 'CREATE', recordId: 'cycle_fy27_annual', details: 'Initialized statutory annual reporting boundary for FY 2026-27', ipAddress: '10.24.18.102' },
  { id: 'log_2', timestamp: '2026-10-08 04:45 PM', actorName: 'Rajesh Sharma', actorRole: 'ESG Admin', actorEmail: 'admin@demo.com', module: 'Users', action: 'CREATE', recordId: 'u_auditor', details: 'Provisioned Third-Party BRSR Assurer credentials for Sanjay Deshmukh', ipAddress: '10.24.18.102' },
  { id: 'log_3', timestamp: '2026-10-08 02:15 PM', actorName: 'Aarav Patel', actorRole: 'Reviewer', actorEmail: 'reviewer@demo.com', module: 'Workflow', action: 'STATUS_CHANGE', recordId: 'a_scope1_diesel', details: 'Accepted Scope 1 diesel fuel volume calculation', ipAddress: '10.24.19.45' },
  { id: 'log_4', timestamp: '2026-10-07 10:30 AM', actorName: 'Dr. V. Rao', actorRole: 'Management', actorEmail: 'management@demo.com', module: 'Workflow', action: 'APPROVE', recordId: 'a_renew_share', details: 'Executive sign-off recorded for Renewable Energy disclosure', ipAddress: '10.24.12.08' },
  { id: 'log_5', timestamp: '2026-10-06 05:10 PM', actorName: 'Rajesh Sharma', actorRole: 'ESG Admin', actorEmail: 'admin@demo.com', module: 'Validation', action: 'UPDATE', recordId: 'V_YOY_VARIANCE_40', details: 'Updated YoY anomaly sensitivity threshold to 40.0%', ipAddress: '10.24.18.102' },
];

// Initial System Settings
const initialSystemSettings: SystemSettings = {
  organizationName: 'Megha Engineering & Infrastructures Limited',
  corporateCin: 'U45202TG2006PLC050271',
  financialYear: 'FY 2026-27',
  sessionTimeoutMinutes: 30,
  mfaRequired: true,
  autoEscalateOverdueDays: 3,
  fileUploadLimitMb: 25,
  allowedFileTypes: ['PDF', 'XLSX', 'CSV', 'DOCX', 'PNG', 'JPG'],
  maintenanceMode: false,
  emailAlertsEnabled: true,
  autoLockApprovedCycles: true,
};

// Initial Notifications
const initialNotifications: ReviewerNotification[] = [
  { id: 'notif_1', title: 'New Scope 1 Submission', message: 'Suresh Kumar submitted Scope 1 GHG emissions for Raipur Expressway (50,000 L).', type: 'submission', timestamp: '2 hours ago', isRead: false, assignmentId: 'a_scope1_diesel', priority: 'high' },
  { id: 'notif_2', title: 'Safety LTIFR Correction Due', message: 'Correction requested on LTIFR calculation for KLIS Site 4 pending from Ananya Roy.', type: 'deadline', timestamp: '4 hours ago', isRead: false, assignmentId: 'a_safety_ltifr', priority: 'high' },
  { id: 'notif_3', title: 'YoY Surge Anomaly (+80%)', message: 'High electricity surge detected in Raipur Expressway package.', type: 'anomaly', timestamp: '1 day ago', isRead: false, assignmentId: 'a_scope2_elec', priority: 'medium' },
  { id: 'notif_4', title: 'Management Sign-Off Completed', message: 'Dr. V. Rao approved Renewable Energy KPI for Pavagada Solar Park.', type: 'submission', timestamp: '2 days ago', isRead: true, assignmentId: 'a_renew_share', priority: 'low' },
];

const initialComments: ReviewCommentItem[] = [
  { id: 'c_1', targetType: 'submission', targetId: 'a_scope1_diesel', authorName: 'Aarav Patel', authorRole: 'Reviewer', authorEmail: 'reviewer@demo.com', commentText: 'Please verify that fuel bowser slips match GST invoices from IOCL dealer.', createdAt: 'Oct 02, 2026 11:45 AM' },
  { id: 'c_2', targetType: 'submission', targetId: 'a_scope1_diesel', authorName: 'Suresh Kumar', authorRole: 'Contributor', authorEmail: 'contributor@demo.com', commentText: 'GST invoice batch matching completed and verified on page 2.', createdAt: 'Oct 02, 2026 12:10 PM' },
];

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

const NexusDataContext = createContext<NexusContextType | undefined>(undefined);

export const NexusDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<OrganizationNode[]>(() => getStorageItem('meil_esg_organizations', initialOrganizations));
  const [users, setUsers] = useState<User[]>(() => getStorageItem('meil_esg_users', initialUsers));
  const [reportingCycles, setReportingCycles] = useState<ReportingCycle[]>(() => getStorageItem('meil_esg_cycles', initialReportingCycles));
  const [indicators, setIndicators] = useState<IndicatorDefinition[]>(() => getStorageItem('meil_esg_indicators', initialIndicators));
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(() => getStorageItem('meil_esg_validation_rules', initialValidationRules));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getStorageItem('meil_esg_assignments', initialAssignments));
  const [submissions, setSubmissions] = useState<SubmissionData[]>(() => getStorageItem('meil_esg_submissions', initialSubmissions));
  const [evidence, setEvidence] = useState<EvidenceDocumentItem[]>(() => getStorageItem('meil_esg_evidence', initialEvidence));
  const [comments, setComments] = useState<ReviewCommentItem[]>(() => getStorageItem('meil_esg_comments', initialComments));
  const [auditHistory, setAuditHistory] = useState<ReviewAuditEntry[]>(() => getStorageItem('meil_esg_audit_history', initialAuditHistory));
  const [corrections, setCorrections] = useState<CorrectionRequestDetails[]>(() => getStorageItem('meil_esg_corrections', initialCorrections));
  const [notifications, setNotifications] = useState<ReviewerNotification[]>(() => getStorageItem('meil_esg_notifications', initialNotifications));
  const [systemAuditLogs, setSystemAuditLogs] = useState<SystemAuditLog[]>(() => getStorageItem('meil_esg_system_logs', initialSystemAuditLogs));
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => getStorageItem('meil_esg_settings', initialSystemSettings));
  const [dossiers, setDossiers] = useState<ESGReportingDossier[]>(() => getStorageItem('meil_esg_dossiers', []));

  // Sync state changes to localStorage
  useEffect(() => { setStorageItem('meil_esg_organizations', organizations); }, [organizations]);
  useEffect(() => { setStorageItem('meil_esg_users', users); }, [users]);
  useEffect(() => { setStorageItem('meil_esg_cycles', reportingCycles); }, [reportingCycles]);
  useEffect(() => { setStorageItem('meil_esg_indicators', indicators); }, [indicators]);
  useEffect(() => { setStorageItem('meil_esg_validation_rules', validationRules); }, [validationRules]);
  useEffect(() => { setStorageItem('meil_esg_assignments', assignments); }, [assignments]);
  useEffect(() => { setStorageItem('meil_esg_submissions', submissions); }, [submissions]);
  useEffect(() => { setStorageItem('meil_esg_evidence', evidence); }, [evidence]);
  useEffect(() => { setStorageItem('meil_esg_comments', comments); }, [comments]);
  useEffect(() => { setStorageItem('meil_esg_audit_history', auditHistory); }, [auditHistory]);
  useEffect(() => { setStorageItem('meil_esg_corrections', corrections); }, [corrections]);
  useEffect(() => { setStorageItem('meil_esg_notifications', notifications); }, [notifications]);
  useEffect(() => { setStorageItem('meil_esg_system_logs', systemAuditLogs); }, [systemAuditLogs]);
  useEffect(() => { setStorageItem('meil_esg_settings', systemSettings); }, [systemSettings]);
  useEffect(() => { setStorageItem('meil_esg_dossiers', dossiers); }, [dossiers]);

  // Real-time synchronization across browser tabs and contributor actions
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'meil_esg_dossiers' && e.newValue) {
        try {
          setDossiers(JSON.parse(e.newValue));
        } catch {
          // ignore parse error
        }
      }
      if (e.key === 'meil_esg_assignments' && e.newValue) {
        try {
          setAssignments(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
      if (e.key === 'meil_esg_notifications' && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // System audit log helper
  const logSystemAction = (logData: Omit<SystemAuditLog, 'id' | 'timestamp'>) => {
    const newEntry: SystemAuditLog = {
      ...logData,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString(),
    };
    setSystemAuditLogs(prev => [newEntry, ...prev]);
  };

  // Organization operations
  const addOrganization = (orgData: Omit<OrganizationNode, 'id'>) => {
    const id = `org_${Date.now()}`;
    const newOrg: OrganizationNode = {
      ...orgData,
      id,
      isActive: orgData.isActive ?? true,
    };
    setOrganizations(prev => [...prev, newOrg]);
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Organization',
      action: 'CREATE',
      recordId: id,
      details: `Created ${orgData.type}: ${orgData.name}`,
    });
    return id;
  };

  const updateOrganization = (id: string, updates: Partial<OrganizationNode>) => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Organization',
      action: 'UPDATE',
      recordId: id,
      details: `Updated organization details for record ${id}`,
    });
  };

  const deleteOrganization = (id: string) => {
    // Prevent delete if children exist
    const hasChildren = organizations.some(o => o.parentId === id);
    if (hasChildren) {
      return { success: false, error: 'Cannot delete entity with existing child nodes. Reassign children first.' };
    }
    setOrganizations(prev => prev.filter(o => o.id !== id));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Organization',
      action: 'DELETE',
      recordId: id,
      details: `Deleted entity ${id}`,
    });
    return { success: true };
  };

  // User operations
  const addUser = (userData: Omit<User, 'id'>) => {
    const id = `u_${Date.now()}`;
    const newUser: User = {
      ...userData,
      id,
      status: userData.status || 'active',
      lastLogin: 'Never',
    };
    setUsers(prev => [...prev, newUser]);
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Users',
      action: 'CREATE',
      recordId: id,
      details: `Provisioned user account for ${userData.name} (${userData.role})`,
    });
    return id;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Users',
      action: 'UPDATE',
      recordId: id,
      details: `Updated user profile/scope for ${id}`,
    });
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Users',
      action: 'DELETE',
      recordId: id,
      details: `De-provisioned user account ${id}`,
    });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          logSystemAction({
            actorName: 'ESG Administrator',
            actorRole: 'admin',
            actorEmail: 'admin@demo.com',
            module: 'Users',
            action: 'STATUS_CHANGE',
            recordId: id,
            details: `Account status toggled to ${nextStatus}`,
          });
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const resetUserPassword = (id: string) => {
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Users',
      action: 'UPDATE',
      recordId: id,
      details: `Dispatched secure password reset link to user email`,
    });
    return 'Password reset link dispatched to official email.';
  };

  // Reporting Cycle operations
  const addReportingCycle = (cycleData: Omit<ReportingCycle, 'id'>) => {
    const id = `cycle_${Date.now()}`;
    const newCycle: ReportingCycle = { ...cycleData, id };
    setReportingCycles(prev => [newCycle, ...prev]);
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Reporting Cycle',
      action: 'CREATE',
      recordId: id,
      details: `Established reporting cycle: ${cycleData.name}`,
    });
    return id;
  };

  const updateReportingCycle = (id: string, updates: Partial<ReportingCycle>) => {
    setReportingCycles(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Reporting Cycle',
      action: 'UPDATE',
      recordId: id,
      details: `Updated parameters for reporting cycle ${id}`,
    });
  };

  const deleteReportingCycle = (id: string) => {
    setReportingCycles(prev => prev.filter(c => c.id !== id));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Reporting Cycle',
      action: 'DELETE',
      recordId: id,
      details: `Deleted cycle ${id}`,
    });
  };

  // Indicator Master operations
  const addIndicator = (indData: Omit<IndicatorDefinition, 'id'>) => {
    const id = `ind_${Date.now()}`;
    const newInd: IndicatorDefinition = { ...indData, id };
    setIndicators(prev => [...prev, newInd]);
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Indicators',
      action: 'CREATE',
      recordId: id,
      details: `Added new BRSR indicator: ${indData.code} - ${indData.name}`,
    });
    return id;
  };

  const updateIndicator = (id: string, updates: Partial<IndicatorDefinition>) => {
    setIndicators(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Indicators',
      action: 'UPDATE',
      recordId: id,
      details: `Updated indicator configuration ${id}`,
    });
  };

  const deleteIndicator = (id: string) => {
    setIndicators(prev => prev.filter(i => i.id !== id));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Indicators',
      action: 'DELETE',
      recordId: id,
      details: `Removed indicator ${id}`,
    });
  };

  // Validation Rules
  const toggleValidationRule = (ruleId: string) => {
    setValidationRules(prev =>
      prev.map(r => {
        if (r.id === ruleId) {
          const nextActive = !r.isActive;
          logSystemAction({
            actorName: 'ESG Administrator',
            actorRole: 'admin',
            actorEmail: 'admin@demo.com',
            module: 'Validation',
            action: 'STATUS_CHANGE',
            recordId: ruleId,
            details: `Toggled rule ${r.code} to ${nextActive ? 'Active' : 'Disabled'}`,
          });
          return { ...r, isActive: nextActive };
        }
        return r;
      })
    );
  };

  const updateValidationRule = (ruleId: string, updates: Partial<ValidationRule>) => {
    setValidationRules(prev => prev.map(r => r.id === ruleId ? { ...r, ...updates } : r));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Validation',
      action: 'UPDATE',
      recordId: ruleId,
      details: `Updated validation rule thresholds/severity for ${ruleId}`,
    });
  };

  // Workflow Assignment Management
  const createAssignment = (assignmentData: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: `a_${Date.now()}`
    };
    setAssignments(prev => [...prev, newAssignment]);
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Workflow',
      action: 'CREATE',
      recordId: newAssignment.id,
      details: `Assigned disclosure ${assignmentData.indicatorCode} to contributor`,
    });
  };

  const updateAssignmentStatus = (id: string, status: Assignment['status']) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const reassignAssignment = (assignmentId: string, newContributorId: string, reassignedBy = 'ESG Admin') => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, contributorId: newContributorId, status: 'draft' } : a));
    logSystemAction({
      actorName: reassignedBy,
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Workflow',
      action: 'UPDATE',
      recordId: assignmentId,
      details: `Reassigned task ${assignmentId} to contributor ${newContributorId}`,
    });
  };

  const sendDeadlineReminder = (assignmentId: string, customMessage?: string) => {
    const assign = assignments.find(a => a.id === assignmentId);
    if (!assign) return;
    const contributor = users.find(u => u.id === assign.contributorId);
    const newNotif: ReviewerNotification = {
      id: `notif_${Date.now()}`,
      title: 'Statutory Deadline Reminder',
      message: customMessage || `Reminder: ESG submission for ${assign.indicatorName} is due by ${assign.dueDate}.`,
      type: 'deadline',
      timestamp: 'Just now',
      isRead: false,
      assignmentId,
      priority: 'high',
    };
    setNotifications(prev => [newNotif, ...prev]);
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Workflow',
      action: 'REMIND',
      recordId: assignmentId,
      details: `Issued formal deadline reminder to ${contributor?.name || 'contributor'}`,
    });
  };

  const escalateAssignment = (assignmentId: string, reason = 'Overdue submission milestone breached') => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, priority: 'High', riskLevel: 'High' } : a));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Workflow',
      action: 'ESCALATE',
      recordId: assignmentId,
      details: `Escalated delayed workflow milestone: ${reason}`,
    });
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

  // Reviewer approval -> advances to audited / reviewer verified
  const approveSubmission = (assignmentId: string, reviewerName = 'Aarav Patel (Review Lead)', commentText = 'Approved and verified for BRSR audit.'): { success: boolean; message: string } => {
    const assign = assignments.find(a => a.id === assignmentId);
    const sub = submissions.find(s => s.assignmentId === assignmentId);
    if (!assign) return { success: false, message: 'Assignment not found' };

    const criticalCheck = sub?.validationChecks?.find(v => v.severity === 'CRITICAL' && v.status === 'FAILED');
    if (criticalCheck) {
      return {
        success: false,
        message: `Approval blocked: Critical validation check failed (${criticalCheck.ruleName} - ${criticalCheck.message})`,
      };
    }

    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'audited' } : a));
    if (sub?.evidenceIds) {
      setEvidence(prev => prev.map(e => sub.evidenceIds?.includes(e.id) ? { ...e, status: 'ACCEPTED' } : e));
    }

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

    logSystemAction({
      actorName: reviewerName,
      actorRole: 'reviewer',
      actorEmail: 'reviewer@demo.com',
      module: 'Workflow',
      action: 'APPROVE',
      recordId: assignmentId,
      details: `Reviewer verified submission ${assign.indicatorCode}`,
    });

    return { success: true, message: 'Submission successfully verified by Reviewer.' };
  };

  // Auditor Verification -> advances to management_pending
  const auditSubmission = (assignmentId: string, auditorName = 'Sanjay Deshmukh (Lead BRSR Assurer)', notes = 'Statutory sample testing & methodology verified'): { success: boolean; message: string } => {
    const assign = assignments.find(a => a.id === assignmentId);
    if (!assign) return { success: false, message: 'Assignment not found' };

    setAssignments(prev => prev.map(a => a.id === assignmentId ? {
      ...a,
      status: 'management_pending',
      auditedAt: new Date().toISOString(),
      auditorNotes: notes,
    } : a));

    logSystemAction({
      actorName: auditorName,
      actorRole: 'auditor',
      actorEmail: 'auditor@demo.com',
      module: 'Workflow',
      action: 'APPROVE',
      recordId: assignmentId,
      details: `Independent BRSR assurance sign-off logged: ${notes}`,
    });

    return { success: true, message: 'Auditor verification complete. Advanced to Executive Management.' };
  };

  // Management Sign-Off -> Final Approved
  const managementSignOff = (assignmentId: string, approverName = 'Dr. V. Rao (Chief Sustainability Officer)', remarks = 'Approved for corporate publication'): { success: boolean; message: string } => {
    const assign = assignments.find(a => a.id === assignmentId);
    if (!assign) return { success: false, message: 'Assignment not found' };

    setAssignments(prev => prev.map(a => a.id === assignmentId ? {
      ...a,
      status: 'approved',
      managementApprovedAt: new Date().toISOString(),
      managementRemarks: remarks,
    } : a));

    logSystemAction({
      actorName: approverName,
      actorRole: 'management',
      actorEmail: 'management@demo.com',
      module: 'Workflow',
      action: 'APPROVE',
      recordId: assignmentId,
      details: `Executive Board sign-off recorded for disclosure ${assign.indicatorCode}`,
    });

    return { success: true, message: 'Executive Management sign-off recorded. Final report ready.' };
  };

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

    logSystemAction({
      actorName: details.reviewerName || 'Aarav Patel',
      actorRole: 'reviewer',
      actorEmail: 'reviewer@demo.com',
      module: 'Workflow',
      action: 'REJECT',
      recordId: assignmentId,
      details: `Returned disclosure for correction: ${details.problem}`,
    });
  };

  const rejectSubmission = (assignmentId: string, reason: string, reviewerName = 'Review Lead') => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'rejected' } : a));
    logSystemAction({
      actorName: reviewerName,
      actorRole: 'reviewer',
      actorEmail: 'reviewer@demo.com',
      module: 'Workflow',
      action: 'REJECT',
      recordId: assignmentId,
      details: `Rejected submission: ${reason}`,
    });
  };

  const updateEvidenceStatus = (evidenceId: string, status: EvidenceStatus, reason?: string) => {
    setEvidence(prev =>
      prev.map(e => {
        if (e.id === evidenceId) {
          const comments = reason ? [...(e.comments || []), `[STATUS: ${status}] ${reason}`] : e.comments;
          return { ...e, status, comments };
        }
        return e;
      })
    );
  };

  const requestEvidenceReplacement = (evidenceId: string, reason: string) => {
    updateEvidenceStatus(evidenceId, 'REPLACEMENT_REQUESTED', reason);
  };

  const addReviewComment = (comment: { assignmentId: string; targetType: ReviewCommentItem['targetType']; targetId?: string; commentText: string; authorName?: string; authorRole?: string; authorEmail?: string }) => {
    const newComment: ReviewCommentItem = {
      id: `c_${Date.now()}`,
      targetType: comment.targetType,
      targetId: comment.targetId || comment.assignmentId,
      authorName: comment.authorName || 'Reviewer',
      authorRole: comment.authorRole || 'Quality Lead',
      authorEmail: comment.authorEmail || 'reviewer@demo.com',
      commentText: comment.commentText,
      createdAt: new Date().toLocaleString(),
    };
    setComments(prev => [...prev, newComment]);
  };

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

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateSystemSettings = (settingsUpdates: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...settingsUpdates }));
    logSystemAction({
      actorName: 'ESG Administrator',
      actorRole: 'admin',
      actorEmail: 'admin@demo.com',
      module: 'Settings',
      action: 'UPDATE',
      recordId: 'global_settings',
      details: 'Updated global system parameters and security controls',
    });
  };

  // =========================================================================
  // PRODUCTION ESG DOSSIER & ROW-LEVEL REVIEW WORKFLOW METHODS
  // =========================================================================

  // 1. Submit Monthly ESG Reporting Dossier
  const submitMonthlyDossier = (dossierData: Omit<ESGReportingDossier, 'dossierId' | 'status' | 'verifiedRows' | 'correctionRequiredRows' | 'pendingRows'>): string => {
    const dossierId = `dossier_${dossierData.projectId}_${dossierData.siteId}_${dossierData.financialYear.replace(/\s+/g, '_')}_M${dossierData.month}`;
    const rowKeys = Object.keys(dossierData.rows || {});
    const totalRows = rowKeys.length;

    // Initialize row statuses to SUBMITTED if not set
    const initializedRows: Record<string, ESGSubmissionRowItem> = {};
    rowKeys.forEach((key) => {
      const row = dossierData.rows[key];
      initializedRows[key] = {
        ...row,
        reviewStatus: row.reviewStatus || 'SUBMITTED',
        version: row.version || 1,
      };
    });

    const newDossier: ESGReportingDossier = {
      ...dossierData,
      dossierId,
      status: 'Submitted',
      totalRows,
      verifiedRows: 0,
      correctionRequiredRows: 0,
      pendingRows: totalRows,
      rows: initializedRows,
    };

    setDossiers((prev) => {
      const filtered = prev.filter((d) => d.dossierId !== dossierId);
      return [newDossier, ...filtered];
    });

    // Also link/update assignment in general pipeline for multi-channel review
    const matchingAssignment = assignments.find((a) => a.orgId === dossierData.projectId);
    if (matchingAssignment) {
      updateAssignmentStatus(matchingAssignment.id, 'under_review');
    }

    // Push notification to reviewers
    const newNotification: ReviewerNotification = {
      id: `notif_${Date.now()}`,
      title: 'New Monthly ESG Dossier Submitted',
      message: `${dossierData.submittingUser} submitted ${totalRows} ESG indicators for ${dossierData.projectName} (${dossierData.siteName}) - ${dossierData.monthName} ${dossierData.financialYear}.`,
      type: 'submission',
      timestamp: 'Just now',
      isRead: false,
      assignmentId: matchingAssignment?.id || dossierId,
      priority: 'high',
    };
    setNotifications((prev) => [newNotification, ...prev]);

    logSystemAction({
      actorName: dossierData.submittingUser,
      actorRole: 'contributor',
      actorEmail: 'contributor@demo.com',
      module: 'Workflow',
      action: 'SUBMIT',
      recordId: dossierId,
      details: `Submitted monthly ESG dossier for ${dossierData.projectName} (${dossierData.monthName} ${dossierData.financialYear}) containing ${totalRows} indicators`,
    });

    return dossierId;
  };

  // 2. Row-level Correct: marks row as VERIFIED, updates dossier counters, publishes to Auditor View
  const markRowCorrect = (dossierId: string, rowId: string, reviewerName = 'Aarav Patel (Review Lead)'): { success: boolean; message: string } => {
    let outcomeMessage = '';
    let success = false;

    setDossiers((prev) =>
      prev.map((d) => {
        if (d.dossierId !== dossierId) return d;

        const targetRow = d.rows[rowId];
        if (!targetRow) {
          outcomeMessage = `Row ${rowId} not found in submission ${dossierId}`;
          return d;
        }

        const nowTimestamp = new Date().toLocaleString();
        const currentVersion = targetRow.version || 1;
        const previousHistory = targetRow.reviewerDecision?.history || [];

        const updatedDecision: RowReviewDecision = {
          rowId,
          status: 'VERIFIED',
          reviewerName,
          reviewerId: 'u_rev',
          reviewTimestamp: nowTimestamp,
          version: currentVersion,
          history: [
            ...previousHistory,
            {
              action: 'VERIFIED',
              actorName: reviewerName,
              timestamp: nowTimestamp,
              value: targetRow.currentValue,
              version: currentVersion,
              comment: 'Verified as accurate according to statutory SEBI BRSR guidelines.',
            },
          ],
        };

        const updatedRow: ESGSubmissionRowItem = {
          ...targetRow,
          reviewStatus: 'VERIFIED',
          reviewerDecision: updatedDecision,
          lastUpdated: nowTimestamp,
        };

        const updatedRows = {
          ...d.rows,
          [rowId]: updatedRow,
        };

        // Recalculate dossier counters
        const rowVals = Object.values(updatedRows);
        const verifiedCount = rowVals.filter((r) => r.reviewStatus === 'VERIFIED').length;
        const correctionCount = rowVals.filter((r) => r.reviewStatus === 'CORRECTION_REQUIRED').length;
        const pendingCount = rowVals.filter((r) => r.reviewStatus === 'SUBMITTED' || r.reviewStatus === 'UNDER_REVIEW' || r.reviewStatus === 'RESUBMITTED').length;

        let nextDossierStatus: ESGReportingDossier['status'] = 'Under Review';
        if (correctionCount > 0) {
          nextDossierStatus = 'Changes Requested';
        } else if (verifiedCount === d.totalRows && d.totalRows > 0) {
          nextDossierStatus = 'Fully Reviewed';
        } else if (verifiedCount > 0) {
          nextDossierStatus = 'Partially Reviewed';
        }

        // Record audit trail entry for verified row
        const auditEntry: ReviewAuditEntry = {
          id: `aud_row_${Date.now()}_${rowId}`,
          assignmentId: dossierId,
          indicatorCode: targetRow.id,
          indicatorName: targetRow.name,
          submittedBy: d.submittingUser,
          reviewedBy: reviewerName,
          reviewDate: nowTimestamp,
          decision: 'APPROVE',
          previousValue: targetRow.previousMonthValue,
          newValue: targetRow.currentValue,
          unit: targetRow.unit,
          reason: 'Row confirmed accurate and substantiated with statutory evidence.',
          evidenceSummary: targetRow.evidenceFiles.length ? `${targetRow.evidenceFiles.length} file(s) attached` : 'Self-declared',
          comments: `Verified row ${targetRow.id} (${targetRow.name})`,
          scopeProject: `${d.projectName} (${d.siteName})`,
          reportingPeriod: `${d.monthName} ${d.financialYear}`,
        };
        setAuditHistory((curr) => [auditEntry, ...curr]);

        success = true;
        outcomeMessage = `Row "${targetRow.name}" successfully verified and published to Auditor View.`;

        return {
          ...d,
          rows: updatedRows,
          verifiedRows: verifiedCount,
          correctionRequiredRows: correctionCount,
          pendingRows: pendingCount,
          status: nextDossierStatus,
          lastReviewedAt: nowTimestamp,
          reviewerName,
        };
      })
    );

    logSystemAction({
      actorName: reviewerName,
      actorRole: 'reviewer',
      actorEmail: 'reviewer@demo.com',
      module: 'Workflow',
      action: 'APPROVE',
      recordId: `${dossierId}_${rowId}`,
      details: `Verified indicator row ${rowId} in dossier ${dossierId}`,
    });

    return { success, message: outcomeMessage || 'Row verified successfully' };
  };

  // 3. Row-level Incorrect: marks row as CORRECTION_REQUIRED, creates Contributor Correction item
  const requestRowCorrection = (
    dossierId: string,
    rowId: string,
    details: {
      category: string;
      reason: string;
      suggestedCorrection?: string;
      supportingComment?: string;
      reviewerName?: string;
    }
  ): { success: boolean; message: string } => {
    if (!details.reason || !details.reason.trim()) {
      return { success: false, message: 'Rejection reason is mandatory.' };
    }

    const reviewerName = details.reviewerName || 'Aarav Patel (Review Lead)';
    let outcomeMessage = '';
    let success = false;

    setDossiers((prev) =>
      prev.map((d) => {
        if (d.dossierId !== dossierId) return d;

        const targetRow = d.rows[rowId];
        if (!targetRow) {
          outcomeMessage = `Row ${rowId} not found in submission ${dossierId}`;
          return d;
        }

        const nowTimestamp = new Date().toLocaleString();
        const currentVersion = targetRow.version || 1;
        const previousHistory = targetRow.reviewerDecision?.history || [];

        const updatedDecision: RowReviewDecision = {
          rowId,
          status: 'CORRECTION_REQUIRED',
          reviewerName,
          reviewerId: 'u_rev',
          reviewTimestamp: nowTimestamp,
          correctionReasonCategory: details.category || 'Incorrect value',
          correctionReason: details.reason,
          suggestedCorrection: details.suggestedCorrection,
          supportingComment: details.supportingComment,
          version: currentVersion,
          history: [
            ...previousHistory,
            {
              action: 'CORRECTION_REQUIRED',
              actorName: reviewerName,
              timestamp: nowTimestamp,
              value: targetRow.currentValue,
              version: currentVersion,
              comment: `[${details.category}] ${details.reason}`,
            },
          ],
        };

        const updatedRow: ESGSubmissionRowItem = {
          ...targetRow,
          reviewStatus: 'CORRECTION_REQUIRED',
          reviewerDecision: updatedDecision,
          lastUpdated: nowTimestamp,
        };

        const updatedRows = {
          ...d.rows,
          [rowId]: updatedRow,
        };

        // Recalculate dossier counters
        const rowVals = Object.values(updatedRows);
        const verifiedCount = rowVals.filter((r) => r.reviewStatus === 'VERIFIED').length;
        const correctionCount = rowVals.filter((r) => r.reviewStatus === 'CORRECTION_REQUIRED').length;
        const pendingCount = rowVals.filter((r) => r.reviewStatus === 'SUBMITTED' || r.reviewStatus === 'UNDER_REVIEW' || r.reviewStatus === 'RESUBMITTED').length;

        // Create correction item in Contributor Correction Center
        const corrId = `corr_${Date.now()}_${rowId}`;
        const newCorrItem: CorrectionRequestDetails = {
          id: corrId,
          assignmentId: dossierId,
          problem: `[${details.category}] ${details.reason}`,
          requiredCorrection: details.suggestedCorrection || 'Provide corrected monthly value and supporting audit documents.',
          evidenceNeeded: 'Supporting calibration/invoice documentation required',
          deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          reviewerComment: details.supportingComment || details.reason,
          requestedAt: nowTimestamp,
          requestedBy: reviewerName,
          status: 'PENDING_CONTRIBUTOR',
          previousValue: targetRow.currentValue,
        };
        setCorrections((curr) => [newCorrItem, ...curr]);

        // Push notification to contributor
        const contributorNotif: ReviewerNotification = {
          id: `notif_corr_${Date.now()}`,
          title: `Correction Required: ${targetRow.name}`,
          message: `${reviewerName} requested correction on ${targetRow.name} (${d.projectName}): ${details.reason}`,
          type: 'deadline',
          timestamp: 'Just now',
          isRead: false,
          assignmentId: dossierId,
          priority: 'high',
        };
        setNotifications((curr) => [contributorNotif, ...curr]);

        success = true;
        outcomeMessage = `Correction requested for "${targetRow.name}". Sent to Contributor's Correction Center.`;

        return {
          ...d,
          rows: updatedRows,
          verifiedRows: verifiedCount,
          correctionRequiredRows: correctionCount,
          pendingRows: pendingCount,
          status: 'Changes Requested',
          lastReviewedAt: nowTimestamp,
          reviewerName,
        };
      })
    );

    logSystemAction({
      actorName: reviewerName,
      actorRole: 'reviewer',
      actorEmail: 'reviewer@demo.com',
      module: 'Workflow',
      action: 'REJECT',
      recordId: `${dossierId}_${rowId}`,
      details: `Flagged row ${rowId} for correction: ${details.reason}`,
    });

    return { success, message: outcomeMessage || 'Correction requested successfully' };
  };

  // 4. Resubmit Row Correction by Contributor
  const resubmitRowCorrection = (
    dossierId: string,
    rowId: string,
    newValue: string | number,
    contributorRemarks = 'Corrected according to reviewer feedback.',
    evidenceFile?: { id: string; name: string; type: string; size: number; url?: string }
  ): { success: boolean; message: string } => {
    let success = false;
    let message = '';

    setDossiers((prev) =>
      prev.map((d) => {
        if (d.dossierId !== dossierId) return d;

        const targetRow = d.rows[rowId];
        if (!targetRow) return d;

        const nextVersion = (targetRow.version || 1) + 1;
        const nowTimestamp = new Date().toLocaleString();
        const previousHistory = targetRow.reviewerDecision?.history || [];

        const updatedHistory = [
          ...previousHistory,
          {
            action: 'RESUBMITTED' as const,
            actorName: d.submittingUser || 'Data Contributor',
            timestamp: nowTimestamp,
            value: newValue,
            version: nextVersion,
            comment: contributorRemarks,
          },
        ];

        const updatedRow: ESGSubmissionRowItem = {
          ...targetRow,
          currentValue: newValue,
          remarks: contributorRemarks,
          version: nextVersion,
          reviewStatus: 'RESUBMITTED',
          lastUpdated: nowTimestamp,
          evidenceFiles: evidenceFile
            ? [
                ...targetRow.evidenceFiles,
                {
                  id: evidenceFile.id,
                  name: evidenceFile.name,
                  type: evidenceFile.type,
                  size: evidenceFile.size,
                  uploadedAt: nowTimestamp,
                  url: evidenceFile.url,
                },
              ]
            : targetRow.evidenceFiles,
          reviewerDecision: targetRow.reviewerDecision
            ? {
                ...targetRow.reviewerDecision,
                status: 'RESUBMITTED',
                version: nextVersion,
                history: updatedHistory,
              }
            : undefined,
        };

        const updatedRows = {
          ...d.rows,
          [rowId]: updatedRow,
        };

        const rowVals = Object.values(updatedRows);
        const verifiedCount = rowVals.filter((r) => r.reviewStatus === 'VERIFIED').length;
        const correctionCount = rowVals.filter((r) => r.reviewStatus === 'CORRECTION_REQUIRED').length;
        const pendingCount = rowVals.filter((r) => r.reviewStatus === 'SUBMITTED' || r.reviewStatus === 'UNDER_REVIEW' || r.reviewStatus === 'RESUBMITTED').length;

        // Also update corrections state
        setCorrections((curr) =>
          curr.map((c) =>
            c.assignmentId === dossierId || c.problem.includes(rowId)
              ? { ...c, status: 'RESUBMITTED' }
              : c
          )
        );

        // Notify reviewer
        const resubmitNotif: ReviewerNotification = {
          id: `notif_resub_${Date.now()}`,
          title: `Row Resubmitted for Review: ${targetRow.name}`,
          message: `${d.submittingUser} corrected and resubmitted ${targetRow.name} (${d.projectName}) - New value: ${newValue} ${targetRow.unit}.`,
          type: 'submission',
          timestamp: 'Just now',
          isRead: false,
          assignmentId: dossierId,
          priority: 'high',
        };
        setNotifications((curr) => [resubmitNotif, ...curr]);

        success = true;
        message = `Row "${targetRow.name}" resubmitted with Revision v${nextVersion}. Awaiting Reviewer sign-off.`;

        return {
          ...d,
          rows: updatedRows,
          verifiedRows: verifiedCount,
          correctionRequiredRows: correctionCount,
          pendingRows: pendingCount,
          status: correctionCount > 0 ? 'Changes Requested' : 'Resubmitted',
        };
      })
    );

    return { success, message };
  };

  // 5. Get verified records for authorized Auditor View
  const getVerifiedAuditorRecords = () => {
    const verifiedList: {
      dossierId: string;
      projectName: string;
      projectCode: string;
      siteName: string;
      financialYear: string;
      monthName: string;
      row: ESGSubmissionRowItem;
      verifiedAt: string;
      verifiedBy: string;
      version: number;
    }[] = [];

    dossiers.forEach((d) => {
      Object.values(d.rows).forEach((r) => {
        if (r.reviewStatus === 'VERIFIED') {
          verifiedList.push({
            dossierId: d.dossierId,
            projectName: d.projectName,
            projectCode: d.projectCode,
            siteName: d.siteName,
            financialYear: d.financialYear,
            monthName: d.monthName,
            row: r,
            verifiedAt: r.reviewerDecision?.reviewTimestamp || r.lastUpdated,
            verifiedBy: r.reviewerDecision?.reviewerName || 'Aarav Patel (Review Lead)',
            version: r.version || 1,
          });
        }
      });
    });

    return verifiedList;
  };

  const resetToFactoryDefaults = () => {
    localStorage.clear();
    setOrganizations(initialOrganizations);
    setUsers(initialUsers);
    setReportingCycles(initialReportingCycles);
    setIndicators(initialIndicators);
    setValidationRules(initialValidationRules);
    setAssignments(initialAssignments);
    setSubmissions(initialSubmissions);
    setEvidence(initialEvidence);
    setAuditHistory(initialAuditHistory);
    setSystemAuditLogs(initialSystemAuditLogs);
    setSystemSettings(initialSystemSettings);
    setNotifications(initialNotifications);
  };

  return (
    <NexusDataContext.Provider
      value={{
        organizations,
        users,
        reportingCycles,
        indicators,
        validationRules,
        assignments,
        submissions,
        evidence,
        comments,
        auditHistory,
        corrections,
        notifications,
        systemAuditLogs,
        systemSettings,

        addOrganization,
        updateOrganization,
        deleteOrganization,

        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resetUserPassword,

        addReportingCycle,
        updateReportingCycle,
        deleteReportingCycle,

        addIndicator,
        updateIndicator,
        deleteIndicator,

        toggleValidationRule,
        updateValidationRule,

        createAssignment,
        updateAssignmentStatus,
        submitData,
        uploadEvidence,
        approveSubmission,
        auditSubmission,
        managementSignOff,
        requestCorrection,
        rejectSubmission,
        updateEvidenceStatus,
        requestEvidenceReplacement,
        addReviewComment,
        acceptAnomalyExplanation,
        markNotificationRead,
        markAllNotificationsRead,
        reassignAssignment,
        sendDeadlineReminder,
        escalateAssignment,
        logSystemAction,
        updateSystemSettings,
        resetToFactoryDefaults,

        dossiers,
        submitMonthlyDossier,
        markRowCorrect,
        requestRowCorrection,
        resubmitRowCorrection,
        getVerifiedAuditorRecords,
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
