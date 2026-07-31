import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAPERS = [
  {
    id: 1,
    title: "ResumeIQ: AI-powered ATS",
    preview: "AI-powered recommendation engine for resumes, CVs...",
    rotation: -6,
    x: "25%",
    y: "58%",
    body: `The hiring process has always felt strangely asymmetric to me.

Candidates spend hours refining resumes, choosing words carefully, and presenting years of work on a single page. Yet most never get feedback. A rejection email arrives, or more often, nothing arrives at all.

The frustrating part isn't rejection. It's opacity.

You don't know whether your experience was weak, your formatting was poor, your keywords didn't match, or your application never made it past the first screening stage.

ResumeIQ started from a simple question:

What if candidates could see their resumes the way an ATS and recruiter see them?

The goal isn't to game hiring systems. It's to make the process more transparent. If there are gaps, they should be visible. If a resume is strong, candidates should understand why. If improvements are possible, they should be actionable rather than mysterious.

A resume shouldn't be a black box. Neither should the systems evaluating it.`,
  },
  {
    id: 2,
    title: "MRAI: Moral reasoning Agentic AI",
    preview:
      "If in a situation where death could be prevented by lying, how would AI justify...",
    rotation: 4,
    x: "40%",
    y: "62%",
    body: `If in a situation where death could be prevented by lying, how would AI justify the decision?Most AI systems can explain what they know.

Far fewer can explain why they believe a decision is the right one.

That distinction becomes important the moment AI moves beyond answering questions and starts making recommendations, evaluating choices, or participating in decisions that affect people.

I'm interested in whether moral reasoning can be treated as a structured process rather than an abstract concept.

Not a system that claims to know what's right and wrong.

A system that can identify stakeholders, surface trade-offs, analyze consequences, evaluate competing principles, and make its reasoning transparent enough for humans to challenge.

The objective isn't to replace human judgment.

It's to build AI that reasons in a way humans can inspect, question, and ultimately trust.

Whether that's possible remains an open question.

That's precisely why it's worth exploring.`,
  },
  {
    id: 3,
    title: "On Building Beyopnd Code",
    preview:
      "When I first started building projects, I assumed the hardest problems would be technical, but I was wrong...",
    rotation: -2,
    x: "52%",
    y: "62%",
    body: `When I first started building projects, I assumed the hardest problems would be technical.

I was wrong.

Most projects don't fail because the code is impossible to write. They fail because priorities change, requirements become unclear, deadlines slip, communication breaks down, or execution loses direction.

The more builders I study, the more I realize that successful products are rarely the result of engineering alone.

They're the result of coordinated decisions made over time.

That's what drew me toward program management.

Not because I want to spend less time building, but because I want to understand how ambitious ideas move from concept to execution without losing momentum along the way.

Writing code creates possibilities.

Managing projects turns those possibilities into outcomes.`,
  },
];

export default function Papers() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      {PAPERS.map((paper) => (
        <motion.div
          key={paper.id}
          className="absolute cursor-pointer select-none"
          style={{ left: paper.x, top: paper.y }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + paper.id * 0.1, duration: 0.5 }}
          whileHover={{
            y: -8,
            scale: 1.04,
            rotate: 0,
            boxShadow: "6px 12px 30px rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
          onClick={() => setSelected(paper.id)}
          data-testid={`paper-${paper.id}`}
        >
          <div
            className="rounded-sm"
            style={{
  width: 120,
  padding: "12px 12px 16px",
  background: "linear-gradient(160deg, #faf6ec 0%, #f5eedc 100%)",
  transform: `rotate(${paper.rotation}deg)`,
  boxShadow: "2px 4px 16px rgba(0,0,0,0.35)",
  border: "1px solid rgba(180,160,100,0.3)",
}}
          >
            {/* Ruled lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full"
                style={{
                  height: 1,
                  background: "rgba(150,120,60,0.15)",
                  marginBottom: 7,
                }}
              />
            ))}

            <div
              className="font-serif font-bold leading-tight mb-1.5"
              style={{ color: "#2a1a0a", fontSize: "9px" }}
            >
              {paper.title}
            </div>
            <div
              className="font-sans leading-snug"
              style={{ color: "#6a4a2a", fontSize: "7.5px", opacity: 0.8 }}
            >
              {paper.preview}
            </div>
            <div
              className="font-mono mt-2"
              style={{ color: "rgba(180,140,60,0.5)", fontSize: "6px" }}
            >
              click to read
            </div>
          </div>
        </motion.div>
      ))}

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            data-testid="paper-modal-overlay"
          >
            <motion.div
              className="relative rounded-sm"
              style={{
                width: 480,
                maxHeight: "70vh",
                background: "linear-gradient(160deg, #faf6ec 0%, #f0e8d0 100%)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
                padding: "32px 36px",
                overflowY: "auto",
                border: "1px solid rgba(180,160,100,0.4)",
              }}
              initial={{ scale: 0.85, y: 40, rotate: -3 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.85, y: 40, rotate: 3 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              data-testid="paper-modal"
            >
              {/* Ruled lines in background */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-8 right-8"
                  style={{
                    top: 32 + i * 26,
                    height: 1,
                    background: "rgba(150,120,60,0.12)",
                  }}
                />
              ))}

              {PAPERS.filter((p) => p.id === selected).map((p) => (
                <div key={p.id} className="relative z-10">
                  <h2
                    className="font-serif text-2xl font-bold mb-2"
                    style={{ color: "#2a1a0a" }}
                  >
                    {p.title}
                  </h2>
                  <div
                    className="font-mono text-xs mb-4"
                    style={{ color: "#b8966e" }}
                  >
                    Bhavya's Desk — Notes
                  </div>
                  <p
                    className="font-sans text-sm leading-loose whitespace-pre-line"
                    style={{ color: "#3a2a1a" }}
                  >
                    {p.body}
                  </p>
                </div>
              ))}

              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 font-mono text-xs hover:opacity-60 transition-opacity"
                style={{ color: "#8b7355" }}
                data-testid="paper-close"
              >
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
