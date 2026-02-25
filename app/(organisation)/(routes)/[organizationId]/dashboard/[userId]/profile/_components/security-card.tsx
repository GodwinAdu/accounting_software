"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { TwoFactorSetup } from "./two-factor-setup";
import Link from "next/link";

interface SecurityCardProps {
  initialTwoFactorEnabled: boolean;
  emailVerified: boolean;
  organizationId: string;
  userId: string;
}

export function SecurityCard({ initialTwoFactorEnabled, emailVerified, organizationId, userId }: SecurityCardProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initialTwoFactorEnabled);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={twoFactorEnabled ? "default" : "secondary"} className={twoFactorEnabled ? "bg-emerald-600" : ""}>
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
        <TwoFactorSetup 
          enabled={twoFactorEnabled} 
          onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)} 
        />
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Verification</p>
            <p className="text-sm text-muted-foreground">Verify your email address</p>
          </div>
          <Badge variant={emailVerified ? "default" : "secondary"} className={emailVerified ? "bg-emerald-600" : ""}>
            {emailVerified ? "Verified" : "Not Verified"}
          </Badge>
        </div>
        
        <Separator />
        
        <Link href={`/${organizationId}/dashboard/${userId}/settings/password`}>
          <Button variant="outline" className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
