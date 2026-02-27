import { Suspense } from "react";
import { Trash2 } from "lucide-react";
import DeletedItemsClient from "./_components/deleted-items-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DeletedItemsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trash2 className="h-8 w-8" />
          Deleted Items
        </h1>
        <p className="text-muted-foreground mt-2">
          View and restore deleted items (Admin only)
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <DeletedItemsClient />
      </Suspense>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
