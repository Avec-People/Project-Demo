import React from 'react';
import { useAppState, PROMO_CODES } from '../context/AppStateContext';

export default function PromoModal({ isOpen, onClose }) {
  const { language, setAppliedPromo, dict } = useAppState();

  if (!isOpen) return null;

  const today = new Date("2026-06-16");

  const handleSelectPromo = (promo, isClickable) => {
    if (!isClickable) return;
    setAppliedPromo(promo);
    
    // Auto-fill input in DOM
    const input = document.getElementById("promoInput");
    if (input) {
      input.value = promo.code;
    }
    
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="driver-card-badge promo-dialog" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '340px', height: 'auto', maxHeight: '480px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <button onClick={onClose} className="close-card-btn" aria-label="Close details">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="badge-header" style={{ marginBottom: '12px', paddingBottom: '8px' }}>
          <div className="badge-brand">
            <span className="material-symbols-outlined badge-logo-icon">local_offer</span>
            <span className="badge-logo-text" id="txtPromoModalTitle" style={{ fontSize: '15px' }}>
              {dict.txtPromoModalTitle}
            </span>
          </div>
        </div>

        <div 
          className="badge-body" 
          id="promoCardsList" 
          style={{ width: '100%', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}
        >
          {PROMO_CODES.map(p => {
            const expDate = new Date(p.expiry);
            const diffTime = expDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let cardClass = "promo-card";
            let statusBadge = "";
            let isClickable = true;

            if (diffDays < 0) {
              cardClass += " expired";
              statusBadge = language === "AR" ? "منتهي الصلاحية" : "Expired";
              isClickable = false;
            } else if (diffDays === 1) {
              cardClass += " expiring";
              statusBadge = language === "AR" ? "ينتهي غداً!" : "Expiring tomorrow!";
            } else {
              statusBadge = language === "AR" ? "نشط" : "Active";
            }

            const desc = language === "AR" ? p.descriptionAR : p.description;
            const expiryText = language === "AR" 
              ? `تنتهي الصلاحية: ${expDate.toLocaleDateString('ar-EG')}` 
              : `Expires: ${expDate.toLocaleDateString('en-US')}`;

            return (
              <div 
                key={p.code} 
                className={cardClass}
                style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
                onClick={() => handleSelectPromo(p, isClickable)}
              >
                <div className="promo-card-header">
                  <span className="promo-code-badge">{p.code}</span>
                  <span className="promo-discount" style={{ fontWeight: 700, color: diffDays === 1 ? '#E65100' : 'inherit' }}>
                    {p.discount} OFF
                  </span>
                </div>
                <p className="promo-desc" style={{ fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>
                  {desc}
                </p>
                <div className="promo-expiry" style={{ marginTop: '8px', fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>event</span>
                  <span>{expiryText} &bull; <strong style={{ textTransform: 'uppercase' }}>{statusBadge}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
