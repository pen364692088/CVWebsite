import type { Locale } from "@/lib/i18n";

type SigilId = "moon" | "tower" | "ember";

export interface Dictionary {
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    title: string;
    languageLabel: string;
    items: Array<{ id: string; label: string }>;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    body: string;
    enterLabel: string;
    projectLabel: string;
    availability: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    service: string;
    tags: string[];
    dossier: Array<{ label: string; value: string }>;
  };
  disciplines: {
    eyebrow: string;
    title: string;
    intro: string;
    items: Array<{ title: string; body: string }>;
  };
  artifacts: {
    eyebrow: string;
    title: string;
    intro: string;
    featuredLabel: string;
    caseLabel: string;
    categoryLabel: string;
    roleLabel: string;
    openLabel: string;
    lockedLabel: string;
    lockedBody: string;
    unlockTitle: string;
    unlockBody: string;
    unlockCta: string;
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
    statusLabel: string;
    progressLabel: string;
    trayLabel: string;
    socketLabel: string;
    selectLabel: string;
    clearSelectionLabel: string;
    replayLabel: string;
    failedLabel: string;
    successTitle: string;
    successBody: string;
    unlockedCta: string;
    sigils: Array<{ id: SigilId; label: string; socket: string }>;
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
      title: "Ashen Archive | 流月工作室",
      description: "Dark fantasy archive portfolio for Liuyue Studio, focused on Unity systems, technical art, VFX, and production support.",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "Language",
      items: [
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Relic Unlock" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "A Dark Fantasy Studio Archive",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "Liuyue Studio builds game-facing systems and visual implementation work that stay atmospheric, readable, and safe for production.",
      enterLabel: "Open the record",
      projectLabel: "View artifacts",
      availability: "Small-team collaboration, technical art support, and implementation-focused production work.",
    },
    about: {
      eyebrow: "Archive Record",
      title: "A studio record for atmosphere-led implementation work.",
      body:
        "Liuyue Studio operates between visual drama and production discipline, with practice across Unity gameplay systems, artist tooling, VFX integration, and runtime optimization.",
      service:
        "The studio is structured for compact collaboration: playable systems, technical art cleanup, tool support, and presentation work that should feel authored without becoming fragile.",
      tags: ["Unity Systems Studio", "Technical Art Direction", "Realtime VFX & Shaders", "Tools & Production Support"],
      dossier: [
        { label: "Studio role", value: "Unity Systems / Technical Art Studio" },
        { label: "Founder / Lead", value: "Zhouyu Liao · Creative-Technologist" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Practice", value: "Unity gameplay, technical art, VFX, tooling" },
        { label: "Collaboration", value: "Prototype, feature, and production support" },
      ],
    },
    disciplines: {
      eyebrow: "Disciplines",
      title: "Four directions, one craft language.",
      intro: "The work stays grounded in production: readable systems, controlled spectacle, and pipelines that survive iteration.",
      items: [
        {
          title: "Unity Development",
          body: "Gameplay-facing modules, feature ownership, and systems that continue evolving under production pressure.",
        },
        {
          title: "Technical Art",
          body: "Bridging visual ambition with runtime constraints, tool support, and engine-ready implementation detail.",
        },
        {
          title: "VFX / Shader Work",
          body: "Realtime effects and material treatment that reinforce mood without sacrificing clarity or frame budget.",
        },
        {
          title: "Tools & Optimization",
          body: "Small utilities, validation flows, and performance discipline that help compact teams ship with less friction.",
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "Selected relics from production and experimentation.",
      intro: "Each project is catalogued like a museum record: one featured studio reel, then quieter cases shaped by systems, tools, and technical art support.",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      openLabel: "Open artifact",
      lockedLabel: "Hidden shelf sealed",
      lockedBody: "Restore the three sigils to pull open the archivist drawer.",
      unlockTitle: "Hidden shelf opened",
      unlockBody: "The reliquary opens and the featured studio reel is pulled closest to hand.",
      unlockCta: "Open featured artifact",
      whatLabel: "Archive note",
      contributionLabel: "Studio contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Relic Unlock",
      title: "Return the three sigils to their sockets.",
      intro: "The archive drawer is held shut by a sealed relic. Select a sigil from the tray and place it into the matching socket around the core.",
      instructions: "Pick a sigil from the tray, then place it into the matching socket. On desktop you can also drag a sigil into place.",
      statusLabel: "Seal state",
      progressLabel: "Sigils restored",
      trayLabel: "Sigil tray",
      socketLabel: "Socket",
      selectLabel: "Selected sigil",
      clearSelectionLabel: "Clear selection",
      replayLabel: "Reset relic",
      failedLabel: "That sigil rejects this socket.",
      successTitle: "The seal breaks.",
      successBody: "The reliquary opens, the fire catches, and the hidden archive drawer slides forward.",
      unlockedCta: "Jump to Artifacts",
      sigils: [
        { id: "moon", label: "Moon Crest", socket: "Moon Socket" },
        { id: "tower", label: "Tower Mark", socket: "Tower Socket" },
        { id: "ember", label: "Ember Seal", socket: "Ember Socket" },
      ],
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "Open the studio dossier, not a resume.",
      intro: "This archive is positioned as a compact studio record. The clearest next step is still a direct message.",
      cardTitle: "Signal Routes",
      cardBody: "Email and GitHub are open now. LinkedIn and the formal studio dossier remain request-based until the public material is finalized.",
      dossierTitle: "Studio Dossier",
      dossierBody: "A short collaboration-facing dossier for studios, contracts, and project partners. It summarizes practice, scope, and working model rather than personal hiring history.",
      capabilitiesTitle: "Capabilities",
      capabilities: [
        "Unity gameplay systems and implementation support",
        "Technical art workflows, tooling, and VFX integration",
        "Presentation polish, shader work, and production cleanup",
      ],
      collaborationTitle: "Collaboration Notes",
      collaborationBody: "Best suited for prototypes, feature implementation, technical art cleanup, and small-team production support with a strong atmosphere requirement.",
      dossierRouteLabel: "Studio dossier",
      dossierActionLabel: "Open studio dossier",
      dossierUnavailableLabel: "Dossier available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by 流月工作室. Built for calm motion, clear systems, and durable presentation.",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Ashen Archive | 流月工作室",
      description: "流月工作室的黑暗奇幻档案馆作品站，聚焦 Unity 系统、技术美术、特效与制作支持。",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "语言",
      items: [
        { id: "about", label: "档案记录" },
        { id: "disciplines", label: "能力方向" },
        { id: "artifacts", label: "馆藏遗物" },
        { id: "fire", label: "遗物解封" },
        { id: "contact", label: "发送信号" },
      ],
    },
    hero: {
      eyebrow: "黑暗奇幻工作室档案馆",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body: "流月工作室专注于面向游戏生产的系统与视觉实现，在氛围、可读性与工程稳定性之间寻找平衡。",
      enterLabel: "打开档案",
      projectLabel: "查看馆藏",
      availability: "适合小团队协作、技术美术支持与偏实现导向的制作工作。",
    },
    about: {
      eyebrow: "档案记录",
      title: "一份关于氛围导向实现工作的工作室档案。",
      body: "流月工作室定位在视觉戏剧性与生产纪律之间，实践范围覆盖 Unity 玩法系统、艺术工具、特效接入与运行时优化。",
      service: "工作室面向紧凑型合作：可玩系统、技术美术整理、工具支持，以及需要作者感但不能脆弱的表现层。",
      tags: ["Unity 系统工作室", "技术美术方向", "实时特效与 Shader", "工具与制作支持"],
      dossier: [
        { label: "工作室角色", value: "Unity 系统 / 技术美术工作室" },
        { label: "创始人 / 负责人", value: "周宇辽 · Creative-Technologist" },
        { label: "地点", value: "加拿大温尼伯" },
        { label: "实践方向", value: "Unity 玩法、技术美术、特效、工具" },
        { label: "合作模式", value: "原型、功能实现与制作支持" },
      ],
    },
    disciplines: {
      eyebrow: "能力方向",
      title: "四个方向，同一种工艺语言。",
      intro: "所有工作都围绕真实制作展开：系统清晰、表现克制、流程经得起迭代。",
      items: [
        {
          title: "Unity 开发",
          body: "面向玩法的模块与系统实现，强调在生产压力下仍可持续演进。",
        },
        {
          title: "技术美术",
          body: "在视觉追求、性能约束与工具支持之间搭建可落地的技术桥梁。",
        },
        {
          title: "特效 / Shader",
          body: "强调氛围与反馈，同时守住可读性与帧预算的实时视觉表达。",
        },
        {
          title: "工具与优化",
          body: "通过小型工具、校验流程与性能纪律，降低紧凑团队的制作摩擦。",
        },
      ],
    },
    artifacts: {
      eyebrow: "馆藏遗物",
      title: "来自项目与试验的精选条目。",
      intro: "每个项目都按馆藏记录陈列：一件重点工作室作品，其余作为系统、工具与技术美术支持的补充档案。",
      featuredLabel: "精选",
      caseLabel: "馆藏编号",
      categoryLabel: "类别",
      roleLabel: "职责",
      openLabel: "查看遗物",
      lockedLabel: "隐藏抽屉已封印",
      lockedBody: "把三枚符印归位后，档案员抽屉才会开启。",
      unlockTitle: "隐藏抽屉已开启",
      unlockBody: "封印解除后，重点工作室作品被推到最前方，方便直接查看。",
      unlockCta: "打开精选作品",
      whatLabel: "档案说明",
      contributionLabel: "工作室负责内容",
      techLabel: "使用技术",
      solvedLabel: "解决的问题",
      mediaLabel: "媒体资料",
      closeLabel: "关闭详情",
    },
    game: {
      eyebrow: "遗物解封",
      title: "让三枚符印回到各自的槽位。",
      intro: "作品抽屉被一件封印遗物锁住了。从下方符印托盘中选择符印，并把它放到核心周围对应的槽位里。",
      instructions: "先从托盘中选中一枚符印，再放入匹配的槽位。桌面端也可直接拖拽到对应位置。",
      statusLabel: "封印状态",
      progressLabel: "已归位符印",
      trayLabel: "符印托盘",
      socketLabel: "槽位",
      selectLabel: "当前选中",
      clearSelectionLabel: "清除选择",
      replayLabel: "重置遗物",
      failedLabel: "这枚符印无法嵌入该槽位。",
      successTitle: "封印已破裂。",
      successBody: "遗物解封、火光点亮，隐藏档案抽屉向前滑出。",
      unlockedCta: "跳转到馆藏区",
      sigils: [
        { id: "moon", label: "月纹", socket: "月纹槽位" },
        { id: "tower", label: "塔印", socket: "塔印槽位" },
        { id: "ember", label: "余烬印", socket: "余烬槽位" },
      ],
    },
    contact: {
      eyebrow: "发送信号",
      title: "打开的是工作室档案，不是个人简历。",
      intro: "这个站点现在被定义为一份紧凑的工作室档案。最清晰的下一步仍然是直接沟通。",
      cardTitle: "信号路径",
      cardBody: "邮箱和 GitHub 已可直接使用。LinkedIn 与正式工作室档案目前保留为按需提供。",
      dossierTitle: "工作室档案",
      dossierBody: "这是一份面向合作与项目沟通的简短工作室资料，强调能力范围、合作方式与工作模型，而不是个人求职履历。",
      capabilitiesTitle: "能力摘要",
      capabilities: ["Unity 玩法系统与实现支持", "技术美术流程、工具与特效接入", "表现打磨、Shader 处理与制作整理"],
      collaborationTitle: "合作说明",
      collaborationBody: "更适合原型开发、功能实现、技术美术整理，以及强调氛围控制的小团队制作支持。",
      dossierRouteLabel: "工作室档案",
      dossierActionLabel: "打开工作室档案",
      dossierUnavailableLabel: "工作室档案可按需提供",
      unavailableLabel: "可私下提供",
    },
    footer: {
      line: "Ashen Archive，由流月工作室构建。强调克制动效、清晰系统与可持续展示。",
    },
  },
  ja: {
    metadata: {
      title: "Ashen Archive | 流月工作室",
      description: "流月工作室によるダークファンタジー調アーカイブ。Unity システム、テクニカルアート、VFX、制作支援を展示します。",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "言語",
      items: [
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Relic Unlock" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "ダークファンタジー・スタジオアーカイブ",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "流月工作室は、ゲーム制作向けのシステムとビジュアル実装を、雰囲気・可読性・安定性の均衡で形にします。",
      enterLabel: "記録を開く",
      projectLabel: "Artifacts を見る",
      availability: "小規模チームとの協業、技術美術支援、実装寄りの制作支援に対応します。",
    },
    about: {
      eyebrow: "Archive Record",
      title: "雰囲気主導の実装仕事を記録するスタジオ档案。",
      body:
        "流月工作室は、ビジュアルの劇性と制作規律のあいだで機能する小さなスタジオです。Unity ゲームプレイ、アーティストツール、VFX、実行時最適化を横断します。",
      service:
        "想定する協業は、プレイアブルな仕組み、技術美術の整理、ツール支援、そして壊れにくい演出レイヤーの実装です。",
      tags: ["Unity Systems Studio", "Technical Art Practice", "Realtime VFX & Shaders", "Tools & Production Support"],
      dossier: [
        { label: "Studio role", value: "Unity Systems / Technical Art Studio" },
        { label: "Founder / Lead", value: "Zhouyu Liao · Creative-Technologist" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Practice", value: "Unity gameplay, technical art, VFX, tooling" },
        { label: "Collaboration", value: "Prototype, feature, production support" },
      ],
    },
    disciplines: {
      eyebrow: "Disciplines",
      title: "四つの方向、ひとつの制作言語。",
      intro: "すべての仕事は実際の制作に根ざしています。可読性、抑制、そして反復に耐える運用性です。",
      items: [
        {
          title: "Unity Development",
          body: "制作圧の中でも継続改善できる、ゲームプレイ寄りのモジュールとシステム実装。",
        },
        {
          title: "Technical Art",
          body: "ビジュアル要求、性能制約、ツール支援をつなぐための実装設計。",
        },
        {
          title: "VFX / Shader Work",
          body: "雰囲気を保ちながら、可読性とフレーム予算を守るリアルタイム表現設計。",
        },
        {
          title: "Tools & Optimization",
          body: "小さなツール、検証フロー、性能規律で小規模チームの摩擦を下げる支援。",
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "制作と試行から残した収蔵記録。",
      intro: "各プロジェクトを博物館の索引カードのように整理しています。中心にはスタジオの代表リール、その周囲にシステム、ツール、技術美術支援の記録を配置しました。",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      openLabel: "Open artifact",
      lockedLabel: "隠し棚は封印中",
      lockedBody: "三つの符印を戻すと、アーキビストの引き出しが開きます。",
      unlockTitle: "隠し棚が開きました",
      unlockBody: "封印が解かれ、代表リールがもっとも近い位置へ引き出されます。",
      unlockCta: "代表 Artifact を開く",
      whatLabel: "Archive note",
      contributionLabel: "Studio contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Relic Unlock",
      title: "三つの符印を、それぞれの受け口へ戻す。",
      intro: "アーカイブの引き出しは封印遺物によって閉ざされています。下の符印トレイから印を選び、中央の周囲にある対応スロットへ戻してください。",
      instructions: "まずトレイから符印を選び、対応する受け口へ置きます。デスクトップではドラッグでも配置できます。",
      statusLabel: "封印状態",
      progressLabel: "復元済み符印",
      trayLabel: "符印トレイ",
      socketLabel: "受け口",
      selectLabel: "選択中の符印",
      clearSelectionLabel: "選択解除",
      replayLabel: "遺物をリセット",
      failedLabel: "その符印はこの受け口に適合しません。",
      successTitle: "封印が砕けました。",
      successBody: "遺物が開き、火が灯り、隠し引き出しが前へ滑り出します。",
      unlockedCta: "Artifacts へ移動",
      sigils: [
        { id: "moon", label: "月章", socket: "月章の受け口" },
        { id: "tower", label: "塔印", socket: "塔印の受け口" },
        { id: "ember", label: "灰火印", socket: "灰火印の受け口" },
      ],
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "ここで開くのは履歴書ではなく、スタジオ档案です。",
      intro: "このサイトは現在、コンパクトなスタジオ記録として構成されています。次の一歩として最も明快なのは直接連絡です。",
      cardTitle: "Signal Routes",
      cardBody: "Email と GitHub は公開済みです。LinkedIn と正式なスタジオ資料は、現時点では request ベースで扱います。",
      dossierTitle: "Studio Dossier",
      dossierBody: "これは協業や案件相談のための短いスタジオ資料です。個人の採用履歴ではなく、能力範囲・作業モデル・連携の前提を示します。",
      capabilitiesTitle: "Capabilities",
      capabilities: [
        "Unity gameplay systems and implementation support",
        "Technical art workflow, tooling, and VFX integration",
        "Presentation polish, shader treatment, and production cleanup",
      ],
      collaborationTitle: "Collaboration Notes",
      collaborationBody: "プロトタイプ、機能実装、技術美術の整理、そして強い雰囲気設計が必要な小規模制作支援に向いています。",
      dossierRouteLabel: "Studio dossier",
      dossierActionLabel: "Open studio dossier",
      dossierUnavailableLabel: "Dossier available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by 流月工作室. Calm motion, clear systems, durable presentation.",
    },
  },
  ko: {
    metadata: {
      title: "Ashen Archive | 流月工作室",
      description: "流月工作室의 다크 판타지 아카이브. Unity 시스템, 테크니컬 아트, VFX, 제작 지원 작업을 전시합니다.",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "언어",
      items: [
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Relic Unlock" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "다크 판타지 스튜디오 아카이브",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "流月工作室는 게임 제작을 위한 시스템과 비주얼 구현을 분위기, 가독성, 안정성의 균형 속에서 구축합니다.",
      enterLabel: "기록 열기",
      projectLabel: "Artifacts 보기",
      availability: "소규모 팀 협업, 테크니컬 아트 지원, 구현 중심 제작 업무에 적합합니다.",
    },
    about: {
      eyebrow: "Archive Record",
      title: "분위기 중심 구현 작업을 기록하는 스튜디오 아카이브.",
      body:
        "流月工作室는 시각적 드라마와 제작 규율 사이에서 움직이는 소규모 스튜디오입니다. Unity 게임플레이, 아티스트 툴, VFX, 런타임 최적화를 가로지릅니다.",
      service:
        "플레이어블 시스템, 테크니컬 아트 정리, 툴 지원, 그리고 무너지지 않는 표현 레이어 구현을 중심으로 협업합니다.",
      tags: ["Unity Systems Studio", "Technical Art Practice", "Realtime VFX & Shaders", "Tools & Production Support"],
      dossier: [
        { label: "Studio role", value: "Unity Systems / Technical Art Studio" },
        { label: "Founder / Lead", value: "Zhouyu Liao · Creative-Technologist" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Practice", value: "Unity gameplay, technical art, VFX, tooling" },
        { label: "Collaboration", value: "Prototype, feature, production support" },
      ],
    },
    disciplines: {
      eyebrow: "Disciplines",
      title: "네 갈래의 방향, 하나의 제작 언어.",
      intro: "모든 작업은 실제 제작에 기반합니다. 읽히는 시스템, 절제된 표현, 반복에 견디는 운용성입니다.",
      items: [
        {
          title: "Unity Development",
          body: "제작 압박 속에서도 계속 확장할 수 있는 게임플레이 중심 모듈과 시스템 구현.",
        },
        {
          title: "Technical Art",
          body: "비주얼 목표, 성능 제약, 도구 지원을 연결하는 구현 설계.",
        },
        {
          title: "VFX / Shader Work",
          body: "분위기를 유지하면서도 가독성과 프레임 예산을 지키는 실시간 표현 설계.",
        },
        {
          title: "Tools & Optimization",
          body: "작은 도구, 검증 흐름, 성능 규율로 소규모 팀의 마찰을 줄이는 지원.",
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts",
      title: "제작과 실험에서 남겨둔 전시 기록.",
      intro: "각 프로젝트를 박물관 색인 카드처럼 정리했습니다. 중심에는 스튜디오 대표 릴을 두고, 그 주변에 시스템, 툴, 테크니컬 아트 지원 사례를 배치했습니다.",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      openLabel: "Open artifact",
      lockedLabel: "숨겨진 서랍이 봉인됨",
      lockedBody: "세 개의 문양을 제자리에 돌려놓으면 보관 서랍이 열립니다.",
      unlockTitle: "숨겨진 서랍이 열렸습니다",
      unlockBody: "봉인이 풀리며 대표 스튜디오 릴이 가장 가까운 위치로 끌려옵니다.",
      unlockCta: "대표 Artifact 열기",
      whatLabel: "Archive note",
      contributionLabel: "Studio contribution",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Relic Unlock",
      title: "세 개의 문양을 각자의 소켓으로 돌려놓으세요.",
      intro: "아카이브 서랍은 봉인 유물에 의해 잠겨 있습니다. 아래 트레이에서 문양을 고르고, 중심 주변의 대응 소켓에 되돌려 놓으세요.",
      instructions: "먼저 트레이에서 문양을 고른 뒤 대응하는 소켓에 놓습니다. 데스크톱에서는 드래그로도 배치할 수 있습니다.",
      statusLabel: "봉인 상태",
      progressLabel: "복원된 문양",
      trayLabel: "문양 트레이",
      socketLabel: "소켓",
      selectLabel: "선택된 문양",
      clearSelectionLabel: "선택 해제",
      replayLabel: "유물 초기화",
      failedLabel: "이 문양은 해당 소켓에 맞지 않습니다.",
      successTitle: "봉인이 깨졌습니다.",
      successBody: "유물이 열리고 불빛이 살아나며 숨겨진 서랍이 앞으로 밀려 나옵니다.",
      unlockedCta: "Artifacts로 이동",
      sigils: [
        { id: "moon", label: "월문", socket: "월문 소켓" },
        { id: "tower", label: "탑인", socket: "탑인 소켓" },
        { id: "ember", label: "여화인", socket: "여화인 소켓" },
      ],
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "여기서 여는 것은 이력서가 아니라 스튜디오 도서입니다.",
      intro: "이 사이트는 이제 간결한 스튜디오 기록으로 정리되어 있습니다. 가장 분명한 다음 단계는 직접 연락입니다.",
      cardTitle: "Signal Routes",
      cardBody: "이메일과 GitHub는 공개되어 있습니다. LinkedIn과 정식 스튜디오 도서는 현재 요청 기반으로만 제공합니다.",
      dossierTitle: "Studio Dossier",
      dossierBody: "협업과 프로젝트 상담을 위한 짧은 스튜디오 자료입니다. 개인 채용 이력보다 능력 범위, 작업 모델, 협업 전제를 설명합니다.",
      capabilitiesTitle: "Capabilities",
      capabilities: [
        "Unity gameplay systems and implementation support",
        "Technical art workflow, tooling, and VFX integration",
        "Presentation polish, shader treatment, and production cleanup",
      ],
      collaborationTitle: "Collaboration Notes",
      collaborationBody: "프로토타입, 기능 구현, 테크니컬 아트 정리, 그리고 강한 분위기 제어가 필요한 소규모 제작 지원에 적합합니다.",
      dossierRouteLabel: "Studio dossier",
      dossierActionLabel: "Open studio dossier",
      dossierUnavailableLabel: "Dossier available on request",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by 流月工作室. Calm motion, clear systems, durable presentation.",
    },
  },
};
