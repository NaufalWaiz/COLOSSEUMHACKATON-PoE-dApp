"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";

function shortWallet(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

function toBase64(value: Uint8Array) {
  let binary = "";
  value.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

export function WalletAuthButton() {
  const { publicKey, connected, signMessage, disconnect } = useWallet();
  const [status, setStatus] = useState<"idle" | "authenticating" | "authenticated">("idle");
  const [sessionWallet, setSessionWallet] = useState<string | null>(null);
  const address = useMemo(() => publicKey?.toBase58() ?? null, [publicKey]);

  useEffect(() => {
    void fetch("/api/profile", { credentials: "include", cache: "no-store" }).then(async (response) => {
      if (!response.ok) return;
      const payload = await response.json();
      setSessionWallet(payload.walletAddress);
      setStatus("authenticated");
    });
  }, []);

  useEffect(() => {
    if (!connected || !address || !sessionWallet || sessionWallet !== address) return;
    setStatus("authenticated");
  }, [address, connected, sessionWallet]);

  async function handleAuthenticate() {
    if (!address || !signMessage) return;
    setStatus("authenticating");

    try {
      const nonceResponse = await fetch("/api/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });
      const noncePayload = await nonceResponse.json();
      const signature = await signMessage(new TextEncoder().encode(noncePayload.message));

      const verifyResponse = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: address,
          nonce: noncePayload.nonce,
          signature: toBase64(signature),
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Authentication failed.");
      }

      setSessionWallet(address);
      setStatus("authenticated");
    } catch (error) {
      console.error(error);
      setStatus("idle");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setSessionWallet(null);
    setStatus("idle");
    await disconnect();
  }

  if (!connected) {
    return <WalletMultiButton className="!rounded-full !bg-amber-400 !px-4 !py-2 !text-sm !font-semibold !text-slate-950" />;
  }

  if (status === "authenticated" && sessionWallet) {
    return (
      <div className="flex items-center gap-2">
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-muted-foreground">
          Signed in as <span className="font-semibold text-foreground">{shortWallet(sessionWallet)}</span>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleAuthenticate} disabled={!signMessage || status === "authenticating"}>
      {status === "authenticating" ? "Signing..." : `Sign with ${shortWallet(address ?? "wallet")}`}
    </Button>
  );
}
