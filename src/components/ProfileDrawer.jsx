import React, { useEffect, useRef } from 'react';
import { useAppState } from '../context/AppStateContext';

export default function ProfileDrawer({ isOpen, onClose }) {
  const { 
    dict, 
    setIsPromoOpen, 
    setIsSettingsOpen, 
    userProfile, 
    setIsRegisterOpen,
    language,
    openChat
  } = useAppState();
  const drawerRef = useRef(null);

  // Close on click outside (deferred to next tick to avoid capturing the opening click event)
  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    const handleOutsideClick = (e) => {
      // Check if it's the trigger button or inside the trigger to prevent toggling issue
      const trigger = document.getElementById("profileTrigger");
      if (trigger && trigger.contains(e.target)) {
        return;
      }
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      if (active) {
        document.addEventListener("click", handleOutsideClick);
      }
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const handlePromosClick = (e) => {
    e.preventDefault();
    setIsPromoOpen(true);
    onClose();
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setIsSettingsOpen(true);
    onClose();
  };

  const handleVerifyClick = (e) => {
    e.preventDefault();
    setIsRegisterOpen(true);
    onClose();
  };

  const handleHelpClick = (e) => {
    e.preventDefault();
    onClose();
    openChat();
  };

  return (
    <aside 
      ref={drawerRef}
      id="profileDrawer"
      className={`drawer-panel right-drawer ${isOpen ? 'open' : ''}`}
    >
      <div className="drawer-header">
        <h3 id="txtMyProfile">{dict.txtMyProfile}</h3>
        <button onClick={onClose} className="icon-btn" id="closeProfileDrawer" aria-label="Close drawer">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div className="drawer-body">
        
        {/* Verification Status Banner / Profile Card */}
        {userProfile.registered ? (
          <div className="profile-card verified" style={{ borderColor: 'rgba(76, 175, 80, 0.3)', background: 'linear-gradient(180deg, rgba(76, 175, 80, 0.05), transparent)' }}>
            <div className="profile-avatar" style={{ backgroundColor: '#4CAF50', color: 'white' }}>
              {userProfile.nickname.slice(0, 2).toUpperCase()}
            </div>
            <h4 className="profile-user-name">{userProfile.englishName || userProfile.nickname}</h4>
            {userProfile.nameAR && <p className="profile-user-email" style={{ fontSize: '12px', fontWeight: 600 }}>{userProfile.nameAR}</p>}
            <p className="profile-user-email">{userProfile.email}</p>
            <div className="profile-status-badge verified" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(46,125,50,0.2)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>verified</span>
              <span>{language === "FR" ? "IDENTITÉ VÉRIFIÉE" : "KYC VERIFIED"}</span>
            </div>

            {/* Extracted Arabic ID details */}
            <div className="profile-verified-ocr-data" style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--md-sys-color-outline-variant)', fontSize: '11px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', direction: 'rtl' }}>
                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>الاسم الكامل:</span>
                <span style={{ fontWeight: 600 }}>{userProfile.nameAR}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>National ID:</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{userProfile.nationalId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{language === "FR" ? "Gouvernorat" : "Governorate"}:</span>
                <span style={{ fontWeight: 600 }}>{userProfile.gov}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{language === "FR" ? "Né(e) le" : "DOB"}:</span>
                <span style={{ fontWeight: 600 }}>{userProfile.birthDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Biometrics:</span>
                <span style={{ display: 'flex', gap: '3px', color: '#4CAF50', fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                  <span>{language === "FR" ? "Face/G/D" : "F/L/R Photos"}</span>
                </span>
              </div>
            </div>

            {/* Emergency Contacts details */}
            {userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0 && (
              <div style={{ width: '100%', marginTop: '12px', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--md-sys-color-error)' }}>emergency</span>
                  <span>{language === "FR" ? "CONTACTS D'URGENCE" : "EMERGENCY CONTACTS"}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {userProfile.emergencyContacts.map((c, i) => (
                    <div key={i} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: 'var(--border-radius-xs)', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                      <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'monospace' }}>{c.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Relatives details */}
            {userProfile.relatives && userProfile.relatives.length > 0 && (
              <div style={{ width: '100%', marginTop: '12px', textAlign: 'left' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--md-sys-color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>group</span>
                  <span>{language === "FR" ? "PROCHES ENREGISTRÉS" : "REGISTERED RELATIVES"}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                  {userProfile.relatives.map((r, i) => (
                    <div key={i} style={{ fontSize: '11px', padding: '6px 10px', borderRadius: 'var(--border-radius-xs)', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid var(--md-sys-color-outline-variant)', display: 'flex', justifyContent: 'space-between' }}>
                      <span><span style={{ fontWeight: 600 }}>{r.name}</span> <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--md-sys-color-primary)', marginLeft: '4px' }}>({language === "FR" ? (r.relationship === 'son' ? 'fils' : r.relationship === 'daughter' ? 'fille' : r.relationship === 'father' ? 'père' : r.relationship === 'mother' ? 'mère' : r.relationship === 'spouse' ? 'conjoint' : 'proche') : r.relationship})</span></span>
                      <span style={{ color: 'var(--md-sys-color-on-surface-variant)', fontFamily: 'monospace' }}>{r.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-card" style={{ borderColor: 'rgba(255, 51, 75, 0.3)', background: 'linear-gradient(180deg, rgba(255, 51, 75, 0.03), transparent)' }}>
            <div className="profile-avatar">G</div>
            <h4 className="profile-user-name">{language === "FR" ? "Utilisateur invité" : "Guest Rider"}</h4>
            <p className="profile-user-email">{language === "FR" ? "Non vérifié" : "Unverified Account"}</p>
            <div className="profile-status-badge" style={{ backgroundColor: '#FFEBEE', color: '#C62828', border: '1px solid rgba(198,40,40,0.15)' }}>
              {language === "FR" ? "NON VÉRIFIÉ" : "VERIFICATION PENDING"}
            </div>
            
            {/* Identity verification trigger button */}
            <button 
              type="button" 
              onClick={handleVerifyClick} 
              className="btn-primary m3-btn" 
              style={{ marginTop: '16px', height: '40px', fontSize: '12px', display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shield</span>
              <span>{language === "FR" ? "Vérifier l'identité (OCR ID)" : "Verify Identity (Arabic OCR)"}</span>
            </button>
          </div>
        )}

        <div className="profile-menu" style={{ marginTop: '10px' }}>
          <a href="#" className="profile-menu-item" onClick={(e) => e.preventDefault()}>
            <span className="material-symbols-outlined">history</span>
            <span id="txtMyTrips">{dict.txtMyTrips}</span>
          </a>
          <a href="#" onClick={handlePromosClick} className="profile-menu-item" id="menuPromotions">
            <span className="material-symbols-outlined">local_offer</span>
            <span id="txtMyPromotions">{dict.txtMyPromotions}</span>
          </a>
          <a href="#" className="profile-menu-item" onClick={(e) => e.preventDefault()}>
            <span className="material-symbols-outlined">payment</span>
            <span id="txtPayments">{dict.txtPayments}</span>
          </a>
          <a href="#" onClick={handleSettingsClick} className="profile-menu-item" id="menuSettings">
            <span className="material-symbols-outlined">settings</span>
            <span id="txtSettings">{dict.txtSettings}</span>
          </a>
          <a href="#" className="profile-menu-item" onClick={handleHelpClick}>
            <span className="material-symbols-outlined">help</span>
            <span id="txtHelp">{dict.txtHelp}</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
