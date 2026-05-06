import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const tutorId = session.user.id;
    const today = startOfDay(new Date());

    // Total Students
    const totalStudents = await prisma.student.count({
      where: { tutorId },
    });

    // Present Today
    const presentToday = await prisma.attendance.count({
      where: {
        date: today,
        present: true,
        student: { tutorId },
      },
    });

    // Absent Today
    const absentToday = await prisma.attendance.count({
      where: {
        date: today,
        present: false,
        student: { tutorId },
      },
    });

    // Fees Due (simplified logic for now: students whose feePaidUpto < today)
    // We'll refine this later when fee history is implemented
    const feesDue = await prisma.student.count({
      where: {
        tutorId,
        OR: [
          { feePaidUpto: { lt: today } },
          { feePaidUpto: null }
        ]
      },
    });

    return NextResponse.json({
      totalStudents,
      presentToday,
      absentToday,
      feesDue,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
