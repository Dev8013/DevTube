import React, { useState, useEffect } from 'react';
import { X, Database, RefreshCw, Trash2, Check, AlertCircle, Shield, Server, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataPurged: () => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({
  isOpen,
  onClose,
  onDataPurged,
}) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [customCluster, setCustomCluster] = useState('');
  const [isPurging, setIsPurging] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getDbStatus();
      setStatus(data);
    } catch {
      setStatus({ success: false, mongoConnected: false, storage: 'Local Persistent Store' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setNotice(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearAllData = async () => {
    if (!window.confirm('Are you sure you want to delete ALL data from the database and frontend? This will purge MongoDB collections and reset all items to empty.')) {
      return;
    }

    setIsPurging(true);
    try {
      const res = await api.clearAllData();
      setNotice({ type: 'success', text: res.message || 'All sample data deleted from database and local storage.' });
      onDataPurged();
      fetchStatus();
    } catch (e: any) {
      setNotice({ type: 'error', text: e?.message || 'Purge failed' });
    } finally {
      setIsPurging(false);
    }
  };

  const handleConnectMongo = async () => {
    if (!customCluster.trim()) return;
    setLoading(true);
    setNotice(null);
    try {
      const res = await api.connectMongo(customCluster.trim());
      if (res.success) {
        setNotice({ type: 'success', text: res.message });
        fetchStatus();
        onDataPurged();
      } else {
        setNotice({ type: 'error', text: res.message });
      }
    } catch (e: any) {
      setNotice({ type: 'error', text: e?.message || 'Connection failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-[#1e1e1e] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400">
              <Database className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Database & Real-Time Sync</h2>
              <p className="text-xs text-neutral-400">MongoDB Atlas & Frontend State Manager</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full p-1 text-neutral-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notice feedback */}
        {notice && (
          <div
            className={`mt-4 rounded-xl border p-3 text-xs flex items-center gap-2.5 ${
              notice.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/40 bg-red-500/10 text-red-300'
            }`}
          >
            {notice.type === 'success' ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Current Database Status */}
        <div className="mt-4 rounded-xl bg-[#141414] border border-neutral-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400">Current Storage Backend:</span>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${status?.mongoConnected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              <span className="text-xs font-semibold text-white">
                {status?.storage || 'Checking connection...'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
            <span className="text-neutral-400">MongoDB User:</span>
            <span className="font-mono text-neutral-200">bhardwajdev269_db_user</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-800/60">
            <span className="text-neutral-400">Live Item Count (In Database):</span>
            <span className="font-mono text-emerald-400 font-bold">
              {status?.stats ? `${status.stats.projects} Projects • ${status.stats.documents} Documents • ${status.stats.animeDrama} Series` : '0 Projects (Clean)'}
            </span>
          </div>
        </div>

        {/* Action 1: Delete all sample data */}
        <div className="mt-5 rounded-xl border border-red-500/20 bg-red-950/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete All Sample Data from Database</span>
              </h4>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                Permanently wipes all sample data from MongoDB collections and local storage so you can upload your real projects, documents, and watchlist items from a clean slate.
              </p>
            </div>

            <button
              onClick={handleClearAllData}
              disabled={isPurging}
              className="shrink-0 flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 px-3.5 py-2 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm"
            >
              {isPurging ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              <span>{isPurging ? 'Purging...' : 'Delete All Data'}</span>
            </button>
          </div>
        </div>

        {/* Action 2: Connect MongoDB Atlas Cluster */}
        <div className="mt-4 rounded-xl border border-neutral-800 bg-[#141414] p-4">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
            <Server className="h-3.5 w-3.5 text-blue-400" />
            <span>MongoDB Atlas Cluster Connection</span>
          </h4>
          <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
            Your credentials (<span className="text-white font-mono">bhardwajdev269_db_user</span>) are preconfigured. Enter your Atlas cluster hostname (e.g. <span className="font-mono text-neutral-300">cluster0.abcde.mongodb.net</span>) or full connection string to connect directly:
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customCluster}
              onChange={(e) => setCustomCluster(e.target.value)}
              placeholder="e.g. cluster0.xxxxx.mongodb.net or mongodb+srv://..."
              className="flex-1 rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none font-mono"
            />
            <button
              onClick={handleConnectMongo}
              disabled={loading || !customCluster.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 disabled:opacity-50 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
              <span>Connect</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-neutral-800 text-xs">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Sync Status</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-lg bg-[#272727] hover:bg-[#383838] px-4 py-2 font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
