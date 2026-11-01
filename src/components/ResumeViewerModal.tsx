import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Briefcase,
  GraduationCap,
  Code2,
  CheckCircle2,
  FileCheck,
  Eye,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onDownload?: () => void;
  onUploadNew?: () => void;
  isAdmin?: boolean;
}

export const DigitalResumeDocument: React.FC<{ profile: UserProfile }> = ({ profile }) => {
  return (
    <div className="max-w-3xl mx-auto bg-[#141414] text-neutral-200 border border-[#262626] rounded-2xl p-6 sm:p-10 shadow-xl space-y-8 print:bg-white print:text-black print:border-0 print:p-0">
      {/* Header info */}
      <div className="border-b border-[#262626] pb-6 print:border-neutral-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight print:text-black">
              {profile.name || 'Dev Bhardwaj'}
            </h1>
            <p className="text-sm font-semibold text-neutral-400 mt-1 print:text-neutral-600">
              {profile.tagline || 'Full-Stack Software Engineer & Web Developer'}
            </p>
          </div>
          {profile.portfolioStatus && (
            <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-semibold print:border-emerald-600 print:text-emerald-700">
              ● {profile.portfolioStatus}
            </span>
          )}
        </div>

        {/* Contact Strip */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400 print:text-neutral-700">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-neutral-500" />
              <span>{profile.email}</span>
            </a>
          )}
          {profile.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-neutral-500" />
              <span>{profile.phone}</span>
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-neutral-500" />
              <span>{profile.location}</span>
            </span>
          )}
          {profile.github && (
            <a
              href={profile.github.startsWith('http') ? profile.github : `https://${profile.github}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github className="h-3.5 w-3.5 text-neutral-500" />
              <span>{profile.github.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {profile.linkedin && (
            <a
              href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5 text-neutral-500" />
              <span>{profile.linkedin.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {profile.bio && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-neutral-800">
            Professional Summary
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed print:text-neutral-800">
            {profile.bio}
          </p>
        </div>
      )}

      {/* Technical Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-neutral-400 print:text-neutral-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-neutral-800">
              Technical Core Competencies
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-[#1f1f1f] border border-[#2e2e2e] text-xs font-medium text-neutral-200 print:bg-neutral-100 print:border-neutral-300 print:text-neutral-900"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#262626] pb-2 print:border-neutral-300">
            <Briefcase className="h-4 w-4 text-neutral-400 print:text-neutral-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-neutral-800">
              Professional Experience
            </h2>
          </div>
          <div className="space-y-4">
            {profile.experience.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div>
                    <span className="font-bold text-white text-sm print:text-black">
                      {exp.role}
                    </span>
                    <span className="text-neutral-400 font-medium"> • {exp.company}</span>
                  </div>
                  <span className="text-neutral-400 font-mono text-[11px] print:text-neutral-600">
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line print:text-neutral-800">
                  {exp.description}
                </p>
                {exp.tech && exp.tech.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-[#202020] px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 print:bg-neutral-200 print:text-neutral-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#262626] pb-2 print:border-neutral-300">
            <GraduationCap className="h-4 w-4 text-neutral-400 print:text-neutral-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 print:text-neutral-800">
              Education & Academic Credentials
            </h2>
          </div>
          <div className="space-y-3">
            {profile.education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                <div>
                  <p className="font-bold text-white text-sm print:text-black">
                    {edu.degree}
                  </p>
                  <p className="text-neutral-400">
                    {edu.institution} {edu.score ? `• ${edu.score}` : ''}
                  </p>
                  {edu.highlights && (
                    <p className="text-[11px] text-neutral-500 mt-0.5 print:text-neutral-600">
                      {edu.highlights}
                    </p>
                  )}
                </div>
                <span className="text-neutral-400 font-mono text-[11px] self-start sm:self-center print:text-neutral-600">
                  {edu.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onDownload,
  onUploadNew,
  isAdmin,
}) => {
  const hasUploadedResume = Boolean(profile.resumeData);
  const [activeTab, setActiveTab] = useState<'file' | 'digital'>(
    hasUploadedResume ? 'file' : 'digital'
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenNewTab = () => {
    if (profile.resumeData) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${profile.resumeData}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-[#2b2b2b] bg-[#121212] shadow-2xl overflow-hidden">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between border-b border-[#262626] bg-[#181818] px-4 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#262626] text-white">
              <FileText className="h-5 w-5 text-neutral-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {profile.name} — Resume / CV
                </h2>
                {hasUploadedResume ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    <FileCheck className="h-3 w-3" />
                    <span>Uploaded PDF</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold text-neutral-300">
                    Interactive CV
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">
                {profile.resumeFileName
                  ? `${profile.resumeFileName} • ${profile.resumeFileSize || 'Ready'}`
                  : 'Full portfolio credentials & work record'}
              </p>
            </div>
          </div>

          {/* Mode switch if uploaded file is present */}
          {hasUploadedResume && (
            <div className="hidden md:flex items-center rounded-lg bg-[#202020] p-0.5 border border-[#2e2e2e]">
              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'file'
                    ? 'bg-[#2f2f2f] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Uploaded Document</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('digital')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'digital'
                    ? 'bg-[#2f2f2f] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Formatted Digital CV</span>
              </button>
            </div>
          )}

          {/* Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {profile.resumeData && (
              <button
                type="button"
                onClick={handleOpenNewTab}
                className="hidden sm:flex items-center gap-1 rounded-lg bg-[#242424] hover:bg-[#323232] px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Pop-out</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 rounded-lg bg-[#242424] hover:bg-[#323232] px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
              title="Print Resume"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {onDownload && (
              <button
                type="button"
                onClick={onDownload}
                className="flex items-center gap-1 rounded-lg bg-white hover:bg-neutral-200 px-3 py-1.5 text-xs font-bold text-black transition-colors shadow-sm"
                title="Download file"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-[#262626] hover:text-white transition-colors ml-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        {hasUploadedResume && (
          <div className="flex md:hidden items-center justify-around border-b border-[#262626] bg-[#161616] py-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`text-xs font-semibold py-1 px-3 rounded ${
                activeTab === 'file' ? 'bg-[#2b2b2b] text-white' : 'text-neutral-400'
              }`}
            >
              Uploaded Document
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('digital')}
              className={`text-xs font-semibold py-1 px-3 rounded ${
                activeTab === 'digital' ? 'bg-[#2b2b2b] text-white' : 'text-neutral-400'
              }`}
            >
              Formatted Digital CV
            </button>
          </div>
        )}

        {/* Viewer Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#0d0d0d] relative">
          {activeTab === 'file' && profile.resumeData ? (
            <div className="h-full w-full flex flex-col">
              <iframe
                src={profile.resumeData}
                title="Resume PDF Viewer"
                className="w-full h-full border-0 bg-neutral-900"
              />
            </div>
          ) : (
            <div className="p-4 sm:p-8">
              {!hasUploadedResume && isAdmin && (
                <div className="max-w-3xl mx-auto mb-6 rounded-xl border border-neutral-800 bg-[#161616] p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                    <FileText className="h-4 w-4 text-neutral-400 shrink-0" />
                    <span>
                      Viewing generated Digital CV. You can also upload your custom PDF resume.
                    </span>
                  </div>
                  {onUploadNew && (
                    <button
                      type="button"
                      onClick={onUploadNew}
                      className="px-3 py-1 rounded-lg bg-[#272727] hover:bg-[#383838] text-xs font-semibold text-white whitespace-nowrap transition-colors"
                    >
                      Upload PDF
                    </button>
                  )}
                </div>
              )}
              <DigitalResumeDocument profile={profile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
