import { NextResponse } from 'next/server';
import { getProperties } from '@/lib/db';

// Google Ads Business Data Feed for Dynamic Remarketing (Real Estate)
export async function GET() {
  try {
    const properties = await getProperties(true);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goprismamx.com';

    const headers = [
      'Listing ID',
      'Listing Name',
      'Final URL',
      'Image URL',
      'Price',
      'City',
      'Description',
      'Address',
      'Listing type',
      'Property type',
      'Availability',
    ];

    const rows = properties.map((property) => {
      const price = property.price || property.rentPrice || 0;
      const primaryImage = property.images?.[0] || '';
      const rawImageUrl = primaryImage.startsWith('http') ? primaryImage : `${baseUrl}${primaryImage}`;
      const imageUrl = rawImageUrl.replace(/ /g, '%20');
      const listingType = property.type === 'rent' ? 'For rent' : 'For sale';
      const propertyType = mapCategoryToPropertyType(property.category);

      return [
        property.id,
        escapeCsv(toTitleCase(property.title || '')),
        `${baseUrl}/propiedad/${property.id}`,
        imageUrl,
        `${price} MXN`,
        escapeCsv(property.city || 'Tepic'),
        escapeCsv(toTitleCase((property.description || '').slice(0, 1000))),
        escapeCsv(formatAddress(property.location || '', property.city || 'Tepic')),
        listingType,
        propertyType,
        'available',
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="properties-feed.csv"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('GET /api/feed/google error:', error);
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

function mapCategoryToPropertyType(category: string): string {
  const mapping: Record<string, string> = {
    house: 'House',
    apartment: 'Apartment',
    land: 'Land',
    commercial: 'Commercial',
    warehouse: 'Commercial',
  };
  return mapping[category] || 'House';
}

function toTitleCase(text: string): string {
  if (!text) return '';
  const hasLowercase = /[a-z]/.test(text);
  const hasUppercase = /[A-Z]/.test(text);
  if (hasLowercase && hasUppercase) return text;
  return text.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

function formatAddress(location: string, city: string): string {
  if (!location) return city + ', Nayarit, Mexico';
  let address = location
    .replace(/casi esquina( con)?/gi, '')
    .replace(/junto a(l)?/gi, '')
    .replace(/frente a(l)?/gi, '')
    .replace(/a un lado de/gi, '')
    .replace(/cerca de/gi, '')
    .replace(/antes /gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  address = address.replace(/[,.\s]+$/, '');
  if (!address.toLowerCase().includes('nayarit')) {
    address = `${address}, ${city}, Nayarit, Mexico`;
  }
  return address;
}
