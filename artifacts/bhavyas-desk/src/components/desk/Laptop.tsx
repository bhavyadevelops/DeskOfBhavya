import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECTS = [
  {
    id: 1,
    name: "Neural Canvas",
    desc: "An AI-powered generative art platform that turns text prompts into cinematic, layered visual compositions. Built for artists who want to explore machine creativity.",
    stack: ["Python", "PyTorch", "React", "WebGL"],
    github: "https://github.com/bhavya/neural-canvas",
    demo: "https://neuralcanvas.app",
    accent: "#7c3aed",
  },
  {
    id: 2,
    name: "QuantumDB",
    desc: "A distributed key-value store implementing the Raft consensus algorithm from scratch. Achieves sub-millisecond reads with strong consistency guarantees across 5-node clusters.",
    stack: ["Go", "gRPC", "Raft", "RocksDB"],
    github: "https://github.com/bhavya/quantumdb",
    demo: null,
    accent: "#0891b2",
  },
  {
    id: 3,
    name: "Drift",
    desc: "A real-time collaborative design tool with multiplayer cursors, component versioning, and a constraint-based layout engine. Think Figma but open source.",
    stack: ["TypeScript", "WebSockets", "Canvas API", "CRDTs"],
    github: "https://github.com/bhavya/drift",
    demo: "https://drift.design",
    accent: "#059669",
  },
  {
    id: 4,
    name: "Atlas",
    desc: "A geospatial SaaS platform for logistics teams to visualize delivery routes, optimize last-mile delivery, and run fleet analytics on live GPS data.",
    stack: ["Next.js", "Mapbox", "PostgreSQL", "TimescaleDB"],
    github: "https://github.com/bhavya/atlas",
    demo: "https://atlas-logistics.io",
    accent: "#d97706",
  },
];

export default function Laptop() {
  const [open, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [direction, setDirection] = useState(1);

  const navigate = (dir: number) => {
    setDirection(dir);
    setActiveProject(p => (p + dir + PROJECTS.length) % PROJECTS.length);
  };

  const proj = PROJECTS[activeProject];

  return (
    <>
      <motion.div
        className="absolute cursor-pointer"
        style={{ top: "30%", left: "24%" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        onClick={() => !open && setOpen(true)}
        data-testid="laptop"
      >
        {/* Laptop body — perspective view */}
        <div style={{ perspective: 600 }}>
          {/* Screen lid */}
          <motion.div
            animate={{ rotateX: open ? -82 : 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{
              transformOrigin: "bottom center",
              width: 240,
              height: open ? 160 : 8,
              background: open
                ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
                : "linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)",
              borderRadius: "8px 8px 0 0",
              overflow: "hidden",
              boxShadow: open
                ? "0 -4px 30px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.05)"
                : "none",
              position: "relative",
            }}
          >
            {open && (
              <div className="absolute inset-0 flex flex-col" style={{ padding: "12px" }}>
                {/* Screen header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: "#ffbd2e" }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: "#28c940" }} />
                  </div>
                  <div className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}>
                    bhavya — projects
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                    className="font-mono text-xs hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)", fontSize: "8px" }}
                    data-testid="laptop-close"
                  >
                    esc
                  </button>
                </div>

                {/* Project content */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={proj.id}
                    custom={direction}
                    initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex-1 flex flex-col"
                  >
                    <div
                      className="w-full rounded-sm mb-1.5"
                      style={{ height: 3, background: proj.accent }}
                    />
                    <div
                      className="font-serif font-bold leading-tight"
                      style={{ color: "#fff", fontSize: "13px" }}
                    >
                      {proj.name}
                    </div>
                    <div
                      className="font-sans mt-1 leading-snug"
                      style={{ color: "rgba(255,255,255,0.65)", fontSize: "7.5px", flex: 1 }}
                    >
                      {proj.desc}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.stack.map(t => (
                        <span
                          key={t}
                          className="font-mono rounded-sm px-1"
                          style={{
                            fontSize: "6px",
                            background: `${proj.accent}33`,
                            color: proj.accent,
                            border: `1px solid ${proj.accent}55`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1.5">
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="font-mono hover:text-white transition-colors"
                        style={{ color: "rgba(255,255,255,0.4)", fontSize: "7px", textDecoration: "underline" }}
                        data-testid={`project-github-${proj.id}`}
                      >
                        GitHub
                      </a>
                      {proj.demo && (
                        <a
                          href={proj.demo}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="font-mono hover:text-white transition-colors"
                          style={{ color: proj.accent, fontSize: "7px", textDecoration: "underline" }}
                          data-testid={`project-demo-${proj.id}`}
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Nav dots */}
                <div className="flex items-center justify-between mt-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                    className="font-mono hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}
                    data-testid="laptop-prev"
                  >
                    ‹
                  </button>
                  <div className="flex gap-1">
                    {PROJECTS.map((_, i) => (
                      <div
                        key={i}
                        className="rounded-full transition-all"
                        style={{
                          width: i === activeProject ? 12 : 4,
                          height: 4,
                          background: i === activeProject ? proj.accent : "rgba(255,255,255,0.2)",
                        }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(1); }}
                    className="font-mono hover:text-white transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}
                    data-testid="laptop-next"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Base/keyboard */}
          <div
            style={{
              width: 240,
              height: 14,
              background: "linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)",
              borderRadius: "0 0 6px 6px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
              position: "relative",
            }}
          >
            {/* Trackpad */}
            <div
              className="absolute"
              style={{
                width: 60,
                height: 8,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                border: "1px solid rgba(255,255,255,0.08)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            />
          </div>
        </div>

        {!open && (
          <motion.div
            className="font-sans text-center mt-1"
            style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            click to open
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
