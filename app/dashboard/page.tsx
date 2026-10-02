import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const accountType = (session.user as { accountType?: string })?.accountType || "client";

  if (accountType === "admin") {
    redirect("/admin/dashboard");
  } else if (accountType === "artisan") {
    redirect("/artisan/dashboard");
  } else {
    redirect("/client/dashboard");
  }
}