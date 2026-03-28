import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useWallet } from "./hooks/useWallet";
import Home from "./pages/Home";
import Swap from "./pages/Swap";
import Liquidity from "./pages/Liquidity";
import Faucet from "./pages/Faucet";
import Portfolio from "./pages/Portfolio";
import History from "./pages/History";

function Navbar() {
  const { address, connect, disconnect } = useWallet();

  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              Stellar DEX
            </Link>
            <div className="flex space-x-4">
              <Link to="/swap" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Swap
              </Link>
              <Link to="/liquidity" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Liquidity
              </Link>
              <Link to="/faucet" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Faucet
              </Link>
              <Link to="/portfolio" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Portfolio
              </Link>
              <Link to="/history" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                History
              </Link>
            </div>
          </div>
          <div>
            {address ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <button
                  onClick={disconnect}
                  className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swap" element={<Swap />} />
            <Route path="/liquidity" element={<Liquidity />} />
            <Route path="/faucet" element={<Faucet />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
