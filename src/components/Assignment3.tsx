import { useWallet } from "../context/WalletContext";

function Assignment3() {
  const {
    account,
    chainId,
    isConnected,
    addressInput,
    balance,
    connect,
    disconnect,
    setAddressInput,
  } = useWallet();

  return (
    <div className="max-w-2xl p-6 mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Assignment 3: Wallet Connection
      </h1>
      <div className="space-y-4">
        {isConnected ? (
          <div className="p-4 bg-white rounded-md shadow">
            <p className="text-gray-700">
              <span className="font-semibold">Connected Account:</span>{" "}
              {account}
            </p>
            <p className="mt-2 text-gray-700">
              <span className="font-semibold">Chain ID:</span>{" "}
              {chainId ? parseInt(chainId, 16) : ""}
            </p>
            <button
              onClick={disconnect}
              className="px-4 py-2 mt-4 font-bold text-white transition duration-300 bg-red-500 rounded hover:bg-red-600"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            className="w-full px-4 py-2 font-bold text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        )}
        <div className="mt-6">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Enter address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {balance && (
            <p className="mt-2 text-gray-700">
              <span className="font-semibold">Balance:</span>{" "}
              {parseInt(balance) / 1000000000000000000} ETH
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Assignment3;
