import type { Locale } from "@/lib/i18n";
import { type ShowcaseSectionId } from "@/lib/showcase";

export interface ShowcaseNavItem {
  id: ShowcaseSectionId;
  label: string;
}

export interface DisciplineItem {
  title: string;
  body: string;
}

export interface ShowcaseWallPanel {
  title: string;
  caption: string;
  asset: string;
  variant: "wide" | "tall" | "square" | "data";
}

export interface ManifestoPrinciple {
  label: string;
  body: string;
}

export interface SelectedWorkCard {
  title: string;
  body: string;
  bullets: string[];
}

export interface ShowcaseDictionary {
  metadata: {
    title: string;
    description: string;
  };
  footerLine: string;
  nav: {
    ariaLabel: string;
    items: ShowcaseNavItem[];
  };
  hero: {
    eyebrow: string;
    status: string;
    lead: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    metricLabel: string;
    metrics: string[];
  };
  disciplines: {
    eyebrow: string;
    title: string;
    intro: string;
    items: DisciplineItem[];
  };
  wall: {
    eyebrow: string;
    title: string;
    intro: string;
    panels: ShowcaseWallPanel[];
  };
  manifesto: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    principles: ManifestoPrinciple[];
  };
  selectedWork: {
    eyebrow: string;
    title: string;
    intro: string;
    cards: SelectedWorkCard[];
  };
  contact: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    linksLabel: string;
    availabilityLabel: string;
    availability: string[];
    dossierLabel: string;
    note: string;
  };
}

const sharedPanels = [
  { asset: "/showcase/triangle-grid-wide.jpg", variant: "wide" as const },
  { asset: "/showcase/triangle-grid-crop-left.jpg", variant: "square" as const },
  { asset: "/showcase/triangle-grid-crop-right.jpg", variant: "tall" as const },
  { asset: "/showcase/triangle-grid-crop-center.jpg", variant: "square" as const },
  { asset: "/showcase/a-spectrum-white.jpg", variant: "data" as const },
] as const;

export const showcaseDictionaries: Record<Locale, ShowcaseDictionary> = {
  en: {
    metadata: {
      title: "Ashen Archive | Unity, Technical Art, VFX, Tools",
      description:
        "Brand-led portfolio for Zhouyu Liao / 流月工作室, focused on Unity development, technical art, real-time VFX, tooling, and optimization.",
    },
    footerLine: "Ashen Archive by Zhouyu Liao / 流月工作室. Unity systems, technical art, VFX, and tools presented as a directed brand experience.",
    nav: {
      ariaLabel: "Primary showcase sections",
      items: [
        { id: "hero-wordmark", label: "Intro" },
        { id: "discipline-strip", label: "Disciplines" },
        { id: "showcase-wall", label: "Wall" },
        { id: "manifesto-inversion", label: "Manifesto" },
        { id: "selected-work", label: "Work" },
        { id: "contact-coda", label: "Contact" },
      ],
    },
    hero: {
      eyebrow: "Interactive Systems / Technical Art / Playable Direction",
      status: "Directed showcase mode",
      lead: "Unity systems, technical art, VFX, and tools arranged as a controlled brand experience instead of a generic portfolio grid.",
      body: "The reference language here is sharper, colder, and more graphic. The point is not fantasy atmosphere anymore. It is authorship, pacing, and a stronger visual identity for game-development work.",
      primaryCta: "View the wall",
      secondaryCta: "Read the manifesto",
      metricLabel: "Focus",
      metrics: ["Unity Gameplay Systems", "Technical Art", "Realtime VFX", "Tools & Optimization"],
    },
    disciplines: {
      eyebrow: "Discipline Strip",
      title: "Four lanes define the work.",
      intro: "The page reads like a studio signal: systems, visuals, effects, and tools are treated as connected production surfaces.",
      items: [
        {
          title: "Unity Development",
          body: "Gameplay logic, interaction systems, state flow, and production-safe implementation inside Unity.",
        },
        {
          title: "Technical Art",
          body: "Look development, material prototyping, scene polish, and artist-facing problem solving.",
        },
        {
          title: "VFX / Shader Work",
          body: "Realtime effects, shader-driven styling, and visual response that supports readability instead of noise.",
        },
        {
          title: "Tools & Optimization",
          body: "Small utilities, editor extensions, profiling habits, and fixes that make pipelines more reliable.",
        },
      ],
    },
    wall: {
      eyebrow: "Showcase Wall",
      title: "A media wall built from signals, not cards.",
      intro: "The first pass uses abstract brand imagery rather than fake screenshots. It establishes the tone, geometry, and pacing before project-specific media is swapped in.",
      panels: [
        { ...sharedPanels[0], title: "Signal Plane 01", caption: "Grid, prism, compression." },
        { ...sharedPanels[1], title: "Triangulated Light", caption: "Hero crop for side rails and media strips." },
        { ...sharedPanels[2], title: "Wall Fragment", caption: "Tall panel for motion offset and asymmetry." },
        { ...sharedPanels[3], title: "Prism Register", caption: "Center crop for layered tiles and motion reveals." },
        { ...sharedPanels[4], title: "White Inversion", caption: "Bridge image for manifesto and identity cut." },
      ],
    },
    manifesto: {
      eyebrow: "Manifesto",
      title: "Make interactive work readable, controllable, and worth shipping.",
      lead: "The strongest reference quality in the video is not the triangle. It is the clarity of authorship.",
      body: "That means every surface should communicate intent: how systems behave, how visuals support play, and how tooling reduces fragility instead of making the process more mysterious.",
      principles: [
        {
          label: "Clarity",
          body: "Systems and effects should explain themselves through behavior, not just through documentation after the fact.",
        },
        {
          label: "Control",
          body: "Visual direction matters, but production constraints and runtime stability matter just as much.",
        },
        {
          label: "Performance",
          body: "Optimization is not cleanup at the end. It is part of the design discipline from the start.",
        },
        {
          label: "Authorship",
          body: "Tools, visuals, and interaction rhythm should feel deliberately composed rather than assembled from interchangeable parts.",
        },
      ],
    },
    selectedWork: {
      eyebrow: "Selected Work",
      title: "Capabilities presented as work surfaces.",
      intro: "This section is intentionally less like a case archive and more like a production-facing capabilities board.",
      cards: [
        {
          title: "Playable Systems",
          body: "Gameplay interaction, event flow, input response, and system behaviors designed to stay legible during iteration.",
          bullets: ["State flow and interaction scripting", "Prototype loops and tuning surfaces", "Readable runtime behavior"],
        },
        {
          title: "Technical Art Direction",
          body: "Materials, scene response, shader-driven accents, and visual hierarchy that support gameplay instead of overwhelming it.",
          bullets: ["Material and shader prototyping", "Scene polish and response tuning", "Readable stylization under runtime constraints"],
        },
        {
          title: "Pipeline Support",
          body: "Small tools, editor helpers, asset workflow improvements, and optimization passes that keep teams moving.",
          bullets: ["Editor-side utilities", "Profiling and render budgeting", "Workflow cleanup and repeatability"],
        },
      ],
    },
    contact: {
      eyebrow: "Contact Coda",
      title: "If the direction fits, the next step is practical collaboration.",
      lead: "The site can perform like a brand experience, but the outcome still needs to convert back into real production conversations.",
      body: "Open to discussions around Unity gameplay systems, technical art implementation, VFX, tools, optimization, and creative-tech collaboration.",
      linksLabel: "Routes",
      availabilityLabel: "Availability",
      availability: ["Unity gameplay support", "Technical art direction", "Realtime VFX and shader polish", "Tooling and optimization help"],
      dossierLabel: "Resume / Dossier",
      note: "Project-specific media can be swapped in later without changing the new page structure.",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Ashen Archive | Unity、技术美术、VFX、工具开发",
      description: "Zhouyu Liao / 流月工作室 的品牌化作品站，聚焦 Unity 开发、技术美术、实时特效、工具与优化。",
    },
    footerLine: "Ashen Archive 由 Zhouyu Liao / 流月工作室 构建。这里展示的是 Unity 系统、技术美术、VFX 与工具能力的品牌化呈现。",
    nav: {
      ariaLabel: "主展示章节",
      items: [
        { id: "hero-wordmark", label: "入口" },
        { id: "discipline-strip", label: "方向" },
        { id: "showcase-wall", label: "展墙" },
        { id: "manifesto-inversion", label: "宣言" },
        { id: "selected-work", label: "能力" },
        { id: "contact-coda", label: "联系" },
      ],
    },
    hero: {
      eyebrow: "交互系统 / 技术美术 / 可玩体验方向",
      status: "定向展示模式",
      lead: "Unity 系统、技术美术、VFX 与工具能力，不再以普通作品列表呈现，而是被组织成一个更强烈的品牌体验页。",
      body: "这次参考的语言更冷、更锐利、更图形化。重点不再是黑暗奇幻氛围，而是作者感、节奏控制，以及更鲜明的游戏开发视觉身份。",
      primaryCta: "查看展墙",
      secondaryCta: "阅读宣言",
      metricLabel: "聚焦方向",
      metrics: ["Unity 游戏系统", "技术美术", "实时 VFX", "工具与优化"],
    },
    disciplines: {
      eyebrow: "能力条带",
      title: "四条主线定义这份工作。",
      intro: "页面像一个工作室信号面板：系统、视觉、特效和工具被视作互相关联的生产表面。",
      items: [
        {
          title: "Unity Development",
          body: "负责玩法逻辑、交互系统、状态流与生产可落地的 Unity 实现。",
        },
        {
          title: "Technical Art",
          body: "覆盖视觉风格探索、材质原型、场景打磨和面向美术问题的技术解决。",
        },
        {
          title: "VFX / Shader Work",
          body: "实时特效与 Shader 驱动的视觉反馈，强调可读性，而不是堆噪声。",
        },
        {
          title: "Tools & Optimization",
          body: "通过小工具、编辑器扩展、性能分析与流程修复来提升生产稳定性。",
        },
      ],
    },
    wall: {
      eyebrow: "展示墙",
      title: "先让信号成形，再让项目落位。",
      intro: "第一版优先使用抽象品牌图，而不是伪造项目截图。先建立几何语言、节奏和画面气质，后续再替换成更具体的项目媒体。",
      panels: [
        { ...sharedPanels[0], title: "Signal Plane 01", caption: "网格、棱镜、压缩。" },
        { ...sharedPanels[1], title: "Triangulated Light", caption: "用于侧向轨道和小尺寸媒体块的主图裁切。" },
        { ...sharedPanels[2], title: "Wall Fragment", caption: "为错位与偏移准备的竖向媒体板。" },
        { ...sharedPanels[3], title: "Prism Register", caption: "用于叠层 tile 与 reveal 的中心裁切图。" },
        { ...sharedPanels[4], title: "White Inversion", caption: "用于宣言段与身份切换的反相图。" },
      ],
    },
    manifesto: {
      eyebrow: "方法宣言",
      title: "让交互工作变得可读、可控、值得上线。",
      lead: "参考视频里最强的地方其实不是三角体，而是作者感的清晰度。",
      body: "这意味着每个表面都要表达意图：系统如何运作、视觉如何服务玩法、工具如何减少脆弱性，而不是把流程搞得更神秘。",
      principles: [
        { label: "清晰", body: "系统与特效应该通过行为本身变得可理解，而不是事后再靠说明文档补救。" },
        { label: "控制", body: "视觉方向很重要，但生产约束与运行时稳定性同样重要。" },
        { label: "性能", body: "优化不是结尾清扫，而是从一开始就属于设计纪律的一部分。" },
        { label: "作者感", body: "工具、画面与交互节奏应该显得是被编排过的，而不是从通用部件里拼出来的。" },
      ],
    },
    selectedWork: {
      eyebrow: "能力面板",
      title: "把能力展示成可以直接理解的工作表面。",
      intro: "这里不会再像旧档案页那样强调三条案例，而是更像面对生产和合作的能力板。",
      cards: [
        {
          title: "Playable Systems",
          body: "围绕玩法交互、事件流、输入响应与系统行为，保证迭代时仍保持可读。",
          bullets: ["状态流与交互脚本", "原型循环与调参表面", "运行时行为可读"],
        },
        {
          title: "Technical Art Direction",
          body: "通过材质、场景反馈、Shader 驱动点缀与视觉层级，让视觉服务玩法而不是盖过玩法。",
          bullets: ["材质与 Shader 原型", "场景打磨与反馈调优", "受运行时约束的可读风格化"],
        },
        {
          title: "Pipeline Support",
          body: "通过小工具、编辑器辅助、资源流改进与性能修正，保持团队和流程持续推进。",
          bullets: ["编辑器侧工具", "性能分析与预算控制", "流程清理与可重复性"],
        },
      ],
    },
    contact: {
      eyebrow: "联系尾声",
      title: "如果方向合适，下一步就是实际协作。",
      lead: "网站可以像品牌体验页一样强势，但最后仍然要回到真正的生产对话。",
      body: "可讨论 Unity 游戏系统、技术美术实现、实时特效、工具开发、优化以及 creative-tech 协作。",
      linksLabel: "路径",
      availabilityLabel: "可合作方向",
      availability: ["Unity 玩法系统支持", "技术美术方向", "实时 VFX 与 Shader 打磨", "工具与优化支持"],
      dossierLabel: "简历 / 档案",
      note: "后续可以在不改页面骨架的前提下，替换成更具体的项目图像与视频素材。",
    },
  },
  ja: {
    metadata: {
      title: "Ashen Archive | Unity / Technical Art / VFX / Tools",
      description: "Zhouyu Liao / 流月工作室 のブランド主導ポートフォリオ。Unity 開発、technical art、realtime VFX、tools、optimization に焦点を当てています。",
    },
    footerLine: "Ashen Archive by Zhouyu Liao / 流月工作室. Unity systems, technical art, VFX, and tools re-framed as a directed brand showcase.",
    nav: {
      ariaLabel: "Primary showcase sections",
      items: [
        { id: "hero-wordmark", label: "Intro" },
        { id: "discipline-strip", label: "Disciplines" },
        { id: "showcase-wall", label: "Wall" },
        { id: "manifesto-inversion", label: "Manifesto" },
        { id: "selected-work", label: "Work" },
        { id: "contact-coda", label: "Contact" },
      ],
    },
    hero: {
      eyebrow: "Interactive Systems / Technical Art / Playable Direction",
      status: "Directed showcase mode",
      lead: "Unity systems、technical art、VFX、tools を、単なる portfolio grid ではなくブランド体験として再構成します。",
      body: "今回は dark-fantasy archive よりも、graphic control、pacing、visual identity を前面に出します。",
      primaryCta: "View the wall",
      secondaryCta: "Read the manifesto",
      metricLabel: "Focus",
      metrics: ["Unity Gameplay Systems", "Technical Art", "Realtime VFX", "Tools & Optimization"],
    },
    disciplines: {
      eyebrow: "Discipline Strip",
      title: "四つのラインで仕事を定義する。",
      intro: "systems、visuals、effects、tools を別々ではなく、つながった production surface として扱います。",
      items: [
        { title: "Unity Development", body: "Gameplay logic、interaction systems、state flow、Unity 実装。" },
        { title: "Technical Art", body: "Look development、material prototyping、scene polish、artist-facing problem solving。" },
        { title: "VFX / Shader Work", body: "Realtime effects と shader-driven styling を、readability 重視で設計。" },
        { title: "Tools & Optimization", body: "Utilities、editor extensions、profiling、workflow fixes。" },
      ],
    },
    wall: {
      eyebrow: "Showcase Wall",
      title: "先に signal を作り、あとから project media を差し替える。",
      intro: "第一版では abstract brand imagery を使用し、tone、geometry、pacing を先に確立します。",
      panels: [
        { ...sharedPanels[0], title: "Signal Plane 01", caption: "Grid, prism, compression." },
        { ...sharedPanels[1], title: "Triangulated Light", caption: "Side-rail crop and media strip." },
        { ...sharedPanels[2], title: "Wall Fragment", caption: "Tall offset panel." },
        { ...sharedPanels[3], title: "Prism Register", caption: "Center crop for layered reveals." },
        { ...sharedPanels[4], title: "White Inversion", caption: "Bridge image for manifesto." },
      ],
    },
    manifesto: {
      eyebrow: "Manifesto",
      title: "Interactive work should be readable, controllable, and shippable.",
      lead: "参考動画の強さは triangle 単体ではなく authorship の明瞭さです。",
      body: "systems、visuals、tools のすべてが intent を伝える必要があります。",
      principles: [
        { label: "Clarity", body: "挙動で理解できることを優先する。" },
        { label: "Control", body: "Visual direction と runtime constraints を同時に扱う。" },
        { label: "Performance", body: "Optimization を最初から設計に含める。" },
        { label: "Authorship", body: "Rhythm と surfaces を意図的に構成する。" },
      ],
    },
    selectedWork: {
      eyebrow: "Selected Work",
      title: "Capabilities as production surfaces.",
      intro: "旧 archive よりも、production-facing capability board に近い構成です。",
      cards: [
        {
          title: "Playable Systems",
          body: "Gameplay interaction、event flow、input response、runtime behavior。",
          bullets: ["State flow and interaction scripting", "Prototype loops and tuning surfaces", "Readable runtime behavior"],
        },
        {
          title: "Technical Art Direction",
          body: "Materials、scene response、shader accents、visual hierarchy。",
          bullets: ["Material and shader prototyping", "Scene polish and response tuning", "Readable stylization under runtime constraints"],
        },
        {
          title: "Pipeline Support",
          body: "Tools、editor helpers、optimization、workflow cleanup。",
          bullets: ["Editor-side utilities", "Profiling and render budgeting", "Workflow cleanup and repeatability"],
        },
      ],
    },
    contact: {
      eyebrow: "Contact Coda",
      title: "方向が合えば、次は実務の会話です。",
      lead: "Brand experience として強く見せつつ、最後は production collaboration へ戻します。",
      body: "Unity gameplay systems、technical art、VFX、tools、optimization、creative-tech collaboration に対応します。",
      linksLabel: "Routes",
      availabilityLabel: "Availability",
      availability: ["Unity gameplay support", "Technical art direction", "Realtime VFX and shader polish", "Tooling and optimization help"],
      dossierLabel: "Resume / Dossier",
      note: "Project-specific media can be swapped in later without changing the page structure.",
    },
  },
  ko: {
    metadata: {
      title: "Ashen Archive | Unity / Technical Art / VFX / Tools",
      description: "Zhouyu Liao / 流月工作室의 브랜드 중심 포트폴리오. Unity 개발, technical art, realtime VFX, tools, optimization에 집중합니다.",
    },
    footerLine: "Ashen Archive by Zhouyu Liao / 流月工作室. Unity systems, technical art, VFX, and tools reframed as a directed showcase.",
    nav: {
      ariaLabel: "Primary showcase sections",
      items: [
        { id: "hero-wordmark", label: "Intro" },
        { id: "discipline-strip", label: "Disciplines" },
        { id: "showcase-wall", label: "Wall" },
        { id: "manifesto-inversion", label: "Manifesto" },
        { id: "selected-work", label: "Work" },
        { id: "contact-coda", label: "Contact" },
      ],
    },
    hero: {
      eyebrow: "Interactive Systems / Technical Art / Playable Direction",
      status: "Directed showcase mode",
      lead: "Unity systems, technical art, VFX, tools를 일반적인 포트폴리오 그리드가 아니라 브랜드 경험으로 재구성합니다.",
      body: "이번 방향은 dark-fantasy archive보다 graphic control, pacing, visual identity를 전면에 둡니다.",
      primaryCta: "View the wall",
      secondaryCta: "Read the manifesto",
      metricLabel: "Focus",
      metrics: ["Unity Gameplay Systems", "Technical Art", "Realtime VFX", "Tools & Optimization"],
    },
    disciplines: {
      eyebrow: "Discipline Strip",
      title: "네 개의 라인이 작업을 정의합니다.",
      intro: "systems, visuals, effects, tools를 분리된 항목이 아니라 연결된 production surface로 다룹니다.",
      items: [
        { title: "Unity Development", body: "Gameplay logic, interaction systems, state flow, Unity implementation." },
        { title: "Technical Art", body: "Look development, material prototyping, scene polish, artist-facing problem solving." },
        { title: "VFX / Shader Work", body: "Realtime effects와 shader-driven styling을 readability 중심으로 설계." },
        { title: "Tools & Optimization", body: "Utilities, editor extensions, profiling, workflow fixes." },
      ],
    },
    wall: {
      eyebrow: "Showcase Wall",
      title: "먼저 signal을 만들고, 이후 project media를 바꿔 끼웁니다.",
      intro: "첫 버전은 abstract brand imagery를 사용해 tone, geometry, pacing을 먼저 고정합니다.",
      panels: [
        { ...sharedPanels[0], title: "Signal Plane 01", caption: "Grid, prism, compression." },
        { ...sharedPanels[1], title: "Triangulated Light", caption: "Side-rail crop and media strip." },
        { ...sharedPanels[2], title: "Wall Fragment", caption: "Tall offset panel." },
        { ...sharedPanels[3], title: "Prism Register", caption: "Center crop for layered reveals." },
        { ...sharedPanels[4], title: "White Inversion", caption: "Bridge image for manifesto." },
      ],
    },
    manifesto: {
      eyebrow: "Manifesto",
      title: "Interactive work should be readable, controllable, and shippable.",
      lead: "참고 영상의 강점은 triangle 자체보다 authorship의 선명함입니다.",
      body: "systems, visuals, tools 모두가 intent를 전달해야 합니다.",
      principles: [
        { label: "Clarity", body: "행동 자체로 이해되는 설계를 우선합니다." },
        { label: "Control", body: "Visual direction과 runtime constraints를 동시에 다룹니다." },
        { label: "Performance", body: "Optimization을 처음부터 설계의 일부로 둡니다." },
        { label: "Authorship", body: "Rhythm과 surfaces가 의도적으로 구성되어야 합니다." },
      ],
    },
    selectedWork: {
      eyebrow: "Selected Work",
      title: "Capabilities as production surfaces.",
      intro: "예전 archive보다 production-facing capability board에 가까운 구성입니다.",
      cards: [
        {
          title: "Playable Systems",
          body: "Gameplay interaction, event flow, input response, runtime behavior.",
          bullets: ["State flow and interaction scripting", "Prototype loops and tuning surfaces", "Readable runtime behavior"],
        },
        {
          title: "Technical Art Direction",
          body: "Materials, scene response, shader accents, visual hierarchy.",
          bullets: ["Material and shader prototyping", "Scene polish and response tuning", "Readable stylization under runtime constraints"],
        },
        {
          title: "Pipeline Support",
          body: "Tools, editor helpers, optimization, workflow cleanup.",
          bullets: ["Editor-side utilities", "Profiling and render budgeting", "Workflow cleanup and repeatability"],
        },
      ],
    },
    contact: {
      eyebrow: "Contact Coda",
      title: "방향이 맞다면 다음 단계는 실무 대화입니다.",
      lead: "브랜드 경험처럼 보이더라도 마지막에는 실제 production collaboration으로 돌아와야 합니다.",
      body: "Unity gameplay systems, technical art, VFX, tools, optimization, creative-tech collaboration에 열려 있습니다.",
      linksLabel: "Routes",
      availabilityLabel: "Availability",
      availability: ["Unity gameplay support", "Technical art direction", "Realtime VFX and shader polish", "Tooling and optimization help"],
      dossierLabel: "Resume / Dossier",
      note: "Later, project-specific images and video can be swapped in without changing the page structure.",
    },
  },
};
