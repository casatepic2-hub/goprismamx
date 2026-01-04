import { NextRequest, NextResponse } from 'next/server';
import { getSetting, upsertSetting } from '@/lib/db';

const DEFAULT_SETTINGS = {
  saleDeleteWeeks: 8,
  rentDeleteWeeks: 3,
  enabled: true,
};

// GET - Fetch settings
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getSetting('auto_delete');

    return NextResponse.json({
      settings: settings || DEFAULT_SETTINGS,
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'missing_connection_string') {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }
    console.error('GET /api/admin/settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PATCH - Update settings
export async function PATCH(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const existing = (await getSetting('auto_delete')) || DEFAULT_SETTINGS;
    await upsertSetting('auto_delete', { ...existing, ...updates });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/admin/settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
