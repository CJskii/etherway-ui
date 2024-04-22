import { SquidWidget } from "@0xsquid/widget";

export default function SquidRouter() {
  return (
    <SquidWidget
      config={{
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
        // style: {
        //   neutralContent: "#9DA7B1",
        //   baseContent: "#FFFDFD",
        //   base100: "#434565",
        //   base200: "#202230",
        //   base300: "#161522",
        //   error: "#ED6A5E",
        //   warning: "#FFB155",
        //   success: "#62C555",
        //   primary: "#AB67CB",
        //   secondary: "#37394C",
        //   secondaryContent: "#B2BCD3",
        //   secondaryFocus: "#B2BCD3",
        //   neutral: "#383A4C",
        //   roundedBtn: "24px",
        //   roundedBox: "20px",
        //   roundedCornerBtn: "0px",
        //   roundedDropDown: "0px",
        //   advanced: {
        //     transparentWidget: false,
        //   },
        // },
      }}
    />
  );
}
