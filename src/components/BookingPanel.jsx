import React, { useState, useEffect } from 'react';
import { useAppState, PROMO_CODES } from '../context/AppStateContext';
import { VEHICLES_DATA, getPromoDiscountedPrice } from '../constants/vehicles';

export default function BookingPanel({ isOpen, onClose, initialTab = 'ride' }) {
  const {
    language,
    pickup, setPickup,
    destination, setDestination,
    stops, addStop, removeStop, updateStopValue,
    riders, incrementRider, decrementRider,
    schedule, setSchedule,
    appliedPromo, setAppliedPromo,
    setIsPromoOpen,
    selectedVehicleId, setSelectedVehicleId,
    features,
    userProfile,
    dict
  } = useAppState();

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState({ text: "", isError: false });
  const [activeTab, setActiveTab] = useState(initialTab);
  const [ridingFor, setRidingFor] = useState("me");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shoppingList, setShoppingList] = useState("");
  const [womenOnly, setWomenOnly] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const maxRiders = features.xl ? 6 : 4;
  const totalRiders = riders.adults + riders.kids + riders.elders;

  // Handle auto-resetting tab if delivery option is disabled in settings
  useEffect(() => {
    if (!features.delivery && activeTab === "delivery") {
      setActiveTab("ride");
    }
  }, [features.delivery]);

  // Handle promo code application
  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) {
      setPromoFeedback({ text: dict.promoFeedbackEmpty, isError: true });
      return;
    }

    const promo = PROMO_CODES.find(p => p.code === code);
    if (!promo) {
      setPromoFeedback({ text: dict.promoFeedbackInvalid, isError: true });
      return;
    }

    // Expiry check
    const today = new Date("2026-06-16");
    const expDate = new Date(promo.expiry);
    const diffTime = expDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setPromoFeedback({ text: dict.promoFeedbackExpired, isError: true });
      return;
    }

    setAppliedPromo(promo);
    const successMsg = dict.promoFeedbackSuccess.replace("{val}", promo.discount);
    setPromoFeedback({ text: successMsg, isError: false });
  };

  // Limit date boundaries (Today to Today+30 days)
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    setMinDate(`${yyyy}-${mm}-${dd}`);

    const future = new Date(today);
    future.setDate(today.getDate() + 30);
    const fY = future.getFullYear();
    let fM = future.getMonth() + 1;
    let fD = future.getDate();
    if (fM < 10) fM = '0' + fM;
    if (fD < 10) fD = '0' + fD;
    setMaxDate(`${fY}-${fM}-${fD}`);
  }, []);

  // Filtered/Custom vehicle list based on features
  const displayVehicles = (activeTab === "delivery" || activeTab === "shopper")
    ? [
        {
          id: "v-delivery-bike",
          name: "E-Bike Cargo Courier",
          nameAR: "موصّل دراجة كهربائية",
          desc: "Zero-emission fast city deliveries",
          descAR: "توصيل سريع صديق للبيئة داخل المدينة",
          carType: "eco",
          features: ["Bike Lane Access", "Fast Parcel"],
          featuresAR: ["مسار دراجات متاح", "طرود سريعة"],
          price: "$8.50",
          priceAR: "٤٢٥ ج.م"
        },
        {
          id: "v-delivery-van",
          name: "Ford E-Transit Van",
          nameAR: "شاحنة توصيل كهربائية",
          desc: "Large electric cargo van for boxes",
          descAR: "شاحنة كهربائية واسعة للطرود الكبيرة",
          carType: "comfort",
          features: ["Large Capacity", "Heavy Duty"],
          featuresAR: ["سعة ضخمة", "أحمال ثقيلة"],
          price: "$19.00",
          priceAR: "٩٥٠ ج.م"
        }
      ]
    : (features.xl 
        ? [
            ...VEHICLES_DATA,
            {
              id: "v-xl-van",
              name: "Tesla Cybervan XL",
              nameAR: "تسلا سايبرفان XL",
              desc: "Huge electric futuristic shuttle",
              descAR: "حافلة كهربائية مستقبلية ضخمة",
              carType: "elite",
              features: ["Up to 6 Passengers", "Luxury Space"],
              featuresAR: ["حتى ٦ ركاب", "مساحة فاخرة واسعة"],
              price: "$42.50",
              priceAR: "٢١٢٥ ج.م",
              lat: 30.0445,
              lng: 31.2200,
              angle: 15,
              avatar: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#E2E2E2"/><path d="M20 70l10-30h40l10 30z" fill="#1A1A1A"/><circle cx="35" cy="70" r="10" fill="#444"/><circle cx="65" cy="70" r="10" fill="#444"/></svg>`,
              bestDriver: true,
              bestCar: true,
              bestRating: false
            }
          ]
        : VEHICLES_DATA
      );

  const handleBookRide = () => {
    if (!pickup || !destination) {
      alert(language === "AR" ? "يرجى إدخال نقطة الانطلاق والوجهة أولاً." : "Please fill in both Pickup and Destination address.");
      return;
    }

    let details = `\n- ${dict.lblPickup}: ${pickup}\n- ${dict.lblDestination}: ${destination}`;
    
    if (stops.length > 0) {
      const stopsStr = stops
        .map((s, i) => `${dict.lblStopTitle} ${i+1}: ${s.value || "(Empty)"}`)
        .join("\n- ");
      details += `\n- ${stopsStr}`;
    }

    if (activeTab === 'delivery') {
      const pkgTypeSelect = document.getElementById("packageTypeSelect");
      const pkgWeightSelect = document.getElementById("packageWeightSelect");
      const pkgType = pkgTypeSelect ? pkgTypeSelect.options[pkgTypeSelect.selectedIndex].text : "Parcel";
      const pkgWeight = pkgWeightSelect ? pkgWeightSelect.options[pkgWeightSelect.selectedIndex].text : "Under 1 kg";
      details += `\n- Service: AVEC Delivery\n- Package: ${pkgType} (${pkgWeight})`;
    } else if (activeTab === 'shopper') {
      details += `\n- Service: Personal Shopper\n- Shopping List: ${shoppingList}`;
    } else {
      if (ridingFor === "me") {
        details += `\n- Rider: Me (${userProfile.nickname || "Guest"})`;
      } else {
        const relative = userProfile.relatives[parseInt(ridingFor)];
        if (relative) {
          details += `\n- Rider (Relative): ${relative.name} (${relative.relationship})`;
          details += `\n- Rider Phone: ${relative.phone}`;
        }
      }
      details += `\n- ${dict.txtRidersCategory}: ${totalRiders} (${riders.adults} Adults, ${riders.kids} Kids, ${riders.elders} Elders)`;
    }

    // Include the selected payment method
    details += `\n- Payment Method: ${paymentMethod.toUpperCase()}`;

    if (schedule.enabled) {
      details += `\n- Scheduled for: ${schedule.date} @ ${schedule.time}`;
    }

    if (selectedVehicleId) {
      const v = displayVehicles.find(x => x.id === selectedVehicleId);
      if (v) {
        const finalPrice = appliedPromo 
          ? getPromoDiscountedPrice(language === "AR" ? v.priceAR : v.price, appliedPromo.discountVal) 
          : (language === "AR" ? v.priceAR : v.price);
        details += `\n- Selected Vehicle: ${language === "AR" ? v.nameAR : v.name} (${finalPrice})`;
      }
    }

    let successMsg = "";
    if (activeTab === 'delivery') {
      successMsg = language === "AR"
        ? "تم تأكيد طلب التوصيل! موصل الطرود في طريقه إليك."
        : "Delivery Confirmed! Your courier has been requested.";
    } else if (activeTab === 'shopper') {
      successMsg = language === "AR"
        ? "تم تأكيد طلب المتسوق الشخصي! السائق في طريقه للمتجر."
        : "Personal Shopper Confirmed! Your driver is heading to the shop.";
    } else {
      if (ridingFor === "me") {
        successMsg = dict.alertBookingSuccess;
      } else {
        const relative = userProfile.relatives[parseInt(ridingFor)];
        successMsg = language === "AR"
          ? `تم تأكيد حجز الرحلة لقريبك: ${relative.name} (${relative.relationship}!) تم إرسال رسالة تفصيلية وسائق للتواصل إلى الرقم ${relative.phone}.`
          : `Booking Confirmed for your relative: ${relative.name} (${relative.relationship})! A detailed SMS has been sent to ${relative.phone}.`;
      }
    }

    alert(`${successMsg}\n${details}`);
  };

  return (
    <>
      <div className={`booking-backdrop ${isOpen ? 'open' : 'hidden'}`} onClick={onClose} style={{ zIndex: 1900, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: isOpen ? 'auto' : 'none' }}></div>
      <aside className={`drawer-panel right-drawer ${isOpen ? 'open' : ''}`} id="bookingPanel" style={{ zIndex: 2000, width: '400px', maxWidth: '90vw' }}>
        <div className="drawer-header">
          <div>
            <h2 className="sidebar-title" id="txtRequestRide" style={{fontSize: '18px', margin: 0}}>
              {activeTab === "delivery" 
                ? (language === "AR" ? "توصيل الطرود" : "Package Delivery")
                : activeTab === "shopper"
                ? (language === "AR" ? "متسوق شخصي" : "Personal Shopper")
                : dict.txtRequestRide
              }
            </h2>
            <p className="sidebar-subtitle" id="txtRequestSubtitle" style={{margin: '4px 0 0'}}>
              {activeTab === "delivery"
                ? (language === "AR" ? "اشحن طرودك بسهولة مع تتبع مباشر" : "Ship items easily with live courier logs")
                : activeTab === "shopper"
                ? (language === "AR" ? "أرسل السائق لشراء الأغراض وتوصيلها إليك" : "Send a driver to buy items and deliver them to you")
                : dict.txtRequestSubtitle
              }
            </p>
          </div>
          <button onClick={onClose} className="icon-btn" aria-label="Close booking">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

      {/* Optional Delivery Service tabs */}
      {(features.delivery || features.shopper) && (
        <div className="m3-tabs-container" style={{ display: 'flex', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
          <button 
            type="button"
            className={`m3-tab-btn ${activeTab === 'ride' ? 'active' : ''}`}
            onClick={() => setActiveTab('ride')}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              padding: '10px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              color: activeTab === 'ride' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
              borderBottom: activeTab === 'ride' ? '2.5px solid var(--md-sys-color-primary)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>directions_car</span>
            <span>{language === "AR" ? "مشوار" : "Ride"}</span>
          </button>
          {features.delivery && (
          <button 
            type="button"
            className={`m3-tab-btn ${activeTab === 'delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivery')}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              padding: '10px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              color: activeTab === 'delivery' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
              borderBottom: activeTab === 'delivery' ? '2.5px solid var(--md-sys-color-primary)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>local_shipping</span>
            <span>{language === "AR" ? "توصيل" : "Delivery"}</span>
          </button>
          )}
          {features.shopper && (
          <button 
            type="button"
            className={`m3-tab-btn ${activeTab === 'shopper' ? 'active' : ''}`}
            onClick={() => setActiveTab('shopper')}
            style={{
              flex: 1,
              border: 'none',
              background: 'none',
              padding: '10px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '12px',
              color: activeTab === 'shopper' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)',
              borderBottom: activeTab === 'shopper' ? '2.5px solid var(--md-sys-color-primary)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shopping_bag</span>
            <span>{language === "AR" ? "متسوق" : "Shopper"}</span>
          </button>
          )}
        </div>
      )}

      <div className="booking-form-scroll" style={{ minHeight: 0 }}>
        {/* Route Builder */}
        <div className="route-builder">
          <div className="route-line-visual">
            <div className="dot start-dot"></div>
            <div className="line-dashed" style={{ minHeight: `${40 + stops.length * 65}px` }}></div>
            <div className="dot end-dot"></div>
          </div>

          <div className="route-inputs">
            {/* Pickup */}
            <div className="input-group">
              <span className="material-symbols-outlined input-icon start-icon">my_location</span>
              <div className="input-field-wrapper">
                <label htmlFor="pickupInput" className="field-label">{activeTab === 'shopper' ? (language === "AR" ? "موقع المتجر" : "Shop Location") : dict.lblPickup}</label>
                <input 
                  type="text" 
                  id="pickupInput" 
                  className="m3-input" 
                  value={pickup} 
                  onChange={(e) => setPickup(e.target.value)} 
                />
              </div>
            </div>

            {/* Stops list */}
            <div className="stops-list" id="stopsList">
              {stops.map((stop, index) => (
                <div key={stop.id} className="stop-item-wrapper" id={`stopContainer-${stop.id}`}>
                  <div className="input-group" style={{ flex: 1 }}>
                    <span className="material-symbols-outlined input-icon stop-icon" style={{ color: 'var(--md-sys-color-secondary)' }}>add_location</span>
                    <div className="input-field-wrapper">
                      <label className="field-label">{dict.lblStopTitle} {index + 1}</label>
                      <input 
                        type="text" 
                        className="m3-input stop-address-input" 
                        placeholder={dict.lblStopPlaceholder}
                        value={stop.value}
                        onChange={(e) => updateStopValue(stop.id, e.target.value)}
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeStop(stop.id)} className="btn-remove-stop">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Add stop button */}
            {stops.length < 5 && (
              <button type="button" onClick={addStop} className="btn-text-icon" id="btnAddStop">
                <span className="material-symbols-outlined">add_circle</span>
                <span id="txtAddStop">{dict.txtAddStop}</span>
              </button>
            )}

            {/* Destination */}
            <div className="input-group">
              <span className="material-symbols-outlined input-icon end-icon">location_on</span>
              <div className="input-field-wrapper">
                <label htmlFor="destinationInput" className="field-label">{activeTab === 'shopper' ? (language === "AR" ? "موقع التوصيل" : "Delivery Location") : dict.lblDestination}</label>
                <input 
                  type="text" 
                  id="destinationInput" 
                  className="m3-input" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab conditionals */}
        {activeTab === "delivery" ? (
          /* Package details inputs */
          <div className="booking-section">
            <h3 className="section-title">{language === "AR" ? "تفاصيل الشحنة" : "Package Details"}</h3>
            <p className="section-desc">
              {language === "AR" ? "أدخل المواصفات الخاصة بالطرد المطلوب شحنه." : "Provide specifications for package shipment."}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div className="m3-field">
                <label className="field-label" htmlFor="packageTypeSelect">{language === "AR" ? "نوع الطرد" : "Package Type"}</label>
                <select id="packageTypeSelect" className="m3-input" style={{ width: '100%', padding: '8px', border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--md-sys-color-surface-variant)', color: 'var(--md-sys-color-on-surface)' }}>
                  <option value="doc">{language === "AR" ? "مستندات وأوراق" : "Documents & Papers"}</option>
                  <option value="food">{language === "AR" ? "أطعمة ومواد غذائية" : "Food & Groceries"}</option>
                  <option value="parcel">{language === "AR" ? "صندوق / طرد" : "Box / Parcel"}</option>
                  <option value="fragile">{language === "AR" ? "قابل للكسر" : "Fragile Item"}</option>
                </select>
              </div>

              <div className="m3-field">
                <label className="field-label" htmlFor="packageWeightSelect">{language === "AR" ? "الوزن التقريبي" : "Estimated Weight"}</label>
                <select id="packageWeightSelect" className="m3-input" style={{ width: '100%', padding: '8px', border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--md-sys-color-surface-variant)', color: 'var(--md-sys-color-on-surface)' }}>
                  <option value="under1">{language === "AR" ? "أقل من ١ كجم" : "Under 1 kg"}</option>
                  <option value="1to5">١ - ٥ كجم</option>
                  <option value="5to10">٥ - ١٠ كجم</option>
                  <option value="over10">{language === "AR" ? "أكثر من ١٠ كجم" : "Over 10 kg"}</option>
                </select>
              </div>

              <div className="m3-field">
                <label className="field-label" htmlFor="packageDetailsInput">{language === "AR" ? "تعليمات خاصة للتوصيل" : "Delivery Instructions"}</label>
                <input 
                  type="text" 
                  id="packageDetailsInput"
                  className="m3-input" 
                  placeholder={language === "AR" ? "مثال: رقم المبنى، اترك عند الباب..." : "E.g. Access code, leave at door..."} 
                />
              </div>
            </div>
          </div>
        ) : activeTab === "shopper" ? (
          /* Shopper details */
          <div className="booking-section">
            <h3 className="section-title">{language === "AR" ? "قائمة المشتريات" : "Shopping List"}</h3>
            <p className="section-desc">
              {language === "AR" ? "أدخل الأغراض التي ترغب في شرائها من المتجر." : "List the items you want the driver to buy from the shop."}
            </p>
            <div className="m3-field" style={{ marginTop: '12px' }}>
              <textarea 
                className="m3-input" 
                rows="3"
                placeholder={language === "AR" ? "مثال: حليب، خبز، بيض..." : "E.g. Milk, Bread, Eggs..."}
                value={shoppingList}
                onChange={(e) => setShoppingList(e.target.value)}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
          </div>
        ) : (
          /* Rider selectors */
          <div className="booking-section">
            
            {/* Who is riding selection */}
            <div className="m3-field" style={{ marginBottom: '14px' }}>
              <label className="field-label" htmlFor="ridingForSelect" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>account_circle</span>
                <span>{language === "AR" ? "الراكب المستفيد من الرحلة" : "Who is riding?"}</span>
              </label>
              <select 
                id="ridingForSelect" 
                className="m3-input"
                value={ridingFor}
                onChange={(e) => setRidingFor(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 10px', 
                  border: '1px solid var(--md-sys-color-outline-variant)', 
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: 'var(--md-sys-color-surface-variant)',
                  color: 'var(--md-sys-color-on-surface)',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                <option value="me">
                  {userProfile.registered 
                    ? (language === "AR" ? `أنا (${userProfile.nickname})` : `Me (${userProfile.nickname})`)
                    : (language === "AR" ? "أنا (راكب زائر)" : "Me (Guest Rider)")}
                </option>
                {userProfile.registered && userProfile.relatives && userProfile.relatives.map((rel, idx) => (
                  <option key={idx} value={idx.toString()}>
                    {language === "AR" 
                      ? `${rel.name} (${rel.relationship === 'son' ? 'ابن' : rel.relationship === 'daughter' ? 'ابنة' : rel.relationship === 'father' ? 'أب' : rel.relationship === 'mother' ? 'أم' : rel.relationship === 'spouse' ? 'زوج/زوجة' : rel.relationship})`
                      : `${rel.name} (${rel.relationship})`}
                  </option>
                ))}
              </select>
            </div>

            <h3 className="section-title">{dict.txtRidersCategory}</h3>
            <p className="section-desc">
              {language === "AR"
                ? `يسمح بحد أقصى ${maxRiders} ركاب لكل حجز.`
                : `A maximum of ${maxRiders} riders are allowed per booking.`
              }
            </p>
            
            <div className="rider-selectors" style={{ marginTop: '10px' }}>
              {/* Adults */}
              <div className="rider-counter-row">
                <div className="rider-info">
                  <span className="rider-name">{dict.txtAdults}</span>
                  <span className="rider-age">{dict.txtAdultsAge}</span>
                </div>
                <div className="counter-controls">
                  <button 
                    type="button" 
                    onClick={() => decrementRider('adults')} 
                    className="counter-btn" 
                    disabled={riders.adults === 0}
                  >-</button>
                  <span className="counter-value">{riders.adults}</span>
                  <button 
                    type="button" 
                    onClick={() => incrementRider('adults')} 
                    className="counter-btn"
                    disabled={totalRiders >= maxRiders}
                  >+</button>
                </div>
              </div>

              {/* Kids */}
              <div className="rider-counter-row">
                <div className="rider-info">
                  <span className="rider-name">{dict.txtKids}</span>
                  <span className="rider-age">{dict.txtKidsAge}</span>
                </div>
                <div className="counter-controls">
                  <button 
                    type="button" 
                    onClick={() => decrementRider('kids')} 
                    className="counter-btn"
                    disabled={riders.kids === 0}
                  >-</button>
                  <span className="counter-value">{riders.kids}</span>
                  <button 
                    type="button" 
                    onClick={() => incrementRider('kids')} 
                    className="counter-btn"
                    disabled={totalRiders >= maxRiders}
                  >+</button>
                </div>
              </div>

              {/* Elders */}
              <div className="rider-counter-row">
                <div className="rider-info">
                  <span className="rider-name">{dict.txtElders}</span>
                  <span className="rider-age">{dict.txtEldersAge}</span>
                </div>
                <div className="counter-controls">
                  <button 
                    type="button" 
                    onClick={() => decrementRider('elders')} 
                    className="counter-btn"
                    disabled={riders.elders === 0}
                  >-</button>
                  <span className="counter-value">{riders.elders}</span>
                  <button 
                    type="button" 
                    onClick={() => incrementRider('elders')} 
                    className="counter-btn"
                    disabled={totalRiders >= maxRiders}
                  >+</button>
                </div>
              </div>
            </div>

            {/* Traveling with Pets (Optional Badge) */}
            {features.pets && (
              <div style={{ 
                marginTop: '12px', 
                padding: '10px', 
                borderRadius: 'var(--border-radius-md)', 
                backgroundColor: 'var(--md-sys-color-secondary-container)', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                border: '1px solid var(--md-sys-color-outline-variant)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--md-sys-color-primary)' }}>pets</span>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--md-sys-color-on-secondary-container)' }}>
                      {language === "AR" ? "السفر مع حيوانات أليفة" : "Traveling with Pet"}
                    </div>
                    <div style={{ fontSize: '9.5px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                      {language === "AR" ? "سيتم توفير حزام أمان خاص" : "Safety harness will be provided"}
                    </div>
                  </div>
                </div>
                <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
              </div>
            )}

            {/* Warning banner */}
            {(totalRiders > maxRiders || totalRiders === 0) && (
              <div className="m3-banner error-banner" id="riderCountAlert" style={{ marginTop: '12px' }}>
                <span className="material-symbols-outlined">warning</span>
                <span id="txtRiderLimitWarning">
                  {totalRiders === 0 
                    ? (language === "EN" ? "Must select at least 1 rider." : "يجب اختيار راكب واحد على الأقل.")
                    : (language === "AR" ? `لا يمكن أن يتجاوز إجمالي الركاب ${maxRiders} ركاب!` : `Total riders cannot exceed ${maxRiders} per booking!`)
                  }
                </span>
              </div>
            )}
          </div>
        )}

        {/* Schedule Section */}
        <div className="booking-section">
          <div className="schedule-header-toggle">
            <h3 className="section-title">{dict.txtScheduleRide}</h3>
            <label className="m3-switch">
              <input 
                type="checkbox" 
                checked={schedule.enabled}
                onChange={(e) => setSchedule(prev => ({ ...prev, enabled: e.target.checked }))}
              />
              <span className="switch-slider"></span>
            </label>
          </div>
          
          {schedule.enabled && (
            <div className="schedule-inputs-grid" id="scheduleInputs" style={{ marginTop: '10px' }}>
              <div className="m3-field">
                <label htmlFor="scheduleDate" className="field-label">{dict.lblDate}</label>
                <input 
                  type="date" 
                  id="scheduleDate" 
                  className="m3-input" 
                  value={schedule.date}
                  onChange={(e) => setSchedule(prev => ({ ...prev, date: e.target.value }))}
                  min={minDate}
                  max={maxDate}
                />
              </div>
              <div className="m3-field">
                <label htmlFor="scheduleTime" className="field-label">{dict.lblTime}</label>
                <input 
                  type="time" 
                  id="scheduleTime" 
                  className="m3-input" 
                  value={schedule.time}
                  onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
          )}
          {schedule.enabled && (
            <p className="schedule-notice" id="txtScheduleNotice" style={{ marginTop: '6px' }}>{dict.txtScheduleNotice}</p>
          )}
        </div>

        {/* Promotions section */}
        <div className="booking-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="section-title" id="txtPromoTitle">{dict.txtPromoTitle}</h3>
            <button type="button" onClick={() => setIsPromoOpen(true)} className="btn-text-icon" id="btnShowPromos" style={{ padding: '2px 6px' }}>
              <span className="material-symbols-outlined">local_offer</span>
              <span id="txtViewOffers" style={{ fontSize: '11px' }}>{dict.txtViewOffers}</span>
            </button>
          </div>
          <div className="promo-apply-row" style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <input 
              type="text" 
              className="m3-input" 
              placeholder={language === "AR" ? "أدخل الرمز الترويجي" : "Enter promo code"}
              style={{ flex: 1, backgroundColor: 'var(--md-sys-color-surface-variant)', padding: '8px 12px', borderRadius: 'var(--border-radius-md)', fontSize: '12px', border: '1px solid transparent' }}
              value={promoCodeInput}
              onChange={(e) => setPromoCodeInput(e.target.value)}
            />
            <button 
              type="button" 
              onClick={handleApplyPromo}
              style={{ border: 'none', backgroundColor: 'var(--md-sys-color-primary)', color: 'white', borderRadius: 'var(--border-radius-xl)', padding: '0 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', height: '34px' }}
            >
              {language === "AR" ? "تطبيق" : "Apply"}
            </button>
          </div>
          {promoFeedback.text && (
            <div 
              style={{ fontSize: '11px', marginTop: '4px', fontWeight: 600, color: promoFeedback.isError ? 'var(--md-sys-color-error)' : '#4CAF50' }}
            >
              {promoFeedback.text}
            </div>
          )}
        </div>

        {/* Vehicle list */}
        <div className="booking-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="section-title">
              {activeTab === "delivery"
                ? (language === "AR" ? "طرق التوصيل المتاحة" : "Delivery Methods")
                : activeTab === "shopper"
                  ? (language === "AR" ? "فئة السيارة" : "Vehicle Category")
                  : dict.txtSelectVehicle
              }
            </h3>
            {userProfile?.gender === 'female' && activeTab === 'ride' && (
              <label className="m3-switch" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--md-sys-color-primary)' }}>
                  {language === 'AR' ? 'سائقة فقط' : 'Women Only'}
                </span>
                <input 
                  type="checkbox" 
                  checked={womenOnly}
                  onChange={(e) => setWomenOnly(e.target.checked)}
                />
                <span className="switch-slider"></span>
              </label>
            )}
          </div>
          
          {womenOnly && activeTab === 'ride' && (
            <div className="m3-banner" style={{ marginTop: '8px', backgroundColor: 'var(--md-sys-color-primary-container)', color: 'var(--md-sys-color-on-primary-container)' }}>
              <span className="material-symbols-outlined">female</span>
              <span style={{ fontSize: '12px' }}>
                {language === 'AR' 
                  ? 'تم تفعيل وضع السيدات. سيتم توجيه طلبك لسائقات فقط.' 
                  : 'Women-only mode active. Your request will only match with female drivers.'}
              </span>
            </div>
          )}

          <div className="vehicles-list" id="vehiclesList" style={{ marginTop: '10px' }}>
            {displayVehicles.map(v => {
              const vName = language === "AR" ? v.nameAR : v.name;
              const vDesc = language === "AR" ? v.descAR : v.desc;
              const vPrice = language === "AR" ? v.priceAR : v.price;
              const vFeatures = language === "AR" ? v.featuresAR : v.features;

              return (
                <div 
                  key={v.id} 
                  className={`vehicle-card ${selectedVehicleId === v.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVehicleId(v.id)}
                >
                  <div className="vehicle-icon-box">
                    <span className="material-symbols-outlined">
                      {v.carType === "elite" ? "stars" : v.carType === "kid-friendly" ? "family_home" : "electric_car"}
                    </span>
                  </div>
                  <div className="vehicle-details">
                    <div className="vehicle-name-row">
                      <span className="vehicle-name">{vName}</span>
                      {appliedPromo ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span className="vehicle-price-original" style={{ fontSize: '11px', textDecoration: 'line-through', color: 'var(--md-sys-color-outline)', lineHeight: 1.1 }}>{vPrice}</span>
                          <span className="vehicle-price-discounted" style={{ fontWeight: 700, fontSize: '14px', color: '#4CAF50', lineHeight: 1.1, marginTop: '2px' }}>
                            {getPromoDiscountedPrice(vPrice, appliedPromo.discountVal)}
                          </span>
                        </div>
                      ) : (
                        <span className="vehicle-price">{vPrice}</span>
                      )}
                    </div>
                    <span className="vehicle-desc">{vDesc}</span>
                    <div className="vehicle-features">
                      {vFeatures.map(f => <span key={f} className="feature-tag">{f}</span>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        {/* Payment Method Selector */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--md-sys-color-on-surface-variant)', marginBottom: '8px', display: 'block' }}>
            {language === "AR" ? "طريقة الدفع" : "Payment Method"}
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              type="button"
              onClick={() => setPaymentMethod('card')}
              style={{ flex: 1, padding: '8px 4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', border: paymentMethod === 'card' ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)', background: paymentMethod === 'card' ? 'var(--md-sys-color-primary-container)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: paymentMethod === 'card' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)' }}>credit_card</span>
              <span style={{ fontSize: '10px', fontWeight: paymentMethod === 'card' ? 700 : 500, color: paymentMethod === 'card' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)' }}>{language === "AR" ? "بطاقة" : "Card"}</span>
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('ewallet')}
              style={{ flex: 1, padding: '8px 4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', border: paymentMethod === 'ewallet' ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)', background: paymentMethod === 'ewallet' ? 'var(--md-sys-color-primary-container)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: paymentMethod === 'ewallet' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)' }}>account_balance_wallet</span>
              <span style={{ fontSize: '10px', fontWeight: paymentMethod === 'ewallet' ? 700 : 500, color: paymentMethod === 'ewallet' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)' }}>{language === "AR" ? "محفظة" : "eWallet"}</span>
            </button>
            <button 
              type="button"
              onClick={() => setPaymentMethod('cash')}
              style={{ flex: 1, padding: '8px 4px', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', border: paymentMethod === 'cash' ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)', background: paymentMethod === 'cash' ? 'var(--md-sys-color-primary-container)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: paymentMethod === 'cash' ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-on-surface-variant)' }}>payments</span>
              <span style={{ fontSize: '10px', fontWeight: paymentMethod === 'cash' ? 700 : 500, color: paymentMethod === 'cash' ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)' }}>{language === "AR" ? "نقدي" : "Cash"}</span>
            </button>
          </div>
        </div>

        {features.priority && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 12px', 
            borderRadius: 'var(--border-radius-md)', 
            border: '1px solid var(--md-sys-color-primary-container)', 
            backgroundColor: 'var(--md-sys-color-primary-container)', 
            color: 'var(--md-sys-color-on-primary-container)', 
            marginBottom: '10px' 
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--md-sys-color-primary)' }}>bolt</span>
            <div style={{ fontSize: '11px', fontWeight: 600 }}>
              {language === "AR" 
                ? "إرسال ذو أولوية: سائق مضمون خلال أقل من ٣ دقائق." 
                : "Priority dispatch active: Guaranteed matching in <3 min."}
            </div>
          </div>
        )}
        <button 
          type="button" 
          onClick={handleBookRide}
          className="m3-btn btn-primary" 
          disabled={activeTab === 'ride' ? (totalRiders === 0 || totalRiders > maxRiders) : false}
        >
          <span className="btn-label">
            {activeTab === 'delivery' 
              ? (language === "AR" ? "تأكيد طلب التوصيل AVEC" : "Book AVEC Delivery")
              : dict.txtBookNowBtn
            }
          </span>
        </button>
      </div>
      </aside>
    </>
  );
}
