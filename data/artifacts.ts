import type { Locale } from "@/lib/i18n";

export interface ArtifactMedia {
  kind: "image" | "video";
  src: string;
  alt: string;
  label: string;
  poster?: string;
}

export interface ArtifactCopy {
  title: string;
  category: string;
  role: string;
  summary: string;
  tags: string[];
  what: string;
  contribution: string[];
  technologies: string[];
  solved: string;
}

export interface Artifact {
  slug: string;
  featured: boolean;
  cover: string;
  media: ArtifactMedia[];
  content: Record<Locale, ArtifactCopy>;
}

const artifacts: Artifact[] = [
  {
    slug: "ember-reel",
    featured: true,
    cover: "/artifacts/ember-reel-cover.jpg",
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
        role: "Studio Showcase / Technical Art / VFX",
        summary:
          "A featured studio reel built from technical art fragments spanning real-time VFX, lighting passes, shaders, and playable presentation work.",
        tags: ["Technical Art", "VFX", "Realtime Visuals"],
        what:
          "A curated highlight reel that frames Liuyue Studio's range across production-facing technical art, visual implementation, and short in-engine presentation moments.",
        contribution: [
          "Built and integrated real-time visual effects with a focus on readability and atmosphere.",
          "Balanced shader treatment, lighting support, and scene polish against strict runtime budgets.",
          "Curated shorter fragments into a studio-facing reel suitable for collaborators, art leads, and project partners.",
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX pipelines"],
        solved:
          "Condensed broad technical art output into a single artifact that communicates both visual taste and production discipline.",
      },
      "zh-CN": {
        title: "余烬作品集",
        category: "精选卷宗",
        role: "工作室展示 / 技术美术 / 特效",
        summary: "一份以技术美术为核心的工作室精选合集，涵盖实时特效、灯光处理、Shader 与可玩画面表现。",
        tags: ["技术美术", "特效", "实时视觉"],
        what: "这是用于展示流月工作室技术美术能力范围的精选作品集合，强调制作可落地性与视觉控制力。",
        contribution: [
          "制作并接入强调可读性与氛围感的实时视觉特效。",
          "在性能预算约束下平衡 Shader 处理、灯光支持与整体画面打磨。",
          "把分散的工作成果整理成面向合作沟通的短片段式工作室展示。",
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX 流程"],
        solved: "把分散在不同项目中的技术美术成果压缩成一个叙事明确、便于快速判断能力边界的核心作品。",
      },
      ja: {
        title: "Ember Reel",
        category: "注目リール",
        role: "スタジオショーケース / テクニカルアート / VFX",
        summary:
          "リアルタイム VFX、ライティング、シェーダー、プレイアブル演出を束ねた、スタジオ代表リールです。",
        tags: ["テクニカルアート", "VFX", "リアルタイム表現"],
        what:
          "流月工作室の技術美術、ビジュアル実装、短いインエンジン演出断片をまとめて示すための代表リールです。",
        contribution: [
          "可読性と空気感の両立を意識したリアルタイム VFX を制作・実装。",
          "シェーダー、ライティング、シーンの磨き込みを実行負荷と両立。",
          "断片的な成果物を、協業向けに読みやすいスタジオリールへ再構成。",
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX パイプライン"],
        solved: "幅広い技術美術の出力を、一つの代表アーカイブとして短く読み取りやすく整理しました。",
      },
      ko: {
        title: "Ember Reel",
        category: "대표 릴",
        role: "스튜디오 쇼케이스 / 테크니컬 아트 / VFX",
        summary:
          "실시간 VFX, 라이팅, 셰이더, 플레이어블 연출을 묶어 보여주는 스튜디오 대표 테크니컬 아트 릴입니다.",
        tags: ["테크니컬 아트", "VFX", "실시간 비주얼"],
        what:
          "流月工作室의 테크니컬 아트, 비주얼 구현, 짧은 인엔진 프레젠테이션 단위를 한 번에 보여주기 위한 대표 릴입니다.",
        contribution: [
          "가독성과 분위기를 함께 고려한 실시간 VFX를 제작하고 엔진에 통합했습니다.",
          "셰이더 처리, 라이팅 보강, 씬 폴리시를 런타임 예산 안에서 조율했습니다.",
          "흩어진 작업 결과를 협업용 스튜디오 릴 형태로 재구성했습니다.",
        ],
        technologies: ["Unreal Engine", "Unity", "Shader Graph", "HLSL", "VFX 파이프라인"],
        solved: "다양한 테크니컬 아트 결과물을 하나의 대표 아카이브로 압축해 빠르게 읽히도록 정리했습니다.",
      },
    },
  },
  {
    slug: "ritual-pipeline",
    featured: false,
    cover: "/artifacts/ritual-pipeline.svg",
    media: [
      {
        kind: "image",
        src: "/artifacts/ritual-pipeline.svg",
        alt: "Abstract dark fantasy placeholder illustrating workflow tooling and pipeline structure.",
        label: "Pipeline concept visual",
      },
    ],
    content: {
      en: {
        title: "Ritual Pipeline",
        category: "Workflow Relic",
        role: "Technical Art Support / Tooling",
        summary:
          "A semi-real case study shaped from production-facing technical art support, artist tooling, and cross-discipline pipeline maintenance.",
        tags: ["Artist Tools", "Pipelines", "Optimization"],
        what:
          "A workflow-facing archive note built from day-to-day studio support for artists, lighting, VFX, and environment production.",
        contribution: [
          "Mapped repetitive production pain points and translated them into smaller artist-facing tools.",
          "Reduced manual setup cost by documenting best practices and standardizing repeatable workflows.",
          "Acted as the bridge between visual ambition and platform-safe implementation constraints.",
        ],
        technologies: ["Python tooling", "Editor utilities", "Asset validation", "Documentation systems"],
        solved:
          "Made visual iteration less fragile by replacing scattered tribal knowledge with clearer tools and production rules.",
      },
      "zh-CN": {
        title: "仪式管线",
        category: "流程遗物",
        role: "技术美术支持 / 工具开发",
        summary: "基于真实工作经历整理出的半真实案例，聚焦技术美术支持、艺术工具与跨团队制作流程。",
        tags: ["艺术工具", "制作流程", "优化"],
        what: "这是围绕工作室日常技术美术支持整理出的流程档案，重点是为美术、灯光、特效与场景团队降低流程摩擦。",
        contribution: [
          "梳理重复出现的制作痛点，并转化为更小、更实用的艺术向工具。",
          "通过流程文档与规范化操作，降低重复配置与沟通成本。",
          "在视觉追求与平台性能限制之间提供可落地的技术折中方案。",
        ],
        technologies: ["Python 工具", "编辑器扩展", "资产校验", "流程文档"],
        solved: "把依赖个人经验的零散流程沉淀为更稳定的工具与规则，减少视觉迭代中的不确定性。",
      },
      ja: {
        title: "Ritual Pipeline",
        category: "ワークフロー記録",
        role: "テクニカルアート支援 / ツーリング",
        summary:
          "実務経験をもとに再構成した、技術美術支援・アーティストツール・制作パイプライン改善のケースです。",
        tags: ["アーティストツール", "パイプライン", "最適化"],
        what:
          "アート、ライティング、VFX、環境制作に対する日常支援を、スタジオの運用改善記録としてまとめた事例です。",
        contribution: [
          "繰り返し発生する制作上の負荷を整理し、小さなアーティスト向けツールへ変換。",
          "ベストプラクティスの文書化と標準化でセットアップ負荷を削減。",
          "表現要求とプラットフォーム制約の間で、実装可能な落とし所を設計。",
        ],
        technologies: ["Python ツール", "エディタ拡張", "アセット検証", "ドキュメント整備"],
        solved: "属人的だった制作知識を再利用しやすい形へ置き換え、ビジュアル改善の安定性を高めました。",
      },
      ko: {
        title: "Ritual Pipeline",
        category: "워크플로 기록",
        role: "테크니컬 아트 지원 / 툴링",
        summary:
          "실무 경험을 기반으로 재구성한 반실제 케이스로, 테크니컬 아트 지원과 아티스트 툴, 파이프라인 개선에 초점을 둡니다.",
        tags: ["아티스트 툴", "파이프라인", "최적화"],
        what:
          "아트, 라이팅, VFX, 환경 제작을 지원하던 일상적인 스튜디오 업무를 운영 개선 기록으로 정리한 아티팩트입니다.",
        contribution: [
          "반복적으로 발생하던 제작 병목을 정리해 작은 아티스트용 도구로 전환했습니다.",
          "문서화와 표준화를 통해 반복 셋업 비용을 줄였습니다.",
          "시각적 목표와 플랫폼 제약 사이에서 구현 가능한 균형점을 제시했습니다.",
        ],
        technologies: ["Python 툴링", "에디터 유틸리티", "에셋 검증", "문서화 시스템"],
        solved: "개인 경험에 의존하던 제작 지식을 도구와 규칙으로 바꿔 시각 반복 작업의 안정성을 높였습니다.",
      },
    },
  },
  {
    slug: "mobile-systems",
    featured: false,
    cover: "/artifacts/mobile-systems.svg",
    media: [
      {
        kind: "image",
        src: "/artifacts/mobile-systems.svg",
        alt: "Abstract dark fantasy placeholder representing gameplay systems, live operations, and optimization.",
        label: "Gameplay systems concept visual",
      },
    ],
    content: {
      en: {
        title: "Mobile Systems, Quietly Tuned",
        category: "Playable System Record",
        role: "Unity Systems / Feature Ownership",
        summary:
          "A semi-real snapshot of gameplay system implementation for mobile projects where stability, iteration speed, and feature ownership mattered.",
        tags: ["Unity", "Gameplay Systems", "Live Support"],
        what:
          "A gameplay-facing archive entry inspired by studio work on mobile projects, focused on feature ownership and reliable iteration.",
        contribution: [
          "Implemented independent modules and systems based on feature requirements and production schedules.",
          "Worked with design and art to keep iteration practical without losing implementation quality.",
          "Protected runtime stability while shipping feature updates under live production pressure.",
        ],
        technologies: ["Unity", "C#", "Feature modules", "Performance profiling"],
        solved:
          "Kept player-facing systems maintainable under constant iteration by making each module easier to own, test, and refine.",
      },
      "zh-CN": {
        title: "静默调校的移动系统",
        category: "玩法系统档案",
        role: "Unity 系统 / 功能负责",
        summary: "一个基于移动项目经历整理的半真实案例，重点是 Unity 系统开发、稳定迭代与模块责任制。",
        tags: ["Unity", "玩法系统", "长期维护"],
        what: "这个档案条目以移动项目制作经验为原型，强调工作室在系统模块独立交付与持续迭代上的能力。",
        contribution: [
          "根据需求与排期独立完成对应功能模块与系统实现。",
          "与策划和美术协作，保证迭代效率的同时不牺牲实现质量。",
          "在持续更新压力下维持线上系统的稳定与性能表现。",
        ],
        technologies: ["Unity", "C#", "功能模块", "性能分析"],
        solved: "通过更清晰的模块边界与维护方式，让玩家可见系统在高频迭代中仍然保持稳定和可扩展。",
      },
      ja: {
        title: "静かに磨いたモバイルシステム",
        category: "ゲームプレイ記録",
        role: "Unity Systems / Feature Ownership",
        summary:
          "モバイル開発経験をもとにした半実例で、Unity システム実装・安定運用・継続改善に焦点を当てています。",
        tags: ["Unity", "ゲームプレイシステム", "継続運用"],
        what:
          "モバイル案件でのスタジオ経験をもとに、機能モジュールの自走力と安定した反復改善を示すアーカイブ記録です。",
        contribution: [
          "要件とスケジュールに合わせて機能モジュールやシステムを自律的に実装。",
          "企画・アートと連携し、反復速度と実装品質の両立を維持。",
          "継続的なアップデートの中でも安定性と性能を守る実装判断を行いました。",
        ],
        technologies: ["Unity", "C#", "機能モジュール", "パフォーマンス計測"],
        solved: "頻繁な更新下でも、プレイヤー向けシステムを保守しやすく改善しやすい形に保ちました。",
      },
      ko: {
        title: "조용하게 다듬은 모바일 시스템",
        category: "플레이어블 시스템 기록",
        role: "Unity Systems / Feature Ownership",
        summary:
          "모바일 게임 개발 경험을 바탕으로 한 반실제 사례로, Unity 시스템 구현과 안정적 반복 개선에 초점을 둡니다.",
        tags: ["Unity", "게임플레이 시스템", "라이브 운영"],
        what:
          "모바일 프로젝트 기반의 스튜디오 작업에서 기능 모듈 소유권과 안정적인 반복 개선 능력을 보여주는 기록형 아티팩트입니다.",
        contribution: [
          "요구사항과 일정에 맞춰 기능 모듈과 시스템을 독립적으로 구현했습니다.",
          "기획 및 아트와 협업해 반복 속도와 구현 품질을 함께 유지했습니다.",
          "지속 업데이트 환경에서도 안정성과 성능을 지키는 구현 결정을 내렸습니다.",
        ],
        technologies: ["Unity", "C#", "기능 모듈", "성능 프로파일링"],
        solved: "잦은 업데이트 속에서도 플레이어가 체감하는 시스템을 유지보수와 확장에 강한 구조로 다듬었습니다.",
      },
    },
  },
];

export function getArtifacts(locale: Locale) {
  return artifacts.map((artifact) => ({
    slug: artifact.slug,
    featured: artifact.featured,
    cover: artifact.cover,
    media: artifact.media,
    ...artifact.content[locale],
  }));
}
