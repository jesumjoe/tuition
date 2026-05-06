import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const batches = await prisma.batch.findMany({
      where: { tutorId: session.user.id },
      include: { 
        _count: {
          select: { students: true }
        }
      },
    });

    return NextResponse.json(batches);
  } catch (error) {
    console.error("GET batches error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const batch = await prisma.batch.create({
      data: {
        name,
        tutorId: session.user.id,
      },
    });

    return NextResponse.json(batch);
  } catch (error) {
    console.error("POST batch error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
