import { WalletProvider } from "./context/WalletContext";
import Assignment3 from "./components/Assignment3";

function App() {
  return (
    <WalletProvider>
      <Assignment3 />
    </WalletProvider>
  );
}

export default App;
