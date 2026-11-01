import React, { useState, useRef } from 'react';
import {
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Briefcase,
  GraduationCap,
  FileText,
  Download,
  Edit,
  Upload,
  Eye,
  Trash2,
  Check,
  FileCheck,
  Sparkles,
  Camera
} from 'lucide-react';
import { UserProfile } from '../types';
import { ResumeViewerModal, DigitalResumeDocument } from './ResumeViewerModal';

interface ProfileViewProps {
  profile: UserProfile;
  isAdmin: boolean;
  onOpenEditProfile: () => void;
  onSaveProfile?: (updated: Partial<UserProfile>) => Promise<void>;
  activeSection?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  isAdmin,
  onOpenEditProfile,
  onSaveProfile,
  activeSection = 'about',
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'resume'>('about');
  const [isResumeViewerOpen, setIsResumeViewerOpen] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSaveProfile) return;
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await onSaveProfile({ avatar: dataUrl });
      setIsUploadingAvatar(false);
      setResumeNotice('Profile picture updated successfully!');
      setTimeout(() => setResumeNotice(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (activeSection === 'experience' || activeSection === 'education' || activeSection === 'resume') {
      setActiveTab(activeSection as any);
    }
  }, [activeSection]);

  const handleResumeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSaveProfile) return;

    setIsUploadingResume(true);
    const fileName = file.name;
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const uploadDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      await onSaveProfile({
        resumeData: dataUrl,
        resumeFileName: fileName,
        resumeFileSize: fileSize,
        resumeUploadedAt: uploadDate,
      });
      setIsUploadingResume(false);
      setResumeNotice('Resume uploaded successfully!');
      setTimeout(() => setResumeNotice(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = async () => {
    if (!onSaveProfile) return;
    if (confirm('Are you sure you want to remove your uploaded resume?')) {
      await onSaveProfile({
        resumeData: undefined,
        resumeFileName: undefined,
        resumeFileSize: undefined,
        resumeUploadedAt: undefined,
      });
      setResumeNotice('Resume removed.');
      setTimeout(() => setResumeNotice(null), 3000);
    }
  };

  const handleDownloadResume = () => {
    if (profile.resumeData) {
      // Direct download of uploaded PDF
      const link = document.createElement('a');
      link.href = profile.resumeData;
      link.download = profile.resumeFileName || 'Dev_Bhardwaj_Resume.pdf';
      link.click();
      return;
    }

    // Fallback: Generate structured formatted document
    const resumeText = `=====================================================
DEV BHARDWAJ - SOFTWARE ENGINEER
Email: ${profile.email || 'bhardwajdev269@gmail.com'} ${profile.phone ? `| Phone: ${profile.phone}` : ''}
${profile.location ? `Location: ${profile.location}` : ''}
${profile.github ? `GitHub: ${profile.github}` : ''} ${profile.linkedin ? `| LinkedIn: ${profile.linkedin}` : ''}
=====================================================

ABOUT / BIO
${profile.bio || 'Software developer specializing in full-stack web applications.'}

SKILLS
${profile.skills && profile.skills.length > 0 ? profile.skills.join(' • ') : 'Full-Stack Development'}

WORK EXPERIENCE
${
  profile.experience && profile.experience.length > 0
    ? profile.experience
        .map(
          (exp) => `
• ${exp.role} — ${exp.company} (${exp.period})
  ${exp.description}
  Tech: ${exp.tech.join(', ')}`
        )
        .join('\n')
    : 'No experience entries added yet.'
}

EDUCATION
${
  profile.education && profile.education.length > 0
    ? profile.education
        .map(
          (edu) => `
• ${edu.degree} — ${edu.institution} (${edu.year})
  Score: ${edu.score}
  Coursework: ${edu.highlights}`
        )
        .join('\n')
    : 'No formal degrees listed yet.'
}
=====================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dev_Bhardwaj_Resume.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0f0f0f]">
      {/* Hidden file input for uploading resume */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx"
        onChange={handleResumeFileSelect}
        className="hidden"
      />

      {/* YouTube Channel Banner (Smooth, calm tone matching Screenshot 2) */}
      <div className="relative h-40 sm:h-52 w-full overflow-hidden bg-[#181818]">
        <img
          src={profile.banner}
          alt="Channel Banner"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover brightness-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
      </div>

      {/* Channel Header Information */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto -mt-12 sm:-mt-14 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-[#222222]">
          {/* Avatar & Channel Details (NO subscriber count anywhere) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative group">
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={handleAvatarFileSelect}
                className="hidden"
              />
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-[#0f0f0f] shadow-xl bg-[#1c1c1c]"
              />
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-neutral-900/90 border border-neutral-700 text-white hover:bg-neutral-800 transition-colors shadow-lg cursor-pointer"
                  title="Upload / Change Profile Picture"
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {profile.name}
                </h1>
                <CheckCircle className="h-4 w-4 text-neutral-400" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200 font-mono">{profile.handle}</span>
                {profile.portfolioStatus && (
                  <>
                    <span>•</span>
                    <span className="text-neutral-300 font-medium">{profile.portfolioStatus}</span>
                  </>
                )}
              </div>

              {profile.tagline && (
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  {profile.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs: View Resume, Download, Upload & Customize Channel */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsResumeViewerOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-white hover:bg-neutral-200 px-4 py-2 text-xs font-bold text-black transition-colors shadow-sm cursor-pointer"
              title="View and preview resume on screen"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Resume</span>
            </button>

            <button
              onClick={handleDownloadResume}
              className="flex items-center gap-1.5 rounded-full bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
              title="Download resume file"
            >
              <Download className="h-3.5 w-3.5 text-neutral-300" />
              <span>Download</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingResume}
                className="flex items-center gap-1.5 rounded-full bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                title="Upload Resume PDF from device"
              >
                <Upload className="h-3.5 w-3.5 text-neutral-300" />
                <span>{profile.resumeData ? 'Replace PDF' : 'Upload PDF'}</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={onOpenEditProfile}
                className="flex items-center gap-1.5 rounded-full bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Customize Channel</span>
              </button>
            )}
          </div>
        </div>

        {/* Feedback alert */}
        {resumeNotice && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#1c1c1c] border border-neutral-700 px-3.5 py-2 text-xs text-emerald-400 font-medium">
            <Check className="h-4 w-4" />
            <span>{resumeNotice}</span>
          </div>
        )}

        {/* Channel Navigation Tabs (Smooth YouTube style) */}
        <div className="flex items-center gap-6 overflow-x-auto py-3 border-b border-[#222222] no-scrollbar">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            About & Bio
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'resume'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Resume & CV</span>
            {profile.resumeData && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Work Experience
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'education'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Education & Degrees
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="py-6">
          {/* TAB 1: ABOUT & BIO */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Biography & Skills */}
              <div className="lg:col-span-8 space-y-5">
                <div className="rounded-2xl border border-[#222222] bg-[#141414] p-5">
                  <h3 className="text-sm font-bold text-white mb-2">About</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {profile.bio || 'No biography written yet. Click "Customize Channel / Edit Bio" to write your story.'}
                  </p>
                </div>

                {/* Technical Skills */}
                <div className="rounded-2xl border border-[#222222] bg-[#141414] p-5">
                  <h3 className="text-sm font-bold text-white mb-3">Skills & Technologies</h3>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-[#222222] px-3 py-1.5 text-xs font-medium text-neutral-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-[#262626] p-4 text-center">
                      <p className="text-xs text-neutral-400">No skills added yet.</p>
                      {isAdmin && (
                        <button
                          onClick={onOpenEditProfile}
                          className="mt-2 text-xs text-neutral-300 hover:text-white underline cursor-pointer"
                        >
                          + Add your skills
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Contact & Socials */}
              <div className="lg:col-span-4 space-y-5">
                <div className="rounded-2xl border border-[#222222] bg-[#141414] p-5">
                  <h3 className="text-sm font-bold text-white mb-3">Details</h3>
                  <div className="space-y-3 text-xs">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1c1c1c] text-neutral-200 hover:text-white hover:bg-[#252525] transition-colors"
                      >
                        <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-[10px] text-neutral-400">Email</p>
                          <p className="font-semibold truncate">{profile.email}</p>
                        </div>
                      </a>
                    )}

                    {profile.phone && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1c1c1c] text-neutral-200">
                        <Phone className="h-4 w-4 text-neutral-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-neutral-400">Phone</p>
                          <p className="font-semibold">{profile.phone}</p>
                        </div>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#1c1c1c] text-neutral-200">
                        <MapPin className="h-4 w-4 text-neutral-400 shrink-0" />
                        <div>
                          <p className="text-[10px] text-neutral-400">Location</p>
                          <p className="font-semibold">{profile.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Links */}
                  <h4 className="text-xs font-semibold text-neutral-400 mt-5 mb-2.5">
                    Links
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {profile.github && (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-white transition-colors"
                      >
                        <Github className="h-4 w-4 mb-1" />
                        <span className="text-[10px] font-medium">GitHub</span>
                      </a>
                    )}

                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-white transition-colors"
                      >
                        <Linkedin className="h-4 w-4 mb-1" />
                        <span className="text-[10px] font-medium">LinkedIn</span>
                      </a>
                    )}

                    {profile.twitter && (
                      <a
                        href={profile.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-white transition-colors"
                      >
                        <Twitter className="h-4 w-4 mb-1" />
                        <span className="text-[10px] font-medium">Twitter</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESUME & CV (WITH UPLOAD OPTION) */}
          {activeTab === 'resume' && (
            <div className="max-w-4xl space-y-6">
              {/* Resume Upload & Viewer Section */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#222222] bg-[#141414] p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-neutral-300" />
                        <span>Resume Document & Credentials</span>
                      </h3>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {profile.resumeData
                          ? 'Your uploaded resume is ready for instant viewing, downloading, and printing.'
                          : 'Interactive curriculum vitae with career history, education, and verified skills.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsResumeViewerOpen(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-neutral-200 px-4 py-2 text-xs font-bold text-black transition-colors cursor-pointer shadow-sm"
                        title="Open interactive resume viewer"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Resume</span>
                      </button>

                      <button
                        onClick={handleDownloadResume}
                        className="flex items-center gap-1.5 rounded-xl bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                        title="Download resume file"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 rounded-xl bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                        >
                          <Upload className="h-4 w-4" />
                          <span>{profile.resumeData ? 'Replace PDF' : 'Upload PDF'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Uploaded File Details or Empty Dropzone */}
                  {profile.resumeData ? (
                    <div
                      onClick={() => setIsResumeViewerOpen(true)}
                      className="mt-5 rounded-xl bg-[#1c1c1c] hover:bg-[#222222] border border-[#2a2a2a] hover:border-neutral-600 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all group"
                      title="Click to view resume in full screen"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#272727] text-white shrink-0 group-hover:bg-[#333333] transition-colors">
                          <FileText className="h-6 w-6 text-neutral-200" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                              {profile.resumeFileName || 'Dev_Bhardwaj_Resume.pdf'}
                            </p>
                            <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                              Click to View
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {profile.resumeFileSize || 'PDF Document'} • Uploaded on {profile.resumeUploadedAt || 'Recently'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setIsResumeViewerOpen(true)}
                          className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#272727] hover:bg-[#383838] transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Preview</span>
                        </button>

                        <button
                          onClick={handleDownloadResume}
                          className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#272727] hover:bg-[#383838] transition-colors cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>

                        {isAdmin && (
                          <button
                            onClick={handleRemoveResume}
                            className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-400 p-2 rounded-lg hover:bg-[#252525] transition-colors cursor-pointer"
                            title="Remove Resume"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => isAdmin && fileInputRef.current?.click()}
                      className={`mt-5 rounded-xl border border-dashed border-[#2e2e2e] bg-[#181818]/50 p-8 text-center transition-colors ${
                        isAdmin ? 'hover:border-neutral-500 hover:bg-[#181818] cursor-pointer' : ''
                      }`}
                    >
                      <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-white">No PDF Resume Uploaded Yet</p>
                      <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                        {isAdmin
                          ? 'Click here to upload your custom PDF resume from your computer, or view your digital CV below.'
                          : 'Viewing verified digital curriculum vitae below.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Embedded Live Resume Viewer */}
                {profile.resumeData ? (
                  <div className="rounded-2xl border border-[#222222] bg-[#141414] overflow-hidden shadow-xl">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#181818] border-b border-[#262626]">
                      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                        <FileText className="h-4 w-4 text-neutral-400" />
                        <span>Interactive PDF Document Viewer</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full font-mono">
                          Live On-Screen
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsResumeViewerOpen(true)}
                          className="flex items-center gap-1.5 text-xs text-neutral-200 hover:text-white bg-[#262626] hover:bg-[#333333] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Fullscreen Modal</span>
                        </button>
                        <button
                          onClick={handleDownloadResume}
                          className="flex items-center gap-1.5 text-xs text-neutral-200 hover:text-white bg-[#262626] hover:bg-[#333333] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                    <div className="h-[750px] w-full bg-neutral-900">
                      <iframe
                        src={profile.resumeData}
                        title="Dev Bhardwaj Resume Preview"
                        className="w-full h-full border-0 bg-neutral-900"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        <FileText className="h-4 w-4 text-neutral-400" />
                        <span>Curriculum Vitae Preview</span>
                      </div>
                      <button
                        onClick={() => setIsResumeViewerOpen(true)}
                        className="flex items-center gap-1.5 text-xs text-neutral-200 hover:text-white bg-[#262626] hover:bg-[#333333] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Pop-out Viewer</span>
                      </button>
                    </div>
                    <DigitalResumeDocument profile={profile} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="max-w-4xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Work Experience</h3>
                  <p className="text-xs text-neutral-400">Professional career positions and projects</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={onOpenEditProfile}
                    className="flex items-center gap-1.5 rounded-lg bg-[#272727] hover:bg-[#383838] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Manage Roles</span>
                  </button>
                )}
              </div>

              {profile.experience && profile.experience.length > 0 ? (
                <div className="space-y-4">
                  {profile.experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="rounded-2xl border border-[#222222] bg-[#141414] p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-[#222222]">
                        <div>
                          <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                          <p className="text-xs text-neutral-400">{exp.company}</p>
                        </div>
                        <span className="rounded bg-[#202020] px-2.5 py-1 text-xs font-mono text-neutral-300 self-start sm:self-center">
                          {exp.period}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>

                      {exp.tech && exp.tech.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {exp.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded bg-[#222222] px-2 py-0.5 text-[11px] font-mono text-neutral-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#262626] bg-[#141414] p-8 text-center">
                  <Briefcase className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">No Experience Listed Yet</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Add your engineering positions and companies using the profile customizer.
                  </p>
                  {isAdmin && (
                    <button
                      onClick={onOpenEditProfile}
                      className="mt-4 rounded-lg bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      + Add Work Experience
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: EDUCATION */}
          {activeTab === 'education' && (
            <div className="max-w-4xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Education</h3>
                  <p className="text-xs text-neutral-400">Academic background and degrees</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={onOpenEditProfile}
                    className="flex items-center gap-1.5 rounded-lg bg-[#272727] hover:bg-[#383838] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Manage Education</span>
                  </button>
                )}
              </div>

              {profile.education && profile.education.length > 0 ? (
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className="rounded-2xl border border-[#222222] bg-[#141414] p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#222222]">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#222222] text-white shrink-0">
                            <GraduationCap className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white">{edu.degree}</h4>
                            <p className="text-xs text-neutral-400">{edu.institution}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {edu.score && (
                            <span className="rounded bg-[#202020] text-neutral-200 font-semibold px-2 py-0.5 text-xs">
                              {edu.score}
                            </span>
                          )}
                          {edu.year && (
                            <span className="rounded bg-[#202020] px-2 py-0.5 text-xs font-mono text-neutral-400">
                              {edu.year}
                            </span>
                          )}
                        </div>
                      </div>

                      {edu.highlights && (
                        <p className="mt-2.5 text-xs text-neutral-300 leading-relaxed">
                          {edu.highlights}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#262626] bg-[#141414] p-8 text-center">
                  <GraduationCap className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">No Education Listed Yet</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Add your university degrees, colleges, scores, and coursework details.
                  </p>
                  {isAdmin && (
                    <button
                      onClick={onOpenEditProfile}
                      className="mt-4 rounded-lg bg-[#272727] hover:bg-[#383838] px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      + Add Education Details
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Resume Viewer Modal */}
      <ResumeViewerModal
        isOpen={isResumeViewerOpen}
        onClose={() => setIsResumeViewerOpen(false)}
        profile={profile}
        onDownload={handleDownloadResume}
        onUploadNew={() => fileInputRef.current?.click()}
        isAdmin={isAdmin}
      />
    </div>
  );
};
