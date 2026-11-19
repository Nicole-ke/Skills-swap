import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/utils';

const SKILLS = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'UI/UX Design',
  'Mobile Development',
  'DevOps',
  'Data Science',
  'Machine Learning',
  'Other',
];

const initialForm = { name: '', email: '', location: '', phone: '', skill: '' };
const initialErrors = { name: '', email: '', location: '', phone: '', skill: '' };

export default function UserForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = { ...initialErrors };
    let valid = true;

    if (!form.name.trim()) {
      next.name = 'Name is required';
      valid = false;
    }

    if (!form.email.trim()) {
      next.email = 'Email is required';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address';
      valid = false;
    }

    if (!form.location.trim()) {
      next.location = 'Location is required';
      valid = false;
    }

    if (!form.phone.trim()) {
      next.phone = 'Phone number is required';
      valid = false;
    } else if (!/^[+]?[\d\s\-()]{7,15}$/.test(form.phone)) {
      next.phone = 'Enter a valid phone number';
      valid = false;
    }

    if (!form.skill) {
      next.skill = 'Please select a skill';
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const usersResponse = await fetch(`${BASE_URL}/users`);
      if (!usersResponse.ok) {
        throw new Error('Could not check existing accounts. Please try again.');
      }

      const users = await usersResponse.json();
      if (!Array.isArray(users)) {
        throw new Error('The database returned an unexpected response.');
      }

      const email = form.email.trim().toLowerCase();
      const emailExists = users.some(
        (user) => user.email?.trim().toLowerCase() === email
      );

      if (emailExists) {
        console.warn('Sign-up failed: a profile already exists for that email.');
        return;
      }

      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email,
          location: form.location.trim(),
          bio: '',
          offers: [form.skill],
          wants: [],
          phone: form.phone.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Could not save your profile. Please try again.');
      }

      console.info('Profile saved successfully.');
      setForm(initialForm);
    } catch (error) {
      console.error(
        error instanceof TypeError
          ? `Could not connect to the database at ${BASE_URL}. Start it with npm run server and try again.`
          : error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors(initialErrors);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-gray-50 to-indigo-50 px-4 py-10 sm:py-16">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-purple-900/5">
        <div className="border-b border-gray-100 px-6 py-7 sm:px-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl font-bold text-purple-700">
            S
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
            Join SkillSwap
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Create your profile
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Tell the community a little about yourself and the skill you want to share.
          </p>
        </div>

        <div className="px-6 py-7 sm:px-10 sm:py-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={`w-full rounded-lg border px-3.5 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-purple-100 ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-purple-500'
                  }`}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  autoComplete="address-level2"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Nairobi"
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? 'location-error' : undefined}
                  className={`w-full rounded-lg border px-3.5 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-purple-100 ${
                    errors.location
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-purple-500'
                  }`}
                />
                {errors.location && (
                  <p id="location-error" className="mt-1 text-sm text-red-600">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 555 123 4567"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                  className={`w-full rounded-lg border px-3.5 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-purple-100 ${
                    errors.phone
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-purple-500'
                  }`}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full rounded-lg border px-3.5 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-4 focus:ring-purple-100 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-purple-500'
                  }`}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="skill"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Skill / Specialization
              </label>
              <select
                id="skill"
                name="skill"
                value={form.skill}
                onChange={handleChange}
                aria-invalid={!!errors.skill}
                aria-describedby={errors.skill ? 'skill-error' : undefined}
                className={`w-full rounded-lg border bg-white px-3.5 py-3 text-gray-900 outline-none transition focus:ring-4 focus:ring-purple-100 ${
                  errors.skill
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-purple-500'
                }`}
              >
                <option value="">-- Select a skill --</option>
                {SKILLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.skill && (
                <p id="skill-error" className="mt-1 text-sm text-red-600">
                  {errors.skill}
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-purple-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:flex-1"
              >
                {isSubmitting ? 'Saving profile...' : 'Create profile'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have a profile?{' '}
            <Link to="/login" className="font-semibold text-purple-700 hover:text-purple-800">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}