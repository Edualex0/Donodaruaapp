import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './components/HomePage';
import { TrackComplaintsPage } from './components/TrackComplaintsPage';
import { SettingsPage } from './components/SettingsPage';
import { ComplaintDetailPage } from './components/ComplaintDetailPage';
import { MapPage } from './components/MapPage';

export type Page = 'login' | 'register' | 'home' | 'track' | 'settings' | 'complaint-detail' | 'map';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  type: string;
  description: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  severity: 'low' | 'medium' | 'high';
  photos: string[];
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  upvotes: number;
  upvotedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [user, setUser] = useState<User | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Maria Silva',
      type: 'Bueiro aberto',
      description: 'Bueiro sem tampa na esquina, muito perigoso',
      location: 'Rua da Aurora, 123',
      coordinates: { lat: -8.0631, lng: -34.8731 },
      severity: 'high',
      photos: [],
      status: 'in-progress',
      upvotes: 16,
      upvotedBy: ['1', '3', '4', '5'],
      createdAt: '2025-11-20T10:00:00',
      updatedAt: '2025-11-22T14:30:00'
    },
    {
      id: '2',
      userId: '3',
      userName: 'João Santos',
      type: 'Calçada danificada',
      description: 'Calçada quebrada em frente ao mercado',
      location: 'Av. Boa Viagem, 2500',
      coordinates: { lat: -8.1282, lng: -34.8978 },
      severity: 'medium',
      photos: [],
      status: 'pending',
      upvotes: 8,
      upvotedBy: ['2'],
      createdAt: '2025-11-25T15:20:00',
      updatedAt: '2025-11-25T15:20:00'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Ana Costa',
      type: 'Falta de iluminação',
      description: 'Poste de luz queimado há 2 semanas, área muito escura à noite',
      location: 'Rua do Hospício, 456',
      coordinates: { lat: -8.0595, lng: -34.8717 },
      severity: 'high',
      photos: [],
      status: 'pending',
      upvotes: 23,
      upvotedBy: ['2', '3'],
      createdAt: '2025-11-26T08:15:00',
      updatedAt: '2025-11-26T08:15:00'
    },
    {
      id: '4',
      userId: '5',
      userName: 'Pedro Oliveira',
      type: 'Buraco na rua',
      description: 'Buraco grande que está causando acidentes',
      location: 'Av. Agamenon Magalhães, 1000',
      coordinates: { lat: -8.0476, lng: -34.8946 },
      severity: 'high',
      photos: [],
      status: 'resolved',
      upvotes: 42,
      upvotedBy: ['2', '3', '4'],
      createdAt: '2025-11-15T14:00:00',
      updatedAt: '2025-11-27T10:00:00'
    }
  ]);

  const handleLogin = (email: string, password: string) => {
    // Mock login
    setUser({
      id: '1',
      name: 'Usuário Demo',
      email: email,
      phone: '(11) 98765-4321'
    });
    setCurrentPage('home');
  };

  const handleRegister = (name: string, email: string, password: string, phone?: string) => {
    // Mock register
    setUser({
      id: Date.now().toString(),
      name: name,
      email: email,
      phone: phone
    });
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const handleCreateComplaint = (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'userName' | 'upvotes' | 'upvotedBy'>) => {
    if (!user) return;
    
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setComplaints([newComplaint, ...complaints]);
  };

  const handleUpvote = (complaintId: string) => {
    if (!user) return;

    setComplaints(complaints.map(complaint => {
      if (complaint.id === complaintId) {
        const hasUpvoted = complaint.upvotedBy.includes(user.id);
        
        if (hasUpvoted) {
          // Remove upvote
          return {
            ...complaint,
            upvotes: complaint.upvotes - 1,
            upvotedBy: complaint.upvotedBy.filter(id => id !== user.id)
          };
        } else {
          // Add upvote
          return {
            ...complaint,
            upvotes: complaint.upvotes + 1,
            upvotedBy: [...complaint.upvotedBy, user.id]
          };
        }
      }
      return complaint;
    }));
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const handleViewComplaint = (complaintId: string) => {
    setSelectedComplaintId(complaintId);
    setCurrentPage('complaint-detail');
  };

  const handleDeleteComplaint = (complaintId: string) => {
    setComplaints(complaints.filter(complaint => complaint.id !== complaintId));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onNavigateToRegister={() => navigateTo('register')}
          darkMode={darkMode}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          onRegister={handleRegister}
          onNavigateToLogin={() => navigateTo('login')}
          darkMode={darkMode}
        />
      )}
      {currentPage === 'home' && user && (
        <HomePage 
          user={user}
          onNavigate={navigateTo}
          onCreateComplaint={handleCreateComplaint}
          darkMode={darkMode}
        />
      )}
      {currentPage === 'track' && user && (
        <TrackComplaintsPage 
          user={user}
          complaints={complaints}
          onNavigate={navigateTo}
          onViewComplaint={handleViewComplaint}
          onUpvote={handleUpvote}
          onDeleteComplaint={handleDeleteComplaint}
          darkMode={darkMode}
        />
      )}
      {currentPage === 'map' && user && (
        <MapPage 
          user={user}
          complaints={complaints}
          onNavigate={navigateTo}
          onViewComplaint={handleViewComplaint}
          darkMode={darkMode}
        />
      )}
      {currentPage === 'complaint-detail' && user && selectedComplaint && (
        <ComplaintDetailPage 
          complaint={selectedComplaint}
          onNavigate={navigateTo}
          darkMode={darkMode}
        />
      )}
      {currentPage === 'settings' && user && (
        <SettingsPage 
          user={user}
          onNavigate={navigateTo}
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}
