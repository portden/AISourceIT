import { TESTIMONIALS, UI_COPY, t } from '../data/translations';
import { Language } from '../types/i18n';

interface OutcomesSectionProps {
  lang: Language;
}

export function OutcomesSection({ lang }: OutcomesSectionProps) {
  return (
    <section
      id="outcomes"
      className="bg-white scroll-mt-20 border-t border-sky-100 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold text-[#0082C2]">
            {t(UI_COPY.outcomesSection.eyebrow, lang)}
          </p>
          <h2
            className="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {t(UI_COPY.outcomesSection.title, lang)}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => {
            const isOrange = idx === 1;
            return (
              <article
                key={item.id}
                className="volumetric-card-white flex flex-col justify-between rounded-3xl p-7"
              >
                <div>
                  <div className="text-xs font-bold text-slate-500">
                    {t(item.courseTag, lang)}
                  </div>

                  <div
                    className={`font-display mt-2 text-2xl font-extrabold tracking-tight tabular-nums ${
                      isOrange ? 'text-[#E06805]' : 'text-[#0082C2]'
                    }`}
                  >
                    {t(item.metricBadge, lang)}
                  </div>

                  <div className="mt-5 space-y-3 border-t border-sky-100 pt-5 text-sm leading-relaxed">
                    <p className="text-slate-600">
                      <span className="font-bold text-slate-900">
                        {t(UI_COPY.outcomesSection.beforeLabel, lang)}{' '}
                      </span>
                      {t(item.beforeText, lang)}
                    </p>
                    <p className="text-slate-800">
                      <span className="font-bold text-[#D96200]">
                        {t(UI_COPY.outcomesSection.afterLabel, lang)}{' '}
                      </span>
                      {t(item.outcomeText, lang)}
                    </p>
                  </div>
                </div>

                <div className="mt-7 border-t border-sky-100 pt-4">
                  <div className="font-display text-base font-extrabold text-slate-950">
                    {t(item.name, lang)}
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-slate-500">
                    {t(item.role, lang)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
