import { NextRequest, NextResponse } from 'next/server';
import {
  getPushSubscriberCount,
  getVapidPublicKey,
  isPushConfigured,
  isValidPushSubscription,
  removePushSubscription,
  savePushSubscription,
} from '@/lib/pushService';

export async function GET() {
  return NextResponse.json({
    configured: isPushConfigured(),
    publicKey: getVapidPublicKey(),
    subscriberCount: getPushSubscriberCount(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = typeof body?.action === 'string' ? body.action.toUpperCase() : 'SUBSCRIBE';

    if (action === 'UNSUBSCRIBE') {
      const endpoint = typeof body?.endpoint === 'string' ? body.endpoint : body?.subscription?.endpoint;
      if (typeof endpoint !== 'string' || !endpoint) {
        return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
      }
      const subscriberCount = removePushSubscription(endpoint);
      return NextResponse.json({ success: true, subscriberCount });
    }

    if (!isValidPushSubscription(body?.subscription)) {
      return NextResponse.json({ error: 'Invalid push subscription payload' }, { status: 400 });
    }

    const subscriberCount = savePushSubscription(body.subscription, {
      admissionNo: typeof body?.user?.admissionNo === 'string' ? body.user.admissionNo : undefined,
      studentName: typeof body?.user?.name === 'string' ? body.user.name : undefined,
    });

    return NextResponse.json({
      success: true,
      subscriberCount,
      configured: isPushConfigured(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process push subscription' }, { status: 400 });
  }
}
