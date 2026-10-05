import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const backgroundRef = useRef(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const root = document.documentElement;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function updateScrollProgress() {
      frame = 0;
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
      root.style.setProperty("--scroll", progress.toFixed(3));
      root.style.setProperty("--scroll-hue", `${progress * 220}deg`);
      root.style.setProperty("--blob-one-x", `${progress * window.innerWidth * 0.12}px`);
      root.style.setProperty("--blob-one-y", `${progress * window.innerHeight * 0.24}px`);
      root.style.setProperty("--blob-two-x", `${progress * window.innerWidth * -0.14}px`);
      root.style.setProperty("--blob-two-y", `${progress * window.innerHeight * -0.22}px`);
      root.style.setProperty("--blob-three-x", `${progress * window.innerWidth * 0.1}px`);
      root.style.setProperty("--blob-three-y", `${progress * window.innerHeight * 0.18}px`);
      background?.querySelectorAll(".animated-coin").forEach((coin) => {
        const depth = Number(coin.dataset.depth);
        coin.style.setProperty("--coin-parallax-y", `${progress * depth * -180}px`);
      });
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateScrollProgress);
    }

    function syncMotionPreference() {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (motionPreference.matches) {
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        root.style.setProperty("--scroll", "0");
        root.style.setProperty("--scroll-hue", "0deg");
        background?.querySelectorAll(".animated-coin").forEach((coin) => {
          coin.style.setProperty("--coin-parallax-y", "0px");
        });
        return;
      }
      updateScrollProgress();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate, { passive: true });
    }

    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);
    return () => {
      motionPreference.removeEventListener("change", syncMotionPreference);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      [
        "--scroll",
        "--scroll-hue",
        "--blob-one-x",
        "--blob-one-y",
        "--blob-two-x",
        "--blob-two-y",
        "--blob-three-x",
        "--blob-three-y",
      ].forEach((property) => root.style.removeProperty(property));
      background?.querySelectorAll(".animated-coin").forEach((coin) => {
        coin.style.removeProperty("--coin-parallax-y");
      });
    };
  }, []);

  return (
    <div ref={backgroundRef} className="animated-background" aria-hidden="true">
      <div className="animated-color-field">
        <span className="animated-blob blob-one" />
        <span className="animated-blob blob-two" />
        <span className="animated-blob blob-three" />
      </div>
      <div className="animated-coins">
        {Array.from({ length: 16 }, (_, index) => {
          const depth = 0.45 + (index % 5) * 0.16;
          const duration = 8 + (index % 6) * 1.7;
          const delay = -((index * 2.3) % duration);
          return (
            <span
              className="animated-coin"
              data-depth={depth}
              key={index}
              style={{
                "--coin-left": `${(index * 37 + 11) % 100}%`,
                "--coin-size": `${22 + (index % 4) * 5}px`,
                "--coin-duration": `${duration}s`,
                "--coin-delay": `${delay}s`,
              }}
            >
              ₹
            </span>
          );
        })}
      </div>
      <svg className="animated-chart" viewBox="0 0 300 150" fill="none">
        <path className="animated-chart-grid" d="M8 30H292M8 75H292M8 120H292" />
        <path className="animated-chart-line" pathLength="1" d="M8 116C34 108 38 96 62 100S91 69 116 78 148 92 172 59 210 74 232 41 267 51 292 16" />
        <circle className="animated-chart-point" cx="292" cy="16" r="5" />
      </svg>
    </div>
  );
}
