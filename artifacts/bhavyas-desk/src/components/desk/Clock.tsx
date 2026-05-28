import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

const QUOTES = [
  { text: "Build things that matter.", author: "— Bhavya" },
  { text: "Simplicity is the ultimate sophistication.", author: "— da Vinci" },
  { text: "Stay hungry. Stay foolish.", author: "— Jobs" },
  { text: "The best way to predict the future is to create it.", author: "— Lincoln" },
  { text: "Code is poetry written in logic.", author: "— anon" },
  { text: "Ship it. Then make it great.", author: "— Reid Hoffman" },
  { text: "Done is better than perfect.", author: "— Zuckerberg" },
  { text: "Move fast. Break things. Fix them.", author: "— anon" },
  { text: "Every expert was once a beginner.", author: "— Hayes" },
  { text: "Curiosity is the engine of achievement.", author: "— Ken Robinson" },
  { text: "Make something people want.", author: "— Graham" },
  { text: "Fall in love with the problem.", author: "— Uri Levine" },
  { text: "First, solve the problem. Then write the code.", author: "— Johnson" },
  { text: "Small steps every day compound.", author: "— anon" },
  { text: "The only way out is through.", author: "— Frost" },
  { text: "Work hard in silence. Let success make noise.", author: "— anon" },
  { text: "Iteration is the mother of invention.", author: "— anon" },
  { text: "Build. Measure. Learn. Repeat.", author: "— Ries" },
  { text: "Your system is perfectly designed for its results.", author: "— anon" },
  { text: "Focus beats talent when talent doesn't focus.", author: "— anon" },
  { text: "The code you don't write can't break.", author: "— anon" },
  { text: "Dream in decades. Think in years. Work in weeks.", author: "— anon" },
  { text: "Ideas are worthless without execution.", author: "— anon" },
  { text: "Constraints breed creativity.", author: "— anon" },
  { text: "Read more. Build more. Ship more.", author: "— anon" },
  { text: "The best engineers are insatiably curious.", author: "— anon" },
  { text: "Clarity of purpose cuts through noise.", author: "— anon" },
  { text: "Own the problem before you write the solution.", author: "— anon" },
  { text: "Great products are a series of small decisions.", author: "— anon" },
  { text: "Make it work. Make it right. Make it fast.", author: "— Beck" },
  { text: "Build something you'd be proud to show your heroes.", author: "— anon" },
];

function getDailyQuote() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  return QUOTES[seed % QUOTES.length];
}

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [showQuote, setShowQuote] = useState(false);
  const quote = useMemo(() => getDailyQuote(), []);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ top: "5%", right: "2%" }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      onClick={() => setShowQuote(v => !v)}
      title="Click for today's quote"
      data-testid="desk-clock"
    >
      <div
        className="rounded-lg select-none"
        style={{
          background: "rgba(10,8,5,0.87)",
          border: "1px solid rgba(245,166,35,0.3)",
          boxShadow: "0 0 20px rgba(245,166,35,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
          minWidth: 170,
        }}
      >
        <div style={{ padding: "10px 16px 8px" }}>
          <div
            className="font-mono text-3xl tracking-widest leading-none"
            style={{ color: "#F5A623", textShadow: "0 0 10px rgba(245,166,35,0.55)" }}
            data-testid="clock-time"
          >
            {h}<span className="opacity-50 animate-pulse">:</span>{m}<span className="opacity-50 animate-pulse">:</span>{s}
          </div>
          <div className="font-mono text-xs mt-1 text-center tracking-wider" style={{ color: "rgba(245,166,35,0.45)" }} data-testid="clock-date">
            {dateStr}
          </div>
        </div>

        {/* Quote panel */}
        <motion.div
          animate={{ height: showQuote ? "auto" : 0, opacity: showQuote ? 1 : 0 }}
          initial={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          <div
            style={{
              padding: "10px 14px 12px",
              borderTop: "1px solid rgba(245,166,35,0.15)",
              background: "rgba(245,166,35,0.04)",
            }}
          >
            <div className="font-serif text-xs leading-snug" style={{ color: "rgba(245,200,100,0.85)", fontStyle: "italic", marginBottom: 4 }}>
              "{quote.text}"
            </div>
            <div className="font-mono" style={{ color: "rgba(245,166,35,0.4)", fontSize: "9px" }}>
              {quote.author}
            </div>
          </div>
        </motion.div>

        {/* Subtle hint */}
        {!showQuote && (
          <div style={{ padding: "0 14px 6px", textAlign: "center" }}>
            <span className="font-mono" style={{ color: "rgba(245,166,35,0.18)", fontSize: "8px" }}>tap for quote</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
