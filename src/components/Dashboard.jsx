import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import MapViewport from './MapViewport';

export default function Dashboard({ onSelectDriver, openBookingPanel, openDeliveryPanel, openAcademyModal }) {
  const { userProfile, dict, language, setIsRegisterOpen, pushNotification } = useAppState();

  const handleBookClick = () => {
    if (!userProfile.registered) {
      setIsRegisterOpen(true);
    } else {
      openBookingPanel();
    }
  };

  const handleDeliveryClick = () => {
    if (!userProfile.registered) {
      setIsRegisterOpen(true);
    } else {
      openDeliveryPanel();
    }
  };

  const activateSOS = () => {
    pushNotification(
      language === "AR" ? "تفعيل حالة الطوارئ!" : "SOS Emergency Activated!",
      language === "AR" ? "تم إرسال موقعك المباشر. جاري الاتصال بجهات الاتصال للطوارئ..." : "Live location shared. Dialing emergency contacts...",
      "error"
    );
    
    if (userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0) {
      const contact = userProfile.emergencyContacts[0];
      setTimeout(() => {
        alert(language === "AR" ? `جاري الاتصال بـ ${contact.name} (${contact.phone})...` : `Dialing ${contact.name} (${contact.phone})...`);
      }, 500);
    } else {
      setTimeout(() => {
        alert(language === "AR" ? "جاري الاتصال بالطوارئ (122)..." : "Dialing 911 / Emergency Services...");
      }, 500);
    }
  };

  const greeting = language === "AR" 
    ? `مرحباً بك، ${userProfile.registered ? userProfile.nickname : 'زائر'}`
    : `Welcome back, ${userProfile.registered ? userProfile.nickname : 'Guest'}!`;

  const statusMsg = userProfile.registered 
    ? (language === "AR" ? "حسابك موثق وجاهز للانطلاق" : "Your account is verified and ready to go.")
    : (language === "AR" ? "يرجى توثيق حسابك للاستفادة من جميع الميزات" : "Please verify your account to unlock all features.");

  return (
    <div className="dashboard-container">
      {/* Top Banner / Welcome Section */}
      <header className="dashboard-banner">
        <div className="dashboard-banner-content">
          <h1 className="dashboard-greeting">{greeting}</h1>
          <p className="dashboard-status">{statusMsg}</p>
          
          {!userProfile.registered && (
            <button 
              onClick={() => setIsRegisterOpen(true)}
              className="m3-btn btn-primary dashboard-verify-btn"
            >
              <span className="material-symbols-outlined">shield</span>
              <span>{language === "AR" ? "توثيق الهوية" : "Verify Identity"}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Grid Area */}
      <div className="dashboard-grid">
        
        {/* Quick Actions (Left Column) */}
        <div className="dashboard-actions-column">
          <h2 className="dashboard-section-title">
            {language === "AR" ? "الخدمات السريعة" : "Quick Actions"}
          </h2>
          
          <div className="dashboard-cards-grid">
            <div className="dashboard-card action-card" onClick={handleBookClick}>
              <div className="card-icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-tertiary) 100%)' }}>
                <span className="material-symbols-outlined">directions_car</span>
              </div>
              <h3>{language === "AR" ? "حجز مشوار" : "Book a Ride"}</h3>
              <p>{language === "AR" ? "احجز لك أو لعائلتك" : "Book for you or family"}</p>
            </div>

            <div className="dashboard-card action-card" onClick={handleDeliveryClick}>
              <div className="card-icon-wrapper" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #FF5722 100%)' }}>
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <h3>{language === "AR" ? "توصيل طرود" : "Send Package"}</h3>
              <p>{language === "AR" ? "شحن سريع وموثوق" : "Fast & reliable delivery"}</p>
            </div>

            <div className="dashboard-card action-card" onClick={openAcademyModal}>
              <div className="card-icon-wrapper" style={{ background: 'linear-gradient(135deg, #00BCD4 0%, #1976D2 100%)' }}>
                <span className="material-symbols-outlined">school</span>
              </div>
              <h3>{language === "AR" ? "أكاديمية AVEC" : "AVEC Academy"}</h3>
              <p>{language === "AR" ? "سجل كمدرب أو متدرب" : "Register as Trainer/Trainee"}</p>
            </div>

            <div className="dashboard-card action-card" onClick={activateSOS}>
              <div className="card-icon-wrapper" style={{ background: 'linear-gradient(135deg, var(--md-sys-color-error) 0%, #C62828 100%)' }}>
                <span className="material-symbols-outlined">emergency</span>
              </div>
              <h3>{language === "AR" ? "طوارئ SOS" : "SOS Emergency"}</h3>
              <p>{language === "AR" ? "طلب مساعدة فورية" : "Request immediate help"}</p>
            </div>
          </div>

          <h2 className="dashboard-section-title" style={{ marginTop: '24px' }}>
            {language === "AR" ? "النشاط الأخير" : "Recent Activity"}
          </h2>
          <div className="dashboard-activity-list">
            <div className="dashboard-activity-item dashboard-card">
              <div className="activity-icon" style={{color: 'var(--md-sys-color-on-surface-variant)'}}><span className="material-symbols-outlined">history</span></div>
              <div className="activity-details">
                <h4>{language === "AR" ? "لا توجد رحلات سابقة" : "No recent trips"}</h4>
                <p>{language === "AR" ? "ابدأ رحلتك الأولى الآن!" : "Start your first ride now!"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Widget (Right Column) */}
        <div className="dashboard-map-column">
          <div className="dashboard-map-widget dashboard-card">
            <div className="map-widget-header">
              <h3>{language === "AR" ? "رادار المركبات المتاحة" : "Live Vehicles Radar"}</h3>
              <span className="live-indicator">
                <span className="pulse-dot"></span> LIVE
              </span>
            </div>
            <div className="map-widget-container">
              <MapViewport onSelectDriver={onSelectDriver} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
