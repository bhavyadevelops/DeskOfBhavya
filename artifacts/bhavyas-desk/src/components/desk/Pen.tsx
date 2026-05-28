import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface PenProps {
  scribbleMode: boolean;
  setScribbleMode: (v: boolean) => void;
}

export default function Pen({ scribbleMode, setScribbleMode }: PenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const draw = useCallback((e: MouseEvent) => {
    if (!drawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(245,166,35,0.6)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    }
    lastPoint.current = { x, y };
  }, []);

  const startDraw = useCallback((e: MouseEvent) => {
    drawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    lastPoint.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const endDraw = useCallback(() => {
    drawing.current = false;
    lastPoint.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !scribbleMode) return;
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);
    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
    };
  }, [scribbleMode, draw, startDraw, endDraw]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && scribbleMode) setScribbleMode(false);
  }, [scribbleMode, setScribbleMode]);

  useEffect(() => {
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <>
      {/* Scribble canvas overlay */}
      {scribbleMode && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-40"
          style={{ cursor: "crosshair", pointerEvents: "all" }}
          width={window.innerWidth}
          height={window.innerHeight}
          data-testid="scribble-canvas"
        />
      )}

      {scribbleMode && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <motion.button
            className="font-mono text-xs rounded-md px-4 py-2"
            style={{
              background: "rgba(20,15,5,0.9)",
              border: "1px solid rgba(245,166,35,0.4)",
              color: "#F5A623",
            }}
            onClick={clearCanvas}
            whileHover={{ scale: 1.05 }}
            data-testid="scribble-clear"
          >
            clear
          </motion.button>
          <motion.button
            className="font-mono text-xs rounded-md px-4 py-2"
            style={{
              background: "rgba(245,166,35,0.15)",
              border: "1px solid rgba(245,166,35,0.5)",
              color: "#F5A623",
            }}
            onClick={() => setScribbleMode(false)}
            whileHover={{ scale: 1.05 }}
            data-testid="scribble-exit"
          >
            done (esc)
          </motion.button>
        </div>
      )}

      {/* Pen object on desk */}
      <motion.div
        className="absolute cursor-pointer select-none"
        style={{ top: "55%", left: "32%", rotate: 25 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() => setScribbleMode(!scribbleMode)}
        whileHover={{ rotate: 20, scale: 1.1, filter: "brightness(1.3)" }}
        data-testid="pen"
      >
        <svg width="8" height="80" viewBox="0 0 8 80" fill="none">
          <rect x="1" y="8" width="6" height="60" rx="1" fill="url(#penBody)" />
          <polygon points="1,68 7,68 4,78" fill="#c0a060" />
          <polygon points="2.5,72 5.5,72 4,77" fill="#e8c880" />
          <rect x="1" y="5" width="6" height="5" rx="0.5" fill="#888" />
          <ellipse cx="4" cy="4" rx="3" ry="2" fill="#d44" />
          <defs>
            <linearGradient id="penBody" x1="0" y1="0" x2="8" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1a3a8a" />
              <stop offset="40%" stopColor="#2a5aaa" />
              <stop offset="100%" stopColor="#1a3a8a" />
            </linearGradient>
          </defs>
        </svg>
        <div
          className="font-mono text-center"
          style={{ color: "rgba(255,255,255,0.25)", fontSize: "7px", marginTop: 2, writingMode: "vertical-rl" }}
        >
          {scribbleMode ? "drawing..." : "scribble"}
        </div>
      </motion.div>
    </>
  );
}
