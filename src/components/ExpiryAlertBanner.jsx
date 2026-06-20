import React from 'react';
import { useAppState } from '../context/AppStateContext';

export default function ExpiryAlertBanner() {
  const { language, expiryAlert, setExpiryAlert } = useAppState();

  if (!expiryAlert) return null;

  const handleClose = () => {
    setExpiryAlert(null);
  };

  const isAR = language === "AR";
  
  const alertMsg = isAR 
    ? `تنبيه: الرمز الترويجي ${expiryAlert.code} ستنتهي صلاحيته غداً! وفر ${expiryAlert.discount} من قيمة رحلتك.` 
    : `Reminder: Promo code ${expiryAlert.code} is expiring tomorrow! Save ${expiryAlert.discount} on your ride.`;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 2000,
      background: 'var(--color-glass-bg-dark)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '20px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
      maxWidth: '380px',
      color: '#E8E7EE',
      animation: 'slideUp 0.5s cubic-bezier(0.2, 0, 0, 1.0)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
        borderRadius: '16px',
        width: '48px',
        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(221, 36, 118, 0.3)'
      }}>
        <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '24px' }}>local_offer</span>
      </div>
      
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: '#FFF' }}>
          {language === "AR" ? "عرض حصري لك!" : "Exclusive Offer!"}
        </h4>
        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.4', color: 'rgba(255,255,255,0.7)' }}>
          {alertMsg}
        </p>
      </div>

      <button onClick={handleClose} style={{
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
      </button>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
