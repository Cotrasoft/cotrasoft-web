import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { DEFAULT_LOCALE, SITE_DESCRIPTION, SITE_TITLES } from "../consts";
import { getBlogPosts } from "../lib/blog";

export async function GET(context: APIContext) {
  const posts = await getBlogPosts();
  return rss({
    title: SITE_TITLES[DEFAULT_LOCALE],
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.id}/`,
    })),
  });
}
