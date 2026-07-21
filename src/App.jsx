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
    <div className="bg-base min-h-screen font-body text-ink">
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
