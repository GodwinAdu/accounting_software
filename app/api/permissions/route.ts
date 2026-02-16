import { NextResponse } from "next/server";
import { getUserPermissions } from "@/lib/helpers/check-permission";

export async function GET() {
  try {
    const permissions = await getUserPermissions();
    
    return NextResponse.json({ permissions });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json({ permissions: {} }, { status: 500 });
  }
}
