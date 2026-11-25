import { ArrowUpRight, BookOpen, Cpu } from 'lucide-react';
import { useState } from 'react';
import { COURSES, UI_COPY, t } from '../data/translations';
import { Course, CourseCategory, Language } from '../types/i18n';
import { filterCourses, formatPriceUah } from '../utils/courses';

interface CoursesSectionProps {
  lang: Language;
  onSelectCourseForSyllabus: (course: Course) => void;
  onEnrollInCourse: (courseId: string) => void;
}

const CATEGORIES: CourseCategory[] = ['all', 'specialists', 'developers', 'business'];

export function CoursesSection({
  lang,
  onSelectCourseForSyllabus,
  onEnrollInCourse,
}: CoursesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const visibleCourses = filterCourses(COURSES, activeCategory);

  return (
    <section
      id="programs"
      className="bg-atmospheric scroll-mt-20 py-18 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header + Pill Filter Bar */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold text-[#D96200]">
              {t(UI_COPY.coursesSection.eyebrow, lang)}
            </p>
            <h2
              className="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {t(UI_COPY.coursesSection.title, lang)}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              {t(UI_COPY.coursesSection.subtitle, lang)}
            </p>
          </div>

          <div
            role="group"
            aria-label={t(UI_COPY.coursesSection.eyebrow, lang)}
            className="inline-flex flex-wrap sm:flex-nowrap shrink-0 gap-1.5 rounded-2xl border border-sky-200/80 bg-white/95 p-1.5 shadow-sm"
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={active}
                  className={`min-h-[40px] rounded-xl px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF] ${
                    active
                      ? 'btn-3d-sky text-white'
                      : 'text-slate-700 hover:bg-sky-50 hover:text-[#0082C2]'
                  }`}
                >
                  {t(UI_COPY.coursesSection.filters[category], lang)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2x2 Volumetric Course Cards Grid */}
        {visibleCourses.length === 0 ? (
          <div className="volumetric-card-white mt-10 rounded-3xl p-10 text-center text-slate-600">
            {t(UI_COPY.coursesSection.emptyState, lang)}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {visibleCourses.map((course) => {
              const isOrange = course.accentColor === 'orange';
              const hasBrokenImg = brokenImages[course.id];

              return (
                <article
                  key={course.id}
                  className="volumetric-card-white relative flex flex-col overflow-hidden rounded-3xl"
                >
                  {/* Top Corporate Color Cap */}
                  <div
                    className={`h-1.5 w-full ${
                      isOrange ? 'bg-[#F58220]' : 'bg-[#00AEEF]'
                    }`}
                  />

                  {/* Inset Rounded 3D Render Visual */}
                  <div className="p-5 pb-0 sm:p-6 sm:pb-0">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-sky-100 bg-sky-50/40">
                      {!hasBrokenImg ? (
                        <img
                          src={course.imageSrc}
                          alt={t(course.imageAlt, lang)}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenImages((prev) => ({
                              ...prev,
                              [course.id]: true,
                            }))
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-sky-50 to-orange-50 p-6 text-center">
                          <Cpu className="h-9 w-9 text-[#00AEEF]" />
                          <span className="font-display text-base font-bold text-slate-800">
                            {t(course.title, lang)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-slate-500">
                        <span
                          className={
                            isOrange ? 'text-[#D96200]' : 'text-[#0082C2]'
                          }
                        >
                          {t(course.duration, lang)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{t(course.lessonsCount, lang)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{t(course.level, lang)}</span>
                      </div>

                      <h3 className="font-display mt-2.5 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
                        {t(course.title, lang)}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {t(course.subtitle, lang)}
                      </p>

                      <div className="mt-5 space-y-2 border-t border-sky-100 pt-4 text-sm">
                        <p className="text-slate-700">
                          <span className="font-bold text-slate-950">
                            {t(UI_COPY.coursesSection.toolsPrefix, lang)}{' '}
                          </span>
                          {course.tools.join(', ')}
                        </p>
                        <p className="text-slate-600">{t(course.outcome, lang)}</p>
                      </div>
                    </div>

                    <div className="mt-6 border-t border-sky-100 pt-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
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

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => onSelectCourseForSyllabus(course)}
                          className="btn-3d-white inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-900 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF]"
                        >
                          <BookOpen
                            className="h-4 w-4 text-[#0088C7] shrink-0"
                            aria-hidden="true"
                          />
                          <span>{t(UI_COPY.coursesSection.syllabusBtn, lang)}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEnrollInCourse(course.id)}
                          className={`${
                            isOrange ? 'btn-3d-orange' : 'btn-3d-sky'
                          } inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold text-white whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF]`}
                        >
                          <span>{t(UI_COPY.coursesSection.enrollBtn, lang)}</span>
                          <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
