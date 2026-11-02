"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useEffect, useMemo } from "react";

// Replace the text in LETTER with the real letter. Each item becomes one paragraph.
const LETTER = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vitae sem vel arcu facilisis feugiat. Integer euismod, erat a luctus consequat, justo neque dignissim mi, vitae pretium urna lectus non libero.",
  "Praesent interdum, mauris a finibus fermentum, nibh justo tincidunt nulla, vitae aliquet erat neque in quam. Sed a dolor id lectus tincidunt consequat. Curabitur posuere, arcu sed fermentum commodo, sapien justo consequat eros, vitae facilisis magna enim at erat.",
  "Suspendisse potenti. Aenean sed lorem quis libero pharetra tempor. Donec euismod, lectus sed feugiat vestibulum, neque erat tincidunt arcu, at porta purus nisl at mi. Cras dignissim, sapien non egestas sagittis, velit augue luctus erat, nec consequat justo nisl eget sem.",
  "Morbi blandit, eros in finibus tincidunt, turpis libero laoreet purus, vitae congue sem ligula a lacus. Aliquam erat volutpat. Vivamus vel sapien at ipsum porttitor fermentum. Maecenas at orci non justo pretium vulputate.",
  "Fusce vel neque id lorem commodo interdum. Nulla facilisi. Integer at lacus ut urna fermentum tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam a sapien sed risus ullamcorper aliquet.",
  "Quisque at nibh vitae augue commodo suscipit. Sed consectetur, mi a bibendum malesuada, risus neque accumsan nisl, vitae congue tellus magna quis justo. Nam eget lectus at nibh porta posuere non sit amet lectus.",
  "Ut blandit, lacus non malesuada suscipit, mauris justo pharetra sapien, in commodo arcu ipsum at arcu. Donec malesuada, erat quis varius auctor, sem justo pulvinar eros, sit amet ornare felis erat id felis.",
  "Aliquam erat volutpat. Integer vehicula leo quis eros finibus, sed convallis magna pretium. In hac habitasse platea dictumst. Curabitur sed eros non tortor tincidunt pretium. In hac habitasse platea dictumst.",
  "Donec ac felis sed purus malesuada feugiat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris id magna in nulla sagittis laoreet. Pellentesque vitae nisl a magna malesuada volutpat.",
  "Nam tristique sapien vel lectus aliquet, sed dapibus neque fermentum. Etiam at mauris sed justo finibus imperdiet. Aenean pulvinar orci eu lectus tincidunt, ac tempus dui ullamcorper. Proin interdum, lectus sed egestas cursus, odio justo luctus metus.",
  "Curabitur congue, erat nec ultrices porta, ex nulla sagittis ipsum, sed luctus justo magna in lectus. Vivamus at dui sed augue pharetra tincidunt. Integer consequat sem sed nisl egestas, non porttitor arcu eleifend.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer accumsan, est non auctor luctus, libero justo dictum lacus, id egestas felis orci sit amet erat. Aenean in lorem vel erat tristique faucibus.",
  "Sincerely, with every soft thought and every beautiful hope for what comes next.",
];

/* ------------------------------------------------------------------ */
/*  Tulip SVG                                                          */
/* ------------------------------------------------------------------ */

type TulipProps = {
  color: string;
  accent: string;
  scale: number;
  tilt: number;
};

function Tulip({ color, accent, scale, tilt }: TulipProps) {
  return (
    <div
      aria-hidden="true"
      className="origin-bottom"
      style={{ transform: `scale(${scale}) rotate(${tilt}deg)` }}
    >
      <svg className="block h-[300px] w-[150px]" viewBox="0 0 150 300" fill="none">
        <defs>
          <linearGradient id={`petal-${color}-${accent}`} x1="30" y1="45" x2="120" y2="155" gradientUnits="userSpaceOnUse">
            <stop stopColor={accent} />
            <stop offset="0.5" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id={`stem-${color}`} x1="70" y1="130" x2="82" y2="300" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6d9a54" />
            <stop offset="1" stopColor="#294d36" />
          </linearGradient>
        </defs>
        {/* Stem */}
        <path d="M75 132C73 180 75 235 70 300" stroke={`url(#stem-${color})`} strokeWidth="7" strokeLinecap="round" />
        {/* Leaves */}
        <path d="M71 225C44 207 25 217 12 249c27-2 47-8 61-24Z" fill="#527e48" opacity="0.9" />
        <path d="M73 253c27-21 51-18 68 10-28 1-51-1-68-10Z" fill="#416d40" opacity="0.94" />
        {/* Petals */}
        <path d="M75 138C43 131 25 106 31 71c3-20 15-37 34-48 5 21 17 31 29 39 12-10 24-19 29-40 20 13 29 32 28 53-2 38-25 61-58 63-4 0-11 0-18 0Z" fill={`url(#petal-${color}-${accent})`} stroke={accent} strokeOpacity="0.7" strokeWidth="2" />
        <path d="M75 133V35c-11 12-18 28-17 47 1 23 7 39 17 51Z" fill={accent} fillOpacity="0.42" />
        <path d="M75 133c14-15 20-34 20-57 0-17-5-32-14-46" stroke={accent} strokeOpacity="0.75" strokeWidth="2" />
        <path d="M75 133c-14-15-20-34-20-57 0-17 5-32 14-46" stroke={accent} strokeOpacity="0.55" strokeWidth="2" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Flower & Bokeh data types                                          */
/* ------------------------------------------------------------------ */

type BokehFlower = TulipProps & {
  left: number;
  sink: number;
  speed: number;
  sway: number;
  phase: number;
  blur: number;
  opacity: number;
  z: number;
};

type BokehOrb = {
  left: number;
  bottom: number;
  size: number;
  blur: number;
  opacity: number;
  color: string;
  speed: number;
  phase: number;
  z: number;
};

/* ------------------------------------------------------------------ */
/*  Colour palette                                                     */
/* ------------------------------------------------------------------ */

const PALETTE: { color: string; accent: string }[] = [
  { color: "#b52f61", accent: "#f7a4be" },
  { color: "#6c42a8", accent: "#cdb4fa" },
  { color: "#df6680", accent: "#ffd1d6" },
  { color: "#a32e48", accent: "#f08c96" },
  { color: "#553782", accent: "#9bb6ff" },
  { color: "#75419f", accent: "#d9b8ff" },
  { color: "#c44569", accent: "#f8b4c8" },
  { color: "#8e3fa1", accent: "#dbb8f0" },
  { color: "#d94f72", accent: "#ffc2d1" },
  { color: "#6a3b94", accent: "#b89ee8" },
];

const BOKEH_COLORS = [
  "#ffffff",
  "#fff5f7",
  "#ffe4ec",
  "#f7a4be",
  "#cdb4fa",
  "#ffd1d6",
  "#d9b8ff",
  "#f8b4c8",
  "#ffc2d1",
  "#b89ee8",
  "#9bb6ff",
  "#ffffff",
  "#ffffff",
  "#fff8fa",
];

/* ------------------------------------------------------------------ */
/*  Seeded RNG                                                         */
/* ------------------------------------------------------------------ */

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ------------------------------------------------------------------ */
/*  Generate flowers for one side                                      */
/* ------------------------------------------------------------------ */

function generateFlowers(side: "left" | "right", count: number): BokehFlower[] {
  const rand = seededRandom(side === "left" ? 42 : 137);
  const flowers: BokehFlower[] = [];

  for (let i = 0; i < count; i++) {
    const r = rand;
    const layer = i < count * 0.35 ? 0 : i < count * 0.7 ? 1 : 2;
    const pal = PALETTE[Math.floor(r() * PALETTE.length)];

    const scale = layer === 0 ? 0.3 + r() * 0.2 : layer === 1 ? 0.5 + r() * 0.25 : 0.7 + r() * 0.35;
    const blur = layer === 0 ? 4 + r() * 4 : layer === 1 ? 1.5 + r() * 2 : r() * 0.8;
    const opacity = layer === 0 ? 0.35 + r() * 0.2 : layer === 1 ? 0.6 + r() * 0.25 : 0.8 + r() * 0.2;

    const baseTilt = side === "left" ? -(5 + r() * 20) : 5 + r() * 20;
    const tilt = baseTilt + (r() - 0.5) * 10;

    // Spread flowers across the full width of the strip
    const left = -10 + r() * 100;

    // Sink: show leaves and some stem — less sink than before
    // so the leaves (around y=225-253 in the SVG) are visible
    const sink = 40 + r() * 100;

    const speed = layer === 0 ? 0.008 + r() * 0.008 : layer === 1 ? 0.015 + r() * 0.012 : 0.025 + r() * 0.018;

    flowers.push({
      ...pal,
      scale,
      tilt,
      left,
      sink,
      speed,
      sway: 0.006 + r() * 0.016,
      phase: r() * Math.PI * 2,
      blur,
      opacity,
      z: layer,
    });
  }

  flowers.sort((a, b) => a.z - b.z);
  return flowers;
}

/* ------------------------------------------------------------------ */
/*  Generate bokeh orbs (soft glowing circles) for one side            */
/* ------------------------------------------------------------------ */

function generateBokehOrbs(side: "left" | "right", count: number): BokehOrb[] {
  const rand = seededRandom(side === "left" ? 999 : 777);
  const orbs: BokehOrb[] = [];

  for (let i = 0; i < count; i++) {
    const r = rand;
    const layer = i < count * 0.4 ? 0 : i < count * 0.75 ? 1 : 2;

    const size = layer === 0 ? 8 + r() * 20 : layer === 1 ? 15 + r() * 35 : 25 + r() * 50;
    const blur = layer === 0 ? 6 + r() * 8 : layer === 1 ? 3 + r() * 5 : 1 + r() * 3;
    const opacity = layer === 0 ? 0.08 + r() * 0.12 : layer === 1 ? 0.12 + r() * 0.18 : 0.15 + r() * 0.25;

    orbs.push({
      left: -5 + r() * 110,
      bottom: -20 + r() * 350,
      size,
      blur,
      opacity,
      color: BOKEH_COLORS[Math.floor(r() * BOKEH_COLORS.length)],
      speed: 0.005 + r() * 0.02,
      phase: r() * Math.PI * 2,
      z: layer,
    });
  }

  orbs.sort((a, b) => a.z - b.z);
  return orbs;
}

/* ------------------------------------------------------------------ */
/*  Animated bokeh tulip                                               */
/* ------------------------------------------------------------------ */

function AnimatedTulip({
  flower,
  scroll,
  reducedMotion,
}: {
  flower: BokehFlower;
  scroll: ReturnType<typeof useMotionValue<number>>;
  reducedMotion: boolean;
}) {
  const velocity = useVelocity(scroll);
  const smoothVelocity = useSpring(velocity, { damping: 32, stiffness: 80, mass: 0.8 });
  const smoothScroll = useSpring(scroll, { damping: 38, stiffness: 85, mass: 0.9 });

  const y = useTransform(smoothScroll, (v) =>
    reducedMotion ? 0 : v * flower.speed
  );

  const wind = useTransform(smoothScroll, (v) =>
    reducedMotion ? 0 : Math.sin(v * 0.006 + flower.phase) * (4 + flower.z * 2)
  );

  const x = useTransform(smoothVelocity, (v) =>
    reducedMotion ? 0 : Math.max(-12, Math.min(12, v * flower.sway))
  );

  const rotate = useTransform(wind, (w) => flower.tilt + w);

  return (
    <motion.div
      className="absolute origin-bottom"
      style={{
        left: `${flower.left}%`,
        bottom: `${-flower.sink}px`,
        x,
        y,
        rotate,
        opacity: flower.opacity,
        filter: flower.blur > 0.2 ? `blur(${flower.blur}px)` : undefined,
        zIndex: flower.z,
        willChange: "transform",
      }}
    >
      <Tulip color={flower.color} accent={flower.accent} scale={flower.scale} tilt={0} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated bokeh orb (soft glowing circle)                           */
/* ------------------------------------------------------------------ */

function AnimatedBokehOrb({
  orb,
  scroll,
  reducedMotion,
}: {
  orb: BokehOrb;
  scroll: ReturnType<typeof useMotionValue<number>>;
  reducedMotion: boolean;
}) {
  const smoothScroll = useSpring(scroll, { damping: 40, stiffness: 70, mass: 1 });

  const y = useTransform(smoothScroll, (v) =>
    reducedMotion ? 0 : v * orb.speed
  );

  const floatY = useTransform(smoothScroll, (v) =>
    reducedMotion ? 0 : Math.sin(v * 0.004 + orb.phase) * 8
  );

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${orb.left}%`,
        bottom: `${orb.bottom}px`,
        width: orb.size,
        height: orb.size,
        background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
        filter: `blur(${orb.blur}px)`,
        opacity: orb.opacity,
        y,
        x: floatY,
        zIndex: orb.z,
        willChange: "transform",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Side strip                                                         */
/* ------------------------------------------------------------------ */

const FLOWERS_PER_SIDE = 26;
const BOKEH_ORBS_PER_SIDE = 30;

function TulipBokehSide({
  side,
  scroll,
  reducedMotion,
}: {
  side: "left" | "right";
  scroll: ReturnType<typeof useMotionValue<number>>;
  reducedMotion: boolean;
}) {
  const flowers = useMemo(() => generateFlowers(side, FLOWERS_PER_SIDE), [side]);
  const orbs = useMemo(() => generateBokehOrbs(side, BOKEH_ORBS_PER_SIDE), [side]);

  return (
    <div
      className={`pointer-events-none fixed bottom-0 z-0 hidden md:block ${
        side === "left" ? "left-0" : "right-0"
      }`}
      style={{ width: "22vw", maxWidth: "360px", minWidth: "200px", height: "100vh", overflow: "visible" }}
    >
      {/* Bokeh orbs behind & among flowers */}
      {orbs.map((orb, i) => (
        <AnimatedBokehOrb key={`orb-${i}`} orb={orb} scroll={scroll} reducedMotion={reducedMotion} />
      ))}
      {/* Tulips */}
      {flowers.map((flower, i) => (
        <AnimatedTulip key={`flower-${i}`} flower={flower} scroll={scroll} reducedMotion={reducedMotion} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LetterPage() {
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollY: scroll } = useScroll();

  useEffect(() => {
    document.title = "A letter for you";
  }, []);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#251b32] px-6 py-24 sm:px-10 sm:py-32">
      <TulipBokehSide side="left" scroll={scroll} reducedMotion={reducedMotion} />
      <TulipBokehSide side="right" scroll={scroll} reducedMotion={reducedMotion} />

      <article className="relative z-10 mx-auto w-full max-w-3xl font-body text-[1.2rem] leading-[1.95] text-[#f7ede3]/90 sm:text-[1.3rem]">
        <p className="mb-12 font-display text-5xl italic leading-tight text-[#f7ede3] sm:text-6xl">
          A letter for you
        </p>
        <div className="space-y-9">
          {LETTER.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
