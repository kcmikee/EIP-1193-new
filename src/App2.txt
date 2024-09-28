import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [currentChainId, setCurrentChainId] = useState<bigint | string | null>(
    null
  );

  // Function to connect/disconnect the wallet
  async function connectWallet() {
    if (!connected) {
      // Connect the wallet using ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();

      setConnected(true);
      setWalletAddress(_walletAddress);
      setCurrentChainId(network.chainId.toString().replace("n", ""));
    } else {
      // Disconnect the wallet
      // window.ethereum.selectedAddress = null;
      setConnected(false);
      setWalletAddress("");
      setCurrentChainId(null);
    }
  }

  async function switchNetwork(chainId: number) {
    if (!window.ethereum) {
      console.error("No crypto wallet found");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.toBeHex(chainId) }],
      });

      // Update current chain ID state
      setCurrentChainId(chainId);
    } catch (err: any) {
      if (err.code === 4902) {
        console.error(
          "This network is not available in your metamask, please add it manually"
        );
      } else {
        console.error(err);
      }
    }
  }

  useEffect(() => {
    const ethereum = window.ethereum;

    // Example 1: Log chainId
    ethereum
      .request({ method: "eth_chainId" })
      .then((chainId) => {
        console.log(`decimal number: ${parseInt(chainId, 16)}`);
      })
      .catch((error) => {
        console.error(
          `Error fetching chainId: ${error.code}: ${error.message}`
        );
      });

    // Example 3: Log available accounts
    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        console.log(`Accounts:\n${accounts.join("\n")}`);
      })
      .catch((error) => {
        console.error(
          `Error fetching accounts: ${error.message}.
           Code: ${error.code}. Data: ${error.data}`
        );
      });

    // Example 5: Log when accounts change

    // to unsubscribe
    ethereum.removeListener("accountsChanged", logAccounts);

    // Example 6: Log if connection ends
    ethereum.on("disconnect", (code, reason) => {
      console.log(
        `Ethereum Provider connection closed: ${reason}. Code: ${code}`
      );
    });
  }, []);

  const logAccounts = (accounts: unknown) => {
    console.log(`Accounts:\n${accounts.join("\n")}`);
  };

  window.ethereum.on("accountsChanged", logAccounts);
  window.ethereum.on("chainChange", logAccounts);

  return (
    <div className="app">
      <div className="main">
        <div className="content">
          <button className="btn" onClick={connectWallet}>
            {connected ? "Disconnect Wallet" : "Connect Wallet"}
          </button>
          <h3>Address</h3>
          <h4 className="wal-add">{walletAddress}</h4>
          {connected && (
            <div>
              <h3>Switch Network</h3>
              <button onClick={() => switchNetwork(4202)}>
                Lisk sepolia chain
              </button>
              <button onClick={() => switchNetwork(8453)}>Base Chain</button>
              <button onClick={() => switchNetwork(11155111)}>
                Sepolia Chain
              </button>
              <p>Current Chain ID: {currentChainId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
