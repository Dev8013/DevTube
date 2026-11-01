import React from 'react';
import {
  Home,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Lock,
  Film
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  isExpanded: boolean;
  currentView: string;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onNavigate: (view: string) => void;
  isAdmin: boolean;
  onOpenLogin: () => void;
  profile: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  currentView,
  onSelectCategory,
  onNavigate,
  isAdmin,
  onOpenLogin,
}) => {
  if (!isExpanded) {
    // Collapsed icon-only YouTube mini sidebar (matches Screenshot 2 style)
    return (
      <aside className="fixed left-0 top-14 bottom-0 z-30 flex w-18 flex-col items-center bg-[#0f0f0f] py-2 border-r border-[#222222] select-none">
        <button
          onClick={() => {
            onNavigate('home');
            onSelectCategory('All');
          }}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3 transition-colors ${
            currentView === 'home'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020] hover:text-white'
          }`}
          title="Home"
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3 transition-colors ${
            currentView === 'profile'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020] hover:text-white'
          }`}
          title="Channel Profile"
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Channel</span>
        </button>

        <button
          onClick={() => onNavigate('resume')}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3 transition-colors ${
            currentView === 'resume'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020] hover:text-white'
          }`}
          title="Resume"
        >
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Resume</span>
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3 transition-colors ${
            currentView === 'vault'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020] hover:text-white'
          }`}
          title="Documents Vault"
        >
          <Lock className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Vault</span>
        </button>

        {/* Private Watchlist */}
        <button
          onClick={() => (isAdmin ? onNavigate('anime-tracker') : onOpenLogin())}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3 transition-colors relative ${
            currentView === 'anime-tracker'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020] hover:text-white'
          }`}
          title="Private Watchlist"
        >
          <Film className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Watchlist</span>
          {isAdmin && (
            <span className="absolute top-2.5 right-3 h-1.5 w-1.5 rounded-full bg-red-500" />
          )}
        </button>
      </aside>
    );
  }

  // Expanded smooth YouTube sidebar matching Screenshot 2
  return (
    <aside className="fixed left-0 top-14 bottom-0 z-30 flex w-60 flex-col overflow-y-auto bg-[#0f0f0f] px-3 py-3 border-r border-[#222222] select-none">
      {/* Primary Navigation */}
      <div className="space-y-1 pb-3 border-b border-[#222222]">
        <button
          onClick={() => {
            onNavigate('home');
            onSelectCategory('All');
          }}
          className={`flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            currentView === 'home'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-200 hover:bg-[#202020]'
          }`}
        >
          <Home className="h-5 w-5 text-white" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            currentView === 'profile'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-200 hover:bg-[#202020]'
          }`}
        >
          <User className="h-5 w-5 text-neutral-300" />
          <span>Channel Profile & Bio</span>
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className={`flex w-full items-center gap-5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            currentView === 'vault'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-200 hover:bg-[#202020]'
          }`}
        >
          <Lock className="h-5 w-5 text-neutral-300" />
          <div className="flex items-center justify-between flex-1">
            <span>Documents Vault</span>
            <span className="text-[10px] text-neutral-400 bg-[#1e1e1e] px-1.5 py-0.5 rounded font-mono">
              AES-256
            </span>
          </div>
        </button>
      </div>

      {/* Career & Resume Section */}
      <div className="py-3 border-b border-[#222222]">
        <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Career & Education
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('resume')}
            className={`flex w-full items-center gap-5 rounded-xl px-3 py-2 text-sm transition-colors ${
              currentView === 'resume'
                ? 'bg-[#272727] text-white font-medium'
                : 'text-neutral-200 hover:bg-[#202020]'
            }`}
          >
            <FileText className="h-4 w-4 text-neutral-400" />
            <span>Resume & CV</span>
          </button>

          <button
            onClick={() => onNavigate('experience')}
            className={`flex w-full items-center gap-5 rounded-xl px-3 py-2 text-sm transition-colors ${
              currentView === 'experience'
                ? 'bg-[#272727] text-white font-medium'
                : 'text-neutral-200 hover:bg-[#202020]'
            }`}
          >
            <Briefcase className="h-4 w-4 text-neutral-400" />
            <span>Work Experience</span>
          </button>

          <button
            onClick={() => onNavigate('education')}
            className={`flex w-full items-center gap-5 rounded-xl px-3 py-2 text-sm transition-colors ${
              currentView === 'education'
                ? 'bg-[#272727] text-white font-medium'
                : 'text-neutral-200 hover:bg-[#202020]'
            }`}
          >
            <GraduationCap className="h-4 w-4 text-neutral-400" />
            <span>Education</span>
          </button>
        </div>
      </div>

      {/* Admin Watchlist Tab */}
      <div className="py-3 border-b border-[#222222]">
        <div className="flex items-center justify-between px-3 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Private Watchlist
          </h3>
          <span className="text-[10px] text-neutral-500 font-mono">Admin</span>
        </div>

        <button
          onClick={() => {
            if (isAdmin) {
              onNavigate('anime-tracker');
            } else {
              onOpenLogin();
            }
          }}
          className={`flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            currentView === 'anime-tracker'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-200 hover:bg-[#202020]'
          }`}
        >
          <Film className="h-5 w-5 text-neutral-300 shrink-0" />
          <div className="flex flex-col text-left overflow-hidden">
            <span className="truncate">Anime & Drama Tracker</span>
            <span className="text-[11px] text-neutral-400 truncate">Episode progress</span>
          </div>
        </button>
      </div>

      <div className="mt-auto pt-6 text-[11px] text-neutral-500 px-3 pb-6">
        <p>© 2026 Dev Bhardwaj</p>
      </div>
    </aside>
  );
};
