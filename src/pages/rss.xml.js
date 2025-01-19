import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { siteDescription, siteTitle } from "../consts";

function rssDateFromTimestamp(timestamp) {
  // Create a new Date object from the Unix timestamp (converting seconds to milliseconds)
  const date = new Date(timestamp * 1000);
  // Return the date in RFC-2822 format, which is required for RSS feeds
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
