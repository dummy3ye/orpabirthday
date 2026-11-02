"use client";

import { motion, useReducedMotion } from "framer-motion";
import { NextButton } from "@/components/NextButton";
import { nextRoute } from "@/lib/flow";

const letter = {
  greeting: "Happy Birthday, Orpa.",
  paragraphs: [
    "Today is your day, and I wanted to make something just for you. Not a card from a shop, not a quick message, but a little place built with all my love.",
    "You make ordinary days feel special, and I'm grateful for every moment with you. I hope today is filled with laughter, good food, and everything that makes you smile.",
    "Take your time and enjoy this.",
  ],
  signoff: "Yours,",
  name: "nonvez",
};

export default function StartingCard() {
  const reduceMotion = useReducedMotion();

  return (
    <main
      className="flex min-h-dvh items-center justify-center overflow-x-hidden px-5 py-8 sm:px-8"
    >
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-full max-w-[36rem] rounded-[1.25rem] bg-[#f7ede3] px-7 py-9 shadow-[0_24px_70px_rgba(8,4,15,0.35)] sm:px-12 sm:py-12 md:px-16 md:py-14"
      >
        <div className="text-left">
          <h1 className="font-title text-[3.75rem] leading-[1.1] font-normal tracking-[-0.01em] text-[#5b3048] sm:text-[4.25rem]">
            {letter.greeting}
          </h1>
          <div className="mt-7 space-y-5 font-body text-[1.25rem] font-normal leading-[1.75] text-[#332b31]">
            {letter.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-7 font-body text-[1.25rem] font-normal leading-[1.4] text-[#332b31]">
            <p className="italic">{letter.signoff}</p>
            <p className="mt-1 font-display text-[2.75rem] font-normal italic leading-[1.1] text-[#5b3048] [font-variation-settings:'SOFT'_100,'opsz'_144]">
              {letter.name}
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <NextButton href={nextRoute} />
        </div>
      </motion.article>
    </main>
  );
}
