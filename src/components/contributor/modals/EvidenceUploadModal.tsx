import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { Modal } from '../../ui/Modal';
import type { FieldDefinition } from '../data/contributorPrinciplesData';

interface EvidenceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  field: FieldDefinition;
  currentValue?: number | string;
  onUploadSuccess: (evidenceData: {
    documentName: string;
    documentType: string;
    documentNumber: string;
    documentDate: string;
    fileFormat: string;
    fileSizeBytes: number;
    description: string;
    issuingAuthority: string;
    isAiExtracted: boolean;
  }, extractedValue?: number) => void;
}

export const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({
  isOpen,
  onClose,
  field,
  currentValue,
  onUploadSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState(field.requiredEvidenceName || 'Invoice / Official Receipt');
  const [documentNumber, setDocumentNumber] = useState(`DOC-${field.code}-${new Date().getFullYear()}-01`);
  const [documentDate, setDocumentDate] = useState('2027-03-25');
  const [issuingAuthority, setIssuingAuthority] = useState('Authorized Agency / Vendor');
  const [description, setDescription] = useState(`Supporting operational evidence for ${field.label}`);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiExtractedData, setAiExtractedData] = useState<{
    detected: boolean;
    quantity?: number;
    unit?: string;
    supplier?: string;
    invoiceNo?: string;
    date?: string;
    confidence: number;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Trigger simulated AI OCR extraction
      setIsAiProcessing(true);
      setTimeout(() => {
        setIsAiProcessing(false);
        const simQuantity = typeof currentValue === 'number' && currentValue > 0
          ? currentValue
          : field.defaultValue && typeof field.defaultValue === 'number'
          ? field.defaultValue
          : 5200;

        setAiExtractedData({
          detected: true,
          quantity: simQuantity,
          unit: field.unit,
          supplier: field.category === 'Fuel' ? 'IOCL / HPCL Distributor' : 'State Utility / Verified Agency',
          invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          date: '2027-03-25',
          confidence: 96,
        });
      }, 700);
    }
  };

  const handleConfirmUpload = (useExtractedValue = false) => {
    const fileName = selectedFile
      ? selectedFile.name
      : `${field.code}_Evidence_March2027.pdf`;

    onUploadSuccess(
      {
        documentName: fileName,
        documentType,
        documentNumber,
        documentDate,
        fileFormat: selectedFile?.name.split('.').pop()?.toUpperCase() || 'PDF',
        fileSizeBytes: selectedFile?.size || 2450000,
        description,
        issuingAuthority,
        isAiExtracted: Boolean(aiExtractedData?.detected),
      },
      useExtractedValue && aiExtractedData?.quantity ? aiExtractedData.quantity : undefined
    );

    setSelectedFile(null);
    setAiExtractedData(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Supporting Evidence"
      subtitle={`Attach contextual verifiable records for: ${field.label}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Requirement Banner */}
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-white block">Required Document: {field.requiredEvidenceName}</span>
            <span className="text-slate-400 block">
              Accepted formats: <strong className="text-slate-300">{field.acceptedFileTypes}</strong> (Max 25MB)
            </span>
          </div>
        </div>

        {/* File Drag and Drop Slot */}
        <div className="border-2 border-dashed border-slate-700/80 hover:border-teal-500/80 rounded-xl p-6 text-center bg-slate-950/60 transition-colors">
          <input
            type="file"
            id="evidence-file-upload"
            onChange={handleFileChange}
            accept={field.acceptedFileTypes}
            className="hidden"
          />
          <label htmlFor="evidence-file-upload" className="cursor-pointer space-y-2 block">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-teal-400">
              <UploadCloud className="w-6 h-6" />
            </div>
            {selectedFile ? (
              <div>
                <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB &bull; Click to change</p>
              </div>
            ) : (
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  Click to select file or drag and drop here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PDF, Excel, Word, or Scanned Images</p>
              </div>
            )}
          </label>
        </div>

        {/* AI OCR Extraction Preview */}
        {isAiProcessing && (
          <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-700/40 flex items-center gap-3 animate-pulse">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-xs font-semibold text-indigo-200">
              AI Document OCR scanning invoice fields and dates...
            </span>
          </div>
        )}

        {aiExtractedData && !isAiProcessing && (
          <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-600/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                  AI Extracted Data (Human Verification Required)
                </span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/40">
                {aiExtractedData.confidence}% Confidence
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Quantity</span>
                <strong className="text-white text-sm">{aiExtractedData.quantity?.toLocaleString()} {aiExtractedData.unit}</strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Invoice #</span>
                <strong className="text-white text-xs truncate block">{aiExtractedData.invoiceNo}</strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Issuer / Vendor</span>
                <strong className="text-white text-xs truncate block">{aiExtractedData.supplier}</strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Document Date</span>
                <strong className="text-white text-xs block">{aiExtractedData.date}</strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Apply extracted quantity directly to metric?</span>
              <button
                type="button"
                onClick={() => handleConfirmUpload(true)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
              >
                Accept &amp; Auto-Fill Value
              </button>
            </div>
          </div>
        )}

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Document Type</label>
            <input
              type="text"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Document / Invoice Number</label>
            <input
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Document Date</label>
            <input
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Issuing Authority / Vendor</label>
            <input
              type="text"
              value={issuingAuthority}
              onChange={(e) => setIssuingAuthority(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-slate-300 font-semibold mb-1">Description / Contributor Remarks</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500"
              placeholder="e.g. Tanker challans 10-18 cross-verified with gate register."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleConfirmUpload(false)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-xs font-bold text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Attach Evidence</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
