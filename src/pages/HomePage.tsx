import { Hero } from "../components/home/Hero";
import { RecentJobs } from "../components/home/RecentJobs";
import { WhyChooseUs } from "../components/home/WhyChooseUs";
import { FinalCTA } from "../components/home/FinalCTA";

export function HomePage() {
    return (
        <div className="home-page">
            <Hero />
            <br/>
            <RecentJobs />
            <br/>
            <WhyChooseUs />
            <br/>
            <FinalCTA />
        </div>
    );
}