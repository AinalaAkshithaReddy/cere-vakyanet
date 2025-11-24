import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logoImage from './assets/logo.png';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import { supabase } from './supabaseClient';

const API_BASE_URL = 'https://vakyanet-backend.azurewebsites.net';

const LANGUAGES = [
  { value: 'hindi', label: 'Hindi' },
  { value: 'english', label: 'English' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'assamese', label: 'Assamese' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'odia', label: 'Odia' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' }
];

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const resolveSession = async () => {
      try {
        const {
          data: { session: activeSession },
        } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(activeSession ?? null);
      } catch (error) {
        if (!isMounted) return;
        console.error('Session lookup failed:', error);
        setSession(null);
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    resolveSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, updatedSession) => {
      if (!isMounted) return;
      setSession(updatedSession ?? null);
      setIsChecking(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="px-4 py-2 border border-gray-800 rounded-lg bg-gray-900/60 text-gray-400 text-sm">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function TranslatorPage() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState(null);
  const [pdfFileName, setPdfFileName] = useState('');
  const [showDeveloperMode, setShowDeveloperMode] = useState(false);
  const [apiHealth, setApiHealth] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const formatError = (err) => {
    // Extract detailed error information
    if (err.response) {
      // Server responded with error status
      const status = err.response.status;
      const detail = err.response.data?.detail || err.response.data?.message || 'Unknown error';
      const data = err.response.data;
      
      console.error('API Error:', {
        status,
        detail,
        data,
        url: err.config?.url,
        method: err.config?.method
      });

      // Format user-friendly error messages based on status code
      let userMessage = detail;
      
      if (status === 429) {
        userMessage = 'Translation rate limit exceeded. Please wait a moment and try again.';
      } else if (status === 503) {
        userMessage = 'Translation service is temporarily unavailable. Please check your internet connection.';
      } else if (status === 502) {
        userMessage = 'Translation service error. The service may be experiencing issues.';
      } else if (status === 400) {
        userMessage = detail || 'Invalid request. Please check your input.';
      } else if (status === 500) {
        // Show the actual error detail from the server for better debugging
        userMessage = detail || 'Server error occurred. Please try again later.';
      }

      return {
        userMessage,
        detail,
        status,
        fullError: data,
        isNetworkError: false
      };
    } else if (err.request) {
      // Request was made but no response received
      console.error('Network Error:', {
        message: err.message,
        code: err.code,
        config: err.config
      });

      return {
        userMessage: 'Cannot connect to the translation server. Please ensure the backend is running on port 8000.',
        detail: err.message || 'Network error',
        status: null,
        fullError: err,
        isNetworkError: true
      };
    } else {
      // Something else happened
      console.error('Error:', err.message);
      return {
        userMessage: err.message || 'An unexpected error occurred',
        detail: err.message,
        status: null,
        fullError: err,
        isNetworkError: false
      };
    }
  };

  const handleTextChange = async (e) => {
    const text = e.target.value;
    setInputText(text);
    setError('');
    setErrorDetails(null);
    
    // Auto-detect language when text changes
    if (text.trim().length > 0) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/detect-language`, {
          text: text
        });
        setDetectedLanguage(response.data.detected_language);
      } catch (err) {
        console.error('Language detection error:', err);
        // Don't show error for language detection failures
      }
    } else {
      setDetectedLanguage('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const supportedExtensions = ['.pdf', '.docx', '.txt'];
    
    if (!supportedExtensions.some(ext => fileName.endsWith(ext))) {
      setError('Please upload a PDF, DOCX, or TXT file');
      setErrorDetails(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setErrorDetails(null);
    setPdfFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name);
      const response = await axios.post(`${API_BASE_URL}/api/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setInputText(response.data.extracted_text);
      setDetectedLanguage(response.data.detected_language);
      console.log('File uploaded successfully:', response.data);
    } catch (err) {
      const errorInfo = formatError(err);
      setError(errorInfo.userMessage);
      setErrorDetails(errorInfo);
      setPdfFileName('');
      console.error('File upload failed:', errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text or upload a file');
      setErrorDetails(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setErrorDetails(null);
    setTranslatedText('');

    try {
      console.log('Translating:', {
        text: inputText.substring(0, 50) + '...',
        targetLanguage: selectedLanguage
      });

      const response = await axios.post(`${API_BASE_URL}/api/translate`, {
        text: inputText,
        target_language: selectedLanguage
      });

      console.log('Translation successful:', response.data);
      
      setTranslatedText(response.data.translated_text);
      setDetectedLanguage(response.data.detected_language);
    } catch (err) {
      const errorInfo = formatError(err);
      setError(errorInfo.userMessage);
      setErrorDetails(errorInfo);
      console.error('Translation failed:', errorInfo);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setDetectedLanguage('');
    setError('');
    setErrorDetails(null);
    setPdfFileName('');
  };

  const handleDownloadDocx = async () => {
    if (!translatedText.trim()) {
      setError('No translated text to download');
      return;
    }

    try {
      const languageLabel = LANGUAGES.find(lang => lang.value === selectedLanguage)?.label || selectedLanguage;
      
      const response = await axios.post(
        `${API_BASE_URL}/api/download-docx`,
        {
          text: translatedText,
          title: "Translated Text",
          target_language: languageLabel,
          original_filename: pdfFileName || ""  // Send original filename if available
        },
        {
          responseType: 'blob',
        }
      );

      // Get filename from Content-Disposition header, or use default
      let filename = `translated_text_${selectedLanguage}.docx`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
          // Decode URI if needed
          try {
            filename = decodeURIComponent(filename);
          } catch (e) {
            // If decoding fails, use as-is
          }
        }
      }

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorInfo = formatError(err);
      setError(errorInfo.userMessage);
      setErrorDetails(errorInfo);
      console.error('DOCX download failed:', errorInfo);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      console.log('Logout clicked');
      setIsLoggingOut(true);
      navigate('/', { replace: true });
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between relative">
            {/* Logo on the left */}
            <div className="flex items-center ml-5 md:ml-6 flex-shrink-0">
              <img 
                src={logoImage} 
                alt="Cerevyn Solutions Logo" 
                className="h-10 md:h-12 w-auto"
                style={{ maxHeight: '48px' }}
              />
            </div>
            
            {/* Title centered */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xs md:max-w-none">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight text-center" style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
                CERE-VAKYANET
              </h1>
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-3">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut || isLoading}
                type="button"
                className="px-3 py-2 border border-gray-700 bg-gray-900/60 text-gray-100 text-sm font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative z-10 pointer-events-auto"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl shadow-xl p-6 space-y-6">
          {/* Input Area */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-lg font-semibold text-gray-100">
                Input Text or Upload File (PDF, DOCX, TXT)
              </label>
              <div className="flex items-center gap-2">
                {detectedLanguage && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full text-sm font-medium">
                    Detected: {detectedLanguage}
                  </span>
                )}
                <button
                  onClick={() => setShowDeveloperMode(!showDeveloperMode)}
                  className="px-2 py-1 text-xs bg-gray-800 text-gray-400 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
                  title="Toggle developer mode"
                >
                  {showDeveloperMode ? '👁️' : '🔧'}
                </button>
              </div>
            </div>

            {/* Text Input */}
            <textarea
              value={inputText}
              onChange={handleTextChange}
              placeholder="Enter text to translate or upload a file (PDF, DOCX, TXT) below..."
              className="w-full h-40 p-4 border border-gray-800 bg-gray-900/60 rounded-xl focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(34,211,238,0.25)] resize-none text-gray-100 placeholder-gray-500 transition-all"
              disabled={isLoading}
            />

            {/* File Upload */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-900/60 border border-gray-800 text-gray-100 rounded-xl cursor-pointer hover:bg-gray-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </label>
              {pdfFileName && (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {pdfFileName}
                </span>
              )}
            </div>
          </div>

          {/* Language Selection and Translate Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="block text-lg font-semibold text-gray-100 mb-2">
                Select Target Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border border-gray-800 bg-gray-900/60 rounded-xl focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_0_3px_rgba(34,211,238,0.25)] text-gray-100 transition-all"
                disabled={isLoading}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-gray-900 text-gray-100">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleTranslate}
                disabled={isLoading || !inputText.trim()}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-md hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Translating...
                  </span>
                ) : (
                  'Translate'
                )}
              </button>

              <button
                onClick={handleClear}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-700 bg-gray-900/60 text-gray-100 font-semibold rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-red-300 font-medium">{error}</p>
                  {showDeveloperMode && errorDetails && (
                    <div className="mt-3 p-3 bg-red-900/30 border border-red-900/50 rounded text-xs font-mono text-red-300">
                      <div><strong>Status:</strong> {errorDetails.status || 'N/A'}</div>
                      <div><strong>Detail:</strong> {errorDetails.detail}</div>
                      {errorDetails.isNetworkError && (
                        <div className="mt-2 text-red-400">
                          ⚠️ Network error - Check if backend is running on port 8000
                        </div>
                      )}
                      {showDeveloperMode && errorDetails.fullError && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-red-300 font-semibold">Full Error Details</summary>
                          <pre className="mt-2 p-2 bg-red-900/40 rounded overflow-auto max-h-40 text-red-200">
                            {JSON.stringify(errorDetails.fullError, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Output Area */}
          {translatedText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-100">
                  Translated Text
                </label>
              </div>
              <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl min-h-[120px]">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {translatedText}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleDownloadDocx}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-gray-900/60 text-gray-100 font-semibold rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download DOCX
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Developer Mode API Status */}
        {apiHealth && showDeveloperMode && (
          <div className="mt-6 p-4 bg-gray-900/60 border border-gray-800 rounded-xl text-xs text-gray-400">
            <strong className="text-gray-300">API Status:</strong> {JSON.stringify(apiHealth, null, 2)}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">
              ©️ 2025 Cerevyn Solutions Pvt Ltd. All rights reserved.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span className="text-sm font-semibold">Cerevyn</span>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
              Global AI company transforming healthcare, education, and business operations with intelligent solutions for a smarter tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
              <a href="mailto:info.cerevyn@gmail.com" className="hover:text-cyan-400 transition-colors">
                ceo@cerevyn.com
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

function AuthRedirectWatcher() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const redirectIfNeeded = (session) => {
      if (!session) {
        return;
      }
      const redirectablePaths = ['/', '/login', '/signup'];
      if (redirectablePaths.includes(location.pathname)) {
        navigate('/translate', { replace: true });
      }
    };

    const syncSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!isMounted) return;
        redirectIfNeeded(session);
      } catch (error) {
        console.error('Failed to fetch session for redirect:', error);
      }
    };

    syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      redirectIfNeeded(session);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [location.pathname, navigate]);

  return null;
}

function App() {
  return (
    <>
      <AuthRedirectWatcher />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/translate"
          element={
            <ProtectedRoute>
              <TranslatorPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/translate" replace />} />
      </Routes>
    </>
  );
}

export default App;
