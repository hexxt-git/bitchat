import { motion } from "motion/react";
import { steps } from "motion";

/**
 * bit style auth loading indicator.
 * Bouncing pixel blocks with stepped animation for a retro feel.
 */
export function AuthLoadingIndicator() {
  return (
    <div className="h-svh w-full flex flex-col items-center justify-center gap-8 bg-base-100">
      <div
        className="flex items-end gap-1.5"
        style={{ height: 36 }}
        aria-hidden
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 shrink-0 border-2 border-foreground bg-foreground"
            style={{ imageRendering: "pixelated" }}
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.12,
              ease: steps(4),
            }}
          />
        ))}
      </div>
      <p className="text-xs text-base-content/70">Loading...</p>
    </div>
  );
}
