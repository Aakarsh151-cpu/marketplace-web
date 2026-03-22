"use client";

import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Zap,
  Hammer,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Receipt,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type WorkOrder = {
  id: string;
  category: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  summary_for_technician: string;

  estimated_labor: number;
  estimated_parts: number;
  bill_of_materials: string[];

  escrow_status?: "PENDING" | "LOCKED" | "RELEASED" | "DISPUTED";
};

export function DispatchCommandCenter({ workOrder }: { workOrder: WorkOrder }) {
  const router = useRouter();

  const totalCost =
    (workOrder.estimated_labor || 0) +
    (workOrder.estimated_parts || 0);

  const urgencyVariant =
    workOrder.urgency === "HIGH" ? "destructive" : "secondary";

  const isLocked = workOrder.escrow_status === "LOCKED";

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Card className="w-full border-zinc-200 shadow-2xl transition-all hover:shadow-3xl animate-in slide-in-from-bottom-4">

      {/* ================= HEADER ================= */}
      <CardHeader
        className={`pb-6 ${
          isLocked
            ? "bg-slate-900 text-white"
            : "bg-zinc-50 border-b border-zinc-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <Badge className="bg-white text-zinc-900 border-zinc-300 font-bold uppercase tracking-wider">
            {workOrder?.category?.replace("_", " ") ?? "Unknown"}
          </Badge>

          <Badge
            variant={urgencyVariant}
            className="font-black tracking-widest uppercase"
          >
            {workOrder.urgency} PRIORITY
          </Badge>
        </div>

        <CardTitle className="text-xl font-black mt-4 flex items-center gap-2">
          {isLocked ? (
            <>
              <Lock className="w-5 h-5 text-emerald-400" />
              Escrow Secured
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-yellow-500" />
              Autonomous Dispatch Ready
            </>
          )}
        </CardTitle>

        {isLocked && (
          <p className="text-slate-400 text-sm mt-1">
            Funds secured. Awaiting AI verification.
          </p>
        )}
      </CardHeader>

      {/* ================= CONTENT ================= */}
      <CardContent className="pt-6 space-y-6">

        {/* 🧠 AI SUMMARY */}
        <div className="flex gap-4">
          <Hammer className="w-6 h-6 text-zinc-400 shrink-0" />
          <div>
            <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold mb-1">
              AI Diagnostic Summary
            </p>
            <p className="text-zinc-900 font-medium leading-relaxed">
              {workOrder.summary_for_technician}
            </p>
          </div>
        </div>

        <Separator />

        {/* 💰 COST BREAKDOWN */}
        <div>
          <h4 className="text-sm text-zinc-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            AI Bill of Materials
          </h4>

          <div className="space-y-2 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
            {workOrder.bill_of_materials?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm font-medium text-zinc-800"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                  {item}
                </span>
              </div>
            ))}

            <Separator className="my-2" />

            <div className="flex justify-between text-sm font-bold">
              <span>Labor</span>
              <span>₹{workOrder.estimated_labor}</span>
            </div>

            <div className="flex justify-between text-sm font-bold">
              <span>Parts</span>
              <span>₹{workOrder.estimated_parts}</span>
            </div>

            <div className="flex justify-between text-md font-black text-zinc-900 mt-2">
              <span>Total</span>
              <span>₹{totalCost}</span>
            </div>
          </div>
        </div>

        {/* 🔐 SECURITY */}
        <div
          className={`flex gap-3 p-4 rounded-lg ${
            isLocked
              ? "bg-emerald-50 border border-emerald-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          {isLocked ? (
            <ShieldAlert className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          )}

          <p className="text-xs font-semibold leading-relaxed">
            {isLocked
              ? "Escrow locked. Technician cannot change price without AI verification."
              : "Secure escrow ensures no hidden charges. AI enforces pricing integrity."}
          </p>
        </div>
      </CardContent>

      {/* ================= FOOTER ================= */}
      <CardFooter className="bg-zinc-50 pt-6">
        {!isLocked ? (
          <Button
            onClick={handleCheckout}
            size="lg"
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black shadow-lg"
          >
            Initialize Escrow (₹{totalCost})
          </Button>
        ) : (
          <Button
            disabled
            size="lg"
            className="w-full bg-emerald-600 text-white font-black"
          >
            Escrow Locked ✅
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}