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
      <DialogContent className="rounded-xl bg-gradient border-0 flex flex-col justify-center items-between">
        <DialogHeader>
          <DialogDescription>
            <Typography variant={"muted"} className="dark:text-black pb-2">
              Our Gas Refuel feature simplifies the process of replenishing your
              wallet across various networks, ensuring you're always ready for
              transactions. Follow these four straightforward steps to use it.
            </Typography>
          </DialogDescription>
          <Typography variant={"muted"} className="dark:text-black font-bold">
            Step 1: Network and Amount Selection
          </Typography>
          <Typography variant={"smallTitle"} className="dark:text-black">
            Choose the origin and target networks and specify the desired amount
            to be refueled on the target chain.
          </Typography>
          <Typography variant={"muted"} className="dark:text-black font-bold">
            Step 2: Transaction Overview
          </Typography>
          <Typography variant={"smallTitle"} className="dark:text-black">
            Review the details of your refuel operation. Ensure all information
            is correct before you proceed.
          </Typography>
          <Typography variant={"muted"} className="dark:text-black font-bold">
            Step 3: Cost Estimation
          </Typography>
          <Typography variant={"smallTitle"} className="dark:text-black">
            Check the estimated cost for the refueling service, which
            dynamically adjusts according to the current network fees.
          </Typography>
          <Typography variant={"muted"} className="dark:text-black font-bold">
            Step 4: Transaction Confirmation
          </Typography>
          <Typography variant={"smallTitle"} className="dark:text-black">
            Once you've reviewed all the details, confirm the transaction to
            initiate the refuel process on the chosen network.
          </Typography>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorks;
