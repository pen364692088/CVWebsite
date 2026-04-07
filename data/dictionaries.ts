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
    subtitle: string;
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
      eyebrow: "Abyssal Archive",
      archiveLabel: "Echoes of the Abyss",
      subtitle: "Enter the archive. Wake the forgotten.",
      identity: "Zhouyu Liao / 流月工作室",
      studioCredit: "Ashen Archive · ritual dossier",
      role: "Three altar records. One abyssal index.",
      body:
        "A scene-led threshold for three public-safe projects, rebuilt as a dark archive rather than a generic portfolio shell.",
      proofChips: ["Runtime host design", "Governed tooling and audit", "Identity / memory architecture"],
      enterLabel: "Enter the abyss",
      projectLabel: "Read the archive",
      availability: "Three relics stand at the threshold. Choose the record that answers your question first.",
      focusLabel: "Current reading lens",
      ritualLabel: "Altar Relics",
      ritualIntro: "Three real systems, retold as relics guarded by ash, iron, and fire.",
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
      title: "Invoke a rite beneath the altar.",
      intro: "These commands do not lock the archive. They change how the same three records are read.",
      instructions: "Choose flame, spirit, or raven to retune the archive around identity, governance, or systems.",
      currentLensLabel: "Current rite",
      sigilLabel: "Command",
      focusCta: "Read matching record",
      options: [
        {
          id: "all",
          label: "Archive Seal",
          title: "Whole abyss",
          body: "Balanced view across the three altar records.",
        },
        {
          id: "moon",
          label: "Send a Raven",
          title: "Systems & Runtime",
          body: "Follow structure, host flow, and the parts that must execute cleanly.",
        },
        {
          id: "tower",
          label: "Summon the Spirit",
          title: "Governance & Tooling",
          body: "Bring boundaries, audit, and implementation discipline to the surface.",
        },
        {
          id: "ember",
          label: "Kindle the Flame",
          title: "Identity & Narrative",
          body: "Pull continuity, reflection, and atmosphere into the foreground.",
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
      eyebrow: "深渊档案馆",
      archiveLabel: "Echoes of the Abyss",
      subtitle: "步入档案馆，唤醒被遗忘之物。",
      identity: "周宇辽 / 流月工作室",
      studioCredit: "Ashen Archive · 仪式档案",
      role: "三件祭坛记录，一座深渊索引。",
      body:
        "这是一个以场景为入口的阈限页面：三件公开安全项目，被重新讲述成灰烬、铁与火守护的馆藏遗物。",
      proofChips: ["Runtime 宿主设计", "治理 / 工具 / 审计", "身份 / 记忆架构"],
      enterLabel: "进入深渊",
      projectLabel: "阅读档案",
      availability: "三件遗物立于门前。先打开最接近你问题的那一件。",
      focusLabel: "当前阅读视角",
      ritualLabel: "祭坛遗物",
      ritualIntro: "三个真实系统，被重新陈列成灰烬、铁与火所守护的祭坛条目。",
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
      title: "在祭坛下方唤起一条仪式命令。",
      intro: "这些命令不会把内容锁起来，只会改变三件遗物被阅读的顺序。",
      instructions: "选择火焰、灵体或乌鸦，让档案分别围绕身份、治理或系统来显形。",
      currentLensLabel: "当前仪式",
      sigilLabel: "命令",
      focusCta: "阅读对应档案",
      options: [
        {
          id: "all",
          label: "档案封印",
          title: "整座深渊",
          body: "平衡阅读三件祭坛记录。",
        },
        {
          id: "moon",
          label: "放出渡鸦",
          title: "系统与 Runtime",
          body: "追踪宿主结构、执行流和必须稳定运行的部分。",
        },
        {
          id: "tower",
          label: "召来幽魂",
          title: "治理与工具",
          body: "把边界、审计和实现纪律带到前景。",
        },
        {
          id: "ember",
          label: "点燃火焰",
          title: "身份与叙事",
          body: "把连续性、反思和氛围推到最前面。",
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
      eyebrow: "Abyssal Archive",
      archiveLabel: "Echoes of the Abyss",
      subtitle: "Enter the archive. Wake the forgotten.",
      identity: "Zhouyu Liao / 流月工作室",
      studioCredit: "Ashen Archive · ritual dossier",
      role: "3 つの祭壇記録、ひとつの abyssal index。",
      body:
        "3 つの public-safe project を、灰・鉄・火に守られた relic として再構成した threshold page です。",
      proofChips: ["Runtime host design", "Governance / tooling / audit", "Identity / memory architecture"],
      enterLabel: "Enter the abyss",
      projectLabel: "Read the archive",
      availability: "3 つの relic が門前に並びます。最初に読むべき記録を選んでください。",
      focusLabel: "Current reading lens",
      ritualLabel: "Altar Relics",
      ritualIntro: "3 つの実案件を、灰・鉄・火で守られた祭壇 entry として再配置しています。",
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
      title: "祭壇の下で ritual command を呼び出す。",
      intro: "content を閉じるのではなく、3 つの record の読み順だけを変えます。",
      instructions: "flame、spirit、raven を選ぶと、identity・governance・systems のどれを前面に出すかが切り替わります。",
      currentLensLabel: "Current rite",
      sigilLabel: "Command",
      focusCta: "Jump to matching record",
      options: [
        {
          id: "all",
          label: "Archive Seal",
          title: "Whole abyss",
          body: "3 つの祭壇記録を均等に読む。",
        },
        {
          id: "moon",
          label: "Send a Raven",
          title: "Systems & Runtime",
          body: "構造、ホストフロー、安定実行が必要な部分を追います。",
        },
        {
          id: "tower",
          label: "Summon the Spirit",
          title: "Governance & Tooling",
          body: "境界、監査性、実装規律を前面に出します。",
        },
        {
          id: "ember",
          label: "Kindle the Flame",
          title: "Identity & Narrative",
          body: "continuity、reflection、雰囲気による意味づけを前面に出します。",
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
      eyebrow: "Abyssal Archive",
      archiveLabel: "Echoes of the Abyss",
      subtitle: "Enter the archive. Wake the forgotten.",
      identity: "Zhouyu Liao / 流月工作室",
      studioCredit: "Ashen Archive · ritual dossier",
      role: "세 개의 제단 기록, 하나의 abyssal index.",
      body:
        "세 개의 public-safe 프로젝트를 재와 쇠, 불이 지키는 relic처럼 다시 엮은 threshold page입니다.",
      proofChips: ["Runtime host design", "Governance / tooling / audit", "Identity / memory architecture"],
      enterLabel: "Enter the abyss",
      projectLabel: "Read the archive",
      availability: "세 개의 relic이 문 앞에 놓여 있습니다. 먼저 읽을 기록을 하나 고르세요.",
      focusLabel: "Current reading lens",
      ritualLabel: "Altar Relics",
      ritualIntro: "세 개의 실제 프로젝트를 재, 쇠, 불이 지키는 제단 항목으로 다시 배치했습니다.",
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
      title: "제단 아래에서 ritual command를 호출합니다.",
      intro: "콘텐츠를 잠그지 않고, 세 기록의 읽는 순서만 바꿉니다.",
      instructions: "flame, spirit, raven 가운데 하나를 골라 identity, governance, systems 중 어떤 관점이 앞에 올지 바꿉니다.",
      currentLensLabel: "Current rite",
      sigilLabel: "Command",
      focusCta: "Jump to matching record",
      options: [
        {
          id: "all",
          label: "Archive Seal",
          title: "Whole abyss",
          body: "세 개의 제단 기록을 균형 있게 읽습니다.",
        },
        {
          id: "moon",
          label: "Send a Raven",
          title: "Systems & Runtime",
          body: "구조, 호스트 흐름, 안정 실행이 필요한 부분을 따라갑니다.",
        },
        {
          id: "tower",
          label: "Summon the Spirit",
          title: "Governance & Tooling",
          body: "경계, 감사 가능성, 구현 규율을 전면에 둡니다.",
        },
        {
          id: "ember",
          label: "Kindle the Flame",
          title: "Identity & Narrative",
          body: "continuity, reflection, 분위기가 만드는 해석을 전면에 둡니다.",
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
