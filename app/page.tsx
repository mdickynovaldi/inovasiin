import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import Services from "@/components/Services";
import Process from "@/components/Process";
import ShowcaseDynamic from "@/components/ShowcaseDynamic";
import TechStack from "@/components/TechStack";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Services />
      <Process />
      <ShowcaseDynamic />
      <TechStack />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
