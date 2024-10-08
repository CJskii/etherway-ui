import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components/dashboard/layout";
import HeadComponent from "@/components/head-component";
import { unsubscribeEmail } from "@/utils/api/email/unsubscribe";
import { Typography } from "@/components/ui/typography";
import { toast } from "sonner";

const Unsubscribe = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();
  const { listRecepientId } = router.query;

  useEffect(() => {
    if (listRecepientId) {
      handleUnsubscribe(parseInt(listRecepientId as string));
    }
  }, [listRecepientId]);

  const handleUnsubscribe = async (listRecepientId: number) => {
    const { response, error } = await unsubscribeEmail({ listRecepientId });
    if (response && response.ok) {
      setStatusMessage("You have been unsubscribed successfully.");
      toast.success("You have been unsubscribed successfully.");
    } else {
      setStatusMessage("Failed to unsubscribe.");
      toast.error("Failed to unsubscribe.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <HeadComponent
        title="Unsubscribe from Etherway"
        description="Unsubscribe from Etherway's newsletters and updates."
      />
      <div className="flex flex-col justify-center items-center min-h-[90vh]">
        <Typography variant="h1">Unsubscribe</Typography>
        <Typography variant="smallTitle">Status: {statusMessage}</Typography>
      </div>
    </Layout>
  );
};

export default Unsubscribe;
