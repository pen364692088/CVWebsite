import type { Locale } from "@/lib/i18n";

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
    openLabel: string;
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
    progressLabel: string;
    startLabel: string;
    readyLabel: string;
    igniteLabel: string;
    replayLabel: string;
    unlockedTitle: string;
    unlockedBody: string;
    unlockedCta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    cardTitle: string;
    cardBody: string;
    resumeTitle: string;
    resumeBody: string;
    previewLabel: string;
    downloadLabel: string;
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
      description: "Dark fantasy inspired portfolio for Unity systems, technical art, VFX, and playable fragments.",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "Language",
      items: [
        { id: "about", label: "About" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Light the Fire" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "A Dark Fantasy Portfolio",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "Zhouyu Liao builds game-facing systems and visual implementations that stay atmospheric, readable, and production-safe.",
      enterLabel: "Enter",
      projectLabel: "View Projects",
      availability: "Open to Unity, technical art, and game development collaborations.",
    },
    about: {
      eyebrow: "Character Dossier",
      title: "A builder between visual drama and production discipline.",
      body:
        "Software developer and technical artist with experience across Unity gameplay systems, artist tooling, VFX integration, and runtime optimization.",
      service:
        "Available to help teams shape playable systems, technical art workflows, and presentation layers that feel polished without becoming fragile.",
      tags: ["Unity Development", "Technical Art", "VFX / Shader Work", "Tools & Optimization"],
      dossier: [
        { label: "Role", value: "Software Developer / Technical Artist" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Experience", value: "3+ years across shipped and in-production work" },
        { label: "Background", value: "B.E. in Software Engineering" },
      ],
    },
    disciplines: {
      eyebrow: "Core Disciplines",
      title: "Four directions, one craft language.",
      intro: "The work stays grounded in game production: readable systems, controlled spectacle, and pipelines that survive iteration.",
      items: [
        {
          title: "Unity Development",
          body: "Gameplay-facing modules, feature ownership, and systems that can continue evolving under production pressure.",
        },
        {
          title: "Technical Art",
          body: "Bridging visual ambition with runtime constraints, tool support, and engine-ready implementation detail.",
        },
        {
          title: "VFX / Shader Work",
          body: "Realtime effects and material treatment that reinforce mood without sacrificing clarity or performance.",
        },
        {
          title: "Tools & Optimization",
          body: "Smaller utilities, validation flows, and performance discipline that make teams ship with less friction.",
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts of Work",
      title: "Selected fragments from production and experimentation.",
      intro: "A featured reel anchors the archive. Around it: quieter case studies shaped by systems, tools, and technical art support.",
      featuredLabel: "Featured",
      openLabel: "Open artifact",
      whatLabel: "What it is",
      contributionLabel: "What I handled",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Light the Fire",
      title: "Find the three embers and wake the campfire.",
      intro: "A small ritual: move through the dark, gather the hidden sparks, then return to the fire.",
      instructions: "Drag, touch, or use arrow keys to move the light. Reach the campfire and press Enter to ignite once all embers are found.",
      progressLabel: "Embers found",
      startLabel: "Begin the search",
      readyLabel: "The fire is ready.",
      igniteLabel: "Ignite the fire",
      replayLabel: "Play again",
      unlockedTitle: "The signal carries.",
      unlockedBody: "The campfire now reveals the clearest path: send a message, request the reel, or open the resume.",
      unlockedCta: "Go to Contact",
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "Start with the clearest route.",
      intro: "For studio roles, freelance collaboration, or technical art support, the fastest path is still a direct message.",
      cardTitle: "Contact Routes",
      cardBody: "Email and GitHub are ready now. LinkedIn remains a reserved slot until the public profile is finalized.",
      resumeTitle: "Resume Dossier",
      resumeBody: "A light in-site preview, with the full PDF ready for download.",
      previewLabel: "Resume preview",
      downloadLabel: "Download Resume",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao. Built for calm motion, clear systems, and durable presentation.",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Ashen Archive | 周宇辽",
      description: "面向 Unity 系统、技术美术、特效与可玩片段的黑暗奇幻风个人作品站。",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "语言",
      items: [
        { id: "about", label: "档案" },
        { id: "disciplines", label: "能力方向" },
        { id: "artifacts", label: "作品遗物" },
        { id: "fire", label: "点燃篝火" },
        { id: "contact", label: "发送信号" },
      ],
    },
    hero: {
      eyebrow: "黑暗奇幻作品站",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body: "周宇辽专注于面向游戏生产的系统与视觉实现，在氛围、可读性与工程稳定性之间寻找平衡。",
      enterLabel: "进入",
      projectLabel: "查看作品",
      availability: "可合作方向包括 Unity 开发、技术美术、特效与游戏系统实现。",
    },
    about: {
      eyebrow: "角色档案",
      title: "站在视觉表现与生产纪律之间的构建者。",
      body: "软件开发者 / 技术美术，具备 Unity 玩法系统、艺术工具、特效接入与运行时优化经验。",
      service: "可协助团队搭建可玩的系统、稳定的技术美术流程，以及克制但高级的表现层。",
      tags: ["Unity 开发", "技术美术", "特效 / Shader", "工具与优化"],
      dossier: [
        { label: "角色", value: "软件开发者 / 技术美术" },
        { label: "地点", value: "加拿大温尼伯" },
        { label: "经验", value: "3 年以上已上线与在研项目经验" },
        { label: "背景", value: "软件工程学士" },
      ],
    },
    disciplines: {
      eyebrow: "核心能力",
      title: "四个方向，同一种工艺语言。",
      intro: "所有工作都围绕真实游戏制作展开：系统清晰、表现克制、流程经得起迭代。",
      items: [
        {
          title: "Unity 开发",
          body: "面向玩法的模块与系统实现，强调长期迭代下的可维护性与责任边界。",
        },
        {
          title: "技术美术",
          body: "在视觉追求、性能预算与工具支持之间搭建可落地的技术桥梁。",
        },
        {
          title: "特效 / Shader",
          body: "强调情绪氛围、实时反馈与性能控制的视觉效果和材质处理。",
        },
        {
          title: "工具与优化",
          body: "通过小型工具、资产校验与性能纪律，降低团队交付过程中的摩擦。",
        },
      ],
    },
    artifacts: {
      eyebrow: "作品遗物",
      title: "来自项目与试验的精选片段。",
      intro: "以真实作品合集作为核心锚点，向外展开系统、工具与技术美术支撑类案例。",
      featuredLabel: "精选",
      openLabel: "查看详情",
      whatLabel: "项目是什么",
      contributionLabel: "我做了什么",
      techLabel: "使用技术",
      solvedLabel: "解决的问题",
      mediaLabel: "媒体",
      closeLabel: "关闭详情",
    },
    game: {
      eyebrow: "点燃篝火",
      title: "找到三枚火种，唤醒中央篝火。",
      intro: "一个轻量互动仪式：在黑暗中移动光源，收集火种，再回到火堆。",
      instructions: "拖动、触摸或使用方向键移动光源。收集全部火种后靠近篝火并按 Enter 点燃。",
      progressLabel: "已找到火种",
      startLabel: "开始搜寻",
      readyLabel: "篝火已可点燃。",
      igniteLabel: "点燃篝火",
      replayLabel: "重新开始",
      unlockedTitle: "信号已被点亮。",
      unlockedBody: "篝火照亮了最直接的路径：发送消息、查看作品集，或打开简历。",
      unlockedCta: "前往联系区",
    },
    contact: {
      eyebrow: "发送信号",
      title: "先走最清晰的那条路。",
      intro: "无论是正式岗位、自由合作，还是技术美术支持，最有效的开始通常仍然是直接沟通。",
      cardTitle: "联系路径",
      cardBody: "邮箱和 GitHub 已可直接使用。LinkedIn 位置已预留，公开主页后可直接替换。",
      resumeTitle: "简历档案",
      resumeBody: "站内提供轻量预览，同时可直接下载 PDF 完整版。",
      previewLabel: "简历预览",
      downloadLabel: "下载简历",
      unavailableLabel: "可私下提供",
    },
    footer: {
      line: "Ashen Archive，由周宇辽构建。强调克制动效、清晰系统与可持续展示。",
    },
  },
  ja: {
    metadata: {
      title: "Ashen Archive | Zhouyu Liao",
      description: "Unity システム、テクニカルアート、VFX、プレイアブル断片のためのダークファンタジー調ポートフォリオ。",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "言語",
      items: [
        { id: "about", label: "人物像" },
        { id: "disciplines", label: "中核領域" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Light the Fire" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "ダークファンタジー・ポートフォリオ",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "Zhouyu Liao は、ゲーム制作に向けたシステムとビジュアル実装を、雰囲気・可読性・安定性の均衡で形にします。",
      enterLabel: "Enter",
      projectLabel: "View Projects",
      availability: "Unity 開発、テクニカルアート、ゲーム制作の協業に対応可能です。",
    },
    about: {
      eyebrow: "Character Dossier",
      title: "ビジュアル表現と制作規律のあいだで組み立てる人。",
      body:
        "ソフトウェア開発者 / テクニカルアーティスト。Unity のゲームプレイシステム、アーティストツール、VFX 実装、実行時最適化に経験があります。",
      service:
        "プレイアブルなシステム、壊れにくい技術美術フロー、抑制の効いた高品質な表現レイヤー作りを支援できます。",
      tags: ["Unity Development", "Technical Art", "VFX / Shader Work", "Tools & Optimization"],
      dossier: [
        { label: "Role", value: "Software Developer / Technical Artist" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Experience", value: "3+ years in shipped and in-production work" },
        { label: "Background", value: "B.E. in Software Engineering" },
      ],
    },
    disciplines: {
      eyebrow: "Core Disciplines",
      title: "四つの方向、ひとつの制作言語。",
      intro: "すべての仕事は実際のゲーム制作に根ざしています。可読性、抑制、そして反復に耐える運用性です。",
      items: [
        {
          title: "Unity Development",
          body: "長期運用でも崩れにくい、ゲームプレイ寄りのモジュールとシステム実装。",
        },
        {
          title: "Technical Art",
          body: "ビジュアル要求、性能制約、ツール支援をつなぐための実装設計。",
        },
        {
          title: "VFX / Shader Work",
          body: "雰囲気とフィードバックを支えつつ、性能と可読性を守る表現設計。",
        },
        {
          title: "Tools & Optimization",
          body: "小さなツール、検証フロー、性能規律で制作の摩擦を下げる仕事。",
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts of Work",
      title: "制作と試行から残した断片。",
      intro: "実際の作品集を核に据え、そのまわりにシステム、ツール、技術美術支援の事例を配置しています。",
      featuredLabel: "Featured",
      openLabel: "Open artifact",
      whatLabel: "What it is",
      contributionLabel: "What I handled",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Light the Fire",
      title: "三つの火種を集め、中央の火を起こす。",
      intro: "暗がりを進み、火種を集め、焚き火へ戻る小さな儀式です。",
      instructions: "ドラッグ、タッチ、または方向キーで光を動かします。すべて集めたら火の近くで Enter を押してください。",
      progressLabel: "Found embers",
      startLabel: "Begin the search",
      readyLabel: "The fire is ready.",
      igniteLabel: "Ignite the fire",
      replayLabel: "Play again",
      unlockedTitle: "The signal carries.",
      unlockedBody: "火が灯ると、もっとも明瞭な導線が現れます。連絡、リール閲覧、履歴書確認です。",
      unlockedCta: "Go to Contact",
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "最も明快な経路から始める。",
      intro: "スタジオ応募でも業務委託でも、技術美術の相談でも、最初の一歩は直接連絡が最短です。",
      cardTitle: "Contact Routes",
      cardBody: "Email と GitHub はすぐ使えます。LinkedIn は公開プロフィール確定後に差し替える前提です。",
      resumeTitle: "Resume Dossier",
      resumeBody: "サイト内では軽いプレビュー、必要なときは PDF を直接ダウンロードできます。",
      previewLabel: "Resume preview",
      downloadLabel: "Download Resume",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao. Calm motion, clear systems, durable presentation.",
    },
  },
  ko: {
    metadata: {
      title: "Ashen Archive | Zhouyu Liao",
      description: "Unity 시스템, 테크니컬 아트, VFX, 플레이어블 프래그먼트를 위한 다크 판타지 포트폴리오.",
    },
    nav: {
      title: "Ashen Archive",
      languageLabel: "언어",
      items: [
        { id: "about", label: "프로필" },
        { id: "disciplines", label: "핵심 역량" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Light the Fire" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "다크 판타지 포트폴리오",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "Zhouyu Liao는 게임 제작을 위한 시스템과 비주얼 구현을 분위기, 가독성, 안정성의 균형 속에서 구축합니다.",
      enterLabel: "Enter",
      projectLabel: "View Projects",
      availability: "Unity 개발, 테크니컬 아트, 게임 제작 협업에 열려 있습니다.",
    },
    about: {
      eyebrow: "Character Dossier",
      title: "시각적 드라마와 제작 규율 사이에서 만드는 사람.",
      body:
        "소프트웨어 개발자 / 테크니컬 아티스트로서 Unity 게임플레이 시스템, 아티스트 툴, VFX 통합, 런타임 최적화 경험을 갖고 있습니다.",
      service:
        "플레이 가능한 시스템, 안정적인 테크니컬 아트 워크플로, 절제된 고급 표현 레이어 구축을 도울 수 있습니다.",
      tags: ["Unity Development", "Technical Art", "VFX / Shader Work", "Tools & Optimization"],
      dossier: [
        { label: "Role", value: "Software Developer / Technical Artist" },
        { label: "Location", value: "Winnipeg, Canada" },
        { label: "Experience", value: "3+ years in shipped and in-production work" },
        { label: "Background", value: "B.E. in Software Engineering" },
      ],
    },
    disciplines: {
      eyebrow: "Core Disciplines",
      title: "네 갈래의 방향, 하나의 제작 언어.",
      intro: "모든 작업은 실제 게임 제작에 기반합니다. 읽히는 시스템, 절제된 표현, 반복에 견디는 파이프라인입니다.",
      items: [
        {
          title: "Unity Development",
          body: "장기 반복 환경에서도 유지 가능한 게임플레이 중심 모듈과 시스템 구현.",
        },
        {
          title: "Technical Art",
          body: "비주얼 목표, 성능 제약, 도구 지원을 연결하는 구현 설계.",
        },
        {
          title: "VFX / Shader Work",
          body: "분위기와 피드백을 살리면서도 성능과 가독성을 지키는 실시간 표현 설계.",
        },
        {
          title: "Tools & Optimization",
          body: "작은 도구, 검증 흐름, 성능 규율로 팀의 마찰을 줄이는 작업.",
        },
      ],
    },
    artifacts: {
      eyebrow: "Artifacts of Work",
      title: "제작과 실험에서 남겨둔 단서들.",
      intro: "실제 작업 컬렉션을 중심에 두고, 그 주변에 시스템, 도구, 테크니컬 아트 지원 사례를 배치했습니다.",
      featuredLabel: "Featured",
      openLabel: "Open artifact",
      whatLabel: "What it is",
      contributionLabel: "What I handled",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Light the Fire",
      title: "세 개의 불씨를 모아 중앙의 불을 깨우세요.",
      intro: "어둠 속을 이동하며 불씨를 찾고, 다시 모닥불로 돌아오는 작은 의식입니다.",
      instructions: "드래그, 터치, 또는 방향키로 빛을 움직이세요. 모두 모은 뒤 불 가까이에서 Enter 를 누르면 됩니다.",
      progressLabel: "Found embers",
      startLabel: "Begin the search",
      readyLabel: "The fire is ready.",
      igniteLabel: "Ignite the fire",
      replayLabel: "Play again",
      unlockedTitle: "The signal carries.",
      unlockedBody: "불이 켜지면 가장 직접적인 경로가 드러납니다. 연락, 릴 확인, 이력서 열람입니다.",
      unlockedCta: "Go to Contact",
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "가장 분명한 경로에서 시작하세요.",
      intro: "스튜디오 지원이든 프리랜스 협업이든, 테크니컬 아트 지원이든, 시작은 직접 연락이 가장 빠릅니다.",
      cardTitle: "Contact Routes",
      cardBody: "이메일과 GitHub는 지금 바로 사용할 수 있습니다. LinkedIn은 공개 프로필이 정리되면 바로 교체할 수 있도록 자리만 확보했습니다.",
      resumeTitle: "Resume Dossier",
      resumeBody: "사이트 안에서는 가벼운 미리보기, 필요할 때는 PDF 전체 다운로드가 가능합니다.",
      previewLabel: "Resume preview",
      downloadLabel: "Download Resume",
      unavailableLabel: "Available on request",
    },
    footer: {
      line: "Ashen Archive by Zhouyu Liao. Calm motion, clear systems, durable presentation.",
    },
  },
};
