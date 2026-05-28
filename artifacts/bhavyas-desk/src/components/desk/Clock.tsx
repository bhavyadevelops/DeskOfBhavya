import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Clock() {
  const [time, setTime] = useState(new Date());

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
      className="absolute"
      style={{ top: "5%", right: "2%" }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      data-testid="desk-clock"
    >
      <div
        className="rounded-lg px-4 py-3 select-none"
        style={{
          background: "rgba(10,8,5,0.85)",
          border: "1px solid rgba(245,166,35,0.3)",
          boxShadow: "0 0 20px rgba(245,166,35,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div
          className="font-mono text-3xl tracking-widest leading-none"
          style={{ color: "#F5A623", textShadow: "0 0 10px rgba(245,166,35,0.6)" }}
          data-testid="clock-time"
        >
          {h}
          <span className="opacity-60 animate-pulse">:</span>
          {m}
          <span className="opacity-60 animate-pulse">:</span>
          {s}
        </div>
        <div
          className="font-mono text-xs mt-1 text-center tracking-wider"
          style={{ color: "rgba(245,166,35,0.5)" }}
          data-testid="clock-date"
        >
          {dateStr}
        </div>
      </div>
    </motion.div>
  );
}
