# 好耶，是 Koi

欢迎使用 Astro Koi 博客模板！本模板是基于 [Astro](https://astro.build/) 官方博客模板脚手架修改而来。您可以使用本模板：

- 开设博客
- 自豪的展示自己的 [原创角色](https://zh.moegirl.org.cn/zh-hans/%E5%8E%9F%E5%88%9B%E8%A7%92%E8%89%B2)，或者是您喜欢的其它大图
- 以及更多用途（？

本模板提供了预先配置好的 Astro 配置文件 `astro.config.js` 和 Tailwind CSS 配置文件 `src/styles/global.css`，同时还将博客常见设置封装在 `src/consts.ts` 中，这样您可以在不修改模板本体的代码的情况下，就能实现基础的个性化需求。

## 使用指南

本模板包含的示例文章/页面本体就是文档 (self-documented)，您可以参考里面的内容对模板进行调整。

## 我想让首页直接展示博文列表

将本页面 `src/index.astro` 替换为如下内容：

```astro
---
import { filterPosts } from "@/utils/misc";
import { getCollection } from 'astro:content';
import BlogPostList from "@/layouts/BlogPostList.astro";
import { BLOG_PAGINATION_SIZE } from "@/consts";

const posts = filterPosts(await getCollection('blog'), {
    filterDraft: true,
    filterUnlisted: true,
});
const latestPosts = posts.slice(0, BLOG_PAGINATION_SIZE);
---

<BlogPostList data={latestPosts} currentPage={1} lastPage={Math.ceil(posts.length / BLOG_PAGINATION_SIZE)} />
```

然后删除 `src/_index.md` 即可。

## 鸣谢

本样板站头图来自：

- （明亮主题）[Ravimo](https://raviolimavioli.github.io/)，遵循 CC BY 4.0 许可证使用。[原图](https://www.pixiv.net/artworks/103383813)
- （暗黑主题）[◂Ⓘ▸YAYOI の 夢](https://twitter.com/Yayoi_no_yume)

<details>
<summary>为什么选择了这么一张暗黑模式的图片？</summary>
其实我很早就有了关于这款博客主题的脑洞，并且在 2023 年 11 月就把样式做出来了。但是，我一直苦于缺乏美丽的、能够取得授权的图片（虽然之前跟有 OC 的熟人拿了很多他们在 skeb 这种地方约的图，但是自己私下当壁纸用和把图片直接挂在公开的博客首页，性质是很不一样的）。然后梦梦救了我，非常大方的同意我使用他的图片！🥰
</details>
