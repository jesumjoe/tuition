"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Batch {
  id: string;
  name: string;
  _count?: { students: number };
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newBatchName, setNewBatchName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await fetch("/api/batches");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBatches(data);
    } catch (error) {
      toast.error("Could not load batches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    if (!newBatchName) return;

    try {
      const res = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBatchName }),
      });

      if (!res.ok) throw new Error("Create failed");
      
      toast.success("Batch created");
      setNewBatchName("");
      setIsDialogOpen(false);
      fetchBatches();
    } catch (error) {
      toast.error("Failed to create batch");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Batches</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button size="sm" />
            }
          >
            <Plus className="mr-2 h-4 w-4" /> New Batch
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Batch</DialogTitle>
              <DialogDescription>
                Add a name for your new tuition batch (e.g., Class 10 Evening).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. NEET 2026 Morning"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateBatch}>Create Batch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading batches...</p>
        ) : batches.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12 border-2 border-dashed rounded-lg">
            No batches created yet.
          </p>
        ) : (
          batches.map((batch) => (
            <Card key={batch.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{batch.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {batch._count?.students || 0} students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">
                  View Students
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
