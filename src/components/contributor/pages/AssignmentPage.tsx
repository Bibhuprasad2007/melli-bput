import React, { useState } from 'react';

// Define the structure for a single metric entry
interface MetricEntry {
  metric: string;
  reportingPeriod: string;
  value: string;
  evidence: string;
  explanation: string;
  status: string;
}

// Define the structure for a principle
interface PrincipleData {
  id: number;
  title: string;
  metrics: string[]; // metric names
}

// Static definition of the 9 principles and their metrics
const principles: PrincipleData[] = [
  {
    id: 1,
    title: 'Ethics & Transparency',
    metrics: [
      'Anti-corruption and anti-bribery incidents',
      'Whistleblower complaints received and resolved',
      'Regulatory penalties and fines',
      'Ethics and compliance training coverage (%)',
      'Code of conduct and ethics policy status',
    ],
  },
  {
    id: 2,
    title: 'Sustainable Products & Services',
    metrics: [
      'Product/Service Name',
      'Total Production',
      'Sustainable Raw Materials (%)',
      'Water Consumption (KL)',
      'Carbon Emissions Scope',
      'Carbon Emissions (tCO₂e)',
      'Energy Consumption (kWh)',
      'Waste Generated (tonnes)',
      'Sustainable Sourcing (%)',
      'Product Recycling & Reclamation (tonnes/units)',
      'Environmental Investment (₹)',
    ],
  },
  {
    id: 3,
    title: 'Employee Well‑being',
    metrics: [
      'Total employees and workers, including gender breakdown',
      'Employee and worker health and social security benefits coverage (%)',
      'Workplace injuries and fatalities',
      'Employee training hours and coverage (%)',
      'Workplace and human rights complaints received and resolved',
    ],
  },
  {
    id: 4,
    title: 'Stakeholder Engagement',
    metrics: [
      'Stakeholder groups identified',
      'Engagement frequency and methods',
      'Key stakeholder concerns raised',
      'Complaints received and resolved',
      'Actions taken to address stakeholder concerns',
    ],
  },
  {
    id: 5,
    title: 'Human Rights',
    metrics: [
      'Human rights policy and due diligence status',
      'Human rights training coverage (%)',
      'Discrimination and harassment complaints',
      'Child labour and forced labour incidents',
      'Human rights grievances resolved and pending',
    ],
  },
  {
    id: 6,
    title: 'Environment',
    metrics: [
      'Total energy consumption and renewable energy usage',
      'Greenhouse gas emissions (Scope 1 and Scope 2)',
      'Total water consumption and recycled water',
      'Total waste generated and waste recycled',
      'Environmental violations, penalties and incidents',
    ],
  },
  {
    id: 7,
    title: 'Responsible Public Policy',
    metrics: [
      'Industry association memberships',
      'Public policy advocacy activities',
      'Political contributions, where applicable',
      'Expenditure on policy advocacy, where reported',
      'Relevant policy positions and regulatory submissions',
    ],
  },
  {
    id: 8,
    title: 'Inclusive Growth',
    metrics: [
      'CSR budget and actual expenditure',
      'Community development projects and beneficiaries',
      'Social impact assessments conducted',
      'Local procurement and MSME procurement (%)',
      'Rehabilitation, resettlement and community grievances, where applicable',
    ],
  },
  {
    id: 9,
    title: 'Customer Responsibility',
    metrics: [
      'Customer complaints received and resolved',
      'Product safety incidents and recalls',
      'Consumer court cases and pending cases',
      'Data privacy and cybersecurity incidents affecting customers',
      'Customer satisfaction and corrective actions',
    ],
  },
];

// Helper to create an empty entry for a metric
const emptyEntry = (metric: string): MetricEntry => ({
  metric,
  reportingPeriod: '',
  value: '',
  evidence: '',
  explanation: '',
  status: 'Draft',
});

export const AssignmentPage: React.FC = () => {
  // Initialise state for all principles
  const [data, setData] = useState<Record<number, MetricEntry[]>>(() => {
    const init: Record<number, MetricEntry[]> = {};
    principles.forEach((p) => {
      init[p.id] = p.metrics.map(emptyEntry);
    });
    return init;
  });

  const handleChange = (
    principleId: number,
    index: number,
    field: keyof MetricEntry,
    value: string,
  ) => {
    setData((prev) => {
      const updated = { ...prev };
      const entries = [...updated[principleId]];
      entries[index] = { ...entries[index], [field]: value };
      updated[principleId] = entries;
      return updated;
    });
  };

  const handleSave = () => {
    console.log('Saving assignment data', data);
    alert('Assignment data saved to console (replace with real persistence).');
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-teal-800">Assignment – ESG Principles Data Capture</h1>
      {principles.map((principle) => (
        <section key={principle.id} className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            Principle {principle.id}: {principle.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 bg-white text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Metric</th>
                  <th className="px-3 py-2 text-left font-medium">Reporting Period</th>
                  <th className="px-3 py-2 text-left font-medium">Value & Unit</th>
                  <th className="px-3 py-2 text-left font-medium">Evidence</th>
                  <th className="px-3 py-2 text-left font-medium">Explanation</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data[principle.id].map((entry, idx) => (
                  <tr key={idx} className="border-t border-slate-200">
                    <td className="px-3 py-2">{entry.metric}</td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 p-1 text-xs"
                        value={entry.reportingPeriod}
                        onChange={(e) =>
                          handleChange(principle.id, idx, 'reportingPeriod', e.target.value)
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 p-1 text-xs"
                        value={entry.value}
                        onChange={(e) => handleChange(principle.id, idx, 'value', e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 p-1 text-xs"
                        value={entry.evidence}
                        onChange={(e) => handleChange(principle.id, idx, 'evidence', e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 p-1 text-xs"
                        value={entry.explanation}
                        onChange={(e) =>
                          handleChange(principle.id, idx, 'explanation', e.target.value)
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        className="w-full rounded border border-slate-300 p-1 text-xs"
                        value={entry.status}
                        onChange={(e) => handleChange(principle.id, idx, 'status', e.target.value)}
                      >
                        <option>Draft</option>
                        <option>Submitted</option>
                        <option>Under Review</option>
                        <option>Approved</option>
                        <option>Returned</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 transition"
          onClick={handleSave}
        >
          Save Assignment
        </button>
      </div>
    </div>
  );
};
