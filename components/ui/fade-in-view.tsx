"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeInView({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
