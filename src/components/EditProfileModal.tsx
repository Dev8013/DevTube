import React, { useState, useEffect, useRef } from 'react';
import { X, Check, User, Briefcase, GraduationCap, Link2, Plus, Trash2, FileText, Upload, Download, Camera, Image as ImageIcon } from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'contact' | 'skills' | 'experience' | 'education' | 'resume'>('bio');

  // Bio & Avatar state
  const [avatar, setAvatar] = useState('');
  const avatarFileRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioStatus, setPortfolioStatus] = useState('');

  // Resume state
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [resumeFileSize, setResumeFileSize] = useState('');
  const [resumeUploadedAt, setResumeUploadedAt] = useState('');
  const [resumeData, setResumeData] = useState('');
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);
  const resumeFileRef = useRef<HTMLInputElement | null>(null);

  // Contact state
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');

  // Skills
  const [skillsInput, setSkillsInput] = useState('');

  // Experience
  const [experience, setExperience] = useState<UserProfile['experience']>([]);

  // Education
  const [education, setEducation] = useState<UserProfile['education']>([]);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setAvatar(profile.avatar || '/src/assets/images/yt_dev_avatar_1793508225400.jpg');
      setName(profile.name || 'Dev Bhardwaj');
      setHandle(profile.handle || '@Onicha69');
      setTagline(profile.tagline || '');
      setBio(profile.bio || '');
      setPortfolioStatus(profile.portfolioStatus || '');

      setResumeUrl(profile.resumeUrl || '');
      setResumeFileName(profile.resumeFileName || '');
      setResumeFileSize(profile.resumeFileSize || '');
      setResumeUploadedAt(profile.resumeUploadedAt || '');
      setResumeData(profile.resumeData || '');

      setEmail(profile.email || 'bhardwajdev269@gmail.com');
      setPhone(profile.phone || '+91 98712 34567');
      setLocation(profile.location || 'New Delhi, India');
      setGithub(profile.github || 'https://github.com/Onicha69');
      setLinkedin(profile.linkedin || '');
      setTwitter(profile.twitter || '');

      setSkillsInput(profile.skills ? profile.skills.join(', ') : '');
      setExperience(profile.experience || []);
      setEducation(profile.education || []);
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Innovations Ltd',
      period: '2024 - Present',
      description: 'Engineered high-performance backend APIs and reactive frontend applications.',
      tech: ['TypeScript', 'React', 'Node.js'],
    };
    setExperience([newExp, ...experience]);
  };

  const handleRemoveExperience = (id: string) => {
    setExperience(experience.filter((e) => e.id !== id));
  };

  const handleUpdateExperience = (id: string, field: string, val: any) => {
    setExperience(
      experience.map((e) => {
        if (e.id === id) {
          if (field === 'tech') {
            const arr = typeof val === 'string' ? val.split(',').map((x) => x.trim()).filter(Boolean) : val;
            return { ...e, tech: arr };
          }
          return { ...e, [field]: val };
        }
        return e;
      })
    );
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: 'Specialized Engineering Certificate',
      institution: 'Technical University',
      year: '2023 - 2024',
      score: '9.0 CGPA',
      highlights: 'Focus on distributed architectures and system design.',
    };
    setEducation([newEdu, ...education]);
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const handleUpdateEducation = (id: string, field: string, val: string) => {
    setEducation(
      education.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    );
  };

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = file.name;
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const uploadDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      setResumeData(base64Data);
      setResumeFileName(fileName);
      setResumeFileSize(fileSize);
      setResumeUploadedAt(uploadDate);
      setResumeNotice(`Resume "${fileName}" ready to save!`);
      setTimeout(() => setResumeNotice(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    setResumeData('');
    setResumeFileName('');
    setResumeFileSize('');
    setResumeUploadedAt('');
    setResumeUrl('');
    setResumeNotice('Resume cleared.');
    setTimeout(() => setResumeNotice(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await onSave({
      avatar,
      name,
      handle,
      tagline,
      bio,
      portfolioStatus,
      email,
      phone,
      location,
      github,
      linkedin,
      twitter,
      skills,
      experience,
      education,
      resumeUrl,
      resumeFileName,
      resumeFileSize,
      resumeUploadedAt,
      resumeData,
    });

    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-[#1e1e1e] p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Customize Channel & Edit Details</h2>
              <p className="text-xs text-neutral-400">In-place live editing for Dev Bhardwaj's profile</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full p-1 text-neutral-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-neutral-800 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('bio')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'bio' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Bio & Brand</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('resume')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'resume' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Resume (Upload PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'contact' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Contacts & Socials</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('experience')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'experience' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>Experience Timeline ({experience.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'education' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Education & Degrees ({education.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'skills' ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <span>Skills Stack</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* TAB 1: BIO & BRAND */}
          {activeTab === 'bio' && (
            <div className="space-y-4">
              {/* Profile Picture (Avatar) Upload Card */}
              <div className="rounded-xl border border-neutral-800 bg-[#161616] p-4 flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  ref={avatarFileRef}
                  onChange={handleAvatarFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="relative group shrink-0">
                  <img
                    src={avatar || '/src/assets/images/yt_dev_avatar_1793508225400.jpg'}
                    alt="Profile Avatar Preview"
                    referrerPolicy="no-referrer"
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-neutral-700 bg-[#242424]"
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                    title="Change Profile Picture"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-blue-400" />
                    <span>Channel Profile Picture</span>
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    Upload your custom avatar portrait from your computer or phone (JPG, PNG, WebP).
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Profile Picture</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAvatar('/src/assets/images/yt_dev_avatar_1793508225400.jpg')}
                      className="rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs text-neutral-300 transition-colors cursor-pointer"
                    >
                      Reset Default
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Channel Handle</label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Professional Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Full Biography & Summary</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Portfolio & Availability Status</label>
                <input
                  type="text"
                  value={portfolioStatus}
                  onChange={(e) => setPortfolioStatus(e.target.value)}
                  placeholder="e.g. Open to Senior Full Stack & Cloud Roles"
                  className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB: RESUME (UPLOAD PDF) */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-800 bg-[#141414] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-white">Direct Resume Upload (PDF)</h4>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Upload your official resume in PDF format. Visitors and recruiters can view and download your verified PDF directly from your channel profile and resume tab.
                </p>

                {resumeNotice && (
                  <div className="mt-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs text-emerald-400 flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>{resumeNotice}</span>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    ref={resumeFileRef}
                    onChange={handleResumeFileUpload}
                    accept=".pdf,application/pdf"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => resumeFileRef.current?.click()}
                    className="flex items-center gap-2 rounded-lg bg-white text-black hover:bg-neutral-200 px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{resumeData ? 'Replace Resume PDF' : 'Upload Resume PDF'}</span>
                  </button>

                  {resumeData && (
                    <>
                      <a
                        href={resumeData}
                        download={resumeFileName || 'Dev_Bhardwaj_Resume.pdf'}
                        className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-[#242424] px-4 py-2 text-xs font-medium text-white hover:bg-[#2e2e2e] transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Download Attached ({resumeFileName || 'Dev_Bhardwaj_Resume.pdf'})</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleRemoveResume}
                        className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </>
                  )}
                </div>

                {resumeFileName && (
                  <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-400 bg-[#1a1a1a] p-2.5 rounded-lg border border-neutral-800">
                    <span className="text-white font-medium">{resumeFileName}</span>
                    {resumeFileSize && <span>• {resumeFileSize}</span>}
                    {resumeUploadedAt && <span>• Uploaded on {resumeUploadedAt}</span>}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  External Resume URL / Hosted Link (Optional Fallback)
                </label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="e.g. https://drive.google.com/... or https://devbhardwaj.com/resume.pdf"
                  className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: CONTACTS & SOCIALS */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Location / Base City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">GitHub Profile</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Twitter / X</label>
                  <input
                    type="url"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Technical Skills & Technologies (comma separated)
                </label>
                <textarea
                  rows={4}
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="TypeScript, React, Node.js, Express, MongoDB, Docker..."
                  className="w-full rounded-lg border border-neutral-700 bg-[#121212] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Current preview */}
              <div>
                <span className="block text-xs font-semibold text-neutral-400 mb-2">Live Skill Badges:</span>
                <div className="flex flex-wrap gap-1.5">
                  {skillsInput
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((sk) => (
                      <span key={sk} className="rounded bg-neutral-800 px-2.5 py-1 text-xs text-neutral-200">
                        {sk}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Manage your career history:</span>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="rounded-xl border border-neutral-800 bg-[#141414] p-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Period</label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleUpdateExperience(exp.id, 'period', e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Responsibilities & Impact</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                        className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Technologies Used (comma separated)</label>
                      <input
                        type="text"
                        value={exp.tech.join(', ')}
                        onChange={(e) => handleUpdateExperience(exp.id, 'tech', e.target.value)}
                        className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Academic credentials & degrees:</span>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="rounded-xl border border-neutral-800 bg-[#141414] p-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="absolute top-3 right-3 text-neutral-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Degree / Course</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Institution / Board</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Years Attended</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleUpdateEducation(edu.id, 'year', e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Score / Honors</label>
                        <input
                          type="text"
                          value={edu.score}
                          onChange={(e) => handleUpdateEducation(edu.id, 'score', e.target.value)}
                          className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Highlights & Coursework</label>
                      <input
                        type="text"
                        value={edu.highlights}
                        onChange={(e) => handleUpdateEducation(edu.id, 'highlights', e.target.value)}
                        className="w-full rounded border border-neutral-700 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
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
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Save Profile Updates</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
