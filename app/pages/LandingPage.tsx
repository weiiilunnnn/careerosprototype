"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BadgeCheck, BriefcaseBusiness,
  FileText, LineChart, MapPinned, Sparkles, UserRoundCheck,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Theme
───────────────────────────────────────────── */
const theme = {
  navy: "#081433", deepNavy: "#152238", muted: "#46536D",
  rose1: "#F04D7A", rose2: "#E00046", rose3: "#D81B3F",
  soft: "#FFF2F6", soft2: "#FDE7EE", border: "#F5CBD6",
};

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const whyItems = [
  { icon: FileText, title: "Build a profile that tells your story", description: "Organise your education, skills, experience, and evidence into one structured profile that feels complete and professional.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", alt: "Person working on a laptop" },
  { icon: BadgeCheck, title: "Turn evidence into credibility", description: "Certificates, portfolios, and achievements become visible proof that strengthens your profile and supports your career direction.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80", alt: "Young professionals collaborating" },
  { icon: MapPinned, title: "See clearer career direction", description: "Explore realistic job pathways and understand how your current profile connects to future roles and growth opportunities.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80", alt: "Team discussing career planning" },
];

const growthItems = [
  { icon: UserRoundCheck, title: "Build your career profile", description: "Start with your education, skills, work experience, interests, and uploaded evidence." },
  { icon: LineChart, title: "Understand your growth", description: "See how your profile changes your career path alignment over time." },
  { icon: BriefcaseBusiness, title: "Explore realistic opportunities", description: "Compare career routes and understand what separates each path." },
];

/* ─────────────────────────────────────────────
   Hooks
───────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

/* ─────────────────────────────────────────────
   Transition Hook
   The world is one continuous canvas. Clicking a CTA:
   1. The dot canvas accelerates rightward (offset animates)
   2. The page content slides left + fades — revealing the dot world underneath
   3. Router fires when fully offscreen
───────────────────────────────────────────── */
function useWorldTransition() {
  const [transitioning, setTransitioning] = useState(false);
  const canvasOffsetRef = useRef(0);   // how far the canvas has drifted right (px)
  const isTransitioningRef = useRef(false);
  const router = useRouter();

  const trigger = useCallback((href: string) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setTransitioning(true);

    const W = window.innerWidth;
    let startTime: number | null = null;
    const DURATION = 680; // ms for canvas to sweep across

    // Animate the canvas offset ref — FuturisticBg reads this every frame
    function animateCanvas(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / DURATION, 1);
      // Ease-in-out curve: feels like momentum building then landing
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      canvasOffsetRef.current = eased * W * 1.2; // overshoot slightly
      if (progress < 1) requestAnimationFrame(animateCanvas);
    }
    requestAnimationFrame(animateCanvas);

    // Content slides left and fades simultaneously — counter to the canvas
    document.querySelectorAll<HTMLElement>(".page-content").forEach((el) => {
      el.style.transition = `transform ${DURATION * 0.75}ms cubic-bezier(0.86,0,0.07,1), opacity ${DURATION * 0.6}ms ease`;
      el.style.transform = "translateX(-120px)";
      el.style.opacity = "0";
    });

    // Route after animation completes
    setTimeout(() => router.push(href), DURATION + 60);
  }, [router]);

  return { transitioning, trigger, canvasOffsetRef };
}

/* ─────────────────────────────────────────────
   FadeUp
───────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`page-content ${className}`} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(36px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FuturisticBg
   canvasOffsetRef: when >0, all dots + grid shift
   rightward by that many px — the world slides past.
───────────────────────────────────────────── */
function FuturisticBg({
  dark = false,
  canvasOffsetRef,
}: {
  dark?: boolean;
  canvasOffsetRef?: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    let W = 0, H = 0;

    const primaryColor = dark ? "rgba(240,77,122," : "rgba(224,0,70,";
    const gridColor    = dark ? "rgba(100,160,255," : "rgba(8,20,51,";
    const dotColor     = dark ? "rgba(180,210,255," : "rgba(8,20,51,";

    const PARTICLE_COUNT = 55;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number; pulse: number }[] = [];

    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width  = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.6,
          opacity: Math.random() * 0.5 + 0.15,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    const hexRings: { x: number; y: number; size: number; speed: number; phase: number; opacity: number }[] = [];
    for (let i = 0; i < 6; i++) {
      hexRings.push({ x: Math.random() * 1.2 - 0.1, y: Math.random() * 1.2 - 0.1, size: 60 + Math.random() * 80, speed: 0.0003 + Math.random() * 0.0003, phase: Math.random() * Math.PI * 2, opacity: 0.04 + Math.random() * 0.06 });
    }

    const circuits: { points: [number, number][]; progress: number; speed: number; opacity: number; color: string }[] = [];
    function buildCircuits() {
      circuits.length = 0;
      for (let i = 0; i < 8; i++) {
        const startX = Math.random() * W, startY = Math.random() * H;
        const pts: [number, number][] = [[startX, startY]];
        let cx = startX, cy = startY;
        for (let s = 0; s < 3 + Math.floor(Math.random() * 4); s++) {
          const dir = Math.floor(Math.random() * 4);
          const len = 40 + Math.random() * 120;
          if (dir === 0) cx += len; else if (dir === 1) cx -= len; else if (dir === 2) cy += len; else cy -= len;
          pts.push([cx, cy]);
        }
        circuits.push({ points: pts, progress: Math.random(), speed: 0.001 + Math.random() * 0.002, opacity: 0.12 + Math.random() * 0.2, color: Math.random() > 0.5 ? primaryColor : gridColor });
      }
    }

    const streaks: { y: number; vy: number; alpha: number; width: number; hue: number }[] = [];
    for (let i = 0; i < 4; i++) {
      streaks.push({ y: Math.random() * 2, vy: 0.00015 + Math.random() * 0.0003, alpha: 0.03 + Math.random() * 0.05, width: 0.3 + Math.random() * 0.5, hue: Math.random() > 0.5 ? 340 : 220 });
    }

    let t = 0;

    function drawHex(x: number, y: number, size: number) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        i === 0 ? ctx.moveTo(x + size * Math.cos(angle), y + size * Math.sin(angle))
                : ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
      }
      ctx.closePath();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // The world offset — when transitioning, everything shifts right
      const offset = canvasOffsetRef?.current ?? 0;

      const gridSpacing = 38;
      // Extend grid cols to cover extra offset area seamlessly
      const cols = Math.ceil((W + Math.abs(offset) + gridSpacing) / gridSpacing) + 2;
      const rows = Math.ceil(H / gridSpacing) + 1;

      // Grid origin shifts right with offset (wraps so dots tile continuously)
      const gridOriginX = offset % gridSpacing;

      for (let r = 0; r < rows; r++) {
        for (let c = -1; c < cols; c++) {
          const gx = c * gridSpacing + gridOriginX;
          const gy = r * gridSpacing;
          if (gx < -gridSpacing || gx > W + gridSpacing) continue;
          const wave = Math.sin(t * 0.6 + (c + offset / gridSpacing) * 0.4 + r * 0.3) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(gx, gy, 0.9, 0, Math.PI * 2);
          ctx.fillStyle = `${dotColor}${(0.06 + wave * 0.09).toFixed(3)})`;
          ctx.fill();
        }
      }

      // Grid lines shift with offset too
      ctx.lineWidth = 0.4;
      for (let r = 0; r < rows; r += 4) {
        const gy = r * gridSpacing;
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy);
        ctx.strokeStyle = `${gridColor}0.035)`; ctx.stroke();
      }
      for (let c = -1; c < cols; c += 4) {
        const gx = c * gridSpacing + gridOriginX;
        if (gx < -gridSpacing || gx > W + gridSpacing) continue;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H);
        ctx.strokeStyle = `${gridColor}0.035)`; ctx.stroke();
      }

      // Aurora streaks
      streaks.forEach(s => {
        s.y += s.vy;
        if (s.y > 1.3) s.y = -0.3;
        const sy = s.y * H;
        const gradient = ctx.createLinearGradient(0, sy - 60, 0, sy + 60);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(0.5, dark ? `hsla(${s.hue},80%,65%,${s.alpha})` : `hsla(${s.hue},70%,55%,${s.alpha})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, sy - 60, W * s.width, 120);
      });

      // Hex rings — shift with world
      hexRings.forEach(h => {
        h.phase += h.speed;
        const hx = (h.x * W + Math.sin(h.phase) * 40 + offset) % (W + 200) - 100;
        const hy = h.y * H + Math.cos(h.phase * 0.7) * 30;
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = `${primaryColor}${h.opacity})`;
        drawHex(hx, hy, h.size); ctx.stroke();
        ctx.strokeStyle = `${primaryColor}${h.opacity * 0.5})`;
        drawHex(hx, hy, h.size * 0.6); ctx.stroke();
      });

      // Circuits — shift with world
      circuits.forEach(c => {
        c.progress += c.speed;
        if (c.progress > 1) c.progress = 0;
        const totalLen = c.points.reduce((acc, pt, i) => {
          if (i === 0) return acc;
          const prev = c.points[i - 1];
          return acc + Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
        }, 0);
        const target = c.progress * totalLen;
        let drawn = 0;
        ctx.lineWidth = 1;
        for (let i = 1; i < c.points.length; i++) {
          const [x0, y0] = c.points[i - 1];
          const [x1, y1] = c.points[i];
          const ox0 = x0 + offset, ox1 = x1 + offset;
          const segLen = Math.hypot(x1 - x0, y1 - y0);
          if (drawn + segLen < target) {
            ctx.beginPath(); ctx.moveTo(ox0, y0); ctx.lineTo(ox1, y1);
            ctx.strokeStyle = `${c.color}${c.opacity})`; ctx.stroke();
            ctx.beginPath(); ctx.arc(ox1, y1, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `${c.color}${c.opacity * 1.5})`; ctx.fill();
            drawn += segLen;
          } else {
            const frac = (target - drawn) / segLen;
            ctx.beginPath(); ctx.moveTo(ox0, y0); ctx.lineTo(ox0 + (ox1 - ox0) * frac, y0 + (y1 - y0) * frac);
            ctx.strokeStyle = `${c.color}${c.opacity * 1.4})`; ctx.stroke();
            const tx = ox0 + (ox1 - ox0) * frac, ty = y0 + (y1 - y0) * frac;
            ctx.beginPath(); ctx.arc(tx, ty, 3, 0, Math.PI * 2);
            ctx.fillStyle = `${c.color}0.9)`; ctx.fill();
            break;
          }
        }
      });

      // Particles — drift with world offset
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        p.pulse += 0.025;
        const alpha = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        const px = (p.x + offset) % (W + 40);
        ctx.beginPath();
        ctx.arc(px < 0 ? px + W + 40 : px, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${primaryColor}${alpha.toFixed(2)})`; ctx.fill();
      });

      // Particle connections (skip during heavy transition for perf)
      if (offset < W * 0.3) {
        particles.forEach((p, i) => {
          for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const px = (p.x + offset) % (W + 40);
            const qx = (q.x + offset) % (W + 40);
            const dist = Math.hypot(px - qx, p.y - q.y);
            if (dist < 110) {
              ctx.beginPath(); ctx.moveTo(px, p.y); ctx.lineTo(qx, q.y);
              ctx.lineWidth = 0.5;
              ctx.strokeStyle = `${primaryColor}${((1 - dist / 110) * 0.12).toFixed(3)})`; ctx.stroke();
            }
          }
        });
      }

      raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => { resize(); buildCircuits(); initParticles(); });
    ro.observe(canvas);
    resize(); buildCircuits(); initParticles(); draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [dark, canvasOffsetRef]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ─────────────────────────────────────────────
   CTA Button
───────────────────────────────────────────── */
function CtaButton({ href, children, className = "", style = {}, trigger, transitioning }: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  trigger: (href: string) => void;
  transitioning: boolean;
}) {
  return (
    <button
      disabled={transitioning}
      onClick={() => trigger(href)}
      className={`cta-btn page-content ${className}`}
      style={{ cursor: transitioning ? "not-allowed" : "pointer", opacity: transitioning ? 0.7 : 1, border: "none", ...style }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function LandingPage() {
  const scrollY = useScrollY();
  const [heroMounted, setHeroMounted] = useState(false);
  const { transitioning, trigger, canvasOffsetRef } = useWorldTransition();

  useEffect(() => {
    const t = setTimeout(() => setHeroMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const navScrolled = scrollY > 20;

  return (
    <main className="min-h-screen bg-white text-[#081433]" style={{ fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif", overflow: "hidden" }}>
      <style>{`
        @keyframes float-card  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-6px)} }
        @keyframes spin-slow   { from{transform:rotate(0deg)}       to{transform:rotate(360deg)} }
        @keyframes scroll-dot  { 0%,100%{transform:translateY(0);opacity:1} 50%{transform:translateY(8px);opacity:.4} }
        @keyframes glow-pulse  { 0%,100%{box-shadow:0 0 0 0 rgba(224,0,70,0)} 50%{box-shadow:0 0 28px 4px rgba(224,0,70,0.22)} }
        @keyframes slide-x     { from{transform:translateX(-100%)} to{transform:translateX(110%) skewX(-15deg)} }
        .cta-btn               { position:relative; overflow:hidden; transition:transform .2s ease,box-shadow .2s ease; background:none; }
        .cta-btn::after        { content:''; position:absolute; inset:0; background:rgba(255,255,255,.18); transform:translateX(-110%) skewX(-15deg); }
        .cta-btn:hover::after  { animation:slide-x .55s ease forwards; }
        .cta-btn:not(:disabled):hover { transform:scale(1.03); box-shadow:0 16px 40px rgba(224,0,70,.35) !important; }
        .cta-btn:active        { transform:scale(.98); }
        .card-hover            { transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s ease; }
        .card-hover:hover      { transform:translateY(-7px) scale(1.01); box-shadow:0 30px 70px rgba(21,34,56,.15) !important; }
        .img-zoom img          { transition:transform .65s cubic-bezier(.22,1,.36,1); }
        .img-zoom:hover img    { transform:scale(1.07); }
        .growth-item           { transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s ease; }
        .growth-item:hover     { transform:translateX(6px); box-shadow:0 8px 28px rgba(21,34,56,.09); }
        .login-btn             { transition:background-color .2s ease,box-shadow .2s ease,transform .2s ease; }
        .login-btn:hover       { background-color:#FFF2F6; transform:translateY(-1px); box-shadow:0 4px 12px rgba(224,0,70,.12); }
      `}</style>

      {/* ── Navbar ── */}
      <header className="page-content" style={{ position: "sticky", top: 0, zIndex: 30, backdropFilter: "blur(20px)", backgroundColor: navScrolled ? "rgba(255,255,255,.96)" : "rgba(255,255,255,.85)", borderBottom: navScrolled ? "1px solid rgba(0,0,0,.08)" : "1px solid rgba(0,0,0,.04)", boxShadow: navScrolled ? "0 4px 24px rgba(21,34,56,.07)" : "none", transition: "all .4s ease" }}>
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="text-2xl font-black tracking-tight text-[#152238]">
            Career<span style={{ color: theme.rose2 }}>OS</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/?view=login" className="login-btn inline-flex items-center rounded-full border px-6 py-3 text-sm font-extrabold" style={{ borderColor: theme.border, color: theme.rose2, backgroundColor: "white", textDecoration: "none" }}>Log in</a>
            <CtaButton
              href="/?view=employer-onboarding"
              trigger={trigger}
              transitioning={transitioning}
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-extrabold text-white shadow-lg"
              style={{ backgroundColor: theme.rose2, boxShadow: "0 4px 16px rgba(224,0,70,.25)" }}
            >
              Employer Site
            </CtaButton>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 80px)", background: "linear-gradient(135deg,#ffffff 0%,#fff8fa 40%,#fdeef4 70%,#ffffff 100%)" }}>
        <FuturisticBg dark={false} canvasOffsetRef={canvasOffsetRef} />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,242,246,0.55) 0%, transparent 70%)" }} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]" style={{ minHeight: "calc(100vh - 80px)" }}>
          {/* Left copy */}
          <div className="max-w-xl">
            <div className="page-content" style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? "translateY(0)" : "translateY(20px)", transition: "opacity .6s ease 0ms,transform .6s cubic-bezier(.22,1,.36,1) 0ms" }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.2em]" style={{ backgroundColor: "rgba(255,242,246,.9)", color: theme.rose2, borderColor: theme.border, backdropFilter: "blur(8px)" }}>
                <Sparkles className="h-4 w-4" style={{ animation: "spin-slow 6s linear infinite" }} />
                Career navigation for every stage
              </div>
            </div>

            <div className="page-content" style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? "translateY(0)" : "translateY(28px)", transition: "opacity .7s ease 120ms,transform .7s cubic-bezier(.22,1,.36,1) 120ms" }}>
              <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-[#152238] sm:text-6xl lg:text-[4.4rem]">
                Build your career
                <br />
                <span style={{ background: `linear-gradient(135deg,${theme.rose2},${theme.rose1})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  with clarity
                </span>
                <br />
                and confidence
              </h1>
            </div>

            <div className="page-content" style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? "translateY(0)" : "translateY(24px)", transition: "opacity .7s ease 240ms,transform .7s cubic-bezier(.22,1,.36,1) 240ms" }}>
              <p className="mt-6 max-w-xl text-base leading-7" style={{ color: theme.muted }}>CareerOS helps you turn skills, experience, and evidence into a clearer career profile, a stronger living portfolio, and more realistic career direction.</p>
            </div>

            <div className="page-content" style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? "translateY(0)" : "translateY(20px)", transition: "opacity .7s ease 360ms,transform .7s cubic-bezier(.22,1,.36,1) 360ms" }}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CtaButton
                  href="/?view=onboarding"
                  trigger={trigger}
                  transitioning={transitioning}
                  className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-extrabold text-white"
                  style={{ backgroundColor: theme.rose2, boxShadow: "0 8px 28px rgba(224,0,70,.28)" }}
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </CtaButton>
                <a href="/?view=login" className="text-sm font-bold underline-offset-4 hover:underline" style={{ color: theme.muted, textDecoration: "none" }}>Already have an account?</a>
              </div>
            </div>

            <div className="page-content" style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? "translateY(0)" : "translateY(16px)", transition: "opacity .6s ease 480ms,transform .6s cubic-bezier(.22,1,.36,1) 480ms" }}>
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["8?u=aa1","8?u=bb2","8?u=cc3","8?u=dd4"].map((u, i) => (
                    <img key={i} src={`https://i.pravatar.cc/3${u}`} className="h-8 w-8 rounded-full border-2 border-white object-cover" alt="User avatar" />
                  ))}
                </div>
                <p className="text-sm font-semibold" style={{ color: theme.muted }}><span style={{ color: theme.deepNavy, fontWeight: 800 }}>2,400+</span> professionals growing with CareerOS</p>
              </div>
            </div>
          </div>

          {/* Right collage */}
          <div className="page-content relative mx-auto grid h-[500px] w-full max-w-2xl grid-cols-[1fr_.85fr] gap-4" style={{ opacity: heroMounted ? 1 : 0, transform: heroMounted ? "translateX(0)" : "translateX(40px)", transition: "opacity .9s ease 200ms,transform .9s cubic-bezier(.22,1,.36,1) 200ms" }}>
            <div className="img-zoom relative overflow-hidden rounded-[2.25rem] shadow-[0_24px_70px_rgba(21,34,56,.16)]" style={{ transform: `translateY(${scrollY * .04}px)`, willChange: "transform" }}>
              <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80" alt="Career planning discussion" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#152238]/30 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/85 px-4 py-3 backdrop-blur-md" style={{ animation: "float-card 4s ease-in-out infinite" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.rose2 }}>Profile Strength</p>
                <div className="mt-1.5 h-1.5 w-full rounded-full" style={{ backgroundColor: theme.border }}>
                  <div className="h-1.5 rounded-full" style={{ width: heroMounted ? "72%" : "0%", background: `linear-gradient(90deg,${theme.rose2},${theme.rose1})`, transition: "width 1.5s cubic-bezier(.22,1,.36,1) 1s" }} />
                </div>
                <p className="mt-1 text-xs font-extrabold text-[#152238]">72% — Keep going!</p>
              </div>
            </div>

            <div className="grid grid-rows-[.9fr_1.1fr] gap-4">
              <div className="img-zoom relative overflow-hidden rounded-[1.75rem] shadow-[0_16px_50px_rgba(21,34,56,.13)]" style={{ transform: `translateY(${scrollY * -.03}px)`, willChange: "transform" }}>
                <img src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=80" alt="Professional preparing for an interview" className="h-full w-full object-cover" />
              </div>
              <div className="img-zoom relative overflow-hidden rounded-[1.75rem] shadow-[0_16px_50px_rgba(21,34,56,.13)]" style={{ transform: `translateY(${scrollY * .05}px)`, willChange: "transform" }}>
                <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80" alt="Team reviewing opportunities" className="h-full w-full object-cover" />
                <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold text-white" style={{ background: `linear-gradient(135deg,${theme.rose2},${theme.rose1})`, animation: "float-card 5s ease-in-out 1s infinite", boxShadow: "0 4px 14px rgba(224,0,70,.4)" }}>
                  <BadgeCheck className="h-3 w-3" /> Verified
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-[#FFF2F6] blur-2xl" />
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#FDE7EE] blur-2xl" />
          </div>
        </div>

        {/* Scroll hint */}
        <div className="page-content absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5" style={{ opacity: heroMounted && scrollY < 60 ? 1 : 0, transition: "opacity .4s ease" }}>
          <p className="text-[10px] font-bold uppercase tracking-[.25em]" style={{ color: theme.muted }}>Scroll</p>
          <div className="flex h-8 w-4 items-start justify-center rounded-full border-2 pt-1" style={{ borderColor: theme.border }}>
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.rose2, animation: "scroll-dot 1.5s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ── Why CareerOS — dark ── */}
      <section className="relative overflow-hidden border-t border-[#F2E6EA]" style={{ background: "linear-gradient(160deg,#0a1628 0%,#0f1f3a 40%,#12162e 100%)" }}>
        <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24" style={{ background: "linear-gradient(to bottom,rgba(10,22,40,1),transparent)" }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to top,rgba(10,22,40,1),transparent)" }} />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 py-20 sm:px-8">
          <FadeUp className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.22em]" style={{ color: theme.rose1, backgroundColor: "rgba(240,77,122,.1)", borderColor: "rgba(240,77,122,.25)", backdropFilter: "blur(8px)" }}>
              <Sparkles className="h-4 w-4" />
              Why CareerOS
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">A smarter way to navigate careers</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6" style={{ color: "rgba(180,200,230,.7)" }}>CareerOS brings together profile building, portfolio evidence, and career exploration so each step feels more connected and easier to understand.</p>
          </FadeUp>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {whyItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <FadeUp key={item.title} delay={i * 120}>
                  <div className="card-hover img-zoom group overflow-hidden rounded-[1.75rem] border shadow-sm" style={{ borderColor: "rgba(240,77,122,.18)", backgroundColor: "rgba(255,255,255,.04)", backdropFilter: "blur(16px)" }}>
                    <div className="relative h-52 overflow-hidden">
                      <img src={item.image} alt={item.alt} className="h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent" />
                      <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg" style={{ backgroundColor: "rgba(10,22,40,.8)", border: "1px solid rgba(240,77,122,.3)", backdropFilter: "blur(8px)" }}>
                        <Icon className="h-5 w-5" style={{ color: theme.rose1 }} />
                      </div>
                      <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white" style={{ background: `linear-gradient(135deg,${theme.rose2},${theme.rose1})` }}>0{i + 1}</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-black text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6" style={{ color: "rgba(180,200,230,.65)" }}>{item.description}</p>
                      <div className="mt-4 flex items-center gap-1 text-xs font-extrabold" style={{ color: theme.rose1 }}>Learn more <ArrowRight className="h-3 w-3" /></div>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Grow with CareerOS ── */}
      <section className="relative overflow-hidden border-t border-[#F2E6EA] bg-white">
        <FuturisticBg dark={false} canvasOffsetRef={canvasOffsetRef} />
        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.9fr_1.1fr]">
          <FadeUp>
            <div className="relative">
              <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: theme.soft2 }} />
              <div className="img-zoom relative overflow-hidden rounded-[2.25rem] shadow-[0_24px_70px_rgba(21,34,56,.16)]">
                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" alt="People discussing career growth" className="h-[430px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#152238]/25 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/85 px-5 py-4 backdrop-blur-md" style={{ animation: "float-card 5s ease-in-out .5s infinite" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.muted }}>Career Match</p>
                      <p className="text-2xl font-black" style={{ color: theme.deepNavy }}>87<span className="text-base" style={{ color: theme.rose2 }}>%</span></p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full" style={{ background: `linear-gradient(135deg,${theme.rose2},${theme.rose1})` }}>
                      <LineChart className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: theme.muted }}>Up 12% from last month</p>
                </div>
              </div>
            </div>
          </FadeUp>

          <div>
            <FadeUp delay={60}>
              <p className="text-xs font-extrabold uppercase tracking-[.32em]" style={{ color: theme.rose2 }}>Grow with CareerOS</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#152238] sm:text-5xl">From profile building to career navigation.</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7" style={{ color: theme.muted }}>CareerOS connects your profile, living portfolio, and career landscape so your next move becomes easier to understand.</p>
            </FadeUp>

            <div className="mt-7 space-y-4">
              {growthItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <FadeUp key={item.title} delay={120 + i * 100}>
                    <div className="growth-item group relative overflow-hidden rounded-2xl border bg-white p-4 pl-6 shadow-sm" style={{ borderColor: "#EEF0F5" }}>
                      <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-2xl" style={{ backgroundColor: theme.rose2 }} />
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: theme.soft }}>
                          <Icon className="h-5 w-5" style={{ color: theme.rose2 }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-[#152238]">{item.title}</h3>
                            <span className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: theme.soft, color: theme.rose2 }}>Step {i + 1}</span>
                          </div>
                          <p className="mt-1 text-sm leading-6" style={{ color: theme.muted }}>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>

            <FadeUp delay={500}>
              <div className="mt-8">
                <CtaButton
                  href="/?view=onboarding"
                  trigger={trigger}
                  transitioning={transitioning}
                  className="inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-extrabold text-white shadow-xl"
                  style={{ backgroundColor: theme.rose2 }}
                >
                  Start your journey <ArrowRight className="h-5 w-5" />
                </CtaButton>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="page-content border-t border-[#F2E6EA] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xl font-extrabold text-[#152238]">Career<span style={{ color: theme.rose2 }}>OS</span></p>
          <p className="text-sm" style={{ color: theme.muted }}>A prototype career navigation platform for career growth.</p>
        </div>
      </footer>
    </main>
  );
}