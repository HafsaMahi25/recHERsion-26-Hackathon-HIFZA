import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CheckCircle2, FlaskConical, Play, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";
import { PageIntro } from "@/components/SiteHeader";

export const Route = createFileRoute("/check-in")({
  head: () => ({
    meta: [
      { title: "Personal Safety Check-in — HIFZA" },
      { name: "description", content: "Start a temporary safety check-in and mark yourself safe when you arrive." },
      { property: "og:title", content: "Personal Safety Check-in — HIFZA" },
      { property: "og:description", content: "A simple timed check-in with a simulated trusted-contact alert." },
    ],
  }),
  component: CheckIn,
});

type State =
  | { status: "idle" }
  | { status: "active"; label: string; endsAt: number }
  | { status: "completed"; label: string }
  | { status: "alert"; label: string };

const durations = [1, 15, 30, 60];

function CheckIn() {
  const [label, setLabel] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (state.status !== "active") return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= state.endsAt) setState({ status: "alert", label: state.label });
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  const start = () => {
    const l = label.trim();
    if (l.length < 2) return setError("Please enter a short label (at least 2 characters).");
    if (l.length > 60) return setError("Please keep the label under 60 characters.");
    setError(null);
    const t = Date.now();
    setNow(t);
    setState({ status: "active", label: l, endsAt: t + minutes * 60_000 });
  };

  const complete = () => state.status !== "idle" && setState({ status: "completed", label: state.label });
  const reset = () => { setState({ status: "idle" }); setLabel(""); };
  const simulate = () => state.status === "active" && setState({ status: "alert", label: state.label });

  const remaining = state.status === "active" ? Math.max(0, state.endsAt - now) : 0;
  const mm = String(Math.floor(remaining / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

  return (
    <div>
      <PageIntro eyebrow="Personal Safety Check-in" title="Let yourself know you got there safely">
        Set a temporary check-in for a journey, date or late walk. Mark it complete when you're safe.
      </PageIntro>

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-accent bg-secondary p-4 text-sm text-secondary-foreground">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p><strong>Simulation only.</strong> HIFZA does not send real messages, and never asks for your location or contacts. Check-ins exist only on this page and disappear when you close it.</p>
      </div>

      <div className="card mx-auto max-w-xl p-6">
        {state.status === "idle" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="label" className="font-semibold">Check-in label</label>
              <input id="label" className="field mt-2" maxLength={60} value={label}
                onChange={(e) => { setLabel(e.target.value); setError(null); }}
                placeholder="e.g. Walking home from the station" aria-invalid={!!error} />
              {error && <p role="alert" className="mt-2 text-sm font-medium text-destructive">{error}</p>}
            </div>
            <fieldset>
              <legend className="font-semibold">Check in within</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {durations.map((d) => (
                  <button key={d} type="button" aria-pressed={minutes === d} onClick={() => setMinutes(d)}
                    className={`btn ${minutes === d ? "btn-primary" : "btn-outline"}`}>
                    {d} min
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="btn btn-primary w-full" onClick={start}><Play className="h-4 w-4" /> Start Check-in</button>
          </div>
        )}

        {state.status === "active" && (
          <div className="space-y-5 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Check-in active</p>
            <h2 className="text-xl font-semibold">{state.label}</h2>
            <p className="font-display text-5xl font-bold tabular-nums" aria-live="off">{mm}:{ss}</p>
            <p className="text-sm text-muted-foreground">If the timer ends, a simulated alert will appear here.</p>
            <button className="btn btn-primary w-full" onClick={complete}><CheckCircle2 className="h-4 w-4" /> Complete Check-in — I'm safe</button>
            <button className="btn btn-outline w-full" onClick={simulate}><BellRing className="h-4 w-4" /> Simulate missed check-in</button>
          </div>
        )}

        {state.status === "completed" && (
          <div className="space-y-4 text-center" role="status">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" aria-hidden />
            <h2 className="text-xl font-semibold">Check-in complete</h2>
            <p className="text-muted-foreground">"{state.label}" was marked safe. Glad you made it.</p>
            <button className="btn btn-outline" onClick={reset}><TimerReset className="h-4 w-4" /> Start a new check-in</button>
          </div>
        )}

        {state.status === "alert" && (
          <div className="space-y-4" role="alert">
            <div className="rounded-2xl border-2 border-dashed border-warning bg-warning-soft p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-warning">Simulated trusted-contact alert · not sent</p>
              <p className="mt-2 text-sm">
                <em>Example of what a real safety app might send:</em> "Your friend hasn't completed their check-in
                '{state.label}'. Please try to reach them."
              </p>
              <p className="mt-2 text-xs font-semibold">No message was sent to anyone. HIFZA has no contact information.</p>
            </div>
            <p className="text-sm text-muted-foreground">If you are safe, complete your check-in. If you need help, contact someone you trust or local emergency services.</p>
            <button className="btn btn-primary w-full" onClick={complete}><CheckCircle2 className="h-4 w-4" /> Complete Check-in — I'm safe</button>
            <button className="btn btn-outline w-full" onClick={reset}>Cancel check-in</button>
          </div>
        )}
      </div>
    </div>
  );
}
