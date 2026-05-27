"use client";

import { motion } from "framer-motion";
import { Bell, ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    activeKey: "dashboard",
  },
  {
    label: "Career Landscape",
    href: "/?view=career-landscape",
    activeKey: "career-landscape",
  },
  {
    label: "My Growth",
    href: "/?view=living-portfolio",
    activeKey: "my-growth",
  },
  {
    label: "Applications",
    href: "#",
    activeKey: "applications",
  },
  {
    label: "Messages",
    href: "#",
    activeKey: "messages",
  },
];

export default function Navbar() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (activeKey: string) => {
    if (activeKey === "career-landscape") {
      return view === "career-landscape" || view === "deep-dive";
    }

    if (activeKey === "my-growth") {
      return view === "living-portfolio";
    }

    return false;
  };

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-black lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <h1 className="text-2xl font-extrabold tracking-tight">
            Career<span className="text-[#f0184f]">OS</span>
          </h1>

          <div className="relative hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.activeKey);

              return (
                <Link
                  className={`relative flex h-20 items-center px-1 text-sm font-semibold transition ${
                    active ? "text-[#f0184f]" : "text-black/75 hover:text-black"
                  }`}
                  href={item.href}
                  key={item.label}
                >
                  {item.label}

                  {active ? (
                    <motion.span
                      layoutId="active-nav-glow"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#f0184f] shadow-[0_0_22px_rgba(240,24,79,0.9)]"
                      transition={{ type: "spring", stiffness: 430, damping: 32 }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-black/75 transition hover:bg-[#fff1f5] hover:text-[#f0184f]"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f0184f] shadow-[0_0_12px_rgba(240,24,79,0.8)]" />
          </button>

          <Link
            href="/?view=profile"
            className="hidden items-center gap-3 rounded-md px-2 py-1.5 transition hover:bg-[#fff1f5] sm:flex"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5c6b7] text-sm font-bold text-[#8d3c2d]">
              JT
            </span>
            <span className="text-sm font-semibold">Jason Tan</span>
            <ChevronDown size={15} />
          </Link>
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-black/5 bg-white px-5 py-3 lg:hidden">
          <div className="grid gap-1">
            {navItems.map((item) => {
              const active = isActive(item.activeKey);

              return (
                <Link
                  className={`rounded-md px-3 py-3 text-left text-sm font-semibold ${
                    active ? "bg-[#fff1f5] text-[#f0184f]" : "text-black/75"
                  }`}
                  href={item.href}
                  key={item.label}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}



// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Bell, ChevronDown, Menu, X } from "lucide-react";
// import Link from "next/link";

// const navItems = ["Dashboard", "Career Landscape", "My Growth", "Applications", "Messages"];

// export default function Navbar() {
//   const [activeItem, setActiveItem] = useState("Career Landscape");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur-xl">
//       <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
//         <div className="flex items-center gap-8">
//           <button
//             type="button"
//             className="flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-black lg:hidden"
//             onClick={() => setIsMenuOpen((current) => !current)}
//             aria-label="Toggle navigation"
//             aria-expanded={isMenuOpen}
//           >
//             {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
//           </button>

//           <h1 className="text-2xl font-extrabold tracking-tight">
//             Career<span className="text-[#f0184f]">OS</span>
//           </h1>

//           <div className="relative hidden items-center gap-8 lg:flex">
//             {navItems.map((item) => {
//               const isActive = item === activeItem;
//               const content = (
//                 <>
//                   {item}
//                   {isActive ? (
//                     <motion.span
//                       layoutId="active-nav-glow"
//                       className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#f0184f] shadow-[0_0_22px_rgba(240,24,79,0.9)]"
//                       transition={{ type: "spring", stiffness: 430, damping: 32 }}
//                     />
//                   ) : null}
//                 </>
//               );

//               const className = `relative flex h-20 items-center px-1 text-sm font-semibold transition ${
//                 isActive ? "text-[#f0184f]" : "text-black/75 hover:text-black"
//               }`;

//               return item === "Career Landscape" ? (
//                 <Link
//                   className={className}
//                   href="/?view=career-landscape"
//                   key={item}
//                   onClick={() => setActiveItem(item)}
//                 >
//                   {content}
//                 </Link>
//               ) : (
//                 <button
//                   className={className}
//                   key={item}
//                   onClick={() => setActiveItem(item)}
//                   type="button"
//                 >
//                   {content}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="flex items-center gap-4">
//           <button
//             type="button"
//             className="relative flex h-10 w-10 items-center justify-center rounded-md text-black/75 transition hover:bg-[#fff1f5] hover:text-[#f0184f]"
//             aria-label="Notifications"
//           >
//             <Bell size={18} />
//             <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f0184f] shadow-[0_0_12px_rgba(240,24,79,0.8)]" />
//           </button>

//           <Link
//             href="/?view=profile"
//             className="hidden items-center gap-3 rounded-md px-2 py-1.5 transition hover:bg-[#fff1f5] sm:flex"
//           >
//             <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5c6b7] text-sm font-bold text-[#8d3c2d]">
//               JT
//             </span>
//             <span className="text-sm font-semibold">Jason Tan</span>
//             <ChevronDown size={15} />
//           </Link>
//         </div>
//       </nav>

//       {isMenuOpen ? (
//         <div className="border-t border-black/5 bg-white px-5 py-3 lg:hidden">
//           <div className="grid gap-1">
//             {navItems.map((item) => (
//               item === "Career Landscape" ? (
//                 <Link
//                   className={`rounded-md px-3 py-3 text-left text-sm font-semibold ${
//                     item === activeItem ? "bg-[#fff1f5] text-[#f0184f]" : "text-black/75"
//                   }`}
//                   href="/"
//                   key={item}
//                   onClick={() => {
//                     setActiveItem(item);
//                     setIsMenuOpen(false);
//                   }}
//                 >
//                   {item}
//                 </Link>
//               ) : (
//                 <button
//                   key={item}
//                   type="button"
//                   className={`rounded-md px-3 py-3 text-left text-sm font-semibold ${
//                     item === activeItem ? "bg-[#fff1f5] text-[#f0184f]" : "text-black/75"
//                   }`}
//                   onClick={() => {
//                     setActiveItem(item);
//                     setIsMenuOpen(false);
//                   }}
//                 >
//                   {item}
//                 </button>
//               )
//             ))}
//           </div>
//         </div>
//       ) : null}
//     </header>
//   );
// }
