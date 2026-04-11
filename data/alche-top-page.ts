import type { Locale } from "@/lib/i18n";
import type { AlcheScrollableSectionId, AlcheTopGroupId } from "@/lib/alche-top-page";

export interface AlcheNewsItem {
  date: string;
  title: string;
  href?: string;
}

export interface AlcheWorkItem {
  code: string;
  date: string;
  title: string;
  subtitle: string;
  categories: readonly string[];
}

export interface AlcheServiceItem {
  code: string;
  title: string;
  body: string;
}

export interface AlcheTopPageCopy {
  metadata: {
    title: string;
    description: string;
  };
  loading: {
    eyebrow: string;
    body: string;
  };
  header: {
    navAria: string;
    localeLabel: string;
    navItems: Array<{
      id: "news" | "works" | "about" | "stellla";
      label: string;
      target: AlcheScrollableSectionId;
    }>;
    contactLabel: string;
    recruitLabel: string;
    soundLabel: string;
  };
  indicator: {
    title: string;
    groups: Record<AlcheTopGroupId, string>;
  };
  news: {
    title: string;
    items: AlcheNewsItem[];
  };
  hud: {
    title: string;
    subtitle: string;
    metrics: string[];
    note: string;
  };
  works: {
    eyebrow: string;
    title: string;
    body: string;
    moreLabel: string;
    items: AlcheWorkItem[];
  };
  mission: {
    eyebrow: string;
    title: string;
    body: string;
  };
  vision: {
    eyebrow: string;
    title: string;
    body: string;
  };
  service: {
    eyebrow: string;
    title: string;
    items: AlcheServiceItem[];
  };
  stellla: {
    eyebrow: string;
    title: string;
    body: string;
    frameLabel: string;
  };
  outro: {
    eyebrow: string;
    title: string;
    body: string;
    linksTitle: string;
    legalTitle: string;
    companyLabel: string;
    privacyLabel: string;
    licenseLabel: string;
    copyright: string;
  };
}

const sharedNews = [
  {
    date: "2025 06.26",
    title: "Unreal Fest Bali 2025 appearance",
  },
  {
    date: "2025 05.16",
    title: "WEAR GO LAND launch partnership",
  },
  {
    date: "2024 10.29",
    title: "ReIMAGINE creative team formation",
  },
] as const;

const sharedWorks = [
  {
    code: "WK-01",
    date: "2026 01.17",
    title: "KizunaAI “Hello, Fortnite”",
    subtitle: "In-game concert / spatial runtime",
    categories: ["fortnite", "metaverse", "concert"],
  },
  {
    code: "WK-02",
    date: "2025 05.16",
    title: "WEAR GO LAND",
    subtitle: "Fashion metaverse / mobile + unreal",
    categories: ["stellla", "mobile", "unreal"],
  },
  {
    code: "WK-03",
    date: "2025 02.20",
    title: "DISCOAT 2025SS EXHIBITION",
    subtitle: "Virtual exhibition / cloud rendered spatial retail",
    categories: ["fashion", "cloud", "metaverse"],
  },
  {
    code: "WK-04",
    date: "2024 10.18",
    title: "Matsuken Samba II Rise Up the World",
    subtitle: "Mass live activation / performance world",
    categories: ["fortnite", "live", "brand world"],
  },
] as const;

const sharedService = [
  {
    code: "SV-01",
    title: "Fortnite Creative Works",
    body: "Branded playable worlds and large-scale interactive events built around IP, artists, and audience participation.",
  },
  {
    code: "SV-02",
    title: "Unreal Engine Works",
    body: "Cloud-rendered and device-targeted experiences that extend game-engine quality into immersive entertainment products.",
  },
  {
    code: "SV-03",
    title: "stellla Platform",
    body: "A reusable metaverse platform layer for fashion, live events, and industrial-grade digital spaces.",
  },
] as const;

export const alcheTopPageCopy: Record<Locale, AlcheTopPageCopy> = {
  en: {
    metadata: {
      title: "Alche Top-Page Runtime Rewrite",
      description: "Reference-driven Alche runtime with a persistent single-canvas world, editorial DOM systems, and fine-grained top-page choreography.",
    },
    loading: {
      eyebrow: "Architect worlds",
      body: "that move hearts and spark hope.",
    },
    header: {
      navAria: "Alche top-page navigation",
      localeLabel: "Language",
      navItems: [
        { id: "news", label: "News", target: "kv" },
        { id: "works", label: "Works", target: "works" },
        { id: "about", label: "About", target: "mission" },
        { id: "stellla", label: "stellla", target: "stellla" },
      ],
      contactLabel: "Contact",
      recruitLabel: "Recruit",
      soundLabel: "Sound",
    },
    indicator: {
      title: "Top scroll indicator",
      groups: {
        top: "TOP",
        works: "WORKS",
        about: "ABOUT",
        vision: "VISION",
        service: "SERVICE",
      },
    },
    news: {
      title: "News",
      items: [...sharedNews],
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "One world. Three optical parents. Multiple transition buffers.",
      metrics: ["THICK REFRACTIVE A", "EMISSIVE ALCHE", "CYLINDRICAL MEDIA WALL"],
      note: "Structure now follows the reference state graph; optical exactness remains a later pass.",
    },
    works: {
      eyebrow: "Works / same world, reassigned authority",
      title: "The wall hands off to the card track without leaving the runtime.",
      body: "The main card stabilizes while the side queue keeps the arc logic visible. Editorial metadata stays in DOM and follows the active work.",
      moreLabel: "More Works",
      items: [...sharedWorks],
    },
    mission: {
      eyebrow: "Mission",
      title: "Pioneering immersive and experiential entertainment like no other.",
      body: "The world is purified into a white technical field instead of cutting to a generic content page.",
    },
    vision: {
      eyebrow: "Vision",
      title: "Architect worlds that move hearts and spark hope.",
      body: "Mission and vision are distinct conceptual beats. They are not one undifferentiated about section.",
    },
    service: {
      eyebrow: "Service",
      title: "Production systems across interactive worlds, Unreal environments, and platformized spatial products.",
      items: [...sharedService],
    },
    stellla: {
      eyebrow: "stellla",
      title: "A branded platform module layered over a deeper spatial scene.",
      body: "The architectural read stabilizes first; editorial framing arrives after the space is understood.",
      frameLabel: "Platform frame",
    },
    outro: {
      eyebrow: "Outro",
      title: "The deep scene drains into a black brand stage.",
      body: "The final read is ALCHE, then footer utility. This is an outro system, not a plain contact block.",
      linksTitle: "Links",
      legalTitle: "Legal",
      companyLabel: "Brand system / Zhouyu Liao · 流月工作室",
      privacyLabel: "Privacy Policy",
      licenseLabel: "License",
      copyright: "©2026 Alche runtime study.",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Alche 首页运行时重构",
      description: "按参考站逆向结果重构的 Alche top-page runtime，包含单 canvas 世界、编辑化 DOM 系统和细粒度转场状态图。",
    },
    loading: {
      eyebrow: "构筑世界",
      body: "让它打动人心，并点燃希望。",
    },
    header: {
      navAria: "Alche 首页导航",
      localeLabel: "语言",
      navItems: [
        { id: "news", label: "News", target: "kv" },
        { id: "works", label: "Works", target: "works" },
        { id: "about", label: "About", target: "mission" },
        { id: "stellla", label: "stellla", target: "stellla" },
      ],
      contactLabel: "Contact",
      recruitLabel: "Recruit",
      soundLabel: "声音",
    },
    indicator: {
      title: "滚动指示器",
      groups: {
        top: "TOP",
        works: "WORKS",
        about: "ABOUT",
        vision: "VISION",
        service: "SERVICE",
      },
    },
    news: {
      title: "News",
      items: sharedNews.map((item) => ({ ...item })),
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "同一个世界，三个光学母体，多段过渡缓冲。",
      metrics: ["厚实体折射 A", "发光 ALCHE 字层", "圆柱媒体墙"],
      note: "这轮先把结构对齐参考站；更高的光学精度留到下一轮。",
    },
    works: {
      eyebrow: "Works / 同一世界内的主次转移",
      title: "媒体墙把主读交给卡片轨道，而不是切到另一个页面。",
      body: "主卡稳定后，侧卡仍保留弧线队列。元信息保持为 DOM，并跟随当前作品切换。",
      moreLabel: "More Works",
      items: sharedWorks.map((item) => ({ ...item })),
    },
    mission: {
      eyebrow: "Mission",
      title: "创造前所未有的沉浸式、体验式娱乐。",
      body: "世界被净化成白色技术场，而不是硬切到普通内容页。",
    },
    vision: {
      eyebrow: "Vision",
      title: "构筑能撼动内心、也能激发希望的世界。",
      body: "Mission 和 Vision 是两个独立的概念节拍，不能再被压成一个 about。",
    },
    service: {
      eyebrow: "Service",
      title: "覆盖互动世界、Unreal 场景与平台化空间产品的制作系统。",
      items: sharedService.map((item) => ({ ...item })),
    },
    stellla: {
      eyebrow: "stellla",
      title: "先读到更深的空间，再由品牌化 editorial 模块接管。",
      body: "必须先建立建筑/场景读数，再进入 `stellla` 的版式层。",
      frameLabel: "平台框架",
    },
    outro: {
      eyebrow: "Outro",
      title: "深 3D 世界退场，收束为黑色品牌舞台。",
      body: "最终先读到 ALCHE，再读页脚信息。这里是 outro，不是普通 contact 区块。",
      linksTitle: "链接",
      legalTitle: "法律",
      companyLabel: "品牌系统 / Zhouyu Liao · 流月工作室",
      privacyLabel: "隐私政策",
      licenseLabel: "许可",
      copyright: "©2026 Alche runtime study.",
    },
  },
  ja: {
    metadata: {
      title: "Alche Top-Page Runtime Rewrite",
      description: "参照サイトの逆解析に基づく Alche top-page runtime。単一 canvas、編集的 DOM、細粒度セクション構造を持つ。",
    },
    loading: {
      eyebrow: "Architect worlds",
      body: "that move hearts and spark hope.",
    },
    header: {
      navAria: "Alche top-page navigation",
      localeLabel: "Language",
      navItems: [
        { id: "news", label: "News", target: "kv" },
        { id: "works", label: "Works", target: "works" },
        { id: "about", label: "About", target: "mission" },
        { id: "stellla", label: "stellla", target: "stellla" },
      ],
      contactLabel: "Contact",
      recruitLabel: "Recruit",
      soundLabel: "Sound",
    },
    indicator: {
      title: "Top scroll indicator",
      groups: {
        top: "TOP",
        works: "WORKS",
        about: "ABOUT",
        vision: "VISION",
        service: "SERVICE",
      },
    },
    news: {
      title: "News",
      items: sharedNews.map((item) => ({ ...item })),
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "一つの世界、三つの光学親、複数の遷移バッファ。",
      metrics: ["厚い屈折 A", "発光する ALCHE", "円筒メディアウォール"],
      note: "今回は構造を参照サイトに合わせる。光学の厳密さは次の段階。",
    },
    works: {
      eyebrow: "Works / 同じ世界の中で権威が移る",
      title: "メディアウォールからカードトラックへ主読が引き渡される。",
      body: "メインカードが安定しても、サイドカードが弧の論理を保つ。メタデータは DOM に残り、アクティブ作品と同期する。",
      moreLabel: "More Works",
      items: sharedWorks.map((item) => ({ ...item })),
    },
    mission: {
      eyebrow: "Mission",
      title: "これまでにない没入型・体験型エンターテインメントを生み出す。",
      body: "世界は白い技術場へ純化され、一般的な内容ページへは切り替わらない。",
    },
    vision: {
      eyebrow: "Vision",
      title: "心を揺さぶり、希望を持てる世界を作る。",
      body: "Mission と Vision は別の概念ビートであり、一つの about にまとめてはいけない。",
    },
    service: {
      eyebrow: "Service",
      title: "インタラクティブな世界、Unreal 環境、空間プロダクト基盤を横断する制作システム。",
      items: sharedService.map((item) => ({ ...item })),
    },
    stellla: {
      eyebrow: "stellla",
      title: "より深い空間読解のあとに、ブランド化された editorial モジュールが入る。",
      body: "まず建築的な読みが必要で、その後に `stellla` の版面が支配する。",
      frameLabel: "Platform frame",
    },
    outro: {
      eyebrow: "Outro",
      title: "深い 3D は抜け、黒いブランドステージへ収束する。",
      body: "最終読解は ALCHE、その後にフッター情報。ここは contact ではなく outro である。",
      linksTitle: "Links",
      legalTitle: "Legal",
      companyLabel: "Brand system / Zhouyu Liao · 流月工作室",
      privacyLabel: "Privacy Policy",
      licenseLabel: "License",
      copyright: "©2026 Alche runtime study.",
    },
  },
  ko: {
    metadata: {
      title: "Alche Top-Page Runtime Rewrite",
      description: "참조 사이트 역분석 결과를 반영한 Alche top-page runtime. 단일 canvas, 편집형 DOM, 세분화된 section graph를 사용한다.",
    },
    loading: {
      eyebrow: "Architect worlds",
      body: "that move hearts and spark hope.",
    },
    header: {
      navAria: "Alche top-page navigation",
      localeLabel: "Language",
      navItems: [
        { id: "news", label: "News", target: "kv" },
        { id: "works", label: "Works", target: "works" },
        { id: "about", label: "About", target: "mission" },
        { id: "stellla", label: "stellla", target: "stellla" },
      ],
      contactLabel: "Contact",
      recruitLabel: "Recruit",
      soundLabel: "Sound",
    },
    indicator: {
      title: "Top scroll indicator",
      groups: {
        top: "TOP",
        works: "WORKS",
        about: "ABOUT",
        vision: "VISION",
        service: "SERVICE",
      },
    },
    news: {
      title: "News",
      items: sharedNews.map((item) => ({ ...item })),
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "하나의 세계, 세 개의 광학 부모, 여러 전환 버퍼.",
      metrics: ["두꺼운 굴절 A", "발광 ALCHE", "원통형 미디어 월"],
      note: "이번 단계는 구조를 참조 사이트에 맞추는 것이다. 광학 정밀도는 다음 단계다.",
    },
    works: {
      eyebrow: "Works / 같은 세계 안에서 권한이 이동한다",
      title: "미디어 월이 카드 트랙으로 주도권을 넘기되 런타임은 유지된다.",
      body: "메인 카드는 안정되고, 사이드 큐는 호형 논리를 유지한다. 메타데이터는 DOM 에 남아 활성 작업을 따른다.",
      moreLabel: "More Works",
      items: sharedWorks.map((item) => ({ ...item })),
    },
    mission: {
      eyebrow: "Mission",
      title: "지금까지 없던 몰입형·체험형 엔터테인먼트를 만든다.",
      body: "세계는 일반 콘텐츠 페이지가 아니라 흰 기술 필드로 정제된다.",
    },
    vision: {
      eyebrow: "Vision",
      title: "마음을 흔들고 희망을 주는 세계를 설계한다.",
      body: "Mission 과 Vision 은 하나의 about 덩어리가 아니라 분리된 개념 비트다.",
    },
    service: {
      eyebrow: "Service",
      title: "인터랙티브 월드, Unreal 환경, 플랫폼형 공간 제품을 가로지르는 제작 시스템.",
      items: sharedService.map((item) => ({ ...item })),
    },
    stellla: {
      eyebrow: "stellla",
      title: "더 깊은 공간이 먼저 읽히고, 그 뒤에 브랜드형 editorial 모듈이 온다.",
      body: "건축적 읽기가 먼저 안정되어야 하며, 그 다음 `stellla` 레이어가 들어와야 한다.",
      frameLabel: "Platform frame",
    },
    outro: {
      eyebrow: "Outro",
      title: "깊은 3D 는 빠지고 검은 브랜드 스테이지로 수렴한다.",
      body: "최종 읽기는 ALCHE, 그 다음이 푸터 유틸리티다. 이것은 단순 contact 블록이 아니다.",
      linksTitle: "Links",
      legalTitle: "Legal",
      companyLabel: "Brand system / Zhouyu Liao · 流月工作室",
      privacyLabel: "Privacy Policy",
      licenseLabel: "License",
      copyright: "©2026 Alche runtime study.",
    },
  },
};
