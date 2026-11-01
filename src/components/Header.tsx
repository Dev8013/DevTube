import React, { useState } from 'react';
import {
  Menu,
  Search,
  Mic,
  Video,
  Bell,
  User,
  Shield,
  Film,
  FolderLock,
  LogOut,
  X,
  CheckCircle,
  Plus,
  PlaySquare
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleSidebar: () => void;
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenUpload: () => void;
  onOpenEditProfile: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  searchTerm,
  onSearchChange,
  onToggleSidebar,
  isAdmin,
  onOpenLogin,
  onLogout,
  onOpenUpload,
  onOpenEditProfile,
  currentView,
  onNavigate,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const notifications = [
    { id: 1, title: 'New project published', time: '10 min ago', desc: 'Cloud Infrastructure Command telemetry demo is live.' },
    { id: 2, title: 'Private Vault Secured', time: '1 hour ago', desc: 'AES-256 credential storage verified with root key.' },
    { id: 3, title: 'Watchlist Progress', time: '3 hours ago', desc: 'Solo Leveling episode 18 marked as watched.' },
  ];

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Web speech simulation / SpeechRecognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onSearchChange(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        return;
      } catch {
        // fallback
      }
    }
    // Simulation fallback if browser microphone is restricted
    setTimeout(() => {
      onSearchChange('Full Stack');
      setIsListening(false);
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 bg-[#0f0f0f] px-4 border-b border-[#272727]">
      {/* Zone 1: Hamburger & Brand Wordmark */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          className="rounded-full p-2 text-white hover:bg-[#272727] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group text-left"
        >
          <div className="flex items-center justify-center h-7 w-9 rounded-lg bg-red-600 text-white font-bold transition-transform group-hover:scale-105">
            <PlaySquare className="h-5 w-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold tracking-tight text-white">DevTube</span>
              <span className="text-[10px] font-semibold text-neutral-400">IN</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-medium -mt-1 hidden sm:block">Dev Bhardwaj Portfolio</span>
          </div>
        </button>
      </div>

      {/* Zone 2: YouTube Centered Search Bar */}
      <div className="flex max-w-2xl flex-1 items-center justify-center">
        <div className="flex w-full max-w-xl items-center">
          <div className="relative flex flex-1 items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Dev's projects, tech stack, or architecture..."
              className="w-full rounded-l-full border border-[#303030] bg-[#121212] px-4 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center justify-center rounded-r-full border border-l-0 border-[#303030] bg-[#222222] px-6 py-2 text-neutral-300 hover:bg-[#272727] transition-colors"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            onClick={handleVoiceSearch}
            className={`ml-3 rounded-full p-2.5 transition-colors ${
              isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-[#222222] text-white hover:bg-[#272727]'
            }`}
            title="Search with your voice"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Zone 3: YouTube Action Controls & Profile Menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Create / Upload Project Button */}
        <button
          onClick={isAdmin ? onOpenUpload : onOpenLogin}
          className="flex items-center gap-1.5 rounded-full bg-[#272727] hover:bg-[#3f3f3f] px-3.5 py-1.5 text-xs font-semibold text-white transition-colors"
          title="Upload / Add Project"
        >
          <Plus className="h-4 w-4 text-red-500" />
          <span className="hidden md:inline">Create Project</span>
        </button>

        {/* Secret Anime/Drama Tracker Quick Link (Admin Only) */}
        {isAdmin && (
          <button
            onClick={() => onNavigate('anime-tracker')}
            className={`relative rounded-full p-2 transition-colors ${
              currentView === 'anime-tracker' ? 'bg-red-600/30 text-red-400 border border-red-500/40' : 'text-neutral-300 hover:bg-[#272727]'
            }`}
            title="Private Anime & Drama Dashboard"
          >
            <Film className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[#0f0f0f]" />
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-white hover:bg-[#272727] transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#303030] bg-[#212121] py-2 shadow-2xl z-50">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#303030]">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <span className="text-xs text-neutral-400">3 new</span>
              </div>
              <div className="divide-y divide-[#2f2f2f]">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-[#2b2b2b] transition-colors cursor-pointer">
                    <p className="text-xs font-medium text-white">{n.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">{n.desc}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Admin Switch */}
        <div className="relative">
          {isAdmin ? (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative flex items-center rounded-full ring-2 ring-emerald-500/60 p-0.5 transition-transform hover:scale-105"
              title="Dev Bhardwaj (Admin Authenticated)"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[8px] text-white font-bold">
                ✓
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-400 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Admin Sign In</span>
            </button>
          )}

          {/* User Dropdown Menu */}
          {showUserMenu && isAdmin && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[#303030] bg-[#212121] py-2 shadow-2xl z-50">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#303030]">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{profile.email}</p>
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">Admin Key Verified (Dev@8013)</p>
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
                >
                  <User className="h-4 w-4 text-neutral-400" />
                  <span>Your Channel & Profile</span>
                </button>

                <button
                  onClick={() => {
                    onOpenEditProfile();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
                >
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span>Customize Channel / Edit Bio</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('vault');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
                >
                  <FolderLock className="h-4 w-4 text-amber-400" />
                  <span>Encrypted Documents Vault</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('anime-tracker');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
                >
                  <Film className="h-4 w-4 text-red-500" />
                  <div className="flex items-center justify-between flex-1">
                    <span>Anime & Drama Tracker</span>
                    <span className="text-[10px] bg-red-600/30 text-red-400 px-1.5 py-0.5 rounded">Secret</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenUpload();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
                >
                  <Plus className="h-4 w-4 text-emerald-400" />
                  <span>Upload Showcase Project</span>
                </button>
              </div>

              <div className="border-t border-[#303030] pt-1">
                <button
                  onClick={() => {
                    onLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-xs text-red-400 hover:bg-[#2b2b2b]"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out of Admin</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
