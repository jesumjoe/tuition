"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/components/translation-provider";
import { demoApi } from "@/lib/demo-api";
import { cn } from "@/lib/utils";

const { 
  Users, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  ClipboardCheck, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  Star
} = LucideIcons;

interface Stats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  feesDue: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await demoApi.getStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: t("totalStudents") || "Total Students",
      value: stats?.totalStudents ?? 0,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      trend: "Students",
      subtitle: "Active learners"
    },
    {
      title: t("presentToday") || "Present",
      value: stats?.presentToday ?? 0,
      icon: CheckCircle,
      color: "bg-emerald-100 text-emerald-600",
      trend: "Today",
      subtitle: "In class now"
    },
    {
      title: t("feesDue") || "Fees Due",
      value: stats?.feesDue ?? 0,
      icon: CreditCard,
      color: "bg-amber-100 text-amber-600",
      trend: "Pending",
      subtitle: "To collect"
    },
    {
      title: "Avg Score",
      value: "84%",
      icon: Star,
      color: "bg-purple-100 text-purple-600",
      trend: "Steady",
      subtitle: "Last 7 days"
    },
  ];

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Welcome Section */}
      <div className="mb-10 mt-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-secondary/10 rounded-lg text-secondary">
            <Sparkles size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-secondary/80">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-display mb-2">
          Vanakkam, <span className="text-gradient-joy">Demo Tutor!</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-md leading-relaxed">
          Ready to make a difference today? Here&apos;s a quick look at your center&apos;s heartbeat.
        </p>
      </div>

      {/* Daily Focus Card */}
      <div className="mb-10 premium-card p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Daily Focus</h3>
              <p className="text-slate-600 text-sm">Attendance hasn&apos;t been marked for the Morning Batch yet.</p>
            </div>
          </div>
          <Link 
            href="/attendance"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl active:scale-95"
          >
            Mark Now
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="premium-card p-5 group">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300", stat.color)}>
                   {Icon && <Icon size={20} />}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  {stat.trend}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{stat.title}</p>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
                  {isLoading ? (
                    <div className="h-8 w-12 bg-slate-100 animate-pulse rounded-md" />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black text-slate-900 mb-4 px-1">Quick Tasks</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/attendance" className="group">
              <div className="premium-card p-5 h-full flex flex-col justify-between hover:border-primary/30">
                <div className="p-3 bg-slate-900 text-white w-fit rounded-2xl mb-4 group-hover:bg-primary transition-colors">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors">Attendance</h3>
                  <p className="text-sm text-slate-500">Track who&apos;s here today</p>
                </div>
              </div>
            </Link>
            
            <Link href="/scores" className="group">
              <div className="premium-card p-5 h-full flex flex-col justify-between hover:border-secondary/30">
                <div className="p-3 bg-slate-100 text-slate-900 w-fit rounded-2xl mb-4 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Star size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-secondary transition-colors">Test Scores</h3>
                  <p className="text-sm text-slate-500">Mark student progress</p>
                </div>
              </div>
            </Link>

            <Link href="/analytics" className="group">
              <div className="premium-card p-5 h-full flex flex-col justify-between hover:border-purple-300">
                <div className="p-3 bg-purple-100 text-purple-600 w-fit rounded-2xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <LucideIcons.BarChart3 size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-purple-600 transition-colors">Analytics</h3>
                  <p className="text-sm text-slate-500">View performance trends</p>
                </div>
              </div>
            </Link>

            <Link href="/students/new" className="group">
              <div className="premium-card p-5 h-full flex flex-col justify-between hover:border-emerald-300">
                <div className="p-3 bg-emerald-50 text-emerald-600 w-fit rounded-2xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">New Student</h3>
                  <p className="text-sm text-slate-500">Add a new learner</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 mb-4 px-1">Community Echo</h2>
          <div className="premium-card p-6 bg-secondary/5 border-secondary/10 relative overflow-hidden h-[240px]">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <p className="text-secondary font-black text-sm uppercase tracking-widest mb-2">Tutor Tip</p>
              <p className="text-slate-800 font-bold text-lg leading-relaxed italic">
                &quot;The secret of getting ahead is getting started.&quot;
              </p>
              <div className="mt-auto pt-4 border-t border-secondary/10">
                <p className="text-xs text-slate-500 font-medium">— Mark Twain</p>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 text-secondary/10 rotate-12">
              <Sparkles size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
