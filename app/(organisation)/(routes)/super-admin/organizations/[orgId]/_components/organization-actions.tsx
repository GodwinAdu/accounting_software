"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Settings, Shield, Trash2 } from "lucide-react";
import { updateOrganizationStatus, updateOrganizationPlan, toggleOrganizationModule, deleteOrganization } from "@/lib/actions/super-admin.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OrgActionsProps {
  orgId: string;
  currentStatus: string;
  currentPlan: string;
  enabledModules: string[];
}

const AVAILABLE_MODULES = [
  "invoicing", "expenses", "payroll", "accounting", "tax", 
  "products", "crm", "projects", "budgeting", "ai"
];

const SUBSCRIPTION_PLANS = ["free", "starter", "professional", "enterprise"];

export function OrganizationActions({ orgId, currentStatus, currentPlan, enabledModules }: OrgActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [plan, setPlan] = useState(currentPlan);
  const [modules, setModules] = useState<string[]>(enabledModules);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    const result = await updateOrganizationStatus(orgId, newStatus);
    setLoading(false);
    
    if (result.success) {
      setStatus(newStatus);
      toast.success("Organization status updated");
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  const handlePlanChange = async (newPlan: string) => {
    setLoading(true);
    const result = await updateOrganizationPlan(orgId, newPlan);
    setLoading(false);
    
    if (result.success) {
      setPlan(newPlan);
      toast.success("Subscription plan updated");
    } else {
      toast.error(result.error || "Failed to update plan");
    }
  };

  const handleModuleToggle = async (module: string, enabled: boolean) => {
    setLoading(true);
    const result = await toggleOrganizationModule(orgId, module, enabled);
    setLoading(false);
    
    if (result.success) {
      if (enabled) {
        setModules([...modules, module]);
      } else {
        setModules(modules.filter(m => m !== module));
      }
      toast.success(`Module ${enabled ? "enabled" : "disabled"}`);
    } else {
      toast.error(result.error || "Failed to toggle module");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this organization? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    const result = await deleteOrganization(orgId);
    setLoading(false);
    
    if (result.success) {
      toast.success("Organization deleted");
      router.push("/super-admin/organizations");
    } else {
      toast.error(result.error || "Failed to delete organization");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Organization Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={handleStatusChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Subscription Plan</Label>
            <Select value={plan} onValueChange={handlePlanChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBSCRIPTION_PLANS.map(p => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Organization
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Module Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {AVAILABLE_MODULES.map(module => (
            <div key={module} className="flex items-center justify-between">
              <Label className="capitalize">{module}</Label>
              <Switch
                checked={modules.includes(module)}
                onCheckedChange={(checked) => handleModuleToggle(module, checked)}
                disabled={loading}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
