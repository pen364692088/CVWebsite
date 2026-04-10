import type { Locale } from "@/lib/i18n";
import type { ExperienceChapterId } from "@/lib/archive";

export interface ExperienceStageStateCopy {
  label: string;
  status: string;
}

export interface ExperienceCopy {
  navLabel: string;
  jumpLabel: string;
  scrollLabel: string;
  stageLabel: string;
  motionModeLabel: string;
  reducedMotionLabel: string;
  liveMotionLabel: string;
  chapterNav: Record<ExperienceChapterId, string>;
  stageStates: Record<ExperienceChapterId, ExperienceStageStateCopy>;
  threshold: {
    kicker: string;
    title: string;
    lead: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    footnote: string;
  };
  oath: {
    kicker: string;
    title: string;
    lead: string;
    body: string;
    railLabel: string;
  };
  caseSection: {
    kickerPrefix: string;
    summaryLabel: string;
    evidenceLabel: string;
    contributionLabel: string;
    technologiesLabel: string;
    solvedLabel: string;
    mediaLabel: string;
  };
  contactCoda: {
    kicker: string;
    title: string;
    lead: string;
    body: string;
    availabilityLabel: string;
    dossierLabel: string;
    linksLabel: string;
  };
}

export const experienceDictionaries: Record<Locale, ExperienceCopy> = {
  en: {
    navLabel: "Experience chapters",
    jumpLabel: "Jump to section",
    scrollLabel: "Scroll to advance the chamber",
    stageLabel: "Archive chamber",
    motionModeLabel: "Motion mode",
    reducedMotionLabel: "Reduced",
    liveMotionLabel: "Live",
    chapterNav: {
      threshold: "Threshold",
      oath: "Oath",
      egocore: "EgoCore",
      "ashen-archive": "Ashen Archive",
      openemotion: "OpenEmotion",
      "contact-coda": "Coda",
    },
    stageStates: {
      threshold: { label: "Threshold", status: "Seal dormant" },
      oath: { label: "Oath", status: "Identity in recognition" },
      egocore: { label: "EgoCore", status: "Runtime path indexed" },
      "ashen-archive": { label: "Archive Shell", status: "Public shell illuminated" },
      openemotion: { label: "OpenEmotion", status: "Reflective core surfaced" },
      "contact-coda": { label: "Coda", status: "Chamber holding steady" },
    },
    threshold: {
      kicker: "Archive Threshold",
      title: "A chamber that reveals the work as a sequence, not a pile of cards.",
      lead: "The page now behaves like a guided archive chamber. You move forward and the system changes state around you.",
      body: "This is still a portfolio, but the reading order is authored. Runtime, interface, and reflective core are introduced as linked records rather than isolated tiles.",
      primaryCta: "Enter the oath",
      secondaryCta: "Skip to the records",
      footnote: "Static-export safe. WebGL optional. Reduced motion preserved.",
    },
    oath: {
      kicker: "Oath Register",
      title: "Atmosphere is the surface. Evidence is the criterion.",
      lead: "The chamber keeps the mood, but every chapter still has to name what was built, what constraints mattered, and what responsibility was actually owned.",
      body: "This reading system is built for product, architecture, and interface work that benefits from narrative control without dissolving into pure spectacle.",
      railLabel: "Current register",
    },
    caseSection: {
      kickerPrefix: "Case file",
      summaryLabel: "Summary",
      evidenceLabel: "Evidence",
      contributionLabel: "Contribution",
      technologiesLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Archive plates",
    },
    contactCoda: {
      kicker: "Contact Coda",
      title: "The chamber closes by turning atmosphere back into contactable work.",
      lead: "The ending should feel stable, not theatrical. If the work is a fit, the next step is a real conversation.",
      body: "Prototype support, system design, interface direction, and narrative framing stay available as practical collaboration paths.",
      availabilityLabel: "Availability",
      dossierLabel: "Dossier",
      linksLabel: "Routes",
    },
  },
  "zh-CN": {
    navLabel: "体验章节",
    jumpLabel: "跳转到章节",
    scrollLabel: "向下滚动，推进档案室",
    stageLabel: "档案室舞台",
    motionModeLabel: "动效模式",
    reducedMotionLabel: "降级",
    liveMotionLabel: "实时",
    chapterNav: {
      threshold: "门槛",
      oath: "誓约",
      egocore: "EgoCore",
      "ashen-archive": "Ashen Archive",
      openemotion: "OpenEmotion",
      "contact-coda": "尾声",
    },
    stageStates: {
      threshold: { label: "门槛", status: "封印休眠" },
      oath: { label: "誓约", status: "身份显影中" },
      egocore: { label: "EgoCore", status: "运行时路径已归档" },
      "ashen-archive": { label: "Archive Shell", status: "公开外壳已点亮" },
      openemotion: { label: "OpenEmotion", status: "反思核心浮现" },
      "contact-coda": { label: "尾声", status: "档案室维持稳定" },
    },
    threshold: {
      kicker: "档案门槛",
      title: "这里不是卡片堆，而是一间按顺序展开工作的档案室。",
      lead: "页面现在像一间被编排的档案室。你向前推进，系统会跟着改变状态。",
      body: "它仍然是作品站，但阅读顺序是被设计过的。运行时、界面外壳与反思核心不再作为分散卡片出现，而是作为连续记录被展开。",
      primaryCta: "进入誓约",
      secondaryCta: "直接查看记录",
      footnote: "保持静态导出兼容。WebGL 可选。保留 reduced motion。",
    },
    oath: {
      kicker: "誓约登记",
      title: "氛围只是表层，真正的判断标准仍然是证据。",
      lead: "档案室可以保留气质，但每个章节仍必须说清：做了什么、约束是什么、责任归属在哪里。",
      body: "这套阅读系统适合产品、架构和界面工作，用叙事控制强化理解，而不是把内容溶解成纯视觉奇观。",
      railLabel: "当前登记",
    },
    caseSection: {
      kickerPrefix: "案例卷宗",
      summaryLabel: "概述",
      evidenceLabel: "证据",
      contributionLabel: "贡献",
      technologiesLabel: "技术",
      solvedLabel: "解决的问题",
      mediaLabel: "档案图板",
    },
    contactCoda: {
      kicker: "联系尾声",
      title: "最后的收束，是把氛围重新落回可联系、可协作的工作。",
      lead: "结尾不应该是戏剧化退场，而应该是一种稳定的落点。如果方向合适，下一步就是现实对话。",
      body: "原型支持、系统设计、界面方向和叙事包装，仍然是可以实际合作的路径。",
      availabilityLabel: "可合作状态",
      dossierLabel: "档案",
      linksLabel: "路径",
    },
  },
  ja: {
    navLabel: "Experience chapters",
    jumpLabel: "Jump to section",
    scrollLabel: "Scroll to advance the chamber",
    stageLabel: "Archive chamber",
    motionModeLabel: "Motion mode",
    reducedMotionLabel: "Reduced",
    liveMotionLabel: "Live",
    chapterNav: {
      threshold: "Threshold",
      oath: "Oath",
      egocore: "EgoCore",
      "ashen-archive": "Ashen Archive",
      openemotion: "OpenEmotion",
      "contact-coda": "Coda",
    },
    stageStates: {
      threshold: { label: "Threshold", status: "Seal dormant" },
      oath: { label: "Oath", status: "Identity in recognition" },
      egocore: { label: "EgoCore", status: "Runtime path indexed" },
      "ashen-archive": { label: "Archive Shell", status: "Public shell illuminated" },
      openemotion: { label: "OpenEmotion", status: "Reflective core surfaced" },
      "contact-coda": { label: "Coda", status: "Chamber holding steady" },
    },
    threshold: {
      kicker: "Archive Threshold",
      title: "このページはカードの山ではなく、順番に読むための保管室として構成されています。",
      lead: "ページ全体が演出された archive chamber として動きます。前へ進むごとに、システム側の状態も切り替わります。",
      body: "依然として portfolio ですが、読み順は設計されています。runtime、public shell、reflective core を分断された要素ではなく連続する記録として読ませます。",
      primaryCta: "Enter the oath",
      secondaryCta: "Skip to the records",
      footnote: "Static export safe. WebGL optional. Reduced motion preserved.",
    },
    oath: {
      kicker: "Oath Register",
      title: "雰囲気は表面であり、評価基準はあくまで evidence です。",
      lead: "空気感を保ちながらも、各章は何を作ったか、どんな制約があったか、何を担ったかを明示する必要があります。",
      body: "これは spectacle に逃げず、narrative control によって理解を高めるための読み方です。",
      railLabel: "Current register",
    },
    caseSection: {
      kickerPrefix: "Case file",
      summaryLabel: "Summary",
      evidenceLabel: "Evidence",
      contributionLabel: "Contribution",
      technologiesLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Archive plates",
    },
    contactCoda: {
      kicker: "Contact Coda",
      title: "最後は雰囲気を再び連絡可能な仕事へ戻します。",
      lead: "終わり方は theatrical ではなく、安定しているべきです。方向が合えば、次は実際の会話です。",
      body: "Prototype support、system design、interface direction、narrative framing は実務の協力対象として残ります。",
      availabilityLabel: "Availability",
      dossierLabel: "Dossier",
      linksLabel: "Routes",
    },
  },
  ko: {
    navLabel: "Experience chapters",
    jumpLabel: "Jump to section",
    scrollLabel: "Scroll to advance the chamber",
    stageLabel: "Archive chamber",
    motionModeLabel: "Motion mode",
    reducedMotionLabel: "Reduced",
    liveMotionLabel: "Live",
    chapterNav: {
      threshold: "Threshold",
      oath: "Oath",
      egocore: "EgoCore",
      "ashen-archive": "Ashen Archive",
      openemotion: "OpenEmotion",
      "contact-coda": "Coda",
    },
    stageStates: {
      threshold: { label: "Threshold", status: "Seal dormant" },
      oath: { label: "Oath", status: "Identity in recognition" },
      egocore: { label: "EgoCore", status: "Runtime path indexed" },
      "ashen-archive": { label: "Archive Shell", status: "Public shell illuminated" },
      openemotion: { label: "OpenEmotion", status: "Reflective core surfaced" },
      "contact-coda": { label: "Coda", status: "Chamber holding steady" },
    },
    threshold: {
      kicker: "Archive Threshold",
      title: "이 페이지는 카드 모음이 아니라 순서대로 읽히는 아카이브 챔버로 구성됩니다.",
      lead: "페이지 전체가 연출된 archive chamber처럼 동작합니다. 앞으로 진행할수록 시스템 상태도 함께 바뀝니다.",
      body: "여전히 포트폴리오이지만 읽기 순서는 설계되어 있습니다. runtime, public shell, reflective core를 분리된 카드가 아니라 연결된 기록으로 보여줍니다.",
      primaryCta: "Enter the oath",
      secondaryCta: "Skip to the records",
      footnote: "Static export safe. WebGL optional. Reduced motion preserved.",
    },
    oath: {
      kicker: "Oath Register",
      title: "분위기는 표면이고, 실제 판단 기준은 evidence입니다.",
      lead: "분위기를 유지하더라도 각 장은 무엇을 만들었고 어떤 제약이 있었으며 무엇을 책임졌는지 분명히 말해야 합니다.",
      body: "이 읽기 방식은 순수한 spectacle이 아니라 narrative control을 통해 이해도를 높이기 위한 것입니다.",
      railLabel: "Current register",
    },
    caseSection: {
      kickerPrefix: "Case file",
      summaryLabel: "Summary",
      evidenceLabel: "Evidence",
      contributionLabel: "Contribution",
      technologiesLabel: "Technologies",
      solvedLabel: "Problem solved",
      mediaLabel: "Archive plates",
    },
    contactCoda: {
      kicker: "Contact Coda",
      title: "마지막에는 분위기를 다시 연락 가능한 실제 작업으로 되돌립니다.",
      lead: "엔딩은 극적이라기보다 안정적이어야 합니다. 방향이 맞다면 다음 단계는 실제 대화입니다.",
      body: "Prototype support, system design, interface direction, narrative framing은 여전히 실질적인 협업 경로로 남아 있습니다.",
      availabilityLabel: "Availability",
      dossierLabel: "Dossier",
      linksLabel: "Routes",
    },
  },
};
