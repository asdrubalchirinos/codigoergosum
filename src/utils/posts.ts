import { getCollection } from "astro:content";

export type Post = import("astro:content").CollectionEntry<"blog">;

/**
 * Todos los posts publicados (misma regla que usaban las páginas de listado).
 */
export async function getPublishedPosts(): Promise<Post[]> {
	return await getCollection("blog", ({ data }) => {
		return import.meta.env.PROD
			? data.draft !== true && data.pubDate <= new Date()
			: true;
	});
}

/**
 * Agrupa cada post con sus traducciones. La clave es el slug del original
 * cuando existe; si el original no está en la colección, el post forma
 * grupo solo.
 */
function groupTranslations(posts: Post[]): Post[][] {
	const bySlug = new Map(posts.map((post) => [post.slug, post]));
	const groups = new Map<string, Post[]>();

	for (const post of posts) {
		const original = post.data.translationOf;
		const key = original && bySlug.has(original) ? original : post.slug;
		const group = groups.get(key);
		if (group) {
			group.push(post);
		} else {
			groups.set(key, [post]);
		}
	}

	return [...groups.values()];
}

/**
 * Dentro de un grupo, siempre prevalece la versión en español.
 * Si no hay versión en español, queda el original (o el primero).
 */
function pickPrimary(group: Post[]): Post {
	return (
		group.find((post) => post.data.lang === "es") ??
		group.find((post) => !post.data.translationOf) ??
		group[0]
	);
}

/**
 * Filtra los listados: de cada par ES/EN solo queda una entrada,
 * siempre la versión en español. Los posts sin traducción pasan tal cual.
 */
export function primaryVersions(posts: Post[]): Post[] {
	const kept = new Set(
		groupTranslations(posts).map((group) => pickPrimary(group).slug),
	);
	return posts.filter((post) => kept.has(post.slug));
}

/**
 * Slugs de los posts que deben mostrarse con la marca "EN" en los listados:
 * toda versión primaria de un grupo que contiene al menos una entrada en inglés.
 * (Incluye los posts que solo existen en inglés, que ya se marcaban como EN.)
 */
export function englishVersionSlugs(posts: Post[]): Set<string> {
	const slugs = new Set<string>();
	for (const group of groupTranslations(posts)) {
		if (group.some((post) => post.data.lang === "en")) {
			slugs.add(pickPrimary(group).slug);
		}
	}
	return slugs;
}
