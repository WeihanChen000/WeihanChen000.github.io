import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );

  return rss({
    title: "Weihan Chen | Build Log",
    description: "记录 AI、学习工具与桌面软件的设计和实现。",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `posts/${post.id}/`
    }))
  });
}
