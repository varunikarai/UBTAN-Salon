import { Router } from "express";
import {
  createGalleryItem,
  createReview,
  createService,
  deleteGalleryItem,
  deleteService,
  listGalleryItems,
  listReviews,
  listServices,
} from "../lib/database";
import { requireOwnerAuth } from "../middlewares/ownerAuth";

const router = Router();

router.post("/owner/verify", requireOwnerAuth, (_req, res) => {
  res.json({ ok: true });
});

router.get("/services", (_req, res) => {
  res.json(listServices());
});

router.post("/services", requireOwnerAuth, (req, res) => {
  const { title, description } = req.body as { title?: string; description?: string };
  if (!title || !description) {
    return res.status(400).json({ error: "title and description are required" });
  }

  const service = createService(title, description);
  return res.status(201).json(service);
});

router.delete("/services/:id", requireOwnerAuth, (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  deleteService(id);
  return res.json({ success: true });
});

router.get("/reviews", (_req, res) => {
  res.json(listReviews());
});

router.post("/reviews", (req, res) => {
  const { name, body, rating } = req.body as { name?: string; body?: string; rating?: number };
  if (
    !name ||
    !body ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return res.status(400).json({ error: "name, body, and an integer rating from 1 to 5 are required" });
  }

  const review = createReview(name, body, rating);
  return res.status(201).json(review);
});

router.get("/gallery", (_req, res) => {
  res.json(listGalleryItems());
});

router.post("/gallery", requireOwnerAuth, (req, res) => {
  const { src, alt } = req.body as { src?: string; alt?: string };
  if (!src || !alt) {
    return res.status(400).json({ error: "src and alt are required" });
  }

  const item = createGalleryItem(src, alt);
  return res.status(201).json(item);
});

router.delete("/gallery/:id", requireOwnerAuth, (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "invalid id" });
  }

  deleteGalleryItem(id);
  return res.json({ success: true });
});

export default router;
