#!/usr/bin/env node
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Run after a production build. No extra dependencies or network access required.
const root = fileURLToPath(new URL("../../../../", import.meta.url));
const dist = resolve(root, "dist");
const read = path => readFile(resolve(root, path), "utf8");
const html = await read("dist/index.html");
const base = html.match(/<base\s+href="([^"]+)"/u)?.[1];
const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/u)?.[1];
assert(base && canonical, "Homepage must declare its base and canonical URL");
const site = new URL(base, canonical);
assert(site.pathname.endsWith("/"), "Site base must end in /");

async function checkLocalUrl(value) {
    const url = new URL(value, site);
    assert.equal(url.origin, site.origin, `Unexpected site origin: ${url}`);
    assert(url.pathname.startsWith(site.pathname), `URL is outside site base: ${url}`);
    const relative = decodeURIComponent(url.pathname.slice(site.pathname.length));
    const target = resolve(dist, relative, ...(url.pathname.endsWith("/") ? ["index.html"] : []));
    assert(target.startsWith(dist + sep), `URL escapes build directory: ${url}`);
    await access(target).catch(() => assert.fail(`Missing built file for ${url}`));
}

for (const route of [
    "",
    "blog/",
    "blog/1/",
    "blog/2/",
    "page/about/",
    "page/archive/",
    "page/links/",
    "post/using-mdx/",
    "post/unlisted-post/",
]) {
    await checkLocalUrl(new URL(route, site));
}
const draftExists = await access(resolve(dist, "post/draft-post/index.html")).then(
    () => true,
    () => false,
);
assert.equal(draftExists, false, "Draft post must not have a public route");

for (const path of [
    "dist/blog/index.html",
    "dist/blog/1/index.html",
    "dist/blog/2/index.html",
    "dist/page/archive/index.html",
    "dist/rss.xml",
]) {
    const text = await read(path);
    assert(!/\/(?:draft-post|unlisted-post)\//u.test(text), `Hidden post leaked into ${path}`);
}

const rss = await read("dist/rss.xml");
const items = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/gu)].map(match => match[1]);
assert(items.length > 0, "RSS must contain published posts");
let previousDate = Infinity;
for (const item of items) {
    const link = item.match(/<link>([^<]+)<\/link>/u)?.[1];
    const date = Date.parse(item.match(/<pubDate>([^<]+)<\/pubDate>/u)?.[1]);
    assert(link, "RSS item must have a link");
    assert(Number.isFinite(date) && date <= previousDate, "RSS must be sorted newest first");
    previousDate = date;
    await checkLocalUrl(link);
}

const sitemapIndex = await read("dist/sitemap-index.xml");
const sitemaps = [...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(match => match[1]);
assert(sitemaps.length > 0, "Sitemap index must contain a sitemap");
let sitemapPages = 0;
for (const url of sitemaps) {
    await checkLocalUrl(url);
    const relative = new URL(url).pathname.slice(site.pathname.length);
    const sitemap = await readFile(resolve(dist, decodeURIComponent(relative)), "utf8");
    const links = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/gu)].map(match => match[1]);
    assert(links.length > 0, "Sitemap must contain pages");
    for (const link of links) {
        assert(!link.includes("/draft-post/"), "Draft post leaked into sitemap");
        await checkLocalUrl(link);
        sitemapPages++;
    }
}

const mdx = await read("dist/post/using-mdx/index.html");
assert(mdx.includes("MDX 中的嵌入组件") && mdx.includes('onclick="alert('), "MDX example component was not rendered");
const markdown = await read("dist/page/about/index.html");
assert(markdown.includes("脚注") && markdown.includes("文档内容的脚注"), "Localized footnotes were lost");
const images = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gu)].map(match => match[1]);
assert(images.length > 0, "Homepage must contain images");
for (const image of images) {
    const url = new URL(image, site);
    if (url.origin === site.origin) await checkLocalUrl(url);
}

const ts = JSON.parse(await read("node_modules/typescript/package.json"));
assert(Number(ts.version.split(".")[0]) < 7, `TypeScript 7+ is currently excluded: ${ts.version}`);
console.log(
    `Build smoke checks passed: ${items.length} RSS items, ${sitemapPages} sitemap pages, TypeScript ${ts.version}.`,
);
console.log(`Verified site base: ${site}`);
