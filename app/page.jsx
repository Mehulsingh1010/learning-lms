import { UserButton } from "@clerk/nextjs"
import BackgroundEffect from "./Landingpage/BackgroundEffect";
import Header from "./Landingpage/Header";
import Hero from "./Landingpage/Hero";
import HowItWorks from "./Landingpage/HowItWorks";
import Belowpage from "./Landingpage/Content";

export default function Home() {
  return (
    <div>



<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      <BackgroundEffect />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <HowItWorks />
          <Belowpage />
          {/* <Features />
          <Testimonials />
          <Cta /> */}
        </main>
        {/* <Footer /> */}
      </div>
    </div>
      {/* <h2 className="text-primary">Hello world</h2>
      <UserButton /> */}
    </div>
  );
}




