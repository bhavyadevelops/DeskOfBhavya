import { useState, useRef } from "react";
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

const BOOKS: Book[] = [
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

export default function Books() {
  const [openBookId, setOpenBookId] = useState<number | null>(null);
  const [view, setView] = useState<"read" | "index">("read");
  const chapterRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const book = BOOKS.find(b => b.id === openBookId) ?? null;

  const closeBook = () => {
    setOpenBookId(null);
    setView("read");
  };

  const scrollToChapter = (chapterId: number) => {
    setView("read");
    setTimeout(() => {
      chapterRefs.current.get(chapterId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
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
        {BOOKS.map((b, i) => (
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
            onClick={() => { setOpenBookId(b.id); setView("read"); }}
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
              style={{ width: 580, maxHeight: "80vh", background: "#f8f3e8", borderRadius: 6, boxShadow: "0 32px 80px rgba(0,0,0,0.6)", overflow: "hidden" }}
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
                      background: view === "index" ? book.spineColor : "transparent",
                      color: view === "index" ? book.titleColor : "#8b7355",
                      border: `1px solid ${view === "index" ? book.spineColor : "rgba(180,160,100,0.3)"}`,
                    }}
                    onClick={() => setView(v => v === "index" ? "read" : "index")}
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

                {/* INDEX VIEW */}
                {view === "index" && (
                  <div style={{ padding: "16px 20px 24px" }}>
                    <div className="font-mono text-xs mb-4" style={{ color: "#b8966e", letterSpacing: "0.1em" }}>TABLE OF CONTENTS</div>
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
                        <div>
                          <div className="font-serif text-base font-bold group-hover:underline" style={{ color: "#2a1a0a" }}>{c.heading}</div>
                          <div className="font-mono text-xs mt-0.5" style={{ color: "#b8966e" }}>{c.date}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* READING VIEW */}
                {view === "read" && (
                  <div style={{ padding: "0 20px 28px" }}>
                    {book.chapters.map((chapter, idx) => (
                      <div
                        key={chapter.id}
                        ref={el => { if (el) chapterRefs.current.set(chapter.id, el); }}
                        style={{ paddingTop: 24, paddingBottom: 24, borderBottom: idx < book.chapters.length - 1 ? "1px solid rgba(180,160,100,0.18)" : "none" }}
                      >
                        <div className="font-mono text-xs mb-1" style={{ color: "#b8966e" }}>{chapter.date}</div>
                        <h3 className="font-serif text-lg font-bold mb-3" style={{ color: "#2a1a0a", lineHeight: 1.25 }}>{chapter.heading}</h3>
                        {chapter.blocks.map(block => (
                          <div key={block.id} className="mb-3">
                            {block.type === "text" ? (
                              <p className="font-sans text-sm leading-relaxed" style={{ color: "#3a2a1a", whiteSpace: "pre-line" }}>{block.value}</p>
                            ) : (
                              <img src={block.value} alt="chapter image" className="rounded-sm w-full" style={{ maxHeight: 260, objectFit: "cover", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }} />
                            )}
                          </div>
                        ))}
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
