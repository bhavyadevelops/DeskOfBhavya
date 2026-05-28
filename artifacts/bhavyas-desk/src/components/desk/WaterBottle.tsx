import { motion } from "framer-motion";

export default function WaterBottle() {
  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{ top: "65%", left: "8%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      whileHover={{ rotate: [0, -4, 4, -2, 0], transition: { duration: 0.5 } }}
      data-testid="water-bottle"
    >
      <svg width="32" height="72" viewBox="0 0 32 72" fill="none">
        <rect x="10" y="2" width="12" height="6" rx="3" fill="rgba(180,220,255,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <path d="M6 12 Q4 16 4 22 L4 64 Q4 68 8 68 L24 68 Q28 68 28 64 L28 22 Q28 16 26 12 Z" fill="rgba(140,200,255,0.25)" stroke="rgba(180,220,255,0.5)" strokeWidth="0.8" />
        <path d="M6 12 Q4 16 4 22 L4 64 Q4 68 8 68 L24 68 Q28 68 28 64 L28 22 Q28 16 26 12 Z" fill="url(#bottleGrad)" />
        <defs>
          <linearGradient id="bottleGrad" x1="4" y1="0" x2="28" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(180,220,255,0.35)" />
            <stop offset="40%" stopColor="rgba(220,240,255,0.15)" />
            <stop offset="100%" stopColor="rgba(140,200,255,0.3)" />
          </linearGradient>
        </defs>
        <path d="M8 30 Q16 28 24 30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" fill="none" />
        <path d="M7 18 L7 58" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div className="text-center mt-1 font-mono" style={{ fontSize: "8px", color: "rgba(140,200,255,0.5)" }}>H2O</div>
    </motion.div>
  );
}
