export type Language = 'uk' | 'ru';

export type CourseCategory = 'all' | 'specialists' | 'developers' | 'business';

export type AutomationLevel = 'basic' | 'workflows' | 'agents';

export type StudyFormat = 'group' | 'corporate';

export interface LocalizedText {
  uk: string;
  ru: string;
}

export interface CourseModule {
  id: string;
  title: LocalizedText;
  topics: {
    uk: string[];
    ru: string[];
  };
}

export interface Course {
  id: string;
  category: Exclude<CourseCategory, 'all'>;
  title: LocalizedText;
  subtitle: LocalizedText;
  duration: LocalizedText;
  lessonsCount: LocalizedText;
  level: LocalizedText;
  nextCohort: LocalizedText;
  priceUah: number;
  accentColor: 'sky' | 'orange';
  imageSrc: string;
  imageAlt: LocalizedText;
  tools: string[];
  outcome: LocalizedText;
  modules: CourseModule[];
}

export interface BenefitItem {
  number: string;
  title: LocalizedText;
  description: LocalizedText;
  metric: LocalizedText;
  spanWide?: boolean;
}

export interface TestimonialItem {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  courseTag: LocalizedText;
  beforeText: LocalizedText;
  outcomeText: LocalizedText;
  metricBadge: LocalizedText;
}

export interface FaqItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

export interface EnrollmentFormData {
  name: string;
  contact: string;
  courseId: string;
  format: StudyFormat;
  comment: string;
}
