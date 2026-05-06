import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_WHATSAPP_FROM;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppMessage(to: string, body: string) {
  if (!client || !from) {
    console.warn("Twilio not configured. Message would have been:", body);
    return { success: false, error: "Twilio not configured" };
  }

  try {
    const message = await client.messages.create({
      body,
      from: from.startsWith("whatsapp:") ? from : `whatsapp:${from}`,
      to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
    });
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("WhatsApp Send Error:", error);
    return { success: false, error };
  }
}

export function generateDigestMessage({
  studentName,
  centerName,
  date,
  present,
  subjects,
  recentScores,
  magicLink,
  language = "en",
}: {
  studentName: string;
  centerName: string;
  date: string;
  present: boolean;
  subjects: string[];
  recentScores: { subject: string; score: number; max: number }[];
  magicLink: string;
  language: string;
}) {
  if (language === "ta") {
    return `📚 *${centerName} — தினசரி அறிக்கை*
மாணவர்: *${studentName}*
தேதி: ${date}

✅ வருகை: ${present ? "வந்தார்" : "வரவில்லை"}

📖 இன்று படித்தவை: ${subjects.join(", ") || "N/A"}

${recentScores.length > 0 ? `📝 சமீபத்திய மதிப்பெண்கள்:\n${recentScores.map(s => `• ${s.subject}: ${s.score}/${s.max}`).join("\n")}` : ""}

👉 முழு அறிக்கை: ${magicLink}

_Reply to this message to send a note to your tutor_`;
  }

  return `📚 *${centerName} — Daily Report*
Student: *${studentName}*
Date: ${date}

✅ Attendance: ${present ? "Present" : "❌ Absent"}

📖 Subjects today: ${subjects.join(", ") || "N/A"}

${recentScores.length > 0 ? `📝 Recent scores:\n${recentScores.map(s => `• ${s.subject}: ${s.score}/${s.max}`).join("\n")}` : ""}

👉 Full report: ${magicLink}

_Reply to this message to send a note to your tutor_`;
}
