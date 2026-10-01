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
import FilmStage from "../components/ui/FilmStage";

/**
 * The page is cut like a film: `data-scene` picks the footage that plays on
 * the fixed stage behind each stretch (see FilmStage). Showreel, the stack
 * film strip, the SinfonIA reel and the warp are full-screen shots of their own.
 */
export default function LandingPage() {
  return (
    <>
      <main className="flex flex-col">
        <div data-scene="particles">
          <HeroSection />
        </div>
        <AboutSection />
        {/* Chapter "What I do": showreel → film strip → numbers */}
        <div id="stack">
          <ShowreelSection />
          <StackSection />
          <div data-scene="city">
            <StatsSection />
          </div>
        </div>
        <div data-scene="calls">
          <CaseStudySection />
        </div>
        <div data-scene="code">
          <TechMarquee />
        </div>
        <ExperienceSection />
        <WarpSection />
        <div data-scene="ai">
          <SkillsSection />
        </div>
        <ProjectsSection />
        <div data-scene="cloud">
          <CompaniesSection />
        </div>
        <div data-scene="austin">
          <AchievementsSection />
        </div>
        <ContactSection />
      </main>
      <Footer />
      <FilmStage />
    </>
  );
}
