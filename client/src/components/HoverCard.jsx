import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const HoverCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      className="relative w-full h-96 md:h-full lg:h-96 rounded-2xl overflow-hidden cursor-pointer flex justify-center items-center"
      initial={{ scale: 0.9 }}
      whileInView={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full w-full rounded-2xl overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />{" "}
      </div>

      <motion.div
        className="absolute inset-0 bg-black/60  items-center justify-center hidden md:flex"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.p
          className="text-white text-2xl font-alegreya w-full h-full flex flex-col items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() =>
            navigate(`/shop`, { state: { query: data.keywords.join(" ") } })
          }
        >
          <span className="text-4xl">{data.name}</span>
          <span>{data.count} products</span>
        </motion.p>
      </motion.div>

      <div className="absolute inset-0 bg-black/40  flex items-center justify-center md:hidden">
        <div className="text-white text-2xl font-alegreya w-full h-full flex flex-col items-center justify-center opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity duration-300">
          <span className="text-4xl">{data.name}</span>
          <span>{data.count} products</span>
        </div>
      </div>
    </motion.div>
  );
};

export default HoverCard;
