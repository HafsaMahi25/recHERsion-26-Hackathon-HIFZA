import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FlaskConical, Info, Loader2, RotateCcw, Search } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/SiteHeader";
import { analyzeMessage, demoScenarios, MAX_LEN, validateMessage, type Analysis } from "@/lib/analyzer";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "Threat Analyzer — AEGIS" },
      { name: "description", content: "Check a suspicious message for possible warning signs and get suggested next steps." },
      { property: "og:title", content: "Threat Analyzer — AEGIS" },
      { property: "og:description", content: "Spot possible warning signs in suspicious messages." },
    ],
  }),
  component: Analyzer,
});

const levelCopy = {
  few: { title: "Few common warning signs detected", tone: "bg-success-soft text-success" },
  some: { title: "Some possible warning signs detected", tone: "bg-warning-soft text-warning" },
  several: { title: "Several possible warning signs detected", tone: "bg-warning-soft text-destructive" },
};

function Analyzer() {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);

  const run = () => {
    const err = validateMessage(text);
    setError(err);
    setResult(null);
    if (err) return;
    setLoading(true);
    // Short delay so the loading state is visible; analysis runs locally.
    setTimeout(() => {
      try {
        setResult(analyzeMessage(text));
      } catch {
        setError("Something went wrong while analysing. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 700);
  };

  const clear = () => { setText(""); setResult(null); setError(null); };

  return (
    <div>
      <PageIntro eyebrow="Threat Analyzer" title="Is something about this message off?">
        Paste a message you're unsure about. AEGIS highlights language patterns often seen in scams,
        harassment and coercion.
      </PageIntro>

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-accent bg-secondary p-4 text-sm text-secondary-foreground">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>
          <strong>Demonstration mode.</strong> No AI service is connected. Analysis uses built-in pattern
          rules that run on your device. Your message is not stored or sent anywhere and is cleared when you leave this page.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <label htmlFor="msg" className="font-semibold">Suspicious message</label>
          <textarea
            id="msg"
            rows={7}
            maxLength={MAX_LEN}
            value={text}
            onChange={(e) => { setText(e.target.value); if (error) setError(null); }}
            placeholder="Paste the message here…"
            className="field mt-2 resize-y"
            aria-invalid={!!error}
            aria-describedby="msg-help"
          />
          <div id="msg-help" className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>Remove names or details you'd rather not include.</span>
            <span>{text.length}/{MAX_LEN}</span>
          </div>
          {error && <p role="alert" className="mt-2 text-sm font-medium text-destructive">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={run} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Analysing…" : "Analyze message"}
            </button>
            <button className="btn btn-outline" onClick={clear} disabled={loading || (!text && !result)}>
              <RotateCcw className="h-4 w-4" /> Clear
            </button>
          </div>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold">Try a demo scenario</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fictional examples to see how the analyzer works.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {demoScenarios.map((s) => (
              <button
                key={s.label}
                className="rounded-full border border-input bg-muted px-3 py-1.5 text-sm font-medium hover:bg-secondary"
                onClick={() => { setText(s.text); setResult(null); setError(null); }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <section className="mt-8 space-y-5" aria-live="polite" aria-label="Analysis results">
          <div className={`flex items-center gap-3 rounded-2xl p-4 font-semibold ${levelCopy[result.level].tone}`}>
            <AlertTriangle className="h-5 w-5" aria-hidden /> {levelCopy[result.level].title}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="card p-5">
              <h3 className="text-lg font-semibold">Potential warning signs & why they matter</h3>
              {result.signals.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No common patterns were matched.</p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {result.signals.map((s) => (
                    <li key={s.category}>
                      <p className="font-semibold text-primary">{s.category}</p>
                      <p className="mt-1 text-sm">Language noticed: <mark className="rounded bg-accent px-1">"{s.matched}"</mark></p>
                      <p className="mt-1 text-sm text-muted-foreground">{s.explanation}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card p-5">
              <h3 className="text-lg font-semibold">Suggested next steps</h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
                {result.nextSteps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </div>
          </div>

          <p className="flex gap-2 text-sm text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            These results are informational and may be incorrect. AEGIS cannot determine whether a message is
            definitively safe or dangerous. Trust your judgement, and seek help if you feel unsafe.
          </p>
        </section>
      )}
    </div>
  );
}
