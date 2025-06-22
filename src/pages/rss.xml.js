import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteDescription, siteTitle } from "../consts.ts";

function rssDateFromTimestamp(timestamp) {
  let date;

  // Handle different timestamp formats
  if (typeof timestamp === "string") {
    // Try parsing string timestamp
    const parsed = parseInt(timestamp);
    if (!isNaN(parsed)) {
      timestamp = parsed;
    }
  }

  // Check if timestamp is in seconds (10 digits) or milliseconds (13 digits)
  if (timestamp.toString().length === 10) {
    // Convert seconds to milliseconds
    date = new Date(timestamp * 1000);
  } else if (timestamp.toString().length === 13) {
    // Already in milliseconds
    date = new Date(timestamp);
  } else {
    throw new Error(`Invalid timestamp format: ${timestamp}`);
  }

  // Validate the date
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date from timestamp: ${timestamp}`);
  }

  // Return the date in RFC-2822 format
  return date.toUTCString();
}

export async function GET(context) {
  const articles = await getCollection("articles", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items: articles.map((article) => ({
      ...article.data,
      pubDate: rssDateFromTimestamp(
        article.data.updated || article.data.created,
      ),
      link: `/${article.slug}/`,
    })),
  });
}
