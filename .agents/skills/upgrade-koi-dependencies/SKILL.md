---
name: upgrade-koi-dependencies
description: 维护 Koi 项目依赖：用 bunx taze major 检查并升级 npm 依赖、pnpm、Node.js 和 GitHub Actions，处理 breaking changes，验证 Astro 静态博客。用户要求日常依赖维护、更新依赖、运行 taze 或修复升级兼容性时使用。现阶段排除 TypeScript 7 及更高版本。
---

# Koi 依赖维护

在仓库根目录执行以下流程。完成安装、兼容性修复和验证后交付可审查的改动。

## 1. 确认基线

- 读取 `git status --short`、项目指令、`package.json`、`pnpm-workspace.yaml`、`.node-version`、`.github/workflows/deploy.yml` 及 Astro/Svelte/TypeScript 配置。保护已有改动。
- 默认覆盖项目依赖、pnpm、Node 和 GitHub Actions；遵循用户本次明确收窄的范围。
- 使用 Bun 运行 taze，使用项目声明的 pnpm 安装依赖并维护 `pnpm-lock.yaml`。不要生成 Bun/npm/Yarn 锁文件。
- 在改动前记录 `node --version`、`pnpm --version`，运行 `pnpm exec astro check` 和 `pnpm build`，区分既有问题与升级回归。已有安装不可用时先用 `pnpm install --frozen-lockfile` 恢复基线。

## 2. 检查并选择版本

```sh
bunx taze major
bunx taze major --exclude 'typescript@>=7' --json
```

- 保持 TypeScript 低于 7，包括实际安装和锁文件中的版本。只有用户明确解除限制才允许迁移；届时同步修改本 skill 和验收脚本的限制。
- 检查当前 `bunx taze --help`。新版 taze 同时检查 `packageManager`、GitHub Actions 与 `.node-version`，`--write` 也可能修改这三类来源。
- 先查看只读结果，再写入。仅维护 npm 依赖时加 `--no-github-actions --no-node-version`；需要保留 pnpm 时再排除 `pnpm`。
- `typescript@>=7` 排除候选更新，不保证查出 6.x 的新版本。需要时单独运行 `bunx taze minor --include typescript --no-github-actions --no-node-version`，核实候选仍低于 7 后再加 `--write`。
- 对跨主版本更新和相关运行时要求查阅官方 release notes、migration guide、`engines` 与 `peerDependencies`。搜索结果过时时以对应 tag 源码和 registry 元数据为准，不凭主版本号猜测迁移步骤。

## 3. 升级并处理兼容性

```sh
bunx taze major --exclude 'typescript@>=7' --write
```

检查 diff 后切换到 `.node-version` 和 `package.json#packageManager` 声明的工具版本，再执行：

```sh
node --version
pnpm --version
pnpm install
```

- 使用当前环境已有的版本管理器；例如 proto 可读取 `.node-version`。不要为了项目升级修改全局默认版本。确认命令的实际版本，不能只改声明。
- 保留 `pnpm-workspace.yaml` 中明确的构建许可；当前允许 `esbuild` 与 `sharp`。遇到安装或 peer 错误时查明原因，不通过关闭策略、忽略 engines、强制安装或放宽类型检查掩盖问题。
- 检查 taze 对 YAML 的重写，恢复无关缩进和注释漂移。保留工作流的权限、触发器和部署环境。
- 让 CI 的 Node 输入读取 `.node-version`。`withastro/action@v6` 默认 Node 是 24，不会自动读取该文件；仓库已有读取步骤，保留其连接。
- 让 Astro Action 从 `pnpm-lock.yaml` 与 `package.json` 检测 pnpm 版本；不要恢复 `package-manager: pnpm@latest`。
- 核实 checkout 的 runner 要求、Astro Action 上传的 Pages artifact 与 deploy Action 的兼容性。不要仅靠本地构建宣称远端部署通过。

关注 Koi 的耦合点：

| 区域 | 检查要点 |
| --- | --- |
| Astro / MDX | 配套升级 `astro`、`@astrojs/mdx`、`@astrojs/markdown-remark`。MDX 8 将处理委托给 Markdown processor；当前显式 `unified()` 需要 markdown-remark ≥7.3.0，并满足 MDX 的 Astro peer 范围。保留中文脚注选项，验证 MDX 中的 Astro 组件。 |
| Svelte | 验证 `@astrojs/svelte`、Svelte、`vitePreprocess()` 和 `HeaderNav.svelte` 的 hydration、滚动及移动菜单。 |
| Tailwind | 配套核对 `tailwindcss`、`@tailwindcss/vite`、typography 和 `tailwind-merge`，检查响应式导航与明暗主题。 |
| 内容与路由 | 保留内容集合 schema、日期排序、分页、草稿过滤和未列出文章的直链访问。文章路径是 `post/{id}/`，RSS 不应使用 `blog/{id}/`。 |
| 生产部署 | 从配置读取 site/base；当前生产路径是 `/koi/`，dev 的 base 为空。检查 base、canonical、RSS、sitemap 和资源路径。 |
| 图片 | `sharp` 含原生组件；更换 Node/sharp 后做一次真实图片转换，避免仅复用 Astro 图片缓存而漏检。 |

按实际错误最小化修复。若发现相关功能的既有缺陷，明确标记其来源；不要为了制造迁移改动而重构正常代码。

## 4. 完成验证

依次执行，避免安装与构建竞争：

```sh
pnpm install --frozen-lockfile
pnpm exec astro check
pnpm build
node .agents/skills/upgrade-koi-dependencies/scripts/check-build.mjs
bunx taze major --exclude 'typescript@>=7' --force
git diff --check
```

- 运行附带的 `scripts/check-build.mjs` 检查实际产物：关键页面、草稿/未列出文章筛选、RSS 日期排序及链接对应文件、sitemap 路径、MDX 嵌入组件、中文脚注、首页图片与 TypeScript 版本。脚本不安装依赖、不访问网络。
- 将示例内容作为烟测用例。若项目有意修改示例文章、分页数量或渲染标记，先核实内容意图再调整脚本；不要为消除失败而跳过真实回归。
- 检查 `pnpm list --depth 0` 和锁文件，确认直接依赖与 peer 满足要求、TypeScript 没有越过限制。
- 更换 Node/sharp 时执行实际转换：`node --input-type=module -e 'import sharp from "sharp"; const image = await sharp("src/assets/akkarin.jpg").resize(32).webp().toBuffer(); if (!image.length) throw new Error("sharp produced no output"); console.log("sharp WebP conversion OK");'`。
- 用 `pnpm preview --host 127.0.0.1` 预览生产构建，访问带生产 base 的 URL。浏览器验证首页、博客分页、Markdown/MDX、关于/归档/友链、移动菜单开合和跳转、滚动导航、明暗主题；检查 console 和 page errors。
- 修改 GitHub Actions 后解析 YAML 并核对 Action 输入；可用时运行 actionlint。远端 CI 未执行时如实注明。
- 没有 test/lint 脚本时不要虚构命令或通过结果；以现有 Astro 检查、构建、产物烟测和浏览器检查为准。

## 5. 交付

报告主要版本变化、兼容性处理、保留版本及原因、验证结果和仍受外部环境限制的检查。若只有 TypeScript 7+ 被跳过，明确说明其余约定范围已更新。保持工作区可审查；只有用户另行要求时才提交、推送或部署。
