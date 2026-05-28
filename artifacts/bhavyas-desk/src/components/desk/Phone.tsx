import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONTACTS = [
  { icon: "✉", label: "Email", value: "bhavya@example.com", href: "mailto:bhavya@example.com", color: "#F5A623" },
  { icon: "in", label: "LinkedIn", value: "linkedin.com/in/bhavya", href: "https://linkedin.com/in/bhavya", color: "#0077b5", isText: true },
  { icon: "gh", label: "GitHub", value: "github.com/bhavya", href: "https://github.com/bhavya", color: "#8b949e", isText: true },
];

export default function Phone() {
  const [awake, setAwake] = useState(false);
  const [notification, setNotification] = useState(false);

  const handleClick = () => {
    if (!awake) {
      setAwake(true);
      setTimeout(() => setNotification(true), 1200);
    } else {
      setAwake(false);
      setNotification(false);
    }
  };

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ top: "48%", right: "14%", rotate: 8 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      onClick={handleClick}
      data-testid="phone"
    >
      {/* Phone body */}
      <div
        className="relative rounded-2xl"
        style={{
          width: 72,
          height: 130,
          background: "linear-gradient(160deg, #1c1c1e 0%, #141414 100%)",
          boxShadow: awake
            ? "0 0 30px rgba(245,166,35,0.2), 0 8px 24px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.1)"
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
            top: 10,
            left: 4,
            right: 4,
            bottom: 10,
            background: awake ? "linear-gradient(160deg, #1a1a2e 0%, #0f0f1a 100%)" : "#0a0a0a",
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
                <div
                  className="font-serif text-center mb-2 font-bold"
                  style={{ color: "#fff", fontSize: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 4 }}
                >
                  Contact Bhavya
                </div>

                {CONTACTS.map((c, i) => (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 mb-1.5 rounded-md p-1 no-underline"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08, duration: 0.25 }}
                    whileHover={{ background: "rgba(255,255,255,0.1)" }}
                    data-testid={`phone-contact-${i}`}
                  >
                    <div
                      className="rounded flex items-center justify-center shrink-0 font-mono font-bold"
                      style={{
                        width: 16,
                        height: 16,
                        background: c.color,
                        color: "#fff",
                        fontSize: c.isText ? "6px" : "9px",
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <div className="font-sans font-semibold" style={{ color: "rgba(255,255,255,0.9)", fontSize: "6.5px" }}>{c.label}</div>
                    </div>
                  </motion.a>
                ))}

                <motion.a
                  href="/resume.pdf"
                  onClick={e => e.stopPropagation()}
                  className="mt-auto rounded-md flex items-center justify-center no-underline"
                  style={{
                    padding: "5px 2px",
                    background: "#F5A623",
                    color: "#1a1a1a",
                    fontSize: "6.5px",
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 700,
                  }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.03 }}
                  data-testid="phone-resume"
                >
                  Download Resume
                </motion.a>

                <AnimatePresence>
                  {notification && (
                    <motion.div
                      className="absolute top-2 left-1 right-1 rounded"
                      style={{
                        background: "rgba(30,30,40,0.95)",
                        border: "1px solid rgba(245,166,35,0.4)",
                        padding: "4px 5px",
                      }}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="font-sans font-bold" style={{ color: "#F5A623", fontSize: "6px" }}>Notification</div>
                      <div className="font-sans" style={{ color: "rgba(255,255,255,0.7)", fontSize: "5.5px" }}>
                        Recruiter viewed your desk
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

      <motion.div
        className="font-sans text-center mt-1"
        style={{ color: "rgba(255,255,255,0.25)", fontSize: "8px" }}
      >
        {awake ? "tap to sleep" : "tap to wake"}
      </motion.div>
    </motion.div>
  );
}
