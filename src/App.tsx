import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoAuthProvider } from './context/DemoAuthContext';
import { NexusDataProvider } from './context/NexusDataContext';
import { LoginLandingPage } from './components/layout/LoginLandingPage';
import { ProtectedAdminRoute } from './components/admin/layout/ProtectedAdminRoute';
import { AdminLayout } from './components/admin/layout/AdminLayout';

// Admin Pages
import { DashboardPage } from './components/admin/pages/DashboardPage';
import { OrganizationPage } from './components/admin/pages/OrganizationPage';
import { UsersPage } from './components/admin/pages/UsersPage';
import { ReportingCyclePage } from './components/admin/pages/ReportingCyclePage';
import { BRSRFrameworkPage } from './components/admin/pages/BRSRFrameworkPage';
import { TaskAssignmentPage } from './components/admin/pages/TaskAssignmentPage';
import { ValidationPage } from './components/admin/pages/ValidationPage';
import { EvidenceAuditPage } from './components/admin/pages/EvidenceAuditPage';
import { SettingsPage } from './components/admin/pages/SettingsPage';


// Reviewer Pages & Layout
import { ProtectedReviewerRoute } from './components/reviewer/layout/ProtectedReviewerRoute';
import { ReviewerLayout } from './components/reviewer/layout/ReviewerLayout';
import { ReviewerDashboardPage } from './components/reviewer/pages/ReviewerDashboardPage';
import { ReviewQueuePage } from './components/reviewer/pages/ReviewQueuePage';
import { SubmissionDetailPage } from './components/reviewer/pages/SubmissionDetailPage';
import { ValidationIssuesPage } from './components/reviewer/pages/ValidationIssuesPage';
import { EvidenceReviewPage } from './components/reviewer/pages/EvidenceReviewPage';
import { ActivityHistoryPage } from './components/reviewer/pages/ActivityHistoryPage';
import { ReviewerSettingsPage } from './components/reviewer/pages/ReviewerSettingsPage';

// Contributor Pages & Layout
import { ProtectedContributorRoute } from './components/contributor/layout/ProtectedContributorRoute';
import { ContributorLayout } from './components/contributor/layout/ContributorLayout';
import { ContributorDashboard } from './components/contributor/pages/ContributorDashboard';
import { AssignmentPage } from './components/contributor/pages/AssignmentPage';

import { ContributorAssignmentsPage } from './components/contributor/pages/ContributorAssignmentsPage';
import { AssignmentDataEntryPage } from './components/contributor/pages/AssignmentDataEntryPage';


import { ContributorCorrectionsPage } from './components/contributor/pages/ContributorCorrectionsPage';
import { ContributorSubmissionsPage } from './components/contributor/pages/ContributorSubmissionsPage';
import { ContributorActivityPage } from './components/contributor/pages/ContributorActivityPage';

// Management Pages & Layout
import { ProtectedManagementRoute } from './components/management/layout/ProtectedManagementRoute';
import { ManagementLayout } from './components/management/layout/ManagementLayout';
import { ManagementDashboard } from './components/management/pages/ManagementDashboard';
import { ESGOverviewPage } from './components/management/pages/ESGOverviewPage';
import { PlaceholderPage } from './components/management/pages/PlaceholderPage';

export function App() {
  return (
    <DemoAuthProvider>
      <NexusDataProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LoginLandingPage />} />

          {/* Root /admin redirection */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Protected ESG Admin Portal Subsystem */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="organization" element={<OrganizationPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reporting-periods" element={<ReportingCyclePage />} />
            <Route path="indicator-master" element={<BRSRFrameworkPage />} />
            <Route path="data-collection" element={<TaskAssignmentPage />} />
            <Route path="validation-rules" element={<ValidationPage />} />
            <Route path="evidence-configuration" element={<EvidenceAuditPage />} />
            <Route path="brsr-control-center" element={<PlaceholderPage title="BRSR Control Center" />} />
            <Route path="brsr-core" element={<PlaceholderPage title="BRSR Core" />} />
            <Route path="consolidation" element={<PlaceholderPage title="Consolidation" />} />
            <Route path="assessment" element={<PlaceholderPage title="Assessment" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="notifications" element={<PlaceholderPage title="Notifications" />} />
            <Route path="audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Root /reviewer redirection */}
          <Route path="/reviewer" element={<Navigate to="/reviewer/dashboard" replace />} />

          {/* Protected Reviewer / Approver Portal Subsystem */}
          <Route
            path="/reviewer"
            element={
              <ProtectedReviewerRoute>
                <ReviewerLayout />
              </ProtectedReviewerRoute>
            }
          >
            <Route path="dashboard" element={<ReviewerDashboardPage />} />
            <Route path="review-queue" element={<ReviewQueuePage />} />
            <Route path="submission-detail/:assignmentId" element={<SubmissionDetailPage />} />
            <Route path="validation-issues" element={<ValidationIssuesPage />} />
            <Route path="evidence-review" element={<EvidenceReviewPage />} />
            <Route path="activity-history" element={<ActivityHistoryPage />} />
            <Route path="settings" element={<ReviewerSettingsPage />} />
          </Route>

          {/* Root /contributor redirection */}
          <Route path="/contributor" element={<Navigate to="/contributor/dashboard" replace />} />

          {/* Protected Data Contributor Portal Subsystem */}
          <Route
            path="/contributor"
            element={
              <ProtectedContributorRoute>
                <ContributorLayout />
              </ProtectedContributorRoute>
            }
          >
            <Route path="dashboard" element={<ContributorDashboard />} />
            <Route path="assignments" element={<ContributorAssignmentsPage />} />
            <Route path="assignment" element={<AssignmentPage />} />
            <Route path="assignments/:assignmentId" element={<AssignmentDataEntryPage />} />

            
            
            <Route path="corrections" element={<ContributorCorrectionsPage />} />
            <Route path="submissions" element={<ContributorSubmissionsPage />} />
            <Route path="activity" element={<ContributorActivityPage />} />
          </Route>

          {/* Management Portal Redirection */}
          <Route path="/management" element={<Navigate to="/management/dashboard" replace />} />

          {/* Protected Management Portal Subsystem */}
          <Route
            path="/management"
            element={
              <ProtectedManagementRoute>
                <ManagementLayout />
              </ProtectedManagementRoute>
            }
          >
            <Route path="dashboard" element={<ManagementDashboard />} />
            <Route path="esg-overview" element={<ESGOverviewPage />} />
            <Route path="environmental" element={<PlaceholderPage title="Environmental" />} />
            <Route path="social" element={<PlaceholderPage title="Social" />} />
            <Route path="governance" element={<PlaceholderPage title="Governance" />} />
            <Route path="brsr-readiness" element={<PlaceholderPage title="BRSR Readiness" />} />
            <Route path="risks" element={<PlaceholderPage title="Risks & Exceptions" />} />
            <Route path="sign-off" element={<PlaceholderPage title="Management Sign-Off" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports" />} />
            <Route path="activity" element={<PlaceholderPage title="My Activity" />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      </NexusDataProvider>
    </DemoAuthProvider>
  );
}

export default App;
