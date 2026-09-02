import {
  logAbout,
  logAchievements,
  logCatReadme,
  logCoffee,
  logCreate,
  logExperience,
  logGithub,
  logHelp,
  logHero,
  logInstagram,
  logLinkedin,
  logLocation,
  logls,
  logMail,
  logMySocials,
  logPhilosophy,
  logPingAkhil,
  logPrivacy,
  logProjects,
  logrmrf,
  logPrivacy,
  logSalesforce,
  logSecrets,
  logSkills,
  logSocials,
  logSudoHire,
  logWhoAmI,
} from "@/utils/functions";

const NON_SLASH_COMMANDS = [
  "clear",
  "close",
  "ls",
  "whoami",
  "exit",
  "sudo hire akhil",
  "rm -rf akhil",
  "cat readme.md",
  "ping akhil",
  "me",
];

export function normalizeConsoleCommand(value) {
  const command = value.trim().toLowerCase();
  if (!command) return "";
  if (command.startsWith("/") || NON_SLASH_COMMANDS.some((item) => command.startsWith(item))) {
    return command;
  }
  return `/${command}`;
}

export function runConsoleCommand(rawCommand, { navigate, close, clear }, isTier2) {
  const command = normalizeConsoleCommand(rawCommand);

  const navToSocials = () => ({ output: logMySocials(), navigation: ["/", "socials"] });
  const commands = {
    "/hero": () => ({ output: logHero(), navigation: ["/", "hero"] }),
    "/about": () => ({ output: logAbout(), navigation: ["/", "about"] }),
    "/skills": () => ({ output: logSkills(), navigation: ["/", "skills"] }),
    "/achievements": () => ({
      output: logAchievements(),
      navigation: ["/", "achievements"],
    }),
    "/projects": () => ({ output: logProjects(), navigation: ["/work", "projects"] }),
    "/work": () => ({ output: logProjects(), navigation: ["/work", "projects"] }),
    "/experience": () => ({
      output: logExperience(),
      navigation: ["/work", "experience"],
    }),
    "/github": () => ({ output: logGithub(), navigation: ["/work", "github"] }),
    "/privacy": () => ({ output: logPrivacy(), navigation: ["/privacy"] }),
    "/connect": () => ({ output: logCreate(), navigation: ["/start"] }),
    "/privacy": () => ({ output: logPrivacy(), navigation: ["/privacy"] }),
    "/philosophy": () => ({ output: logPhilosophy() }),
    "/mail": () => ({ output: logMail() }),
    "/linkedin": () => ({ output: logLinkedin() }),
    "/instagram": () => ({ output: logInstagram() }),
    "/salesforce": () => ({ output: logSalesforce(), navigation: ["/work", "salesforce"] }),
    "/socials": () => (isTier2 ? { output: logSocials() } : navToSocials()),
    "/salesforce": () => ({ output: logSalesforce(), navigation: ["/work", "salesforce"] }),
    "/coffee": () => ({ output: logCoffee() }),
    "/secrets": () => ({ output: logSecrets() }),
    "/location": () => ({ output: logLocation() }),
    "/help": () => ({ output: logHelp() }),
    "/hire": () => ({ output: logSudoHire() }),
    "sudo hire akhil": () => ({ output: logSudoHire() }),
    "rm -rf doubts": () => ({ output: logrmrf() }),
    "cat readme.md": () => ({ output: logCatReadme() }),
    "ping akhil": () => ({ output: logPingAkhil() }),
    me: () => ({ output: logWhoAmI() }),
    whoami: () => ({ output: logWhoAmI() }),
    ls: () => ({ output: logls() }),
    clear: () => ({ action: clear }),
    close: () => ({ action: close }),
    exit: () => ({ action: close }),
    "": () => ({ output: "" }),
  };

  const result = commands[command]?.() || {
    output: `zsh: command not found: ${command}. Type /help for available commands.`,
  };

  if (result.navigation) {
    navigate(...result.navigation);
  }

  if (result.action) {
    result.action();
  }

  return result.output;
}
