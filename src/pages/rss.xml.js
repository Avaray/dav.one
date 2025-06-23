import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteDescription, siteTitle } from "../consts.ts";

function rssDateFromTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Validate the date
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${timestamp}`);
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
      link: `/${article.id}/`,
    })),
  });
}
