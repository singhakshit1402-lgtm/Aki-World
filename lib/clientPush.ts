'use client';

export type NotificationStatus = 'unsupported' | 'default' | 'granted' | 'denied';

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function getBrowserNotificationStatus(): NotificationStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationStatus;
}

export async function registerAnnouncementServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    return registration;
  } catch {
    return null;
  }
}

export async function subscribeDeviceForAnnouncements(user?: {
  admissionNo?: string;
  name?: string;
} | null): Promise<{
  ok: boolean;
  permission: NotificationStatus;
  pushSubscribed: boolean;
  message: string;
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      ok: false,
      permission: 'unsupported',
      pushSubscribed: false,
      message: 'This browser does not support device notifications.',
    };
  }

  let permission: NotificationPermission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    return {
      ok: false,
      permission: permission as NotificationStatus,
      pushSubscribed: false,
      message:
        permission === 'denied'
          ? 'Notifications are blocked in browser settings. Enable notifications for this site to receive Boss ikA announcements.'
          : 'Notification permission was dismissed.',
    };
  }

  let pushSubscribed = false;

  try {
    const registration = await registerAnnouncementServiceWorker();
    if (registration && 'pushManager' in registration) {
      let vapidPublicKey = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '').trim();
      if (!vapidPublicKey) {
        const res = await fetch('/api/push', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          vapidPublicKey = (data.publicKey || '').trim();
        }
      }

      if (vapidPublicKey) {
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });
        }

        const subRes = await fetch('/api/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'SUBSCRIBE',
            subscription: subscription.toJSON(),
            user: user ? { admissionNo: user.admissionNo, name: user.name } : undefined,
          }),
        });
        pushSubscribed = subRes.ok;
      }
    }
  } catch {
    // Even if Web Push subscription fails (e.g. non-HTTPS local preview), OS Notification API still works!
  }

  return {
    ok: true,
    permission: 'granted',
    pushSubscribed,
    message: pushSubscribed
      ? 'Device Push Notifications active! Announcements will ring on your device even in the background.'
      : 'Device Alerts enabled! Announcements will appear as system notifications on your device.',
  };
}

export async function syncExistingPushSubscription(user?: {
  admissionNo?: string;
  name?: string;
} | null): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }
  const result = await subscribeDeviceForAnnouncements(user);
  return result.ok;
}

export async function unsubscribeDeviceFromAnnouncements(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.getRegistration('/sw.js');
    const subscription = await registration?.pushManager.getSubscription();
    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UNSUBSCRIBE', endpoint }),
      }).catch(() => {});
    }
  } catch {
    // Ignore cleanup errors
  }
}

const shownNotificationTags = new Set<string>();

/**
 * Displays a native OS/device notification immediately when an announcement arrives.
 * Deduplicated via `tag` so Service Worker Push + Sync Polling never duplicate alerts.
 */
export async function showDeviceAnnouncementNotification(
  announcementText: string,
  broadcastId?: number
): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  const cleanBody = announcementText.trim();
  if (!cleanBody) return false;

  const tag = broadcastId ? `ika-broadcast-${broadcastId}` : `ika-broadcast-${cleanBody.slice(0, 48)}`;
  if (shownNotificationTags.has(tag)) return false;
  shownNotificationTags.add(tag);
  if (shownNotificationTags.size > 50) {
    const firstKey = shownNotificationTags.values().next().value;
    if (firstKey) shownNotificationTags.delete(firstKey);
  }

  const title = "👑 Boss ikA's Sovereign Announcement 🔔";
  const options: NotificationOptions = {
    body: cleanBody,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag,
    requireInteraction: true,
    data: { url: '/' },
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration('/');
      if (reg) {
        await reg.showNotification(title, options);
        return true;
      }
    }
  } catch {
    // Fall back to direct Notification constructor
  }

  try {
    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch {
    return false;
  }
}
