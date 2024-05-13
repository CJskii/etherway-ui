import React, { ReactNode, createContext } from "react";
import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { adminPaths, admins, privatePaths } from "../constants/privatePaths";
import { UserData, getUserData } from "@/utils/api/user";
import { useAccount, useConfig } from "wagmi";
import { getUserStakingStats } from "@/utils/contracts/handlers/handleStaking";
import { useSession } from "next-auth/react";

// import "react-toastify/dist/ReactToastify.css";
// import en from "../public/en.svg";

interface AuthContextProps {
  currentUserData: React.MutableRefObject<UserData | undefined>;
  currentUser: `0x${string}` | undefined;
  authorized: boolean;
  isAdmin: boolean;
  setHasChanged: (value: boolean) => void;
  hasChanged: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  const [currentUser, setCurrentUser] = useState<`0x${string}` | undefined>();
  const currentUserData = useRef<UserData | undefined>(undefined);
  const router = useRouter();
  const { address } = useAccount();
  const config = useConfig();

  const [authorized, setAuthorized] = useState<boolean>(false);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  async function getData() {
    const user = await getUserData();
    // console.log(user);
    if (user) {
      currentUserData.current = user;
    }
  }

  // get the user data if the user address is connected and the data is not yet fetched
  // the user Data can be accessed globally from any state
  useEffect(() => {
    setCurrentUser(address);
    // console.log(address);
    if (address && !currentUserData.current && session) {
      if (admins.includes(address)) {
        console.log("Admin Acessed allowed");
        setIsAdmin(true);
      }
      getData();
    }
    if (address == undefined) {
      setCurrentUser(undefined);
      currentUserData.current = undefined;
    }
  }, [address, session]);

  useEffect(() => {
    if (hasChanged) {
      getData();
      setHasChanged(false);
    }
  }, [hasChanged]);

  useEffect(() => {
    const authCheck = async () => {
      if (privatePaths.includes(router.pathname)) {
        if (!currentUser) {
          console.log("User not available");
          // If the wallet is not connected and the user tries to access then push to home page and sak to connect
          void router.push({
            pathname: "/",
          });
          return;
        }

        console.log("Private Path accessed");

        // // Add a check and see if the User has staked yet or not
        const stakeInfo = await getUserStakingStats({
          toAddress: currentUser,
          config: config,
        });

        console.log(stakeInfo);
        if (stakeInfo) {
          const { stakedAmount } = stakeInfo;
          const hasStaked = Number(stakedAmount) > 0 ? true : false;

          setAuthorized(hasStaked);
          if (!hasStaked) {
            console.log("Not Staked");
            console.log("Access Restricted");
            setAuthorized(false);
            void router.push({
              pathname: "/staking",
            });
          } else {
            console.log("Access Allowed");
            setAuthorized(true);
          }
        } else {
          console.log("Access Restricted");
          setAuthorized(false);

          void router.push({
            pathname: "/staking",
          });
        }
      } else {
        setAuthorized(true);
      }

      if (adminPaths.includes(router.pathname) && !isAdmin) {
        console.log("Admin Path accessed");
        void router.push({
          pathname: "/",
        });
      }
    };

    authCheck();

    const preventAccess = () => setAuthorized(false);

    router.events.on("routeChangeStart", preventAccess);
    router.events.on("routeChangeComplete", authCheck);

    return () => {
      router.events.off("routeChangeStart", preventAccess);
      router.events.off("routeChangeComplete", authCheck);
    };
  }, [router, address]);

  const value = {
    currentUser,
    currentUserData,
    authorized,
    setHasChanged,
    hasChanged,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};
