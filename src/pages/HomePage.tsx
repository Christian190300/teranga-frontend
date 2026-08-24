import { Hero } from "../components/home/Hero";
import { SearchSection } from "../components/home/SearchSection";
import { RecentJobs } from "../components/home/RecentJobs";
import { CandidateSection } from "../components/home/CandidateSection";
import { RecruiterSection } from "../components/home/RecruiterSection";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { AboutSection } from "../components/home/AboutSection";
import { FinalCTA } from "../components/home/FinalCTA";

export function HomePage() {
    return (
        <div className="home-page">
            <Hero />
            <br />
            <SearchSection />
            <br />
            <RecentJobs />
            <br />
            <CandidateSection />
            <RecruiterSection />
            <br />
            <WhyChooseUs />
            <br />
            <AboutSection />
            <br />
            <FinalCTA />
        </div>
    );
}