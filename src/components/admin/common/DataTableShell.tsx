import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Database } from 'lucide-react';

export interface ColumnDef {
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableShellProps {
  columns: (string | ColumnDef)[];
  children?: React.ReactNode;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  onEmptyAction?: () => void;
  actionDisabled?: boolean;
}

export const DataTableShell: React.FC<DataTableShellProps> = ({
  columns,
  children,
  emptyIcon: EmptyIcon = Database,
  emptyTitle = 'No records found',
  emptyDescription = 'Records will appear here once connected to the backend service.',
  emptyActionText,
  onEmptyAction,
  actionDisabled = false,
}) => {
  const hasRows = Boolean(children && React.Children.count(children) > 0);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {columns.map((col, idx) => {
                const header = typeof col === 'string' ? col : col.header;
                const width = typeof col === 'string' ? undefined : col.width;
                const align = typeof col === 'string' ? 'left' : col.align || 'left';

                return (
                  <th
                    key={idx}
                    scope="col"
                    style={{ width }}
                    className={`px-4 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap text-${align}`}
                  >
                    {header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {hasRows ? (
              children
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center bg-white">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
                      <EmptyIcon className="w-6 h-6 text-slate-500" />
                    </div>
                    <h4 className="text-base font-semibold text-slate-800 mb-1">{emptyTitle}</h4>
                    <p className="text-sm text-slate-500 max-w-md mb-4 leading-relaxed">
                      {emptyDescription}
                    </p>
                    {emptyActionText && onEmptyAction && (
                      <button
                        type="button"
                        onClick={onEmptyAction}
                        disabled={actionDisabled}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#003B73] hover:bg-[#002B54] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#003B73]"
                      >
                        {emptyActionText}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
