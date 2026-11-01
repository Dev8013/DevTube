import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Plus,
  FileText,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Key,
  Check,
  AlertCircle
} from 'lucide-react';
import { SecureDocument } from '../types';

interface DocumentsVaultProps {
  documents: SecureDocument[];
  isAdmin: boolean;
  onOpenUpload: () => void;
  onDeleteDocument: (id: string) => Promise<void>;
  onOpenLogin: () => void;
}

export const DocumentsVault: React.FC<DocumentsVaultProps> = ({
  documents,
  isAdmin,
  onOpenUpload,
  onDeleteDocument,
  onOpenLogin,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [unlockedDocIds, setUnlockedDocIds] = useState<Set<string>>(new Set());

  const filters = ['All', 'Aadhaar Card', 'PAN Card', 'Certification', 'Degree', 'Other'];

  const filteredDocs = documents.filter((doc) => {
    if (selectedFilter === 'All') return true;
    return doc.type === selectedFilter;
  });

  const toggleUnlock = (id: string) => {
    if (!isAdmin) {
      onOpenLogin();
      return;
    }
    const next = new Set(unlockedDocIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setUnlockedDocIds(next);
  };

  const handleDownload = (doc: SecureDocument) => {
    const content = doc.decryptedData || `Document: ${doc.title}\nID: ${doc.identifierNumber}\nEncrypted Hash: ${doc.encryptedHash}\nVerified UIDAI/Govt Record for Dev Bhardwaj.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title.replace(/\s+/g, '_')}_secure.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 px-4 py-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-[#171510] via-[#1a1711] to-[#121212] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                <Lock className="h-3 w-3" />
                Private Identity Vault
              </span>
              <span className="text-xs text-neutral-400">• End-to-End Encrypted Storage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Encrypted Credentials & Documents
            </h1>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Secure private storage for your government IDs (Aadhaar cards, PAN cards), professional cloud
              certifications, and academic degree documents. Encrypted using AES-256 standard and shielded by
              Dev Bhardwaj's administrative key.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <button
                onClick={onOpenUpload}
                className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-bold text-black transition-colors shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Upload New Document</span>
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Key className="h-4 w-4 text-amber-400" />
                <span>Unlock Vault (Admin Login)</span>
              </button>
            )}
          </div>
        </div>

        {/* Security Status Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800/80 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Vault Status:</span>
            <span className="text-neutral-300">
              {isAdmin ? 'Master Key Verified (Dev@8013 Active)' : 'Locked • Viewing Metadata Mode'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400 text-[11px] font-mono">
            <span>Algorithm: AES-256-GCM</span>
            <span>•</span>
            <span>Total Stored: {documents.length} Records</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-800 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === f
                ? 'bg-amber-500 text-black'
                : 'bg-[#272727] text-neutral-300 hover:bg-[#383838]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => {
          const isUnlocked = unlockedDocIds.has(doc.id);

          return (
            <div
              key={doc.id}
              className="rounded-2xl border border-neutral-800 bg-[#1a1a1a] p-5 shadow-lg flex flex-col justify-between transition-colors hover:border-neutral-700"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
                        {doc.type}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-xs font-mono text-amber-400/90 mt-0.5">
                        ID: {doc.identifierNumber}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                    AES-256
                  </span>
                </div>

                {/* Encrypted Hash Tag */}
                <div className="mt-3 rounded-lg bg-[#121212] p-2.5 font-mono text-[11px] text-neutral-400 border border-neutral-800 overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                    <span>Cryptographic Hash / Ciphertext:</span>
                    <span>{doc.fileSize}</span>
                  </div>
                  <p className="truncate text-neutral-300">{doc.encryptedHash}</p>
                </div>

                {/* Decrypted Content View when toggled */}
                {isUnlocked && (
                  <div className="mt-3 rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-3 text-xs text-neutral-200">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mb-1">
                      <Check className="h-3.5 w-3.5" />
                      <span>Decrypted Document Record:</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-line text-neutral-300">
                      {doc.decryptedData || 'Verified Govt / Academic Record for Dev Bhardwaj.'}
                    </p>
                    {doc.notes && (
                      <p className="mt-2 text-[11px] text-neutral-400 italic">
                        Note: {doc.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-800 text-xs">
                <span className="text-[11px] text-neutral-500">
                  Uploaded on {doc.uploadDate}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUnlock(doc.id)}
                    className="flex items-center gap-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 font-semibold text-white transition-colors"
                  >
                    {isUnlocked ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-amber-400" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-amber-400" />
                        <span>Decrypt & View</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Download Document"
                  >
                    <Download className="h-4 w-4" />
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        if (confirm(`Purge "${doc.title}" from secure vault?`)) {
                          onDeleteDocument(doc.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/50 text-neutral-400 hover:text-red-400 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
