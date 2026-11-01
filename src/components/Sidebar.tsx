import React from 'react';
import {
  Home,
  Compass,
  Zap,
  Layers,
  Code2,
  Server,
  Cpu,
  Smartphone,
  Network,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  Lock,
  Film,
  Github,
  Linkedin,
  Mail,
  ShieldCheck,
  Check
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
  selectedCategory,
  onSelectCategory,
  onNavigate,
  isAdmin,
  onOpenLogin,
  profile,
}) => {
  const categories = [
    { id: 'all', label: 'All Projects', icon: Layers },
    { id: 'Full Stack', label: 'Full Stack', icon: Code2 },
    { id: 'Cloud & DevOps', label: 'Cloud & DevOps', icon: Server },
    { id: 'AI & ML', label: 'AI & Machine Learning', icon: Cpu },
    { id: 'Frontend', label: 'Frontend UI/UX', icon: Compass },
    { id: 'Mobile', label: 'Mobile Apps', icon: Smartphone },
    { id: 'Systems', label: 'Distributed Systems', icon: Network },
  ];

  if (!isExpanded) {
    // Collapsed icon-only YouTube mini sidebar
    return (
      <aside className="fixed left-0 top-14 bottom-0 z-30 flex w-18 flex-col items-center bg-[#0f0f0f] py-3 border-r border-[#272727] select-none">
        <button
          onClick={() => {
            onNavigate('home');
            onSelectCategory('all');
          }}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3.5 transition-colors ${
            currentView === 'home' ? 'bg-[#272727] text-white font-semibold' : 'text-neutral-400 hover:bg-[#202020] hover:text-white'
          }`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3.5 transition-colors ${
            currentView === 'profile' ? 'bg-[#272727] text-white font-semibold' : 'text-neutral-400 hover:bg-[#202020] hover:text-white'
          }`}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Channel</span>
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3.5 transition-colors ${
            currentView === 'vault' ? 'bg-[#272727] text-white font-semibold' : 'text-neutral-400 hover:bg-[#202020] hover:text-white'
          }`}
        >
          <Lock className="h-5 w-5 mb-1 text-amber-400" />
          <span className="text-[10px]">Vault</span>
        </button>

        {/* Secret Anime/Drama tracker button */}
        <button
          onClick={() => (isAdmin ? onNavigate('anime-tracker') : onOpenLogin())}
          className={`flex w-16 flex-col items-center justify-center rounded-xl py-3.5 transition-colors relative ${
            currentView === 'anime-tracker'
              ? 'bg-red-600/30 text-red-400 font-semibold'
              : 'text-neutral-400 hover:bg-[#202020] hover:text-red-400'
          }`}
        >
          <Film className="h-5 w-5 mb-1" />
          <span className="text-[10px]">Watchlist</span>
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-14 bottom-0 z-30 flex w-60 flex-col overflow-y-auto bg-[#0f0f0f] px-3 py-3 border-r border-[#272727] select-none">
      {/* Primary Section */}
      <div className="space-y-1 pb-3 border-b border-[#272727]">
        <button
          onClick={() => {
            onNavigate('home');
            onSelectCategory('all');
          }}
          className={`flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            currentView === 'home' && selectedCategory === 'all'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020]'
          }`}
        >
          <Home className="h-5 w-5 text-white" />
          <span>Home</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            currentView === 'profile'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020]'
          }`}
        >
          <User className="h-5 w-5 text-blue-400" />
          <span>Channel Profile & Bio</span>
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className={`flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-sm transition-colors ${
            currentView === 'vault'
              ? 'bg-[#272727] text-white font-medium'
              : 'text-neutral-300 hover:bg-[#202020]'
          }`}
        >
          <Lock className="h-5 w-5 text-amber-400" />
          <div className="flex items-center justify-between flex-1">
            <span>Documents Vault</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded font-mono">
              AES-256
            </span>
          </div>
        </button>
      </div>

      {/* Categories Playlists */}
      <div className="py-3 border-b border-[#272727]">
        <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Project Categories
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = currentView === 'home' && selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigate('home');
                  onSelectCategory(cat.id);
                }}
                className={`flex w-full items-center gap-4 rounded-xl px-3 py-2 text-xs transition-colors ${
                  isSelected
                    ? 'bg-[#272727] text-white font-medium'
                    : 'text-neutral-300 hover:bg-[#202020]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-red-500' : 'text-neutral-400'}`} />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dev's Career & Credentials */}
      <div className="py-3 border-b border-[#272727]">
        <h3 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Career & Education
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('experience')}
            className={`flex w-full items-center gap-4 rounded-xl px-3 py-2 text-xs transition-colors ${
              currentView === 'experience'
                ? 'bg-[#272727] text-white font-medium'
                : 'text-neutral-300 hover:bg-[#202020]'
            }`}
          >
            <Briefcase className="h-4 w-4 text-emerald-400" />
            <span>Work Experience</span>
          </button>

          <button
            onClick={() => onNavigate('education')}
            className={`flex w-full items-center gap-4 rounded-xl px-3 py-2 text-xs transition-colors ${
              currentView === 'education'
                ? 'bg-[#272727] text-white font-medium'
                : 'text-neutral-300 hover:bg-[#202020]'
            }`}
          >
            <GraduationCap className="h-4 w-4 text-indigo-400" />
            <span>Education & B.Tech</span>
          </button>

          <button
            onClick={() => onNavigate('resume')}
            className={`flex w-full items-center gap-4 rounded-xl px-3 py-2 text-xs transition-colors ${
              currentView === 'resume'
                ? 'bg-[#272727] text-white font-medium'
                : 'text-neutral-300 hover:bg-[#202020]'
            }`}
          >
            <FileText className="h-4 w-4 text-purple-400" />
            <span>Resume & CV</span>
          </button>
        </div>
      </div>

      {/* Secret Admin Watchlist Section */}
      <div className="py-3 border-b border-[#272727]">
        <div className="flex items-center justify-between px-3 pb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Private Dashboard
          </h3>
          <span className="text-[10px] text-red-400 font-mono">Admin Only</span>
        </div>

        <button
          onClick={() => {
            if (isAdmin) {
              onNavigate('anime-tracker');
            } else {
              onOpenLogin();
            }
          }}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all ${
            currentView === 'anime-tracker'
              ? 'bg-red-600/20 text-red-300 border border-red-500/30 font-medium'
              : 'text-neutral-300 hover:bg-[#202020] hover:text-red-400'
          }`}
        >
          <Film className="h-4 w-4 text-red-500 shrink-0" />
          <div className="flex flex-col text-left overflow-hidden">
            <span className="truncate font-semibold">Anime & Drama Tracker</span>
            <span className="text-[10px] text-neutral-400 truncate">Private episode watchlist</span>
          </div>
        </button>
      </div>

      {/* Channel Stats Mini Card */}
      <div className="mt-4 rounded-xl bg-[#1a1a1a] p-3 border border-[#272727]">
        <div className="flex items-center gap-2.5">
          <img
            src={profile.avatar}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full object-cover ring-1 ring-neutral-700"
          />
          <div className="overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white truncate">{profile.name}</span>
              <span className="text-[10px] text-neutral-400">✓</span>
            </div>
            <p className="text-[11px] text-neutral-400">{profile.subscribers}</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-neutral-400 line-clamp-2">
          {profile.portfolioStatus}
        </p>
        <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-[#2a2a2a]">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#2a2a2a] transition-colors"
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#2a2a2a] transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#2a2a2a] transition-colors"
            title="Email"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-auto pt-4 text-[10px] text-neutral-500 px-3 pb-6">
        <p>© 2026 Dev Bhardwaj</p>
        <p className="mt-1">YouTube Portfolio Engine</p>
      </div>
    </aside>
  );
};
