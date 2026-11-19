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
  'Graphic Design',
  'Digital Marketing',
  'Photography',
  'Spanish',
  'French',
  'Guitar',
  'Public Speaking',
  'Other',
];

const initialForm = {
  name: '',
  email: '',
  location: '',
  bio: '',
  offers: [],
  wants: [],
};

const initialErrors = {
  name: '',
  email: '',
  location: '',
  bio: '',
  offers: '',
  wants: '',
};

export default function ProfileForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };


  const toggleSkill = (field, skill) => {
    setForm((prev) => {
      const list = prev[field];
      const next = list.includes(skill)
        ? list.filter((s) => s !== skill)
        : [...list, skill];
      return { ...prev, [field]: next };
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
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

    if (form.bio.length > 300) {
      next.bio = 'Bio must be 300 characters or less';
      valid = false;
    }

    if (form.offers.length === 0) {
      next.offers = 'Select at least one skill you can offer';
      valid = false;
    }

    if (form.wants.length === 0) {
      next.wants = 'Select at least one skill you want to learn';
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Replace with API call
    console.log('Saving profile:', form);
    setSubmitted(form);
    setForm(initialForm);
  };

  return (
    <div className="profile-container">
      <h2>Create your profile</h2>
      <p className="subtitle">Share what you know — learn what you don't.</p>

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
          />
          {errors.name && <p className="error">{errors.name}</p>}
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
            autoComplete="email"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

      
        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            value={form.location}
            onChange={handleChange}
            placeholder="Nairobi, Kenya"
            aria-invalid={!!errors.location}
          />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>

        
        <div className="field">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            placeholder="A short intro about you, your background, and what you're excited to learn…"
            maxLength={300}
            aria-invalid={!!errors.bio}
          />
          <div className="meta">
            {errors.bio && <p className="error">{errors.bio}</p>}
            <span className="counter">{form.bio.length}/300</span>
          </div>
        </div>

       
        <div className="field">
          <label>Skills I can offer</label>
          <p className="hint">Pick everything you're comfortable teaching.</p>
          <div className="chips">
            {SKILLS.map((skill) => (
              <button
                type="button"
                key={`offer-${skill}`}
                className={`chip ${form.offers.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkill('offers', skill)}
                aria-pressed={form.offers.includes(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          {errors.offers && <p className="error">{errors.offers}</p>}
        </div>

       
        <div className="field">
          <label>Skills I want to learn</label>
          <p className="hint">Pick everything you'd like to pick up.</p>
          <div className="chips">
            {SKILLS.map((skill) => (
              <button
                type="button"
                key={`want-${skill}`}
                className={`chip ${form.wants.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkill('wants', skill)}
                aria-pressed={form.wants.includes(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          {errors.wants && <p className="error">{errors.wants}</p>}
        </div>

        <button type="submit" className="submit-btn">Save profile</button>
      </form>

      {submitted && (
        <div className="success" role="status">
          <strong>Profile saved, {submitted.name}!</strong>
          <p><b>Location:</b> {submitted.location}</p>
          {submitted.bio && <p><b>Bio:</b> {submitted.bio}</p>}
          <p><b>Offers:</b> {submitted.offers.join(', ')}</p>
          <p><b>Wants:</b> {submitted.wants.join(', ')}</p>
        </div>
      )}
    </div>
  );
}