import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONTACTS = [
  {
    label: "Email",
    value: "bhavyadevelops@gmail.com",
    href: "mailto:bhavyadevelops@gmail.com",
    color: "#EA4335",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "bhavya-chokshi369",
    href: "https://www.linkedin.com/in/bhavya-chokshi369",
    color: "#0077B5",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "WhatsApp / Call",
    value: "+91 94261 11036",
    href: "https://wa.me/919426111036",
    color: "#25D366",
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.998 2a9.998 9.998 0 0 0-8.703 14.942L2 22l5.243-1.267A9.998 9.998 0 1 0 11.998 2z" />
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
      {/* Phone body */}
      <div
        className="relative rounded-2xl"
        style={{
          width: 72,
          height: 136,
          background: "linear-gradient(160deg, #1c1c1e 0%, #141414 100%)",
          boxShadow: awake
            ? "0 0 30px rgba(37,211,102,0.15), 0 8px 24px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)"
            : "0 8px 24px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 20, height: 5, background: "#0a0a0a" }}
        />

        {/* Screen */}
        <div
          className="absolute rounded-xl overflow-hidden"
          style={{
            top: 10, left: 4, right: 4, bottom: 10,
            background: awake ? "linear-gradient(160deg, #111a12 0%, #0a110b 100%)" : "#0a0a0a",
            transition: "background 0.4s ease",
          }}
        >
          <AnimatePresence>
            {awake && (
              <motion.div
                className="absolute inset-0 flex flex-col p-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div
                  className="font-serif text-center font-bold mb-2"
                  style={{ color: "#fff", fontSize: "7.5px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 4 }}
                >
                  Reach Bhavya
                </div>

                {/* Contact links */}
                {CONTACTS.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 mb-1.5 rounded-md p-1.5 no-underline"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                    initial={{ x: 16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.07, duration: 0.22 }}
                    whileHover={{ background: "rgba(255,255,255,0.09)" }}
                    data-testid={`phone-contact-${i}`}
                  >
                    <div
                      className="rounded flex items-center justify-center shrink-0"
                      style={{ width: 16, height: 16, background: c.color }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div className="font-sans font-semibold" style={{ color: "rgba(255,255,255,0.9)", fontSize: "6px" }}>
                        {c.label}
                      </div>
                      <div className="font-mono" style={{ color: "rgba(255,255,255,0.35)", fontSize: "5px", marginTop: 1 }}>
                        {c.value}
                      </div>
                    </div>
                  </motion.a>
                ))}

                {/* WhatsApp call CTA */}
                <motion.a
                  href="https://wa.me/919426111036"
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="mt-auto rounded-md flex items-center justify-center gap-1 no-underline"
                  style={{
                    padding: "5px 2px",
                    background: "#25D366",
                    color: "#fff",
                    fontSize: "6px",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  whileHover={{ scale: 1.03 }}
                  data-testid="phone-call"
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M11.998 2a9.998 9.998 0 0 0-8.703 14.942L2 22l5.243-1.267A9.998 9.998 0 1 0 11.998 2z" />
                  </svg>
                  Message on WhatsApp
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>

          {!awake && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full"
              style={{ width: 16, height: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          )}
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 20, height: 3, background: "rgba(255,255,255,0.15)" }}
        />
      </div>

      <motion.div className="font-sans text-center mt-1" style={{ color: "rgba(255,255,255,0.25)", fontSize: "8px" }}>
        {awake ? "tap to sleep" : "tap to wake"}
      </motion.div>
    </motion.div>
  );
}
