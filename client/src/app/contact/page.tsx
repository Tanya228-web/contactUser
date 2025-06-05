'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
  });

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const { name, email, phone, country, message } = formData;

  if (!name || !email || !phone || !country || !message) {
    setError('Please fill in all the fields.');
    return;
  }

  try {
    const res = await fetch('http://localhost:8000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      setError(errorData.message || 'Something went wrong.');
      return;
    }

    setError('');
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', country: '', message: '' });

    setTimeout(() => setSubmitted(false), 4000);
  } catch (err) {
    setError('Network error. Please try again.');
  }
};


  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-gray-800 p-8 rounded-2xl shadow-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-purple-400">Contact Us</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {['name', 'email', 'phone', 'country'].map(field => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium capitalize text-gray-300"
              >
                {field}
              </label>
              <input
                type="text"
                name={field}
                id={field}
                value={formData[field as keyof FormData]}
                onChange={handleChange}
                className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full bg-gray-700 text-white border border-gray-600 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {submitted && <p className="text-green-400 text-sm">Thanks! We received your message.</p>}
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
