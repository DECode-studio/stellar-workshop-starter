import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// Constants
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const RPC_URL = "https://rpc-testnet.stellar.org";
const CONTRACTS = {
  TOKEN: "CA7WYTCHISZL5PGCAYT2IAA5KMXUOEMY2Y4CKLEDIXP3JXREB4KF3JSU",
  FAUCET: "CBD7HIHZJU6JS2UMTCFMT7XYRPX3YXUUIJPKVYWXAGDY73UESDEHRSO3",
  FACTORY: "", // Deployment failed - WASM validation issue
  POOL: "CA4QJ6NP642YLVEB2RQNTFNWT4FQILFFQ6U7ILWYKTVVAPZZ2OMN64P4",
};
const SLIPPAGE_TOLERANCE = 0.5;

// Wallet Hook
function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.freighterApi) {
        try {
          const isAllowed = await window.freighterApi.isAllowed();
          if (isAllowed) {
            const publicKey = await window.freighterApi.getPublicKey();
            setAddress(publicKey);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    checkConnection();
  }, []);

  const connect = async () => {
    if (!window.freighterApi) return;
    setIsConnecting(true);
    try {
      await window.freighterApi.setAllowed();
      const publicKey = await window.freighterApi.getPublicKey();
      setAddress(publicKey);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => setAddress(null);
  return { address, connect, disconnect, isConnecting };
}

// UI Components
function Button({ children, onClick, disabled, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full bg-dark-800 border border-dark-700 rounded-md px-4 py-2 text-white"
    />
  );
}

function Card({ children }: any) {
  return <div className="bg-dark-800 border border-dark-700 rounded-xl p-6">{children}</div>;
}

// Pages
function Home() {
  const { address } = useWallet();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Stellar DEX</h1>
        <p className="text-gray-400">Decentralized Exchange on Soroban</p>
      </div>
      {!address && <Card><p className="text-center text-gray-400">Connect wallet to start trading</p></Card>}
      <div className="grid md:grid-cols-3 gap-6">
        <Card><p className="text-3xl font-bold text-primary">$0</p><p className="text-gray-400 text-sm">TVL</p></Card>
        <Card><p className="text-3xl font-bold text-secondary">0</p><p className="text-gray-400 text-sm">Trades</p></Card>
        <Card><p className="text-3xl font-bold text-green-500">0</p><p className="text-gray-400 text-sm">Pools</p></Card>
      </div>
    </div>
  );
}

function Swap() {
  const { address } = useWallet();
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState(0);

  const handleSwap = () => {
    const out = parseFloat(amountIn) * 0.9975;
    setAmountOut(out);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Swap</h1>
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">From</label>
            <Input type="number" value={amountIn} onChange={(e: any) => setAmountIn(e.target.value)} placeholder="0.0" />
          </div>
          <div className="text-center text-gray-400">↓</div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">To</label>
            <Input type="text" value={amountOut.toFixed(4)} readOnly placeholder="0.0" />
          </div>
          <Button onClick={handleSwap} disabled={!address || !amountIn} className="w-full">
            {!address ? "Connect Wallet" : "Swap"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Liquidity() {
  const { address } = useWallet();
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Liquidity</h1>
      <Card>
        <h2 className="text-lg font-semibold mb-4">Add Liquidity</h2>
        <div className="space-y-4">
          <Input label="Token A" type="number" value={amountA} onChange={(e: any) => setAmountA(e.target.value)} placeholder="0.0" />
          <Input label="Token B" type="number" value={amountB} onChange={(e: any) => setAmountB(e.target.value)} placeholder="0.0" />
          <Button disabled={!address} className="w-full">{!address ? "Connect Wallet" : "Add Liquidity"}</Button>
        </div>
      </Card>
    </div>
  );
}

function Faucet() {
  const { address } = useWallet();
  const [amount, setAmount] = useState("1000");

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Faucet</h1>
      <Card>
        <div className="space-y-4">
          <Input label="Amount" type="number" value={amount} onChange={(e: any) => setAmount(e.target.value)} />
          <Button disabled={!address} className="w-full">{!address ? "Connect Wallet" : "Mint Tokens"}</Button>
        </div>
      </Card>
    </div>
  );
}

function Portfolio() {
  const { address } = useWallet();
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Portfolio</h1>
      {address ? (
        <Card>
          <p className="text-gray-400">Wallet: {address.slice(0, 6)}...{address.slice(-4)}</p>
          <p className="text-gray-500 mt-4">No tokens yet</p>
        </Card>
      ) : (
        <Card><p className="text-gray-400">Connect wallet to view portfolio</p></Card>
      )}
    </div>
  );
}

function History() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      <Card><p className="text-gray-500 text-center py-8">No transactions yet</p></Card>
    </div>
  );
}

// Navbar
function Navbar() {
  const { address, connect, disconnect } = useWallet();
  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <Link to="/" className="text-xl font-bold text-primary">Stellar DEX</Link>
            <Link to="/swap" className="text-gray-300 hover:text-white">Swap</Link>
            <Link to="/liquidity" className="text-gray-300 hover:text-white">Liquidity</Link>
            <Link to="/faucet" className="text-gray-300 hover:text-white">Faucet</Link>
            <Link to="/portfolio" className="text-gray-300 hover:text-white">Portfolio</Link>
            <Link to="/history" className="text-gray-300 hover:text-white">History</Link>
          </div>
          {address ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">{address.slice(0, 6)}...{address.slice(-4)}</span>
              <button onClick={disconnect} className="text-white text-sm">Disconnect</button>
            </div>
          ) : (
            <Button onClick={connect}>Connect Wallet</Button>
          )}
        </div>
      </div>
    </nav>
  );
}

// Main App
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-8">
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
