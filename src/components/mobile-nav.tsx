"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  Users, 
  MoreHorizontal, 
  Settings, 
  Info, 
  CreditCard,
  BarChart3,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "./translation-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { label: t("dashboard"), href: "/", icon: LayoutDashboard },
    { label: t("attendance"), href: "/attendance", icon: CalendarCheck2 },
    { label: t("students"), href: "/students", icon: Users },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-20 glass-effect rounded-[2.5rem] z-50 flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center transition-all duration-500 px-4 h-full group",
              isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"
            )}
          >
            {isActive && (
              <span className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse" />
            )}
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-500",
              isActive ? "bg-primary/10 scale-110 shadow-inner" : "group-hover:bg-slate-50"
            )}>
              <Icon className={cn("w-6 h-6 transition-transform", isActive ? "stroke-[2.5px]" : "stroke-2")} />
            </div>
            <span className={cn(
              "text-[10px] font-black mt-1 transition-all duration-500 tracking-tight",
              isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}

      {/* More Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <div role="button" className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-4 cursor-pointer outline-none group">
             <div className="p-2 rounded-2xl group-hover:bg-slate-50 transition-all">
                <MoreHorizontal className="w-6 h-6" />
             </div>
             <span className="text-[10px] font-black mt-1 opacity-0 group-hover:opacity-100 transition-opacity tracking-tight">More</span>
          </div>
        } />
        <DropdownMenuContent align="end" className="w-64 rounded-[2rem] p-3 border-slate-100 dark:border-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)] mb-6 glass-effect animate-in slide-in-from-bottom-2 duration-300">
          <DropdownMenuItem className="rounded-2xl p-4 font-black text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer" render={
            <Link href="/analytics" className="flex items-center gap-4 w-full">
              <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-purple-100 transition-colors">
                <BarChart3 className="h-5 w-5" />
              </div>
              Insights & Analytics
            </Link>
          } />
          <DropdownMenuItem className="rounded-2xl p-4 font-black text-slate-700 hover:bg-secondary/5 hover:text-secondary transition-colors cursor-pointer" render={
            <Link href="/scores" className="flex items-center gap-4 w-full">
              <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-secondary/10 transition-colors">
                <Star className="h-5 w-5" />
              </div>
              Mark Test Scores
            </Link>
          } />
          <DropdownMenuItem className="rounded-2xl p-4 font-black text-slate-700 hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer" render={
            <Link href="/batches" className="flex items-center gap-4 w-full">
              <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-primary/10 transition-colors">
                <Settings className="h-5 w-5" />
              </div>
              Manage Batches
            </Link>
          } />
          <DropdownMenuItem className="rounded-2xl p-4 font-black text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer" render={
            <Link href="/fees" className="flex items-center gap-4 w-full">
              <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <CreditCard className="h-5 w-5" />
              </div>
              Fee Tracker
            </Link>
          } />
          <DropdownMenuItem className="rounded-2xl p-4 font-black text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer" render={
            <Link href="/more" className="flex items-center gap-4 w-full">
              <div className="p-2 bg-slate-100 rounded-xl">
                <Info className="h-5 w-5" />
              </div>
              Settings
            </Link>
          } />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
