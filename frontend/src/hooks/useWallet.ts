import { useState, useEffect } from "react";

declare global {
  interface Window {
    freighterApi?: {
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string, options?: any) => Promise<string>;
      setAllowed: () => Promise<void>;
      isAllowed: () => Promise<boolean>;
    };
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.freighterApi) {
        try {
          const isAllowed = await window.freighterApi.isAllowed();
          if (isAllowed) {
            const publicKey = await window.freighterApi.getPublicKey();
            setAddress(publicKey);
          }
        } catch (e) {
          console.error("Error checking wallet connection:", e);
        }
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    if (!window.freighterApi) {
      setError("Freighter wallet not installed. Please install from https://www.freighter.app/");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await window.freighterApi.setAllowed();
      const publicKey = await window.freighterApi.getPublicKey();
      setAddress(publicKey);
    } catch (e: any) {
      setError(e.message || "Failed to connect wallet");
      console.error("Wallet connection error:", e);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setError(null);
  };

  return { address, connect, disconnect, isConnecting, error };
}
