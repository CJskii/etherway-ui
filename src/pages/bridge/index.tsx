import image from "@/assets/under-construction.svg";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Layout } from "@/src/components/dashboard/layout";
import Link from "next/link";
import NewsletterSection from "../../components/homepage/newsletter-section";

export default function SquidBridgePage() {
  return (
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
