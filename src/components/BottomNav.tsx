import { Home, FileText, Settings, Map } from 'lucide-react';
import { Page } from '../App';

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  darkMode: boolean;
}

export function BottomNav({ currentPage, onNavigate, darkMode }: BottomNavProps) {
  const navItems = [
    { page: 'home' as Page, icon: Home, label: 'Início' },
    { page: 'track' as Page, icon: FileText, label: 'Denúncias' },
    { page: 'map' as Page, icon: Map, label: 'Mapa' },
    { page: 'settings' as Page, icon: Settings, label: 'Configurações' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(({ page, icon: Icon, label }) => {
          const isActive = currentPage === page;
          
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#482B83] dark:text-[#8b6fc9]'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
