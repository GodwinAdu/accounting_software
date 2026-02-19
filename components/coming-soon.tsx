import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  isPro?: boolean;
  isNew?: boolean;
}

export function ComingSoon({ title, description, icon: Icon, features, isPro, isNew }: ComingSoonProps) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {isNew && <Badge className="bg-green-100 text-green-700">NEW</Badge>}
          {isPro && <Badge className="bg-amber-100 text-amber-700">PRO</Badge>}
        </div>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        {features && features.length > 0 && (
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Planned Features:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
