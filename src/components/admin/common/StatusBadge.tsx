import React from 'react';

export type StatusVariant =
  | 'draft'
  | 'active'
  | 'pending'
  | 'submitted'
  | 'approved'
  | 'locked'
  | 'rejected'
  | 'warning'
  | 'error'
  | 'neutral';

interface StatusBadgeProps {
  label?: string;
  status?: string;
  variant?: StatusVariant;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  status,
  variant,
  size = 'sm',
}) => {
  const displayLabel = label || (status ? status.replace(/_/g, ' ') : 'neutral');

  const resolvedVariant: StatusVariant =
    variant ||
    (() => {
      switch (status) {
        case 'approved':
        case 'audited':
        case 'active':
          return 'approved';
        case 'submitted':
        case 'under_review':
        case 'pending':
        case 'management_pending':
          return 'pending';
        case 'correction_requested':
        case 'warning':
          return 'warning';
        case 'rejected':
        case 'error':
          return 'rejected';
        case 'locked':
          return 'locked';
        case 'draft':
        default:
          return 'draft';
      }
    })();

  const getColors = () => {
    switch (resolvedVariant) {
      case 'active':
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'submitted':
      case 'pending':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'locked':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'rejected':
      case 'error':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'draft':
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full capitalize select-none ${getColors()} ${sizeClasses}`}
    >
      {displayLabel}
    </span>
  );
};
