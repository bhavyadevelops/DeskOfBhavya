import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type BatteryManager = {
  level: number;
  charging: boolean;
  addEventListener(type: string, cb: () => void): void;
  removeEventListener(type: string, cb: () => void): void;
};

function getBatteryColor(level: number) {
  if (level > 0.5) return { fill: "rgba(100,220,180,0.7)", stroke: "rgba(100,220,180,0.9)" };
  if (level > 0.2) return { fill: "rgba(245,190,60,0.7)", stroke: "rgba(245,190,60,0.9)" };
  return { fill: "rgba(240,80,60,0.7)", stroke: "rgba(240,80,60,0.9)" };
}

export default function WaterBottle() {
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);

  useEffect(() => {
    let bm: BatteryManager | null = null;

    const update = () => {
      if (bm) setBattery({ level: bm.level, charging: bm.charging });
    };

    const nav = navigator as { getBattery?: () => Promise<BatteryManager> };
    if (typeof nav.getBattery === "function") {
      nav.getBattery().then((b) => {
        bm = b;
        update();
        b.addEventListener("levelchange", update);
        b.addEventListener("chargingchange", update);
      });
    }

    return () => {
      if (bm) {
        bm.removeEventListener("levelchange", update);
        bm.removeEventListener("chargingchange", update);
      }
    };
  }, []);

  const pct = battery ? Math.round(battery.level * 100) : null;
  const charging = battery?.charging ?? false;

  // Bottle liquid area: from y=22 to y=64 (42px total)
  const liquidTop = 22;
  const liquidBottom = 64;
  const liquidHeight = liquidBottom - liquidTop; // 42

  const fillFraction = battery ? battery.level : 0.6; // default decorative fill
  const fillHeight = Math.round(fillFraction * liquidHeight);
  const fillY = liquidBottom - fillHeight;

  const colors = getBatteryColor(battery?.level ?? 0.6);

  return (
    <motion.div
      className="absolute select-none"
      style={{ top: "74%", left: "78%" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      whileHover={{ rotate: [0, -4, 4, -2, 0], transition: { duration: 0.5 } }}
      data-testid="water-bottle"
    >
      <svg width="34" height="76" viewBox="0 0 34 76" fill="none">
        {/* Cap */}
        <rect x="11" y="2" width="12" height="7" rx="3" fill="rgba(200,200,200,0.5)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

        {/* Bottle outline */}
        <path
          d="M7 14 Q5 18 5 24 L5 66 Q5 70 9 70 L25 70 Q29 70 29 66 L29 24 Q29 18 27 14 Z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="0.8"
        />

        {/* Liquid fill using clipPath */}
        <defs>
          <clipPath id="bottleclip">
            <path d="M7 14 Q5 18 5 24 L5 66 Q5 70 9 70 L25 70 Q29 70 29 66 L29 24 Q29 18 27 14 Z" />
          </clipPath>
          <linearGradient id="liquidGrad" x1="5" y1="0" x2="29" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={colors.fill} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colors.fill} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colors.fill} stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Liquid */}
        <rect
          x="3"
          y={fillY}
          width="28"
          height={fillHeight + 8}
          fill="url(#liquidGrad)"
          clipPath="url(#bottleclip)"
        />

        {/* Liquid surface ripple */}
        {battery && (
          <ellipse
            cx="17"
            cy={fillY}
            rx="11"
            ry="2"
            fill={colors.fill}
            clipPath="url(#bottleclip)"
            opacity="0.6"
          />
        )}

        {/* Shine */}
        <path d="M9 20 L9 55" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" clipPath="url(#bottleclip)" />

        {/* Charging bolt */}
        {charging && (
          <text x="17" y="50" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.85)">⚡</text>
        )}
      </svg>

      {/* Label */}
      <div className="text-center font-mono" style={{ fontSize: "8px", color: "rgba(200,200,200,0.5)", marginTop: 2 }}>
        {pct !== null ? `${pct}%` : "H2O"}
      </div>
      {pct !== null && (
        <div className="text-center font-mono" style={{ fontSize: "7px", color: "rgba(200,200,200,0.3)", marginTop: 1 }}>
          {charging ? "charging" : "battery"}
        </div>
      )}
    </motion.div>
  );
}
