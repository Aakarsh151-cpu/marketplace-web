"use client";
import { Activity, IndianRupee, AlertCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  // Hardcoding the mock data for the initial layout test. 
  // Next step is wiring this to your new /api/admin/metrics endpoint!
  const mockTransactions = [
    { id: "ORD-092", category: "AC_REPAIR", status: "LOCKED", amount: 1600, tech: "Raju K." },
    { id: "ORD-091", category: "PLUMBING", status: "DISPUTED", amount: 850, tech: "Vikram S." },
    { id: "ORD-090", category: "ELECTRICAL", status: "RELEASED", amount: 400, tech: "Amit P." }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">SkillGrid HQ</h1>
          <p className="text-zinc-500 font-medium mt-1">Live Operational Metrics & Escrow Management</p>
        </div>

        {/* Top-Level Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Total GMV</CardTitle>
              <IndianRupee className="w-4 h-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-zinc-900">₹84,500</div>
              <p className="text-xs text-emerald-500 font-bold mt-1">+14% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-wider">In Escrow</CardTitle>
              <Activity className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-zinc-900">₹12,400</div>
              <p className="text-xs text-zinc-500 font-medium mt-1">Pending AI Verification</p>
            </CardContent>
          </Card>

          <Card className="border-red-100 shadow-sm bg-red-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-red-600 uppercase tracking-wider">Disputes</CardTitle>
              <AlertCircle className="w-4 h-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-red-700">2</div>
              <p className="text-xs text-red-600 font-bold mt-1">Requires manual review</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Active Techs</CardTitle>
              <Users className="w-4 h-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-zinc-900">18</div>
              <p className="text-xs text-zinc-500 font-medium mt-1">Currently on-shift</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Transaction Ledger */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Live Escrow Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] font-bold">Order ID</TableHead>
                  <TableHead className="font-bold">Category</TableHead>
                  <TableHead className="font-bold">Technician</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">{tx.id}</TableCell>
                    <TableCell className="text-zinc-600 font-medium">{tx.category.replace('_', ' ')}</TableCell>
                    <TableCell className="text-zinc-600">{tx.tech}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'LOCKED' ? 'default' : tx.status === 'DISPUTED' ? 'destructive' : 'secondary'} className="uppercase text-[10px] tracking-widest font-bold">
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-black">₹{tx.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}