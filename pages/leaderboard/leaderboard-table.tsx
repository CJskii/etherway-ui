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

interface LeaderboardData {}

export default function LeaderboardTable() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData[]>([]);

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
    // fetch leaderboard data and set it to state
    const fetchData = async () => {
      // const response = await callLeaderboardAPI();
      // const data = await response.json();
      // setLeaderboard(data.data);
      setLeaderboard(mockData);
    };

    fetchData();
  }, []);

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
        <div className="my-2" />
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
              <div className="my-4" />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
