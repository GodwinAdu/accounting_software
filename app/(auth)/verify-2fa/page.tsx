"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { verify2FALogin } from "@/lib/actions/two-factor.action";
import { Logo } from "@/components/logo";
import Link from "next/link";

function Verify2FAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!email) {
    router.push("/sign-in");
    return null;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verify2FALogin(email, code);
      
      if (!result.success) {
        toast.error(result.error || "Invalid verification code");
        return;
      }
      
      // TODO: Complete login and redirect to dashboard
      toast.success("Verification successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-full">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl font-mono tracking-widest"
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center">
                Logging in as: <span className="font-medium">{email}</span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="text-center">
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Back to login
              </Link>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Lost your device?</strong> Contact your administrator to disable 2FA or use backup codes.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    }>
      <Verify2FAContent />
    </Suspense>
  );
}
