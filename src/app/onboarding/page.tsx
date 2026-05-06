"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Upload, Sparkles, GraduationCap, Phone, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    centerName: "",
    phone: "",
    language: "en",
    logoUrl: "",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("All set! Welcome aboard.");
    router.push("/");
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md premium-card border-slate-100 shadow-2xl">
        <CardHeader className="pb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
               <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Sparkles size={14} fill="currentColor" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                 Phase {step} of 3
               </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                    s <= step ? "bg-primary" : "bg-slate-100"
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-4xl text-display mb-1">
             Let&apos;s get <span className="text-gradient-joy">Started</span>
          </CardTitle>
          <CardDescription className="font-medium text-slate-500">Creating your digital center profile.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</Label>
                <div className="relative">
                   <Input
                     className="h-14 pl-4 bg-slate-50/50 border-slate-100 focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all rounded-2xl font-bold"
                     placeholder="e.g. S. Meenakshi"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   />
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Center Name</Label>
                <Input
                  className="h-14 pl-4 bg-slate-50/50 border-slate-100 focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all rounded-2xl font-bold"
                  placeholder="e.g. Meena Tuition Academy"
                  value={formData.centerName}
                  onChange={(e) => setFormData({ ...formData, centerName: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Center Branding</Label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl p-8 bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer group">
                   <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-primary" />
                   </div>
                   <span className="text-sm font-bold text-slate-600">Upload Center Logo</span>
                   <span className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">PNG or JPG • Max 2MB</span>
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp for Business</Label>
                <div className="relative">
                   <Phone className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                   <Input
                     className="h-14 pl-12 bg-slate-50/50 border-slate-100 focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all rounded-2xl font-bold"
                     placeholder="+91 98765 43210"
                     value={formData.phone}
                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                   />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preferred Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(val) => setFormData({ ...formData, language: val || "en" })}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-bold">
                    <div className="flex items-center gap-3">
                       <Languages className="h-5 w-5 text-primary" />
                       <SelectValue placeholder="Select language" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100">
                    <SelectItem value="en" className="font-bold py-3">English (Standard)</SelectItem>
                    <SelectItem value="ta" className="font-bold py-3">Tamil (தமிழ்)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] font-bold text-slate-400 mt-2 leading-relaxed px-1">
                  This sets the primary language for your dashboard and the automated WhatsApp alerts sent to parents.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-3 pt-6 pb-8">
          {step > 1 && (
            <Button
              variant="ghost"
              className="flex-1 h-14 rounded-2xl font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              onClick={prevStep}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <Button 
            className={cn(
              "h-14 rounded-2xl font-black shadow-xl transition-all active:scale-95",
              step === 3 ? "flex-[2] bg-primary text-white shadow-primary/20" : "flex-1 bg-slate-900 text-white"
            )}
            onClick={step < 3 ? nextStep : handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : step < 3 ? (
              "Continue"
            ) : (
              "Launch My Center"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
