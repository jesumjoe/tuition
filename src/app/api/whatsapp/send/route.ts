import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateDigestMessage, sendWhatsAppMessage } from "@/lib/whatsapp";
import { format, startOfDay } from "date-fns";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { studentId } = await req.json();
    const today = startOfDay(new Date());

    const student = await prisma.student.findUnique({
      where: { id: studentId, tutorId: session.user.id },
      include: {
        tutor: true,
        batch: { include: { subjects: true } },
        attendance: { where: { date: today } },
        testScores: {
          take: 3,
          orderBy: { date: "desc" },
          include: { subject: true }
        }
      }
    });

    if (!student) return new NextResponse("Student not found", { status: 404 });

    const attendanceRecord = student.attendance[0];
    const present = attendanceRecord?.present ?? false;
    
    // In a real app, we'd fetch what was actually taught today. 
    // For now, we'll list the batch's subjects.
    const subjects = student.batch?.subjects.map((s: any) => s.name) || [];
    
    const recentScores = student.testScores.map((ts: any) => ({
      subject: ts.subject.name,
      score: ts.score,
      max: ts.maxScore
    }));

    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/parent/${student.reportToken}`;

    const messageBody = generateDigestMessage({
      studentName: student.name,
      centerName: student.tutor.centerName || "Namma Tuition",
      date: format(today, "dd MMM yyyy"),
      present,
      subjects,
      recentScores,
      magicLink,
      language: student.tutor.language
    });

    const result = await sendWhatsAppMessage(student.parentPhone, messageBody);

    await prisma.digestLog.create({
      data: {
        studentId,
        status: result.success ? "sent" : "failed",
        message: result.success ? null : (typeof result.error === 'string' ? result.error : JSON.stringify(result.error))
      }
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manual WhatsApp trigger error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
