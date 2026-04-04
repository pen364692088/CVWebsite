import type { ArchiveLens, ArchivePhase, SigilLens } from "@/lib/archive";
import type { Locale } from "@/lib/i18n";

export interface Dictionary {
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    title: string;
    identity: string;
    languageLabel: string;
    items: Array<{ id: string; label: string }>;
  };
  hero: {
    eyebrow: string;
    archiveLabel: string;
    identity: string;
    studioCredit: string;
    role: string;
    body: string;
    proofChips: string[];
    enterLabel: string;
    projectLabel: string;
    availability: string;
    focusLabel: string;
    ritualLabel: string;
    ritualIntro: string;
    cardCtaLabel: string;
    lensSummary: Record<ArchiveLens, { title: string; body: string }>;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    service: string;
    recordId: string;
    seal: string;
    tags: string[];
    dossier: Array<{ label: string; value: string }>;
  };
  disciplines: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ title: string; body: string; lenses: SigilLens[] }>;
  };
  artifacts: {
    eyebrow: string;
    title: string;
    intro: string;
    featuredLabel: string;
    caseLabel: string;
    categoryLabel: string;
    roleLabel: string;
    evidenceLabel: string;
    lensLabel: string;
    openLabel: string;
    shelfLabel: string;
    shelfTitle: string;
    shelfBody: string;
    shelfCta: string;
    whatLabel: string;
    contributionLabel: string;
    techLabel: string;
    solvedLabel: string;
    mediaLabel: string;
    closeLabel: string;
  };
  game: {
    eyebrow: string;
    title: string;
    intro: string;
    instructions: string;
    currentLensLabel: string;
    sigilLabel: string;
    focusCta: string;
    options: Array<{ id: ArchiveLens; label: string; title: string; body: string }>;
  };
  relic: {
    fallbackAlt: string;
    unsupportedLabel: string;
    sigilLabel: string;
    phaseLabel: string;
    modeLabel: string;
    callsLabel: string;
    pointsLabel: string;
    phaseNames: Record<ArchivePhase, string>;
    modeNames: Record<ArchiveLens, string>;
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    cardTitle: string;
    cardBody: string;
    dossierTitle: string;
    dossierBody: string;
    capabilitiesTitle: string;
    capabilities: string[];
    collaborationTitle: string;
    collaborationBody: string;
    dossierRouteLabel: string;
    dossierActionLabel: string;
    dossierUnavailableLabel: string;
    unavailableLabel: string;
  };
  footer: {
    line: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    metadata: {
      title: "Ashen Archive | Zhouyu Liao",
      description:
        "Atmosphere-led portfolio for Zhouyu Liao / 流月工作室, centered on runtime systems, governed interfaces, identity-driven architecture, and ritualized presentation.",
    },
    nav: {
      title: "Ashen Archive",
      identity: "Zhouyu Liao",
      languageLabel: "Language",
      items: [
        { id: "about", label: "Oaths" },
        { id: "artifacts", label: "Artifacts" },
        { id: "disciplines", label: "Lore" },
        { id: "fire", label: "Ritual" },
      ],
    },
    hero: {
      eyebrow: "Scene-led Archive, Public-safe Cases",
      archiveLabel: "Ashen Archive",
      identity: "Zhouyu Liao",
      studioCredit: "Working under 流月工作室",
      role: "Runtime systems, governed interfaces, and reflective product architecture.",
      body:
        "This archive is built to be read like a curated abyssal index: one part atmosphere, one part case evidence, and one part interaction system that tells you what each project actually does.",
      proofChips: ["Runtime host design", "Governed tooling and audit", "Identity / memory architecture"],
      enterLabel: "Enter the archive",
      projectLabel: "Read the artifacts",
      availability: "Best fit: system architecture, governed product design, interactive portfolio builds, and compact-team execution.",
      focusLabel: "Current reading lens",
      ritualLabel: "Ritual Relics",
      ritualIntro: "Three real projects arranged as altar entries. Start with the relic that matches the question you want answered first.",
      cardCtaLabel: "Unseal record",
      lensSummary: {
        all: {
          title: "Read the full system, not just the mood.",
          body: "EgoCore, Ashen Archive, and OpenEmotion show how runtime, interface, and reflective core design fit together.",
        },
        moon: {
          title: "Systems & Runtime in view",
          body: "This reading favors host logic, execution flow, interaction structure, and the parts that have to operate cleanly under pressure.",
        },
        tower: {
          title: "Governance & Tooling in view",
          body: "This reading brings boundary discipline, auditability, documentation, and implementation constraints to the front.",
        },
        ember: {
          title: "Identity & Narrative in view",
          body: "This reading emphasizes meaning, continuity, reflective structure, and the atmosphere that shapes how the work is perceived.",
        },
      },
    },
    about: {
      eyebrow: "Oaths",
      title: "An archive built for atmosphere, but judged by evidence.",
      body:
        "The surface is dark fantasy and museum ritual. Underneath, the site is still a working portfolio: every section is meant to tell you what was built, what was owned, and what kind of constraint the project had to survive.",
      service:
        "The core offer is system-heavy and execution-heavy: runtime hosts, governed interfaces, reflective architecture, portfolio curation, and small tools that turn abstract ideas into something operable.",
      recordId: "Record A-01 · Abyss Registry",
      seal: "ZL",
      tags: ["Runtime systems", "Governed interaction", "Identity architecture", "Atmosphere-led interfaces"],
      dossier: [
        { label: "Primary role", value: "System Designer / Interface Builder" },
        { label: "Working label", value: "流月工作室" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Focus", value: "Runtime, governance, identity, atmosphere" },
        { label: "Collaboration", value: "Prototype, architecture, and product support" },
      ],
    },
    disciplines: {
      eyebrow: "Lore",
      title: "Four lanes of practice behind the atmosphere.",
      intro: "The archive reads faster when the work is split by responsibility: what operates, what constrains, what remembers, and what shapes the public-facing experience.",
      items: [
        {
          title: "Systems & Runtime",
          body: "Host logic, event flow, task orchestration, and interaction structure that stay legible instead of collapsing into hidden glue.",
          lenses: ["moon"],
        },
        {
          title: "Governance & Tooling",
          body: "Boundaries, guardrails, replayability, structured docs, and the smaller utilities that keep a system explainable.",
          lenses: ["tower"],
        },
        {
          title: "Identity & Memory",
          body: "Persistent self-modeling, reflective adjustment, appraisal state, and narrative continuity treated as explicit architecture.",
          lenses: ["ember"],
        },
        {
          title: "Atmosphere & Interface",
          body: "Scene-led layout, symbolic interaction, and visual hierarchy that carry mood without hiding what the work actually is.",
          lenses: ["moon", "ember"],
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "Three altar entries, each pointing at a real system.",
      intro: "Every case stays public-safe, but still names the actual work, your role, the governing constraint, and the problem that had to be solved.",
      featuredLabel: "Central relic",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      evidenceLabel: "Proof",
      lensLabel: "Reading lens",
      openLabel: "Open record",
      shelfLabel: "Current shelf",
      shelfTitle: "Read the altar as a linked set.",
      shelfBody: "The three entries are designed to speak to each other: the host, the archive shell, and the reflective core.",
      shelfCta: "Open lead record",
      whatLabel: "Archive note",
      contributionLabel: "Contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Ritual",
      title: "Change the reading lens, not the work itself.",
      intro: "The sigils do not gate content. They retune the archive so you can read the same three cases by runtime, governance, or identity emphasis.",
      instructions: "Choose a sigil to reorder the archive around systems, governance, or identity. The cards below will shift without breaking the overall story.",
      currentLensLabel: "Current focus",
      sigilLabel: "Sigil",
      focusCta: "Jump to matching record",
      options: [
        {
          id: "all",
          label: "Whole Archive",
          title: "Read the linked system",
          body: "Balanced view across host runtime, governed shell, and reflective core.",
        },
        {
          id: "moon",
          label: "Moon Crest",
          title: "Systems & Runtime",
          body: "Host flow, interaction structure, orchestration, and the parts that must execute cleanly.",
        },
        {
          id: "tower",
          label: "Tower Mark",
          title: "Governance & Tooling",
          body: "Boundaries, auditability, smaller utilities, and the implementation constraints that keep the system sane.",
        },
        {
          id: "ember",
          label: "Ember Seal",
          title: "Identity & Narrative",
          body: "Continuity, reflective structure, meaning, and the atmosphere that frames the experience.",
        },
      ],
    },
    relic: {
      fallbackAlt: "Fallback poster for the retired realtime relic stage.",
      unsupportedLabel: "Realtime relic unavailable. Showing fallback poster.",
      sigilLabel: "Active sigil",
      phaseLabel: "Phase",
      modeLabel: "Material mode",
      callsLabel: "Draw calls",
      pointsLabel: "Points",
      phaseNames: {
        hero: "Threshold",
        disciplines: "Discipline",
        sigils: "Sigil",
      },
      modeNames: {
        all: "Balanced shell",
        moon: "Ordered grid",
        tower: "Faceted assembly",
        ember: "Ember trace",
      },
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "If the brief needs both atmosphere and structure, this is the point of contact.",
      intro:
        "The fastest path is simple: share the product, the constraint, and the deadline. If the work needs system discipline, controlled interaction, or a more memorable public shell, that is the conversation this archive is for.",
      cardTitle: "Signal Routes",
      cardBody: "Use the direct routes for email and GitHub. Dossier-style material stays available on request until there is a studio-safe packet worth publishing.",
      dossierTitle: "Studio Dossier",
      dossierBody: "The working dossier is intentionally light. This archive is meant to do the first round of explanation so the follow-up call can focus on scope and constraints, not guesswork.",
      capabilitiesTitle: "Capabilities",
      capabilities: [
        "Runtime and orchestration design for compact systems",
        "Governed interaction and public-safe information architecture",
        "Identity / memory / reflective core framing",
        "Atmosphere-led portfolio and archive presentation",
      ],
      collaborationTitle: "Collaboration notes",
      collaborationBody:
        "Best used when a project needs sharper structure, stronger atmosphere, or a public shell that feels intentional instead of generic.",
      dossierRouteLabel: "dossier",
      dossierActionLabel: "Download dossier",
      dossierUnavailableLabel: "Dossier available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao / 流月工作室. Built as a scene-led portfolio with public-safe records and restrained motion.",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Ashen Archive | 周宇辽",
      description: "周宇辽 / 流月工作室的深渊档案馆式作品站，聚焦 runtime、治理接口、身份架构与氛围化呈现。",
    },
    nav: {
      title: "Ashen Archive",
      identity: "周宇辽",
      languageLabel: "语言",
      items: [
        { id: "about", label: "誓约" },
        { id: "artifacts", label: "遗物" },
        { id: "disciplines", label: "档案" },
        { id: "fire", label: "仪式" },
      ],
    },
    hero: {
      eyebrow: "场景优先的档案馆，公开安全的真实案例",
      archiveLabel: "Ashen Archive",
      identity: "周宇辽",
      studioCredit: "以 流月工作室 为工作标签",
      role: "Runtime 系统、受治理的界面，以及带有身份连续性的产品架构。",
      body:
        "这个站被做成一座可读的深渊档案馆：一部分是氛围，一部分是证据，一部分是交互系统，用来快速说明每个项目到底在解决什么问题。",
      proofChips: ["Runtime 宿主设计", "治理 / 工具 / 审计", "身份 / 记忆架构"],
      enterLabel: "进入档案馆",
      projectLabel: "阅读遗物",
      availability: "更适合：系统架构、治理型产品设计、交互作品集构建，以及小团队执行支持。",
      focusLabel: "当前阅读视角",
      ritualLabel: "仪式遗物",
      ritualIntro: "三张真实项目祭坛卡。先打开最接近你当前问题的那一件。",
      cardCtaLabel: "解封档案",
      lensSummary: {
        all: {
          title: "先看整套系统，而不是只看气氛。",
          body: "EgoCore、Ashen Archive 和 OpenEmotion 对应宿主、外壳与反思核心，合起来才是完整叙事。",
        },
        moon: {
          title: "系统与 Runtime 视角",
          body: "这个视角优先展示宿主逻辑、执行流、交互结构，以及那些必须稳定运行的部分。",
        },
        tower: {
          title: "治理与工具视角",
          body: "这个视角把边界纪律、审计性、文档化和实现约束放到前面。",
        },
        ember: {
          title: "身份与叙事视角",
          body: "这个视角更强调连续性、反思结构、意义组织，以及氛围如何改变项目被理解的方式。",
        },
      },
    },
    about: {
      eyebrow: "誓约",
      title: "表面是深渊博物馆，判断标准仍然是证据。",
      body:
        "站点外层是黑暗奇幻与仪式感，但它本质上仍然是一个作品集。每个区块都应该回答：做了什么、负责了什么、在什么约束下完成。",
      service:
        "核心能力偏系统与执行：runtime 宿主、治理型界面、反思式架构、作品叙事策展，以及把抽象概念变成可运行实体的小工具。",
      recordId: "Record A-01 · Abyss Registry",
      seal: "ZL",
      tags: ["运行时系统", "治理型交互", "身份架构", "氛围化界面"],
      dossier: [
        { label: "主要角色", value: "系统设计 / 界面构建" },
        { label: "工作标签", value: "流月工作室" },
        { label: "所在地", value: "加拿大 温尼伯" },
        { label: "关注点", value: "runtime、治理、身份、氛围" },
        { label: "合作方式", value: "原型、架构与产品支持" },
      ],
    },
    disciplines: {
      eyebrow: "档案",
      title: "四条真正支撑气氛的能力线。",
      intro: "当作品按职责被拆开之后，页面会更快被读懂：什么负责运行，什么负责约束，什么负责记忆，什么负责公共呈现。",
      items: [
        {
          title: "系统与 Runtime",
          body: "宿主逻辑、事件流、任务编排和交互结构，让系统保持可读，而不是最后变成一团看不清的胶水层。",
          lenses: ["moon"],
        },
        {
          title: "治理与工具",
          body: "边界、护栏、回放、文档，以及那些能让系统继续可解释的小工具和规则。",
          lenses: ["tower"],
        },
        {
          title: "身份与记忆",
          body: "持续 self-model、反思修正、appraisal 状态和叙事连续性，被当成显式架构来设计。",
          lenses: ["ember"],
        },
        {
          title: "氛围与界面",
          body: "场景式布局、符号交互与视觉层级，让页面有气氛，但不会掩盖作品到底是什么。",
          lenses: ["moon", "ember"],
        },
      ],
    },
    artifacts: {
      eyebrow: "遗物",
      title: "三件祭坛条目，每件都指向真实系统。",
      intro: "每个案例都保持公开安全，但仍然会明确项目名、角色、约束和解决的问题。",
      featuredLabel: "中央遗物",
      caseLabel: "案例",
      categoryLabel: "类别",
      roleLabel: "角色",
      evidenceLabel: "证据",
      lensLabel: "阅读视角",
      openLabel: "打开档案",
      shelfLabel: "当前祭坛",
      shelfTitle: "把三件遗物当作一组来读。",
      shelfBody: "这三件条目彼此互相解释：宿主、外壳、以及反思核心。",
      shelfCta: "打开主档案",
      whatLabel: "档案说明",
      contributionLabel: "我的职责",
      techLabel: "技术点",
      solvedLabel: "解决的问题",
      mediaLabel: "媒体",
      closeLabel: "关闭详情",
    },
    game: {
      eyebrow: "仪式",
      title: "改变阅读方式，而不是把内容锁起来。",
      intro: "这些符印不是小游戏门禁，而是阅读控制器。它们会按系统、治理或身份线索重排同一组案例。",
      instructions: "选择一个符印，页面会围绕系统、治理或身份来重新排序。内容不会消失，但重点会变。",
      currentLensLabel: "当前焦点",
      sigilLabel: "符印",
      focusCta: "跳到对应档案",
      options: [
        {
          id: "all",
          label: "整座档案馆",
          title: "阅读完整系统",
          body: "同时看宿主 runtime、治理外壳和反思核心。",
        },
        {
          id: "moon",
          label: "月纹",
          title: "系统与 Runtime",
          body: "宿主流、交互结构、编排方式，以及那些必须稳定运行的部分。",
        },
        {
          id: "tower",
          label: "塔印",
          title: "治理与工具",
          body: "边界、审计、小工具和实现约束，让系统保持理性和可解释。",
        },
        {
          id: "ember",
          label: "余烬印",
          title: "身份与叙事",
          body: "连续性、反思结构、意义组织，以及氛围如何塑造阅读体验。",
        },
      ],
    },
    relic: {
      fallbackAlt: "已退役的 realtime relic 备用海报。",
      unsupportedLabel: "实时 relic 当前不可用，显示备用海报。",
      sigilLabel: "当前符印",
      phaseLabel: "阶段",
      modeLabel: "材质模式",
      callsLabel: "调用数",
      pointsLabel: "粒子点数",
      phaseNames: {
        hero: "Threshold",
        disciplines: "Discipline",
        sigils: "Sigil",
      },
      modeNames: {
        all: "Balanced shell",
        moon: "Ordered grid",
        tower: "Faceted assembly",
        ember: "Ember trace",
      },
    },
    contact: {
      eyebrow: "发出信号",
      title: "如果项目既需要气氛，又需要结构，这里就是入口。",
      intro:
        "最有效的方式很直接：告诉我产品目标、约束和时间线。如果项目需要系统纪律、受控交互，或一个真正有记忆点的公共外壳，这座档案馆就是为这种对话准备的。",
      cardTitle: "Signal Routes",
      cardBody: "邮箱和 GitHub 可以直达。更像 dossier 的资料会等到真正有对外安全版本之后再公开。",
      dossierTitle: "Studio Dossier",
      dossierBody: "当前 dossier 故意保持轻量。这个站本身负责第一轮说明，后续沟通应该集中在范围、约束和可执行性上。",
      capabilitiesTitle: "能力范围",
      capabilities: [
        "小型系统的 runtime 与编排设计",
        "治理型交互与公开安全的信息结构",
        "身份 / 记忆 / 反思核心表达",
        "氛围优先的档案馆式展示界面",
      ],
      collaborationTitle: "合作说明",
      collaborationBody: "适合需要更清晰结构、更强氛围，或更有辨识度公开外壳的项目。",
      dossierRouteLabel: "dossier",
      dossierActionLabel: "下载 dossier",
      dossierUnavailableLabel: "Dossier 可在沟通后提供",
      unavailableLabel: "沟通后提供",
    },
    footer: {
      line: "Ashen Archive 由 周宇辽 / 流月工作室 构建。它是一个场景优先、证据清晰、动效克制的公开档案馆。",
    },
  },
  ja: {
    metadata: {
      title: "Ashen Archive | Zhouyu Liao",
      description: "Zhouyu Liao / 流月工作室 による、runtime・統治・identity を中心にした abyss archive portfolio。",
    },
    nav: {
      title: "Ashen Archive",
      identity: "Zhouyu Liao",
      languageLabel: "Language",
      items: [
        { id: "about", label: "Oaths" },
        { id: "artifacts", label: "Artifacts" },
        { id: "disciplines", label: "Lore" },
        { id: "fire", label: "Ritual" },
      ],
    },
    hero: {
      eyebrow: "Scene-led archive, public-safe records",
      archiveLabel: "Ashen Archive",
      identity: "Zhouyu Liao",
      studioCredit: "Working under 流月工作室",
      role: "Runtime systems, governed interfaces, and identity-shaped product architecture.",
      body:
        "このサイトは abyssal archive として構成されています。雰囲気、証拠、相互作用を一体化し、各プロジェクトが何をしているかを素早く読めるようにしています。",
      proofChips: ["Runtime host design", "Governance / tooling / audit", "Identity / memory architecture"],
      enterLabel: "Enter the archive",
      projectLabel: "Read the artifacts",
      availability: "Best fit: architecture work, governed products, interactive portfolio shells, and compact-team execution.",
      focusLabel: "Current reading lens",
      ritualLabel: "Ritual Relics",
      ritualIntro: "3 つの実案件を祭壇のように配置しています。最初に知りたい問いに近い relic から開いてください。",
      cardCtaLabel: "Unseal record",
      lensSummary: {
        all: {
          title: "雰囲気だけでなく、全体の構造から読む。",
          body: "EgoCore、Ashen Archive、OpenEmotion はホスト、公開シェル、反省コアという連動した 3 層です。",
        },
        moon: {
          title: "Systems & Runtime in view",
          body: "ホストロジック、実行フロー、相互作用の構造、安定運用が必要な部分を優先して読めます。",
        },
        tower: {
          title: "Governance & Tooling in view",
          body: "境界規律、監査性、文書化、小さなツール群、実装制約を前面に出します。",
        },
        ember: {
          title: "Identity & Narrative in view",
          body: "continuity、reflection、意味構造、雰囲気が理解に与える影響に焦点を当てます。",
        },
      },
    },
    about: {
      eyebrow: "Oaths",
      title: "見た目は abyss museum、判断基準は証拠。",
      body:
        "外側は dark fantasy と儀式性ですが、中身は依然として実務向けポートフォリオです。何を作り、何を担当し、どの制約を越えたかを読むための構造です。",
      service:
        "主軸は system-heavy な実装です。runtime ホスト、governed interface、reflective architecture、portfolio shell、抽象を運用可能な形に落とす小さな道具を扱います。",
      recordId: "Record A-01 · Abyss Registry",
      seal: "ZL",
      tags: ["Runtime systems", "Governed interaction", "Identity architecture", "Atmosphere-led interfaces"],
      dossier: [
        { label: "Primary role", value: "System Designer / Interface Builder" },
        { label: "Working label", value: "流月工作室" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Focus", value: "runtime, governance, identity, atmosphere" },
        { label: "Collaboration", value: "prototype, architecture, product support" },
      ],
    },
    disciplines: {
      eyebrow: "Lore",
      title: "雰囲気を支える 4 つの実践レーン。",
      intro: "作品を責務で分けると読みやすくなります。何が動かし、何が制約し、何が記憶し、何が公開体験を形づくるのかを明示します。",
      items: [
        {
          title: "Systems & Runtime",
          body: "ホストロジック、イベントフロー、タスク編成、相互作用構造を整理し、見えない glue にしないための実践です。",
          lenses: ["moon"],
        },
        {
          title: "Governance & Tooling",
          body: "境界、ガードレール、replay、文書、そして system を説明可能に保つ小さなツール群です。",
          lenses: ["tower"],
        },
        {
          title: "Identity & Memory",
          body: "persistent self-model、reflective revision、appraisal、narrative continuity を明示的な設計として扱います。",
          lenses: ["ember"],
        },
        {
          title: "Atmosphere & Interface",
          body: "scene-led layout、symbolic interaction、visual hierarchy によって mood を保ちながら本質を隠さない UI を作ります。",
          lenses: ["moon", "ember"],
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "3 つの祭壇 entry、それぞれが実在の system を指す。",
      intro: "いずれも public-safe な表現ですが、プロジェクト名、役割、制約、解いた問題は実名で示します。",
      featuredLabel: "Central relic",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      evidenceLabel: "Proof",
      lensLabel: "Reading lens",
      openLabel: "Open record",
      shelfLabel: "Current shelf",
      shelfTitle: "3 つを連動した一組として読む。",
      shelfBody: "ホスト、公開シェル、反省コアの 3 層は互いを説明するように配置されています。",
      shelfCta: "Open lead record",
      whatLabel: "Archive note",
      contributionLabel: "Contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Ritual",
      title: "コンテンツを隠すのではなく、読み方を変える。",
      intro: "sigil は gate ではありません。同じ 3 ケースを systems / governance / identity の視点で並び替えるための読解装置です。",
      instructions: "sigil を選ぶと、archive は systems・governance・identity を中心に再配置されます。",
      currentLensLabel: "Current focus",
      sigilLabel: "Sigil",
      focusCta: "Jump to matching record",
      options: [
        {
          id: "all",
          label: "Whole Archive",
          title: "Read the linked system",
          body: "host runtime、governed shell、reflective core をまとめて読む。",
        },
        {
          id: "moon",
          label: "Moon Crest",
          title: "Systems & Runtime",
          body: "ホストフロー、相互作用構造、編成、安定運用が必要な部分を追います。",
        },
        {
          id: "tower",
          label: "Tower Mark",
          title: "Governance & Tooling",
          body: "境界、監査性、小さなツール、理性を保つ実装制約を前面に出します。",
        },
        {
          id: "ember",
          label: "Ember Seal",
          title: "Identity & Narrative",
          body: "continuity、reflection、意味構造、雰囲気が生む理解を読みます。",
        },
      ],
    },
    relic: {
      fallbackAlt: "Fallback poster for the retired realtime relic stage.",
      unsupportedLabel: "Realtime relic unavailable. Showing fallback poster.",
      sigilLabel: "Active sigil",
      phaseLabel: "Phase",
      modeLabel: "Material mode",
      callsLabel: "Draw calls",
      pointsLabel: "Points",
      phaseNames: {
        hero: "Threshold",
        disciplines: "Discipline",
        sigils: "Sigil",
      },
      modeNames: {
        all: "Balanced shell",
        moon: "Ordered grid",
        tower: "Faceted assembly",
        ember: "Ember trace",
      },
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "雰囲気と構造の両方が必要なら、ここが入口です。",
      intro:
        "必要なのはシンプルです。プロダクト、制約、期限を共有してください。system discipline、controlled interaction、印象に残る public shell が必要なら、この archive はその会話のためにあります。",
      cardTitle: "Signal Routes",
      cardBody: "Email と GitHub は直接使えます。dossier 的な資料は、安全に公開できる形が整うまで on request に留めます。",
      dossierTitle: "Studio Dossier",
      dossierBody: "この archive 自体が最初の説明役です。次の会話では scope と constraint に集中できるように設計しています。",
      capabilitiesTitle: "Capabilities",
      capabilities: [
        "Runtime / orchestration design for compact systems",
        "Governed interaction and public-safe information architecture",
        "Identity / memory / reflective core framing",
        "Atmosphere-led archive and portfolio presentation",
      ],
      collaborationTitle: "Collaboration notes",
      collaborationBody: "より明確な構造、より強い雰囲気、または generic でない public shell が必要な案件に向いています。",
      dossierRouteLabel: "dossier",
      dossierActionLabel: "Download dossier",
      dossierUnavailableLabel: "Dossier available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao / 流月工作室. Scene-led, evidence-first, and intentionally restrained in motion.",
    },
  },
  ko: {
    metadata: {
      title: "Ashen Archive | Zhouyu Liao",
      description: "Zhouyu Liao / 流月工作室의 abyss archive portfolio. runtime, 거버넌스, identity 중심 구조를 다룹니다.",
    },
    nav: {
      title: "Ashen Archive",
      identity: "Zhouyu Liao",
      languageLabel: "Language",
      items: [
        { id: "about", label: "Oaths" },
        { id: "artifacts", label: "Artifacts" },
        { id: "disciplines", label: "Lore" },
        { id: "fire", label: "Ritual" },
      ],
    },
    hero: {
      eyebrow: "Scene-led archive, public-safe cases",
      archiveLabel: "Ashen Archive",
      identity: "Zhouyu Liao",
      studioCredit: "Working under 流月工作室",
      role: "Runtime systems, governed interfaces, and identity-shaped product architecture.",
      body:
        "이 사이트는 abyss archive처럼 읽히도록 설계되었습니다. 분위기, 증거, 상호작용을 묶어 각 프로젝트가 실제로 무엇을 하는지 빠르게 읽히게 만듭니다.",
      proofChips: ["Runtime host design", "Governance / tooling / audit", "Identity / memory architecture"],
      enterLabel: "Enter the archive",
      projectLabel: "Read the artifacts",
      availability: "Best fit: architecture work, governed products, interactive portfolio shells, and compact-team execution.",
      focusLabel: "Current reading lens",
      ritualLabel: "Ritual Relics",
      ritualIntro: "세 개의 실제 프로젝트를 제단처럼 배치했습니다. 지금 가장 궁금한 질문에 가까운 relic부터 열면 됩니다.",
      cardCtaLabel: "Unseal record",
      lensSummary: {
        all: {
          title: "분위기만이 아니라 전체 구조로 읽습니다.",
          body: "EgoCore, Ashen Archive, OpenEmotion은 호스트, 공개 셸, 반성 코어라는 연결된 세 층입니다.",
        },
        moon: {
          title: "Systems & Runtime in view",
          body: "호스트 로직, 실행 흐름, 상호작용 구조, 안정적으로 돌아가야 하는 부분을 우선해서 읽습니다.",
        },
        tower: {
          title: "Governance & Tooling in view",
          body: "경계 규율, 감사 가능성, 문서, 작은 툴, 구현 제약을 앞으로 가져옵니다.",
        },
        ember: {
          title: "Identity & Narrative in view",
          body: "continuity, reflection, 의미 구조, 그리고 분위기가 이해를 어떻게 바꾸는지에 초점을 둡니다.",
        },
      },
    },
    about: {
      eyebrow: "Oaths",
      title: "겉은 abyss museum, 판단 기준은 여전히 증거입니다.",
      body:
        "외형은 dark fantasy와 의식적 분위기지만, 내부는 여전히 실무형 포트폴리오입니다. 무엇을 만들고 무엇을 맡았으며 어떤 제약을 넘었는지를 읽기 위한 구조입니다.",
      service:
        "핵심 역량은 system-heavy execution입니다. runtime host, governed interface, reflective architecture, portfolio shell, 그리고 추상적인 아이디어를 운영 가능한 형태로 바꾸는 작은 도구들을 다룹니다.",
      recordId: "Record A-01 · Abyss Registry",
      seal: "ZL",
      tags: ["Runtime systems", "Governed interaction", "Identity architecture", "Atmosphere-led interfaces"],
      dossier: [
        { label: "Primary role", value: "System Designer / Interface Builder" },
        { label: "Working label", value: "流月工作室" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Focus", value: "runtime, governance, identity, atmosphere" },
        { label: "Collaboration", value: "prototype, architecture, product support" },
      ],
    },
    disciplines: {
      eyebrow: "Lore",
      title: "분위기를 실제로 떠받치는 네 개의 능력선.",
      intro: "작업을 책임 기준으로 나누면 훨씬 빨리 읽힙니다. 무엇이 구동하고, 무엇이 제약하고, 무엇이 기억하고, 무엇이 공개 경험을 만들고 있는지 드러냅니다.",
      items: [
        {
          title: "Systems & Runtime",
          body: "호스트 로직, 이벤트 흐름, 작업 오케스트레이션, 상호작용 구조를 정리해 보이지 않는 접착제 층으로 붕괴하지 않게 합니다.",
          lenses: ["moon"],
        },
        {
          title: "Governance & Tooling",
          body: "경계, 가드레일, replay, 문서화, 그리고 시스템을 설명 가능하게 유지하는 작은 툴들을 다룹니다.",
          lenses: ["tower"],
        },
        {
          title: "Identity & Memory",
          body: "지속 self-model, reflective revision, appraisal, narrative continuity를 명시적인 설계 대상으로 다룹니다.",
          lenses: ["ember"],
        },
        {
          title: "Atmosphere & Interface",
          body: "scene-led layout, symbolic interaction, visual hierarchy로 분위기를 유지하면서도 본질을 숨기지 않는 인터페이스를 만듭니다.",
          lenses: ["moon", "ember"],
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "세 개의 제단 항목, 각각이 실제 시스템을 가리킵니다.",
      intro: "모두 public-safe 표현을 유지하지만, 프로젝트명, 역할, 제약, 해결 문제는 실제 기준으로 적습니다.",
      featuredLabel: "Central relic",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      evidenceLabel: "Proof",
      lensLabel: "Reading lens",
      openLabel: "Open record",
      shelfLabel: "Current shelf",
      shelfTitle: "세 항목을 연결된 한 세트로 읽습니다.",
      shelfBody: "호스트, 공개 셸, 반성 코어가 서로를 설명하도록 배치되어 있습니다.",
      shelfCta: "Open lead record",
      whatLabel: "Archive note",
      contributionLabel: "Contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Ritual",
      title: "콘텐츠를 잠그지 않고, 읽는 방식을 바꿉니다.",
      intro: "sigil은 미니게임 문이 아니라 읽기 제어기입니다. 같은 세 케이스를 systems / governance / identity 관점으로 재배열합니다.",
      instructions: "sigil을 고르면 archive가 systems, governance, identity를 중심으로 다시 정렬됩니다.",
      currentLensLabel: "Current focus",
      sigilLabel: "Sigil",
      focusCta: "Jump to matching record",
      options: [
        {
          id: "all",
          label: "Whole Archive",
          title: "Read the linked system",
          body: "host runtime, governed shell, reflective core를 함께 읽습니다.",
        },
        {
          id: "moon",
          label: "Moon Crest",
          title: "Systems & Runtime",
          body: "호스트 흐름, 상호작용 구조, 오케스트레이션, 안정 실행이 필요한 부분을 봅니다.",
        },
        {
          id: "tower",
          label: "Tower Mark",
          title: "Governance & Tooling",
          body: "경계, 감사 가능성, 작은 툴, 시스템을 이성적으로 유지하는 구현 제약을 전면에 둡니다.",
        },
        {
          id: "ember",
          label: "Ember Seal",
          title: "Identity & Narrative",
          body: "continuity, reflection, 의미 구조, 그리고 분위기가 만드는 해석을 읽습니다.",
        },
      ],
    },
    relic: {
      fallbackAlt: "Fallback poster for the retired realtime relic stage.",
      unsupportedLabel: "Realtime relic unavailable. Showing fallback poster.",
      sigilLabel: "Active sigil",
      phaseLabel: "Phase",
      modeLabel: "Material mode",
      callsLabel: "Draw calls",
      pointsLabel: "Points",
      phaseNames: {
        hero: "Threshold",
        disciplines: "Discipline",
        sigils: "Sigil",
      },
      modeNames: {
        all: "Balanced shell",
        moon: "Ordered grid",
        tower: "Faceted assembly",
        ember: "Ember trace",
      },
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "분위기와 구조를 둘 다 요구하는 작업이라면, 여기서 시작하면 됩니다.",
      intro:
        "필요한 것은 단순합니다. 제품, 제약, 일정만 공유해 주세요. system discipline, controlled interaction, 혹은 generic하지 않은 public shell이 필요하다면 이 archive는 그 대화를 위해 존재합니다.",
      cardTitle: "Signal Routes",
      cardBody: "Email과 GitHub는 바로 사용할 수 있습니다. dossier 성격의 자료는 안전한 공개 패킷이 준비될 때까지 on request로 둡니다.",
      dossierTitle: "Studio Dossier",
      dossierBody: "이 archive 자체가 첫 번째 설명 역할을 합니다. 다음 대화는 범위와 제약에 집중하도록 설계했습니다.",
      capabilitiesTitle: "Capabilities",
      capabilities: [
        "Runtime / orchestration design for compact systems",
        "Governed interaction and public-safe information architecture",
        "Identity / memory / reflective core framing",
        "Atmosphere-led archive and portfolio presentation",
      ],
      collaborationTitle: "Collaboration notes",
      collaborationBody: "더 선명한 구조, 더 강한 분위기, 혹은 generic하지 않은 public shell이 필요한 프로젝트에 잘 맞습니다.",
      dossierRouteLabel: "dossier",
      dossierActionLabel: "Download dossier",
      dossierUnavailableLabel: "Dossier available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao / 流月工作室. Scene-led, evidence-first, and restrained in motion.",
    },
  },
};
