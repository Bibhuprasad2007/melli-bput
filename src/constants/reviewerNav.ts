import React from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  FileCheck2,
  History,
  Bell,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'pending' | 'corrections' | 'anomalies' | 'notifications';
}

export const REVIEWER_NAV_ITEMS: NavigationItem[] = [
  { name: 'Dashboard', path: '/reviewer/dashboard', icon: LayoutDashboard },
  { name: 'Review Queue', path: '/reviewer/review-queue', icon: ClipboardList },
  { name: 'Evidence', path: '/reviewer/evidence-review', icon: FileCheck2 },
  { name: 'Validation Issues', path: '/reviewer/validation-issues', icon: Clock },
  { name: 'Activity History', path: '/reviewer/activity-history', icon: History },
  { name: 'Settings', path: '/reviewer/settings', icon: Bell },
];
