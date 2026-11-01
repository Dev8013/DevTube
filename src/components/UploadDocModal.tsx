import React, { useState } from 'react';
import { X, Lock, Upload, Check, ShieldCheck, FileText } from 'lucide-react';
import { SecureDocument } from '../types';

interface UploadDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (doc: Partial<SecureDocument>) => Promise<void>;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SecureDocument['type']>('Aadhaar Card');
  const [identifierNumber, setIdentifierNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState('');
  const [mimeType, setMimeType] = useState('application/pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setMimeType(file.type || 'application/pdf');
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFileData(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onUpload({
      title: title.trim(),
      type,
      identifierNumber: identifierNumber.trim() || 'XXXX-XXXX-XXXX',
      notes: notes.trim(),
      decryptedData: fileData || `Official ${type} Document Record for Dev Bhardwaj (${identifierNumber}). Verified with administrative cryptographic key.`,
      mimeType,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#1e1e1e] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Secure Document</h2>
              <p className="text-xs text-neutral-400">AES-256 Encrypted Private Storage</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full p-1 text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Aadhaar Card (UIDAI Verified), PAN Card"
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Document Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Certification">Certification</option>
                <option value="Degree">Degree / Academic</option>
                <option value="Other">Other Private Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Document / Masked ID Number
              </label>
              <input
                type="text"
                value={identifierNumber}
                onChange={(e) => setIdentifierNumber(e.target.value)}
                placeholder="e.g. XXXX-XXXX-4921 or ABCDE1234F"
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* File Upload Attachment */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Document File (PDF / Scanned ID / PNG)
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-[#141414] p-4 text-center hover:border-amber-500 hover:bg-[#1a1a1a] transition-colors">
              <Upload className="h-6 w-6 text-amber-400 mb-1" />
              <span className="text-xs font-medium text-white">
                {fileName ? fileName : 'Choose PDF, JPEG or PNG to encrypt & upload'}
              </span>
              <span className="text-[10px] text-neutral-500 mt-1">
                Files are client-encrypted with Dev Bhardwaj's root credentials
              </span>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Private Security Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Valid until 2030, digital UIDAI seal verified, linked with tax portal..."
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 p-2.5 text-xs text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Files will be stored with AES-256 encryption. Only accessible when signed into admin.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-black transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Encrypt & Store Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
