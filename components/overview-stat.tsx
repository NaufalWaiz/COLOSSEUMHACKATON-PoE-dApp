import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export function OverviewStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-4 top-4 rounded-full bg-muted p-2 text-muted-foreground">
        <ArrowUpRight className="h-4 w-4" />
      </div>
      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
      <p className="mt-6 text-4xl font-semibold text-foreground">{value}</p>
      <p className="mt-4 text-sm text-muted-foreground">{detail}</p>
    </Card>
  );
}
