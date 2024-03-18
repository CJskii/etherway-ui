import { ethers, Signer, Contract } from "ethers";
import getProviderOrSigner from "../../getters/getProviderOrSigner";
import { Network } from "../../../types/network";
import handleInteraction from "./handleInteraction";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { updateBridgeData } from "../../api/bridge";
import { ContractType } from "@prisma/client";

export const handleBridging = async ({
  TOKEN_ID,
  fromNetwork,
  toNetwork,
  contractProvider,
  address,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  contractProvider: {
    type: string;
    contract: string;
  };
  address: string;
}) => {
  const txGasLimit = fromNetwork.params?.gasLimit.bridge;
  const signer = await getProviderOrSigner(true);
  const ownerAddress = await (signer as Signer).getAddress();

  if (contractProvider.type == "layerzero") {
    const { tx, error: bridgeError } = await layerZeroBridge({
      TOKEN_ID,
      fromNetwork,
      toNetwork,
      ownerAddress,
      signer: signer as Signer,
      txGasLimit: txGasLimit || 500000,
    });

    if (tx.hash) {
      const { response, error: apiError } = await updateBridgeData({
        address: ownerAddress,
        contractType: ContractType.ONFT_ERC721,
        chainId: fromNetwork.id,
      });
      return { tx, response, bridgeError, apiError };
    }
    return { tx, bridgeError };
  } else if (contractProvider.type == "hyperlane") {
    const { tx, error: bridgeError } = await hyperlaneBridge({
      TOKEN_ID,
      fromNetwork,
      toNetwork,
      signer: signer as Signer,
      txGasLimit: txGasLimit || 500000,
    });

    if (tx.hash) {
      const { response, error: APIerror } = await updateBridgeData({
        address: ownerAddress,
        contractType: ContractType.ONFT_ERC721,
        chainId: fromNetwork.id,
      });
      return { tx, response, bridgeError, APIerror };
    }
    return { tx, bridgeError };
  }
};

const layerZeroBridge = async ({
  TOKEN_ID,
  fromNetwork,
  toNetwork,
  ownerAddress,
  signer,
  txGasLimit,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  ownerAddress: string;
  signer: Signer;
  txGasLimit: number | string;
}) => {
  let tx;
  let error;

  if (!fromNetwork.deployedContracts)
    throw new Error(`No deployed contracts found for ${fromNetwork.name}`);

  const contract = new Contract(
    fromNetwork.deployedContracts.layerzero.ONFT.address,
    fromNetwork.deployedContracts.layerzero.ONFT.ABI,
    signer,
  );

  try {
    // REMOTE CHAIN ID IS THE CHAIN OF THE RECEIVING NETWORK
    // ex. if you are sending from Ethereum to Polygon, the remote chain id is the Polygon chain id
    const remoteChainId = toNetwork.params?.layerzero.remoteChainId;

    // create options
    const options = Options.newOptions()
      .addExecutorLzReceiveOption(200000, 0)
      .toHex()
      .toString();

    let nativeFee = 0;
    [nativeFee] = await contract.quote(
      remoteChainId,
      TOKEN_ID,
      ownerAddress,
      options,
      false,
    );
    tx = await contract.send(
      remoteChainId, // remote LayerZero chainId v2
      TOKEN_ID, // tokenId to send
      ownerAddress, // to address
      options, // flexible bytes array to indicate messaging adapter services
      false, // use LayerZero token as gas
      {
        value: nativeFee,
        gasLimit: txGasLimit,
      },
    );

    await tx.wait();
  } catch (e) {
    console.error(e);
    error = e;
    throw new Error((e as any).data?.message || (e as any)?.message);
  }

  return {
    tx,
    error,
  };
};

const hyperlaneBridge = async ({
  TOKEN_ID,
  fromNetwork,
  toNetwork,
  signer,
  txGasLimit,
}: {
  TOKEN_ID: string;
  fromNetwork: Network;
  toNetwork: Network;
  signer: Signer;
  txGasLimit: number | string;
}) => {
  let tx;
  let error;
  if (!fromNetwork.deployedContracts || !toNetwork.deployedContracts)
    throw new Error(
      `No deployed contracts found for ${fromNetwork.name} or ${toNetwork.name}`,
    );

  const contract = new Contract(
    fromNetwork.deployedContracts.hyperlane.ONFT.address,
    fromNetwork.deployedContracts.hyperlane.ONFT.ABI,
    signer,
  );

  const targetAddress = toNetwork.deployedContracts.hyperlane.NFT.address;
  const targetChainId = toNetwork.params;

  const GAS_LIMIT = txGasLimit;

  try {
    const nativeFee = await contract.getBridgeGas(
      targetChainId,
      targetAddress,
      TOKEN_ID,
    );

    tx = await contract.sendPayload(targetChainId, targetAddress, TOKEN_ID, {
      value: nativeFee,
      gasLimit: GAS_LIMIT,
    });

    await tx.wait();
  } catch (e) {
    error = e;
    throw new Error((e as any).data?.message || (e as any)?.message);
  }

  return {
    tx,
    error,
  };
};
