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

const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Project QUANTEX",
    desc: "An AI-powered platform that connects users with verified technicians for fast, reliable technical support. Users can book on-demand assistance, describe issues through text or images, receive smart technician recommendations, track service requests, and access support from a single interface. Built to simplify technical problem-solving, QUANTEX reduces search time and improves access to trusted expertise.",
    stack: ["Artificial Intelligence", "Web Development", "Technical Support", "Service Marketplace", "SaaS", "Startup"],
    github: "https://github.com/bhavyadevelops/Project-QUANTEX",
    demo: "https://tech-support-connect--bhavyachokshi36.replit.app",
    accent: "#6366f1",
  },
  {
    id: 2,
    name: "Spotify Web v1.0",
    desc: "A modern reimagination of Spotify with a sleek, immersive UI focused on simplicity, speed, and user experience. Features a visually rich music dashboard, smooth navigation, responsive design, and a premium listening experience that blends aesthetics with functionality. Built to showcase modern frontend development, interactive design, and a fresh take on music streaming platforms.",
    stack: ["ReactJS", "TypeScript", "UI/UX Design", "Responsive Web Design", "Music Streaming", "Product Design"],
    github: "https://github.com/bhavyadevelops/Spotify-Reimagined",
    demo: "https://spotify-reimagined.vercel.app",
    accent: "#1db954",
  },
  {
    id: 3,
    name: "AIATS",
    desc: "An AI-powered ATS Resume Analyzer that evaluates resume-job fit, scores ATS compatibility, identifies missing keywords, and generates personalized optimization suggestions. Designed to help candidates improve recruiter visibility, increase interview opportunities, and tailor resumes for specific roles through intelligent AI-driven feedback.",
    stack: ["Artificial Intelligence", "NLP", "ATS Optimization", "Generative AI", "Career Development", "Recruitment Tech"],
    github: "https://github.com/bhavyadevelops/AIATS",
    demo: null,
    accent: "#f59e0b",
  },
];

export default function Laptop() {
  const [open, setOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);

  const proj = PROJECTS[activeProject];

  return (
    <>
      {/* Desk object — open laptop screen */}
      <motion.div
        className="absolute cursor-pointer select-none"
        style={{ top: "26%", left: "50%", transform: "translateX(-50%)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        onClick={() => setOpen(true)}
        whileHover={{ y: -4 }}
        data-testid="laptop"
      >
        {/* Screen */}
        <div
          style={{
            width: 220,
            background: "#0f0f14",
            borderRadius: "8px 8px 2px 2px",
            border: "2.5px solid #2a2a30",
            padding: "7px 8px 6px",
            boxShadow: "0 0 28px rgba(99,102,241,0.18), 0 0 60px rgba(0,0,0,0.5)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Screen ambient glow */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

          {/* Title bar */}
          <div className="flex items-center gap-1 mb-2">
            <div className="rounded-full" style={{ width: 5, height: 5, background: "#ff5f57" }} />
            <div className="rounded-full" style={{ width: 5, height: 5, background: "#ffbd2e" }} />
            <div className="rounded-full" style={{ width: 5, height: 5, background: "#28c940" }} />
            <div className="font-mono flex-1 text-center" style={{ color: "rgba(255,255,255,0.18)", fontSize: "7px" }}>bhavya — projects</div>
          </div>

          {/* Project list */}
          <div style={{ padding: "4px 0" }}>
            {PROJECTS.map((p) => (
              <div
                key={p.id}
                className="font-mono flex items-center gap-1.5 py-0.5"
                style={{ fontSize: "8px", color: "rgba(255,255,255,0.3)" }}
              >
                <div className="rounded-full" style={{ width: 4, height: 4, background: p.accent, opacity: 0.7, flexShrink: 0 }} />
                {p.name}
              </div>
            ))}
          </div>

          {/* Blinking cursor */}
          <div className="font-mono mt-2 flex items-center gap-1" style={{ fontSize: "8px", color: "rgba(99,102,241,0.6)" }}>
            <span>›</span>
            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>
              _
            </motion.span>
          </div>

          {/* Click hint */}
          <div className="text-center mt-2 font-mono" style={{ fontSize: "7px", color: "rgba(255,255,255,0.15)" }}>
            click to open
          </div>
        </div>

        {/* Hinge */}
        <div style={{ width: 230, height: 5, background: "linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)", marginLeft: -5, borderRadius: "0 0 2px 2px" }} />

        {/* Keyboard base */}
        <div style={{
          width: 240,
          height: 16,
          background: "linear-gradient(180deg, #222 0%, #1a1a1a 100%)",
          marginLeft: -10,
          borderRadius: "0 0 6px 6px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
          position: "relative",
        }}>
          <div style={{ position: "absolute", width: 40, height: 5, background: "rgba(255,255,255,0.03)", borderRadius: 2, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
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
            onClick={() => setOpen(false)}
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
                  <button onClick={() => setOpen(false)} className="w-3 h-3 rounded-full hover:opacity-70 transition-opacity" style={{ background: "#ff5f57" }} data-testid="laptop-close" />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "#28c940" }} />
                </div>
                <div className="font-mono" style={{ color: "rgba(255,255,255,0.22)", fontSize: "10px" }}>bhavya — projects</div>
                <div style={{ width: 48 }} />
              </div>

              {/* Sidebar */}
              <div
                className="flex flex-col shrink-0"
                style={{ width: 190, marginTop: 37, borderRight: "1px solid rgba(255,255,255,0.06)", padding: "12px 0", background: "rgba(255,255,255,0.015)" }}
              >
                <div className="font-mono px-4 mb-2" style={{ color: "rgba(255,255,255,0.18)", fontSize: "9px", letterSpacing: "0.15em" }}>PROJECTS</div>
                {PROJECTS.map((p, idx) => (
                  <button
                    key={p.id}
                    className="text-left px-4 py-2.5 transition-all"
                    style={{
                      background: activeProject === idx ? `${p.accent}18` : "transparent",
                      borderLeft: activeProject === idx ? `2px solid ${p.accent}` : "2px solid transparent",
                      color: activeProject === idx ? "#fff" : "rgba(255,255,255,0.38)",
                    }}
                    onClick={() => setActiveProject(idx)}
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

                    <h2 className="font-serif text-2xl font-bold mb-3" style={{ color: "#fff" }}>
                      {proj.name}
                    </h2>

                    <p className="font-sans text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {proj.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {proj.stack.map(t => (
                        <span
                          key={t}
                          className="font-mono text-xs px-2 py-0.5 rounded"
                          style={{ background: `${proj.accent}22`, color: proj.accent, border: `1px solid ${proj.accent}44` }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 mt-5">
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
