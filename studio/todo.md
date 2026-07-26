### check for domain prices

- [backend] - (https://portfolio-backend-cjvf.onrender.com)

- [adminui] - (https://portfolio-adminui.vercel.app)

---

**DONE**

- DONE [clientui] - `SelectedWorks.jsx` - project popup should be smaller for small devices.
- DONE [clientui] - `SelectedWorks.jsx` - For tier_2 add a pop up modal, instead of having a mouse hover concept.
- DONE [clientui] - `Loader.jsx` - Rebuild from scratch keeping just the background.
- DONE[clientui] - `SelectedWorks.jsx` - project section should be enhanced for higher tiers to work smoothly without delay.
- DONE[clientui] - `Navbar.jsx` - Color difference at the top and bottom.
- DONE[clientui] - `CinematicIntro n loader` - loader reveals the introsection, (Page reveal required, make sure the intro dosent run until the reveal is done).
- DONE[clientui] - `ConsoleModal.jsx` - enhance the boot sequence.
- DONE[clientui] - `ConsoleModal.jsx` - add some life while the user enters commands.

---

**optimizations** & **rebuilds** -

- [clientui] - `Check this` - select accurate, and inside deny the option.

- [clientui] - `HeroSection.jsx` - herosection with text expanded, with fluidity.
- [clientui] - `HeroSection.jsx` - ENHANCE the EXPLORE CTA.
- [clientui] - `HeroSection.jsx` - The clouds and the background takes time to render even though the user is in the viewport.

- [clientui] - `heroSection.jsx` - rebuild shades of clouds and background.

- [clientui] - `ConsoleModal.jsx` - update commands.

- [clientui] - `MySocials.jsx` - Rebuild from scratch.
- [clientui] - `MySocials.jsx` - Let the Socials section draw from the right and snap to the screen and then continue to scroll down.

- [clientui] - page roll from bottom to top

- [clientui] - `Footer.jsx` - Set footer image right.

- [clientui] - `MyExperience.jsx` - rebuild from scratch. (not looking great).

I use cookies for analytics. Just page views and basic usage data so I can see what's working. No tracking you around the internet. Privacy policy

that's fine
no thanks

- Add whats my tech stack.

- [clientui] - `performance` - Lazy load kicking in early exposing the herosection.

- [clientui] - `SEO n metadata` - add required data.

- [clientui] - `CreateSomething.jsx` - add test for the API. Reject multilpe responses and wire this properly.

- [clientui] - `lighthouse` - run a prod build and check for the scores.

- [clientui] - `CardStackReveal.jsx` - Add images to this (https://dumemearts.com/)
- [clientui] - `inspo` - (https://www.spasoje.dev/).

- [clientui] - `future enhancements` - Theme mods - light, dark, metal.

---

### Checklists:

#### adminui -

- load 10 and on demand load more.
- lint tests.
- jest unit tests, integration tests.
- prettier, code formatting tests.
- npm audit (ci/cd)

#### backend -

- load 10 and on demand load more.
- lint tests
- jest unit and integration tests.
- prettier, code formatting tests.
- Husky + lint-staged - before commit run.
- npm audit (ci/cd)

#### clientui -

- fix the api call to work when in local environment.
- lint tests.
- jest for unit and integration tests of the only api.
- prettier, code formatting tests.
- npm audit (ci/cd)



- Husky + lint-staged - before commit run.
---

1. The Missing Testing Layers:

While Jest covers the internals, you need tests that simulate real user behavior and look at the app as a whole.

End-to-End (E2E) Testing: Jest tests components in isolation or small groups. E2E tests spin up the whole app and test the entire user journey (e.g., logging in, adding to cart, checking out).

Recommended Tools: axe-core (can be integrated directly into your Jest or Playwright tests).


3. Deep Security & Compliance:

npm audit is great for checking other people's code (dependencies), but what about your code?

Static Application Security Testing (SAST): Scans your source code for security vulnerabilities, hardcoded API keys, or logic bugs.

Recommended Tools: SonarQube, Snyk, or CodeQL (built into GitHub).

Secret Scanning: Prevents developers from accidentally pushing .env files or AWS keys to the repository.
Recommended Tool: `gitleaks` or GitHub Secret Scanning.

4. Workflow Automation (The Velvet Rope):

Don't wait for the CI/CD pipeline to tell a developer they missed a semicolon. Catch it before the code even leaves their machine.

Pre-commit Hooks: Run a subset of your tests, formatting, and linting locally right when a developer types git commit. If it fails, the commit is blocked.

Recommended Tools: `Husky + lint-staged` (so it only tests the files that were actually changed, keeping it lightning-fast).

Where to start?
Don't try to add all of these at once, or your team will mutiny. Start with Husky/Prettier for instant quality-of-life improvements, enforce a Jest coverage threshold, and then look into Playwright for your critical user paths.


---

base branch strict
github actions

@axe-core/react

timeline - this week.

- react (done).
- redux (done).
- zustand (pending).

        - nodejs & expressjs   -  next week

- reactjs
  redux
  zustand

Deployments, bundles, node, headers.

---

## Vercel & Render: Set to auto-deploy ONLY when code is merged into main.

Note: In GitHub, you can store different environment variables in Settings > Secrets and variables > Actions. You can create a DEV environment and a PRODUCTION environment there to hold your different MongoDB URIs or API keys.

---

### 2. The GitHub Actions CI Pipeline:

In GitHub Actions, Jobs run asynchronously (in parallel) by default, while the Steps inside each job run sequentially. This perfectly matches your requirement.

Create a file in your repository exactly here: .github/workflows/ci.yml and paste this code:

```YAML
name: CI Pipeline

# This triggers the pipeline when a PR is opened against main
on:
 pull_request:
   branches: [ "main" ]

jobs:
 # 1. SECURITY CHECKS
 security-audit:
   name: Security Audit
   runs-on: ubuntu-latest
   steps:
     - name: Checkout Code
       uses: actions/checkout@v4

     # We check all three folders for vulnerabilities
     - name: Audit Backend
       working-directory: ./backend
       run: npm audit --audit-level=high

     - name: Audit Admin UI
       working-directory: ./adminui
       run: npm audit --audit-level=high

     - name: Audit Client UI
       working-directory: ./clientui
       run: npm audit --audit-level=high

 # 2. BACKEND TESTS (Runs in parallel with UI tests)
 test-backend:
   name: Test Backend
   runs-on: ubuntu-latest
   needs: security-audit # Waits for security to pass first (optional)
   steps:
     - name: Checkout Code
       uses: actions/checkout@v4

     - name: Setup Node.js
       uses: actions/setup-node@v4
       with:
         node-version: '20' # Use your actual Node version

     - name: Install Dependencies
       working-directory: ./backend
       run: npm ci # 'npm ci' is faster and stricter than 'npm install'

     - name: Run Backend Tests
       working-directory: ./backend
       run: npm run test # Runs your backend tests sequentially

 # 3. ADMIN UI TESTS (Runs in parallel with Backend)
 test-adminui:
   name: Test Admin UI
   runs-on: ubuntu-latest
   needs: security-audit
   steps:
     - name: Checkout Code
       uses: actions/checkout@v4

     - name: Setup Node.js
       uses: actions/setup-node@v4
       with:
         node-version: '20'

     - name: Install Dependencies
       working-directory: ./adminui
       run: npm ci

     - name: Run Admin UI Tests
       working-directory: ./adminui
       run: npm run test

 # 4. CLIENT UI TESTS (Runs in parallel with Backend and Admin UI)
 test-clientui:
   name: Test Client UI
   runs-on: ubuntu-latest
   needs: security-audit
   steps:
     - name: Checkout Code
       uses: actions/checkout@v4

     - name: Setup Node.js
       uses: actions/setup-node@v4
       with:
         node-version: '20'

     - name: Install Dependencies
       working-directory: ./clientui
       run: npm ci

     - name: Run Client UI Tests
       working-directory: ./clientui
       run: npm run test
```

### 3. Enforcing the Rules (Branch Protection):

The pipeline above won't protect production if you can still bypass it. You need to lock down your main branch:

- Go to your GitHub Repository Settings.
- Click Branches on the left sidebar.
- Click Add branch protection rule.
- In Branch name pattern, type main.
- Check Require a pull request before merging.
- Check Require status checks to pass before merging.
  In the search box that appears, search for and select the names of your jobs (e.g., Test Backend, Test Admin UI, Test Client UI).
  Save changes.

---

---

### Prettier for code formatting.

1. Installations:

```Bash
npm install --save-dev prettier eslint-config-prettier
```

2. Configuration Files to Create

#### Create .prettierrc

This file outlines your specific styling rules. Create a file named `.prettierrc` and paste your formatting rules (feel free to adjust these to your team's taste):

```JSON
{
 "semi": true,
 "singleQuote": true,
 "tabWidth": 2,
 "trailingComma": "es5",
 "printWidth": 80
}
```

Create .prettierignore
This tells Prettier which directories to ignore so it doesn't waste time trying to format compiled code or third-party packages. Create a file named .prettierignore:
Plaintext

.next/
node_modules/
build/
dist/
public/
*.lock

3. Update Your ESLint Configuration:
   Because your project is running ESLint v9 and Next.js 16, your project uses the new flat configuration format (typically named eslint.config.mjs or eslint.config.js).

Open your ESLint configuration file and import eslint-config-prettier, appending it to the end of your configuration array so it overrides standard layout rules:

```JavaScript
import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier'; // 1. Import the package

const eslintConfig = defineConfig([
 ...nextVitals,
 prettier, // 2. Place it last in the array
]);

export default eslintConfig;
```

4. Final Updated package.json:

Here is your updated package.json.
Testing Best Practice Note: For the prettier script executed inside npm run test, we use the --check flag. This scans your project and actively throws an error (failing the build) if a developer forgot to format their code. A separate prettier:fix command is added so you can automatically format the codebase on demand.

```JSON
{
 "name": "adminui",
 "version": "0.1.0",
 "private": true,
 "scripts": {
   "dev": "next dev",
   "build": "next build",
   "start": "next start",
   "lint": "eslint .",
   "prettier": "prettier --check .",
   "prettier:fix": "prettier --write .",
   "test": "npm run lint && npm run prettier"
 },
 "dependencies": {
   "next": "16.2.9",
   "react": "19.2.4",
   "react-dom": "19.2.4",
   "react-icons": "^5.7.0",
   "react-toastify": "^11.1.0"
 },
 "devDependencies": {
   "@tailwindcss/postcss": "^4",
   "eslint": "^9",
   "eslint-config-next": "16.2.9",
   "eslint-config-prettier": "^10.0.0",
   "prettier": "^3.5.0",
   "tailwindcss": "^4"
 }
}
```

How it works now:

npm run test: Sequentially fires your linter first, followed by your formatting check. If your code has syntax errors OR unformatted files, the script will exit with an error.
npm run prettier:fix: Run this manually whenever your test suite fails due to Prettier. It will instantly re-align and auto-format your code based on your rules.
