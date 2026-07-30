# Studio/portfolio Architecture

A high-performance, context-aware digital workspace structured as a unified monorepo. The ecosystem consists of a highly interactive 3D/cinematic client portfolio, a minimal admin management system, and an integrated Node.js/Express orchestration backend.

```plaintext
portfolio2.0/
├── core/      # Next.js minimal control panel and response dashboard
├── studio/    # Next.js frontend, interactive 3D contexts, and user space
└── gateway/   # Express API, DB access layer, and automated notification hooks
```

## <u> Tech Stack Matrix </u>

#### 1. Studio Service (studio)The primary, high-performance user interface featuring immersive 3D rendering and smooth animations.

- Core Framework: `Next.js (React)`
- Immersive & 3D Rendering: `Three.js`
- Styling & Motion: `Tailwind CSS` • `Framer Motion` • `GSAP` • `Lenis` (Smooth Scroll)
- Data & State Integrations: `Open-Meteo API` • `ipwho.is` • `LocalStorage Cache`
- Utility & UI Packages: `Axios` • `Lunarphase-js` • `React Icons` • `React Toastify`
- Dev Quality: `ESLint` • `Next ESLint Config`

#### 2. Core Admin Portal (core)The internal administrative control panel focused on data management and strict session security.

- Core Framework: `Next.js (React)`
- Styling: `Tailwind CSS`
- Security & Session: `HTTP-Only Cookies` • `JWT Session Sync`
- Utility & UI Packages: `React Icons`• `React Toastify`
- Testing & Quality: `Jest` • `ESLint` • `Next ESLint Config`

#### 3. API Gateway (gateway)The secure backend orchestration layer handling routing, authentication, and database persistence.

- Runtime & Server: `Node.js` • `Express.js`
- Database ORM: `Mongoose (MongoDB)`
- Security & Shielding: `Helmet` • `Express Rate Limit` • `CORS` • `Cookie Parser`
- Auth & Validation: `JsonWebToken` • `BcryptJS` • `Validator`
- Environment: `Dotenv`
- Testing & Quality: `Jest` • `Supertest` • `Cross-Env` • `ESLint (Native JS)`

## <u> MongoDB (Mongoose), Discord Webhooks, Jest </u>

### Core Frameworks:

#### 1. Hardware Benchmarking & Dynamic Performance Tiering -

To maintain an optimal user experience across varied hardware profiles, clientui executes an internal background performance calibration upon initial user initialization. It samples hardware metrics including WebGL support limits, maximum texture bounds, available device memory, continuous FPS cycles, and critical frame latency metrics `($p_{95}$ frame duration)`.

Calibration Algorithm: Metrics are processed into a unified numeric engine score.

- **Tier 1 `($\text{Score} > 50$)`**: Enables full-fidelity rendering profiles, including interactive responsive cloud physics maps, custom color-inverting global crosshair tracking cursors, high-resolution 3D textures, and fluid typography name warping effects.

- **Tier 2 `($\text{Score} \le 50$)`**: Converts CPU/GPU-intensive interactive modules into lightweight static vectors, limits 3D scene parameters, and switches complex elements into generic flat layouts to ensure a smooth, stable frame rate on legacy engines.

    State Caching: Calibration values are compiled once and stored in the user's localStorage to expedite secondary page hits.

#### 2. Contextual Environment Engine (Geolocation & Weather Integration):
 
The thematic lighting, background environments, and structural elements of the app adapt directly to the user's real-world time and local weather patterns via a tiered access flow:

- **Primary**: Native Browser Geolocation API providing high-precision coordinates connected to the Open-Meteo API.

- **Secondary Fallback**: Automated IP-lookup via ipwho.is for regional approximations if explicit permission is denied.

- **Tertiary Fallback**: Hardcoded global default coordinates deployed automatically if complete network isolation occurs.

- **State Caching**: Like the performance metrics, the resolved location state is cached in localStorage to optimize data retrieval speeds.

### Service Component Breakdowns:

#### clientui (The Showcase Platform) -
 
The primary user portal designed as a high-fidelity immersive workspace.

- _Onboarding Sequence_: Multi-lingual loader loop running structural "Hello" tags alongside concurrent async location/performance workflows.

- _Cinematic Timeline_: A ~1-minute curated visual introductory path detailing profile focuses, utilizing scroll-state locking mechanics ("Scroll vs. Hold") with a global control override (Skip functionality).

- _Navigation Architecture_: An interactive state-switch tracking 3-core configurations:

1. **INFO Module**: Contains real-time weather-reactive cloud layers, interactive mouse-responsive 3D skill clusters, academic/extracurricular credential cards tracking to structural repository certifications, and a randomized image cluster layout using dynamic cursor tracking.

2. **WORK Module**: Mouse-responsive portfolio project cards, career/education timeline logs, an embedded live metrics frame syncing Salesforce certifications, and real-time GitHub activity mappings.

3. **START Module**: Dual-mode communication canvas ("Say Hi" general inquiries or "Build A Project" scope configurations) passing data straight to the backend pipeline.

4. **Integrated Developer Terminal**: An embedded mini-shell interface handling programmatic text entries (e.g., execute /help for system controls).

#### backend (The Application Gateway):

A production-hardened API routing data and handling secure access logic.

- **Inquiry Ingestion**: A structured POST endpoint validation pipeline routing data directly to MongoDB.

- **Alert Orchestration**: Automatically triggers external payloads through a secure Discord Webhookworkflow upon successful form creation, forwarding communications straight to mobile communication hubs.

- **Admin Utilities**: Complete suite of protected routing APIs allowing safe read/delete operations for system state control.

- **Security Layer**: Enforces explicit HTTP-Only cookie verification structures built alongside strict JSON Web Token (JWT) strategies.

- **Testing Lifecycle**: Rigorously isolated utilizing automated Jest unit testing for core schemas/middleware, combined with Supertest validation layers across HTTP components.

#### adminui (The Metrics Control Panel):
 
A lightweight dashboard constructed strictly for managing application states.

- **Access Gate**: Clean, single-purpose cryptographic login view handling credentials validation securely.

- **Data Interface**: A simple layout displaying active customer inquiries directly from the MongoDB cluster. Includes features for triaging, processing, and purging historical data securely, followed by immediate session invalidation upon logging out.
