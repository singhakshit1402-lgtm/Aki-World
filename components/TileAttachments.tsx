'use client';

import React, { useState } from 'react';
import type { TileUploadItem } from '@/app/api/upload/route';

interface TileAttachmentsProps {
  tileId: string;
  tileName?: string;
  uploads: TileUploadItem[];
  isBoss: boolean;
  onDelete?: (id: string) => void;
  onOpenUploadModal?: (tileId: string) => void;
}

export default function TileAttachments({
  tileId,
  tileName,
  uploads,
  isBoss,
  onDelete,
  onOpenUploadModal,
}: TileAttachmentsProps) {
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<TileUploadItem | null>(null);

  const tileItems = uploads.filter((u) => u.tile === tileId || u.tile === 'all');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: TileUploadItem['fileType']) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'pdf':
        return '📕';
      case 'doc':
        return '📄';
      case 'code':
        return '💻';
      case 'archive':
        return '📦';
      default:
        return '📎';
    }
  };

  // Safe new-tab opener: converts dataUrl to a blob objectURL so Chrome/Firefox NEVER block navigation!
  const openFileInNewTab = (item: TileUploadItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (typeof window === 'undefined') return;

    // 1. Direct server/external URL
    if (item.fileUrl && !item.fileUrl.startsWith('data:')) {
      window.open(item.fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. Base64 Data URL -> Blob URL (Opens instantly in native browser PDF/Image viewer)
    if (item.dataUrl) {
      try {
        const parts = item.dataUrl.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || item.mimeType || 'application/octet-stream';
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers.buffer as ArrayBuffer], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        return;
      } catch {
        // Fallback
      }
    }

    // 3. Fallback server streaming endpoint
    const fallbackUrl = `/api/upload?fileId=${encodeURIComponent(item.id)}`;
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
  };

  if (tileItems.length === 0 && !isBoss) {
    return null;
  }

  return (
    <div className="w-full space-y-3 pt-3">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">📁</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {tileName ? `${tileName} • Shinigami Files & Documents` : 'Shinigami Uploads & Attachments'}
          </h4>
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono font-bold">
            {tileItems.length} {tileItems.length === 1 ? 'File' : 'Files'}
          </span>
        </div>

        {isBoss && onOpenUploadModal && (
          <button
            type="button"
            onClick={() => onOpenUploadModal(tileId)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-black flex items-center gap-1.5 shadow cursor-pointer transition"
          >
            <span>＋</span> Upload to this Tile
          </button>
        )}
      </div>

      {/* Empty State for Boss */}
      {tileItems.length === 0 && isBoss && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-dashed border-red-500/30 text-center space-y-2">
          <p className="text-xs text-gray-400">
            Iss tile me abhi koi image ya document upload nahi hai.
          </p>
          {onOpenUploadModal && (
            <button
              type="button"
              onClick={() => onOpenUploadModal(tileId)}
              className="px-3 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-500/40 text-xs font-semibold cursor-pointer transition inline-flex items-center gap-1"
            >
              <span>⚡</span> Upload Image / Doc Now
            </button>
          )}
        </div>
      )}

      {/* Grid of uploaded items */}
      {tileItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {tileItems.map((item) => (
            <div
              key={item.id}
              onClick={(e) => openFileInNewTab(item, e)}
              className="group relative p-3.5 rounded-2xl bg-black/60 hover:bg-black/85 border border-white/10 hover:border-red-500/50 shadow-lg flex flex-col justify-between transition-all duration-200 cursor-pointer"
            >
              <div>
                {/* Image preview banner */}
                {item.fileType === 'image' && (
                  <div
                    onClick={(e) => openFileInNewTab(item, e)}
                    className="relative w-full h-36 rounded-xl overflow-hidden bg-black/80 mb-2.5 cursor-pointer group-hover:scale-[1.02] transition"
                  >
                    <img
                      src={item.dataUrl || item.fileUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 px-2.5 py-1 rounded-lg bg-black/80 text-[10px] text-white font-bold backdrop-blur-sm transition flex items-center gap-1 border border-white/20">
                        <span>↗</span> Open in New Tab
                      </span>
                    </div>
                  </div>
                )}

                {/* Non-image document / PDF preview box */}
                {item.fileType !== 'image' && (
                  <div
                    onClick={(e) => openFileInNewTab(item, e)}
                    className="w-full p-3 rounded-xl bg-white/[0.03] group-hover:bg-red-950/20 border border-white/5 group-hover:border-red-500/30 mb-2.5 flex items-center justify-between transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{getFileIcon(item.fileType)}</span>
                      <div>
                        <span className="text-[11px] font-bold text-gray-200 group-hover:text-red-300 font-mono transition block truncate max-w-[170px]">
                          {item.fileName}
                        </span>
                        <span className="text-[9px] text-gray-400">
                          {formatFileSize(item.fileSize)} • Click to Open ↗
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-red-400 group-hover:translate-x-0.5 transition-transform font-bold">↗</span>
                  </div>
                )}

                {/* Badge and timestamp */}
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-amber-300 font-bold uppercase tracking-wider">
                    {item.badge || item.fileType.toUpperCase()}
                  </span>
                  <span>{formatFileSize(item.fileSize)}</span>
                </div>

                {/* Title */}
                <h5 className="text-sm font-bold text-white line-clamp-1 group-hover:text-red-300 transition">
                  {item.title}
                </h5>

                {/* Description */}
                {item.description && (
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Filename & date */}
                <div className="text-[10px] text-gray-500 mt-2 truncate font-mono">
                  <span>{item.fileName}</span> • <span>{item.uploadedAt}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={(e) => openFileInNewTab(item, e)}
                  className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
                >
                  <span>↗</span> Open in New Tab
                </button>

                <a
                  href={item.dataUrl || item.fileUrl}
                  download={item.fileName}
                  onClick={(e) => e.stopPropagation()}
                  title="Direct Download"
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                >
                  <span>⬇️</span>
                </a>

                {isBoss && onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Kya aap "${item.title}" file ko delete karna chahte hain?`)) {
                        onDelete(item.id);
                      }
                    }}
                    title="Delete File"
                    className="px-2.5 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-700 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold transition cursor-pointer"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Images */}
      {selectedPreviewImage && (
        <div
          onClick={() => setSelectedPreviewImage(null)}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl max-h-[90vh] bg-zinc-950 border-2 border-red-500/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default animate-in zoom-in-95"
          >
            <div className="px-5 py-3.5 bg-black/80 border-b border-white/10 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedPreviewImage.title}</h4>
                <p className="text-[11px] text-gray-400 font-mono">
                  {selectedPreviewImage.fileName} • {formatFileSize(selectedPreviewImage.fileSize)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => openFileInNewTab(selectedPreviewImage, e)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition"
                >
                  <span>↗</span> Open in New Tab
                </button>
                <a
                  href={selectedPreviewImage.dataUrl || selectedPreviewImage.fileUrl}
                  download={selectedPreviewImage.fileName}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                >
                  ⬇️ Download
                </a>
                <button
                  onClick={() => setSelectedPreviewImage(null)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-black/90 max-h-[75vh]">
              <img
                src={selectedPreviewImage.dataUrl || selectedPreviewImage.fileUrl}
                alt={selectedPreviewImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
