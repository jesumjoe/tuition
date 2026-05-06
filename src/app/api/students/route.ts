import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const students = await prisma.student.findMany({
      where: { tutorId: session.user.id },
      include: { batch: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("GET students error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, parentName, parentPhone, batchId, feeAmount } = body;

    if (!name || !parentName || !parentPhone) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const student = await prisma.student.create({
      data: {
        name,
        parentName,
        parentPhone,
        batchId,
        feeAmount: feeAmount ? parseFloat(feeAmount) : null,
        tutorId: session.user.id,
        reportToken: uuidv4(),
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("POST student error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
