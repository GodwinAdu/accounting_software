"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Loader2, Copy, Check } from "lucide-react";
import QRCode from "qrcode";
import { enable2FAForLogin, verify2FASetupForLogin } from "@/lib/actions/two-factor.action";

function Setup2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userId || !email) {
      toast.error("Invalid setup link");
      router.push("/sign-in");
      return;
    }
    setupTwoFactor();
  }, []);

  const setupTwoFactor = async () => {
    try {
      const result = await enable2FAForLogin(email!);
      if (result.success && result.data) {
        setSecret(result.data.secret);
        const qr = await QRCode.toDataURL(result.data.qrCode);
        setQrCode(qr);
      } else {
        toast.error(result.error || "Failed to generate 2FA setup");
        router.push("/sign-in");
      }
    } catch (error) {
      toast.error("Failed to setup 2FA");
      router.push("/sign-in");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setVerifying(true);
    try {
      const result = await verify2FASetupForLogin(email!, code);
      if (result.success) {
        toast.success("2FA enabled successfully!", {
          description: "You can now log in with your credentials and 2FA code.",
        });
        router.push("/sign-in");
      } else {
        toast.error(result.error || "Invalid code");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.success("Secret copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl">Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Your organization requires 2FA. Follow the steps below to secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Step 1: Scan QR Code</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Open your authenticator app and scan this QR code
              </p>
              {qrCode && (
                <div className="flex justify-center p-4 bg-white rounded-lg border">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Step 2: Or Enter Manually</h3>
              <p className="text-sm text-muted-foreground mb-2">
                If you can't scan, enter this code manually:
              </p>
              <div className="flex gap-2">
                <Input value={secret} readOnly className="font-mono text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copySecret}
                  className="shrink-0"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Step 3: Verify Code</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Enter the 6-digit code from your authenticator app
              </p>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleVerify}
              disabled={verifying || code.length !== 6}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify and Enable 2FA
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Supported apps: Google Authenticator, Microsoft Authenticator, Authy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Setup2FAPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <Setup2FAContent />
    </Suspense>
  );
}
