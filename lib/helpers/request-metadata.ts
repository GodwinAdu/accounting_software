import { headers } from "next/headers";

export async function getRequestMetadata() {
  const headersList = await headers();
  
  const ipAddress = 
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "unknown";
  
  const userAgent = headersList.get("user-agent") || "unknown";
  
  return { ipAddress, userAgent };
}
