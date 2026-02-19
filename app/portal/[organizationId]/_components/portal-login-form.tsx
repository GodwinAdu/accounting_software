"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function PortalLoginForm({ organizationId }: { organizationId: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple email-based access (in production, would verify customer exists)
    if (email) {
      router.push(`/portal/${organizationId}/dashboard?email=${encodeURIComponent(email)}`);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Email Address</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Accessing..." : "Access Portal"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Enter your email to view your invoices and make payments
      </p>
    </form>
  );
}
