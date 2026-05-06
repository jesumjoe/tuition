import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const batchId = searchParams.get("batchId");

  try {
    const scores = await prisma.testScore.findMany({
      where: {
        student: {
          tutorId: session.user.id,
          ...(studentId ? { id: studentId } : {}),
          ...(batchId ? { batchId: batchId } : {}),
        },
      },
      include: { subject: true, student: true },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(scores);
  } catch (error) {
    console.error("GET scores error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { 
      batchId, 
      subjectId, 
      testName, 
      date, 
      maxScore, 
      scores // { studentId, score, note }[]
    } = await req.json();

    const transactions = scores.map((s: any) =>
      prisma.testScore.create({
        data: {
          studentId: s.studentId,
          subjectId: subjectId,
          testName: testName,
          date: new Date(date),
          score: parseFloat(s.score),
          maxScore: parseFloat(maxScore),
          note: s.note,
        },
      })
    );

    await prisma.$transaction(transactions);

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("POST scores error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
