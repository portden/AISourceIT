import test from 'node:test';
import assert from 'node:assert/strict';
import { COURSES } from '../data/translations';
import {
  calculateWeeklySavings,
  filterCourses,
  formatPriceUah,
  validateEnrollmentForm,
} from './courses';

test('filterCourses returns all courses for "all" and filters by category', () => {
  const all = filterCourses(COURSES, 'all');
  assert.equal(all.length, COURSES.length);

  const dev = filterCourses(COURSES, 'developers');
  assert.equal(dev.length, 1);
  assert.equal(dev[0].id, 'ai-engineering');

  const business = filterCourses(COURSES, 'business');
  assert.equal(business.length, 2);
  assert.ok(business.every((c) => c.category === 'business'));
});

test('calculateWeeklySavings computes monthly hours, annual workdays, and recommended course', () => {
  const basic = calculateWeeklySavings(10, 1, 'basic');
  assert.equal(basic.savedHoursPerWeek, 4);
  assert.equal(basic.savedHoursPerMonth, 17);
  assert.equal(basic.recommendedCourseId, 'prompt-creative');
  assert.ok(basic.paybackWeeks >= 1);

  const workflows = calculateWeeklySavings(10, 4, 'workflows');
  assert.equal(workflows.savedHoursPerWeek, 22);
  assert.equal(workflows.recommendedCourseId, 'ai-automation');

  const agents = calculateWeeklySavings(12, 2, 'agents');
  assert.equal(agents.savedHoursPerWeek, 18);
  assert.equal(agents.recommendedCourseId, 'ai-engineering');
});

test('formatPriceUah formats thousands with spaces cleanly', () => {
  assert.equal(formatPriceUah(14900), '14 900');
  assert.equal(formatPriceUah(950), '950');
});

test('validateEnrollmentForm enforces required fields with localized errors in uk and ru', () => {
  const emptyUk = validateEnrollmentForm(
    { name: '', contact: '12', courseId: '', format: 'group', comment: '' },
    'uk'
  );
  assert.equal(emptyUk.valid, false);
  assert.ok(emptyUk.errors.name?.includes('2 символи'));
  assert.ok(emptyUk.errors.contact?.includes('коректний'));
  assert.ok(emptyUk.errors.courseId);

  const emptyRu = validateEnrollmentForm(
    { name: 'А', contact: 'bad', courseId: 'ai-automation', format: 'group', comment: '' },
    'ru'
  );
  assert.equal(emptyRu.valid, false);
  assert.ok(emptyRu.errors.name?.includes('минимум 2 символа'));
  assert.ok(emptyRu.errors.contact?.includes('корректный'));
  assert.equal(emptyRu.errors.courseId, undefined);

  const validTelegram = validateEnrollmentForm(
    {
      name: 'Олена',
      contact: '@olena_tech',
      courseId: 'ai-automation',
      format: 'group',
      comment: '',
    },
    'uk'
  );
  assert.equal(validTelegram.valid, true);

  const validPhone = validateEnrollmentForm(
    {
      name: 'Іван',
      contact: '+380665532222',
      courseId: 'prompt-creative',
      format: 'corporate',
      comment: 'Команда 6 людей',
    },
    'uk'
  );
  assert.equal(validPhone.valid, true);

  const validEmail = validateEnrollmentForm(
    {
      name: 'Мария',
      contact: 'maria@company.ua',
      courseId: 'ai-leadership',
      format: 'corporate',
      comment: '',
    },
    'ru'
  );
  assert.equal(validEmail.valid, true);
});
