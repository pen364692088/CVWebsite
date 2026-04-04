import type { ArchiveLens, SigilLens } from "@/lib/archive";
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
        "Portfolio archive for Zhouyu Liao / 流月工作室, focused on Unity systems, technical art, VFX, tooling, and production-facing implementation.",
    },
    nav: {
      title: "Ashen Archive",
      identity: "Zhouyu Liao",
      languageLabel: "Language",
      items: [
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Reading Sigils" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "Personal Archive, Studio-Backed",
      archiveLabel: "Ashen Archive",
      identity: "Zhouyu Liao",
      studioCredit: "Working under 流月工作室",
      role: "Unity systems, technical art, VFX, and tooling for atmosphere-led game projects.",
      body:
        "I build gameplay systems, technical art support, and real-time visual implementation that stay readable, maintainable, and safe under production constraints.",
      proofChips: ["Unity feature ownership", "Technical art and tooling", "VFX / shader implementation"],
      enterLabel: "Read the record",
      projectLabel: "See selected artifacts",
      availability: "Best fit: prototypes, feature implementation, technical art cleanup, and small-team collaboration.",
      focusLabel: "Current reading lens",
      lensSummary: {
        all: {
          title: "Start with the strongest proof, then drill deeper.",
          body: "One featured reel and two smaller case records show how systems, technical art, and VFX work together in practice.",
        },
        moon: {
          title: "Unity Systems in view",
          body: "This reading favors feature ownership, gameplay modules, iteration safety, and runtime stability.",
        },
        tower: {
          title: "Technical Art and Tooling in view",
          body: "This reading brings pipeline cleanup, artist support, and production-safe implementation detail forward.",
        },
        ember: {
          title: "VFX and Shader Work in view",
          body: "This reading emphasizes atmosphere, readable feedback, and real-time visual polish without losing frame budget.",
        },
      },
    },
    about: {
      eyebrow: "Archive Record",
      title: "A personal archive framed like a working catalog.",
      body:
        "Ashen Archive is still a portfolio, but it is organized like a quiet museum record so the work can be scanned by responsibility instead of by mood alone.",
      service:
        "The core offering is direct: gameplay systems, technical art support, VFX / shader implementation, and small tools that reduce friction for compact teams.",
      recordId: "Record A-01 · Primary Archive",
      seal: "ZL",
      tags: ["Unity gameplay systems", "Technical art workflows", "Realtime VFX & shaders", "Tools & optimization"],
      dossier: [
        { label: "Primary role", value: "Unity Developer / Technical Artist" },
        { label: "Working label", value: "流月工作室" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Focus", value: "Unity systems, technical art, VFX, tooling" },
        { label: "Collaboration", value: "Prototype, feature, and production support" },
      ],
    },
    disciplines: {
      eyebrow: "Disciplines",
      title: "Four capability lanes, each tied to real delivery.",
      intro: "The archive reads faster when the work is split by responsibility: what gets built, who it serves, and what constraint it had to survive.",
      items: [
        {
          title: "Unity Systems",
          body: "Gameplay modules, feature ownership, and player-facing implementation that can ship, iterate, and hand off cleanly.",
          lenses: ["moon"],
        },
        {
          title: "Technical Art",
          body: "The bridge between visual targets and runtime constraints, including materials, support workflows, and engine-safe polish.",
          lenses: ["tower"],
        },
        {
          title: "VFX / Shader Work",
          body: "Realtime effects and material treatment that reinforce feedback and atmosphere without compromising readability.",
          lenses: ["ember"],
        },
        {
          title: "Tools & Optimization",
          body: "Small utilities, validation rules, and cleanup passes that reduce repeated setup and keep production from getting fragile.",
          lenses: ["moon", "tower"],
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "Selected work, arranged as catalog entries.",
      intro: "Each case shows category, role, technologies, proof points, and the production problem it had to solve.",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      evidenceLabel: "Proof",
      lensLabel: "Reading lens",
      openLabel: "Open artifact",
      shelfLabel: "Current shelf",
      shelfTitle: "Browse the archive as a proof set.",
      shelfBody: "The featured reel carries the broadest range. The supporting cases show how the same practice turns into systems work and production support.",
      shelfCta: "Open lead artifact",
      whatLabel: "Archive note",
      contributionLabel: "Contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Reading Sigils",
      title: "Use the sigils to change how the archive is read.",
      intro: "This is no longer a puzzle. Each sigil reorders the archive around one type of contribution so the evidence becomes easier to scan.",
      instructions: "Choose a sigil to focus the page on Unity systems, technical art / tooling, or VFX / shader work.",
      currentLensLabel: "Current focus",
      sigilLabel: "Sigil",
      focusCta: "Jump to matching artifact",
      options: [
        {
          id: "all",
          label: "Whole Archive",
          title: "Read everything together",
          body: "Balanced overview across systems, technical art, and VFX.",
        },
        {
          id: "moon",
          label: "Moon Crest",
          title: "Unity Systems",
          body: "Gameplay systems, feature ownership, iteration safety, and runtime stability.",
        },
        {
          id: "tower",
          label: "Tower Mark",
          title: "Technical Art / Tooling",
          body: "Pipelines, artist support, editor helpers, and production-safe implementation.",
        },
        {
          id: "ember",
          label: "Ember Seal",
          title: "VFX / Shader",
          body: "Realtime effects, material work, atmosphere, and readable feedback.",
        },
      ],
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "If you need someone who can get ideas into the engine, start here.",
      intro:
        "The fastest next step is still a direct message. Email and GitHub are public; deeper case notes and additional material can follow once the project goals are clear.",
      cardTitle: "Signal Routes",
      cardBody:
        "Use these when you want to talk scope, constraints, timeline, or whether a feature belongs in Unity systems, technical art, or VFX.",
      dossierTitle: "Capabilities and Working Notes",
      dossierBody:
        "This replaces a resume-heavy presentation. It summarizes how I usually help: building systems, cleaning up implementation paths, and shipping atmosphere without making the project fragile.",
      capabilitiesTitle: "Core capabilities",
      capabilities: [
        "Unity gameplay systems and feature implementation",
        "Technical art support, tooling, and pipeline cleanup",
        "Realtime VFX / shader work with production-aware polish",
      ],
      collaborationTitle: "Best collaboration fit",
      collaborationBody:
        "Indie teams, prototypes, vertical slices, feature implementation, technical art cleanup, and production-facing support where visual ambition still has to survive schedule and budget.",
      dossierRouteLabel: "Case notes",
      dossierActionLabel: "Open case notes",
      dossierUnavailableLabel: "Additional notes available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao, with 流月工作室 as the working label. Built for calm motion and clear proof.",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Ashen Archive | 周宇辽",
      description: "周宇辽 / 流月工作室的作品档案馆，聚焦 Unity 系统、技术美术、特效、工具与面向制作的问题解决。",
    },
    nav: {
      title: "Ashen Archive",
      identity: "周宇辽",
      languageLabel: "语言",
      items: [
        { id: "about", label: "档案记录" },
        { id: "disciplines", label: "能力方向" },
        { id: "artifacts", label: "馆藏条目" },
        { id: "fire", label: "符印视角" },
        { id: "contact", label: "发送信号" },
      ],
    },
    hero: {
      eyebrow: "个人档案，工作室背书",
      archiveLabel: "Ashen Archive",
      identity: "周宇辽",
      studioCredit: "以流月工作室为工作标签",
      role: "Unity 系统、技术美术、特效与工具实现。",
      body: "我负责把玩法系统、技术美术支持与实时视觉实现做进引擎，并确保它们在迭代、性能预算和交接阶段依然稳得住。",
      proofChips: ["Unity 功能负责", "技术美术与工具", "特效 / Shader 实现"],
      enterLabel: "查看档案",
      projectLabel: "看代表作品",
      availability: "更适合原型、功能实现、技术美术清理，以及小团队协作型项目。",
      focusLabel: "当前阅读视角",
      lensSummary: {
        all: {
          title: "先看最强证据，再向下细读。",
          body: "一个精选合集加两个较小案例，分别对应系统、技术美术与特效方向的真实工作能力。",
        },
        moon: {
          title: "Unity 系统视角",
          body: "这一视角优先展示功能负责、玩法模块、迭代安全性与运行稳定性。",
        },
        tower: {
          title: "技术美术 / 工具视角",
          body: "这一视角会把流程清理、艺术支持、工具化与可落地实现放到前面。",
        },
        ember: {
          title: "特效 / Shader 视角",
          body: "这一视角强调氛围表现、反馈可读性与实时视觉打磨，同时守住性能预算。",
        },
      },
    },
    about: {
      eyebrow: "档案记录",
      title: "这仍然是作品集，只是被整理成一份更好扫描的档案。",
      body: "Ashen Archive 不是单纯讲氛围的设定页，而是把个人作品经验按职责和证据重新编排，方便快速判断我能交付什么。",
      service: "核心能力很直接：玩法系统、技术美术支持、特效 / Shader 实现，以及能减少团队摩擦的小工具与流程整理。",
      recordId: "记录 A-01 · 主档案",
      seal: "ZY",
      tags: ["Unity 玩法系统", "技术美术流程", "实时特效与 Shader", "工具与优化"],
      dossier: [
        { label: "主要角色", value: "Unity 开发 / 技术美术" },
        { label: "工作标签", value: "流月工作室" },
        { label: "所在地", value: "加拿大温尼伯" },
        { label: "关注方向", value: "Unity 系统、技术美术、特效、工具" },
        { label: "合作方式", value: "原型、功能实现、制作支持" },
      ],
    },
    disciplines: {
      eyebrow: "能力方向",
      title: "四条能力线，分别对应真实交付。",
      intro: "把工作按职责拆开之后，页面会更容易阅读：做了什么、服务谁、要扛什么约束，一眼能看清。",
      items: [
        {
          title: "Unity 系统",
          body: "面向玩法与功能的模块实现，要求能上线、能迭代、也能顺利交接。",
          lenses: ["moon"],
        },
        {
          title: "技术美术",
          body: "在视觉目标和运行约束之间搭桥，包括材质、流程支持与引擎内打磨。",
          lenses: ["tower"],
        },
        {
          title: "特效 / Shader",
          body: "实时特效与材质处理既要强化氛围，也要保证反馈清晰和性能可控。",
          lenses: ["ember"],
        },
        {
          title: "工具与优化",
          body: "用小工具、校验规则和清理工作减少重复劳动，让制作流程没那么脆弱。",
          lenses: ["moon", "tower"],
        },
      ],
    },
    artifacts: {
      eyebrow: "馆藏条目",
      title: "按馆藏条目整理的代表作品。",
      intro: "每个案例都会明确给出类别、职责、技术栈、证据点，以及它实际解决了什么问题。",
      featuredLabel: "精选",
      caseLabel: "条目",
      categoryLabel: "类别",
      roleLabel: "职责",
      evidenceLabel: "证据",
      lensLabel: "阅读视角",
      openLabel: "打开条目",
      shelfLabel: "当前展柜",
      shelfTitle: "把整站当成一组证据来读。",
      shelfBody: "精选合集负责拉齐整体能力范围，两个辅助案例则把同一套能力拆成系统实现与制作支持来读。",
      shelfCta: "打开当前主条目",
      whatLabel: "档案说明",
      contributionLabel: "我的工作",
      techLabel: "使用技术",
      solvedLabel: "解决的问题",
      mediaLabel: "图像 / 视频",
      closeLabel: "关闭详情",
    },
    game: {
      eyebrow: "符印视角",
      title: "用符印切换这份档案的阅读方式。",
      intro: "这里不再是小游戏，而是一个阅读控制器。每个符印都会按贡献类型重新排列页面内容，让重点更快浮出来。",
      instructions: "选择一个符印，把页面聚焦到 Unity 系统、技术美术 / 工具，或特效 / Shader 方向。",
      currentLensLabel: "当前焦点",
      sigilLabel: "符印",
      focusCta: "跳到对应条目",
      options: [
        {
          id: "all",
          label: "完整档案",
          title: "整体阅读",
          body: "同时查看系统、技术美术和特效三个方向的能力分布。",
        },
        {
          id: "moon",
          label: "月纹",
          title: "Unity 系统",
          body: "偏向玩法系统、功能负责、迭代安全性与运行稳定性。",
        },
        {
          id: "tower",
          label: "塔印",
          title: "技术美术 / 工具",
          body: "偏向流程整理、艺术支持、编辑器工具与可落地实现。",
        },
        {
          id: "ember",
          label: "余烬印",
          title: "特效 / Shader",
          body: "偏向实时特效、材质处理、氛围塑造与反馈可读性。",
        },
      ],
    },
    contact: {
      eyebrow: "发送信号",
      title: "如果你需要的是能把想法做进引擎里的人，就从这里开始。",
      intro: "最有效的下一步仍然是直接联系。邮箱和 GitHub 公开可见，更多案例细节和补充资料可以在明确项目目标后再提供。",
      cardTitle: "联系路径",
      cardBody: "当你想讨论范围、约束、排期，或一个功能究竟更偏 Unity 系统、技术美术还是特效实现时，可以直接从这里开始。",
      dossierTitle: "能力说明与工作方式",
      dossierBody: "这里不再强调简历，而是说明我通常如何参与项目：搭系统、理顺实现路径、在不让项目变脆弱的前提下把氛围做出来。",
      capabilitiesTitle: "核心能力",
      capabilities: ["Unity 玩法系统与功能实现", "技术美术支持、工具与流程清理", "面向制作约束的特效 / Shader 打磨"],
      collaborationTitle: "适合的合作方式",
      collaborationBody: "更适合独立团队、原型、垂直切片、功能实现、技术美术清理，以及需要兼顾氛围目标和制作现实的项目。",
      dossierRouteLabel: "补充案例",
      dossierActionLabel: "打开补充说明",
      dossierUnavailableLabel: "补充资料可在沟通后提供",
      unavailableLabel: "可在沟通后提供",
    },
    footer: {
      line: "Ashen Archive 由周宇辽建立，以流月工作室为工作标签。页面只保留克制动效和更清晰的证据表达。",
    },
  },
  ja: {
    metadata: {
      title: "Ashen Archive | Zhouyu Liao",
      description:
        "Zhouyu Liao / 流月工作室 のポートフォリオアーカイブ。Unity システム、テクニカルアート、VFX、ツール、実装支援に焦点を当てています。",
    },
    nav: {
      title: "Ashen Archive",
      identity: "Zhouyu Liao",
      languageLabel: "言語",
      items: [
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Reading Sigils" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "個人アーカイブ / スタジオ補助",
      archiveLabel: "Ashen Archive",
      identity: "Zhouyu Liao",
      studioCredit: "作業ラベル: 流月工作室",
      role: "Unity システム、テクニカルアート、VFX、ツール実装。",
      body:
        "ゲームプレイシステム、テクニカルアート支援、リアルタイム表現の実装を担当し、反復や性能制約の中でも壊れにくい形へまとめます。",
      proofChips: ["Unity 機能実装", "テクニカルアート / ツール", "VFX / Shader 実装"],
      enterLabel: "記録を見る",
      projectLabel: "代表ケースを見る",
      availability: "プロトタイプ、機能実装、テクニカルアート整理、小規模チーム支援に適しています。",
      focusLabel: "現在の読解レンズ",
      lensSummary: {
        all: {
          title: "まず全体像、その後で深掘り。",
          body: "代表リールと 2 つの補助ケースで、システム、テクニカルアート、VFX の関係を読み取れます。",
        },
        moon: {
          title: "Unity Systems を前面に",
          body: "機能担当、ゲームプレイモジュール、反復耐性、ランタイム安定性を優先して読ませます。",
        },
        tower: {
          title: "Technical Art / Tooling を前面に",
          body: "パイプライン整理、アーティスト支援、実装の安全性を重視した読み方です。",
        },
        ember: {
          title: "VFX / Shader を前面に",
          body: "雰囲気づくり、視認性の高いフィードバック、リアルタイム表現の磨き込みに焦点を当てます。",
        },
      },
    },
    about: {
      eyebrow: "Archive Record",
      title: "これは履歴書ではなく、読みやすい形に整理した個人アーカイブです。",
      body:
        "Ashen Archive は雰囲気だけを語るページではなく、何を作り、どの責任を持ち、どんな制約に耐えたかを読み取りやすく並べたポートフォリオです。",
      service:
        "中心にあるのは、ゲームプレイシステム、テクニカルアート支援、VFX / Shader 実装、小さなツールによる制作摩擦の削減です。",
      recordId: "Record A-01 · Primary Archive",
      seal: "ZL",
      tags: ["Unity システム", "テクニカルアート", "リアルタイム VFX", "ツール / 最適化"],
      dossier: [
        { label: "主な役割", value: "Unity Developer / Technical Artist" },
        { label: "作業ラベル", value: "流月工作室" },
        { label: "拠点", value: "Winnipeg, Canada" },
        { label: "重点領域", value: "Unity システム、テクニカルアート、VFX、ツール" },
        { label: "協業形態", value: "プロトタイプ、機能実装、制作支援" },
      ],
    },
    disciplines: {
      eyebrow: "Disciplines",
      title: "4 つの能力線を、実際の成果に結びつけて提示します。",
      intro: "雰囲気ではなく責任ごとに分けることで、何が作れるのか、誰を助けるのか、どんな制約を扱えるのかが早く伝わります。",
      items: [
        {
          title: "Unity Systems",
          body: "ゲームプレイ向けのモジュール、機能担当、引き継ぎまで見据えた実装。",
          lenses: ["moon"],
        },
        {
          title: "Technical Art",
          body: "ビジュアル目標と実行制約の間をつなぐ、素材・ワークフロー・実装整理。",
          lenses: ["tower"],
        },
        {
          title: "VFX / Shader Work",
          body: "空気感と視認性を両立させるリアルタイム表現とマテリアル調整。",
          lenses: ["ember"],
        },
        {
          title: "Tools & Optimization",
          body: "小さなユーティリティ、検証ルール、整理作業で制作の脆さを減らします。",
          lenses: ["moon", "tower"],
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "代表作を、館内の目録のように整理しました。",
      intro: "各ケースには、分類、役割、技術、証拠、そして実際に解決した課題を明記しています。",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      evidenceLabel: "Proof",
      lensLabel: "Reading lens",
      openLabel: "Open artifact",
      shelfLabel: "Current shelf",
      shelfTitle: "証拠セットとしてアーカイブを読む。",
      shelfBody: "代表リールで全体像を示し、補助ケースでシステム実装と制作支援の具体性を補います。",
      shelfCta: "Open lead artifact",
      whatLabel: "Archive note",
      contributionLabel: "Contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Reading Sigils",
      title: "シジルでアーカイブの読み方を切り替えます。",
      intro: "ここはミニゲームではありません。各シジルが、どの種類の貢献を前面に出すかを切り替える読解コントローラです。",
      instructions: "Unity システム、テクニカルアート / ツール、VFX / Shader のどこを優先して読みたいか選んでください。",
      currentLensLabel: "Current focus",
      sigilLabel: "Sigil",
      focusCta: "Jump to matching artifact",
      options: [
        {
          id: "all",
          label: "Whole Archive",
          title: "全体を読む",
          body: "システム、テクニカルアート、VFX をまとめて把握します。",
        },
        {
          id: "moon",
          label: "Moon Crest",
          title: "Unity Systems",
          body: "機能担当、ゲームプレイシステム、反復耐性、安定性を優先。",
        },
        {
          id: "tower",
          label: "Tower Mark",
          title: "Technical Art / Tooling",
          body: "パイプライン整理、アーティスト支援、エディタ補助を優先。",
        },
        {
          id: "ember",
          label: "Ember Seal",
          title: "VFX / Shader",
          body: "リアルタイム表現、マテリアル処理、雰囲気とフィードバックを優先。",
        },
      ],
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "アイデアをエンジンに落とし込める人材が必要なら、ここから始めてください。",
      intro:
        "最短の次の一歩はやはり直接連絡です。Email と GitHub は公開し、より詳細なケースノートは目的が明確になった段階で共有できます。",
      cardTitle: "Signal Routes",
      cardBody: "スコープ、制約、スケジュール、あるいはその課題が Unity システム、テクニカルアート、VFX のどこに属するかを話したい場合に使ってください。",
      dossierTitle: "Capabilities and Working Notes",
      dossierBody: "履歴書を前面に出す代わりに、どうやって関わるかを簡潔に示します。システムを作り、実装経路を整え、雰囲気を壊れにくい形で届けます。",
      capabilitiesTitle: "Core capabilities",
      capabilities: [
        "Unity ゲームプレイシステムと機能実装",
        "テクニカルアート支援、ツール、パイプライン整理",
        "制作制約を意識した VFX / Shader 実装",
      ],
      collaborationTitle: "Best collaboration fit",
      collaborationBody:
        "インディー、小規模チーム、プロトタイプ、縦切りスライス、機能実装、テクニカルアート整理のような案件に向いています。",
      dossierRouteLabel: "Case notes",
      dossierActionLabel: "Open case notes",
      dossierUnavailableLabel: "Additional notes available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao, working under 流月工作室. Calm motion, clearer proof, less noise.",
    },
  },
  ko: {
    metadata: {
      title: "Ashen Archive | Zhouyu Liao",
      description:
        "Zhouyu Liao / 流月工作室의 포트폴리오 아카이브입니다. Unity 시스템, 테크니컬 아트, VFX, 툴링, 제작 지원에 초점을 둡니다.",
    },
    nav: {
      title: "Ashen Archive",
      identity: "Zhouyu Liao",
      languageLabel: "언어",
      items: [
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Reading Sigils" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "개인 아카이브 / 스튜디오 백업",
      archiveLabel: "Ashen Archive",
      identity: "Zhouyu Liao",
      studioCredit: "작업 라벨: 流月工作室",
      role: "Unity 시스템, 테크니컬 아트, VFX, 툴 구현.",
      body:
        "게임플레이 시스템, 테크니컬 아트 지원, 실시간 비주얼 구현을 맡아 반복 제작과 성능 제약 속에서도 안정적으로 유지되는 형태로 다듬습니다.",
      proofChips: ["Unity 기능 구현", "테크니컬 아트 / 툴", "VFX / Shader 구현"],
      enterLabel: "기록 보기",
      projectLabel: "대표 작업 보기",
      availability: "프로토타입, 기능 구현, 테크니컬 아트 정리, 소규모 팀 협업에 잘 맞습니다.",
      focusLabel: "현재 읽기 렌즈",
      lensSummary: {
        all: {
          title: "먼저 전체를 보고, 그다음 세부를 읽습니다.",
          body: "대표 릴 하나와 보조 케이스 둘을 통해 시스템, 테크니컬 아트, VFX의 연결 방식을 빠르게 파악할 수 있습니다.",
        },
        moon: {
          title: "Unity Systems 중심",
          body: "기능 책임, 게임플레이 모듈, 반복 안정성, 런타임 신뢰성을 우선해서 보여줍니다.",
        },
        tower: {
          title: "Technical Art / Tooling 중심",
          body: "파이프라인 정리, 아티스트 지원, 제작 친화적 구현을 전면에 둡니다.",
        },
        ember: {
          title: "VFX / Shader 중심",
          body: "분위기, 읽기 쉬운 피드백, 실시간 비주얼 폴리시를 프레임 예산 안에서 강조합니다.",
        },
      },
    },
    about: {
      eyebrow: "Archive Record",
      title: "이 사이트는 이력서가 아니라, 더 읽기 쉬운 방식으로 정리한 개인 아카이브입니다.",
      body:
        "Ashen Archive는 분위기 설정집이 아니라 무엇을 만들고 어떤 책임을 맡았으며 어떤 제약을 해결했는지 빠르게 읽히도록 정리한 포트폴리오입니다.",
      service:
        "핵심 제공 가치는 명확합니다. 게임플레이 시스템, 테크니컬 아트 지원, VFX / Shader 구현, 그리고 반복 마찰을 줄이는 작은 도구와 정리 작업입니다.",
      recordId: "Record A-01 · Primary Archive",
      seal: "ZL",
      tags: ["Unity 시스템", "테크니컬 아트", "실시간 VFX", "툴 / 최적화"],
      dossier: [
        { label: "주 역할", value: "Unity Developer / Technical Artist" },
        { label: "작업 라벨", value: "流月工作室" },
        { label: "위치", value: "Winnipeg, Canada" },
        { label: "집중 영역", value: "Unity 시스템, 테크니컬 아트, VFX, 툴" },
        { label: "협업 방식", value: "프로토타입, 기능 구현, 제작 지원" },
      ],
    },
    disciplines: {
      eyebrow: "Disciplines",
      title: "네 가지 역량 축을 실제 전달 가치에 맞춰 정리했습니다.",
      intro: "분위기 대신 책임 단위로 나누면 무엇을 만들고 누구를 돕고 어떤 제약을 감당하는지가 더 빨리 드러납니다.",
      items: [
        {
          title: "Unity Systems",
          body: "게임플레이 모듈, 기능 책임, 인수인계까지 고려한 플레이어블 구현.",
          lenses: ["moon"],
        },
        {
          title: "Technical Art",
          body: "비주얼 목표와 런타임 제약 사이를 잇는 머티리얼, 워크플로, 구현 정리.",
          lenses: ["tower"],
        },
        {
          title: "VFX / Shader Work",
          body: "분위기와 가독성을 함께 챙기는 실시간 이펙트와 머티리얼 조정.",
          lenses: ["ember"],
        },
        {
          title: "Tools & Optimization",
          body: "작은 유틸리티, 검증 규칙, 정리 작업으로 제작 과정의 취약함을 줄입니다.",
          lenses: ["moon", "tower"],
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "대표 작업을 박물관 식 카탈로그처럼 정리했습니다.",
      intro: "각 케이스는 분류, 역할, 기술, 증거, 그리고 실제로 해결한 문제를 함께 보여줍니다.",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      evidenceLabel: "Proof",
      lensLabel: "Reading lens",
      openLabel: "Open artifact",
      shelfLabel: "Current shelf",
      shelfTitle: "아카이브를 증거 세트처럼 읽습니다.",
      shelfBody: "대표 릴이 전체 범위를 보여주고, 보조 케이스가 시스템 구현과 제작 지원의 구체성을 보완합니다.",
      shelfCta: "Open lead artifact",
      whatLabel: "Archive note",
      contributionLabel: "Contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Reading Sigils",
      title: "시길로 아카이브 읽는 방식을 바꿉니다.",
      intro: "여기는 더 이상 미니게임이 아닙니다. 각 시길은 어떤 종류의 기여를 전면에 둘지 정하는 읽기 컨트롤러입니다.",
      instructions: "Unity 시스템, 테크니컬 아트 / 툴링, VFX / Shader 중 어느 관점으로 먼저 읽을지 선택하세요.",
      currentLensLabel: "Current focus",
      sigilLabel: "Sigil",
      focusCta: "Jump to matching artifact",
      options: [
        {
          id: "all",
          label: "Whole Archive",
          title: "전체 읽기",
          body: "시스템, 테크니컬 아트, VFX를 균형 있게 훑어봅니다.",
        },
        {
          id: "moon",
          label: "Moon Crest",
          title: "Unity Systems",
          body: "기능 책임, 게임플레이 시스템, 반복 안정성, 런타임 신뢰성에 초점을 둡니다.",
        },
        {
          id: "tower",
          label: "Tower Mark",
          title: "Technical Art / Tooling",
          body: "파이프라인 정리, 아티스트 지원, 에디터 도구를 우선합니다.",
        },
        {
          id: "ember",
          label: "Ember Seal",
          title: "VFX / Shader",
          body: "실시간 이펙트, 머티리얼 작업, 분위기와 피드백을 우선합니다.",
        },
      ],
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "아이디어를 엔진 안으로 넣어야 한다면 여기서 시작하면 됩니다.",
      intro:
        "가장 빠른 다음 단계는 직접 연락하는 것입니다. Email과 GitHub는 공개되어 있고, 더 자세한 케이스 노트는 프로젝트 목표가 정리되면 추가로 공유할 수 있습니다.",
      cardTitle: "Signal Routes",
      cardBody: "범위, 제약, 일정, 혹은 어떤 작업이 Unity 시스템인지 테크니컬 아트인지 VFX인지 같이 정리하고 싶을 때 사용하세요.",
      dossierTitle: "Capabilities and Working Notes",
      dossierBody: "이 섹션은 이력서 대신 제가 보통 어떻게 기여하는지 보여줍니다. 시스템을 만들고, 구현 경로를 정리하고, 프로젝트를 취약하게 만들지 않으면서 분위기를 밀어 올립니다.",
      capabilitiesTitle: "Core capabilities",
      capabilities: [
        "Unity 게임플레이 시스템과 기능 구현",
        "테크니컬 아트 지원, 툴링, 파이프라인 정리",
        "제작 제약을 고려한 VFX / Shader 구현",
      ],
      collaborationTitle: "Best collaboration fit",
      collaborationBody: "인디 팀, 프로토타입, 버티컬 슬라이스, 기능 구현, 테크니컬 아트 정리 같은 작업과 잘 맞습니다.",
      dossierRouteLabel: "Case notes",
      dossierActionLabel: "Open case notes",
      dossierUnavailableLabel: "Additional notes available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao, working under 流月工作室. Calm motion, clearer proof, less noise.",
    },
  },
};
