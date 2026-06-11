/**
 * Seed the SQLite Listings database from backend/seed/listings.json.
 *
 * Builds backend/databases/listings.db with a single Listings table, mapping the
 * raw export fields to the frontend Listing shape (description→summary,
 * squareFootage→sqft, rentalPolicy→stayPolicy, contactInfo→host). Array/object
 * fields (photos, amenities, host) are stored as JSON text. Idempotent: the table
 * is recreated-if-missing and fully re-seeded on each run. The taxIdNumber in
 * contactInfo is intentionally dropped (sensitive, never exposed to the client).
 *
 * Run: node backend/scripts/seed-listings.mjs
 */
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const seedPath = join(here, '..', 'seed', 'listings.json');
const dbPath = join(here, '..', 'databases', 'listings.db');

const rows = JSON.parse(readFileSync(seedPath, 'utf8'));
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS Listings (
    _id TEXT PRIMARY KEY,
    title TEXT,
    location TEXT,
    summary TEXT,
    photos TEXT,
    bedrooms INTEGER,
    bathrooms REAL,
    sqft INTEGER,
    price REAL,
    amenities TEXT,
    stayPolicy TEXT,
    cancellationPolicy TEXT,
    houseRules TEXT,
    host TEXT,
    address TEXT,
    createdAt INTEGER
  )
`);
db.exec('DELETE FROM Listings');

const insert = db.prepare(`
  INSERT INTO Listings
    (_id, title, location, summary, photos, bedrooms, bathrooms, sqft, price,
     amenities, stayPolicy, cancellationPolicy, houseRules, host, address, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const l of rows) {
  const ci = l.contactInfo ?? {};
  insert.run(
    String(l._id?.$oid ?? l._id),
    l.title ?? null,
    l.location ?? null,
    l.description ?? null,
    JSON.stringify(l.photos ?? []),
    l.bedrooms ?? null,
    l.bathrooms ?? null,
    l.squareFootage ?? null,
    l.price ?? null,
    JSON.stringify(l.amenities ?? []),
    l.rentalPolicy ?? null,
    l.cancellationPolicy ?? null,
    l.houseRules ?? null,
    JSON.stringify({ name: ci.name ?? null, email: ci.email ?? null, phone: ci.phone ?? null }),
    typeof l.address === 'string' ? l.address : JSON.stringify(l.address ?? null),
    Number(l.createdAt?.$numberLong ?? l.createdAt ?? 0),
  );
}

console.log(`Seeded ${rows.length} listings into ${dbPath}`);
db.close();
