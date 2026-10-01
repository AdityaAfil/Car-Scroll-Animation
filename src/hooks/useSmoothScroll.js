import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenisInstance = null;

/**
 * Inertial smooth scrolling (Lenis) wired into GSAP's ticker, so
 * ScrollTrigger always reads the same smoothed scroll position that
 * the user sees. Skipped when the user prefers reduced motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenisInstance = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisInstance.on("scroll", ScrollTrigger.update);

    const tick = (time) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenisInstance.destroy();
      lenisInstance = null;
    };
  }, []);
}

/**
 * Lock or unlock scrolling (for modals, menus, etc.)
 */
export function lockScroll(locked) {
  if (locked) {
    document.body.style.overflow = "hidden";
    if (lenisInstance) lenisInstance.stop();
  } else {
    document.body.style.overflow = "";
    if (lenisInstance) lenisInstance.start();
  }
}

/**
 * Smooth scroll to a section by ID
 */
export function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(element, {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    // Fallback if Lenis isn't initialized
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}