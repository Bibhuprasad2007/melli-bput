import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { PRINCIPLES_CONFIG, findFieldById } from '../data/contributorPrinciplesData';
import { useNexusData } from '../../../context/NexusDataContext';

export interface ContributorProjectScope {
  year: string;
  reportingYear: string;
  projectId: string;
  projectName: string;
  projectCode: string;
  subsidiary: string;
  businessUnit: string;
  site: string;
  siteName: string;
  department: string;
}

export interface FieldEvidenceItem {
  id: string;
  fieldId: string;
  documentName: string;
  documentType: string;
  documentNumber: string;
  documentDate: string;
  fileFormat: string;
  fileSizeBytes: number;
  uploadedBy: string;
  uploadedOn: string;
  status: 'UPLOADED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'SUPERSEDED';
  rejectionReason?: string;
  version: number;
  description?: string;
  issuingAuthority?: string;
  isAiExtracted?: boolean;
}

export interface FieldEntryState {
  fieldId: string;
  value: number | string;
  unit: string;
  reportingPeriod: string;
  source: 'Invoice' | 'Meter' | 'ERP' | 'HR System' | 'Manual Register' | 'Supplier' | 'Contractor' | 'Survey' | 'Estimate';
  quality: 'HIGH' | 'MEDIUM' | 'LOW' | 'ESTIMATED';
  estimationMethod?: string;
  remarks: string;
  isNotApplicable: boolean;
  naReason?: string;
  naDeclaration?: boolean;
  isAnomaly: boolean;
  anomalyExplanation?: string;
  evidence: FieldEvidenceItem[];
  status: 'DRAFT' | 'IN_PROGRESS' | 'READY' | 'SUBMITTED' | 'UNDER_REVIEW' | 'CORRECTION_REQUIRED' | 'RESUBMITTED' | 'APPROVED';
  lastSavedAt: string;
}

export interface CorrectionItem {
  id: string;
  fieldId: string;
  fieldLabel: string;
  principle: string;
  reviewerName: string;
  reviewerComment: string;
  requestedDate: string;
  deadline: string;
  status: 'PENDING_CONTRIBUTOR' | 'RESUBMITTED' | 'RESOLVED';
  contributorResponse?: string;
}

export interface ContributorAuditLogEntry {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'UPLOAD' | 'CORRECT' | 'SUBMIT' | 'SAVE_DRAFT' | 'VALIDATE';
  indicatorCode: string;
  fieldLabel: string;
  oldValue: string | number;
  newValue: string | number;
  user: string;
  reason: string;
  documentName?: string;
  ipAddress: string;
}

interface ContributorDataContextType {
  activeScope: ContributorProjectScope;
  setProjectScope: (scope: Partial<ContributorProjectScope>) => void;
  availableProjects: ContributorProjectScope[];
  fieldEntries: Record<string, FieldEntryState>;
  getFieldEntry: (fieldId: string) => FieldEntryState;
  updateFieldEntry: (fieldId: string, updates: Partial<FieldEntryState>) => void;
  attachEvidenceToField: (fieldId: string, evidenceData: Omit<FieldEvidenceItem, 'id' | 'fieldId' | 'version' | 'status' | 'uploadedBy' | 'uploadedOn'>) => void;
  removeEvidence: (fieldId: string, evidenceId: string) => void;
  toggleNotApplicable: (fieldId: string, isNA: boolean, reason?: string) => void;
  saveDraft: () => void;
  lastSavedTimestamp: string;
  corrections: CorrectionItem[];
  respondToCorrection: (correctionId: string, newRemarks: string) => void;
  submitProjectForReview: () => { success: boolean; message: string; blockingErrors: string[]; warnings: string[] };
  getCompletionStats: () => {
    totalFields: number;
    completedFields: number;
    completionPct: number;
    evidenceTotal: number;
    evidenceUploaded: number;
    evidencePct: number;
    anomaliesCount: number;
    correctionsCount: number;
    validationErrorsCount: number;
  };
  auditLogs: ContributorAuditLogEntry[];
  addAuditLog: (entry: Omit<ContributorAuditLogEntry, 'id' | 'timestamp' | 'ipAddress'>) => void;
}

const ContributorDataContext = createContext<ContributorDataContextType | undefined>(undefined);

const AVAILABLE_PROJECTS: ContributorProjectScope[] = [
  {
    year: 'FY 2026-27',
    reportingYear: 'FY 2026-27',
    projectId: 'proj_exp',
    projectName: 'Expressway Project Phase-II (Raipur)',
    projectCode: 'MEIL-EXP-RPR-02',
    subsidiary: 'MEIL Infrastructure Ltd',
    businessUnit: 'Roads & Expressways BU',
    site: 'Site 02 (Km 42 - Km 88)',
    siteName: 'Site 02 (Km 42 - Km 88)',
    department: 'Environment',
  },
  {
    year: 'FY 2026-27',
    reportingYear: 'FY 2026-27',
    projectId: 'proj_klis',
    projectName: 'Kaleshwaram Lift Irrigation Site 4',
    projectCode: 'MEIL-IRR-KLIS-04',
    subsidiary: 'MEIL Infrastructure Ltd',
    businessUnit: 'Water & Irrigation BU',
    site: 'Pumping Station Complex 04',
    siteName: 'Pumping Station Complex 04',
    department: 'Civil Operations',
  },
  {
    year: 'FY 2026-27',
    reportingYear: 'FY 2026-27',
    projectId: 'proj_solar_park',
    projectName: 'Pavagada 500MW Solar Park',
    projectCode: 'MEIL-SOL-PVG-500',
    subsidiary: 'MEIL Clean Energy Ltd',
    businessUnit: 'Solar & Wind BU',
    site: 'Array Sector-C',
    siteName: 'Array Sector-C',
    department: 'Health & Safety',
  },
];

// Seed realistic demo evidence files
const INITIAL_DEMO_EVIDENCE: Record<string, FieldEvidenceItem[]> = {
  p6_diesel_litres: [
    {
      id: 'ev_fuel_inv_01',
      fieldId: 'p6_diesel_litres',
      documentName: 'IOCL_Diesel_TaxInvoice_March2027.pdf',
      documentType: 'Fuel Invoice / Register',
      documentNumber: 'IOCL-RAIPUR-2027-8891',
      documentDate: '2027-03-25',
      fileFormat: 'PDF',
      fileSizeBytes: 2450000,
      uploadedBy: 'Suresh Kumar (Site Eng)',
      uploadedOn: '2027-03-28 10:15 AM',
      status: 'ACCEPTED',
      version: 1,
      description: 'Monthly metered diesel delivery for DG sets and heavy excavators.',
      issuingAuthority: 'Indian Oil Corporation Ltd',
    },
  ],
  p6_electricity_kwh: [
    {
      id: 'ev_elec_bill_01',
      fieldId: 'p6_electricity_kwh',
      documentName: 'CSPDCL_ElectricityBill_March2027.pdf',
      documentType: 'Electricity Bill',
      documentNumber: 'HT-CSPDCL-9801124',
      documentDate: '2027-03-31',
      fileFormat: 'PDF',
      fileSizeBytes: 1820000,
      uploadedBy: 'Suresh Kumar (Site Eng)',
      uploadedOn: '2027-04-02 04:30 PM',
      status: 'ACCEPTED',
      version: 1,
      description: 'High-tension meter reading for site sub-station and batching plant.',
      issuingAuthority: 'State Power Distribution Co. Ltd',
    },
  ],
  p6_groundwater_kl: [
    {
      id: 'ev_water_log_01',
      fieldId: 'p6_groundwater_kl',
      documentName: 'Borewell_Flowmeter_Logbook_March2027.pdf',
      documentType: 'Water Meter Logbook',
      documentNumber: 'CGWA-NOC-2026-081',
      documentDate: '2027-03-31',
      fileFormat: 'PDF',
      fileSizeBytes: 3100000,
      uploadedBy: 'Ananya Roy (Env Officer)',
      uploadedOn: '2027-04-01 11:20 AM',
      status: 'UNDER_REVIEW',
      version: 1,
      description: 'Borewell meter daily logs with NOC flowmeter readings.',
      issuingAuthority: 'Central Ground Water Authority',
    },
  ],
  p6_haz_waste_mt: [
    {
      id: 'ev_waste_man_01',
      fieldId: 'p6_haz_waste_mt',
      documentName: 'Form10_HazardousWasteManifest_UsedOil.pdf',
      documentType: 'Waste Manifest / Form 10',
      documentNumber: 'CPCB-HW-MAN-4412',
      documentDate: '2027-03-20',
      fileFormat: 'PDF',
      fileSizeBytes: 1540000,
      uploadedBy: 'Suresh Kumar (Site Eng)',
      uploadedOn: '2027-03-22 02:40 PM',
      status: 'ACCEPTED',
      version: 1,
      description: 'Used hydraulic oil handed over to CPCB authorized re-refiner.',
      issuingAuthority: 'State Pollution Control Board',
    },
  ],
  p3_lost_time_injuries: [
    {
      id: 'ev_safety_inc_01',
      fieldId: 'p3_lost_time_injuries',
      documentName: 'EHS_Incident_Investigation_Report_IR08.pdf',
      documentType: 'Incident Investigation Report',
      documentNumber: 'IR-2027-08',
      documentDate: '2027-02-14',
      fileFormat: 'PDF',
      fileSizeBytes: 4200000,
      uploadedBy: 'Vikram Joshi (Safety Mgr)',
      uploadedOn: '2027-02-18 09:10 AM',
      status: 'ACCEPTED',
      version: 1,
      description: 'Minor fracture case during reinforcement handling; worker rehabilitated.',
      issuingAuthority: 'Site EHS Committee',
    },
  ],
};

const INITIAL_CORRECTIONS: CorrectionItem[] = [
  {
    id: 'corr_wat_01',
    fieldId: 'p6_groundwater_kl',
    fieldLabel: 'Groundwater Withdrawal (KL)',
    principle: 'Principle 6 (Environment)',
    reviewerName: 'Aarav Patel (Review Lead)',
    reviewerComment: 'Groundwater extraction has jumped by 47% compared to previous year. Please attach CGWA meter calibration certificate and provide operational explanation.',
    requestedDate: '2027-04-03',
    deadline: '2027-04-10',
    status: 'PENDING_CONTRIBUTOR',
  },
];

const INITIAL_AUDIT_LOGS: ContributorAuditLogEntry[] = [
  {
    id: 'AUD-MEIL-2027-010',
    timestamp: 'Today, 10:45 AM',
    action: 'SUBMIT',
    indicatorCode: 'ALL_9_PRINCIPLES',
    fieldLabel: 'Final Project Submission Dossier',
    oldValue: 'DRAFT',
    newValue: 'SUBMITTED',
    user: 'Subham (Data Contributor - Raipur)',
    reason: 'Completed 100% mandatory fields & 96% required evidence. Ready for Reviewer sign-off.',
    ipAddress: '10.24.18.42 (Site Office Raipur)',
  },
  {
    id: 'AUD-MEIL-2027-009',
    timestamp: 'Today, 10:42 AM',
    action: 'VALIDATE',
    indicatorCode: 'SEBI_BRSR_READINESS',
    fieldLabel: 'Automated Pre-Submission Compliance Audit',
    oldValue: 'UNVALIDATED',
    newValue: 'PASSED (0 errors, 3 warnings)',
    user: 'MEIL Automated Audit Engine',
    reason: 'Zero blocking formula or boundary errors detected. Non-blocking warnings documented with explanations.',
    ipAddress: 'System Internal',
  },
  {
    id: 'AUD-MEIL-2027-008',
    timestamp: 'Today, 10:35 AM',
    action: 'UPLOAD',
    indicatorCode: 'P3_LOST_TIME',
    fieldLabel: 'Lost Time Incident Count',
    oldValue: 'No Document',
    newValue: 'EHS_Incident_Investigation_Report_IR08.pdf',
    user: 'Vikram Joshi (Safety Mgr)',
    reason: 'Attached site investigation report IR-2027-08; minor fracture worker successfully rehabilitated.',
    documentName: 'EHS_Incident_Investigation_Report_IR08.pdf',
    ipAddress: '10.24.18.45',
  },
  {
    id: 'AUD-MEIL-2027-007',
    timestamp: 'Today, 10:28 AM',
    action: 'UPDATE',
    indicatorCode: 'P6_GROUNDWATER',
    fieldLabel: 'Groundwater Withdrawal (KL)',
    oldValue: '815 KL',
    newValue: '1,200 KL',
    user: 'Subham (Data Contributor - Raipur)',
    reason: 'Anomaly justification logged: Aux dewatering pump utilized during excavation foundation works.',
    ipAddress: '10.24.18.42 (Site Office Raipur)',
  },
  {
    id: 'AUD-MEIL-2027-006',
    timestamp: 'Today, 10:25 AM',
    action: 'VALIDATE',
    indicatorCode: 'P6_GROUNDWATER',
    fieldLabel: 'Groundwater Withdrawal (KL)',
    oldValue: '815 KL',
    newValue: '1,200 KL (+47% YoY Increase)',
    user: 'Automated Anomaly Detection Engine',
    reason: 'High YoY variance detected (+47%). Explanation and calibration slip required from contributor.',
    ipAddress: 'System Internal',
  },
  {
    id: 'AUD-MEIL-2027-005',
    timestamp: 'Today, 10:15 AM',
    action: 'UPLOAD',
    indicatorCode: 'P6_ELEC_GRID',
    fieldLabel: 'Grid Electricity Consumption (kWh)',
    oldValue: 'No Document',
    newValue: 'CSPDCL_Substation_ElectricityBill_March2027.pdf',
    user: 'Subham (Data Contributor - Raipur)',
    reason: 'Attached official State Electricity Distribution Company monthly tariff invoice CSPDCL-3392.',
    documentName: 'CSPDCL_Substation_ElectricityBill_March2027.pdf',
    ipAddress: '10.24.18.42 (Site Office Raipur)',
  },
  {
    id: 'AUD-MEIL-2027-004',
    timestamp: 'Today, 10:10 AM',
    action: 'UPDATE',
    indicatorCode: 'P6_ELEC_GRID',
    fieldLabel: 'Grid Electricity Consumption (kWh)',
    oldValue: '48,000 kWh',
    newValue: '52,500 kWh',
    user: 'Subham (Data Contributor - Raipur)',
    reason: 'Entered March 2027 submeter reading from Site 02 distribution transformer.',
    ipAddress: '10.24.18.42 (Site Office Raipur)',
  },
  {
    id: 'AUD-MEIL-2027-003',
    timestamp: 'Today, 09:58 AM',
    action: 'VALIDATE',
    indicatorCode: 'P6_SCOPE1_DIESEL',
    fieldLabel: 'Scope 1 Fuel Combustion Emissions',
    oldValue: '0.00 tCO2e',
    newValue: '13.94 tCO2e',
    user: 'Automated GHG Calculation Engine',
    reason: 'Formula evaluated: 5,200 L × 2.68 kg CO2e/L ÷ 1000 = 13.94 tCO2e (IPCC Guidelines).',
    ipAddress: 'System Internal',
  },
  {
    id: 'AUD-MEIL-2027-002',
    timestamp: 'Today, 09:55 AM',
    action: 'UPLOAD',
    indicatorCode: 'P6_DIESEL_LITRES',
    fieldLabel: 'Diesel Fuel Consumption (Litres)',
    oldValue: 'No Document',
    newValue: 'IOCL_Diesel_TaxInvoice_March2027.pdf',
    user: 'Subham (Data Contributor - Raipur)',
    reason: 'AI OCR verified invoice INV-IOCL-8891; 5,200 Litres confirmed against gate weighbridge register.',
    documentName: 'IOCL_Diesel_TaxInvoice_March2027.pdf',
    ipAddress: '10.24.18.42 (Site Office Raipur)',
  },
  {
    id: 'AUD-MEIL-2027-001',
    timestamp: 'Today, 09:50 AM',
    action: 'CREATE',
    indicatorCode: 'P6_DIESEL_LITRES',
    fieldLabel: 'Diesel Fuel Consumption (Litres)',
    oldValue: '0',
    newValue: '5,200 Litres',
    user: 'Subham (Data Contributor - Raipur)',
    reason: 'Initial operational log entry for March 2027 earthmoving heavy machinery batch.',
    ipAddress: '10.24.18.42 (Site Office Raipur)',
  },
];

export const ContributorDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { submitData, uploadEvidence } = useNexusData();
  const [activeScope, setActiveScope] = useState<ContributorProjectScope>(AVAILABLE_PROJECTS[0]);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string>('Just now');
  const [corrections, setCorrections] = useState<CorrectionItem[]>(INITIAL_CORRECTIONS);
  const [auditLogs, setAuditLogs] = useState<ContributorAuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const addAuditLog = (entry: Omit<ContributorAuditLogEntry, 'id' | 'timestamp' | 'ipAddress'>) => {
    const newEntry: ContributorAuditLogEntry = {
      ...entry,
      id: `AUD-MEIL-2027-${String(auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: 'Just now',
      ipAddress: '10.24.18.42 (Site Office Raipur)',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Initialize field entries state with realistic demo values across all 9 Principles
  const [fieldEntries, setFieldEntries] = useState<Record<string, FieldEntryState>>(() => {
    const initial: Record<string, FieldEntryState> = {};
    for (const p of PRINCIPLES_CONFIG) {
      for (const sub of p.subsections) {
        for (const f of sub.fields) {
          const val = f.defaultValue !== undefined ? f.defaultValue : '';
          const hasEvidence = Boolean(INITIAL_DEMO_EVIDENCE[f.id]?.length);
          const isAnomaly = f.id === 'p6_groundwater_kl'; // Groundwater +47% anomaly demo

          initial[f.id] = {
            fieldId: f.id,
            value: val,
            unit: f.unit,
            reportingPeriod: 'March 2027',
            source: f.category === 'Energy' || f.category === 'Fuel' ? 'Invoice' : 'Meter',
            quality: 'HIGH',
            remarks: '',
            isNotApplicable: false,
            isAnomaly,
            anomalyExplanation: isAnomaly
              ? 'Increased groundwater usage caused by temporary pipeline pressure-testing and emergency concrete batching during phase-2 milestone.'
              : undefined,
            evidence: INITIAL_DEMO_EVIDENCE[f.id] || [],
            status: hasEvidence ? 'READY' : 'IN_PROGRESS',
            lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
      }
    }
    return initial;
  });

  // Autosave periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSavedTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const setProjectScope = (updates: Partial<ContributorProjectScope>) => {
    setActiveScope(prev => ({ ...prev, ...updates }));
  };

  const getFieldEntry = (fieldId: string): FieldEntryState => {
    if (fieldEntries[fieldId]) {
      return fieldEntries[fieldId];
    }
    const def = findFieldById(fieldId);
    return {
      fieldId,
      value: def?.defaultValue ?? '',
      unit: def?.unit ?? '',
      reportingPeriod: 'March 2027',
      source: 'Meter',
      quality: 'HIGH',
      remarks: '',
      isNotApplicable: false,
      isAnomaly: false,
      evidence: [],
      status: 'IN_PROGRESS',
      lastSavedAt: 'Just now',
    };
  };

  const updateFieldEntry = (fieldId: string, updates: Partial<FieldEntryState>) => {
    setFieldEntries(prev => {
      const existing = prev[fieldId] || getFieldEntry(fieldId);
      const updated = {
        ...existing,
        ...updates,
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Check dynamic GHG calculations if diesel or electricity updated
      if (fieldId === 'p6_diesel_litres' && typeof updates.value === 'number') {
        const calculatedS1 = Number(((updates.value * 2.68) / 1000).toFixed(2));
        if (prev['p6_scope1_co2e']) {
          prev['p6_scope1_co2e'].value = calculatedS1;
        }
      } else if (fieldId === 'p6_electricity_kwh' && typeof updates.value === 'number') {
        const calculatedS2 = Number(((updates.value * 0.716) / 1000).toFixed(2));
        if (prev['p6_scope2_co2e']) {
          prev['p6_scope2_co2e'].value = calculatedS2;
        }
      }

      // Check dynamic LTIFR calculation if manhours or LTI updated
      if (fieldId === 'p3_lost_time_injuries' || fieldId === 'p3_total_manhours') {
        const lti = fieldId === 'p3_lost_time_injuries' ? Number(updates.value) : Number(existing.value);
        const manhours = fieldId === 'p3_total_manhours' ? Number(updates.value) : Number(prev['p3_total_manhours']?.value || 4250000);
        if (manhours > 0 && prev['p3_safety_ltifr']) {
          prev['p3_safety_ltifr'].value = Number(((lti * 1000000) / manhours).toFixed(3));
        }
      }

      // Check anomaly threshold dynamically against previous year
      const fieldDef = findFieldById(fieldId);
      if (fieldDef?.previousYearValue && typeof updates.value === 'number' && typeof fieldDef.previousYearValue === 'number') {
        const variance = Math.abs((updates.value - fieldDef.previousYearValue) / fieldDef.previousYearValue) * 100;
        if (variance > (fieldDef.benchmarkThreshold || 25)) {
          updated.isAnomaly = true;
        } else {
          updated.isAnomaly = false;
        }
      }

      return {
        ...prev,
        [fieldId]: updated,
      };
    });
    setLastSavedTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const attachEvidenceToField = (
    fieldId: string,
    evidenceData: Omit<FieldEvidenceItem, 'id' | 'fieldId' | 'version' | 'status' | 'uploadedBy' | 'uploadedOn'>
  ) => {
    const newDocId = `ev_${Date.now()}`;
    const newDoc: FieldEvidenceItem = {
      ...evidenceData,
      id: newDocId,
      fieldId,
      version: 1,
      status: 'UPLOADED',
      uploadedBy: 'Suresh Kumar (Contributor)',
      uploadedOn: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    setFieldEntries(prev => {
      const existing = prev[fieldId] || getFieldEntry(fieldId);
      return {
        ...prev,
        [fieldId]: {
          ...existing,
          evidence: [...existing.evidence, newDoc],
          status: 'READY',
          lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      };
    });

    // Sync to NexusDataContext evidence registry
    uploadEvidence({
      name: newDoc.documentName,
      documentType: newDoc.documentType,
      fileFormat: newDoc.fileFormat,
      fileSizeBytes: newDoc.fileSizeBytes,
      url: `/evidence/${newDoc.documentName}`,
      uploadedBy: newDoc.uploadedBy,
      uploadedOn: newDoc.uploadedOn,
      status: 'UPLOADED',
      comments: [newDoc.description || 'Uploaded via Contributor portal.'],
    });
  };

  const removeEvidence = (fieldId: string, evidenceId: string) => {
    setFieldEntries(prev => {
      const existing = prev[fieldId];
      if (!existing) return prev;
      return {
        ...prev,
        [fieldId]: {
          ...existing,
          evidence: existing.evidence.filter(e => e.id !== evidenceId),
        },
      };
    });
  };

  const toggleNotApplicable = (fieldId: string, isNA: boolean, reason?: string) => {
    updateFieldEntry(fieldId, {
      isNotApplicable: isNA,
      naReason: reason,
      naDeclaration: isNA,
      status: isNA ? 'READY' : 'IN_PROGRESS',
    });
  };

  const saveDraft = () => {
    setLastSavedTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const respondToCorrection = (correctionId: string, newRemarks: string) => {
    setCorrections(prev =>
      prev.map(c =>
        c.id === correctionId
          ? { ...c, status: 'RESUBMITTED', contributorResponse: newRemarks }
          : c
      )
    );
  };

  const submitProjectForReview = (): {
    success: boolean;
    message: string;
    blockingErrors: string[];
    warnings: string[];
  } => {
    const blockingErrors: string[] = [];
    const warnings: string[] = [];

    // Verify all required indicators
    for (const p of PRINCIPLES_CONFIG) {
      for (const sub of p.subsections) {
        for (const f of sub.fields) {
          const entry = fieldEntries[f.id];
          if (!entry || entry.isNotApplicable) continue;

          // Mandatory value check
          if (f.required && (entry.value === '' || entry.value === undefined || entry.value === null)) {
            blockingErrors.push(`${f.label} (${p.shortTitle}) is mandatory and cannot be empty.`);
          }

          // Mandatory evidence check for BRSR Core indicators
          if (f.isBrsrCore && (!entry.evidence || entry.evidence.length === 0)) {
            warnings.push(`BRSR Core Metric "${f.label}" does not have supporting evidence attached.`);
          }

          // Unexplained anomaly warning
          if (entry.isAnomaly && !entry.anomalyExplanation) {
            warnings.push(`Anomaly detected in "${f.label}": please provide an operational explanation.`);
          }
        }
      }
    }

    if (blockingErrors.length > 0) {
      return {
        success: false,
        message: 'Submission blocked: please complete all mandatory fields.',
        blockingErrors,
        warnings,
      };
    }

    // Submit project records into NexusDataContext
    submitData({
      assignmentId: activeScope.projectId,
      value: 'Project Consolidated Complete',
      unit: 'Submission Batch',
      comments: `Submission completed by Contributor for ${activeScope.projectName} (${activeScope.year})`,
      submittedAt: new Date().toISOString(),
      submittedBy: 'Suresh Kumar (Contributor)',
    });

    // Mark entries as submitted
    setFieldEntries(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        next[k] = { ...next[k], status: 'SUBMITTED' };
      });
      return next;
    });

    return {
      success: true,
      message: `Project ${activeScope.projectName} submitted successfully for Reviewer sign-off!`,
      blockingErrors: [],
      warnings,
    };
  };

  const getCompletionStats = () => {
    let totalFields = 0;
    let completedFields = 0;
    let evidenceTotal = 0;
    let evidenceUploaded = 0;
    let anomaliesCount = 0;

    for (const p of PRINCIPLES_CONFIG) {
      for (const sub of p.subsections) {
        for (const f of sub.fields) {
          totalFields++;
          const entry = fieldEntries[f.id];
          if (entry) {
            if (entry.isNotApplicable || (entry.value !== '' && entry.value !== undefined)) {
              completedFields++;
            }
            if (f.requiredEvidenceName) {
              evidenceTotal++;
              if (entry.evidence && entry.evidence.length > 0) {
                evidenceUploaded++;
              }
            }
            if (entry.isAnomaly) {
              anomaliesCount++;
            }
          }
        }
      }
    }

    const completionPct = totalFields ? Math.round((completedFields / totalFields) * 100) : 0;
    const evidencePct = evidenceTotal ? Math.round((evidenceUploaded / evidenceTotal) * 100) : 0;
    const correctionsCount = corrections.filter(c => c.status === 'PENDING_CONTRIBUTOR').length;

    return {
      totalFields,
      completedFields,
      completionPct,
      evidenceTotal,
      evidenceUploaded,
      evidencePct,
      anomaliesCount,
      correctionsCount,
      validationErrorsCount: 0,
    };
  };

  return (
    <ContributorDataContext.Provider
      value={{
        activeScope,
        setProjectScope,
        availableProjects: AVAILABLE_PROJECTS,
        fieldEntries,
        getFieldEntry,
        updateFieldEntry,
        attachEvidenceToField,
        removeEvidence,
        toggleNotApplicable,
        saveDraft,
        lastSavedTimestamp,
        corrections,
        respondToCorrection,
        submitProjectForReview,
        getCompletionStats,
        auditLogs,
        addAuditLog,
      }}
    >
      {children}
    </ContributorDataContext.Provider>
  );
};

export const useContributorData = () => {
  const context = useContext(ContributorDataContext);
  if (!context) {
    throw new Error('useContributorData must be used within a ContributorDataProvider');
  }
  return context;
};
