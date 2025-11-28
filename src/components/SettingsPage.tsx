import { User, Mail, Phone, Bell, HelpCircle, Shield, LogOut, ChevronRight, Moon } from 'lucide-react';
import { User as UserType, Page } from '../App';
import { BottomNav } from './BottomNav';

interface SettingsPageProps {
  user: UserType;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsPage({ user, onNavigate, onLogout, darkMode, onToggleDarkMode }: SettingsPageProps) {
  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 py-6">
        <h2 className="text-white">Configurações</h2>
        <p className="text-purple-100 dark:text-purple-200">Gerencie sua conta e preferências</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#482B83] dark:text-[#8b6fc9]" />
            </div>
            <div className="flex-1">
              <h3 className="text-gray-900 dark:text-gray-100 mb-1">{user.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          
          <button className="w-full bg-purple-50 dark:bg-purple-900/30 text-[#482B83] dark:text-[#8b6fc9] py-3 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
            Editar perfil
          </button>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-gray-900 dark:text-gray-100">Informações da conta</h4>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-gray-700 dark:text-gray-300">Email</p>
                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>

            {user.phone && (
              <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <Phone className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div className="flex-1 text-left">
                  <p className="text-gray-700 dark:text-gray-300">Telefone</p>
                  <p className="text-gray-500 dark:text-gray-400">{user.phone}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-gray-900 dark:text-gray-100">Preferências</h4>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button 
              onClick={onToggleDarkMode}
              className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <Moon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-gray-700 dark:text-gray-300">Modo escuro</p>
                <p className="text-gray-500 dark:text-gray-400">
                  {darkMode ? 'Ativado' : 'Desativado'}
                </p>
              </div>
              <div className={`relative w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-[#482B83]' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </div>
            </button>

            <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Bell className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-gray-700 dark:text-gray-300">Notificações</p>
                <p className="text-gray-500 dark:text-gray-400">Gerencie suas notificações</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h4 className="text-gray-900 dark:text-gray-100">Suporte</h4>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <HelpCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-gray-700 dark:text-gray-300">Ajuda</p>
                <p className="text-gray-500 dark:text-gray-400">Central de ajuda e FAQ</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>

            <button className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <Shield className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-gray-700 dark:text-gray-300">Privacidade</p>
                <p className="text-gray-500 dark:text-gray-400">Política de privacidade</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">Versão 1.0.0</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="settings" onNavigate={onNavigate} darkMode={darkMode} />
    </div>
  );
}
