import { useState } from 'react';

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

const initialForm = { name: '', email: '', phone: '', skill: '' };
const initialErrors = { name: '', email: '', phone: '', skill: '' };

export default function UserForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Replace with your API call
    console.log('Submitting:', form);
    setSubmitted(form);
    setForm(initialForm);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors(initialErrors);
    setSubmitted(null);
  };

  return (
    <div className="form-container">
      <h2>Tell us about yourself</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <p id="name-error" className="error">{errors.name}</p>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && <p id="email-error" className="error">{errors.email}</p>}
        </div>

        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 555 123 4567"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && <p id="phone-error" className="error">{errors.phone}</p>}
        </div>

        <div className="field">
          <label htmlFor="skill">Skill / Specialization</label>
          <select
            id="skill"
            name="skill"
            value={form.skill}
            onChange={handleChange}
            aria-invalid={!!errors.skill}
            aria-describedby={errors.skill ? 'skill-error' : undefined}
          >
            <option value="">-- Select a skill --</option>
            {SKILLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.skill && <p id="skill-error" className="error">{errors.skill}</p>}
        </div>

        <div className="actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset} className="secondary">
            Reset
          </button>
        </div>
      </form>

      {submitted && (
        <div className="success" role="status">
          <strong>Thanks, {submitted.name}!</strong>
          <p>We received your details for {submitted.skill}.</p>
        </div>
      )}
    </div>
  );
}