"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "./LoadingScreen";
import SceneProvider from "./three/SceneProvider";
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
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} minLoadTime={700} />
      )}
      
      <SceneProvider>
        <main
          // No overflow clip here: an overflow value other than `visible` on a
          // sticky ancestor both un-pins the sticky hero AND occludes the fixed
          // 3D canvas. Horizontal overflow is clipped on <body> instead.
          className={`relative transition-opacity duration-500 ${
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
      </SceneProvider>
    </>
  );
}

