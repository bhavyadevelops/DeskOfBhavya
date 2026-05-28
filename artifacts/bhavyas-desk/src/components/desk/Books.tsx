import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOKS = [
  {
    id: 1,
    spineColor: "#1e3a6e",
    titleColor: "#a8c5e8",
    title: "Systems",
    pages: [
      {
        heading: "On Building at Scale",
        date: "March 2024",
        body: `Every system I've built has taught me the same thing: simplicity is the hardest thing to achieve. Not simplicity of appearance — that's easy with good design — but simplicity of mechanism.

When I built QuantumDB's consensus layer, I spent three weeks making it correct, and three months making it simple. The simple version was the one that actually worked under chaos testing.

The temptation is always to add — another abstraction, another config flag, another edge case handler. The discipline is knowing when the right answer is to remove.`,
      },
      {
        heading: "What Distributed Systems Taught Me About People",
        date: "April 2024",
        body: `A distributed system assumes its nodes will fail. It doesn't panic when one goes down — it routes around it, keeps consensus, maintains availability.

I think the best teams work this way too. Single points of failure are architectural mistakes in both systems and organizations.

The healthiest codebase I've ever worked in was the one where any engineer could be hit by a bus tomorrow and the project would still ship. Not because people were replaceable, but because knowledge was distributed.`,
      },
    ],
  },
  {
    id: 2,
    spineColor: "#1e4a2e",
    titleColor: "#a8e6b0",
    title: "Ideas",
    pages: [
      {
        heading: "The Internet Deserves Better Infrastructure",
        date: "February 2024",
        body: `Every day I use tools that were built 30 years ago for a world that no longer exists. TCP/IP assumptions, DNS architecture, TLS handshakes — brilliant for their era, increasingly hostile to the things we're trying to build.

I think the next decade belongs to whoever rebuilds the foundational layer. Not with blockchain hype or AI buzzwords — but with boring, rigorous engineering that makes the defaults better.

LocalMesh is my attempt at one small part of this. Edge-first networking where the architecture assumes the cloud is optional, not central.`,
      },
      {
        heading: "Why I Write Open Source",
        date: "January 2024",
        body: `Not for the GitHub stars. Not for the resume line.

I write open source because it's the only software that gets genuinely reviewed. Corporate code lives behind walls. Open source code lives in public, and the public is ruthless.

Every issue filed is someone who cared enough to report it. Every PR is someone who cared enough to fix it. The collaborative surface of open source is the closest thing to a peer-reviewed journal that software has.

I want my work reviewed.`,
      },
    ],
  },
  {
    id: 3,
    spineColor: "#6e1e1e",
    titleColor: "#f4a0a0",
    title: "Journal",
    pages: [
      {
        heading: "Things I Learned the Hard Way",
        date: "May 2024",
        body: `1. Premature optimization is real, but so is premature abstraction. I've shipped more bugs from over-engineering than from under-engineering.

2. The best commit message is a short story. "Fix bug" is a confession; "Prevent race condition in cache invalidation when..." is documentation.

3. Sleep is not optional. I spent a week debugging a heisenbug that disappeared after I slept on it. Literally. The bug was in my mental model, not the code.

4. Write the test first not because it's correct dogma but because it forces you to think about the interface before the implementation.`,
      },
      {
        heading: "On Curiosity as a Career Strategy",
        date: "May 2024",
        body: `Every interesting project I've worked on started with a question I couldn't stop thinking about.

QuantumDB: "How does Raft actually work? Could I implement it?"
Neural Canvas: "What if artists could describe texture the same way they describe emotion?"
Drift: "Why does real-time collaboration still feel like magic instead of just working?"

The questions weren't strategic. They were just genuinely interesting to me. The strategy came later, after the work existed.

If you're looking for the secret to building interesting things: cultivate better questions.`,
      },
    ],
  },
];

export default function Books() {
  const [openBook, setOpenBook] = useState<number | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageDir, setPageDir] = useState(1);

  const book = BOOKS.find(b => b.id === openBook);

  const navigatePage = (dir: number) => {
    if (!book) return;
    const next = pageIndex + dir;
    if (next < 0 || next >= book.pages.length) return;
    setPageDir(dir);
    setPageIndex(next);
  };

  const openBookHandler = (id: number) => {
    setOpenBook(id);
    setPageIndex(0);
  };

  return (
    <>
      <motion.div
        className="absolute flex gap-1"
        style={{ top: "30%", right: "5%", alignItems: "flex-end" }}
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
            onClick={() => openBookHandler(b.id)}
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

      <AnimatePresence>
        {openBook !== null && book && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenBook(null)}
            data-testid="book-modal-overlay"
          >
            <motion.div
              className="relative rounded-sm overflow-hidden"
              style={{
                width: 480,
                height: 360,
                background: "#f8f3e8",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              }}
              initial={{ scale: 0.8, rotateY: -20 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={e => e.stopPropagation()}
              data-testid="book-modal"
            >
              {/* Spine strip */}
              <div
                className="absolute left-0 top-0 bottom-0"
                style={{ width: 24, background: book.spineColor }}
              />

              {/* Page content */}
              <AnimatePresence mode="wait" custom={pageDir}>
                <motion.div
                  key={pageIndex}
                  custom={pageDir}
                  initial={{ opacity: 0, x: pageDir > 0 ? 60 : -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: pageDir > 0 ? -60 : 60 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0"
                  style={{ left: 24, padding: "28px 28px 48px" }}
                >
                  {/* Ruled lines */}
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-12 right-6"
                      style={{ top: 28 + i * 22, height: 1, background: "rgba(180,160,100,0.2)" }}
                    />
                  ))}

                  <div className="relative z-10">
                    <div className="font-mono text-xs mb-1" style={{ color: "#b8966e" }}>
                      {book.pages[pageIndex].date}
                    </div>
                    <h2 className="font-serif text-xl font-bold mb-3" style={{ color: "#2a1a0a", lineHeight: 1.2 }}>
                      {book.pages[pageIndex].heading}
                    </h2>
                    <p
                      className="font-sans text-sm leading-relaxed"
                      style={{ color: "#3a2a1a", whiteSpace: "pre-line" }}
                    >
                      {book.pages[pageIndex].body}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Page navigation */}
              <div
                className="absolute bottom-0 left-6 right-0 flex items-center justify-between"
                style={{ padding: "10px 16px", borderTop: "1px solid rgba(180,160,100,0.3)" }}
              >
                <button
                  onClick={() => navigatePage(-1)}
                  disabled={pageIndex === 0}
                  className="font-mono text-sm disabled:opacity-20 hover:opacity-80 transition-opacity"
                  style={{ color: "#8b7355" }}
                  data-testid="book-prev"
                >
                  ‹ prev
                </button>
                <div className="font-mono text-xs" style={{ color: "#b8966e" }}>
                  {pageIndex + 1} / {book.pages.length}
                </div>
                <button
                  onClick={() => navigatePage(1)}
                  disabled={pageIndex === book.pages.length - 1}
                  className="font-mono text-sm disabled:opacity-20 hover:opacity-80 transition-opacity"
                  style={{ color: "#8b7355" }}
                  data-testid="book-next"
                >
                  next ›
                </button>
              </div>

              <button
                onClick={() => setOpenBook(null)}
                className="absolute top-3 right-3 font-mono text-xs hover:opacity-60 transition-opacity"
                style={{ color: "#8b7355" }}
                data-testid="book-close"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
