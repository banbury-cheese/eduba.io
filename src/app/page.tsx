import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/HeroSection";
import { ThreeWheelStrategy } from "@/components/ThreeWheelStrategy";
import { Services } from "@/components/Services";
import { ParadigmShift } from "@/components/ParadigmShift";
import { Works } from "@/components/Works";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <ThreeWheelStrategy />
      <Services />
      <Works />
      <ParadigmShift />
      <Team />
    </Layout>
  );
}
