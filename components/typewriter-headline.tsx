"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Segment = {
  text: string;
  className?: string;
};

type TypewriterHeadlineProps = {
  as?: "h1" | "h2";
  className?: string;
  segments: Segment[];
  speedMs?: number;
};

export function TypewriterHeadline({
  as = "h1",
  className,
  segments,
  speedMs = 28,
}: TypewriterHeadlineProps) {
  const [visibleChars, setVisibleChars] = useState(0);
  const totalChars = segments.reduce((sum, segment) => sum + segment.text.length, 0);
  const Component = as;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const intervalId = window.setInterval(() => {
        setVisibleChars((current) => {
          if (current >= totalChars) {
            window.clearInterval(intervalId);
            return current;
          }

          return current + 1;
        });
      }, speedMs);

      return () => window.clearInterval(intervalId);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [speedMs, totalChars]);

  let consumed = 0;

  return (
    <Component className={cn(className, "min-h-[1.2em]")}>
      {segments.map((segment) => {
        const remaining = Math.max(0, visibleChars - consumed);
        const visibleText = segment.text.slice(0, remaining);
        consumed += segment.text.length;

        return (
          <span key={`${segment.text}-${segment.className ?? "default"}`} className={segment.className}>
            {visibleText}
          </span>
        );
      })}
      <span
        aria-hidden="true"
        className={cn(
          "ml-1 inline-block h-[0.9em] w-[0.08em] translate-y-[0.08em] rounded-full bg-current align-baseline",
          visibleChars >= totalChars && "type-caret",
        )}
      />
    </Component>
  );
}
