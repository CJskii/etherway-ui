import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const mockData = [
  {
    rank: 1,
    walletAddress: "0xA9F65a8a1829F68607e4223F349545861216543c",
    level: "80",
  },
  {
    rank: 2,
    walletAddress: "0xA9F65a8a1829F68607e4223F349545861216543c",
    level: "80",
  },
  {
    rank: 3,
    walletAddress: "0xA9F65a8a1829F68607e4223F349545861216543c",
    level: "80",
  },
  {
    rank: 4,
    walletAddress: "0xA9F65a8a1829F68607e4223F349545861216543c",
    level: "80",
  },
  {
    rank: 5,
    walletAddress: "0xA9F65a8a1829F68607e4223F349545861216543c",
    level: "80",
  },
  {
    rank: 6,
    walletAddress: "0xA9F65a8a1829F68607e4223F349545861216543c",
    level: "80",
  },
];

interface OldUserData {
  ethereumAddress: string;
  totalPoints: number;
  inviteCount: number;
  bridges: [
    {
      count: number;
      createdAt: string;
      ethereumAddress: string;
      id: string;
      layerzeroCount: number;
      updatedAt: string;
      wormholeCount: number;
    },
  ];
  mints: [
    {
      count: number;
      createdAt: string;
      ethereumAddress: string;
      id: string;
      updatedAt: string;
    },
  ];
}

interface LeaderboardData {}

export default function LeaderboardTable() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);
  const account = useAccount();
  const [oldUserData, setOldUserData] = useState<OldUserData | null>(null);
  const [hasClaimed, setHasClaimed] = useState(false);

  const calculateUserLevel = (totalXP: number): number => {
    let level = 0;
    let xpForNextLevel = 0;

    while (totalXP >= xpForNextLevel) {
      level++;
      xpForNextLevel = Math.pow(level, 2) * 10; // XP required for next level (quadratic formula)
    }

    return level - 1;
  };

  useEffect(() => {
    // TODO:  fetch leaderboard data and set it to state
    const fetchData = async () => {
      // const response = await callLeaderboardAPI();
      // const data = await response.json();
      // setLeaderboard(data.data);
      setLeaderboard(mockData);
      // TODO: check if the user already claimed legacy points (hasClaimed state)
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchOldData = async () => {
      if (!account.address) {
        console.log("No account address provided.");
        return;
      }

      try {
        const response = await fetch(
          "https://omnichain-minter-ppkm.vercel.app/api/userData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ethereumAddress: account.address,
            }),
          },
        );

        if (response.ok) {
          const data = await response.json();
          setOldUserData(data.user);
          if (!hasClaimed)
            toast.success(
              "Looks like you might be eligible to claim legacy points!",
            );
        } else if (response.status === 404) {
          toast.error("No data found for this address.");
        } else {
          toast.error("Error fetching old data.");
        }
      } catch (error) {
        console.error("Error fetching old data:", error);
        toast.error("Error fetching old data.");
      }
    };

    fetchOldData();
  }, [account.address]);

  return (
    <>
      <div className="space-y-1 py-6 ">
        <Typography variant={"h2"} className=" font-raleway">
          Leaderboard
        </Typography>
        <Typography
          variant={"paragraph"}
          className="font-raleway font-[500] tracking-wide"
        >
          Your stats on Etherway
        </Typography>
      </div>

      {oldUserData && !hasClaimed && (
        <ClaimLegacyPoints
          oldUserData={oldUserData}
          hasClaimed={hasClaimed}
          setHasClaimed={setHasClaimed}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow className="">
            <TableHead>
              <Typography variant={"large"}>Rank</Typography>
            </TableHead>
            <TableHead>
              <Typography variant={"large"}>Wallet Address</Typography>
            </TableHead>
            <TableHead>
              <Typography variant={"large"}>Level</Typography>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map(({ rank, walletAddress, level }, idx) => (
            <React.Fragment key={idx}>
              <TableRow className="border-0 bg-[#b5b4b6]/30 text-base hover:bg-[#b5b4b6]/20 dark:bg-white/10 dark:text-white">
                <TableCell className="cursor-pointer rounded-l-xl py-10">
                  {rank}
                </TableCell>
                <TableCell>{walletAddress}</TableCell>
                <TableCell className=" cursor-pointer rounded-r-xl">
                  {level}
                </TableCell>
              </TableRow>
              {/* <div className="my-4" /> */}
              {idx < mockData.length - 1 && (
                <tr className="spacer" style={{ height: "10px" }}></tr>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

const ClaimLegacyPoints = ({
  oldUserData,
  hasClaimed,
  setHasClaimed,
}: {
  oldUserData: OldUserData;
  hasClaimed: boolean;
  setHasClaimed: Function;
}) => {
  const handleClaimButton = async () => {
    console.log("Claiming legacy points...");

    try {
      // const response =  await callClaimAPI();
      const response = {
        ok: true,
      } as Response;

      if (response.ok) {
        const data = await response.json();
        console.log("Claim response:", data);
        toast.success("Legacy points claimed successfully!");
        setHasClaimed(true);
      } else {
        toast.error("Error claiming legacy points.");
      }
    } catch (error) {
      console.error("Error claiming legacy points:", error);
      toast.error("Error claiming legacy points.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-start gap-2">
      <Typography variant={"h3"}>Legacy Points</Typography>
      <Typography variant={"smallTitle"} className="font-raleway font-[500]">
        You might be eligible to claim legacy points from your previous on-chain
        activity
      </Typography>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Check</Button>
        </DrawerTrigger>
        <DrawerContent className="border-none">
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader>
              <DrawerTitle>Status of your legacy points</DrawerTitle>
              <DrawerDescription>
                Here you can claim XP accumulated prior to Etherway rebranding.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0 flex flex-col justify-center items-start">
              <Typography variant={"h4"}>Your Stats</Typography>
              <Typography variant={"smallTitle"}>
                {"> "}
                {oldUserData.mints[0].count} mint interactions.
              </Typography>
              <Typography variant={"smallTitle"}>
                {"> "}
                {oldUserData.bridges[0].count} bridge interactions.
              </Typography>
              <Typography variant={"smallTitle"}>
                {"> "}
                {oldUserData.inviteCount} invited friends.
              </Typography>

              <div className="mt-2 ">
                {hasClaimed ? (
                  <Typography variant={"h4"}>
                    Looks like you've already claimed your points
                  </Typography>
                ) : (
                  <Typography variant={"h3"}>
                    Total of{" "}
                    <span className="text-secondary">
                      {oldUserData.totalPoints} XP
                    </span>{" "}
                    available to claim.
                  </Typography>
                )}
              </div>
            </div>
            <DrawerFooter>
              <Button
                onClick={hasClaimed ? () => {} : handleClaimButton}
                disabled={hasClaimed}
              >
                Claim
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
