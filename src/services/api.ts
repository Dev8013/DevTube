import { UserProfile, ProjectItem, SecureDocument, AnimeDramaItem, CommentItem } from '../types';
import { initialProfile, initialProjects, initialDocuments, initialAnimeDrama, initialComments } from '../data/initialData';

// Storage keys for local offline fallback
const LS_PREFIX = 'devtube_';
const getLS = <T>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(LS_PREFIX + key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};
const setLS = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Local storage save error:', e);
  }
};

export const api = {
  // Authentication
  async login(identifier: string, password: string): Promise<{ success: boolean; user?: any; token?: string; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success) {
        setLS('auth_user', data.user);
        setLS('auth_token', data.token);
      }
      return data;
    } catch {
      // Local fallback check
      const validEmail = 'bhardwajdev269@gmail.com';
      const validUser = 'Onicha69';
      const validPass = 'Dev@8013';
      const isValid = (identifier.toLowerCase() === validEmail.toLowerCase() || identifier === validUser) && password === validPass;
      if (isValid) {
        const adminUser = { name: 'Dev Bhardwaj', email: validEmail, username: validUser, role: 'admin' };
        setLS('auth_user', adminUser);
        setLS('auth_token', 'local_token_8013');
        return { success: true, user: adminUser, token: 'local_token_8013' };
      }
      return { success: false, message: 'Invalid admin credentials' };
    }
  },

  getCurrentUser() {
    return getLS<{ name: string; email: string; username: string; role: string } | null>('auth_user', null);
  },

  logout() {
    localStorage.removeItem(LS_PREFIX + 'auth_user');
    localStorage.removeItem(LS_PREFIX + 'auth_token');
  },

  // Profile
  async getProfile(): Promise<UserProfile> {
    try {
      const res = await fetch('/api/profile');
      const json = await res.json();
      if (json.success) {
        setLS('profile', json.data);
        return json.data;
      }
    } catch (e) {
      console.warn('API error, falling back to cache:', e);
    }
    return getLS<UserProfile>('profile', initialProfile);
  },

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (json.success) {
        setLS('profile', json.data);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const current = getLS<UserProfile>('profile', initialProfile);
    const updated = { ...current, ...profile };
    setLS('profile', updated);
    return updated;
  },

  // Projects
  async getProjects(): Promise<ProjectItem[]> {
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      if (json.success) {
        setLS('projects', json.data);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    return getLS<ProjectItem[]>('projects', initialProjects);
  },

  async createProject(project: Partial<ProjectItem>): Promise<ProjectItem> {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<ProjectItem[]>('projects', initialProjects);
        setLS('projects', [...curr, json.data]);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<ProjectItem[]>('projects', initialProjects);
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: project.title || 'New Project',
      shortName: project.shortName || project.title || 'Project',
      description: project.description || '',
      thumbnail: project.thumbnail || '/src/assets/images/yt_thumb_cloud_platform_1793508227442.jpg',
      duration: project.duration || '15:00',
      category: project.category || 'Full Stack',
      views: '1 view',
      numericViews: 1,
      likes: 1,
      isLiked: false,
      publishedAt: 'Just now',
      tags: project.tags || ['React', 'TypeScript'],
      githubUrl: project.githubUrl || 'https://github.com/Onicha69',
      liveDemoUrl: project.liveDemoUrl || '',
      order: curr.length + 1,
      featured: Boolean(project.featured),
    };
    setLS('projects', [...curr, newProj]);
    return newProj;
  },

  async updateProject(id: string, project: Partial<ProjectItem>): Promise<ProjectItem> {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      const json = await res.json();
      if (json.success) {
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<ProjectItem[]>('projects', initialProjects);
    const updated = curr.map((p) => (p.id === id ? { ...p, ...project } : p));
    setLS('projects', updated);
    return updated.find((p) => p.id === id)!;
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<ProjectItem[]>('projects', initialProjects).filter((p) => p.id !== id);
        setLS('projects', curr);
        return true;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<ProjectItem[]>('projects', initialProjects).filter((p) => p.id !== id);
    setLS('projects', curr);
    return true;
  },

  async reorderProjects(orderedIds: string[]): Promise<ProjectItem[]> {
    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      const json = await res.json();
      if (json.success) {
        setLS('projects', json.data);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<ProjectItem[]>('projects', initialProjects);
    const map = new Map(curr.map((p) => [p.id, p]));
    const result: ProjectItem[] = [];
    orderedIds.forEach((id, idx) => {
      const p = map.get(id);
      if (p) {
        p.order = idx + 1;
        result.push(p);
      }
    });
    setLS('projects', result);
    return result;
  },

  async toggleLike(id: string): Promise<{ likes: number; isLiked: boolean }> {
    try {
      const res = await fetch(`/api/projects/${id}/like`, { method: 'POST' });
      const json = await res.json();
      if (json.success) return { likes: json.likes, isLiked: json.isLiked };
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<ProjectItem[]>('projects', initialProjects);
    const p = curr.find((x) => x.id === id);
    if (p) {
      p.isLiked = !p.isLiked;
      p.likes += p.isLiked ? 1 : -1;
      setLS('projects', curr);
      return { likes: p.likes, isLiked: p.isLiked };
    }
    return { likes: 0, isLiked: false };
  },

  // Documents Vault
  async getDocuments(): Promise<SecureDocument[]> {
    try {
      const res = await fetch('/api/documents');
      const json = await res.json();
      if (json.success) {
        setLS('documents', json.data);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    return getLS<SecureDocument[]>('documents', initialDocuments);
  },

  async uploadDocument(doc: Partial<SecureDocument>): Promise<SecureDocument> {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<SecureDocument[]>('documents', initialDocuments);
        setLS('documents', [json.data, ...curr]);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<SecureDocument[]>('documents', initialDocuments);
    const newDoc: SecureDocument = {
      id: `doc-${Date.now()}`,
      title: doc.title || 'Encrypted File',
      type: doc.type || 'Other',
      identifierNumber: doc.identifierNumber || 'XXXX-XXXX-XXXX',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '1.2 MB',
      mimeType: doc.mimeType || 'application/pdf',
      encryptedHash: `AES256:${Math.random().toString(36).substring(2, 15)}`,
      isEncrypted: true,
      decryptedData: doc.decryptedData || `Secure record for ${doc.title}. Authenticated with Dev Bhardwaj admin key.`,
      notes: doc.notes || 'Encrypted credential item.',
    };
    setLS('documents', [newDoc, ...curr]);
    return newDoc;
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<SecureDocument[]>('documents', initialDocuments).filter((d) => d.id !== id);
        setLS('documents', curr);
        return true;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<SecureDocument[]>('documents', initialDocuments).filter((d) => d.id !== id);
    setLS('documents', curr);
    return true;
  },

  // Anime & Drama Watchlist
  async getAnimeDrama(): Promise<AnimeDramaItem[]> {
    try {
      const res = await fetch('/api/anime-tracker');
      const json = await res.json();
      if (json.success) {
        setLS('animeDrama', json.data);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    return getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama);
  },

  async createAnimeDrama(item: Partial<AnimeDramaItem>): Promise<AnimeDramaItem> {
    try {
      const res = await fetch('/api/anime-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama);
        setLS('animeDrama', [json.data, ...curr]);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama);
    const total = Number(item.totalEpisodes) || 12;
    const watched = Number(item.watchedEpisodes) || 0;
    const newItem: AnimeDramaItem = {
      id: `ad-${Date.now()}`,
      title: item.title || 'New Series',
      originalTitle: item.originalTitle || '',
      category: item.category || 'Anime',
      status: item.status || (watched >= total ? 'Completed' : watched > 0 ? 'Watching' : 'Upcoming'),
      totalEpisodes: total,
      watchedEpisodes: watched,
      watchedList: Array.from({ length: watched }, (_, i) => i + 1),
      thumbnail: item.thumbnail || '/src/assets/images/yt_thumb_anime_tracker_1793508229451.jpg',
      rating: Number(item.rating) || 9.0,
      description: item.description || '',
      genres: item.genres || ['Drama'],
      releaseYear: item.releaseYear || '2025',
      updatedAt: 'Just now',
    };
    setLS('animeDrama', [newItem, ...curr]);
    return newItem;
  },

  async toggleEpisode(id: string, episodeNumber: number): Promise<AnimeDramaItem> {
    try {
      const res = await fetch(`/api/anime-tracker/${id}/episode`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeNumber }),
      });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama);
        const updated = curr.map((x) => (x.id === id ? json.data : x));
        setLS('animeDrama', updated);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama);
    const item = curr.find((x) => x.id === id);
    if (item) {
      const set = new Set(item.watchedList);
      if (set.has(episodeNumber)) {
        set.delete(episodeNumber);
      } else {
        set.add(episodeNumber);
      }
      item.watchedList = Array.from(set).sort((a, b) => a - b);
      item.watchedEpisodes = item.watchedList.length;
      if (item.watchedEpisodes >= item.totalEpisodes) {
        item.status = 'Completed';
      } else if (item.watchedEpisodes > 0) {
        item.status = 'Watching';
      }
      setLS('animeDrama', curr);
      return item;
    }
    throw new Error('Item not found');
  },

  async batchWatch(id: string, markAll: boolean): Promise<AnimeDramaItem> {
    try {
      const res = await fetch(`/api/anime-tracker/${id}/batch-watch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll }),
      });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama);
        const updated = curr.map((x) => (x.id === id ? json.data : x));
        setLS('animeDrama', updated);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama);
    const item = curr.find((x) => x.id === id);
    if (item) {
      if (markAll) {
        item.watchedList = Array.from({ length: item.totalEpisodes }, (_, i) => i + 1);
        item.watchedEpisodes = item.totalEpisodes;
        item.status = 'Completed';
      } else {
        item.watchedList = [];
        item.watchedEpisodes = 0;
        item.status = 'Upcoming';
      }
      setLS('animeDrama', curr);
      return item;
    }
    throw new Error('Item not found');
  },

  async deleteAnimeDrama(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/anime-tracker/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama).filter((x) => x.id !== id);
        setLS('animeDrama', curr);
        return true;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const curr = getLS<AnimeDramaItem[]>('animeDrama', initialAnimeDrama).filter((x) => x.id !== id);
    setLS('animeDrama', curr);
    return true;
  },

  // Comments
  async getComments(projectId: string): Promise<CommentItem[]> {
    try {
      const res = await fetch(`/api/comments/${projectId}`);
      const json = await res.json();
      if (json.success) return json.data;
    } catch (e) {
      console.warn('API error:', e);
    }
    const all = getLS<CommentItem[]>('comments', initialComments);
    return all.filter((c) => c.projectId === projectId);
  },

  async addComment(comment: { projectId: string; author: string; text: string; avatar?: string; isOwner?: boolean }): Promise<CommentItem> {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      const json = await res.json();
      if (json.success) {
        const curr = getLS<CommentItem[]>('comments', initialComments);
        setLS('comments', [json.data, ...curr]);
        return json.data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      projectId: comment.projectId,
      author: comment.author,
      avatar: comment.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      text: comment.text,
      timestamp: 'Just now',
      likes: 0,
      isOwner: comment.isOwner,
    };
    const curr = getLS<CommentItem[]>('comments', initialComments);
    setLS('comments', [newComment, ...curr]);
    return newComment;
  },
};
