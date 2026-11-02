"use client";

import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useCakeStore } from "@/lib/cakeStore";
import { CAKE_TIMINGS } from "@/lib/cakeTimings";
import { cakeNextRoute } from "@/lib/flow";
import { playSong, preloadSong, stopSong } from "@/lib/audio";
import { NextButton } from "@/components/NextButton";
import { CakeScene } from "./CakeScene";
import { Overlay } from "./Overlay";

export const COPY = {
  name: "Orpa",
  wish: "Close your eyes and make a wish.",
  button: "Blow the candles",
  soundHint: "Turn your sound on.",
  caption: (name: string) => `Happy Birthday, ${name}.`,
};

export default function CakeExperience() {
  const phase = useCakeStore((state) => state.phase);
  const setPhase = useCakeStore((state) => state.setPhase);
  const started = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [wishComplete, setWishComplete] = useState(false);
  const [micMessage, setMicMessage] = useState("");
  const micStream = useRef<MediaStream | null>(null);
  const audioFailed = useRef(false);

  useEffect(() => {
    document.title = "Make a wish";
    const addTimer = (callback: () => void, delay: number) => {
      timers.current.push(setTimeout(callback, delay));
    };
    addTimer(() => setPhase("wish"), CAKE_TIMINGS.wishDelay);
    addTimer(() => setPhase("ready"), CAKE_TIMINGS.readyDelay);
    preloadSong(
      () => setPhase("done"),
      () => { audioFailed.current = true; },
    );
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach(clearTimeout);
      micStream.current?.getTracks().forEach((track) => track.stop());
      stopSong();
    };
  }, [setPhase]);

  useEffect(() => {
    if (phase !== "celebrating") return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void confetti({ particleCount: 120, angle: 60, spread: 70, origin: { x: 0, y: 0.62 }, gravity: 0.9, colors: ["#f7ede3", "#5b3048", "#d8a9b5", "#d5a45b"] });
      void confetti({ particleCount: 120, angle: 120, spread: 70, origin: { x: 1, y: 0.62 }, gravity: 0.9, colors: ["#f7ede3", "#5b3048", "#d8a9b5", "#d5a45b"] });
      void confetti({ particleCount: 45, spread: 100, startVelocity: 18, ticks: 180, scalar: 1.2, shapes: ["circle"], origin: { x: 0.5, y: 0.55 }, colors: ["#d9b77e", "#c4142e", "#f7ede3"] });
    }
    return undefined;
  }, [phase]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (phase !== "done" || (event.target as HTMLElement).closest("button,a")) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      void confetti({ particleCount: 18, spread: 45, startVelocity: 12, origin: { x: event.clientX / window.innerWidth, y: event.clientY / window.innerHeight }, colors: ["#f7ede3", "#c4142e", "#d9b77e"] });
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [phase]);

  const startMic = async () => {
    if (started.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      micStream.current = stream;
      const context = new AudioContext();
      await context.resume();
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      const startedAt = context.currentTime;
      const poll = () => {
        if (started.current) return;
        analyser.getByteTimeDomainData(data);
        const rms = Math.sqrt(data.reduce((sum, value) => sum + Math.pow((value - 128) / 128, 2), 0) / data.length);
        if ((context.currentTime - startedAt) * 1000 > CAKE_TIMINGS.micCalibration && rms > 0.12) {
          handleBlow();
          stream.getTracks().forEach((track) => track.stop());
          void context.close();
          return;
        }
        requestAnimationFrame(poll);
      };
      poll();
    } catch {
      // Ensure we don't leave a dangling MediaStream open.
      micStream.current?.getTracks().forEach((track) => track.stop());
      setMicMessage("No problem, just press the button.");
    }
  };

  const handleBlow = () => {
    if (started.current) return;
    started.current = true;
    playSong();
    setPhase("blowing");
    const dark = setTimeout(() => setPhase("dark"), CAKE_TIMINGS.extinguishDuration);
    const celebrate = setTimeout(
      () => setPhase("celebrating"),
      CAKE_TIMINGS.extinguishDuration + CAKE_TIMINGS.darkBeat,
    );
    timers.current.push(dark, celebrate);
    if (audioFailed.current) {
      timers.current.push(setTimeout(() => setPhase("done"), CAKE_TIMINGS.missingAudioFallback));
    }
  };

  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#4a1428_0%,#2a1020_40%,#0d060e_100%)]"
    >
      <CakeScene phase={phase} />
      <Overlay
        copy={COPY}
        phase={phase}
        onBlow={handleBlow}
        wishComplete={wishComplete}
        onWishComplete={() => setWishComplete(true)}
        onMic={startMic}
        micMessage={micMessage}
      />
      {phase === "done" && cakeNextRoute ? (
        <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
          <NextButton href={cakeNextRoute} />
        </div>
      ) : null}
    </main>
  );
}
