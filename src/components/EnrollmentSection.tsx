import { Check, Send } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { COURSES, UI_COPY, t } from '../data/translations';
import { EnrollmentFormData, Language, StudyFormat } from '../types/i18n';
import { validateEnrollmentForm } from '../utils/courses';

interface EnrollmentSectionProps {
  lang: Language;
  selectedCourseId: string;
  onChangeCourseId: (courseId: string) => void;
}

const FORMATS: StudyFormat[] = ['group', 'corporate'];

export function EnrollmentSection({
  lang,
  selectedCourseId,
  onChangeCourseId,
}: EnrollmentSectionProps) {
  const [form, setForm] = useState<EnrollmentFormData>({
    name: '',
    contact: '',
    courseId: selectedCourseId,
    format: 'group',
    comment: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof EnrollmentFormData, string>>
  >({});
  const [submittedData, setSubmittedData] = useState<EnrollmentFormData | null>(
    null
  );

  useEffect(() => {
    setForm((prev) => ({ ...prev, courseId: selectedCourseId }));
  }, [selectedCourseId]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateEnrollmentForm(form, lang);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setSubmittedData({ ...form });
  };

  const handleReset = () => {
    setSubmittedData(null);
    setForm((prev) => ({
      ...prev,
      name: '',
      contact: '',
      comment: '',
    }));
    setErrors({});
  };

  const selectedCourseObj =
    COURSES.find((c) => c.id === (submittedData?.courseId ?? form.courseId)) ??
    COURSES[0];

  return (
    <section
      id="enroll"
      className="bg-atmospheric scroll-mt-20 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="volumetric-card-sky rounded-3xl p-6 text-white sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Left Benefits Copy */}
            <div className="lg:col-span-5">
              <p className="text-sm font-bold text-sky-100">
                {t(UI_COPY.enrollmentSection.eyebrow, lang)}
              </p>
              <h2
                className="font-display mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                {t(UI_COPY.enrollmentSection.title, lang)}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-sky-50">
                {t(UI_COPY.enrollmentSection.subtitle, lang)}
              </p>

              <ul className="mt-8 space-y-4 text-sm font-semibold text-white">
                {UI_COPY.enrollmentSection.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F58220] text-white shadow-xs">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="leading-relaxed">{t(item, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Pure White Rounded Form Card */}
            <div className="rounded-3xl bg-white p-6 text-slate-950 shadow-xl sm:p-8 lg:col-span-7">
              {submittedData ? (
                <div
                  role="status"
                  className="py-4 text-left"
                  data-testid="enrollment-success"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-[#0082C2]">
                    <Check className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display mt-4 text-2xl font-extrabold text-slate-950">
                    {t(UI_COPY.enrollmentSection.form.successTitle, lang)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {t(UI_COPY.enrollmentSection.form.successText, lang)}
                  </p>

                  <dl className="mt-6 space-y-2.5 rounded-2xl border border-sky-100 bg-sky-50/60 p-5 text-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="font-medium text-slate-500">
                        {t(UI_COPY.enrollmentSection.form.summaryName, lang)}
                      </dt>
                      <dd className="font-bold text-slate-900">
                        {submittedData.name} ({submittedData.contact})
                      </dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="font-medium text-slate-500">
                        {t(UI_COPY.enrollmentSection.form.summaryCourse, lang)}
                      </dt>
                      <dd className="font-bold text-[#0082C2]">
                        {t(selectedCourseObj.title, lang)}
                      </dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="font-medium text-slate-500">
                        {t(UI_COPY.enrollmentSection.form.summaryFormat, lang)}
                      </dt>
                      <dd className="font-bold text-slate-900">
                        {t(
                          UI_COPY.enrollmentSection.form.formats[
                            submittedData.format
                          ],
                          lang
                        )}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-3d-white mt-6 inline-flex min-h-[44px] items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-bold text-slate-900 cursor-pointer"
                  >
                    {t(UI_COPY.enrollmentSection.form.anotherRequestBtn, lang)}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="enroll-name"
                        className="block text-sm font-bold text-slate-900"
                      >
                        {t(UI_COPY.enrollmentSection.form.nameLabel, lang)}
                      </label>
                      <input
                        id="enroll-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm((prev) => ({ ...prev, name: e.target.value }));
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        placeholder={t(
                          UI_COPY.enrollmentSection.form.namePlaceholder,
                          lang
                        )}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? 'enroll-name-error' : undefined
                        }
                        className={`mt-1.5 w-full min-h-[48px] rounded-2xl border bg-[#F8FCFF] px-4 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-offset-0 focus:outline-[#00AEEF] ${
                          errors.name ? 'border-[#F58220]' : 'border-[#CBE8FB]'
                        }`}
                      />
                      {errors.name && (
                        <p
                          id="enroll-name-error"
                          className="mt-1.5 text-xs font-bold text-[#C95702]"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="enroll-contact"
                        className="block text-sm font-bold text-slate-900"
                      >
                        {t(UI_COPY.enrollmentSection.form.contactLabel, lang)}
                      </label>
                      <input
                        id="enroll-contact"
                        name="contact"
                        type="text"
                        value={form.contact}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            contact: e.target.value,
                          }));
                          if (errors.contact) {
                            setErrors((prev) => ({
                              ...prev,
                              contact: undefined,
                            }));
                          }
                        }}
                        placeholder={t(
                          UI_COPY.enrollmentSection.form.contactPlaceholder,
                          lang
                        )}
                        aria-invalid={Boolean(errors.contact)}
                        aria-describedby={
                          errors.contact ? 'enroll-contact-error' : undefined
                        }
                        className={`mt-1.5 w-full min-h-[48px] rounded-2xl border bg-[#F8FCFF] px-4 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-offset-0 focus:outline-[#00AEEF] ${
                          errors.contact ? 'border-[#F58220]' : 'border-[#CBE8FB]'
                        }`}
                      />
                      {errors.contact && (
                        <p
                          id="enroll-contact-error"
                          className="mt-1.5 text-xs font-bold text-[#C95702]"
                        >
                          {errors.contact}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enroll-course"
                      className="block text-sm font-bold text-slate-900"
                    >
                      {t(UI_COPY.enrollmentSection.form.courseLabel, lang)}
                    </label>
                    <select
                      id="enroll-course"
                      name="courseId"
                      value={form.courseId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setForm((prev) => ({ ...prev, courseId: nextId }));
                        onChangeCourseId(nextId);
                      }}
                      className="mt-1.5 w-full min-h-[48px] rounded-2xl border border-[#CBE8FB] bg-[#F8FCFF] px-4 py-2.5 text-sm font-semibold text-slate-950 focus:bg-white focus:outline-2 focus:outline-offset-0 focus:outline-[#00AEEF]"
                    >
                      {COURSES.map((course) => (
                        <option key={course.id} value={course.id}>
                          {t(course.title, lang)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-sm font-bold text-slate-900">
                      {t(UI_COPY.enrollmentSection.form.formatLabel, lang)}
                    </span>
                    <div
                      role="group"
                      aria-label={t(
                        UI_COPY.enrollmentSection.form.formatLabel,
                        lang
                      )}
                      className="mt-1.5 flex flex-wrap gap-2.5"
                    >
                      {FORMATS.map((fmt) => {
                        const active = form.format === fmt;
                        return (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({ ...prev, format: fmt }))
                            }
                            aria-pressed={active}
                            className={`min-h-[44px] grow basis-[165px] rounded-2xl border px-3.5 py-2 text-center text-xs font-bold leading-tight cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AEEF] sm:text-sm ${
                              active
                                ? 'btn-3d-sky border-[#006DA6] text-white'
                                : 'border-[#CBE8FB] bg-[#F8FCFF] text-slate-800 hover:bg-white'
                            }`}
                          >
                            {t(UI_COPY.enrollmentSection.form.formats[fmt], lang)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="enroll-comment"
                      className="block text-sm font-bold text-slate-900"
                    >
                      {t(UI_COPY.enrollmentSection.form.commentLabel, lang)}
                    </label>
                    <textarea
                      id="enroll-comment"
                      name="comment"
                      rows={2}
                      value={form.comment}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, comment: e.target.value }))
                      }
                      placeholder={t(
                        UI_COPY.enrollmentSection.form.commentPlaceholder,
                        lang
                      )}
                      className="mt-1.5 w-full rounded-2xl border border-[#CBE8FB] bg-[#F8FCFF] px-4 py-2.5 text-sm text-slate-950 placeholder:text-slate-400 focus:bg-white focus:outline-2 focus:outline-offset-0 focus:outline-[#00AEEF]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-3d-orange inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold text-white whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F58220]"
                  >
                    <span>{t(UI_COPY.enrollmentSection.form.submitBtn, lang)}</span>
                    <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
