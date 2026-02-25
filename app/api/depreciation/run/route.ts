import { NextResponse } from "next/server";
import { currentUser } from "@/lib/helpers/session";
import { runMonthlyDepreciation } from "@/lib/helpers/depreciation";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await runMonthlyDepreciation(
      user.organizationId as string,
      user._id as string
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
