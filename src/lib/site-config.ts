// Central place to change site identity, author info, and global copy.
// Editing this file is the only thing needed to rebrand the whole site.

export const siteConfig = {
  name: "The Tadabbur Journal",
  shortName: "Tadabbur Journal",
  tagline: "Reflections from my journey through the Qur'an",
  description:
    "A personal Qur'an reflection journal — notes, lessons, and tadabbur written while reading the Qur'an alongside authentic tafsir.",
  url: "https://tadabbur-journal.vercel.app",
  author: {
    name: "Tasbiha Khan",
    role: "Software Engineer",
    signature: "Tasbiha Khan",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Archive", href: "/archive" },
    { label: "About", href: "/about" },
  ],
  disclaimer:
    "These writings are not tafsir, but personal lessons, observations, and reflections derived from study and contemplation.",
  dua: {
    arabic:
      "اللهم اغفر لي إن أخطأت، وارزقني الإخلاص والصدق في القول والعمل، واجعل هذا العمل خالصًا لوجهك الكريم، وانفع به من يقرأه، واجعله شاهدًا لي لا عليّ يوم ألقاك.",
    english:
      "O Allah, forgive me if I make mistakes. Grant me sincerity and truthfulness in my words and actions. Make this work purely for Your sake, benefit those who read it, and make it a witness for me and not against me on the Day I meet You.",
  },
};

export type SiteConfig = typeof siteConfig;
