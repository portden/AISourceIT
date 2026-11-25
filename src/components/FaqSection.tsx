import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS, UI_COPY, t } from '../data/translations';
import { Language } from '../types/i18n';

interface FaqSectionProps {
  lang: Language;
}

export function FaqSection({ lang }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="bg-atmospheric scroll-mt-20 border-t border-sky-100 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold text-[#D96200]">
            {t(UI_COPY.faqSection.eyebrow, lang)}
          </p>
          <h2
            className="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            {t(UI_COPY.faqSection.title, lang)}
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="volumetric-card-white overflow-hidden rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  className="flex min-h-[64px] w-full items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#00AEEF]"
                >
                  <span className="font-display text-base font-extrabold text-slate-950 sm:text-lg">
                    {t(item.question, lang)}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-[#F58220]' : 'text-[#00AEEF]'
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={`faq-panel-${item.id}`}
                    className="border-t border-sky-100 px-6 pb-5 pt-4 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    {t(item.answer, lang)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
