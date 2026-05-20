import Hero from "@/components/sections/Hero";
import TheProblem from "@/components/sections/TheProblem";
import Manifesto from "@/components/sections/Manifesto";
import ThePlatform from "@/components/sections/ThePlatform";
import WhatWeBelieve from "@/components/sections/WhatWeBelieve";
import BrandMarquee from "@/components/sections/BrandMarquee";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TheProblem />
      <Manifesto />
      <ThePlatform />
      <WhatWeBelieve />
      <BrandMarquee />
      <FinalCTA />
    </>
  );
}
