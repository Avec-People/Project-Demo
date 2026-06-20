import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { svgToDataUrl } from '../constants/vehicles';

export default function DriverModal({ isOpen, onClose, driver }) {
  const { language, dict } = useAppState();

  if (!isOpen || !driver) return null;

  const handleCall = () => {
    const callingMsg = language === "AR" 
      ? `جاري الاتصال بـ ${driver.driverName}...` 
      : `Calling ${driver.driverName}...`;
    alert(callingMsg);
  };

  const handleShare = () => {
    const isAR = language === "AR";
    const carModelName = isAR ? (driver.nameAR || driver.name) : driver.name;
    const priceEstimated = isAR ? (driver.priceAR || driver.price) : driver.price;

    const text = isAR
      ? `🚗 تفاصيل رحلة AVEC People\n\nالسائق: ${driver.driverName} (التقييم: ${driver.rating.toFixed(2)}⭐)\nالسيارة: ${carModelName}\nرقم اللوحة: ${driver.plate}\nالسعر المقدر: ${priceEstimated}\nانضم إليّ على AVEC People!`
      : `🚗 AVEC People Ride Details\n\nDriver: ${driver.driverName} (Rating: ${driver.rating.toFixed(2)}⭐)\nVehicle: ${driver.name}\nLicense Plate: ${driver.plate}\nEstimated Price: ${driver.price}\nJoin me on AVEC People!`;
    
    const title = isAR ? "تفاصيل سائق AVEC" : "Share my AVEC Driver Details";

    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: window.location.href
      })
      .then(() => console.log('Successfully shared'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Clipboard copy fallback
      const clipboardText = `${title}\n\n${text}\nLink: ${window.location.href}`;
      navigator.clipboard.writeText(clipboardText)
        .then(() => {
          const successMsg = isAR 
            ? "تم نسخ تفاصيل السائق إلى الحافظة! يمكنك الآن لصقها في أي تطبيق مراسلة (واتساب، تليجرام، إلخ)."
            : "Driver details copied to clipboard! You can now paste them into any chatting app (WhatsApp, Telegram, etc.).";
          alert(successMsg);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  // Determine styling based on car level tier
  let ribbonBg = "var(--md-sys-color-primary)";
  let ribbonColor = "#FFF";
  if (driver.carType === "elite") {
    ribbonBg = "gold";
    ribbonColor = "#000";
  } else if (driver.carType === "kid-friendly") {
    ribbonBg = "#EADDFF";
    ribbonColor = "#21005D";
  } else if (driver.carType === "eco") {
    ribbonBg = "#81C784";
    ribbonColor = "#1B5E20";
  }

  const featText = language === "AR" ? (driver.featuresAR ? driver.featuresAR[0] : driver.features[0]) : driver.features[0];
  const carModel = language === "AR" ? (driver.nameAR || driver.name) : driver.name;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="driver-profile-card kyc-modal-container" onClick={(e) => e.stopPropagation()} style={{ 
        width: '360px', 
        padding: '28px 24px', 
        borderRadius: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'relative' 
      }}>
        {/* Top actions */}
        <button onClick={onClose} className="icon-btn" style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <span className="material-symbols-outlined">close</span>
        </button>
        <button onClick={handleShare} className="icon-btn" style={{ position: 'absolute', top: '16px', left: '16px' }}>
          <span className="material-symbols-outlined">ios_share</span>
        </button>

        {/* Profile Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={svgToDataUrl(driver.avatar)} 
              alt="Driver Photo" 
              style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ribbonBg}` }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: ribbonBg,
              color: ribbonColor,
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              {driver.carType}
            </div>
          </div>
          
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginTop: '20px', marginBottom: '4px', textAlign: 'center' }}>
            {driver.driverName}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'center' }}>
            {dict.txtDriverTitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', padding: '16px 0', borderTop: '1px solid rgba(150,150,150,0.15)', borderBottom: '1px solid rgba(150,150,150,0.15)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#FFC107' }}>star</span>
              <span style={{ fontSize: '16px', fontWeight: '700' }}>{driver.rating.toFixed(2)}</span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '4px' }}>{dict.txtRatingLbl}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(150,150,150,0.15)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: '700' }}>{driver.trips.toLocaleString()}</span>
            <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '4px' }}>{dict.txtTripsLbl}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(150,150,150,0.15)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <span style={{ fontSize: '16px', fontWeight: '700' }}>{driver.exp} {language === "AR" ? 'سنوات' : 'yrs'}</span>
            <span style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '4px' }}>{dict.txtExpLbl}</span>
          </div>
        </div>

        {/* Vehicle Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px', padding: '0 8px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(150,150,150,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--md-sys-color-primary)' }}>directions_car</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{carModel}</span>
            <span style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>{driver.plate}</span>
          </div>
          <div style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)', fontWeight: '600' }}>
            {featText}
          </div>
        </div>

        {/* Modern Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button onClick={handleCall} className="m3-btn" style={{ 
            flex: 1, 
            padding: '14px', 
            borderRadius: '16px', 
            border: '1px solid var(--md-sys-color-outline-variant)',
            background: 'transparent',
            color: 'inherit',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>call</span>
          </button>
          <button onClick={onClose} className="m3-btn" style={{ 
            flex: 3, 
            padding: '14px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, var(--md-sys-color-primary) 0%, var(--md-sys-color-tertiary) 100%)',
            color: '#fff',
            fontWeight: '600',
            border: 'none',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <span id="txtSelect" style={{ fontSize: '15px' }}>{dict.txtSelect}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
