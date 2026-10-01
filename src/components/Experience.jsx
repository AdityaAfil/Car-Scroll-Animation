const ROWS = [
  {
    title: "Pick-up points",
    body: (
      <>
        Orders collected at pick-up points rose <strong>58%</strong> in the first quarter, and
        usage across the wider network grew a further <strong>27%</strong>.
      </>
    ),
  },
  {
    title: "Customer calls",
    body: (
      <>
        Phone calls fell <strong>23%</strong> once order status moved into the app, and{" "}
        <strong>40%</strong> at sites with self-serve pick-up.
      </>
    ),
  },
];

function Experience() {
  return (
    <section
      id="experience"
      className="bg-paper px-6 pb-28 pt-32 text-ink transition-colors duration-500 md:px-10 lg:px-14"
    >
      <h2 className="max-w-[18ch] text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
        What changed when orders moved to pick-up points
      </h2>

      <div className="mt-16 border-t border-ink/20">
        {ROWS.map(({ title, body }) => (
          <article
            key={title}
            className="grid gap-4 border-b border-ink/20 py-10 md:grid-cols-[1fr_2fr] md:gap-12"
          >
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="max-w-[52ch] text-lg leading-relaxed text-ink/75 [&_strong]:font-extrabold [&_strong]:text-ink">
              {body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Experience;