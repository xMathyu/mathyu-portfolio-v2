import Footer from "../components/Footer";
import HeroSection from "../components/sections/HeroSection";
import AboutSection from "../components/sections/AboutSection";
import ShowreelSection from "../components/sections/ShowreelSection";
import StatsSection from "../components/sections/StatsSection";
import CaseStudySection from "../components/sections/CaseStudySection";
import ExperienceSection from "../components/sections/ExperienceSection";
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
        <ShowreelSection />
        <StatsSection />
        <CaseStudySection />
        <ExperienceSection />
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
