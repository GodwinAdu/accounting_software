"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Copy, Send, Mail, AlertCircle } from "lucide-react";
import { generateEmail, sendEmail } from "@/lib/actions/ai.action";
import { toast } from "sonner";
import { useModuleAccess } from "@/lib/hooks/use-module-access";

interface AIEmailModalProps {
  open: boolean;
  onClose: () => void;
  type: "payment_reminder" | "thank_you" | "overdue_notice";
  recipientName: string;
  recipientEmail?: string;
  amount: number;
  invoiceNumber: string;
  dueDate: string;
}

export function AIEmailModal({
  open,
  onClose,
  type,
  recipientName,
  recipientEmail,
  amount,
  invoiceNumber,
  dueDate,
}: AIEmailModalProps) {
  const [emailContent, setEmailContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toEmail, setToEmail] = useState(recipientEmail || "");
  const { hasAccess: hasAIAccess, loading: checkingAccess } = useModuleAccess("ai");

  useEffect(() => {
    if (open && hasAIAccess) {
      generateEmailContent();
      setToEmail(recipientEmail || "");
    }
  }, [open, type, hasAIAccess]);

  const generateEmailContent = async () => {
    setIsGenerating(true);
    try {
      const result = await generateEmail(type, recipientName, amount, invoiceNumber, dueDate);
      if (result.success && result.email) {
        setEmailContent(result.email);
      } else {
        toast.error(result.error || "Failed to generate email");
      }
    } catch (error) {
      toast.error("Failed to generate email");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(emailContent);
    toast.success("Email copied to clipboard");
  };

  const handleSendViaClient = () => {
    const subject = type === "thank_you" 
      ? `Thank you for your payment - Invoice ${invoiceNumber}`
      : type === "overdue_notice"
      ? `Overdue Payment Notice - Invoice ${invoiceNumber}`
      : `Payment Reminder - Invoice ${invoiceNumber}`;
    
    const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailContent)}`;
    window.location.href = mailtoLink;
    toast.info("Opening email client...");
  };

  const handleSendDirect = async () => {
    if (!toEmail) {
      toast.error("Please enter recipient email");
      return;
    }

    setIsSending(true);
    try {
      const subject = type === "thank_you" 
        ? `Thank you for your payment - Invoice ${invoiceNumber}`
        : type === "overdue_notice"
        ? `Overdue Payment Notice - Invoice ${invoiceNumber}`
        : `Payment Reminder - Invoice ${invoiceNumber}`;

      const result = await sendEmail(toEmail, subject, emailContent);
      if (result.success) {
        toast.success("Email sent successfully!");
        onClose();
      } else {
        toast.error(result.error || "Failed to send email");
      }
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  const typeLabels = {
    payment_reminder: "Payment Reminder",
    thank_you: "Thank You Email",
    overdue_notice: "Overdue Notice",
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            AI Generated {typeLabels[type]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {checkingAccess ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : !hasAIAccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <AlertCircle className="h-12 w-12 text-amber-500" />
              <div className="text-center space-y-2">
                <p className="font-semibold">AI Module Not Enabled</p>
                <p className="text-sm text-muted-foreground">The AI Assistant module is not enabled for your organization.</p>
                <p className="text-sm text-muted-foreground">Please contact your administrator to enable this feature.</p>
              </div>
            </div>
          ) : isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
                <p className="text-sm text-muted-foreground">AI is writing your email...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">Recipient:</span> {recipientName} | 
                  <span className="font-semibold"> Invoice:</span> {invoiceNumber} | 
                  <span className="font-semibold"> Amount:</span> GHS {amount.toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toEmail">Recipient Email</Label>
                <Input
                  id="toEmail"
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>

              <Textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                className="font-mono text-sm"
                placeholder="Email content will appear here..."
              />

              <div className="flex gap-2">
                <Button
                  onClick={generateEmailContent}
                  variant="outline"
                  size="sm"
                  disabled={isGenerating}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={handleSendViaClient}
                  variant="outline"
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Open in Email
                </Button>
                <Button
                  onClick={handleSendDirect}
                  className="ml-auto bg-emerald-600 hover:bg-emerald-700"
                  size="sm"
                  disabled={isSending || !toEmail}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Send Email
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
