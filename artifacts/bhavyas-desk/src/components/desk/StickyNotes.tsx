import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: number;
  label: string;
  text: string;
  color: string;
  rotation: number;
  done: boolean;
}

const NOTE_COLORS = ["#F9E97A", "#A8E6B0", "#FFD6A5", "#FFC8C8", "#C8D8FF"];

const DEFAULTS: Note[] = [
  {
    id: 1,
    label: "Current Focus",
    text: "Ship Bhavya's Desk v1",
    color: "#F9E97A",
    rotation: -3,
    done: false,
  },
  {
    id: 2,
    label: "Currently Building",
    text: "Project QUANTEX",
    color: "#A8E6B0",
    rotation: 2,
    done: false,
  },
  {
    id: 3,
    label: "Learning Right Now",
    text: "Program Management",
    color: "#F9E97A",
    rotation: -1,
    done: false,
  },
  {
    id: 4,
    label: "Next Goal",
    text: "ResumeIQ — AI-powered ATS improvement recommendation engine",
    color: "#FFD6A5",
    rotation: 3,
    done: false,
  },
];

let nextId = 200;

async function fetchNotes(): Promise<Note[] | null> {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) return null;
    const data = (await res.json()) as Note[] | null;
    return data;
  } catch {
    return null;
  }
}

async function saveNotes(notes: Note[]): Promise<void> {
  try {
    await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notes),
    });
  } catch {
    /* silent */
  }
}

export default function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>(DEFAULTS);
  const [managerOpen, setManagerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingLabelId, setEditingLabelId] = useState<number | null>(null);
  const [newText, setNewText] = useState("");
  const [newLabel, setNewLabel] = useState("New task");
  const newInputRef = useRef<HTMLInputElement>(null);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchNotes().then((data) => {
      if (data && Array.isArray(data) && data.length > 0) setNotes(data);
    });
  }, []);

  const scheduleSync = (updated: Note[]) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => saveNotes(updated), 600);
  };

  const mutateNotes = (fn: (prev: Note[]) => Note[]) => {
    setNotes((prev) => {
      const next = fn(prev);
      scheduleSync(next);
      return next;
    });
  };

  const toggleDone = (id: number) =>
    mutateNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, done: !n.done } : n)),
    );

  const deleteNote = (id: number) =>
    mutateNotes((prev) => prev.filter((n) => n.id !== id));

  const saveText = (id: number, val: string) =>
    mutateNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text: val } : n)),
    );

  const saveLabel = (id: number, val: string) =>
    mutateNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, label: val } : n)),
    );

  const addNote = () => {
    if (!newText.trim()) return;
    const color = NOTE_COLORS[nextId % NOTE_COLORS.length];
    mutateNotes((prev) => [
      ...prev,
      {
        id: nextId++,
        label: newLabel.trim() || "Task",
        text: newText.trim(),
        color,
        rotation: (nextId % 7) - 3,
        done: false,
      },
    ]);
    setNewText("");
    setNewLabel("New task");
    newInputRef.current?.focus();
  };

  return (
    <>
      {/* Desk object */}
      <motion.div
        className="absolute"
        style={{ top: "8%", left: "4%" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
      >
        <div className="relative" style={{ width: 220 }}>
          {/* Manage button */}
          <motion.div
            className="cursor-pointer flex items-center gap-2 mb-3"
            onClick={() => setManagerOpen(true)}
            whileHover={{ x: 2 }}
            data-testid="sticky-stack"
            style={{ height: 26, position: "relative" }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-sm"
                style={{
                  width: 100,
                  height: 22,
                  background: DEFAULTS[i % DEFAULTS.length].color,
                  top: i * 2,
                  left: i * 3,
                  opacity: 0.6,
                  boxShadow: "1px 2px 6px rgba(0,0,0,0.25)",
                }}
              />
            ))}
            <div
              className="absolute font-sans text-xs"
              style={{ left: 130, top: 4, color: "rgba(255,255,255,0.5)" }}
            >
              + manage
            </div>
          </motion.div>

          {/* Notes on desk */}
          {notes.slice(0, 4).map((note) => (
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
              whileHover={{
                y: -3,
                rotate: 0,
                boxShadow: "4px 8px 20px rgba(0,0,0,0.4)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="text-xs font-sans font-semibold mb-0.5 opacity-40 uppercase tracking-wider"
                style={{ color: "#333", fontSize: "9px" }}
              >
                {note.label}
              </div>
              <div
                className="text-sm font-sans"
                style={{
                  color: "#1a1a1a",
                  textDecoration: note.done ? "line-through" : "none",
                  opacity: note.done ? 0.5 : 1,
                }}
              >
                {note.text}
              </div>
            </motion.div>
          ))}
          {notes.length > 4 && (
            <div
              className="font-mono text-xs cursor-pointer hover:opacity-80"
              style={{
                color: "rgba(255,255,255,0.3)",
                textAlign: "right",
                paddingRight: 4,
              }}
              onClick={() => setManagerOpen(true)}
            >
              +{notes.length - 4} more
            </div>
          )}
        </div>
      </motion.div>

      {/* Task manager modal */}
      <AnimatePresence>
        {managerOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(10px)",
              zIndex: 100,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setManagerOpen(false);
              setEditingId(null);
              setEditingLabelId(null);
            }}
          >
            <motion.div
              className="relative flex flex-col overflow-hidden"
              style={{
                width: 420,
                maxHeight: "75vh",
                background: "#faf7f0",
                borderRadius: 10,
                boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
              }}
              initial={{ scale: 0.9, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between"
                style={{
                  padding: "16px 20px 12px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  className="font-serif text-lg font-bold"
                  style={{ color: "#1a1a1a" }}
                >
                  Tasks
                </h2>
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "rgba(0,0,0,0.25)" }}
                  >
                    {notes.length} notes
                  </span>
                  <button
                    className="font-mono text-xs hover:opacity-50 transition-opacity"
                    style={{ color: "#888" }}
                    onClick={() => setManagerOpen(false)}
                  >
                    close
                  </button>
                </div>
              </div>

              {/* Note list */}
              <div
                className="overflow-y-auto flex-1"
                style={{ padding: "8px 20px" }}
              >
                <AnimatePresence>
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      className="flex items-start gap-3 py-3"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10, height: 0, padding: 0 }}
                      layout
                    >
                      {/* Color dot */}
                      <div
                        className="rounded-full shrink-0 mt-1"
                        style={{
                          width: 10,
                          height: 10,
                          background: note.color,
                          border: "1px solid rgba(0,0,0,0.1)",
                        }}
                      />

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Label */}
                        {editingLabelId === note.id ? (
                          <input
                            autoFocus
                            className="font-sans w-full outline-none bg-transparent border-b"
                            style={{
                              fontSize: "10px",
                              color: "#888",
                              borderColor: "rgba(0,0,0,0.15)",
                              marginBottom: 3,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                            }}
                            defaultValue={note.label}
                            onBlur={(e) => {
                              saveLabel(note.id, e.target.value);
                              setEditingLabelId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveLabel(
                                  note.id,
                                  (e.target as HTMLInputElement).value,
                                );
                                setEditingLabelId(null);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="font-sans font-semibold cursor-text mb-0.5 uppercase tracking-wider hover:opacity-70 transition-opacity"
                            style={{ fontSize: "10px", color: "#aaa" }}
                            onClick={() => setEditingLabelId(note.id)}
                          >
                            {note.label}
                          </div>
                        )}

                        {/* Text */}
                        {editingId === note.id ? (
                          <input
                            autoFocus
                            className="font-sans w-full outline-none bg-transparent border-b"
                            style={{
                              fontSize: "14px",
                              color: "#1a1a1a",
                              borderColor: "rgba(0,0,0,0.2)",
                              paddingBottom: 2,
                            }}
                            defaultValue={note.text}
                            onBlur={(e) => {
                              saveText(note.id, e.target.value);
                              setEditingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveText(
                                  note.id,
                                  (e.target as HTMLInputElement).value,
                                );
                                setEditingId(null);
                              }
                            }}
                          />
                        ) : (
                          <div
                            className="font-sans cursor-text hover:opacity-70 transition-opacity"
                            style={{
                              fontSize: "14px",
                              color: "#1a1a1a",
                              textDecoration: note.done
                                ? "line-through"
                                : "none",
                              opacity: note.done ? 0.45 : 1,
                            }}
                            onClick={() => setEditingId(note.id)}
                          >
                            {note.text}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 mt-1">
                        <button
                          title={note.done ? "Mark active" : "Strike through"}
                          className="rounded transition-all hover:scale-110"
                          style={{
                            width: 24,
                            height: 24,
                            background: note.done
                              ? "rgba(0,0,0,0.08)"
                              : "transparent",
                            border: "1px solid rgba(0,0,0,0.12)",
                            color: "#888",
                            fontSize: "11px",
                            textDecoration: "line-through",
                            fontFamily: "monospace",
                          }}
                          onClick={() => toggleDone(note.id)}
                        >
                          S
                        </button>
                        <button
                          title="Delete"
                          className="rounded transition-all hover:scale-110 hover:bg-red-50"
                          style={{
                            width: 24,
                            height: 24,
                            border: "1px solid rgba(0,0,0,0.12)",
                            color: "#bbb",
                            fontSize: "16px",
                            lineHeight: 1,
                          }}
                          onClick={() => deleteNote(note.id)}
                        >
                          ×
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {notes.length === 0 && (
                  <div
                    className="font-serif text-center py-10"
                    style={{ color: "rgba(0,0,0,0.2)", fontSize: "14px" }}
                  >
                    No tasks. Add one below.
                  </div>
                )}
              </div>

              {/* Add new task */}
              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  background: "#f5f2eb",
                }}
              >
                <input
                  type="text"
                  placeholder="Label (e.g. Learning)..."
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full font-sans text-xs outline-none bg-transparent mb-1"
                  style={{
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                />
                <div className="flex items-center gap-2">
                  <input
                    ref={newInputRef}
                    type="text"
                    placeholder="Add a task..."
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addNote();
                    }}
                    className="flex-1 font-sans text-sm outline-none bg-transparent"
                    style={{ color: "#1a1a1a" }}
                  />
                  <button
                    className="font-mono text-xs px-3 py-1.5 rounded transition-opacity hover:opacity-70"
                    style={{
                      background: "#F9E97A",
                      color: "#333",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                    onClick={addNote}
                  >
                    add
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
