import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { useDisconnect } from "wagmi";

//https://next-auth.js.org/getting-started/client
const Auth: NextPage = () => {
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();

  return (
    <>
      <div className="relative h-auto">
        <div className=" z-10 "></div>
      </div>
      <button
        onClick={() => {
          disconnect();
          signOut();
        }}
      >
        Sign Out
      </button>
    </>
  );
};

export default Auth;
