import { useRouter } from "next/navigation";
import { ShieldAlert, Zap, Hammer } from "lucide-react";
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
  category: string;
  urgency: "LOW" | "MEDIUM" | "HIGH";
  summary_for_technician: string;
};

export function DispatchCard({
  workOrder,
  price = 1,
}: {
  workOrder: WorkOrder;
  price?: number;
}) {
  const router = useRouter();

  const urgencyVariant =
    workOrder.urgency === "HIGH" ? "destructive" : "secondary";

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Card className="w-full border-zinc-200 shadow-xl transition-all hover:shadow-2xl animate-in slide-in-from-bottom-4">
      <CardHeader className="bg-zinc-50 border-b border-zinc-100 pb-4">
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

        <CardTitle className="text-xl font-black text-zinc-900 mt-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Autonomous Dispatch Secured
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
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

        <Separator className="my-4" />

        <div className="flex gap-4">
          <ShieldAlert className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm text-zinc-500 uppercase tracking-wider font-bold mb-1">
              Escrow Protection
            </p>
            <p className="text-zinc-700 text-sm font-medium">
              Funds are held securely. The technician cannot upcharge without AI
              photo verification.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-zinc-50 pt-6">
        <Button
          onClick={handleCheckout}
          size="lg"
          aria-label="Initialize escrow payment"
          className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black text-md shadow-lg"
        >
          Initialize Escrow (₹{price})
        </Button>
      </CardFooter>
    </Card>
  );
}