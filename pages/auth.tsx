import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { useDisconnect } from "wagmi";

//https://next-auth.js.org/getting-started/client
const Auth: NextPage = () => {
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();
  // we can add the requirement for a session to be present to gate the access to these pages
  return (
    <>
      {/* // TODO: Uncomment below line to use the new design */}
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
      {/* <div className="flex justify-center items-center pt-8">
        {"There's nothing here yet, but the devs are building something amazing!"}
      </div> */}
      {/* <HeadComponent />
      <Hero />
      <div className="divider divider-primary"></div>
      <Process />
      <div className="divider divider-primary"></div>
      <NewsLetter /> */}
    </>
  );
};

export default Auth;
