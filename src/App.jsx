import Hero from "./components/Hero";
import Experience from "./components/Experience";
import About from "./components/About";
import Contact from "./components/Contact";
import { scrollToSection } from "./hooks/useSmoothScroll";

function App() {
  return (
    <>
      <Hero />
      <Experience />
      <About />
      <Contact />
      <footer className="flex items-center justify-between bg-asphalt px-6 py-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 md:px-10 lg:px-14">
        <span>2026 / ITZFIZZ</span>
        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="uppercase tracking-[0.3em] transition-colors hover:text-white"
        >
          Back to top
        </button>
      </footer>
    </>
  );
}

export default App;