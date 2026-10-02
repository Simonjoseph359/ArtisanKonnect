import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import ArtisanDashboard from "@/components/dashboard/ArtisanDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const accountType = (session.user as { accountType?: string })?.accountType || "client";

  return ( 
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {accountType === "admin" && <AdminDashboard user={session.user} />}
        {accountType === "artisan" && <ArtisanDashboard user={session.user} />}
        {accountType === "client" && <ClientDashboard user={session.user} />}
      </main>
    </div>
  );
}

