import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-fraunces)"],
        body: ["var(--font-lora)"],
        title: ["var(--font-jost)"],
        handwriting: ["var(--font-caveat)", "cursive"],
      },
    },
  },
};

export default config;
