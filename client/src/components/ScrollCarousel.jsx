import TopProductCard from "@/pages/Product/TopProductCard";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";

const ScrollCarousel = ({ title, topProducts: data }) => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const rawX = useTransform(scrollYProgress, [0, 1], ["1%", "-60%"]);
  const x = useSpring(rawX, { stiffness: 100, damping: 30, mass: 0.5 });

  return (
    <div className="relative h-[300vh] will-change-transform" ref={targetRef}>
      <div
        className="sticky top-0 h-[100vh] overflow-hidden bg-gradient-to-br from-black via-gray-700 to-gray-600 ;
 "
      >
        <div className="absolute top-40 left-8 font-semibold text-xl text-white">
          {title}
        </div>

        <div className="flex h-full items-center overflow-hidden">
          <motion.div className="flex gap-x-8 gap-y-4" style={{ x }}>
            {data.map((eachTopProduct) => (
              <Link
                to={`/product/${eachTopProduct._id}`}
                className="hover:z-10"
                key={eachTopProduct._id}
              >
                <motion.div
                  whileHover={{
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className=""
                >
                  <TopProductCard product={eachTopProduct} />
                </motion.div>
              </Link>
            ))}{" "}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ScrollCarousel;
