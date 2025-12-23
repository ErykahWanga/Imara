import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthView = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && (!name || !username)) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ email, username, name, password });
      }
    } catch (err) {
      setError(err || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-light text-stone-800">IMARA</h1>
            <p className="text-sm text-stone-500">Stability before ambition</p>
            <div className="mt-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">Your data stays private and secure</p>
            </div>
          </div>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm text-stone-600 mb-2">Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors"
                    placeholder="What should we call you?"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors"
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm text-stone-600 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors"
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm text-stone-600 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-amber-300 transition-colors"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                {error}
              </div>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-stone-800 text-white py-3 rounded-xl hover:bg-stone-700 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </div>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            disabled={loading}
            className="w-full text-sm text-stone-500 hover:text-stone-700 transition-colors disabled:text-stone-300"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;