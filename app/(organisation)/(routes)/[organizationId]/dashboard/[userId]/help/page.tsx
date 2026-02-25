import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Book, MessageCircle, Mail, Phone, Video, FileText, Search, ExternalLink } from "lucide-react";
import Link from "next/link";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function HelpPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  const helpCategories = [
    {
      title: "Getting Started",
      icon: Book,
      description: "Learn the basics of FindIT",
      articles: [
        "Setting up your organization",
        "Creating your first invoice",
        "Adding products and services",
        "Managing customers and vendors",
      ],
    },
    {
      title: "Accounting",
      icon: FileText,
      description: "Master your finances",
      articles: [
        "Chart of accounts setup",
        "Recording journal entries",
        "Bank reconciliation guide",
        "Financial reports explained",
      ],
    },
    {
      title: "Inventory",
      icon: Book,
      description: "Product and stock management",
      articles: [
        "Product variants setup",
        "Stock adjustments",
        "Reorder alerts configuration",
        "Purchase order workflow",
      ],
    },
    {
      title: "Sales & Invoicing",
      icon: FileText,
      description: "Manage your sales",
      articles: [
        "Creating professional invoices",
        "Sales order processing",
        "Payment recording",
        "Customer portal setup",
      ],
    },
  ];

  const supportChannels = [
    {
      title: "Live Chat",
      icon: MessageCircle,
      description: "Chat with our support team",
      action: "Start Chat",
      available: "24/7",
      color: "emerald",
    },
    {
      title: "Email Support",
      icon: Mail,
      description: "support@findit.com",
      action: "Send Email",
      available: "Response in 24h",
      color: "blue",
    },
    {
      title: "Phone Support",
      icon: Phone,
      description: "+233 XX XXX XXXX",
      action: "Call Now",
      available: "Mon-Fri 9AM-6PM",
      color: "purple",
    },
    {
      title: "Video Tutorials",
      icon: Video,
      description: "Watch step-by-step guides",
      action: "Watch Now",
      available: "100+ videos",
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      <Heading title="Help & Support" description="Get help and learn how to use FindIT" />
      <Separator />

      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">How can we help you today?</h3>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help articles, guides, and tutorials..."
                  className="pl-10 bg-background"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Browse Help Topics</h3>
          {helpCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} className="hover:border-emerald-500/40 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg">
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, idx) => (
                      <li key={idx}>
                        <Link
                          href="#"
                          className="text-sm text-muted-foreground hover:text-emerald-600 flex items-center gap-2"
                        >
                          <span>→</span>
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Contact Support</h3>
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <Card key={index} className="hover:border-emerald-500/40 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-${channel.color}-100 dark:bg-${channel.color}-950/30 rounded-lg`}>
                      <Icon className={`h-6 w-6 text-${channel.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{channel.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                      <p className="text-xs text-muted-foreground mb-3">{channel.available}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        {channel.action}
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-emerald-600" />
                <CardTitle>Quick Links</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/documentation" className="flex items-center justify-between p-2 hover:bg-background rounded-lg transition-colors">
                <span className="text-sm">Documentation</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link href="/api-reference" className="flex items-center justify-between p-2 hover:bg-background rounded-lg transition-colors">
                <span className="text-sm">API Reference</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link href={`/${organizationId}/dashboard/${userId}/settings/shortcuts`} className="flex items-center justify-between p-2 hover:bg-background rounded-lg transition-colors">
                <span className="text-sm">Keyboard Shortcuts</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link href="/changelog" className="flex items-center justify-between p-2 hover:bg-background rounded-lg transition-colors">
                <span className="text-sm">What's New</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
