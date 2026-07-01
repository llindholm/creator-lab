"use client";

import { useState } from "react";

export default function GrowthLabPage() {
    const [platform, setPlatform] = useState("");
    const [postContent, setPostContent] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    async function handleAnalyze() {
        try {
            setLoading(true);
            setResult(null);

            const response = await fetch("/api/analyze-social", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    platform,
                    postContent,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setResult({
                    summary: data.result || "Something went wrong.",
                });
                return;
            }

            setResult(data.result);
        } catch (error) {
            console.error(error);
            setResult({
                summary: "Something went wrong.",
            });
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
                        Growth Lab
                    </h1>

                    <p className="mt-3 max-w-2xl text-zinc-400">
                        Analyze social posts for organic reach, audience growth, saves,
                        shares, and email-list conversion potential.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Platform
                            </label>

                            <input
                                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-300"
                                placeholder="Instagram, Facebook, LinkedIn..."
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Post content
                            </label>

                            <textarea
                                className="h-[590px] w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-300"
                                placeholder="Paste your social post..."
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !postContent}
                            className="mt-5 w-full rounded-xl bg-amber-300 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Analyzing..." : "Analyze Post"}
                        </button>
                    </section>

                    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl">
                        <h2 className="mb-4 text-xl font-semibold text-white">
                            Growth Analysis
                        </h2>

                        {result ? (
                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                        <h3 className="mb-2 font-semibold">Growth Score</h3>
                                        <p className="text-3xl font-bold text-amber-300">
                                            {result.growthScore}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                        <h3 className="mb-2 font-semibold">Hook Strength</h3>
                                        <p className="text-3xl font-bold text-amber-300">
                                            {result.hookStrength}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                        <h3 className="mb-2 font-semibold">
                                            Emotional Resonance
                                        </h3>
                                        <p className="text-3xl font-bold text-amber-300">
                                            {result.emotionalResonance}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                        <h3 className="mb-2 font-semibold">Share Potential</h3>
                                        <p className="text-3xl font-bold text-amber-300">
                                            {result.sharePotential}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                        <h3 className="mb-2 font-semibold">Save Potential</h3>
                                        <p className="text-3xl font-bold text-amber-300">
                                            {result.savePotential}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                        <h3 className="mb-2 font-semibold">Follow Potential</h3>
                                        <p className="text-3xl font-bold text-amber-300">
                                            {result.followPotential}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <h3 className="mb-2 font-semibold">
                                        Email Signup Potential
                                    </h3>

                                    <p className="text-3xl font-bold text-green-400">
                                        {result.emailSignupPotential}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <h3 className="mb-2 font-semibold">Summary</h3>

                                    <p className="text-zinc-300">{result.summary}</p>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <h3 className="mb-2 font-semibold">What's Working</h3>

                                    <ul className="space-y-2">
                                        {result.whatWorks?.map((item: string, index: number) => (
                                            <li key={index}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <h3 className="mb-2 font-semibold">Growth Leaks</h3>

                                    <ul className="space-y-2">
                                        {result.growthLeaks?.map((item: string, index: number) => (
                                            <li key={index}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                                    <h3 className="mb-2 font-semibold">Suggested Revision</h3>

                                    <p className="whitespace-pre-wrap text-zinc-300">
                                        {result.suggestedRevision}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-[650px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-8 text-center text-zinc-500">
                                Your growth analysis will appear here after you run a post.
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}