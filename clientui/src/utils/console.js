import { logAbout, logAchievements, logCatReadme, logCoffee, logCreate, logExperience, logGithub, logHelp, logInstagram, logLinkedin, logLocation, logls, logMail, logPhilosophy, logPingAkhil, logProjects, logrmrf, logSalesforce, logSecrets, logSkills, logSocials, logSudoHire, logWhoAmI } from "@/utils/funct";

const NON_SLASH_COMMANDS = ["clear", "close", "ls", "whoami", "exit", "sudo", "rm", "cat", "ping", "git", "work", "me"];

export function normalizeConsoleCommand(value) {
  const command = value.trim().toLowerCase();

  if (!command) return "";
  if (command.startsWith("/") || NON_SLASH_COMMANDS.some((item) => command.startsWith(item))) {
    return command;
  }

  return `/${command}`;
}

export function runConsoleCommand(rawCommand, { navigate, close, clear }) {
  const command = normalizeConsoleCommand(rawCommand);

  const commands = {
    "/about": () => ({ output: logAbout(), navigation: ["/", "about"] }),
    "/skills": () => ({ output: logSkills(), navigation: ["/", "skills"] }),
    "/achievements": () => ({ output: logAchievements(), navigation: ["/", "achievements"] }),
    "/projects": () => ({ output: logProjects(), navigation: ["/work", "projects"] }),
    "/work": () => ({ output: logProjects(), navigation: ["/work", "projects"] }),
    "/experience": () => ({ output: logExperience(), navigation: ["/work", "experience"] }),
    "/github": () => ({ output: logGithub(), navigation: ["/work", "github"] }),
    "/connect": () => ({ output: logCreate(), navigation: ["/start"] }),
    "/create": () => ({ output: logCreate(), navigation: ["/start"] }),
    "/philosophy": () => ({ output: logPhilosophy() }),
    "/mail": () => ({ output: logMail() }),
    "/linkedin": () => ({ output: logLinkedin() }),
    "/instagram": () => ({ output: logInstagram() }),
    "/salesforce": () => ({ output: logSalesforce() }),
    "/socials": () => ({ output: logSocials() }),
    "/coffee": () => ({ output: logCoffee() }),
    "/secrets": () => ({ output: logSecrets() }),
    "/location": () => ({ output: logLocation() }),
    "/help": () => ({ output: logHelp() }),
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