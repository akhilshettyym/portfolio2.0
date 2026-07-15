import { FaFileAlt } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FaInstagram, FaGithub, FaLinkedin, FaSalesforce } from "react-icons/fa6";
import { TiWeatherCloudy, TiWeatherNight, TiWeatherPartlySunny, TiWeatherShower, TiWeatherStormy, TiWeatherSunny } from "react-icons/ti";
import { WiMoonAltNew, WiMoonAltWaxingCrescent3, WiMoonAltFirstQuarter, WiMoonAltFull, WiMoonAltWaxingGibbous3, WiMoonAltWaningGibbous3, WiMoonAltThirdQuarter, WiMoonAltWaningCrescent3 } from "react-icons/wi";

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const WORDS = [
  "CORE JAVA",
  "DATA STRUCTURES",
  "MERN STACK",
  "VERSION CONTROL",
  "SALESFORCE",
  "API INTEGRATIONS",
  "FRAMEWORKS",
  "ARCHITECTURES",
  "DEPLOYMENT",
];

export const DEV_TICKERS_TIER = [
  "BUILD STATUS — STABLE + ",
  "API RESPONSE 124ms + ",
  "DEPLOYMENT SYNCHRONIZED + ",
  "CACHE HIT RATE 92% + ",
  "EDGE FUNCTIONS ACTIVE + ",
  "AUTH SERVICE HEALTHY + ",
  "CI/CD PIPELINE PASSING + ",
  "REQUEST LOAD NORMAL + ",
  "SCALABLE SYSTEM DESIGN + ",
  "THREE.JS RENDER LOOP ACTIVE + ",
  "NEXT.JS APP ROUTER READY + ",
  "PRODUCTION BUILD OPTIMIZED + ",
  "INTERACTIVE UI SYSTEMS + ",
  "REAL-TIME MOTION ENGINE + ",
  "DATABASE CONNECTION SECURE + ",
  "PERFORMANCE SCORE — HIGH + ",
  "TYPE-SAFE APPLICATION LAYER + ",
  "FULL STACK ARCHITECTURE + ",
  "SYSTEM LATENCY WITHIN RANGE + ",
  "SHIPPING RELIABLE EXPERIENCES + ",
];

export const DEV_TICKERS = [
  "BUILD STATUS — STABLE",
  "API RESPONSE 124ms",
  "DEPLOYMENT SYNCHRONIZED",
  "CACHE HIT RATE 92%",
  "EDGE FUNCTIONS ACTIVE",
  "AUTH SERVICE HEALTHY",
  "CI/CD PIPELINE PASSING",
  "REQUEST LOAD NORMAL",
  "SCALABLE SYSTEM DESIGN",
  "THREE.JS RENDER LOOP ACTIVE",
  "NEXT.JS APP ROUTER READY",
  "PRODUCTION BUILD OPTIMIZED",
  "INTERACTIVE UI SYSTEMS",
  "REAL-TIME MOTION ENGINE",
  "DATABASE CONNECTION SECURE",
  "PERFORMANCE SCORE — HIGH",
  "TYPE-SAFE APPLICATION LAYER",
  "FULL STACK ARCHITECTURE",
  "SYSTEM LATENCY WITHIN RANGE",
  "SHIPPING RELIABLE EXPERIENCES",
];

export const TEXTURE_PATHS = [
  "animate",
  "css",
  "docker",
  "expressjs",
  "figma",
  "firebase",
  "git",
  "github",
  "html",
  "java",
  "javascript",
  "jest",
  "kubernetes",
  "nextjs",
  "nodejs",
  "reactjs",
  "salesforce",
  "sql",
  "tailwind",
  "tedx",
  "threejs",
  "vscode",
  "redux",
];

export const FADEUP = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  viewport: { once: true, amount: 0.15 },
};

export const CLAMP = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

export const LERP = (from, to, t) => {
  return from + (to - from) * t;
};

export const EASEOUTEXPO = (t) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const WEATHER_CODES = {
  CLEAR: [0, 1, 2, 3],
  MIST: [45, 48],
  RAIN: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82],
  SNOW: [71, 73, 75, 77, 85, 86],
  STORM: [95, 96, 99],
};

export const CACHE_TTL_MS = 15 * 60 * 1000;

export const DEFAULT_CARDS = [
  {
    title: "Impact Highlights",
    caption: "Milestones That Made a Difference",
    description:
      "A curated showcase of measurable outcomes, reflecting consistent execution, ownership, and deep impact across key initiatives.",
    year: "2021-2025",
    href: "https://github.com/akhilshettyym/My-Professional-Journey/tree/main/01_ImpactHighlights",
    cta: "View highlights",
  },
  {
    title: "Technical Certifications",
    caption: "Continuous Learning, Verified Skills",
    description:
      "Formal industry credentials validating technical knowledge, practical expertise, and full readiness to leverage modern tools.",
    year: "2024-2025",
    href: "https://github.com/akhilshettyym/My-Professional-Journey/tree/main/02_TechnicalCertifications",
    cta: "See certificates",
  },
  {
    title: "Co-Curricular Recognition",
    caption: "Leadership Beyond Academics",
    description:
      "Honored recognition earned through leadership, teamwork, and active participation in activities that build true collaboration.",
    year: "2022-2025",
    href: "https://github.com/akhilshettyym/My-Professional-Journey/tree/main/03_Co-CurricularRecognition",
    cta: "Explore recog.",
  },
  {
    title: "Academic Records",
    caption: "A Foundation of Excellence",
    description:
      "A rigorous academic journey driven by absolute consistency, disciplined execution, and a focused commitment to future growth.",
    year: "2019-2026",
    href: "https://github.com/akhilshettyym/My-Professional-Journey/tree/main/04_AcademicRecords",
    cta: "Open record",
  },
];

export const RADII = [
  1, 0.6, 0.8, 0.4, 0.9, 0.7, 0.9, 0.3, 0.2, 0.5, 0.6, 0.4, 0.5, 0.6, 0.7, 0.3,
  0.4, 0.8, 0.7, 0.5, 0.4, 0.6, 0.35, 0.38, 0.9, 0.3, 0.6, 0.4, 0.2, 0.35, 0.5,
  0.15, 0.2, 0.25, 0.4, 0.8, 0.76, 0.8, 1, 0.8, 0.7, 0.8, 0.3, 0.5, 0.6, 0.55,
  0.42, 0.75, 0.66, 0.6, 0.7, 0.5, 0.6, 0.35, 0.35, 0.35, 0.8, 0.6, 0.7, 0.8,
  0.4, 0.89, 0.3, 0.3, 0.6, 0.4, 0.2, 0.52, 0.5, 0.15, 0.2, 0.25, 0.4, 0.8,
  0.76, 0.8, 1, 0.8, 0.7, 0.8, 0.3, 0.5, 0.6, 0.8, 0.7, 0.75, 0.66, 0.6, 0.7,
  0.5, 0.6, 0.35, 0.35, 0.35, 0.8, 0.6, 0.7, 0.8, 0.4, 0.89, 0.3,
];

export const POSITIONS = [
  { x: 0, y: 0, z: 0 },
  { x: 1.2, y: 0.9, z: -0.5 },
  { x: 1.8, y: -0.3, z: 0 },
  { x: -1, y: -1, z: 0 },
  { x: -1, y: 1.62, z: 0 },
  { x: -1.65, y: 0, z: -0.4 },
  { x: -2.13, y: -1.54, z: -0.4 },
  { x: 0.8, y: 0.94, z: 0.3 },
  { x: 0.5, y: -1, z: 1.2 },
  { x: -0.16, y: -1.2, z: 0.9 },

  { x: 1.5, y: 1.2, z: 0.8 },
  { x: 0.5, y: -1.58, z: 1.4 },
  { x: -1.5, y: 1, z: 1.15 },
  { x: -1.5, y: -1.5, z: 0.99 },
  { x: -1.5, y: -1.5, z: -1.9 },
  { x: 1.85, y: 0.8, z: 0.05 },
  { x: 1.5, y: -1.2, z: -0.75 },
  { x: 0.9, y: -1.62, z: 0.22 },
  { x: 0.45, y: 2, z: 0.65 },
  { x: 2.5, y: 1.22, z: -0.2 },

  { x: 2.35, y: 0.7, z: 0.55 },
  { x: -1.8, y: -0.35, z: 0.85 },
  { x: -1.02, y: 0.2, z: 0.9 },
  { x: 0.2, y: 1, z: 1 },
  { x: -2.88, y: 0.7, z: 1 },

  { x: -2, y: -0.95, z: 1.5 },
  { x: -2.3, y: 2.4, z: -0.1 },
  { x: -2.5, y: 1.9, z: 1.2 },
  { x: -1.8, y: 0.37, z: 1.2 },
  { x: -2.4, y: 1.42, z: 0.05 },

  { x: -2.72, y: -0.9, z: 1.1 },
  { x: -1.8, y: -1.34, z: 1.67 },
  { x: -1.6, y: 1.66, z: 0.91 },
  { x: -2.8, y: 1.58, z: 1.69 },
  { x: -2.97, y: 2.3, z: 0.65 },

  { x: 1.1, y: -0.2, z: -1.45 },
  { x: -4, y: 1.78, z: 0.38 },
  { x: 0.12, y: 1.4, z: -1.29 },
  { x: -1.64, y: 1.4, z: -1.79 },
  { x: -3.5, y: -0.58, z: 0.1 },

  { x: -0.1, y: -1, z: -2 },
  { x: -4.5, y: 0.55, z: -0.5 },
  { x: -3.87, y: 0, z: 1 },
  { x: -4.6, y: -0.1, z: 0.65 },
  { x: -3, y: 1.5, z: -0.7 },

  { x: -0.5, y: 0.2, z: -1.5 },
  { x: -1.3, y: -0.45, z: -1.5 },
  { x: -3.35, y: 0.25, z: -1.5 },
  { x: -4.76, y: -1.26, z: 0.4 },
  { x: -4.32, y: 0.85, z: 1.4 },

  { x: -3.5, y: -1.82, z: 0.9 },
  { x: -3.6, y: -0.6, z: 1.46 },
  { x: -4.55, y: -1.5, z: 1.63 },
  { x: -3.8, y: -1.15, z: 2.1 },
  { x: -2.9, y: -0.25, z: 1.86 },

  { x: -2.2, y: -0.4, z: 1.86 },
  { x: -5.1, y: -0.24, z: 1.86 },
  { x: -5.27, y: 1.24, z: 0.76 },
  { x: -5.27, y: 2, z: -0.4 },
  { x: -6.4, y: 0.4, z: 1 },

  { x: -5.15, y: 0.95, z: 2 },
  { x: -6.2, y: 0.5, z: -0.8 },
  { x: -4, y: 0.08, z: 1.8 },

  { x: 2, y: -0.95, z: 1.5 },
  { x: 2.3, y: 2.4, z: -0.1 },
  { x: 2.5, y: 1.9, z: 1.2 },
  { x: 1.8, y: 0.37, z: 1.2 },
  { x: 3.24, y: 0.6, z: 1.05 },

  { x: 2.72, y: -0.9, z: 1.1 },
  { x: 1.8, y: -1.34, z: 1.67 },
  { x: 1.6, y: 1.99, z: 0.91 },
  { x: 2.8, y: 1.58, z: 1.69 },
  { x: 2.97, y: 2.3, z: 0.65 },

  { x: -1.3, y: -0.2, z: -2.5 },
  { x: 4, y: 1.78, z: 0.38 },
  { x: 1.72, y: 1.4, z: -1.29 },
  { x: 2.5, y: -1.2, z: -2 },
  { x: 3.5, y: -0.58, z: 0.1 },

  { x: 0.1, y: 0.4, z: -2.42 },
  { x: 4.5, y: 0.55, z: -0.5 },
  { x: 3.87, y: 0, z: 1 },
  { x: 4.6, y: -0.1, z: 0.65 },
  { x: 3, y: 1.5, z: -0.7 },

  { x: 2.3, y: 0.6, z: -2.6 },
  { x: 4, y: 1.5, z: -1.6 },
  { x: 3.35, y: 0.25, z: -1.5 },
  { x: 4.76, y: -1.26, z: 0.4 },
  { x: 4.32, y: 0.85, z: 1.4 },

  { x: 3.5, y: -1.82, z: 0.9 },
  { x: 3.6, y: -0.6, z: 1.46 },
  { x: 4.55, y: -1.5, z: 1.63 },
  { x: 3.8, y: -1.15, z: 2.1 },
  { x: 2.9, y: -0.25, z: 1.86 },

  { x: 2.2, y: -0.4, z: 1.86 },
  { x: 5.1, y: -0.24, z: 1.86 },
  { x: 5.27, y: 1.24, z: 0.76 },
  { x: 5.27, y: 2, z: -0.4 },
  { x: 6.4, y: 0.4, z: 1 },

  { x: 5.15, y: 0.95, z: 2 },
  { x: 6.2, y: 0.5, z: -0.8 },
  { x: 4, y: 0.08, z: 1.8 },
];

/* CinematicIntro */
export const TOTAL_SCENES = 14;

export const DARK_START_SCENE = 6;

export const INTROLINES = [
  "Asking questions is important...",
  "Right ?...",
  "So let's start with one.",
];

export const BUILDINGLINES = [
  "Building isn't hard.",
  "Knowing what to build is.",
  "Knowing WHY to build it...",
  "is even harder.",
];

export const PROBLEMQUESTIONS = [
  "I don't start with code.",
  "I start with questions.",
  "Who uses it?",
  "Why does it exist?",
  "What breaks if it fails?",
  "How will it scale?",
  "How will it survive?",
  "Code is the last step.",
];

export const AICLAIMS = [
  "YES.",
  "AI can write code.",
  "AI can refactor code.",
  "AI can deploy code.",
];

export const BUSINESSQUESTIONS = [
  "Can it understand your business?",
  "Can it protect your data?",
  "Can it see what isn't obvious?",
  "Can it predict what breaks six months later?",
];

export const VULNERABILITIES = [
  "Data corruption.",
  "Race condition in production.",
  "Privilege escalation.",
  "Memory leak after 3 months.",
  "User data leak.",
  "Multi-tenant data exposure.",
  "Distributed cache inconsistency.",
  "Deadlock under peak traffic.",
  "Event ordering failure.",
  "And more...",
];

export const PHILOSOPHY = [
  "I don't build websites.",
  "I build experiences.",
  "I don't write code.",
  "I design systems.",
  "I don't chase trends.",
  "I solve problems.",
  "Reliability comes from consistency",
  "Consistency comes from clarity"
];

export const REWINDLINES = [
  "I solve problems.",
  "I don't chase trends.",
  "I design systems.",
  "I don't write code.",
  "I build experiences.",
  "I don't build websites.",
  "Experience prevents disasters.",
  "Intelligence generates code.",
  "Distributed cache inconsistency.",
  "Race condition in production.",
  "Silent data corruption.",
  "Can it predict what breaks six months later?",
  "Can it protect your data?",
  "Can it understand your business?",
  "I specialize in tools.",
  "Great software isn't written.",
  "It's discovered.",
  "Code is the last step.",
  "Why does it exist?",
  "Who uses it?",
  "Knowing WHY to build it...",
  "Knowing what to build is.",
  "My name is AKHIL.",
];

export const HISTORYBANDS = [
  {
    year: "2018",
    text: "Learning. Experimenting. Breaking things. Building taste. Asking why. Shipping small.Learning. Experimenting. Breaking things.",
    dir: "left",
  },
  {
    year: "2020",
    text: "Building. Failing. Building again. Learning resilience. Reading systems. Staying curious.Building. Failing. Building again.",
    dir: "right",
  },
  {
    year: "2022",
    text: "Understanding systems. Not just code. Thinking in flows. Constraints. Tradeoffs. Outcomes.Understanding systems. Not just code.",
    dir: "left",
  },
  {
    year: "2024",
    text: "Engineering products. Solving real problems. Designing trust. Making things work beautifully.Engineering products. Solving real problems.",
    dir: "right",
  },
];

export const SAMPLES = [
  "const trust = await verify(user, data);",
  "if (!permission) throw new Error('403');",
  "query = sanitize(input);",
  "cache.invalidate('session:' + id);",
  "await deploy(build());",
  "for (let i = 0; i < n; i++) optimize();",
  "server.on('error', recover);",
  "try { render() } catch (e) { alert(e) }",
  "db.transaction(async (tx) => await tx.commit());",
  "security.scan();",
];

export const ERRORBITS = [
  "RACE CONDITION DETECTED",
  "UNEXPECTED STATE MUTATION",
  "PERMISSION ESCALATION",
  "STALE CACHE WRITE",
  "MEMORY LEAK",
  "EVENT LOOP BLOCKED",
  "DANGLING REFERENCE",
  "SILENT DATA CORRUPTION",
  "INCONSISTENT REPLICA",
];

/* GlitchText */
export const CHARS =
  "!<>-_\\/[]{}—=+*^?#________ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/* WeatherIcon */
export const WEATHER_MAP = {
  clear: {
    icon: TiWeatherSunny,
    label: "Clear Sky",
  },

  cloudy: {
    icon: TiWeatherCloudy,
    label: "Cloudy",
  },

  rain: {
    icon: TiWeatherShower,
    label: "Rain",
  },

  storm: {
    icon: TiWeatherStormy,
    label: "Thunderstorm",
  },

  sunset: {
    icon: TiWeatherPartlySunny,
    label: "Sunset",
  },

  night: {
    icon: TiWeatherNight,
    label: "Night",
  },
};

export const MOON_MAP = {
  NEW_MOON: {
    icon: WiMoonAltNew,
    label: "New Moon"
  },

  WAXING_CRESCENT: {
    icon: WiMoonAltWaxingCrescent3,
    label: "Waxing Crescent"
  },

  FIRST_QUARTER: {
    icon: WiMoonAltFirstQuarter,
    label: "First Quarter"
  },

  WAXING_GIBBOUS: {
    icon: WiMoonAltWaxingGibbous3,
    label: "Waxing Gibbous"
  },

  FULL_MOON: {
    icon: WiMoonAltFull,
    label: "Full Moon"
  },

  WANING_GIBBOUS: {
    icon: WiMoonAltWaningGibbous3,
    label: "Waning Gibbous"
  },

  THIRD_QUARTER: {
    icon: WiMoonAltThirdQuarter,
    label: "Third Quarter"
  },

  WANING_CRESCENT: {
    icon: WiMoonAltWaningCrescent3,
    label: "Waning Crescent"
  },
};

/* Footer */
export const SOCIALS = [
  {
    icon: FaGithub, label: "GitHub", href: "https://github.com/akhilshettyym"
  },
  {
    icon: FaLinkedin, label: "LinkedIn", href: "https://linkedin.com/in/akhilshettym",
  },
  {
    icon: FaSalesforce, label: "Salesforce", href: "https://www.salesforce.com/trailblazer/akhilshettym",
  },
  {
    icon: SiLeetcode, label: "LeetCode", href: "https://leetcode.com/u/akhil_shetty_m",
  },
  {
    icon: FaInstagram, label: "Instagram", href: "https://www.instagram.com/akhil_shetty_m",
  },
  {
    icon: FaFileAlt, label: "Resume", href: "#"
  },
];

/* SelectedWorks */
export const PROJECTS = [
  {
    id: 1,
    title: "Nova Commerce",
    tagline: "Headless eCommerce Experience",
    when: "2025",
    type: "Web Platform",
    image: "/bumpImage.svg",
    url: "https://example.com",
    stack: ["Next.js", "Node", "Stripe", "Postgres"],
    description:
      "A modern commerce experience with high performance architecture.",
  },
  {
    id: 2,
    title: "Staffle",
    tagline: "Employee Management System",
    when: "2026",
    type: "Management",
    image: "/globeImage.svg",
    url: "https://example.com",
    stack: ["MongoDb", "Express", "React", "Node"],
    description:
      "Staffle is a full-stack Employee & Organization Management System built using the MERN stack. It supports multi-organization workflows with Super Admin, Admin, and Employee role-based control, task lifecycle management, and centralized organization governance.",
  },
  {
    id: 3,
    title: "Vision AI",
    tagline: "Computer Vision Dashboard",
    when: "2024",
    type: "AI Platform",
    image: "/globeImage.svg",
    url: "https://example.com",
    stack: ["React", "Python", "OpenCV"],
    description:
      "Real-time AI insights and visual analytics for enterprise teams.",
  },
  {
    id: 4,
    title: "Selected Work",
    tagline: "New project in progress",
    when: "2026",
    type: "Experimental",
    image: "",
    url: "",
    stack: [],
    description: "",
  },
];

export const CARD_WIDTH = 850;
export const CARD_HEIGHT = 520;
export const CTA_WIDTH = 175;
export const CTA_HEIGHT = 52;
export const EDGE_PADDING = 24;

/* BubbleScene */
export const BUBBLE_TEXT_GROUPS = [
  {
    index: "01",
    summary:
      "Engineering responsive interface layers optimized for sub-millisecond execution, fluid transitions, and deterministic state synchronization.",
  },
  {
    index: "02",
    summary:
      "Architecting resilient distributed systems, data processing layers, and scalable APIs that maintain consistency under peak traffic volumes.",
  },
  {
    index: "03",
    summary:
      "Enforcing rigorous deployment criteria, continuous observability pipelines, and fallback strategies designed to withstand real-world enterprise workloads.",
  }
];

/* CreateSomething */
export const SERVICES = [
  { id: "frontend", label: "Frontend Development" },
  { id: "backend", label: "Backend Engineering" },
  { id: "fullstack", label: "Fullstack Solutions" },
  { id: "mobile_app", label: "Mobile Applications" },
  { id: "cms", label: "CMS Integration" },
  { id: "ci_cd", label: "DevOps & CI/CD" },
  { id: "other", label: "Other Systems" },
];

export const BUDGET_OPTIONS = [
  { id: "under_1k", label: "Under $1,000" },
  { id: "1k_5k", label: "$1,000 - $5,000" },
  { id: "5k_10k", label: "$5,000 - $10,000" },
  { id: "10k_plus", label: "$10,000+" },
  { id: "not_sure", label: "Not Sure / Deciding" },
];

export const CLOUD_SHADER = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,

  fragmentShader: `
    uniform sampler2D map;
    uniform vec3 fogColor;
    uniform float fogNear;
    uniform float fogFar;
    varying vec2 vUv;

    void main() {
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      float fogFactor = smoothstep(fogNear, fogFar, depth);

      gl_FragColor = texture2D(map, vUv);
      gl_FragColor.w *= pow(gl_FragCoord.z, 20.0);
      gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
    }`,
};


/* SubjectProfile */
export const fadeInContainer = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.15,
    },
  },
};

export const itemReveal = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const carouselData = [
  "I build fast, smooth websites where performance is baked in from the start — delivering excellent results.",
  "I write clean, well-structured, and maintainable code focused on clarity, scalability, and long-term reliability.",
  "I design intuitive, consistent, and responsive interfaces that feel natural across all devices and screen sizes.",
  "Strong technical SEO, accessibility, and modern best practices are built in from day one — not added later.",
  "From concept to launch, I ensure clear communication, thoughtful planning, and reliable, rigorously tested delivery.",
];

export const welcomeTexts = [
  "HELLO, GLAD YOU'RE HERE.",
  "WELCOME TO MY CREATIVE SPACE.",
  "LET'S CREATE SOMETHING REMARKABLE.",
  "CRAFTING DIGITAL EXPERIENCES FOR YOU.",
  "READY TO BRING IDEAS TO LIFE?",
];