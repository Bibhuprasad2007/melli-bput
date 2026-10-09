import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const ROUTE_LABELS: Record<string, string> = {
  contributor: 'Contributor Portal',
  dashboard: 'Dashboard',
  assignments: 'My Assignments',
  corrections: 'Corrections',
  submissions: 'My Submissions',
  activity: 'My Activity',
};

export const ContributorBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-slate-500">
      <Link
        to="/contributor/dashboard"
        className="flex items-center gap-1 text-slate-500 hover:text-teal-700 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Contributor</span>
      </Link>

      {pathnames.map((segment, index) => {
        if (segment === 'contributor' && index === 0) return null;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[segment] || (segment.startsWith('assign-') || segment.length > 10 ? `Assignment ${segment}` : segment.replace(/-/g, ' '));

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="text-slate-800 font-semibold truncate capitalize">{label}</span>
            ) : (
              <Link to={to} className="text-slate-500 hover:text-teal-700 transition-colors truncate capitalize">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
