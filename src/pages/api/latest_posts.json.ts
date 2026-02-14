import { getCollection } from "astro:content";

export async function GET() {
    const posts = await getCollection("blog", ({ data }) => {
        return import.meta.env.PROD
            ? data.draft !== true && data.pubDate <= new Date()
            : true;
    });

    const sortedPosts = posts
        .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
        .slice(0, 10);

    return new Response(
        JSON.stringify(
            sortedPosts.map((post) => ({
                title: post.data.title,
                pubDate: post.data.pubDate,
                description: post.data.subtitle || "",
                slug: post.slug,
                url: `/blog/${post.slug}/`,
                tags: post.data.tags,
            }))
        ),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}
