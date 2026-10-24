import { createFileRoute } from "@tanstack/react-router";
import { Database, Eye, ScanSearch, Target } from "lucide-react";
import { PageIntro } from "@/components/SiteHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Privacy — AEGIS" },
      { name: "description", content: "Why AEGIS exists, the limits of automated threat analysis, and how your data is handled." },
      { property: "og:title", content: "About & Privacy — AEGIS" },
      { property: "og:description", content: "Purpose, limitations and data handling at AEGIS." },
    ],
  }),
  component: About,
});

const sections = [
  { icon: Target, title: "Our purpose", body: ["AEGIS helps women recognise potential online threats and find practical, calm safety guidance — without needing technical knowledge or handing over personal data."] },
  { icon: ScanSearch, title: "Limits of automated analysis", body: [
    "The Threat Analyzer looks for language patterns commonly found in scams, harassment and coercion. It cannot understand full context, relationships, tone or intent.",
    "It may miss real threats and may flag harmless messages. It never decides whether a message is safe or dangerous — that judgement stays with you.",
    "The current version runs in demonstration mode using built-in rules; no AI service is connected.",
  ] },
  { icon: Database, title: "How your information is handled", body: [
    "Messages you paste are analysed in your browser. They are not uploaded, saved, logged or shared, and they're cleared when you leave or press Clear.",
    "Check-in labels exist only on the open page. No accounts, cookies for tracking, location or contacts are collected.",
    "Simulated alerts are examples only — AEGIS cannot send messages to anyone.",
  ] },
  { icon: Eye, title: "Not an emergency service", body: ["AEGIS provides general information, not legal or professional advice. If you are in danger, contact local emergency services or a trusted support organisation."] },
];

function About() {
  return (
    <div>
      <PageIntro eyebrow="About & Privacy" title="Built to protect, designed to respect">
        Safety tools should never cost you your privacy.
      </PageIntro>
      <div className="grid gap-5 md:grid-cols-2">
        {sections.map(({ icon: Icon, title, body }) => (
          <section key={title} className="card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-primary"><Icon className="h-5 w-5" aria-hidden /></span>
            <h2 className="mt-4 text-xl font-semibold">{title}</h2>
            {body.map((p) => <p key={p} className="mt-2 text-sm text-muted-foreground">{p}</p>)}
          </section>
        ))}
      </div>
    </div>
  );
}
