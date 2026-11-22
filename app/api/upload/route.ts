import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface TileUploadItem {
  id: string;
  tile: string; // 'home' | 'papers' | 'faculty' | 'timetable' | 'placement' | 'canteen' | 'bunk_sgpa' | 'all'
  title: string;
  description?: string;
  badge?: string;
  fileName: string;
  fileUrl: string;
  fileType: 'image' | 'pdf' | 'doc' | 'code' | 'archive' | 'other';
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedAtMs: number;
  uploadedBy: string;
}

const DATA_FILE = path.join(process.cwd(), 'data', 'uploads.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureDirectories() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');
  }
}

function getStoredUploads(): TileUploadItem[] {
  ensureDirectories();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredUploads(items: TileUploadItem[]) {
  ensureDirectories();
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

function detectFileType(fileName: string, mime: string): TileUploadItem['fileType'] {
  const ext = path.extname(fileName).toLowerCase();
  if (mime.startsWith('image/') || ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) {
    return 'image';
  }
  if (ext === '.pdf' || mime === 'application/pdf') {
    return 'pdf';
  }
  if (['.doc', '.docx', '.txt', '.rtf', '.odt', '.xlsx', '.xls', '.csv', '.pptx', '.ppt'].includes(ext)) {
    return 'doc';
  }
  if (['.py', '.ts', '.tsx', '.js', '.jsx', '.json', '.cpp', '.c', '.java', '.html', '.css', '.sh', '.sql'].includes(ext)) {
    return 'code';
  }
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) {
    return 'archive';
  }
  return 'other';
}

// GET /api/upload -> returns all uploads
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tileFilter = searchParams.get('tile');
    const all = getStoredUploads();

    if (tileFilter && tileFilter !== 'all') {
      const filtered = all.filter((item) => item.tile === tileFilter || item.tile === 'all');
      return NextResponse.json({ success: true, uploads: filtered });
    }

    return NextResponse.json({ success: true, uploads: all });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// POST /api/upload -> uploads any image, doc, or file to a specific tile
export async function POST(req: NextRequest) {
  try {
    ensureDirectories();
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const tile = (formData.get('tile') as string) || 'home';
    const title = (formData.get('title') as string) || '';
    const description = (formData.get('description') as string) || '';
    const badge = (formData.get('badge') as string) || 'Notice';
    const uploader = (formData.get('uploader') as string) || 'Boss ikA (Shinigami)';

    if (!file) {
      return NextResponse.json({ success: false, error: 'Koi file select nahi ki gayi!' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & create unique destination
    const safeName = file.name.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const uniqueFileName = `${Date.now()}_${safeName}`;
    const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);

    await fs.promises.writeFile(destinationPath, buffer);

    const fileType = detectFileType(file.name, file.type || '');
    const newItem: TileUploadItem = {
      id: `up-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tile,
      title: title.trim() || file.name,
      description: description.trim(),
      badge: badge.trim() || 'Notice',
      fileName: file.name,
      fileUrl: `/uploads/${uniqueFileName}`,
      fileType,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      uploadedAt: new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      uploadedAtMs: Date.now(),
      uploadedBy: uploader,
    };

    const currentList = getStoredUploads();
    const updatedList = [newItem, ...currentList];
    saveStoredUploads(updatedList);

    return NextResponse.json({
      success: true,
      message: `File "${file.name}" successfully uploaded to tile "${tile}"!`,
      item: newItem,
      uploads: updatedList,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// DELETE /api/upload?id=... -> deletes an uploaded file (Boss only)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing file ID' }, { status: 400 });
    }

    const currentList = getStoredUploads();
    const target = currentList.find((i) => i.id === id);

    if (target) {
      // Delete file from disk if it exists
      try {
        const filePath = path.join(process.cwd(), 'public', target.fileUrl.replace(/^\//, ''));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch {}
    }

    const updatedList = currentList.filter((i) => i.id !== id);
    saveStoredUploads(updatedList);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully!',
      uploads: updatedList,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Delete failed';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
