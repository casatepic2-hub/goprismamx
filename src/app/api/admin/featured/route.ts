import { NextRequest, NextResponse } from 'next/server';
import { getSetting, upsertSetting } from '@/lib/db';

interface FeaturedSettings {
  rentFeatured: string[];
  saleFeatured: string[];
  rentFeaturedSimilar: string | null;
  saleFeaturedSimilar: string | null;
}

const DEFAULT_SETTINGS: FeaturedSettings = {
  rentFeatured: [],
  saleFeatured: [],
  rentFeaturedSimilar: null,
  saleFeaturedSimilar: null,
};

// GET - Fetch featured properties settings (admin only)
export async function GET(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await getSetting('featured_properties');

    if (!settings) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }

    return NextResponse.json({
      rentFeatured: settings.rentFeatured || [],
      saleFeatured: settings.saleFeatured || [],
      rentFeaturedSimilar: settings.rentFeaturedSimilar || null,
      saleFeaturedSimilar: settings.saleFeaturedSimilar || null,
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'missing_connection_string') {
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    console.error('GET /api/admin/featured error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured settings' }, { status: 500 });
  }
}

// PATCH - Update featured properties settings (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rentFeatured, saleFeatured, rentFeaturedSimilar, saleFeaturedSimilar } = body;

    if (rentFeatured && rentFeatured.length > 3) {
      return NextResponse.json({ error: 'rentFeatured can have max 3 items' }, { status: 400 });
    }
    if (saleFeatured && saleFeatured.length > 3) {
      return NextResponse.json({ error: 'saleFeatured can have max 3 items' }, { status: 400 });
    }

    // Merge with existing settings
    const existing = (await getSetting('featured_properties')) || DEFAULT_SETTINGS;
    const updated = {
      ...existing,
      ...(rentFeatured !== undefined && { rentFeatured }),
      ...(saleFeatured !== undefined && { saleFeatured }),
      ...(rentFeaturedSimilar !== undefined && { rentFeaturedSimilar }),
      ...(saleFeaturedSimilar !== undefined && { saleFeaturedSimilar }),
    };

    await upsertSetting('featured_properties', updated);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/admin/featured error:', error);
    return NextResponse.json({ error: 'Failed to update featured settings' }, { status: 500 });
  }
}
