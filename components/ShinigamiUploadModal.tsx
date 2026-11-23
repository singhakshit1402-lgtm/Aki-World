'use client';

import React, { useState, useRef } from 'react';
import type { TileUploadItem } from '@/app/api/upload/route';

interface ShinigamiUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTileId?: string;
  onUploadSuccess: (item: TileUploadItem, allUploads: TileUploadItem[]) => void;
}

const TILE_OPTIONS = [
  { id: 'home', label: '🏠 Home / Overview', icon: '🏠' },
  { id: 'papers', label: '📄 Sample Papers & Notes', icon: '📄' },
  { id: 'assignments', label: '📝 Assignment Tracker', icon: '📝' },
  { id: 'faculty', label: '👩‍🏫 Faculty Dossiers', icon: '👩‍🏫' },
  { id: 'timetable', label: '⏰ Time Table', icon: '⏰' },
  { id: 'placement', label: '🎯 Placement Reality', icon: '🎯' },
  { id: 'canteen', label: '🍔 Canteen Menus', icon: '🍔' },
  { id: 'bunk_sgpa', label: '🛡️🧮 Safe Bunk & SGPA Suite', icon: '🛡️' },
  { id: 'personal_cards', label: '🎴 Student Soul Cards', icon: '🎴' },
  { id: 'all', label: '🌟 All Tiles (Universal)', icon: '🌟' },
];

export default function ShinigamiUploadModal({
  isOpen,
  onClose,
  initialTileId = 'home',
  onUploadSuccess,
}: ShinigamiUploadModalProps) {
  const [selectedTile, setSelectedTile] = useState<string>(initialTileId);
  const [targetSection, setTargetSection] = useState<'CSE-2' | 'CSE-8' | 'both'>('both');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [badge, setBadge] = useState<string>('Notes');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getMiniIcon = (name: string, type: string) => {
    const ext = name.toLowerCase();
    if (type.startsWith('image/') || ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg')) return '🖼️';
    if (ext.endsWith('.pdf') || type === 'application/pdf') return '📕';
    if (ext.endsWith('.zip') || ext.endsWith('.rar') || ext.endsWith('.7z')) return '📦';
    if (ext.endsWith('.py') || ext.endsWith('.cpp') || ext.endsWith('.ts') || ext.endsWith('.js')) return '💻';
    return '📄';
  };

  const totalBytes = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const incoming = Array.from(e.target.files);
      setSelectedFiles((prev) => {
        // Filter out duplicate files by name and size
        const existingKeys = new Set(prev.map((f) => `${f.name}_${f.size}`));
        const newOnes = incoming.filter((f) => !existingKeys.has(`${f.name}_${f.size}`));
        return [...prev, ...newOnes];
      });

      if (!title && incoming.length === 1 && selectedFiles.length === 0) {
        const baseName = incoming[0].name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
      }
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAllFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setErrorMsg('Kripya pehle kam se kam ek file select karein!');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      // Append each file under 'files'
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('tile', selectedTile);
      formData.append('targetSection', targetSection);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('badge', badge.trim());
      formData.append('uploader', 'Supreme Boss ikA (Shinigami)');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onUploadSuccess(data.items?.[0] || data.item, data.uploads);
        onClose();
      } else {
        setErrorMsg(data.error || 'Upload failed. Kripya dobara try karein.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload connection error';
      setErrorMsg(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9995] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border-2 border-red-600/80 shadow-[0_0_80px_rgba(220,38,38,0.7)] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-black to-amber-950/60 border-b border-red-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-xl">
              ⛩️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white uppercase tracking-wider">
                  Shinigami Multi-File Uploader
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-[9px] font-mono font-bold text-white">
                  MULTI 📚
                </span>
              </div>
              <p className="text-[11px] text-red-300 font-mono">
                Upload multiple images, docs, pdfs &amp; files simultaneously
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-red-600 text-gray-300 hover:text-white text-xs font-bold cursor-pointer transition flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* 1. Target Tile Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              1. Choose Target Tile (Kahan upload karna hai?):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TILE_OPTIONS.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setSelectedTile(t.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition cursor-pointer flex items-center gap-2 ${
                    selectedTile === t.id
                      ? 'bg-red-600 text-white border-red-400 font-bold shadow-md'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Audience / Section Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              2. Target Section (Kaunse Section ke liye hai?):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetSection('both')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  targetSection === 'both'
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🌟</span>
                <span>Both (CSE-2 &amp; CSE-8)</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetSection('CSE-2')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  targetSection === 'CSE-2'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🔵</span>
                <span>CSE-2 Only</span>
              </button>
              <button
                type="button"
                onClick={() => setTargetSection('CSE-8')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  targetSection === 'CSE-8'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>🟣</span>
                <span>CSE-8 Only</span>
              </button>
            </div>
          </div>

          {/* 3. Multi-File Picker Dropzone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                3. Select Files (Multiple Files Supported 📚):
              </label>
              {selectedFiles.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllFiles}
                  className="text-[10px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                >
                  Clear All ({selectedFiles.length})
                </button>
              )}
            </div>

            <div className="relative border-2 border-dashed border-red-500/40 hover:border-red-400 rounded-2xl p-5 text-center bg-black/40 hover:bg-black/60 transition cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-1 pointer-events-none">
                <span className="text-3xl block">📤</span>
                <p className="text-xs font-bold text-white">
                  {selectedFiles.length > 0
                    ? `＋ Add More Files (Selected: ${selectedFiles.length} Files • ${formatSize(totalBytes)})`
                    : 'Click ya Drag & Drop karke multiple files chuno'}
                </p>
                <p className="text-[10px] text-gray-400">
                  Select 1, 5, 10 or more files at once (PNG, JPG, PDF, DOCX, TXT, PY, ZIP)
                </p>
              </div>
            </div>

            {/* List of Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
                  <span className="text-amber-400 font-bold">
                    📂 {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'} Queue:
                  </span>
                  <span>Total: {formatSize(totalBytes)}</span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={`${file.name}_${idx}`}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-base shrink-0">{getMiniIcon(file.name, file.type)}</span>
                        <div className="truncate">
                          <span className="font-mono text-[11px] font-bold block truncate max-w-[240px]">
                            {file.name}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono">
                            {formatSize(file.size)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        title="Remove file"
                        className="w-5 h-5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-[10px] font-black cursor-pointer transition flex items-center justify-center shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Title & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                {selectedFiles.length > 1 ? '4. Base Title (Optional):' : '4. Title / Display Name:'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  selectedFiles.length > 1
                    ? 'e.g. Maths Unit 3 Notes (files will be numbered)...'
                    : 'e.g. Maths Unit 3 Notes, Event Schedule...'
                }
                className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
              {selectedFiles.length > 1 && (
                <p className="text-[9px] text-gray-400 font-mono">
                  * Agar title blank chhodoge toh har file ka apna original filename use hoga.
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                Badge / Tag:
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-white outline-none cursor-pointer"
              >
                <option value="Notes">Notes 📚</option>
                <option value="Notice">Notice 📢</option>
                <option value="Schedule">Schedule ⏰</option>
                <option value="Exam">Exam 📝</option>
                <option value="Official">Official 🏛️</option>
                <option value="Media">Media 🖼️</option>
                <option value="VIP">VIP 👑</option>
              </select>
            </div>
          </div>

          {/* 5. Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              5. Short Description / Caption (Optional):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Students ke liye koi zaroori note ya explanation..."
              className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none resize-none"
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-xs text-red-200">
              ❌ {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>
                  Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}File{selectedFiles.length > 1 ? 's' : ''} to {TILE_OPTIONS.find((t) => t.id === selectedTile)?.label || 'Tile'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
