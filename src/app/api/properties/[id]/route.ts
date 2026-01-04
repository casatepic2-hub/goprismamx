import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/db';

// GET single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check if property is unavailable and user is not admin
    const adminPass = request.nextUrl.searchParams.get('pass');
    const isAdmin = adminPass === 'qqww1234';

    if (property.available === false && !isAdmin) {
      return NextResponse.json({ error: 'Property not available' }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error('GET /api/properties/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

// PATCH - Update property
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const adminToken = request.cookies.get('admin_token')?.value;
    const adminPass = request.headers.get('x-admin-pass');

    const isAuthorized =
      adminToken === process.env.ADMIN_PASSWORD ||
      adminPass === 'qqww1234';

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const result = await updateProperty(id, updates);

    if (!result) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, property: result });
  } catch (error) {
    console.error('PATCH /api/properties/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminToken = request.cookies.get('admin_token')?.value;

    if (adminToken !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await deleteProperty(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/properties/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
