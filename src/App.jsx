import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/admin/AdminDashboard';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import Header from './components/Header';
import BookingPanel from './components/BookingPanel';
import MapViewport from './components/MapViewport';
import Dashboard from './components/Dashboard';
import DriverModal from './components/DriverModal';
import PromoModal from './components/PromoModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import ProfileDrawer from './components/ProfileDrawer';
import ChatSparkDrawer from './components/ChatSparkDrawer';
import ExpiryAlertBanner from './components/ExpiryAlertBanner';
import SettingsModal from './components/SettingsModal';
import RegisterModal from './components/RegisterModal';
import AcademyModal from './components/AcademyModal';

function MainLayout() {
  const {
    isPromoOpen, setIsPromoOpen,
    isNotificationsOpen, closeNotifications,
    isProfileOpen, setIsProfileOpen,
    isSettingsOpen, setIsSettingsOpen
  } = useAppState();

  const [activeDriver, setActiveDriver] = useState(null);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTab, setBookingTab] = useState('ride');
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);

  const handleSelectDriver = (driver) => {
    setActiveDriver(driver);
    setIsDriverModalOpen(true);
  };

  return (
    <>
      {/* Expiry Alert Banner at the top */}
      <ExpiryAlertBanner />

      {/* App Header */}
      <Header />

      {/* App Main Area (Dashboard) */}
      <main className="app-container" style={{ display: 'block', overflowY: 'auto' }}>
        <Dashboard 
          onSelectDriver={handleSelectDriver}
          openBookingPanel={() => { setBookingTab('ride'); setIsBookingOpen(true); }}
          openDeliveryPanel={() => { setBookingTab('delivery'); setIsBookingOpen(true); }}
          openAcademyModal={() => setIsAcademyOpen(true)}
        />
      </main>

      {/* Drawers and Dialog Modals */}
      <BookingPanel 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        initialTab={bookingTab} 
      />
      <DriverModal 
        isOpen={isDriverModalOpen} 
        onClose={() => setIsDriverModalOpen(false)} 
        driver={activeDriver} 
      />

      <PromoModal 
        isOpen={isPromoOpen} 
        onClose={() => setIsPromoOpen(false)} 
      />

      <NotificationsDrawer 
        isOpen={isNotificationsOpen} 
        onClose={closeNotifications} 
      />

      <ProfileDrawer 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <RegisterModal />
      
      <AcademyModal 
        isOpen={isAcademyOpen} 
        onClose={() => setIsAcademyOpen(false)} 
      />

      {/* Floating Chatbot FAB */}
      <ChatSparkDrawer />
    </>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route path="/*" element={<MainLayout />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </AppStateProvider>
  );
}
