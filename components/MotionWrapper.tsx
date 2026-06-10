"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type MotionWrapperProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function MotionWrapper({
  children,
  className,
  delay = 0
}: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
