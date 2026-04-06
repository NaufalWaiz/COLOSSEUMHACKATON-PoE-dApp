"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, Search, UserRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PersonSummary } from "@/lib/types";

type PeopleSearchProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function PeopleSearch({
  title = "Search people",
  description = "Find teammates by name, username, or email, then open their profile.",
  className,
}: PeopleSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PersonSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/people?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error ?? "Failed to search people.");
        }

        setResults(payload.results ?? []);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <Card className={cn("space-y-4", className)}>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          placeholder="Search people..."
          className="pl-11"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {query.trim().length < 2 ? (
        <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground">
          Type at least 2 characters to start searching.
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching people...
        </div>
      ) : null}

      {!loading && query.trim().length >= 2 && results.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background px-4 py-4 text-sm text-muted-foreground">
          No matching people found.
        </div>
      ) : null}

      {!loading && results.length > 0 ? (
        <div className="space-y-2">
          {results.map((person) => (
            <Link
              key={person.id}
              href={`/profile?identity=${encodeURIComponent(person.id)}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 no-underline transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-sm"
            >
              {person.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={person.imageUrl} alt={person.displayName} className="h-11 w-11 rounded-full border border-border object-cover" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                  <UserRound className="h-4 w-4" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{person.displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{person.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
