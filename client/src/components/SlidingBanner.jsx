import { animate } from "motion";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import useMeasure from "react-use-measure";

const highlights = [
  "Premium Quality Guaranteed",
  "New Arrivals Every Week",
  "Easy Returns & Exchanges",
  "Free Shipping Over $50",
  "Secure Payments",
  "24/7 Customer Support",
];

const SlidingBanner = () => {
  return (
    <div className="w-full h-16 bg-black relative overflow-hidden flex items-center">
      <AnimatePresence>
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{
            x: ["0%", "-100%"],
            transition: { ease: "linear", duration: 10, repeat: Infinity },
          }}
        >
          {[...highlights, ...highlights].map((each, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / highlights.length}%` }}
            >
              <div className="flex items-center justify-around text-lg italic font-alegreya">
                {each}
                <span className="text-amber-400 not-italic">·</span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SlidingBanner;
