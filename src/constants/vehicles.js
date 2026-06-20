// --- Inline SVG Avatars (Offline Friendly) ---
export const AVATARS = {
  marcus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#E8DEF8"/><circle cx="50" cy="42" r="20" fill="#381E72"/><path d="M20 80c0-15 12-25 30-25s30 10 30 25z" fill="#381E72"/><circle cx="45" cy="40" r="2.5" fill="#FFF"/><circle cx="55" cy="40" r="2.5" fill="#FFF"/><path d="M46 50q4 2 8 0" stroke="#FFF" stroke-width="2" fill="none"/></svg>`,
  elena: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FFD8E4"/><circle cx="50" cy="40" r="18" fill="#633B48"/><path d="M22 80c0-12 10-22 28-22s28 10 28 22z" fill="#633B48"/><path d="M35 35c2-6 10-10 15-10s13 4 15 10" stroke="#633B48" stroke-width="4" fill="none"/><circle cx="44" cy="40" r="2" fill="#FFF"/><circle cx="56" cy="40" r="2" fill="#FFF"/><path d="M47 48q3 2 6 0" stroke="#FFF" stroke-width="2" fill="none"/></svg>`,
  samir: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#D0BCFF"/><circle cx="50" cy="42" r="21" fill="#21005D"/><path d="M18 80c0-16 14-26 32-26s32 10 32 26z" fill="#21005D"/><rect x="42" y="32" width="16" height="4" rx="2" fill="#D0BCFF"/><circle cx="44" cy="42" r="3" fill="#FFF"/><circle cx="56" cy="42" r="3" fill="#FFF"/><path d="M45 52q5 3 10 0" stroke="#FFF" stroke-width="2" fill="none"/></svg>`,
  chloe: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#EADDFF"/><circle cx="50" cy="38" r="18" fill="#4F378B"/><path d="M24 78c0-12 10-20 26-20s26 8 26 20z" fill="#4F378B"/><path d="M60 25c5 5 10 12 8 18" stroke="#4F378B" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="45" cy="38" r="2" fill="#FFF"/><circle cx="55" cy="38" r="2" fill="#FFF"/><path d="M46 46q4 2 8 0" stroke="#FFF" stroke-width="2" fill="none"/></svg>`,
  arthur: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#E7E0EC"/><circle cx="50" cy="43" r="19" fill="#49454F"/><path d="M21 80c0-14 12-24 29-24s29 10 29 24z" fill="#49454F"/><path d="M40 25c5-2 15-2 20 0" stroke="#E7E0EC" stroke-width="3" fill="none"/><circle cx="45" cy="42" r="2" fill="#FFF"/><circle cx="55" cy="42" r="2" fill="#FFF"/><path d="M47 51q3 1 6 0" stroke="#FFF" stroke-width="1.5" fill="none"/></svg>`
};

export function svgToDataUrl(svgString) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const VEHICLES_DATA = [
  {
    id: "v-comfort",
    name: "Toyota Camry Hybrid",
    nameAR: "تويوتا كامري هجينة",
    desc: "Everyday smart commutes",
    descAR: "تنقلات ذكية يومية مريحة",
    driverName: "Arthur Pendelton",
    rating: 4.82,
    trips: 3410,
    exp: 5,
    plate: "أ و ج - ١٠٢",
    carType: "comfort",
    features: ["Eco Friendly", "Silent Ride"],
    featuresAR: ["صديقة للبيئة", "رحلة هادئة"],
    price: "$14.50",
    priceAR: "٧٢٥ ج.م",
    lat: 30.0482,
    lng: 31.2351,
    angle: 45,
    avatar: AVATARS.arthur,
    bestDriver: false,
    bestCar: false,
    bestRating: false
  },
  {
    id: "v-elite-tesla",
    name: "Tesla Model Y",
    nameAR: "تسلا موديل Y",
    desc: "Luxury autopilot electric performance",
    descAR: "أداء كهربائي فاخر مع قيادة ذاتية",
    driverName: "Marcus Sterling",
    rating: 4.96,
    trips: 1240,
    exp: 3,
    plate: "أ و ج - ٧٨٩",
    carType: "elite",
    features: ["Electric", "Autopilot", "Leather Seats"],
    featuresAR: ["كهربائية بالكامل", "قيادة ذاتية", "مقاعد جلدية فاخرة"],
    price: "$28.90",
    priceAR: "١٤٤٥ ج.م",
    lat: 30.0515,
    lng: 31.2428,
    angle: 120,
    avatar: AVATARS.marcus,
    bestDriver: true,
    bestCar: true,
    bestRating: true
  },
  {
    id: "v-family",
    name: "Mercedes-Benz EQE",
    nameAR: "مرسيدس EQE",
    desc: "Premium executive ride for families",
    descAR: "رحلة عائلية فاخرة مريحة",
    driverName: "Elena Rostova",
    rating: 4.94,
    trips: 840,
    exp: 2,
    plate: "أ و ج - ٥٥٢",
    carType: "elite",
    features: ["Spacious", "WiFi", "Heated Seats"],
    featuresAR: ["مساحة واسعة", "إنترنت مجاني", "تدفئة مقاعد"],
    price: "$34.20",
    priceAR: "١٧١٠ ج.م",
    lat: 30.0392,
    lng: 31.2281,
    angle: 280,
    avatar: AVATARS.elena,
    bestDriver: false,
    bestCar: true,
    bestRating: true
  },
  {
    id: "v-kids",
    name: "Chevy Bolt EV (Kid Safe)",
    nameAR: "شيفروليه بولت (آمن للأطفال)",
    desc: "Equipped with child seats & activities",
    descAR: "مجهزة بمقاعد أطفال وألعاب مسلية",
    driverName: "Chloe Dupont",
    rating: 4.97,
    trips: 2150,
    exp: 4,
    plate: "أ و ج - ٩٠٣",
    carType: "kid-friendly",
    features: ["Baby Seat", "Kids Toys", "Tablet Available"],
    featuresAR: ["مقعد أطفال", "ألعاب أطفال", "شاشة لوحية متاحة"],
    price: "$18.20",
    priceAR: "٩١٠ ج.م",
    lat: 30.0456,
    lng: 31.2460,
    angle: 90,
    avatar: AVATARS.chloe,
    bestDriver: true,
    bestCar: false,
    bestRating: true
  },
  {
    id: "v-eco",
    name: "Hyundai Ioniq 5",
    nameAR: "هيونداي أيونك ٥",
    desc: "Ultra-fast charging eco-cruiser",
    descAR: "سيارة صديقة للبيئة شحن فائق السرعة",
    driverName: "Samir Al-Mansoor",
    rating: 4.88,
    trips: 1540,
    exp: 3,
    plate: "أ و ج - ٣٠٤",
    carType: "eco",
    features: ["Zero Emission", "Panoramic Roof"],
    featuresAR: ["صفر انبعاثات", "سقف بانورامي"],
    price: "$16.00",
    priceAR: "٨٠٠ ج.م",
    lat: 30.0348,
    lng: 31.2312,
    angle: 190,
    avatar: AVATARS.samir,
    bestDriver: false,
    bestCar: false,
    bestRating: false
  }
];

export function getPromoDiscountedPrice(priceStr, discountVal) {
  if (!discountVal) return priceStr;
  const match = priceStr.match(/([\d.,]+)/);
  if (!match) return priceStr;
  const val = parseFloat(match[1].replace(',', '.'));
  const discVal = val * (1 - discountVal);
  const isEuro = priceStr.includes('€');
  const isEgp = priceStr.includes('ج.م');
  if (isEuro) {
    return `${discVal.toFixed(2).replace('.', ',')} €`;
  } else if (isEgp) {
    return `${Math.round(discVal)} ج.م`;
  } else {
    return `$${discVal.toFixed(2)}`;
  }
}
