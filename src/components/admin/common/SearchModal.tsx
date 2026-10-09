import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Users, Layers, CalendarClock, ArrowRight } from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { useNexusData } from '../../../context/NexusDataContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { users, organizations, reportingCycles, indicators, assignments } = useNexusData();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'User' | 'Organization' | 'Indicator' | 'Cycle' | 'Task';
      path: string;
    }> = [];

    // Search users
    users.forEach((u) => {
      if (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)) {
        matches.push({
          id: u.id,
          title: u.name,
          subtitle: `${u.role.toUpperCase()} • ${u.email} • ${u.department || 'General'}`,
          category: 'User',
          path: '/admin/users',
        });
      }
    });

    // Search organizations
    organizations.forEach((o) => {
      if (o.name.toLowerCase().includes(q) || o.sector?.toLowerCase().includes(q) || o.location?.toLowerCase().includes(q) || o.type.toLowerCase().includes(q)) {
        matches.push({
          id: o.id,
          title: o.name,
          subtitle: `${o.type} • ${o.location || o.sector || 'MEIL Entity'}`,
          category: 'Organization',
          path: '/admin/organization',
        });
      }
    });

    // Search indicators
    indicators.forEach((ind) => {
      if (ind.code.toLowerCase().includes(q) || ind.name.toLowerCase().includes(q) || ind.principle.toLowerCase().includes(q) || ind.category.toLowerCase().includes(q)) {
        matches.push({
          id: ind.id,
          title: `${ind.code}: ${ind.name}`,
          subtitle: `${ind.principle} • ${ind.category} • ${ind.unit}`,
          category: 'Indicator',
          path: '/admin/indicator-master',
        });
      }
    });

    // Search cycles
    reportingCycles.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.financialYear.toLowerCase().includes(q) || c.status.toLowerCase().includes(q)) {
        matches.push({
          id: c.id,
          title: c.name,
          subtitle: `FY ${c.financialYear} • ${c.status} • Package: ${c.packageType}`,
          category: 'Cycle',
          path: '/admin/reporting-periods',
        });
      }
    });

    // Search assignments
    assignments.forEach((a) => {
      if (a.indicatorName.toLowerCase().includes(q) || a.indicatorCode.toLowerCase().includes(q) || a.status.toLowerCase().includes(q)) {
        matches.push({
          id: a.id,
          title: a.indicatorName,
          subtitle: `Status: ${a.status.toUpperCase()} • Due: ${a.dueDate}`,
          category: 'Task',
          path: '/admin/assessment',
        });
      }
    });

    return matches.slice(0, 8);
  }, [query, users, organizations, indicators, reportingCycles, assignments]);

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Global ESG Command Search"
      subtitle="Instantly search across users, business units, statutory indicators, and workflow submissions"
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type name, email, indicator code (e.g. Scope 1, Raipur, P6, Suresh)..."
            autoFocus
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003B73]"
          />
        </div>

        {query.trim() === '' ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50/80 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-700 mb-1">Quick Search Hints</p>
            <p className="text-slate-500">
              Try searching for <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded">Scope 1</span>, <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded">Water</span>, <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded">Suresh</span>, <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded">Raipur</span>, or <span className="font-mono text-sky-700 bg-sky-50 px-1 py-0.5 rounded">P3</span>.
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white">
            {results.map((res) => {
              let Icon = Layers;
              if (res.category === 'User') Icon = Users;
              else if (res.category === 'Organization') Icon = Building2;
              else if (res.category === 'Cycle') Icon = CalendarClock;

              return (
                <button
                  key={`${res.category}-${res.id}`}
                  type="button"
                  onClick={() => handleSelect(res.path)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#003B73] flex items-center justify-center shrink-0 border border-sky-100 group-hover:bg-[#003B73] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">{res.title}</span>
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {res.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{res.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#003B73] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50/80 rounded-xl border border-slate-200">
            No matching entity, indicator, or user found for &ldquo;{query}&rdquo;.
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] text-slate-400">Press ESC or click Close to exit</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
