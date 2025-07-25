import { execSync } from "node:child_process";

export const readableDate = (date: string, full = false) => {
  return new Date(Number(date)).toLocaleDateString("en-us", {
    year: "numeric",
    month: full ? "long" : "short",
    day: "numeric",
  });
};

export function getCurrentBranch() {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD")
      .toString()
      .trim();
    return branch;
  } catch (error) {
    console.error("Error getting git branch:", error);
    return "unknown";
  }
}

// I switched to Playwright script
// I will leave it here for now
export async function getPageSpeedScores(url: string = "https://dav.one") {
  url ? url : `https://${import.meta.env.SITE_URL}`;
  const apiKey = import.meta.env.GOOGLE_PAGESPEED_KEY || "";
  apiKey || console.error("Missing Google PageSpeed API key");
  const apiUrl = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
  );
  apiUrl.searchParams.append("url", url);
  apiUrl.searchParams.append("key", apiKey);
  // Can't pass multiple categories at once (comma separated)
  apiUrl.searchParams.append("category", "PERFORMANCE");
  apiUrl.searchParams.append("category", "ACCESSIBILITY");
  apiUrl.searchParams.append("category", "BEST_PRACTICES");
  apiUrl.searchParams.append("category", "SEO");

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    const data = await response.json();
    const categories = data.lighthouseResult?.categories || {};
    return {
      performance: categories.performance?.score * 100 || 0,
      accessibility: categories.accessibility?.score * 100 || 0,
      bestPractices: categories["best-practices"]?.score * 100 || 0,
      seo: categories.seo?.score * 100 || 0,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      performance: 0,
      accessibility: 0,
      bestPractices: 0,
      seo: 0,
    };
  }
}

export const calculatePercentageOf = (part: number, whole: number, round = false) =>
  round ? Math.round((part / whole) * 100) : (part / whole) * 100;

export const calculateBytesToMegabytes = (bytes: number) => bytes / 1024 / 1024;

export const calculateAverageNumber = (set: number[]) => {
  const numbers = set.filter((value) => typeof value === "number" && !isNaN(value));
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return numbers.length === 0 ? 0 : sum / numbers.length;
};

export const getHighestNumber = (set: number[]) => {
  const numbers = set.filter((value) => typeof value === "number" && !isNaN(value));
  return Math.max(...numbers);
};
