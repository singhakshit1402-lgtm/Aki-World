'use client';

import React, { useState } from 'react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [badge, setBadge] = useState<string>('Notes');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        // Auto-fill title with friendly filename
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(baseName.charAt(0).toUpperCase() + baseName.slice(1));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Kripya pehle koi file select karein!');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tile', selectedTile);
      formData.append('title', title.trim() || selectedFile.name);
      formData.append('description', description.trim());
      formData.append('badge', badge.trim());
      formData.append('uploader', 'Supreme Boss ikA (Shinigami)');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onUploadSuccess(data.item, data.uploads);
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
      <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border-2 border-red-600/80 shadow-[0_0_80px_rgba(220,38,38,0.7)] overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-red-950/80 via-black to-amber-950/60 border-b border-red-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/50 flex items-center justify-center text-xl">
              ⛩️
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                Shinigami Tile Uploader
              </h3>
              <p className="text-[11px] text-red-300 font-mono">
                Upload images, docs, pdfs, or any file directly to any tile
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
          {/* Target Tile Selection */}
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

          {/* File Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              2. Select File (Image, PDF, DOC, ZIP, or Any Type):
            </label>
            <div className="relative border-2 border-dashed border-red-500/40 hover:border-red-400 rounded-2xl p-5 text-center bg-black/40 hover:bg-black/60 transition cursor-pointer">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="space-y-1">
                <span className="text-3xl block">📤</span>
                <p className="text-xs font-bold text-white">
                  {selectedFile ? selectedFile.name : 'Click ya Drag & Drop karke file chuno'}
                </p>
                <p className="text-[10px] text-gray-400">
                  {selectedFile
                    ? `Size: ${(selectedFile.size / 1024).toFixed(1)} KB • Type: ${selectedFile.type || 'Any'}`
                    : 'Supports PNG, JPG, PDF, DOCX, TXT, PY, ZIP, etc.'}
                </p>
              </div>
            </div>
          </div>

          {/* Title & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                3. Title / Display Name:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Maths Unit 3 Notes, Event Schedule..."
                className="w-full bg-black/60 border border-white/15 focus:border-red-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
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

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              4. Short Description / Caption (Optional):
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
            disabled={isUploading || !selectedFile}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Uploading File to Tile...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Upload to {TILE_OPTIONS.find((t) => t.id === selectedTile)?.label || 'Tile'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
