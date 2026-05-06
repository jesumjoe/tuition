import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp, CalendarDays } from "lucide-react";
import Image from "next/image";

export default async function ParentPortalPage({
  params,
}: {
  params: { reportToken: string };
}) {
  const student = await prisma.student.findUnique({
    where: { reportToken: params.reportToken },
    include: {
      tutor: true,
      batch: true,
      attendance: {
        where: { date: { gte: subDays(new Date(), 30) } },
        orderBy: { date: "desc" },
      },
      testScores: {
        where: { date: { gte: subDays(new Date(), 30) } },
        include: { subject: true },
        orderBy: { date: "desc" },
      },
    },
  });

  if (!student) notFound();

  const totalDays = student.attendance.length;
  const presentDays = student.attendance.filter((a: any) => a.present).length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b px-4 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          {student.tutor.logoUrl && (
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
              <Image src={student.tutor.logoUrl} alt="Logo" fill className="object-cover" />
            </div>
          )}
          <div>
            <h1 className="font-bold text-lg leading-tight">{student.tutor.centerName}</h1>
            <p className="text-xs text-muted-foreground">Student Report for <span className="text-primary font-semibold">{student.name}</span></p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-4">
        {/* Attendance Summary */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Last 30 Days Attendance
              </CardTitle>
              <Badge variant={attendanceRate >= 80 ? "default" : "destructive"}>
                {attendanceRate}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 h-2 rounded-full bg-gray-100 overflow-hidden mb-4">
               <div className="bg-primary h-full" style={{ width: `${attendanceRate}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 rounded-lg py-2 border border-green-100">
                <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                <p className="text-[10px] uppercase font-bold text-green-700">Present</p>
              </div>
              <div className="bg-red-50 rounded-lg py-2 border border-red-100">
                <p className="text-2xl font-bold text-red-600">{totalDays - presentDays}</p>
                <p className="text-[10px] uppercase font-bold text-red-700">Absent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Test Scores */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recent Test Scores
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {student.testScores.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground italic">
                No test records in the last 30 days.
              </p>
            ) : (
              <div className="divide-y">
                {student.testScores.map((score: any) => {
                  const percentage = (score.score / score.maxScore) * 100;
                  return (
                    <div key={score.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm">{score.subject.name}</p>
                        <p className="text-[10px] text-muted-foreground">{score.testName} • {format(score.date, "dd MMM")}</p>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "font-black text-lg",
                          percentage >= 70 ? "text-green-600" : percentage >= 40 ? "text-amber-600" : "text-red-600"
                        )}>
                          {score.score}/{score.maxScore}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground">{Math.round(percentage)}%</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Powered by Namma Tuition
          </p>
        </div>
      </main>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
