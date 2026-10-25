import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  ClipboardCheck,
  FlaskConical,
  ListChecks,
  Phone,
  ShieldAlert,
  Siren,
  Timer,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageIntro } from "@/components/SiteHeader";

export const Route = createFileRoute("/safety-plan")({
  head: () => ({
    meta: [
      { title: "My Safety Plan — AEGIS" },
      {
        name: "description",
        content:
          "Build a personal safety plan: a checklist, preferred safety actions, check-in review, support resources and a simulated emergency walkthrough.",
      },
      { property: "og:title", content: "My Safety Plan — AEGIS" },
      {
        property: "og:description",
        content: "A guided personal safety plan with a clearly simulated emergency practice run.",
      },
    ],
  }),
  component: SafetyPlan,
});

const STORAGE_KEY = "aegis-safety-plan-v1";

const checklistItems = [
  "I know who I would call first in an emergency",
  "My phone stays charged, and I carry a power bank on long days",
  "I tell someone I trust before going somewhere new or meeting someone new",
  "I know the safer, well-lit routes home from places I visit often",
  "I have a code word with a trusted person that means “I need help”",
  "I know how to reach 112, the Women Helpline 181, and the cyber crime portal",
  "My social media profiles are private and location sharing is reviewed",
  "Important documents and numbers are backed up somewhere safe",
] as const;

const actionOptions = [
  { id: "call", label: "Call a trusted contact" },
  { id: "location", label: "Share my live location with a trusted contact" },
  { id: "alarm", label: "Play a loud alarm from my phone" },
  { id: "record", label: "Start an audio recording" },
  { id: "decoy", label: "Show a harmless decoy screen" },
] as const;

const drillSteps = [
  {
    title: "1. Activate discreetly",
    body: "In the future Android app, you'd trigger help with your secret shape or voice phrase. Here, you pressed a button.",
  },
  {
    title: "2. Alert drafted",
    body: "A message to your trusted contact would be prepared, using the preferences you chose above. In this prototype, no contact details exist and nothing is drafted.",
  },
  {
    title: "3. Location attached",
    body: "A real app could attach your live location. AEGIS's web prototype never asks for or stores your location, so this step is described, not performed.",
  },
  {
    title: "4. Alarm & recording options",
    body: "If you chose them, a loud alarm or audio recording would begin. Here, nothing plays and nothing is recorded.",
  },
  {
    title: "5. Cancel with your PIN",
    body: "A real alert could be cancelled with a secret PIN if triggered by mistake. This practice run simply ends when you finish.",
  },
] as const;

type Saved = { checks: string[]; actions: string[] };

function loadSaved(): Saved {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { checks: [], actions: [] };
    const parsed = JSON.parse(raw) as Partial<Saved>;
    return {
      checks: Array.isArray(parsed.checks) ? parsed.checks.filter((c) => checklistItems.includes(c as (typeof checklistItems)[number])) : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions.filter((a) => actionOptions.some((o) => o.id === a)) : [],
    };
  } catch {
    return { checks: [], actions: [] };
  }
}

function SafetyPlan() {
  const [checks, setChecks] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drill, setDrill] = useState<number | null>(null);
  const [drillDone, setDrillDone] = useState(false);

  useEffect(() => {
    const saved = loadSaved();
    setChecks(saved.checks);
    setActions(saved.actions);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ checks, actions }));
    } catch {
      // Private browsing or storage disabled — the plan simply won't persist.
    }
  }, [checks, actions, hydrated]);

  const toggleCheck = (item: string) =>
    setChecks((c) => (c.includes(item) ? c.filter((x) => x !== item) : [...c, item]));
  const toggleAction = (id: string) =>
    setActions((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const done = checks.length;
  const total = checklistItems.length;

  return (
    <div>
      <PageIntro eyebrow="My Safety Plan" title="Your plan, ready before you need it">
        A calm place to prepare: review a checklist, choose the safety actions you'd want, and practise how an
        emergency flow would work — all with sample data.
      </PageIntro>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-accent bg-secondary p-4 text-sm text-secondary-foreground">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>
          <strong>Prototype with sample data.</strong> AEGIS never asks for real contact details or your precise
          location, and it cannot contact authorities or trusted contacts. Your checklist choices are stored only
          in this browser, on this device.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Checklist */}
        <section className="card p-5 md:p-6" aria-labelledby="checklist-heading">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
              <ListChecks className="h-5 w-5" aria-hidden />
            </span>
            <h2 id="checklist-heading" className="text-xl font-semibold">Personal safety checklist</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {done} of {total} reviewed. Take your time — this is for you.
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={total} aria-label="Checklist progress">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-2">
            {checklistItems.map((item) => {
              const on = checks.includes(item);
              return (
                <li key={item}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleCheck(item)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition ${
                      on ? "border-primary bg-secondary" : "border-input bg-card hover:bg-muted"
                    }`}
                  >
                    <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${on ? "text-primary" : "text-muted-foreground/40"}`} aria-hidden />
                    <span>{item}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="space-y-6">
          {/* Preferred actions */}
          <section className="card p-5 md:p-6" aria-labelledby="actions-heading">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                <ClipboardCheck className="h-5 w-5" aria-hidden />
              </span>
              <h2 id="actions-heading" className="text-xl font-semibold">My preferred safety actions</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose what you'd want the future app to do if you activated it. These are preferences for the
              Android prototype — nothing here performs these actions.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {actionOptions.map((o) => {
                const on = actions.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAction(o.id)}
                    className={`btn ${on ? "btn-primary" : "btn-outline"}`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
            {actions.length > 0 && (
              <p className="mt-3 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                Saved on this device only: {actions.length} action{actions.length > 1 ? "s" : ""} chosen. In a real
                deployment these would need your explicit setup and consent.
              </p>
            )}
          </section>

          {/* Check-in review */}
          <section className="card p-5 md:p-6" aria-labelledby="checkin-heading">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                <Timer className="h-5 w-5" aria-hidden />
              </span>
              <h2 id="checkin-heading" className="text-xl font-semibold">Review your check-in routine</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The Safety Check-in lets you set a timer before a walk, date or journey and mark yourself safe when
              you arrive. A missed check-in shows a simulated reminder of what a trusted-contact alert could look
              like.
            </p>
            <Link to="/check-in" className="btn btn-outline mt-4">
              Open Safety Check-in <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* Resources */}
          <section className="card p-5 md:p-6" aria-labelledby="resources-heading">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <h2 id="resources-heading" className="text-xl font-semibold">Emergency & support resources</h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><strong>112</strong> — Emergency Response Support System (police, fire, medical)</li>
              <li><strong>181</strong> — Women Helpline</li>
              <li><strong>1930</strong> — Cyber Crime Helpline · <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">cybercrime.gov.in</a></li>
            </ul>
            <Link to="/laws-rights" className="btn btn-outline mt-4">
              See Laws &amp; Rights <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>

      {/* Simulated emergency drill */}
      <section className="card mt-6 p-5 md:p-6" aria-labelledby="drill-heading">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
            <Siren className="h-5 w-5" aria-hidden />
          </span>
          <h2 id="drill-heading" className="text-xl font-semibold">Practise the emergency workflow</h2>
          <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-warning">
            Simulated
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Walk through what would happen after a discreet activation in the future app. Every step is described —
          nothing is sent, recorded, or shared.
        </p>

        {drill === null && !drillDone && (
          <button className="btn btn-primary mt-4" onClick={() => setDrill(0)}>
            <BellRing className="h-4 w-4" /> Start practice run
          </button>
        )}

        {drill !== null && (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-warning bg-warning-soft p-5" role="status">
            <p className="text-xs font-bold uppercase tracking-widest text-warning">Practice run · step {drill + 1} of {drillSteps.length} · nothing is real</p>
            <h3 className="mt-2 text-lg font-semibold">{drillSteps[drill]!.title}</h3>
            <p className="mt-1 text-sm">{drillSteps[drill]!.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {drill + 1 < drillSteps.length ? (
                <button className="btn btn-primary" onClick={() => setDrill(drill + 1)}>
                  Next step <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setDrill(null);
                    setDrillDone(true);
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" /> Finish practice run
                </button>
              )}
              <button className="btn btn-outline" onClick={() => setDrill(null)}>Stop practice</button>
            </div>
          </div>
        )}

        {drillDone && drill === null && (
          <div className="mt-4 rounded-2xl border border-accent bg-secondary p-4" role="status">
            <p className="flex items-center gap-2 text-sm font-semibold text-secondary-foreground">
              <CheckCircle2 className="h-5 w-5 text-success" aria-hidden /> Practice run complete.
            </p>
            <p className="mt-1 text-sm text-secondary-foreground">
              Nothing was sent, recorded or shared — this was a walkthrough only. In a real emergency, call 112.
            </p>
            <button className="btn btn-outline mt-3" onClick={() => { setDrillDone(false); setDrill(0); }}>
              Practise again
            </button>
          </div>
        )}

        <p className="mt-4 flex gap-2 text-xs text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          This practice run cannot contact authorities or trusted contacts. It exists so the real workflow feels
          familiar before you ever need it.
        </p>
      </section>
    </div>
  );
}
