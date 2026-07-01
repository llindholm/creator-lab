"use client";

import { useState } from "react";

type SendRecommendation = {
  status?: "Ready" | "Almost Ready" | "Needs Work";
  summary?: string;
  confidence?: "High" | "Medium" | "Low";
};

type ExactEdit = {
  location?: string;
  current?: string;
  suggested?: string;
  reason?: string;
};

type RecommendedBeforeSending = {
  title?: string;
  whyItMatters?: string;
  whatToDo?: string;
  estimatedImpact?: "High" | "Medium" | "Low";
  estimatedEffort?: "High" | "Medium" | "Low";
};

type Diagnosis = {
  promotionsTab?: string;
  spamFolder?: string;
  primaryInbox?: string;
  readerEngagement?: string;
  conversionQuality?: string;
};

type AnalysisResult = {
  sendRecommendation?: SendRecommendation;
  promotionsRisk?: number;
  spamRisk?: number;
  primaryFriendlyScore?: number;
  engagementScore?: number;
  clickPotentialScore?: number;
  replyPotentialScore?: number;
  summary?: string;
  diagnosis?: Diagnosis;
  mainIssues?: string[];
  recommendedBeforeSending?: RecommendedBeforeSending[];
  recommendedFixes?: string[];
  topRiskFactors?: string[];
  exactEdits?: ExactEdit[];
};

function ScoreCard({
  title,
  score,
  helper,
}: {
  title: string;
  score?: number;
  helper?: string;
}) {
  const value = score ?? 0;
  const isInverse =
    title === "Promotions Signals" || title === "Spam Signals";

  const displayValue = isInverse ? 100 - value : value;

  const label =
    displayValue >= 85
      ? "Excellent"
      : displayValue >= 70
        ? "Strong"
        : displayValue >= 50
          ? "Moderate"
          : "Needs Attention";

  let barColor = "bg-red-500";

  if (displayValue >= 85) {
    barColor = "bg-green-500";
  } else if (displayValue >= 70) {
    barColor = "bg-emerald-400";
  } else if (displayValue >= 50) {
    barColor = "bg-amber-400";
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {score ?? "—"}
          </p>
        </div>

        {typeof score === "number" && (
          <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
            {label}
          </span>
        )}
      </div>

      {helper && <p className="mt-2 text-xs text-zinc-500">{helper}</p>}

      {typeof score === "number" && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${displayValue}%` }}
          />
        </div>
      )}
    </div>
  );
}

function ReportCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <h3 className="mb-3 font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function SendRecommendationCard({
  recommendation,
}: {
  recommendation?: SendRecommendation;
}) {
  const status = recommendation?.status || "Almost Ready";

  const statusLabel =
    status === "Ready"
      ? "Ready to Send"
      : status === "Needs Work"
        ? "Needs Work"
        : "Almost Ready";

  const statusIcon =
    status === "Ready" ? "✓" : status === "Needs Work" ? "!" : "→";

  return (
    <div className="rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-300/15 to-zinc-950 p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 text-xl font-bold text-zinc-950">
          {statusIcon}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
            Send Recommendation
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white">
            {statusLabel}
          </h3>
        </div>
      </div>

      {recommendation?.confidence && (
        <p className="mb-4 inline-flex rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
          Confidence: {recommendation.confidence}
        </p>
      )}

      {recommendation?.summary && (
        <p className="leading-relaxed text-zinc-300">
          {recommendation.summary}
        </p>
      )}
    </div>
  );
}

export default function EmailLabPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    try {
      setLoading(true);
      setResult(null);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, previewText, body }),
      });

      const data = await response.json();

      if (data.error) {
        setResult({ summary: String(data.error || "Something went wrong.") });
        return;
      }

      try {
        if (typeof data.result === "object") {
          setResult(data.result);
        } else {
          const cleaned = String(data.result || "")
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          setResult(JSON.parse(cleaned));
        }
      } catch {
        setResult({ summary: String(data.result || "Unable to parse analysis.") });
      }
    } catch (error) {
      console.error(error);
      setResult({ summary: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-amber-300">
            To Living Free
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Email Lab
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Analyze emails for Gmail Promotions-tab risk, engagement strength,
            and Primary-friendly improvements.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Subject line
              </label>
              <input
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-300"
                placeholder="Paste subject line..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Preview text / second subject line
              </label>
              <input
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-300"
                placeholder="Optional preview text..."
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Email body / HTML
              </label>
              <textarea
                className="h-[520px] w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-300"
                placeholder="Paste email text or raw HTML..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !subject || !body}
              className="mt-5 w-full rounded-xl bg-amber-300 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Email"}
            </button>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-white">Email Review</h2>
              <p className="mt-1 text-sm text-zinc-500">
                A strategist-style review of what matters before you send.
              </p>
            </div>

            {result ? (
              <div className="space-y-4">
                <SendRecommendationCard recommendation={result.sendRecommendation} />

                <hr className="border-zinc-800" />

                <ReportCard title="Overall Assessment">
                  <p className="leading-relaxed text-zinc-300">
                    {result.summary || "No summary returned."}
                  </p>
                </ReportCard>

                <hr className="border-zinc-800" />

                <ReportCard title="Recommended Before Sending">
                  <div className="space-y-3">
                    {result.recommendedBeforeSending?.length ? (
                      result.recommendedBeforeSending.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                        >
                          <div className="mb-3 flex items-start justify-between gap-3">
                            <p className="font-medium text-white">
                              {item.title || `Recommendation ${index + 1}`}
                            </p>

                            <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                              <span className="text-xs text-zinc-500">
                                Expected Benefit
                              </span>

                              <span className="rounded-full border border-amber-300/40 px-2 py-1 text-xs text-amber-300">
                                {item.estimatedImpact || "Medium"}
                              </span>

                              <span className="text-xs text-zinc-500">
                                Time to Complete
                              </span>

                              <span className="rounded-full border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                                {item.estimatedEffort === "Low"
                                  ? "~2 min"
                                  : item.estimatedEffort === "Medium"
                                    ? "~10 min"
                                    : "~30+ min"}
                              </span>
                            </div>
                          </div>

                          {item.whyItMatters && (
                            <div className="mb-3">
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                Why it matters
                              </p>
                              <p className="text-sm text-zinc-300">{item.whyItMatters}</p>
                            </div>
                          )}

                          {item.whatToDo && (
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                What to do
                              </p>
                              <p className="text-sm text-zinc-300">{item.whatToDo}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No major changes recommended before sending.
                      </p>
                    )}
                  </div>
                </ReportCard>

                <hr className="border-zinc-800" />

                {result.diagnosis && (
                  <ReportCard title="Why I Think This">
                    <div className="space-y-3 text-sm text-zinc-300">
                      {result.diagnosis.promotionsTab && (
                        <p>
                          <span className="font-semibold text-amber-300">Promotions:</span>{" "}
                          {result.diagnosis.promotionsTab}
                        </p>
                      )}

                      {result.diagnosis.spamFolder && (
                        <p>
                          <span className="font-semibold text-amber-300">Spam:</span>{" "}
                          {result.diagnosis.spamFolder}
                        </p>
                      )}

                      {result.diagnosis.primaryInbox && (
                        <p>
                          <span className="font-semibold text-amber-300">Primary:</span>{" "}
                          {result.diagnosis.primaryInbox}
                        </p>
                      )}

                      {result.diagnosis.readerEngagement && (
                        <p>
                          <span className="font-semibold text-amber-300">Engagement:</span>{" "}
                          {result.diagnosis.readerEngagement}
                        </p>
                      )}

                      {result.diagnosis.conversionQuality && (
                        <p>
                          <span className="font-semibold text-amber-300">Conversion:</span>{" "}
                          {result.diagnosis.conversionQuality}
                        </p>
                      )}
                    </div>
                  </ReportCard>
                )}

                <hr className="border-zinc-800" />

                <ReportCard title="Performance Snapshot">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ScoreCard
                      title="Promotions Signals"
                      score={result.promotionsRisk}
                      helper="Lower is better"
                    />
                    <ScoreCard
                      title="Spam Signals"
                      score={result.spamRisk}
                      helper="Lower is better"
                    />
                    <ScoreCard
                      title="Primary Fit"
                      score={result.primaryFriendlyScore}
                      helper="Higher is better"
                    />
                    <ScoreCard title="Engagement" score={result.engagementScore} />
                    <ScoreCard title="Click Potential" score={result.clickPotentialScore} />
                    <ScoreCard title="Reply Potential" score={result.replyPotentialScore} />
                  </div>
                </ReportCard>

                <hr className="border-zinc-800" />

                <ReportCard title="Biggest Opportunities">
                  <ul className="space-y-2 text-zinc-300">
                    {(result.topRiskFactors || result.mainIssues || []).map((risk, index) => (
                      <li
                        key={index}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
                      >
                        {risk}
                      </li>
                    ))}
                  </ul>
                </ReportCard>

                <hr className="border-zinc-800" />

                <ReportCard title="Exact Copy Improvements">
                  <div className="space-y-4">
                    {result.exactEdits?.length ? (
                      result.exactEdits.map((edit, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-zinc-700 bg-zinc-900/60 p-3"
                        >
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-300">
                            {edit.location || `Edit ${index + 1}`}
                          </p>

                          {edit.current && (
                            <div className="mb-3">
                              <p className="mb-1 text-xs text-zinc-500">Current</p>
                              <p className="text-sm text-red-300">{edit.current}</p>
                            </div>
                          )}

                          {edit.suggested && (
                            <div className="mb-3">
                              <p className="mb-1 text-xs text-zinc-500">Suggested</p>
                              <p className="text-sm text-green-300">{edit.suggested}</p>
                            </div>
                          )}

                          {edit.reason && (
                            <p className="text-xs leading-relaxed text-zinc-500">
                              {edit.reason}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-zinc-500">No exact edits returned.</p>
                    )}
                  </div>
                </ReportCard>

                <hr className="border-zinc-800" />

                <ReportCard title="Final Thoughts">
                  <p className="leading-relaxed text-zinc-400">
                    No analyzer—including Email Lab—can predict exactly where Gmail will place an email.

                    These recommendations focus on the factors you can control before sending and are designed to maximize your chances of reaching the Primary inbox while preserving your authentic voice.
                  </p>
                </ReportCard>
              </div>
            ) : (
              <div className="flex h-[650px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-8 text-center text-zinc-500">
                Your analysis will appear here after you run an email.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}