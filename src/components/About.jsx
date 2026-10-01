function About() {
  return (
    <section
      id="about"
      className="border-t border-ink/15 bg-paper px-6 py-28 text-ink transition-colors duration-500 md:px-10 lg:px-14"
    >
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr] md:gap-20">
        <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
          We build the part of shopping that happens after checkout.
        </h2>

        <div className="space-y-5 text-lg leading-relaxed text-ink/75 md:pt-3">
          <p>
            ITZFIZZ connects online orders to the places people actually collect them. Customers
            pick a nearby point, follow their order in one place, and walk in knowing it is ready.
          </p>
          <p>
            Fewer questions reach the phone line, and the people at each pick-up point spend their
            time handing over orders instead of looking for them.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;