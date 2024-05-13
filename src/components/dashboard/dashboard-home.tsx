import React from "react";
import { Typography } from "../ui/typography";
import { Card } from "../ui/card";
import layerzero from "@/../assets/dashboard/layerzero.svg";
import hyperlane from "@/../assets/dashboard/hyperlane.svg";
import Image from "next/image";
import Link from "next/link";

const data = [
  {
    title: "Hyperlane",
    difficulty: "Easy",
    image: hyperlane,
    link: "https://www.etherway.io/layerzero/onft-mint",
  },
  {
    title: "LayerZero",
    difficulty: "Medium",
    image: layerzero,
    link: "https://www.etherway.io/hyperlane/nft-mint",
  },
];
export default function DashboardHome() {
  return (
    <div className=" space-y-4">
      <Typography variant={"h3"}>Featured</Typography>
      <div className=" flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-normal">
        {data.map((item, idx) => (
          <Card
            key={idx}
            className="relative w-full cursor-pointer rounded-2xl transition-all ease-in-out hover:scale-[1.015] hover:shadow-md md:col-span-3 md:w-5/12"
          >
            <Link href={item.link} target="_blank">
              <div className="absolute flex h-full flex-col items-start justify-between p-4 text-white">
                <Typography
                  variant={"large"}
                  className="font-normal md:text-xl"
                >
                  {item.title}
                </Typography>
                <Typography
                  variant={"small"}
                  className="font-normal md:text-base"
                >
                  {item.difficulty}
                </Typography>
              </div>
              <Image src={item.image} alt={item.title} />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
