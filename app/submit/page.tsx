"use client";

import { FormEvent, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
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
    <div className="space-y-10">
      <SectionHeading
        eyebrow="Submit effort"
        title="Capture the work while it is still fresh"
        description="The backend validates the input, stores proof metadata, calculates the score, and records the resulting effort hash with a chain reference."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="bg-white/5">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Activity type</label>
              <div className="grid gap-3 md:grid-cols-3">
                {ACTIVITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-2xl border px-4 py-4 text-left transition ${activityType === option.value ? "border-primary bg-primary/10" : "border-white/10 bg-slate-950/40"}`}
                    onClick={() => setActivityType(option.value)}
                  >
                    <p className="font-semibold text-foreground">{option.label}</p>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">{option.hint}</p>
                  </button>
                ))}
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
                placeholder="Example: Build API endpoint for wallet-authenticated effort submissions"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Upload proof file</label>
              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-3">
                  <UploadCloud className="h-4 w-4 text-primary" />
                  {file ? file.name : "Choose image, video, or document"}
                </span>
                <span className="text-primary">Browse</span>
                <input className="hidden" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
              </label>
            </div>

            <Button className="w-full py-3 text-base" type="submit" disabled={pendingSubmission}>
              {pendingSubmission ? "Submitting..." : "Submit effort"}
            </Button>

            {result ? <p className="text-sm text-emerald-300">{result}</p> : null}
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="bg-white/5">
            <h3 className="text-xl font-semibold text-foreground">Scoring formula</h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Effort Score = Duration x Activity Weight x Consistency Multiplier.
            </p>
            <div className="mt-5 grid gap-3 text-sm text-muted-foreground">
              <p>Coding = 1.0</p>
              <p>Learning = 0.7</p>
              <p>Watching = 0.4</p>
              <p>Consistency adds 10% per streak day up to 50%.</p>
            </div>
          </Card>

          <Card className="bg-white/5">
            <h3 className="text-xl font-semibold text-foreground">Validation guardrails</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <li>Minimum duration is 5 minutes.</li>
              <li>Exact duplicate submissions are rejected.</li>
              <li>Proof hash is required so the record stays auditable.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
