import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { COURSES, UI_COPY, t } from '../data/translations';
import { AutomationLevel, Language } from '../types/i18n';
import { calculateWeeklySavings } from '../utils/courses';

interface ImpactSimulatorSectionProps {
  lang: Language;
  onSelectRecommendedCourse: (courseId: string) => void;
}

const LEVELS: AutomationLevel[] = ['basic', 'workflows', 'agents'];

export function ImpactSimulatorSection({
  lang,
  onSelectRecommendedCourse,
}: ImpactSimulatorSectionProps) {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [teamSize, setTeamSize] = useState<number>(3);
  const [level, setLevel] = useState<AutomationLevel>('workflows');

  const result = calculateWeeklySavings(hoursPerWeek, teamSize, level);
  const recommendedCourse =
    COURSES.find((c) => c.id === result.recommendedCourseId) ?? COURSES[1];

  return (
    <section
      id="calculator"
      className="bg-atmospheric scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="volumetric-card-white rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7">
              <p className="text-sm font-bold text-[#D96200]">
                {t(UI_COPY.calculatorSection.eyebrow, lang)}
              </p>
              <h2
                className="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                {t(UI_COPY.calculatorSection.title, lang)}
              </h2>
              <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-slate-600">
                {t(UI_COPY.calculatorSection.subtitle, lang)}
              </p>

              <div className="mt-8 space-y-6">
                {/* Hours Slider */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <label
                      htmlFor="sim-hours"
                      className="text-sm font-bold text-slate-800"
                    >
                      {t(UI_COPY.calculatorSection.hoursLabel, lang)}
                    </label>
                    <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#0082C2] tabular-nums">
                      {hoursPerWeek} {t(UI_COPY.calculatorSection.hoursUnit, lang)}
                    </span>
                  </div>
                  <input
                    id="sim-hours"
                    type="range"
                    min={2}
                    max={30}
                    step={1}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="mt-2.5 h-3 w-full cursor-pointer appearance-none rounded-full bg-[#DFF3FD] accent-[#F58220]"
                  />
                </div>

                {/* Team Size Slider */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <label
                      htmlFor="sim-team"
                      className="text-sm font-bold text-slate-800"
                    >
                      {t(UI_COPY.calculatorSection.teamLabel, lang)}
                    </label>
                    <span className="shrink-0 whitespace-nowrap font-mono text-sm font-bold text-[#0082C2] tabular-nums">
                      {teamSize} {t(UI_COPY.calculatorSection.teamUnit, lang)}
                    </span>
                  </div>
                  <input
                    id="sim-team"
                    type="range"
                    min={1}
                    max={25}
                    step={1}
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="mt-2.5 h-3 w-full cursor-pointer appearance-none rounded-full bg-[#DFF3FD] accent-[#00AEEF]"
                  />
                </div>

                {/* Automation Depth Selector */}
                <div>
                  <span className="block text-sm font-bold text-slate-800">
                    {t(UI_COPY.calculatorSection.depthLabel, lang)}
                  </span>
                  <div
                    role="group"
                    aria-label={t(UI_COPY.calculatorSection.depthLabel, lang)}
                    className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3"
                  >
                    {LEVELS.map((lvl) => {
                      const active = level === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevel(lvl)}
                          aria-pressed={active}
                          className={`flex min-h-[60px] flex-col items-start justify-center rounded-2xl border px-3.5 py-2.5 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF] ${
                            active
                              ? 'btn-3d-sky border-[#006DA6] text-white'
                              : 'border-[#CBE8FB] bg-[#F8FCFF] text-slate-900 hover:border-[#00AEEF] hover:bg-white'
                          }`}
                        >
                          <span className="text-sm font-bold whitespace-nowrap">
                            {t(UI_COPY.calculatorSection.levels[lvl].label, lang)}
                          </span>
                          <span
                            className={`mt-0.5 text-xs leading-snug ${
                              active ? 'text-sky-50' : 'text-slate-500'
                            }`}
                          >
                            {t(UI_COPY.calculatorSection.levels[lvl].desc, lang)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sky-Blue Volumetric Results Box */}
            <div className="lg:col-span-5">
              <div className="volumetric-card-sky rounded-3xl p-6 text-white sm:p-7">
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="rounded-2xl border border-white/25 bg-white/12 p-4">
                    <div className="text-xs font-semibold text-sky-100">
                      {t(UI_COPY.calculatorSection.resultMonthLabel, lang)}
                    </div>
                    <div className="font-display mt-1 text-3xl font-extrabold tabular-nums sm:text-4xl">
                      {result.savedHoursPerMonth}{' '}
                      <span className="text-base font-bold text-sky-100">
                        {t(UI_COPY.calculatorSection.hoursShort, lang)}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/25 bg-white/12 p-4">
                    <div className="text-xs font-semibold text-sky-100">
                      {t(UI_COPY.calculatorSection.resultYearLabel, lang)}
                    </div>
                    <div className="font-display mt-1 text-3xl font-extrabold tabular-nums sm:text-4xl">
                      {result.savedWorkdaysPerYear}{' '}
                      <span className="text-base font-bold text-sky-100">
                        {t(UI_COPY.calculatorSection.daysShort, lang)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 flex items-baseline justify-between gap-3 rounded-2xl border border-white/25 bg-white/12 px-4 py-3.5">
                  <span className="text-xs font-semibold text-sky-100">
                    {t(UI_COPY.calculatorSection.resultPaybackLabel, lang)}
                  </span>
                  <span className="font-display text-xl font-extrabold tabular-nums text-white">
                    ~{result.paybackWeeks} {t(UI_COPY.calculatorSection.weeksShort, lang)}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold text-sky-100">
                    {t(UI_COPY.calculatorSection.recommendedPrefix, lang)}
                  </p>
                  <p className="font-display mt-1 text-lg font-extrabold text-white">
                    {t(recommendedCourse.title, lang)}
                  </p>

                  <button
                    type="button"
                    onClick={() => onSelectRecommendedCourse(recommendedCourse.id)}
                    className="btn-3d-orange mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <span>{t(UI_COPY.calculatorSection.applyRecommendationCta, lang)}</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
