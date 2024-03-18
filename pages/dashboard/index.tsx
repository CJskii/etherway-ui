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

export default function DashboardPage() {
  return (
    // <DashboardLayout>
    //   <div className="flex items-center justify-center md:py-6 ">
    //     <DashboardHome />
    //   </div>
    // </DashboardLayout>
    <Layout>
      <div className="flex flex-col justify-center items-center pt-8 ">
        <Image src={image} alt="Under Construction" className="scale-75" />
        <span className="text-secondary text-5xl font-bold pb-8">
          Page Under Construction
        </span>
        <Link href={"/"}>
          <Button variant={"etherway"}>Go Back</Button>
        </Link>
      </div>
    </Layout>
  );
}
