import { useEffect, useRef } from "react";

const SHAPES = ["rupee", "spending", "income", "savings", "rupee"];
const PALETTE_TOKENS = ["--p-a", "--p-b", "--p-c", "--p-d"];
const CAPTIONS = [
  [],
  [],
  [
    ["Income ₹85,000", 1],
    ["+12% vs last month", 3],
  ],
  [
    ["Savings goal", 3],
    ["₹2,40,000 of ₹3,00,000", 1],
  ],
  [],
];

function getShapePoints(shape) {
  const surface = document.createElement("canvas");
  surface.width = 200;
  surface.height = 200;
  const context = surface.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D context is unavailable for the particle background.");

  context.lineCap = "butt";
  context.lineJoin = "round";
  context.textAlign = "center";
  context.textBaseline = "middle";

  if (shape === "rupee") {
    context.fillStyle = "#ff0000";
    context.font = "700 210px Sora, sans-serif";
    context.fillText("₹", 100, 108);
  } else if (shape === "spending") {
    const portions = [0.4, 0.25, 0.15, 0.2];
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#808080"];
    let angle = -Math.PI / 2;
    for (let index = 0; index < portions.length; index += 1) {
      const end = angle + Math.PI * 2 * portions[index] - 0.03;
      context.strokeStyle = colors[index];
      context.lineWidth = 34;
      context.beginPath();
      context.arc(100, 100, 68, angle, end);
      context.stroke();
      angle += Math.PI * 2 * portions[index];
    }
  } else if (shape === "income") {
    const heights = [0.3, 0.42, 0.38, 0.62, 0.86];
    for (let index = 0; index < heights.length; index += 1) {
      context.fillStyle = index === 4 ? "#ff0000" : "#00ff00";
      context.fillRect(16 + index * 36, 184 - heights[index] * 200, 26, heights[index] * 200);
    }
  } else {
    context.strokeStyle = "#808080";
    context.lineWidth = 20;
    context.setLineDash([2.4, 10]);
    context.beginPath();
    context.arc(100, 100, 80, 0, Math.PI * 2);
    context.stroke();

    context.setLineDash([]);
    context.strokeStyle = "#00ff00";
    context.lineWidth = 26;
    context.beginPath();
    context.arc(100, 100, 80, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.8);
    context.stroke();

    context.fillStyle = "#808080";
    context.font = "700 60px Sora, sans-serif";
    context.fillText("80%", 100, 100);
  }

  const { data } = context.getImageData(0, 0, surface.width, surface.height);
  const points = [];
  for (let y = 0; y < surface.height; y += 2) {
    for (let x = 0; x < surface.width; x += 2) {
      const pixel = (y * surface.width + x) * 4;
      if (data[pixel + 3] < 128) continue;
      let color = 3;
      if (data[pixel] > 200 && data[pixel + 1] < 80 && data[pixel + 2] < 80) color = 0;
      else if (data[pixel + 1] > 200 && data[pixel] < 80) color = 1;
      else if (data[pixel + 2] > 200 && data[pixel] < 80) color = 2;
      points.push({ x: x - 100, y: y - 100, color });
    }
  }

  for (let index = points.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [points[index], points[other]] = [points[other], points[index]];
  }
  return points;
}

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context is unavailable for the particle background.");

    const steps = [...document.querySelectorAll(".story-step[data-s]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shapePoints = SHAPES.map((shape) => getShapePoints(shape));
    const warnedTokens = new Set();
    let colors = ["#000000", "#000000", "#000000", "#000000"];
    let textColor = "#0B3954";
    let particles = [];
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let activeShape = 0;
    let shapeAge = 0;
    let frame = 0;
    let animationFrame = 0;
    let observer = null;
    let cursorX = -10000;
    let cursorY = -10000;
    let scrollVelocity = 0;
    let previousScrollY = window.scrollY;
    let isMobile = window.innerWidth < 700;

    function getCenterX() {
      return width * (isMobile ? 0.5 : 0.72);
    }

    function getCenterY() {
      return height * (isMobile ? 0.3 : 0.48);
    }

    function getShapeSize() {
      return isMobile
        ? Math.min(width * 0.72, height * 0.34)
        : Math.min(width * 0.42, height * 0.66);
    }

    function assignParticles() {
      const total = isMobile ? 1400 : 3200;
      const shapeCount = Math.floor(total * 0.68);
      particles = new Array(total);
      for (let index = 0; index < total; index += 1) {
        const halo = index >= shapeCount;
        let colorIndex;
        if (halo) {
          const colorPick = Math.random();
          colorIndex = colorPick < 0.4 ? 1 : colorPick < 0.7 ? 0 : 3;
        } else {
          colorIndex = shapePoints[activeShape].length
            ? shapePoints[activeShape][Math.floor(Math.random() * shapePoints[activeShape].length)].color
            : 0;
        }
        particles[index] = {
          halo,
          pointIndex: Math.floor(Math.random() * shapePoints[activeShape].length),
          angle: Math.random() * Math.PI * 2,
          orbitRadius: 0.58 + Math.random() * 0.55,
          speed: (0.0012 + Math.random() * 0.003) * (Math.random() < 0.5 ? -1 : 1),
          stiffness: 0.012 + Math.random() * 0.014,
          phase: Math.random() * Math.PI * 2,
          radius: halo ? 1.1 + Math.random() * 0.7 : 2.2 + Math.random() * 1.2,
          colorIndex,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
        };
      }
      placeParticles();
    }

    function placeParticles() {
      const centerX = getCenterX();
      const centerY = getCenterY();
      const shapeSize = getShapeSize();
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        if (particle.halo) {
          particle.x = centerX + Math.cos(particle.angle) * shapeSize * particle.orbitRadius;
          particle.y = centerY + Math.sin(particle.angle) * shapeSize * particle.orbitRadius * 0.92;
        } else {
          const points = shapePoints[activeShape];
          const point = points[particle.pointIndex % points.length];
          particle.x = centerX + point.x * shapeSize / 200;
          particle.y = centerY + point.y * shapeSize / 200;
        }
        particle.vx = 0;
        particle.vy = 0;
      }
    }

    function drawCaptions(centerX, centerY, shapeSize) {
      const lines = CAPTIONS[activeShape];
      if (!lines.length) return;
      const opacity = reducedMotion.matches ? 1 : Math.min(1, Math.max(0, (shapeAge - 60) / 40));
      if (opacity <= 0) return;

      context.globalAlpha = opacity;
      context.font = "600 15px Sora, sans-serif";
      context.textBaseline = "middle";
      const left = centerX - Math.min(shapeSize, isMobile ? 220 : 260) / 2;
      const firstY = centerY + shapeSize / 2 + 26;
      for (let index = 0; index < lines.length; index += 1) {
        const y = firstY + index * 24;
        context.fillStyle = colors[lines[index][1]];
        context.beginPath();
        context.arc(left + 2.5, y, 2.5, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = textColor;
        context.fillText(lines[index][0], left + 13, y);
      }
      context.globalAlpha = 1;
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
      const centerX = getCenterX();
      const centerY = getCenterY();
      const shapeSize = getShapeSize();
      const points = shapePoints[activeShape];

      if (reducedMotion.matches) {
        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index];
          if (particle.halo) {
            particle.x = centerX + Math.cos(particle.angle) * shapeSize * particle.orbitRadius;
            particle.y = centerY + Math.sin(particle.angle) * shapeSize * particle.orbitRadius * 0.92;
          } else {
            const point = points[particle.pointIndex % points.length];
            particle.x = centerX + point.x * shapeSize / 200;
            particle.y = centerY + point.y * shapeSize / 200;
          }
          context.globalAlpha = particle.halo ? 0.5 : 0.95;
          context.fillStyle = colors[particle.colorIndex];
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        }
      } else {
        scrollVelocity *= 0.95;
        for (let index = 0; index < particles.length; index += 1) {
          const particle = particles[index];
          let targetX;
          let targetY;
          if (particle.halo) {
            particle.angle += particle.speed;
            const orbit = shapeSize * particle.orbitRadius;
            const wobble = Math.sin(frame * 0.02 + particle.phase) * 6;
            targetX = centerX + Math.cos(particle.angle) * orbit + wobble;
            targetY = centerY + Math.sin(particle.angle) * orbit * 0.92 + Math.cos(frame * 0.02 + particle.phase) * 6;
            context.globalAlpha = 0.2 + 0.6 * (Math.sin(frame * 0.04 + particle.phase * 3) + 1) / 2;
          } else {
            const point = points[particle.pointIndex % points.length];
            targetX = centerX + point.x * shapeSize / 200 + Math.sin(frame * 0.025 + particle.phase) * 1.3;
            targetY = centerY + point.y * shapeSize / 200 + Math.cos(frame * 0.025 + particle.phase) * 1.3;
            context.globalAlpha = 0.95;
          }

          let forceX = (targetX - particle.x) * particle.stiffness;
          let forceY = (targetY - particle.y) * particle.stiffness;
          const cursorDeltaX = particle.x - cursorX;
          const cursorDeltaY = particle.y - cursorY;
          const distanceSquared = cursorDeltaX * cursorDeltaX + cursorDeltaY * cursorDeltaY;
          if (distanceSquared < 16900 && distanceSquared > 0) {
            const distance = Math.sqrt(distanceSquared);
            const push = (1 - distanceSquared / 16900) * 3.2 / distance;
            forceX += cursorDeltaX * push;
            forceY += cursorDeltaY * push;
          }
          forceX += (Math.random() - 0.5) * scrollVelocity * 1.6;
          forceY += (Math.random() - 0.5) * scrollVelocity * 1.6;
          particle.vx = (particle.vx + forceX) * 0.86;
          particle.vy = (particle.vy + forceY) * 0.86;
          particle.x += particle.vx;
          particle.y += particle.vy;
          context.fillStyle = colors[particle.colorIndex];
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.globalAlpha = 1;
      drawCaptions(centerX, centerY, shapeSize);
      frame += 1;
      shapeAge += 1;
      if (!reducedMotion.matches) animationFrame = window.requestAnimationFrame(draw);
    }

    function changeShape(nextShape) {
      if (nextShape < 0 || nextShape >= SHAPES.length || nextShape === activeShape) return;
      activeShape = nextShape;
      shapeAge = 0;
      const points = shapePoints[activeShape];
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        if (particle.halo) continue;
        particle.pointIndex = Math.floor(Math.random() * points.length);
        particle.colorIndex = points[particle.pointIndex].color;
        if (!reducedMotion.matches) {
          particle.vx += (Math.random() - 0.5) * 16;
          particle.vy += (Math.random() - 0.5) * 16;
        }
      }
      if (reducedMotion.matches) draw();
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 700;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      assignParticles();
      if (reducedMotion.matches) draw();
    }

    function updateColors() {
      const styles = getComputedStyle(document.documentElement);
      textColor = styles.getPropertyValue("--text").trim() || "#000000";
      for (let index = 0; index < PALETTE_TOKENS.length; index += 1) {
        const value = styles.getPropertyValue(PALETTE_TOKENS[index]).trim();
        if (value) colors[index] = value;
        else {
          colors[index] = "#000000";
          if (!warnedTokens.has(PALETTE_TOKENS[index])) {
            console.warn(`Particle palette token ${PALETTE_TOKENS[index]} is missing; using black.`);
            warnedTokens.add(PALETTE_TOKENS[index]);
          }
        }
      }
      if (reducedMotion.matches) draw();
    }

    function syncMotionPreference() {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (reducedMotion.matches) draw();
      else animationFrame = window.requestAnimationFrame(draw);
    }

    function updateStoryFromScroll() {
      if (!steps.length) return;
      const viewportMiddle = height / 2;
      for (let index = 0; index < steps.length; index += 1) {
        const rect = steps[index].getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          changeShape(Number(steps[index].dataset.s));
          return;
        }
      }
      changeShape(window.scrollY < steps[0].offsetTop ? 0 : SHAPES.length - 1);
    }

    function onScroll() {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.min(1.5, Math.abs(currentScrollY - previousScrollY) / 120);
      previousScrollY = currentScrollY;
      updateStoryFromScroll();
    }

    function onPointerMove(event) {
      cursorX = event.clientX;
      cursorY = event.clientY;
    }

    function onPointerLeave() {
      cursorX = -10000;
      cursorY = -10000;
    }

    const themeObserver = new MutationObserver(updateColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });
    if (steps.length) {
      observer = new IntersectionObserver((entries) => {
        for (let index = 0; index < entries.length; index += 1) {
          const entry = entries[index];
          if (entry.isIntersecting) changeShape(Number(entry.target.dataset.s));
        }
      }, { rootMargin: "-45% 0px -45% 0px" });
      for (let index = 0; index < steps.length; index += 1) observer.observe(steps[index]);
      updateStoryFromScroll();
    }
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    reducedMotion.addEventListener("change", syncMotionPreference);

    resize();
    updateColors();
    syncMotionPreference();

    return () => {
      themeObserver.disconnect();
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      reducedMotion.removeEventListener("change", syncMotionPreference);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
