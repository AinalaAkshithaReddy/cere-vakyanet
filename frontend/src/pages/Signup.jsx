import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const passwordChecks = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!passwordPattern.test(trimmedPassword)) {
      setError(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            verification_message: `Hello,\n\nYou’ve signed up for CERE-VAKYANET — a multilingual text-to-text translation app powered by Cerevyn Solutions.\n\nPlease confirm your email address to activate your account and start translating effortlessly across 13 Indian languages and English.\n\nClick the link below to verify your email:\n[Confirm your email]\n\nThank you,\nThe CERE-VAKYANET Team\nCerevyn Solutions Pvt. Ltd.`,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || 'Unable to create account. Please try again.');
        return;
      }

      setConfirmationSent(true);
      setSuccess(
        'A confirmation link has been sent to your email. Please check your inbox and verify your account to continue.'
      );
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Create an Account</h1>
          <p className="text-gray-400 text-sm">
            Sign up to start using CERE-VAKYANET.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-xl text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-teal-900/20 border border-teal-500/40 rounded-xl text-sm text-teal-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-800 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(34,211,238,0.25)] text-gray-100 placeholder-gray-500 transition-all"
              placeholder="you@example.com"
              disabled={isSubmitting || confirmationSent}
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-800 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(34,211,238,0.25)] text-gray-100 placeholder-gray-500 transition-all"
              placeholder="Choose a password"
              disabled={isSubmitting || confirmationSent}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-800 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(34,211,238,0.25)] text-gray-100 placeholder-gray-500 transition-all"
              placeholder="Re-enter password"
              disabled={isSubmitting || confirmationSent}
              autoComplete="new-password"
              required
            />
            <div className="mt-3 space-y-1 text-xs">
              <p className="text-gray-400 font-medium">Password must include:</p>
              <ul className="space-y-1">
                <li className={passwordChecks.length ? 'text-teal-400' : 'text-gray-500'}>
                  <span className="mr-2">{passwordChecks.length ? '✓' : '•'}</span>
                  At least 8 characters
                </li>
                <li className={passwordChecks.uppercase ? 'text-teal-400' : 'text-gray-500'}>
                  <span className="mr-2">{passwordChecks.uppercase ? '✓' : '•'}</span>
                  1 uppercase letter
                </li>
                <li className={passwordChecks.lowercase ? 'text-teal-400' : 'text-gray-500'}>
                  <span className="mr-2">{passwordChecks.lowercase ? '✓' : '•'}</span>
                  1 lowercase letter
                </li>
                <li className={passwordChecks.number ? 'text-teal-400' : 'text-gray-500'}>
                  <span className="mr-2">{passwordChecks.number ? '✓' : '•'}</span>
                  1 number
                </li>
                <li className={passwordChecks.special ? 'text-teal-400' : 'text-gray-500'}>
                  <span className="mr-2">{passwordChecks.special ? '✓' : '•'}</span>
                  1 special character
                </li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || confirmationSent}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <a
            onClick={() => navigate('/signin')}
            className="text-cyan-400 hover:text-teal-300 transition-colors"
          >
            Sign in
          </a>
        </p>

        <div className="pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full justify-center px-4 py-2 rounded-xl border border-gray-800 text-gray-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors text-sm font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;


