import React, { useState } from 'react';
import { X, Lock, Shield, ArrowRight, UserCheck, KeyRound, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [identifier, setIdentifier] = useState('bhardwajdev269@gmail.com');
  const [password, setPassword] = useState('Dev@8013');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.login(identifier.trim(), password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Invalid administrative credentials');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (user: 'email' | 'username') => {
    if (user === 'email') {
      setIdentifier('bhardwajdev269@gmail.com');
    } else {
      setIdentifier('Onicha69');
    }
    setPassword('Dev@8013');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-[#1c1c1c] p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Dev Bhardwaj Admin Portal</h2>
              <p className="text-xs text-neutral-400">Unlock Watchlist, Vault & Editing</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full p-1 text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Autofill Helper for convenience */}
        <div className="mt-4 rounded-xl border border-neutral-800 bg-[#141414] p-3 text-xs text-neutral-300">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-white">Authorised Admin Access:</span>
            <span className="text-[10px] text-emerald-400 font-mono">ROOT VERIFIED</span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-2">
            Sign in as Dev Bhardwaj to manage project showcases, view encrypted documents, and access your private Anime/Drama tracker.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('email')}
              className="rounded bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[11px] text-neutral-200 transition-colors"
            >
              Autofill Email
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('username')}
              className="rounded bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[11px] text-neutral-200 transition-colors"
            >
              Autofill Username
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-950/50 border border-red-800/60 p-2.5 text-xs text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Admin Email or Username
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="bhardwajdev269@gmail.com or Onicha69"
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Root Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Dev@8013"
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 py-2.5 text-xs font-bold text-white transition-colors disabled:opacity-50 shadow-lg"
            >
              <KeyRound className="h-4 w-4" />
              <span>{isLoading ? 'Verifying Key...' : 'Authenticate & Unlock Admin Mode'}</span>
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-[11px] text-neutral-500">
          <span>Protected with cryptographic authentication</span>
        </div>
      </div>
    </div>
  );
};
