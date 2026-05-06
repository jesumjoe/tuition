"use client";

import { useEffect, useState, Suspense } from "react";
import { format } from "date-fns";
import { Plus, Save, Loader2, ArrowLeft, Trash2, Star, Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

function ScoresContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId");
  
  const [batches, setBatches] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [testName, setTestName] = useState<string>("");
  const [maxScore, setMaxScore] = useState<string>("100");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  
  const [studentScores, setStudentScores] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      const res = await fetch("/api/batches");
      if (res.ok) {
        const data = await res.json();
        setBatches(data);
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      const fetchSubjects = async () => {
        const res = await fetch(`/api/subjects?batchId=${selectedBatch}`);
        if (res.ok) setSubjects(await res.json());
      };
      
      const fetchStudents = async () => {
        const res = await fetch(`/api/students?batchId=${selectedBatch}`);
        if (res.ok) {
          const data = await res.json();
          const batchStudents = data.filter((s: any) => s.batchId === selectedBatch);
          setStudents(batchStudents);
          
          const scoreMap: Record<string, string> = {};
          batchStudents.forEach((s: any) => scoreMap[s.id] = "");
          setStudentScores(scoreMap);
        }
      };
      
      fetchSubjects();
      fetchStudents();
    }
  }, [selectedBatch]);

  useEffect(() => {
    if (preselectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === preselectedStudentId);
      if (student) {
        setSelectedBatch(student.batchId);
      }
    }
  }, [preselectedStudentId, students]);

  const handleScoreChange = (studentId: string, value: string) => {
    setStudentScores((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = async () => {
    if (!selectedBatch || !selectedSubject || !testName || !maxScore) {
      toast.error("Please fill in all test details");
      return;
    }

    setIsSaving(true);
    try {
      const scores = Object.entries(studentScores)
        .filter(([_, score]) => score !== "")
        .map(([studentId, score]) => ({
          studentId,
          score,
        }));

      if (scores.length === 0) {
        toast.error("No scores entered");
        return;
      }

      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: selectedBatch,
          subjectId: selectedSubject,
          testName,
          maxScore,
          date,
          scores,
        }),
      });

      if (!res.ok) throw new Error("Save failed");
      
      toast.success("Scores saved successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to save scores");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = preselectedStudentId 
    ? students.filter(s => s.id === preselectedStudentId)
    : students;

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="mb-2 -ml-2 rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-4xl text-display">Mark <span className="text-gradient-joy">Progress</span></h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          {preselectedStudentId ? `Entering marks for individual student.` : `Recording achievements for today's learners.`}
        </p>
      </div>

      <Card className="premium-card border-slate-100 overflow-visible">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Target size={20} className="stroke-[2.5px]" />
            <CardTitle className="text-lg font-black uppercase tracking-tight">
              {preselectedStudentId ? "Individual Entry" : "Test Details"}
            </CardTitle>
          </div>
          {preselectedStudentId && (
            <Button variant="ghost" className="text-[10px] font-black uppercase text-slate-400 hover:text-primary transition-colors" onClick={() => router.push("/scores")}>
               Switch to Batch Mode
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Batch</Label>
              <Select value={selectedBatch} onValueChange={(val) => setSelectedBatch(val || "")}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id} className="font-bold py-3">{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</Label>
              <Select value={selectedSubject} onValueChange={(val) => setSelectedSubject(val || "")}>
                <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100">
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id} className="font-bold py-3">{s.name}</SelectItem>
                  ))}
                  <SelectItem value="add-new" className="text-primary font-black py-3">+ Add New Subject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Test Name</Label>
              <Input 
                placeholder="e.g. Unit Test 1" 
                value={testName} 
                onChange={(e) => setTestName(e.target.value)} 
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Marks</Label>
              <Input 
                type="number" 
                value={maxScore} 
                onChange={(e) => setMaxScore(e.target.value)} 
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
              />
            </div>
            <div className="space-y-2.5">
              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</Label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedBatch && filteredStudents.length > 0 && (
        <Card className="premium-card border-slate-100">
          <CardHeader className="pb-4">
             <div className="flex items-center gap-2 text-secondary">
               <Star size={20} fill="currentColor" />
               <CardTitle className="text-lg font-black uppercase tracking-tight">
                  {preselectedStudentId ? "Confirm Marks" : "Student Marks"}
               </CardTitle>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const scoreValue = studentScores[student.id] || "";
                const percentage = scoreValue ? (parseFloat(scoreValue) / parseFloat(maxScore)) * 100 : null;
                
                let colorClass = "text-slate-400";
                let bgClass = "bg-slate-50";
                
                if (percentage !== null) {
                  if (percentage >= 70) {
                    colorClass = "text-emerald-600";
                    bgClass = "bg-emerald-50";
                  } else if (percentage >= 40) {
                    colorClass = "text-amber-600";
                    bgClass = "bg-amber-50";
                  } else {
                    colorClass = "text-rose-600";
                    bgClass = "bg-rose-50";
                  }
                }

                return (
                  <div key={student.id} className="flex items-center justify-between p-5 group transition-colors hover:bg-slate-50/50">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-black text-slate-800 group-hover:text-primary transition-colors">{student.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Student ID: {student.id.split('-')[1] || '001'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24">
                        <Input
                          type="number"
                          placeholder="Marks"
                          className="h-11 rounded-xl border-slate-200 text-center font-black focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                          value={scoreValue}
                          onChange={(e) => handleScoreChange(student.id, e.target.value)}
                        />
                      </div>
                      <div className={cn("w-14 h-11 flex items-center justify-center rounded-xl text-xs font-black transition-all", bgClass, colorClass)}>
                        {percentage !== null ? `${Math.round(percentage)}%` : "—"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedBatch && filteredStudents.length > 0 && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40">
          <Button 
            className="w-full h-14 text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 group bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Sparkles className="mr-2 h-6 w-6 transition-transform group-hover:rotate-12" />}
            {preselectedStudentId ? "Save Individual Score" : "Record All Scores"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ScoresPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScoresContent />
    </Suspense>
  );
}
