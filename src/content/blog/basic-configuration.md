---
title: 'Koi 模板的基础配置'
description: '关于 Koi 模板的常见修改需求，可以通过修改配置文件实现'
pubDate: '2024-02-26'
---

## 基础配置

您可以通过修改 `src/consts.ts` 中的配置项来实现主要的配置项修改，以定制您的 Astro 博客站点。每个配置项的详细说明如下所示：

| 配置项                         | 说明                                                                                                |
|-----------------------------|---------------------------------------------------------------------------------------------------|
| `SITE_LANGUAGE`             | 定义网站的 `<html>` 语言标签，例如 `en` 表示英语，`zh-hans-CN` 表示简体中文。                                             |
| `SITE_TITLE`                | 网站名称，如 `Astro Koi`。                                                                               |
| `SITE_DESCRIPTION`          | 网站的副标题，用于简要介绍网站内容。                                                                                |
| `SITE_AUTHOR_NAME`          | 博主的昵称。                                                                                            |
| `SITE_AUTHOR_AVATAR`        | 博主的头像，值为 [Astro 图片对象](https://docs.astro.build/en/guides/images/#images-in-astro-files)。          |
| `SITE_COPYRIGHT_YEAR_START` | 网站版权起始年份，表明网站从哪一年开始拥有版权。                                                                          |
| `SITE_MENU`                 | 网站头部导航菜单，包括各菜单项的标题、链接地址和打开方式（当前页面或新标签页）。                                                          |
| `SITE_HEAD_IMAGE_DAY`       | 网站横幅背景图片（明亮主题），值为 [Astro 图片对象](https://docs.astro.build/en/guides/images/#images-in-astro-files)。 |
| `SITE_HEAD_IMAGE_NIGHT`     | 网站横幅背景图片（暗黑主题），值为 [Astro 图片对象](https://docs.astro.build/en/guides/images/#images-in-astro-files)。 |
| `BLOG_PAGINATION_SIZE`      | 一页展示的博文数量，用于控制博客列表的分页。                                                                            |

通过对这些配置项进行修改，您可以轻松地自定义您的 Astro 博客站点，包括网站的语言、主题、外观以及功能等方面。

## Astro 配置

对 Astro 本身的配置，需要修改 `astro.config.js` 文件。

```typescript
// （以上略）

// https://astro.build/config
export default defineConfig({
    // 网站的入口地址
    site: 'https://wwww.example.com',
    // 网站的基本 URL。如果网站就在域名根目录下，则保持为 `/` 即可
    // 但是如果是将网站放置在子路径下（例如 `https://example.github.io/my-site/`），则需要指定为 `/my-site/`
    base: process.env.NODE_ENV === "production" ? "/" : "",
    integrations: [mdx(), sitemap(), tailwind(), svelte()],
    markdown: {
        // Markdown 脚注段落的标题
        remarkRehype: {
            footnoteLabel: "脚注", 
            footnoteBackLabel: '文档内容的脚注',
        }
    }
});
```

## Tailwind CSS 配置

如果需要修改网站主色和强调色，以及对 Tailwind CSS 进行其它一些定制，则需要修改 `src/styles/global.css` 文件中关于 Tailwind CSS 的部分。

主色和强调色的调色盘可以通过 [UI Colors](https://uicolors.app/) 等工具快捷生成。生成完毕后，覆盖 `primary` 和 `accent` 的值即可。
