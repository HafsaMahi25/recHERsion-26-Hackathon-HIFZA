// Demonstration-mode analyzer: rule-based pattern matching that runs entirely in the browser.
// Nothing is sent anywhere or stored. It never declares a message safe or dangerous.

export type Signal = { category: string; matched: string; explanation: string };
export type Analysis = {
  level: "few" | "some" | "several";
  signals: Signal[];
  nextSteps: string[];
};

type Rule = { category: string; pattern: RegExp; explanation: string; steps: string[] };

const rules: Rule[] = [
  {
    category: "Urgency or pressure",
    pattern: /\b(urgent(ly)?|immediately|right now|within \d+ ?(hours?|minutes?|mins?)|last chance|act now|asap|final warning)\b/i,
    explanation: "Time pressure is commonly used to stop people from pausing, checking or asking someone else.",
    steps: ["Take your time. Legitimate organisations rarely require action within minutes."],
  },
  {
    category: "Threats or intimidation",
    pattern: /\b(or else|you('| wi)ll regret|i know where you (live|work)|watch your back|hurt you|you('| a)re dead|make you pay|ruin (you|your life))\b/i,
    explanation: "Language that implies harm or consequences may be intended to frighten or control you.",
    steps: ["If you feel in immediate danger, contact local emergency services.", "Do not reply or negotiate with someone making threats."],
  },
  {
    category: "Sextortion or image-based coercion",
    pattern: /\b(photos?|pictures?|videos?|pics?)\b[^.]{0,60}\b(share|send|post|leak|release|everyone|family|friends|contacts)\b|\b(intimate|private|nude)\s+(photos?|pictures?|images?|videos?)\b/i,
    explanation: "Threats to share private images are a recognised form of abuse. It is never your fault.",
    steps: ["Do not pay or send more images — paying rarely stops the demands.", "Many platforms and helplines can help remove intimate images shared without consent."],
  },
  {
    category: "Requests for money or payment",
    pattern: /\b(gift ?cards?|wire|bitcoin|crypto|western union|bank transfer|send (me )?(money|\$|£|€|₹)|pay(ment)? (now|fee)|processing fee|upi)\b/i,
    explanation: "Unexpected payment requests, especially by gift card, crypto or transfer, are common in scams.",
    steps: ["Do not send money. Contact the organisation or person through a channel you already trust."],
  },
  {
    category: "Requests for credentials or personal data",
    pattern: /\b(password|passcode|otp|one[- ]time (code|password)|verification code|pin|bank details|card number|cvv|social security|aadhaar|login details|verify your (account|identity))\b/i,
    explanation: "Legitimate services do not ask you to share passwords or one-time codes by message.",
    steps: ["Never share codes or passwords. If you already did, change your password and enable two-factor authentication."],
  },
  {
    category: "Suspicious links",
    pattern: /(https?:\/\/|www\.)\S+|\b(bit\.ly|tinyurl|t\.co|click (here|this link|below))\b/i,
    explanation: "Links in unexpected messages may lead to fake login pages or harmful downloads.",
    steps: ["Don't tap the link. Visit the official website by typing its address yourself."],
  },
  {
    category: "Impersonation or account claims",
    pattern: /\b(your account (has been|will be|is) (suspended|locked|closed|compromised)|this is (your )?(bank|police|support|admin)|official notice|security team|new number|it'?s me,? (mum|mom|dad))\b/i,
    explanation: "Claiming to be a bank, authority or family member on a new number is a common impersonation tactic.",
    steps: ["Verify by contacting the person or organisation using contact details you already have."],
  },
  {
    category: "Isolation or secrecy",
    pattern: /\b(don'?t tell (anyone|your)|keep (this|it) (between us|secret)|no one (needs to|will) know|delete this (message|chat))\b/i,
    explanation: "Asking for secrecy can be a way to prevent you from seeking help or a second opinion.",
    steps: ["Consider sharing the message with someone you trust before responding."],
  },
  {
    category: "Controlling or monitoring behaviour",
    pattern: /\b(where are you|who are you with|send me your location|share your location|answer (me|your phone)|why aren'?t you (answering|replying)|i('| a)m watching)\b/i,
    explanation: "Repeated demands about your whereabouts or contacts can indicate controlling behaviour.",
    steps: ["Review your location-sharing settings on your phone and apps."],
  },
];

const baseSteps = [
  "Preserve evidence: take screenshots showing the sender, date and time before blocking.",
  "Report the sender using the platform's reporting tools.",
  "Talk to someone you trust, or a local support organisation.",
];

export const MAX_LEN = 4000;

export function validateMessage(text: string): string | null {
  const t = text.trim();
  if (!t) return "Please paste a message to analyse.";
  if (t.length < 10) return "Please enter at least 10 characters so there is enough to review.";
  if (t.length > MAX_LEN) return `Please keep messages under ${MAX_LEN} characters.`;
  return null;
}

export function analyzeMessage(text: string): Analysis {
  const signals: Signal[] = [];
  const steps = new Set<string>();
  for (const r of rules) {
    const m = text.match(r.pattern);
    if (m) {
      signals.push({ category: r.category, matched: m[0].trim().slice(0, 80), explanation: r.explanation });
      r.steps.forEach((s) => steps.add(s));
    }
  }
  baseSteps.forEach((s) => steps.add(s));
  const level = signals.length >= 3 ? "several" : signals.length >= 1 ? "some" : "few";
  if (level === "few") steps.add("No common warning patterns were detected, but that does not mean the message is safe. Trust your instincts.");
  return { level, signals, nextSteps: [...steps] };
}

export const demoScenarios = [
  {
    label: "Fake bank alert",
    text: "URGENT: Your account has been suspended due to unusual activity. Verify your identity within 24 hours or it will be closed. Click here: http://secure-bank-verify.co/login and enter your OTP.",
  },
  {
    label: "Sextortion threat",
    text: "I have your private photos. Send $500 in bitcoin right now or I will share them with all your friends and family. Don't tell anyone or you'll regret it.",
  },
  {
    label: "Controlling partner",
    text: "Where are you? Who are you with? Send me your location now. Why aren't you answering? I'm watching your status.",
  },
  {
    label: "'Hi Mum' scam",
    text: "Hi mum, it's me, this is my new number. My phone broke. Can you send money for a bank transfer today? It's urgent, I'll pay you back.",
  },
  {
    label: "Ordinary message",
    text: "Hey! Are we still on for coffee Saturday at 11? Let me know if you'd prefer the place near the library.",
  },
];
