import { Router, type IRouter, type Request, type Response } from "express";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = "/home/runner/workspace/.desk-data";
const DATA_FILE = join(DATA_DIR, "data.json");

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

function readData(): Record<string, unknown> {
  try {
    if (!existsSync(DATA_FILE)) return {};
    return JSON.parse(readFileSync(DATA_FILE, "utf-8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function writeData(data: Record<string, unknown>): void {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

const router: IRouter = Router();

router.get("/notes", (_req: Request, res: Response) => {
  const data = readData();
  if (data.notes) {
    res.json(data.notes);
  } else {
    res.json(null);
  }
});

router.put("/notes", (req: Request, res: Response) => {
  const data = readData();
  data.notes = req.body;
  writeData(data);
  res.json({ ok: true });
});

router.get("/books", (_req: Request, res: Response) => {
  const data = readData();
  if (data.books) {
    res.json(data.books);
  } else {
    res.json(null);
  }
});

router.put("/books", (req: Request, res: Response) => {
  const data = readData();
  data.books = req.body;
  writeData(data);
  res.json({ ok: true });
});

export default router;
