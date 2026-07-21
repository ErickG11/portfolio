import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Availability from "./components/Availability";
import About from "./components/About";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="relative min-h-dvh font-body text-ink">
      <div className="fixed inset-0 -z-10 overflow-hidden bg-page pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-lime/20 blur-3xl animate-blob" />
        <div
          className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] rounded-full bg-cyan/20 blur-3xl animate-blob"
          style={{ animationDelay: "-4s" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] rounded-full bg-violet/20 blur-3xl animate-blob"
          style={{ animationDelay: "-8s" }}
        />
      </div>
      <Navbar />
      <main>
        <Hero />
        <Availability />
        <About />
        <Skills />
        <Certifications />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
