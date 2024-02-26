import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: 'https://tcdwww.neocities.org/koi',
  base: process.env.NODE_ENV === "production" ? "/koi/" : "",
  integrations: [mdx(), sitemap(), tailwind(), svelte()],
  markdown: {
    remarkRehype: {
      footnoteLabel: "脚注",
      footnoteBackLabel: '文档内容的脚注',
    }
  }
});
