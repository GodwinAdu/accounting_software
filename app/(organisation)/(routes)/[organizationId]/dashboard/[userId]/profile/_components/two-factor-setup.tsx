"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Smartphone, Key, Copy, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { enable2FA, verify2FASetup, disable2FA } from "@/lib/actions/two-factor.action";

interface TwoFactorSetupProps {
  enabled: boolean;
  onToggle: () => void;
}

export function TwoFactorSetup({ enabled, onToggle }: TwoFactorSetupProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"setup" | "verify">("setup");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && !enabled) {
      generateSecret();
    }
  }, [open, enabled]);

  const generateSecret = async () => {
    try {
      setIsLoading(true);
      const result = await enable2FA();
      
      if (!result.success) {
        toast.error(result.error || "Failed to generate 2FA secret");
        return;
      }
      
      setSecret(result.data.secret);

      // Generate QR code from otpauth URL
      const qr = await QRCode.toDataURL(result.data.qrCode);
      setQrCode(qr);
    } catch (error) {
      toast.error("Failed to generate 2FA secret");
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.success("Secret copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verify2FASetup(verificationCode, pathname);
      
      if (!result.success) {
        toast.error(result.error || "Invalid verification code");
        return;
      }
      
      toast.success("Two-factor authentication enabled successfully");
      onToggle();
      setOpen(false);
      setStep("setup");
      setVerificationCode("");
    } catch (error) {
      toast.error("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setIsLoading(true);
    try {
      const result = await disable2FA(pathname);
      
      if (!result.success) {
        toast.error(result.error || "Failed to disable 2FA");
        return;
      }
      
      toast.success("Two-factor authentication disabled");
      onToggle();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to disable 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={enabled ? "destructive" : "default"} className={!enabled ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
          <Shield className="h-4 w-4 mr-2" />
          {enabled ? "Disable 2FA" : "Enable 2FA"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!enabled ? (
          <>
            {step === "setup" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    Set Up Two-Factor Authentication
                  </DialogTitle>
                  <DialogDescription>
                    Scan the QR code with your authenticator app
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    {qrCode && (
                      <div className="p-4 bg-white rounded-lg border">
                        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                      </div>
                    )}
                    
                    <div className="w-full space-y-2">
                      <Label>Or enter this code manually:</Label>
                      <div className="flex gap-2">
                        <Input value={secret} readOnly className="font-mono text-sm" />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={copySecret}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex gap-2">
                      <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Recommended Apps:</p>
                        <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Google Authenticator</li>
                          <li>• Microsoft Authenticator</li>
                          <li>• Authy</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep("verify")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Continue to Verification
                  </Button>
                </div>
              </>
            )}

            {step === "verify" && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-emerald-600" />
                    Verify Your Code
                  </DialogTitle>
                  <DialogDescription>
                    Enter the 6-digit code from your authenticator app
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Verification Code</Label>
                    <Input
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                      className="text-center text-2xl font-mono tracking-widest"
                    />
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Save your backup codes in a secure location. You'll need them if you lose access to your authenticator app.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep("setup")}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerify}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      disabled={isLoading || verificationCode.length !== 6}
                    >
                      {isLoading ? "Verifying..." : "Verify & Enable"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Disable Two-Factor Authentication
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to disable 2FA? This will make your account less secure.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Disabling 2FA will remove the extra layer of security from your account. We recommend keeping it enabled.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDisable}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? "Disabling..." : "Disable 2FA"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
