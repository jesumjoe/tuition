import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { 
        id: params.studentId,
        tutorId: session.user.id
      },
      include: { batch: true },
    });

    if (!student) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("GET student error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, parentName, parentPhone, batchId, feeAmount } = body;

    const student = await prisma.student.update({
      where: { 
        id: params.studentId,
        tutorId: session.user.id
      },
      data: {
        name,
        parentName,
        parentPhone,
        batchId,
        feeAmount: feeAmount ? parseFloat(feeAmount) : null,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("PUT student error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { studentId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await prisma.student.delete({
      where: { 
        id: params.studentId,
        tutorId: session.user.id
      },
    });

    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("DELETE student error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
