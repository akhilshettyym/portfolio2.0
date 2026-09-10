# Studio Architecture

Engineered a high-performance, context-aware digital workspace structured within a monorepo architecture. Orchestrated a secure Express and MongoDB API layer (gateway) to serve dynamic payload data to an interactive WebGL portfolio client (studio) and an administrative dashboard (core).

```Plaintext
portfolio2.0/
├── core/      # Next.js minimal admin portal (query & dynamic data management)
├── studio/    # Next.js frontend (interactive 3D contexts, user space, analytics)
└── gateway/   # Express API (DB access, dynamic data endpoints, secure webhooks)
```

## Tech Stack Matrix

### 1. Studio Service (studio)

The primary, high-performance user interface featuring immersive 3D rendering, contextual animations, and strict privacy controls.

- Core Framework: Next.js (React)
- Immersive & 3D Rendering: Three.js
- Styling & Motion: Tailwind CSS • Framer Motion • GSAP • Lenis (Smooth Scroll)
- APIs & Data: Open-Meteo API • ipapi • GraphQL (GitHub) • Salesforce Trailhead
- Security & Analytics: Google reCAPTCHA v3 • Google Tag Manager (GTM) • Google Analytics (GA4)
- Utility & Dev: Axios • React Icons • React Toastify • ESLint

---

### 2. Core Admin Portal (core)

The internal administrative control panel focused on dynamic data updates and inquiry management.

- Core Framework: Next.js (React)
- Styling: Tailwind CSS
- Security & Session: HTTP-Only Cookies • JWT Session Sync
- Utility & Dev: React Icons • React Toastify • Jest • ESLint

---

### 3. API Gateway (gateway)

The secure backend orchestration layer handling routing, dynamic content persistence, and external hooks.

- Runtime & Server: Node.js • Express.js
- Database ORM: Mongoose (MongoDB)
- Security: Helmet • Express Rate Limit • CORS • Cookie Parser
- Auth & Validation: JsonWebToken • BcryptJS • Validator
- Testing: Jest • Supertest • Cross-Env

---

## Core System Architectures

### 1. Hardware Benchmarking & Dynamic Tiering

To maintain optimal frame rates across varied hardware profiles, the frontend executes an internal background performance calibration during the initial loader screen.

- Tier 1 (Score > 50): Enables full-fidelity rendering. Clouds react dynamically to mouse movements, the hero name features fluid hover effects, the skills section renders as an interactive Three.js bubble scene, and the social section displays a fully interactive 3D connection globe with dropping images.

- Tier 2 (Score ≤ 50): Prioritizes stability. Cloud animations are paused, complex interactive modules convert to lightweight static vectors, and intensive 3D features (like the social globe) are hidden entirely to maintain performance.

---

### 2. Contextual Environment Engine

During initialization, the multi-lingual loader pauses to request location access, adapting the environment based on user preference:

- Accurate Location: Uses the native Browser Geolocation API mapped to the Open-Meteo API for exact coordinates and localized weather integration.
- Fast Location: Executes an automated IP-lookup via ipapi for regional approximations without requiring strict browser GPS permissions.
- Deny/Fallback: Sets the global scene to a default hardware-optimized aesthetic.

---

### 3. Privacy, Analytics & State Management

The application adheres to modern privacy standards while heavily utilizing client-side caching to minimize redundant network requests.

- Consent & Tracking: A custom cookie consent banner gates tracking. Once accepted, Google Tag Manager injects GA4 to track specific user journeys.

- DataLayer Events: The system securely pushes custom telemetry:

`performance_tier_evaluated (High/Low)`, `location_mode_evaluated (Accurate/Fast/Denied)`, `intro_scene_skipped`, `storage_purged`, `terminal_triggered`, `inquiry_failed`, `device_type`

- Storage Management: Users have total control over their data footprint. An integrated Settings menu allows partial cache clearance or a complete "Purge Storage" wipe of all local and session data (including db*github*, ui_intro, sys_tier, cookie_consent, etc.).

---

## Application Service Breakdowns

### Studio (The Showcase Platform)

- `Onboarding Sequence`: A multi-lingual loader greets the user, handles hardware scoring, and requests location context.

- `Cinematic Intro`: A scroll-controlled ~1-minute visual timeline. Features a global "Skip" override to bypass straight to the content.

- `Navigation & UI`: A fixed Navbar routes between Info, Work, and Start, flanked by a Theme Switcher and an integrated Developer Terminal.

- `Info Module`: The primary identity page. Features a dynamically reacting Hero section, progressively disclosed subject profiles, Three.js skill bubbles, achievement cards, and a multi-layered social connection globe (Tier 1 only).

- `Work Module`: Professional portfolio display featuring hover-activated project cards, comprehensive timeline logs for tech/industry experience and education, live Salesforce Trailhead metrics, and real-time GitHub GraphQL commit mappings.

- `Start Module`: A dual-mode communication canvas containing two paths: "Say Hi" (general messaging) and "Build a Project" (scoping details).

- `Spam Protection`: All forms are shielded invisibly by Google reCAPTCHA v3, requiring a background trust score of >0.5 to successfully submit payloads.

### Gateway (The Application Backend)

- `Dynamic Data APIs`: Newly implemented endpoints allow the application to fetch real-time profile, experience, and project data, allowing seamless site updates without redeploying the frontend.

- `Inquiry Ingestion & Security`: Validates POST requests from the Studio frontend, evaluates reCAPTCHA scores, and routes legitimate data to MongoDB.

- `Alert Orchestration`: Automatically triggers external payloads through a secure Discord Webhook upon successful form creation.

- `Testing Lifecycle`: Isolated automated Jest unit testing for core schemas and middleware, combined with Supertest validation across HTTP components.

### Core (The Admin Dashboard)

- `Access Gate`: A clean, single-purpose cryptographic login handling strictly validated credentials.

- `Data Interface`: Connects directly to the Gateway APIs to securely view, triage, and manage incoming user queries.

- `Content Management`: Provides UI interfaces to push updates to the dynamic data endpoints, controlling the content displayed on the Studio frontend. Features immediate session invalidation upon logging out.
