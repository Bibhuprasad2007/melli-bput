import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,


  AlertTriangle,
  Send,
  History,
} from 'lucide-react';

export interface ContributorNavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const CONTRIBUTOR_NAV_ITEMS: ContributorNavigationItem[] = [
  { name: 'Dashboard', path: '/contributor/dashboard', icon: LayoutDashboard },
  { name: 'My Assignments', path: '/contributor/assignments', icon: ClipboardList },



  { name: 'Corrections', path: '/contributor/corrections', icon: AlertTriangle },
  { name: 'My Submissions', path: '/contributor/submissions', icon: Send },
  { name: 'My Activity', path: '/contributor/activity', icon: History },
  { name: 'Assignment', path: '/contributor/assignment', icon: FileText },
];
