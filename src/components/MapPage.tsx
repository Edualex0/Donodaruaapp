import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Filter, X } from 'lucide-react';
import { Complaint, Page, User } from '../App';
import { BottomNav } from './BottomNav';

interface MapPageProps {
  user: User;
  complaints: Complaint[];
  onNavigate: (page: Page) => void;
  onViewComplaint: (complaintId: string) => void;
  darkMode: boolean;
}

// Define Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

export function MapPage({ user, complaints, onNavigate, onViewComplaint, darkMode }: MapPageProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  const [locationErrorMessage, setLocationErrorMessage] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const statusColors = {
    pending: '#f59e0b',
    'in-progress': '#482B83',
    resolved: '#10b981',
    rejected: '#ef4444'
  };

  const statusLabels = {
    pending: 'Pendente',
    'in-progress': 'Em Análise',
    resolved: 'Resolvida',
    rejected: 'Rejeitada'
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      setIsLoading(false);
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (isLoading || !window.L || !mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Recife
    const map = window.L.map(mapRef.current).setView([-8.0476, -34.8770], 13);

    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    // Fix for marker icons
    delete window.L.Icon.Default.prototype._getIconUrl;
    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoading]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter complaints
    const filteredComplaints = complaints.filter(complaint => {
      if (!complaint.coordinates) return false;
      if (selectedFilter === 'all') return true;
      return complaint.status === selectedFilter;
    });

    // Add markers for each complaint with coordinates
    filteredComplaints.forEach(complaint => {
      if (!complaint.coordinates) return;

      // Create custom icon based on status
      const icon = window.L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${statusColors[complaint.status]};
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            transform: rotate(-45deg);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = window.L.marker(
        [complaint.coordinates.lat, complaint.coordinates.lng],
        { icon }
      ).addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui;">
          <div style="
            background-color: ${statusColors[complaint.status]};
            color: white;
            padding: 8px;
            margin: -10px -10px 10px -10px;
            border-radius: 4px 4px 0 0;
            font-weight: 500;
          ">
            ${statusLabels[complaint.status]}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${complaint.type}
            </h3>
            <span style="
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 500;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              ${complaint.severity === 'high' 
                ? 'background-color: #fee; color: #b91c1c;' 
                : complaint.severity === 'medium' 
                ? 'background-color: #fef3c7; color: #92400e;' 
                : 'background-color: #d1fae5; color: #065f46;'}
            ">
              <span style="
                width: 6px;
                height: 6px;
                border-radius: 50%;
                ${complaint.severity === 'high' 
                  ? 'background-color: #ef4444;' 
                  : complaint.severity === 'medium' 
                  ? 'background-color: #f59e0b;' 
                  : 'background-color: #10b981;'}
              "></span>
              ${complaint.severity === 'high' ? 'Grave' : complaint.severity === 'medium' ? 'Moderado' : 'Leve'}
            </span>
          </div>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            ${complaint.location}
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #4b5563; line-height: 1.4;">
            ${complaint.description.length > 80 ? complaint.description.substring(0, 80) + '...' : complaint.description}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #9ca3af; margin-bottom: 12px;">
            <span>Por ${complaint.userName}</span>
            <span>↑ ${complaint.upvotes} apoios</span>
          </div>
          <button 
            onclick="window.viewComplaint('${complaint.id}')"
            style="
              width: 100%;
              background-color: #482B83;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            "
            onmouseover="this.style.backgroundColor='#3a2268'"
            onmouseout="this.style.backgroundColor='#482B83'"
          >
            Ver Detalhes
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (filteredComplaints.length > 0) {
      const bounds = filteredComplaints
        .filter(c => c.coordinates)
        .map(c => [c.coordinates!.lat, c.coordinates!.lng]);
      
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [complaints, selectedFilter]);

  // Global function to view complaint from popup
  useEffect(() => {
    (window as any).viewComplaint = (complaintId: string) => {
      onViewComplaint(complaintId);
    };

    return () => {
      delete (window as any).viewComplaint;
    };
  }, [onViewComplaint]);

  const centerOnUser = () => {
    if (!navigator.geolocation) {
      setLocationErrorMessage('Seu navegador não suporta geolocalização');
      setShowLocationError(true);
      setTimeout(() => setShowLocationError(false), 3000);
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        
        if (mapInstanceRef.current && window.L) {
          mapInstanceRef.current.setView(
            [position.coords.latitude, position.coords.longitude],
            15
          );
          
          // Add a marker for user location
          const userIcon = window.L.divIcon({
            className: 'user-location-marker',
            html: `
              <div style="
                background-color: #3b82f6;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              "></div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          window.L.marker(
            [position.coords.latitude, position.coords.longitude],
            { icon: userIcon }
          ).addTo(mapInstanceRef.current)
            .bindPopup('Você está aqui');
        }
      },
      (error) => {
        setIsLocating(false);
        
        let message = 'Não foi possível acessar sua localização';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permissão de localização negada. Habilite nas configurações do navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Localização indisponível no momento';
            break;
          case error.TIMEOUT:
            message = 'Tempo esgotado ao buscar localização';
            break;
        }
        
        setLocationErrorMessage(message);
        setShowLocationError(true);
        setTimeout(() => setShowLocationError(false), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const filterOptions = [
    { value: 'all', label: 'Todas', color: '#6b7280' },
    { value: 'pending', label: 'Pendentes', color: statusColors.pending },
    { value: 'in-progress', label: 'Em Análise', color: statusColors['in-progress'] },
    { value: 'resolved', label: 'Resolvidas', color: statusColors.resolved },
  ];

  const complaintCounts = {
    all: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    'in-progress': complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between z-10 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-gray-900 dark:text-gray-100 truncate">Mapa de Denúncias</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {complaints.filter(c => c.coordinates).length} denúncias no mapa
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={centerOnUser}
            disabled={isLocating}
            className={`p-2 bg-[#482B83] dark:bg-[#6b4cb3] text-white rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-all active:scale-95 ${
              isLocating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Centralizar no meu local"
            aria-label="Centralizar no meu local"
          >
            <Navigation className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
          </button>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="p-2 bg-[#482B83] dark:bg-[#6b4cb3] text-white rounded-lg hover:bg-[#3a2268] dark:hover:bg-[#8b6fc9] transition-all active:scale-95 relative"
            title="Filtrar denúncias"
            aria-label="Filtrar denúncias"
          >
            <Filter className="w-5 h-5" />
            {selectedFilter !== 'all' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Filter Menu */}
      {showFilterMenu && (
        <div className="absolute top-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-20 min-w-[240px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 dark:text-gray-100">Filtrar por status</h3>
            <button
              onClick={() => setShowFilterMenu(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setSelectedFilter(option.value);
                  setShowFilterMenu(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedFilter === option.value
                    ? 'bg-[#482B83]/10 dark:bg-[#6b4cb3]/20 border-2 border-[#482B83] dark:border-[#6b4cb3]'
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-gray-900 dark:text-gray-100">{option.label}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-400 font-semibold">
                  {complaintCounts[option.value as keyof typeof complaintCounts]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-10">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-[#482B83] dark:text-[#6b4cb3] mx-auto mb-3 animate-pulse" />
              <p className="text-gray-600 dark:text-gray-400">Carregando mapa...</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Legend */}
        <div className="absolute bottom-20 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-10">
          <h4 className="text-gray-900 dark:text-gray-100 text-sm font-semibold mb-2">Legenda</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.pending }} />
              <span className="text-xs text-gray-700 dark:text-gray-300">Pendente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors['in-progress'] }} />
              <span className="text-xs text-gray-700 dark:text-gray-300">Em Análise</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: statusColors.resolved }} />
              <span className="text-xs text-gray-700 dark:text-gray-300">Resolvida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentPage="map" onNavigate={onNavigate} darkMode={darkMode} />

      {/* Location Error Toast */}
      {showLocationError && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in max-w-sm mx-4">
          <div className="bg-red-600 dark:bg-red-700 text-white px-6 py-4 rounded-xl shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">Erro de localização</p>
                <p className="text-sm text-red-100">
                  {locationErrorMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
