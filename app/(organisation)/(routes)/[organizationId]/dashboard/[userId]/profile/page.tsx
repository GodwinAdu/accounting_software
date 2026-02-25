import { currentUser } from "@/lib/helpers/session";
import { redirect } from "next/navigation";
import Heading from "@/components/commons/Header";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Shield, Calendar, Clock, Edit } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { SecurityCard } from "./_components/security-card";

type Props = Promise<{ organizationId: string; userId: string }>;

export default async function ProfilePage({ params }: { params: Props }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const { organizationId, userId } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="My Profile" description="Manage your personal information and preferences" />
        <Link href={`/${organizationId}/dashboard/${userId}/profile/edit`}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>
      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-emerald-500/20">
              <AvatarImage src={user.imgUrl} alt={user.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-4xl font-bold">
                {user.fullName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-xl font-bold">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={user.isActive ? "default" : "secondary"} className={user.isActive ? "bg-emerald-600" : ""}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
              {user.emailVerified && (
                <Badge variant="outline" className="border-emerald-600 text-emerald-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  Full Name
                </div>
                <p className="font-medium">{user.fullName}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </div>
                <p className="font-medium">{user.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </div>
                <p className="font-medium">{user.phone || "Not provided"}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-2" />
                  Role
                </div>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SecurityCard 
          initialTwoFactorEnabled={user.twoFactorAuthEnabled}
          emailVerified={user.emailVerified}
          organizationId={organizationId}
          userId={userId}
        />

        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Recent account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Last Login
              </div>
              <p className="font-medium">
                {user.lastLogin ? format(new Date(user.lastLogin), "PPpp") : "Never"}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Account Created
              </div>
              <p className="font-medium">
                {user.createdAt ? format(new Date(user.createdAt), "PPP") : "Unknown"}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="h-4 w-4 mr-2" />
                Login Attempts
              </div>
              <p className="font-medium">{user.loginAttempts || 0} failed attempts</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
