import { ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { useEffect } from 'react';
import { UI_COPY, t } from '../data/translations';
import { Course, Language } from '../types/i18n';
import { formatPriceUah } from '../utils/courses';

interface SyllabusModalProps {
  course: Course | null;
  lang: Language;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
}

export function SyllabusModal({
  course,
  lang,
  onClose,
  onEnroll,
}: SyllabusModalProps) {
  useEffect(() => {
    if (!course) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [course, onClose]);

  if (!course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-modal-title"
      onClick={onClose}
    >
      <div
        className="volumetric-card-white relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-[#0082C2]">
              <span>{t(course.duration, lang)}</span>
              <span aria-hidden="true">·</span>
              <span>{t(course.lessonsCount, lang)}</span>
              <span aria-hidden="true">·</span>
              <span>{t(course.level, lang)}</span>
            </div>
            <h3
              id="syllabus-modal-title"
              className="font-display mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl"
            >
              {t(course.title, lang)}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t(UI_COPY.modal.closeLabel, lang)}
            className="btn-3d-white inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-800 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {t(course.subtitle, lang)}
        </p>

        <div className="mt-6">
          <h4 className="font-display text-sm font-bold text-slate-950">
            {t(UI_COPY.modal.modulesHeading, lang)}
          </h4>
          <div className="mt-3 space-y-3.5">
            {course.modules.map((mod, idx) => (
              <div
                key={mod.id}
                className="rounded-2xl border border-[#CBE8FB] bg-[#F8FCFF] p-4"
              >
                <div className="font-display text-base font-extrabold text-slate-950">
                  <span className="mr-2 text-[#D96200] tabular-nums">
                    {t(UI_COPY.modal.modulePrefix, lang)} 0{idx + 1}.
                  </span>
                  {t(mod.title, lang)}
                </div>
                <ul className="mt-2.5 space-y-1.5 text-sm text-slate-600">
                  {mod.topics[lang].map((topic, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#00AEEF]"
                        aria-hidden="true"
                      />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50/70 p-4 text-sm text-slate-800">
          <span className="font-bold text-[#C95702]">
            {t(UI_COPY.modal.outcomeHeading, lang)}{' '}
          </span>
          {t(course.outcome, lang)}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-sky-100 pt-5">
          <div>
            <div className="text-xs font-semibold text-slate-500">
              {t(UI_COPY.coursesSection.nextStartLabel, lang)}{' '}
              <span className="font-bold text-slate-900">
                {t(course.nextCohort, lang)}
              </span>
            </div>
            <div className="font-display text-2xl font-extrabold text-slate-950 tabular-nums">
              {formatPriceUah(course.priceUah)}{' '}
              <span className="text-sm font-semibold text-slate-500">
                {t(UI_COPY.coursesSection.currency, lang)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onEnroll(course.id);
            }}
            className="btn-3d-orange inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white whitespace-nowrap cursor-pointer"
          >
            <span>{t(UI_COPY.modal.chooseCourseBtn, lang)}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
