import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import {
  DEFAULT_LOCALE,
  SITE_DESCRIPTION,
  SITE_TITLES,
  SITE_URL,
} from "../consts";
import { getBlogPosts } from "../lib/blog";

export const GET = (async ({ site }) => {
  const posts = await getBlogPosts();
  return rss({
    title: SITE_TITLES[DEFAULT_LOCALE],
    description: SITE_DESCRIPTION,
    site: site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
    })),
  });
}) satisfies APIRoute;
