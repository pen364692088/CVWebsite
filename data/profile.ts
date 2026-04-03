export interface ResumeAsset {
  pdf: string;
  previews: string[];
}

export interface ContactLink {
  key: "email" | "github" | "linkedin" | "resume";
  href: string;
  label: string;
  available: boolean;
}

export const resumeAsset: ResumeAsset = {
  pdf: "/resume/zhouyu-liao-software-developer-resume.pdf",
  previews: [
    "/resume/preview-cover.jpg",
    "/resume/preview-page-2.jpg",
    "/resume/preview-page-3.jpg",
  ],
};

export const contactLinks: ContactLink[] = [
  {
    key: "email",
    href: "mailto:moonlight1939300864@gmail.com",
    label: "moonlight1939300864@gmail.com",
    available: true,
  },
  {
    key: "github",
    href: "https://github.com/pen364692088",
    label: "github.com/pen364692088",
    available: true,
  },
  {
    key: "linkedin",
    href: "",
    label: "LinkedIn profile available on request",
    available: false,
  },
  {
    key: "resume",
    href: resumeAsset.pdf,
    label: "Download PDF resume",
    available: true,
  },
];
