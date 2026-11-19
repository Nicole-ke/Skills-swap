import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import { API_URL } from '../hooks/useUsers';
import { getCurrentUser, setCurrentUser, logout } from '../utils/auth';

const SKILLS = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'UI/UX Design',
  'Mobile Development',
  'DevOps',
  'Data Science',
  'Machine Learning',
];

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  location: '',
  photo: '',
  bio: '',
  offers: '',
  wants: '',
  timeToLearn: '',
};

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100';

function toList(text) {
  return text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

// WhatsApp links need the number in international format, e.g. 0712... -> 254712...
function toWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `254${digits.slice(1)}` : digits;
}

function userToForm(user) {
  return {
    ...initialForm,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
    photo: user.photo || '',
    bio: user.bio || '',
    offers: (user.offers || []).join(', '),
    wants: (user.wants || []).join(', '),
    timeToLearn: user.timeToLearn || '',
  };
}

function Field({ label, name, error, hint, children }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default function SkillForm() {
  const navigate = useNavigate();
  const [currentUser, setUser] = useState(getCurrentUser);
  const isEditing = Boolean(currentUser);

  const [form, setForm] = useState(() =>
    currentUser ? userToForm(currentUser) : initialForm
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [cardKey, setCardKey] = useState(0);

  // Load the latest copy of the profile in case it changed elsewhere.
  useEffect(() => {
    if (!currentUser) return;
    fetch(`${API_URL}/users/${currentUser.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user) setForm(userToForm(user));
      })
      .catch(() => {});
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const addSkill = (skill) => {
    const current = toList(form.offers);
    if (current.includes(skill)) return;
    setForm((prev) => ({ ...prev, offers: [...current, skill].join(', ') }));
    setErrors((prev) => ({ ...prev, offers: '' }));
  };

  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = 'Name is required';

    if (!form.email.trim()) {
      next.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Enter a valid email address';
    }

    if (!isEditing && form.password.length < 4) {
      next.password = 'Password must be at least 4 characters';
    }

    if (!form.phone.trim()) {
      next.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s\-()]{7,15}$/.test(form.phone)) {
      next.phone = 'Enter a valid phone number';
    }

    if (toList(form.offers).length === 0) {
      next.offers = 'Add at least one skill you can teach';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setMessage('');

    const email = form.email.trim().toLowerCase();
    const profile = {
      name: form.name.trim(),
      email,
      phone: toWhatsAppNumber(form.phone),
      location: form.location.trim() || 'Nairobi',
      photo: form.photo.trim() || `https://i.pravatar.cc/400?u=${encodeURIComponent(email)}`,
      bio: form.bio.trim(),
      offers: toList(form.offers),
      wants: toList(form.wants),
      timeToLearn: form.timeToLearn.trim() || 'To be agreed',
    };

    try {
      let saved;

      if (isEditing) {
        const res = await fetch(`${API_URL}/users/${currentUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });
        if (!res.ok) throw new Error('Update failed');
        saved = await res.json();
      } else {
        const users = await fetch(`${API_URL}/users`).then((res) => res.json());
        if (users.some((u) => (u.email || '').toLowerCase() === email)) {
          setErrors({ email: 'An account with this email already exists. Log in instead.' });
          return;
        }

        const res = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...profile, password: form.password }),
        });
        if (!res.ok) throw new Error('Sign up failed');
        saved = await res.json();
      }

      const { password: _password, ...userWithoutPassword } = saved;
      setCurrentUser(userWithoutPassword);
      setUser(userWithoutPassword);
      setCardKey((key) => key + 1);
      setMessage(isEditing ? 'Profile updated.' : 'Welcome to SkillSwap! Your card is live.');
    } catch {
      setMessage("Couldn't save your profile. Is json-server running?");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Live preview of the card as the user types.
  const previewName = form.name.trim() || 'Your name';
  const preview = {
    id: currentUser?.id || 'preview',
    name: previewName,
    location: form.location.trim() || 'Nairobi',
    photo:
      form.photo.trim() ||
      `https://i.pravatar.cc/400?u=${encodeURIComponent(form.email || previewName)}`,
    offers: toList(form.offers),
    wants: toList(form.wants),
    timeToLearn: form.timeToLearn.trim() || 'To be agreed',
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="animate-rise rounded-3xl bg-linear-to-r from-purple-100 via-pink-100 to-sky-100 p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {isEditing ? `Your profile, ${previewName.split(' ')[0]}` : 'Create your profile'}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEditing
            ? 'Update what you teach and what you want to learn.'
            : 'Tell us what you can teach and what you want to learn. Your card appears below.'}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 grid grid-cols-1 gap-5 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm md:grid-cols-2 md:p-8"
      >
        <Field label="Full name" name="name" error={errors.name}>
          <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Wanjiku" className={inputClass} />
        </Field>

        <Field label="Email" name="email" error={errors.email}>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass} />
        </Field>

        {!isEditing && (
          <Field label="Password" name="password" error={errors.password}>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 4 characters" className={inputClass} />
          </Field>
        )}

        <Field label="Phone (WhatsApp)" name="phone" error={errors.phone} hint="Only shared after a match">
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="0712 345 678" className={inputClass} />
        </Field>

        <Field label="Location" name="location">
          <input id="location" name="location" value={form.location} onChange={handleChange} placeholder="Nairobi" className={inputClass} />
        </Field>

        <Field label="Photo link (optional)" name="photo" hint="Leave empty and we'll pick one for you">
          <input id="photo" name="photo" value={form.photo} onChange={handleChange} placeholder="https://..." className={inputClass} />
        </Field>

        <div className="md:col-span-2">
          <Field label="Skills you can teach" name="offers" error={errors.offers} hint="Separate skills with commas">
            <input id="offers" name="offers" value={form.offers} onChange={handleChange} placeholder="Baking, Guitar, React" className={inputClass} />
          </Field>
          <div className="mt-3 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 transition hover:bg-purple-100"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <Field label="Skills you want to learn" name="wants" hint="Separate skills with commas">
            <input id="wants" name="wants" value={form.wants} onChange={handleChange} placeholder="Photography, Swahili" className={inputClass} />
          </Field>
        </div>

        <Field label="How long would it take to teach?" name="timeToLearn">
          <input id="timeToLearn" name="timeToLearn" value={form.timeToLearn} onChange={handleChange} placeholder="2 weeks" className={inputClass} />
        </Field>

        <Field label="Short bio" name="bio">
          <input id="bio" name="bio" value={form.bio} onChange={handleChange} placeholder="A line about you" className={inputClass} />
        </Field>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-purple-600 py-3 font-semibold text-white shadow-md transition hover:bg-purple-700 active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create my profile'}
          </button>
          {message && (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700" role="status">
              {message}
            </p>
          )}
        </div>
      </form>

      <section className="mt-10">
        <h2 className="text-center text-lg font-bold text-gray-800">Your card</h2>
        <p className="text-center text-sm text-gray-500">This is how others see you on Discover</p>
        <div key={cardKey} className="animate-rise mx-auto mt-5 max-w-xs">
          <SkillCard person={preview} onClick={() => {}} />
        </div>
      </section>

      {isEditing && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-pink-200 bg-white px-8 py-3 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
          >
            Log out
          </button>
        </div>
      )}
    </main>
  );
}
