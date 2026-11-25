import { useEffect, useState } from 'react';
import { CoursesSection } from './components/CoursesSection';
import { EnrollmentSection } from './components/EnrollmentSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ImpactSimulatorSection } from './components/ImpactSimulatorSection';
import { OutcomesSection } from './components/OutcomesSection';
import { SyllabusModal } from './components/SyllabusModal';
import { VolumetricBenefitsSection } from './components/VolumetricBenefitsSection';
import { COURSES, UI_COPY, t } from './data/translations';
import { Course, Language } from './types/i18n';

export default function App() {
  const [lang, setLang] = useState<Language>('uk');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0].id);
  const [syllabusCourse, setSyllabusCourse] = useState<Course | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t(UI_COPY.metaTitle, lang);
  }, [lang]);

  const scrollToEnroll = (courseId?: string) => {
    if (courseId) {
      setSelectedCourseId(courseId);
    }
    const target = document.getElementById('enroll');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header
        lang={lang}
        onChangeLang={setLang}
        onEnrollClick={() => scrollToEnroll()}
      />

      <main>
        <HeroSection
          lang={lang}
          onChangeLang={setLang}
          onPickProgramClick={() => scrollToEnroll()}
        />

        <CoursesSection
          lang={lang}
          onSelectCourseForSyllabus={(course) => setSyllabusCourse(course)}
          onEnrollInCourse={(courseId) => scrollToEnroll(courseId)}
        />

        <VolumetricBenefitsSection lang={lang} />

        <ImpactSimulatorSection
          lang={lang}
          onSelectRecommendedCourse={(courseId) => scrollToEnroll(courseId)}
        />

        <OutcomesSection lang={lang} />

        <FaqSection lang={lang} />

        <EnrollmentSection
          lang={lang}
          selectedCourseId={selectedCourseId}
          onChangeCourseId={setSelectedCourseId}
        />
      </main>

      <Footer lang={lang} onChangeLang={setLang} />

      <SyllabusModal
        course={syllabusCourse}
        lang={lang}
        onClose={() => setSyllabusCourse(null)}
        onEnroll={(courseId) => scrollToEnroll(courseId)}
      />
    </div>
  );
}
