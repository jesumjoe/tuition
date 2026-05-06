import { MobileNav } from "@/components/mobile-nav";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Check if tutor has completed onboarding
  const tutor = await prisma.tutor.findUnique({
    where: { id: session.user.id },
  });

  if (!tutor?.name || !tutor?.centerName) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
