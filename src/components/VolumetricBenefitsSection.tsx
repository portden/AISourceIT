import { BENEFITS, UI_COPY, t } from '../data/translations';
import { Language } from '../types/i18n';
import { TiltCard } from './TiltCard';

interface VolumetricBenefitsSectionProps {
  lang: Language;
}

export function VolumetricBenefitsSection({ lang }: VolumetricBenefitsSectionProps) {
  return (
    <section
      id="methodology"
      className="bg-blue-volumetric-band scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-bold text-sky-100">
            {t(UI_COPY.benefitsSection.eyebrow, lang)}
          </p>
          <h2
            className="font-display mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {t(UI_COPY.benefitsSection.title, lang)}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-sky-50">
            {t(UI_COPY.benefitsSection.subtitle, lang)}
          </p>
        </div>

        {/* Volumetric 3-Column Bento Grid: White / Orange / Deep Blue / White */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {BENEFITS.map((item, index) => {
            const isWhite = index === 0 || index === 3;
            const isOrange = index === 1;
            const surfaceClass = isWhite
              ? 'volumetric-card-white text-slate-950'
              : isOrange
              ? 'volumetric-card-orange text-white'
              : 'volumetric-card-deep text-white';

            const numberClass = isWhite
              ? index === 0
                ? 'text-[#00AEEF]'
                : 'text-[#F58220]'
              : 'text-white';

            const metricClass = isWhite
              ? 'text-slate-600'
              : isOrange
              ? 'text-orange-50'
              : 'text-sky-100';
            const titleClass = isWhite ? 'text-slate-950' : 'text-white';
            const descClass = isWhite
              ? 'text-slate-600'
              : isOrange
              ? 'text-orange-50'
              : 'text-sky-50';

            return (
              <TiltCard
                key={item.number}
                maxTilt={3.5}
                className={`${item.spanWide ? 'lg:col-span-2' : 'lg:col-span-1'} flex`}
              >
                <div
                  className={`${surfaceClass} flex w-full flex-col justify-between rounded-3xl p-7 sm:p-8`}
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span
                        className={`font-display text-3xl font-extrabold tabular-nums ${numberClass}`}
                      >
                        {item.number}
                      </span>

                      <span
                        className={`text-xs font-bold tabular-nums ${metricClass}`}
                      >
                        {t(item.metric, lang)}
                      </span>
                    </div>

                    <h3
                      className={`font-display mt-5 text-xl font-extrabold tracking-tight sm:text-2xl ${titleClass}`}
                    >
                      {t(item.title, lang)}
                    </h3>

                    <p
                      className={`mt-3 text-sm leading-relaxed sm:text-base ${descClass}`}
                    >
                      {t(item.description, lang)}
                    </p>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
