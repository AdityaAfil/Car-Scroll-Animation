/* Two rows of cards: one above the band, one below it.
   Hero animates each [data-stat] wrapper: the cards emerge (fade, rise,
   count up) as the car passes them while scrolling. */

const TOP = [
  { value: 58, label: "Increase in pick-up point use", tone: "bg-[#e4ff4d] text-black" },
  { value: 27, label: "Increase in pick-up point use", tone: "bg-[#2d2d31] text-white" },
];

const BOTTOM = [
  { value: 23, label: "Decrease in customer phone calls", tone: "bg-[#7cd4ff] text-black" },
  { value: 40, label: "Decrease in customer phone calls", tone: "bg-[#ff6a2b] text-black" },
];

function Row({ items, row, className, style }) {
  return (
    <div
      className={`absolute z-20 flex -translate-x-1/2 gap-3 sm:gap-5 ${className}`}
      style={style}
    >
      {items.map((item) => (
        <div key={`${row}-${item.value}`} data-stat data-row={row} className="will-change-transform">
          <div
            data-card
            className={`w-[8.6rem] rounded-xl p-4 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.45)] sm:w-[11.5rem] sm:p-5 ${item.tone}`}
          >
            <div className="text-4xl font-extrabold leading-none tracking-tight tabular-nums sm:text-5xl">
              <span data-count={item.value}>{item.value}</span>%
            </div>
            <p className="mt-3 max-w-[18ch] text-[10px] font-semibold uppercase leading-snug tracking-wide opacity-75 sm:text-[11px]">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Stats() {
  return (
    <>
      <Row
        row="top"
        items={TOP}
        className="left-1/2 md:left-[66%]"
        style={{ bottom: "calc(50% + var(--band-h) / 2 + 3.25rem)" }}
      />
      <Row
        row="bottom"
        items={BOTTOM}
        className="left-1/2 md:left-[62%]"
        style={{ top: "calc(50% + var(--band-h) / 2 + 2.5rem)" }}
      />
    </>
  );
}

export default Stats;