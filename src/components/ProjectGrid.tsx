import React, { useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectItem, UserProfile } from '../types';
import { Plus, GripVertical, Check, Sparkles, Filter } from 'lucide-react';

interface ProjectGridProps {
  projects: ProjectItem[];
  profile: UserProfile;
  isAdmin: boolean;
  onOpenProject: (project: ProjectItem) => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onToggleLike: (id: string) => void;
  onReorderProjects: (orderedIds: string[]) => void;
  onOpenUpload: () => void;
  searchTerm: string;
  selectedCategory: string;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  profile,
  isAdmin,
  onOpenProject,
  onEditProject,
  onDeleteProject,
  onToggleLike,
  onReorderProjects,
  onOpenUpload,
  searchTerm,
  selectedCategory,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Filter projects by category and search
  const filteredProjects = projects.filter((proj) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      proj.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      proj.tags.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesSearch =
      !searchTerm ||
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const updated = [...filteredProjects];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    // Save reorder
    const orderedIds = updated.map((p) => p.id);
    onReorderProjects(orderedIds);
    setDraggedIndex(null);

    setSaveSuccessNotice('Project order updated and saved!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredProjects.length) return;

    const updated = [...filteredProjects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    const orderedIds = updated.map((p) => p.id);
    onReorderProjects(orderedIds);

    setSaveSuccessNotice('Project order updated!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  return (
    <div className="flex-1 px-4 py-6">
      {/* Admin Notice Bar with Drag-and-Drop Hint */}
      {isAdmin && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-[#161616] p-3 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-600/20 text-red-400">
              <GripVertical className="h-4 w-4" />
            </div>
            <div>
              <span className="font-semibold text-white">Admin Drag & Drop Mode Active:</span>
              <span className="ml-1 text-neutral-400">
                Drag any project card to reorder your portfolio showcase in real time.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccessNotice && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <Check className="h-3.5 w-3.5" />
                {saveSuccessNotice}
              </span>
            )}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 px-3 py-1.5 font-semibold text-white transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Showcase Project</span>
            </button>
          </div>
        </div>
      )}

      {/* Featured Banner / Channel Intro if looking at All */}
      {selectedCategory === 'all' && !searchTerm && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-[#272727] bg-gradient-to-r from-[#171717] via-[#1c1c1c] to-[#141414] p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Featured Developer Showcase</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Architecting Cloud Observability & Intelligent Web Systems
              </h1>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Welcome to Dev Bhardwaj's interactive YouTube portfolio. Explore production-grade engineering
                walkthroughs, microservices architecture, and deep technical case studies.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenProject(projects[0])}
                className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-black hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Watch Top Project
              </button>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-neutral-700 bg-neutral-900/80 px-5 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
              >
                Explore GitHub
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Projects YouTube Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#272727] p-8 text-center">
          <Filter className="h-10 w-10 text-neutral-500 mb-3" />
          <h3 className="text-base font-semibold text-white">No projects found</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">
            {searchTerm
              ? `No projects matched "${searchTerm}". Try another keyword or browse all categories.`
              : `No projects found in category "${selectedCategory}".`}
          </p>
          {isAdmin && (
            <button
              onClick={onOpenUpload}
              className="mt-4 flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Project to this Category</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              profile={profile}
              index={idx}
              totalProjects={filteredProjects.length}
              isAdmin={isAdmin}
              onOpenProject={onOpenProject}
              onEditProject={onEditProject}
              onDeleteProject={onDeleteProject}
              onToggleLike={onToggleLike}
              onMoveProject={handleMove}
              isDragging={draggedIndex === idx}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
};
