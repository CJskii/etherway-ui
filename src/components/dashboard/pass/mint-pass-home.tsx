import { Typography } from "@/components/ui/typography";
import Image from "next/image";
import pfp from "/public/avatars/Etherway_x_Layerzero.png";
import { Button } from "@/components/ui/button";

export const MintPassHome = () => {
  return (
    // <div className="flex items-center justify-center py-6 bg-gradient min-h-screen rounded-xl">

    // </div>
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-4 bg-gradient">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center w-full mb-4">
          <span className="text-white bg-black bg-opacity-30 py-1 px-3 rounded-full text-sm">
            Unlock access to exclusive content
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <div className="flex justify-center">
            <Image
              src={pfp}
              alt="Etherway Pass"
              className="rounded-lg"
              width={300}
              height={500}
              layout="responsive"
            />
          </div>
          <div className="flex flex-col justify-center items-start pl-0 md:pl-4">
            <Typography variant="h2" className="text-white mb-4">
              Etherway Pass
            </Typography>
            <Typography variant="muted" className="mb-4 text-gray-300">
              By: 0x905...6b3
            </Typography>
            <div className="flex flex-col justify-center items-start mb-4">
              <Typography
                variant="smallTitle"
                className="text-xl font-semibold text-white"
              >
                Mint Price
              </Typography>
              <Typography
                variant="small"
                className="text-xl font-normal text-gray-300"
              >
                0.00015 ETH
              </Typography>
            </div>
            <div className="flex flex-col justify-center items-start mb-4">
              <Typography
                variant="smallTitle"
                className="text-xl font-semibold text-white"
              >
                Perks
              </Typography>
              <Typography
                variant="small"
                className="text-md font-normal text-gray-300"
              >
                - Unlimited access to airdrop marketplace
              </Typography>
              <Typography
                variant="small"
                className="text-md font-normal text-gray-300"
              >
                - Extra XP on the leaderboard
              </Typography>
              <Typography
                variant="small"
                className="text-md font-normal text-gray-300"
              >
                - Priority to access beta features
              </Typography>
            </div>
            <div className="flex flex-col justify-center items-start">
              <Typography
                variant="smallTitle"
                className="text-xl font-semibold text-white"
              >
                About
              </Typography>
              <Typography
                variant="small"
                className="text-md font-normal text-gray-300"
              >
                - Base chain exclusive
              </Typography>
              <Typography
                variant="small"
                className="text-md font-normal text-gray-300"
              >
                - ERC721 Standard
              </Typography>
              <Typography
                variant="small"
                className="text-md font-normal text-gray-300"
              >
                - Can be traded on NFT marketplaces
              </Typography>
            </div>
          </div>
        </div>
        <Button variant="outline" className="mt-4 tracking-wide w-full ">
          Mint
        </Button>
      </div>
    </div>
  );
};

export default MintPassHome;
