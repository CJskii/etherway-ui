// import { SquidWidget } from "@0xsquid/widget";

// export default function SquidRouter() {
//   return (
//     <SquidWidget
//       config={{
//         companyName: "Etherway",
//         integratorId: "etherway-2c794744-6972-4f23-bdcb-784032b1a377",
//         slippage: 1,
//         infiniteApproval: false,
//         initialToChainId: 81457,
//         showOnRampLink: true,
//         apiUrl: "https://api.squidrouter.com",
//         collectFees: {
//           integratorAddress: "0x62C43323447899acb61C18181e34168903E033Bf",
//           fee: 50,
//         },
//         mainLogoUrl: "https://www.etherway.io/favicon.ico",
//         availableChains: {
//           destination: [81457],
//         },
//         internalSameChainSwapAllowed: true,
//         // style: {
//         //   neutralContent: "#9DA7B1",
//         //   baseContent: "#FFFDFD",
//         //   base100: "#434565",
//         //   base200: "#202230",
//         //   base300: "#161522",
//         //   error: "#ED6A5E",
//         //   warning: "#FFB155",
//         //   success: "#62C555",
//         //   primary: "#AB67CB",
//         //   secondary: "#37394C",
//         //   secondaryContent: "#B2BCD3",
//         //   secondaryFocus: "#B2BCD3",
//         //   neutral: "#383A4C",
//         //   roundedBtn: "24px",
//         //   roundedBox: "20px",
//         //   roundedCornerBtn: "0px",
//         //   roundedDropDown: "0px",
//         //   advanced: {
//         //     transparentWidget: false,
//         //   },
//         // },
//       }}
//     />
//   );
// }

const darkTheme = {
  neutralContent: "#959BB2",
  baseContent: "#E8ECF2",
  base100: "#10151B",
  base200: "#272D3D",
  base300: "#171D2B",
  error: "#ED6A5E",
  warning: "#FFB155",
  success: "#2EAEB0",
  primary: "#FF8F8F",
  secondary: "#71B4BD",
  secondaryContent: "#191C29",
  neutral: "#110E14",
  roundedBtn: "5px",
  roundedCornerBtn: "999px",
  roundedBox: "8px",
  roundedDropDown: "7px",
};

const lightTheme = {
  neutralContent: "#747379",
  baseContent: "#2E2C33",
  base100: "#F5F5F7",
  base200: "#F2F2F2",
  base300: "#DADADA",
  error: "#ED6A5E",
  warning: "#FFB155",
  success: "#2EAEB0",
  primary: "#FF8F8F",
  secondary: "#070707",
  secondaryContent: "#FFFFFF",
  neutral: "#f1efef",
  roundedBtn: "999px",
  roundedCornerBtn: "999px",
  roundedBox: "1rem",
  roundedDropDown: "999px",
};

import { useTheme } from "next-themes";

export function SquidRouterIFrame() {
  const { theme } = useTheme();

  const style = () => {
    if (theme === "light") {
      return lightTheme;
    } else {
      return darkTheme;
    }
  };

  const config = {
    companyName: "Etherway",
    integratorId: "etherway-2c794744-6972-4f23-bdcb-784032b1a377",
    slippage: 1,
    infiniteApproval: false,
    initialToChainId: 81457,
    showOnRampLink: true,
    apiUrl: "https://api.squidrouter.com",
    collectFees: {
      integratorAddress: "0x62C43323447899acb61C18181e34168903E033Bf",
      fee: 50,
    },
    mainLogoUrl: "https://www.etherway.io/favicon.ico",
    availableChains: {
      destination: [81457],
    },
    internalSameChainSwapAllowed: true,
    style: style(),
  };

  const configString = encodeURIComponent(JSON.stringify(config));
  return (
    <div className="z-10 py-20 md:py-16 flex items-center justify-center min-h-[90vh]">
      <iframe
        title="squid_widget"
        width="440"
        height="680"
        className="rounded-xl"
        // src="https://widget.squidrouter.com/iframe?config=%7B%22integratorId%22%3A%22etherway-2c794744-6972-4f23-bdcb-784032b1a377%22%2C%22companyName%22%3A%22Etherway%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%2324232a%22%2C%22baseContent%22%3A%22%232E2C33%22%2C%22base100%22%3A%22%23F5F5F7%22%2C%22base200%22%3A%22%23F2F2F2%22%2C%22base300%22%3A%22%23DADADA%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%232EAEB0%22%2C%22primary%22%3A%22%232E2C33%22%2C%22secondary%22%3A%22%23070707%22%2C%22secondaryContent%22%3A%22%23FFFFFF%22%2C%22neutral%22%3A%22%23FFFFFF%22%2C%22roundedBtn%22%3A%22999px%22%2C%22roundedCornerBtn%22%3A%22999px%22%2C%22roundedBox%22%3A%221rem%22%2C%22roundedDropDown%22%3A%22999px%22%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22enableExpress%22%3Atrue%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22mainLogoUrl%22%3A%22%22%2C%22comingSoonChainIds%22%3A%5B%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Swap%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Select%20Token%22%2C%22chains%22%3A%22Select%20Chain%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22allTokens%22%3A%22Select%20Token%22%2C%22destination%22%3A%22Destination%20address%22%2C%22depositAddress%22%3A%22Deposit%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%2C%22environment%22%3A%22mainnet%22%2C%22showOnRampLink%22%3Atrue%2C%22defaultTokens%22%3A%5B%5D%2C%22collectFees%22%3A%7B%22integratorAddress%22%3A%220x62C43323447899acb61C18181e34168903E033Bf%22%2C%22fee%22%3A50%7D%2C%22availableChains%22%3A%7B%22destination%22%3A%5B81457%5D%7D%2C%22preferDex%22%3A%5B%22%22%5D%7D"
        src={`https://widget.squidrouter.com/iframe?config=${configString}`}
      />
    </div>
  );
}
