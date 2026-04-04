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
  coverPosition?: string;
  lenses: SigilLens[];
  media: ArtifactMedia[];
  mediaPosition?: string[];
  content: Record<Locale, ArtifactCopy>;
}

export interface ArtifactView extends ArtifactCopy {
  slug: string;
  featured: boolean;
  cover: string;
  coverPosition?: string;
  lenses: SigilLens[];
  media: ArtifactMedia[];
  mediaPosition?: string[];
}

const artifacts: Artifact[] = [
  {
    slug: "egocore",
    featured: false,
    cover: "/artifacts/egocore-cover-v2.jpg",
    coverPosition: "50% 34%",
    lenses: ["moon", "tower"],
    media: [
      {
        kind: "image",
        src: "/artifacts/egocore-cover-v2.jpg",
        alt: "Ritual cover for EgoCore with an armored watcher standing inside ruined stone arches.",
        label: "EgoCore cover relic",
      },
      {
        kind: "image",
        src: "/artifacts/egocore-dossier-v2.jpg",
        alt: "Public-safe dossier board for EgoCore combining a sentinel figure, weapon detail, and archive linkage marks.",
        label: "EgoCore dossier board",
      },
    ],
    mediaPosition: ["50% 34%", "50% 42%"],
    content: {
      en: {
        title: "EgoCore",
        category: "Runtime Host",
        role: "Architecture / Runtime / Governance",
        summary:
          "A public-safe case about building the outward host for a dual-core AI system: event intake, task orchestration, guardrails, replayability, and practical execution discipline.",
        tags: ["Runtime Systems", "Governance", "Task Orchestration"],
        evidence: [
          "Clear boundary between external execution and internal core semantics",
          "Replay / audit thinking carried into the implementation story",
          "Framed as a host that can operate, recover, and stay governable under pressure",
        ],
        what:
          "EgoCore is the outer runtime layer: the part that receives user events, structures work, calls tools, tracks execution, and keeps the system inside real-world operating boundaries.",
        contribution: [
          {
            lens: "moon",
            text: "Defined the host-side runtime path so user events, tasks, and outward actions move through a legible execution chain instead of a loose collection of scripts.",
          },
          {
            lens: "tower",
            text: "Turned safety, replay, audit, and operational boundaries into first-class implementation constraints rather than afterthought documentation.",
          },
        ],
        technologies: ["Python", "Schema contracts", "Task runtime", "Replay / audit artifacts", "Guardrail design"],
        solved:
          "Made the runtime layer easier to reason about, easier to govern, and less likely to drift into a fragile set of undocumented behaviors.",
      },
      "zh-CN": {
        title: "EgoCore",
        category: "运行时宿主",
        role: "架构 / Runtime / 治理",
        summary:
          "这是一个公开安全版案例，聚焦双核 AI 系统的外层宿主：事件入口、任务编排、边界治理、可回放证据链，以及可执行性的工程纪律。",
        tags: ["运行时系统", "治理", "任务编排"],
        evidence: [
          "清晰区分外部执行层与内部主体层",
          "把 replay / audit 思路真正写进实现叙事",
          "强调系统在压力下仍可运行、可恢复、可治理",
        ],
        what:
          "EgoCore 是外层 runtime：接收用户事件、结构化任务、调用工具、跟踪执行，并把系统保持在现实可操作边界之内。",
        contribution: [
          {
            lens: "moon",
            text: "把用户事件、任务和外部动作整理成一条可读的宿主执行链，而不是零散脚本的堆积。",
          },
          {
            lens: "tower",
            text: "把安全、回放、审计和运行边界变成一等实现约束，而不是事后补充的说明文档。",
          },
        ],
        technologies: ["Python", "契约 Schema", "任务运行时", "Replay / Audit 证据", "Guardrail 设计"],
        solved: "让运行时层更容易理解、更容易治理，也更不容易漂移成一组脆弱且缺乏边界的行为集合。",
      },
      ja: {
        title: "EgoCore",
        category: "Runtime Host",
        role: "Architecture / Runtime / Governance",
        summary:
          "外側ホストとしての実装を公開安全な範囲で整理したケースです。イベント入力、タスク編成、ガードレール、再生可能性、実運用の規律に焦点を当てています。",
        tags: ["Runtime Systems", "Governance", "Task Orchestration"],
        evidence: [
          "外部実行層と内部コアの境界が明確",
          "replay / audit の考え方を実装物語に反映",
          "運用・復旧・統制を前提にしたホスト設計",
        ],
        what:
          "EgoCore は外側の runtime 層です。ユーザーイベントを受け、作業を構造化し、ツールを呼び、実行を追跡し、現実の運用境界を守ります。",
        contribution: [
          {
            lens: "moon",
            text: "ユーザーイベント、タスク、外向きの動作を、散発的なスクリプトではなく読める実行チェーンとして整理しました。",
          },
          {
            lens: "tower",
            text: "安全、再生、監査、運用境界を、実装の中心制約として扱いました。",
          },
        ],
        technologies: ["Python", "Schema contracts", "Task runtime", "Replay / audit artifacts", "Guardrail design"],
        solved:
          "Runtime 層を理解しやすく、統治しやすくし、 undocumented な挙動の寄せ集めへ崩れるリスクを下げました。",
      },
      ko: {
        title: "EgoCore",
        category: "런타임 호스트",
        role: "아키텍처 / Runtime / 거버넌스",
        summary:
          "이 케이스는 이중 코어 AI 시스템의 외부 호스트를 공개 가능한 범위에서 정리합니다. 이벤트 입력, 작업 오케스트레이션, 가드레일, 리플레이 가능성, 운영 규율이 핵심입니다.",
        tags: ["Runtime Systems", "Governance", "Task Orchestration"],
        evidence: [
          "외부 실행층과 내부 코어 의미층의 경계가 분명함",
          "replay / audit 사고를 구현 서사 안에 반영",
          "압박 상황에서도 운영 가능하고 복구 가능한 호스트 설계",
        ],
        what:
          "EgoCore는 바깥 runtime 계층입니다. 사용자 이벤트를 받아 구조화하고, 작업을 실행하며, 도구를 호출하고, 실행 흔적을 추적하면서 시스템을 현실적인 운영 경계 안에 유지합니다.",
        contribution: [
          {
            lens: "moon",
            text: "사용자 이벤트, 작업, 외부 동작이 흩어진 스크립트가 아니라 읽을 수 있는 실행 체인으로 이어지도록 정리했습니다.",
          },
          {
            lens: "tower",
            text: "안전성, 리플레이, 감사, 운영 경계를 사후 문서가 아니라 핵심 구현 제약으로 다뤘습니다.",
          },
        ],
        technologies: ["Python", "스키마 계약", "Task runtime", "Replay / audit artifacts", "Guardrail design"],
        solved: "런타임 계층을 더 이해하기 쉽고 통제하기 쉬운 구조로 정리해, 문서 없는 취약한 동작 모음으로 흐를 위험을 낮췄습니다.",
      },
    },
  },
  {
    slug: "ashen-archive",
    featured: true,
    cover: "/artifacts/ashen-archive-cover-v2.jpg",
    coverPosition: "50% 42%",
    lenses: ["moon", "ember"],
    media: [
      {
        kind: "image",
        src: "/artifacts/ashen-archive-cover-v2.jpg",
        alt: "Ritual cover for Ashen Archive with an upright blade, pale hands, and a restrained ember glow.",
        label: "Ashen Archive cover relic",
      },
      {
        kind: "image",
        src: "/artifacts/ashen-archive-dossier-v2.jpg",
        alt: "Public-safe dossier board for Ashen Archive with the castle matte, ritual blade, and archive linkage markers.",
        label: "Ashen Archive dossier board",
      },
    ],
    mediaPosition: ["50% 42%", "50% 44%"],
    content: {
      en: {
        title: "Ashen Archive",
        category: "Interactive Archive",
        role: "Art Direction / UI Systems / Motion",
        summary:
          "The portfolio itself, treated as a case study: a scene-led archive that merges atmospheric presentation, layered motion, and a data-driven structure instead of a generic portfolio template.",
        tags: ["Next.js", "Interactive UI", "Art Direction"],
        evidence: [
          "Scene-first hero built from safe-source atmosphere assets and original generated art",
          "Content, navigation, and case metadata all driven from local structured data",
          "Motion and hover states designed as part of the archive language, not bolted on afterward",
        ],
        what:
          "Ashen Archive is the public-facing shell for this body of work. The point is not only to look dramatic, but to turn mood, hierarchy, and interaction into a coherent reading system.",
        contribution: [
          {
            lens: "moon",
            text: "Built the structure that makes the page readable as a system: routing, data-driven sections, stable asset paths, and a portfolio flow that can scale.",
          },
          {
            lens: "ember",
            text: "Shaped the atmosphere layer, hero composition, ritual cards, and sigil language so the site feels curated rather than templated.",
          },
        ],
        technologies: ["Next.js", "TypeScript", "Motion", "Generated raster art", "Static export"],
        solved:
          "Turned a personal site into a memorable archive interface without sacrificing scanability, localization, or static-export safety.",
      },
      "zh-CN": {
        title: "Ashen Archive",
        category: "交互档案馆",
        role: "美术方向 / UI 系统 / Motion",
        summary:
          "把作品站本身当成一个正式案例：它不是普通 portfolio 模板，而是把氛围呈现、分层动效和数据驱动结构合成一套可读的档案馆界面。",
        tags: ["Next.js", "交互界面", "美术方向"],
        evidence: [
          "首屏场景由安全来源素材与原创生成资产共同构成",
          "内容、导航和案例元数据都来自本地结构化数据",
          "动效和 hover 不是后补，而是档案馆语言的一部分",
        ],
        what:
          "Ashen Archive 是这组作品的对外壳层。重点不只是“看起来有气氛”，而是把氛围、层级和交互变成一套真正可读的阅读系统。",
        contribution: [
          {
            lens: "moon",
            text: "搭建了让页面可以被当作系统来阅读的结构：路由、数据驱动区块、稳定资源路径，以及可持续扩展的作品流。",
          },
          {
            lens: "ember",
            text: "确定氛围层、首屏构图、祭坛卡片和符印语言，让站点更像被策展过的档案，而不是现成模板。",
          },
        ],
        technologies: ["Next.js", "TypeScript", "Motion", "栅格资产流程", "静态导出"],
        solved: "把个人站做成有记忆点的档案界面，同时不牺牲可扫读性、多语言结构和 GitHub Pages 静态部署安全性。",
      },
      ja: {
        title: "Ashen Archive",
        category: "Interactive Archive",
        role: "Art Direction / UI Systems / Motion",
        summary:
          "このポートフォリオ自体をケースとして扱います。雰囲気、階層、動き、データ構造を一体化し、汎用テンプレートではない公開アーカイブにしました。",
        tags: ["Next.js", "Interactive UI", "Art Direction"],
        evidence: [
          "安全に使える素材と自作アートで構成した scene-first hero",
          "コンテンツ、導線、ケース情報はローカルの構造化データで管理",
          "モーションと hover は後付けでなくアーカイブ言語の一部",
        ],
        what:
          "Ashen Archive は作品群の公開シェルです。雰囲気だけでなく、気分・情報・相互作用を一つの読解システムとしてまとめています。",
        contribution: [
          {
            lens: "moon",
            text: "ルーティング、データ駆動セクション、安定したアセット経路を整え、ページ全体を一つのシステムとして読めるようにしました。",
          },
          {
            lens: "ember",
            text: "雰囲気レイヤー、hero 構図、儀式カード、sigil 言語を設計し、テンプレート感ではなくキュレーション感を作りました。",
          },
        ],
        technologies: ["Next.js", "TypeScript", "Motion", "Generated raster art", "Static export"],
        solved:
          "覚えやすい公開アーカイブ体験を作りつつ、可読性、多言語構造、静的配備の安全性を守りました。",
      },
      ko: {
        title: "Ashen Archive",
        category: "인터랙티브 아카이브",
        role: "아트 디렉션 / UI 시스템 / Motion",
        summary:
          "포트폴리오 자체를 하나의 케이스로 다룹니다. 분위기 연출, 계층, 모션, 데이터 구조를 결합해 평범한 템플릿이 아닌 공개 아카이브로 만들었습니다.",
        tags: ["Next.js", "Interactive UI", "Art Direction"],
        evidence: [
          "안전한 출처의 분위기 자산과 자체 제작 아트로 만든 scene-first hero",
          "콘텐츠, 내비게이션, 케이스 메타데이터를 모두 로컬 구조화 데이터로 관리",
          "모션과 hover가 사후 장식이 아니라 아카이브 언어의 일부",
        ],
        what:
          "Ashen Archive는 이 작업 묶음의 공개 셸입니다. 단지 분위기를 내는 것이 아니라, 분위기와 위계, 상호작용을 읽을 수 있는 시스템으로 묶는 데 목적이 있습니다.",
        contribution: [
          {
            lens: "moon",
            text: "라우팅, 데이터 기반 섹션, 안정적인 자산 경로를 정리해 페이지 전체를 하나의 시스템으로 읽히게 만들었습니다.",
          },
          {
            lens: "ember",
            text: "분위기 레이어, hero 구도, 의식 카드, sigil 언어를 설계해 템플릿이 아니라 큐레이션된 아카이브처럼 느껴지게 했습니다.",
          },
        ],
        technologies: ["Next.js", "TypeScript", "Motion", "Generated raster art", "Static export"],
        solved: "기억에 남는 공개 아카이브 경험을 만들면서도 가독성, 다국어 구조, 정적 배포 안정성을 지켰습니다.",
      },
    },
  },
  {
    slug: "openemotion",
    featured: false,
    cover: "/artifacts/openemotion-cover-v2.jpg",
    coverPosition: "50% 36%",
    lenses: ["tower", "ember"],
    media: [
      {
        kind: "image",
        src: "/artifacts/openemotion-cover-v2.jpg",
        alt: "Ritual cover for OpenEmotion with a worn tome resting in darkness and a dim ember trace below.",
        label: "OpenEmotion cover relic",
      },
      {
        kind: "image",
        src: "/artifacts/openemotion-dossier-v2.jpg",
        alt: "Public-safe dossier board for OpenEmotion with a sealed tome, manuscript page, and reflective archive linkage marks.",
        label: "OpenEmotion dossier board",
      },
    ],
    mediaPosition: ["50% 36%", "50% 40%"],
    content: {
      en: {
        title: "OpenEmotion",
        category: "Reflective Core",
        role: "Identity / Memory / Reflection Design",
        summary:
          "A public-safe case about the inward side of the system: persistent self-modeling, governed memory evolution, appraisal state, and reflective revision under explicit constraints.",
        tags: ["Self-model", "Memory", "Reflective Systems"],
        evidence: [
          "Shows identity and memory as structured, governed state rather than loose prompts",
          "Framed around continuity, invariants, and evidence quality instead of vague personality language",
          "Observation-window thinking makes the system legible as an evolving core, not a magic box",
        ],
        what:
          "OpenEmotion is the internal core that tracks identity continuity, self-model changes, memory evolution, and reflective adjustment while staying inside governance boundaries.",
        contribution: [
          {
            lens: "tower",
            text: "Defined public-safe boundaries for what the inner core owns, how it changes, and what must remain governed or auditable over time.",
          },
          {
            lens: "ember",
            text: "Shaped the language and structure for identity, memory, appraisal, and reflection so the system can evolve without becoming unreadable or mythologized.",
          },
        ],
        technologies: ["Python", "Identity invariants", "Memory schemas", "Observation workflows", "Reflective governance"],
        solved:
          "Made the reflective side of the system easier to present as a disciplined architecture instead of a vague claim about intelligence or emotion.",
      },
      "zh-CN": {
        title: "OpenEmotion",
        category: "反思核心",
        role: "身份 / 记忆 / Reflection 设计",
        summary:
          "这是一个公开安全版案例，聚焦系统的内部一侧：持续 self-model、受控记忆演化、appraisal 状态，以及在明确约束下进行的反思修正。",
        tags: ["Self-model", "记忆", "反思系统"],
        evidence: [
          "把 identity 和 memory 写成结构化、受治理的状态，而不是松散 prompt",
          "重点是连续性、invariants 和证据质量，而不是空泛的人格叙事",
          "通过 observation window 让它更像演化中的内核，而不是神秘黑盒",
        ],
        what:
          "OpenEmotion 是内部核心，负责身份连续性、自我模型变化、记忆演化和反思修正，同时始终保持在治理边界之内。",
        contribution: [
          {
            lens: "tower",
            text: "界定内部核心真正拥有的语义边界，明确哪些变化必须受治理、可审计、可回溯。",
          },
          {
            lens: "ember",
            text: "组织 identity、memory、appraisal 和 reflection 的表达结构，让系统能演化，但不会变得不可读或被神化。",
          },
        ],
        technologies: ["Python", "身份不变量", "记忆 Schema", "观测工作流", "反思治理"],
        solved: "让系统内部的反思层能以一种工程化、可解释的方式呈现，而不是停留在关于“智能”或“情绪”的模糊说法上。",
      },
      ja: {
        title: "OpenEmotion",
        category: "Reflective Core",
        role: "Identity / Memory / Reflection Design",
        summary:
          "システムの内側を公開安全な範囲で整理したケースです。持続 self-model、統治された memory 変化、appraisal 状態、反省的修正を扱います。",
        tags: ["Self-model", "Memory", "Reflective Systems"],
        evidence: [
          "identity と memory を loose prompt ではなく構造化された状態として扱う",
          "曖昧な人格言語ではなく continuity と invariants を中心に据える",
          "観測窓の考え方で evolving core として読めるようにしている",
        ],
        what:
          "OpenEmotion は、identity continuity、self-model の更新、memory evolution、reflective adjustment を担う内側のコアです。",
        contribution: [
          {
            lens: "tower",
            text: "内側コアが何を所有し、どこまで変化し、何が常に audit 可能であるべきかを公開安全な形で整理しました。",
          },
          {
            lens: "ember",
            text: "identity、memory、appraisal、reflection を読みやすい構造へまとめ、進化しても神話化しないようにしました。",
          },
        ],
        technologies: ["Python", "Identity invariants", "Memory schemas", "Observation workflows", "Reflective governance"],
        solved:
          "内側の反省層を、曖昧な主張ではなく規律あるアーキテクチャとして説明しやすくしました。",
      },
      ko: {
        title: "OpenEmotion",
        category: "반성 코어",
        role: "정체성 / 메모리 / Reflection 설계",
        summary:
          "이 케이스는 시스템의 안쪽 층을 공개 가능한 범위로 정리합니다. 지속 self-model, 통제된 memory 진화, appraisal 상태, 명시적 제약 아래의 반성적 수정이 핵심입니다.",
        tags: ["Self-model", "Memory", "Reflective Systems"],
        evidence: [
          "identity와 memory를 느슨한 프롬프트가 아니라 구조화된 상태로 다룸",
          "모호한 성격 서사보다 continuity, invariants, evidence quality에 초점",
          "observation window 사고로 진화 중인 코어처럼 읽히게 함",
        ],
        what:
          "OpenEmotion은 identity continuity, self-model 변화, memory evolution, reflective adjustment를 담당하는 내부 코어입니다.",
        contribution: [
          {
            lens: "tower",
            text: "내부 코어가 무엇을 소유하고 어떻게 변하며 무엇이 항상 감사 가능해야 하는지에 대한 공개 안전한 경계를 정의했습니다.",
          },
          {
            lens: "ember",
            text: "identity, memory, appraisal, reflection의 언어와 구조를 정리해 시스템이 진화해도 읽기 어렵거나 신화화되지 않게 만들었습니다.",
          },
        ],
        technologies: ["Python", "Identity invariants", "Memory schemas", "Observation workflows", "Reflective governance"],
        solved: "시스템의 반성 계층을 ‘지능’이나 ‘감정’에 대한 모호한 주장 대신 규율 있는 아키텍처로 설명할 수 있게 했습니다.",
      },
    },
  },
];

export function getArtifacts(locale: Locale): ArtifactView[] {
  return artifacts.map((artifact) => ({
    slug: artifact.slug,
    featured: artifact.featured,
    cover: artifact.cover,
    coverPosition: artifact.coverPosition,
    lenses: artifact.lenses,
    media: artifact.media,
    mediaPosition: artifact.mediaPosition,
    ...artifact.content[locale],
  }));
}
