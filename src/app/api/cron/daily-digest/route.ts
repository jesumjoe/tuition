import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateDigestMessage, sendWhatsAppMessage } from "@/lib/whatsapp";
import { format, startOfDay } from "date-fns";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const today = startOfDay(new Date());

    // 1. Fetch all students who had attendance marked today
    const students = await prisma.student.findMany({
      where: {
        attendance: {
          some: { date: today }
        }
      },
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

    let sentCount = 0;
    let failCount = 0;

    for (const student of students) {
      const attendanceRecord = student.attendance[0];
      const present = attendanceRecord?.present ?? false;
      const subjects = student.batch?.subjects.map((s: any) => s.name) || [];
      const recentScores = student.testScores.map((ts: any) => ({
        subject: ts.subject.name,
        score: ts.score,
        max: ts.maxScore
      }));

      const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/parent/${student.reportToken}`;

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
          studentId: student.id,
          status: result.success ? "sent" : "failed",
          message: result.success ? null : (typeof result.error === 'string' ? result.error : JSON.stringify(result.error))
        }
      });

      if (result.success) sentCount++;
      else failCount++;
    }

    return NextResponse.json({ 
      success: true, 
      processed: students.length,
      sent: sentCount,
      failed: failCount
    });
  } catch (error) {
    console.error("Cron Digest Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
