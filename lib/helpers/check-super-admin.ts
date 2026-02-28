"use server";

import { currentUser } from "./session";
import { redirect } from "next/navigation";

export async function checkSuperAdmin() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  if (user.role !== "super_admin") {
    redirect("/unauthorized");
  }
  
  return user;
}
