import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { format } from "date-fns";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { studentId } = await req.json();

    const student = await prisma.student.findUnique({
      where: { id: studentId, tutorId: session.user.id },
      include: { tutor: true },
    });

    if (!student) return new NextResponse("Student not found", { status: 404 });

    const centerName = student.tutor.centerName || "Namma Tuition";
    const amount = student.feeAmount || 0;
    const language = student.tutor.language;

    let messageBody = "";
    if (language === "ta") {
      messageBody = `🙏 *${centerName} — கட்டண நினைவூட்டல்*
மாணவர்: *${student.name}*
இந்த மாதத்திற்கான கல்வி கட்டணம் ₹${amount} நிலுவையில் உள்ளது. தயவுசெய்து விரைவில் செலுத்தவும். 
ஏற்கனவே செலுத்தியிருந்தால், இந்த செய்தியைப் புறக்கணிக்கவும்.
நன்றி!`;
    } else {
      messageBody = `🙏 *${centerName} — Fee Reminder*
Student: *${student.name}*
The tuition fee of ₹${amount} for this month is pending. Please kindly clear the dues at your earliest convenience. 
If already paid, please ignore this message.
Thank you!`;
    }

    const result = await sendWhatsAppMessage(student.parentPhone, messageBody);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp fee reminder error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
