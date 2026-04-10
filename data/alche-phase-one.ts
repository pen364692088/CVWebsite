import type { Locale } from "@/lib/i18n";
import type { AlchePhaseId } from "@/lib/alche-phase-one";

export interface AlchePhaseOneCopy {
  metadata: {
    title: string;
    description: string;
  };
  nav: {
    ariaLabel: string;
    items: Array<{ id: AlchePhaseId; label: string }>;
    localeLabel: string;
  };
  hero: {
    eyebrow: string;
    lead: string;
    body: string;
    scrollLabel: string;
  };
  hud: {
    title: string;
    subtitle: string;
    readouts: string[];
  };
  sections: Record<
    Exclude<AlchePhaseId, "hero">,
    {
      index: string;
      label: string;
      note: string;
    }
  >;
  notes: {
    title: string;
    body: string;
  };
}

const sharedNav = [
  { id: "hero", label: "Top" },
  { id: "works", label: "Works" },
  { id: "vision", label: "Vision" },
  { id: "service", label: "Service" },
  { id: "outro", label: "Outro" },
] as const;

export const alchePhaseOneCopy: Record<Locale, AlchePhaseOneCopy> = {
  en: {
    metadata: {
      title: "Ashen Archive | Phase 1 Alche Prototype",
      description:
        "Phase 1 prototype: curved black grid room, giant ALCHE hero, prismatic A object, fixed WebGL canvas, and a future-ready scroll state machine.",
    },
    nav: {
      ariaLabel: "Phase 1 prototype navigation",
      items: [...sharedNav],
      localeLabel: "Language",
    },
    hero: {
      eyebrow: "Phase 1 / Reverse-engineered spatial hero",
      lead: "A fixed room, one refractive symbol, and a tightly controlled intro rhythm.",
      body: "This pass only establishes the runtime language: curved grid room, hero lockup, HUD chrome, smooth scroll, and the scene states that later sections will inherit.",
      scrollLabel: "Scroll to traverse the scene",
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "Black / White / Technical / Spatial",
      readouts: ["CURVED ROOM", "IRIDESCENT PRISM A", "STATE MACHINE READY"],
    },
    sections: {
      works: {
        index: "01",
        label: "Works phase",
        note: "Media plane choreography hooks in place. Content surfaces come next.",
      },
      vision: {
        index: "02",
        label: "Vision phase",
        note: "Exposure and white-scene state reserved for the inversion break.",
      },
      service: {
        index: "03",
        label: "Service phase",
        note: "Right-side system framing and product-plane staging are prepared.",
      },
      outro: {
        index: "04",
        label: "Outro phase",
        note: "Logo lockup state reserved for the closing hold.",
      },
    },
    notes: {
      title: "Prototype scope",
      body: "The hero is meant to be visually convincing now. Works, vision, service, and outro are stateful anchors for Phase 2 rather than full content builds.",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Ashen Archive | Phase 1 Alche 原型",
      description: "Phase 1 原型：黑色弧形网格房间、巨型 ALCHE 首屏、棱镜 A 物体、固定 WebGL 画布，以及面向后续章节的滚动状态机。",
    },
    nav: {
      ariaLabel: "Phase 1 原型导航",
      items: [...sharedNav].map((item) => ({
        ...item,
        label:
          item.id === "hero"
            ? "顶部"
            : item.id === "works"
              ? "作品"
              : item.id === "vision"
                ? "愿景"
                : item.id === "service"
                  ? "服务"
                  : "收束",
      })),
      localeLabel: "语言",
    },
    hero: {
      eyebrow: "Phase 1 / 反向工程的空间化首屏",
      lead: "一个固定房间，一个折射符号，以及被严格控制的开场节奏。",
      body: "这一轮只建立运行语言：弧形网格房间、首屏锁定构图、HUD 仪表感、平滑滚动，以及后续章节将继承的场景状态。",
      scrollLabel: "向下滚动以穿过场景",
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "Black / White / Technical / Spatial",
      readouts: ["CURVED ROOM", "IRIDESCENT PRISM A", "STATE MACHINE READY"],
    },
    sections: {
      works: {
        index: "01",
        label: "作品阶段",
        note: "媒体平面编排的挂点已经建立，内容表面下一轮接入。",
      },
      vision: {
        index: "02",
        label: "愿景阶段",
        note: "白场反相与曝光切换状态已预留。",
      },
      service: {
        index: "03",
        label: "服务阶段",
        note: "右侧系统框架与产品平面编排已准备好。",
      },
      outro: {
        index: "04",
        label: "收束阶段",
        note: "结尾 logo lockup 状态已预留。",
      },
    },
    notes: {
      title: "原型范围",
      body: "这一版的目标是让首屏现在就可信。Works、Vision、Service、Outro 先只作为 Phase 2 的状态锚点，不扩成完整内容页。",
    },
  },
  ja: {
    metadata: {
      title: "Ashen Archive | Phase 1 Alche Prototype",
      description:
        "Phase 1 prototype: black curved grid room, giant ALCHE hero, prismatic A object, fixed WebGL canvas, and a future-ready scroll state machine.",
    },
    nav: {
      ariaLabel: "Phase 1 prototype navigation",
      items: [...sharedNav].map((item) => ({
        ...item,
        label:
          item.id === "hero"
            ? "Top"
            : item.id === "works"
              ? "Works"
              : item.id === "vision"
                ? "Vision"
                : item.id === "service"
                  ? "Service"
                  : "Outro",
      })),
      localeLabel: "Language",
    },
    hero: {
      eyebrow: "Phase 1 / Reverse-engineered spatial hero",
      lead: "固定されたルーム、一つの屈折シンボル、そして厳密に制御された導入リズム。",
      body: "この段階で作るのはランタイム言語そのものです。曲面グリッドの部屋、ヒーロー構図、HUD 的なクローム、スムーズスクロール、そして後続セクションへ継承される状態機械を先に整えます。",
      scrollLabel: "Scroll to traverse the scene",
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "Black / White / Technical / Spatial",
      readouts: ["CURVED ROOM", "IRIDESCENT PRISM A", "STATE MACHINE READY"],
    },
    sections: {
      works: {
        index: "01",
        label: "Works phase",
        note: "メディアプレーンの振る舞いは準備済み。コンテンツ面は次段階で入れる。",
      },
      vision: {
        index: "02",
        label: "Vision phase",
        note: "白反転シーンと露出切替の状態を予約済み。",
      },
      service: {
        index: "03",
        label: "Service phase",
        note: "右側 HUD とサービス平面の構図フックを確保済み。",
      },
      outro: {
        index: "04",
        label: "Outro phase",
        note: "最後のロゴロックアップ状態を予約済み。",
      },
    },
    notes: {
      title: "Prototype scope",
      body: "今必要なのはヒーローを成立させること。Works、Vision、Service、Outro は Phase 2 用の状態アンカーとして残す。",
    },
  },
  ko: {
    metadata: {
      title: "Ashen Archive | Phase 1 Alche Prototype",
      description:
        "Phase 1 prototype: curved black grid room, giant ALCHE hero, prismatic A object, fixed WebGL canvas, and a future-ready scroll state machine.",
    },
    nav: {
      ariaLabel: "Phase 1 prototype navigation",
      items: [...sharedNav].map((item) => ({
        ...item,
        label:
          item.id === "hero"
            ? "Top"
            : item.id === "works"
              ? "Works"
              : item.id === "vision"
                ? "Vision"
                : item.id === "service"
                  ? "Service"
                  : "Outro",
      })),
      localeLabel: "Language",
    },
    hero: {
      eyebrow: "Phase 1 / Reverse-engineered spatial hero",
      lead: "고정된 룸, 하나의 굴절 심볼, 그리고 통제된 인트로 리듬.",
      body: "이번 단계는 전체 사이트가 아니라 런타임 언어를 먼저 세우는 작업이다. 곡면 그리드 룸, 히어로 락업, HUD 크롬, 스무스 스크롤, 이후 섹션이 이어받을 상태 머신을 먼저 만든다.",
      scrollLabel: "Scroll to traverse the scene",
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "Black / White / Technical / Spatial",
      readouts: ["CURVED ROOM", "IRIDESCENT PRISM A", "STATE MACHINE READY"],
    },
    sections: {
      works: {
        index: "01",
        label: "Works phase",
        note: "미디어 플레인 안무를 위한 훅은 준비되었다. 실제 콘텐츠는 다음 단계에 넣는다.",
      },
      vision: {
        index: "02",
        label: "Vision phase",
        note: "화이트 인버전 장면과 노출 전환 상태를 예약해 두었다.",
      },
      service: {
        index: "03",
        label: "Service phase",
        note: "우측 HUD 프레이밍과 서비스 플레인 구성이 준비되었다.",
      },
      outro: {
        index: "04",
        label: "Outro phase",
        note: "마지막 로고 락업 상태를 위해 비워 두었다.",
      },
    },
    notes: {
      title: "Prototype scope",
      body: "지금 목표는 히어로를 설득력 있게 만드는 것이다. 나머지 섹션은 Phase 2를 위한 상태 앵커로만 둔다.",
    },
  },
};

