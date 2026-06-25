"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { StarDivider, StarWatermark } from "./icons/ornaments";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
      <StarWatermark className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 text-emerald opacity-[0.06] sm:h-96 sm:w-96" />
      <StarWatermark className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 text-gold opacity-[0.05] sm:h-80 sm:w-80" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          dir="rtl"
          className="font-arabic text-2xl text-emerald/70 sm:text-3xl"
        >
          تَدَبُّر
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-balance mt-5 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-6xl"
        >
          {siteConfig.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-balance mt-5 font-body text-lg italic text-ink-soft sm:text-xl"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.32 }}
        >
          <StarDivider className="my-8" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.36 }}
          className="text-balance mx-auto max-w-xl font-body text-base leading-relaxed text-ink-soft sm:text-[1.05rem]"
        >
          This website is a collection of personal reflections inspired by reading the
          Qur&rsquo;an and authentic tafsir. These writings are{" "}
          <span className="font-medium text-emerald">not tafsir</span>, but personal
          lessons, observations, and reflections derived from study and contemplation.
        </motion.p>
      </div>
    </section>
  );
}
