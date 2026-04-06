import { Activity } from "@/lib/types";
import { cn } from "@/lib/utils";

const TOTAL_WEEKS = 20;
const TOTAL_DAYS = TOTAL_WEEKS * 7;
const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function startOfDay(value: Date) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function intensityClass(value: number) {
  if (value >= 4) return "bg-[#216e39]";
  if (value >= 3) return "bg-[#30a14e]";
  if (value >= 2) return "bg-[#40c463]";
  if (value >= 1) return "bg-[#9be9a8]";
  return "bg-[#ebedf0]";
}

export function ActivityHeatmap({ activities }: { activities: Activity[] }) {
  const counts = new Map<string, number>();

  for (const activity of activities) {
    const key = formatDayKey(startOfDay(new Date(activity.createdAt)));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const today = startOfDay(new Date());
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - today.getDay()));
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (TOTAL_DAYS - 1));

  const cells = Array.from({ length: TOTAL_DAYS }).map((_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const key = formatDayKey(date);
    return {
      key,
      date,
      isFuture: date.getTime() > today.getTime(),
      count: counts.get(key) ?? 0,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  });

  const monthLabels = Array.from({ length: TOTAL_WEEKS }).map((_, weekIndex) => {
    const firstCell = cells[weekIndex * 7];
    const previousCell = weekIndex > 0 ? cells[(weekIndex - 1) * 7] : null;

    if (!firstCell) {
      return "";
    }

    if (!previousCell || firstCell.date.getMonth() !== previousCell.date.getMonth()) {
      return firstCell.date.toLocaleDateString("en-US", { month: "short" });
    }

    return "";
  });

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((step) => (
          <span key={step} className={cn("h-3.5 w-3.5 rounded-[4px] border border-black/5", intensityClass(step))} />
        ))}
        <span>More</span>
      </div>

      <div className="w-full overflow-x-auto pb-1">
        <div className="min-w-max rounded-[28px] border border-border bg-white px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="inline-flex gap-4">
            <div className="grid grid-rows-7 gap-2 pt-8 text-[11px] font-medium text-muted-foreground">
              {WEEKDAY_LABELS.map((label, index) => (
                <span key={`${label}-${index}`} className="flex h-4 items-center justify-end pr-1">
                  {label}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-20 gap-2 text-[11px] font-medium text-muted-foreground">
                {monthLabels.map((label, index) => (
                  <span key={`${label}-${index}`} className="min-w-[16px]">
                    {label}
                  </span>
                ))}
              </div>

              <div className="grid auto-cols-max grid-flow-col grid-rows-7 gap-2">
                {cells.map((cell) => (
                  <div
                    key={cell.key}
                    title={`${cell.count} activities on ${cell.label}`}
                    className={cn(
                      "h-4 w-4 rounded-[4px] border border-black/5 transition-transform duration-150 hover:scale-110",
                      cell.isFuture ? "border-transparent bg-transparent" : intensityClass(cell.count),
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
