'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { isSafeHrefOrSrc } from '@/lib/portalFixes';

interface PaperDownloadCardProps {
  title: string;
  filesCsv: string;
}

function getSafeDownloadFilename(fileUrl: string, fallback: string): string {
  try {
    const cleanPath = fileUrl.split('?')[0].split('#')[0];
    const lastSeg = cleanPath.split('/').pop();
    if (!lastSeg) return fallback;
    return decodeURIComponent(lastSeg).replace(/[<>:"/\\|?*]/g, '_');
  } catch {
    return fallback;
  }
}

const PaperDownloadCard = React.memo(function PaperDownloadCard({
  title,
  filesCsv,
}: PaperDownloadCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const timersRef = useRef<number[]>([]);

  const files = filesCsv
    .split(',')
    .map((f) => f.trim())
    .filter((f) => f.length > 0 && isSafeHrefOrSrc(f));

  const firstPdf = files.find((f) => f.toLowerCase().split('?')[0].endsWith('.pdf'));
  const isPdf = Boolean(firstPdf);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, []);

  const handleDownloadAll = useCallback(() => {
    if (files.length === 0 || typeof window === 'undefined') return;
    files.forEach((fileUrl, index) => {
      const id = window.setTimeout(() => {
        const link = document.createElement('a');
        link.href = fileUrl;
        const fallback = isPdf ? `document_${index + 1}.pdf` : `paper_${index + 1}.jpg`;
        link.download = getSafeDownloadFilename(fileUrl, fallback);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 200);
      timersRef.current.push(id);
    });
  }, [files, isPdf]);

  if (files.length === 0) return null;

  return (
    <div className="my-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-red-500/40 transition shadow-lg overflow-hidden max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className={`w-10 h-10 rounded-xl ${
              isPdf
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            } border flex items-center justify-center font-bold text-xs flex-shrink-0`}
          >
            {isPdf ? 'PDF' : files.length > 1 ? `${files.length}P` : 'IMG'}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <p className="text-xs text-gray-400">
              {isPdf
                ? 'Official ABES Autonomous PDF Document'
                : `Official Autonomous Paper • ${files.length} ${files.length > 1 ? 'Pages' : 'Page'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            aria-expanded={showPreview}
            aria-label={`${showPreview ? 'Hide' : 'View'} preview for ${title}`}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition border border-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            {showPreview ? '🙈 Hide' : '👁️ View'}
          </button>

          {firstPdf && (
            <a
              href={firstPdf}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${title} PDF in a new tab`}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-medium transition border border-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              ↗ Full Tab
            </a>
          )}

          <button
            type="button"
            onClick={handleDownloadAll}
            aria-label={`Download ${title}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <span aria-hidden="true">📥</span> Download
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="p-3 bg-black/60 space-y-3">
          {files.map((fileUrl, idx) => (
            <div key={`${fileUrl}-${idx}`} className="space-y-1">
              {fileUrl.toLowerCase().split('?')[0].endsWith('.pdf') ? (
                <iframe
                  src={fileUrl}
                  title={`${title} Preview`}
                  loading="lazy"
                  className="w-full h-[460px] rounded-xl border border-white/15 bg-zinc-900"
                />
              ) : (
                <>
                  {files.length > 1 && (
                    <span className="text-[11px] text-gray-400 font-medium">
                      Page {idx + 1} of {files.length}
                    </span>
                  )}
                  <img
                    src={fileUrl}
                    alt={`${title} - Page ${idx + 1}`}
                    loading="lazy"
                    className="w-full rounded-xl border border-white/10"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default PaperDownloadCard;
