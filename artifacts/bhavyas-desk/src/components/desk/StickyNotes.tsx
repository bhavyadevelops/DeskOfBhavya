import { motion } from "framer-motion";

interface Note {
  id: number;
  label: string;
  text: string;
  color: string;
  rotation: number;
}

const NOTES: Note[] = [
  { id: 1, label: "Current Focus", text: "Ship Bhavya's Desk v1", color: "#F9E97A", rotation: -3 },
  { id: 2, label: "Currently Building", text: "Project QUANTEX", color: "#A8E6B0", rotation: 2 },
  { id: 3, label: "Learning Right Now", text: "AI & Machine Learning", color: "#F9E97A", rotation: -1 },
  { id: 4, label: "Next Goal", text: "AIATS — ATS Resume AI", color: "#FFD6A5", rotation: 3 },
];

export default function StickyNotes() {
  return (
    <motion.div
      className="absolute"
      style={{ top: "8%", left: "4%" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.7 }}
    >
      <div className="relative" style={{ width: 220 }}>
        {/* Stacked notes visual */}
        <div className="relative mb-3" style={{ height: 22 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute rounded-sm"
              style={{
                width: 100,
                height: 22,
                background: NOTES[i % NOTES.length].color,
                top: i * 2,
                left: i * 3,
                opacity: 0.55,
                boxShadow: "1px 2px 6px rgba(0,0,0,0.25)",
              }}
            />
          ))}
        </div>

        {/* Notes */}
        {NOTES.map(note => (
          <motion.div
            key={note.id}
            className="relative mb-2 rounded-sm select-none"
            style={{
              background: note.color,
              rotate: note.rotation,
              width: "100%",
              padding: "9px 12px 12px",
              boxShadow: "2px 4px 12px rgba(0,0,0,0.3)",
              transformOrigin: "top left",
            }}
            whileHover={{ y: -3, rotate: 0, boxShadow: "4px 8px 20px rgba(0,0,0,0.4)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="text-xs font-sans font-semibold mb-0.5 opacity-40 uppercase tracking-wider" style={{ color: "#333", fontSize: "9px" }}>
              {note.label}
            </div>
            <div className="text-sm font-sans" style={{ color: "#1a1a1a" }}>
              {note.text}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
