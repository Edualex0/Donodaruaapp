import { ArrowLeft, MapPin, Calendar, Clock, CheckCircle, AlertCircle, XCircle, Camera, User, ArrowUp } from 'lucide-react';
import { Complaint, Page } from '../App';

interface ComplaintDetailPageProps {
  complaint: Complaint;
  onNavigate: (page: Page) => void;
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

export function ComplaintDetailPage({ complaint, onNavigate, darkMode }: ComplaintDetailPageProps) {
  const status = statusConfig[complaint.status];
  const StatusIcon = status.icon;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = () => {
    switch (complaint.status) {
      case 'pending':
        return 'Sua denúncia foi recebida e aguarda análise da prefeitura.';
      case 'in-progress':
        return 'A prefeitura está trabalhando para resolver este problema.';
      case 'resolved':
        return 'Este problema foi resolvido com sucesso. Obrigado por sua contribuição!';
      case 'rejected':
        return 'Esta denúncia foi rejeitada. Entre em contato para mais informações.';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-[#482B83] dark:bg-[#6b4cb3] text-white px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => onNavigate('track')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white">Detalhes da Denúncia</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Status and Severity Badges */}
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <div className={`inline-flex items-center gap-2 ${status.bgColor} ${status.color} px-4 py-2 rounded-full`}>
            <StatusIcon className="w-5 h-5" />
            <span>{status.label}</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            complaint.severity === 'high'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              : complaint.severity === 'medium'
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              complaint.severity === 'high'
                ? 'bg-red-500'
                : complaint.severity === 'medium'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`} />
            <span>Gravidade: {complaint.severity === 'high' ? 'Grave' : complaint.severity === 'medium' ? 'Moderada' : 'Leve'}</span>
          </div>
        </div>

        {/* User and Upvotes Info */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-gray-100">Denunciante</h3>
                <p className="text-gray-600 dark:text-gray-400">{complaint.userName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full">
              <ArrowUp className="w-5 h-5 text-[#482B83] dark:text-[#8b6fc9]" />
              <span className="text-[#482B83] dark:text-[#8b6fc9]">{complaint.upvotes} votos</span>
            </div>
          </div>
        </div>

        {/* Type */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-gray-100 mb-2">Tipo de Problema</h3>
          <p className="text-gray-700 dark:text-gray-300">{complaint.type}</p>
        </div>

        {/* Location */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#482B83] dark:text-[#8b6fc9] flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-gray-900 dark:text-gray-100 mb-2">Localização</h3>
              <p className="text-gray-700 dark:text-gray-300">{complaint.location}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-gray-100 mb-2">Descrição</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{complaint.description}</p>
        </div>

        {/* Photos */}
        {complaint.photos.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-gray-100 mb-4">Fotos ({complaint.photos.length})</h3>
            <div className="grid grid-cols-2 gap-3">
              {complaint.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-gray-100 mb-4">Histórico</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#482B83] dark:text-[#8b6fc9]" />
                </div>
                {complaint.createdAt !== complaint.updatedAt && (
                  <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 min-h-8"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-gray-900 dark:text-gray-100">Denúncia criada</p>
                <p className="text-gray-500 dark:text-gray-400">{formatDate(complaint.createdAt)}</p>
              </div>
            </div>

            {complaint.createdAt !== complaint.updatedAt && (
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 ${status.bgColor} rounded-full flex items-center justify-center`}>
                    <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-gray-100">Status atualizado</p>
                  <p className="text-gray-500 dark:text-gray-400">{formatDate(complaint.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className={`rounded-2xl p-6 mb-4 border ${status.borderColor} ${status.bgColor}`}>
          <p className={status.color}>{getStatusMessage()}</p>
        </div>

        {/* Protocol */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-gray-900 dark:text-gray-100 mb-2">Protocolo</h3>
          <p className="text-gray-500 dark:text-gray-400 font-mono">#{complaint.id}</p>
        </div>
      </div>
    </div>
  );
}
