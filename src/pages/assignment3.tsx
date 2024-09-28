import React, { useState, useEffect } from "react";
import { useWalletConnection } from "../hooks/useConnectWallet";

function Assignment3() {
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

  return (
    <div>
      <h1>Assignment 3: Wallet Connection</h1>
      {isConnected ? (
        <>
          <p>Connected Account: {account}</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
      <div>
        <input
          type="text"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="Enter address"
        />
        {balance && <p>Balance: {balance} wei</p>}
      </div>
    </div>
  );
}

export default Assignment3;
