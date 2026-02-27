import { NextRequest, NextResponse } from "next/server";
import { checkModuleAccess } from "@/lib/helpers/module-access";
import { currentUser } from "@/lib/helpers/session";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user?.organizationId) {
      return NextResponse.json({ hasAccess: false }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module");

    if (!module) {
      return NextResponse.json({ hasAccess: false }, { status: 400 });
    }

    const hasAccess = await checkModuleAccess(String(user.organizationId), module);
    return NextResponse.json({ hasAccess });
  } catch (error) {
    return NextResponse.json({ hasAccess: false }, { status: 500 });
  }
}
