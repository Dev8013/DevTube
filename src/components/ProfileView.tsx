import React, { useState } from 'react';
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
  ExternalLink,
  Code2,
  Calendar,
  Award
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  isAdmin: boolean;
  onOpenEditProfile: () => void;
  activeSection?: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  isAdmin,
  onOpenEditProfile,
  activeSection = 'about',
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'resume'>('about');

  React.useEffect(() => {
    if (activeSection === 'experience' || activeSection === 'education' || activeSection === 'resume') {
      setActiveTab(activeSection as any);
    }
  }, [activeSection]);

  const handleDownloadResume = () => {
    const resumeText = `=====================================================
DEV BHARDWAJ - SENIOR FULL-STACK SOFTWARE ENGINEER
Email: ${profile.email} | Phone: ${profile.phone}
Location: ${profile.location}
GitHub: ${profile.github} | LinkedIn: ${profile.linkedin}
=====================================================

PROFESSIONAL SUMMARY
${profile.bio}

SKILLS & TECHNOLOGIES
${profile.skills.join(' • ')}

PROFESSIONAL EXPERIENCE
${profile.experience
  .map(
    (exp) => `
• ${exp.role} — ${exp.company} (${exp.period})
  ${exp.description}
  Tech Stack: ${exp.tech.join(', ')}`
  )
  .join('\n')}

EDUCATION
${profile.education
  .map(
    (edu) => `
• ${edu.degree} — ${edu.institution} (${edu.year})
  Score: ${edu.score}
  Highlights: ${edu.highlights}`
  )
  .join('\n')}

CERTIFICATIONS & CREDENTIALS
• AWS Certified Solutions Architect - Professional
• Distributed Systems & Cloud Microservices Architecture
=====================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dev_Bhardwaj_Resume_${new Date().getFullYear()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* YouTube Channel Banner */}
      <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden bg-neutral-900">
        <img
          src={profile.banner}
          alt="Channel Banner"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-black/30" />
      </div>

      {/* Channel Header Information */}
      <div className="px-4 sm:px-8 max-w-7xl mx-auto -mt-14 sm:-mt-16 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-6 border-b border-[#272727]">
          {/* Avatar & Channel Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="h-28 w-28 sm:h-32 sm:w-32 rounded-full object-cover ring-4 ring-[#0f0f0f] shadow-2xl bg-neutral-800"
              />
              <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold ring-2 ring-[#0f0f0f]">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.name}
                </h1>
                <CheckCircle className="h-5 w-5 text-neutral-400" />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-white font-mono">{profile.handle}</span>
                <span>•</span>
                <span>{profile.subscribers}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{profile.portfolioStatus}</span>
              </div>

              <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                {profile.tagline}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isAdmin ? (
              <button
                onClick={onOpenEditProfile}
                className="flex items-center gap-1.5 rounded-full bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors shadow"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Customize Channel / Edit Bio</span>
              </button>
            ) : null}

            <button
              onClick={handleDownloadResume}
              className="flex items-center gap-1.5 rounded-full bg-white hover:bg-neutral-200 px-4 py-2 text-xs font-bold text-black transition-colors shadow"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Resume</span>
            </button>
          </div>
        </div>

        {/* Channel Navigation Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto py-3 border-b border-[#272727] no-scrollbar">
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
            onClick={() => setActiveTab('experience')}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'experience'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Work Experience ({profile.experience.length})
          </button>

          <button
            onClick={() => setActiveTab('education')}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'education'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Education & Degrees ({profile.education.length})
          </button>

          <button
            onClick={() => setActiveTab('resume')}
            className={`pb-2 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'resume'
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Interactive Resume Viewer
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="py-8">
          {/* TAB 1: ABOUT & BIO */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Biography & Skills */}
              <div className="lg:col-span-8 space-y-6">
                <div className="rounded-2xl border border-neutral-800 bg-[#161616] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-white mb-3">About Me</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                    {profile.bio}
                  </p>
                </div>

                {/* Technical Skills */}
                <div className="rounded-2xl border border-neutral-800 bg-[#161616] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-white mb-4">Core Technical Proficiencies</h3>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-[#242424] px-3 py-1.5 text-xs font-semibold text-neutral-200 border border-neutral-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-neutral-800 p-4 text-center">
                      <p className="text-xs text-neutral-400">No skills added yet.</p>
                      {isAdmin && (
                        <button
                          onClick={onOpenEditProfile}
                          className="mt-2 text-xs text-blue-400 hover:underline"
                        >
                          + Add your skills
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Engineering Highlights */}
                <div className="rounded-2xl border border-neutral-800 bg-[#161616] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-white mb-3">Engineering Principles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <p className="text-xs font-bold text-white">High Throughput</p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Designing event streams and distributed queues with sub-20ms packet handling.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <p className="text-xs font-bold text-white">Full-Stack Craft</p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Pixel-perfect React & Tailwind frontends paired with resilient Express backends.
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                      <p className="text-xs font-bold text-white">Data Security</p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        AES-256 client-server encryption for private documents and credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact & Socials */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-neutral-800 bg-[#161616] p-6 shadow-sm">
                  <h3 className="text-base font-bold text-white mb-4">Contact & Inquiries</h3>
                  <div className="space-y-3 text-xs">
                    <a
                      href={`mailto:${profile.email}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#202020] text-neutral-200 hover:text-white hover:bg-[#282828] transition-colors"
                    >
                      <Mail className="h-4 w-4 text-red-500 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-neutral-400">Email Address</p>
                        <p className="font-semibold truncate">{profile.email}</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#202020] text-neutral-200">
                      <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-neutral-400">Direct Phone</p>
                        <p className="font-semibold">{profile.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#202020] text-neutral-200">
                      <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-neutral-400">Current Base</p>
                        <p className="font-semibold">{profile.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Handles */}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mt-6 mb-3">
                    Connect on Socials
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#202020] hover:bg-[#282828] text-white transition-colors"
                    >
                      <Github className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-semibold">GitHub</span>
                    </a>

                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#202020] hover:bg-[#282828] text-blue-400 transition-colors"
                    >
                      <Linkedin className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-semibold">LinkedIn</span>
                    </a>

                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#202020] hover:bg-[#282828] text-sky-400 transition-colors"
                    >
                      <Twitter className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-semibold">Twitter</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WORK EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Career & Engineering Experience</h3>
                  <p className="text-xs text-neutral-400">Chronological track record in distributed engineering</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={onOpenEditProfile}
                    className="flex items-center gap-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-white"
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
                      className="rounded-2xl border border-neutral-800 bg-[#161616] p-6 shadow-sm hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                        <div>
                          <h4 className="text-base font-bold text-white">{exp.role}</h4>
                          <p className="text-xs font-semibold text-blue-400">{exp.company}</p>
                        </div>
                        <span className="rounded bg-neutral-800 px-3 py-1 text-xs font-mono text-neutral-300 self-start sm:self-center">
                          {exp.period}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-neutral-800/60">
                        {exp.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-neutral-800 px-2 py-0.5 text-[11px] font-mono text-neutral-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-[#141414]/60 p-8 text-center">
                  <Briefcase className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">No Experience Listed Yet</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Add your engineering positions, companies, and technologies directly using the profile customizer.
                  </p>
                  {isAdmin && (
                    <button
                      onClick={onOpenEditProfile}
                      className="mt-4 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      + Add Work Experience
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Education & Academic Background</h3>
                  <p className="text-xs text-neutral-400">Formal university degrees, honors, and coursework</p>
                </div>
                {isAdmin && (
                  <button
                    onClick={onOpenEditProfile}
                    className="flex items-center gap-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-white"
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
                      className="rounded-2xl border border-neutral-800 bg-[#161616] p-6 shadow-sm hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                            <GraduationCap className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-white">{edu.degree}</h4>
                            <p className="text-xs text-neutral-400">{edu.institution}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-start sm:self-center">
                          <span className="rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold px-2.5 py-1 text-xs">
                            {edu.score}
                          </span>
                          <span className="rounded bg-neutral-800 px-2.5 py-1 text-xs font-mono text-neutral-300">
                            {edu.year}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-neutral-300 leading-relaxed">
                        {edu.highlights}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-800 bg-[#141414]/60 p-8 text-center">
                  <GraduationCap className="h-8 w-8 text-neutral-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-white">No Education Listed Yet</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                    Add your university degrees, colleges, scores, and coursework details.
                  </p>
                  {isAdmin && (
                    <button
                      onClick={onOpenEditProfile}
                      className="mt-4 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      + Add Education Details
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: INTERACTIVE RESUME VIEWER */}
          {activeTab === 'resume' && (
            <div className="max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Curriculum Vitae / Resume</h3>
                  <p className="text-xs text-neutral-400">Official document viewable in-browser</p>
                </div>
                <button
                  onClick={handleDownloadResume}
                  className="flex items-center gap-2 rounded-lg bg-red-600 hover:bg-red-500 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume File</span>
                </button>
              </div>

              {/* Formatted Sheet */}
              <div className="rounded-2xl border border-neutral-800 bg-[#161616] p-8 shadow-2xl font-sans text-neutral-200">
                <div className="border-b border-neutral-700 pb-4 mb-6">
                  <h2 className="text-2xl font-extrabold text-white">{profile.name}</h2>
                  <p className="text-sm font-semibold text-red-500 mt-1">{profile.tagline}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-2 font-mono">
                    <span>{profile.email}</span>
                    <span>•</span>
                    <span>{profile.phone}</span>
                    <span>•</span>
                    <span>{profile.location}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 border-b border-neutral-800 pb-1">
                      Professional Summary
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {profile.bio}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 border-b border-neutral-800 pb-1">
                      Technical Competencies
                    </h4>
                    <p className="text-xs text-neutral-300 font-mono">
                      {profile.skills.join(' • ')}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 border-b border-neutral-800 pb-1">
                      Work Experience
                    </h4>
                    <div className="space-y-3">
                      {profile.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between text-xs font-bold text-white">
                            <span>{exp.role} — {exp.company}</span>
                            <span className="font-mono text-neutral-400">{exp.period}</span>
                          </div>
                          <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{exp.description}</p>
                          <p className="text-[11px] text-neutral-500 mt-1">Tech: {exp.tech.join(', ')}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 border-b border-neutral-800 pb-1">
                      Education
                    </h4>
                    <div className="space-y-2">
                      {profile.education.map((edu) => (
                        <div key={edu.id} className="text-xs">
                          <div className="flex justify-between font-bold text-white">
                            <span>{edu.degree} — {edu.institution}</span>
                            <span className="font-mono text-neutral-400">{edu.year}</span>
                          </div>
                          <p className="text-emerald-400 text-[11px] mt-0.5">{edu.score}</p>
                          <p className="text-neutral-400 text-[11px]">{edu.highlights}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
