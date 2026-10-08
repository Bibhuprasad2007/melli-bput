import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNexusData } from '../../../context/NexusDataContext';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertOctagon,
  AlertTriangle,
  FileCheck,
  Lock,
  PlusCircle,
  UserPlus,
  ClipboardList,
  Send,
  PieChart,
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { MetricCard } from '../common/MetricCard';
import { EmptyState } from '../common/EmptyState';
import { CreateCycleModal } from '../modals/CreateCycleModal';
import { CreateUserModal } from '../modals/CreateUserModal';
import { CreateAssignmentModal } from '../modals/CreateAssignmentModal';
import { SendReminderModal } from '../modals/SendReminderModal';

interface OutletContextType {
  addToast: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const DashboardPage: React.FC = () => {
  const { addToast } = useOutletContext<OutletContextType>();

  const [isCreateCycleOpen, setIsCreateCycleOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [isSendReminderOpen, setIsSendReminderOpen] = useState(false);

  const { users, organizations, assignments } = useNexusData();

  const totalUsers = users.length;
  const totalProjects = organizations.filter(o => o.type === 'Project').length;
  
  const totalAssignments = assignments.length || 1;
  const pendingSubmissions = assignments.filter(a => a.status === 'draft').length;
  const awaitingReview = assignments.filter(a => a.status === 'under_review').length;
  const approved = assignments.filter(a => a.status === 'approved').length;
  const brsrCompletion = Math.round((approved / totalAssignments) * 100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="ESG Administration Dashboard"
        description="Enterprise ESG reporting overview, disclosure metrics, workflow deadlines, and compliance status across MEIL entities."
      />

      {/* Quick Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#003B73]" />
            <span>Quick Governance Actions</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateCycleOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Reporting Cycle</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateUserOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add User</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateAssignmentOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Assign Tasks</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSendReminderOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-white bg-slate-100 hover:bg-[#003B73] rounded-lg transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Summary Metrics (All show '--' with tooltip) */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Projects / Plants"
            value={totalProjects.toString()}
            icon={Building2}
            iconBg="bg-sky-50"
            iconColor="text-sky-600"
            accentBorder="border-l-[#003B73]"
          />
          <MetricCard
            title="Total Users"
            value={totalUsers.toString()}
            icon={Users}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
            accentBorder="border-l-blue-600"
          />
          <MetricCard
            title="BRSR Completion"
            value={`${brsrCompletion}%`}
            icon={CheckCircle2}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
            accentBorder="border-l-emerald-500"
          />
          <MetricCard
            title="Pending Submissions"
            value={pendingSubmissions.toString()}
            icon={Clock}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
            accentBorder="border-l-amber-500"
          />
          <MetricCard
            title="Overdue Tasks"
            value="0"
            icon={AlertOctagon}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
            accentBorder="border-l-rose-500"
          />
          <MetricCard
            title="Validation Errors"
            value="0"
            icon={AlertTriangle}
            iconBg="bg-red-50"
            iconColor="text-red-600"
            accentBorder="border-l-[#E31E24]"
          />
          <MetricCard
            title="Awaiting Review"
            value={awaitingReview.toString()}
            icon={FileCheck}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            accentBorder="border-l-indigo-500"
          />
          <MetricCard
            title="Approved / Locked"
            value={approved.toString()}
            icon={Lock}
            iconBg="bg-slate-100"
            iconColor="text-slate-600"
            accentBorder="border-l-slate-600"
          />
        </div>
      </div>

      {/* Empty Visualization Panels Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Analytical & Governance Panels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Panel 1: Section A/B/C Completion */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Section A/B/C Completion</h3>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>
            <EmptyState
              icon={PieChart}
              title="No Section Progress"
              description="Section-wise completion breakdown will render once submissions are collected from reporting units."
              compact
            />
          </div>

          {/* Panel 2: Principles P1-P9 Completion */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Principles P1-P9 Completion</h3>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>
            <EmptyState
              icon={BarChart3}
              title="No Principle Data"
              description="Progress bars for Principles 1 through 9 will appear here when active reporting cycles are connected."
              compact
            />
          </div>

          {/* Panel 3: Project / Department Progress */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Project / Department Progress</h3>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <EmptyState
              icon={Building2}
              title="No Entity Progress"
              description="Comparative completion across plants, subsidiaries, and departments will populate automatically."
              compact
            />
          </div>

          {/* Panel 4: Upcoming Deadlines */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Upcoming Deadlines</h3>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <EmptyState
              icon={Calendar}
              title="No Scheduled Deadlines"
              description="Submission, review, and assurance milestones will display here for active reporting cycles."
              compact
            />
          </div>

          {/* Panel 5: Exception Trend */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Exception Trend</h3>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <EmptyState
              icon={TrendingUp}
              title="No Validation Exceptions"
              description="Data discrepancy trends, unit errors, and missing evidence alerts will be plotted after backend validation."
              compact
            />
          </div>

          {/* Panel 6: Recent Activity */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <EmptyState
              icon={Activity}
              title="No Activity Logged"
              description="Live audit events, user logins, and status transitions will stream into this audit feed."
              compact
            />
          </div>
        </div>
      </div>

      {/* Modals for Quick Actions */}
      <CreateCycleModal
        isOpen={isCreateCycleOpen}
        onClose={() => setIsCreateCycleOpen(false)}
        onShowToast={addToast}
      />
      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onShowToast={addToast}
      />
      <CreateAssignmentModal
        isOpen={isCreateAssignmentOpen}
        onClose={() => setIsCreateAssignmentOpen(false)}
        onShowToast={addToast}
      />
      <SendReminderModal
        isOpen={isSendReminderOpen}
        onClose={() => setIsSendReminderOpen(false)}
        onShowToast={addToast}
      />
    </div>
  );
};
