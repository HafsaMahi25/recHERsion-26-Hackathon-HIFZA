import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, MessageSquareWarning, LifeBuoy, Timer, Shapes, Scale, ClipboardCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HIFZA — Your Safety. Your Strength." },
      { name: "description", content: "Your Safety. Your Strength. A privacy-conscious women's safety companion that helps you prevent, protect and respond." },
      { property: "og:title", content: "HIFZA — Your Safety. Your Strength." },
      { property: "og:description", content: "Prevent. Protect. Respond. A private companion for online threats and personal safety." },
    ],
  }),
  component: Home,
});

const features = [
  { to: "/analyzer", icon: MessageSquareWarning, title: "Threat Analyzer", body: "Paste a suspicious message and see possible warning signs with suggested next steps." },
  { to: "/assistant", icon: LifeBuoy, title: "Digital Safety Assistant", body: "Practical guidance for harassment, impersonation, scams and privacy breaches." },
  { to: "/check-in", icon: Timer, title: "Safety Check-in", body: "Start a timed check-in for a walk, date or journey, and mark yourself safe." },
  { to: "/discreet-activation", icon: Shapes, title: "Discreet Activation Lab", body: "Try two prototype concepts for calling help quietly: a secret drawn shape and a voice shortcut." },
  { to: "/laws-rights", icon: Scale, title: "Laws & Rights", body: "Plain-language introductions to Indian safety laws, with examples, next steps and official helplines." },
  { to: "/safety-plan", icon: ClipboardCheck, title: "My Safety Plan", body: "Build a personal safety plan and practise a simulated emergency workflow with sample data." },
] as const;

function Home() {
  return (
    <div className="space-y-10">
      <section className="bg-hero overflow-hidden rounded-3xl px-6 py-12 text-primary-foreground shadow-card md:px-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Welcome to HIFZA</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
          Your Safety. Your Strength.
        </h1>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] opacity-90">
          Prevent. Protect. Respond.
        </p>
        <p className="mt-4 max-w-xl opacity-90">
          A calm, private companion that helps you spot concerning messages, respond to online abuse,
          and plan for your personal safety.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/analyzer" className="btn btn-light">Analyse a message <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/assistant" className="btn border border-primary-foreground/40 hover:bg-primary-foreground/10">Get safety guidance</Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3" aria-label="Features">
        {features.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="card group p-6 transition hover:-translate-y-1">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary">
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-4 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </section>

      <section className="card flex flex-col gap-4 border-accent p-6 md:flex-row md:items-center" aria-label="Privacy notice">
        <Lock className="h-8 w-8 shrink-0 text-primary" aria-hidden />
        <div className="flex-1">
          <h2 className="font-semibold">Your privacy comes first</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Messages you analyse are processed in your browser and are not saved or sent anywhere.
            HIFZA never asks for your location or contacts. Results are informational and may be incorrect.
          </p>
        </div>
        <Link to="/about" className="btn btn-outline">Read privacy details</Link>
      </section>
    </div>
  );
}
