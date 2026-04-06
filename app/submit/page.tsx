"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, Clock3, FileBadge2, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ACTIVITY_OPTIONS } from "@/lib/constants";
import { useAppStore } from "@/store/app-store";

export default function SubmitPage() {
  const { pendingSubmission, setPendingSubmission } = useAppStore();
  const [activityType, setActivityType] = useState<(typeof ACTIVITY_OPTIONS)[number]["value"]>("coding");
  const [duration, setDuration] = useState(60);
  const [description, setDescription] = useState("");
  const [proofCid, setProofCid] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedActivity = useMemo(
    () => ACTIVITY_OPTIONS.find((option) => option.value === activityType),
    [activityType],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingSubmission(true);
    setResult(null);
    setError(null);

    try {
      let finalProof = proofCid.trim();

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload proof file.");
        }

        const uploadPayload = await uploadResponse.json();
        finalProof = uploadPayload.cid;
        setProofCid(uploadPayload.cid);
      }

      const response = await fetch("/api/effort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityType, duration, description, proofIpfs: finalProof }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to submit effort.");
      }

      setResult(`Success. Score +${payload.activity.score}, hash ${payload.activity.effortHash.slice(0, 16)}...`);
      setDescription("");
      setFile(null);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unknown error.");
    } finally {
      setPendingSubmission(false);
    }
  }

  return (
    <div className="space-y-8 pb-2">
      <Card className="relative overflow-hidden border-none bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_24%),linear-gradient(145deg,#0f172a,#111827_42%,#1e293b)] p-0 text-white shadow-[0_28px_72px_rgba(15,23,42,0.22)] selection:bg-sky-400/30 selection:text-white">
        <div className="absolute -left-12 top-8 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl submit-glow" />
        <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl submit-glow" />

        <div className="relative grid gap-6 p-7 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-100">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Submit workflow
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/80">Submit</p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)] md:text-5xl">
                Add a new work entry
              </h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-200 md:text-base">
                Keep the logging loop fast, but make the surface feel intentional. Describe the work, attach proof, and let the backend turn it into readable signal.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-50 backdrop-blur">
                <Clock3 className="h-4 w-4 text-sky-300" />
                {duration} minute session
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-50 backdrop-blur">
                <FileBadge2 className="h-4 w-4 text-sky-300" />
                {selectedActivity?.label ?? "Coding"}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-50 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-sky-300" />
                Proof-aware scoring
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/12 bg-white/[0.12] p-5 backdrop-blur submit-card-drift">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-200/85">Selected mode</p>
              <p className="mt-3 text-3xl font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.18)]">{selectedActivity?.label ?? "Coding"}</p>
              <p className="mt-2 text-sm leading-7 text-slate-200">{selectedActivity?.hint}</p>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-200/85">Submission preview</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/12 bg-white/[0.07] px-4 py-3 text-sm text-slate-100">
                  {description.trim() || "Describe the work clearly so the activity timeline stays useful later."}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/12 bg-white/[0.07] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200/80">Proof</p>
                    <p className="mt-2 text-sm text-white">{file?.name ?? (proofCid.trim() || "Not attached yet")}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-white/[0.07] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200/80">State</p>
                    <p className="mt-2 text-sm text-white">{pendingSubmission ? "Submitting..." : "Ready to submit"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[30px] border-none bg-white/92 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Activity type</label>
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Choose one</span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {ACTIVITY_OPTIONS.map((option) => {
                  const active = activityType === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`group rounded-[24px] border px-4 py-4 text-left transition ${
                        active
                          ? "border-primary bg-[linear-gradient(180deg,rgba(9,105,218,0.1),rgba(255,255,255,0.95))] shadow-[0_14px_34px_rgba(9,105,218,0.12)]"
                          : "border-border bg-background hover:-translate-y-0.5 hover:bg-muted hover:shadow-sm"
                      }`}
                      onClick={() => setActivityType(option.value)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-foreground">{option.label}</p>
                          <p className="mt-2 text-xs leading-6 text-muted-foreground">{option.hint}</p>
                        </div>
                        {active ? <CheckCircle2 className="h-4 w-4 text-primary" /> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
                <Input
                  min={5}
                  type="number"
                  value={duration}
                  onChange={(event) => setDuration(Number(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Proof CID / hash</label>
                <Input
                  placeholder="poe_... or ipfs://..."
                  value={proofCid}
                  onChange={(event) => setProofCid(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Example: Shipped onboarding refinement, connected profile search, and polished the dashboard heatmap layout"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Upload proof file</label>
              <label className="group flex cursor-pointer items-center justify-between rounded-[24px] border border-dashed border-border bg-[linear-gradient(180deg,#ffffff,#f8fafc)] px-4 py-5 text-sm text-muted-foreground transition hover:border-primary/50 hover:shadow-sm">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm transition group-hover:scale-105">
                    <UploadCloud className="h-4 w-4" />
                  </span>
                  <span>{file ? file.name : "Choose image, video, or document"}</span>
                </span>
                <span className="font-semibold text-primary">Browse</span>
                <input className="hidden" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
              </label>
            </div>

            <Button className="w-full rounded-xl py-3 text-base shadow-[0_12px_28px_rgba(15,23,42,0.12)]" type="submit" disabled={pendingSubmission}>
              {pendingSubmission ? "Submitting..." : "Save entry"}
            </Button>

            {result ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{result}</p> : null}
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          </form>
        </Card>

        <div className="grid gap-5">
          <Card className="rounded-[30px] border-none bg-white/92 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scoring formula</p>
                <h3 className="mt-1 text-2xl font-semibold text-foreground">How one entry becomes signal</h3>
              </div>

              <div className="grid gap-3">
                {[
                  "Effort Score = Duration x Activity Weight x Consistency Multiplier",
                  "Coding = 1.0, Learning = 0.7, Watching = 0.4",
                  "Consistency adds 10% per streak day up to 50%",
                ].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-border bg-background px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Rule 0{index + 1}</p>
                    <p className="mt-2 text-sm leading-7 text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="rounded-[30px] border-none bg-[linear-gradient(160deg,#0f172a,#172554)] text-white shadow-[0_24px_64px_rgba(15,23,42,0.18)]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">Guardrails</p>
              <h3 className="text-2xl font-semibold">Keep submissions clean and reviewable.</h3>
              <div className="space-y-3 text-sm leading-7 text-slate-300">
                <p>Minimum duration is 5 minutes.</p>
                <p>Exact duplicate submissions are rejected.</p>
                <p>Proof hash is required so the record stays auditable.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
