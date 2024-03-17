import { ContractType, InteractionType } from "prisma/prisma-client";
import newMint from "../create/newMint";
import handleUser from "./user";
import newBridge from "../create/newBridge";

type handleInteractionProps = {
  ethAddress: string;
  contractType: ContractType;
  interactionType: InteractionType;
  chainId?: number;
};

export default async function handleInteraction({
  ethAddress,
  contractType,
  interactionType,
  chainId,
}: handleInteractionProps) {
  await handleUser({ ethAddress });

  switch (interactionType) {
    case "MINT":
      return await newMint({
        ethAddress,
        contractType,
        interactionType,
        chainId,
      });
    case "BRIDGE":
      return await newBridge({
        ethAddress,
        contractType,
        interactionType,
        chainId,
      });
    default:
      break;
  }
}
