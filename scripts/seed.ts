import { config } from 'dotenv';
config({ path: '.env.local' });
import { sql } from '@vercel/postgres';

async function seed() {
  console.log('Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK (type IN ('sale', 'rent', 'both')),
      category TEXT NOT NULL CHECK (category IN ('house', 'apartment', 'land', 'commercial', 'warehouse')),
      location TEXT,
      neighborhood TEXT,
      city TEXT DEFAULT 'Tepic, Nayarit',
      lat DOUBLE PRECISION,
      lng DOUBLE PRECISION,
      price INTEGER,
      price_per_sqm INTEGER,
      rent_price INTEGER,
      avaluo_price INTEGER,
      bedrooms NUMERIC(3,1),
      bathrooms NUMERIC(3,1),
      area TEXT,
      lot_size TEXT,
      features JSONB DEFAULT '[]',
      images JSONB DEFAULT '[]',
      video TEXT,
      featured BOOLEAN DEFAULT false,
      available BOOLEAN DEFAULT true,
      is_business_property BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(available)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC)`;

  console.log('Tables and indexes created.');

  // Insert default settings
  await sql`
    INSERT INTO settings (key, value)
    VALUES ('auto_delete', ${JSON.stringify({ saleDeleteWeeks: 8, rentDeleteWeeks: 3, enabled: true })})
    ON CONFLICT (key) DO NOTHING
  `;

  await sql`
    INSERT INTO settings (key, value)
    VALUES ('featured_properties', ${JSON.stringify({
      rentFeatured: [],
      saleFeatured: [],
      rentFeaturedSimilar: null,
      saleFeaturedSimilar: null,
    })})
    ON CONFLICT (key) DO NOTHING
  `;

  console.log('Default settings inserted.');
  console.log('Seed complete! Add properties through the admin panel.');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
