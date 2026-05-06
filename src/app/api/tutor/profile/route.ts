import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const tutor = await prisma.tutor.findUnique({
      where: { id: session.user.id },
      select: { language: true, name: true, centerName: true, logoUrl: true }
    });
    return NextResponse.json(tutor);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}
