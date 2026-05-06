import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, isBefore, subDays } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const tutorId = session.user.id;
    const today = new Date();
    const currentMonthEnd = endOfMonth(today);

    const students = await prisma.student.findMany({
      where: { tutorId },
      include: { batch: true },
    });

    const feeList = students.map((student: any) => {
      let status = "Not set";
      if (student.feeAmount && student.feePaidUpto) {
        if (student.feePaidUpto >= currentMonthEnd) {
          status = "Paid";
        } else if (isBefore(student.feePaidUpto, subDays(today, 30))) {
          status = "Overdue";
        } else {
          status = "Due";
        }
      } else if (student.feeAmount) {
        status = "Due";
      }

      return {
        id: student.id,
        name: student.name,
        batchName: student.batch?.name || "No Batch",
        feeAmount: student.feeAmount,
        feePaidUpto: student.feePaidUpto,
        status,
        parentPhone: student.parentPhone,
      };
    });

    const summary = {
      totalExpected: feeList.reduce((acc: any, curr: any) => acc + (curr.feeAmount || 0), 0),
      totalCollected: feeList
        .filter((s: any) => s.status === "Paid")
        .reduce((acc: any, curr: any) => acc + (curr.feeAmount || 0), 0),
      totalPending: feeList
        .filter((s: any) => s.status !== "Paid")
        .reduce((acc: any, curr: any) => acc + (curr.feeAmount || 0), 0),
    };

    return NextResponse.json({ feeList, summary });
  } catch (error) {
    console.error("GET fees error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { studentId } = await req.json();
    const today = new Date();
    const currentMonthEnd = endOfMonth(today);

    const updatedStudent = await prisma.student.update({
      where: { id: studentId, tutorId: session.user.id },
      data: {
        feePaidUpto: currentMonthEnd,
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("POST fee paid error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
