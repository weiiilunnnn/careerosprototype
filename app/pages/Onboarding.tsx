"use client";

import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  GraduationCap,
  Heart,
  Link2,
  LucideIcon,
  Plus,
  SlidersHorizontal,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Theme — mirrors LandingPage exactly
───────────────────────────────────────────── */
const theme = {
  navy: "#081433",
  deepNavy: "#152238",
  muted: "#46536D",
  rose1: "#F04D7A",
  rose2: "#E00046",
  rose3: "#D81B3F",
  soft: "#FFF2F6",
  soft2: "#FDE7EE",
  border: "#F5CBD6",
  line: "#E5E8F0",
} as const;

/* ─────────────────────────────────────────────
   Navbar — mirrors LandingPage header exactly
───────────────────────────────────────────── */
function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const scrolled = scrollY > 20;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backdropFilter: "blur(20px)",
        backgroundColor: scrolled ? "rgba(255,255,255,.96)" : "rgba(255,255,255,.85)",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,.08)" : "1px solid rgba(0,0,0,.04)",
        boxShadow: scrolled ? "0 4px 24px rgba(21,34,56,.07)" : "none",
        transition: "all .4s ease",
      }}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" style={{ textDecoration: "none" }}>
          <div className="text-2xl font-black tracking-tight" style={{ color: theme.deepNavy }}>
            Career<span style={{ color: theme.rose2 }}>OS</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/?view=login"
            className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-extrabold"
            style={{
              borderColor: theme.border,
              color: theme.rose2,
              backgroundColor: "white",
              textDecoration: "none",
              transition: "background-color .2s ease, box-shadow .2s ease, transform .2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = theme.soft;
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(224,0,70,.12)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "white";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Log in
          </Link>
          <a
            href="/employer/register"
            className="inline-flex items-center rounded-full px-6 py-3 text-sm font-extrabold text-white"
            style={{
              backgroundColor: theme.rose2,
              boxShadow: "0 4px 16px rgba(224,0,70,.25)",
              textDecoration: "none",
              transition: "transform .2s ease, box-shadow .2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(224,0,70,.35)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(224,0,70,.25)";
            }}
          >
            Employer Site
          </a>
        </div>
      </nav>
    </header>
  );
}

/* ─────────────────────────────────────────────
   FuturisticBg — identical to LandingPage
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
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      hexRings.push({
        x: Math.random() * 1.2 - 0.1,
        y: Math.random() * 1.2 - 0.1,
        size: 60 + Math.random() * 80,
        speed: 0.0003 + Math.random() * 0.0003,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.04 + Math.random() * 0.06,
      });
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

      const offset = canvasOffsetRef?.current ?? 0;

      const gridSpacing = 38;
      const cols = Math.ceil((W + Math.abs(offset) + gridSpacing) / gridSpacing) + 2;
      const rows = Math.ceil(H / gridSpacing) + 1;
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

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ─────────────────────────────────────────────
   Step definitions
───────────────────────────────────────────── */
interface StepField {
  name: string;
  label: string;
  placeholder?: string;
  repeatable?: boolean;
  type?: "file" | "text";
  helper?: string;
}

interface Step {
  key: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
  fields: StepField[];
}

type FormState = Record<string, string | string[]>;

const steps: Step[] = [
  {
    key: "education",
    label: "Education",
    title: "Where are you starting from?",
    description: "Share your academic background so CareerOS can understand your foundation.",
    icon: GraduationCap,
    fields: [
      { name: "university", label: "University or institution", placeholder: "Asia Pacific University" },
      { name: "course", label: "Course or programme", placeholder: "Computer Science" },
      { name: "specialisation", label: "Specialisation", placeholder: "Data Analytics" },
    ],
  },
  {
    key: "skills",
    label: "Skills",
    title: "What can you already do?",
    description: "Add technical tools, soft skills, and strengths that represent your current ability.",
    icon: Sparkles,
    fields: [
      { name: "technicalSkills", label: "Technical skills", placeholder: "Python", repeatable: true },
      { name: "tools", label: "Tools", placeholder: "Power BI", repeatable: true },
      { name: "softSkills", label: "Soft skills", placeholder: "Communication", repeatable: true },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    title: "What have you tried or built before?",
    description: "Include internships, projects, hackathons, part time work, or leadership experience.",
    icon: BriefcaseBusiness,
    fields: [
      { name: "internship", label: "Internship or work exposure", placeholder: "Data analyst intern", repeatable: true },
      { name: "projects", label: "Projects", placeholder: "Dashboard project", repeatable: true },
    ],
  },
  {
    key: "interests",
    label: "Interests",
    title: "What kind of work attracts you?",
    description: "CareerOS uses interests to avoid recommending paths based only on skills.",
    icon: Heart,
    fields: [
      { name: "careerFields", label: "Career fields", placeholder: "Data analytics", repeatable: true },
      { name: "roleStyle", label: "Preferred role style", placeholder: "Technical", repeatable: true },
    ],
  },
  {
    key: "preferences",
    label: "Preferences",
    title: "What kind of opportunity fits you?",
    description: "Tell us the work environment and opportunity type that match your current goals.",
    icon: SlidersHorizontal,
    fields: [
      { name: "location", label: "Preferred location", placeholder: "Kuala Lumpur", repeatable: true },
      { name: "workMode", label: "Work mode", placeholder: "Hybrid", repeatable: true },
      { name: "companyType", label: "Company type", placeholder: "MNC", repeatable: true },
      { name: "goal", label: "Current goal", placeholder: "Internship", repeatable: true },
    ],
  },
  {
    key: "uploads",
    label: "Uploads",
    title: "Add evidence to strengthen your profile.",
    description: "Upload or link proof of your skills so your Living Portfolio becomes more credible.",
    icon: Upload,
    fields: [
      { name: "resume", label: "Resume or CV", type: "file", helper: "Upload one or more PDF, DOCX, or image files" },
      { name: "certificates", label: "Certificates", type: "file", helper: "Upload one or more certificates or achievement proofs" },
      { name: "portfolio", label: "Portfolio or GitHub link", type: "text", placeholder: "https://github.com/yourname" },
    ],
  },
];

const starterForm: FormState = steps.reduce<FormState>((acc, step) => {
  step.fields.forEach((field) => {
    if (field.type === "file") acc[field.name] = [];
    else if (field.repeatable) acc[field.name] = [""];
    else acc[field.name] = "";
  });
  return acc;
}, {});

/* ─────────────────────────────────────────────
   RepeatableTextField
───────────────────────────────────────────── */
function RepeatableTextField({ field, value, onChange }: { field: StepField; value: string | string[]; onChange: (v: string[]) => void }) {
  const values = Array.isArray(value) && value.length > 0 ? value : [""];
  const updateItem = (index: number, v: string) => { const n = [...values]; n[index] = v; onChange(n); };
  const addItem = () => onChange([...values, ""]);
  const removeItem = (index: number) => { if (values.length === 1) return; onChange(values.filter((_, i) => i !== index)); };

  return (
    <div className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="block text-sm font-bold" style={{ color: theme.deepNavy }}>{field.label}</span>
        <button type="button" onClick={addItem} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold text-white shadow-sm transition hover:scale-[1.02]" style={{ background: theme.rose2 }}>
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2.5">
        {values.map((item, index) => (
          <div key={`${field.name}-${index}`} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={index === 0 ? field.placeholder : "Others"}
              className="w-full rounded-xl border bg-white/80 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 backdrop-blur-sm focus:border-[#E00046] focus:ring-1 focus:ring-[#E00046]/30"
              style={{ borderColor: theme.border, color: theme.deepNavy }}
            />
            {values.length > 1 && (
              <button type="button" onClick={() => removeItem(index)} className="flex w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FileUploadField
───────────────────────────────────────────── */
function FileUploadField({ field, value, onChange }: { field: StepField; value: string | string[]; onChange: (v: string[]) => void }) {
  const files = Array.isArray(value) ? value : [];
  const fileSummary = files.length === 0 ? "No file selected" : `${files.length} file${files.length > 1 ? "s" : ""} selected`;
  const inputId = `file-upload-${field.name}`;
  const removeFile = (fileIndex: number) => onChange(files.filter((_, i) => i !== fileIndex));

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-bold" style={{ color: theme.deepNavy }}>{field.label}</span>
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-white/80 px-4 py-3 backdrop-blur-sm" style={{ borderColor: theme.border }}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: theme.soft }}>
            <Upload className="h-5 w-5" style={{ color: theme.rose2 }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold" style={{ color: theme.deepNavy }}>{fileSummary}</p>
            <p className="truncate text-xs font-medium text-slate-400">{field.helper}</p>
          </div>
        </div>
        <label htmlFor={inputId} className="shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-extrabold text-white transition hover:scale-[1.02]" style={{ background: theme.rose2 }}>Upload</label>
        <input id={inputId} type="file" multiple className="hidden" onChange={(e) => { const names = Array.from(e.target.files ?? []).map(f => f.name); onChange([...files, ...names]); e.target.value = ""; }} />
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((fileName, index) => (
            <div key={`${fileName}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border bg-white/80 px-4 py-2" style={{ borderColor: theme.border }}>
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="h-4 w-4 shrink-0" style={{ color: theme.rose2 }} />
                <span className="truncate text-sm font-semibold text-slate-700">{fileName}</span>
              </div>
              <button type="button" onClick={() => removeFile(index)} className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Progress Dots
───────────────────────────────────────────── */
function ProgressDots({ current }: { current: number }) {
  return (
    <div className="flex shrink-0 justify-center gap-2.5 pt-4">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className="h-2.5 rounded-full transition-all duration-300"
          style={{ width: current === index ? 30 : 10, background: current === index ? theme.rose2 : theme.border }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Welcome Screen — continues landing page world
───────────────────────────────────────────── */
function Welcome({ onStart }: { onStart: () => void }) {
  const [mounted, setMounted] = useState(false);
  const canvasOffsetRef = useRef(0);

  useEffect(() => {
    // Simulate the canvas offset arriving from the landing page transition
    // Start offset at half-screen (mid-sweep) and smoothly settle to 0
    canvasOffsetRef.current = typeof window !== "undefined" ? window.innerWidth * 0.6 : 400;
    let start: number | null = null;
    const SETTLE = 700;
    const initialOffset = canvasOffsetRef.current;

    function settle(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / SETTLE, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      canvasOffsetRef.current = initialOffset * (1 - eased);
      if (progress < 1) requestAnimationFrame(settle);
    }
    const t = setTimeout(() => {
      requestAnimationFrame(settle);
      setMounted(true);
    }, 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "calc(100vh - 80px)",
        background: "linear-gradient(135deg,#ffffff 0%,#fff8fa 40%,#fdeef4 70%,#ffffff 100%)",
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      <FuturisticBg dark={false} canvasOffsetRef={canvasOffsetRef} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,242,246,0.55) 0%, transparent 70%)" }} />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-16 sm:px-8">
        <div className="w-full overflow-hidden rounded-[2.25rem] shadow-[0_32px_90px_rgba(19,31,51,0.2)]" style={{ background: "linear-gradient(160deg,#0a1628 0%,#0f1f3a 40%,#12162e 100%)" }}>
          <div className="relative min-h-[520px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1800&q=80"
              alt="Students and young professionals planning their career"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ opacity: 0.35 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/95 via-[#0a1628]/65 to-[#0a1628]/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/70 via-transparent to-transparent" />

            {/* Canvas lives inside the dark card too */}
            <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />

            <div className="relative z-10 flex min-h-[520px] flex-col items-start justify-center px-10 sm:px-16 lg:px-20">
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity .7s ease 300ms, transform .7s cubic-bezier(.22,1,.36,1) 300ms",
                }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.22em]" style={{ color: theme.rose1, backgroundColor: "rgba(240,77,122,.1)", borderColor: "rgba(240,77,122,.25)" }}>
                  <Sparkles className="h-4 w-4" style={{ animation: "spin-slow 6s linear infinite" }} />
                  Welcome to CareerOS
                </div>

                <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Build your first
                  <br />
                  <span style={{ background: `linear-gradient(135deg,${theme.rose2},${theme.rose1})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    Living Portfolio.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-base leading-7" style={{ color: "rgba(180,200,230,.75)" }}>
                  Answer a few questions about your background, skills, and goals. CareerOS will build your career profile and show you realistic paths forward.
                </p>

                <button
                  onClick={onStart}
                  className="mt-9 inline-flex cursor-pointer items-center gap-3 rounded-full px-8 py-4 text-base font-extrabold text-white shadow-xl transition hover:scale-[1.03] active:scale-[0.98]"
                  style={{ backgroundColor: theme.rose2, boxShadow: `0 8px 32px rgba(224,0,70,.35)` }}
                >
                  Start Onboarding
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   OnboardingStep — landing page aesthetic
───────────────────────────────────────────── */
function OnboardingStep({
  stepIndex,
  form,
  setForm,
  onNext,
  onBack,
}: {
  stepIndex: number;
  form: FormState;
  setForm: Dispatch<SetStateAction<FormState>>;
  onNext: () => void;
  onBack: () => void;
}) {
  const step = steps[stepIndex];
  const Icon = step.icon;
  const completedSteps = steps.slice(0, stepIndex);
  const [mounted, setMounted] = useState(false);
  const canvasOffsetRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [stepIndex]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "calc(100vh - 80px)",
        background: "linear-gradient(135deg,#ffffff 0%,#fff8fa 40%,#fdeef4 70%,#ffffff 100%)",
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
      }}
    >
      {/* Landing-style bg canvas */}
      <FuturisticBg dark={false} canvasOffsetRef={canvasOffsetRef} />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,242,246,0.45) 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8">
        {/* Header row */}
        <div
          className="mb-5 flex items-center justify-between gap-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-12px)",
            transition: "opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: theme.muted }}>Building your career profile</p>
          <div className="rounded-full px-4 py-2 text-xs font-bold" style={{ background: theme.soft, color: theme.rose2, border: `1px solid ${theme.border}` }}>
            Step {stepIndex + 1} of {steps.length}
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(24px)",
            transition: "opacity .65s ease 80ms, transform .65s cubic-bezier(.22,1,.36,1) 80ms",
          }}
        >
          <div className="grid overflow-hidden rounded-[2rem] shadow-[0_26px_80px_rgba(19,31,51,0.15)]" style={{ minHeight: "calc(100vh - 170px)", gridTemplateColumns: "0.9fr 1.25fr" }}>

            {/* ── Sidebar (dark, landing-page dark section style) ── */}
            <aside className="relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0a1628 0%,#0f1f3a 40%,#12162e 100%)" }}>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80"
                alt="Career planning"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: 0.25 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/78 to-[#0a1628]/45" />

              {/* Dark canvas in sidebar */}
              <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />

              <div className="relative z-10 flex min-h-full flex-col p-8">
                {/* Step icon */}
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                  style={{ background: `linear-gradient(135deg,${theme.rose1},${theme.rose2})` }}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.22em]" style={{ color: theme.rose1, backgroundColor: "rgba(240,77,122,.1)", borderColor: "rgba(240,77,122,.25)" }}>
                  <Sparkles className="h-3 w-3" /> {step.label}
                </div>

                <h2 className="mt-3 max-w-md text-3xl font-black leading-tight text-white sm:text-4xl">
                  {step.title}
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-7" style={{ color: "rgba(180,200,230,.72)" }}>
                  {step.description}
                </p>

                {/* Progress checklist */}
                <div className="mt-auto rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                  <p className="mb-3 text-sm font-bold text-white">Career profile building</p>
                  {completedSteps.length === 0 ? (
                    <p className="text-sm font-medium" style={{ color: "rgba(180,200,230,.5)" }}>No section added yet</p>
                  ) : (
                    <div className="space-y-2.5">
                      {completedSteps.map(s => (
                        <div key={s.key} className="flex items-center gap-2.5 text-sm font-semibold text-white">
                          <CheckCircle2 className="h-4 w-4" style={{ color: theme.rose1 }} />
                          {s.label} added
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mini step dots */}
                  <div className="mt-4 flex gap-2">
                    {steps.map((s, i) => (
                      <div
                        key={s.key}
                        className="h-1.5 rounded-full transition-all duration-300"
                        style={{ flex: i === stepIndex ? 2 : 1, background: i <= stepIndex ? theme.rose2 : "rgba(255,255,255,.2)" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Form panel (white, light style) ── */}
            <div className="flex flex-col bg-white/90 backdrop-blur-sm p-7">
              <div className="mb-5 shrink-0">
                <h3 className="text-3xl font-black" style={{ color: theme.deepNavy }}>{step.label}</h3>
                <p className="mt-1 text-sm font-medium" style={{ color: theme.muted }}>Complete this section to improve your first Living Portfolio.</p>
                <div className="mt-3 h-0.5 w-12 rounded-full" style={{ background: `linear-gradient(90deg,${theme.rose2},${theme.rose1})` }} />
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto">
                {step.fields.map((field) => {
                  if (field.type === "file") {
                    return (
                      <FileUploadField
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        onChange={(val) => setForm(old => ({ ...old, [field.name]: val }))}
                      />
                    );
                  }
                  if (field.repeatable) {
                    return (
                      <RepeatableTextField
                        key={field.name}
                        field={field}
                        value={form[field.name]}
                        onChange={(val) => setForm(old => ({ ...old, [field.name]: val }))}
                      />
                    );
                  }
                  return (
                    <label key={field.name} className="block">
                      <span className="mb-2 block text-sm font-bold" style={{ color: theme.deepNavy }}>{field.label}</span>
                      <div className="relative">
                        {field.name === "portfolio" && (
                          <Link2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        )}
                        <input
                          value={form[field.name] as string}
                          onChange={(e) => setForm(old => ({ ...old, [field.name]: e.target.value }))}
                          placeholder={field.placeholder}
                          className={`w-full rounded-xl border bg-white/80 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 backdrop-blur-sm focus:ring-1 focus:ring-[#E00046]/30 ${field.name === "portfolio" ? "pl-11 pr-4" : "px-4"}`}
                          style={{ borderColor: theme.border, color: theme.deepNavy, "--tw-ring-color": theme.rose2 } as React.CSSProperties}
                          onFocus={e => (e.target.style.borderColor = theme.rose2)}
                          onBlur={e => (e.target.style.borderColor = theme.border)}
                        />
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-auto shrink-0 pt-5">
                <div className="flex gap-3">
                  {stepIndex !== 0 && (
                    <button
                      onClick={onBack}
                      className="flex h-12 cursor-pointer items-center justify-center rounded-xl px-6 font-bold transition hover:bg-[#FDE7EE]"
                      style={{ background: theme.soft, color: theme.rose2, border: `1px solid ${theme.border}` }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  )}

                  {stepIndex === steps.length - 1 ? (
                    <button
                      onClick={onNext}
                      className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl font-extrabold text-white shadow-lg transition hover:scale-[1.005] active:scale-[0.995]"
                      style={{ background: theme.rose3, boxShadow: `0 8px 28px rgba(224,0,70,.28)` }}
                    >
                      Create User Profile
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={onNext}
                      className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl font-extrabold text-white shadow-lg transition hover:scale-[1.005] active:scale-[0.995]"
                      style={{ background: theme.rose2, boxShadow: `0 8px 28px rgba(224,0,70,.28)` }}
                    >
                      Next
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <ProgressDots current={stepIndex} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CreatingProfile — animated loading screen
───────────────────────────────────────────── */
const creationStages = [
  { label: "Creating your profile",      detail: "Organising your education, skills & experience",  duration: 2200 },
  { label: "Calculating career paths",   detail: "Mapping your profile against 400+ career routes",  duration: 2600 },
  { label: "Matching best careers & jobs", detail: "Finding the roles that fit you right now",       duration: 2000 },
];

function CreatingProfile({ onDone }: { onDone: () => void }) {
  const canvasOffsetRef = useRef(0);
  // stageIndex: which stage is currently animating (-1 = not started)
  const [stageIndex, setStageIndex] = useState(-1);
  // completedUp: stages whose tick has fully appeared
  const [completed, setCompleted] = useState<number[]>([]);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      for (let i = 0; i < creationStages.length; i++) {
        if (cancelled) return;
        setStageIndex(i);
        await new Promise(r => setTimeout(r, creationStages[i].duration));
        if (cancelled) return;
        setCompleted(prev => [...prev, i]);
        await new Promise(r => setTimeout(r, 380)); // small pause after tick
      }
      if (!cancelled) {
        setAllDone(true);
        // auto-navigate after a beat
        setTimeout(() => { if (!cancelled) onDone(); }, 1100);
      }
    }

    // slight initial delay so page entrance animation lands first
    const t = setTimeout(run, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, [onDone]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: "calc(100vh - 80px)",
        background: "linear-gradient(160deg,#0a1628 0%,#0f1f3a 50%,#12162e 100%)",
        fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />

      {/* radial glow centre */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(224,0,70,0.13) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 py-16 text-center">

        {/* Central orbit ring */}
        <div className="relative mb-12 flex h-36 w-36 items-center justify-center">
          {/* outer spinning ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid transparent",
              borderTopColor: theme.rose2,
              borderRightColor: "rgba(240,77,122,0.3)",
              animation: allDone ? "none" : "spin-slow 1.1s linear infinite",
              opacity: allDone ? 0 : 1,
              transition: "opacity .4s ease",
            }}
          />
          {/* middle dashed ring */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 10,
              border: "1px dashed rgba(240,77,122,0.22)",
              animation: allDone ? "none" : "spin-slow 3s linear infinite reverse",
            }}
          />
          {/* inner glow disc */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 22,
              background: allDone
                ? `radial-gradient(circle, ${theme.rose2} 0%, rgba(224,0,70,0.3) 70%)`
                : "radial-gradient(circle, rgba(224,0,70,0.18) 0%, rgba(224,0,70,0.05) 70%)",
              transition: "background .6s ease",
              animation: allDone ? "none" : "glow-pulse 2s ease-in-out infinite",
            }}
          />
          {/* Icon / tick */}
          <div style={{ position: "relative", zIndex: 2 }}>
            {allDone ? (
              <svg
                width="52" height="52" viewBox="0 0 52 52"
                style={{ animation: "pop-in .45s cubic-bezier(.34,1.56,.64,1) forwards" }}
              >
                <circle cx="26" cy="26" r="24" fill="none" stroke={theme.rose2} strokeWidth="2.5" />
                <polyline
                  points="14,27 22,35 38,18"
                  fill="none"
                  stroke={theme.rose1}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: "draw-check .5s ease forwards .1s", strokeDasharray: 38, strokeDashoffset: 38 }}
                />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: "spin-slow 4s linear infinite" }}>
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(240,77,122,0.15)" strokeWidth="2" />
                <circle cx="20" cy="4" r="3" fill={theme.rose2} />
                <circle cx="36" cy="20" r="2" fill="rgba(240,77,122,0.5)" />
                <circle cx="20" cy="36" r="1.5" fill="rgba(240,77,122,0.3)" />
              </svg>
            )}
          </div>
        </div>

        {/* Stage list */}
        <div className="w-full space-y-4">
          {creationStages.map((stage, i) => {
            const isActive    = stageIndex === i && !completed.includes(i);
            const isDone      = completed.includes(i);
            const isPending   = stageIndex < i;

            return (
              <div
                key={stage.label}
                className="relative overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-500"
                style={{
                  borderColor: isDone
                    ? "rgba(240,77,122,0.45)"
                    : isActive
                    ? "rgba(240,77,122,0.28)"
                    : "rgba(255,255,255,0.07)",
                  background: isDone
                    ? "rgba(224,0,70,0.1)"
                    : isActive
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.03)",
                  opacity: isPending ? 0.4 : 1,
                  transform: isPending ? "translateY(6px)" : "translateY(0)",
                }}
              >
                {/* active shimmer sweep */}
                {isActive && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(240,77,122,0.07),transparent)", animation: "slide-x 1.6s ease infinite" }}
                  />
                )}

                <div className="relative flex items-center gap-4">
                  {/* status icon */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500"
                    style={{
                      background: isDone
                        ? `linear-gradient(135deg,${theme.rose2},${theme.rose1})`
                        : isActive
                        ? "rgba(240,77,122,0.15)"
                        : "rgba(255,255,255,0.06)",
                      border: isDone ? "none" : `1.5px solid ${isActive ? "rgba(240,77,122,0.4)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {isDone ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: "pop-in .35s cubic-bezier(.34,1.56,.64,1)" }}>
                        <polyline
                          points="3,8.5 6.5,12 13,5"
                          fill="none" stroke="white" strokeWidth="2.2"
                          strokeLinecap="round" strokeLinejoin="round"
                          style={{ strokeDasharray: 20, strokeDashoffset: 0 }}
                        />
                      </svg>
                    ) : isActive ? (
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: theme.rose2, animation: "glow-pulse 1s ease-in-out infinite" }}
                      />
                    ) : (
                      <div className="h-2 w-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-extrabold transition-colors duration-300"
                      style={{ color: isDone ? theme.rose1 : isActive ? "white" : "rgba(180,200,230,0.45)" }}
                    >
                      {stage.label}
                    </p>
                    {(isActive || isDone) && (
                      <p
                        className="mt-0.5 text-xs font-medium"
                        style={{
                          color: isDone ? "rgba(240,77,122,0.65)" : "rgba(180,200,230,0.6)",
                          animation: "fade-up .4s ease forwards",
                        }}
                      >
                        {stage.detail}
                      </p>
                    )}
                  </div>

                  {/* loading dots for active */}
                  {isActive && (
                    <div className="flex gap-1 shrink-0">
                      {[0,1,2].map(d => (
                        <div
                          key={d}
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            background: theme.rose2,
                            animation: `bounce-dot .9s ease-in-out ${d * 0.15}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* active progress bar */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 rounded-full"
                      style={{
                        background: `linear-gradient(90deg,${theme.rose2},${theme.rose1})`,
                        animation: `progress-bar ${creationStages[i].duration}ms linear forwards`,
                        width: 0,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* All done message */}
        <div
          className="mt-10 transition-all duration-700"
          style={{
            opacity: allDone ? 1 : 0,
            transform: allDone ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p className="text-lg font-black text-white">Your profile is ready!</p>
          <p className="mt-1 text-sm font-medium" style={{ color: "rgba(180,200,230,0.65)" }}>Taking you to your Best Jobs…</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root export
───────────────────────────────────────────── */
type Screen = "welcome" | "onboarding" | "creating";

export default function Onboarding() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(starterForm);

  const goNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex(old => old + 1);
    else setScreen("creating");
  };
  const goBack = () => setStepIndex(old => Math.max(0, old - 1));

  return (
    <main style={{ fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif", minHeight: "100vh", background: "white" }}>
      <style>{`
        @keyframes spin-slow    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes float-card   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes slide-x      { from{transform:translateX(-100%) skewX(-15deg)} to{transform:translateX(110%) skewX(-15deg)} }
        @keyframes glow-pulse   { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes pop-in       { 0%{transform:scale(0.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes fade-up      { 0%{opacity:0;transform:translateY(6px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes draw-check   { to{stroke-dashoffset:0} }
        @keyframes bounce-dot   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes progress-bar { from{width:0%} to{width:100%} }
      `}</style>

      <Navbar />

      {screen === "welcome" && <Welcome onStart={() => setScreen("onboarding")} />}
      {screen === "onboarding" && (
        <OnboardingStep
          stepIndex={stepIndex}
          form={form}
          setForm={setForm}
          onNext={goNext}
          onBack={goBack}
        />
      )}
      {screen === "creating" && (
        <CreatingProfile onDone={() => { window.location.href = "/?view=career-landscape"; }} />
      )}
    </main>
  );
}
