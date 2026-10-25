import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Eye, Footprints, Gavel, Landmark, MonitorSmartphone, Phone, Scale, ShieldAlert } from "lucide-react";
import { PageIntro } from "@/components/SiteHeader";

export const Route = createFileRoute("/laws-rights")({
  head: () => ({
    meta: [
      { title: "Laws & Rights — AEGIS" },
      {
        name: "description",
        content:
          "Plain-language introductions to Indian laws on sexual harassment, voyeurism, stalking and privacy, with official support resources.",
      },
      { property: "og:title", content: "Laws & Rights — AEGIS" },
      {
        property: "og:description",
        content: "Educational summaries of Indian safety laws and official helplines. Not legal advice.",
      },
    ],
  }),
  component: LawsRights,
});

type Law = {
  icon: typeof Scale;
  name: string;
  section: string;
  summary: string;
  example: string;
  steps: string[];
  source: { label: string; url: string };
};

const laws: Law[] = [
  {
    icon: ShieldAlert,
    name: "Bharatiya Nyaya Sanhita, 2023",
    section: "Section 75 — Sexual harassment",
    summary:
      "Covers unwelcome physical contact and advances involving explicit sexual overtures, demands or requests for sexual favours, showing pornography against a woman's will, and making sexually coloured remarks.",
    example:
      "A colleague repeatedly makes sexually coloured remarks about your appearance despite you asking him to stop, or a stranger sends you pornographic images you never asked for.",
    steps: [
      "Save evidence: screenshots, messages, dates, and names of any witnesses.",
      "If it happens at work, you can also complain under the workplace law (POSH Act, below).",
      "You can file a complaint with the police; in immediate danger call 112.",
    ],
    source: { label: "India Code — BNS Section 75", url: "https://indiacode.ecourtsindia.com/bns/section/75/" },
  },
  {
    icon: Eye,
    name: "Bharatiya Nyaya Sanhita, 2023",
    section: "Section 77 — Voyeurism",
    summary:
      "Covers watching or capturing the image of a woman during a private act where she would reasonably expect privacy, and sharing such images. Sharing an image is an offence even if the woman consented to it being taken but not to it being shared.",
    example:
      "Someone secretly films you in a changing room, or a person you trusted shares a private photo of you with others without your agreement.",
    steps: [
      "Preserve links, screenshots and any usernames involved before content is deleted.",
      "Report the content to the platform for removal.",
      "File a police complaint or report online at the National Cyber Crime Reporting Portal.",
    ],
    source: { label: "India Code — BNS Section 77", url: "https://indiacode.ecourtsindia.com/bns/section/77/" },
  },
  {
    icon: Footprints,
    name: "Bharatiya Nyaya Sanhita, 2023",
    section: "Section 78 — Stalking",
    summary:
      "Covers a man who follows a woman and contacts or tries to contact her repeatedly despite a clear indication of disinterest, or who monitors her use of the internet, email or other electronic communication.",
    example:
      "An ex-partner keeps messaging you from new accounts after you've blocked him and said you're not interested, or someone tracks your social media activity and turns up wherever you are.",
    steps: [
      "Keep a dated log of incidents and save messages, call records and screenshots.",
      "Tell people you trust, and adjust your privacy and location-sharing settings.",
      "Report to the police; stalking is a criminal offence even without physical contact.",
    ],
    source: { label: "India Code — BNS Section 78", url: "https://indiacode.ecourtsindia.com/bns/section/78/" },
  },
  {
    icon: MonitorSmartphone,
    name: "Information Technology Act, 2000",
    section: "Section 66E — Violation of privacy",
    summary:
      "Covers intentionally or knowingly capturing, publishing or transmitting the image of a person's private area without their consent, in circumstances where they could reasonably expect privacy.",
    example:
      "Someone photographs you without consent in a situation where you reasonably expected privacy, or forwards such an image in a group chat.",
    steps: [
      "Screenshot the content and note where it was shared, with dates and URLs.",
      "Report the image to the platform and request removal.",
      "Report online at the National Cyber Crime Reporting Portal (cybercrime.gov.in) or to the police.",
    ],
    source: {
      label: "India Code — IT Act Section 66E",
      url: "https://www.indiacode.nic.in/show-data?actid=AC_CEN_45_76_00001_200021_1517807324077&orderno=81&sectionId=13090&sectionno=66E",
    },
  },
  {
    icon: Landmark,
    name: "Sexual Harassment of Women at Workplace Act, 2013",
    section: "The POSH Act — Prevention, Prohibition and Redressal",
    summary:
      "Protects women from sexual harassment at the workplace, covering unwelcome physical, verbal or non-verbal conduct of a sexual nature. Workplaces with 10 or more employees must set up an Internal Complaints Committee (ICC) to hear complaints; a Local Complaints Committee covers smaller workplaces and domestic workers.",
    example:
      "A manager hints that your contract renewal depends on going out with him, or a coworker's persistent sexual jokes create a hostile environment — you can complain to your organisation's ICC.",
    steps: [
      "Find out who is on your workplace Internal Complaints Committee.",
      "Submit a written complaint to the ICC, normally within three months of the incident.",
      "You can also complain online through the Government's SHe-box portal (shebox.nic.in).",
    ],
    source: { label: "Ministry of Women & Child Development — SHe-box FAQs", url: "https://shebox.nic.in/user/faq" },
  },
];

const resources = [
  {
    icon: Phone,
    name: "Emergency Response Support System — 112",
    detail:
      "India's single emergency number for police, fire and medical help. You can also press your phone's power button 3 times for a panic call, or use the 112 India app.",
    link: { label: "112.gov.in", url: "https://www.112.gov.in/" },
  },
  {
    icon: Phone,
    name: "Women Helpline — 181",
    detail:
      "A national helpline for women affected by violence or in distress, offering support, information and referrals to services such as One Stop Centres.",
    link: { label: "Mission Shakti — Ministry of Women & Child Development", url: "https://missionshakti.wcd.gov.in/" },
  },
  {
    icon: MonitorSmartphone,
    name: "National Cyber Crime Reporting Portal",
    detail:
      "The Government of India's portal for reporting cyber crimes, with a special focus on crimes against women and children. The cyber crime helpline number is 1930.",
    link: { label: "cybercrime.gov.in", url: "https://cybercrime.gov.in/" },
  },
];

function LawsRights() {
  return (
    <div>
      <PageIntro eyebrow="Know Your Rights" title="Laws that protect you, in plain language">
        Short introductions to Indian laws commonly relevant to women's safety, with examples and practical next
        steps. Summaries link to the official texts so you can read the full provision.
      </PageIntro>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-accent bg-secondary p-4 text-sm text-secondary-foreground">
        <Scale className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <p>
          <strong>This is education, not legal advice.</strong> These summaries simplify the law and may not cover
          exceptions or recent changes. Whether a provision applies depends on the facts of your situation —
          please consult a qualified lawyer or a legal aid service for advice about your case.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {laws.map(({ icon: Icon, name, section, summary, example, steps, source }) => (
          <article key={section} className="card flex flex-col p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="font-semibold leading-tight">{section}</h2>
                <p className="text-xs text-muted-foreground">{name}</p>
              </div>
            </div>
            <p className="mt-3 text-sm">{summary}</p>
            <p className="mt-3 rounded-xl bg-muted p-3 text-sm">
              <span className="font-semibold text-primary">Example: </span>
              {example}
            </p>
            <div className="mt-3">
              <h3 className="text-sm font-semibold">Practical next steps</h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Read the official text <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">: {source.label}</span>
            </a>
          </article>
        ))}
      </div>

      <section className="mt-10" aria-labelledby="support-heading">
        <h2 id="support-heading" className="flex items-center gap-2 text-2xl font-bold">
          <Gavel className="h-6 w-6 text-primary" aria-hidden /> Official support resources
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Free, official Government of India services. AEGIS does not contact these services for you — save these
          numbers and links so you can reach them directly.
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {resources.map(({ icon: Icon, name, detail, link }) => (
            <div key={name} className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 font-semibold">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {link.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
