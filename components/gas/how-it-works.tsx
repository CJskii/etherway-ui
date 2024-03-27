import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Typography } from "@/components/ui/typography";

const HowItWorks = () => {
  const steps = [
    {
      title: "Network and Amount Selection",
      description:
        "Choose the origin and target networks and specify the desired amount to be refueled on the target chain.",
    },
    {
      title: "Transaction Overview",
      description:
        "Review the details of your refuel operation. Ensure all information is correct before you proceed.",
    },
    {
      title: "Cost Estimation",
      description:
        "Check the estimated cost for the refueling service, which dynamically adjusts according to the current network fees.",
    },
    {
      title: "Transaction Confirmation",
      description:
        "Once you've reviewed all the details, confirm the transaction to initiate the refuel process on the chosen network.",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger>
        <DashboardCard className="px-6 py-4 mx-auto w-max bg-white/30">
          <Typography
            variant={"smallTitle"}
            className="dark:text-black font-semibold"
          >
            How it works?
          </Typography>
        </DashboardCard>
      </DialogTrigger>
      <DialogContent className="rounded-xl bg-secondary border-0 flex flex-col justify-center items-between">
        <DialogHeader>
          <DialogDescription>
            <Typography className="text-black pb-2">
              Our Gas Refuel feature simplifies the process of replenishing your
              wallet across various networks, ensuring you're always ready for
              transactions. Follow these four straightforward steps to use it.
            </Typography>
          </DialogDescription>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Typography className="text-black font-bold">
                {`Step ${index + 1}: `}
                {step.title}
              </Typography>
              <Typography variant={"extraSmall"} className="text-black">
                {step.description}
              </Typography>
            </div>
          ))}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorks;
