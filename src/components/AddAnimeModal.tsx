import React, { useState } from 'react';
import { X, Film, Check, Plus, Image as ImageIcon } from 'lucide-react';
import { AnimeDramaItem, DramaCategory, WatchStatus } from '../types';

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<AnimeDramaItem>) => Promise<void>;
  editingItem?: AnimeDramaItem | null;
}

const PRESET_COVERS = [
  { label: 'Anime Sunset City', url: '/src/assets/images/yt_thumb_anime_tracker_1793508229451.jpg' },
  { label: 'Anime Hero Battle', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Chinese Drama Romance', url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Korean Drama City', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Youth & Music Drama', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sci-Fi Action Series', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80' },
];

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [category, setCategory] = useState<DramaCategory>('Anime');
  const [status, setStatus] = useState<WatchStatus>('Watching');
  const [totalEpisodes, setTotalEpisodes] = useState<number>(12);
  const [watchedEpisodes, setWatchedEpisodes] = useState<number>(1);
  const [thumbnail, setThumbnail] = useState(PRESET_COVERS[0].url);
  const [rating, setRating] = useState<number>(9.0);
  const [description, setDescription] = useState('');
  const [genresInput, setGenresInput] = useState('Action, Fantasy');
  const [releaseYear, setReleaseYear] = useState('2025');
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setOriginalTitle(editingItem.originalTitle || '');
      setCategory(editingItem.category);
      setStatus(editingItem.status);
      setTotalEpisodes(editingItem.totalEpisodes);
      setWatchedEpisodes(editingItem.watchedEpisodes);
      setThumbnail(editingItem.thumbnail);
      setRating(editingItem.rating);
      setDescription(editingItem.description);
      setGenresInput(editingItem.genres.join(', '));
      setReleaseYear(editingItem.releaseYear);
    } else {
      setTitle('');
      setOriginalTitle('');
      setCategory('Anime');
      setStatus('Watching');
      setTotalEpisodes(12);
      setWatchedEpisodes(0);
      setThumbnail(PRESET_COVERS[0].url);
      setRating(9.2);
      setDescription('');
      setGenresInput('Action, Romance, Drama');
      setReleaseYear('2025');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const genres = genresInput
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);

    await onSave({
      title: title.trim(),
      originalTitle: originalTitle.trim(),
      category,
      status,
      totalEpisodes: Number(totalEpisodes) || 12,
      watchedEpisodes: Number(watchedEpisodes) || 0,
      thumbnail,
      rating: Number(rating) || 9.0,
      description: description.trim(),
      genres,
      releaseYear: releaseYear.trim(),
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-[#1e1e1e] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
              <Film className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingItem ? 'Edit Watchlist Item' : 'Add to Private Watchlist'}
              </h2>
              <p className="text-xs text-neutral-400">Anime, Chinese Drama, Korean Drama & Series</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full p-1 text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solo Leveling, Hidden Love"
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Original Native Title</label>
              <input
                type="text"
                value={originalTitle}
                onChange={(e) => setOriginalTitle(e.target.value)}
                placeholder="e.g. 偷偷藏不住, 나 혼자만 레벨업"
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DramaCategory)}
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Anime">Anime</option>
                <option value="Chinese Drama">Chinese Drama</option>
                <option value="Korean Drama">Korean Drama</option>
                <option value="Other Series">Other Series</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Watch Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WatchStatus)}
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Watching">Watching</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Planned to watch">Planned to watch</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Total Episodes</label>
              <input
                type="number"
                min={1}
                max={500}
                value={totalEpisodes}
                onChange={(e) => setTotalEpisodes(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Watched Episodes</label>
              <input
                type="number"
                min={0}
                max={totalEpisodes}
                value={watchedEpisodes}
                onChange={(e) => setWatchedEpisodes(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Rating (★)</label>
              <input
                type="number"
                step="0.1"
                min={1}
                max={10}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Cover Image & Presets */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Cover Image URL</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="Image URL..."
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRESET_COVERS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setThumbnail(preset.url)}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium ${
                    thumbnail === preset.url ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Synopsis / Notes</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Plot overview, main characters, favorite arcs..."
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
            />
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
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-5 py-2 text-xs font-bold text-white transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{editingItem ? 'Save Series' : 'Add to Watchlist'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
