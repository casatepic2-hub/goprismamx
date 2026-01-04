import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/db';

// Meta Housing Catalog Feed - CSV Format
export async function GET() {
  try {
    const properties = await getProperties(true);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goprismamx.com';

    const headers = [
      'home_listing_id',
      'name',
      'availability',
      'price',
      'image[0].url',
      'image[0].tag[0]',
      'url',
      'address.addr1',
      'address.city',
      'address.region',
      'address.country',
      'address.postal_code',
      'latitude',
      'longitude',
      'neighborhood[0]',
      'description',
      'num_baths',
      'num_beds',
      'property_type',
      'area_size',
      'area_unit',
      'listing_type',
    ];

    const rows = properties.map((property) => {
      const price = property.price || property.rentPrice || 0;
      const primaryImage = property.images?.[0] || '';
      const rawImageUrl = primaryImage.startsWith('http') ? primaryImage : `${baseUrl}${primaryImage}`;
      const imageUrl = rawImageUrl.replace(/ /g, '%20');
      const availability = property.type === 'rent' ? 'for_rent' : 'for_sale';
      const listingType = property.type === 'rent' ? 'for_rent_by_agent' : 'for_sale_by_agent';
      const propertyType = mapPropertyType(property.category);
      const areaMatch = property.area?.match(/(\d+)/);
      const areaSize = areaMatch ? areaMatch[1] : '';

      return [
        property.id,
        escapeCsv(property.title || ''),
        availability,
        `${price} MXN`,
        imageUrl,
        'primary',
        `${baseUrl}/propiedad/${property.id}`,
        escapeCsv(property.location || ''),
        escapeCsv(property.city || 'Tepic'),
        'Nayarit',
        'Mexico',
        '63000',
        property.coordinates?.lat || '',
        property.coordinates?.lng || '',
        escapeCsv(property.neighborhood || ''),
        escapeCsv((property.description || '').slice(0, 5000)),
        property.bathrooms || '',
        property.bedrooms || '',
        propertyType,
        areaSize,
        'sq_m',
        listingType,
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="meta-housing-feed.csv"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('GET /api/feed/meta error:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}

function escapeCsv(text: string): string {
  if (!text) return '';
  const cleaned = text
    .replace(/[\r\n]+/g, ' ')
    .replace(/[\t]+/g, ' ')
    .replace(/"/g, '""')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
    .trim();
  return `"${cleaned}"`;
}

function mapPropertyType(category: string): string {
  const mapping: Record<string, string> = {
    house: 'house',
    apartment: 'apartment',
    land: 'land',
    commercial: 'other',
    warehouse: 'other',
  };
  return mapping[category] || 'other';
}
