import { NextResponse } from 'next/server';
import { getSetting, getPropertiesByIds } from '@/lib/db';
import { Property } from '@/data/properties';

// GET - Fetch featured properties (public endpoint)
export async function GET() {
  try {
    const settings = await getSetting('featured_properties');

    if (!settings) {
      return NextResponse.json({
        rent: [],
        sale: [],
        rentFeaturedSimilar: null,
        saleFeaturedSimilar: null,
      });
    }

    const rentIds: string[] = settings.rentFeatured || [];
    const saleIds: string[] = settings.saleFeatured || [];
    const allIds = [...new Set([
      ...rentIds,
      ...saleIds,
      settings.rentFeaturedSimilar,
      settings.saleFeaturedSimilar,
    ].filter(Boolean))];

    const properties = await getPropertiesByIds(allIds);
    const propertyMap = new Map(properties.map((p: Property) => [p.id, p]));

    const formatItem = (p: Property) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      rentPrice: p.rentPrice,
      image: p.images?.[0] || null,
      neighborhood: p.neighborhood,
      type: p.type,
    });

    const rentFeatured = rentIds.map(id => propertyMap.get(id)).filter(Boolean).map(p => formatItem(p!));
    const saleFeatured = saleIds.map(id => propertyMap.get(id)).filter(Boolean).map(p => formatItem(p!));

    const rentSimilar = settings.rentFeaturedSimilar ? propertyMap.get(settings.rentFeaturedSimilar) : null;
    const saleSimilar = settings.saleFeaturedSimilar ? propertyMap.get(settings.saleFeaturedSimilar) : null;

    return NextResponse.json({
      rent: rentFeatured,
      sale: saleFeatured,
      rentFeaturedSimilar: rentSimilar ? formatItem(rentSimilar) : null,
      saleFeaturedSimilar: saleSimilar ? formatItem(saleSimilar) : null,
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'missing_connection_string') {
      return NextResponse.json({ rent: [], sale: [], rentFeaturedSimilar: null, saleFeaturedSimilar: null });
    }
    console.error('GET /api/featured error:', error);
    return NextResponse.json({ error: 'Failed to fetch featured properties' }, { status: 500 });
  }
}
