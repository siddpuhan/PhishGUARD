import { Nav } from "../components/LandingPage/Nav";
import { Hero } from "../components/LandingPage/Hero";
import { ProductPreview } from "../components/LandingPage/ProductPreview";
import { HowItWorks } from "../components/LandingPage/HowItWorks";
import { WhyItWorks } from "../components/LandingPage/WhyItWorks";
import { GithubSection } from "../components/LandingPage/GithubSection";
import { Footer } from "../components/LandingPage/Footer";
import { CursorGlow } from "../components/LandingPage/CursorGlow";

export function Landing() {
  return (
    <div
      id="top"
      className="relative flex min-h-dvh flex-col bg-forest-950 text-fg"
      style={{ backgroundColor: "hsl(122 40% 7%)", color: "hsl(78 18% 90%)" }}
    >
      {/* Floating cursor + reactive background shine */}
      <CursorGlow />
      <Nav />
      <main className="relative z-10 flex-1">
        <Hero />
        <ProductPreview />
        <HowItWorks />
        <WhyItWorks />
        <GithubSection />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
