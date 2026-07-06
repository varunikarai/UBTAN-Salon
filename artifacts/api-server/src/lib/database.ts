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
  `);

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
    SELECT id, title, description, sort_order as sortOrder
    FROM services
    ORDER BY sort_order ASC, id ASC
  `).all() as Array<{ id: number; title: string; description: string; sortOrder: number }>;

  return rows.map((row) => ({ ...row }));
}

export function createService(title: string, description: string): ServiceRecord {
  const result = db.prepare(`
    INSERT INTO services (title, description, sort_order)
    VALUES (?, ?, ?)
  `).run(title, description, Date.now());

  return {
    id: Number(result.lastInsertRowid),
    title,
    description,
    sortOrder: Number(result.lastInsertRowid),
  };
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
