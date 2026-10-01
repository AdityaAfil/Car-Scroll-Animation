/* The outer wrapper is faded by Hero as soon as scrolling starts;
   the inner wrapper only does the CSS fade-in after the intro. */
function ScrollIndicator() {
  return (
    <div
      data-scroll-hint
      className="pointer-events-none absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
    >
      <div className="hint-in flex flex-col items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-ink/60">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-ink/15">
          <span className="scroll-line absolute left-0 top-0 h-1/2 w-full bg-ink" />
        </div>
      </div>
    </div>
  );
}

export default ScrollIndicator;