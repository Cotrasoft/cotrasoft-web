import { getCollection, type CollectionEntry } from 'astro:content';

/** All published posts (or all of them in dev), newest first. */
export async function getBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog', ({ data }) =>
		import.meta.env.DEV || data.published === true,
	);
	return posts.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}
