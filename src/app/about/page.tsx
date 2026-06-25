import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { StarDivider, StarWatermark } from "@/components/icons/ornaments";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.author.name} and the purpose of ${siteConfig.name}.`,
};

export default function AboutPage() {
  return (
    <div className="relative">
      <StarWatermark className="pointer-events-none absolute -left-24 top-10 h-80 w-80 text-gold opacity-[0.05]" />

      <div className="mx-auto max-w-2xl px-5 pb-24 pt-16 sm:px-8 sm:pt-20">
        <div className="text-center">
          <span className="font-ui text-xs uppercase tracking-wider text-gold">
            About this project
          </span>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">
            About This Project
          </h1>
        </div>

        <StarDivider className="my-10" />

        {/* About me */}
        <section>
          <h2 className="font-display text-xl font-medium text-emerald">About Me</h2>
          <div className="prose-reflection mt-5">
            <p>Assalamu Alaikum,</p>
            <p>
              My name is {siteConfig.author.name}. I am a {siteConfig.author.role} with
              a deep love for reading, reflecting upon, and learning from the
              Qur&rsquo;an.
            </p>
            <p>
              Over time, I found myself writing personal notes while studying the
              Qur&rsquo;an and reading its tafsir. Many of these reflections helped me
              connect the timeless guidance of the Qur&rsquo;an with the challenges and
              realities of our modern world.
            </p>
            <p>
              I created this website as a place to collect those reflections and
              preserve them as my own notes. By making them public, I hope they may
              also benefit others who are seeking to understand and reflect upon the
              Qur&rsquo;an.
            </p>
            <p>
              This website is not a book of tafsir, nor do I claim scholarly authority.
              The reflections shared here are simply my personal thoughts and lessons
              derived from studying the Qur&rsquo;an and consulting authentic
              explanations from scholars.
            </p>
          </div>
        </section>

        <div className="my-14 h-px bg-hairline" />

        {/* Disclaimer */}
        <section className="rounded-2xl border border-gold-soft bg-gold-faint px-7 py-8 sm:px-9 sm:py-9">
          <h2 className="font-display text-xl font-medium text-ink">
            Important Disclaimer
          </h2>
          <div className="mt-4 space-y-4 font-body text-[1.05rem] leading-relaxed text-ink-soft">
            <p>
              The content on this website represents personal reflections
              (<em>tadabbur</em>) and should not be considered formal tafsir.
            </p>
            <p>
              Whenever I discuss an ayah, I encourage readers to consult authentic
              tafsir works and qualified scholars for a deeper and more comprehensive
              understanding.
            </p>
            <p>
              If you notice any mistake, misunderstanding, or incorrect
              interpretation, please approach it with kindness and sincerity.
            </p>
          </div>
        </section>

        <div className="my-14 h-px bg-hairline" />

        {/* Dua */}
        <section className="text-center">
          <h2 className="font-display text-xl font-medium text-emerald">
            A Personal Dua
          </h2>
          <p
            dir="rtl"
            lang="ar"
            className="mt-6 font-arabic text-2xl leading-[2.2] text-ink sm:text-[1.75rem]"
          >
            {siteConfig.dua.arabic}
          </p>
          <div className="gold-rule mx-auto my-7 w-20" />
          <p className="mx-auto max-w-lg font-body text-base italic leading-relaxed text-ink-soft">
            {siteConfig.dua.english}
          </p>
        </section>
      </div>
    </div>
  );
}
