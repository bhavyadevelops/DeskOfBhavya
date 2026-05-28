import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: number;
  label: string;
  text: string;
  color: string;
  rotation: number;
  done: boolean;
}

const INITIAL_NOTES: Note[] = [
  { id: 1, label: "Current Focus", text: "Ship Bhavya's Desk v1", color: "#F9E97A", rotation: -3, done: false },
  { id: 2, label: "Currently Building", text: "Neural Canvas — AI art platform", color: "#A8E6B0", rotation: 2, done: false },
  { id: 3, label: "Learning Right Now", text: "Distributed systems + Raft consensus", color: "#F9E97A", rotation: -1, done: false },
  { id: 4, label: "Next Up", text: "Open source QuantumDB", color: "#FFD6A5", rotation: 3, done: false },
];

const STACK_NOTES = [
  { id: 10, color: "#F9E97A" },
  { id: 11, color: "#A8E6B0" },
  { id: 12, color: "#FFD6A5" },
];

export default function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const toggleDone = (id: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, done: !n.done } : n));
  };

  const startEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
  };

  const saveEdit = (id: number, val: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text: val } : n));
    setEditingId(null);
  };

  return (
    <motion.div
      className="absolute"
      style={{ top: "8%", left: "4%" }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.7 }}
    >
      <div className="relative" style={{ width: 220 }}>
        {/* Stack of extra notes */}
        <motion.div
          className="cursor-pointer relative"
          style={{ height: 24, marginBottom: 4 }}
          onClick={() => setExpanded(!expanded)}
          data-testid="sticky-stack"
        >
          {STACK_NOTES.map((s, i) => (
            <div
              key={s.id}
              className="absolute rounded-sm"
              style={{
                width: 100,
                height: 22,
                background: s.color,
                top: i * 2,
                left: i * 3,
                opacity: 0.7,
                boxShadow: "1px 2px 6px rgba(0,0,0,0.25)",
              }}
            />
          ))}
          <div className="absolute left-36 top-0.5 text-xs font-sans" style={{ color: "rgba(255,255,255,0.5)" }}>
            {expanded ? "collapse" : "+ more"}
          </div>
        </motion.div>

        <AnimatePresence>
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              className="relative mb-2 rounded-sm cursor-pointer select-none"
              style={{
                background: note.color,
                rotate: note.rotation,
                width: "100%",
                padding: "10px 12px 14px",
                boxShadow: "2px 4px 12px rgba(0,0,0,0.3)",
                transformOrigin: "top left",
              }}
              initial={expanded && i > 0 ? { opacity: 0, y: -10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ y: -4, scale: 1.02, rotate: 0, boxShadow: "4px 8px 20px rgba(0,0,0,0.4)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onDoubleClick={() => toggleDone(note.id)}
              onClick={(e) => startEdit(note.id, e)}
              data-testid={`sticky-note-${note.id}`}
            >
              <div className="text-xs font-sans font-semibold mb-1 opacity-50 uppercase tracking-wider" style={{ color: "#333" }}>
                {note.label}
              </div>
              {editingId === note.id ? (
                <div
                  ref={textRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="text-sm font-sans outline-none bg-transparent"
                  style={{ color: "#1a1a1a", minHeight: 20 }}
                  onBlur={(e) => saveEdit(note.id, e.currentTarget.textContent || "")}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); saveEdit(note.id, e.currentTarget.textContent || ""); } }}
                  data-testid={`sticky-edit-${note.id}`}
                >
                  {note.text}
                </div>
              ) : (
                <div
                  className="text-sm font-sans relative"
                  style={{
                    color: "#1a1a1a",
                    textDecoration: note.done ? "line-through" : "none",
                    opacity: note.done ? 0.5 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {note.text}
                  {note.done && (
                    <motion.div
                      className="absolute top-1/2 left-0 h-px w-full"
                      style={{ background: "#555", transform: "translateY(-50%)", transformOrigin: "left" }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                    />
                  )}
                </div>
              )}
              <div className="text-xs mt-1 opacity-30 font-sans" style={{ color: "#333" }}>double-click to complete</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
