import type { NextFunction, Request, Response } from "express";

export function requireOwnerAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("x-owner-token");
  const expected = process.env.OWNER_ACCESS_TOKEN;

  if (!expected || !token || token !== expected) {
    res.status(401).json({ error: "owner authentication required" });
    return;
  }

  next();
}
