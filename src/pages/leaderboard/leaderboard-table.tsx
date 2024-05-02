import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Typography } from "@/src/components/ui/typography";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import {
  getLeaderboadData,
  getUserPointData,
} from "@/src/utils/api/leaderboard";
import { claimV1Points, getClaimData } from "@/src/utils/api/claim";
import { ConnectWalletButton } from "@/src/components/ui/connect-button";
import {
  calculateUserLevel,
  calculateProgressToNextLevel,
} from "@/src/utils/helpers/getLevel";
import { Progress } from "@/src/components/ui/progress";

export interface OldUserDataType {
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

interface LeaderboardData {
  id: number;
  user_address: string;
  total_points: number;
}

export default function LeaderboardTable() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);
  const [userData, setUserData] = useState<LeaderboardData | null>(null);
  const account = useAccount();
  const [oldUserData, setOldUserData] = useState<OldUserDataType | null>(null);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [userProgress, setUserProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!account.address) return;
      const leaderboardData = await getLeaderboadData({ limit: 100 });
      setLeaderboard(leaderboardData);

      const normalizedAddress = account.address.toLowerCase();
      const userData = leaderboardData.find(
        (user: any) => user.user_address.toLowerCase() === normalizedAddress,
      );

      if (userData) {
        setUserData(userData);
      } else {
        const specificUserData = await getUserPointData({
          userAddress: normalizedAddress,
        });
        setUserData(specificUserData);
      }
    };

    fetchData();
  }, [account.address]);

  useEffect(() => {
    if (userData) {
      const progress = calculateProgressToNextLevel(userData.total_points);
      setUserProgress(progress);
    }
  }, [userData]);

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
          const claimData = await getClaimData();
          if (claimData) {
            setHasClaimed(true);
          } else {
            toast.success(
              "Looks like you might be eligible to claim legacy points!",
            );
          }
          setOldUserData(data.user);
        } else if (response.status === 404) {
          // toast.error("No data found for this address.");
          console.log("No data found for this address.");
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

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4,
    )}`;
  };

  return (
    <>
      {!account.isConnected ? (
        <ConnectWallet />
      ) : (
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
          <div>
            <Progress
              value={userProgress}
              currentLevel={calculateUserLevel(userData?.total_points || 0)}
              currentXP={userData?.total_points || 0}
              className="w-[100%]"
            />
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
              {leaderboard.map(({ id, user_address, total_points }, idx) => (
                <React.Fragment key={idx}>
                  <TableRow className="border-0 bg-[#b5b4b6]/30 text-base hover:bg-[#b5b4b6]/20 dark:bg-white/10 dark:text-white">
                    <TableCell className="cursor-pointer rounded-l-xl py-10">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="truncate md:hidden">
                      {truncateAddress(user_address)}
                    </TableCell>
                    <TableCell className="truncate hidden md:table-cell">
                      {user_address}
                    </TableCell>
                    <TableCell className=" cursor-pointer rounded-r-xl">
                      {calculateUserLevel(total_points)}
                    </TableCell>
                  </TableRow>
                  {idx < leaderboard.length - 1 && (
                    <tr className="spacer" style={{ height: "10px" }}></tr>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}

const ClaimLegacyPoints = ({
  oldUserData,
  hasClaimed,
  setHasClaimed,
}: {
  oldUserData: OldUserDataType;
  hasClaimed: boolean;
  setHasClaimed: Function;
}) => {
  const legacyMultiplier = 0.1;

  const handleClaimButton = async () => {
    try {
      const response = (await claimV1Points()) as Response;

      if (response.status === 400) {
        toast.error("You have already claimed your legacy points.");
        setHasClaimed(true);
        return;
      }

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
                    Looks like you&apos;ve already claimed your points
                  </Typography>
                ) : (
                  <Typography variant={"h3"}>
                    Total of{" "}
                    <span className="text-secondary">
                      {oldUserData.totalPoints * legacyMultiplier} XP
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

const ConnectWallet = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Typography variant={"h3"}>User not connected</Typography>
      <Typography
        variant={"smallTitle"}
        className="font-raleway font-[500] text-center"
      >
        Connect your wallet to view your stats on Etherway
      </Typography>
      <ConnectWalletButton />
    </div>
  );
};
