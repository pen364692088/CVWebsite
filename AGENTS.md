# AGENTS Guide

## 项目概览

- 项目类型：Next.js App Router 单页作品站
- 站点名称：`Ashen Archive`
- 目标人设：`Zhouyu Liao`
- 部署目标：GitHub Pages，子路径 `/CVWebsite/`
- 当前视觉方向：`Dark Fantasy + Modern Minimal`
- 当前首页方向：`Abyss Museum / Scene-led Hero`
- 支持语言：`en`、`zh-CN`、`ja`、`ko`

## 技术栈

- Next.js
- React
- TypeScript 严格模式
- Tailwind CSS
- Motion

建议与 CI 对齐：

- Node 20+

## 目录地图

- `app/`
  App Router 路由入口。`app/page.tsx` 是语言网关，`app/[locale]/page.tsx` 是主站单页。

- `components/`
  可复用组件与交互组件，包括语言切换、作品详情弹层、sigil 阅读控制器等。

- `sections/`
  单页各区块实现：Hero、About、Disciplines、Artifacts、Game、Contact。

- `data/`
  所有易变内容源，包括多语言字典、作品数据、联系信息与简历数据。

- `lib/`
  站点常量、`basePath` 相关工具、语言判定逻辑。

- `styles/`
  全局 theme token。

- `public/`
  dossier 资源、Abyss hero 图层、氛围粒子、项目封面与示意图等可替换资源。

- `scripts/`
  构建后静态导出校验、Playwright 验证与本地链接检查。

- `.github/workflows/deploy.yml`
  GitHub Pages 静态导出部署流程。

## 关键运行命令

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run verify:static
npm run verify:links
```

本地开发地址：

```bash
http://localhost:3000/CVWebsite
```

## 关键约束

### 1. 不能破坏 GitHub Pages 子路径

`next.config.mjs` 固定包含：

- `output: "export"`
- `basePath: "/CVWebsite"`
- `trailingSlash: true`
- `images.unoptimized: true`

这意味着：

- 页面导航优先用 `next/link`
- 直接引用 `public/` 资源时，需要通过 [`lib/site.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/site.ts) 的 `assetPath()` 处理
- 不要把视频、PDF、原生 `<img>`、下载链接直接写成 `/resume/...` 这种裸根路径

### 2. 保持静态导出兼容

除非用户明确要求，否则不要引入：

- SSR 依赖
- 动态服务端 API
- middleware 级别语言重写
- 数据库
- CMS
- 表单后端

根路径语言跳转是客户端实现，不是服务端重定向。

### 3. 内容必须集中在 `data/`

以下类型内容不要散落在组件里：

- 多语言文案
- 项目卡内容
- 联系方式
- 简历资源路径

优先编辑：

- [`data/dictionaries.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/dictionaries.ts)
- [`data/artifacts.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/artifacts.ts)
- [`data/profile.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/profile.ts)

### 4. 多语言结构必须保持完整

固定语言集合：

- `en`
- `zh-CN`
- `ja`
- `ko`

新增或修改区块文案时，4 个语言必须一起补齐，不允许只改英文。

### 5. 动效边界

允许：

- reveal
- slight upward motion
- slow glow
- subtle parallax
- modal enter/exit

不允许默认引入：

- 多个 Canvas 场景
- 自由相机 / 3D 漫游
- 高频闪烁
- 全屏粒子背景
- 大面积实时 blur
- 依赖大量 JS 计算的滚动特效

首页当前采用 2D / 2.5D 场景层方案：

- 远景城堡 / 月轮
- 中景冷雾
- 前景灰烬 / 火星 / 烟层
- 三张 ritual relic 卡

继续沿着这个方向迭代，不要默认把首页重新改回 realtime relic hero。

### 6. 无障碍要求

必须保留：

- `prefers-reduced-motion`
- 键盘可操作的作品弹层
- 键盘可操作的小游戏
- 语义化标题层级
- 可聚焦 CTA

## 内容维护指引

最常替换的位置：

- dossier PDF：
  [`public/resume`](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/resume)

- Hero / 氛围素材：
  [`public/hero`](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/hero)
  [`public/atmosphere`](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/atmosphere)

- 项目封面与示意图：
  [`public/artifacts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/artifacts)

- 联系方式与简历下载路径：
  [`data/profile.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/profile.ts)

- 项目内容：
  [`data/artifacts.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/artifacts.ts)

- 场景图层与粒子参数：
  [`data/atmosphere.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/atmosphere.ts)

如果用户要求“补全真实内容”，优先从这些位置下手，而不是直接改组件。

## 验证建议

改视觉或交互后至少执行：

```bash
npm run lint
npm run typecheck
npm run build
npm run verify:static
```

改资源路径或 basePath 相关逻辑后，额外执行：

```bash
npm run verify:links
```

## 当前已知事实

- 根路径 `/CVWebsite/` 会先读本地语言记忆，再读浏览器语言
- LinkedIn 当前仍是预留位，未接入已验证公开链接
- 首页现在采用 `Abyss` 场景首屏，而不是 realtime relic 主视觉
- 首页三张 ritual 卡固定是 `EgoCore`、`Ashen Archive`、`OpenEmotion`
- 阅读控制器是轻量 DOM 交互，驱动作品排序与高亮
- 素材来源与生成说明统一记录在 [`docs/assets-manifest.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/assets-manifest.md)
