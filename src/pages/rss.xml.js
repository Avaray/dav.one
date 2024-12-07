import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteTitle, siteDescription } from '../consts';

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items: articles.map((article) => ({
      ...article.data,
      pubDate: article.data.updated || article.data.created,
      link: `/${article.id}/`,
    })),
  });
}
