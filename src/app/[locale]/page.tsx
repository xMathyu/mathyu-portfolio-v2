import Footer from "../components/Footer";
import AboutSection from "../components/sections/AboutSection";
import ContactSection from "../components/sections/ContactSection";
import HomeSection from "../components/sections/HomeSection";
import ExperienceSection from "../components/sections/ExperienceSection";
import SkillsSection from "../components/sections/SkillsSection";
import AchievementsSection from "../components/sections/AchievementsSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import WorkCarouselSection from "../components/sections/WorkCarouselSection";
import "../globals.css";

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <HomeSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <AchievementsSection />
      <ProjectsSection />
      <WorkCarouselSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
