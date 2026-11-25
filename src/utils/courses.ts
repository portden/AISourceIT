import {
  AutomationLevel,
  Course,
  CourseCategory,
  EnrollmentFormData,
  Language,
} from '../types/i18n';
import { UI_COPY } from '../data/translations';

export function filterCourses(
  courses: Course[],
  category: CourseCategory
): Course[] {
  if (category === 'all') {
    return courses;
  }
  return courses.filter((course) => course.category === category);
}

const AUTOMATION_EFFICIENCY: Record<AutomationLevel, number> = {
  basic: 0.35,
  workflows: 0.55,
  agents: 0.75,
};

export interface SavingsCalculation {
  savedHoursPerWeek: number;
  savedHoursPerMonth: number;
  savedWorkdaysPerYear: number;
  paybackWeeks: number;
  recommendedCourseId: string;
}

export function calculateWeeklySavings(
  hoursPerWeek: number,
  teamSize: number,
  level: AutomationLevel
): SavingsCalculation {
  const clampedHours = Math.max(1, Math.min(60, hoursPerWeek));
  const clampedTeam = Math.max(1, Math.min(100, teamSize));
  const efficiency = AUTOMATION_EFFICIENCY[level];

  const savedHoursPerWeek = Math.round(clampedHours * clampedTeam * efficiency);
  const savedHoursPerMonth = Math.round(savedHoursPerWeek * 4.3);
  const savedWorkdaysPerYear = Math.round((savedHoursPerWeek * 50) / 8);

  // Typical blended specialist hourly value in Ukraine/EU (~450 UAH/h) vs avg course investment (14900 UAH)
  const hourlyValueUah = 450;
  const courseInvestmentUah =
    level === 'basic' ? 11800 : level === 'workflows' ? 14900 : 18500;
  const weeklyValueUah = Math.max(1, savedHoursPerWeek * hourlyValueUah);
  const paybackWeeks = Math.max(
    1,
    Math.ceil(courseInvestmentUah / weeklyValueUah)
  );

  const recommendedCourseId =
    level === 'basic'
      ? 'prompt-creative'
      : level === 'workflows'
      ? 'ai-automation'
      : 'ai-engineering';

  return {
    savedHoursPerWeek,
    savedHoursPerMonth,
    savedWorkdaysPerYear,
    paybackWeeks,
    recommendedCourseId,
  };
}

export function formatPriceUah(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function isValidContact(raw: string): boolean {
  const value = raw.trim();
  if (value.length < 4) return false;

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isTelegram = /^@[a-zA-Z0-9_]{4,32}$/.test(value);
  const digits = value.replace(/[^\d]/g, '');
  const isPhone = digits.length >= 9 && digits.length <= 15 && /^[+\d\s()-]+$/.test(value);

  return isEmail || isTelegram || isPhone;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof EnrollmentFormData, string>>;
}

export function validateEnrollmentForm(
  data: EnrollmentFormData,
  lang: Language
): ValidationResult {
  const errors: Partial<Record<keyof EnrollmentFormData, string>> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = UI_COPY.enrollmentSection.validation.nameRequired[lang];
  }

  if (!data.contact || !isValidContact(data.contact)) {
    errors.contact = UI_COPY.enrollmentSection.validation.contactRequired[lang];
  }

  if (!data.courseId || data.courseId.trim().length === 0) {
    errors.courseId = UI_COPY.enrollmentSection.validation.courseRequired[lang];
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
