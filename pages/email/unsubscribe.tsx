import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/dashboard/layout";
import HeadComponent from "@/common/elements/HeadComponent";
import { Button } from "@/components/ui/button";
import { unsubscribeEmail } from "@/common/utils/api/email/unsubscribe";
import { Typography } from "@/components/ui/typography";

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
    } else {
      setStatusMessage("Failed to unsubscribe.");
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
