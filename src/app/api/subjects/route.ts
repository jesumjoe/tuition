import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get("batchId");

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        ...(batchId ? { batchId } : { batch: { tutorId: session.user.id } }),
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error("GET subjects error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { name, batchId } = await req.json();

    const subject = await prisma.subject.create({
      data: {
        name,
        batchId,
      },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("POST subject error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
