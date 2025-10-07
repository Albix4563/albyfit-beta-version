import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LiquidGlass } from '@/components/ui/liquid-glass';

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Tutti i campi sono obbligatori');
      setLoading(false);
      return;
    }

    const success = isLogin 
      ? await login(email, password)
      : await register(email, password, name);

    if (!success) {
      setError(isLogin 
        ? 'Email o password non corretti' 
        : 'Email già registrata o errore durante la registrazione'
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <LiquidGlass intensity="heavy" size="lg" variant="card">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/8281de93-96f3-4e5c-938a-020cbe3e553d.png" 
              alt="Albyfit Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-poppins font-bold text-white mb-2 text-center">
            {isLogin ? 'Accedi' : 'Registrati'}
          </h1>
          <p className="text-slate-400 mb-8 text-center">
            {isLogin ? 'Bentornato su Albyfit!' : 'Crea il tuo account Albyfit'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl focus:border-sky-blue focus:outline-none transition-colors"
                  placeholder="Il tuo nome"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl focus:border-sky-blue focus:outline-none transition-colors"
                placeholder="la-tua-email@esempio.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-xl focus:border-sky-blue focus:outline-none transition-colors"
                placeholder="La tua password"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full primary-gradient text-white py-3 rounded-xl font-medium transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setName('');
              }}
              className="text-sky-blue hover:text-sky-400 transition-colors"
            >
              {isLogin 
                ? 'Non hai un account? Registrati' 
                : 'Hai già un account? Accedi'
              }
            </button>
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
};

export default AuthForm;
