### 关于链接页面

顾名思义，链接页面可以放置各种链接（社交网络地址、友情链接、团队成员等）。

你可以在 `src/pages/page/links.astro` 下自行修改要展示的链接，以及页面的其它元素：

```astro
<!-- 链接页面的外壳 -->
<BlogPage title="链接" description="来看看我的小伙伴们吧！">
    <!-- 链接分类名称 -->
    <FriendCategoryTitle>链接分类</FriendCategoryTitle>
    <!-- 链接列表外壳 -->
    <FriendList>
        <!-- 
            链接项目。可以指定的参数包括：
            - `url`: 链接地址
            - `name`: 链接名称
            - [可选] `description`: 链接简介
            - [可选] `avatarUrl` 链接的头像 URL
        -->
        <Friend url="https://www.tcdw.net" name="吐槽大王部落格" description="本 Astro 博客主题的作者" avatarUrl="https://secure.gravatar.com/avatar/70ae2023afad30dae905344325cece8f?s=140" />
        <Friend url="https://example.com" name="测试链接" description="这是一个测试链接" />
        <Friend url="https://example.com" name="测试链接" description="这是一个测试链接" />
    </FriendList>
    <!-- 链接页面的简介，通过页面组件顶部引入的本 Markdown 文件会被渲染在这里 -->
    <MarkdownBody class="mt-6">
        <linksDescription.Content />
    </MarkdownBody>
</BlogPage>
```
