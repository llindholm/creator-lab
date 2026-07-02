import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-8 py-16">

        <p className="text-sm uppercase tracking-[0.3em] text-amber-300 font-medium">
          To Living Free
        </p>

        <h1 className="mt-3 text-5xl font-bold">
          Creator Lab
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          AI-powered tools designed to help creators communicate more clearly,
          grow organically, and market authentically.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">

          <Link
            href="/email-lab"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-amber-300 hover:bg-zinc-900"
          >
            <h2 className="text-2xl font-semibold">
              Email Lab
            </h2>

            <p className="mt-3 text-zinc-400">
              Optimize newsletters for Gmail deliverability, engagement, and
              inbox placement before sending.
            </p>
          </Link>

          <Link
            href="/content-lab"
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-amber-300 hover:bg-zinc-900"
          >
            <h2 className="text-2xl font-semibold">
              Content Lab
            </h2>

            <p className="mt-3 text-zinc-400">
              Review Instagram content for organic discovery, stronger hooks,
              and audience growth before publishing.
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}