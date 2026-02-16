"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface IRole {
  _id?: string;
  name?: string;
  displayName?: string;
  description?: string;
  permissions?: Record<string, boolean>;
}

type DisplayRoleProps = {
  initialData: IRole;
};

const DisplayRole = ({ initialData }: DisplayRoleProps) => {
  const enabledPermissions = Object.entries(initialData.permissions || {})
    .filter(([_, value]) => value === true)
    .map(([key]) => key);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{initialData.displayName}</h2>
          <p className="text-sm text-muted-foreground">{initialData.description}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Role Name</h3>
          <p className="text-sm text-muted-foreground">{initialData.name}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Enabled Permissions ({enabledPermissions.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {enabledPermissions.map((permission) => (
              <div key={permission} className="text-sm bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-md">
                {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayRole;
