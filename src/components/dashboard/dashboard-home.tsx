import React from "react";
import { Typography } from "../ui/typography";
import { Card } from "../ui/card";
import layerzero from "@/assets/dashboard/layerzero.svg";
import wormhole from "@/assets/dashboard/warmhole.svg";
import Image from "next/image";

const data = [
  {
    title: "Wormhole",
    difficulty: "Easy",
    image: wormhole,
  },
  {
    title: "LayerZero",
    difficulty: "Medium",
    image: layerzero,
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
            className="relative w-full rounded-2xl md:col-span-3 md:w-5/12 transition-all ease-in-out hover:scale-[1.015] hover:shadow-md cursor-pointer"
          >
            <div className="absolute flex h-full flex-col items-start justify-between p-4 text-white">
              <Typography variant={"large"} className="font-normal md:text-xl">
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
          </Card>
        ))}
      </div>
    </div>
  );
}
