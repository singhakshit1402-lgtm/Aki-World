import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface TileUploadItem {
  id: string;
  tile: string; // 'home' | 'papers' | 'faculty' | 'timetable' | 'placement' | 'canteen' | 'bunk_sgpa' | 'assignments' | 'personal_cards' | 'all'
  title: string;
  description?: string;
  badge?: string;
  fileName: string;
  fileUrl: string;
  dataUrl?: string; // Instant base64 data URI (100% resilient on serverless Vercel)
  fileType: 'image' | 'pdf' | 'doc' | 'code' | 'archive' | 'other';
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedAtMs: number;
  uploadedBy: string;
  targetSection?: 'CSE-2' | 'CSE-8' | 'both';
}

// In-Memory Global Matrix for serverless fallback
const g = globalThis as unknown as { __SHINIGAMI_UPLOADS__?: TileUploadItem[] };
if (!g.__SHINIGAMI_UPLOADS__) {
  g.__SHINIGAMI_UPLOADS__ = [];
}

// Vercel serverless environment uses /tmp as the only writable path
const isVercel = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  (typeof process.cwd === 'function' && (process.cwd().startsWith('/var/task') || process.cwd().includes('task'))) ||
  process.env.NODE_ENV === 'production'
);

const SEED_DATA_FILE = path.join(process.cwd(), 'data', 'uploads.json');
const DATA_FILE = isVercel
  ? path.join('/tmp', 'uploads.json')
  : path.join(process.cwd(), 'data', 'uploads.json');
const UPLOADS_DIR = isVercel
  ? path.join('/tmp', 'uploads')
  : path.join(process.cwd(), 'public', 'uploads');

function ensureDirectories() {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch {}

  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  } catch {}
}

function getStoredUploads(): TileUploadItem[] {
  ensureDirectories();
  const mergedMap = new Map<string, TileUploadItem>();

  // 1. Read seed file from repository if present (guarantees multiple campus documents are always available)
  try {
    if (fs.existsSync(SEED_DATA_FILE)) {
      const seedRaw = fs.readFileSync(SEED_DATA_FILE, 'utf8');
      const seedParsed = JSON.parse(seedRaw);
      if (Array.isArray(seedParsed)) {
        seedParsed.forEach((item: TileUploadItem) => mergedMap.set(item.id, item));
      }
    }
  } catch {}

  // 2. Read runtime data file (/tmp/uploads.json on Vercel)
  try {
    if (fs.existsSync(DATA_FILE) && DATA_FILE !== SEED_DATA_FILE) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((item: TileUploadItem) => mergedMap.set(item.id, item));
      }
    }
  } catch {}

  // 3. In-memory global uploads
  if (Array.isArray(g.__SHINIGAMI_UPLOADS__)) {
    g.__SHINIGAMI_UPLOADS__.forEach((item: TileUploadItem) => mergedMap.set(item.id, item));
  }

  const result = Array.from(mergedMap.values()).sort(
    (a, b) => (b.uploadedAtMs || 0) - (a.uploadedAtMs || 0)
  );
  g.__SHINIGAMI_UPLOADS__ = result;
  return result;
}

function saveStoredUploads(items: TileUploadItem[]) {
  g.__SHINIGAMI_UPLOADS__ = items;
  ensureDirectories();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
  } catch {
    // Non-fatal if filesystem is read-only
  }
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

// GET /api/upload -> returns all uploads, or filters by ?tile=..., or streams binary by ?fileId=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    // Handle binary file streaming
    if (fileId) {
      const all = getStoredUploads();
      const item = all.find((u) => u.id === fileId);
      if (!item) {
        return new NextResponse('File not found', { status: 404 });
      }

      if (item.dataUrl) {
        const parts = item.dataUrl.split(',');
        if (parts[1]) {
          const buffer = Buffer.from(parts[1], 'base64');
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': item.mimeType || 'application/octet-stream',
              'Content-Disposition': `inline; filename="${encodeURIComponent(item.fileName)}"`,
            },
          });
        }
      }

      // Fallback to disk if dataUrl missing
      try {
        const localPath = path.join(UPLOADS_DIR, item.fileName);
        if (fs.existsSync(localPath)) {
          const buffer = fs.readFileSync(localPath);
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': item.mimeType || 'application/octet-stream',
              'Content-Disposition': `inline; filename="${encodeURIComponent(item.fileName)}"`,
            },
          });
        }
      } catch {}

      return new NextResponse('File data unavailable', { status: 404 });
    }

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

// POST /api/upload -> uploads any image, doc, or file (supports single or multiple files) to a specific tile
export async function POST(req: NextRequest) {
  try {
    ensureDirectories();
    const formData = await req.formData();
    
    // Support both 'files' (multiple) and 'file' (single)
    const rawFiles = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    const allFiles: File[] = rawFiles.length > 0 ? rawFiles : (singleFile ? [singleFile] : []);

    const tile = (formData.get('tile') as string) || 'home';
    const title = (formData.get('title') as string) || '';
    const description = (formData.get('description') as string) || '';
    const badge = (formData.get('badge') as string) || 'Notice';
    const uploader = (formData.get('uploader') as string) || 'Boss ikA (Shinigami)';
    const rawTarget = (formData.get('targetSection') as string) || 'both';
    const targetSection: 'CSE-2' | 'CSE-8' | 'both' = rawTarget === 'CSE-2' || rawTarget === 'CSE-8' ? rawTarget : 'both';

    if (allFiles.length === 0) {
      return NextResponse.json({ success: false, error: 'Koi file select nahi ki gayi!' }, { status: 400 });
    }

    const currentList = getStoredUploads();
    const newItems: TileUploadItem[] = [];

    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];
      if (!file || typeof file.arrayBuffer !== 'function') continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mime = file.type || 'application/octet-stream';

      // Create Base64 Data URL — 100% serverless resilient (instant rendering in img src & downloads everywhere)
      const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;

      // Generate unique ID and safe filename
      const safeName = file.name.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
      const uniqueFileName = `${Date.now()}_${i}_${safeName}`;
      const uploadId = `up-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`;

      // Try writing to disk, safely catching if read-only on Vercel
      try {
        const destinationPath = path.join(UPLOADS_DIR, uniqueFileName);
        fs.writeFileSync(destinationPath, buffer);
      } catch {
        // Ignored safely on Vercel serverless /var/task
      }

      const fileType = detectFileType(file.name, mime);

      // Compute individual item title:
      // If user typed a custom title and there are multiple files, append (1/N)
      // Otherwise use the friendly file name
      let itemTitle = title.trim();
      if (!itemTitle) {
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        itemTitle = baseName.charAt(0).toUpperCase() + baseName.slice(1);
      } else if (allFiles.length > 1) {
        itemTitle = `${itemTitle} (${i + 1}/${allFiles.length})`;
      }

      const newItem: TileUploadItem = {
        id: uploadId,
        tile,
        title: itemTitle,
        description: description.trim(),
        badge: badge.trim() || 'Notice',
        fileName: file.name,
        fileUrl: dataUrl,
        dataUrl,
        fileType,
        mimeType: mime,
        fileSize: file.size,
        uploadedAt: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        uploadedAtMs: Date.now() + i,
        uploadedBy: uploader,
        targetSection,
      };

      newItems.push(newItem);
    }

    const updatedList = [...newItems, ...currentList];
    saveStoredUploads(updatedList);

    return NextResponse.json({
      success: true,
      message: `${newItems.length} file(s) successfully uploaded to tile "${tile}"!`,
      item: newItems[0],
      items: newItems,
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
      // Try delete file from disk if it exists
      try {
        const filePath = path.join(UPLOADS_DIR, target.fileName);
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
