import Home from "../assets/Home.png";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const HomeImage = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const discoverOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.45],
    [1, 1, 0],
  );
  const scrollOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.5, 0.65],
    [0, 1, 0],
  );
  const shopOpacity = useTransform(
    scrollYProgress,
    [0.65, 0.75, 0.85],
    [0, 1, 0],
  );
  const repeatOpacity = useTransform(
    scrollYProgress,
    [0.85, 0.9, 1],
    [0, 1, 0.5],
  );

  return (
    <div className="relative h-[400vh] scroll-smooth" ref={targetRef}>
      <div className="sticky inset-0 h-screen overflow-hidden">
        <img src={Home} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="sticky top-0 flex h-screen items-center justify-end px-8 ">
        <div className="w-full h-full  relative text-black flex justify-center items-center text-[20vw] italic">
          <motion.div style={{ opacity: discoverOpacity }} className="absolute">
            Discover
          </motion.div>
          <motion.div style={{ opacity: scrollOpacity }} className="absolute">
            Scroll
          </motion.div>
          <motion.div style={{ opacity: shopOpacity }} className="absolute">
            Shop
          </motion.div>
          <motion.div style={{ opacity: repeatOpacity }} className="absolute">
            Repeat
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeImage;
