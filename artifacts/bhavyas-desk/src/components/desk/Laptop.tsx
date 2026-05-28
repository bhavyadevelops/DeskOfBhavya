import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  name: string;
  desc: string;
  stack: string[];
  github: string;
  demo: string | null;
  accent: string;
}

const INITIAL_PROJECTS: Project[] = [
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
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [newTag, setNewTag] = useState("");

  const proj = projects[activeProject];

  const updateProj = (field: keyof Project, value: string | string[] | null) => {
    setProjects(prev =>
      prev.map((p, i) => i === activeProject ? { ...p, [field]: value } : p)
    );
  };

  const removeTag = (tag: string) => {
    updateProj("stack", proj.stack.filter(t => t !== tag));
  };

  const addTag = () => {
    const t = newTag.trim();
    if (!t || proj.stack.includes(t)) return;
    updateProj("stack", [...proj.stack, t]);
    setNewTag("");
  };

  const handleTabChange = (idx: number) => {
    setActiveProject(idx);
    setEditMode(false);
    setNewTag("");
  };

  const closeModal = () => {
    setOpen(false);
    setEditMode(false);
    setNewTag("");
  };

  return (
    <>
      {/* Desk object — closed laptop */}
      <motion.div
        className="absolute cursor-pointer select-none"
        style={{ top: "32%", left: "26%" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onClick={() => setOpen(true)}
        whileHover={{ y: -3 }}
        data-testid="laptop"
      >
        <div style={{ width: 200, height: 6, background: "linear-gradient(180deg, #3a3a3a 0%, #252525 100%)", borderRadius: "4px 4px 0 0", boxShadow: "0 -1px 0 rgba(255,255,255,0.06) inset" }} />
        <div style={{ width: 200, height: 12, background: "linear-gradient(180deg, #2a2a2a 0%, #1e1e1e 100%)", borderRadius: "0 0 5px 5px", boxShadow: "0 6px 20px rgba(0,0,0,0.5)", position: "relative" }}>
          <div style={{ position: "absolute", width: 50, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 2, border: "1px solid rgba(255,255,255,0.06)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        </div>
        <div className="font-mono text-center mt-1" style={{ color: "rgba(255,255,255,0.25)", fontSize: "8px", letterSpacing: "0.1em" }}>
          click to open
        </div>
      </motion.div>

      {/* Full-screen modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: "rgba(5,3,0,0.88)", backdropFilter: "blur(12px)", zIndex: 100 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            data-testid="laptop-modal-overlay"
          >
            <motion.div
              className="relative flex overflow-hidden"
              style={{ width: 720, height: 480, background: "#0f0f14", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 100px rgba(0,0,0,0.8)" }}
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 24 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={e => e.stopPropagation()}
              data-testid="laptop-modal"
            >
              {/* Title bar */}
              <div
                className="absolute top-0 left-0 right-0 flex items-center justify-between"
                style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", zIndex: 2 }}
              >
                <div className="flex gap-1.5">
                  <button onClick={closeModal} className="w-3 h-3 rounded-full hover:opacity-70 transition-opacity" style={{ background: "#ff5f57" }} data-testid="laptop-close" />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28c940" }} />
                </div>
                <div className="font-mono" style={{ color: "rgba(255,255,255,0.22)", fontSize: "10px" }}>
                  bhavya — projects
                </div>
                {/* Edit toggle */}
                <button
                  className="font-mono text-xs px-2 py-0.5 rounded transition-all"
                  style={{
                    color: editMode ? proj.accent : "rgba(255,255,255,0.3)",
                    border: `1px solid ${editMode ? proj.accent + "66" : "rgba(255,255,255,0.12)"}`,
                    background: editMode ? proj.accent + "18" : "transparent",
                    fontSize: "9px",
                  }}
                  onClick={() => setEditMode(v => !v)}
                >
                  {editMode ? "done editing" : "edit"}
                </button>
              </div>

              {/* Sidebar */}
              <div
                className="flex flex-col shrink-0"
                style={{ width: 190, marginTop: 37, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "12px 0", background: "rgba(255,255,255,0.015)" }}
              >
                <div className="font-mono px-4 mb-2" style={{ color: "rgba(255,255,255,0.18)", fontSize: "9px", letterSpacing: "0.15em" }}>
                  PROJECTS
                </div>
                {projects.map((p, idx) => (
                  <button
                    key={p.id}
                    className="text-left px-4 py-2.5 transition-all"
                    style={{
                      background: activeProject === idx ? `${p.accent}18` : "transparent",
                      borderLeft: activeProject === idx ? `2px solid ${p.accent}` : "2px solid transparent",
                      color: activeProject === idx ? "#fff" : "rgba(255,255,255,0.38)",
                    }}
                    onClick={() => handleTabChange(idx)}
                    data-testid={`project-tab-${p.id}`}
                  >
                    <div className="font-sans text-sm">{p.name}</div>
                  </button>
                ))}
              </div>

              {/* Project detail */}
              <div className="flex-1 flex flex-col" style={{ marginTop: 37, padding: "24px 28px", overflow: "auto" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col h-full"
                  >
                    <div className="w-8 h-0.5 mb-4 rounded-full" style={{ background: proj.accent }} />

                    {/* Name */}
                    {editMode ? (
                      <input
                        className="font-serif text-2xl font-bold w-full outline-none bg-transparent border-b mb-3"
                        style={{ color: "#fff", borderColor: "rgba(255,255,255,0.15)", paddingBottom: 4 }}
                        value={proj.name}
                        onChange={e => updateProj("name", e.target.value)}
                        placeholder="Project name"
                      />
                    ) : (
                      <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#fff" }}>
                        {proj.name}
                      </h2>
                    )}

                    {/* Description */}
                    {editMode ? (
                      <textarea
                        className="font-sans text-sm w-full outline-none bg-transparent border rounded resize-none flex-1 mb-0"
                        style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.1)", padding: "8px 10px", lineHeight: 1.6, minHeight: 80 }}
                        value={proj.desc}
                        onChange={e => updateProj("desc", e.target.value)}
                        placeholder="Project description"
                        rows={4}
                      />
                    ) : (
                      <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {proj.desc}
                      </p>
                    )}

                    {/* Stack tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.stack.map(t => (
                        <span
                          key={t}
                          className="font-mono text-xs px-2 py-0.5 rounded flex items-center gap-1"
                          style={{ background: `${proj.accent}22`, color: proj.accent, border: `1px solid ${proj.accent}44` }}
                        >
                          {t}
                          {editMode && (
                            <button
                              className="opacity-50 hover:opacity-100 transition-opacity ml-0.5"
                              style={{ fontSize: "10px", lineHeight: 1 }}
                              onClick={() => removeTag(t)}
                            >
                              ×
                            </button>
                          )}
                        </span>
                      ))}
                      {editMode && (
                        <div className="flex items-center gap-1">
                          <input
                            className="font-mono text-xs outline-none bg-transparent border rounded px-2 py-0.5"
                            style={{ color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.15)", width: 80 }}
                            placeholder="+ add tag"
                            value={newTag}
                            onChange={e => setNewTag(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") addTag(); }}
                          />
                          <button
                            className="font-mono text-xs px-2 py-0.5 rounded hover:opacity-70 transition-opacity"
                            style={{ color: proj.accent, border: `1px solid ${proj.accent}55` }}
                            onClick={addTag}
                          >
                            add
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 mt-4">
                      {editMode ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>gh:</span>
                            <input
                              className="font-mono text-xs outline-none bg-transparent border-b"
                              style={{ color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.12)", width: 160, paddingBottom: 2 }}
                              value={proj.github}
                              onChange={e => updateProj("github", e.target.value)}
                              placeholder="GitHub URL"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>demo:</span>
                            <input
                              className="font-mono text-xs outline-none bg-transparent border-b"
                              style={{ color: proj.accent, borderColor: "rgba(255,255,255,0.12)", width: 140, paddingBottom: 2 }}
                              value={proj.demo ?? ""}
                              onChange={e => updateProj("demo", e.target.value || null)}
                              placeholder="Demo URL (optional)"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-sm underline hover:opacity-60 transition-opacity"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                            data-testid={`project-github-${proj.id}`}
                          >
                            GitHub
                          </a>
                          {proj.demo && (
                            <a
                              href={proj.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-sm underline hover:opacity-60 transition-opacity"
                              style={{ color: proj.accent }}
                              data-testid={`project-demo-${proj.id}`}
                            >
                              Live Demo
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
