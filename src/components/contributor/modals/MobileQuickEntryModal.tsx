import React, { useState } from 'react';
import {
  Camera,
  MapPin,
  CheckCircle2,
  Zap,
  Droplet,
  Fuel,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { Modal } from '../../ui/Modal';
import { useContributorData } from '../context/ContributorDataContext';

interface MobileQuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const MobileQuickEntryModal: React.FC<MobileQuickEntryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { updateFieldEntry, attachEvidenceToField, activeScope } = useContributorData();
  const [metricType, setMetricType] = useState<'diesel' | 'water' | 'electricity' | 'incident' | 'waste'>('diesel');
  const [readingValue, setReadingValue] = useState<string>('5200');
  const [meterId, setMeterId] = useState<string>('GENSET-DG-04');
  const [locationName, setLocationName] = useState<string>('Batching Plant Yard 02');
  const [notes, setNotes] = useState<string>('Logged on mobile during shift inspection.');
  const [photoAttached, setPhotoAttached] = useState<boolean>(true);
  const [gpsCoordinates] = useState<string>('21.2514° N, 81.6296° E (Raipur Expressway Km 64)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(readingValue) || 0;

    let targetFieldId = 'p6_diesel_litres';
    let docType = 'Fuel Dispenser Meter Slip';

    if (metricType === 'water') {
      targetFieldId = 'p6_groundwater_kl';
      docType = 'Borewell Flowmeter Photo';
    } else if (metricType === 'electricity') {
      targetFieldId = 'p6_electricity_kwh';
      docType = 'Submeter Digital Reading Photo';
    } else if (metricType === 'incident') {
      targetFieldId = 'p3_lost_time_injuries';
      docType = 'Site Incident Spot Photograph';
    } else if (metricType === 'waste') {
      targetFieldId = 'p6_nonhaz_recycled_mt';
      docType = 'Weighbridge Digital Slip';
    }

    // Update field value in contributor dataset
    updateFieldEntry(targetFieldId, {
      value: val,
      source: 'Meter',
      quality: 'HIGH',
      remarks: `${notes} [Meter: ${meterId}, Loc: ${locationName}]`,
    });

    // Attach mobile photo evidence
    if (photoAttached) {
      attachEvidenceToField(targetFieldId, {
        documentName: `Mobile_Photo_${meterId}_${Date.now()}.jpg`,
        documentType: docType,
        documentNumber: `MOB-${Date.now().toString().slice(-6)}`,
        documentDate: new Date().toISOString().split('T')[0],
        fileFormat: 'JPG',
        fileSizeBytes: 3200000,
        description: `Mobile field inspection photo with GPS tag: ${gpsCoordinates}`,
        issuingAuthority: 'Site Engineering Mobile Unit',
        isAiExtracted: true,
      });
    }

    onSuccess(`Field reading for ${metricType.toUpperCase()} (${val}) recorded and synced!`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Field Quick Entry & Camera Evidence"
      subtitle={`Mobile on-site data capture for ${activeScope.projectName}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Metric Quick Select */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
            Select Field Metric
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {[
              { id: 'diesel', label: 'Diesel HSD', icon: Fuel },
              { id: 'water', label: 'Water Meter', icon: Droplet },
              { id: 'electricity', label: 'Electricity', icon: Zap },
              { id: 'waste', label: 'Waste Slip', icon: Trash2 },
              { id: 'incident', label: 'Incident', icon: AlertTriangle },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMetricType(m.id as typeof metricType);
                    if (m.id === 'water') {
                      setReadingValue('3820');
                      setMeterId('BOREWELL-METER-01');
                    } else if (m.id === 'electricity') {
                      setReadingValue('185400');
                      setMeterId('HT-SUBSTATION-01');
                    } else if (m.id === 'diesel') {
                      setReadingValue('52400');
                      setMeterId('DG-GENSET-04');
                    } else if (m.id === 'waste') {
                      setReadingValue('62.4');
                      setMeterId('WEIGHBRIDGE-SCALE-02');
                    } else {
                      setReadingValue('1');
                      setMeterId('SITE-SAFETY-LOG');
                    }
                  }}
                  className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                    metricType === m.id
                      ? 'bg-teal-600 text-white border-teal-500 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] truncate">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reading Value */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Meter / Log Reading Value
            </label>
            <input
              type="number"
              value={readingValue}
              onChange={(e) => setReadingValue(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Meter / Equipment ID
            </label>
            <input
              type="text"
              value={meterId}
              onChange={(e) => setMeterId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">
            Site Location / Plant Yard
          </label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs"
          />
        </div>

        {/* GPS Coordinates Simulator */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">GPS Geotag Verified</span>
              <strong className="text-white text-[11px] font-mono">{gpsCoordinates}</strong>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-[10px] border border-emerald-800/40">
            Active GPS
          </span>
        </div>

        {/* Camera Photo Mock */}
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-400" />
              <span className="font-semibold text-white">Meter Dial / Log Photograph</span>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={photoAttached}
                onChange={(e) => setPhotoAttached(e.target.checked)}
                className="rounded border-slate-700 text-teal-600 focus:ring-0"
              />
              <span>Attach Photo</span>
            </label>
          </div>
          {photoAttached && (
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>📷 Captured via Mobile Camera (IMG_FLOWMETER_0942.JPG)</span>
              <span className="text-teal-400 font-semibold">Ready to upload</span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Field Engineer Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save &amp; Sync to Dashboard</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
