"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, X, Loader2, Save, Users, Sparkles, ChevronRight, LayoutGrid, Zap, CheckCircle2, XCircle, CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { demoApi } from "@/lib/demo-api";

interface Student {
  id: string;
  name: string;
}

export default function AttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBatches = async () => {
      const data = await demoApi.getBatches();
      setBatches(data);
      if (data.length > 0) setSelectedBatch(data[0].id);
    };
    fetchBatches();
  }, []);

  const fetchStudentsAndAttendance = useCallback(async () => {
    if (!selectedBatch) return;
    setIsLoading(true);
    try {
      const studentsData = await demoApi.getStudents();
      const filteredStudents = studentsData.filter((s: any) => s.batchId === selectedBatch);
      setStudents(filteredStudents as any);

      const attendanceData = await demoApi.getAttendance(date.toISOString(), selectedBatch);
      
      const attMap: Record<string, boolean> = {};
      attendanceData.forEach((rec: any) => {
        attMap[rec.studentId] = rec.present;
      });
      
      const finalMap: Record<string, boolean> = {};
      filteredStudents.forEach((s: any) => {
        finalMap[s.id] = attMap[s.id] ?? true;
      });
      
      setAttendance(finalMap);
    } catch (error) {
      toast.error("Failed to load attendance data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedBatch, date]);

  useEffect(() => {
    fetchStudentsAndAttendance();
  }, [selectedBatch, date, fetchStudentsAndAttendance]);

  const toggleAttendance = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const markAll = (present: boolean) => {
    const newAtt: Record<string, boolean> = {};
    students.forEach((s) => {
      newAtt[s.id] = present;
    });
    setAttendance(newAtt);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await demoApi.saveAttendance({});
      toast.success("Attendance synced successfully (Demo Mode)");
    } catch (error) {
      toast.error("Failed to sync attendance");
    } finally {
      setIsSaving(false);
    }
  };

  const presentCount = Object.values(attendance).filter((v) => v).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-10 pb-40 max-w-6xl mx-auto px-4 sm:px-0">
      {/* Refined Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-2">
            <CalendarCheck2 className="h-4 w-4" />
            Daily Tracking
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
            Attendance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            Mark daily presence for your batches.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Popover>
            <PopoverTrigger render={
              <Button
                variant="outline"
                className="h-12 justify-start text-left font-bold rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm min-w-[200px]"
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                {format(date, "PPP")}
              </Button>
            } />
            <PopoverContent className="w-auto p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-2xl" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>

          <Select value={selectedBatch} onValueChange={(val) => setSelectedBatch(val || "")}>
            <SelectTrigger className="h-12 font-bold rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm min-w-[200px]">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <LayoutGrid className="h-5 w-5 text-primary" />
                <SelectValue placeholder="Select batch" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-slate-200 dark:border-zinc-800 shadow-2xl">
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id} className="font-bold p-3">
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="h-10 rounded-xl border-emerald-100 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-100 transition-all text-sm"
          onClick={() => markAll(true)}
        >
          Mark All Present
        </Button>
        <Button 
          variant="outline" 
          className="h-10 rounded-xl border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold hover:bg-rose-100 transition-all text-sm"
          onClick={() => markAll(false)}
        >
          Mark All Absent
        </Button>
      </div>

      {/* Student List */}
      <div className="grid gap-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-xl" />
          ))
        ) : students.length === 0 ? (
          <div className="premium-card py-20 text-center bg-slate-50/50 dark:bg-slate-900/50 border-dashed">
            <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold text-xl">No students in this batch</p>
          </div>
        ) : (
          students.map((student) => {
            const isPresent = attendance[student.id];
            return (
              <div 
                key={student.id} 
                className={cn(
                  "premium-card cursor-pointer p-4 flex items-center justify-between group transition-all duration-200",
                  isPresent ? "bg-white dark:bg-slate-950" : "bg-slate-50/50 dark:bg-slate-900/50"
                )}
                onClick={() => toggleAttendance(student.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                    isPresent ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  )}>
                    {isPresent ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-lg leading-none">{student.name}</span>
                </div>

                <div className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  isPresent ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}>
                   {isPresent ? "Present" : "Absent"}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Sync Bar */}
      {students.length > 0 && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-slate-400">Present</span>
                <span className="text-xl font-bold text-emerald-500 leading-none">{presentCount}</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-slate-400">Absent</span>
                <span className="text-xl font-bold text-rose-500 leading-none">{absentCount}</span>
              </div>
            </div>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="h-12 px-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold shadow-lg active:scale-95 transition-all"
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Sync Records"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
