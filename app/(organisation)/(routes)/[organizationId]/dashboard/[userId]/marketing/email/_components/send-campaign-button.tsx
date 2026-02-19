"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { sendEmailCampaign } from "@/lib/actions/email-campaign.action";
import { sendSMSCampaign } from "@/lib/actions/sms-campaign.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SendCampaignButton({
  campaignId,
  type,
}: {
  campaignId: string;
  type: "email" | "sms";
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!confirm(`Are you sure you want to send this ${type} campaign?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = type === "email" 
        ? await sendEmailCampaign(campaignId)
        : await sendSMSCampaign(campaignId);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${type === "email" ? "Email" : "SMS"} campaign sent successfully`);
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to send campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handleSend}
      disabled={loading}
      className="bg-emerald-600 hover:bg-emerald-700"
    >
      <Send className="mr-2 h-4 w-4" />
      {loading ? "Sending..." : "Send"}
    </Button>
  );
}
