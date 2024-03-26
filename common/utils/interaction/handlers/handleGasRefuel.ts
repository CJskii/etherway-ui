import { ethers, Signer, Contract } from "ethers";
import getProviderOrSigner from "../../getters/getProviderOrSigner";
import { handleErrors } from "./handleErrors";
import { GasTransferParams } from "../../../types/gas-refuel";
import { Network } from "../../../types/network";
import { Options } from "@layerzerolabs/lz-v2-utilities";

export const gasTransferRequest = async ({
  fromNetwork,
  toNetwork,
  inputAmount,
  setIsLoading,
  setGasFee,
  setErrorMessage,
  setShowGasModal,
  setTxHash,
  setTransactionBlockNumber,
  gasFee,
  recipientAddress,
}: GasTransferParams) => {
  setIsLoading(true);
  setShowGasModal(true);
  try {
    const result = await handleGasTransaction({
      fromNetwork,
      targetNetwork: toNetwork,
      value: inputAmount,
      estimatedFee: gasFee,
      recipientAddress,
    });

    if (!result) {
      throw new Error("Failed to mint NFT");
    }
    const { txHash, blockNumber } = result;
    setTxHash(txHash);
    setTransactionBlockNumber(blockNumber);
    setGasFee("");
    setIsLoading(false);
  } catch (e) {
    console.error(e);
    handleErrors({ e, setErrorMessage });
    setIsLoading(false);
    setShowGasModal(true);
  }
};

const handleGasTransaction = async ({
  fromNetwork,
  targetNetwork,
  value,
  estimatedFee,
  recipientAddress = "",
}: {
  fromNetwork: Network;
  targetNetwork: Network;
  value: string;
  estimatedFee: string;
  recipientAddress?: string;
}) => {
  const signer = (await getProviderOrSigner(true)) as Signer;
  const ownerAddress = await signer.getAddress();
  const refundAddress = recipientAddress || ownerAddress;

  if (!fromNetwork.deployedContracts)
    throw new Error(`No deployed contracts found for ${fromNetwork.name}`);

  const contract = new Contract(
    fromNetwork.deployedContracts.layerzero.REFUEL.address,
    fromNetwork.deployedContracts.layerzero.REFUEL.ABI,
    signer,
  );

  const paddedAddress = ethers.utils.zeroPad(refundAddress, 32);
  const tokensToSend = ethers.utils.parseUnits(value, "ether");
  const options = Options.newOptions()
    .addExecutorNativeDropOption(
      tokensToSend.toString(),
      paddedAddress.toString(),
    )
    .addExecutorLzReceiveOption(200000, 0)
    .toHex()
    .toString();

  const sendParam = [
    targetNetwork.params?.layerzero?.remoteChainId,
    paddedAddress,
    0,
    0,
    options,
    "0x",
    "0x",
  ];

  try {
    let nativeFee = 0;
    [nativeFee] = await contract.quoteSend(sendParam, false);

    const tx = await contract
      .send(sendParam, [nativeFee, 0], refundAddress, { value: nativeFee })
      .then((tx: any) => tx.wait());

    const receipt = await tx.wait();

    return {
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error(`Error in transaction: ${(error as any).message}`);
    throw error; // Propagate the error to handle it in the UI layer
  }
};
