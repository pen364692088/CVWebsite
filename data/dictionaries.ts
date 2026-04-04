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
    movesLabel: string;
    ringLabels: string[];
    rotateLeftLabel: string;
    rotateRightLabel: string;
    startLabel: string;
    readyLabel: string;
    igniteLabel: string;
    replayLabel: string;
    failedLabel: string;
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
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Relic Unlock" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "A Dark Fantasy Archive",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "Zhouyu Liao builds game-facing systems and visual implementations that stay atmospheric, readable, and production-safe.",
      enterLabel: "Enter the record",
      projectLabel: "Open artifacts",
      availability: "Open to Unity, technical art, and game development collaborations.",
    },
    about: {
      eyebrow: "Archive Record",
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
      eyebrow: "Disciplines",
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
      eyebrow: "Artifacts",
      title: "Selected relics from production and experimentation.",
      intro: "Each project is catalogued like a museum record: one featured reel, then quieter cases shaped by systems, tools, and technical art support.",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      openLabel: "Open artifact",
      lockedLabel: "Hidden shelf sealed",
      lockedBody: "Solve the reliquary to open the archivist drawer.",
      unlockTitle: "Hidden shelf opened",
      unlockBody: "The reliquary answer reveals an archivist drawer with the featured reel close at hand.",
      unlockCta: "Open featured artifact",
      whatLabel: "What it is",
      contributionLabel: "What I handled",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Relic Unlock",
      title: "Align the rune rings and unseal the hidden shelf.",
      intro: "A sealed reliquary guards part of the archive. Rotate the three rings into alignment, then release the lock to reveal the drawer beneath the artifact hall.",
      instructions:
        "Use the ring controls, or use Arrow Up and Arrow Down to choose a ring and Arrow Left and Arrow Right to rotate it. Press Enter once the seal is aligned.",
      statusLabel: "Seal state",
      movesLabel: "Moves remaining",
      ringLabels: ["Outer Ring", "Middle Ring", "Inner Ring"],
      rotateLeftLabel: "Rotate left",
      rotateRightLabel: "Rotate right",
      startLabel: "Begin the rite",
      readyLabel: "The seal is aligned.",
      igniteLabel: "Release the archive",
      replayLabel: "Reset the relic",
      failedLabel: "The seal hardens again. Reset the rings and try once more.",
      unlockedTitle: "Archive shelf unlocked.",
      unlockedBody: "The hidden drawer is open. The featured reel now sits closest to hand.",
      unlockedCta: "Jump to Artifacts",
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "Start with the clearest route.",
      intro: "For studio roles, freelance collaboration, or technical art support, the fastest path is still a direct message.",
      cardTitle: "Signal Routes",
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
        { id: "about", label: "档案记录" },
        { id: "disciplines", label: "能力方向" },
        { id: "artifacts", label: "馆藏遗物" },
        { id: "fire", label: "遗物解封" },
        { id: "contact", label: "发送信号" },
      ],
    },
    hero: {
      eyebrow: "黑暗奇幻档案馆",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body: "周宇辽专注于面向游戏生产的系统与视觉实现，在氛围、可读性与工程稳定性之间寻找平衡。",
      enterLabel: "进入档案",
      projectLabel: "查看馆藏",
      availability: "可合作方向包括 Unity 开发、技术美术、特效与游戏系统实现。",
    },
    about: {
      eyebrow: "档案记录",
      title: "站在视觉表现与生产纪律之间的构建者。",
      body: "软件开发者 / 技术美术，具备 Unity 玩法系统、艺术工具、特效接入与运行时优化经验。",
      service: "可协助团队搭建可玩的系统、稳定的技术美术流程，以及克制但高级的表现层。",
      tags: ["Unity 开发", "技术美术", "特效 / Shader", "工具与优化"],
      dossier: [
        { label: "身份", value: "软件开发者 / 技术美术" },
        { label: "地点", value: "加拿大温尼伯" },
        { label: "经验", value: "3 年以上已上线与在研项目经验" },
        { label: "背景", value: "软件工程学士" },
      ],
    },
    disciplines: {
      eyebrow: "能力方向",
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
      eyebrow: "馆藏遗物",
      title: "来自项目与试验的精选条目。",
      intro: "每个项目都按档案卡的方式陈列：一件重点馆藏，其余作为系统、工具与技术美术支持的补充记录。",
      featuredLabel: "精选",
      caseLabel: "馆藏编号",
      categoryLabel: "类别",
      roleLabel: "职责",
      openLabel: "查看遗物",
      lockedLabel: "隐藏抽屉已封印",
      lockedBody: "完成遗物解封后，档案员抽屉才会开启。",
      unlockTitle: "隐藏抽屉已开启",
      unlockBody: "封印解开后，重点作品被推到最前方，方便直接查看。",
      unlockCta: "打开精选作品",
      whatLabel: "项目是什么",
      contributionLabel: "我负责的部分",
      techLabel: "使用技术",
      solvedLabel: "解决的问题",
      mediaLabel: "媒体资料",
      closeLabel: "关闭详情",
    },
    game: {
      eyebrow: "遗物解封",
      title: "对齐三重符文环，解开隐藏馆藏。",
      intro: "一件被封印的遗物挡住了档案库。转动三层符文环，让刻痕对齐，再释放封印，打开作品区下方的隐藏抽屉。",
      instructions: "可使用按钮操作，也可用上下方向键切换符文环，用左右方向键旋转。对齐后按 Enter 释放封印。",
      statusLabel: "封印状态",
      movesLabel: "剩余步数",
      ringLabels: ["外环", "中环", "内环"],
      rotateLeftLabel: "向左旋转",
      rotateRightLabel: "向右旋转",
      startLabel: "开始仪式",
      readyLabel: "封印已对齐。",
      igniteLabel: "释放档案",
      replayLabel: "重置遗物",
      failedLabel: "封印重新收紧。重置符文环后再试一次。",
      unlockedTitle: "档案抽屉已解锁。",
      unlockedBody: "隐藏抽屉已经打开，重点作品现在会出现在最近的位置。",
      unlockedCta: "跳转到馆藏区",
    },
    contact: {
      eyebrow: "发送信号",
      title: "先走最清晰的那条路。",
      intro: "无论是正式岗位、自由合作，还是技术美术支持，最有效的开始通常仍然是直接沟通。",
      cardTitle: "信号路径",
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
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Relic Unlock" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "ダークファンタジー・アーカイブ",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "Zhouyu Liao は、ゲーム制作に向けたシステムとビジュアル実装を、雰囲気・可読性・安定性の均衡で形にします。",
      enterLabel: "記録を見る",
      projectLabel: "Artifacts を開く",
      availability: "Unity 開発、テクニカルアート、ゲーム制作の協業に対応可能です。",
    },
    about: {
      eyebrow: "Archive Record",
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
      eyebrow: "Disciplines",
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
      eyebrow: "Artifacts",
      title: "制作と試行から残した収蔵記録。",
      intro: "各プロジェクトを、博物館の索引カードのように整理しています。中心には代表リール、その周囲にシステム、ツール、技術美術支援の記録を配置しました。",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      openLabel: "Open artifact",
      lockedLabel: "隠し棚は封印中",
      lockedBody: "Relic Unlock を解くと、アーキビストの引き出しが開きます。",
      unlockTitle: "隠し棚が開きました",
      unlockBody: "封印が解かれ、代表リールへ最短で触れられる引き出しが現れます。",
      unlockCta: "代表 Artifact を開く",
      whatLabel: "What it is",
      contributionLabel: "What I handled",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Relic Unlock",
      title: "三重のルーン環をそろえ、隠し棚を解放する。",
      intro: "封印された遺物がアーカイブの一部を塞いでいます。三つのリングを回して刻印をそろえ、ロックを解いて作品棚の引き出しを開いてください。",
      instructions:
        "ボタン操作、または上下キーでリング選択、左右キーで回転できます。封印がそろったら Enter で解放します。",
      statusLabel: "封印状態",
      movesLabel: "残り手数",
      ringLabels: ["外環", "中環", "内環"],
      rotateLeftLabel: "左へ回す",
      rotateRightLabel: "右へ回す",
      startLabel: "儀式を始める",
      readyLabel: "封印が整いました。",
      igniteLabel: "アーカイブを解放",
      replayLabel: "遺物をリセット",
      failedLabel: "封印が再び固まりました。リングをリセットして再挑戦してください。",
      unlockedTitle: "アーカイブ棚が解放されました。",
      unlockedBody: "隠し引き出しが開き、代表リールへすぐ辿り着けます。",
      unlockedCta: "Artifacts へ移動",
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "最も明快な経路から始める。",
      intro: "スタジオ応募でも業務委託でも、技術美術の相談でも、最初の一歩は直接連絡が最短です。",
      cardTitle: "Signal Routes",
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
        { id: "about", label: "Archive Record" },
        { id: "disciplines", label: "Disciplines" },
        { id: "artifacts", label: "Artifacts" },
        { id: "fire", label: "Relic Unlock" },
        { id: "contact", label: "Send a Signal" },
      ],
    },
    hero: {
      eyebrow: "다크 판타지 아카이브",
      title: "Ashen Archive",
      subtitle: "Unity Systems, Technical Art, VFX, and Playable Fragments",
      body:
        "Zhouyu Liao는 게임 제작을 위한 시스템과 비주얼 구현을 분위기, 가독성, 안정성의 균형 속에서 구축합니다.",
      enterLabel: "기록 열기",
      projectLabel: "Artifacts 보기",
      availability: "Unity 개발, 테크니컬 아트, 게임 제작 협업에 열려 있습니다.",
    },
    about: {
      eyebrow: "Archive Record",
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
      eyebrow: "Disciplines",
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
      eyebrow: "Artifacts",
      title: "제작과 실험에서 남겨둔 전시 기록.",
      intro: "각 프로젝트를 박물관 색인 카드처럼 정리했습니다. 중심에는 대표 릴을 두고, 그 주변에 시스템, 툴, 테크니컬 아트 지원 사례를 배치했습니다.",
      featuredLabel: "Featured",
      caseLabel: "Case",
      categoryLabel: "Category",
      roleLabel: "Role",
      openLabel: "Open artifact",
      lockedLabel: "숨겨진 서랍이 봉인됨",
      lockedBody: "Relic Unlock을 풀면 기록 보관 서랍이 열립니다.",
      unlockTitle: "숨겨진 서랍이 열렸습니다",
      unlockBody: "봉인이 풀리며 대표 릴로 바로 이어지는 서랍이 드러납니다.",
      unlockCta: "대표 Artifact 열기",
      whatLabel: "What it is",
      contributionLabel: "What I handled",
      techLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Media",
      closeLabel: "Close details",
    },
    game: {
      eyebrow: "Relic Unlock",
      title: "세 개의 룬 링을 맞춰 숨겨진 서랍을 여세요.",
      intro: "봉인된 유물이 아카이브 일부를 가리고 있습니다. 세 개의 링을 돌려 문양을 정렬한 뒤 봉인을 풀면, 작품 구역 아래의 숨겨진 서랍이 열립니다.",
      instructions:
        "버튼으로 조작하거나, 위아래 방향키로 링을 선택하고 좌우 방향키로 회전하세요. 정렬되면 Enter로 봉인을 해제합니다.",
      statusLabel: "봉인 상태",
      movesLabel: "남은 횟수",
      ringLabels: ["바깥 링", "중간 링", "안쪽 링"],
      rotateLeftLabel: "왼쪽 회전",
      rotateRightLabel: "오른쪽 회전",
      startLabel: "의식 시작",
      readyLabel: "봉인이 정렬되었습니다.",
      igniteLabel: "아카이브 해제",
      replayLabel: "유물 초기화",
      failedLabel: "봉인이 다시 굳었습니다. 링을 초기화하고 다시 시도하세요.",
      unlockedTitle: "아카이브 서랍이 열렸습니다.",
      unlockedBody: "숨겨진 서랍이 열려 대표 릴이 가장 가까운 위치에 놓입니다.",
      unlockedCta: "Artifacts로 이동",
    },
    contact: {
      eyebrow: "Send a Signal",
      title: "가장 분명한 경로에서 시작하세요.",
      intro: "스튜디오 지원이든 프리랜스 협업이든, 테크니컬 아트 지원이든, 시작은 직접 연락이 가장 빠릅니다.",
      cardTitle: "Signal Routes",
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
