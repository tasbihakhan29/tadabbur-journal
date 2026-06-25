import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { EightPointStar } from "./icons/ornaments";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-hairline">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:gap-6">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 font-display text-lg font-medium text-ink">
              <EightPointStar className="h-5 w-5 text-emerald" />
              {siteConfig.shortName}
            </div>
            <p className="mt-3 font-ui text-sm leading-relaxed text-ink-faint">
              {siteConfig.disclaimer}
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h3 className="font-ui text-xs font-medium uppercase tracking-wider text-ink-faint">
                Explore
              </h3>
              <ul className="mt-4 space-y-2.5 font-ui text-sm">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-ink-soft transition-colors hover:text-emerald"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-hairline pt-8 text-center">
          <p dir="rtl" className="font-arabic text-base text-emerald sm:text-lg">
            وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ
          </p>
          <p className="max-w-md font-ui text-xs italic text-ink-faint">
            &ldquo;And remind, for indeed the reminder benefits the believers.&rdquo;
            <span className="not-italic"> — Surah Adh-Dhariyat, 51:55</span>
          </p>
          <p className="mt-4 font-ui text-xs text-ink-faint">
            © {new Date().getFullYear()} {siteConfig.author.name}. Personal reflections, not
            formal tafsir.
          </p>
        </div>
      </div>
    </footer>
  );
}
