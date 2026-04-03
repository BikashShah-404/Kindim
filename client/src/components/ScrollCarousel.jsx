import TopProductCard from "@/pages/Product/TopProductCard";
import HeartIcon from "./HeartIcon.jsx";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const ScrollCarousel = ({ topProducts: data }) => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const rawX = useTransform(scrollYProgress, [0, 1], ["1.5%", "-80%"]);
  const x = useSpring(rawX, { stiffness: 100, damping: 50 });

  return (
    <div className="relative h-[500vh] will-change-transform" ref={targetRef}>
      <div
        className="sticky top-0 h-[100vh] overflow-hidden bg-gradient-to-br from-black via-gray-700 to-gray-950 
 "
      >
        <div className="absolute top-[10vh]  w-full flex justify-between items-end left-8  font-semibold text-3xl text-white font-alegreya">
          <span>
            <span className="text-amber-600">Top </span> Rated Products
          </span>
          <Link
            className="text-lg mr-20  underline underline-offset-4 text-center"
            to={"/shop"}
          >
            VIEW ALL
          </Link>
        </div>

        <div className="flex h-full mt-10 items-center  overflow-hidden">
          <motion.div className="flex gap-x-8 gap-y-4" style={{ x }}>
            {data.map((eachTopProduct) => (
              <AnimatePresence key={eachTopProduct._id}>
                <motion.div
                  initial={{ scale: 0.8, x: 50, opacity: 0.5 }}
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileInView={{ scale: 1, x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative"
                >
                  <Link
                    to={`/product/${eachTopProduct._id}`}
                    className="hover:z-10 "
                  >
                    <TopProductCard product={eachTopProduct} />
                  </Link>
                  <div className="absolute right-1 top-1">
                    <HeartIcon product={eachTopProduct} />
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}{" "}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScrollCarousel;
