import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Translation Dictionary ---
export const TRANSLATIONS = {
  EN: {
    txtRequestRide: "Request a Ride",
    txtRequestSubtitle: "Add your stops and customize your ride",
    lblPickup: "Pickup Point",
    lblDestination: "Destination",
    txtAddStop: "Add Stop Point (Max 5)",
    txtRidersCategory: "Riders Count & Type",
    txtRidersLimitMsg: "A maximum of 4 riders are allowed per booking.",
    txtAdults: "Adults",
    txtAdultsAge: "Ages 18-64",
    txtKids: "Kids",
    txtKidsAge: "Ages 0-17",
    txtElders: "Elders",
    txtEldersAge: "Ages 65+",
    txtRiderLimitWarning: "Total riders cannot exceed 4 per booking!",
    txtScheduleRide: "Schedule Ride",
    lblDate: "Date (Within 30 days)",
    lblTime: "Time",
    txtScheduleNotice: "* Bookings can be scheduled up to 30 days upfront.",
    txtSelectVehicle: "Select Vehicle",
    txtBookNowBtn: "Book AVEC Ride",
    txtFilterBy: "Filter cars:",
    txtBestDriver: "Best Driver",
    txtBestCar: "Best Car",
    txtBestRating: "Best Rating (4.9+)",
    txtMyProfile: "My Profile",
    txtGoldMember: "GOLD MEMBER",
    txtMyTrips: "My Trips",
    txtPayments: "Payment Methods",
    txtSettings: "Settings",
    txtHelp: "Help & Support",
    chatTitle: "AVEC AI Assistant",
    txtTalkAgent: "Talk to Agent",
    chatStatusOnline: "Online • Ready to help",
    chatStatusAgent: "Sarah • Live Support Agent",
    txtQ1: "What are the rates?",
    txtQ2: "Can I add stops?",
    txtQ3: "Is there a rider limit?",
    searchPlaceholder: "Search address, trips, or help...",
    txtCall: "Call",
    txtSelect: "Select Car",
    txtDriverTitle: "CERTIFIED PARTNER",
    txtRatingLbl: "RATING",
    txtTripsLbl: "TRIPS",
    txtExpLbl: "EXP",
    lblStopPlaceholder: "Enter stop point address",
    lblStopTitle: "Stop Point",
    alertBookingSuccess: "Booking Confirmed! Your AVEC ride has been requested successfully.",
    txtPromoTitle: "Promotions & Offers",
    txtViewOffers: "View Offers",
    txtPromoModalTitle: "Active Promotions",
    txtNotificationsTitle: "Notifications",
    txtMyPromotions: "Promotions & Offers",
    promoFeedbackSuccess: "Promo applied successfully! {val} discount.",
    promoFeedbackInvalid: "Invalid promo code.",
    promoFeedbackExpired: "This promo code has expired.",
    promoFeedbackEmpty: "Please enter a code."
  },
  AR: {
    txtRequestRide: "طلب رحلة",
    txtRequestSubtitle: "أضف محطات التوقف وخصص رحلتك",
    lblPickup: "نقطة الانطلاق",
    lblDestination: "الوجهة",
    txtAddStop: "إضافة نقطة توقف (أقصى 5)",
    txtRidersCategory: "عدد ونوع الركاب",
    txtRidersLimitMsg: "يسمح بحد أقصى 4 ركاب لكل حجز.",
    txtAdults: "البالغون",
    txtAdultsAge: "الأعمار 18-64",
    txtKids: "الأطفال",
    txtKidsAge: "الأعمار 0-17",
    txtElders: "كبار السن",
    txtEldersAge: "الأعمار +65",
    txtRiderLimitWarning: "لا يمكن أن يتجاوز إجمالي الركاب 4 لكل حجز!",
    txtScheduleRide: "جدولة الرحلة",
    lblDate: "التاريخ (خلال 30 يومًا)",
    lblTime: "الوقت",
    txtScheduleNotice: "* يمكن جدولة الحجوزات حتى 30 يومًا مقدمًا.",
    txtSelectVehicle: "اختر السيارة",
    txtBookNowBtn: "احجز رحلة AVEC",
    txtFilterBy: "تصفية السيارات:",
    txtBestDriver: "أفضل سائق",
    txtBestCar: "أفضل سيارة",
    txtBestRating: "أفضل تقييم (4.9+)",
    txtMyProfile: "ملفي الشخصي",
    txtGoldMember: "عضو ذهبي",
    txtMyTrips: "رحلاتي",
    txtPayments: "طرق الدفع",
    txtSettings: "الإعدادات",
    txtHelp: "المساعدة والدعم",
    chatTitle: "مساعد AVEC الذكي",
    txtTalkAgent: "التحدث مع الدعم",
    chatStatusOnline: "متصل • مستعد للمساعدة",
    chatStatusAgent: "سارة • ممثل الدعم المباشر",
    txtQ1: "ما هي الأسعار؟",
    txtQ2: "هل يمكنني إضافة محطات توقف؟",
    txtQ3: "هل هناك حد أقصى للركاب؟",
    searchPlaceholder: "ابحث عن عنوان، رحلات، أو مساعدة...",
    txtCall: "اتصال",
    txtSelect: "اختر السيارة",
    txtDriverTitle: "شريك معتمد",
    txtRatingLbl: "التقييم",
    txtTripsLbl: "الرحلات",
    txtExpLbl: "الخبرة",
    lblStopPlaceholder: "أدخل عنوان محطة التوقف",
    lblStopTitle: "محطة توقف",
    alertBookingSuccess: "تم تأكيد الحجز! تم طلب رحلتك بنجاح.",
    txtPromoTitle: "العروض والخصومات",
    txtViewOffers: "عرض العروض",
    txtPromoModalTitle: "العروض النشطة",
    txtNotificationsTitle: "الإشعارات",
    txtMyPromotions: "العروض والخصومات",
    promoFeedbackSuccess: "تم تطبيق الخصم بنجاح! خصم بقيمة {val}.",
    promoFeedbackInvalid: "الرمز الترويجي غير صالح.",
    promoFeedbackExpired: "انتهت صلاحية الرمز الترويجي.",
    promoFeedbackEmpty: "يرجى إدخال الرمز الترويجي."
  }
};

// --- Promotions Database ---
export const PROMO_CODES = [
  { code: "AVEC20", discount: "20%", discountVal: 0.20, expiry: "2026-06-17", description: "20% off any ride", descriptionAR: "خصم ٢٠٪ على أي رحلة" },
  { code: "PEOPLE10", discount: "10%", discountVal: 0.10, expiry: "2026-06-25", description: "10% off your next ride", descriptionAR: "خصم ١٠٪ على رحلتك القادمة" },
  { code: "ECOTRIP", discount: "15%", discountVal: 0.15, expiry: "2026-06-15", description: "15% off Eco rides", descriptionAR: "خصم ١٥٪ على رحلات فئة الإيكو" }
];

const AppStateContext = createContext();

export const useAppState = () => useContext(AppStateContext);

export const AppStateProvider = ({ children }) => {
  // Lang & Theme
  const [language, setLanguage] = useState("EN");
  const [theme, setTheme] = useState("light");

  // Routing
  const [pickup, setPickup] = useState("Tahrir Square, Cairo");
  const [destination, setDestination] = useState("Giza Pyramids, Giza");
  const [stops, setStops] = useState([]); // { id: number, value: string }

  // Passenger state
  const [riders, setRiders] = useState({ adults: 1, kids: 0, elders: 0 });

  // Schedule state
  const [schedule, setSchedule] = useState({ enabled: false, date: "", time: "" });

  // Promotions & Alerts
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [expiryAlert, setExpiryAlert] = useState(null); // stores code info when alert shows
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

  // Drawers & Modals
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User Profile & Registration
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    registered: false,
    nickname: "",
    email: "",
    password: "",
    nameAR: "",
    nationalId: "",
    gov: "",
    birthDate: "",
    kycPhotos: { front: null, left: null, right: null },
    emergencyContacts: [],
    relatives: []
  });

  const registerUser = (profileData) => {
    setUserProfile({
      ...profileData,
      registered: true
    });
    pushNotification(
      language === "AR" ? "تم التحقق من الهوية" : "Identity Verified",
      language === "AR"
        ? `مرحباً، ${profileData.nickname}! تم التحقق من حسابك بالكامل عبر قراءة الهوية وصور KYC.`
        : `Welcome, ${profileData.nickname}! Your profile is fully verified via Arabic ID OCR & KYC.`,
      "info"
    );
  };

  // Optional Features
  const [features, setFeatures] = useState({
    delivery: true,
    shopper: true,
    pets: true,
    priority: false,
    xl: false
  });
  const toggleFeature = (feat) => {
    setFeatures(prev => ({ ...prev, [feat]: !prev[feat] }));
  };
  
  // Selected Vehicle
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Chat system state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState("AI"); // "AI", "CONNECTING", "AGENT"
  const [chatMessages, setChatMessages] = useState([]);

  // Setup Date and Time defaults on load
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    let hours = today.getHours();
    let mins = today.getMinutes() + 15;
    if (mins >= 60) {
      mins -= 60;
      hours = (hours + 1) % 24;
    }
    if (hours < 10) hours = '0' + hours;
    if (mins < 10) mins = '0' + mins;

    setSchedule(prev => ({
      ...prev,
      date: `${yyyy}-${mm}-${dd}`,
      time: `${hours}:${mins}`
    }));

    // Trigger Coupon alert checks relative to 2026-06-16 (Today)
    const todaySim = new Date("2026-06-16");
    PROMO_CODES.forEach(p => {
      const exp = new Date(p.expiry);
      const diffTime = exp - todaySim;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Expiring tomorrow
        setExpiryAlert(p);
        
        // Add to Notifications
        const isAR = language === "AR";
        const title = isAR ? "رمز ترويجي يوشك على الانتهاء" : "Promo Expiring Soon";
        const body = isAR 
          ? `الرمز الترويجي الخاص بك ${p.code} (خصم بقيمة ${p.discount}) ينتهي في ${exp.toLocaleDateString('ar-EG')}. استخدمه اليوم!`
          : `Your promo code ${p.code} (${p.discount} discount) expires on ${exp.toLocaleDateString('en-US')}. Use it today!`;
        
        pushNotification(title, body, "promo");
      }
    });
  }, []);

  // Update HTML attribute when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Update HTML direction and language attributes when language changes
  useEffect(() => {
    document.documentElement.setAttribute("dir", language === "AR" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", language.toLowerCase());
  }, [language]);

  // Translate helpers
  const dict = TRANSLATIONS[language];

  // Language & Theme toggles
  const toggleLanguage = () => setLanguage(l => l === "EN" ? "AR" : "EN");
  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  // Stops handlers
  const addStop = () => {
    if (stops.length >= 5) return;
    setStops(s => [...s, { id: Date.now(), value: "" }]);
  };

  const removeStop = (id) => {
    setStops(s => s.filter(stop => stop.id !== id));
  };

  const updateStopValue = (id, val) => {
    setStops(s => s.map(stop => stop.id === id ? { ...stop, value: val } : stop));
  };

  // Riders selectors with maximum limit of 4
  const incrementRider = (type) => {
    const total = riders.adults + riders.kids + riders.elders;
    const limit = features.xl ? 6 : 4;
    if (total < limit) {
      setRiders(prev => ({ ...prev, [type]: prev[type] + 1 }));
    }
  };

  const decrementRider = (type) => {
    if (riders[type] > 0) {
      setRiders(prev => ({ ...prev, [type]: prev[type] - 1 }));
    }
  };

  // Notifications drawer control
  const pushNotification = (title, body, type = "info") => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setNotifications(prev => {
      if (prev.some(n => n.title === title && n.body === body)) {
        return prev;
      }
      return [
        { id: `notif-${Date.now()}-${Math.random()}`, title, body, time, type, unread: true },
        ...prev
      ];
    });
    setHasUnreadNotif(true);
  };

  const openNotifications = () => {
    setIsNotificationsOpen(true);
    setHasUnreadNotif(false);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const closeNotifications = () => setIsNotificationsOpen(false);

  // Chat message logics
  const openChat = () => {
    setIsChatOpen(true);
    if (chatMessages.length === 0) {
      const isAR = language === "AR";
      const greet = isAR 
        ? "مرحباً! أنا مساعد AVEC الذكي. كيف يمكنني مساعدتك في طلب رحلة اليوم؟"
        : "Hello! I am AVEC's AI Assistant. How can I help you request a ride today?";
      setChatMessages([{ sender: "bot", text: greet, id: 1 }]);
    }
  };

  const closeChat = () => setIsChatOpen(false);

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    
    const userMsgId = `user-${Date.now()}-${Math.random()}`;
    setChatMessages(prev => [...prev, { sender: "user", text, id: userMsgId }]);

    // Simulated responses
    setTimeout(() => {
      let reply = "";
      const isAR = language === "AR";
      const query = text.toLowerCase();

      if (chatMode === "AGENT") {
        const responses = isAR ? [
          "حسناً، أتفهم ذلك. لقد تحققت للتو من السيارات المتاحة حول ميدان التحرير. لدينا سيارات تسلا موديل Y جاهزة للانطلاق.",
          "نعم، تتوفر مقاعد الأطفال في سياراتنا العائلية. يمكنني إضافة ملاحظة للسائق بمجرد تقديم الطلب.",
          "التعرفة المعروضة على الشاشة مضمونة ومثبتة عند الحجز، ولن تتغير بسبب حركة المرور. هل هناك أي شيء آخر تود توضيحه؟",
          "أؤكد لك أن عضويتك الذهبية تمنحك خصماً تلقائياً بنسبة 10٪ على السيارات الفاخرة. تم احتساب ذلك بالفعل في السعر المعروض.",
          "بمجرد الركوب، ستتمكن من تتبع مسار الرحلة في الوقت الفعلي. لا تتردد في مراسلتي إذا كنت بحاجة للمساعدة."
        ] : [
          "I see. Let me double-check vehicle availability in your area. Yes, we have elite electric cars nearby Central Park West ready to depart.",
          "Yes, child booster seats are available upon request for our kid-friendly cars. I can add a note to your driver once the request is submitted.",
          "The price estimated in the panel is fully locked once you book, meaning it won't fluctuate due to traffic. Is there anything else about the payment you would like to clarify?",
          "I can confirm that John Doe's gold status grants you a 10% discount on elite vehicles. This is automatically factored into the shown prices.",
          "If you need help during the ride, you can use the SOS button in the app or chat with me again. Fares remain fixed once booked!"
        ];

        if (query.includes("seat") || query.includes("kid") || query.includes("child") || query.includes("مقعد") || query.includes("طفل")) {
          reply = responses[1];
        } else if (query.includes("money") || query.includes("price") || query.includes("fare") || query.includes("سعر") || query.includes("دفع") || query.includes("نقود")) {
          reply = responses[2];
        } else if (query.includes("discount") || query.includes("gold") || query.includes("خصم") || query.includes("عضوية") || query.includes("ذهبي")) {
          reply = responses[3];
        } else if (query.includes("time") || query.includes("wait") || query.includes("available") || query.includes("وقت") || query.includes("انتظار") || query.includes("متاح")) {
          reply = responses[0];
        } else {
          reply = responses[4];
        }
      } else {
        // AI chatbot mode
        if (query.includes("rate") || query.includes("fare") || query.includes("cost") || query.includes("price") || query.includes("سعر") || query.includes("تكلفة") || query.includes("تعرفة")) {
          reply = isAR
            ? "يتم عرض الأسعار المقدرة بجانب كل خيار سيارة في اللوحة الجانبية. خيار Eco هو الأكثر اقتصاداً، بينما يقدم خيار Elite سيارات تسلا الفاخرة."
            : "Estimated fares are shown next to each vehicle option in the left panel. Eco is our most affordable option, while Elite offers premium Tesla performance.";
        } else if (query.includes("stop") || query.includes("توقف") || query.includes("محطة")) {
          reply = isAR
            ? "يمكنك إضافة ما يصل إلى 5 نقاط توقف. إذا تم إخفاء زر الإضافة، فهذا يعني أنك وصلت إلى الحد الأقصى البالغ 5 نقاط توقف."
            : "Vous pouvez ajouter jusqu'à 5 stop points. If the button is hidden, it means you have already added the maximum of 5 intermediate stop points.";
        } else if (query.includes("limit") || query.includes("max") || query.includes("count") || query.includes("rider") || query.includes("رقم") || query.includes("حد") || query.includes("ركاب")) {
          reply = isAR
            ? "لدواعي السلامة، نحدد الحجز بحد أقصى 4 ركاب لكل سيارة (بما في ذلك البالغون والأطفال وكبار السن). يتم تعطيل زر الإضافة عند الوصول إلى الحد الأقصى."
            : "For safety, we limit bookings to 4 riders per vehicle (including Adults, Kids, and Elders). The plus buttons disable once the total count reaches 4.";
        } else if (query.includes("schedule") || query.includes("later") || query.includes("time") || query.includes("date") || query.includes("جدولة") || query.includes("موعد") || query.includes("وقت")) {
          reply = isAR
            ? "يمكنك جدولة رحلة مسبقاً حتى 30 يوماً. قم بتفعيل خيار 'جدولة الرحلة' لعرض مدخلات التاريخ والوقت."
            : "You can schedule a ride up to 30 days upfront. Check the 'Schedule Ride' toggle to view the date/time inputs. Dates beyond 30 days are disabled.";
        } else if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("مرحبا") || query.includes("أهلا") || query.includes("السلام")) {
          reply = isAR
            ? "مرحباً! كيف يمكنني مساعدتك في تنسيق رحلتك مع AVEC اليوم؟"
            : "Hello! How can I help you coordinate your AVEC ride today?";
        } else {
          reply = isAR
            ? "يمكنني مساعدتك في الإجابة عن الأسئلة المتعلقة بنقاط التوقف، الأسعار، الحدود والجدولة. للتحدث مع ممثل دعم مباشر، يمكنك النقر على 'التحدث مع الدعم' في الأعلى."
            : "I can assist you with stops, scheduling, fares, and rider rules. If you have specific booking requests, click 'Talk to Agent' to chat with a live advisor.";
        }
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: reply, id: `bot-${Date.now()}-${Math.random()}` }]);
    }, 1000);
  };

  const connectToRealAgent = () => {
    setChatMode("CONNECTING");
    const isAR = language === "AR";
    const baseId = Date.now();
    
    // Add system notification
    setChatMessages(prev => [
      ...prev,
      { sender: "system", text: isAR ? "جاري البحث عن ممثل دعم متاح..." : "Searching for an available agent...", id: `sys-connect-${baseId}` }
    ]);

    setTimeout(() => {
      setChatMode("AGENT");
      setChatMessages(prev => [
        ...prev,
        { sender: "system", text: isAR ? "انضمت سارة إلى الدردشة." : "Sarah has joined the chat.", id: `sys-joined-${baseId}` },
        { sender: "bot", text: isAR ? "مرحباً! أنا سارة من دعم AVEC. أرى أنك تقوم بإعداد رحلة الآن. كيف يمكنني مساعدتك في إتمام حجزك اليوم؟" : "Hi there! I'm Sarah from AVEC Support. I see you're configuring a ride. How can I assist you with your booking today?", id: `bot-greet-${baseId}` }
      ]);
    }, 2000);
  };

  return (
    <AppStateContext.Provider value={{
      language, toggleLanguage,
      theme, toggleTheme,
      pickup, setPickup,
      destination, setDestination,
      stops, addStop, removeStop, updateStopValue,
      riders, incrementRider, decrementRider,
      schedule, setSchedule,
      appliedPromo, setAppliedPromo,
      expiryAlert, setExpiryAlert,
      isPromoOpen, setIsPromoOpen,
      notifications, pushNotification, hasUnreadNotif, openNotifications, closeNotifications,
      isProfileOpen, setIsProfileOpen,
      isNotificationsOpen,
      isSettingsOpen, setIsSettingsOpen,
      features, toggleFeature,
      selectedVehicleId, setSelectedVehicleId,
      isChatOpen, openChat, closeChat,
      chatMode, chatMessages, sendChatMessage, connectToRealAgent,
      userProfile, setUserProfile,
      isRegisterOpen, setIsRegisterOpen,
      registerUser,
      dict
    }}>
      {children}
    </AppStateContext.Provider>
  );
};
