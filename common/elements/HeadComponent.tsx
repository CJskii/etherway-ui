import Head from "next/head";

interface HeadComponentProps {
  title?: string;
  description?: string;
  image?: string;
  twitterHandle?: string;
}

const HeadComponent: React.FC<HeadComponentProps> = ({
  title = "Etherway: Omnichain Interoperability with latest cross-chain Technology",
  description = "Etherway redefines blockchain efficiency with wallet integration, gas refueling, cross-chain messaging, airdrop marketplace and interoperability, all powered by latest cross-chain technology. Mint and Bridge OFT and ONFT tokens across multiple chains.",
  image = "https://pbs.twimg.com/profile_banners/1634697370247233538/1710699959/1500x500",
  twitterHandle = "@Etherway_io",
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://verify.walletconnect.org/" />
      {/* Twitter Card data */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* Open Graph data */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.etherway.io/" />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Etherway" />
      {/* Additional tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="dark" />{" "}
    </Head>
  );
};

export default HeadComponent;
