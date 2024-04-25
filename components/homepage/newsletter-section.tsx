import { Typography } from "../ui/typography";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { subscribeEmail } from "@/common/utils/api/email/subscribe";
import { useAccount } from "wagmi";
import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "sonner";
import { isValidEmail } from "@/common/utils/validators/isValidEmail";
import { resendEmail } from "@/common/utils/api/email/resend";

export default function NewsletterSection({
  title = "Sign up for our newsletter",
  description = "Stay up to date with our latest updates and news.",
}: {
  title?: string;
  description?: string;
}) {
  const { address } = useAccount();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);
  const [recipentId, setRecipentId] = useState<number | null>(null);

  const cooldownPeriod = 60000;

  useEffect(() => {
    const storedTime = localStorage.getItem("etherway_lastSentTime");
    if (storedTime) {
      setLastSentTime(parseInt(storedTime));
      const timeElapsed = Date.now() - parseInt(storedTime);
      setIsSubscribed(timeElapsed < cooldownPeriod);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSentTime && Date.now() - lastSentTime > cooldownPeriod) {
        localStorage.removeItem("etherway_lastSentTime");
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSentTime]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubscribeButton = async () => {
    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet to proceed.");
      return;
    }

    const { response, error } = await subscribeEmail({
      address: address,
      email,
    });

    if (response?.ok) {
      toast.success(
        "Subscription successful! Check your email for verification.",
      );
      const data = await response.json();
      setRecipentId(data.listRecepientId);
      const currentTime = Date.now();
      localStorage.setItem("etherway_lastSentTime", currentTime.toString());
      setLastSentTime(currentTime);
      setIsSubscribed(true);
    } else {
      toast.error("Failed to subscribe. Please try again.");
      console.error(error);
    }
  };

  const handleResendButton = async () => {
    if (!address) {
      toast.error("Please connect your wallet to proceed.");
      return;
    }

    if (lastSentTime && lastSentTime + cooldownPeriod > Date.now()) {
      toast.info("Please wait 60s before resending the email.");
      return;
    }

    if (!recipentId) {
      toast.error("Failed to resend. Please try again.");
      return;
    }

    const { response, error } = await resendEmail({
      listRecepientId: recipentId,
      email,
    });

    if (response?.ok) {
      toast.success("Email resent successfully! Check your inbox.");
      const currentTime = Date.now();
      localStorage.setItem("etherway_lastSentTime", currentTime.toString());
      setLastSentTime(currentTime);
    } else {
      toast.error("Failed to resend. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-stretch justify-between gap-4 pb-16 pt-12 md:flex-row md:items-center md:pb-0 md:pt-12">
      <div className="space-y-1">
        <Typography variant={"h3"} className="tracking-wide">
          {title}
        </Typography>
        <Typography variant={"paragraph"} className="tracking-wide">
          {description}
        </Typography>
      </div>

      <div>
        <div className="relative">
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email@example.com"
            className=" h-12 rounded-xl bg-[#E9E9E9] pr-28 text-black dark:bg-white"
          />
          <Button
            className="bg-gradient absolute  right-0 top-0 h-12 rounded-xl font-normal text-black hover:opacity-90"
            onClick={isSubscribed ? handleResendButton : handleSubscribeButton}
          >
            {isSubscribed ? "Resend" : "Subscribe"}
          </Button>
        </div>
      </div>
    </div>
  );
}
