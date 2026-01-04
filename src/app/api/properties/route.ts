import { NextRequest, NextResponse } from 'next/server';
import { getProperties, createProperty } from '@/lib/db';

// GET - Fetch all properties
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const available = searchParams.get('available');

    const properties = await getProperties(
      available !== null ? available === 'true' : undefined
    );

    return NextResponse.json({ properties });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'missing_connection_string') {
      return NextResponse.json({ properties: [] });
    }
    console.error('GET /api/properties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST - Create new property (admin only)
export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { property } = body;

    if (!property || !property.id) {
      return NextResponse.json(
        { error: 'Invalid property data' },
        { status: 400 }
      );
    }

    const result = await createProperty(property);

    return NextResponse.json({
      success: true,
      property: result,
    });
  } catch (error) {
    console.error('POST /api/properties error:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
