import * as webpush from 'web-push';

export interface StoredPushSubscription {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  admissionNo?: string;
  studentName?: string;
  subscribedAt: number;
}

interface PushStore {
  subscriptions: Map<string, StoredPushSubscription>;
  vapidConfigured: boolean;
}

const g = globalThis as unknown as { __SHINIGAMI_PUSH_STORE__?: PushStore };

if (!g.__SHINIGAMI_PUSH_STORE__) {
  g.__SHINIGAMI_PUSH_STORE__ = {
    subscriptions: new Map<string, StoredPushSubscription>(),
    vapidConfigured: false,
  };
}

const PUSH_STORE = g.__SHINIGAMI_PUSH_STORE__;

export function getVapidPublicKey(): string {
  return (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '').trim();
}

function ensureVapidConfigured(): boolean {
  const publicKey = getVapidPublicKey();
  const privateKey = (process.env.VAPID_PRIVATE_KEY || '').trim();
  const rawEmail = (process.env.VAPID_EMAIL || 'mailto:admin@abes.ac.in').trim();
  const subject =
    rawEmail.startsWith('mailto:') || rawEmail.startsWith('https://')
      ? rawEmail
      : `mailto:${rawEmail}`;

  if (!publicKey || !privateKey) {
    return false;
  }

  if (!PUSH_STORE.vapidConfigured) {
    try {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      PUSH_STORE.vapidConfigured = true;
    } catch {
      return false;
    }
  }
  return true;
}

export function isPushConfigured(): boolean {
  return Boolean(getVapidPublicKey() && (process.env.VAPID_PRIVATE_KEY || '').trim());
}

/**
 * Validates that a push subscription endpoint is a legitimate HTTPS URL
 * (prevents SSRF or malformed endpoints).
 */
export function isValidPushSubscription(sub: unknown): sub is {
  endpoint: string;
  expirationTime?: number | null;
  keys: { p256dh: string; auth: string };
} {
  if (!sub || typeof sub !== 'object') return false;
  const s = sub as Record<string, unknown>;
  if (typeof s.endpoint !== 'string' || !s.endpoint.startsWith('https://') || s.endpoint.length > 2048) {
    return false;
  }
  try {
    const parsed = new URL(s.endpoint);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '[::1]' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('169.254.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    ) {
      return false;
    }
  } catch {
    return false;
  }
  const keys = s.keys as Record<string, unknown> | undefined;
  if (!keys || typeof keys.p256dh !== 'string' || typeof keys.auth !== 'string') return false;
  if (keys.p256dh.length < 16 || keys.auth.length < 8) return false;
  return true;
}

export function savePushSubscription(
  sub: { endpoint: string; expirationTime?: number | null; keys: { p256dh: string; auth: string } },
  meta?: { admissionNo?: string; studentName?: string }
): number {
  PUSH_STORE.subscriptions.set(sub.endpoint, {
    endpoint: sub.endpoint,
    expirationTime: sub.expirationTime ?? null,
    keys: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
    admissionNo: meta?.admissionNo?.toUpperCase().trim(),
    studentName: meta?.studentName?.trim(),
    subscribedAt: Date.now(),
  });
  return PUSH_STORE.subscriptions.size;
}

export function removePushSubscription(endpoint: string): number {
  PUSH_STORE.subscriptions.delete(endpoint);
  return PUSH_STORE.subscriptions.size;
}

export function getPushSubscriberCount(): number {
  return PUSH_STORE.subscriptions.size;
}

export async function sendAnnouncementPushToAllDevices(
  announcementText: string,
  broadcastId: number
): Promise<{ sent: number; failed: number; total: number; configured: boolean }> {
  const cleanText = announcementText.trim().slice(0, 500);
  const subs = Array.from(PUSH_STORE.subscriptions.values());
  const configured = ensureVapidConfigured();

  if (!cleanText || !configured || subs.length === 0) {
    return { sent: 0, failed: 0, total: subs.length, configured };
  }

  const payload = JSON.stringify({
    title: "👑 Boss ikA's Sovereign Announcement 🔔",
    body: cleanText,
    tag: `ika-broadcast-${broadcastId}`,
    url: '/',
  });

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            expirationTime: sub.expirationTime ?? null,
            keys: sub.keys,
          },
          payload,
          { TTL: 3600, urgency: 'high' }
        );
        sent++;
      } catch (err: unknown) {
        failed++;
        const statusCode =
          err && typeof err === 'object' && 'statusCode' in err
            ? Number((err as { statusCode?: number }).statusCode)
            : 0;
        // Automatically prune expired / unsubscribed endpoints
        if (statusCode === 404 || statusCode === 410) {
          PUSH_STORE.subscriptions.delete(sub.endpoint);
        }
      }
    })
  );

  return { sent, failed, total: PUSH_STORE.subscriptions.size, configured };
}
