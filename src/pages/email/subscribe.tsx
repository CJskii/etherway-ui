// subscribe.js
import { useState } from "react";
import Layout from "@/components/dashboard/layout";
import HeadComponent from "@/components/head-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeEmail } from "@/utils/api/email/subscribe";
import { useAccount } from "wagmi";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const account = useAccount();

  const handleSubscribe = async () => {
    if (!email) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    if (!account?.address) {
      setStatusMessage("Please connect your wallet.");
      return;
    }

    const { response, error } = await subscribeEmail({
      address: account.address,
      email,
    });

    if (response && response.ok) {
      setStatusMessage("Success! Please check your email to verify.");
    } else {
      setStatusMessage("Failed to subscribe.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <HeadComponent
        title="Subscribe to Etherway"
        description="Subscribe to Etherway's newsletters and updates."
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="h-12"
        />
        <Button variant="root" className="w-32" onClick={handleSubscribe}>
          Subscribe
        </Button>
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </Layout>
  );
};

export default Subscribe;
