import { ethers, Contract } from "ethers";
import getProviderOrSigner from "../../getters/getProviderOrSigner";
import { Network } from "../../../types/network";
import { getTokenId } from "../../getters/getTokenId";
import { Signer } from "ethers";

export const handleMinting = async ({
  mintNetwork,
  contractProvider,
  mintQuantity,
}: {
  mintNetwork: Network;
  contractProvider: {
    type: string;
    contract: string;
  };
  mintQuantity?: number;
}) => {
  // TODO: Refactor this function with dynamic gas limit
  // TODO: Add conditions for OFT minting
  const mintGasLimit = mintNetwork.name == "Arbitrum One" ? 2000000 : 1000000;

  if (
    contractProvider.type == "layerzero" &&
    contractProvider.contract == "ONFT"
  ) {
    return handleLayerZeroONFTMinting({ mintNetwork, mintGasLimit });
  } else if (
    contractProvider.type == "layerzero" &&
    contractProvider.contract == "OFT"
  ) {
    return handleLayerZeroOFTMinting({
      mintNetwork,
      mintGasLimit,
      mintQuantity: mintQuantity || 0,
    });
  } else if (
    contractProvider.type == "hyperlane" &&
    contractProvider.contract == "ONFT"
  ) {
    return handleHyperlaneONFTMinting({ mintNetwork, mintGasLimit });
  } else if (
    contractProvider.type == "hyperlane" &&
    contractProvider.contract == "OFT"
  ) {
    return handleHyperlaneOFTMinting({
      mintNetwork,
      mintGasLimit,
      mintQuantity: mintQuantity || 0,
    });
  }
};

const handleLayerZeroONFTMinting = async ({
  mintNetwork,
  mintGasLimit,
}: {
  mintNetwork: Network;
  mintGasLimit: number;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.layerzero.ONFT.address,
      mintNetwork.deployedContracts.layerzero.ONFT.ABI,
      signer as any,
    );
    const contractFeeInWei = await contract.mintFee();
    const feeInEther = ethers.utils.formatEther(contractFeeInWei);

    let tx = await (
      await contract.mint({
        value: ethers.utils.parseEther(feeInEther),
        gasLimit: mintGasLimit,
      })
    ).wait();

    const txHash: string = tx.transactionHash;
    let mintedID = await getTokenId({ txHash, mintNetwork, provider });

    return { mintedID, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};

const handleHyperlaneONFTMinting = async ({
  mintNetwork,
  mintGasLimit,
}: {
  mintNetwork: Network;
  mintGasLimit: number;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.hyperlane.ONFT.address,
      mintNetwork.deployedContracts.hyperlane.ONFT.ABI,
      signer as any,
    );
    const fee = await contract.fee();

    let tx = await (
      await contract.mint({
        value: fee,
        gasLimit: mintGasLimit,
      })
    ).wait();

    const txHash: string = tx.transactionHash;
    let mintedID = await getTokenId({ txHash, mintNetwork, provider });

    return { mintedID, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};

const handleLayerZeroOFTMinting = async ({
  mintNetwork,
  mintGasLimit,
  mintQuantity,
}: {
  mintNetwork: Network;
  mintGasLimit: number;
  mintQuantity: number;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);
    const toAddress = (await (signer as Signer).getAddress()).toLowerCase();

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.layerzero.OFT.address,
      mintNetwork.deployedContracts.layerzero.OFT.ABI,
      signer as any,
    );
    const fee = await contract.getMintFee(mintQuantity);

    console.log(`Minting ${mintQuantity} OFTs...`);

    const tx = await contract.mint(toAddress, mintQuantity, {
      value: fee,
      gasLimit: mintGasLimit,
    });

    await tx.wait();

    const txHash: string = tx.hash;

    return { mintedID: 0, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};

const handleHyperlaneOFTMinting = async ({
  mintNetwork,
  mintGasLimit,
  mintQuantity,
}: {
  mintNetwork: Network;
  mintGasLimit: number;
  mintQuantity: number;
}) => {
  try {
    // Initiate provider and signer
    const provider = await getProviderOrSigner();
    const signer = await getProviderOrSigner(true);
    const toAddress = (await (signer as Signer).getAddress()).toLowerCase();

    if (!(provider instanceof ethers.providers.Web3Provider)) {
      console.error("Provider is not an instance of Web3Provider");
      return;
    }

    if (!mintNetwork.deployedContracts)
      throw new Error(`No deployed contracts found for ${mintNetwork.name}`);

    // Initiate contract instance and get fee
    const contract = new Contract(
      mintNetwork.deployedContracts.hyperlane.OFT.address,
      mintNetwork.deployedContracts.hyperlane.OFT.ABI,
      signer as any,
    );

    const contractFee = await contract.fee();
    const totalFee = contractFee.mul(mintQuantity);

    console.log(`Minting ${mintQuantity} OFTs...`);

    const tx = await contract.mint(toAddress, mintQuantity, {
      value: totalFee,
      mintGasLimit,
    });

    await tx.wait();

    const txHash: string = tx.hash;

    return { mintedID: 0, txHash };
  } catch (e) {
    console.log(e);
    throw new Error((e as any).data?.message || (e as any)?.message);
  }
};
