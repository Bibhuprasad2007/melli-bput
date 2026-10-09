/**
 * Reviewer & Approver Portal TypeScript Models and Types.
 * MEIL ESG NEXUS Quality Control Layer
 */

export type ReviewStatus =
  | 'awaiting_review'
  | 'under_review'
  | 'correction_requested'
  | 'resubmitted'
  | 'approved'
  | 'rejected';

export type ValidationSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type EvidenceStatus =
  | 'UPLOADED'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'SUPERSEDED'
  | 'REPLACEMENT_REQUESTED';

export interface ValidationCheckItem {
  id: string;
  code: string;
  ruleName: string;
  severity: ValidationSeverity;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  message: string;
  details?: string;
  blocksApproval?: boolean;
}

export interface AnomalyInfo {
  isAnomaly: boolean;
  yoyChangePercent: number;
  direction: 'increase' | 'decrease' | 'stable';
  thresholdPercent: number;
  explanationProvided?: string;
  isExplanationAccepted?: boolean;
  anomalyReason?: string;
}

export interface CalculationStep {
  stepNumber?: number;
  label: string;
  formula: string;
  inputValue?: string | number;
  factorUsed?: string | number;
  outputValue?: string | number;
  value?: string | number;
  unit?: string;
}

export interface EvidenceDocumentItem {
  id: string;
  name: string;
  documentType: string;
  fileFormat: string;
  fileSizeBytes: number;
  url: string;
  uploadedBy: string;
  uploadedOn: string;
  status: EvidenceStatus;
  rejectionReason?: string;
  replacementRequested?: boolean;
  comments?: string[];
  previewUrl?: string;
}

export interface CorrectionRequestDetails {
  id: string;
  assignmentId: string;
  problem: string;
  requiredCorrection: string;
  evidenceNeeded: string;
  deadline: string;
  reviewerComment: string;
  requestedAt: string;
  requestedBy: string;
  status: 'PENDING_CONTRIBUTOR' | 'RESUBMITTED' | 'RESOLVED';
  previousValue: number | string;
  resubmittedValue?: number | string;
  resubmittedAt?: string;
  resubmittedComments?: string;
}

export interface ReviewCommentItem {
  id: string;
  targetType: 'indicator' | 'evidence' | 'submission' | 'validation_issue';
  targetId?: string;
  authorName: string;
  authorRole: string;
  authorEmail: string;
  commentText: string;
  createdAt: string;
}

export interface ReviewAuditEntry {
  id: string;
  assignmentId: string;
  indicatorCode: string;
  indicatorName: string;
  submittedBy: string;
  reviewedBy: string;
  reviewDate: string;
  decision: 'APPROVE' | 'CORRECTION_REQUIRED' | 'REJECT';
  previousValue?: string | number;
  newValue?: string | number;
  unit: string;
  reason?: string;
  evidenceSummary: string;
  comments: string;
  scopeProject: string;
  reportingPeriod: string;
}

export interface ReviewAssignment {
  id: string;
  submissionId: string;
  disclosureCode: string;
  disclosureName: string;
  brsrSection: 'Section A' | 'Section B' | 'Section C';
  brsrPrinciple: 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9';
  isBrsrCore: boolean;
  reportingPeriod: string;
  scopeName: string;
  projectName: string;
  businessUnit: string;
  subsidiary: string;
  contributorName: string;
  contributorEmail: string;
  submittedOn: string;
  priority: 'High' | 'Medium' | 'Low';
  validationStatus: 'Valid' | 'Warning' | 'Critical Failure';
  evidenceStatus: EvidenceStatus;
  dueDate: string;
  reviewStatus: ReviewStatus;
}

export interface RollupComparisonItem {
  level: 'Project' | 'Business Unit' | 'Subsidiary' | 'Group';
  name: string;
  value: number;
  unit: string;
  aggregationMethod: 'SUM' | 'RECALCULATE' | 'WEIGHTED AVERAGE';
  isReconciled: boolean;
  notes: string;
}

export interface DataLineageNode {
  id: string;
  stage: string;
  title: string;
  source: string;
  timestamp: string;
  operator: string;
  status: 'completed' | 'in_progress' | 'pending';
  details: string;
}

export interface ReviewerNotification {
  id: string;
  title: string;
  message: string;
  type: 'submission' | 'resubmission' | 'deadline' | 'validation' | 'anomaly' | string;
  timestamp: string;
  isRead: boolean;
  assignmentId?: string;
  priority?: 'high' | 'medium' | 'low';
  severity?: 'critical' | 'warning' | 'info';
  createdAt?: string;
}

export interface ReviewDecision {
  submissionId: string;
  decision: 'approve' | 'request_correction' | 'reject';
  comment?: string;
  reason?: string;
  affectedField?: string;
  correctionCategory?: string;
}

export type SubmissionReviewDetail = Record<string, unknown>;
export type ValidationIssue = ValidationCheckItem;
export type EvidenceDocument = EvidenceDocumentItem;
export type ReviewComment = ReviewCommentItem;
export type ReviewActivityLog = ReviewAuditEntry;


