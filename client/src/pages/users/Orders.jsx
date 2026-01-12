import { motion } from "motion/react";
import { useSelector } from "react-redux";

const Orders = () => {
  // const {} = useSelector(sta);

  return (
    <motion.div
      className="w-screen h-screen bg-red-900"
      initial={{
        scale: 0,
        opacity: 0,
        transformOrigin: "bottom right",
      }}
      animate={{
        scale: 1,
        opacity: 1,
        transformOrigin: "bottom right",
      }}
      exit={{
        scale: 0,
        opacity: 0,
        transformOrigin: "bottom right",
      }}
      transition={{ duration: 0.6 }}
    >
      Orders
    </motion.div>
  );
};

export default Orders;
