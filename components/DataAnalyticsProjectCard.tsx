'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  DATA_ANALYTICS_PROJECTS,
  DATA_ANALYTICS_BY_ID,
  DATA_ANALYTICS_PREREQ_CMD,
  type DataAnalyticsProject,
} from '@/lib/dataAnalyticsProjects';

interface DataAnalyticsProjectCardProps {
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
    // Fall through to legacy textarea copy
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

const SingleProjectView = React.memo(function SingleProjectView({
  project,
  customMessageOverride,
  defaultExpanded = true,
}: {
  project: DataAnalyticsProject;
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
    const ok = await safeCopyToClipboard(DATA_ANALYTICS_PREREQ_CMD);
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

  const codeRegionId = `da-code-${project.id}`;
  const displayMessage = customMessageOverride?.trim() || project.customMessage;

  return (
    <article
      aria-label={`${project.title} Python project`}
      className="my-4 rounded-2xl bg-zinc-950/85 backdrop-blur-md border border-white/10 hover:border-red-500/40 transition shadow-xl overflow-hidden max-w-3xl"
    >
      <span role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </span>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-white/10 bg-white/[0.03]">
        <div className="flex items-start gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-center justify-center font-bold text-xs flex-shrink-0"
          >
            P{project.number}
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
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
              copyState === 'copied'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : copyState === 'error'
                  ? 'bg-amber-600 text-white border-amber-400'
                  : 'bg-red-600 hover:bg-red-500 text-white border-red-400/40 shadow-md'
            }`}
          >
            {copyState === 'copied' ? '✅ Copied!' : copyState === 'error' ? '⚠️ Retry Copy' : '📋 Copy Code'}
          </button>

          <button
            type="button"
            onClick={handleDownloadPy}
            aria-label={`Download ${project.filename}`}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-200 text-xs font-medium transition border border-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            ⬇️ .py
          </button>

          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls={codeRegionId}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 text-xs font-medium transition border border-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            {expanded ? '🙈 Hide Code' : '👁️ View Code'}
          </button>
        </div>
      </div>

      {/* Custom Student Message Banner */}
      <div className="px-4 py-3 bg-red-500/[0.07] border-b border-white/10">
        <p className="text-xs sm:text-sm text-red-100 leading-relaxed">{displayMessage}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/10">
            📄 Auto CSV: <code className="text-amber-300">{project.csvOutput}</code>
          </span>
          {project.libraries.map((lib) => (
            <span
              key={lib}
              className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20"
            >
              {lib}
            </span>
          ))}
        </div>
      </div>

      {/* Setup Command Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-black/50 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Setup:</span>
          <code className="text-emerald-300 font-mono truncate">{DATA_ANALYTICS_PREREQ_CMD}</code>
        </div>
        <button
          type="button"
          onClick={handleCopyPip}
          aria-label="Copy pip install command"
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-200 text-[11px] font-medium border border-white/10 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          {pipCopyState === 'copied' ? '✅ Copied pip' : '📋 Copy pip'}
        </button>
      </div>

      {expanded && (
        <div id={codeRegionId} className="bg-zinc-950 p-4 max-h-96 overflow-auto">
          <pre className="text-xs sm:text-[13px] leading-relaxed font-mono text-emerald-300 whitespace-pre">
            <code>{project.code}</code>
          </pre>
        </div>
      )}
    </article>
  );
});

const DataAnalyticsProjectCard = React.memo(function DataAnalyticsProjectCard({
  projectId,
  customMessageOverride,
}: DataAnalyticsProjectCardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(DATA_ANALYTICS_PROJECTS[0].id);

  const normalizedId = projectId.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DATA_ANALYTICS_PROJECTS;
    return DATA_ANALYTICS_PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.filename.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        String(p.number) === q ||
        p.keywords.some((kw) => kw.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  if (normalizedId !== 'all') {
    const single = DATA_ANALYTICS_BY_ID[normalizedId];
    if (!single) return null;
    return <SingleProjectView project={single} customMessageOverride={customMessageOverride} defaultExpanded />;
  }

  const activeProject =
    filteredProjects.find((p) => p.id === selectedId) ?? filteredProjects[0] ?? DATA_ANALYTICS_PROJECTS[0];

  return (
    <section
      aria-label="HCLTech Career Shaper 10 Data Analytics Python Projects"
      className="my-4 rounded-2xl bg-zinc-950/90 border border-red-500/30 p-4 shadow-2xl max-w-3xl space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white">🐍 HCLTech Career Shaper — All 10 Data Analytics Projects</h3>
          <p className="text-xs text-zinc-400">
            Search or pick any project below — copy full Python code or download the ready-to-run <code>.py</code> file.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <label htmlFor="da-project-search" className="sr-only">
            Search Data Analytics projects
          </label>
          <input
            id="da-project-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search (e.g. IPL, Spotify, 6)..."
            aria-label="Search Data Analytics projects"
            className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div role="tablist" aria-label="Select a Data Analytics project" className="flex flex-wrap gap-1.5">
        {filteredProjects.map((proj) => {
          const isSelected = proj.id === activeProject.id;
          return (
            <button
              key={proj.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedId(proj.id)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                isSelected
                  ? 'bg-red-600 text-white border-red-400 shadow'
                  : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
              }`}
            >
              {proj.number}. {proj.title}
            </button>
          );
        })}
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-xs text-zinc-400 py-4 text-center">
          No project matched &ldquo;{searchQuery}&rdquo;. Try searching &ldquo;Budget&rdquo;, &ldquo;IPL&rdquo;, &ldquo;Spotify&rdquo;, or &ldquo;Patient&rdquo;.
        </p>
      ) : (
        <SingleProjectView
          key={activeProject.id}
          project={activeProject}
          customMessageOverride={customMessageOverride}
          defaultExpanded
        />
      )}
    </section>
  );
});

export default DataAnalyticsProjectCard;
