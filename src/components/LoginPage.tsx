import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import logo from 'figma:asset/4f7cda7b4961882fb5390780ab71fc4afc224346.png';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  darkMode: boolean;
}

export function LoginPage({ onLogin, onNavigateToRegister, darkMode }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setError('');
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#482B83] to-[#3a2268]">
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="bg-white rounded-full p-8 shadow-lg">
              <img src={logo} alt="Dono da Rua" className="w-52 h-auto" />
            </div>
          </div>
          <p className="text-purple-100">Cuide da sua cidade</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md w-full mx-auto">
          <h2 className="mb-6 text-gray-900 dark:text-gray-100">Entrar</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#482B83] dark:bg-[#6b4cb3] text-white py-3 rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-colors"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-[#482B83] dark:text-[#8b6fc9] hover:text-[#3a2268] dark:hover:text-[#a899d8]"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
