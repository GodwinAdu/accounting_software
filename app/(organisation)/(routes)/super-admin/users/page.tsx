import { checkSuperAdmin } from "@/lib/helpers/check-super-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { connectToDB } from "@/lib/connection/mongoose";
import User from "@/lib/models/user.model";
import Organization from "@/lib/models/organization.model";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Mail, Building2, Shield } from "lucide-react";

export default async function UsersPage() {
  await checkSuperAdmin();
  await connectToDB();

  const users = await User.find({ del_flag: false })
    .populate("organizationId", "name")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return (
    <div className="flex-1 space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Users</h1>
        <p className="text-muted-foreground">View and manage all users across organizations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: any) => (
                <TableRow key={user._id.toString()}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {user.organizationId?.name || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.status === "active" ? "bg-emerald-600" : "bg-gray-500"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
