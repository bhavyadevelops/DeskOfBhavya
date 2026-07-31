import { Router } from "express";
import type { Request, Response } from "express";

import { getAppData, setAppData } from "../lib/app-data";

const router = Router();

router.get("/notes", async (_req: Request, res: Response) => {
  const notes = await getAppData("notes");
  res.json(notes);
});

router.put("/notes", async (req: Request, res: Response) => {
  await setAppData("notes", req.body);
  res.json({ ok: true });
});

router.get("/books", async (_req: Request, res: Response) => {
  const books = await getAppData("books");
  res.json(books);
});

router.put("/books", async (req: Request, res: Response) => {
  await setAppData("books", req.body);
  res.json({ ok: true });
});

export default router;