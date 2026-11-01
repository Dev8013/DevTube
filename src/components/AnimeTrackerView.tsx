import React, { useState } from 'react';
import {
  Film,
  Plus,
  Play,
  CheckCircle,
  Clock,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Check,
  RotateCcw,
  Star,
  ChevronRight,
  Tv
} from 'lucide-react';
import { AnimeDramaItem, DramaCategory, WatchStatus } from '../types';

interface AnimeTrackerViewProps {
  items: AnimeDramaItem[];
  isAdmin: boolean;
  onToggleEpisode: (id: string, episodeNumber: number) => Promise<void>;
  onBatchWatch: (id: string, markAll: boolean) => Promise<void>;
  onDeleteItem: (id: string) => Promise<void>;
  onSaveItem: (item: Partial<AnimeDramaItem>) => Promise<void>;
  onOpenAddModal: () => void;
  onEditItem: (item: AnimeDramaItem) => void;
}

export const AnimeTrackerView: React.FC<AnimeTrackerViewProps> = ({
  items,
  isAdmin,
  onToggleEpisode,
  onBatchWatch,
  onDeleteItem,
  onOpenAddModal,
  onEditItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<AnimeDramaItem | null>(null);

  // Sync activeItem if items update
  const currentActive = activeItem ? items.find((x) => x.id === activeItem.id) || activeItem : null;

  const categories = ['All', 'Anime', 'Chinese Drama', 'Korean Drama', 'Other Series'];
  const statusFilters = ['All', 'Watching', 'Upcoming', 'Planned to watch', 'Completed'];

  const filteredItems = items.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesCat && matchesStat;
  });

  // Calculate high-level stats
  const totalSeries = items.length;
  const watchingCount = items.filter((x) => x.status === 'Watching').length;
  const completedCount = items.filter((x) => x.status === 'Completed').length;
  const totalWatchedEpisodes = items.reduce((acc, curr) => acc + curr.watchedEpisodes, 0);

  const getStatusBadge = (status: WatchStatus) => {
    switch (status) {
      case 'Watching':
        return 'bg-blue-600/90 text-white';
      case 'Completed':
        return 'bg-emerald-600/90 text-white';
      case 'Upcoming':
        return 'bg-amber-600/90 text-white';
      case 'Planned to watch':
        return 'bg-purple-600/90 text-white';
      default:
        return 'bg-neutral-800 text-neutral-200';
    }
  };

  return (
    <div className="flex-1 px-4 py-6 max-w-7xl mx-auto">
      {/* Top Banner: YouTube Studio Theme Header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-[#1a1414] via-[#1c1818] to-[#121212] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded bg-red-600/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-red-400 border border-red-500/30">
                <Tv className="h-3 w-3" />
                Dev's Secret Vault
              </span>
              <span className="text-xs text-neutral-400">• Authenticated Admin Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Private Anime & Drama Tracker
            </h1>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Organize your watchlist and track episodic progress with live interactive completion tracking.
              Episodes turn <span className="font-semibold text-emerald-400">Green</span> when watched and{' '}
              <span className="font-semibold text-rose-400">Red</span> when unwatched.
            </p>
          </div>

          {/* Quick Stats Strip */}
          <div className="flex items-center gap-4 bg-[#141414]/90 border border-neutral-800 rounded-xl p-3 shrink-0">
            <div className="text-center px-2">
              <p className="text-lg font-bold text-white font-mono">{totalSeries}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Series</p>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="text-center px-2">
              <p className="text-lg font-bold text-blue-400 font-mono">{watchingCount}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Watching</p>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="text-center px-2">
              <p className="text-lg font-bold text-emerald-400 font-mono">{completedCount}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">Finished</p>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div className="text-center px-2">
              <p className="text-lg font-bold text-red-500 font-mono">{totalWatchedEpisodes}</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">EP Watched</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-neutral-800/80">
          <span className="text-xs text-neutral-400">
            Tracking: Anime, Chinese Drama (C-Drama), Korean Drama (K-Drama), TV Series
          </span>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white transition-colors shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Series</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-black'
                : 'bg-[#272727] text-neutral-200 hover:bg-[#383838]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Status Sub-Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-neutral-800">
        <span className="text-xs text-neutral-400 self-center mr-1">Status:</span>
        {statusFilters.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium whitespace-nowrap transition-colors ${
              selectedStatus === st
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-[#1e1e1e] text-neutral-300 hover:bg-[#2b2b2b]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* YouTube Style Grid */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => {
          const progressPercent = Math.round((item.watchedEpisodes / (item.totalEpisodes || 1)) * 100);

          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group flex flex-col cursor-pointer transition-transform hover:-translate-y-1"
            >
              {/* 16:9 Thumbnail Cover */}
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#202020] border border-neutral-800 shadow">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Status Badge in bottom right */}
                <div
                  className={`absolute bottom-2 right-2 rounded px-2 py-0.5 text-[11px] font-bold tracking-wide shadow-md ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </div>

                {/* Category tag in top left */}
                <div className="absolute top-2 left-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {item.category}
                </div>

                {/* Rating in top right */}
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span>{item.rating}</span>
                </div>

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Metadata Block */}
              <div className="mt-3 flex flex-col px-0.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-1 group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  {item.originalTitle && (
                    <span className="text-[10px] text-neutral-400 truncate max-w-[40%] font-normal">
                      {item.originalTitle}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-1 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* EP/EP Count and Status Instead of Views */}
                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {item.watchedEpisodes} / {item.totalEpisodes} EP
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-400 font-medium">({item.status})</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400 font-semibold">
                    {progressPercent}%
                  </span>
                </div>

                {/* Progress Bar Tracking Completion Percentage */}
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progressPercent === 100
                        ? 'bg-emerald-500'
                        : progressPercent > 50
                        ? 'bg-blue-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Card Quick Actions */}
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-neutral-800/60 text-xs">
                  <span className="text-[11px] text-neutral-400">Click to track episodes</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem(item);
                      }}
                      className="p-1 text-neutral-400 hover:text-white rounded"
                      title="Edit Series"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove "${item.title}" from your private watchlist?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="p-1 text-neutral-400 hover:text-red-400 rounded"
                      title="Delete Series"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Episode Tracker Modal */}
      {currentActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-[#1e1e1e] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                  <img
                    src={currentActive.thumbnail}
                    alt={currentActive.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold">
                      {currentActive.category}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">
                      {currentActive.releaseYear} • ★ {currentActive.rating}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                    {currentActive.title}
                  </h2>
                  {currentActive.originalTitle && (
                    <p className="text-xs text-neutral-400">{currentActive.originalTitle}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Synopsis */}
            <div className="mt-4 rounded-xl bg-[#141414] p-3 text-xs text-neutral-300 leading-relaxed">
              {currentActive.description}
            </div>

            {/* Live Progress Bar Section */}
            <div className="mt-4 rounded-xl border border-neutral-800 bg-[#161616] p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">Completion Progress:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {currentActive.watchedEpisodes} of {currentActive.totalEpisodes} Episodes Watched
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-white">
                  {Math.round((currentActive.watchedEpisodes / (currentActive.totalEpisodes || 1)) * 100)}%
                </span>
              </div>

              {/* Bar */}
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentActive.watchedEpisodes === currentActive.totalEpisodes
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-red-600 to-emerald-500'
                  }`}
                  style={{
                    width: `${Math.round(
                      (currentActive.watchedEpisodes / (currentActive.totalEpisodes || 1)) * 100
                    )}%`,
                  }}
                />
              </div>

              {/* Status and Batch Buttons */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-neutral-400">Current Status:</span>
                  <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${getStatusBadge(currentActive.status)}`}>
                    {currentActive.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBatchWatch(currentActive.id, true)}
                    className="flex items-center gap-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white px-2.5 py-1 text-xs font-semibold transition-colors border border-emerald-500/40"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Mark All Watched</span>
                  </button>
                  <button
                    onClick={() => onBatchWatch(currentActive.id, false)}
                    className="flex items-center gap-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2.5 py-1 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Instruction Banner for Episode Button States */}
            <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2 text-xs text-neutral-300">
              <span className="font-semibold text-white">Interactive Episode Command:</span>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-emerald-400 font-medium">Green = Watched</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-600 shadow-sm" />
                  <span className="text-rose-400 font-medium">Red = Not Watched</span>
                </div>
              </div>
            </div>

            {/* EPISODE BUTTONS GRID */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Click any episode to toggle Watched (Green) / Unwatched (Red):
              </h4>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {Array.from({ length: currentActive.totalEpisodes }, (_, i) => i + 1).map((ep) => {
                  const isWatched = currentActive.watchedList.includes(ep);

                  return (
                    <button
                      key={ep}
                      onClick={() => onToggleEpisode(currentActive.id, ep)}
                      className={`relative flex flex-col items-center justify-center rounded-xl py-3 px-1 text-xs font-bold transition-all duration-150 transform active:scale-95 shadow ${
                        isWatched
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 shadow-emerald-950/40'
                          : 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/60'
                      }`}
                      title={`Episode ${ep}: ${isWatched ? 'Watched' : 'Not Watched'}`}
                    >
                      <span className="text-[10px] uppercase font-mono opacity-80">EP</span>
                      <span className="text-sm font-extrabold">{ep}</span>
                      <span className="text-[9px] mt-0.5 opacity-90">
                        {isWatched ? '✓ Watched' : '✗ Unwatched'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-800">
              <span className="text-[11px] text-neutral-500">
                Data persists automatically to MongoDB & Local Cache
              </span>
              <button
                onClick={() => setActiveItem(null)}
                className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-5 py-2 text-xs font-bold text-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
