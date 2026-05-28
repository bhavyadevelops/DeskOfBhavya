import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONTACTS = [
  {
    label: "Email",
    href: "mailto:bhavyadevelops@gmail.com",
    color: "#EA4335",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bhavya-chokshi369",
    color: "#0077B5",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919426111036",
    color: "#25D366",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M11.998 2a9.998 9.998 0 0 0-8.703 14.942L2 22l5.243-1.267A9.998 9.998 0 1 0 11.998 2z" />
      </svg>
    ),
  },
];

export default function Phone() {
  const [awake, setAwake] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ top: "48%", right: "14%", rotate: 8 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      onClick={() => setAwake(v => !v)}
      data-testid="phone"
    >
      <div
        className="relative rounded-2xl"
        style={{
          width: 72,
          height: 136,
          background: "linear-gradient(160deg, #1c1c1e 0%, #141414 100%)",
          boxShadow: awake
            ? "0 0 24px rgba(37,211,102,0.12), 0 8px 24px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 8px 24px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 20, height: 5, background: "#0a0a0a" }} />

        {/* Screen */}
        <div
          className="absolute rounded-xl overflow-hidden"
          style={{
            top: 10, left: 4, right: 4, bottom: 10,
            background: awake ? "#0d0d0d" : "#0a0a0a",
            transition: "background 0.4s ease",
          }}
        >
          <AnimatePresence>
            {awake && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {CONTACTS.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center justify-center rounded-full no-underline"
                    style={{ width: 36, height: 36, background: c.color, boxShadow: `0 4px 12px ${c.color}44` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 18 }}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    title={c.label}
                    data-testid={`phone-contact-${i}`}
                  >
                    {c.icon}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!awake && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full" style={{ width: 16, height: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
          )}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full" style={{ width: 20, height: 3, background: "rgba(255,255,255,0.15)" }} />
      </div>

      <motion.div className="font-sans text-center mt-1" style={{ color: "rgba(255,255,255,0.25)", fontSize: "8px" }}>
        {awake ? "tap to sleep" : "tap to wake"}
      </motion.div>
    </motion.div>
  );
}
