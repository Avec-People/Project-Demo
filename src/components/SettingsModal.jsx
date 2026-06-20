import React from 'react';
import { useAppState } from '../context/AppStateContext';

export default function SettingsModal({ isOpen, onClose }) {
  const {
    language, toggleLanguage,
    theme, toggleTheme,
    riders, incrementRider, decrementRider,
    features, toggleFeature,
    dict
  } = useAppState();

  if (!isOpen) return null;

  const maxRiders = features.xl ? 6 : 4;
  const totalRiders = riders.adults + riders.kids + riders.elders;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="driver-card-badge settings-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '340px', 
          height: 'auto', 
          maxHeight: '560px', 
          overflow: 'hidden', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        <button onClick={onClose} className="close-card-btn" aria-label="Close details">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="badge-header" style={{ marginBottom: '14px', paddingBottom: '6px', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
          <div className="badge-brand">
            <span className="material-symbols-outlined badge-logo-icon">settings</span>
            <span className="badge-logo-text" id="txtSettingsTitle" style={{ fontSize: '16px', fontWeight: 600 }}>
              {dict.txtSettings}
            </span>
          </div>
        </div>

        <div 
          className="badge-body" 
          style={{ 
            width: '100%', 
            overflowY: 'auto', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '14px',
            paddingBottom: '8px'
          }}
        >
          {/* Theme Theme Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>
                {language === "AR" ? "المظهر الداكن" : "Dark Theme"}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {language === "AR" ? "تفعيل المظهر الداكن للمنصة" : "Toggle interface appearance"}
              </div>
            </div>
            <button 
              onClick={toggleTheme} 
              className="icon-btn" 
              style={{ backgroundColor: 'var(--md-sys-color-secondary-container)' }}
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>
          </div>

          {/* Language Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13.5px' }}>
                {language === "AR" ? "اللغة" : "Language"}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                {language === "AR" ? "تغيير لغة المنصة" : "Change the language of the portal"}
              </div>
            </div>
            <button 
              onClick={toggleLanguage} 
              className="icon-btn" 
              style={{ backgroundColor: 'var(--md-sys-color-secondary-container)' }}
              title="Change Language"
            >
              <span style={{ fontSize: '12px', fontWeight: 700 }}>
                {language === "EN" ? "AR" : "EN"}
              </span>
            </button>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--md-sys-color-outline-variant)', margin: '2px 0' }} />

          {/* Optional Features */}
          <div>
            <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '10px' }}>
              {language === "AR" ? "الميزات الإضافية" : "Optional Features"}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* AVEC Delivery */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>local_shipping</span>
                    <span>AVEC Delivery</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {language === "AR" ? "تفعيل خيار توصيل الطرود" : "Enable package delivery tab"}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={features.delivery} 
                  onChange={() => toggleFeature('delivery')}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {/* AVEC Personal Shopper */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>shopping_bag</span>
                    <span>AVEC Shopper</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {language === "AR" ? "تفعيل خدمة المتسوق الشخصي" : "Enable personal shopper tab"}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={features.shopper} 
                  onChange={() => toggleFeature('shopper')}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {/* AVEC Pets */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>pets</span>
                    <span>AVEC Pets</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {language === "AR" ? "تفعيل السفر مع الحيوانات الأليفة" : "Traveling with pets option"}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={features.pets} 
                  onChange={() => toggleFeature('pets')}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {/* AVEC Priority */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>bolt</span>
                    <span>AVEC Priority</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {language === "AR" ? "تفعيل الإرسال السريع للسائقين" : "Enable fast driver dispatch badge"}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={features.priority} 
                  onChange={() => toggleFeature('priority')}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {/* AVEC XL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, paddingRight: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>group</span>
                    <span>AVEC XL</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {language === "AR" ? "زيادة حد الركاب في السيارة إلى 6" : "Extend vehicle passenger limit to 6"}
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={features.xl} 
                  onChange={() => toggleFeature('xl')}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--md-sys-color-outline-variant)', margin: '2px 0' }} />

          {/* Default Passengers Config */}
          <div>
            <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '2px' }}>
              {language === "AR" ? "إعدادات الركاب الافتراضية" : "Default Passengers"}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '8px' }}>
              {language === "AR" 
                ? `الحد الأقصى المسموح به هو ${maxRiders} ركاب.` 
                : `A maximum of ${maxRiders} riders are allowed per booking.`}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Adults */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 500 }}>{dict.txtAdults}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => decrementRider('adults')} 
                    className="counter-btn"
                    disabled={riders.adults === 0}
                  >-</button>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{riders.adults}</span>
                  <button 
                    type="button" 
                    onClick={() => incrementRider('adults')} 
                    className="counter-btn"
                    disabled={totalRiders >= maxRiders}
                  >+</button>
                </div>
              </div>

              {/* Kids */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 500 }}>{dict.txtKids}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => decrementRider('kids')} 
                    className="counter-btn"
                    disabled={riders.kids === 0}
                  >-</button>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{riders.kids}</span>
                  <button 
                    type="button" 
                    onClick={() => incrementRider('kids')} 
                    className="counter-btn"
                    disabled={totalRiders >= maxRiders}
                  >+</button>
                </div>
              </div>

              {/* Elders */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 500 }}>{dict.txtElders}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => decrementRider('elders')} 
                    className="counter-btn"
                    disabled={riders.elders === 0}
                  >-</button>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{riders.elders}</span>
                  <button 
                    type="button" 
                    onClick={() => incrementRider('elders')} 
                    className="counter-btn"
                    disabled={totalRiders >= maxRiders}
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button 
              onClick={onClose} 
              className="btn-badge-primary"
              style={{ width: '100%', padding: '8px', fontSize: '13px' }}
            >
              {language === "AR" ? "حفظ الإعدادات" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
