import { useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import logo from 'figma:asset/4f7cda7b4961882fb5390780ab71fc4afc224346.png';

interface RegisterPageProps {
  onRegister: (name: string, email: string, password: string, phone?: string) => void;
  onNavigateToLogin: () => void;
  darkMode: boolean;
}

export function RegisterPage({ onRegister, onNavigateToLogin, darkMode }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setError('');
    onRegister(name, email, password, phone);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#482B83] to-[#3a2268]">
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onNavigateToLogin}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center mr-10">
            <div className="inline-flex bg-white rounded-full p-3 shadow-md">
              <img src={logo} alt="Dono da Rua" className="h-10 w-auto" />
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 max-w-md w-full mx-auto flex-1 flex flex-col">
          <h2 className="mb-2 text-gray-900 dark:text-gray-100">Criar Conta</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Junte-se a nós para melhorar sua cidade</p>
          
          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                Nome completo *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                Email *
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
              <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">
                Telefone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="(11) 98765-4321"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                Senha *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 mb-2">
                Confirmar senha *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Digite a senha novamente"
              />
            </div>

            <div className="flex-1"></div>

            <button
              type="submit"
              className="w-full bg-[#482B83] dark:bg-[#6b4cb3] text-white py-3 rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-colors"
            >
              Criar conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
