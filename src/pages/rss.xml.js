import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteTitle, siteDescription } from '../consts';

export async function GET(context) {
  const articles = await getCollection('article', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items: articles.map((post) => ({
      ...post.data,
      pubDate: post.data.updated || post.data.created,
      link: `/${post.slug}/`,
    })),
  });
}
