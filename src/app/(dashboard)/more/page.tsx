"use client";

import { signOut, useSession } from "next-auth/react";
import { 
  LogOut, 
  Settings, 
  User, 
  HelpCircle, 
  Languages, 
  Bell, 
  Shield, 
  ChevronRight,
  Globe,
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MorePage() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    toast.success("Logging out...");
    setTimeout(() => {
       window.location.href = "/auth/signin";
    }, 500);
  };

  const menuItems = [
    { icon: User, label: "Profile Settings", description: "Edit center details & logo", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Languages, label: "Language", description: "English / Tamil preferences", color: "text-emerald-600", bg: "bg-emerald-50" },
    { icon: Bell, label: "Notifications", description: "WhatsApp & daily digests", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Shield, label: "Security", description: "Manage account safety", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: Globe, label: "Parent Portal", description: "Link sharing & privacy", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: HelpCircle, label: "Support", description: "Get help from our team", color: "text-slate-600", bg: "bg-slate-50" },
  ];

  return (
    <div className="pb-32 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
            <Settings size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Configuration
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl text-display mb-2">
          Center <span className="text-gradient-joy">Settings</span>
        </h1>
      </div>

      {/* Profile Card */}
      <Card className="premium-card bg-white border-slate-50 mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
               <Avatar className="h-24 w-24 border-4 border-slate-50 shadow-xl transition-transform group-hover:scale-105 duration-500">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-primary text-white text-3xl font-black">
                    {session?.user?.name?.charAt(0) || "T"}
                  </AvatarFallback>
               </Avatar>
               <div className="absolute -bottom-2 -right-2 p-2 bg-secondary text-white rounded-xl shadow-lg border-2 border-white">
                  <Sparkles size={16} fill="currentColor" />
               </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-1">{session?.user?.name || "Demo Tutor"}</h2>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-3">Premium Instructor</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                 <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg px-3 py-1 font-bold">Verified</Badge>
                 <Badge className="bg-primary/10 text-primary border-none rounded-lg px-3 py-1 font-bold">Standard Plan</Badge>
              </div>
            </div>
            <Button 
               variant="outline" 
               className="rounded-2xl h-14 w-14 border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
               onClick={handleLogout}
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Menu Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="premium-card group bg-white border-slate-50 p-5 flex items-center justify-between hover:border-primary/20 transition-all text-left outline-none"
            >
              <div className="flex items-center gap-5">
                <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", item.bg, item.color)}>
                  <Icon className="h-6 w-6 stroke-[2.5px]" />
                </div>
                <div>
                  <p className="font-black text-slate-900 leading-none mb-1 group-hover:text-primary transition-colors">{item.label}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </button>
          );
        })}
      </div>

      <div className="mt-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
           <LayoutDashboard className="h-4 w-4" />
           Namma Tuition v1.0.4
        </div>
        <Button 
           variant="ghost" 
           className="text-rose-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-50 rounded-xl"
           onClick={handleLogout}
        >
           Sign Out Securely
        </Button>
      </div>
    </div>
  );
}
