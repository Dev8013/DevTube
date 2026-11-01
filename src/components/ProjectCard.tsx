import React, { useState } from 'react';
import {
  MoreVertical,
  ExternalLink,
  Github,
  Trash2,
  Edit,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react';
import { ProjectItem, UserProfile } from '../types';

interface ProjectCardProps {
  project: ProjectItem;
  profile: UserProfile;
  index: number;
  totalProjects: number;
  isAdmin: boolean;
  onOpenProject: (project: ProjectItem) => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onToggleLike: (id: string) => void;
  onMoveProject?: (index: number, direction: 'up' | 'down') => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  totalProjects,
  isAdmin,
  onOpenProject,
  onEditProject,
  onDeleteProject,
  onMoveProject,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div
      draggable={isAdmin}
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDrop={(e) => onDrop && onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`group relative flex flex-col cursor-pointer transition-all ${
        isDragging ? 'opacity-40 scale-[0.98] ring-2 ring-red-500 rounded-xl' : 'hover:-translate-y-1'
      }`}
    >
      {/* 16:9 Thumbnail Container (Pure Thumbnail Only, NO video option/play button) */}
      <div
        onClick={() => onOpenProject(project)}
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#202020] border border-[#272727] shadow-sm"
      >
        {imageError ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#262626] p-4 text-center">
            <p className="text-xs font-semibold text-white truncate max-w-full px-2">{project.title}</p>
            <p className="text-[10px] text-neutral-400 mt-1">{project.category}</p>
          </div>
        ) : (
          <img
            src={project.thumbnail}
            alt={project.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Duration / Tag Badge in bottom right */}
        <div className="absolute bottom-2 right-2 rounded bg-black/85 px-2 py-0.5 text-[11px] font-semibold text-white tracking-wide">
          {project.duration || 'Case Study'}
        </div>

        {/* Drag Handle if Admin */}
        {isAdmin && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/80 px-2 py-1 text-[10px] font-medium text-neutral-300 backdrop-blur-sm cursor-grab active:cursor-grabbing border border-neutral-700/60"
            title="Drag to reorder card"
          >
            <GripVertical className="h-3.5 w-3.5 text-neutral-400" />
            <span>#{index + 1}</span>
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute top-2 right-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-medium text-neutral-200 backdrop-blur-sm">
          {project.category}
        </div>
      </div>

      {/* Project Metadata Block (NO avatar profile pic, NO channel name, NO subscriber count, NO like/dislike/share) */}
      <div className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
        <div className="flex-1 overflow-hidden" onClick={() => onOpenProject(project)}>
          {/* Title */}
          <h3
            className="text-sm font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-red-400 transition-colors"
            title={project.title}
          >
            {project.title}
          </h3>

          {/* Views & Category */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 font-normal">
            <span className="text-neutral-300 font-medium">{project.category}</span>
            <span aria-hidden="true">•</span>
            <span>{project.views}</span>
            <span aria-hidden="true">•</span>
            <span>{project.publishedAt}</span>
          </div>

          {/* Direct Code & Live Link Badges */}
          <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-white transition-colors flex items-center gap-1 font-medium"
                title="GitHub Repo"
              >
                <Github className="h-3 w-3" />
                <span>GitHub</span>
              </a>
            )}

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-blue-400 transition-colors flex items-center gap-1 font-medium"
                title="Live Demo"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>

        {/* Options Menu Button */}
        <div className="relative shrink-0 pt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-[#272727] hover:text-white transition-colors"
            title="Options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {showMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-50 w-48 rounded-xl border border-[#303030] bg-[#212121] py-1 shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenProject(project);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
              >
                <Eye className="h-3.5 w-3.5 text-neutral-400" />
                <span>View Project Details</span>
              </button>

              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Launch Live Demo</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMenu(false)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-neutral-200 hover:bg-[#2b2b2b]"
                >
                  <Github className="h-3.5 w-3.5 text-neutral-400" />
                  <span>View Source Code</span>
                </a>
              )}

              {/* Admin Actions */}
              {isAdmin && (
                <>
                  <div className="my-1 border-t border-[#303030]" />
                  {onMoveProject && index > 0 && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onMoveProject(index, 'up');
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-[#2b2b2b]"
                    >
                      <ArrowUp className="h-3.5 w-3.5 text-neutral-400" />
                      <span>Move Up</span>
                    </button>
                  )}

                  {onMoveProject && index < totalProjects - 1 && (
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onMoveProject(index, 'down');
                      }}
                      className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-300 hover:bg-[#2b2b2b]"
                    >
                      <ArrowDown className="h-3.5 w-3.5 text-neutral-400" />
                      <span>Move Down</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditProject(project);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-blue-400 hover:bg-[#2b2b2b]"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Project</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm(`Are you sure you want to delete "${project.title}" from your portfolio?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-xs text-red-400 hover:bg-[#2b2b2b]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Project</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
