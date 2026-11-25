import { UI_COPY, t } from '../data/translations';
import { Language } from '../types/i18n';
import { SourceItLogo } from './SourceItLogo';

interface FooterProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export function Footer({ lang, onChangeLang }: FooterProps) {
  return (
    <footer className="border-t border-sky-100 bg-white py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <a
              href="#top"
              aria-label="SOURCE iT"
              className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00AEEF]"
            >
              <SourceItLogo withTagline className="h-12 w-auto" />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              {t(UI_COPY.footer.tagline, lang)}
            </p>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {t(UI_COPY.footer.address, lang)}
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-sm font-bold text-slate-900">
              {t(UI_COPY.footer.navigationTitle, lang)}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="#programs" className="hover:text-sky-600">
                  {t(UI_COPY.nav.programs, lang)}
                </a>
              </li>
              <li>
                <a href="#methodology" className="hover:text-sky-600">
                  {t(UI_COPY.nav.format, lang)}
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-sky-600">
                  {t(UI_COPY.nav.calculator, lang)}
                </a>
              </li>
              <li>
                <a href="#outcomes" className="hover:text-sky-600">
                  {t(UI_COPY.nav.outcomes, lang)}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-sky-600">
                  {t(UI_COPY.nav.faq, lang)}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-sm font-bold text-slate-900">
              {t(UI_COPY.footer.contactsTitle, lang)}
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a
                  href="tel:+380665532222"
                  className="hover:text-sky-600 tabular-nums"
                >
                  +38 (066) 553-22-22
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@sourceit.com.ua"
                  className="hover:text-sky-600"
                >
                  info@sourceit.com.ua
                </a>
              </li>
              <li>
                <a
                  href="https://sourceit.com.ua/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-sky-600"
                >
                  sourceit.com.ua
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-display text-sm font-bold text-slate-900">
              {t(UI_COPY.footer.languageTitle, lang)}
            </h3>
            <div className="mt-3 inline-flex rounded-xl border border-sky-200 bg-sky-50/60 p-1">
              <button
                type="button"
                onClick={() => onChangeLang('uk')}
                aria-pressed={lang === 'uk'}
                className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold cursor-pointer ${
                  lang === 'uk'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 hover:text-sky-700'
                }`}
              >
                UA
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('ru')}
                aria-pressed={lang === 'ru'}
                className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold cursor-pointer ${
                  lang === 'ru'
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-700 hover:text-sky-700'
                }`}
              >
                RU
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-sky-100 pt-6 text-xs text-slate-500">
          {t(UI_COPY.footer.copyright, lang)}
        </div>
      </div>
    </footer>
  );
}
