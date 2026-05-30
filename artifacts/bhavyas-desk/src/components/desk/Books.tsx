import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContentBlock {
  id: number;
  type: "text" | "image";
  value: string;
}

interface Chapter {
  id: number;
  heading: string;
  date: string;
  blocks: ContentBlock[];
}

interface Book {
  id: number;
  spineColor: string;
  titleColor: string;
  title: string;
  chapters: Chapter[];
}

function tb(value: string, id: number): ContentBlock {
  return { id, type: "text", value };
}

const DEFAULT_BOOKS: Book[] = [
  {
    id: 1,
    spineColor: "#1e3a6e",
    titleColor: "#a8c5e8",
    title: "Systems",
    chapters: [
      {
        id: 1,
        heading: "On Building at Scale",
        date: "March 2024",
        blocks: [tb(`Every system I've built has taught me the same thing: simplicity is the hardest thing to achieve. Not simplicity of appearance — that's easy with good design — but simplicity of mechanism.\n\nWhen I built QuantumDB's consensus layer, I spent three weeks making it correct, and three months making it simple. The simple version was the one that actually worked under chaos testing.\n\nThe temptation is always to add — another abstraction, another config flag, another edge case handler. The discipline is knowing when the right answer is to remove.`, 10)],
      },
      {
        id: 2,
        heading: "What Distributed Systems Taught Me About People",
        date: "April 2024",
        blocks: [tb(`A distributed system assumes its nodes will fail. It doesn't panic when one goes down — it routes around it, keeps consensus, maintains availability.\n\nI think the best teams work this way too. Single points of failure are architectural mistakes in both systems and organizations.\n\nThe healthiest codebase I've ever worked in was the one where any engineer could be hit by a bus tomorrow and the project would still ship. Not because people were replaceable, but because knowledge was distributed.`, 11)],
      },
    ],
  },
  {
    id: 2,
    spineColor: "#1e4a2e",
    titleColor: "#a8e6b0",
    title: "Ideas",
    chapters: [
      {
        id: 1,
        heading: "The Internet Deserves Better Infrastructure",
        date: "February 2024",
        blocks: [tb(`Every day I use tools that were built 30 years ago for a world that no longer exists. TCP/IP assumptions, DNS architecture, TLS handshakes — brilliant for their era, increasingly hostile to the things we're trying to build.\n\nI think the next decade belongs to whoever rebuilds the foundational layer. Not with blockchain hype or AI buzzwords — but with boring, rigorous engineering that makes the defaults better.\n\nLocalMesh is my attempt at one small part of this. Edge-first networking where the architecture assumes the cloud is optional, not central.`, 12)],
      },
      {
        id: 2,
        heading: "Why I Write Open Source",
        date: "January 2024",
        blocks: [tb(`Not for the GitHub stars. Not for the resume line.\n\nI write open source because it's the only software that gets genuinely reviewed. Corporate code lives behind walls. Open source code lives in public, and the public is ruthless.\n\nEvery issue filed is someone who cared enough to report it. Every PR is someone who cared enough to fix it. The collaborative surface of open source is the closest thing to a peer-reviewed journal that software has.\n\nI want my work reviewed.`, 13)],
      },
    ],
  },
  {
    id: 3,
    spineColor: "#6e1e1e",
    titleColor: "#f4a0a0",
    title: "Journal",
    chapters: [
      {
        id: 1,
        heading: "Things I Learned the Hard Way",
        date: "May 2024",
        blocks: [tb(`1. Premature optimization is real, but so is premature abstraction. I've shipped more bugs from over-engineering than from under-engineering.\n\n2. The best commit message is a short story. "Fix bug" is a confession; "Prevent race condition in cache invalidation when..." is documentation.\n\n3. Sleep is not optional. I spent a week debugging a heisenbug that disappeared after I slept on it. Literally. The bug was in my mental model, not the code.\n\n4. Write the test first not because it's correct dogma but because it forces you to think about the interface before the implementation.`, 14)],
      },
      {
        id: 2,
        heading: "On Curiosity as a Career Strategy",
        date: "May 2024",
        blocks: [tb(`Every interesting project I've worked on started with a question I couldn't stop thinking about.\n\nQuantumDB: "How does Raft actually work? Could I implement it?"\nNeural Canvas: "What if artists could describe texture the same way they describe emotion?"\nDrift: "Why does real-time collaboration still feel like magic instead of just working?"\n\nThe questions weren't strategic. They were just genuinely interesting to me. The strategy came later, after the work existed.\n\nIf you're looking for the secret to building interesting things: cultivate better questions.`, 15)],
      },
    ],
  },
];

let nextId = 5000;

async function fetchBooks(): Promise<Book[] | null> {
  try {
    const res = await fetch("/api/books");
    if (!res.ok) return null;
    return await res.json() as Book[] | null;
  } catch {
    return null;
  }
}

async function saveBooks(books: Book[]): Promise<void> {
  try {
    await fetch("/api/books", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(books),
    });
  } catch { /* silent */ }
}

function readImageAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>(DEFAULT_BOOKS);
  const [openBookId, setOpenBookId] = useState<number | null>(null);
  const [view, setView] = useState<"read" | "index">("read");
  const [addingChapter, setAddingChapter] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [newBody, setNewBody] = useState("");
  const [pendingImageChapterId, setPendingImageChapterId] = useState<number | null>(null);
  const chapterRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchBooks().then(data => {
      if (data && Array.isArray(data) && data.length > 0) setBooks(data);
    });
  }, []);

  const scheduleSync = (updated: Book[]) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => saveBooks(updated), 600);
  };

  const mutateBooks = (fn: (prev: Book[]) => Book[]) => {
    setBooks(prev => {
      const next = fn(prev);
      scheduleSync(next);
      return next;
    });
  };

  const book = books.find(b => b.id === openBookId) ?? null;

  const closeBook = () => {
    setOpenBookId(null);
    setView("read");
    setAddingChapter(false);
  };

  const scrollToChapter = (chapterId: number) => {
    setView("read");
    setAddingChapter(false);
    setTimeout(() => {
      chapterRefs.current.get(chapterId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const addChapter = () => {
    if (!newHeading.trim() || openBookId === null) return;
    const date = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const chapter: Chapter = {
      id: nextId++,
      heading: newHeading.trim(),
      date,
      blocks: newBody.trim() ? [tb(newBody.trim(), nextId++)] : [],
    };
    mutateBooks(prev => prev.map(b => b.id === openBookId ? { ...b, chapters: [...b.chapters, chapter] } : b));
    setNewHeading("");
    setNewBody("");
    setAddingChapter(false);
  };

  const deleteChapter = (chapterId: number) => {
    if (openBookId === null) return;
    mutateBooks(prev => prev.map(b => b.id === openBookId ? { ...b, chapters: b.chapters.filter(c => c.id !== chapterId) } : b));
  };

  const deleteBlock = (chapterId: number, blockId: number) => {
    if (openBookId === null) return;
    mutateBooks(prev => prev.map(b => b.id === openBookId ? {
      ...b,
      chapters: b.chapters.map(c => c.id === chapterId ? { ...c, blocks: c.blocks.filter(bl => bl.id !== blockId) } : c),
    } : b));
  };

  const triggerImageUpload = (chapterId: number) => {
    setPendingImageChapterId(chapterId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || pendingImageChapterId === null || openBookId === null) return;
    e.target.value = "";
    try {
      const dataUrl = await readImageAsBase64(file);
      const imgBlock: ContentBlock = { id: nextId++, type: "image", value: dataUrl };
      mutateBooks(prev => prev.map(b => b.id === openBookId ? {
        ...b,
        chapters: b.chapters.map(c => c.id === pendingImageChapterId ? { ...c, blocks: [...c.blocks, imgBlock] } : c),
      } : b));
    } catch { /* silent */ }
    setPendingImageChapterId(null);
  };

  return (
    <>
      {/* Book spines on desk */}
      <motion.div
        className="absolute flex gap-1"
        style={{ top: "28%", right: "5%", alignItems: "flex-end" }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {books.map((b, i) => (
          <motion.div
            key={b.id}
            className="cursor-pointer relative rounded-sm select-none"
            style={{
              width: 26,
              height: 110 + i * 15,
              background: b.spineColor,
              borderRight: "2px solid rgba(255,255,255,0.08)",
              boxShadow: "2px 4px 12px rgba(0,0,0,0.5), inset 1px 0 0 rgba(255,255,255,0.1)",
            }}
            whileHover={{ y: -12, scale: 1.05, boxShadow: "4px 12px 30px rgba(0,0,0,0.6)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onClick={() => { setOpenBookId(b.id); setView("read"); setAddingChapter(false); }}
            data-testid={`book-${b.id}`}
          >
            <div
              className="absolute font-serif font-bold"
              style={{ color: b.titleColor, fontSize: "8px", letterSpacing: "0.1em", writingMode: "vertical-rl", top: "50%", left: "50%", transform: "translate(-50%, -50%) rotate(180deg)", whiteSpace: "nowrap" }}
            >
              {b.title}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Book modal */}
      <AnimatePresence>
        {openBookId !== null && book && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", zIndex: 100 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBook}
            data-testid="book-modal-overlay"
          >
            <motion.div
              className="relative flex flex-col"
              style={{ width: 600, maxHeight: "82vh", background: "#f8f3e8", borderRadius: 6, boxShadow: "0 32px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={e => e.stopPropagation()}
              data-testid="book-modal"
            >
              {/* Spine strip */}
              <div className="absolute left-0 top-0 bottom-0" style={{ width: 18, background: book.spineColor, zIndex: 3 }} />

              {/* Header */}
              <div
                className="flex items-center justify-between shrink-0"
                style={{ marginLeft: 18, padding: "14px 18px 11px", borderBottom: "1px solid rgba(180,160,100,0.25)", background: "#f8f3e8", zIndex: 2 }}
              >
                <h2 className="font-serif text-xl font-bold" style={{ color: "#2a1a0a" }}>{book.title}</h2>
                <div className="flex gap-3 items-center">
                  <button
                    className="font-mono text-xs px-2.5 py-1 rounded transition-all"
                    style={{
                      background: addingChapter ? "#f0e8d0" : "transparent",
                      color: "#8b7355",
                      border: "1px solid rgba(180,160,100,0.35)",
                    }}
                    onClick={() => { setAddingChapter(v => !v); setView("read"); }}
                  >
                    {addingChapter ? "cancel" : "+ chapter"}
                  </button>
                  <button
                    className="font-mono text-xs px-2.5 py-1 rounded transition-all"
                    style={{
                      background: view === "index" ? book.spineColor : "transparent",
                      color: view === "index" ? book.titleColor : "#8b7355",
                      border: `1px solid ${view === "index" ? book.spineColor : "rgba(180,160,100,0.3)"}`,
                    }}
                    onClick={() => { setView(v => v === "index" ? "read" : "index"); setAddingChapter(false); }}
                  >
                    {view === "index" ? "reading" : "index"}
                  </button>
                  <button
                    className="font-mono text-sm hover:opacity-50 transition-opacity"
                    style={{ color: "#8b7355" }}
                    onClick={closeBook}
                    data-testid="book-close"
                  >
                    close
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1" style={{ marginLeft: 18 }}>

                {/* ADD CHAPTER FORM */}
                <AnimatePresence>
                  {addingChapter && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ padding: "16px 20px", borderBottom: "1px solid rgba(180,160,100,0.2)", background: "#f0e8d0", overflow: "hidden" }}
                    >
                      <div className="font-mono text-xs mb-3" style={{ color: "#b8966e", letterSpacing: "0.1em" }}>NEW CHAPTER</div>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Chapter heading..."
                        value={newHeading}
                        onChange={e => setNewHeading(e.target.value)}
                        className="w-full font-serif text-lg font-bold outline-none bg-transparent border-b mb-3"
                        style={{ color: "#2a1a0a", borderColor: "rgba(180,160,100,0.4)", paddingBottom: 6 }}
                      />
                      <textarea
                        placeholder="Write something..."
                        value={newBody}
                        onChange={e => setNewBody(e.target.value)}
                        rows={5}
                        className="w-full font-sans text-sm outline-none bg-transparent resize-none"
                        style={{ color: "#3a2a1a", lineHeight: 1.7 }}
                      />
                      <div className="flex justify-end mt-3 gap-2">
                        <button className="font-mono text-xs px-3 py-1.5 rounded hover:opacity-70" style={{ color: "#8b7355", border: "1px solid rgba(180,160,100,0.35)" }} onClick={() => { setAddingChapter(false); setNewHeading(""); setNewBody(""); }}>
                          cancel
                        </button>
                        <button
                          className="font-mono text-xs px-4 py-1.5 rounded hover:opacity-80"
                          style={{ background: book.spineColor, color: book.titleColor }}
                          onClick={addChapter}
                        >
                          add chapter
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* INDEX VIEW */}
                {view === "index" && !addingChapter && (
                  <div style={{ padding: "16px 20px 24px" }}>
                    <div className="font-mono text-xs mb-4" style={{ color: "#b8966e", letterSpacing: "0.1em" }}>TABLE OF CONTENTS</div>
                    {book.chapters.length === 0 && (
                      <div className="font-serif text-center py-8" style={{ color: "rgba(0,0,0,0.2)", fontStyle: "italic" }}>
                        No chapters yet. Add one above.
                      </div>
                    )}
                    {book.chapters.map((c, idx) => (
                      <motion.div
                        key={c.id}
                        className="flex items-start gap-3 py-3 group"
                        style={{ borderBottom: idx < book.chapters.length - 1 ? "1px solid rgba(180,160,100,0.15)" : "none" }}
                      >
                        <button
                          className="flex-1 text-left flex items-start gap-3"
                          onClick={() => scrollToChapter(c.id)}
                        >
                          <span className="font-mono shrink-0" style={{ color: "#c8a878", fontSize: "11px", marginTop: 3 }}>
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <div className="font-serif text-base font-bold group-hover:underline" style={{ color: "#2a1a0a" }}>{c.heading}</div>
                            <div className="font-mono text-xs mt-0.5" style={{ color: "#b8966e" }}>{c.date}</div>
                          </div>
                        </button>
                        <button
                          title="Delete chapter"
                          className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-lg leading-none hover:text-red-400 mt-0.5"
                          style={{ color: "#c8a878" }}
                          onClick={() => deleteChapter(c.id)}
                        >
                          ×
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* READING VIEW */}
                {view === "read" && !addingChapter && (
                  <div style={{ padding: "0 20px 28px" }}>
                    {book.chapters.length === 0 && (
                      <div className="font-serif text-center py-12" style={{ color: "rgba(0,0,0,0.2)", fontStyle: "italic" }}>
                        This book is empty. Add a chapter to begin.
                      </div>
                    )}
                    {book.chapters.map((chapter, idx) => (
                      <div
                        key={chapter.id}
                        ref={el => { if (el) chapterRefs.current.set(chapter.id, el); }}
                        className="group"
                        style={{ paddingTop: 24, paddingBottom: 24, borderBottom: idx < book.chapters.length - 1 ? "1px solid rgba(180,160,100,0.18)" : "none" }}
                      >
                        {/* Chapter header */}
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <div className="font-mono text-xs" style={{ color: "#b8966e" }}>{chapter.date}</div>
                            <h3 className="font-serif text-lg font-bold mt-0.5" style={{ color: "#2a1a0a", lineHeight: 1.25 }}>{chapter.heading}</h3>
                          </div>
                          <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">
                            <button
                              title="Add image"
                              className="font-mono text-xs px-2 py-0.5 rounded hover:opacity-70"
                              style={{ background: "rgba(180,160,100,0.2)", color: "#8b7355", border: "1px solid rgba(180,160,100,0.3)" }}
                              onClick={() => triggerImageUpload(chapter.id)}
                            >
                              + img
                            </button>
                            <button
                              title="Delete chapter"
                              className="font-mono text-lg leading-none hover:text-red-400"
                              style={{ color: "#c8a878" }}
                              onClick={() => deleteChapter(chapter.id)}
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        {/* Content blocks */}
                        <div className="mt-3">
                          {chapter.blocks.map(block => (
                            <div key={block.id} className="mb-3 relative group/block">
                              {block.type === "text" ? (
                                <p className="font-sans text-sm leading-relaxed" style={{ color: "#3a2a1a", whiteSpace: "pre-line" }}>{block.value}</p>
                              ) : (
                                <div className="relative">
                                  <img
                                    src={block.value}
                                    alt="chapter image"
                                    className="rounded-sm w-full"
                                    style={{ maxHeight: 280, objectFit: "contain", boxShadow: "0 2px 12px rgba(0,0,0,0.12)", background: "rgba(0,0,0,0.04)" }}
                                  />
                                  <button
                                    className="absolute top-2 right-2 rounded-full flex items-center justify-center text-white opacity-0 group-hover/block:opacity-100 transition-opacity hover:scale-110"
                                    style={{ width: 22, height: 22, background: "rgba(220,40,40,0.85)", fontSize: "14px", lineHeight: 1 }}
                                    onClick={() => deleteBlock(chapter.id, block.id)}
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
