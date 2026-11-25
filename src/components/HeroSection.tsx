import { ArrowDownRight, ArrowRight, Globe } from 'lucide-react';
import { UI_COPY, t } from '../data/translations';
import { Language } from '../types/i18n';
import { HeroScene3D } from './HeroScene3D';

interface HeroSectionProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onPickProgramClick: () => void;
}

export function HeroSection({
  lang,
  onChangeLang,
  onPickProgramClick,
}: HeroSectionProps) {
  const titleText = t(UI_COPY.hero.title, lang);
  const highlightToken = lang === 'uk' ? 'з AI' : 'по AI';
  const parts = titleText.split(highlightToken);

  return (
    <section
      id="top"
      className="bg-atmospheric scroll-mt-20 border-b border-sky-100 pb-16 pt-7 sm:pb-20 sm:pt-9"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Top utility strip: Location line + Language Toggle */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 pb-5 sm:mb-10">
          <p className="text-sm font-medium text-slate-600">
            {t(UI_COPY.hero.locationLine, lang)}
          </p>

          <div
            role="group"
            aria-label={t(UI_COPY.langSwitcher.label, lang)}
            className="inline-flex items-center gap-1 rounded-2xl border border-sky-200/80 bg-white/90 p-1 shadow-xs"
          >
            <Globe
              className="ml-2 h-4 w-4 text-[#00AEEF] shrink-0"
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => onChangeLang('uk')}
              aria-pressed={lang === 'uk'}
              className={`min-h-[36px] rounded-xl px-3.5 py-1 text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF] ${
                lang === 'uk'
                  ? 'btn-3d-sky text-white'
                  : 'text-slate-700 hover:text-[#0082C2]'
              }`}
            >
              {UI_COPY.langSwitcher.ukLabel}
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('ru')}
              aria-pressed={lang === 'ru'}
              className={`min-h-[36px] rounded-xl px-3.5 py-1 text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF] ${
                lang === 'ru'
                  ? 'btn-3d-sky text-white'
                  : 'text-slate-700 hover:text-[#0082C2]'
              }`}
            >
              {UI_COPY.langSwitcher.ruLabel}
            </button>
          </div>
        </div>

        {/* 2-Column Hero Grid: Left Editorial Typography / Right Framed Sky-Blue 3D Viewport */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <h1
              className="font-display text-[clamp(2.35rem,4.4vw,3.85rem)] font-extrabold leading-[1.06] tracking-tight text-slate-950"
              style={{ textWrap: 'balance' }}
            >
              {parts.length === 2 ? (
                <>
                  {parts[0]}
                  <span className="text-[#00AEEF]">{highlightToken}</span>
                  {parts[1]}
                </>
              ) : (
                titleText
              )}
            </h1>

            <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-slate-600 sm:text-lg">
              {t(UI_COPY.hero.subtitle, lang)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onPickProgramClick}
                className="btn-3d-orange inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-2xl px-7 py-3.5 text-base font-bold text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F58220]"
              >
                <span>{t(UI_COPY.hero.primaryCta, lang)}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              <a
                href="#programs"
                className="btn-3d-white inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF]"
              >
                <span>{t(UI_COPY.hero.secondaryCta, lang)}</span>
                <ArrowDownRight
                  className="h-4 w-4 text-[#00AEEF] shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>

            <p className="mt-6 text-xs font-medium text-slate-500 sm:text-sm">
              {t(UI_COPY.hero.visualCaption, lang)}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="volumetric-card-sky relative h-[320px] w-full overflow-hidden rounded-[28px] sm:h-[380px] lg:h-[420px]">
              <HeroScene3D ariaLabel={t(UI_COPY.hero.imageAlt, lang)} />
            </div>
          </div>
        </div>

        {/* Bottom 4 Volumetric KPI Cards */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {UI_COPY.hero.metrics.map((metric, idx) => {
            const cardClass =
              idx === 1
                ? 'volumetric-card-orange text-white'
                : idx === 2
                ? 'volumetric-card-sky text-white'
                : 'volumetric-card-white text-slate-950';

            const valueColor =
              idx === 0
                ? 'text-[#00AEEF]'
                : idx === 3
                ? 'text-[#F58220]'
                : 'text-white';

            const labelColor =
              idx === 1 || idx === 2 ? 'text-white/90' : 'text-slate-600';

            return (
              <div
                key={metric.value}
                className={`${cardClass} flex flex-col justify-center rounded-3xl px-6 py-5 sm:px-7 sm:py-6`}
              >
                <div
                  className={`font-display text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl ${valueColor}`}
                >
                  {metric.value}
                </div>
                <div className={`mt-1.5 text-sm font-semibold ${labelColor}`}>
                  {t(metric.label, lang)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
