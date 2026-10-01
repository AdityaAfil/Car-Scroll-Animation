import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "./Navbar";
import Stats from "./Stats";
import ScrollIndicator from "./ScrollIndicator";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "WELCOME ITZFIZZ";

// ---- Tuning knobs (all relative to the car's width) -------------------
const NOSE = 0.03; // transparent margin in car.png before the nose / tail
const START_VISIBLE = 0.32; // how much of the car peeks in at the LEFT edge at rest
const END_VISIBLE = 0.32; // how much of the car is still visible at the RIGHT edge at the end
const REVEAL_AT = 0.5; // how far behind the nose the reveal edge sits (0.5 = mid-body)
// ---- Card fade (in px of car travel) ----------------------------------
const CARD_LEAD = 160; // a card starts emerging this far before the nose reaches it
const CARD_SPAN = 240; // ...and is fully in place after this much more travel
const CHAR_SPAN = 0.5; // headline letters finish rising within this much car-length

const clamp01 = gsap.utils.clamp(0, 1);
const smooth = (t) => t * t * (3 - 2 * t);

function Hero() {
  const sceneRef = useRef(null);
  const bandRef = useRef(null);
  const revealRef = useRef(null);
  const carPosRef = useRef(null);
  const carTiltRef = useRef(null);
  const carImgRef = useRef(null);

  useSmoothScroll();

  useLayoutEffect(() => {
    const scene = sceneRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const m = { W: 0, cw: 0, cards: [], chars: [] };
    const counting = new Map(); // card element -> running count-up tween
    let tilt = () => {};
    const onScrollEnd = () => tilt(0);

    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray("[data-char]");
      const stats = gsap.utils.toArray("[data-stat]");
      const counters = gsap.utils.toArray("[data-count]");
      const hud = gsap.utils.toArray("[data-hud]");
      const hint = scene.querySelector("[data-scroll-hint]");

      // ---------------------------------------------------------------
      // Measure: cache the sizes/positions the scroll logic depends on.
      // Re-run on every ScrollTrigger refresh (resize, font load).
      // ---------------------------------------------------------------
      const measure = () => {
        const sceneBox = scene.getBoundingClientRect();
        m.W = scene.clientWidth;
        m.cw = carPosRef.current.offsetWidth;
        m.chars = chars.map((el) => {
          const r = el.getBoundingClientRect();
          return { el, center: r.left - sceneBox.left + r.width / 2 };
        });
        m.cards = stats.map((el) => {
          const r = el.getBoundingClientRect();
          const num = el.querySelector("[data-count]");
          return {
            el,
            center: r.left - sceneBox.left + r.width / 2,
            dir: el.dataset.row === "top" ? -1 : 1,
            num,
            value: Number(num.dataset.count),
          };
        });
      };

      // ---------------------------------------------------------------
      // Render: one progress value (0 -> 1) drives EVERYTHING, so the
      // car, the dark wipe and the cards can never drift out of sync.
      // ---------------------------------------------------------------
      const render = (p) => {
        const { W, cw } = m;

        // "front" = x of the car's nose. It drives left -> right.
        const frontStart = START_VISIBLE * cw;
        const frontEnd = W + (1 - NOSE - END_VISIBLE) * cw;
        const front = frontStart + (frontEnd - frontStart) * p;
        const edge = front - REVEAL_AT * cw; // everything left of this is revealed

        // Car (its left edge sits (1 - NOSE) car-widths behind the nose)
        gsap.set(carPosRef.current, { x: front - (1 - NOSE) * cw });

        // Green band + headline are uncovered behind the car
        const hidden = gsap.utils.clamp(0, W, W - edge);
        gsap.set(revealRef.current, { clipPath: `inset(0px ${hidden}px 0px 0px)` });

        // Letters rise into place just as they come out from behind the car
        m.chars.forEach(({ el, center }) => {
          const t = smooth(clamp01((edge - center) / (CHAR_SPAN * cw)));
          gsap.set(el, { opacity: t, yPercent: (1 - t) * 45 });
        });

        // Cards emerge (left ones first) as the nose passes them, and their
        // numbers count up each time they appear.
        m.cards.forEach(({ el, center, dir, num, value }) => {
          const t = smooth(clamp01((front - (center - CARD_LEAD)) / CARD_SPAN));
          gsap.set(el, { opacity: t, y: -dir * (1 - t) * 22, scale: 0.94 + 0.06 * t });

          const shown = counting.get(el);
          if (t > 0.02 && !shown) {
            const counter = { v: 0 };
            counting.set(el, gsap.to(counter, {
              v: value,
              duration: reduce ? 0 : 1.2,
              ease: "power2.out",
              onUpdate: () => (num.textContent = Math.round(counter.v)),
            }));
          } else if (t <= 0.001 && shown) {
            shown.kill();
            counting.delete(el);
            num.textContent = "0";
          }
        });

        // Scroll hint disappears as soon as the user starts
        if (hint) gsap.set(hint, { opacity: 1 - clamp01(p * 12) });
      };

      if (!reduce) counters.forEach((el) => (el.textContent = "0"));
      measure();
      render(0);

      // ---------------------------------------------------------------
      // Intro: one orchestrated entrance. It animates the *inner*
      // layers only, so it never conflicts with the scroll logic above.
      // ---------------------------------------------------------------
      if (!reduce) {
        gsap.set(bandRef.current, { scaleX: 0 });
        gsap.set(carImgRef.current, { x: -340, opacity: 0 });
        gsap.set(hud, { opacity: 0 });

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .to(bandRef.current, { scaleX: 1, duration: 1.1, ease: "power4.inOut" }, 0)
          .to(carImgRef.current, { x: 0, opacity: 1, duration: 1.5 }, 0.6)
          .to(hud, { opacity: 1, duration: 0.8 }, 1.2);
      }

      // ---------------------------------------------------------------
      // Scroll: a single scrubbed tween of a progress proxy.
      // ---------------------------------------------------------------
      if (!reduce) tilt = gsap.quickTo(carTiltRef.current, "rotation", { duration: 0.6, ease: "power3.out" });

      const state = { p: 0 };
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => render(state.p),
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "bottom bottom",
          scrub: reduce ? true : 0.6,
          onRefresh: () => {
            measure();
            render(state.p);
          },
          // Scroll speed -> a slight nose-up lean, then settle
          onUpdate: (self) => {
            if (!reduce) tilt(gsap.utils.clamp(-3, 2, -self.getVelocity() / 450));
          },
        },
      });

      ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
    }, scene);

    // Web font changes text width -> re-measure
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      counting.forEach((tween) => tween.kill());
      counting.clear();
      ctx.revert();
    };
  }, []);

  return (
    <main id="home" ref={sceneRef} className="relative h-[320vh] overflow-x-clip bg-paper text-ink transition-colors duration-500">
      <section className="sticky top-0 h-svh overflow-hidden">
        <Navbar />

        {/* Cards above and below the band */}
        <Stats />

        {/* Band: dark strip underneath, green band + headline revealed on top */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{ height: "var(--band-h)" }}
        >
          <div ref={bandRef} className="absolute inset-0 origin-left bg-asphalt transition-colors duration-500">
            {/* faint preview of the headline, so the dark strip isn't empty */}
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="hero-title whitespace-nowrap pt-[0.04em] font-extrabold uppercase leading-none tracking-[-0.035em] text-white/[0.06]">
                {TITLE}
              </span>
            </div>
          </div>

          <div ref={revealRef} className="absolute inset-0 z-20">
            <div className="absolute inset-0 bg-band" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1
                aria-label={TITLE}
                className="hero-title whitespace-nowrap pt-[0.04em] font-extrabold uppercase leading-none tracking-[-0.035em] text-black"
              >
                {[...TITLE].map((ch, i) => (
                  <span key={i} data-char aria-hidden="true" className="inline-block will-change-transform">
                    {ch === " " ? "\u00A0" : ch}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>

        {/* Car (faces right, as in the PNG): position (scroll) > lean (velocity) > image (intro) */}
        <div
          ref={carPosRef}
          className="pointer-events-none absolute left-0 z-40 will-change-transform"
          style={{
            width: "var(--car-w)",
            top: "calc(50% + var(--band-h) / 2 - var(--car-w) * 0.3988 + 14px)",
          }}
        >
          <div ref={carTiltRef} className="relative origin-[50%_85%]">
            <div className="absolute -bottom-1 left-[6%] h-[7%] w-[88%] rounded-[50%] bg-black/45 blur-xl" />
            <img
              ref={carImgRef}
              src={`${import.meta.env.BASE_URL}car.webp`}
              alt="Orange sports car driving across the page"
              draggable="false"
              className="relative block w-full select-none"
            />
          </div>
        </div>

        <ScrollIndicator />

        <p
          data-hud
          className="absolute bottom-7 left-7 z-50 hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-ink/60 md:block"
        >
          Scroll to explore
        </p>
        <p
          data-hud
          className="absolute bottom-7 right-7 z-50 hidden text-[10px] font-semibold uppercase tracking-[0.35em] text-ink/60 md:block"
        >
          2026 / ITZFIZZ
        </p>
      </section>
    </main>
  );
}

export default Hero;