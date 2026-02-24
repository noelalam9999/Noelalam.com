'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

type QA = {
  question: string;
  strongSignal: string;
  weakSignal?: string;
  example: string;
};

type Section = {
  id: string;
  label: string;
  subtitle: string;
  focusChapters: string;
  qas: QA[];
};

const sections: Section[] = [
  {
    id: 'oauth-roles-flows',
    label: 'OAuth 2.0 Roles & Flows',
    subtitle: 'Auth Code, PKCE, Client Credentials, and where they fit.',
    focusChapters: '“OAuth 2 in Action” — core concepts and flows.',
    qas: [
      {
        question:
          'Explain the main OAuth 2.0 roles and how they interact in a typical web app.',
        strongSignal:
          'Clearly identifies Resource Owner (user), Client (app), Authorization Server (IdP, e.g. Okta/Entra), and Resource Server (API). Describes a high-level flow: user authenticates at the Authorization Server, the Client gets an access token, and uses it to call the Resource Server. Emphasizes that OAuth is about authorization, not password sharing.',
        weakSignal:
          'Mixes up roles (e.g. thinks the browser is the Resource Server) or treats OAuth as “just login” without separating authorization from authentication.',
        example:
          'They explain: “Our React app is the client, our Node API is the resource server, and Okta is the authorization server. The user (resource owner) signs in at Okta, and the React app/Node API get tokens to access the user’s data without ever seeing their password.”'
      },
      {
        question:
          'When do you use Authorization Code (with PKCE) vs Client Credentials?',
        strongSignal:
          'Auth Code (+PKCE) for user-in-the-loop flows (web/mobile apps) where the user is redirected to the IdP and an access token is issued on their behalf. Client Credentials for machine-to-machine or backend-to-backend calls with no user present. Mentions that SPA/public clients must not store client secrets and should use PKCE.',
        weakSignal:
          'Uses Client Credentials for user login, or doesn’t know PKCE is required/best practice for SPAs and native apps.',
        example:
          'They say: “Our React SPA uses the Auth Code + PKCE flow with Okta to log users in; the CRM integration service talks to our API with Client Credentials because there’s no interactive user.”'
      }
    ]
  },
  {
    id: 'oidc-basics',
    label: 'OIDC Basics: ID Token vs Access Token',
    subtitle: 'Identity vs authorization data and how to use each safely.',
    focusChapters: '“OAuth 2 in Action” + OIDC core docs — ID tokens and userinfo.',
    qas: [
      {
        question:
          'What is the difference between an ID token and an access token in OIDC, and how should each be used?',
        strongSignal:
          'ID token: JWT issued by the IdP for the client, contains identity claims (sub, name, email), used by the client to know “who” the user is and establish a session. Access token: opaque or JWT token meant for APIs, conveys scopes/permissions and is validated by resource servers. Emphasizes that APIs should validate access tokens, not ID tokens, and ID tokens should not be sent to unrelated services.',
        weakSignal:
          'Treats ID tokens and access tokens as interchangeable, or uses ID tokens directly as authorization for APIs.',
        example:
          'They explain that the React app reads the ID token to show the user’s name and stores only a short-lived session; the Node API validates the access token’s audience, issuer, expiry, and scopes to authorize API calls.'
      },
      {
        question:
          'How do you handle token storage and session management safely in a React/Node app?',
        strongSignal:
          'Discusses tradeoffs: HttpOnly same-site cookies from the backend (more XSS-resistant) vs localStorage/sessionStorage (easier but riskier). Mentions short-lived access tokens, refresh tokens held by a secure backend or using a BFF pattern, and avoiding long-lived tokens in the browser. Talks about logout and token revocation/expiry.',
        weakSignal:
          'Stores long-lived tokens in localStorage without considering XSS, or has no strategy for refresh/expiry.',
        example:
          'They use a BFF: React talks to Node over same-site cookies; Node holds access/refresh tokens securely and calls Okta. React never sees the tokens, so XSS cannot exfiltrate them.'
      }
    ]
  },
  {
    id: 'threats-mitigations',
    label: 'Threats: Token Leakage, Redirects, PKCE',
    subtitle: 'Common OAuth/OIDC pitfalls and how to avoid them.',
    focusChapters: '“OAuth 2 in Action” — security considerations and threats.',
    qas: [
      {
        question:
          'What are some common ways OAuth tokens can leak, and how do you mitigate them?',
        strongSignal:
          'Mentions leakage via browser storage (localStorage + XSS), URLs (tokens in fragments or query params), logs, referer headers, and insecure transport (no HTTPS). Mitigations: HttpOnly cookies or BFF patterns, not putting tokens in URLs, careful logging/redaction, enforcing HTTPS and secure cookie flags, using short-lived access tokens and rotating secrets.',
        weakSignal:
          'Only mentions “don’t share tokens” without concrete vectors or controls, or focuses solely on HTTPS.',
        example:
          'They cite a case where an access token appeared in server logs via a query param; they fixed it by switching to authorization header-based tokens and adding logging filters to redact sensitive headers.'
      },
      {
        question:
          'How can redirect URI attacks happen in OAuth, and what do you do to prevent them?',
        strongSignal:
          'Describes that if the authorization server accepts arbitrary redirect_uri values, an attacker can register a malicious redirect to capture auth codes or tokens. Mitigations: strict redirect URI registration (exact match or safe patterns), avoiding wildcards, and using state/nonce to bind requests and prevent CSRF/response mixup.',
        weakSignal:
          'Is unaware of redirect URI whitelisting, or thinks the client alone controls redirects without server-side validation.',
        example:
          'They configured Okta to only allow redirects to exact domain paths for their app (no wildcards) and use the state parameter to ensure the response matches an in-progress session.'
      },
      {
        question:
          'What problem does PKCE solve, and how does it work in the Authorization Code flow?',
        strongSignal:
          'Explains that PKCE protects public clients (SPAs, mobile) from authorization code interception. Client generates a random code_verifier and sends a hashed code_challenge in the auth request; later exchanges the code with the code_verifier. Authorization server verifies they match, so an intercepted code without the verifier is useless.',
        weakSignal:
          'Thinks PKCE is only for mobile or only “extra security” without explaining code_verifier/challenge.',
        example:
          'They note that their React app uses PKCE with Okta: the JS SDK creates a code_verifier/challenge; even if someone steals the auth code from the redirect, they can’t redeem it without the original verifier stored only in the client context.'
      }
    ]
  },
  {
    id: 'sso-react-node',
    label: 'SSO with Okta/Entra + React/Node',
    subtitle: 'Putting it together in a modern stack.',
    focusChapters: '“OAuth 2 in Action” + Okta/Entra docs — practical SSO setup.',
    qas: [
      {
        question:
          'Walk me through how SSO works for a React SPA, a Node API, and an IdP like Okta or Entra.',
        strongSignal:
          'Gives a clear sequence: user clicks “Login” in React → browser is redirected to IdP’s authorize endpoint with client_id, redirect_uri, scopes, state, and PKCE challenge → user authenticates → IdP redirects back with code → React (or a BFF/Node backend) exchanges code for tokens → React/Node uses access token to call the API → API validates token and returns data. Mentions where sessions live (browser cookie vs token storage) and how logout works.',
        weakSignal:
          'Describes “the user logs into Okta and then the app knows” without detailing redirects, tokens, or validation.',
        example:
          'They describe using Okta’s React SDK to handle redirects and token exchange in the browser, then sending the access token to a Node API which validates issuer/audience/expiry with JWKS before trusting the request.'
      },
      {
        question:
          'Where do you terminate trust and validate tokens in a React/Node architecture, and why?',
        strongSignal:
          'Emphasizes that the backend (Node API) is the primary trust boundary: it must validate access tokens (signature, issuer, audience, expiry, scopes). The React client should not make authorization decisions beyond simple UI gating. Mentions using libraries/SDKs for validation and avoiding reimplementing crypto.',
        weakSignal:
          'Relies purely on the frontend to decide what a user can do, or never validates tokens beyond “they exist.”',
        example:
          'They validate JWTs in Node with the IdP’s JWKS and reject tokens with wrong audience/scope, even if the React app tries to call protected endpoints; React only shows/hides buttons, but real checks happen server-side.'
      },
      {
        question:
          'How would you debug a problem where some users can’t log in via SSO while others can?',
        strongSignal:
          'Talks about checking IdP logs for failed authentications or misconfigured redirect URIs, verifying client_id/redirect_uri match between app and IdP, inspecting browser devtools network calls to the auth endpoints, and validating token contents (audience, scopes). Mentions correlation IDs or state parameters for traceability.',
        weakSignal:
          'Only says “I’d try turning it off and on again” or blames the IdP without a structured debugging approach.',
        example:
          'They mention finding that only users from a certain group failed because the app’s client configuration in Entra lacked that group’s assignment; they discovered it by correlating a user’s login attempt in Entra logs with the failed redirect in the browser.'
      }
    ]
  }
];

export default function OAuth2OidcSecurityInterviewGuide() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      <article className="max-w-3xl mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm mb-4">
              Engineering
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              OAuth 2.0, OIDC & SSO — Security Interview Guide
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>February 24, 2026</span>
              <span>•</span>
              <span>20 min read</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <div className="text-gray-300 leading-relaxed space-y-6">
            <p className="text-xl text-gray-400 mb-4">
              An interview guide inspired by &ldquo;OAuth 2 in Action&rdquo; and OIDC documentation. Use it to probe
              whether someone can comfortably explain OAuth roles and flows, OIDC ID vs access tokens, common threats
              (token leakage, redirect URI abuse, missing PKCE), and how SSO works with Okta/Entra and a React/Node app.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10">
              <h2 className="text-xl font-bold text-white mb-3">How to Use This Guide</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>
                  <span className="text-white font-semibold">For interviewers:</span> Pick 1–2 questions per section.
                  Listen for concrete flows (URLs, headers, tokens), not just buzzwords like “SSO” or “JWT.”
                </li>
                <li>
                  <span className="text-white font-semibold">For candidates:</span> Ground your answers in a real IdP
                  (Okta, Entra, Auth0, etc.) and app you’ve worked on. Draw the flow in your head: redirects, codes,
                  tokens, and validation points.
                </li>
                <li>
                  <span className="text-white font-semibold">Focus chapters:</span> OAuth roles and flows, OIDC ID vs
                  access tokens, and security threats. Interview payoff: explaining how SSO actually works in a
                  React/Node stack with a real IdP.
                </li>
              </ul>
            </div>

            <div className="space-y-10">
              {sections.map((section, i) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{section.label}</h2>
                      <p className="text-sm text-blue-300 mt-1">{section.subtitle}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 whitespace-nowrap">
                      {section.focusChapters}
                    </span>
                  </div>

                  <div className="space-y-6 mt-4">
                    {section.qas.map((qa, idx) => (
                      <div
                        key={qa.question}
                        className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-gray-500 mt-1">{idx + 1}.</span>
                          <h3 className="text-lg font-semibold text-white">{qa.question}</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-500/5 border border-green-500/20 rounded-md p-3">
                            <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">
                              Strong answer signals
                            </p>
                            <p className="text-sm text-gray-300">{qa.strongSignal}</p>
                          </div>

                          {qa.weakSignal && (
                            <div className="bg-red-500/5 border border-red-500/20 rounded-md p-3">
                              <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">
                                Weak answer signals
                              </p>
                              <p className="text-sm text-gray-300">{qa.weakSignal}</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-md p-3">
                          <p className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">
                            Real-life example pattern
                          </p>
                          <p className="text-sm text-gray-300">{qa.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </motion.div>
      </article>
    </main>
  );
}

