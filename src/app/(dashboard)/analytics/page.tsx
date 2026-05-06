"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { ArrowLeft, Sparkles, TrendingUp, Users, Target, Search, User, ChevronRight, BarChart3, Layout } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { demoApi } from "@/lib/demo-api";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"overall" | "individual">("overall");
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const studentList = await demoApi.getStudents();
    setStudents(studentList);

    if (viewMode === "overall") {
      const data = await demoApi.getPerformance();
      setPerformanceData(data);
    } else if (selectedStudentId) {
      const data = await demoApi.getIndividualPerformance(selectedStudentId);
      setPerformanceData(data);
    } else if (studentList.length > 0) {
      // Auto-select first student in individual mode
      setSelectedStudentId(studentList[0].id);
    }
    setIsLoading(false);
  }, [viewMode, selectedStudentId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea'];

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
           <Button variant="ghost" size="icon" onClick={() => router.back()} className="mb-2 -ml-2 rounded-full">
              <ArrowLeft className="h-5 w-5" />
           </Button>
           <h1 className="text-4xl text-display">Center <span className="text-gradient-joy">Insights</span></h1>
           <p className="text-slate-500 font-medium">Visualizing progress and performance.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-full sm:w-auto">
           <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <BarChart3 size={18} />
           </div>
           <Select value={viewMode} onValueChange={(val: any) => setViewMode(val)}>
              <SelectTrigger className="border-none shadow-none focus:ring-0 font-black text-slate-700 min-w-[200px]">
                 <SelectValue placeholder="Select View" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100">
                 <SelectItem value="overall" className="font-bold py-3 text-sm">📊 Overall Center</SelectItem>
                 <SelectItem value="individual" className="font-bold py-3 text-sm">👤 Individual Insights</SelectItem>
              </SelectContent>
           </Select>
        </div>
      </div>

      {viewMode === "overall" ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Overall Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Card className="premium-card bg-primary/5 border-primary/10">
                <CardContent className="p-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary text-white rounded-2xl">
                         <Target size={24} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg Accuracy</p>
                         <h3 className="text-2xl font-black text-slate-900">84.2%</h3>
                      </div>
                   </div>
                </CardContent>
             </Card>
             <Card className="premium-card bg-secondary/5 border-secondary/10">
                <CardContent className="p-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-secondary text-white rounded-2xl">
                         <TrendingUp size={24} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Growth</p>
                         <h3 className="text-2xl font-black text-slate-900">+12%</h3>
                      </div>
                   </div>
                </CardContent>
             </Card>
             <Card className="premium-card bg-emerald-50 border-emerald-100">
                <CardContent className="p-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                         <Users size={24} />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Batches</p>
                         <h3 className="text-2xl font-black text-slate-900">02</h3>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>

          <Card className="premium-card">
            <CardHeader>
               <CardTitle className="text-xl font-black">Performance Trend</CardTitle>
               <CardDescription className="font-medium text-xs uppercase tracking-widest">Center-wide average score tracking</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] w-full mt-6">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                     <defs>
                        <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                        dy={10}
                     />
                     <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}}
                        domain={[0, 100]}
                     />
                     <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 800, color: '#2563eb' }}
                     />
                     <Area 
                        type="monotone" 
                        dataKey="average" 
                        stroke="#2563eb" 
                        strokeWidth={4} 
                        fillOpacity={1} 
                        fill="url(#colorOverall)"
                        dot={{ r: 6, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
           {/* Student List Sidebar */}
           <div className="lg:col-span-4 space-y-4">
              <div className="premium-card bg-white p-4 h-[600px] flex flex-col">
                 <div className="mb-4 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                       placeholder="Search student..." 
                       className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50/50 text-sm font-bold"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                    {filteredStudents.map(s => (
                       <button
                          key={s.id}
                          onClick={() => setSelectedStudentId(s.id)}
                          className={cn(
                             "w-full p-4 rounded-2xl flex items-center justify-between group transition-all text-left outline-none border border-transparent",
                             selectedStudentId === s.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
                          )}
                       >
                          <div className="flex items-center gap-3">
                             <div className={cn(
                                "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                                selectedStudentId === s.id ? "bg-white/20" : "bg-white shadow-sm text-slate-400"
                             )}>
                                <User size={20} />
                             </div>
                             <div>
                                <p className="font-black text-sm leading-none mb-1">{s.name}</p>
                                <p className={cn(
                                   "text-[10px] font-bold uppercase tracking-tighter",
                                   selectedStudentId === s.id ? "text-white/60" : "text-slate-400"
                                )}>{s.batch?.name || "Unassigned"}</p>
                             </div>
                          </div>
                          <ChevronRight size={16} className={cn(
                             "transition-transform",
                             selectedStudentId === s.id ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-2"
                          )} />
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Individual Performance Content */}
           <div className="lg:col-span-8 space-y-6">
              {selectedStudent ? (
                 <>
                    <div className="flex items-center gap-4 mb-2">
                       <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                          <Sparkles size={32} />
                       </div>
                       <div>
                          <h2 className="text-3xl font-black text-slate-900">{selectedStudent.name}</h2>
                          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Individual Mastery Report</p>
                       </div>
                    </div>

                    <Card className="premium-card">
                       <CardHeader>
                          <CardTitle className="text-xl font-black">Performance Journey</CardTitle>
                          <CardDescription className="text-xs font-bold uppercase text-slate-400">Monthly improvement tracking</CardDescription>
                       </CardHeader>
                       <CardContent className="h-[300px] w-full mt-6">
                          {isLoading ? (
                             <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
                          ) : (
                             <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                   <defs>
                                      <linearGradient id="colorIndividual" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                         <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                      </linearGradient>
                                   </defs>
                                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} domain={[0, 100]} />
                                   <Tooltip content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                         return (
                                            <div className="bg-white p-3 rounded-xl shadow-2xl border border-slate-100">
                                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                                               <p className="text-base font-black text-secondary">{Math.round(payload[0].value as number)}%</p>
                                               <p className="text-[10px] font-bold text-slate-500 mt-0.5">Raw: {payload[0].payload.raw}</p>
                                            </div>
                                         );
                                      }
                                      return null;
                                   }} />
                                   <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorIndividual)" dot={{ r: 5, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
                                </AreaChart>
                             </ResponsiveContainer>
                          )}
                       </CardContent>
                    </Card>

                    <div className="grid sm:grid-cols-2 gap-4">
                       <Card className="premium-card p-6 bg-slate-900 text-white">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Primary Goal</h4>
                          <p className="text-lg font-bold italic leading-relaxed">
                             &quot;Targeting 95% in the upcoming Final Mock Examination.&quot;
                          </p>
                       </Card>
                       <Card className="premium-card p-6 bg-secondary text-white">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">Subject Focus</h4>
                          <div className="flex items-center justify-between">
                             <div>
                                <p className="text-2xl font-black leading-none">Science</p>
                                <p className="text-xs font-bold text-white/80 mt-1">Recently improved by +12%</p>
                             </div>
                             <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
                                <TrendingUp size={24} />
                             </div>
                          </div>
                       </Card>
                    </div>
                 </>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300">
                    <User size={64} strokeWidth={1} className="mb-4" />
                    <p className="text-lg font-black uppercase tracking-widest">Select a Learner</p>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
