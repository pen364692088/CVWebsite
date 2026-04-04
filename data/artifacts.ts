import type { SigilLens } from "@/lib/archive";
import type { Locale } from "@/lib/i18n";

export interface ArtifactMedia {
  kind: "image" | "video";
  src: string;
  alt: string;
  label: string;
  poster?: string;
}

export interface ArtifactContribution {
  lens: SigilLens;
  text: string;
}

export interface ArtifactCopy {
  title: string;
  category: string;
  role: string;
  summary: string;
  tags: string[];
  evidence: string[];
  what: string;
  contribution: ArtifactContribution[];
  technologies: string[];
  solved: string;
}

export interface Artifact {
  slug: string;
  featured: boolean;
  cover: string;
  lenses: SigilLens[];
  media: ArtifactMedia[];
  content: Record<Locale, ArtifactCopy>;
}

export interface ArtifactView extends ArtifactCopy {
  slug: string;
  featured: boolean;
  cover: string;
  lenses: SigilLens[];
  media: ArtifactMedia[];
}

const artifacts: Artifact[] = [
  {
    slug: "ember-reel",
    featured: true,
    cover: "/artifacts/ember-reel-cover.jpg",
    lenses: ["moon", "tower", "ember"],
    media: [
      {
        kind: "video",
        src: "/media/work-collection-of-ta.mp4",
        poster: "/artifacts/ember-reel-cover.jpg",
        alt: "Technical art reel showing VFX, environment lighting, and gameplay-facing visual work.",
        label: "Featured work collection video",
      },
      {
        kind: "image",
        src: "/artifacts/ember-reel-frame-1.jpg",
        alt: "Preview frame from the technical art portfolio collection.",
        label: "Portfolio preview 01",
      },
      {
        kind: "image",
        src: "/artifacts/ember-reel-frame-2.jpg",
        alt: "Preview frame from the technical art portfolio collection.",
        label: "Portfolio preview 02",
      },
      {
        kind: "image",
        src: "/artifacts/ember-reel-frame-3.jpg",
        alt: "Preview frame from the technical art portfolio collection.",
        label: "Portfolio preview 03",
      },
    ],
    content: {
      en: {
        title: "Ember Reel",
        category: "Featured Reel",
        role: "Unity Systems / Technical Art / VFX",
        summary:
          "A real featured reel built from shipped fragments and portfolio captures, used here as the strongest proof of range across systems, technical art, and real-time visuals.",
        tags: ["Technical Art", "VFX", "Realtime Visuals"],
        evidence: [
          "Real captured video rather than placeholder art",
          "Shows engine-side integration, lighting, and material response",
          "Works as the quickest overview of how visual and technical work meet",
        ],
        what:
          "This reel is the fastest way to understand the overlap between implementation, presentation polish, and atmosphere-driven visual work.",
        contribution: [
          {
            lens: "moon",
            text: "Integrated gameplay-facing visual logic so effects and moments read clearly in motion instead of as isolated shots.",
          },
          {
            lens: "tower",
            text: "Balanced materials, lighting, and scene setup against runtime constraints to keep the work presentable and production-safe.",
          },
          {
            lens: "ember",
            text: "Built and tuned real-time effects that support mood while preserving readability and frame budget.",
          },
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX pipelines"],
        solved:
          "Condensed a broad range of implementation work into one artifact that proves both visual taste and practical engine-side discipline.",
      },
      "zh-CN": {
        title: "余烬作品集",
        category: "精选合集",
        role: "Unity 系统 / 技术美术 / 特效",
        summary: "这是站内最强的真实证据条目，由真实视频与作品帧组成，用来快速说明我在系统、技术美术与实时视觉上的交叉能力。",
        tags: ["技术美术", "特效", "实时视觉"],
        evidence: ["使用真实视频而非占位图", "能看出引擎内接入、灯光和材质反应", "最适合作为整体能力范围的首个入口"],
        what: "如果只看一个条目，这个合集最能说明实现能力、画面控制和氛围表达是如何在引擎里汇合的。",
        contribution: [
          {
            lens: "moon",
            text: "把面向玩法的视觉逻辑接进运行流程，让效果在实际运动中可读，而不是只停留在单帧画面。",
          },
          {
            lens: "tower",
            text: "在运行约束内协调材质、灯光和场景搭建，让展示质量和制作稳定性同时成立。",
          },
          {
            lens: "ember",
            text: "制作并调校实时特效，让氛围表达成立，同时不牺牲反馈清晰度和帧预算。",
          },
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX 流程"],
        solved: "把分散在不同项目里的实现成果压缩成一个能同时说明审美判断和工程执行力的核心证据条目。",
      },
      ja: {
        title: "Ember Reel",
        category: "Featured Reel",
        role: "Unity Systems / Technical Art / VFX",
        summary:
          "実際のキャプチャと動画で構成した代表リールで、システム、テクニカルアート、リアルタイム表現の重なりを最も速く伝えます。",
        tags: ["Technical Art", "VFX", "Realtime Visuals"],
        evidence: [
          "抽象プレースホルダーではなく実動画を使用",
          "エンジン内実装、ライティング、マテリアル反応が読み取れる",
          "全体像を短時間で把握するための最適な入口",
        ],
        what: "実装、演出、空気感づくりがエンジンの中でどう交わるかを最も速く示す代表アーカイブです。",
        contribution: [
          {
            lens: "moon",
            text: "ゲームプレイ側の視認性を保つよう、動きの中で読めるビジュアルロジックとして統合しました。",
          },
          {
            lens: "tower",
            text: "マテリアル、ライティング、シーン構成を実行制約の中で整理し、見栄えと安全性を両立させました。",
          },
          {
            lens: "ember",
            text: "雰囲気を支えつつ読みやすさも保つリアルタイム VFX を制作・調整しました。",
          },
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX pipelines"],
        solved: "幅のある実装実績を一つの代表物へ圧縮し、視覚的判断力と技術的規律を同時に示しました。",
      },
      ko: {
        title: "Ember Reel",
        category: "Featured Reel",
        role: "Unity Systems / Technical Art / VFX",
        summary:
          "실제 캡처와 영상으로 구성한 대표 릴로, 시스템과 테크니컬 아트, 실시간 비주얼이 만나는 지점을 가장 빠르게 보여줍니다.",
        tags: ["Technical Art", "VFX", "Realtime Visuals"],
        evidence: [
          "추상 플레이스홀더가 아니라 실제 영상 사용",
          "엔진 내 통합, 라이팅, 머티리얼 반응을 읽을 수 있음",
          "전체 역량 범위를 가장 빠르게 파악하는 진입점",
        ],
        what: "구현, 연출, 분위기 조성이 엔진 안에서 어떻게 겹치는지 가장 짧게 보여주는 대표 아카이브입니다.",
        contribution: [
          {
            lens: "moon",
            text: "효과가 정적인 샷이 아니라 실제 플레이 흐름 안에서 읽히도록 비주얼 로직을 통합했습니다.",
          },
          {
            lens: "tower",
            text: "머티리얼, 라이팅, 씬 구성을 런타임 제약 안에서 정리해 보기 좋고 안전한 상태로 맞췄습니다.",
          },
          {
            lens: "ember",
            text: "분위기를 살리면서도 가독성과 프레임 예산을 유지하는 실시간 VFX를 제작하고 조정했습니다.",
          },
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX pipelines"],
        solved: "넓은 범위의 구현 작업을 하나의 대표 아티팩트로 압축해 시각적 판단력과 엔진 측 규율을 함께 증명했습니다.",
      },
    },
  },
  {
    slug: "ritual-pipeline",
    featured: false,
    cover: "/artifacts/ritual-pipeline.svg",
    lenses: ["tower", "ember"],
    media: [
      {
        kind: "image",
        src: "/artifacts/ritual-pipeline.svg",
        alt: "Archive-style diagram standing in for pipeline tooling, workflow cleanup, and technical art support.",
        label: "Pipeline diagram placeholder",
      },
    ],
    content: {
      en: {
        title: "Ritual Pipeline",
        category: "Workflow Record",
        role: "Technical Art Support / Tooling",
        summary:
          "A semi-real case built from recurring technical art and tooling work: the kind that rarely becomes a trailer shot, but decides whether visual teams move smoothly or stall.",
        tags: ["Artist Tools", "Pipelines", "Optimization"],
        evidence: [
          "Maps day-to-day production friction instead of only final visuals",
          "Explains how tooling and rules reduce setup cost",
          "Shows support work that lets artists keep moving",
        ],
        what:
          "This case stands in for the pipeline-facing work that makes visuals more repeatable: validation, editor helpers, documentation, and cleanup between art goals and engine reality.",
        contribution: [
          {
            lens: "tower",
            text: "Turned repeated production pain points into smaller artist-facing helpers and clearer workflow rules.",
          },
          {
            lens: "tower",
            text: "Reduced manual setup cost by documenting safer defaults and standardizing recurring steps.",
          },
          {
            lens: "ember",
            text: "Protected visual targets by making effect setup and scene handoff less fragile for art and lighting passes.",
          },
        ],
        technologies: ["Python tooling", "Editor utilities", "Asset validation", "Documentation systems"],
        solved:
          "Replaced scattered tribal knowledge with a more stable production path, so visual iteration stopped depending on memory and repeated cleanup.",
      },
      "zh-CN": {
        title: "仪式管线",
        category: "流程档案",
        role: "技术美术支持 / 工具开发",
        summary: "这是一个半真实案例，代表那些不会变成宣传片镜头、却决定美术团队到底顺不顺的技术美术与工具工作。",
        tags: ["艺术工具", "制作流程", "优化"],
        evidence: ["关注的是日常制作摩擦，不只是最终画面", "说明工具和规则如何降低重复配置成本", "体现支持型工作如何让美术继续往前推进"],
        what: "它代表的是让视觉实现更可重复的那类工作：校验、编辑器辅助、文档整理，以及在美术目标和引擎现实之间做清理和接线。",
        contribution: [
          {
            lens: "tower",
            text: "把反复出现的制作痛点转成更小、更直接面向美术的辅助工具和工作规范。",
          },
          {
            lens: "tower",
            text: "通过记录更安全的默认流程与标准步骤，降低重复配置和返工成本。",
          },
          {
            lens: "ember",
            text: "通过更稳的接入方式保护视觉目标，让特效和灯光迭代不那么容易被流程问题拖慢。",
          },
        ],
        technologies: ["Python 工具", "编辑器扩展", "资产校验", "流程文档"],
        solved: "把依赖个人记忆的零散经验替换成更稳定的制作路径，让视觉迭代不再频繁卡在基础配置和返工上。",
      },
      ja: {
        title: "Ritual Pipeline",
        category: "Workflow Record",
        role: "Technical Art Support / Tooling",
        summary:
          "派手な映像にはなりにくいが、ビジュアル制作の流れを左右する技術美術支援とツール整備を代表する半実例です。",
        tags: ["Artist Tools", "Pipelines", "Optimization"],
        evidence: [
          "完成画だけでなく日々の制作摩擦を扱う",
          "ツールとルールでセットアップ負荷を下げる",
          "アーティストが止まらないための支援を示す",
        ],
        what:
          "バリデーション、エディタ補助、文書化、ワークフロー整理など、ビジュアル制作を再現しやすくする裏側の仕事を代表しています。",
        contribution: [
          {
            lens: "tower",
            text: "繰り返し発生する制作上の痛点を、小さな支援ツールと明確な手順へ置き換えました。",
          },
          {
            lens: "tower",
            text: "安全なデフォルトと標準手順を整え、手作業セットアップを減らしました。",
          },
          {
            lens: "ember",
            text: "エフェクトやライティングの引き継ぎが壊れにくいようにし、ビジュアル目標を守りました。",
          },
        ],
        technologies: ["Python tooling", "Editor utilities", "Asset validation", "Documentation systems"],
        solved:
          "属人的な知識に頼らずに回る制作経路を整え、ビジュアル改善が基礎設定のやり直しで止まらないようにしました。",
      },
      ko: {
        title: "Ritual Pipeline",
        category: "Workflow Record",
        role: "Technical Art Support / Tooling",
        summary:
          "트레일러 장면으로는 잘 드러나지 않지만, 비주얼 팀이 매끄럽게 움직일지 멈출지를 결정하는 테크니컬 아트 지원과 툴링 작업을 대표하는 반실제 사례입니다.",
        tags: ["Artist Tools", "Pipelines", "Optimization"],
        evidence: [
          "완성 화면보다 일상적인 제작 마찰을 다룸",
          "툴과 규칙으로 셋업 비용을 줄이는 방식을 보여줌",
          "아티스트가 멈추지 않게 하는 지원 작업을 증명",
        ],
        what:
          "검증, 에디터 보조, 문서화, 워크플로 정리처럼 비주얼 제작을 더 반복 가능하게 만드는 뒤쪽 작업을 대표하는 케이스입니다.",
        contribution: [
          {
            lens: "tower",
            text: "반복적으로 발생하던 제작 병목을 작은 지원 도구와 명확한 작업 규칙으로 바꿨습니다.",
          },
          {
            lens: "tower",
            text: "안전한 기본값과 표준 절차를 정리해 수동 셋업 비용을 줄였습니다.",
          },
          {
            lens: "ember",
            text: "이펙트와 라이팅 핸드오프를 덜 취약하게 만들어 비주얼 목표가 흐트러지지 않게 했습니다.",
          },
        ],
        technologies: ["Python tooling", "Editor utilities", "Asset validation", "Documentation systems"],
        solved:
          "개인 기억에 의존하던 제작 지식을 더 안정적인 경로로 바꿔, 비주얼 반복 작업이 기본 설정과 재정리 때문에 멈추지 않도록 했습니다.",
      },
    },
  },
  {
    slug: "mobile-systems",
    featured: false,
    cover: "/artifacts/mobile-systems.svg",
    lenses: ["moon", "tower"],
    media: [
      {
        kind: "image",
        src: "/artifacts/mobile-systems.svg",
        alt: "Archive-style diagram representing gameplay systems, modular implementation, and feature maintenance.",
        label: "Gameplay systems diagram placeholder",
      },
    ],
    content: {
      en: {
        title: "Mobile Systems, Quietly Tuned",
        category: "Playable System Record",
        role: "Unity Systems / Feature Ownership",
        summary:
          "A semi-real record based on mobile production work where the hard part was not spectacle, but keeping features stable, maintainable, and fast to iterate on.",
        tags: ["Unity", "Gameplay Systems", "Live Support"],
        evidence: [
          "Centers on feature ownership and module boundaries",
          "Shows implementation decisions under live update pressure",
          "Useful proof for teams that care about maintainability, not only visuals",
        ],
        what:
          "This case focuses on gameplay-facing implementation: the day-to-day work of turning requirements into modules that can survive content changes and production schedules.",
        contribution: [
          {
            lens: "moon",
            text: "Implemented independent systems and feature modules based on production scope, schedule, and player-facing requirements.",
          },
          {
            lens: "moon",
            text: "Protected runtime stability during repeated updates by keeping module ownership and boundaries clear.",
          },
          {
            lens: "tower",
            text: "Worked with design and art to keep implementation practical, readable, and easier to hand off or extend.",
          },
        ],
        technologies: ["Unity", "C#", "Feature modules", "Performance profiling"],
        solved:
          "Made player-facing systems easier to own, test, and revise under continuous iteration, instead of letting feature growth turn the project brittle.",
      },
      "zh-CN": {
        title: "静默调校的移动系统",
        category: "玩法系统档案",
        role: "Unity 系统 / 功能负责",
        summary: "这是一个基于移动项目经验整理的半真实案例，重点不在炫技，而在于如何让功能稳定、易维护、且方便持续迭代。",
        tags: ["Unity", "玩法系统", "长期维护"],
        evidence: ["强调功能负责和模块边界", "体现持续更新压力下的实现判断", "更适合证明可维护性，而不是只展示画面氛围"],
        what: "这个案例关注的是面向玩法的实现工作，也就是把需求拆成能活过排期变化和内容反复的模块与系统。",
        contribution: [
          {
            lens: "moon",
            text: "根据项目范围、排期和玩家侧需求，独立实现对应系统与功能模块。",
          },
          {
            lens: "moon",
            text: "通过更清晰的模块归属和边界，保证持续更新中的运行稳定性。",
          },
          {
            lens: "tower",
            text: "与策划和美术协作，让实现方式更实际、可读，也更容易后续接手和扩展。",
          },
        ],
        technologies: ["Unity", "C#", "功能模块", "性能分析"],
        solved: "让玩家可见的系统在高频迭代中依然容易维护、测试和修改，不至于随着功能堆积而变得脆弱。",
      },
      ja: {
        title: "Mobile Systems, Quietly Tuned",
        category: "Playable System Record",
        role: "Unity Systems / Feature Ownership",
        summary:
          "派手さよりも、機能の安定性、保守性、反復速度が問われるモバイル案件の実装経験をもとにした半実例です。",
        tags: ["Unity", "Gameplay Systems", "Live Support"],
        evidence: [
          "機能担当とモジュール境界に焦点",
          "継続更新下での実装判断を示す",
          "ビジュアルより保守性を重視するチームへの証拠になる",
        ],
        what:
          "要件を、変更やスケジュールに耐えられるモジュールへ落とし込む、ゲームプレイ実装の日常業務を代表するケースです。",
        contribution: [
          {
            lens: "moon",
            text: "スコープ、日程、プレイヤー要件に合わせて機能モジュールとシステムを実装しました。",
          },
          {
            lens: "moon",
            text: "モジュール境界を明確に保ち、継続更新中のランタイム安定性を守りました。",
          },
          {
            lens: "tower",
            text: "企画とアートの要件を踏まえ、実装を実用的で読みやすく、拡張しやすい形に整理しました。",
          },
        ],
        technologies: ["Unity", "C#", "Feature modules", "Performance profiling"],
        solved:
          "プレイヤー向けシステムを、継続反復の中でも保守しやすく修正しやすい構造に保ちました。",
      },
      ko: {
        title: "Mobile Systems, Quietly Tuned",
        category: "Playable System Record",
        role: "Unity Systems / Feature Ownership",
        summary:
          "화려한 연출보다 기능 안정성, 유지보수성, 반복 속도가 중요한 모바일 제작 경험을 바탕으로 한 반실제 기록입니다.",
        tags: ["Unity", "Gameplay Systems", "Live Support"],
        evidence: [
          "기능 책임과 모듈 경계에 초점",
          "지속 업데이트 압박 아래의 구현 판단을 보여줌",
          "비주얼보다 유지보수를 중시하는 팀에 유효한 증거",
        ],
        what:
          "요구사항을 변경과 일정 압박에도 버틸 수 있는 모듈로 바꾸는, 게임플레이 구현의 일상적 업무를 대표하는 케이스입니다.",
        contribution: [
          {
            lens: "moon",
            text: "프로덕션 범위, 일정, 플레이어 요구에 맞춰 시스템과 기능 모듈을 독립적으로 구현했습니다.",
          },
          {
            lens: "moon",
            text: "모듈 경계를 명확히 유지해 반복 업데이트 중에도 런타임 안정성을 지켰습니다.",
          },
          {
            lens: "tower",
            text: "기획과 아트 요구를 함께 고려해 구현을 실용적이고 읽기 쉬우며 확장 가능한 형태로 정리했습니다.",
          },
        ],
        technologies: ["Unity", "C#", "Feature modules", "Performance profiling"],
        solved:
          "플레이어가 체감하는 시스템을 지속적인 반복 속에서도 유지보수와 수정이 쉬운 구조로 다듬었습니다.",
      },
    },
  },
];

export function getArtifacts(locale: Locale): ArtifactView[] {
  return artifacts.map((artifact) => ({
    slug: artifact.slug,
    featured: artifact.featured,
    cover: artifact.cover,
    lenses: artifact.lenses,
    media: artifact.media,
    ...artifact.content[locale],
  }));
}
