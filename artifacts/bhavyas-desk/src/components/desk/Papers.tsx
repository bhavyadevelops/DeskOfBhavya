import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAPERS = [
  {
    id: 1,
    title: "Startup Idea: LocalMesh",
    preview: "Edge-first networking where your devices form their own mesh...",
    rotation: -6,
    x: "25%",
    y: "58%",
    body: `What if your devices didn't need to talk to a server in another country to talk to each other in the same room?

LocalMesh is an edge-first networking layer that makes nearby devices form ad-hoc mesh networks for low-latency communication. Your phone and laptop in the same room should be able to sync at local network speeds — not round-trip to AWS and back.

The architecture: each device runs a lightweight daemon that discovers peers via mDNS/DNS-SD, negotiates E2E encrypted tunnels using WireGuard, and maintains a distributed routing table using modified BATMAN-IV.

The killer use case: offline-first collaborative apps. Two people working on the same document in a coffee shop with spotty WiFi shouldn't need to be online to collaborate.

Current status: PoC built in Go. 8ms round-trip between devices on the same LAN vs 200ms via cloud. The performance case is obvious.

Next step: figure out NAT traversal for when devices are on different networks.`,
  },
  {
    id: 2,
    title: "On Building in Public",
    preview: "The most terrifying thing I've done as a builder is ship something I wasn't sure about...",
    rotation: 4,
    x: "40%",
    y: "62%",
    body: `The most terrifying thing I've done as a builder is ship something I wasn't sure about and tell people about it.

Not because of the failure risk — I've shipped things privately that failed catastrophically and nobody cared. The terror is the vulnerability. Saying "I built this" means "I thought this was worth building."

But building in public is the fastest feedback loop that exists. Every follower is a potential user. Every reply is a data point. Every roast is information you couldn't have paid for.

I've learned more from Twitter threads about my projects than from any retrospective meeting.

The rule I've settled on: build in public early enough that failure is cheap, late enough that there's something real to react to. That window is usually right after you have a demo that works, not after you have a product that's ready.

"Ready" is a moving target. "Working demo" is a timestamp.`,
  },
  {
    id: 3,
    title: "Why I Write Code",
    preview: "There's a specific feeling when code you wrote does something you didn't expect...",
    rotation: -2,
    x: "52%",
    y: "62%",
    body: `There's a specific feeling when code you wrote does something you didn't expect — not a bug, but an emergent behavior. Something that falls out of the logic you specified and turns out to be more interesting than what you meant.

I write code because it's the only medium where that happens.

You can't accidentally invent a new word in prose. You can't accidentally discover a new melody in music. But in code, you can write rules and discover behaviors. The gap between specification and execution is where interesting things live.

I'm also drawn to code because it's honest. A program either works or it doesn't. You can argue about whether a paragraph is good writing forever. You cannot argue about whether the function returns the right value.

There's something clarifying about working in a medium where reality has the final say.

The debugging sessions that break me are also the ones that teach me the most. Every mysterious failure is a gap in my mental model of how the computer works. Closing that gap is a small, reliable form of intellectual progress.

That reliability is rare. Most learning is fuzzy. Debugging is precise.`,
  },
];

export default function Papers() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      {PAPERS.map((paper) => (
        <motion.div
          key={paper.id}
          className="absolute cursor-pointer select-none"
          style={{ left: paper.x, top: paper.y }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + paper.id * 0.1, duration: 0.5 }}
          whileHover={{
            y: -8,
            scale: 1.04,
            rotate: 0,
            boxShadow: "6px 12px 30px rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
          onClick={() => setSelected(paper.id)}
          data-testid={`paper-${paper.id}`}
        >
          <div
            className="rounded-sm"
            style={{
              width: 120,
              padding: "12px 12px 16px",
              background: "linear-gradient(160deg, #faf6ec 0%, #f5eedc 100%)",
              rotate: paper.rotation,
              boxShadow: "2px 4px 16px rgba(0,0,0,0.35)",
              border: "1px solid rgba(180,160,100,0.3)",
            }}
          >
            {/* Ruled lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-full"
                style={{ height: 1, background: "rgba(150,120,60,0.15)", marginBottom: 7 }}
              />
            ))}

            <div
              className="font-serif font-bold leading-tight mb-1.5"
              style={{ color: "#2a1a0a", fontSize: "9px" }}
            >
              {paper.title}
            </div>
            <div
              className="font-sans leading-snug"
              style={{ color: "#6a4a2a", fontSize: "7.5px", opacity: 0.8 }}
            >
              {paper.preview}
            </div>
            <div
              className="font-mono mt-2"
              style={{ color: "rgba(180,140,60,0.5)", fontSize: "6px" }}
            >
              click to read
            </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            data-testid="paper-modal-overlay"
          >
            <motion.div
              className="relative rounded-sm"
              style={{
                width: 480,
                maxHeight: "70vh",
                background: "linear-gradient(160deg, #faf6ec 0%, #f0e8d0 100%)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                padding: "32px 36px",
                overflowY: "auto",
                border: "1px solid rgba(180,160,100,0.4)",
              }}
              initial={{ scale: 0.85, y: 40, rotate: -3 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.85, y: 40, rotate: 3 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={e => e.stopPropagation()}
              data-testid="paper-modal"
            >
              {/* Ruled lines in background */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-8 right-8"
                  style={{ top: 32 + i * 26, height: 1, background: "rgba(150,120,60,0.12)" }}
                />
              ))}

              {PAPERS.filter(p => p.id === selected).map(p => (
                <div key={p.id} className="relative z-10">
                  <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#2a1a0a" }}>
                    {p.title}
                  </h2>
                  <div className="font-mono text-xs mb-4" style={{ color: "#b8966e" }}>
                    Bhavya's Desk — Notes
                  </div>
                  <p className="font-sans text-sm leading-loose whitespace-pre-line" style={{ color: "#3a2a1a" }}>
                    {p.body}
                  </p>
                </div>
              ))}

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 font-mono text-xs hover:opacity-60 transition-opacity"
                style={{ color: "#8b7355" }}
                data-testid="paper-close"
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
