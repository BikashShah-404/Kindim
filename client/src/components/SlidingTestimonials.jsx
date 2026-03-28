import { Quote } from "lucide-react";
import { animate } from "motion";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { FaUser } from "react-icons/fa";
import useMeasure from "react-use-measure";
import StarRating from "./StarRating";

const SlidingTestimonials = ({ topReviews }) => {
  console.log(topReviews);

  let [ref, { width }] = useMeasure();

  const xTranslation = useMotionValue(0);
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.stop();

    if (!width) return;

    const finalPosition = -width / 2 - 16;

    // storing the returned animation controls so we can pause/resume/stop later
    animationRef.current = animate(xTranslation, [0, finalPosition], {
      ease: "linear",
      duration: 50,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    });

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
    };
  }, [xTranslation, width]);

  // pause/resume helpers
  const handleMouseEnter = () => {
    // pause if the API is available
    if (animationRef.current?.pause) {
      animationRef.current.pause();
    } else {
      // fallback: stop the animation but keep current value
      animationRef.current?.stop();
    }
  };

  const handleMouseLeave = () => {
    // resume if the API is available
    if (animationRef.current?.play) {
      animationRef.current.play();
    } else {
      // fallback: restart animation from current value
      // compute current value and restart animation from there to finalPosition
      const current = xTranslation.get();
      const finalPosition = -width / 2 - 16;
      animationRef.current = animate(xTranslation, [current, finalPosition], {
        ease: "linear",
        duration: 50,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }
  };

  return (
    <div className="w-full overflow-hidden flex items-center py-4">
      <AnimatePresence>
        <motion.div
          className="flex items-center gap-10"
          ref={ref}
          style={{ x: xTranslation }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {[...topReviews, ...topReviews].map((eachTopReview, index) => (
            <AnimatePresence key={index}>
              <motion.div
                className="h-[250px] min-w-[500px]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 4,
                  type: "spring",
                }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col items-center text-lg italic font-alegreya h-full rounded-xl bg-gradient-to-br from-black via-gray-700 to-gray-900 px-10 py-4 gap-y-4">
                  <Quote className="text-amber-600 self-start" />
                  <span className="pl-8 bg flex-1">{eachTopReview.review}</span>
                  <div className="flex gap-x-2 items-center self-start">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center">
                      {eachTopReview.reviewBy.profilePic ? (
                        <img
                          src={eachTopReview.reviewBy.profilePic}
                          alt={`${eachTopReview.reviewBy.username}.png`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex flex-col h-full">
                      <span>{eachTopReview.reviewBy.username}</span>
                      <span className="">
                        <StarRating rating={eachTopReview.rating} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SlidingTestimonials;
