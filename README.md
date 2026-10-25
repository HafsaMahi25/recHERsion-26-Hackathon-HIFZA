# Aegis Digital Safety Companion

Build a complete, responsive web application called AEGIS.



Tagline: Recognise Threats. Take Control. Stay Safer.



PURPOSE

AEGIS is a privacy-conscious women's safety companion that

addresses digital threats and personal safety.



TARGET USERS

Women who need accessible tools for recognising potential

online threats and finding practical safety guidance.



DESIGN

Create a polished, modern, trustworthy interface.

Use deep purple, lavender, white, and subtle gradients.

Use clean typography, rounded cards, accessible contrast,

simple icons, and a mobile-first responsive layout.



Create these pages or sections:



1. HOME DASHBOARD

- Welcome message and short introduction.

- Three prominent feature cards.

- Clear navigation.

- A visible privacy notice.



2. AI THREAT ANALYZER

- Text area where users can paste a suspicious message.

- Analyze button.

- Results section showing:

  a. Potential warning signs.

  b. Explanation of the concerning language.

  c. Suggested next steps.

- Clearly state that results are informational and may

  be incorrect.

- Never claim that a message is definitively safe or dangerous.

- Do not retain submitted messages unnecessarily.



3. DIGITAL SAFETY ASSISTANT

- Categories for online harassment, impersonation,

  suspicious messages, privacy breaches, and scams.

- Provide practical safety guidance for each category.

- Include suggestions for preserving evidence and reporting

  threats through appropriate channels.



4. PERSONAL SAFETY CHECK-IN

- Allow users to enter a temporary check-in label.

- Provide Start Check-in and Complete Check-in controls.

- Include a clearly labelled simulated trusted-contact alert.

- Do not falsely claim that real messages have been sent.

- Do not request real-time location or contact information.



5. ABOUT AND PRIVACY

- Explain the purpose of AEGIS.

- State the limitations of automated threat analysis.

- Explain how user-submitted information is handled.



FUNCTIONAL REQUIREMENTS

- Every button must perform its stated action.

- Navigation must work.

- Forms must validate input.

- Provide loading, success, and error states where relevant.

- Make all features usable on mobile and desktop.

- Use realistic demonstration scenarios.

- Avoid non-functional placeholder buttons.



TECHNICAL REQUIREMENTS

- Build a working application, not a static mock-up.

- Use a maintainable component structure.

- Keep sensitive information out of browser logs.

- Do not expose API keys in frontend code.

- Do not invent successful API responses.

- If no AI API is configured, provide a clearly labelled

  demonstration mode with predefined test scenarios.

- Keep the application usable without paid integrations.



First generate the complete application and make its core

workflows functional. Then show me how to test each feature.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aegis-digital-safety-companion.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/71b074f9-6ca9-5847-b81e-2b6a66179f50).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
