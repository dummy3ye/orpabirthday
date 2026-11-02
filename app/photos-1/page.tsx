"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type AttachmentStyle = "corner-tape" | "top-tape" | "dual-tape" | "washi-tape" | "brass-pin" | "wood-pin";

type Memory = {
  id: number;
  image: string;
  caption: string;
  note?: string;
  date?: string;
  desktopClass: string;
  mobileRotation: string;
  attachment: AttachmentStyle;
  tilt: number;
  aspectClass: string;
};

// Precisely spaced and sized to match each photo's true orientation
const MEMORIES: Memory[] = [
  {
    id: 1,
    image: "/photos/photo-1.png",
    caption: "pretty much the starting...",
    note: "that nervous first smile that changed everything for me.",
    date: " from those time to these day, You thumbs up is still the peak pose",
    desktopClass: "md:top-[2%] md:left-[3%] md:w-[15rem]",
    mobileRotation: "-rotate-[2.5deg]",
    aspectClass: "aspect-[9/16]",
    attachment: "corner-tape",
    tilt: -3,
  },
  {
    id: 2,
    image: "/photos/photo-2.png",
    caption: "the eyes-.",
    note: "the kind of smile that makes the whole world melt away.",
    date: "ahhh more like the Whole universe is packed there",
    desktopClass: "md:top-[2%] md:left-[27%] md:w-[26rem]",
    mobileRotation: "rotate-[2deg]",
    aspectClass: "aspect-[16/10]",
    attachment: "brass-pin",
    tilt: 2,
  },
  {
    id: 3,
    image: "/photos/photo-3.jpg",
    caption: "Nerd arinaaaa 😭",
    note: "tui really a great student, even boro hoyeo tor theke tui amar inspirations hoisos a lots of times.",
    date: "how can a bday be complete without nerd arina",
    desktopClass: "md:top-[2%] md:left-[76%] md:w-[15.5rem]",
    mobileRotation: "-rotate-[2deg]",
    aspectClass: "aspect-[9/16]",
    attachment: "dual-tape",
    tilt: -2.5,
  },
  {
    id: 4,
    image: "/photos/photo-4.jpg",
    caption: "The quietest days with you.",
    note: "just existing together is so so much more than enough.",
    date: "Sunday lazy air",
    desktopClass: "md:top-[60%] md:left-[3%] md:w-[26rem]",
    mobileRotation: "rotate-[2.5deg]",
    aspectClass: "aspect-[16/10]",
    attachment: "top-tape",
    tilt: 2.5,
  },
  {
    id: 5,
    image: "/photos/photo-5.jpg",
    caption: "Still laughing about this day.",
    note: "my stomach hurt from laughing so much with you ari.",
    date: "A goofy memory",
    desktopClass: "md:top-[50%] md:left-[37%] md:w-[22rem]",
    mobileRotation: "-rotate-[2deg]",
    aspectClass: "aspect-[3/4]",
    attachment: "washi-tape",
    tilt: -2,
  },
  {
    id: 6,
    image: "/photos/photo-6.jpg",
    caption: "just peak and perfection.",
    note: "the pose ? the .",
    date: "peiercing ta real bhabsilamm T-T",
    desktopClass: "md:top-[62%] md:left-[67%] md:w-[27rem]",
    mobileRotation: "rotate-[2deg]",
    aspectClass: "aspect-[16/10]",
    attachment: "wood-pin",
    tilt: 2,
  },
];

const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

/* ------------------------------------------------------------------ */
/* Single Seamless Solid Wood Slab Background                          */
/* ------------------------------------------------------------------ */

function SolidWoodSlabBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
      <div
        className="h-full w-full"
        style={{
          backgroundColor: "#8a4a27",
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 4px,
              rgba(65, 28, 10, 0.08) 5px,
              transparent 9px
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 40px,
              rgba(165, 95, 45, 0.12) 41px,
              transparent 80px
            ),
            radial-gradient(
              ellipse 80% 50% at 50% 45%,
              rgba(255, 195, 130, 0.28) 0%,
              rgba(140, 70, 35, 0.4) 55%,
              rgba(70, 30, 12, 0.8) 100%
            ),
            linear-gradient(
              160deg,
              #9b5630 0%,
              #844321 40%,
              #6e3316 75%,
              #5c270e 100%
            )
          `,
        }}
      >
        <svg className="h-full w-full opacity-40 mix-blend-overlay">
          <filter id="solid-wood-fibers">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.18" numOctaves="3" result="grain" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#solid-wood-fibers)" />
        </svg>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(35,14,5,0.45)_100%)] pointer-events-none" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Realistic Tapes & Pins                                             */
/* ------------------------------------------------------------------ */

function RealisticTape({
  className,
  variant = "crepe",
}: {
  className?: string;
  variant?: "crepe" | "washi" | "corner";
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-30 select-none ${className}`}
    >
      <div
        className={`relative h-6 w-20 shadow-[0_2px_5px_rgba(0,0,0,0.4),0_6px_14px_rgba(0,0,0,0.25)] backdrop-blur-[1px] ${
          variant === "washi"
            ? "border-y border-amber-100/60 bg-[#fff5df]/80 [background-image:repeating-linear-gradient(45deg,rgba(160,110,60,0.18)_0px,rgba(160,110,60,0.18)_2px,transparent_2px,transparent_7px)]"
            : variant === "corner"
            ? "h-5 w-16 border-y border-amber-100/70 bg-[#fffcf5]/80 [background-image:linear-gradient(90deg,rgba(255,255,255,0.7),rgba(245,230,200,0.6))]"
            : "border-y border-amber-100/80 bg-[#fffcee]/85 [background-image:linear-gradient(90deg,rgba(255,255,255,0.75),rgba(240,220,180,0.65))]"
        }`}
        style={{
          clipPath:
            "polygon(0% 4%, 3% 0%, 97% 2%, 100% 6%, 98% 95%, 96% 100%, 4% 98%, 0% 93%)",
        }}
      >
        <div className="absolute inset-x-2 top-1.5 h-[1px] bg-white/60" />
        <div className="absolute inset-x-3 bottom-1.5 h-[1px] bg-black/15" />
      </div>
    </div>
  );
}

function PushPin({ type = "brass" }: { type?: "brass" | "wood" }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-3.5 left-1/2 z-30 -translate-x-1/2 select-none"
    >
      <div className="absolute left-2 top-2.5 h-3.5 w-5 -rotate-12 rounded-full bg-black/75 blur-[2px]" />
      <div
        className={`relative flex h-5 w-5 items-center justify-center rounded-full border border-black/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_5px_10px_rgba(0,0,0,0.8)] ${
          type === "brass"
            ? "bg-gradient-to-br from-[#ffe7a3] via-[#cfa448] to-[#6d4d12]"
            : "bg-gradient-to-br from-[#eb7659] via-[#b83820] to-[#521307]"
        }`}
      >
        <div className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/90" />
      </div>
    </div>
  );
}

function CardAttachment({ type }: { type: AttachmentStyle }) {
  if (type === "brass-pin") return <PushPin type="brass" />;
  if (type === "wood-pin") return <PushPin type="wood" />;

  if (type === "corner-tape") {
    return (
      <>
        <RealisticTape variant="corner" className="-left-4 -top-3 -rotate-45" />
        <RealisticTape variant="corner" className="-bottom-3 -right-4 -rotate-45" />
      </>
    );
  }

  if (type === "dual-tape") {
    return (
      <>
        <RealisticTape className="-top-3 left-4 -rotate-6" />
        <RealisticTape className="-top-3 right-4 rotate-6" />
      </>
    );
  }

  if (type === "washi-tape") {
    return <RealisticTape variant="washi" className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />;
  }

  return <RealisticTape className="-top-3.5 left-1/2 -translate-x-1/2 -rotate-2" />;
}

/* ------------------------------------------------------------------ */
/* Polaroid Card                                                      */
/* ------------------------------------------------------------------ */

function PolaroidCard({
  memory,
  onSelect,
  isModal = false,
}: {
  memory: Memory;
  onSelect: () => void;
  isModal?: boolean;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={isModal ? { rotate: 0 } : { rotate: memory.tilt }}
      animate={isModal ? { rotate: 0 } : { rotate: memory.tilt }}
      whileHover={
        isModal
          ? undefined
          : {
              y: -12,
              scale: 1.05,
              rotate: memory.tilt,
              zIndex: 40,
              transition: { type: "spring", stiffness: 350, damping: 20 },
            }
      }
      whileTap={isModal ? undefined : { scale: 0.98 }}
      className={`group relative block text-left outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 ${
        isModal
          ? "w-full max-w-[min(90vw,32rem)] cursor-default"
          : `w-full cursor-zoom-in ${memory.mobileRotation} md:rotate-0 md:absolute ${memory.desktopClass}`
      }`}
      aria-label={`View photo: ${memory.caption}`}
    >
      <CardAttachment type={memory.attachment} />

      {/* Realistic White Polaroid Body */}
      <div className="relative rounded-[2px] bg-[#fffefb] p-3 pb-5 shadow-[0_6px_12px_rgba(0,0,0,0.3),0_20px_40px_rgba(0,0,0,0.55),inset_0_0_0_1px_rgba(0,0,0,0.06)] transition-all duration-300 group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.35),0_32px_65px_rgba(0,0,0,0.8)] sm:p-3.5 sm:pb-5">
        <div className={`relative block overflow-hidden rounded-[1px] bg-[#1a1410] shadow-[inset_0_2px_4px_rgba(0,0,0,0.55)] transition-all duration-300 ${memory.aspectClass}`}>
          {!imageError ? (
            <Image
              src={assetPath(memory.image)}
              alt=""
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 260px, 320px"
              className="object-cover transition duration-700 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#38261e] via-[#241712] to-[#120a06] p-4 text-center">
              <span className="font-handwriting text-2xl text-amber-200/70">Memory #{memory.id}</span>
              <span className="mt-2 text-3xl opacity-50">📷</span>
            </div>
          )}

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 opacity-60"
            aria-hidden="true"
          />
        </div>

        <div className="mt-3.5 px-1 text-center">
          <p className="font-handwriting text-2xl font-bold leading-tight tracking-tight text-[#2c1d14] sm:text-[1.65rem]">
            {memory.caption}
          </p>
          {memory.date && (
            <span className="mt-1 block font-handwriting text-base text-[#7c5f4d]">
              — {memory.date}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

function NavArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-900/60 bg-[#241711]/90 text-2xl font-light text-amber-100/90 shadow-[0_8px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition hover:scale-105 hover:border-amber-700/80 hover:bg-[#342017] hover:text-white focus-visible:outline-2 focus-visible:outline-amber-200"
      aria-label={`${direction === "prev" ? "Previous" : "Next"} memory`}
    >
      <span aria-hidden="true">{direction === "prev" ? "‹" : "›"}</span>
    </button>
  );
}

export default function PhotosOnePage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const openMemory = (index: number) => setActiveIndex(index);
  const closeMemory = () => setActiveIndex(null);

  const moveMemory = (step: number) => {
    if (activeIndex !== null) {
      openMemory((activeIndex + step + MEMORIES.length) % MEMORIES.length);
    }
  };

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMemory();
      if (event.key === "ArrowLeft") moveMemory(-1);
      if (event.key === "ArrowRight") moveMemory(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  });

  return (
    <main className="relative min-h-dvh overflow-x-hidden px-4 pb-28 pt-8 sm:px-8 sm:pt-12">
      {/* 1 Single Seamless Piece of Solid Wood Background */}
      <SolidWoodSlabBackground />

      {/* Scattered Photo Board Container with NO overlapping pictures */}
      <div className="relative mx-auto w-full max-w-7xl">
        {/* Desktop View (md+): Balanced, non-overlapping natural layout */}
        <section
          className="relative hidden h-[920px] min-h-[850px] w-full md:block"
          aria-label="Wooden photo memory board"
        >
          {MEMORIES.map((memory, index) => (
            <PolaroidCard
              key={memory.id}
              memory={memory}
              onSelect={() => openMemory(index)}
            />
          ))}
        </section>

        {/* Mobile View: Staggered 2-column pinboard */}
        <section
          className="grid grid-cols-2 gap-x-4 gap-y-12 px-1 py-4 sm:gap-x-8 sm:gap-y-14 md:hidden"
          aria-label="Wooden photo memory board"
        >
          {MEMORIES.map((memory, index) => (
            <div
              key={memory.id}
              className={`flex justify-center ${index % 2 === 1 ? "pt-8" : "pt-0"}`}
            >
              <PolaroidCard
                memory={memory}
                onSelect={() => openMemory(index)}
              />
            </div>
          ))}
        </section>
      </div>

      {/* Floating "Back to Letter" Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/letter"
          className="inline-flex items-center gap-2 rounded-full border border-amber-900/60 bg-[#2e1d15]/95 px-6 py-2.5 font-handwriting text-2xl font-bold tracking-wide text-amber-100 shadow-[0_12px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-amber-600 hover:bg-[#3c251b] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
        >
          <span aria-hidden="true">←</span> Letter
        </Link>
      </div>

      {/* Zoom Lightbox / Modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            onClick={closeMemory}
            role="dialog"
            aria-modal="true"
            aria-label={`Memory ${activeIndex + 1} of 6`}
          >
            <button
              type="button"
              onClick={closeMemory}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-amber-900/50 bg-[#241711]/80 text-2xl font-light text-amber-100/80 backdrop-blur-md transition hover:border-amber-700 hover:text-white focus-visible:outline-2 focus-visible:outline-amber-200"
              aria-label="Close memory"
            >
              ×
            </button>

            <div
              className="flex w-full max-w-4xl items-center justify-center gap-3 sm:gap-8"
              onClick={(event) => event.stopPropagation()}
            >
              <NavArrow direction="prev" onClick={() => moveMemory(-1)} />

              <div className="flex min-w-0 flex-1 flex-col items-center justify-center sm:flex-row sm:gap-8">
                <PolaroidCard
                  memory={MEMORIES[activeIndex]}
                  onSelect={() => undefined}
                  isModal
                />

                <motion.aside
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.15 }}
                  className="relative mt-6 w-full max-w-[19rem] rotate-1 rounded-[2px] bg-[#f2e2c4] p-6 text-[#38261b] shadow-[0_15px_40px_rgba(0,0,0,0.65),inset_0_0_20px_rgba(180,140,90,0.2)] sm:mt-0 sm:shrink-0"
                >
                  <RealisticTape className="-top-3.5 left-1/2 -translate-x-1/2 rotate-1" />

                  <p className="mt-2 font-handwriting text-3xl font-bold leading-tight text-[#2c1d14]">
                    {MEMORIES[activeIndex].caption}
                  </p>

                  {MEMORIES[activeIndex].note && (
                    <p className="mt-3 font-handwriting text-2xl leading-snug text-[#5a4233]">
                      &ldquo;{MEMORIES[activeIndex].note}&rdquo;
                    </p>
                  )}
                </motion.aside>
              </div>

              <NavArrow direction="next" onClick={() => moveMemory(1)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
