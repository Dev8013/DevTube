import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Layers,
  Sparkles,
  Send,
  Edit,
  Code
} from 'lucide-react';
import { ProjectItem, UserProfile, CommentItem } from '../types';
import { api } from '../services/api';

interface ProjectWatchModalProps {
  project: ProjectItem;
  allProjects: ProjectItem[];
  profile: UserProfile;
  isAdmin: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
  onEditProject: (project: ProjectItem) => void;
  onToggleLike: (id: string) => void;
}

export const ProjectWatchModal: React.FC<ProjectWatchModalProps> = ({
  project,
  allProjects,
  profile,
  isAdmin,
  onClose,
  onSelectProject,
  onEditProject,
}) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeTab, setActiveTab] = useState<'thumbnail' | 'architecture' | 'live'>('thumbnail');

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    // Load comments
    api.getComments(project.id).then((data) => setComments(data));
  }, [project.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setIsSubmittingComment(true);
    const comment = await api.addComment({
      projectId: project.id,
      author: authorName.trim() || (isAdmin ? 'Dev Bhardwaj (Author)' : 'Software Engineer Visitor'),
      text: newCommentText.trim(),
      avatar: isAdmin
        ? profile.avatar
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isOwner: isAdmin,
    });

    setComments([comment, ...comments]);
    setNewCommentText('');
    setIsSubmittingComment(false);
  };

  const relatedProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md">
      <div className="min-h-screen px-2 py-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Top Close Bar */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="font-semibold text-white">Project Showcase</span>
            <span>•</span>
            <span className="text-red-400 font-medium">{project.category}</span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span>Close (Esc)</span>
          </button>
        </div>

        {/* 2-Column YouTube Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content Area (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col">
            {/* Pure Thumbnail & Architecture Showcase (NO video player controls / NO play button) */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black border border-neutral-800 shadow-2xl">
              {activeTab === 'thumbnail' && (
                <div className="relative h-full w-full">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  {/* Category & Duration subtle badge */}
                  <div className="absolute bottom-3 right-3 rounded-lg bg-black/85 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white">
                    {project.duration || 'Case Study'}
                  </div>
                  <div className="absolute top-3 left-3 rounded-lg bg-black/80 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-neutral-200">
                    {project.category}
                  </div>
                </div>
              )}

              {activeTab === 'architecture' && (
                <div className="h-full w-full overflow-y-auto bg-[#141414] p-6 text-neutral-200">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-3">
                    <Layers className="h-4 w-4" />
                    <span>Technical Architecture Blueprint</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="rounded-xl border border-neutral-800 bg-[#1c1c1c] p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Key Tech Stack</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-200 font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-neutral-800 bg-[#1c1c1c] p-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Category & Status</h4>
                      <p className="text-xs text-neutral-300">{project.category} • Production Grade</p>
                      <p className="text-xs text-emerald-400 mt-1">Live demo container available</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-neutral-800 bg-[#1c1c1c] p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Engineering Highlights</h4>
                    <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside">
                      {project.architectureHighlights?.map((h, i) => (
                        <li key={i}>{h}</li>
                      )) || (
                        <>
                          <li>Sub-50ms latency microservice architecture</li>
                          <li>Reactive state management with optimistic client reconciliation</li>
                          <li>Continuous deployment with automated lint and test verification</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'live' && (
                <div className="h-full w-full flex flex-col items-center justify-center bg-[#111111] p-6 text-center">
                  <Sparkles className="h-10 w-10 text-blue-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">Live Project Preview</h3>
                  <p className="text-xs text-neutral-400 max-w-md mb-4">
                    Launch the live deployed version of this project in an external viewport or direct tab.
                  </p>
                  <div className="flex items-center gap-3">
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Launch Live URL</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-neutral-800 hover:bg-neutral-700 px-5 py-2 text-xs font-semibold text-white transition-colors"
                      >
                        <Github className="h-4 w-4" />
                        <span>View Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mode Switch Tabs under Thumbnail (NO Video Showcase option) */}
            <div className="flex items-center gap-2 mt-3 pb-2 border-b border-neutral-800">
              <button
                onClick={() => setActiveTab('thumbnail')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'thumbnail' ? 'bg-[#272727] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Thumbnail View</span>
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'architecture' ? 'bg-[#272727] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-emerald-400" />
                <span>Architecture Blueprint</span>
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'live' ? 'bg-[#272727] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                <span>Live Site</span>
              </button>
            </div>

            {/* Project Title */}
            <h1 className="mt-4 text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {project.title}
            </h1>

            {/* Action Bar (NO profile pic, NO channel name, NO subscriber count, NO subscribe button, NO like, NO dislike, NO share) */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              {/* Views and Published Date */}
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-normal">
                <span>{project.views}</span>
                <span>•</span>
                <span>Published {project.publishedAt}</span>
                <span>•</span>
                <span className="text-neutral-300 font-medium">{project.category}</span>
              </div>

              {/* Action Buttons: GitHub, Live Demo, Admin Edit */}
              <div className="flex flex-wrap items-center gap-2">
                {/* GitHub Code Link */}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>View GitHub Repo</span>
                  </a>
                )}

                {/* Live Demo Link */}
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open Live Demo</span>
                  </a>
                )}

                {/* Admin Edit */}
                {isAdmin && (
                  <button
                    onClick={() => onEditProject(project)}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Project</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description Box */}
            <div className="mt-4 rounded-xl bg-[#272727]/80 p-4 text-xs text-neutral-200 transition-colors hover:bg-[#272727]">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 text-[11px] text-blue-400 font-mono">
                {project.tags.map((tag) => (
                  <span key={tag}>#{tag.toLowerCase().replace(/[^a-z0-9]/g, '')}</span>
                ))}
              </div>

              {/* Text */}
              <div className={`mt-3 whitespace-pre-line leading-relaxed ${showFullDesc ? '' : 'line-clamp-4'}`}>
                {project.description}
              </div>

              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-2 text-xs font-bold text-white hover:underline cursor-pointer"
              >
                {showFullDesc ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-8">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-base font-bold text-white">
                  {comments.length} Comments
                </h3>
                <span className="text-xs text-neutral-400">Sort by Top comments</span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                <div className="flex-1">
                  {!isAdmin && (
                    <input
                      type="text"
                      placeholder="Your name / title (optional)"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="mb-2 w-full rounded border border-neutral-800 bg-[#161616] px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                    />
                  )}
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add a comment or inquiry about this project..."
                    className="w-full border-b border-neutral-700 bg-transparent py-1.5 text-xs text-white placeholder-neutral-500 focus:border-white focus:outline-none"
                  />
                  {newCommentText && (
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setNewCommentText('')}
                        className="rounded-full px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingComment}
                        className="rounded-full bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                      >
                        Comment
                      </button>
                    </div>
                  )}
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{c.author}</span>
                        {c.isOwner && (
                          <span className="rounded bg-neutral-700 px-1.5 py-0.2 text-[10px] font-bold text-white">
                            Author
                          </span>
                        )}
                        <span className="text-[11px] text-neutral-500">{c.timestamp}</span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-300 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Projects Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-white mb-2">Other Projects</h3>
            {relatedProjects.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProject(rel)}
                className="group flex gap-2.5 cursor-pointer rounded-xl p-1.5 hover:bg-[#202020] transition-colors"
              >
                <div className="relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                  <img
                    src={rel.thumbnail}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.2 text-[9px] font-bold text-white">
                    {rel.duration}
                  </span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <h4 className="text-xs font-semibold text-neutral-200 line-clamp-2 group-hover:text-white leading-tight">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 truncate">{rel.category}</p>
                  <p className="text-[10px] text-neutral-500">{rel.views} • {rel.publishedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
