export interface UserProfile {
  name: string;
  handle: string;
  tagline: string;
  subscribers: string;
  avatar: string;
  banner: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  portfolioStatus: string;
  skills: string[];
  education: {
    id: string;
    degree: string;
    institution: string;
    year: string;
    score: string;
    highlights: string;
  }[];
  experience: {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
    tech: string[];
  }[];
  resumeUrl: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortName: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'Full Stack' | 'Frontend' | 'AI & ML' | 'Cloud & DevOps' | 'Mobile' | 'Systems';
  views: string;
  numericViews: number;
  likes: number;
  isLiked?: boolean;
  publishedAt: string;
  tags: string[];
  githubUrl: string;
  liveDemoUrl: string;
  order: number;
  featured?: boolean;
  architectureHighlights?: string[];
}

export interface SecureDocument {
  id: string;
  title: string;
  type: 'Aadhaar Card' | 'PAN Card' | 'Certification' | 'Degree' | 'Other';
  identifierNumber: string; // e.g. XXXX-XXXX-4589
  uploadDate: string;
  fileSize: string;
  mimeType: string;
  encryptedHash: string;
  isEncrypted: boolean;
  decryptedData?: string; // Content / Base64 / document text
  notes?: string;
}

export type DramaCategory = 'Anime' | 'Chinese Drama' | 'Korean Drama' | 'Other Series';
export type WatchStatus = 'Watching' | 'Upcoming' | 'Planned to watch' | 'Completed';

export interface AnimeDramaItem {
  id: string;
  title: string;
  originalTitle?: string;
  category: DramaCategory;
  status: WatchStatus;
  totalEpisodes: number;
  watchedEpisodes: number;
  watchedList: number[]; // Array of episode numbers 1..N
  thumbnail: string;
  rating: number;
  description: string;
  genres: string[];
  releaseYear: string;
  updatedAt: string;
}

export interface CommentItem {
  id: string;
  projectId: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isOwner?: boolean;
}
