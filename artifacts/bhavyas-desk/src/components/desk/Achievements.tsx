import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import hackmitPhoto from "@assets/DSC00674_1780148259968.jpg";
import mcmCert from "@assets/mcm_cert_1780148612407.png";

interface Achievement {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  color: string;
  icon: string;
  bg: string;
  isLetter?: boolean;
  imageUrl?: string;
  contain?: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "JunoHub AI Bootcamp",
    subtitle: "Top 10 Winner — Project QUANTEX",
    year: "2026",
    color: "#2563eb",
    icon: "🏆",
    bg: "#1e3a6e",
    imageUrl: hackmitPhoto,
    contain: false,
  },
  {
    id: 2,
    title: "My Career Mentor",
    subtitle: "Certification of Achievement",
    year: "2026",
    color: "#ea4335",
    icon: "G",
    bg: "#ffffff",
    isLetter: true,
    imageUrl: mcmCert,
    contain: true,
  },
  {
    id: 3,
    title: "Forbes 30 Under 30",
    subtitle: "Technology Nominee",
    year: "2024",
    color: "#b45309",
    icon: "F",
    bg: "#6e4a1e",
    isLetter: true,
  },
];

export default function Achievements() {
  const [selected, setSelected] = useState<number | null>(null);
  const selectedAchievement = ACHIEVEMENTS.find(a => a.id === selected) ?? null;

  return (
    <>
      {/* Polaroids on desk */}
      <motion.div
        className="absolute flex gap-4"
        style={{ top: "6%", right: "34%" }}
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.id}
            className="cursor-pointer relative"
            style={{ rotate: i === 0 ? -4 : i === 1 ? 2 : -2, transformOrigin: "bottom center" }}
            whileHover={{ y: -8, rotate: 0, scale: 1.05, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            onClick={() => setSelected(a.id)}
            data-testid={`achievement-${a.id}`}
          >
            <div
              className="rounded-sm"
              style={{ width: 90, background: "#f5f0e8", padding: "8px 8px 20px", boxShadow: "2px 4px 16px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.1)" }}
            >
              <div className="rounded-sm flex items-center justify-center overflow-hidden" style={{ height: 70, background: a.imageUrl && a.contain ? "#fff" : a.bg }}>
                {a.imageUrl ? (
                  <img
                    src={a.imageUrl}
                    alt={a.title}
                    style={{ width: "100%", height: "100%", objectFit: a.contain ? "contain" : "cover" }}
                  />
                ) : (
                  <span className={a.isLetter ? "font-serif font-bold text-2xl" : "text-2xl"} style={{ color: a.color }}>
                    {a.icon}
                  </span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div className="font-mono leading-tight" style={{ color: "#1a1a1a", fontSize: "7px", fontWeight: 700 }}>
                  {a.title}
                </div>
                <div className="font-mono text-center mt-0.5" style={{ color: "#888", fontSize: "6px" }}>{a.year}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded modal */}
      <AnimatePresence>
        {selected !== null && selectedAchievement && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", zIndex: 100 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            data-testid="achievement-modal-overlay"
          >
            <motion.div
              className="rounded-sm"
              style={{ background: "#f5f0e8", padding: "20px 20px 24px", width: 320, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, rotate: 8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={e => e.stopPropagation()}
              data-testid="achievement-modal"
            >
              {/* Photo */}
              <div
                className="rounded-sm flex items-center justify-center mb-5 overflow-hidden"
                style={{
                  background: selectedAchievement.imageUrl && selectedAchievement.contain ? "#fff" : selectedAchievement.bg,
                  minHeight: 200,
                }}
              >
                {selectedAchievement.imageUrl ? (
                  <img
                    src={selectedAchievement.imageUrl}
                    alt={selectedAchievement.title}
                    style={{
                      width: "100%",
                      display: "block",
                      objectFit: selectedAchievement.contain ? "contain" : "cover",
                      maxHeight: selectedAchievement.contain ? "none" : 200,
                    }}
                  />
                ) : (
                  <span className={`${selectedAchievement.isLetter ? "font-serif font-bold" : ""} text-6xl`} style={{ color: selectedAchievement.color }}>
                    {selectedAchievement.icon}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-xl font-bold text-center" style={{ color: "#1a1a1a" }}>
                {selectedAchievement.title}
              </h3>
              <p className="text-sm text-center mt-1 font-sans" style={{ color: "#555" }}>
                {selectedAchievement.subtitle}
              </p>
              <p className="font-mono text-xs text-center mt-2" style={{ color: "#888" }}>
                {selectedAchievement.year}
              </p>

              <div className="text-center mt-5">
                <button
                  className="text-xs font-sans underline transition-opacity hover:opacity-50"
                  style={{ color: "#888" }}
                  onClick={() => setSelected(null)}
                  data-testid="achievement-close"
                >
                  close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
