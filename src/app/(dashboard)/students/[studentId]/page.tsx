"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Edit, 
  MessageSquare, 
  Copy, 
  Calendar, 
  TrendingUp, 
  CreditCard,
  Loader2,
  Plus,
  Target,
  Sparkles,
  Phone,
  User
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { demoApi } from "@/lib/demo-api";
import { cn } from "@/lib/utils";

export default function StudentProfilePage({
  params,
}: {
  params: { studentId: string };
}) {
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [performance, setPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const s = await demoApi.getStudentById(params.studentId);
      if (!s) {
        toast.error("Student not found");
        router.push("/students");
        return;
      }
      setStudent(s);
      const perf = await demoApi.getIndividualPerformance(params.studentId);
      setPerformance(perf);
      setIsLoading(false);
    };
    fetchData();
  }, [params.studentId, router]);

  const copyMagicLink = () => {
    const link = `${window.location.origin}/parent/${student.reportToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Magic link copied!");
  };

  const handleSendWhatsApp = async () => {
    setIsSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Progress report sent via WhatsApp!");
    setIsSending(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <Button variant="ghost" size="icon" onClick={() => router.push("/students")} className="-ml-2 rounded-full">
              <ArrowLeft className="h-5 w-5" />
           </Button>
           <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="rounded-xl border-slate-200 font-bold"
                onClick={() => router.push(`/students/${student.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button 
                className="rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold"
                onClick={handleSendWhatsApp}
                disabled={isSending}
              >
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                WhatsApp
              </Button>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
           <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary relative">
              <User size={48} className="stroke-[1.5px]" />
              <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-xl shadow-lg border border-slate-100">
                 <Sparkles size={16} className="text-secondary" />
              </div>
           </div>
           <div>
              <h1 className="text-4xl text-display mb-1">{student.name}</h1>
              <div className="flex flex-wrap gap-2 items-center mt-2">
                 <Badge className="bg-primary/10 text-primary border-none font-bold rounded-lg px-3 py-1">
                    {student.batch?.name}
                 </Badge>
                 <Badge variant="outline" className="rounded-lg px-3 py-1 border-slate-200 text-slate-500 font-bold">
                    ID: {student.id.split('-')[1]}
                 </Badge>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <Card className="premium-card p-5">
            <div className="p-2 bg-blue-50 text-blue-600 w-fit rounded-xl mb-3">
               <Calendar size={18} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
            <h3 className="text-2xl font-black text-slate-900">92%</h3>
         </Card>
         <Card className="premium-card p-5">
            <div className="p-2 bg-emerald-50 text-emerald-600 w-fit rounded-xl mb-3">
               <Target size={18} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Marks</p>
            <h3 className="text-2xl font-black text-slate-900">88%</h3>
         </Card>
         <Card className="premium-card p-5 col-span-2 sm:col-span-1">
            <div className="p-2 bg-amber-50 text-amber-600 w-fit rounded-xl mb-3">
               <CreditCard size={18} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Status</p>
            <div className="flex items-center gap-2">
               <h3 className="text-2xl font-black text-slate-900">Paid</h3>
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
         </Card>
         <Card className="premium-card p-5 hidden md:block">
            <div className="p-2 bg-purple-50 text-purple-600 w-fit rounded-xl mb-3">
               <TrendingUp size={18} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</p>
            <h3 className="text-2xl font-black text-slate-900">#04</h3>
         </Card>
      </div>

      {/* Performance Chart */}
      <Card className="premium-card mb-8">
         <CardHeader className="flex flex-row items-center justify-between pb-0">
            <div>
               <CardTitle className="text-xl font-black">Growth Journey</CardTitle>
               <CardDescription className="font-medium text-xs">Test-by-test performance analysis</CardDescription>
            </div>
            <Button 
               size="sm" 
               className="rounded-xl bg-secondary hover:bg-secondary/90 text-white font-black text-xs h-10 px-4"
               onClick={() => router.push(`/scores?studentId=${student.id}`)}
            >
               <Plus className="mr-1.5 h-4 w-4 stroke-[3px]" /> Add Score
            </Button>
         </CardHeader>
         <CardContent className="h-[300px] w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={performance}>
                  <defs>
                     <linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                     dataKey="name" 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                     dy={10}
                  />
                  <YAxis 
                     axisLine={false} 
                     tickLine={false} 
                     tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                     domain={[0, 100]}
                  />
                  <Tooltip 
                     content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                           return (
                              <div className="bg-white p-3 rounded-xl shadow-2xl border border-slate-100">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                                 <p className="text-base font-black text-primary">{Math.round(payload[0].value as number)}%</p>
                                 <p className="text-[10px] font-bold text-slate-500 mt-0.5">Marks: {payload[0].payload.raw}</p>
                              </div>
                           );
                        }
                        return null;
                     }}
                  />
                  <Area 
                     type="monotone" 
                     dataKey="score" 
                     stroke="#2563eb" 
                     strokeWidth={3} 
                     fillOpacity={1} 
                     fill="url(#colorStudent)"
                     dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                  />
               </AreaChart>
            </ResponsiveContainer>
         </CardContent>
      </Card>

      {/* Parent Contact */}
      <Card className="premium-card p-8 bg-slate-900 text-white relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl">
                     <Phone size={20} className="text-secondary" />
                  </div>
                  <h3 className="text-xl font-black">Parent Contact</h3>
               </div>
               <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Parent Name</p>
                  <p className="text-lg font-bold">{student.parentName}</p>
               </div>
               <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">WhatsApp Number</p>
                  <p className="text-lg font-bold">{student.parentPhone}</p>
               </div>
            </div>
            
            <div className="flex flex-col gap-3">
               <Button 
                  className="bg-secondary hover:bg-secondary/90 text-white font-black h-12 rounded-2xl px-8"
                  onClick={copyMagicLink}
               >
                  <Copy className="mr-2 h-4 w-4" /> Copy Magic Link
               </Button>
               <p className="text-[10px] text-slate-500 text-center font-bold uppercase tracking-widest">
                  Secure Access for Parents
               </p>
            </div>
         </div>
         <div className="absolute -right-20 -top-20 text-white/5 rotate-45">
            <MessageSquare size={300} />
         </div>
      </Card>
    </div>
  );
}
