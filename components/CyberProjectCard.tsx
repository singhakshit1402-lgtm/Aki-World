'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  CYBER_SECURITY_PROJECTS,
  CYBER_PROJECTS_BY_ID,
  CYBER_PREREQ_CMD,
  type CyberSecurityProject,
} from '@/lib/cyberSecurityProjects';

interface CyberProjectCardProps {
  projectId: string;
  customMessageOverride?: string;
}

async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to legacy textarea
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}

function sanitizePythonFilename(filename: string): string {
  const cleaned = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  return cleaned.endsWith('.py') ? cleaned : `${cleaned}.py`;
}

const SingleCyberProjectView = React.memo(function SingleCyberProjectView({
  project,
  customMessageOverride,
  defaultExpanded = true,
}: {
  project: CyberSecurityProject;
  customMessageOverride?: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [pipCopyState, setPipCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const scheduleReset = useCallback((fn: () => void, ms = 2200) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const handleCopyCode = useCallback(async () => {
    const ok = await safeCopyToClipboard(project.code);
    setCopyState(ok ? 'copied' : 'error');
    setStatusMessage(
      ok ? `Copied ${project.filename} to clipboard.` : `Could not copy ${project.filename}. Please select manually.`
    );
    scheduleReset(() => setCopyState('idle'));
  }, [project.code, project.filename, scheduleReset]);

  const handleCopyPip = useCallback(async () => {
    const ok = await safeCopyToClipboard(CYBER_PREREQ_CMD);
    setPipCopyState(ok ? 'copied' : 'error');
    setStatusMessage(ok ? 'Copied pip install command to clipboard.' : 'Could not copy pip install command.');
    scheduleReset(() => setPipCopyState('idle'));
  }, [scheduleReset]);

  const handleDownloadPy = useCallback(() => {
    if (typeof window === 'undefined') return;
    const blob = new Blob([project.code], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitizePythonFilename(project.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    scheduleReset(() => URL.revokeObjectURL(url), 1000);
    setStatusMessage(`Downloading ${project.filename}.`);
  }, [project.code, project.filename, scheduleReset]);

  const codeRegionId = `cyber-code-${project.id}`;
  const displayMessage = customMessageOverride?.trim() || project.customMessage;

  return (
    <article
      aria-label={`${project.title} Python project`}
      className="my-4 rounded-2xl bg-zinc-950/85 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400/60 transition shadow-xl overflow-hidden max-w-3xl"
    >
      <span role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-start gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-xs flex-shrink-0"
          >
            C{project.number}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold text-white truncate">{project.title}</h4>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 font-mono">
                {project.filename}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{project.shortDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label={`Copy Python code for ${project.title}`}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              copyState === 'copied'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : copyState === 'error'
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-cyan-700 hover:bg-cyan-600 text-white border-cyan-400/40 shadow-md'
            }`}
          >
            {copyState === 'copied' ? '✅ Copied Code!' : copyState === 'error' ? '⚠️ Retry Copy' : '📋 Copy Code'}
          </button>

          <button
            type="button"
            onClick={handleDownloadPy}
            aria-label={`Download ${project.filename}`}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-cyan-200 border border-white/15 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            📥 .py
          </button>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls={codeRegionId}
            aria-label={expanded ? `Collapse code for ${project.title}` : `Expand code for ${project.title}`}
            className="px-2 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition cursor-pointer"
          >
            {expanded ? '▲ Hide' : '▼ View'}
          </button>
        </div>
      </div>

      <div className="px-4 py-3 bg-gradient-to-r from-cyan-950/40 via-black to-blue-950/30 border-b border-white/5 flex items-start gap-2.5 text-xs text-cyan-200">
        <span aria-hidden="true" className="text-base flex-shrink-0">
          🛡️
        </span>
        <div className="flex-1 leading-relaxed">
          <p className="font-medium">{displayMessage}</p>
        </div>
      </div>

      <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-zinc-300">Stack:</span>
          {project.libraries.map((lib) => (
            <span key={lib} className="px-2 py-0.5 rounded bg-white/5 text-zinc-200 font-mono text-[10px] border border-white/10">
              {lib}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 hidden sm:inline">Prereq:</span>
          <button
            type="button"
            onClick={handleCopyPip}
            aria-label="Copy pip install command"
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-amber-300 border border-white/10 transition cursor-pointer"
          >
            {pipCopyState === 'copied' ? '✅ Copied pip!' : '📦 pip install ...'}
          </button>
        </div>
      </div>

      {expanded && (
        <div id={codeRegionId} className="relative bg-black/95">
          <pre
            tabIndex={0}
            aria-label={`Python code for ${project.filename}`}
            className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <code>{project.code}</code>
          </pre>
        </div>
      )}
    </article>
  );
});

export default function CyberProjectCard({ projectId, customMessageOverride }: CyberProjectCardProps) {
  const [selectedId, setSelectedId] = useState<string>(
    projectId === 'all' || !CYBER_PROJECTS_BY_ID[projectId] ? CYBER_SECURITY_PROJECTS[0].id : projectId
  );
  const [searchQuery, setSearchQuery] = useState('');

  const activeProject = useMemo(() => {
    return CYBER_PROJECTS_BY_ID[selectedId] || CYBER_SECURITY_PROJECTS[0];
  }, [selectedId]);

  const filteredProjects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return CYBER_SECURITY_PROJECTS;
    return CYBER_SECURITY_PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.filename.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.keywords.some((kw) => kw.includes(q))
    );
  }, [searchQuery]);

  if (projectId !== 'all' && CYBER_PROJECTS_BY_ID[projectId]) {
    return (
      <SingleCyberProjectView
        project={CYBER_PROJECTS_BY_ID[projectId]}
        customMessageOverride={customMessageOverride}
        defaultExpanded={true}
      />
    );
  }

  return (
    <section aria-label="HCLTech Career Shaper Cyber Security Vault" className="w-full space-y-4">
      <div className="p-4 rounded-2xl bg-zinc-950/75 border border-cyan-500/30 backdrop-blur-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>🛡️</span> HCLTech Cyber Analysis — 14 Python Security Tools
            </h3>
            <p className="text-xs text-zinc-400">
              Select any cyber analysis project tab below, or search by tool name (e.g. port scanner, hash cracker, firewall).
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold self-start sm:self-auto">
            14 / 14 Complete
          </span>
        </div>

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter cyber tools (e.g. keylogger, caesar, dns, vuln, traffic, canary)..."
          aria-label="Filter cyber security projects"
          className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-cyan-400 transition"
        />

        <div role="tablist" aria-label="Cyber project selector" className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {filteredProjects.map((p) => {
            const isSelected = p.id === activeProject.id;
            return (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={isSelected}
                aria-controls={`cyber-panel-${p.id}`}
                id={`cyber-tab-${p.id}`}
                onClick={() => setSelectedId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer flex-shrink-0 border ${
                  isSelected
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow-md font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                }`}
              >
                C{p.number}. {p.title.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      <div id={`cyber-panel-${activeProject.id}`} role="tabpanel" aria-labelledby={`cyber-tab-${activeProject.id}`}>
        <SingleCyberProjectView
          project={activeProject}
          customMessageOverride={customMessageOverride}
          defaultExpanded={true}
        />
      </div>
    </section>
  );
}
