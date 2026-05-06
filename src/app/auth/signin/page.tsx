"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Sparkles, ShieldCheck, Mail, Zap } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      toast.success("Magic link sent! (Demo simulated)");
      setIsLoading(false);
    }, 1000);
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const result = await signIn("credentials", {
        email: "demo@example.com",
        password: "demo",
        redirect: false,
      });
      if (result?.ok) {
        toast.success("Welcome to Namma Tuition!");
        router.push("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 selection:bg-primary/10">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/30 relative">
          <Zap className="h-10 w-10 text-white fill-white relative z-10" />
          <div className="absolute inset-0 bg-white/20 rounded-[2rem] blur-xl" />
        </div>
        <h1 className="text-5xl text-display mb-3">
          Namma <span className="text-gradient-joy">Tuition</span>
        </h1>
        <p className="max-w-xs mx-auto text-slate-500 font-medium leading-relaxed">
          The joyful way to manage your tuition center.
        </p>
      </div>

      <Card className="w-full max-w-md premium-card border-slate-100">
        <CardHeader className="space-y-2 pb-8">
          <CardTitle className="text-3xl font-black text-slate-900 text-center">
            Sign In
          </CardTitle>
          <CardDescription className="text-center font-medium">
            Welcome back, Tutor! Choose how to enter.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Button 
            className="w-full h-14 text-lg font-black bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group" 
            onClick={handleDemoLogin}
            disabled={isDemoLoading || isLoading}
          >
            {isDemoLoading ? (
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-6 w-6 transition-transform group-hover:rotate-12" />
            )}
            Launch Demo Mode
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-6 font-black text-slate-400 tracking-[0.3em]">Direct Access</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Your Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tutor@center.com"
                  required
                  className="h-14 pl-12 bg-slate-50/50 border-slate-100 focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all rounded-2xl font-bold text-slate-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isDemoLoading}
                />
              </div>
            </div>
            <Button 
              className="w-full h-12 font-black bg-slate-900 text-white hover:bg-slate-800 rounded-2xl transition-all shadow-lg shadow-slate-900/10" 
              type="submit" 
              disabled={isLoading || isDemoLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Magic Link
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="pb-10 text-center flex flex-col gap-4">
          <p className="text-[11px] text-slate-400 font-bold px-8 leading-relaxed uppercase tracking-tighter">
            Secure access • No passwords needed • 100% Privacy
          </p>
        </CardFooter>
      </Card>

      <div className="mt-16 flex items-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
         <ShieldCheck className="h-4 w-4" />
         Tutor Verified Security
      </div>
    </div>
  );
}
