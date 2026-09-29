import Footer from "../components/Footer";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ShowreelSection from "../components/sections/ShowreelSection";
import StackSection from "../components/sections/StackSection";
import StatsSection from "../components/sections/StatsSection";
import CaseStudySection from "../components/sections/CaseStudySection";
import TechMarquee from "../components/sections/TechMarquee";
import ExperienceSection from "../components/sections/ExperienceSection";
import WarpSection from "../components/sections/WarpSection";
import SkillsSection from "../components/sections/SkillsSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import CompaniesSection from "../components/sections/CompaniesSection";
import AchievementsSection from "../components/sections/AchievementsSection";
import ContactSection from "../components/sections/ContactSection";

export default function LandingPage() {
  return (
    <>
      <main className="flex flex-col">
        <HeroSection />
        <AboutSection />
        {/* Chapter "What I do": showreel → film strip → numbers */}
        <div id="stack">
          <ShowreelSection />
          <StackSection />
          <StatsSection />
        </div>
        <CaseStudySection />
        <TechMarquee />
        <ExperienceSection />
        <WarpSection />
        <SkillsSection />
        <ProjectsSection />
        <CompaniesSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
