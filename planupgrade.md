# Revamp plan: `/cakewithorpa`

The first version of `/cakewithorpa` works technically, but it looks flat and feels static. This document is the plan to fix it. Work through it **in the order given**, and finish each phase before starting the next.

**Scope rules**

- Only change `/cakewithorpa` and the files it uses. Do not create new routes. Do not modify `/startingcard`.
- Everything in the original `cakewithorpa-instructions.md` still applies (26 candles, song starts inside the click handler, state machine, Next button hidden when no target is set, laptop-first), **except where this plan overrides it**.
- Overrides: OrbitControls are now allowed (limited, see Phase 3). The cake is now **red velvet**. The candle layout changes (see Phase 1).

---

## 0. What is wrong right now (from the screenshot)

1. **The cake looks black.** Lighting is far too dark, so the cake reads as a dark silhouette. No cream, no color.
2. **It is not a red velvet cake.** Red velvet means deep crimson sponge layers, white cream-cheese frosting, and red crumbs.
3. **A dark rectangular seam is visible on the front of the cake.** The cut-face quads for the slice are rendering before any cutting happens.
4. **The text and button overlap the candles.** The wish line and the "Blow the candles" button sit on top of the cake.
5. **The background is a flat purple** with a huge black disc as the table. No depth, no atmosphere.
6. **Decorations look wrong.** The dark half-spheres around the tiers read as black blobs, not berries or piped frosting. Candles are black.
7. **The flames are big, flat yellow ovals** that look 2D.
8. **There is almost no motion and no interaction** before the button press. It is a still picture with a button.

---

## 1. Phase 1: Look (cake, light, background, layout)

### 1.1 Red velvet cake

Build it from basic shapes, no downloaded models. Palette (put in `lib/cakePalette.ts`):

```ts
export const CAKE = {
  spongeDeep:  "#7d1020", // main red velvet
  spongeLight: "#a32035", // lighter layer variation
  cream:       "#fbf3e6", // cream-cheese frosting
  creamShade:  "#efe0cc", // frosting in shadow / swirls
  crumb:       "#8a1526", // red crumbs
  berry:       "#c4142e", // strawberries
  leaf:        "#3f7a43",
  gold:        "#d9b77e", // plate rim
  plate:       "#f6efe6",
};
```

Structure:

- **Bottom tier** (radius about 2.4): **4 red sponge layers** with a **thick cream filling** between each (sponge about 0.30 tall, cream about 0.10 tall, built as stacked cylinders). The cream squeezes out slightly past the sponge edge (cream layers radius +0.04), so the layered look is visible from the side.
- **Top tier** (radius about 1.7): **3 sponge layers** built the same way.
- **Top of each tier:** a thick cream disc with a soft swirl (a slightly domed cylinder or a lathe shape), covered with **red crumb sprinkles** concentrated around the edge.
- **Crumbs:** one `InstancedMesh` of small irregular shapes (`DodecahedronGeometry` scaled randomly), about 150-250 instances, deep-red shades, scattered on the top frosting ring and around the plate edge of the bottom tier.
- **Piped border:** white piped "shells" or rosettes along the top edge of each tier, as an `InstancedMesh` (flattened spheres plus a tiny cone on top). White/cream, **not dark**.
- **Strawberries:** about 12 on the bottom tier's top ring, between the top tier and the edge. Use `MeshPhysicalMaterial` (roughness about 0.25, clearcoat about 0.6) in `berry`, a slightly taller-than-wide shape, a tiny green cap, and a few tiny cream seeds if cheap.
- **Cream drips** on the top tier edge (capsules of varying length), plus 3-4 mint leaves near the berries.
- **Sponge texture:** generate a small canvas noise texture and use it as a `bumpMap` on the sponge material so it looks crumbly, not like plastic.
- **Plate:** porcelain cream cylinder, radius about 3.2, with a thin gold rim ring, on a **dark burgundy tablecloth** (see 1.3).

### 1.2 Candles and flames

- Still exactly **26 candles**, but arranged as **two rings** on the top tier so they look full and can be seen from the front: **16 on the outer ring (radius about 1.25)** and **10 on the inner ring (radius about 0.65)**, staggered so none line up.
- Candles must **not be black**. Use cream, rose, and soft gold with a **spiral stripe texture** (a small canvas texture wrapped around the cylinder). Add a tiny dark wick.
- **Flames:** smaller and more 3D. Two layers: an inner core (`#fffbe6`, about `0.035 x 0.09 x 0.035`) inside an outer teardrop (`#ffb347`, about `0.055 x 0.13 x 0.055`), both emissive. Shared geometry and materials.
- Keep the additive glow sprite behind each flame, but make it smaller and softer so flames never merge into one yellow blob.

### 1.3 Lighting (fix the "black cake" problem)

- Renderer: `toneMapping = ACESFilmicToneMapping`, `toneMappingExposure` about 1.15, `outputColorSpace = SRGBColorSpace`.
- **Candle light:** a warm point light above the candle rings (`decay = 2`, a large `distance`, and strong intensity so the whole cake is clearly lit). Add a **second, weaker warm point light** lower and in front (about `[0, 1.2, 3]`) so the front sides of the tiers are lit too.
- **Back rim light:** a warm directional or spot light from behind-right so the edges of the cake have a soft highlight and separate from the background.
- **Fill:** `hemisphereLight` (warm sky `#ffd9c2`, wine ground `#2a0f1a`) at moderate intensity. The cake must be **clearly visible and colorful** even before the candles go out.
- Keep shadows on, with soft shadow maps. Candle flicker should visibly move the light and shadows.
- Do **not** use `<Environment preset>` (it needs the network).

### 1.4 Background and table (new look)

Goal: a cozy, warm night room, not a flat purple screen.

- Make the `<Canvas>` **transparent** (`alpha: true`) and put the background behind it in CSS:
  `radial-gradient(ellipse at 50% 40%, #4a1428 0%, #2a1020 40%, #0d060e 100%)`.
  Define it as a CSS variable (`--bg-room`) so it can be reused later. Do not change `/startingcard` yet.
- **Remove the huge black disc.** Replace it with a table surface: a large plane (or wide cylinder) with a **burgundy cloth** material and a **radial alpha falloff texture**, so it fades smoothly into the background with no hard edge.
- **Bokeh lights in the back:** about 25-35 large, soft, additive circles (sprites) in warm gold and rose, placed 10-20 units behind the cake at different depths, slowly drifting and twinkling. With the mouse parallax they should shift at different speeds, giving depth.
- **Dust motes:** about 80-120 tiny glowing particles floating slowly around the cake in the candle light.
- Use scene fog in a matching wine color so far elements fade out.

### 1.5 Layout (nothing overlaps the cake)

- Frame the camera so the cake occupies the **middle 55-60% of the viewport height**, centered slightly low.
- **Wish line and caption:** top of the screen, vertically about 8-16%, never over the candles.
- **"Blow the candles" button and hint:** bottom center, about 6-10% from the bottom, never over the cake.
- **Next button:** same bottom-center spot, fades in when the phase is `done`.
- Check at 1366x768, 1440x900, and 1920x1080 that no text touches the cake.

### 1.6 Bug fix: the visible cut seam

- The cut-face quads must be **hidden (`visible = false`) until the first knife stroke**.
- Best approach: render the cake as **one full, seamless cake** until the cutting phase starts. At the moment the knife first touches the cake, swap to the split version (main body + wedge) in one frame. The swap must be visually invisible.
- Verify there is no seam, no gap, and no dark rectangle on the front before cutting.

**Phase 1 done when:** the cake is clearly a red velvet cake with cream frosting and red crumbs, is bright and colorful, the background has depth, nothing overlaps, and there is no seam.

---

## 2. Phase 2: Motion (the scene must feel alive)

### 2.1 Intro sequence (first 3 seconds)

1. Canvas fades in. The camera starts higher and farther (`y` about 4.5, `z` about 11) and **dollies in** to the home position over about 2.5s with an ease-out.
2. The candles start **unlit**. After about 0.8s they **ignite in a wave**, one by one (about 60ms stagger), each with a tiny spark burst and a quick flame "pop" (scale overshoot, then settle). The scene light ramps up as the flames appear.
3. Then the wish line fades in.

### 2.2 Idle life (always, until the blow)

- **Flames:** per-candle flicker with different phases, plus a slow shared "breathing" so the whole cake seems to breathe. The point light intensity and position flicker slightly.
- **Camera:** very slow orbit sway of about 6-8 degrees left and right, plus mouse parallax.
- **Ambient particles:** bokeh lights drifting, dust motes floating, and a few **sparks/embers** rising from the flames and fading.
- **Cake:** a very slight breathing scale (about 0.3%), or a barely perceptible slow turn. Nothing jittery.

### 2.3 The blow-out (make it feel physical)

When the blow is triggered (button or microphone):

1. The camera does a quick small **push-in** (about 0.4 units over 0.5s).
2. **All flames lean away from the camera at once** (rotate about 25 degrees, stretch slightly longer and thinner) for about 0.25s, as if hit by wind.
3. They extinguish in a quick **random wave** (about 35-40ms stagger). Each flame shrinks, sparks fly, and a **curling smoke wisp** rises (not just a straight fade).
4. The glow and candle light drop in step with the number of lit candles.
5. A brief dark beat of about 0.5s, then the lights **swell back up** warmer and brighter than before.

### 2.4 Celebration

- Confetti from both sides as before, **plus** a short streamer burst (thin long ribbons, can be done with `canvas-confetti` using the `ticks` and `shapes` options), and gold star shapes.
- **Floating hearts and balloons:** about 10-15 soft translucent hearts (and 3-5 simple 3D balloons with a string, in the palette colors) drift upward in the background, fading out near the top. They keep spawning at a low rate until the song ends.
- The caption fades in with a gentle letter-by-letter or word-by-word reveal.

### 2.5 The cut (add life to it)

- Slow, soft **spotlight** that fades in on the cake while the room darkens a little around it.
- The camera eases to a slightly lower, closer angle.
- The knife has a soft shadow on the cake. When it cuts, **small red crumbs fall** from the cut edges and bounce a little on the plate (about 20-30 instanced crumbs with simple gravity).
- The slice slides out smoothly and the plate gets a tiny "settle" wobble.

### 2.6 After the cut (`done`)

- The scene stays alive: floating hearts continue, bokeh keeps drifting, camera sways, a very slow rotation of the plate.
- **Click anywhere on the page** (outside buttons) to pop a small burst of hearts/confetti at the cursor. Limit the rate so it can't be spammed into lag.

**Phase 2 done when:** nothing ever looks frozen, and the blow-out and cut feel physical, not like fades.

---

## 3. Phase 3: Interaction (she should be able to play with it)

### 3.1 Hover wind on the flames

- Raycast the pointer onto a horizontal plane at flame height each frame.
- For each flame within about 1.2 units of the pointer, **lean it away** from the pointer, proportional to closeness, with smoothing. When the cursor moves away, the flame returns.
- Flames flicker harder (brighter light, more motion) when the cursor is near them. Do not extinguish any flame by hover.
- Disabled when `prefers-reduced-motion` is set.

### 3.2 Drag to look around (limited)

- Use drei `OrbitControls` with: `enablePan={false}`, `enableZoom={false}`, `enableDamping`, `minPolarAngle` about 55 degrees, `maxPolarAngle` about 85 degrees, `minAzimuthAngle` about -40 degrees, `maxAzimuthAngle` about +40 degrees.
- After about 3.5s with no input, the camera **eases back to the home view** by itself.
- When the cutting phase starts, **disable the controls and ease the camera back home** first so the cut always happens facing the front.

### 3.3 Blow into the microphone (the big one)

- Under the main button, add a small secondary link: **"or blow into your microphone"**.
- On click: request the mic (`getUserMedia` with `echoCancellation`, `noiseSuppression`, and `autoGainControl` all set to `false`). In the same click handler, resume the audio context and prime the Howl so the song can start later without being blocked.
- Use an `AnalyserNode`. A blow is **sustained, broadband, low-frequency noise**: compute smoothed RMS of the time-domain data plus the energy in the lowest bins. Trigger the blow when the level stays above a threshold for about **300-400ms**. Calibrate the threshold on the first 0.5s of room noise (baseline + a margin), so it works in a quiet or slightly noisy room.
- **Live feedback:** while the mic is on, the flames' lean and flicker react to the mic level in real time, so she sees her breath moving them before they go out. Show a small subtle level indicator near the link.
- When the blow triggers, run the exact same sequence as the button, and stop the mic stream.
- **If permission is denied or no mic exists:** show a short friendly line ("No problem, just press the button") and keep the button path working. The page must never depend on the mic.
- The main button always stays available as the primary, reliable path.

### 3.4 Hold to make a wish

- Replace the plain wish step with a small interaction: after the wish line appears, show a circular **"Hold to make your wish"** control. Pressing and holding (mouse or Space) fills a ring over about **2.5s**. While held, the flames grow slightly brighter and calmer and the scene hushes (bokeh slows down).
- Releasing early resets the ring gently. When the ring completes, a soft glow pulse plays and the control morphs into the **"Blow the candles"** button (and the mic link appears).
- If this makes the flow feel too slow for testing, add a dev-only constant `SKIP_WISH_HOLD = false` that jumps straight to the button.

### 3.5 Small touches

- Button hover: slight lift and glow. Press: soft ripple.
- Cursor changes to a pointer over interactive things.
- Click a single flame before the blow: it flutters strongly for a moment and a tiny spark pops (does not extinguish).

**Phase 3 done when:** she can move her mouse over the flames and see them react, drag to look around and see the camera return, and (if she allows the mic) actually blow the candles out.

---

## 4. Phase 4: Sound extras (optional, never required)

- Optional sound effects in `public/audio/`: `ignite.mp3` (soft sparkle for the candle ignition), `blow.mp3` (a short whoosh), `pop.mp3` (confetti pop).
- Every sound effect must be **optional**: if a file is missing, skip it silently. The song `happy-birthday.mp3` behavior stays exactly as before.
- Keep sound effects quiet relative to the song, and never overlapping with it in a way that drowns my singing.

---

## 5. Performance and quality rules

- Target 60fps on an ordinary laptop. Use `InstancedMesh` for crumbs, shells, sprinkles, and particles. Pool and reuse particles instead of creating new objects.
- Share geometries and materials. Avoid per-frame allocations. Dispose of textures and stop loops on unmount.
- Only **2-3 real lights** that move or flicker, plus static ones. No light per candle.
- `dpr` clamped to `[1, 2]`.
- `prefers-reduced-motion`: no parallax, no camera sway, no hover wind, no confetti or floating particles, and a calmer flicker.
- Everything must still work if the mp3 is missing, the mic is denied, or WebGL is unavailable (friendly message).

---

## 6. Acceptance checklist

- [ ] The cake clearly reads as **red velvet**: crimson sponge layers, thick white cream, red crumbs, red strawberries.
- [ ] The cake is bright and colorful before the candles go out. Nothing is black.
- [ ] No dark seam or rectangle on the front of the cake before the cut.
- [ ] Exactly 26 candles in two rings, none black, flames small and 3D-looking.
- [ ] Wish line, button, and caption never overlap the cake at 1366x768, 1440x900, and 1920x1080.
- [ ] Background is a warm gradient room with bokeh and dust, no hard black disc.
- [ ] Intro: camera dolly-in, candles ignite in a wave.
- [ ] Idle: flames, light, camera, and particles all move.
- [ ] Hovering near flames bends them away from the cursor.
- [ ] Dragging rotates the view within limits, and it eases back home.
- [ ] Hold-to-wish ring works with mouse and Space.
- [ ] Blowing into the mic extinguishes the candles (and denying the mic does not break anything).
- [ ] Blow-out: flames lean, go out in a wave, with curling smoke and sparks, then a dark beat, then the lights swell back.
- [ ] Celebration: confetti, streamers, floating hearts and balloons.
- [ ] Cut: spotlight, crumbs fall, slice slides out cleanly onto the plate.
- [ ] In `done`, the scene stays alive and clicking the page makes heart/confetti bursts.
- [ ] Song still starts inside the click handler (or the primed mic trigger) and never plays twice.
- [ ] Smooth frame rate, no console errors.

## 7. When finished

Run the dev server, walk through the full sequence at least twice (once with the button, once with the mic), and report:

1. which files you created or changed,
2. anything you simplified or skipped (and why),
3. any settings I can tweak (thresholds, timings) and where they live.
