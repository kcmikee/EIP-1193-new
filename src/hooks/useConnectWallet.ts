import { useState, useEffect, useCallback } from "react";
import { EthereumProvider } from "../lib/types";

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export function useWalletConnection() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = (await window.ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];

        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
        const chainId = (await window.ethereum.request({
          method: "eth_chainId",
        })) as string;
        setChainId(chainId);
        setIsConnected(true);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("No Ethereum provider found");
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
  }, []);

  const accountChange = useCallback((accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      disconnect();
    }
  }, []);

  const chainChanged = useCallback((chainId: unknown) => {
    setChainId(chainId as string);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accountChange);

      window.ethereum.on("chainChanged", chainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", accountChange);
        window.ethereum.removeListener("chainChanged", chainChanged);
      }
    };
  }, [disconnect]);

  return { account, chainId, connect, disconnect, isConnected };
}
