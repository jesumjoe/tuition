"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { demoApi } from "@/lib/demo-api";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  parentName: z.string().min(2, "Parent name must be at least 2 characters"),
  parentPhone: z.string().regex(/^\+91\d{10}$/, "Invalid Indian phone number (+91 followed by 10 digits)"),
  batchId: z.string().optional(),
  feeAmount: z.string().optional(),
});

interface StudentFormProps {
  studentId?: string;
  initialData?: any;
}

export function StudentForm({ studentId, initialData }: StudentFormProps) {
  const router = useRouter();
  const [batches, setBatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      parentName: "",
      parentPhone: "+91",
      batchId: "",
      feeAmount: "",
    },
  });

  useEffect(() => {
    const fetchBatches = async () => {
      const data = await demoApi.getBatches();
      setBatches(data);
    };
    fetchBatches();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success(studentId ? "Records synchronized (Demo Mode)" : "Registration complete (Demo Mode)");
      router.push("/students");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-10 pb-32 max-w-2xl mx-auto px-4 sm:px-0">
      {/* Refined Header */}
      <div className="flex flex-col gap-4">
        <Link href="/students" className="group w-fit">
          <div className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" />
            Registry
          </div>
        </Link>
        
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">
            {studentId ? "Edit Records" : "New Registration"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            Maintain precision in your student database.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="premium-card p-6 space-y-6 bg-white dark:bg-slate-950">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Rahul Sharma" {...field} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Parent Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Amit Sharma" {...field} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">WhatsApp Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+919876543210" {...field} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assigned Batch</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl">
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-950">
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id} className="font-medium p-3">
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="feeAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Monthly Fee (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500" {...field} className="h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="h-14 w-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                {studentId ? "Commit Changes" : "Register Star"}
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
