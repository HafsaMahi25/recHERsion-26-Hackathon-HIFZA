import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Eraser,
  Eye,
  EyeOff,
  FlaskConical,
  Info,
  Mic,
  MicOff,
  Pencil,
  ShieldAlert,
  Volume2,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { PageIntro } from "@/components/SiteHeader";

export const Route = createFileRoute("/discreet-activation")({
  head: () => ({
    meta: [
      { title: "Discreet Activation Lab — HIFZA" },
      {
        name: "description",
        content:
          "Prototype demonstrations of two proposed emergency activation concepts: a secret drawn shape and a voice shortcut.",
      },
      { property: "og:title", content: "Discreet Activation Lab — HIFZA" },
      {
        property: "og:description",
        content: "Clearly labelled prototypes of discreet emergency activation ideas for the future HIFZA Android app.",
      },
    ],
  }),
  component: DiscreetActivation,
});

/* ------------------------------------------------------------------ */
/* Secret Shape                                                        */
/* ------------------------------------------------------------------ */

type Pt = { x: number; y: number };

const CANVAS = 320;
const SAMPLES = 64;
const MATCH_THRESHOLD = 0.22;

/** Parametric heart curve — the sample pattern users practise. */
function samplePattern(): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const t = (i / SAMPLES) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push({ x, y: -y });
  }
  return pts;
}

function pathLength(pts: Pt[]): number {
  let d = 0;
  for (let i = 1; i < pts.length; i++) d += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y);
  return d;
}

/** Resample a stroke to n evenly spaced points. */
function resample(pts: Pt[], n: number): Pt[] {
  if (pts.length < 2) return pts;
  const total = pathLength(pts);
  if (total === 0) return pts;
  const interval = total / (n - 1);
  const src = [...pts];
  const out: Pt[] = [src[0]!];
  let d = 0;
  for (let i = 1; i < src.length; i++) {
    const prev = src[i - 1]!;
    const cur = src[i]!;
    const dist = Math.hypot(cur.x - prev.x, cur.y - prev.y);
    if (dist > 0 && d + dist >= interval) {
      const t = (interval - d) / dist;
      const q = { x: prev.x + t * (cur.x - prev.x), y: prev.y + t * (cur.y - prev.y) };
      out.push(q);
      src.splice(i, 0, q);
      d = 0;
    } else {
      d += dist;
    }
  }
  while (out.length < n) out.push(src[src.length - 1]!);
  return out.slice(0, n);
}

/** Normalise points into a unit box, preserving aspect ratio, centred. */
function normalize(pts: Pt[]): Pt[] {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.max(maxX - minX, maxY - minY) || 1;
  return pts.map((p) => ({ x: (p.x - minX) / scale, y: (p.y - minY) / scale }));
}

/** Average point-to-point distance between two normalised gestures (0 = identical). */
function gestureDistance(a: Pt[], b: Pt[]): number {
  const n = Math.min(a.length, b.length);
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.hypot(a[i]!.x - b[i]!.x, a[i]!.y - b[i]!.y);
  return sum / n;
}

type ShapeResult = { matched: boolean; score: number } | null;

function SecretShape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokeRef = useRef<Pt[]>([]);
  const drawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [result, setResult] = useState<ShapeResult>(null);

  const drawScene = useCallback(
    (stroke: Pt[], guide: boolean) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, CANVAS, CANVAS);

      if (guide) {
        // Faint dashed heart guide, scaled into the canvas.
        const guide = normalize(resample(samplePattern(), SAMPLES));
        ctx.save();
        ctx.strokeStyle = "oklch(0.75 0.08 300)";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        guide.forEach((p, i) => {
          const x = 40 + p.x * (CANVAS - 80);
          const y = 40 + p.y * (CANVAS - 80);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }

      if (stroke.length > 1) {
        ctx.save();
        ctx.strokeStyle = "oklch(0.42 0.17 295)";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        stroke.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
        ctx.restore();
      }
    },
    [],
  );

  useEffect(() => {
    drawScene(strokeRef.current, showGuide);
  }, [showGuide, drawScene]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS,
    };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    strokeRef.current = [pointFromEvent(e)];
    setResult(null);
    setHasDrawn(true);
    drawScene(strokeRef.current, showGuide);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    strokeRef.current.push(pointFromEvent(e));
    drawScene(strokeRef.current, showGuide);
  };

  const onUp = () => {
    drawingRef.current = false;
    const stroke = strokeRef.current;
    if (pathLength(stroke) < 30) return; // too short to judge
    const user = normalize(resample(stroke, SAMPLES));
    const sample = normalize(resample(samplePattern(), SAMPLES));
    const score = gestureDistance(user, sample);
    setResult({ matched: score <= MATCH_THRESHOLD, score });
  };

  const clear = () => {
    strokeRef.current = [];
    setHasDrawn(false);
    setResult(null);
    drawScene([], showGuide);
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
          <Pencil className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="text-xl font-semibold">A. Secret Shape</h2>
        <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-warning">
          Prototype
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        The future Android app could let you unlock help by drawing a secret shape. Practise here: trace the
        sample heart pattern below. Your drawing is compared with the sample on your device only — nothing is
        saved or sent.
      </p>

      <div className="mt-4 flex flex-col items-center gap-4">
        <canvas
          ref={canvasRef}
          width={CANVAS}
          height={CANVAS}
          className="w-full max-w-80 touch-none rounded-2xl border-2 border-dashed border-input bg-muted"
          style={{ aspectRatio: "1 / 1" }}
          role="img"
          aria-label="Drawing area. Trace the dashed heart shape with your finger or mouse."
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
        <div className="flex flex-wrap justify-center gap-2">
          <button className="btn btn-outline" onClick={() => setShowGuide((g) => !g)}>
            {showGuide ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showGuide ? "Hide sample" : "Show sample"}
          </button>
          <button className="btn btn-outline" onClick={clear} disabled={!hasDrawn && !result}>
            <Eraser className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {result?.matched && (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-success bg-success-soft p-4" role="status">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Simulated activation · nothing happened
          </p>
          <p className="mt-2 text-sm">
            Your shape matched the sample pattern. In the future Android app, this is the moment your chosen
            safety action would begin — for example, alerting a trusted contact. <strong>No alert was sent and
            no call was made.</strong>
          </p>
        </div>
      )}
      {result && !result.matched && (
        <div className="mt-4 rounded-2xl border border-accent bg-secondary p-4" role="status">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
            <XCircle className="h-4 w-4" aria-hidden /> No match — keep practising
          </p>
          <p className="mt-2 text-sm text-secondary-foreground">
            That drawing didn't match the sample heart closely enough. Try tracing the dashed guide slowly in one
            continuous stroke, starting anywhere on the outline. In a real app you would choose your own secret
            shape and practise it until it feels natural.
          </p>
        </div>
      )}

      <p className="mt-4 flex gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>
          <strong>Prototype limitation:</strong> this works only inside this web page. A website cannot detect
          drawings on an Android lock screen or while using other apps — that would require a native Android app
          with system-level access.
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Voice Shortcut                                                      */
/* ------------------------------------------------------------------ */

const SAMPLE_PHRASE = "hifza help me";

type SpeechRecognitionType = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionType) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"] ?? null) as (new () => SpeechRecognitionType) | null;
}

type VoiceState =
  | { status: "idle" }
  | { status: "listening"; simulated: boolean }
  | { status: "matched"; heard: string; simulated: boolean }
  | { status: "notMatched"; heard: string; simulated: boolean }
  | { status: "denied" };

function VoiceShortcut() {
  const [state, setState] = useState<VoiceState>({ status: "idle" });
  const [supported, setSupported] = useState<boolean | null>(null);
  const recRef = useRef<SpeechRecognitionType | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      recRef.current?.abort();
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const finish = (heard: string, simulated: boolean) => {
    const said = heard.toLowerCase().replace(/[^a-z ]/g, " ");
    const ok = SAMPLE_PHRASE.split(" ").every((w) => said.includes(w));
    setState({ status: ok ? "matched" : "notMatched", heard, simulated });
  };

  const startReal = () => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return startSimulated();
    try {
      const rec = new Ctor();
      recRef.current = rec;
      rec.lang = "en-IN";
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => {
        const heard = e.results[0]?.[0]?.transcript ?? "";
        finish(heard, false);
      };
      rec.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") setState({ status: "denied" });
        else setState({ status: "notMatched", heard: "", simulated: false });
      };
      rec.onend = () => {
        setState((s) => (s.status === "listening" && !s.simulated ? { status: "notMatched", heard: "", simulated: false } : s));
      };
      rec.start();
      setState({ status: "listening", simulated: false });
    } catch {
      startSimulated();
    }
  };

  const startSimulated = () => {
    setSupported(false);
    setState({ status: "listening", simulated: true });
    timersRef.current.push(window.setTimeout(() => finish("Hifza help me", true), 2200));
  };

  const start = () => {
    // Check support only when the user explicitly activates the feature.
    if (supported === null) setSupported(getSpeechRecognition() !== null);
    if (getSpeechRecognition()) startReal();
    else startSimulated();
  };

  const stop = () => {
    recRef.current?.stop();
    timersRef.current.forEach((t) => window.clearTimeout(t));
    setState({ status: "idle" });
  };

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary">
          <Mic className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="text-xl font-semibold">B. Voice Shortcut</h2>
        <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-warning">
          Prototype
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        The future Android app could respond to a spoken phrase. Try it here: activate the demo, then say the
        sample phrase <strong>"Hifza help me"</strong>. Your browser will ask for microphone permission — only
        after you press the button. HIFZA does not record, store or send your audio.
      </p>

      {supported === false && (
        <div className="mt-3 rounded-xl bg-muted p-3 text-xs text-muted-foreground" role="note">
          Your browser doesn't support speech recognition, so the demonstration below is simulated — it plays a
          scripted result without using your microphone.
        </div>
      )}

      <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-input bg-muted p-6">
        {state.status === "listening" ? (
          <>
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" aria-hidden />
              <Volume2 className="h-7 w-7" aria-hidden />
            </span>
            <p className="text-sm font-semibold">
              {state.simulated ? "Listening… (simulated — microphone not in use)" : "Listening… say “Hifza help me”"}
            </p>
            <button className="btn btn-outline" onClick={stop}>
              <MicOff className="h-4 w-4" /> Stop
            </button>
          </>
        ) : (
          <>
            <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-primary">
              <Mic className="h-7 w-7" aria-hidden />
            </span>
            <button className="btn btn-primary" onClick={start}>
              <Mic className="h-4 w-4" /> Try the voice shortcut
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Microphone permission is requested only when you press this button.
            </p>
          </>
        )}
      </div>

      {state.status === "matched" && (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-success bg-success-soft p-4" role="status">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-success">
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Simulated activation · nothing happened
          </p>
          <p className="mt-2 text-sm">
            {state.simulated
              ? "Simulated result: the sample phrase was “recognised”. "
              : `Heard: “${state.heard}” — the sample phrase was recognised. `}
            In the future Android app this would start your chosen safety action.{" "}
            <strong>No alert was sent and no call was made.</strong>
          </p>
        </div>
      )}
      {state.status === "notMatched" && (
        <div className="mt-4 rounded-2xl border border-accent bg-secondary p-4" role="status">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
            <XCircle className="h-4 w-4" aria-hidden /> Phrase not recognised
          </p>
          <p className="mt-2 text-sm text-secondary-foreground">
            {state.heard
              ? `Heard: “${state.heard}”. That doesn't match the sample phrase “Hifza help me”.`
              : "Nothing was recognised. Check your microphone and try again."}{" "}
            Speak clearly and close to the microphone, then try again.
          </p>
        </div>
      )}
      {state.status === "denied" && (
        <div className="mt-4 rounded-2xl border border-accent bg-secondary p-4" role="alert">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-foreground">
            <MicOff className="h-4 w-4" aria-hidden /> Microphone permission declined
          </p>
          <p className="mt-2 text-sm text-secondary-foreground">
            That's completely fine — the demo only works with your permission. You can allow microphone access in
            your browser settings and try again, or continue exploring the rest of HIFZA without it.
          </p>
          <button className="btn btn-outline mt-3" onClick={startSimulated}>
            <Volume2 className="h-4 w-4" /> Use the simulated demo instead
          </button>
        </div>
      )}

      <p className="mt-4 flex gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <span>
          <strong>Prototype limitation:</strong> this demo listens only while this page is open and the button is
          active. A website cannot listen in the background, and cannot respond while your phone is locked — that
          would require a native Android app.
        </span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DiscreetActivation() {
  return (
    <div>
      <PageIntro eyebrow="Discreet Activation Lab" title="Proposed ways to call for help, quietly">
        Two early concepts for the future HIFZA Android app. Both are working prototypes you can try here — and
        both are clearly simulated: they never place calls, send messages, or contact anyone.
      </PageIntro>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-accent bg-secondary p-4 text-sm text-secondary-foreground">
        <FlaskConical className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>
          <strong>Prototype demonstrations.</strong> Everything on this page runs in your browser for practice
          only. Nothing here can reach emergency services or your contacts, and nothing you draw or say is saved.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SecretShape />
        <VoiceShortcut />
      </div>

      <div className="card mt-6 flex flex-col gap-3 p-5 md:flex-row md:items-center">
        <ShieldAlert className="h-8 w-8 shrink-0 text-primary" aria-hidden />
        <p className="flex-1 text-sm text-muted-foreground">
          In a real emergency, don't rely on a prototype. Call <strong>112</strong> (India's emergency number) or
          use the official 112 India app. See the{" "}
          <a href="/laws-rights" className="font-semibold text-primary underline">
            Laws &amp; Rights
          </a>{" "}
          page for official support resources.
        </p>
      </div>
    </div>
  );
}
