import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GuestEntry {
  id: number;
  name: string;
  message: string;
  date: string;
}

const STORAGE_KEY = "bhavya-desk-guestbook";

function loadEntries(): GuestEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GuestEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: GuestEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch { /* ignore */ }
}

export default function Guestbook() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const addEntry = () => {
    if (!name.trim() || !message.trim()) return;
    const entry: GuestEntry = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setName("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2200);
  };

  return (
    <>
      {/* Desk object — notepad */}
      <motion.div
        className="absolute cursor-pointer select-none"
        style={{ top: "66%", left: "4%" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        whileHover={{ y: -4, rotate: -1 }}
        onClick={() => setOpen(true)}
        data-testid="guestbook"
      >
        {/* Spiral binding */}
        <div className="flex gap-[5px] justify-center mb-0.5 px-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-full" style={{ width: 5, height: 7, background: "rgba(80,60,30,0.7)", border: "1px solid rgba(255,255,255,0.1)" }} />
          ))}
        </div>
        {/* Notepad body */}
        <div className="rounded-sm" style={{ width: 78, height: 90, background: "#fef9c3", boxShadow: "2px 4px 16px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute left-0 right-0" style={{ top: 14 + i * 10, height: 1, background: "rgba(180,160,80,0.25)" }} />
          ))}
          <div className="absolute top-0 bottom-0" style={{ left: 14, width: 1, background: "rgba(240,100,100,0.2)" }} />
          <div className="absolute font-serif text-center" style={{ top: 6, left: 0, right: 0, color: "#92400e", fontSize: "7px", fontStyle: "italic" }}>
            guestbook
          </div>
          {entries.length > 0 && (
            <div className="absolute font-mono" style={{ bottom: 5, right: 5, color: "rgba(146,64,14,0.5)", fontSize: "7px" }}>
              {entries.length}
            </div>
          )}
        </div>
        <div className="font-mono text-center mt-1" style={{ color: "rgba(245,200,100,0.25)", fontSize: "8px" }}>sign it</div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(10px)", zIndex: 100 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            data-testid="guestbook-overlay"
          >
            <motion.div
              className="relative flex flex-col overflow-hidden"
              style={{ width: 500, maxHeight: "82vh", background: "#fef9c3", borderRadius: 6, boxShadow: "0 32px 80px rgba(0,0,0,0.55)" }}
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              onClick={e => e.stopPropagation()}
              data-testid="guestbook-modal"
            >
              {/* Spiral binding strip */}
              <div className="flex gap-[6px] items-center px-4 shrink-0" style={{ background: "#fbbf24", padding: "8px 16px", borderBottom: "2px solid rgba(0,0,0,0.08)" }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="rounded-full" style={{ width: 6, height: 10, background: "rgba(80,50,10,0.6)", border: "1px solid rgba(255,255,255,0.2)" }} />
                ))}
              </div>

              {/* Header */}
              <div className="flex items-center justify-between shrink-0" style={{ padding: "14px 20px 10px", borderBottom: "1px solid rgba(180,140,30,0.25)" }}>
                <div>
                  <h2 className="font-serif text-xl font-bold" style={{ color: "#78350f" }}>Guestbook</h2>
                  <p className="font-sans text-xs mt-0.5" style={{ color: "#92400e", opacity: 0.7 }}>Leave a note for Bhavya</p>
                </div>
                <button className="font-mono text-sm hover:opacity-50 transition-opacity" style={{ color: "#92400e" }} onClick={() => setOpen(false)} data-testid="guestbook-close">
                  close
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                {/* Sign form */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(180,140,30,0.2)" }}>
                  <div className="font-mono text-xs mb-3" style={{ color: "#b45309" }}>leave your mark</div>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={40}
                    className="w-full font-serif text-base outline-none bg-transparent border-b mb-3"
                    style={{ color: "#451a03", borderColor: "rgba(180,140,30,0.4)", paddingBottom: 5 }}
                  />
                  <textarea
                    placeholder="What's on your mind?"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full font-sans text-sm outline-none bg-transparent resize-none"
                    style={{ color: "#451a03", lineHeight: 1.8, borderBottom: "1px solid rgba(180,140,30,0.25)", paddingBottom: 6 }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-mono" style={{ color: "rgba(180,120,30,0.5)", fontSize: "9px" }}>{message.length}/200</span>
                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div key="thanks" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-serif text-sm" style={{ color: "#15803d", fontStyle: "italic" }}>
                          Thanks for signing! ✦
                        </motion.div>
                      ) : (
                        <motion.button key="sign" className="font-serif text-sm px-5 py-1.5 rounded-sm hover:opacity-80 transition-opacity" style={{ background: "#78350f", color: "#fef9c3", fontStyle: "italic" }} onClick={addEntry} whileTap={{ scale: 0.97 }}>
                          Sign the book
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Entries — read only, no delete */}
                <div style={{ padding: "12px 20px 24px" }}>
                  {entries.length === 0 ? (
                    <div className="font-serif text-center py-10" style={{ color: "rgba(146,64,14,0.35)", fontSize: "14px", fontStyle: "italic" }}>
                      No entries yet — be the first to sign!
                    </div>
                  ) : (
                    entries.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ paddingTop: 16, paddingBottom: 16, borderBottom: idx < entries.length - 1 ? "1px solid rgba(180,140,30,0.18)" : "none", position: "relative" }}
                      >
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="absolute left-0 right-0" style={{ top: 38 + i * 18, height: 1, background: "rgba(180,140,30,0.12)", pointerEvents: "none" }} />
                        ))}
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="font-serif font-bold text-base" style={{ color: "#451a03" }}>{entry.name}</span>
                          <span className="font-mono" style={{ color: "rgba(146,64,14,0.45)", fontSize: "9px" }}>{entry.date}</span>
                        </div>
                        <p className="font-sans text-sm leading-relaxed" style={{ color: "#78350f" }}>{entry.message}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
