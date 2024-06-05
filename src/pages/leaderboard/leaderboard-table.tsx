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
import { getLeaderboadData, getUserPointData } from "@/utils/api/leaderboard";
import { ConnectWalletButton } from "@/components/ui/connect-button";
import {
  calculateUserLevel,
  calculateProgressToNextLevel,
} from "@/utils/helpers/getLevel";
import { Progress } from "@/components/ui/progress";

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
