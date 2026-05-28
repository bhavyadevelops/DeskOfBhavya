import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: "HackMIT 2023", subtitle: "Winner — Best AI Project", year: "2023", color: "#2563eb", icon: "🏆", bg: "#1e3a6e" },
  { id: 2, title: "Google Summer of Code", subtitle: "Open Source Contributor", year: "2023", color: "#ea4335", icon: "G", bg: "#6e1e1e", isLetter: true },
  { id: 3, title: "Forbes 30 Under 30", subtitle: "Technology Nominee", year: "2024", color: "#b45309", icon: "F", bg: "#6e4a1e", isLetter: true },
];

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [selected, setSelected] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedAchievement = achievements.find((a) => a.id === selected) ?? null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selected === null) return;
    const url = URL.createObjectURL(file);
    setAchievements((prev) =>
      prev.map((a) => (a.id === selected ? { ...a, imageUrl: url } : a))
    );
    e.target.value = "";
  };

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
        {achievements.map((a, i) => (
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
                className="rounded-sm flex items-center justify-center overflow-hidden"
                style={{ height: 70, background: a.bg }}
              >
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span
                    className={a.isLetter ? "font-serif font-bold text-2xl" : "text-2xl"}
                    style={{ color: a.color }}
                  >
                    {a.icon}
                  </span>
                )}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

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
              style={{
                background: "#f5f0e8",
                padding: "24px 24px 32px",
                width: 280,
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
              initial={{ scale: 0.7, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, rotate: 8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="achievement-modal"
            >
              {/* Photo area — click to upload */}
              <div
                className="rounded-sm flex items-center justify-center mb-4 relative overflow-hidden cursor-pointer group"
                style={{ height: 180, background: selectedAchievement.bg }}
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload a photo"
              >
                {selectedAchievement.imageUrl ? (
                  <img
                    src={selectedAchievement.imageUrl}
                    alt={selectedAchievement.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span
                    className={`${selectedAchievement.isLetter ? "font-serif font-bold" : ""} text-6xl`}
                    style={{ color: selectedAchievement.color }}
                  >
                    {selectedAchievement.icon}
                  </span>
                )}
                {/* Upload hover overlay */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(0,0,0,0.55)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="font-mono text-white mt-2" style={{ fontSize: "10px" }}>upload photo</span>
                </div>
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

              <div className="flex items-center justify-center gap-4 mt-5">
                <button
                  className="text-xs font-mono underline transition-opacity hover:opacity-50"
                  style={{ color: "#888" }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  change photo
                </button>
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
