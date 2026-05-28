import { useState, useRef, useCallback } from "react";
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
  bookmarked: boolean;
}

interface Book {
  id: number;
  spineColor: string;
  titleColor: string;
  title: string;
  chapters: Chapter[];
}

function makeTextBlock(value: string, id: number): ContentBlock {
  return { id, type: "text", value };
}

const INITIAL_BOOKS: Book[] = [
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
        bookmarked: false,
        blocks: [makeTextBlock(`Every system I've built has taught me the same thing: simplicity is the hardest thing to achieve. Not simplicity of appearance — that's easy with good design — but simplicity of mechanism.\n\nWhen I built QuantumDB's consensus layer, I spent three weeks making it correct, and three months making it simple. The simple version was the one that actually worked under chaos testing.\n\nThe temptation is always to add — another abstraction, another config flag, another edge case handler. The discipline is knowing when the right answer is to remove.`, 10)],
      },
      {
        id: 2,
        heading: "What Distributed Systems Taught Me About People",
        date: "April 2024",
        bookmarked: false,
        blocks: [makeTextBlock(`A distributed system assumes its nodes will fail. It doesn't panic when one goes down — it routes around it, keeps consensus, maintains availability.\n\nI think the best teams work this way too. Single points of failure are architectural mistakes in both systems and organizations.\n\nThe healthiest codebase I've ever worked in was the one where any engineer could be hit by a bus tomorrow and the project would still ship. Not because people were replaceable, but because knowledge was distributed.`, 11)],
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
        bookmarked: false,
        blocks: [makeTextBlock(`Every day I use tools that were built 30 years ago for a world that no longer exists. TCP/IP assumptions, DNS architecture, TLS handshakes — brilliant for their era, increasingly hostile to the things we're trying to build.\n\nI think the next decade belongs to whoever rebuilds the foundational layer. Not with blockchain hype or AI buzzwords — but with boring, rigorous engineering that makes the defaults better.\n\nLocalMesh is my attempt at one small part of this. Edge-first networking where the architecture assumes the cloud is optional, not central.`, 12)],
      },
      {
        id: 2,
        heading: "Why I Write Open Source",
        date: "January 2024",
        bookmarked: false,
        blocks: [makeTextBlock(`Not for the GitHub stars. Not for the resume line.\n\nI write open source because it's the only software that gets genuinely reviewed. Corporate code lives behind walls. Open source code lives in public, and the public is ruthless.\n\nEvery issue filed is someone who cared enough to report it. Every PR is someone who cared enough to fix it. The collaborative surface of open source is the closest thing to a peer-reviewed journal that software has.\n\nI want my work reviewed.`, 13)],
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
        bookmarked: false,
        blocks: [makeTextBlock(`1. Premature optimization is real, but so is premature abstraction. I've shipped more bugs from over-engineering than from under-engineering.\n\n2. The best commit message is a short story. "Fix bug" is a confession; "Prevent race condition in cache invalidation when..." is documentation.\n\n3. Sleep is not optional. I spent a week debugging a heisenbug that disappeared after I slept on it. Literally. The bug was in my mental model, not the code.\n\n4. Write the test first not because it's correct dogma but because it forces you to think about the interface before the implementation.`, 14)],
      },
      {
        id: 2,
        heading: "On Curiosity as a Career Strategy",
        date: "May 2024",
        bookmarked: false,
        blocks: [makeTextBlock(`Every interesting project I've worked on started with a question I couldn't stop thinking about.\n\nQuantumDB: "How does Raft actually work? Could I implement it?"\nNeural Canvas: "What if artists could describe texture the same way they describe emotion?"\nDrift: "Why does real-time collaboration still feel like magic instead of just working?"\n\nThe questions weren't strategic. They were just genuinely interesting to me. The strategy came later, after the work existed.\n\nIf you're looking for the secret to building interesting things: cultivate better questions.`, 15)],
      },
    ],
  },
];

let nextId = 200;

export default function Books() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [openBookId, setOpenBookId] = useState<number | null>(null);
  const [view, setView] = useState<"read" | "index">("read");
  const [addingChapter, setAddingChapter] = useState(false);
  const [newHeading, setNewHeading] = useState("");
  const [newBody, setNewBody] = useState("");
  const [pendingImageChapterId, setPendingImageChapterId] = useState<number | null>(null);
  const [pendingImageAfterBlockId, setPendingImageAfterBlockId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chapterRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const book = books.find(b => b.id === openBookId) ?? null;
  const bookmarkedCount = book ? book.chapters.filter(c => c.bookmarked).length : 0;

  const openBook = (id: number) => {
    setOpenBookId(id);
    setView("read");
    setAddingChapter(false);
    setNewHeading("");
    setNewBody("");
  };

  const closeBook = () => {
    setOpenBookId(null);
    setView("read");
    setAddingChapter(false);
  };

  const mutateBook = useCallback((updater: (b: Book) => Book) => {
    setBooks(prev => prev.map(b => b.id === openBookId ? updater(b) : b));
  }, [openBookId]);

  const toggleBookmark = (chapterId: number) => {
    mutateBook(b => ({
      ...b,
      chapters: b.chapters.map(c =>
        c.id === chapterId ? { ...c, bookmarked: !c.bookmarked } : c
      ),
    }));
  };

  const deleteChapter = (chapterId: number) => {
    mutateBook(b => ({ ...b, chapters: b.chapters.filter(c => c.id !== chapterId) }));
  };

  const addChapter = () => {
    if (!newHeading.trim()) return;
    const chapter: Chapter = {
      id: nextId++,
      heading: newHeading.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      blocks: newBody.trim() ? [makeTextBlock(newBody.trim(), nextId++)] : [],
      bookmarked: false,
    };
    mutateBook(b => ({ ...b, chapters: [...b.chapters, chapter] }));
    setNewHeading("");
    setNewBody("");
    setAddingChapter(false);
  };

  const scrollToChapter = (chapterId: number) => {
    setView("read");
    setTimeout(() => {
      const el = chapterRefs.current.get(chapterId);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const triggerImageUpload = (chapterId: number, afterBlockId: number | null) => {
    setPendingImageChapterId(chapterId);
    setPendingImageAfterBlockId(afterBlockId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || pendingImageChapterId === null) return;
    const url = URL.createObjectURL(file);
    const newBlock: ContentBlock = { id: nextId++, type: "image", value: url };

    mutateBook(b => ({
      ...b,
      chapters: b.chapters.map(c => {
        if (c.id !== pendingImageChapterId) return c;
        if (pendingImageAfterBlockId === null) {
          return { ...c, blocks: [...c.blocks, newBlock] };
        }
        const idx = c.blocks.findIndex(bl => bl.id === pendingImageAfterBlockId);
        const updated = [...c.blocks];
        updated.splice(idx + 1, 0, newBlock);
        return { ...c, blocks: updated };
      }),
    }));

    setPendingImageChapterId(null);
    setPendingImageAfterBlockId(null);
    e.target.value = "";
  };

  const deleteBlock = (chapterId: number, blockId: number) => {
    mutateBook(b => ({
      ...b,
      chapters: b.chapters.map(c =>
        c.id === chapterId ? { ...c, blocks: c.blocks.filter(bl => bl.id !== blockId) } : c
      ),
    }));
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
            onClick={() => openBook(b.id)}
            data-testid={`book-${b.id}`}
          >
            <div
              className="absolute font-serif font-bold"
              style={{
                color: b.titleColor,
                fontSize: "8px",
                letterSpacing: "0.1em",
                writingMode: "vertical-rl",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(180deg)",
                whiteSpace: "nowrap",
              }}
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
              style={{
                width: 600,
                maxHeight: "80vh",
                background: "#f8f3e8",
                borderRadius: 6,
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                overflow: "hidden",
              }}
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
                style={{
                  marginLeft: 18,
                  padding: "14px 18px 11px",
                  borderBottom: "1px solid rgba(180,160,100,0.25)",
                  background: "#f8f3e8",
                  zIndex: 2,
                }}
              >
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-xl font-bold" style={{ color: "#2a1a0a" }}>
                    {book.title}
                  </h2>
                  {bookmarkedCount > 0 && (
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded"
                      style={{ background: book.spineColor + "33", color: book.spineColor, fontSize: "9px" }}
                    >
                      {bookmarkedCount} bookmarked
                    </span>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <button
                    className="font-mono text-xs px-2.5 py-1 rounded transition-all"
                    style={{
                      background: view === "index" ? book.spineColor : "transparent",
                      color: view === "index" ? book.titleColor : "#8b7355",
                      border: `1px solid ${view === "index" ? book.spineColor : "rgba(180,160,100,0.3)"}`,
                    }}
                    onClick={() => setView(v => v === "index" ? "read" : "index")}
                  >
                    {view === "index" ? "reading" : "index"}
                  </button>
                  <button
                    className="font-mono text-xs px-2.5 py-1 rounded transition-all hover:opacity-80"
                    style={{ background: book.spineColor, color: book.titleColor }}
                    onClick={() => { setAddingChapter(v => !v); setView("read"); }}
                  >
                    {addingChapter ? "cancel" : "+ chapter"}
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

              {/* Content area */}
              <div ref={scrollAreaRef} className="overflow-y-auto flex-1" style={{ marginLeft: 18 }}>

                {/* INDEX VIEW */}
                {view === "index" && (
                  <div style={{ padding: "16px 20px 24px" }}>
                    <div className="font-mono text-xs mb-4" style={{ color: "#b8966e", letterSpacing: "0.1em" }}>TABLE OF CONTENTS</div>
                    {book.chapters.length === 0 && (
                      <div className="font-serif text-center py-8" style={{ color: "rgba(139,115,85,0.4)" }}>
                        No chapters yet.
                      </div>
                    )}
                    {book.chapters.map((c, idx) => (
                      <motion.button
                        key={c.id}
                        className="w-full text-left flex items-start gap-3 py-3 group"
                        style={{ borderBottom: idx < book.chapters.length - 1 ? "1px solid rgba(180,160,100,0.15)" : "none" }}
                        onClick={() => scrollToChapter(c.id)}
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <span className="font-mono shrink-0" style={{ color: "#c8a878", fontSize: "11px", marginTop: 3 }}>
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1">
                          <div className="font-serif text-base font-bold group-hover:underline" style={{ color: "#2a1a0a" }}>
                            {c.heading}
                          </div>
                          <div className="font-mono text-xs mt-0.5" style={{ color: "#b8966e" }}>{c.date}</div>
                        </div>
                        {c.bookmarked && (
                          <span style={{ color: book.spineColor, fontSize: "14px" }}>🔖</span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* READING VIEW */}
                {view === "read" && (
                  <div style={{ padding: "0 20px 28px" }}>
                    {/* Add chapter form */}
                    <AnimatePresence>
                      {addingChapter && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: "hidden", borderBottom: "1px solid rgba(180,160,100,0.25)", paddingTop: 16, paddingBottom: 16, marginBottom: 8 }}
                        >
                          <div className="font-mono text-xs mb-3" style={{ color: "#b8966e" }}>new chapter</div>
                          <input
                            type="text"
                            placeholder="Chapter heading"
                            value={newHeading}
                            onChange={e => setNewHeading(e.target.value)}
                            className="w-full font-serif text-base outline-none mb-3 bg-transparent border-b"
                            style={{ color: "#2a1a0a", borderColor: "rgba(180,160,100,0.4)", paddingBottom: 6 }}
                          />
                          <textarea
                            placeholder="Write your thoughts here..."
                            value={newBody}
                            onChange={e => setNewBody(e.target.value)}
                            rows={4}
                            className="w-full font-sans text-sm outline-none bg-transparent resize-none"
                            style={{ color: "#3a2a1a", lineHeight: 1.7, borderBottom: "1px solid rgba(180,160,100,0.18)", paddingBottom: 8 }}
                          />
                          <div className="flex gap-3 mt-3">
                            <button
                              className="font-mono text-xs px-4 py-1.5 rounded hover:opacity-80 transition-opacity"
                              style={{ background: book.spineColor, color: book.titleColor }}
                              onClick={addChapter}
                            >
                              save chapter
                            </button>
                            <button
                              className="font-mono text-xs hover:opacity-50 transition-opacity"
                              style={{ color: "#8b7355" }}
                              onClick={() => setAddingChapter(false)}
                            >
                              discard
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {book.chapters.length === 0 && !addingChapter && (
                      <div className="font-serif text-center py-12" style={{ color: "rgba(139,115,85,0.4)", fontSize: "14px" }}>
                        No chapters yet. Add one above.
                      </div>
                    )}

                    {book.chapters.map((chapter, idx) => (
                      <div
                        key={chapter.id}
                        ref={el => { if (el) chapterRefs.current.set(chapter.id, el); }}
                        style={{
                          paddingTop: 24,
                          paddingBottom: 24,
                          borderBottom: idx < book.chapters.length - 1 ? "1px solid rgba(180,160,100,0.18)" : "none",
                        }}
                      >
                        {/* Chapter header row */}
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-mono text-xs" style={{ color: "#b8966e" }}>
                            {chapter.date}
                          </div>
                          <div className="flex items-center gap-3">
                            {/* Bookmark */}
                            <button
                              onClick={() => toggleBookmark(chapter.id)}
                              className="transition-all hover:scale-110"
                              title={chapter.bookmarked ? "Remove bookmark" : "Bookmark"}
                              style={{ fontSize: "14px", opacity: chapter.bookmarked ? 1 : 0.3 }}
                            >
                              🔖
                            </button>
                            {/* Add image */}
                            <button
                              onClick={() => triggerImageUpload(chapter.id, chapter.blocks.length > 0 ? chapter.blocks[chapter.blocks.length - 1].id : null)}
                              className="font-mono text-xs hover:opacity-70 transition-opacity"
                              style={{ color: "#b8966e" }}
                              title="Add image to this chapter"
                            >
                              + img
                            </button>
                            {/* Delete chapter */}
                            <button
                              onClick={() => deleteChapter(chapter.id)}
                              className="font-mono text-xs hover:opacity-60 transition-opacity"
                              style={{ color: "#c0a080" }}
                              data-testid={`delete-chapter-${chapter.id}`}
                            >
                              delete
                            </button>
                          </div>
                        </div>

                        <h3 className="font-serif text-lg font-bold mb-3" style={{ color: "#2a1a0a", lineHeight: 1.25 }}>
                          {chapter.heading}
                        </h3>

                        {/* Content blocks */}
                        {chapter.blocks.map((block, bIdx) => (
                          <div key={block.id} className="relative group mb-3">
                            {block.type === "text" ? (
                              <p className="font-sans text-sm leading-relaxed" style={{ color: "#3a2a1a", whiteSpace: "pre-line" }}>
                                {block.value}
                              </p>
                            ) : (
                              <div className="relative">
                                <img
                                  src={block.value}
                                  alt="chapter image"
                                  className="rounded-sm w-full"
                                  style={{ maxHeight: 260, objectFit: "cover", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
                                />
                                <button
                                  onClick={() => deleteBlock(chapter.id, block.id)}
                                  className="absolute top-2 right-2 rounded-full font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  style={{
                                    background: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    width: 22,
                                    height: 22,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  title="Remove image"
                                >
                                  ×
                                </button>
                              </div>
                            )}

                            {/* Insert image after this block */}
                            <div className="flex justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => triggerImageUpload(chapter.id, block.id)}
                                className="font-mono text-xs rounded-full px-3 py-0.5 transition-all hover:opacity-80"
                                style={{
                                  background: "rgba(180,160,100,0.15)",
                                  color: "#b8966e",
                                  border: "1px dashed rgba(180,160,100,0.4)",
                                  fontSize: "9px",
                                }}
                              >
                                insert image here
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Add image at end if no blocks or last block is text */}
                        {(chapter.blocks.length === 0 || chapter.blocks[chapter.blocks.length - 1].type === "text") && (
                          <button
                            onClick={() => triggerImageUpload(chapter.id, chapter.blocks.length > 0 ? chapter.blocks[chapter.blocks.length - 1].id : null)}
                            className="font-mono text-xs mt-2 rounded-sm px-3 py-1.5 w-full transition-all hover:opacity-80"
                            style={{
                              background: "rgba(180,160,100,0.08)",
                              color: "#b8966e",
                              border: "1px dashed rgba(180,160,100,0.3)",
                              fontSize: "9px",
                            }}
                          >
                            + add image to chapter
                          </button>
                        )}
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
