import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Creator Lab
      </h1>

      <div className="space-y-4">
        <Link
          href="/email-lab"
          className="block rounded-xl border border-zinc-700 p-4"
        >
          Email Lab
        </Link>

        <Link
          href="/growth-lab"
          className="block rounded-xl border border-zinc-700 p-4"
        >
          Growth Lab
        </Link>
      </div>
    </main>
  );
}