import Home from "../assets/Home.png";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const HomeImage = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const navigate = useNavigate();

  const discoverOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.3],
    [1, 1, 0],
  );
  const scrollOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.4, 0.5],
    [0, 1, 0],
  );
  const shopOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 0]);
  const repeatOpacity = useTransform(
    scrollYProgress,
    [0.7, 0.8, 0.9],
    [0, 1, 0],
  );
  const buttonDivOpacity = useTransform(
    scrollYProgress,
    [0.9, 0.95, 1],
    [0, 1, 1],
  );

  return (
    <div className="relative h-[500vh] scroll-smooth " ref={targetRef}>
      <div className="sticky top-0 h-screen overflow-hidden  ">
        <img src={Home} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="sticky top-0 flex h-screen items-center justify-end px-8  ">
        <div className="w-full h-full  relative text-black flex justify-center items-center text-7xl md:text-[20vw] italic font-berkshireswash  ">
          <motion.div
            style={{ opacity: discoverOpacity }}
            className="absolute "
          >
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
          <motion.div
            style={{ opacity: buttonDivOpacity }}
            className="absolute bottom-90"
          >
            <div className="flex flex-col gap-y-10 sm:flex-row sm:gap-y-0 gap-x-20">
              <button
                className="bg-gradient-to-r from-black via-gray-700 to-gray-600 px-16 md:px-20 py-3 text-white rounded-md cursor-pointer  h-fit   space-x-2  hover:bg-gradient-to-l text-xl tracking-widest text-center justify-center"
                onClick={() => navigate("/shop")}
              >
                SHOP NOW
              </button>
              <button
                className="bg-gradient-to-r from-black via-gray-700 to-gray-600  text-white rounded-md cursor-pointer   md:px-20 py-3  h-fit flex  items-center justify-center space-x-2  hover:bg-gradient-to-l text-xl tracking-widest  "
                onClick={() => navigate("/shop")}
              >
                Explore Categories
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomeImage;
