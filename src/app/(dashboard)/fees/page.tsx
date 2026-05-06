"use client";

import { useEffect, useState } from "react";
import { CreditCard, Search, MessageSquare, Check, Loader2, TrendingDown, Target, Sparkles, Filter, ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface FeeRecord {
  id: string;
  name: string;
  batchName: string;
  feeAmount: number | null;
  feePaidUpto: string | null;
  status: string;
  parentPhone: string;
}

interface Summary {
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
}

export default function FeesPage() {
  const [feeList, setFeeList] = useState<FeeRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await fetch("/api/fees");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFeeList(data.feeList);
      setSummary(data.summary);
    } catch (error) {
      toast.error("Could not load fee data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (studentId: string) => {
    setProcessingId(studentId);
    await new Promise(r => setTimeout(r, 600));
    toast.success("Payment recorded!");
    fetchFees();
    setProcessingId(null);
  };

  const handleSendReminder = async (studentId: string) => {
    setProcessingId(studentId);
    await new Promise(r => setTimeout(r, 800));
    toast.success("WhatsApp reminder sent!");
    setProcessingId(null);
  };

  const filteredList = feeList.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
            <Wallet size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-secondary/80">
            Treasury
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-display mb-2">
          Fee <span className="text-gradient-joy">Tracker</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
          Manage your center&apos;s financial health with ease.
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
         <Card className="premium-card bg-blue-50/50 border-blue-100 group">
            <CardContent className="p-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl group-hover:scale-110 transition-transform">
                     <Target size={24} />
                  </div>
                  <div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected</p>
                     <h3 className="text-2xl font-black text-slate-900">₹{summary?.totalExpected || 0}</h3>
                  </div>
               </div>
            </CardContent>
         </Card>
         <Card className="premium-card bg-emerald-50/50 border-emerald-100 group">
            <CardContent className="p-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-600 text-white rounded-2xl group-hover:scale-110 transition-transform">
                     <Check size={24} />
                  </div>
                  <div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Collected</p>
                     <h3 className="text-2xl font-black text-slate-900">₹{summary?.totalCollected || 0}</h3>
                  </div>
               </div>
            </CardContent>
         </Card>
         <Card className="premium-card bg-rose-50/50 border-rose-100 group">
            <CardContent className="p-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-600 text-white rounded-2xl group-hover:scale-110 transition-transform">
                     <TrendingDown size={24} />
                  </div>
                  <div>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending</p>
                     <h3 className="text-2xl font-black text-slate-900">₹{summary?.totalPending || 0}</h3>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search student marks..."
            className="h-14 pl-12 bg-white border-slate-100 focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all rounded-2xl text-base font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-100 bg-white flex items-center justify-center p-0 shadow-sm hover:bg-slate-50 transition-all">
          <Filter className="h-6 w-6 text-slate-400" />
        </Button>
      </div>

      {/* Fee List */}
      <div className="grid gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 w-full bg-slate-50 animate-pulse rounded-2xl" />
          ))
        ) : filteredList.length === 0 ? (
          <div className="premium-card py-20 text-center bg-slate-50/50 border-dashed border-slate-200">
            <Sparkles className="mx-auto h-12 w-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold text-lg uppercase tracking-widest">All settled!</p>
          </div>
        ) : (
          filteredList.map((record) => (
            <div key={record.id} className="premium-card bg-white border-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6">
                <div className="flex flex-1 items-center gap-5">
                   <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <CreditCard size={28} strokeWidth={1.5} />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900 leading-none">{record.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">{record.batchName}</span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black uppercase text-primary tracking-tighter">₹{record.feeAmount}</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                   <div className="flex flex-col items-end gap-1.5 min-w-[100px]">
                      <Badge 
                        className={cn(
                          "rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-widest",
                          record.status === "Paid" ? "bg-emerald-50 text-emerald-600" : 
                          record.status === "Due" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                        )}
                      >
                         {record.status}
                      </Badge>
                      {record.feePaidUpto && (
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Paid thru {format(new Date(record.feePaidUpto), "MMM yy")}</p>
                      )}
                   </div>

                   <div className="flex items-center gap-2">
                      {record.status !== "Paid" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-12 w-12 rounded-2xl border-slate-100 hover:bg-primary/5 transition-all"
                            onClick={() => handleSendReminder(record.id)}
                            disabled={processingId === record.id}
                          >
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </Button>
                          <Button 
                            className="h-12 px-6 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                            onClick={() => handleMarkAsPaid(record.id)}
                            disabled={processingId === record.id}
                          >
                             {processingId === record.id ? <Loader2 className="h-5 w-5 animate-spin" /> : "Collect"}
                          </Button>
                        </>
                      )}
                      {record.status === "Paid" && (
                        <div className="h-12 px-6 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-emerald-100/50 shadow-inner">
                           Settled <Check className="ml-2 h-4 w-4" />
                        </div>
                      )}
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
