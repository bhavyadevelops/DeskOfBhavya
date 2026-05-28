import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACHIEVEMENTS = [
  { id: 1, title: "HackMIT 2023", subtitle: "Winner — Best AI Project", year: "2023", color: "#2563eb", icon: "🏆", bg: "#1e3a6e" },
  { id: 2, title: "Google Summer of Code", subtitle: "Open Source Contributor", year: "2023", color: "#ea4335", icon: "G", bg: "#6e1e1e", isLetter: true },
  { id: 3, title: "Forbes 30 Under 30", subtitle: "Technology Nominee", year: "2024", color: "#b45309", icon: "F", bg: "#6e4a1e", isLetter: true },
];

export default function Achievements() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <motion.div
        className="absolute flex gap-4"
        style={{ top: "6%", right: "36%" }}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.id}
            className="cursor-pointer relative"
            style={{
              rotate: i === 0 ? -4 : i === 1 ? 2 : -2,
              transformOrigin: "bottom center",
            }}
            whileHover={{ y: -8, rotate: 0, scale: 1.05, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onClick={() => setSelected(a.id)}
            data-testid={`achievement-${a.id}`}
          >
            {/* Polaroid frame */}
            <div
              className="rounded-sm"
              style={{
                width: 90,
                background: "#f5f0e8",
                padding: "8px 8px 20px",
                boxShadow: "2px 4px 16px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="rounded-sm flex items-center justify-center"
                style={{ height: 70, background: a.bg }}
              >
                <span
                  className={a.isLetter ? "font-serif font-bold text-2xl" : "text-2xl"}
                  style={{ color: a.color }}
                >
                  {a.icon}
                </span>
              </div>
              <div className="mt-2 text-center">
                <div className="font-mono text-xs font-bold leading-tight" style={{ color: "#1a1a1a", fontSize: "7px" }}>
                  {a.title}
                </div>
                <div className="font-mono text-center mt-0.5" style={{ color: "#888", fontSize: "6px" }}>
                  {a.year}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            data-testid="achievement-modal-overlay"
          >
            <motion.div
              className="rounded-sm"
              style={{
                background: "#f5f0e8",
                padding: "24px 24px 48px",
                maxWidth: 300,
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, rotate: 8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="achievement-modal"
            >
              {ACHIEVEMENTS.filter(a => a.id === selected).map(a => (
                <div key={a.id}>
                  <div
                    className="rounded-sm flex items-center justify-center mb-4"
                    style={{ height: 160, background: a.bg }}
                  >
                    <span className={`${a.isLetter ? "font-serif font-bold" : ""} text-6xl`} style={{ color: a.color }}>
                      {a.icon}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-center" style={{ color: "#1a1a1a" }}>{a.title}</h3>
                  <p className="text-sm text-center mt-1 font-sans" style={{ color: "#555" }}>{a.subtitle}</p>
                  <p className="font-mono text-xs text-center mt-2" style={{ color: "#888" }}>{a.year}</p>
                  <button
                    className="block mx-auto mt-4 text-xs font-sans underline"
                    style={{ color: "#888" }}
                    onClick={() => setSelected(null)}
                    data-testid="achievement-close"
                  >
                    close
                  </button>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
