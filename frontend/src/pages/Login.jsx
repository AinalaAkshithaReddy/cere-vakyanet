import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (signInError) {
        setError(signInError.message || 'Unable to sign in. Please try again.');
        return;
      }

      navigate('/translate', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900/60 border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 text-sm">
            Sign in to continue to CERE-VAKYANET.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-xl text-sm text-red-300">
            {error}
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
              disabled={isSubmitting}
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
              placeholder="Enter your password"
              disabled={isSubmitting}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:scale-[1.01] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-cyan-400 hover:text-teal-300 transition-colors"
          >
            Create one
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

export default Login;


