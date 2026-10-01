import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../hooks/useTheme";
import { lockScroll, scrollToSection } from "../hooks/useSmoothScroll";
import { EMAIL } from "../site";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const OPEN_ORIGIN = "calc(100% - 3.5rem) 2.75rem"; // the menu button

function Navbar() {
  const { dark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Give the bar a background once the hero is over and sections scroll under it
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "#home",
      start: "bottom top+=80",
      onEnter: () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });
    return () => st.kill();
  }, []);

  // Menu: lock scroll, Esc to close, move focus in and back out
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    closeBtnRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const opener = menuBtnRef.current;
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    lockScroll(false);
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <nav
        data-hud
        className={`fixed inset-x-0 top-0 z-50 px-6 py-4 transition-[background-color,backdrop-filter] duration-300 md:px-10 lg:px-14 ${
          scrolled ? "bg-paper/80 backdrop-blur-md" : ""
        }`}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          <a
            href="#home"
            onClick={go("home")}
            className="justify-self-start text-sm font-extrabold tracking-[0.3em] text-ink"
          >
            ITZFIZZ
          </a>

          <ul className="hidden items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/70 md:flex">
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={go(id)}
                  className="relative pb-1 transition-colors duration-300 hover:text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="col-start-3 flex items-center gap-2 justify-self-end">
            <ThemeToggle dark={dark} onToggle={toggle} />
            <button
              ref={menuBtnRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen(true)}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-colors duration-300 hover:border-ink hover:bg-ink"
            >
              <span className="flex w-4 flex-col gap-1">
                <span className="h-px w-full bg-ink transition-colors duration-300 group-hover:bg-paper" />
                <span className="h-px w-2/3 bg-ink transition-all duration-300 group-hover:w-full group-hover:bg-paper" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen menu: circle reveal from the menu button */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 py-4 text-ink transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] md:px-10 lg:px-14"
        style={{ clipPath: `circle(${open ? "150%" : "0%"} at ${OPEN_ORIGIN})` }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-extrabold tracking-[0.3em]">ITZFIZZ</span>
          <div className="flex items-center gap-2">
            <ThemeToggle dark={dark} onToggle={toggle} />
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="absolute h-px w-4 rotate-45 bg-current" />
              <span className="absolute h-px w-4 -rotate-45 bg-current" />
            </button>
          </div>
        </div>

        <ul className="my-auto flex flex-col gap-2">
          {LINKS.map(({ id, label }, i) => (
            <li
              key={id}
              className={`transition-all duration-700 ease-out ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
              style={{ transitionDelay: open ? `${300 + i * 90}ms` : "0ms" }}
            >
              <a
                href={`#${id}`}
                onClick={go(id)}
                className="block text-5xl font-extrabold tracking-tight transition-opacity hover:opacity-60 sm:text-7xl"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a href={`mailto:${EMAIL}`} className="pb-4 text-lg font-semibold underline underline-offset-4">
          {EMAIL}
        </a>
      </div>
    </>
  );
}

export default Navbar;