"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CakePhase } from "@/lib/cakeStore";
import { CAKE_TIMINGS } from "@/lib/cakeTimings";

type Copy = {
  name: string;
  wish: string;
  button: string;
  soundHint: string;
  caption: (name: string) => string;
};

const CAT_BUBBLE_BASE =
  "rounded-2xl bg-[#f7ede3] px-5 py-4 text-left font-body leading-snug text-[#5b3048] shadow-[0_12px_30px_rgba(8,4,15,0.28)]";
const CAT_BUBBLE_POS =
  "absolute -left-28 bottom-46 sm:-left-32 sm:bottom-50";
const BUBBLE_ARROW =
  "absolute -bottom-1 right-2 h-5 w-5 rotate-45 bg-[#f7ede3]";

export function Overlay({
  copy,
  phase,
  onBlow,
  wishComplete,
  onWishComplete,
  onMic,
  micMessage,
}: {
  copy: Copy;
  phase: CakePhase;
  onBlow: () => void;
  wishComplete: boolean;
  onWishComplete: () => void;
  onMic: () => void;
  micMessage: string;
}) {
  const [holding, setHolding] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const timer = useRef<number | null>(null);
  const showWish = phase === "wish" || phase === "ready";
  const showButton = phase === "ready" && wishComplete;
  const showAfterBlow = ["dark", "celebrating", "done"].includes(phase);
  const afterBlowMessage =
    "ummmm, so candles done, I wishh tor jonne right now, Red Velvet cake niye ashte partam, I hope parbo oneday. aso onek things ache shamne, lets go";

  useEffect(() => {
    if (!showAfterBlow) return;

    let character = 0;
    const typewriter = window.setInterval(() => {
      character += 1;
      setTypedMessage(afterBlowMessage.slice(0, character));
      if (character >= afterBlowMessage.length) {
        window.clearInterval(typewriter);
      }
    }, 28);

    return () => window.clearInterval(typewriter);
  }, [showAfterBlow]);

  const beginWish = useCallback(() => {
    if (wishComplete || timer.current) return;
    setHolding(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onWishComplete();
    }, CAKE_TIMINGS.wishHold);
  }, [onWishComplete, wishComplete]);
  const cancelWish = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }, []);

  useEffect(() => {
    if (!showWish || wishComplete) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !event.repeat) {
        event.preventDefault();
        beginWish();
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") cancelWish();
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [beginWish, cancelWish, showWish, wishComplete]);

  return (
    <div aria-live="polite" className="absolute inset-0 z-10 flex flex-col items-center">
      {/* ---- Cat + speech bubble (wish phase) ---- */}
      {showWish ? (
        <motion.div
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-none absolute bottom-3 right-3 sm:bottom-5 sm:right-6"
        >
          {!wishComplete ? (
            <div className={`${CAT_BUBBLE_POS} w-56 ${CAT_BUBBLE_BASE} text-lg`}>
              <span className={BUBBLE_ARROW} />
              <span className="relative">{copy.wish}</span>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${CAT_BUBBLE_POS} w-64 ${CAT_BUBBLE_BASE} text-lg font-medium`}
            >
              <span className="absolute -bottom-1 right-5 h-5 w-5 rotate-45 bg-[#f7ede3]" />
              <span className="relative">Happpyyyyyyyy Birthday To Youuu, Arinaaa!</span>
            </motion.div>
          )}
          <Image
            src="/cat-orpa.png"
            alt="A friendly cat"
            width={210}
            height={210}
            priority
            className="h-auto w-[150px] sm:w-[210px]"
          />
        </motion.div>
      ) : null}

      {/* ---- Cat + typewriter bubble (after blow) ---- */}
      {showAfterBlow ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute bottom-3 right-3 sm:bottom-5 sm:right-6"
        >
          <div
            role="alert"
            className={`${CAT_BUBBLE_POS} w-64 ${CAT_BUBBLE_BASE} text-base sm:text-lg`}
          >
            <span className={BUBBLE_ARROW} />
            <span className="relative">{typedMessage}</span>
          </div>
          <Image
            src="/cat-orpa.png"
            alt="A friendly cat"
            width={210}
            height={210}
            className="h-auto w-[150px] sm:w-[210px]"
          />
        </motion.div>
      ) : null}

      {/* ---- "Hold Space to make your wish" button ---- */}
      {showWish && !wishComplete && (phase === "wish" || phase === "ready") ? (
        <button
          type="button"
          aria-label="Hold Space to make your wish"
          onPointerDown={beginWish}
          onPointerUp={cancelWish}
          onPointerLeave={cancelWish}
          onKeyDown={(event) => {
            if ((event.key === " " || event.key === "Enter") && !event.repeat) {
              event.preventDefault();
              beginWish();
            }
          }}
          onKeyUp={(event) => {
            if (event.key === " " || event.key === "Enter") cancelWish();
          }}
          className={`pointer-events-auto absolute bottom-[8vh] left-1/2 h-16 -translate-x-1/2 rounded-full border-2 border-[#f7ede3]/70 px-7 font-body text-base text-[#f7ede3] shadow-[0_0_24px_rgba(247,237,227,0.2)] transition sm:px-9 sm:text-lg ${holding ? "scale-105 bg-[#f7ede3]/20" : "bg-transparent hover:bg-[#f7ede3]/10"}`}
        >
          {holding ? "Keep holding…" : "Hold Space to make your wish"}
        </button>
      ) : null}

      {/* ---- "Blow the candles" button ---- */}
      {showButton ? (
        <div className="pointer-events-auto absolute bottom-[7vh] text-center">
          <motion.button
            type="button"
            onClick={onBlow}
            className="cursor-pointer rounded-full bg-[#f7ede3] px-7 py-3 font-body text-xl font-medium text-[#5b3048] shadow-[0_0_30px_rgba(247,237,227,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(247,237,227,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f7d8d5]"
          >
            {copy.button}
          </motion.button>
          <button type="button" onClick={onMic} className="mt-3 block w-full cursor-pointer font-body text-sm italic text-[#f7ede3]/70 underline-offset-4 hover:text-[#f7ede3] hover:underline">
            or blow into your microphone
          </button>
          <p className="mt-2 font-body text-base italic text-[#f7ede3]/65">{micMessage || copy.soundHint}</p>
        </div>
      ) : null}
    </div>
  );
}
