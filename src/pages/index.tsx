import type { NextPage } from "next";
import React from "react";
import gridMobile from "@/assets/homepage-background/bg-grid-mobile.svg";
import grid from "@/assets/homepage-background/bg-grid.svg";
import ContactSection from "@/src/components/homepage/contact-section";
import FeaturesSection from "@/src/components/homepage/features";
import HeroSection from "@/src/components/homepage/hero-section";
import OnboardSection from "@/src/components/homepage/onboard-section";
import StatsSection from "@/src/components/homepage/stats-section";
import { Header } from "@/src/components/navigation/navbar";
import Image from "next/image";
import HeadComponent from "../components/HeadComponent";
import { Container } from "@/src/components/ui/Container";
import { Footer } from "@/src/components/ui/footer";

const Home: NextPage = () => {
  return (
    <>
      <HeadComponent />
      <div className="relative h-auto">
        <Header />
        <div className=" z-10 ">
          <HeroSection />
          <Container>
            {/* <OnboardSection /> */}
            <StatsSection />
            <FeaturesSection />
            <ContactSection />
          </Container>
        </div>
        <Image
          src={grid}
          alt="grid"
          className="absolute top-0 -z-10 hidden h-[100%] w-full md:block"
        />
        <Image
          src={gridMobile}
          alt="grid"
          className="absolute -top-0 -z-10 -ml-5 h-[100%] opacity-80 md:hidden"
        />
        <Footer />
      </div>
    </>
  );
};

export default Home;
