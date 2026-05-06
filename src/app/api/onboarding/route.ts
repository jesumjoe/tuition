import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, centerName, phone, language, logoUrl } = await req.json();

    const updatedTutor = await prisma.tutor.update({
      where: { id: session.user.id },
      data: {
        name,
        centerName,
        phone,
        language,
        logoUrl,
      },
    });

    return NextResponse.json(updatedTutor);
  } catch (error) {
    console.error("Onboarding error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
