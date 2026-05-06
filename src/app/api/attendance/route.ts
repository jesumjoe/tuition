import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");
  const batchId = searchParams.get("batchId");

  if (!dateStr || !batchId) {
    return new NextResponse("Missing date or batchId", { status: 400 });
  }

  const date = startOfDay(new Date(dateStr));

  try {
    const attendance = await prisma.attendance.findMany({
      where: {
        date: date,
        student: {
          batchId: batchId,
          tutorId: session.user.id,
        },
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("GET attendance error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { date: dateStr, records } = await req.json(); // records: { studentId, present, note }[]
    const date = startOfDay(new Date(dateStr));

    const transactions = records.map((record: any) =>
      prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId: record.studentId,
            date: date,
          },
        },
        update: {
          present: record.present,
          note: record.note,
        },
        create: {
          studentId: record.studentId,
          date: date,
          present: record.present,
          note: record.note,
        },
      })
    );

    await prisma.$transaction(transactions);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("POST attendance error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
