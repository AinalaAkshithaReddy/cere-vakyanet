import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/logo.png';

function Landing() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsVisible(true), 50);
    return () => window.clearTimeout(timeout);
  }, []);

  const titleClasses = [
    'text-4xl',
    'md:text-6xl',
    'font-extrabold',
    'tracking-tight',
    'text-white',
    'transition-all',
    'duration-700',
    'ease-out',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
  ].join(' ');

  const descriptionClasses = [
    'mt-6',
    'max-w-3xl',
    'mx-auto',
    'text-base',
    'md:text-lg',
    'text-gray-300',
    'leading-relaxed',
    'transition-all',
    'duration-700',
    'delay-150',
    'ease-out',
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
  ].join(' ');

  const handleLogoClick = () => navigate('/', { replace: true });
  const handleSignIn = () => navigate('/login');
  const handleSignUp = () => navigate('/signup');

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <header className="px-6 sm:px-10 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl"
          >
            <img
              src={logoImage}
              alt="Cerevyn Solutions Logo"
              className="h-10 w-auto md:h-12"
            />
            <span className="sr-only">Cerevyn Solutions Home</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSignIn}
              className="px-5 py-2 rounded-xl border border-cyan-500/40 bg-gray-900/60 text-cyan-300 font-semibold hover:bg-gray-800 transition-all hover:scale-[1.01]"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold hover:scale-[1.02] transition-transform shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pt-16 pb-48 md:pt-24 md:pb-64 lg:pt-28 lg:pb-80">
        <div className="max-w-4xl w-full text-center">
          <h1 className={titleClasses} style={{ textShadow: '0 0 30px rgba(34, 211, 238, 0.35)' }}>
            CERE-VAKYANET
          </h1>
          <p className={descriptionClasses}>
            CERE-VAKYANET is a multilingual translation model that automatically detects and
            translates text across 13 Indian languages and English with high accuracy. It supports
            both direct text and PDF inputs, ensuring efficient and consistent translation across
            diverse regional scripts.
          </p>
        </div>
      </main>

      <footer className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">
              ©️ 2025 Cerevyn Solutions Pvt Ltd. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span className="text-sm font-semibold">Cerevyn</span>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
              Global AI company transforming healthcare, education, and business operations with
              intelligent solutions for a smarter tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
              <a href="mailto:info.cerevyn@gmail.com" className="hover:text-cyan-400 transition-colors">
                info.cerevyn@gmail.com
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="tel:+917893525665" className="hover:text-cyan-400 transition-colors">
                +91 78935 25665
              </a>
            </div>
            <p className="text-gray-400 text-xs max-w-2xl mx-auto">
              T Hub, Hyderabad Knowledge City, Serilingampally, Hyderabad, Telangana 500081, India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;


