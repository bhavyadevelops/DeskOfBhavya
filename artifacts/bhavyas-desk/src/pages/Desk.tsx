import { useState } from "react";
import { motion } from "framer-motion";
import StickyNotes from "@/components/desk/StickyNotes";
import Laptop from "@/components/desk/Laptop";
import Books from "@/components/desk/Books";
import Phone from "@/components/desk/Phone";
import Papers from "@/components/desk/Papers";
import Clock from "@/components/desk/Clock";
import Pen from "@/components/desk/Pen";
import Achievements from "@/components/desk/Achievements";
import WaterBottle from "@/components/desk/WaterBottle";

export default function Desk() {
  const [scribbleMode, setScribbleMode] = useState(false);

  return (
    <div
      className="w-full h-[100dvh] overflow-hidden flex items-center justify-center"
      style={{ background: "#0d0a06" }}
    >
      {/* Ambient room glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(80,50,10,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Desk surface */}
      <motion.div
        className="desk-surface relative"
        style={{
          width: "min(1200px, 100vw)",
          height: "min(720px, 100vh)",
          borderRadius: "12px",
          overflow: "visible",
          boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Desk grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: "12px",
            background:
              "repeating-linear-gradient(88deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 3px)",
            zIndex: 1,
          }}
        />

        {/* Nameplate */}
        <motion.div
          className="absolute font-serif tracking-widest uppercase select-none"
          style={{
            top: "3%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(245,200,100,0.18)",
            fontSize: "11px",
            letterSpacing: "0.4em",
            zIndex: 2,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Bhavya's Desk
        </motion.div>

        {/* Hint */}
        <motion.div
          className="absolute font-sans select-none"
          style={{
            bottom: "2.5%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(245,200,100,0.12)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            zIndex: 2,
            whiteSpace: "nowrap",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          click objects to explore
        </motion.div>

        {/* ── Objects ── */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          <StickyNotes />
          <Achievements />
          <Clock />
          <Laptop />
          <Books />
          <Phone />
          <Papers />
          <Pen scribbleMode={scribbleMode} setScribbleMode={setScribbleMode} />
          <WaterBottle />
        </div>
      </motion.div>
    </div>
  );
}
