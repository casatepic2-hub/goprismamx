import { sql } from '@vercel/postgres';
import { Property } from '@/data/properties';

// Row shape returned from Postgres (snake_case)
interface DbPropertyRow {
  id: string;
  title: string;
  description: string | null;
  type: string;
  category: string;
  location: string | null;
  neighborhood: string | null;
  city: string;
  lat: number | null;
  lng: number | null;
  price: number | null;
  price_per_sqm: number | null;
  rent_price: number | null;
  avaluo_price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  lot_size: string | null;
  features: string[];
  images: string[];
  video: string | null;
  featured: boolean;
  available: boolean;
  is_business_property: boolean;
  created_at: string;
  updated_at: string;
}

// Convert DB row (snake_case) to app Property (camelCase)
export function toProperty(row: DbPropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    type: row.type as Property['type'],
    category: row.category as Property['category'],
    location: row.location || '',
    neighborhood: row.neighborhood || '',
    city: row.city,
    coordinates: row.lat != null && row.lng != null ? { lat: row.lat, lng: row.lng } : undefined,
    price: row.price ?? undefined,
    pricePerSqm: row.price_per_sqm ?? undefined,
    rentPrice: row.rent_price ?? undefined,
    avaluoPrice: row.avaluo_price ?? undefined,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    area: row.area ?? undefined,
    lotSize: row.lot_size ?? undefined,
    features: row.features || [],
    images: row.images || [],
    video: row.video ?? undefined,
    featured: row.featured,
    available: row.available,
    isBusinessProperty: row.is_business_property,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Map camelCase field names to snake_case DB columns
const FIELD_MAP: Record<string, string> = {
  title: 'title',
  description: 'description',
  type: 'type',
  category: 'category',
  location: 'location',
  neighborhood: 'neighborhood',
  city: 'city',
  lat: 'lat',
  lng: 'lng',
  price: 'price',
  pricePerSqm: 'price_per_sqm',
  rentPrice: 'rent_price',
  avaluoPrice: 'avaluo_price',
  bedrooms: 'bedrooms',
  bathrooms: 'bathrooms',
  area: 'area',
  lotSize: 'lot_size',
  features: 'features',
  images: 'images',
  video: 'video',
  featured: 'featured',
  available: 'available',
  isBusinessProperty: 'is_business_property',
};

// ── Properties ──────────────────────────────────────────────

export async function getProperties(available?: boolean) {
  const { rows } = available === undefined
    ? await sql`SELECT * FROM properties ORDER BY created_at DESC`
    : await sql`SELECT * FROM properties WHERE available = ${available} ORDER BY created_at DESC`;
  return rows.map(r => toProperty(r as unknown as DbPropertyRow));
}

export async function getPropertyById(id: string) {
  const { rows } = await sql`SELECT * FROM properties WHERE id = ${id}`;
  return rows[0] ? toProperty(rows[0] as unknown as DbPropertyRow) : null;
}

export async function getPropertiesByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const idsStr = `{${ids.join(',')}}`;
  const { rows } = await sql`SELECT * FROM properties WHERE id = ANY(${idsStr}::text[]) AND available = true`;
  return rows.map(r => toProperty(r as unknown as DbPropertyRow));
}

export async function createProperty(data: Record<string, unknown>) {
  const coords = data.coordinates as { lat: number; lng: number } | undefined;
  const { rows } = await sql`
    INSERT INTO properties (
      id, title, description, type, category, location, neighborhood, city,
      lat, lng, price, price_per_sqm, rent_price, avaluo_price,
      bedrooms, bathrooms, area, lot_size, features, images, video,
      featured, available, is_business_property
    ) VALUES (
      ${data.id as string},
      ${data.title as string},
      ${(data.description as string) || null},
      ${data.type as string},
      ${data.category as string},
      ${(data.location as string) || null},
      ${(data.neighborhood as string) || null},
      ${(data.city as string) || 'Tepic, Nayarit'},
      ${coords?.lat ?? null},
      ${coords?.lng ?? null},
      ${(data.price as number) ?? null},
      ${(data.pricePerSqm as number) ?? null},
      ${(data.rentPrice as number) ?? null},
      ${(data.avaluoPrice as number) ?? null},
      ${(data.bedrooms as number) ?? null},
      ${(data.bathrooms as number) ?? null},
      ${(data.area as string) || null},
      ${(data.lotSize as string) || null},
      ${JSON.stringify(data.features || [])},
      ${JSON.stringify(data.images || [])},
      ${(data.video as string) || null},
      ${(data.featured as boolean) ?? false},
      ${(data.available as boolean) ?? true},
      ${(data.isBusinessProperty as boolean) ?? false}
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      updated_at = NOW()
    RETURNING *
  `;
  return rows[0] ? toProperty(rows[0] as unknown as DbPropertyRow) : null;
}

export async function updateProperty(id: string, updates: Record<string, unknown>) {
  // Flatten coordinates if present
  if (updates.coordinates) {
    const coords = updates.coordinates as { lat: number; lng: number };
    updates.lat = coords.lat;
    updates.lng = coords.lng;
    delete updates.coordinates;
  }

  // Build SET clause dynamically
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(updates)) {
    const dbCol = FIELD_MAP[key];
    if (!dbCol) continue;

    const paramValue = (key === 'features' || key === 'images')
      ? JSON.stringify(value)
      : value;

    setClauses.push(`${dbCol} = $${paramIndex}`);
    values.push(paramValue);
    paramIndex++;
  }

  if (setClauses.length === 0) return null;

  setClauses.push(`updated_at = NOW()`);
  values.push(id);

  const query = `UPDATE properties SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  const { rows } = await sql.query(query, values);
  return rows[0] ? toProperty(rows[0] as unknown as DbPropertyRow) : null;
}

export async function deleteProperty(id: string) {
  const { rowCount } = await sql`DELETE FROM properties WHERE id = ${id}`;
  return (rowCount ?? 0) > 0;
}

export async function countProperties(available?: boolean) {
  const { rows } = available === undefined
    ? await sql`SELECT COUNT(*)::int as count FROM properties`
    : await sql`SELECT COUNT(*)::int as count FROM properties WHERE available = ${available}`;
  return rows[0].count as number;
}

// ── Settings ────────────────────────────────────────────────

export async function getSetting(key: string) {
  const { rows } = await sql`SELECT value FROM settings WHERE key = ${key}`;
  return rows[0]?.value ?? null;
}

export async function upsertSetting(key: string, value: unknown) {
  await sql`
    INSERT INTO settings (key, value) VALUES (${key}, ${JSON.stringify(value)})
    ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(value)}, updated_at = NOW()
  `;
}
