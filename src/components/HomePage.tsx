import { useState } from 'react';
import { MapPin, Camera, ChevronDown, X } from 'lucide-react';
import { User, Page, Complaint } from '../App';
import { BottomNav } from './BottomNav';
import logo from 'figma:asset/4f7cda7b4961882fb5390780ab71fc4afc224346.png';

interface HomePageProps {
  user: User;
  onNavigate: (page: Page) => void;
  onCreateComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt'>) => void;
  darkMode: boolean;
}

const complaintTypes = [
  'Bueiro aberto',
  'Calçada danificada',
  'Falta de coleta de lixo',
  'Falta de iluminação',
  'Buraco na rua',
  'Entulho na calçada',
  'Árvore caída',
  'Semáforo quebrado',
  'Outro'
];

export function HomePage({ user, onNavigate, onCreateComplaint, darkMode }: HomePageProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !description || !location) {
      return;
    }

    // Generate random coordinates around Recife
    const baseLatitude = -8.0476;
    const baseLongitude = -34.8770;
    const randomOffset = () => (Math.random() - 0.5) * 0.1; // ~5km radius
    
    onCreateComplaint({
      type: selectedType,
      description,
      location,
      coordinates: {
        lat: baseLatitude + randomOffset(),
        lng: baseLongitude + randomOffset()
      },
      severity,
      photos,
      status: 'pending'
    });

    // Reset form
    setSelectedType('');
    setDescription('');
    setLocation('');
    setPhotos([]);
    setSeverity('medium');
    setShowForm(false);
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 4000);
  };

  const handlePhotoAdd = () => {
    // Simulate photo addition
    setPhotos([...photos, `photo-${photos.length + 1}`]);
  };

  if (showForm) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 py-4 flex items-center justify-between">
          <h2>Nova Denúncia</h2>
          <button
            onClick={() => setShowForm(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Tipo de problema *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-800 flex items-center justify-between"
                >
                  <span className={selectedType ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}>
                    {selectedType || 'Selecione o tipo'}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </button>
                
                {showTypeDropdown && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {complaintTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedType(type);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-gray-700 dark:text-gray-300 mb-2">
                Localização *
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Rua, número, bairro"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-700 dark:text-gray-300 mb-2">
                Descrição do problema *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#482B83] resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Descreva detalhadamente o problema encontrado"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Nível de gravidade *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSeverity('low')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    severity === 'low'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${severity === 'low' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={`text-sm ${severity === 'low' ? 'text-green-700 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                      Leve
                    </span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSeverity('medium')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    severity === 'medium'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${severity === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    <span className={`text-sm ${severity === 'medium' ? 'text-yellow-700 dark:text-yellow-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                      Moderado
                    </span>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSeverity('high')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    severity === 'high'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${severity === 'high' ? 'bg-red-500' : 'bg-gray-400'}`} />
                    <span className={`text-sm ${severity === 'high' ? 'text-red-700 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                      Grave
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Fotos
              </label>
              <button
                type="button"
                onClick={handlePhotoAdd}
                className="w-full px-4 py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-[#482B83] dark:hover:border-[#8b6fc9] hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex flex-col items-center gap-2"
              >
                <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Adicionar foto</span>
              </button>
              
              {photos.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {photos.map((photo, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                    >
                      <Camera className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedType || !description || !location}
              className="w-full bg-[#482B83] dark:bg-[#6b4cb3] text-white py-3 rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              Enviar denúncia
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 py-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-2">
            <img src={logo} alt="Dono da Rua" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-white">Olá, {user.name}</h2>
            <p className="text-purple-100 dark:text-purple-200">Como está sua rua hoje?</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 pb-24">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-50 dark:bg-purple-900/30 rounded-full mb-4">
              <MapPin className="w-10 h-10 text-[#482B83] dark:text-[#8b6fc9]" />
            </div>
            <h3 className="text-gray-900 dark:text-gray-100 mb-2">Faça sua denúncia</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ajude a melhorar sua cidade reportando problemas nas ruas, calçadas e espaços públicos
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#482B83] dark:bg-[#6b4cb3] text-white py-4 rounded-xl hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-colors"
          >
            Iniciar nova denúncia
          </button>
        </div>

        {/* Map Card */}
        <button
          onClick={() => onNavigate('map')}
          className="mt-6 bg-gradient-to-r from-[#482B83] to-[#6b4cb3] dark:from-[#6b4cb3] dark:to-[#8b6fc9] rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all transform hover:scale-[1.02] w-full text-left"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 bg-white/20 p-3 rounded-xl">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Ver Mapa de Denúncias</h3>
              <p className="text-sm text-white/80">
                Visualize todas as denúncias da sua região em tempo real
              </p>
            </div>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <div className="mt-6 space-y-4">
          <h4 className="text-gray-900 dark:text-gray-100">Problemas comuns</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {complaintTypes.slice(0, 6).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setShowForm(true);
                }}
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-[#482B83] dark:hover:border-[#8b6fc9] hover:shadow-md transition-all text-center"
              >
                <p className="text-gray-700 dark:text-gray-300">{type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="home" onNavigate={onNavigate} darkMode={darkMode} />

      {/* Success Toast */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-600 dark:bg-green-700 text-white px-6 py-4 rounded-xl shadow-xl max-w-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold mb-1">Denúncia enviada com sucesso!</p>
                <p className="text-sm text-green-100">
                  Sua denúncia foi adicionada ao mapa e está visível para a comunidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
