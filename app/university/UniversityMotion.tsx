"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export const universityEase = [0.22, 1, 0.36, 1] as const;

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: universityEase } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeOut" as const } },
} as const;

export const sectionTransition = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: universityEase } },
};

export const rowVariants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.28, ease: universityEase } },
};

export function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={sectionTransition.initial}
      whileInView={sectionTransition.enter}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: universityEase, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({
  children,
  className = "",
  delay = 0,
  ...props
}: HTMLMotionProps<"section"> & {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: universityEase, delay }}
      whileHover={{
        y: -2,
        borderColor: "#d8d3ff",
        boxShadow: "0 22px 58px rgba(15,23,42,0.08)",
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className={`university-card rounded-2xl border border-[#e7e8f0] bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="initial"
      whileInView="enter"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ enter: { transition: { staggerChildren: 0.04 } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedRow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={rowVariants} className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedAIPanel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: universityEase }}
      className={`relative h-full ${className}`}
    >
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: universityEase }}
        className="pointer-events-none absolute -inset-2 rounded-[28px] bg-[#6D5EF7]/10 blur-2xl"
      />
      <div className="relative h-full">{children}</div>
    </motion.section>
  );
}

export function AnimatedProgress({
  width,
  className = "h-2 rounded-full bg-[#6D5EF7]",
  style,
}: {
  width: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
      style={style}
    />
  );
}
