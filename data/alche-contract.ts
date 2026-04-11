import type { Locale } from "@/lib/i18n";
import type { AlchePhaseId } from "@/lib/alche-contract";

export interface AlcheContractWorkCopy {
  code: string;
  title: string;
  subtitle: string;
  meta: string[];
}

export interface AlcheContractCopy {
  metadata: {
    title: string;
    description: string;
  };
  loadingLabel: string;
  nav: {
    ariaLabel: string;
    localeLabel: string;
    items: Array<{ id: AlchePhaseId; label: string }>;
  };
  hud: {
    title: string;
    subtitle: string;
    readouts: string[];
    noteTitle: string;
    noteBody: string;
  };
  works: {
    eyebrow: string;
    title: string;
    body: string;
    cards: AlcheContractWorkCopy[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
  };
  stella: {
    eyebrow: string;
    title: string;
    body: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    linksTitle: string;
    companyLabel: string;
  };
}

const sharedNav = [
  { id: "hero", label: "Hero" },
  { id: "works", label: "Works" },
  { id: "about", label: "About" },
  { id: "stella", label: "Stella" },
  { id: "contact", label: "Contact" },
] as const;

export const alcheContractCopy: Record<Locale, AlcheContractCopy> = {
  en: {
    metadata: {
      title: "Ashen Archive | Alche Contract Prototype",
      description:
        "Contract-driven Alche prototype: one persistent brand-space system with a hero optical stack, cylindrical media wall, and continuous scroll transitions.",
    },
    loadingLabel: "Loading / Brand-space boot",
    nav: {
      ariaLabel: "Alche contract navigation",
      localeLabel: "Language",
      items: [...sharedNav],
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "One world. Three parents. Four transitions.",
      readouts: ["THICK REFRACTIVE A", "EMISSIVE ALCHE", "CYLINDRICAL MEDIA WALL"],
      noteTitle: "Hero gate",
      noteBody: "Structure first. Optical exactness remains secondary until the same-world chain reads cleanly.",
    },
    works: {
      eyebrow: "Works / activated inside the same world",
      title: "The wall clears, then the card system detaches into the foreground.",
      body: "Scroll drives the horizontal arc queue. Metadata is DOM-bound to the active card while the world remains continuous.",
      cards: [
        {
          code: "WK-01",
          title: "EgoCore",
          subtitle: "Identity runtime / reflective architecture",
          meta: ["Runtime host design", "State continuity", "Self-model loop"],
        },
        {
          code: "WK-02",
          title: "Ashen Archive",
          subtitle: "Atmosphere-led portfolio / governed storytelling",
          meta: ["Scene-led UI", "Public-safe case framing", "Design system authorship"],
        },
        {
          code: "WK-03",
          title: "OpenEmotion",
          subtitle: "Affective systems / response architecture",
          meta: ["Emotion pipeline", "Interaction grammar", "Tooling structure"],
        },
        {
          code: "WK-04",
          title: "Runtime Host",
          subtitle: "Operable shell / workflow governance",
          meta: ["Execution surfaces", "Boundary control", "Reviewable process"],
        },
      ],
    },
    about: {
      eyebrow: "About / the same world purified",
      title: "The curved system flattens into a white technical field.",
      body: "The wall interpolates toward a plane and the glass A resolves into an outlined emblem instead of cutting to a separate page.",
    },
    stella: {
      eyebrow: "stella / editorial layer after spatial entry",
      title: "The camera passes by the A edge and enters a deeper branded architecture.",
      body: "Architecture stabilizes first. The large editorial title arrives later as DOM, not as wall content.",
    },
    contact: {
      eyebrow: "Contact / brand stage",
      title: "The deep scene drains out and the footer settles into a flat black brand field.",
      body: "Large ALCHE takes the lead again while contact information stays quiet and secondary.",
      linksTitle: "Links",
      companyLabel: "Brand system / Zhouyu Liao · 流月工作室",
    },
  },
  "zh-CN": {
    metadata: {
      title: "Ashen Archive | Alche 合同原型",
      description: "按合同驱动的 Alche 原型：一个持续变形的品牌空间系统，包含首屏光学栈、圆柱媒体墙与连续滚动转场。",
    },
    loadingLabel: "加载中 / 品牌空间启动",
    nav: {
      ariaLabel: "Alche 合同导航",
      localeLabel: "语言",
      items: [
        { id: "hero", label: "首屏" },
        { id: "works", label: "作品" },
        { id: "about", label: "介绍" },
        { id: "stella", label: "stella" },
        { id: "contact", label: "联系" },
      ],
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "同一个世界，三个母体，四段转场。",
      readouts: ["厚实体折射 A", "发光 ALCHE 字层", "圆柱媒体墙"],
      noteTitle: "Hero gate",
      noteBody: "先把结构做对，再追求更高的光学精度。三层关系必须先成立。",
    },
    works: {
      eyebrow: "Works / 在同一世界里被激活",
      title: "墙体先清空，再把卡片系统从背景中抽离到前景。",
      body: "滚轮驱动弧形队列横向换位。作品元信息保持为 DOM，并绑定当前主卡。",
      cards: [
        {
          code: "WK-01",
          title: "EgoCore",
          subtitle: "身份运行时 / 反思式架构",
          meta: ["运行时宿主", "状态连续性", "自我模型闭环"],
        },
        {
          code: "WK-02",
          title: "Ashen Archive",
          subtitle: "氛围驱动作品站 / 受约束叙事",
          meta: ["场景化界面", "公开安全案例", "视觉系统主导"],
        },
        {
          code: "WK-03",
          title: "OpenEmotion",
          subtitle: "情感系统 / 响应式结构",
          meta: ["情绪管线", "交互语法", "工具链结构"],
        },
        {
          code: "WK-04",
          title: "Runtime Host",
          subtitle: "可运行外壳 / 工作流治理",
          meta: ["执行界面", "边界控制", "可审查流程"],
        },
      ],
    },
    about: {
      eyebrow: "About / 同一世界被净化",
      title: "弧形系统展平为白色技术场。",
      body: "墙体向平面插值，玻璃 A 同时白化并收敛成线框徽记，而不是切到另一个白页。",
    },
    stella: {
      eyebrow: "stella / 先进入空间，再接管版式",
      title: "镜头沿 A 的边缘掠过，进入更深的品牌建筑场景。",
      body: "先稳定建筑空间，再由大的 editorial `stella` DOM 文字接管，而不是把大字当墙面内容。",
    },
    contact: {
      eyebrow: "Contact / 品牌收束舞台",
      title: "深 3D 场景退场，页脚收束为平直的黑色品牌舞台。",
      body: "巨大的 ALCHE 再次成为主角，联系信息保持安静次要。",
      linksTitle: "链接",
      companyLabel: "品牌系统 / Zhouyu Liao · 流月工作室",
    },
  },
  ja: {
    metadata: {
      title: "Ashen Archive | Alche Contract Prototype",
      description:
        "契約駆動の Alche プロトタイプ。単一のブランド空間システムとして、ヒーローの光学構成、円筒メディアウォール、連続スクロール遷移を実装する。",
    },
    loadingLabel: "Loading / Brand-space boot",
    nav: {
      ariaLabel: "Alche contract navigation",
      localeLabel: "Language",
      items: [
        { id: "hero", label: "Hero" },
        { id: "works", label: "Works" },
        { id: "about", label: "About" },
        { id: "stella", label: "stella" },
        { id: "contact", label: "Contact" },
      ],
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "一つの世界。三つの親。四つの遷移。",
      readouts: ["厚い屈折 A", "発光する ALCHE", "円筒メディアウォール"],
      noteTitle: "Hero gate",
      noteBody: "まず構造を正す。光学の厳密さは、その後でよい。",
    },
    works: {
      eyebrow: "Works / 同じ世界の中で起動する",
      title: "ウォールがクリアされ、カードシステムが前景へ切り出される。",
      body: "スクロールが弧状のキューを横方向に送る。メタデータは DOM に残し、アクティブカードへ結び付ける。",
      cards: [
        {
          code: "WK-01",
          title: "EgoCore",
          subtitle: "自己同一性ランタイム / 反省的アーキテクチャ",
          meta: ["ランタイムホスト", "状態継続", "自己モデル循環"],
        },
        {
          code: "WK-02",
          title: "Ashen Archive",
          subtitle: "雰囲気主導ポートフォリオ / 制約付きストーリーテリング",
          meta: ["シーン駆動 UI", "公開安全な事例", "視覚システム設計"],
        },
        {
          code: "WK-03",
          title: "OpenEmotion",
          subtitle: "感情システム / 応答アーキテクチャ",
          meta: ["感情パイプライン", "インタラクション文法", "ツール構造"],
        },
        {
          code: "WK-04",
          title: "Runtime Host",
          subtitle: "運用可能なシェル / ワークフロー統制",
          meta: ["実行面", "境界制御", "監査可能プロセス"],
        },
      ],
    },
    about: {
      eyebrow: "About / 同じ世界の純化",
      title: "曲面システムは白い技術場へ平坦化される。",
      body: "ウォールは平面へ補間され、ガラス A は別ページに切り替わることなく線形エンブレムへ収束する。",
    },
    stella: {
      eyebrow: "stella / 空間の後にエディトリアルが来る",
      title: "カメラは A の縁をかすめて、より深いブランド建築へ入る。",
      body: "まず建築空間が安定し、その後に大きな DOM の `stella` タイポグラフィが入る。",
    },
    contact: {
      eyebrow: "Contact / ブランドステージ",
      title: "深い 3D シーンは抜け落ち、フッターは平坦な黒いブランド場へ収束する。",
      body: "巨大な ALCHE が再び主役となり、連絡情報は静かに従属する。",
      linksTitle: "Links",
      companyLabel: "Brand system / Zhouyu Liao · 流月工作室",
    },
  },
  ko: {
    metadata: {
      title: "Ashen Archive | Alche Contract Prototype",
      description:
        "계약 기반 Alche 프로토타입. 하나의 브랜드 공간 시스템으로 히어로 광학 스택, 원통형 미디어 월, 연속 스크롤 전환을 구현한다.",
    },
    loadingLabel: "Loading / Brand-space boot",
    nav: {
      ariaLabel: "Alche contract navigation",
      localeLabel: "Language",
      items: [
        { id: "hero", label: "Hero" },
        { id: "works", label: "Works" },
        { id: "about", label: "About" },
        { id: "stella", label: "stella" },
        { id: "contact", label: "Contact" },
      ],
    },
    hud: {
      title: "TOP PAGE RUNTIME",
      subtitle: "하나의 세계, 세 개의 부모, 네 개의 전환.",
      readouts: ["두꺼운 굴절 A", "발광 ALCHE", "원통형 미디어 월"],
      noteTitle: "Hero gate",
      noteBody: "먼저 구조를 맞춘다. 광학 정밀도는 그다음 단계다.",
    },
    works: {
      eyebrow: "Works / 같은 세계 안에서 활성화된다",
      title: "월이 비워진 뒤 카드 시스템이 전경으로 분리된다.",
      body: "스크롤이 호형 큐를 수평으로 이동시킨다. 메타데이터는 DOM 에 남고 활성 카드에 결속된다.",
      cards: [
        {
          code: "WK-01",
          title: "EgoCore",
          subtitle: "정체성 런타임 / 반성적 아키텍처",
          meta: ["런타임 호스트", "상태 연속성", "자기 모델 루프"],
        },
        {
          code: "WK-02",
          title: "Ashen Archive",
          subtitle: "분위기 주도 포트폴리오 / 통제된 스토리텔링",
          meta: ["장면 중심 UI", "공개 가능한 사례", "비주얼 시스템 설계"],
        },
        {
          code: "WK-03",
          title: "OpenEmotion",
          subtitle: "감정 시스템 / 반응 아키텍처",
          meta: ["감정 파이프라인", "인터랙션 문법", "도구 구조"],
        },
        {
          code: "WK-04",
          title: "Runtime Host",
          subtitle: "운용 가능한 셸 / 워크플로 거버넌스",
          meta: ["실행 표면", "경계 제어", "검토 가능한 프로세스"],
        },
      ],
    },
    about: {
      eyebrow: "About / 같은 세계의 정제",
      title: "곡면 시스템이 흰 기술 필드로 평탄화된다.",
      body: "월은 평면으로 보간되고 유리 A 는 다른 페이지로 잘리지 않은 채 큰 윤곽 엠블럼으로 정리된다.",
    },
    stella: {
      eyebrow: "stella / 공간 이후에 에디토리얼이 온다",
      title: "카메라는 A 의 가장자리를 스치며 더 깊은 브랜드 건축 공간으로 들어간다.",
      body: "먼저 건축 장면이 안정되고, 이후 큰 DOM `stella` 타이포그래피가 들어온다.",
    },
    contact: {
      eyebrow: "Contact / 브랜드 스테이지",
      title: "깊은 3D 장면이 빠지고 푸터는 평평한 검은 브랜드 무대로 정착한다.",
      body: "거대한 ALCHE 가 다시 주역이 되고, 연락 정보는 조용한 보조 레이어로 남는다.",
      linksTitle: "Links",
      companyLabel: "Brand system / Zhouyu Liao · 流月工作室",
    },
  },
};
