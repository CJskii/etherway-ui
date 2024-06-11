import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/dashboard/layout";
import HeadComponent from "@/components/head-component";
import { verifySubscription } from "@/utils/api/email/verify";
import { Typography } from "@/components/ui/typography";
import { toast } from "sonner";

const VerifyEmail = () => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");
  const { listRecepientId } = router.query;

  useEffect(() => {
    if (listRecepientId) {
      handleVerifySubscription(parseInt(listRecepientId as string));
    }
  }, [router.query]);

  const handleVerifySubscription = async (listRecepientId: number) => {
    const { response, error } = await verifySubscription({ listRecepientId });

    if (response && response.ok) {
      setStatusMessage("Your email has been successfully verified!");
      toast.success("Your email has been successfully verified!");
    } else {
      setStatusMessage("Failed to verify email.");
      toast.error("Failed to verify email.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <HeadComponent
        title="Etherway: Subscribe - Manage Your Subscription"
        description="Manage your subscription to Etherway's newsletters and updates."
      />
      <div className="flex flex-col justify-center items-center min-h-[90vh]">
        <Typography variant="h1">Email Verification</Typography>
        <Typography variant="smallTitle">Status: {statusMessage}</Typography>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
