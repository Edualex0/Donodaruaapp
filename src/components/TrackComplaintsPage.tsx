import { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, XCircle, Eye, ArrowUp, User, Users, Search, X, Trash2 } from 'lucide-react';
import { Complaint, Page, User as UserType } from '../App';
import { BottomNav } from './BottomNav';

interface TrackComplaintsPageProps {
  user: UserType;
  complaints: Complaint[];
  onNavigate: (page: Page) => void;
  onViewComplaint: (complaintId: string) => void;
  onUpvote: (complaintId: string) => void;
  onDeleteComplaint: (complaintId: string) => void;
  darkMode: boolean;
}

const statusConfig = {
  pending: {
    label: 'Pendente',
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  'in-progress': {
    label: 'Em andamento',
    icon: AlertCircle,
    color: 'text-[#482B83] dark:text-[#8b6fc9]',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  },
  resolved: {
    label: 'Resolvido',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  rejected: {
    label: 'Rejeitado',
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  }
};

export function TrackComplaintsPage({ user, complaints, onNavigate, onViewComplaint, onUpvote, onDeleteComplaint, darkMode }: TrackComplaintsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'community'>('community');
  const [showUpvoteToast, setShowUpvoteToast] = useState(false);
  const [upvoteMessage, setUpvoteMessage] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'upvotes'>('date');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter complaints based on active tab
  const tabFilteredComplaints = activeTab === 'my' 
    ? complaints.filter(complaint => complaint.userId === user.id)
    : complaints;

  // Filter complaints based on search query
  const searchFilteredComplaints = tabFilteredComplaints.filter(complaint => 
    complaint.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort complaints
  const filteredComplaints = [...searchFilteredComplaints].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'severity') {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    } else if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    }
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 pt-6 pb-4">
        <h2 className="text-white mb-1">Denúncias</h2>
        <p className="text-purple-100 dark:text-purple-200">
          {activeTab === 'my' ? 'Acompanhe suas denúncias' : 'Veja e priorize denúncias da sua região'}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-[#482B83] dark:bg-[#6b4cb3] px-6 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('my');
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'my'
                ? 'bg-white dark:bg-gray-800 text-[#482B83] dark:text-[#8b6fc9] shadow-md'
                : 'bg-white/10 dark:bg-white/5 text-white hover:bg-white/20 dark:hover:bg-white/10'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Suas denúncias</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('community');
              setSearchQuery('');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'community'
                ? 'bg-white dark:bg-gray-800 text-[#482B83] dark:text-[#8b6fc9] shadow-md'
                : 'bg-white/10 dark:bg-white/5 text-white hover:bg-white/20 dark:hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Comunidade</span>
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nome da rua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#482B83] dark:focus:ring-[#8b6fc9] focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Sort buttons */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Ordenar:</span>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSortBy('date')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortBy === 'date'
                  ? 'bg-[#482B83] dark:bg-[#6b4cb3] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#482B83] dark:hover:border-[#8b6fc9]'
              }`}
            >
              Data
            </button>
            <button
              onClick={() => setSortBy('severity')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortBy === 'severity'
                  ? 'bg-[#482B83] dark:bg-[#6b4cb3] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#482B83] dark:hover:border-[#8b6fc9]'
              }`}
            >
              Gravidade
            </button>
            <button
              onClick={() => setSortBy('upvotes')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                sortBy === 'upvotes'
                  ? 'bg-[#482B83] dark:bg-[#6b4cb3] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-[#482B83] dark:hover:border-[#8b6fc9]'
              }`}
            >
              Apoios
            </button>
          </div>
        </div>
        
        {searchQuery && (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {filteredComplaints.length} {filteredComplaints.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        )}
      </div>

      {/* Complaints List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
        {/* Severity Stats - Only show when sorted by severity */}
        {sortBy === 'severity' && filteredComplaints.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredComplaints.filter(c => c.severity === 'high').length} Graves
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredComplaints.filter(c => c.severity === 'medium').length} Moderadas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredComplaints.filter(c => c.severity === 'low').length} Leves
                </span>
              </div>
            </div>
          </div>
        )}
        
        {tabFilteredComplaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              {activeTab === 'my' ? (
                <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              ) : (
                <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              )}
            </div>
            <h3 className="text-gray-900 dark:text-gray-100 mb-2">
              {activeTab === 'my' ? 'Você ainda não fez denúncias' : 'Nenhuma denúncia ainda'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {activeTab === 'my' 
                ? 'Comece a fazer denúncias e ajude a melhorar sua cidade!'
                : 'Seja o primeiro a fazer uma denúncia e melhorar sua cidade!'
              }
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 py-3 rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-colors"
            >
              Fazer {activeTab === 'my' ? 'primeira' : 'uma'} denúncia
            </button>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-gray-900 dark:text-gray-100 mb-2">Nenhuma denúncia encontrada</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Não encontramos denúncias para "{searchQuery}". Tente buscar por outro nome de rua.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 py-3 rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-colors"
            >
              Limpar busca
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => {
              const status = statusConfig[complaint.status];
              const StatusIcon = status.icon;
              const hasUpvoted = complaint.upvotedBy.includes(user.id);
              const isOwnComplaint = complaint.userId === user.id;

              return (
                <div
                  key={complaint.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border ${status.borderColor}`}
                >
                  <div className={`flex items-start gap-3 mb-3 ${activeTab === 'my' ? '' : ''}`}>
                    {/* Upvote Button - Only show in community tab */}
                    {activeTab === 'community' && (
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpvote(complaint.id);
                            
                            // Show feedback toast
                            if (hasUpvoted) {
                              setUpvoteMessage('Apoio removido');
                            } else {
                              setUpvoteMessage('Denúncia apoiada! ✓');
                            }
                            setShowUpvoteToast(true);
                            setTimeout(() => setShowUpvoteToast(false), 2000);
                          }}
                          className={`p-2.5 rounded-lg transition-all transform active:scale-95 ${
                            hasUpvoted
                              ? 'bg-[#482B83] dark:bg-[#6b4cb3] text-white shadow-md hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9]'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-[#482B83]/10 dark:hover:bg-[#6b4cb3]/20 hover:text-[#482B83] dark:hover:text-[#8b6fc9] border border-gray-200 dark:border-gray-600'
                          }`}
                          title={hasUpvoted ? 'Remover apoio' : 'Apoiar esta denúncia'}
                        >
                          <ArrowUp className={`w-5 h-5 transition-transform ${hasUpvoted ? 'scale-110' : ''}`} />
                        </button>
                        <span className={`text-sm font-semibold transition-colors ${
                          hasUpvoted ? 'text-[#482B83] dark:text-[#8b6fc9]' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {complaint.upvotes}
                        </span>
                        {hasUpvoted && (
                          <span className="text-xs text-[#482B83] dark:text-[#8b6fc9]">
                            Apoiado
                          </span>
                        )}
                      </div>
                    )}

                    {/* Complaint Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="text-gray-900 dark:text-gray-100 truncate">{complaint.type}</h4>
                            {/* Severity Badge */}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 shrink-0 ${
                              complaint.severity === 'high'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : complaint.severity === 'medium'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                complaint.severity === 'high'
                                  ? 'bg-red-500'
                                  : complaint.severity === 'medium'
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                              }`} />
                              {complaint.severity === 'high' ? 'Grave' : complaint.severity === 'medium' ? 'Moderado' : 'Leve'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{complaint.location}</p>
                        </div>
                        <div className={`${status.bgColor} ${status.color} px-3 py-1 rounded-full flex items-center gap-1.5 ml-2`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-sm">{status.label}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-400">
                            {isOwnComplaint ? 'Você' : complaint.userName}
                          </span>
                        </div>
                        {activeTab === 'community' && complaint.upvotes > 0 && (
                          <div className="flex items-center gap-1 text-[#482B83] dark:text-[#8b6fc9]">
                            <ArrowUp className="w-4 h-4" />
                            <span className="font-semibold">{complaint.upvotes}</span>
                            <span className="text-sm">
                              {complaint.upvotes === 1 ? 'apoio' : 'apoios'}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                        {complaint.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-gray-500 dark:text-gray-400">
                          Criado em {formatDate(complaint.createdAt)}
                        </span>
                        {complaint.photos.length > 0 && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {complaint.photos.length} {complaint.photos.length === 1 ? 'foto' : 'fotos'}
                          </span>
                        )}
                      </div>

                      {complaint.status === 'in-progress' && (
                        <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                          <p className="text-purple-800 dark:text-purple-300">
                            {isOwnComplaint ? 'Sua denúncia está' : 'Esta denúncia está'} sendo analisada pela prefeitura
                          </p>
                        </div>
                      )}

                      {complaint.status === 'resolved' && (
                        <div className="mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                          <p className="text-green-800 dark:text-green-300">
                            Problema resolvido! {isOwnComplaint && 'Obrigado por contribuir.'}
                          </p>
                        </div>
                      )}

                      <div className={`mt-4 flex gap-3 ${activeTab === 'my' ? '' : ''}`}>
                        <button
                          onClick={() => onViewComplaint(complaint.id)}
                          className={`bg-[#482B83] dark:bg-[#6b4cb3] text-white py-3 rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-colors flex items-center justify-center gap-2 ${
                            activeTab === 'my' ? 'flex-1' : 'w-full'
                          }`}
                        >
                          <Eye className="w-5 h-5" />
                          Ver detalhes
                        </button>
                        {activeTab === 'my' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Tem certeza que deseja excluir esta denúncia?')) {
                                onDeleteComplaint(complaint.id);
                              }
                            }}
                            className="bg-red-600 dark:bg-red-700 text-white py-3 px-5 rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors flex items-center justify-center"
                            title="Excluir denúncia"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="track" onNavigate={onNavigate} darkMode={darkMode} />

      {/* Upvote Toast Notification */}
      {showUpvoteToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <ArrowUp className="w-5 h-5" />
            <span>{upvoteMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
