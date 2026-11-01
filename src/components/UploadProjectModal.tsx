import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Check, Sparkles } from 'lucide-react';
import { ProjectItem } from '../types';

interface UploadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<ProjectItem>) => Promise<void>;
  editingProject?: ProjectItem | null;
}

const PRESET_THUMBNAILS = [
  { label: 'Cloud Architecture', url: '/src/assets/images/yt_thumb_cloud_platform_1793508227442.jpg' },
  { label: 'Autonomous AI Studio', url: '/src/assets/images/yt_thumb_ai_agent_1793508227549.jpg' },
  { label: 'Next.js 3D E-Commerce', url: '/src/assets/images/yt_thumb_ecommerce_nextjs_1793508227601.jpg' },
  { label: 'Anime Neo Skyline', url: '/src/assets/images/yt_thumb_anime_tracker_1793508229451.jpg' },
  { label: 'Distributed Systems', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Crypto & FinTech', url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&q=80' },
];

export const UploadProjectModal: React.FC<UploadProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject,
}) => {
  const [shortName, setShortName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('/src/assets/images/yt_thumb_cloud_platform_1793508227442.jpg');
  const [duration, setDuration] = useState('14:30');
  const [category, setCategory] = useState<'Full Stack' | 'Frontend' | 'AI & ML' | 'Cloud & DevOps' | 'Mobile' | 'Systems'>('Full Stack');
  const [tagsInput, setTagsInput] = useState('React, TypeScript, Node.js');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setShortName(editingProject.shortName || '');
      setTitle(editingProject.title || '');
      setDescription(editingProject.description || '');
      setThumbnail(editingProject.thumbnail || PRESET_THUMBNAILS[0].url);
      setDuration(editingProject.duration || '12:00');
      setCategory(editingProject.category || 'Full Stack');
      setTagsInput(editingProject.tags ? editingProject.tags.join(', ') : '');
      setGithubUrl(editingProject.githubUrl || '');
      setLiveDemoUrl(editingProject.liveDemoUrl || '');
    } else {
      setShortName('');
      setTitle('');
      setDescription('');
      setThumbnail(PRESET_THUMBNAILS[0].url);
      setDuration('15:20');
      setCategory('Full Stack');
      setTagsInput('React 19, TypeScript, Node.js');
      setGithubUrl('https://github.com/Onicha69');
      setLiveDemoUrl('');
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setThumbnail(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    await onSave({
      shortName: shortName.trim() || title.trim(),
      title: title.trim(),
      description: description.trim(),
      thumbnail,
      duration: duration.trim() || 'Live Demo',
      category,
      tags,
      githubUrl: githubUrl.trim(),
      liveDemoUrl: liveDemoUrl.trim(),
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-[#1e1e1e] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingProject ? 'Edit Showcase Project' : 'Upload New Showcase Project'}
              </h2>
              <p className="text-xs text-neutral-400">DevTube Studio Content Manager</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Project Name & Video Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Project Short Name
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. Cloud Telemetry Engine"
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
              >
                <option value="Full Stack">Full Stack</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Frontend">Frontend UI/UX</option>
                <option value="Mobile">Mobile</option>
                <option value="Systems">Distributed Systems</option>
              </select>
            </div>
          </div>

          {/* Full Video Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Full Video / Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Building an Autonomous Multi-Agent Full-Stack Code Generator"
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Project Description & Architecture Walkthrough
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed architecture writeup, key features, benchmarks, and problems solved..."
              className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Thumbnail Selection & Preview */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Thumbnail (16:9 4K Quality)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Preview */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900">
                <img
                  src={thumbnail}
                  alt="preview"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] text-white">
                  {duration}
                </span>
              </div>

              {/* Upload or URL input */}
              <div className="space-y-2">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-600 bg-[#161616] p-3 text-xs text-neutral-300 hover:border-red-500 hover:bg-[#202020] transition-colors">
                  <Upload className="h-4 w-4 text-red-500" />
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="Or paste direct image URL..."
                  className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-neutral-400 self-center">Presets:</span>
              {PRESET_THUMBNAILS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setThumbnail(preset.url)}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium transition-colors ${
                    thumbnail === preset.url
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration, Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Duration Badge / Label
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 18:45 or Live Demo"
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Tech Stack Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="React, TypeScript, Docker, Redis"
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* GitHub & Live Demo Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/Onicha69/..."
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Live Deployment URL
              </label>
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://myproject.demo.dev"
                className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
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
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-5 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              <span>{editingProject ? 'Save Changes' : 'Publish to Showcase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
