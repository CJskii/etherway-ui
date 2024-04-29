import DashboardHome from "@/components/dashboard/dashboard-home";
import DashboardLayout from "@/components/dashboard/layout";
// import Provider from "@/components/dashboard/provider";
import { DashboardContainer } from "@/components/ui/Container";
import { Footer } from "@/components/ui/footer";
import image from "../../assets/under-construction.svg";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/dashboard/layout";
import Link from "next/link";
import NewsletterSection from "../../components/homepage/newsletter-section";

export default function DashboardPage() {
  return (
    // <DashboardLayout>
    //   <div className="flex items-center justify-center md:py-6 ">
    //     <DashboardHome />
    //   </div>
    // </DashboardLayout>
    <Layout>
      <div className="flex flex-col justify-center items-center pt-16 gap-4">
        <Image
          src={image}
          alt="Under Construction"
          className="w-full h-auto sm:w-3/4 md:w-1/2 "
        />

        <h1 className="text-5xl font-bold text-center text-secondary">
          Page Under Construction
        </h1>
        <NewsletterSection
          title="Join Our Early Access List"
          description="Secure your spot for exclusive updates on our upcoming release!"
          buttonLabel="Notify Me"
          renderText={false}
        />

        <Link href={"/"} className="pt-8">
          <Button variant={"etherway"} className="w-36">
            Go Back
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
