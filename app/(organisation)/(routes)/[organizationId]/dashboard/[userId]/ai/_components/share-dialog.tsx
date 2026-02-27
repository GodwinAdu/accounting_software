"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
} from "react-share";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareLink: string;
  title?: string;
}

export function ShareDialog({ open, onOpenChange, shareLink, title = "Check out this AI conversation" }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Conversation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input value={shareLink} readOnly className="flex-1" />
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-3">Share via:</p>
            <div className="flex gap-2 flex-wrap">
              <FacebookShareButton url={shareLink} quote={title}>
                <FacebookIcon size={40} round />
              </FacebookShareButton>
              
              <TwitterShareButton url={shareLink} title={title}>
                <TwitterIcon size={40} round />
              </TwitterShareButton>
              
              <LinkedinShareButton url={shareLink} title={title}>
                <LinkedinIcon size={40} round />
              </LinkedinShareButton>
              
              <WhatsappShareButton url={shareLink} title={title}>
                <WhatsappIcon size={40} round />
              </WhatsappShareButton>
              
              <TelegramShareButton url={shareLink} title={title}>
                <TelegramIcon size={40} round />
              </TelegramShareButton>
              
              <EmailShareButton url={shareLink} subject={title}>
                <EmailIcon size={40} round />
              </EmailShareButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
