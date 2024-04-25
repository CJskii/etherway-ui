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
      <div className="flex flex-col justify-center items-center pt-8 gap-4">
        <NewsletterSection
          title="Sign up your email"
          description="Be first to get updates about this product"
        />
        <Image src={image} alt="Under Construction" className="scale-75" />
        <Typography variant={"h1"} className="text-center">
          Product Under Construction
        </Typography>

        <Link href={"/"}>
          <Button variant={"etherway"}>Go Back</Button>
        </Link>
      </div>
    </Layout>
  );
}
