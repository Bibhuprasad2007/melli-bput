import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  AlertCircle,
  Layers,
  Send,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../admin/common/PageHeader';
import { useContributorData } from '../context/ContributorDataContext';

interface ParsedIngestionRow {
  rowNumber: number;
  indicatorCode: string;
  metricName: string;
  fieldId: string;
  site: string;
  period: string;
  value: string | number;
  unit: string;
  source: string;
  status: 'VALID' | 'WARNING' | 'INVALID';
  message: string;
}

const SAMPLE_PARSED_ROWS: ParsedIngestionRow[] = [
  {
    rowNumber: 1,
    indicatorCode: 'P6-NRG-DIESEL',
    metricName: 'Diesel Fuel Consumption',
    fieldId: 'p6_diesel_litres',
    site: 'Site 02 (Km 42 - Km 88)',
    period: 'March 2027',
    value: 5200,
    unit: 'Litres',
    source: 'Fuel Invoice / IOCL Register',
    status: 'VALID',
    message: 'Valid entry; matches standard diesel density & unit boundaries.',
  },
  {
    rowNumber: 2,
    indicatorCode: 'P6-NRG-ELEC',
    metricName: 'Grid Electricity Consumption',
    fieldId: 'p6_grid_electricity_kwh',
    site: 'Site 02 (Km 42 - Km 88)',
    period: 'March 2027',
    value: 52500,
    unit: 'kWh',
    source: 'State Utility Tariff Bill',
    status: 'VALID',
    message: 'Valid entry; meter reconciles with regional grid parameters.',
  },
  {
    rowNumber: 3,
    indicatorCode: 'P6-WAT-GROUND',
    metricName: 'Groundwater Withdrawal',
    fieldId: 'p6_groundwater_kl',
    site: 'Site 02 (Km 42 - Km 88)',
    period: 'March 2027',
    value: 1200,
    unit: 'KL',
    source: 'Flow Meter Log',
    status: 'WARNING',
    message: 'Anomaly Detected: +47% increase compared to FY 2025-26 benchmark.',
  },
  {
    rowNumber: 4,
    indicatorCode: 'P3-TRAIN-SAF',
    metricName: 'OHS Safety Training Delivered',
    fieldId: 'p3_training_safety_hours',
    site: 'Site 02 (Km 42 - Km 88)',
    period: 'March 2027',
    value: 480,
    unit: 'Hours',
    source: 'HR Attendance Register',
    status: 'VALID',
    message: 'Valid entry; within monthly training plan allocation.',
  },
  {
    rowNumber: 5,
    indicatorCode: 'P6-WAS-HAZ',
    metricName: 'Hazardous Waste Handed Over',
    fieldId: 'p6_waste_hazardous_mt',
    site: 'Site 02 (Km 42 - Km 88)',
    period: 'March 2027',
    value: 2.4,
    unit: 'MT',
    source: 'SPCB Hazardous Manifest',
    status: 'VALID',
    message: 'Valid manifest record; authorized recycler verified.',
  },
  {
    rowNumber: 6,
    indicatorCode: 'P3-SAF-LTI',
    metricName: 'Lost Time Incident Count',
    fieldId: 'p3_lost_time_injuries',
    site: 'Site 02 (Km 42 - Km 88)',
    period: 'March 2027',
    value: -2,
    unit: 'Count',
    source: 'Site Safety Log',
    status: 'INVALID',
    message: 'Validation Failure: Negative incident counts are strictly prohibited.',
  },
];

export const BulkDataUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useOutletContext<{
    addToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  }>();

  const {
    activeScope,
    availableProjects,
    setProjectScope,
    updateFieldEntry,
  } = useContributorData();

  const [selectedProjectId, setSelectedProjectId] = useState(activeScope.projectId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedIngestionRow[]>([]);
  const [isCommitted, setIsCommitted] = useState(false);

  const handleDownloadTemplate = () => {
    const csvContent =
      'Indicator_Code,Metric_Name,Site,Period,Value,Unit,Source,Remarks\n' +
      'P6-NRG-DIESEL,Diesel Fuel Consumption,Site 02,March 2027,5200,Litres,Fuel Invoice,Heavy Earthmoving Equipment batch\n' +
      'P6-NRG-ELEC,Grid Electricity,Site 02,March 2027,52500,kWh,Utility Bill,Substation transformer reading\n' +
      'P6-WAT-GROUND,Groundwater Withdrawal,Site 02,March 2027,1200,KL,Flow Meter,Dewatering aux pump during excavation\n' +
      'P3-TRAIN-SAF,OHS Safety Training,Site 02,March 2027,480,Hours,Attendance Sheet,Working at height safety workshop\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MEIL_ESG_Ingestion_Template_${activeScope.projectCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Downloaded MEIL ESG bulk ingestion CSV template.', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setSelectedFile(file);
    setParsedRows(SAMPLE_PARSED_ROWS);
    setIsCommitted(false);
    addToast(`Loaded ${file.name}. Parsed 6 rows for automated BRSR sanity checking.`, 'info');
  };

  const handleLoadSample = () => {
    const mockFile = new File(['mock content'], 'MEIL_Site02_March2027_OperationalLog.csv', {
      type: 'text/csv',
    });
    setSelectedFile(mockFile);
    setParsedRows(SAMPLE_PARSED_ROWS);
    setIsCommitted(false);
    addToast('Loaded demonstration batch log with 6 operational records.', 'info');
  };

  const handleImportValidRecords = () => {
    const validAndWarning = parsedRows.filter((r) => r.status !== 'INVALID');
    for (const row of validAndWarning) {
      updateFieldEntry(row.fieldId, {
        value: row.value,
        reportingPeriod: row.period,
        source: row.source.includes('Invoice') ? 'Invoice' : 'Meter',
        isAnomaly: row.status === 'WARNING',
        anomalyExplanation: row.status === 'WARNING' ? row.message : undefined,
      });
    }
    setIsCommitted(true);
    addToast(
      `Successfully ingested ${validAndWarning.length} valid records into ${activeScope.projectName}!`,
      'success'
    );
  };

  const validCount = parsedRows.filter((r) => r.status === 'VALID').length;
  const warningCount = parsedRows.filter((r) => r.status === 'WARNING').length;
  const invalidCount = parsedRows.filter((r) => r.status === 'INVALID').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bulk ESG Data Ingestion"
        description="Upload batch operational ESG metrics, electricity billing schedules, fuel logs, and safety records using standardized BRSR spreadsheets."
      />

      {/* Scope & Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step 1: Scope Selection */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Step 1: Reporting Scope & Cycle
            </h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reporting Cycle
              </label>
              <div className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold">
                {activeScope.reportingYear} (Active Reporting Cycle)
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Facility / Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  const found = availableProjects.find((p) => p.projectId === e.target.value);
                  if (found) setProjectScope(found);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:bg-white focus:border-teal-700"
              >
                {availableProjects.map((p) => (
                  <option key={p.projectId} value={p.projectId}>
                    {p.projectName} — {p.site}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Download Template */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileSpreadsheet className="w-4 h-4 text-teal-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Step 2: Standardized Template
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              Download the tailored CSV ingestion template configured with standard BRSR indicator codes, units (Litres, kWh, KL, MT), and mandatory metadata fields.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-700" />
              <span>Download Ingestion Template (.CSV)</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Pre-populated with {activeScope.projectName} operational tags.
            </p>
          </div>
        </div>
      </div>

      {/* Step 3: File Upload Dropzone */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Step 3: Upload Populated Spreadsheet
            </h3>
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Batch File</span>
          </button>
        </div>

        <div className="border-2 border-dashed border-slate-200 hover:border-teal-600 rounded-2xl p-8 text-center bg-slate-50/50 transition-colors">
          <input
            type="file"
            id="bulk-file-input"
            onChange={handleFileChange}
            accept=".xlsx,.csv"
            className="hidden"
          />

          {!selectedFile ? (
            <label
              htmlFor="bulk-file-input"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Click to browse or drag and drop populated template
              </p>
              <p className="text-xs text-slate-500">
                Automated validation engine scans row schemas, boundaries, and year-on-year anomalies
              </p>
            </label>
          ) : (
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-teal-200 shadow-xs max-w-md mx-auto">
              <div className="flex items-center gap-3 overflow-hidden text-left">
                <FileSpreadsheet className="w-7 h-7 text-teal-700 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Ingestion Ready
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setParsedRows([]);
                  setIsCommitted(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Validation Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Parsed Rows
          </p>
          <p className="text-xl font-black text-slate-800 mt-1">{parsedRows.length || '--'}</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
            Valid Rows
          </p>
          <p className="text-xl font-black text-emerald-700 mt-1">
            {parsedRows.length ? validCount : '--'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
            Warnings / Outliers
          </p>
          <p className="text-xl font-black text-amber-700 mt-1">
            {parsedRows.length ? warningCount : '--'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
            Errors / Rejected
          </p>
          <p className="text-xl font-black text-rose-700 mt-1">
            {parsedRows.length ? invalidCount : '--'}
          </p>
        </div>
      </div>

      {/* Row Validation & Error Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Row-Level Ingestion Preview &amp; Verification Checks
          </h3>
          <div className="flex items-center gap-2">
            {parsedRows.length > 0 && !isCommitted && (
              <button
                type="button"
                onClick={handleImportValidRecords}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Import Valid Records ({validCount + warningCount})</span>
              </button>
            )}
            {isCommitted && (
              <button
                type="button"
                onClick={() => navigate('/contributor/assignments/meil-p01')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ingested! Open Universal Data Entry</span>
              </button>
            )}
          </div>
        </div>

        {parsedRows.length === 0 ? (
          <div className="p-12 text-center">
            <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No Data File Uploaded</h4>
            <p className="text-xs text-slate-400 mt-1">
              Select or load a template above to preview schema checks, anomalies, and import records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Indicator</th>
                  <th className="px-4 py-3">Metric Name</th>
                  <th className="px-4 py-3">Value &amp; Unit</th>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Data Source</th>
                  <th className="px-4 py-3">Validation Status</th>
                  <th className="px-4 py-3">Engine Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedRows.map((r) => (
                  <tr key={r.rowNumber} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-slate-400">{r.rowNumber}</td>
                    <td className="px-4 py-3 font-mono font-bold text-teal-800">{r.indicatorCode}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{r.metricName}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {r.value} <span className="font-normal text-slate-500">{r.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.period}</td>
                    <td className="px-4 py-3 text-slate-600">{r.source}</td>
                    <td className="px-4 py-3">
                      {r.status === 'VALID' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          VALID
                        </span>
                      )}
                      {r.status === 'WARNING' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          WARNING
                        </span>
                      )}
                      {r.status === 'INVALID' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          INVALID
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs">{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
