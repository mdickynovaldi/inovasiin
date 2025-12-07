"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "./LoadingScreen";
import Navbar from "./Navbar";
import Hero from "./Hero";
import TrustedBy from "./TrustedBy";
import Services from "./Services";
import Process from "./Process";
import TechStack from "./TechStack";
import About from "./About";
import Contact from "./Contact";
import Footer from "./Footer";

// Dynamic import untuk ShowcaseDynamic
const ShowcaseDynamic = dynamic(() => import("./ShowcaseDynamic"), {
  ssr: false,
});

export default function HomeWrapper() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} minLoadTime={3000} />
      )}
      
      <main 
        className={`relative overflow-hidden transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
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
    </>
  );
}

