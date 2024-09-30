import React, { createContext, useState, useEffect, useContext } from "react";
import { useWalletConnection } from "../hooks/useConnectWallet";

interface WalletContextType {
  account: string | null;
  chainId: string | null;
  isConnected: boolean;
  addressInput: string;
  balance: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setAddressInput: (address: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { account, chainId, connect, disconnect, isConnected } =
    useWalletConnection();
  const [addressInput, setAddressInput] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (isConnected && addressInput) {
      fetchBalance(addressInput);
    } else {
      setBalance("");
    }
  }, [isConnected, addressInput, chainId]);

  const fetchBalance = async (address: string) => {
    if (window.ethereum) {
      try {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [address, "latest"],
        });
        setBalance(parseInt(balance as string, 16).toString());
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("Error");
      }
    }
  };

  const value = {
    account,
    chainId,
    isConnected,
    addressInput,
    balance,
    connect,
    disconnect,
    setAddressInput,
  };

  return (
    // @ts-expect-error
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
