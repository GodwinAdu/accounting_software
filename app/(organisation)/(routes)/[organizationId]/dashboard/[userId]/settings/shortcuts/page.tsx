import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Command, Search, FileText, DollarSign, Package, Users, Settings } from "lucide-react";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function KeyboardShortcutsPage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const shortcuts = [
    {
      category: "General",
      icon: Command,
      items: [
        { keys: ["Ctrl", "K"], description: "Open command palette" },
        { keys: ["Ctrl", "/"], description: "Toggle sidebar" },
        { keys: ["Ctrl", "B"], description: "Toggle theme" },
        { keys: ["Esc"], description: "Close dialog/modal" },
      ],
    },
    {
      category: "Navigation",
      icon: Search,
      items: [
        { keys: ["G", "D"], description: "Go to Dashboard" },
        { keys: ["G", "I"], description: "Go to Invoices" },
        { keys: ["G", "E"], description: "Go to Expenses" },
        { keys: ["G", "P"], description: "Go to Products" },
        { keys: ["G", "C"], description: "Go to Customers" },
        { keys: ["G", "R"], description: "Go to Reports" },
      ],
    },
    {
      category: "Actions",
      icon: FileText,
      items: [
        { keys: ["Ctrl", "N"], description: "Create new invoice" },
        { keys: ["Ctrl", "E"], description: "Create new expense" },
        { keys: ["Ctrl", "P"], description: "Create new product" },
        { keys: ["Ctrl", "S"], description: "Save current form" },
        { keys: ["Ctrl", "Enter"], description: "Submit form" },
      ],
    },
    {
      category: "Sales",
      icon: DollarSign,
      items: [
        { keys: ["Alt", "I"], description: "New invoice" },
        { keys: ["Alt", "E"], description: "New estimate" },
        { keys: ["Alt", "R"], description: "Record payment" },
        { keys: ["Alt", "C"], description: "New customer" },
      ],
    },
    {
      category: "Inventory",
      icon: Package,
      items: [
        { keys: ["Alt", "P"], description: "New product" },
        { keys: ["Alt", "A"], description: "Stock adjustment" },
        { keys: ["Alt", "O"], description: "Purchase order" },
      ],
    },
    {
      category: "Settings",
      icon: Settings,
      items: [
        { keys: ["Ctrl", ","], description: "Open settings" },
        { keys: ["Ctrl", "Shift", "P"], description: "User preferences" },
        { keys: ["?"], description: "Show keyboard shortcuts" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Heading title="Keyboard Shortcuts" description="Master SyncBooks with these keyboard shortcuts" />
      <Separator />

      <div className="grid gap-6 md:grid-cols-2">
        {shortcuts.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-emerald-600" />
                  <CardTitle>{section.category}</CardTitle>
                </div>
                <CardDescription>
                  {section.category === "General" && "Essential shortcuts for everyday use"}
                  {section.category === "Navigation" && "Quickly navigate between pages"}
                  {section.category === "Actions" && "Common actions and operations"}
                  {section.category === "Sales" && "Sales and invoicing shortcuts"}
                  {section.category === "Inventory" && "Product and inventory management"}
                  {section.category === "Settings" && "Configuration and preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-muted-foreground">{item.description}</span>
                      <div className="flex gap-1">
                        {item.keys.map((key, keyIdx) => (
                          <Badge key={keyIdx} variant="outline" className="font-mono text-xs">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-emerald-600" />
            <CardTitle>Pro Tip</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Press <Badge variant="outline" className="mx-1 font-mono">?</Badge> anywhere in the app to see context-specific shortcuts.
            Most shortcuts work with <Badge variant="outline" className="mx-1 font-mono">Cmd</Badge> on Mac instead of <Badge variant="outline" className="mx-1 font-mono">Ctrl</Badge>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
