import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/src/components/dashboard/layout";
import HeadComponent from "@/src/components/HeadComponent";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { subscribeEmail } from "@/src/utils/api/email/subscribe";
import { unsubscribeEmail } from "@/src/utils/api/email/unsubscribe";
import { verifySubscription } from "@/src/utils/api/email/verify";
import { useAccount } from "wagmi";

const Email = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const account = useAccount();

  const handleAction = async (actionType: "subscribe" | "unsubscribe") => {
    if (!email) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    if (!account?.address) {
      setStatusMessage("Please connect your wallet to proceed.");
      return;
    }

    let response, error;
    if (actionType === "subscribe" && account?.address) {
      ({ response, error } = await subscribeEmail({
        address: account.address,
        email,
      }));
    } else if (actionType === "unsubscribe") {
      const listRecepientId = parseInt(router.query.listRecepientId as string);
      ({ response, error } = await unsubscribeEmail({ listRecepientId }));
    }

    if (response && response.ok) {
      const successMessage =
        actionType === "subscribe"
          ? "Success! Please check your email to verify."
          : "You have been unsubscribed successfully.";
      setStatusMessage(successMessage);
    } else {
      const errorMessage =
        actionType === "subscribe"
          ? "Failed to subscribe."
          : "Failed to unsubscribe.";
      setStatusMessage(errorMessage);
      console.error(error);
    }
  };

  return (
    <Layout>
      <HeadComponent
        title="Etherway: Subscribe - Manage Your Subscription"
        description="Manage your subscription to Etherway's newsletters and updates."
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@domain.com"
          className="h-12"
        />
        <Button
          variant="root"
          className="w-32"
          onClick={() => handleAction("subscribe")}
        >
          Subscribe
        </Button>
        <Button
          variant="root"
          className="w-32"
          onClick={() => handleAction("unsubscribe")}
        >
          Unsubscribe
        </Button>
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </Layout>
  );
};

export default Email;
