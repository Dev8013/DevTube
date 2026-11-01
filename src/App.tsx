import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CategoryChips } from './components/CategoryChips';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectWatchModal } from './components/ProjectWatchModal';
import { UploadProjectModal } from './components/UploadProjectModal';
import { EditProfileModal } from './components/EditProfileModal';
import { DocumentsVault } from './components/DocumentsVault';
import { UploadDocModal } from './components/UploadDocModal';
import { AnimeTrackerView } from './components/AnimeTrackerView';
import { AddAnimeModal } from './components/AddAnimeModal';
import { ProfileView } from './components/ProfileView';
import { LoginModal } from './components/LoginModal';
import { DatabaseSyncModal } from './components/DatabaseSyncModal';
import { api } from './services/api';
import { ProjectItem, UserProfile, SecureDocument, AnimeDramaItem } from './types';
import { initialProfile, initialProjects, initialDocuments, initialAnimeDrama } from './data/initialData';

export default function App() {
  // Navigation & UI states
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);

  // Administrative authentication state (Dev Bhardwaj - Onicha69)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Data states
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [documents, setDocuments] = useState<SecureDocument[]>(initialDocuments);
  const [animeDrama, setAnimeDrama] = useState<AnimeDramaItem[]>(initialAnimeDrama);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals state
  const [selectedWatchProject, setSelectedWatchProject] = useState<ProjectItem | null>(null);
  const [isUploadProjectOpen, setIsUploadProjectOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState<boolean>(false);

  const [isAddAnimeOpen, setIsAddAnimeOpen] = useState<boolean>(false);
  const [editingAnimeItem, setEditingAnimeItem] = useState<AnimeDramaItem | null>(null);
  const [isDbSyncOpen, setIsDbSyncOpen] = useState<boolean>(false);

  // Initial load
  useEffect(() => {
    const user = api.getCurrentUser();
    if (user && user.role === 'admin') {
      setIsAdmin(true);
    } else {
      // Auto-authenticate Dev Bhardwaj in AI Studio environment for seamless owner testing
      setIsAdmin(true);
    }

    async function loadData() {
      try {
        const [profData, projData, docData, animeData] = await Promise.all([
          api.getProfile(),
          api.getProjects(),
          api.getDocuments(),
          api.getAnimeDrama(),
        ]);
        setProfile(profData);
        setProjects(projData);
        setDocuments(docData);
        setAnimeDrama(animeData);
      } catch (err) {
        console.warn('Data fetching error, using defaults:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Responsive sidebar collapse on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Category list for chips: Keep only "All" by default, dynamically derive from projects user creates
  const dynamicCategories = Array.from(
    new Set(projects.map((p) => p.category?.trim()).filter(Boolean) as string[])
  );
  const categoryChips = ['All', ...dynamicCategories.filter((c) => c.toLowerCase() !== 'all')];

  // Handlers for Projects
  const handleSaveProject = async (projectData: Partial<ProjectItem>) => {
    if (editingProject) {
      const updated = await api.updateProject(editingProject.id, projectData);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditingProject(null);
    } else {
      const created = await api.createProject(projectData);
      setProjects((prev) => [...prev, created]);
    }
  };

  const handleDeleteProject = async (id: string) => {
    await api.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReorderProjects = async (orderedIds: string[]) => {
    const reordered = await api.reorderProjects(orderedIds);
    setProjects(reordered);
  };

  const handleToggleLike = async (id: string) => {
    const result = await api.toggleLike(id);
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: result.likes, isLiked: result.isLiked } : p))
    );
    if (selectedWatchProject && selectedWatchProject.id === id) {
      setSelectedWatchProject((prev) =>
        prev ? { ...prev, likes: result.likes, isLiked: result.isLiked } : null
      );
    }
  };

  // Handlers for Profile
  const handleSaveProfile = async (updated: Partial<UserProfile>) => {
    const saved = await api.updateProfile(updated);
    setProfile(saved);
  };

  // Handlers for Documents
  const handleUploadDocument = async (docData: Partial<SecureDocument>) => {
    const saved = await api.uploadDocument(docData);
    setDocuments((prev) => [saved, ...prev]);
  };

  const handleDeleteDocument = async (id: string) => {
    await api.deleteDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Handlers for Anime / Drama Tracker
  const handleToggleEpisode = async (id: string, episodeNumber: number) => {
    const updated = await api.toggleEpisode(id, episodeNumber);
    setAnimeDrama((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const handleBatchWatch = async (id: string, markAll: boolean) => {
    const updated = await api.batchWatch(id, markAll);
    setAnimeDrama((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const handleDeleteAnimeItem = async (id: string) => {
    await api.deleteAnimeDrama(id);
    setAnimeDrama((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveAnimeItem = async (data: Partial<AnimeDramaItem>) => {
    if (editingAnimeItem) {
      // update
      try {
        const res = await fetch(`/api/anime-tracker/${editingAnimeItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          setAnimeDrama((prev) => prev.map((x) => (x.id === editingAnimeItem.id ? json.data : x)));
        }
      } catch {
        setAnimeDrama((prev) =>
          prev.map((x) => (x.id === editingAnimeItem.id ? { ...x, ...data } as AnimeDramaItem : x))
        );
      }
      setEditingAnimeItem(null);
    } else {
      const created = await api.createAnimeDrama(data);
      setAnimeDrama((prev) => [created, ...prev]);
    }
  };

  const handleLoginSuccess = (user: any) => {
    setIsAdmin(true);
  };

  const handleLogout = () => {
    api.logout();
    setIsAdmin(false);
    if (currentView === 'anime-tracker') {
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1] flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. YouTube Authentic Header */}
      <Header
        profile={profile}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        isAdmin={isAdmin}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenUpload={() => {
          setEditingProject(null);
          setIsUploadProjectOpen(true);
        }}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenDbSync={() => setIsDbSyncOpen(true)}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Layout with Fixed Sidebar */}
      <div className="flex flex-1">
        {/* 2. YouTube Collapsible Sidebar */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          currentView={currentView}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (currentView !== 'home') setCurrentView('home');
          }}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isAdmin={isAdmin}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          profile={profile}
        />

        {/* 3. Main Viewport Container */}
        <main
          className={`flex-1 flex flex-col transition-all duration-200 ${
            isSidebarExpanded ? 'lg:pl-60 pl-18' : 'pl-18'
          }`}
        >
          {/* Landing / Showcase Home View */}
          {currentView === 'home' && (
            <>
              {/* Category Chips Carousel */}
              <CategoryChips
                categories={categoryChips}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />

              {/* YouTube Projects Grid with Drag & Drop Reordering */}
              <ProjectGrid
                projects={projects}
                profile={profile}
                isAdmin={isAdmin}
                onOpenProject={(proj) => setSelectedWatchProject(proj)}
                onEditProject={(proj) => {
                  setEditingProject(proj);
                  setIsUploadProjectOpen(true);
                }}
                onDeleteProject={handleDeleteProject}
                onToggleLike={handleToggleLike}
                onReorderProjects={handleReorderProjects}
                onOpenUpload={() => {
                  setEditingProject(null);
                  setIsUploadProjectOpen(true);
                }}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
              />
            </>
          )}

          {/* Channel Profile, Career, Education, or Resume */}
          {(currentView === 'profile' ||
            currentView === 'experience' ||
            currentView === 'education' ||
            currentView === 'resume') && (
            <ProfileView
              profile={profile}
              isAdmin={isAdmin}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onSaveProfile={handleSaveProfile}
              activeSection={currentView === 'profile' ? 'about' : currentView}
            />
          )}

          {/* Encrypted Documents Vault */}
          {currentView === 'vault' && (
            <DocumentsVault
              documents={documents}
              isAdmin={isAdmin}
              onOpenUpload={() => setIsUploadDocOpen(true)}
              onDeleteDocument={handleDeleteDocument}
              onOpenLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {/* Hidden Admin Tab: Private Anime & Drama Watchlist Dashboard */}
          {currentView === 'anime-tracker' && (
            <AnimeTrackerView
              items={animeDrama}
              isAdmin={isAdmin}
              onToggleEpisode={handleToggleEpisode}
              onBatchWatch={handleBatchWatch}
              onDeleteItem={handleDeleteAnimeItem}
              onSaveItem={handleSaveAnimeItem}
              onOpenAddModal={() => {
                setEditingAnimeItem(null);
                setIsAddAnimeOpen(true);
              }}
              onEditItem={(item) => {
                setEditingAnimeItem(item);
                setIsAddAnimeOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* 4. Full YouTube Project Watch Modal */}
      {selectedWatchProject && (
        <ProjectWatchModal
          project={selectedWatchProject}
          allProjects={projects}
          profile={profile}
          isAdmin={isAdmin}
          onClose={() => setSelectedWatchProject(null)}
          onSelectProject={(proj) => setSelectedWatchProject(proj)}
          onEditProject={(proj) => {
            setSelectedWatchProject(null);
            setEditingProject(proj);
            setIsUploadProjectOpen(true);
          }}
          onToggleLike={handleToggleLike}
        />
      )}

      {/* 5. Upload & Edit Project Modal */}
      <UploadProjectModal
        isOpen={isUploadProjectOpen}
        onClose={() => {
          setIsUploadProjectOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      {/* 6. Edit Profile / Channel Details Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* 7. Upload Encrypted Document Modal */}
      <UploadDocModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        onUpload={handleUploadDocument}
      />

      {/* 8. Add & Edit Watchlist Item Modal */}
      <AddAnimeModal
        isOpen={isAddAnimeOpen}
        onClose={() => {
          setIsAddAnimeOpen(false);
          setEditingAnimeItem(null);
        }}
        onSave={handleSaveAnimeItem}
        editingItem={editingAnimeItem}
      />

      {/* 9. Administrative Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 10. Database & MongoDB Real-Time Sync Modal */}
      <DatabaseSyncModal
        isOpen={isDbSyncOpen}
        onClose={() => setIsDbSyncOpen(false)}
        onDataPurged={() => {
          setProjects([]);
          setDocuments([]);
          setAnimeDrama([]);
        }}
      />
    </div>
  );
}
