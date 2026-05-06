"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreVertical, Edit, Trash2, User, Phone, GraduationCap, ChevronRight, Filter, Zap, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { demoApi } from "@/lib/demo-api";

interface Student {
  id: string;
  name: string;
  parentName: string;
  parentPhone: string;
  batch?: { name: string };
  feeAmount: number | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await demoApi.getStudents();
      setStudents(data as any);
    } catch (error) {
      toast.error("Could not load students.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    toast.success("Student removed");
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Users size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-primary/80">
              Registry
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-display mb-2">
            Center <span className="text-gradient-joy">Registry</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
            Manage your bright learners and their journey.
          </p>
        </div>
        
        <Link href="/students/new">
          <Button className="h-14 px-8 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/20 active:scale-95 transition-all group">
            <Plus className="mr-2 h-6 w-6 transition-transform group-hover:rotate-90" /> New Learner
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name or parent..."
            className="h-14 pl-12 bg-white border-slate-100 focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all rounded-2xl text-base font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-100 bg-white flex items-center justify-center p-0 shadow-sm hover:bg-slate-50 transition-all">
          <Filter className="h-6 w-6 text-slate-400" />
        </Button>
      </div>

      {/* Student Grid */}
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 w-full bg-slate-50 animate-pulse rounded-[2rem]" />
          ))
        ) : filteredStudents.length === 0 ? (
          <div className="premium-card py-24 text-center bg-slate-50/30 border-dashed border-slate-200">
            <Zap className="mx-auto h-16 w-16 text-slate-200 mb-4" />
            <p className="text-slate-400 font-black text-xl uppercase tracking-widest">No learners found</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="premium-card group bg-white border-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                <Link href={`/students/${student.id}`} className="flex flex-1 items-center gap-5">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                     <User className="h-8 w-8 stroke-[1.5px]" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-slate-900 leading-none group-hover:text-primary transition-colors">
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-slate-100 text-slate-600 border-none font-bold rounded-lg text-[10px] px-2 py-0.5">
                        {student.batch?.name || "Unassigned"}
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                         ₹{student.feeAmount || 0} / month
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center justify-between sm:justify-end gap-8 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                  <div className="space-y-1 text-right hidden md:block">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">WhatsApp</p>
                    <p className="text-sm font-bold text-slate-800 leading-none">{student.parentPhone}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-slate-50">
                          <MoreVertical className="h-6 w-6 text-slate-400" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-56 rounded-[2rem] p-3 border-slate-100 shadow-2xl glass-effect">
                        <DropdownMenuItem className="rounded-2xl p-4 font-black text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer" render={
                          <Link href={`/students/${student.id}/edit`} className="flex items-center gap-3 w-full">
                            <Edit className="h-5 w-5" /> Edit Profile
                          </Link>
                        } />
                        <DropdownMenuItem 
                          className="rounded-2xl p-4 font-black text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="mr-3 h-5 w-5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href={`/students/${student.id}`}>
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
