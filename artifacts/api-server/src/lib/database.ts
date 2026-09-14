import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(currentDir, "..", "data");
mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "ubtan.db");
export const db = new DatabaseSync(dbPath);

function seedDefaults() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      body TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      src TEXT NOT NULL,
      alt TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      message TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Price arrived after the first services shipped, so existing databases need
  // the column added rather than recreated. Kept as TEXT: salon pricing is
  // rarely a bare number ("₹1,500 onwards", "₹800 - ₹2,400").
  const serviceColumns = db.prepare("PRAGMA table_info(services)").all() as Array<{ name: string }>;
  if (!serviceColumns.some((column) => column.name === "price")) {
    db.exec("ALTER TABLE services ADD COLUMN price TEXT");
  }

  const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
  if (serviceCount.count === 0) {
    db.prepare(`
      INSERT INTO services (title, description, sort_order) VALUES
      (?, ?, 1),
      (?, ?, 2),
      (?, ?, 3),
      (?, ?, 4)
    `).run(
      "Hair Architecture",
      "Precision cuts, bespoke coloring, and restorative rituals tailored to your hair profile.",
      "Skin Radiance",
      "Clinical facials and luminous treatments designed for a polished glow.",
      "Bespoke Makeup",
      "Modern glamour and soft enhancement for any occasion.",
      "Hands & Feet",
      "Spa-grade manicures and pedicures with calm, elevated comfort.",
    );
  }

  const reviewCount = db.prepare("SELECT COUNT(*) as count FROM reviews").get() as { count: number };
  if (reviewCount.count === 0) {
    db.prepare(`
      INSERT INTO reviews (name, body, rating) VALUES
      (?, ?, 5),
      (?, ?, 5),
      (?, ?, 5)
    `).run(
      "Priya Sharma",
      "The ambiance is incredible. I've never felt so pampered. Neelu's attention to detail is unmatched.",
      "Aditi Verma",
      "UBTAN is my sanctuary. The skincare treatments have completely transformed my complexion.",
      "Riya Singh",
      "Finally, a luxury ladies-only salon that understands modern elegance. My hair has never looked better.",
    );
  }

  const galleryCount = db.prepare("SELECT COUNT(*) as count FROM gallery_items").get() as { count: number };
  if (galleryCount.count === 0) {
    db.prepare(`
      INSERT INTO gallery_items (src, alt) VALUES
      (?, ?),
      (?, ?),
      (?, ?),
      (?, ?)
    `).run(
      "/images/gallery-1.png",
      "Luxury manicure detail",
      "/images/gallery-2.png",
      "Bespoke makeup artistry",
      "/images/gallery-3.png",
      "Hair styling craftsmanship",
      "/images/gallery-4.png",
      "Ubtan skincare ritual",
    );
  }
}

seedDefaults();

export type ServiceRecord = {
  id: number;
  title: string;
  description: string;
  price: string | null;
  sortOrder: number;
};

export type ReviewRecord = {
  id: number;
  name: string;
  body: string;
  rating: number;
  createdAt: string;
};

export type GalleryItemRecord = {
  id: number;
  src: string;
  alt: string;
  createdAt: string;
};

export function listServices(): ServiceRecord[] {
  const rows = db.prepare(`
    SELECT id, title, description, price, sort_order as sortOrder
    FROM services
    ORDER BY sort_order ASC, id ASC
  `).all() as Array<{
    id: number;
    title: string;
    description: string;
    price: string | null;
    sortOrder: number;
  }>;

  return rows.map((row) => ({ ...row }));
}

export function createService(title: string, description: string, price: string | null): ServiceRecord {
  const result = db.prepare(`
    INSERT INTO services (title, description, price, sort_order)
    VALUES (?, ?, ?, ?)
  `).run(title, description, price, Date.now());

  return {
    id: Number(result.lastInsertRowid),
    title,
    description,
    price,
    sortOrder: Number(result.lastInsertRowid),
  };
}

export function updateService(
  id: number,
  fields: { title?: string; description?: string; price?: string | null },
): ServiceRecord | null {
  const existing = db.prepare(`
    SELECT id, title, description, price, sort_order as sortOrder
    FROM services WHERE id = ?
  `).get(id) as ServiceRecord | undefined;

  if (!existing) return null;

  const title = fields.title ?? existing.title;
  const description = fields.description ?? existing.description;
  const price = fields.price === undefined ? existing.price : fields.price;

  db.prepare("UPDATE services SET title = ?, description = ?, price = ? WHERE id = ?")
    .run(title, description, price, id);

  return { ...existing, title, description, price };
}

export function deleteService(id: number) {
  db.prepare("DELETE FROM services WHERE id = ?").run(id);
}

export function listReviews(): ReviewRecord[] {
  const rows = db.prepare(`
    SELECT id, name, body, rating, created_at as createdAt
    FROM reviews
    ORDER BY id DESC
  `).all() as Array<{ id: number; name: string; body: string; rating: number; createdAt: string }>;

  return rows.map((row) => ({ ...row }));
}

export function createReview(name: string, body: string, rating: number): ReviewRecord {
  const result = db.prepare(`
    INSERT INTO reviews (name, body, rating)
    VALUES (?, ?, ?)
  `).run(name, body, rating);

  return {
    id: Number(result.lastInsertRowid),
    name,
    body,
    rating,
    createdAt: new Date().toISOString(),
  };
}

export function listGalleryItems(): GalleryItemRecord[] {
  const rows = db.prepare(`
    SELECT id, src, alt, created_at as createdAt
    FROM gallery_items
    ORDER BY id DESC
  `).all() as Array<{ id: number; src: string; alt: string; createdAt: string }>;

  return rows.map((row) => ({ ...row }));
}

export function createGalleryItem(src: string, alt: string): GalleryItemRecord {
  const result = db.prepare(`
    INSERT INTO gallery_items (src, alt)
    VALUES (?, ?)
  `).run(src, alt);

  return {
    id: Number(result.lastInsertRowid),
    src,
    alt,
    createdAt: new Date().toISOString(),
  };
}

export function deleteGalleryItem(id: number) {
  db.prepare("DELETE FROM gallery_items WHERE id = ?").run(id);
}

export type BookingRecord = {
  id: number;
  name: string;
  phone: string;
  service: string;
  preferredDate: string;
  message: string | null;
  createdAt: string;
};

export function listBookings(): BookingRecord[] {
  const rows = db.prepare(`
    SELECT id, name, phone, service, preferred_date as preferredDate, message, created_at as createdAt
    FROM bookings
    ORDER BY id DESC
  `).all() as Array<{
    id: number;
    name: string;
    phone: string;
    service: string;
    preferredDate: string;
    message: string | null;
    createdAt: string;
  }>;

  return rows.map((row) => ({ ...row }));
}

export function createBooking(
  name: string,
  phone: string,
  service: string,
  preferredDate: string,
  message: string | null,
): BookingRecord {
  const result = db.prepare(`
    INSERT INTO bookings (name, phone, service, preferred_date, message)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, phone, service, preferredDate, message);

  return {
    id: Number(result.lastInsertRowid),
    name,
    phone,
    service,
    preferredDate,
    message,
    createdAt: new Date().toISOString(),
  };
}
