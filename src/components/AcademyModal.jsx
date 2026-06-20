import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';

export default function AcademyModal({ isOpen, onClose }) {
  const { language, pushNotification } = useAppState();
  const [role, setRole] = useState('trainee');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert(language === "AR" ? "يرجى ملء جميع الحقول المطلوبة." : "Please fill in all required fields.");
      return;
    }

    pushNotification(
      language === "AR" ? "تم استلام طلب الأكاديمية" : "Academy Application Received",
      language === "AR" 
        ? `شكراً ${name}، سنقوم بمراجعة طلبك كـ ${role === 'trainer' ? 'مدرب' : 'متدرب'} والتواصل معك قريباً.` 
        : `Thank you ${name}, we will review your application as a ${role} and contact you soon.`,
      "success"
    );
    
    // Reset and close
    setRole('trainee');
    setName('');
    setPhone('');
    setExperience('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 2100, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="driver-card-badge kyc-modal-container" onClick={(e) => e.stopPropagation()} style={{ zIndex: 2200, padding: '24px', width: '480px', maxWidth: '90vw' }}>
        <div className="modal-header">
          <h2>{language === "AR" ? "التسجيل في أكاديمية AVEC" : "AVEC Academy Registration"}</h2>
          <button onClick={onClose} className="icon-btn"><span className="material-symbols-outlined">close</span></button>
        </div>
        
        <div className="modal-body">
          <p style={{ marginBottom: '20px', color: 'var(--md-sys-color-on-surface-variant)' }}>
            {language === "AR" 
              ? "انضم إلى أكاديمية AVEC لتطوير مهاراتك أو تدريب السائقين الجدد." 
              : "Join the AVEC Academy to enhance your skills or train new drivers."}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Role Selection Toggle */}
            <div className="m3-tabs-container" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button 
                type="button"
                className={`m3-tab-btn ${role === 'trainee' ? 'active' : ''}`}
                onClick={() => setRole('trainee')}
                style={{ flex: 1, padding: '12px', border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: '8px', background: role === 'trainee' ? 'var(--md-sys-color-primary-container)' : 'transparent' }}
              >
                {language === "AR" ? "متدرب" : "Trainee"}
              </button>
              <button 
                type="button"
                className={`m3-tab-btn ${role === 'trainer' ? 'active' : ''}`}
                onClick={() => setRole('trainer')}
                style={{ flex: 1, padding: '12px', border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: '8px', background: role === 'trainer' ? 'var(--md-sys-color-primary-container)' : 'transparent' }}
              >
                {language === "AR" ? "مدرب" : "Trainer"}
              </button>
            </div>

            <div className="input-group">
              <label>{language === "AR" ? "الاسم الكامل" : "Full Name"}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={language === "AR" ? "أدخل اسمك" : "Enter your name"} className="m3-input" />
            </div>

            <div className="input-group">
              <label>{language === "AR" ? "رقم الهاتف" : "Phone Number"}</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+201..." className="m3-input" />
            </div>

            {role === 'trainer' && (
              <div className="input-group">
                <label>{language === "AR" ? "سنوات الخبرة" : "Years of Experience"}</label>
                <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} required min="1" placeholder="e.g. 5" className="m3-input" />
              </div>
            )}

            <button type="submit" className="m3-btn btn-primary" style={{ marginTop: '16px' }}>
              {language === "AR" ? "إرسال الطلب" : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
