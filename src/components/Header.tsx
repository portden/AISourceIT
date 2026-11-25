import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { UI_COPY, t } from '../data/translations';
import { Language } from '../types/i18n';
import { SourceItLogo } from './SourceItLogo';

interface HeaderProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onEnrollClick: () => void;
}

export function Header({ lang, onChangeLang, onEnrollClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '#programs', label: t(UI_COPY.nav.programs, lang) },
    { href: '#methodology', label: t(UI_COPY.nav.format, lang) },
    { href: '#calculator', label: t(UI_COPY.nav.calculator, lang) },
    { href: '#outcomes', label: t(UI_COPY.nav.outcomes, lang) },
    { href: '#faq', label: t(UI_COPY.nav.faq, lang) },
  ];

  const handleMobileNav = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Official SOURCE iT logo mark */}
        <a
          href="#top"
          aria-label="SOURCE iT"
          className="inline-flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00AEEF]"
        >
          <SourceItLogo className="h-8 w-auto sm:h-9" />
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#00AEEF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00AEEF]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action on desktop + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onEnrollClick}
            className="btn-3d-orange hidden md:inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-bold text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F58220]"
          >
            {t(UI_COPY.nav.enrollCta, lang)}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen ? t(UI_COPY.nav.closeMenu, lang) : t(UI_COPY.nav.openMenu, lang)
            }
            className="btn-3d-white inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-900 md:hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <div className="border-t border-sky-100 bg-white px-4 pb-5 pt-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleMobileNav}
                className="flex min-h-[44px] items-center rounded-xl px-3 text-base font-semibold text-slate-800 hover:bg-sky-50 hover:text-[#0082C2]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-sky-100 pt-4">
            <div
              role="group"
              aria-label={t(UI_COPY.langSwitcher.label, lang)}
              className="inline-flex rounded-xl bg-sky-50 p-1 border border-sky-200/70"
            >
              <button
                type="button"
                onClick={() => onChangeLang('uk')}
                aria-pressed={lang === 'uk'}
                className={`min-h-[40px] rounded-lg px-3.5 text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'uk'
                    ? 'bg-[#00AEEF] text-white'
                    : 'text-slate-700 hover:text-[#0082C2]'
                }`}
              >
                UA
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('ru')}
                aria-pressed={lang === 'ru'}
                className={`min-h-[40px] rounded-lg px-3.5 text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'ru'
                    ? 'bg-[#00AEEF] text-white'
                    : 'text-slate-700 hover:text-[#0082C2]'
                }`}
              >
                RU
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onEnrollClick();
              }}
              className="btn-3d-orange inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white whitespace-nowrap cursor-pointer"
            >
              {t(UI_COPY.nav.enrollCta, lang)}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
