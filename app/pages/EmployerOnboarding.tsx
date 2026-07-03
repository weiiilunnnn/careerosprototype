"use client";

import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { createEmployerStore, saveEmployerStore, setEmployerSession } from "@/features/components (employer)/store";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Globe,
  LucideIcon,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Theme — CareerOS brand, employer navy variant
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
  // employer accent — deep navy with rose pop
  darkBg: "#070F1F",
  darkMid: "#0D1A2E",
  darkCard: "rgba(255,255,255,0.04)",
} as const;

/* ─────────────────────────────────────────────
   FuturisticBg — identical canvas from landing
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
    let raf: number, W = 0, H = 0;
    const primaryColor = dark ? "rgba(240,77,122," : "rgba(224,0,70,";
    const gridColor    = dark ? "rgba(100,160,255," : "rgba(8,20,51,";
    const dotColor     = dark ? "rgba(180,210,255," : "rgba(8,20,51,";
    const PARTICLE_COUNT = 55;
    const particles: { x:number;y:number;vx:number;vy:number;r:number;opacity:number;pulse:number }[] = [];
    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio; canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35, r:Math.random()*1.8+.6, opacity:Math.random()*.5+.15, pulse:Math.random()*Math.PI*2 });
    }
    const hexRings: {x:number;y:number;size:number;speed:number;phase:number;opacity:number}[] = [];
    for (let i=0;i<6;i++) hexRings.push({x:Math.random()*1.2-.1,y:Math.random()*1.2-.1,size:60+Math.random()*80,speed:.0003+Math.random()*.0003,phase:Math.random()*Math.PI*2,opacity:.04+Math.random()*.06});
    const circuits: {points:[number,number][];progress:number;speed:number;opacity:number;color:string}[] = [];
    function buildCircuits() {
      circuits.length = 0;
      for (let i=0;i<8;i++) {
        const sx=Math.random()*W,sy=Math.random()*H,pts:[number, number][]=[[sx,sy]]; let cx=sx,cy=sy;
        for (let s=0;s<3+Math.floor(Math.random()*4);s++) { const d=Math.floor(Math.random()*4),l=40+Math.random()*120; if(d===0)cx+=l;else if(d===1)cx-=l;else if(d===2)cy+=l;else cy-=l; pts.push([cx,cy]); }
        circuits.push({points:pts,progress:Math.random(),speed:.001+Math.random()*.002,opacity:.12+Math.random()*.2,color:Math.random()>.5?primaryColor:gridColor});
      }
    }
    const streaks:{y:number;vy:number;alpha:number;width:number;hue:number}[]=[];
    for(let i=0;i<4;i++) streaks.push({y:Math.random()*2,vy:.00015+Math.random()*.0003,alpha:.03+Math.random()*.05,width:.3+Math.random()*.5,hue:Math.random()>.5?340:220});
    let t=0;
    function drawHex(x:number,y:number,size:number){ctx.beginPath();for(let i=0;i<6;i++){const a=(Math.PI/3)*i-Math.PI/6;i===0?ctx.moveTo(x+size*Math.cos(a),y+size*Math.sin(a)):ctx.lineTo(x+size*Math.cos(a),y+size*Math.sin(a))}ctx.closePath();}
    function draw() {
      ctx.clearRect(0,0,W,H); t+=.012;
      const offset=canvasOffsetRef?.current??0;
      const gs=38,cols=Math.ceil((W+Math.abs(offset)+gs)/gs)+2,rows=Math.ceil(H/gs)+1,gox=offset%gs;
      for(let r=0;r<rows;r++) for(let c=-1;c<cols;c++){const gx=c*gs+gox,gy=r*gs;if(gx<-gs||gx>W+gs)continue;const wave=Math.sin(t*.6+(c+offset/gs)*.4+r*.3)*.5+.5;ctx.beginPath();ctx.arc(gx,gy,.9,0,Math.PI*2);ctx.fillStyle=`${dotColor}${(.06+wave*.09).toFixed(3)})`;ctx.fill();}
      ctx.lineWidth=.4;
      for(let r=0;r<rows;r+=4){const gy=r*gs;ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(W,gy);ctx.strokeStyle=`${gridColor}0.035)`;ctx.stroke();}
      for(let c=-1;c<cols;c+=4){const gx=c*gs+gox;if(gx<-gs||gx>W+gs)continue;ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.strokeStyle=`${gridColor}0.035)`;ctx.stroke();}
      streaks.forEach(s=>{s.y+=s.vy;if(s.y>1.3)s.y=-.3;const sy=s.y*H,g=ctx.createLinearGradient(0,sy-60,0,sy+60);g.addColorStop(0,"transparent");g.addColorStop(.5,dark?`hsla(${s.hue},80%,65%,${s.alpha})`:`hsla(${s.hue},70%,55%,${s.alpha})`);g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.fillRect(0,sy-60,W*s.width,120);});
      hexRings.forEach(h=>{h.phase+=h.speed;const hx=(h.x*W+Math.sin(h.phase)*40+offset)%(W+200)-100,hy=h.y*H+Math.cos(h.phase*.7)*30;ctx.lineWidth=.8;ctx.strokeStyle=`${primaryColor}${h.opacity})`;drawHex(hx,hy,h.size);ctx.stroke();ctx.strokeStyle=`${primaryColor}${h.opacity*.5})`;drawHex(hx,hy,h.size*.6);ctx.stroke();});
      circuits.forEach(c=>{c.progress+=c.speed;if(c.progress>1)c.progress=0;const tl=c.points.reduce((a,pt,i)=>{if(i===0)return a;const p=c.points[i-1];return a+Math.hypot(pt[0]-p[0],pt[1]-p[1]);},0),tgt=c.progress*tl;let drawn=0;ctx.lineWidth=1;for(let i=1;i<c.points.length;i++){const[x0,y0]=c.points[i-1],[x1,y1]=c.points[i],ox0=x0+offset,ox1=x1+offset,sl=Math.hypot(x1-x0,y1-y0);if(drawn+sl<tgt){ctx.beginPath();ctx.moveTo(ox0,y0);ctx.lineTo(ox1,y1);ctx.strokeStyle=`${c.color}${c.opacity})`;ctx.stroke();ctx.beginPath();ctx.arc(ox1,y1,2.5,0,Math.PI*2);ctx.fillStyle=`${c.color}${c.opacity*1.5})`;ctx.fill();drawn+=sl;}else{const f=(tgt-drawn)/sl;ctx.beginPath();ctx.moveTo(ox0,y0);ctx.lineTo(ox0+(ox1-ox0)*f,y0+(y1-y0)*f);ctx.strokeStyle=`${c.color}${c.opacity*1.4})`;ctx.stroke();const tx=ox0+(ox1-ox0)*f,ty=y0+(y1-y0)*f;ctx.beginPath();ctx.arc(tx,ty,3,0,Math.PI*2);ctx.fillStyle=`${c.color}0.9)`;ctx.fill();break;}}});
      particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;p.pulse+=.025;const alpha=p.opacity*(.7+.3*Math.sin(p.pulse)),px=(p.x+offset)%(W+40);ctx.beginPath();ctx.arc(px<0?px+W+40:px,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`${primaryColor}${alpha.toFixed(2)})`;ctx.fill();});
      if(offset<W*.3){particles.forEach((p,i)=>{for(let j=i+1;j<particles.length;j++){const q=particles[j],px=(p.x+offset)%(W+40),qx=(q.x+offset)%(W+40),dist=Math.hypot(px-qx,p.y-q.y);if(dist<110){ctx.beginPath();ctx.moveTo(px,p.y);ctx.lineTo(qx,q.y);ctx.lineWidth=.5;ctx.strokeStyle=`${primaryColor}${((1-dist/110)*.12).toFixed(3)})`;ctx.stroke();}}});}
      raf=requestAnimationFrame(draw);
    }
    const ro=new ResizeObserver(()=>{resize();buildCircuits();initParticles();});
    ro.observe(canvas); resize(); buildCircuits(); initParticles(); draw();
    return ()=>{cancelAnimationFrame(raf);ro.disconnect();};
  },[dark,canvasOffsetRef]);
  return <canvas ref={canvasRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} />;
}

/* ─────────────────────────────────────────────
   Navbar
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
    <header style={{ position:"sticky", top:0, zIndex:30, backdropFilter:"blur(20px)", backgroundColor: scrolled?"rgba(255,255,255,.96)":"rgba(255,255,255,.85)", borderBottom: scrolled?"1px solid rgba(0,0,0,.08)":"1px solid rgba(0,0,0,.04)", boxShadow: scrolled?"0 4px 24px rgba(21,34,56,.07)":"none", transition:"all .4s ease" }}>
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" style={{ textDecoration:"none" }}>
          <div className="text-2xl font-black tracking-tight" style={{ color:theme.deepNavy }}>
            Career<span style={{ color:theme.rose2 }}>OS</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/?view=login" className="inline-flex items-center rounded-full border px-6 py-3 text-sm font-extrabold"
            style={{ borderColor:theme.border, color:theme.rose2, backgroundColor:"white", textDecoration:"none", transition:"background-color .2s ease, box-shadow .2s ease, transform .2s ease" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.backgroundColor=theme.soft;(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 12px rgba(224,0,70,.12)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.backgroundColor="white";(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.boxShadow="none";}}
          >Log in</Link>
          <Link href="/" className="inline-flex items-center rounded-full px-6 py-3 text-sm font-extrabold text-white"
            style={{ backgroundColor:theme.rose2, boxShadow:"0 4px 16px rgba(224,0,70,.25)", textDecoration:"none", transition:"transform .2s ease, box-shadow .2s ease" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.03)";(e.currentTarget as HTMLElement).style.boxShadow="0 16px 40px rgba(224,0,70,.35)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 16px rgba(224,0,70,.25)";}}
          >For Job Seekers</Link>
        </div>
      </nav>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Step Definitions
───────────────────────────────────────────── */
interface StepField {
  name: string;
  label: string;
  placeholder?: string;
  repeatable?: boolean;
  type?: "textarea" | "select" | "text";
  options?: string[];
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
    key: "company",
    label: "Company",
    title: "Tell us about your company",
    description: "Give CareerOS the context it needs to match you with the right talent.",
    icon: Building2,
    fields: [
      { name:"companyName",   label:"Company name",        placeholder:"Acme Sdn Bhd" },
      { name:"industry",      label:"Industry",            placeholder:"Technology / FinTech", type:"text" },
      { name:"companySize",   label:"Company size",        type:"select", options:["1–10","11–50","51–200","201–500","500–2,000","2,000+"] },
      { name:"founded",       label:"Year founded",        placeholder:"2018" },
      { name:"website",       label:"Company website",     placeholder:"https://acme.com" },
    ],
  },
  {
    key: "location",
    label: "Location",
    title: "Where are you hiring?",
    description: "Let us know your headquarters and the locations you recruit for.",
    icon: MapPin,
    fields: [
      { name:"hq",          label:"Headquarters city",      placeholder:"Kuala Lumpur" },
      { name:"country",     label:"Country",                placeholder:"Malaysia" },
      { name:"hiringCities",label:"Cities actively hiring", placeholder:"Penang",       repeatable:true },
      { name:"workModes",   label:"Work modes offered",     placeholder:"Hybrid",        repeatable:true },
    ],
  },
  {
    key: "culture",
    label: "Culture",
    title: "What makes your company unique?",
    description: "Candidates value culture. Help us surface what sets you apart.",
    icon: Sparkles,
    fields: [
      { name:"mission",    label:"Company mission (one line)", placeholder:"We make finance accessible to everyone.", type:"textarea" },
      { name:"values",     label:"Core values",                placeholder:"Transparency",  repeatable:true },
      { name:"perks",      label:"Perks & benefits",           placeholder:"Flexible hours", repeatable:true },
    ],
  },
  {
    key: "talent",
    label: "Talent",
    title: "What talent are you looking for?",
    description: "Describe the roles and profiles you most need right now.",
    icon: Search,
    fields: [
      { name:"rolesHiring",    label:"Roles actively hiring",    placeholder:"Data Analyst",      repeatable:true },
      { name:"skillsNeeded",   label:"Key skills you need",      placeholder:"Python",            repeatable:true },
      { name:"experienceLevel",label:"Experience levels",        placeholder:"Fresh Graduate",    repeatable:true },
      { name:"urgency",        label:"Hiring urgency",           type:"select", options:["Immediately","Within 1 month","1–3 months","3–6 months","Just exploring"] },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    title: "Who should we contact?",
    description: "We'll send shortlisted candidates and updates to this person.",
    icon: Users,
    fields: [
      { name:"contactName",  label:"Full name",         placeholder:"Ahmad Razif" },
      { name:"contactRole",  label:"Role / title",      placeholder:"Head of Talent" },
      { name:"contactEmail", label:"Work email",        placeholder:"ahmad@acme.com" },
      { name:"contactPhone", label:"Phone (optional)",  placeholder:"+60 12-345 6789" },
    ],
  },
];

const starterForm: FormState = steps.reduce<FormState>((acc, step) => {
  step.fields.forEach(f => {
    if (f.repeatable) acc[f.name] = [""];
    else acc[f.name] = "";
  });
  return acc;
}, {});

/* ─────────────────────────────────────────────
   Field components
───────────────────────────────────────────── */
function RepeatableField({ field, value, onChange }: { field:StepField; value:string|string[]; onChange:(v:string[])=>void }) {
  const values = Array.isArray(value) && value.length > 0 ? value : [""];
  const update = (i:number, v:string) => { const n=[...values]; n[i]=v; onChange(n); };
  const add = () => onChange([...values, ""]);
  const remove = (i:number) => { if (values.length===1) return; onChange(values.filter((_,j)=>j!==i)); };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color:theme.deepNavy }}>{field.label}</span>
        <button type="button" onClick={add} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold text-white" style={{ background:theme.rose2 }}>
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2.5">
        {values.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e=>update(i,e.target.value)} placeholder={i===0?field.placeholder:"Add another…"}
              className="w-full rounded-xl border bg-white/80 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 backdrop-blur-sm"
              style={{ borderColor:theme.border, color:theme.deepNavy }}
              onFocus={e=>(e.target.style.borderColor=theme.rose2)}
              onBlur={e=>(e.target.style.borderColor=theme.border)}
            />
            {values.length>1 && (
              <button type="button" onClick={()=>remove(i)} className="flex w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectField({ field, value, onChange }: { field:StepField; value:string|string[]; onChange:(v:string)=>void }) {
  return (
    <div>
      <span className="mb-2 block text-sm font-bold" style={{ color:theme.deepNavy }}>{field.label}</span>
      <select value={value as string} onChange={e=>onChange(e.target.value)}
        className="w-full rounded-xl border bg-white/80 px-4 py-3 text-sm font-medium outline-none appearance-none cursor-pointer"
        style={{ borderColor:theme.border, color: value ? theme.deepNavy : "#94a3b8" }}
        onFocus={e=>(e.target.style.borderColor=theme.rose2)}
        onBlur={e=>(e.target.style.borderColor=theme.border)}
      >
        <option value="">Select…</option>
        {field.options?.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function TextareaField({ field, value, onChange }: { field:StepField; value:string|string[]; onChange:(v:string)=>void }) {
  return (
    <div>
      <span className="mb-2 block text-sm font-bold" style={{ color:theme.deepNavy }}>{field.label}</span>
      <textarea value={value as string} onChange={e=>onChange(e.target.value)} placeholder={field.placeholder} rows={3}
        className="w-full rounded-xl border bg-white/80 px-4 py-3 text-sm font-medium outline-none resize-none placeholder:text-slate-400 backdrop-blur-sm"
        style={{ borderColor:theme.border, color:theme.deepNavy }}
        onFocus={e=>(e.target.style.borderColor=theme.rose2)}
        onBlur={e=>(e.target.style.borderColor=theme.border)}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Progress dots
───────────────────────────────────────────── */
function ProgressDots({ current }: { current:number }) {
  return (
    <div className="flex shrink-0 justify-center gap-2.5 pt-4">
      {steps.map((s,i) => (
        <div key={s.key} className="h-2.5 rounded-full transition-all duration-300"
          style={{ width:current===i?30:10, background:current===i?theme.rose2:theme.border }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Welcome screen
───────────────────────────────────────────── */
function Welcome({ onStart }: { onStart:()=>void }) {
  const [mounted, setMounted] = useState(false);
  const canvasOffsetRef = useRef(0);

  useEffect(() => {
    // settle canvas offset from landing page transition
    canvasOffsetRef.current = typeof window!=="undefined" ? window.innerWidth*0.6 : 400;
    let start:number|null=null;
    const initial = canvasOffsetRef.current;
    function settle(ts:number) {
      if(!start) start=ts;
      const p=Math.min((ts-start)/700,1), e=1-Math.pow(1-p,3);
      canvasOffsetRef.current=initial*(1-e);
      if(p<1) requestAnimationFrame(settle);
    }
    const t=setTimeout(()=>{ requestAnimationFrame(settle); setMounted(true); },60);
    return ()=>clearTimeout(t);
  },[]);

  const stats = [
    { value:"12,400+", label:"Verified candidates" },
    { value:"94%",     label:"Match accuracy" },
    { value:"18 days", label:"Avg. time to hire" },
  ];

  return (
    <div className="relative overflow-hidden" style={{ minHeight:"calc(100vh - 80px)", background:"linear-gradient(160deg,#070F1F 0%,#0D1A2E 50%,#0A1220 100%)" }}>
      <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />
      <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 70% 55% at 50% 40%, rgba(224,0,70,0.12) 0%, transparent 65%)" }} />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-5 py-16 sm:px-8 text-center">

        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.22em]"
          style={{ color:theme.rose1, backgroundColor:"rgba(240,77,122,.1)", borderColor:"rgba(240,77,122,.25)" }}
        >
          <BriefcaseBusiness className="h-4 w-4" />
          CareerOS for Employers
        </div>

        {/* Heading */}
        <h1
          className="text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl"
          style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(28px)", transition:"opacity .7s ease 100ms, transform .7s cubic-bezier(.22,1,.36,1) 100ms" }}
        >
          Find talent that<br />
          <span style={{ background:`linear-gradient(135deg,${theme.rose2},${theme.rose1})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            actually fits.
          </span>
        </h1>

        <p
          className="mt-6 max-w-xl text-base leading-7"
          style={{ color:"rgba(180,200,230,.72)", opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)", transition:"opacity .7s ease 220ms, transform .7s cubic-bezier(.22,1,.36,1) 220ms" }}
        >
          CareerOS matches your open roles against verified candidate profiles — not just resumes. Tell us about your company and we&apos;ll surface the right people.
        </p>

        {/* Stats row */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-6"
          style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(16px)", transition:"opacity .7s ease 340ms, transform .7s cubic-bezier(.22,1,.36,1) 340ms" }}
        >
          {stats.map(s=>(
            <div key={s.label} className="rounded-2xl border px-7 py-5 text-center" style={{ borderColor:"rgba(240,77,122,.18)", background:"rgba(255,255,255,.04)", backdropFilter:"blur(12px)" }}>
              <p className="text-3xl font-black text-white">{s.value}</p>
              <p className="mt-0.5 text-xs font-semibold" style={{ color:"rgba(180,200,230,.6)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-10"
          style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(12px)", transition:"opacity .6s ease 460ms, transform .6s cubic-bezier(.22,1,.36,1) 460ms" }}
        >
          <button
            onClick={onStart}
            className="inline-flex cursor-pointer items-center gap-3 rounded-full px-9 py-4 text-base font-extrabold text-white shadow-xl transition hover:scale-[1.03] active:scale-[0.98]"
            style={{ backgroundColor:theme.rose2, boxShadow:"0 8px 32px rgba(224,0,70,.38)" }}
          >
            Start Finding Talent
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="mt-3 text-xs font-medium" style={{ color:"rgba(180,200,230,.4)" }}>Free to set up · No credit card required</p>
        </div>

        {/* Trust logos placeholder */}
        <div
          className="mt-14 flex flex-col items-center gap-4"
          style={{ opacity:mounted?1:0, transition:"opacity .6s ease 580ms" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[.3em]" style={{ color:"rgba(180,200,230,.3)" }}>Trusted by companies like</p>
          <div className="flex flex-wrap justify-center gap-6">
            {["Maybank","CIMB","Grab","AirAsia","Petronas"].map(co=>(
              <div key={co} className="rounded-full border px-5 py-2 text-xs font-extrabold" style={{ borderColor:"rgba(255,255,255,.1)", color:"rgba(180,200,230,.4)" }}>{co}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Onboarding step
───────────────────────────────────────────── */
function OnboardingStep({ stepIndex, form, setForm, onNext, onBack }: {
  stepIndex:number; form:FormState; setForm:Dispatch<SetStateAction<FormState>>; onNext:()=>void; onBack:()=>void;
}) {
  const step = steps[stepIndex];
  const Icon = step.icon;
  const completed = steps.slice(0, stepIndex);
  const [mounted, setMounted] = useState(false);
  const canvasOffsetRef = useRef(0);

  useEffect(()=>{ const t=setTimeout(()=>setMounted(true),60); return ()=>clearTimeout(t); },[stepIndex]);

  const update = (name:string, val:string|string[]) => setForm(old=>({...old,[name]:val}));

  return (
    <div className="relative overflow-hidden" style={{ minHeight:"calc(100vh - 80px)", background:"linear-gradient(160deg,#070F1F 0%,#0D1A2E 50%,#0A1220 100%)" }}>
      <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />
      <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 60% 50% at 50% 0%, rgba(224,0,70,0.08) 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl px-5 py-6 sm:px-8">

        {/* top bar */}
        <div className="mb-5 flex items-center justify-between gap-4"
          style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(-12px)", transition:"opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)" }}
        >
          <p className="text-sm font-semibold" style={{ color:"rgba(180,200,230,.55)" }}>Setting up your employer profile</p>
          <div className="rounded-full px-4 py-2 text-xs font-bold" style={{ background:"rgba(240,77,122,.1)", color:theme.rose1, border:"1px solid rgba(240,77,122,.25)" }}>
            Step {stepIndex+1} of {steps.length}
          </div>
        </div>

        {/* Card grid */}
        <div
          style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(24px)", transition:"opacity .65s ease 80ms, transform .65s cubic-bezier(.22,1,.36,1) 80ms" }}
        >
          <div className="grid overflow-hidden rounded-[2rem] shadow-[0_26px_80px_rgba(5,10,20,0.5)]"
            style={{ minHeight:"calc(100vh - 170px)", gridTemplateColumns:"0.9fr 1.25fr" }}
          >
            {/* Sidebar */}
            <aside className="relative overflow-hidden" style={{ background:"linear-gradient(160deg,#040B18 0%,#091423 60%,#0A1525 100%)" }}>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
                alt="Modern office" className="absolute inset-0 h-full w-full object-cover" style={{ opacity:.18 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040B18] via-[#040B18]/80 to-[#040B18]/50" />
              <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />

              <div className="relative z-10 flex min-h-full flex-col p-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                  style={{ background:`linear-gradient(135deg,${theme.rose1},${theme.rose2})` }}>
                  <Icon className="h-7 w-7 text-white" />
                </div>

                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.22em]"
                  style={{ color:theme.rose1, backgroundColor:"rgba(240,77,122,.1)", borderColor:"rgba(240,77,122,.25)" }}>
                  <Sparkles className="h-3 w-3" /> {step.label}
                </div>

                <h2 className="mt-2 max-w-md text-3xl font-black leading-tight text-white sm:text-4xl">{step.title}</h2>
                <p className="mt-4 max-w-sm text-sm leading-7" style={{ color:"rgba(180,200,230,.68)" }}>{step.description}</p>

                {/* Why CareerOS micro-pitch */}
                <div className="mt-6 space-y-3">
                  {[
                    { icon:Target,    text:"AI-matched to your exact role requirements" },
                    { icon:BadgeCheck, text:"Candidates with verified skills & evidence" },
                    { icon:Globe,     text:"Reach talent across Malaysia & beyond" },
                  ].map(({icon:Ic,text})=>(
                    <div key={text} className="flex items-center gap-2.5 text-xs font-semibold" style={{ color:"rgba(180,200,230,.55)" }}>
                      <Ic className="h-4 w-4 shrink-0" style={{ color:"rgba(240,77,122,.7)" }} />
                      {text}
                    </div>
                  ))}
                </div>

                {/* Progress checklist */}
                <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <p className="mb-3 text-sm font-bold text-white">Employer profile</p>
                  {completed.length===0
                    ? <p className="text-sm font-medium" style={{ color:"rgba(180,200,230,.4)" }}>No section added yet</p>
                    : <div className="space-y-2.5">
                        {completed.map(s=>(
                          <div key={s.key} className="flex items-center gap-2.5 text-sm font-semibold text-white">
                            <CheckCircle2 className="h-4 w-4" style={{ color:theme.rose1 }} /> {s.label} added
                          </div>
                        ))}
                      </div>
                  }
                  <div className="mt-7 flex gap-1.5">
                    {steps.map((s,i)=>(
                      <div key={s.key} className="h-1.5 rounded-full transition-all duration-300"
                        style={{ flex:i===stepIndex?2:1, background:i<=stepIndex?theme.rose2:"rgba(255,255,255,.15)" }} />
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Form panel */}
            <div className="flex flex-col p-7" style={{ background:"rgba(255,255,255,0.97)" }}>
              <div className="mb-5 shrink-0">
                <h3 className="text-3xl font-black" style={{ color:theme.deepNavy }}>{step.label}</h3>
                <p className="mt-1 text-sm font-medium" style={{ color:theme.muted }}>Fill in the details below to continue setting up your employer account.</p>
                <div className="mt-3 h-0.5 w-12 rounded-full" style={{ background:`linear-gradient(90deg,${theme.rose2},${theme.rose1})` }} />
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto">
                {step.fields.map(field => {
                  if (field.repeatable) return (
                    <RepeatableField key={field.name} field={field} value={form[field.name]} onChange={v=>update(field.name,v)} />
                  );
                  if (field.type==="select") return (
                    <SelectField key={field.name} field={field} value={form[field.name]} onChange={v=>update(field.name,v)} />
                  );
                  if (field.type==="textarea") return (
                    <TextareaField key={field.name} field={field} value={form[field.name]} onChange={v=>update(field.name,v)} />
                  );
                  return (
                    <label key={field.name} className="block">
                      <span className="mb-2 block text-sm font-bold" style={{ color:theme.deepNavy }}>{field.label}</span>
                      <input value={form[field.name] as string} onChange={e=>update(field.name,e.target.value)} placeholder={field.placeholder}
                        className="w-full rounded-xl border bg-white/80 px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 backdrop-blur-sm"
                        style={{ borderColor:theme.border, color:theme.deepNavy }}
                        onFocus={e=>(e.target.style.borderColor=theme.rose2)}
                        onBlur={e=>(e.target.style.borderColor=theme.border)}
                      />
                    </label>
                  );
                })}
              </div>

              {/* Nav buttons */}
              <div className="mt-auto shrink-0 pt-5">
                <div className="flex gap-3">
                  {stepIndex!==0 && (
                    <button onClick={onBack} className="flex h-12 cursor-pointer items-center justify-center rounded-xl px-6 font-bold transition hover:bg-[#FDE7EE]"
                      style={{ background:theme.soft, color:theme.rose2, border:`1px solid ${theme.border}` }}>
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  )}
                  <button onClick={onNext}
                    className="flex h-12 flex-1 cursor-pointer items-center justify-center gap-3 rounded-xl font-extrabold text-white shadow-lg transition hover:scale-[1.005] active:scale-[0.995]"
                    style={{ background:stepIndex===steps.length-1?theme.rose3:theme.rose2, boxShadow:"0 8px 28px rgba(224,0,70,.28)" }}>
                    {stepIndex===steps.length-1 ? "Create Employer Profile" : "Next"}
                    <ArrowRight className="h-5 w-5" />
                  </button>
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
   Creating animation screen
───────────────────────────────────────────── */
const creationStages = [
  { label:"Building your employer profile",  detail:"Saving your company details, culture & contact info",      duration:2000 },
  { label:"Analysing your talent needs",     detail:"Mapping required roles, skills & experience levels",       duration:2600 },
  { label:"Matching top candidates",         detail:"Surfacing verified profiles that fit your open roles",      duration:2200 },
];

function CreatingProfile({ onDone }: { onDone:()=>void }) {
  const canvasOffsetRef = useRef(0);
  const [stageIndex, setStageIndex] = useState(-1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [allDone, setAllDone] = useState(false);

  useEffect(()=>{
    let cancelled=false;
    async function run() {
      for (let i=0;i<creationStages.length;i++) {
        if(cancelled) return;
        setStageIndex(i);
        await new Promise(r=>setTimeout(r,creationStages[i].duration));
        if(cancelled) return;
        setCompleted(prev=>[...prev,i]);
        await new Promise(r=>setTimeout(r,380));
      }
      if(!cancelled){ setAllDone(true); setTimeout(()=>{ if(!cancelled) onDone(); },1200); }
    }
    const t=setTimeout(run,600);
    return ()=>{ cancelled=true; clearTimeout(t); };
  },[onDone]);

  return (
    <div className="relative overflow-hidden flex items-center justify-center"
      style={{ minHeight:"calc(100vh - 80px)", background:"linear-gradient(160deg,#070F1F 0%,#0D1A2E 50%,#0A1220 100%)" }}>
      <FuturisticBg dark={true} canvasOffsetRef={canvasOffsetRef} />
      <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 60% 55% at 50% 50%, rgba(224,0,70,0.13) 0%, transparent 70%)" }} />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6 py-16 text-center">

        {/* Orbit ring */}
        <div className="relative mb-12 flex h-36 w-36 items-center justify-center">
          <div className="absolute inset-0 rounded-full" style={{ border:"2px solid transparent", borderTopColor:theme.rose2, borderRightColor:"rgba(240,77,122,0.3)", animation:allDone?"none":"spin-slow 1.1s linear infinite", opacity:allDone?0:1, transition:"opacity .4s ease" }} />
          <div className="absolute rounded-full" style={{ inset:10, border:"1px dashed rgba(240,77,122,0.22)", animation:allDone?"none":"spin-slow 3s linear infinite reverse" }} />
          <div className="absolute rounded-full" style={{ inset:22, background:allDone?`radial-gradient(circle,${theme.rose2} 0%,rgba(224,0,70,0.3) 70%)`:"radial-gradient(circle,rgba(224,0,70,0.18) 0%,rgba(224,0,70,0.05) 70%)", transition:"background .6s ease", animation:allDone?"none":"glow-pulse 2s ease-in-out infinite" }} />
          <div style={{ position:"relative", zIndex:2 }}>
            {allDone ? (
              <svg width="52" height="52" viewBox="0 0 52 52" style={{ animation:"pop-in .45s cubic-bezier(.34,1.56,.64,1) forwards" }}>
                <circle cx="26" cy="26" r="24" fill="none" stroke={theme.rose2} strokeWidth="2.5" />
                <polyline points="14,27 22,35 38,18" fill="none" stroke={theme.rose1} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation:"draw-check .5s ease forwards .1s", strokeDasharray:38, strokeDashoffset:38 }} />
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation:"spin-slow 4s linear infinite" }}>
                <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(240,77,122,0.15)" strokeWidth="2" />
                <circle cx="20" cy="4" r="3" fill={theme.rose2} />
                <circle cx="36" cy="20" r="2" fill="rgba(240,77,122,0.5)" />
                <circle cx="20" cy="36" r="1.5" fill="rgba(240,77,122,0.3)" />
              </svg>
            )}
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-8 text-2xl font-black text-white">
          {allDone ? "Your employer account is ready!" : "Setting up your account…"}
        </h2>

        {/* Stages */}
        <div className="w-full space-y-4">
          {creationStages.map((stage,i)=>{
            const isActive=stageIndex===i && !completed.includes(i);
            const isDone=completed.includes(i);
            const isPending=stageIndex<i;
            return (
              <div key={stage.label}
                className="relative overflow-hidden rounded-2xl border px-5 pb-7 pt-4 text-left transition-all duration-500"
                style={{ borderColor:isDone?"rgba(240,77,122,0.45)":isActive?"rgba(240,77,122,0.28)":"rgba(255,255,255,0.07)", background:isDone?"rgba(224,0,70,0.1)":isActive?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.03)", opacity:isPending?0.4:1, transform:isPending?"translateY(6px)":"translateY(0)" }}
              >
                {isActive && <div className="pointer-events-none absolute inset-0" style={{ background:"linear-gradient(90deg,transparent,rgba(240,77,122,0.07),transparent)", animation:"slide-x 1.6s ease infinite" }} />}
                <div className="relative flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500"
                    style={{ background:isDone?`linear-gradient(135deg,${theme.rose2},${theme.rose1})`:"rgba(240,77,122,0.15)", border:isDone?"none":`1.5px solid ${isActive?"rgba(240,77,122,0.4)":"rgba(255,255,255,0.1)"}` }}>
                    {isDone ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation:"pop-in .35s cubic-bezier(.34,1.56,.64,1)" }}>
                        <polyline points="3,8.5 6.5,12 13,5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : isActive ? (
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background:theme.rose2, animation:"glow-pulse 1s ease-in-out infinite" }} />
                    ) : (
                      <div className="h-2 w-2 rounded-full" style={{ background:"rgba(255,255,255,0.2)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold transition-colors duration-300"
                      style={{ color:isDone?theme.rose1:isActive?"white":"rgba(180,200,230,.45)" }}>
                      {stage.label}
                    </p>
                    {(isActive||isDone) && (
                      <p className="mt-0.5 text-xs font-medium" style={{ color:isDone?"rgba(240,77,122,.65)":"rgba(180,200,230,.6)", animation:"fade-up .4s ease forwards" }}>
                        {stage.detail}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <div className="flex gap-1 shrink-0">
                      {[0,1,2].map(d=>(
                        <div key={d} className="h-1.5 w-1.5 rounded-full" style={{ background:theme.rose2, animation:`bounce-dot .9s ease-in-out ${d*.15}s infinite` }} />
                      ))}
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="absolute bottom-3 left-5 right-5 h-0.5 rounded-full" style={{ background:`linear-gradient(90deg,${theme.rose2},${theme.rose1})`, animation:`progress-bar ${creationStages[i].duration}ms linear forwards`, width:0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Done message */}
        <div className="mt-10 transition-all duration-700" style={{ opacity:allDone?1:0, transform:allDone?"translateY(0)":"translateY(16px)" }}>
          <p className="text-base font-semibold" style={{ color:"rgba(180,200,230,.65)" }}>Taking you to your employer dashboard…</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Root export
───────────────────────────────────────────── */
type Screen = "welcome" | "onboarding" | "creating";

export default function EmployerOnboarding() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(starterForm);

  const goNext = () => {
    if (stepIndex < steps.length-1) setStepIndex(old=>old+1);
    else setScreen("creating");
  };
  const goBack = () => setStepIndex(old=>Math.max(0,old-1));

  const completeRegistration = () => {
    const companyName = String(form.companyName || "").trim();
    const industry = String(form.industry || "").trim();
    const hq = String(form.hq || "").trim();
    const country = String(form.country || "").trim();
    const mission = String(form.mission || "").trim();
    const contactName = String(form.contactName || "").trim();
    const contactEmail = String(form.contactEmail || "").trim().toLowerCase();
    const ownerEmail = contactEmail || `admin@${(companyName || "company").toLowerCase().replace(/[^a-z0-9]+/g, "") || "company"}.com`;
    const company = {
      name: companyName || "New Company",
      industry: industry || "Not specified",
      location: [hq, country].filter(Boolean).join(", ") || "Not specified",
      size: String(form.companySize || "").trim() || "Not specified",
      description: mission || "Employer profile created through CareerOS.",
    };
    const store = createEmployerStore({
      company,
      ownerName: contactName || "Company Admin",
      ownerEmail,
      ownerPassword: "careeros",
    });

    window.localStorage.setItem(
      "careeros-employer-company",
      JSON.stringify(company)
    );
    saveEmployerStore(store);
    setEmployerSession(ownerEmail);
    window.location.href = "/employer";
  };

  return (
    <main style={{ fontFamily:"var(--font-geist-sans), Arial, Helvetica, sans-serif", minHeight:"100vh" }}>
      <style>{`
        @keyframes spin-slow    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes glow-pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes pop-in       { 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1} }
        @keyframes fade-up      { 0%{opacity:0;transform:translateY(6px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes draw-check   { to{stroke-dashoffset:0} }
        @keyframes bounce-dot   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes progress-bar { from{width:0%} to{width:100%} }
        @keyframes slide-x      { from{transform:translateX(-100%) skewX(-15deg)} to{transform:translateX(110%) skewX(-15deg)} }
      `}</style>

      <Navbar />

      {screen==="welcome"   && <Welcome onStart={()=>setScreen("onboarding")} />}
      {screen==="onboarding" && (
        <OnboardingStep stepIndex={stepIndex} form={form} setForm={setForm} onNext={goNext} onBack={goBack} />
      )}
      {screen==="creating"  && (
        <CreatingProfile onDone={completeRegistration} />
      )}
    </main>
  );
}
