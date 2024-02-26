import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		// 文章标题
		title: z.string(),

		// 文章简介，如果不指定则自动生成
		description: z.string().optional(),

		// 文章发布日期，支持 ISO8601 时间戳
		pubDate: z.coerce.date(),

		// 文章修改日期，支持 ISO8601 时间戳
		updatedDate: z.coerce.date().optional(),

		// 文章的主题图片，用于在 Open Graph 中显示
		heroImage: z.string().optional(),

		// 文章为草稿（不发布）
		draft: z.boolean().optional(),

		// 文章在博文列表和 RSS 不可见，但可以通过链接访问
		unlisted: z.boolean().optional(),
	}),
});

export const collections = { blog };
