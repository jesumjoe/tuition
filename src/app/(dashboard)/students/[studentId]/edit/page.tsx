"use client";

import { useEffect, useState } from "react";
import { StudentForm } from "@/components/students/student-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditStudentPage({
  params,
}: {
  params: { studentId: string };
}) {
  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${params.studentId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        // Map data to form format
        setStudent({
          name: data.name,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
          batchId: data.batchId || "",
          feeAmount: data.feeAmount?.toString() || "",
        });
      } catch (error) {
        toast.error("Could not load student data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [params.studentId]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  return <StudentForm studentId={params.studentId} initialData={student} />;
}
