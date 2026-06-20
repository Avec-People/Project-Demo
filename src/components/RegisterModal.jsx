import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';

export default function RegisterModal() {
  const {
    language,
    isRegisterOpen,
    setIsRegisterOpen,
    registerUser,
    dict
  } = useAppState();

  const [step, setStep] = useState(1); // 1: Credentials, 2: ID Scan, 3: KYC Selfie, 4: Emergency & Relatives, 5: Success
  const [mode, setMode] = useState('register'); // 'register' or 'login'

  // Form states
  const [nickname, setNickname] = useState("");
  const [englishName, setEnglishName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // OCR simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("");
  const [isOcrDone, setIsOcrDone] = useState(false);
  const [nameAR, setNameAR] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [gov, setGov] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // KYC Photo states
  const [photos, setPhotos] = useState({
    front: null,
    left: null,
    right: null
  });
  const [capturingAngle, setCapturingAngle] = useState(null); // 'front', 'left', 'right' or null
  const [cameraStreamSim, setCameraStreamSim] = useState(false);

  // Emergency contacts: up to 3, at least 1 mandatory
  const [emergencyContacts, setEmergencyContacts] = useState([
    { name: "", phone: "" }
  ]);

  // Relatives: up to 5
  const [relatives, setRelatives] = useState([]);

  const [validationError, setValidationError] = useState("");

  if (!isRegisterOpen) return null;

  // Validation functions
  const validateStep1 = () => {
    if (!nickname.trim()) return language === "FR" ? "Le pseudonyme est requis." : "Nickname is required.";
    if (!englishName.trim()) return language === "FR" ? "Le nom en anglais est requis." : "English Name is required.";
    if (!email.trim() || !email.includes("@")) return language === "FR" ? "Adresse e-mail valide requise." : "Valid email is required.";
    if (password.length < 6) return language === "FR" ? "Le mot de passe doit contenir au moins 6 caractères." : "Password must be at least 6 characters.";
    return null;
  };

  const validateStep2 = () => {
    if (!isOcrDone) return language === "FR" ? "Veuillez numériser votre carte d'identité." : "Please scan your national ID card.";
    if (!nameAR.trim()) return language === "FR" ? "Le nom en arabe est requis." : "Name in Arabic is required.";
    
    // Validate English Name matches Arabic Name from ID
    const mockTransliteration = nameAR === "أحمد محمد مصطفى السيد" ? "ahmed mohamed mostafa elsayed" : "";
    if (mockTransliteration && englishName.toLowerCase().trim() !== mockTransliteration) {
      return language === "FR" 
        ? "Le nom enregistré en anglais ne correspond pas au nom arabe sur la pièce d'identité." 
        : "Registered name in English must match the name on the ID when converted to Arabic.";
    }

    if (nationalId.trim().length !== 14 || isNaN(nationalId)) {
      return language === "FR" ? "Le numéro de carte nationale doit comporter 14 chiffres." : "National ID must be exactly 14 digits.";
    }
    if (!gov.trim()) return language === "FR" ? "Le gouvernorat est requis." : "Governorate is required.";
    if (!birthDate.trim()) return language === "FR" ? "La date de naissance est requise." : "Birth date is required.";
    return null;
  };

  const validateStep3 = () => {
    if (!photos.front || !photos.left || !photos.right) {
      return language === "FR" 
        ? "Veuillez prendre les trois photos KYC (Face, Gauche, Droite)." 
        : "Please take all three KYC photos (Front, Left, Right).";
    }
    return null;
  };

  const validateStep4 = () => {
    // At least 1 emergency contact is mandatory
    const filledEmergency = emergencyContacts.filter(c => c.name.trim() && c.phone.trim());
    if (filledEmergency.length === 0) {
      return language === "FR" 
        ? "Au moins un contact d'urgence complet est obligatoire." 
        : "At least one emergency contact is mandatory.";
    }
    
    // Check relatives
    for (let i = 0; i < relatives.length; i++) {
      const rel = relatives[i];
      if (!rel.name.trim() || !rel.phone.trim() || !rel.relationship.trim()) {
        return language === "FR"
          ? `Veuillez remplir tous les champs pour le proche #${i + 1}.`
          : `Please fill in all fields for relative #${i + 1}.`;
      }
    }
    return null;
  };

  const handleNext = () => {
    setValidationError("");
    if (step === 1) {
      const err = validateStep1();
      if (err) { setValidationError(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setValidationError(err); return; }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setValidationError(err); return; }
      setStep(4);
    } else if (step === 4) {
      const err = validateStep4();
      if (err) { setValidationError(err); return; }
      // Compile & Register
      const profileData = {
        nickname,
        englishName,
        email,
        password,
        nameAR,
        nationalId,
        gov,
        birthDate,
        kycPhotos: photos,
        emergencyContacts: emergencyContacts.filter(c => c.name.trim() && c.phone.trim()),
        relatives: relatives.filter(r => r.name.trim() && r.phone.trim() && r.relationship.trim()),
        gender: parseInt(nationalId[12] || '1', 10) % 2 === 0 ? "female" : "male"
      };
      registerUser(profileData);
      setStep(5);
    }
  };

  const handleLogin = () => {
    setValidationError("");
    if (!email.trim() || !email.includes("@")) return setValidationError(language === "FR" ? "Adresse e-mail valide requise." : "Valid email is required.");
    if (password.length < 6) return setValidationError(language === "FR" ? "Le mot de passe doit contenir au moins 6 caractères." : "Password must be at least 6 characters.");
    
    // Mock login with some default data
    const profileData = {
      nickname: "AVEC User",
      englishName: "AVEC Registered User",
      email: email,
      password: password,
      nameAR: "مستخدم أفيك",
      nationalId: "12345678901234",
      gov: "Cairo",
      birthDate: "1990-01-01",
      kycPhotos: {},
      emergencyContacts: [],
      relatives: []
    };
    registerUser(profileData);
    setIsRegisterOpen(false);
  };

  const handlePrev = () => {
    setValidationError("");
    if (step > 1) setStep(step - 1);
  };

  // OCR Scanner Simulator
  const startOcrScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setIsOcrDone(false);
    setValidationError("");

    const statuses = [
      language === "FR" ? "Recherche de la carte d'identité..." : "Searching for National ID card...",
      language === "FR" ? "Alignement du cadre de capture..." : "Aligning scan frames...",
      language === "FR" ? "Lecture des caractères arabes (OCR)..." : "Reading Arabic typeface (OCR)...",
      language === "FR" ? "Validation des filigranes officiels..." : "Validating security holograms...",
      language === "FR" ? "Données extraites !" : "Data successfully parsed!"
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setScanProgress(currentProgress);
      
      const statusIdx = Math.min(Math.floor(currentProgress / 25), statuses.length - 1);
      setScanStatus(statuses[statusIdx]);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setIsOcrDone(true);
          setNameAR("أحمد محمد مصطفى السيد");
          setNationalId("29408150102345");
          setGov(language === "FR" ? "القاهرة" : "Cairo");
          setBirthDate("1994-08-15");
        }, 300);
      }
    }, 250);
  };

  // KYC Selfie capture simulation
  const startCameraCapture = (angle) => {
    setCapturingAngle(angle);
    setCameraStreamSim(true);
  };

  const triggerCaptureSnapshot = () => {
    setTimeout(() => {
      // Mock captured data url/state
      setPhotos(prev => ({
        ...prev,
        [capturingAngle]: `captured-${capturingAngle}-${Date.now()}`
      }));
      setCameraStreamSim(false);
      setCapturingAngle(null);
    }, 800);
  };

  // Emergency contact handlers
  const handleAddEmergency = () => {
    if (emergencyContacts.length < 3) {
      setEmergencyContacts([...emergencyContacts, { name: "", phone: "" }]);
    }
  };

  const handleRemoveEmergency = (idx) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== idx));
    } else {
      // Reset if it's the last remaining one
      setEmergencyContacts([{ name: "", phone: "" }]);
    }
  };

  const handleEmergencyChange = (idx, field, value) => {
    const updated = emergencyContacts.map((c, i) => {
      if (i === idx) return { ...c, [field]: value };
      return c;
    });
    setEmergencyContacts(updated);
  };

  // Relatives handlers
  const handleAddRelative = () => {
    if (relatives.length < 5) {
      setRelatives([...relatives, { name: "", phone: "", relationship: "son" }]);
    }
  };

  const handleRemoveRelative = (idx) => {
    setRelatives(relatives.filter((_, i) => i !== idx));
  };

  const handleRelativeChange = (idx, field, value) => {
    const updated = relatives.map((r, i) => {
      if (i === idx) return { ...r, [field]: value };
      return r;
    });
    setRelatives(updated);
  };

  const handleClose = () => {
    setIsRegisterOpen(false);
    // Do not reset step 5 success state, but reset details if closed beforehand
    if (step === 5) {
      setStep(1);
      // Reset variables
      setNickname("");
      setEnglishName("");
      setEmail("");
      setPassword("");
      setIsOcrDone(false);
      setNameAR("");
      setNationalId("");
      setGov("");
      setBirthDate("");
      setPhotos({ front: null, left: null, right: null });
      setEmergencyContacts([{ name: "", phone: "" }]);
      setRelatives([]);
    }
  };

  return (
    <div className="modal-backdrop kyc-modal-backdrop">
      <div className="driver-card-badge kyc-modal-container" style={{ width: '480px', maxWidth: '90vw', height: 'auto', maxHeight: '85vh', overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Close Button */}
        <button onClick={handleClose} className="close-card-btn" aria-label="Close registration">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Modal Title */}
        <div className="badge-header" style={{ marginBottom: '16px', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
          <div className="badge-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined badge-logo-icon" style={{ color: 'var(--md-sys-color-primary)', fontSize: '26px' }}>admin_panel_settings</span>
            <span className="badge-logo-text" style={{ fontSize: '18px', fontWeight: 700 }}>
              {language === "FR" ? "Enregistrement & KYC AVEC" : "AVEC Security - KYC Registration"}
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        {step < 5 && (
          <div className="kyc-step-indicators" style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '20px' }}>
            {[1, 2, 3, 4].map(s => (
              <div 
                key={s} 
                className={`kyc-step-indicator ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
                style={{ 
                  flex: 1, 
                  height: '4px', 
                  borderRadius: '2px', 
                  backgroundColor: step === s ? 'var(--md-sys-color-primary)' : step > s ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline-variant)',
                  boxShadow: step === s ? '0 0 8px var(--md-sys-color-primary)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}
        {/* Header content based on mode */}
        {mode === 'register' && (
          <div className="kyc-progress-bar-container">
            <div className="kyc-progress-track">
              <div className="kyc-progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
            <div className="kyc-step-labels" style={{ marginTop: '4px', fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: step >= 1 ? 700 : 400 }}>{language === "FR" ? "Étape 1/4" : "Step 1/4"}</span>
              <span style={{ fontWeight: step === 5 ? 700 : 400 }}>{language === "FR" ? "Terminé" : "Done"}</span>
            </div>
          </div>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div className="kyc-error-banner" style={{ margin: '8px 16px 0', padding: '8px 12px', backgroundColor: 'var(--md-sys-color-error-container)', color: 'var(--md-sys-color-on-error-container)', borderRadius: 'var(--border-radius-md)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>error</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body Container */}
        <div className="kyc-modal-body" style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column' }}>

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: 600 }}>{language === "AR" ? "تسجيل الدخول" : (language === "FR" ? "Connexion" : "Login")}</h4>
                <p style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '4px' }}>
                  {language === "AR" ? "مرحباً بعودتك إلى منصة أفيك." : "Welcome back to AVEC."}
                </p>
              </div>

              <div className="input-group">
                <span className="material-symbols-outlined input-icon">email</span>
                <div className="input-field-wrapper">
                  <label htmlFor="loginEmail" className="field-label">{language === "FR" ? "E-mail" : "Email"}</label>
                  <input 
                    type="email" 
                    id="loginEmail" 
                    className="m3-input" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="material-symbols-outlined input-icon">lock</span>
                <div className="input-field-wrapper">
                  <label htmlFor="loginPassword" className="field-label">{language === "FR" ? "Mot de passe" : "Password"}</label>
                  <input 
                    type="password" 
                    id="loginPassword" 
                    className="m3-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <p style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {language === "AR" ? "ليس لديك حساب؟ " : "Don't have an account? "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); setValidationError(""); }} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                    {language === "AR" ? "سجل الآن" : "Register"}
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* REGISTER MODE - STEP 1 */}
          {mode === 'register' && step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{language === "FR" ? "Créer vos identifiants" : "Create Account Credentials"}</h4>
                <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
                  {language === "FR" ? "Définissez vos informations d'accès de base." : "Provide basic sign-in details to lock your account profile."}
                </p>
              </div>

              <div className="input-group">
                <span className="material-symbols-outlined input-icon">person</span>
                <div className="input-field-wrapper">
                  <label htmlFor="kycNickname" className="field-label">{language === "FR" ? "Pseudonyme" : "Nickname"}</label>
                  <input 
                    type="text" 
                    id="kycNickname" 
                    className="m3-input" 
                    placeholder="E.g. John88"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="material-symbols-outlined input-icon">badge</span>
                <div className="input-field-wrapper">
                  <label htmlFor="kycEnglishName" className="field-label">{language === "FR" ? "Nom complet en anglais" : "Full Name in English"}</label>
                  <input 
                    type="text" 
                    id="kycEnglishName" 
                    className="m3-input" 
                    placeholder="E.g. Ahmed Mohamed Mostafa Elsayed"
                    value={englishName}
                    onChange={(e) => setEnglishName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="material-symbols-outlined input-icon">mail</span>
                <div className="input-field-wrapper">
                  <label htmlFor="kycEmail" className="field-label">{language === "FR" ? "Adresse e-mail" : "Email Address"}</label>
                  <input 
                    type="email" 
                    id="kycEmail" 
                    className="m3-input" 
                    placeholder="john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <span className="material-symbols-outlined input-icon">lock</span>
                <div className="input-field-wrapper">
                  <label htmlFor="kycPassword" className="field-label">{language === "FR" ? "Mot de passe sécurisé" : "Secure Password"}</label>
                  <input 
                    type="password" 
                    id="kycPassword" 
                    className="m3-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <p style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {language === "AR" ? "لديك حساب بالفعل؟ " : "Already have an account? "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setValidationError(""); }} style={{ color: 'var(--md-sys-color-primary)', fontWeight: 'bold', textDecoration: 'none' }}>
                    {language === "AR" ? "تسجيل الدخول" : "Login"}
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Arabic ID Scan & OCR */}
          {mode === 'register' && step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{language === "FR" ? "Numérisation de la pièce d'identité (arabe)" : "Arabic National ID Scan"}</h4>
                <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
                  {language === "FR" 
                    ? "Veuillez numériser votre carte d'identité égyptienne. L'OCR extrait les détails." 
                    : "Simulate scanning your Egyptian National ID card. Our Arabic OCR engine will pull raw text."}
                </p>
              </div>

              {/* Viewfinder Simulator */}
              <div 
                className="scanner-viewport" 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '180px', 
                  backgroundColor: '#0a0a14', 
                  border: '1.5px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: 'var(--border-radius-lg)', 
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8)'
                }}
              >
                {/* Viewfinder brackets */}
                <div className="viewfinder-bracket top-left" style={{ position: 'absolute', top: '16px', left: '16px', width: '20px', height: '20px', borderTop: '3px solid var(--md-sys-color-primary)', borderLeft: '3px solid var(--md-sys-color-primary)' }}></div>
                <div className="viewfinder-bracket top-right" style={{ position: 'absolute', top: '16px', right: '16px', width: '20px', height: '20px', borderTop: '3px solid var(--md-sys-color-primary)', borderRight: '3px solid var(--md-sys-color-primary)' }}></div>
                <div className="viewfinder-bracket bottom-left" style={{ position: 'absolute', bottom: '16px', left: '16px', width: '20px', height: '20px', borderBottom: '3px solid var(--md-sys-color-primary)', borderLeft: '3px solid var(--md-sys-color-primary)' }}></div>
                <div className="viewfinder-bracket bottom-right" style={{ position: 'absolute', bottom: '16px', right: '16px', width: '20px', height: '20px', borderBottom: '3px solid var(--md-sys-color-primary)', borderRight: '3px solid var(--md-sys-color-primary)' }}></div>

                {/* Laser line overlay */}
                {isScanning && (
                  <div 
                    className="scanner-laser" 
                    style={{ 
                      position: 'absolute', 
                      left: 0, 
                      width: '100%', 
                      height: '3px', 
                      background: 'linear-gradient(90deg, transparent, #FF334B, #FF334B, transparent)', 
                      boxShadow: '0 0 10px #FF334B, 0 0 20px #FF334B',
                      animation: 'scanLine 2s infinite linear',
                      zIndex: 3
                    }}
                  />
                )}

                {/* Arabic card visual simulation */}
                <div 
                  className="mock-id-card-visual" 
                  style={{ 
                    width: '75%', 
                    height: '110px', 
                    borderRadius: '8px', 
                    border: '1px dashed rgba(255, 255, 255, 0.25)', 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '10px',
                    direction: 'rtl',
                    opacity: isScanning ? 0.4 : 0.9,
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>جمهورية مصر العربية</div>
                    <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>بطاقة تحقيق الشخصية</div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, marginTop: '8px' }}>
                    <div style={{ width: '32px', height: '42px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)' }}></div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <div style={{ width: '80%', height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }}></div>
                      <div style={{ width: '60%', height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px' }}></div>
                      <div style={{ width: '90%', height: '8px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '2px', marginTop: '4px' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                    <div>الرقم القومي / National ID</div>
                    <div style={{ fontFamily: 'monospace' }}>29408150102345</div>
                  </div>
                </div>

                {/* Progress bar / State label overlay */}
                {isScanning && (
                  <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ fontSize: '10px', color: 'white', fontWeight: 600, textShadow: '0 1px 4px black' }}>{scanStatus}</div>
                    <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${scanProgress}%`, height: '100%', backgroundColor: 'var(--md-sys-color-primary)', transition: 'width 0.1s ease' }}></div>
                    </div>
                  </div>
                )}

                {/* Success green overlay on scan done */}
                {isOcrDone && !isScanning && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(76, 175, 80, 0.1)', border: '2px solid #4CAF50', borderRadius: 'var(--border-radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, animation: 'fadeIn 0.3s' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#4CAF50', animation: 'scaleUp 0.3s ease-out' }}>check_circle</span>
                  </div>
                )}
              </div>

              {/* Start Scan Trigger */}
              <button 
                type="button" 
                onClick={startOcrScan} 
                className="btn-badge-primary"
                disabled={isScanning}
                style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', height: '40px' }}
              >
                <span className="material-symbols-outlined">document_scanner</span>
                <span>{isOcrDone ? (language === "FR" ? "Numériser à nouveau" : "Scan Again") : (language === "FR" ? "Démarrer la numérisation" : "Simulate ID Scan")}</span>
              </button>

              {/* Editable extracted details form */}
              {isOcrDone && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px', animation: 'slideIn 0.3s ease' }}>
                  <hr style={{ border: 'none', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }} />
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {language === "FR" ? "Détails extraits de l'identité" : "OCR Extracted Details (Editable)"}
                  </div>

                  <div className="input-group" style={{ direction: 'rtl' }}>
                    <span className="material-symbols-outlined input-icon">badge</span>
                    <div className="input-field-wrapper" style={{ alignItems: 'flex-start' }}>
                      <label className="field-label" style={{ fontSize: '9px' }}>الاسم الكامل (العربية) / Full Name (Arabic)</label>
                      <input 
                        type="text" 
                        className="m3-input" 
                        style={{ textAlign: 'right', fontWeight: 600 }}
                        value={nameAR}
                        onChange={(e) => setNameAR(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <span className="material-symbols-outlined input-icon">fingerprint</span>
                    <div className="input-field-wrapper">
                      <label className="field-label">National ID Number (14 Digits)</label>
                      <input 
                        type="text" 
                        maxLength={14}
                        className="m3-input" 
                        style={{ fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, letterSpacing: '1px' }}
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="input-group">
                      <div className="input-field-wrapper">
                        <label className="field-label">{language === "FR" ? "Gouvernorat" : "Governorate"}</label>
                        <input 
                          type="text" 
                          className="m3-input" 
                          value={gov}
                          onChange={(e) => setGov(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <div className="input-field-wrapper">
                        <label className="field-label">{language === "FR" ? "Date de naissance" : "Date of Birth"}</label>
                        <input 
                          type="date" 
                          className="m3-input" 
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: KYC Selfie Pictures */}
          {mode === 'register' && step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{language === "FR" ? "Vérification photo KYC" : "KYC Face Verification"}</h4>
                <p style={{ fontSize: '11px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
                  {language === "FR"
                    ? "Capturez les angles de votre visage pour valider la biométrie (Face, Gauche, Droite)."
                    : "Take snapshots of your face angles (Front, Left, Right) to complete biological verification."}
                </p>
              </div>

              {/* Photo capturing active camera frame */}
              {cameraStreamSim && (
                <div 
                  className="camera-viewfinder-overlay" 
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '200px', 
                    backgroundColor: '#05050f', 
                    borderRadius: 'var(--border-radius-lg)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1.5px solid var(--md-sys-color-primary)',
                    boxShadow: '0 0 15px rgba(92,84,229,0.3)',
                    animation: 'fadeIn 0.3s'
                  }}
                >
                  {/* Glowing oval guide */}
                  <div 
                    style={{ 
                      width: '110px', 
                      height: '140px', 
                      borderRadius: '50%', 
                      border: '2px dashed #00f2fe',
                      boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '42px', color: '#00f2fe', opacity: 0.6 }}>
                      {capturingAngle === 'front' ? 'face' : capturingAngle === 'left' ? 'face_6' : 'face_5'}
                    </span>

                    {/* Arrow guide direction */}
                    {capturingAngle !== 'front' && (
                      <span className="material-symbols-outlined" style={{ position: 'absolute', top: '40%', [capturingAngle === 'left' ? 'left' : 'right']: '-40px', fontSize: '32px', color: '#00f2fe', animation: 'pulse 1.2s infinite' }}>
                        {capturingAngle === 'left' ? 'arrow_back' : 'arrow_forward'}
                      </span>
                    )}
                  </div>

                  <div style={{ position: 'absolute', bottom: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {capturingAngle === 'front' ? (language === "FR" ? "Regardez de face" : "Look straight ahead") : capturingAngle === 'left' ? (language === "FR" ? "Tournez la tête à gauche" : "Turn head left") : (language === "FR" ? "Tournez la tête à droite" : "Turn head right")}
                    </span>
                    <button 
                      type="button" 
                      onClick={triggerCaptureSnapshot} 
                      className="m3-btn btn-primary"
                      style={{ height: '28px', padding: '0 16px', fontSize: '11px', borderRadius: '14px', marginTop: '4px' }}
                    >
                      {language === "FR" ? "Prendre la photo" : "Capture Snap"}
                    </button>
                  </div>
                </div>
              )}

              {/* Snapshot statuses grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '4px' }}>
                
                {/* Front Side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div 
                    onClick={() => !cameraStreamSim && startCameraCapture('front')}
                    style={{ 
                      width: '100%', 
                      height: '110px', 
                      borderRadius: 'var(--border-radius-md)', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      border: photos.front ? '2px solid #4CAF50' : '1px solid var(--md-sys-color-outline-variant)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: cameraStreamSim ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    {photos.front ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#4CAF50' }}>face</span>
                        <span style={{ fontSize: '9px', color: '#4CAF50', fontWeight: 700 }}>CAPTURED</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--md-sys-color-outline)' }}>photo_camera</span>
                        <span style={{ fontSize: '9px', color: 'var(--md-sys-color-outline)' }}>{language === "FR" ? "Face" : "Front View"}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{language === "FR" ? "Face" : "Front Snapshot"}</span>
                </div>

                {/* Left Side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div 
                    onClick={() => !cameraStreamSim && startCameraCapture('left')}
                    style={{ 
                      width: '100%', 
                      height: '110px', 
                      borderRadius: 'var(--border-radius-md)', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      border: photos.left ? '2px solid #4CAF50' : '1px solid var(--md-sys-color-outline-variant)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: cameraStreamSim ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    {photos.left ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#4CAF50' }}>face_6</span>
                        <span style={{ fontSize: '9px', color: '#4CAF50', fontWeight: 700 }}>CAPTURED</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--md-sys-color-outline)' }}>photo_camera</span>
                        <span style={{ fontSize: '9px', color: 'var(--md-sys-color-outline)' }}>{language === "FR" ? "Profil Gauche" : "Left Profile"}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{language === "FR" ? "Profil Gauche" : "Left Snapshot"}</span>
                </div>

                {/* Right Side */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div 
                    onClick={() => !cameraStreamSim && startCameraCapture('right')}
                    style={{ 
                      width: '100%', 
                      height: '110px', 
                      borderRadius: 'var(--border-radius-md)', 
                      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                      border: photos.right ? '2px solid #4CAF50' : '1px solid var(--md-sys-color-outline-variant)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      cursor: cameraStreamSim ? 'not-allowed' : 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.2s'
                    }}
                  >
                    {photos.right ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#4CAF50' }}>face_5</span>
                        <span style={{ fontSize: '9px', color: '#4CAF50', fontWeight: 700 }}>CAPTURED</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--md-sys-color-outline)' }}>photo_camera</span>
                        <span style={{ fontSize: '9px', color: 'var(--md-sys-color-outline)' }}>{language === "FR" ? "Profil Droit" : "Right Profile"}</span>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>{language === "FR" ? "Profil Droit" : "Right Snapshot"}</span>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: Emergency Contacts (up to 3, min 1) & Relatives (up to 5) */}
          {mode === 'register' && step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* EMERGENCY CONTACTS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-error)', fontSize: '20px' }}>emergency</span>
                    <span>{language === "FR" ? "Contacts d'urgence (1-3)" : "Emergency Contacts (1 to 3)"}</span>
                  </h4>
                  <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
                    {language === "FR" 
                      ? "Ajoutez jusqu'à 3 contacts. Au moins 1 est obligatoire pour votre sécurité." 
                      : "Add up to 3 contacts. At least 1 contact is required for safety dispatches."}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {emergencyContacts.map((contact, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div className="input-group" style={{ flex: 1, padding: '6px 12px' }}>
                        <div className="input-field-wrapper" style={{ flex: 1.2 }}>
                          <label className="field-label" style={{ fontSize: '9px' }}>{language === "FR" ? "Nom du contact" : "Contact Name"}</label>
                          <input 
                            type="text" 
                            className="m3-input" 
                            placeholder="E.g. Jane Doe"
                            value={contact.name}
                            onChange={(e) => handleEmergencyChange(idx, 'name', e.target.value)}
                          />
                        </div>
                        <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: 'var(--md-sys-color-outline-variant)' }}></div>
                        <div className="input-field-wrapper" style={{ flex: 1 }}>
                          <label className="field-label" style={{ fontSize: '9px' }}>{language === "FR" ? "Téléphone" : "Phone"}</label>
                          <input 
                            type="tel" 
                            className="m3-input" 
                            placeholder="010..."
                            value={contact.phone}
                            onChange={(e) => handleEmergencyChange(idx, 'phone', e.target.value)}
                          />
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => handleRemoveEmergency(idx)} 
                        className="btn-remove-stop" 
                        title="Remove Contact"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                {emergencyContacts.length < 3 && (
                  <button 
                    type="button" 
                    onClick={handleAddEmergency} 
                    className="btn-text-icon"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    <span>{language === "FR" ? "Ajouter un contact d'urgence" : "Add Emergency Contact"}</span>
                  </button>
                )}
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }} />

              {/* RELATIVES (up to 5) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--md-sys-color-primary)', fontSize: '20px' }}>group</span>
                    <span>{language === "FR" ? "Membres de la famille (Max 5)" : "Family Members / Relatives (Max 5)"}</span>
                  </h4>
                  <p style={{ fontSize: '10px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '2px' }}>
                    {language === "FR"
                      ? "Enregistrez vos proches pour commander des trajets pour eux directement."
                      : "Register close relatives. You will be able to book rides for them from the sidebar."}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {relatives.map((rel, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div className="input-group" style={{ flex: 1, padding: '4px 10px', display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '6px' }}>
                        <div className="input-field-wrapper">
                          <label className="field-label" style={{ fontSize: '9px' }}>{language === "FR" ? "Nom" : "Name"}</label>
                          <input 
                            type="text" 
                            className="m3-input" 
                            placeholder="E.g. Sarah Sr."
                            value={rel.name}
                            onChange={(e) => handleRelativeChange(idx, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div className="input-field-wrapper" style={{ borderLeft: '1px solid var(--md-sys-color-outline-variant)', paddingLeft: '6px' }}>
                          <label className="field-label" style={{ fontSize: '9px' }}>{language === "FR" ? "Téléphone" : "Phone"}</label>
                          <input 
                            type="tel" 
                            className="m3-input" 
                            placeholder="012..."
                            value={rel.phone}
                            onChange={(e) => handleRelativeChange(idx, 'phone', e.target.value)}
                          />
                        </div>

                        <div className="input-field-wrapper" style={{ borderLeft: '1px solid var(--md-sys-color-outline-variant)', paddingLeft: '6px' }}>
                          <label className="field-label" style={{ fontSize: '9px' }}>{language === "FR" ? "Lien de parenté" : "Relation"}</label>
                          <select 
                            className="m3-input" 
                            style={{ padding: '0', border: 'none', background: 'transparent', height: '20px', fontSize: '11px', cursor: 'pointer' }}
                            value={rel.relationship}
                            onChange={(e) => handleRelativeChange(idx, 'relationship', e.target.value)}
                          >
                            <option value="son">{language === "FR" ? "Fils" : "Son"}</option>
                            <option value="daughter">{language === "FR" ? "Fille" : "Daughter"}</option>
                            <option value="father">{language === "FR" ? "Père" : "Father"}</option>
                            <option value="mother">{language === "FR" ? "Mère" : "Mother"}</option>
                            <option value="spouse">{language === "FR" ? "Conjoint" : "Spouse"}</option>
                            <option value="sibling">{language === "FR" ? "Frère/Sœur" : "Sibling"}</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={() => handleRemoveRelative(idx)} 
                        className="btn-remove-stop" 
                        title="Remove Relative"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                {relatives.length < 5 && (
                  <button 
                    type="button" 
                    onClick={handleAddRelative} 
                    className="btn-text-icon"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                    <span>{language === "FR" ? "Ajouter un membre de la famille" : "Add Family Relative"}</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* STEP 5: Success screen */}
          {mode === 'register' && step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px', padding: '10px 0', animation: 'scaleUp 0.35s ease' }}>
              <div 
                style={{ 
                  width: '72px', 
                  height: '72px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(76, 175, 80, 0.1)', 
                  border: '3px solid #4CAF50', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(76,175,80,0.4)',
                  animation: 'pulse 1.8s infinite'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '42px', color: '#4CAF50' }}>verified</span>
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '20px', fontWeight: 700, color: 'var(--md-sys-color-on-background)' }}>
                  {language === "FR" ? "Vérification Complétée !" : "Verification Successful!"}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)', marginTop: '6px', maxWidth: '340px' }}>
                  {language === "FR"
                    ? "Félicitations ! Votre profil KYC, votre pièce d'identité arabe et vos proches ont été validés."
                    : "Congratulations! Your credentials, Arabic ID scan, selfie angles, emergency contacts, and relatives are fully registered."}
                </p>
              </div>

              <div 
                className="kyc-success-details-card" 
                style={{ 
                  width: '100%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid var(--md-sys-color-outline-variant)', 
                  borderRadius: 'var(--border-radius-md)', 
                  padding: '14px',
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '8px', 
                  textAlign: 'left',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{language === "FR" ? "Pseudonyme" : "Nickname"}:</span>
                  <span style={{ fontWeight: 600 }}>{nickname}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{language === "FR" ? "E-mail" : "Email"}:</span>
                  <span style={{ fontWeight: 600 }}>{email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', direction: 'rtl' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)', textAlign: 'right' }}>الاسم الكامل (Arabic Name):</span>
                  <span style={{ fontWeight: 600, textAlign: 'left' }}>{nameAR}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{language === "FR" ? "Pièce d'identité" : "National ID"}:</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{nationalId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>{language === "FR" ? "Famille enregistrée" : "Relatives Count"}:</span>
                  <span style={{ fontWeight: 600 }}>{relatives.length} relatives</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={handleClose} 
                className="btn-primary m3-btn"
                style={{ width: '100%' }}
              >
                {language === "FR" ? "Accéder à la plateforme" : "Enter Platform"}
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="kyc-modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--md-sys-color-outline-variant)', paddingTop: '16px' }}>
          {mode === 'login' ? (
            <button 
              type="button" 
              className="m3-btn btn-primary" 
              onClick={handleLogin}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span className="btn-label">{language === "AR" ? "دخول" : "Login"}</span>
              <span className="material-symbols-outlined">login</span>
            </button>
          ) : (
            <>
              {step > 1 && step < 5 ? (
                <button type="button" className="m3-btn btn-secondary" onClick={handlePrev}>
                  <span className="material-symbols-outlined">arrow_back</span>
                  <span className="btn-label">{language === "FR" ? "Retour" : "Back"}</span>
                </button>
              ) : (
                <div></div> // empty spacer
              )}
              
              {step < 5 && (
                <button type="button" className="m3-btn btn-primary" onClick={handleNext}>
                  <span className="btn-label">{step === 4 ? (language === "FR" ? "Soumettre KYC" : "Submit KYC") : (language === "FR" ? "Suivant" : "Next")}</span>
                  {step !== 4 && <span className="material-symbols-outlined">arrow_forward</span>}
                  {step === 4 && <span className="material-symbols-outlined">verified</span>}
                </button>
              )}

              {step === 5 && (
                <button type="button" className="m3-btn btn-primary" onClick={() => setIsRegisterOpen(false)} style={{ width: '100%', justifyContent: 'center' }}>
                  <span className="btn-label">{language === "FR" ? "Aller au tableau de bord" : "Go to Dashboard"}</span>
                  <span className="material-symbols-outlined">dashboard</span>
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
