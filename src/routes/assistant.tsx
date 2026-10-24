import { createFileRoute } from "@tanstack/react-router";
import { Camera, Flag, KeyRound, MessageCircleWarning, UserX, Wallet, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "@/components/SiteHeader";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Digital Safety Assistant — AEGIS" },
      { name: "description", content: "Practical guidance for online harassment, impersonation, scams and privacy breaches." },
      { property: "og:title", content: "Digital Safety Assistant — AEGIS" },
      { property: "og:description", content: "Step-by-step guidance, evidence tips and reporting channels." },
    ],
  }),
  component: Assistant,
});

type Topic = { id: string; label: string; icon: typeof UserX; summary: string; steps: string[]; evidence: string[]; report: string[] };

const topics: Topic[] = [
  {
    id: "harassment", label: "Online harassment", icon: ShieldAlert,
    summary: "Repeated unwanted contact, abusive comments, threats or pile-ons.",
    steps: ["Don't engage or retaliate — responses can escalate the situation.", "Use block, mute and restrict tools; limit who can comment or message you.", "Make accounts private temporarily and review your followers.", "Lean on trusted friends to help monitor or report."],
    evidence: ["Screenshot messages showing username, profile URL, date and time.", "Save links to posts before they're deleted.", "Keep a simple log: date, platform, what happened."],
    report: ["Report through the platform's harassment tools.", "If there are threats of violence or stalking, contact local police.", "Contact a local women's support helpline for advice."],
  },
  {
    id: "impersonation", label: "Impersonation", icon: UserX,
    summary: "Someone pretending to be you, or pretending to be someone you know.",
    steps: ["Warn friends and followers through your genuine accounts.", "Don't message the fake account.", "Check that your own accounts are secure with two-factor authentication."],
    evidence: ["Screenshot the fake profile, its URL and any posts or messages.", "Collect messages others received from the fake account."],
    report: ["Use the platform's impersonation report form (often requires ID).", "If it's used for fraud or threats, report to police or your national cybercrime portal."],
  },
  {
    id: "messages", label: "Suspicious messages", icon: MessageCircleWarning,
    summary: "Unexpected texts, DMs or emails that feel pressuring, odd or too good to be true.",
    steps: ["Pause — don't click links, open attachments or reply.", "Verify the sender through a contact method you already trust.", "Run the message through the AEGIS Threat Analyzer for possible warning signs."],
    evidence: ["Screenshot the message including the sender's number or address.", "Don't forward links to others; copy them as text if needed for a report."],
    report: ["Report as spam/phishing in your messaging or email app.", "Forward scam texts to your mobile carrier's spam reporting number where available."],
  },
  {
    id: "privacy", label: "Privacy breaches", icon: KeyRound,
    summary: "Hacked accounts, leaked personal details, stalkerware or shared private images.",
    steps: ["Change passwords from a device you trust and enable two-factor authentication.", "Sign out of all sessions and review connected apps and devices.", "Check location-sharing, and look for unfamiliar apps or profiles on your phone.", "If intimate images were shared without consent, it is not your fault — removal help exists."],
    evidence: ["Screenshot login alerts, unknown devices and where your details appear.", "Note when you first noticed the breach."],
    report: ["Use account recovery and the platform's privacy reporting.", "Request removal of non-consensual intimate images via platform tools or a dedicated helpline.", "Report doxxing or stalking to police."],
  },
  {
    id: "scams", label: "Scams", icon: Wallet,
    summary: "Romance, job, investment, delivery or 'family emergency' scams seeking money or data.",
    steps: ["Never send money, gift cards or crypto to someone you haven't met in person.", "Be cautious of pressure, secrecy and stories that change.", "If you've paid, contact your bank immediately — speed matters."],
    evidence: ["Keep transaction receipts, account numbers and wallet addresses.", "Save the full conversation history and profile details."],
    report: ["Contact your bank or payment provider.", "Report to your national fraud or cybercrime reporting service.", "Report the profile to the platform used."],
  },
];

function Assistant() {
  const [active, setActive] = useState(topics[0].id);
  const t = topics.find((x) => x.id === active)!;
  return (
    <div>
      <PageIntro eyebrow="Digital Safety Assistant" title="Practical help, step by step">
        Choose what's happening to see clear guidance, how to preserve evidence, and where to report.
      </PageIntro>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:flex-wrap" role="tablist" aria-label="Safety categories">
        {topics.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={active === id}
            onClick={() => setActive(id)}
            className={`btn shrink-0 ${active === id ? "btn-primary" : "btn-outline"}`}
          >
            <Icon className="h-4 w-4" aria-hidden /> {label}
          </button>
        ))}
      </div>

      <section role="tabpanel" className="mt-6 space-y-5">
        <p className="text-lg">{t.summary}</p>
        <div className="grid gap-5 md:grid-cols-3">
          <GuideCard icon={ShieldAlert} title="What you can do" items={t.steps} />
          <GuideCard icon={Camera} title="Preserve evidence" items={t.evidence} />
          <GuideCard icon={Flag} title="Report it" items={t.report} />
        </div>
        <p className="text-sm text-muted-foreground">
          This is general guidance, not legal advice. Reporting options vary by country. If you are in immediate danger, contact local emergency services.
        </p>
      </section>
    </div>
  );
}

function GuideCard({ icon: Icon, title, items }: { icon: typeof Flag; title: string; items: string[] }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" aria-hidden /></span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
