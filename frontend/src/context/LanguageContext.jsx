import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    // Brand
    brandName: "Agri Nexus",
    brandSubtitle: "AI Powered Farming",

    // Navigation Sidebar
    navDashboard: "Dashboard",
    navAiAssistant: "AI Farming Assistant",
    navMyFarms: "My Farms",
    navMyCrops: "My Crops",
    navDiseaseDetection: "AI Disease Detection",
    navScanHistory: "Scan History",
    navMarketplace: "Farmers Marketplace",
    navTasks: "Task Calendar",
    navWeather: "7-Day Weather & Advisory",
    navCalculator: "Fertilizer Calculator",
    navReports: "Analytics & Reports",
    navProfile: "Profile Settings",
    signOut: "Sign Out",

    // Dashboard
    welcomeBack: "Welcome back, Farmer!",
    dashboardSubtitle: "Smart farming overview & real-time field monitoring.",
    quickAiScan: "Quick AI Scan",
    activeFarms: "Active Farms",
    trackedCrops: "Tracked Crops",
    aiScansCount: "AI Disease Scans",
    weatherAlert: "Weather Forecast",
    recentCrops: "Recently Added Crops",
    recentFarms: "Your Managed Farms",
    viewAll: "View All",

    // AI Farming Assistant
    aiAssistantTitle: "AI Farming Assistant",
    aiAssistantSubtitle: "Your intelligent farming companion",
    activeContext: "Active Farm Context",
    selectFarm: "Select Farm",
    selectCrop: "Select Crop",
    noContext: "No Context Selected (General Advice)",
    quickPrompts: "Quick Farming Prompts",
    typeMessagePlaceholder: "Ask about fertilizer, pest diagnosis, watering schedules...",
    aiThinking: "AI is thinking & analyzing context...",
    clearChat: "Clear Chat",

    // Farms Page
    farmsTitle: "My Farm Plots",
    farmsSubtitle: "Manage your agricultural land, soil types, and water sources.",
    addFarm: "Add New Farm",
    noFarms: "No Farms Registered Yet",
    area: "Area",
    soilType: "Soil Type",
    waterSource: "Water Source",
    location: "Location",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",

    // Crops Page
    cropsTitle: "My Crops",
    cropsSubtitle: "Track crop varieties, sowing dates, and harvest schedules.",
    addCrop: "Add New Crop",
    noCrops: "No Crops Tracked Yet",
    variety: "Variety",
    season: "Season",
    sowingDate: "Sowing Date",
    expectedHarvest: "Expected Harvest",
    status: "Status",

    // Status Tags
    statusPlanted: "Planted",
    statusGrowing: "Growing",
    statusFlowering: "Flowering",
    statusHarvestReady: "Harvest Ready",
    statusHarvested: "Harvested",

    // Disease Detection
    diseaseTitle: "AI Crop Disease Detection",
    diseaseSubtitle: "Upload a photo of an unhealthy leaf for instant AI disease identification.",
    dropzoneTitle: "Drag & drop leaf photo here",
    dropzoneSubtitle: "or click to select from your device (JPG, PNG)",
    analyzeLeaf: "Analyze Leaf Health",
    analyzing: "Analyzing Leaf Image...",
    diagnosisResult: "AI Diagnosis Result",
    confidence: "Confidence Score",
    severity: "Severity Level",
    treatment: "Recommended Treatment",
    prevention: "Prevention Steps",

    // Marketplace
    marketplaceTitle: "Farmers Marketplace",
    marketplaceSubtitle: "Buy and sell harvested produce, seeds, fertilizers, and farm equipment.",
    postItem: "Post Item for Sale",
    searchPlaceholder: "Search crops, seeds, location...",
    chatWhatsapp: "Chat WhatsApp",
    callSeller: "Call Seller",
    price: "Price",
    seller: "Seller",

    // Weather & Advisory
    weatherTitle: "7-Day Weather & Smart Advisory",
    weatherSubtitle: "Real-time weather forecast paired with automated agricultural tips.",
    extendedForecast: "7-Day Extended Forecast",
    advisoryTips: "Smart Farming Advisory Tips",
    wind: "Wind",
    rainProb: "Rain Prob.",

    // Calculator
    calcTitle: "TNAU NPK Fertilizer & Yield Calculator",
    calcSubtitle: "Calculate Urea, DAP, and MOP bag requirements based on TNAU guidelines.",
    selectCropType: "Select Crop",
    farmArea: "Farm Area (Acres)",
    ureaBags: "Urea Bags (50kg)",
    dapBags: "DAP Bags (50kg)",
    mopBags: "MOP Bags (50kg)",
    yieldForecast: "Estimated Crop Harvest Yield",
    revenueForecast: "Projected Market Revenue",
    printCalc: "Print Calculation",
  },

  ta: {
    // Brand
    brandName: "அக்ரி நெக்சஸ்",
    brandSubtitle: "AI செயற்கை நுண்ணறிவு விவசாயம்",

    // Navigation Sidebar
    navDashboard: "முகப்பு",
    navAiAssistant: "AI விவசாய உதவியாளர்",
    navMyFarms: "எனது பண்ணைகள்",
    navMyCrops: "எனது பயிர்கள்",
    navDiseaseDetection: "AI நோய் கண்டறிதல்",
    navScanHistory: "நோய் வரலாறு",
    navMarketplace: "சந்தைப்பேட்டை",
    navTasks: "விவசாய காலண்டர்",
    navWeather: "7-நாள் வானிலை",
    navCalculator: "உரக் கணக்கீடு",
    navReports: "பகுப்பாய்வு & அறிக்கை",
    navProfile: "சுயவிவரம்",
    signOut: "வெளியேறு",

    // Dashboard
    welcomeBack: "வணக்கம் விவசாயி நண்பரே!",
    dashboardSubtitle: "ஸ்மார்ட் விவசாய மேலாண்மை மற்றும் நேரலை நில கண்காணிப்பு.",
    quickAiScan: "AI இலை பரிசோதனை",
    activeFarms: "செயலில் உள்ள பண்ணைகள்",
    trackedCrops: "கண்காணிக்கப்படும் பயிர்கள்",
    aiScansCount: "AI நோய் சோதனைகள்",
    weatherAlert: "வானிலை அறிக்கை",
    recentCrops: "சமீபத்தில் சேர்த்த பயிர்கள்",
    recentFarms: "உங்கள் பண்ணைகள்",
    viewAll: "அனைத்தும் காண்க",

    // AI Farming Assistant
    aiAssistantTitle: "AI விவசாய உதவியாளர்",
    aiAssistantSubtitle: "உங்கள் அறிவார்ந்த விவசாய வழிகாட்டி",
    activeContext: "தேர்ந்தெடுக்கப்பட்ட பண்ணை விவரம்",
    selectFarm: "பண்ணையைத் தேர்ந்தெடுக்கவும்",
    selectCrop: "பயிரைத் தேர்ந்தெடுக்கவும்",
    noContext: "பொதுவான ஆலோசனை",
    quickPrompts: "முக்கிய விவசாய கேள்விகள்",
    typeMessagePlaceholder: "உரம், பூச்சி நோய், பாசன முறை பற்றி கேட்கவும்...",
    aiThinking: "AI பதில் ஆராய்கிறது...",
    clearChat: "உரையாடலை அழி",

    // Farms Page
    farmsTitle: "எனது பண்ணை நிலங்கள்",
    farmsSubtitle: "உங்கள் நில பரப்பளவு, மண் வகை மற்றும் நீர் ஆதாரங்களை நிர்வகிக்கவும்.",
    addFarm: "புதிய பண்ணை சேர்க்க",
    noFarms: "பண்ணைகள் எதுவும் பதிவு செய்யப்படவில்லை",
    area: "பரப்பளவு",
    soilType: "மண் வகை",
    waterSource: "நீர் ஆதாரம்",
    location: "இடம் / ஊர்",
    actions: "செயல்கள்",
    edit: "திருத்து",
    delete: "நீக்கு",

    // Crops Page
    cropsTitle: "எனது பயிர்கள்",
    cropsSubtitle: "பயிர் ரகங்கள், விதைப்பு தேதி மற்றும் அறுவடை அட்டவணையை கண்காணிக்கவும்.",
    addCrop: "புதிய பயிர் சேர்க்க",
    noCrops: "பயிர்கள் எதுவும் பதிவு செய்யப்படவில்லை",
    variety: "பயிர் ரகம்",
    season: "பருவம்",
    sowingDate: "விதைத்த தேதி",
    expectedHarvest: "எதிர்பார்க்கும் அறுவடை",
    status: "தற்போதைய நிலை",

    // Status Tags
    statusPlanted: "விதைக்கப்பட்டது",
    statusGrowing: "வளர்கிறது",
    statusFlowering: "பூக்கும் நிலை",
    statusHarvestReady: "அறுவடைக்கு தயார்",
    statusHarvested: "அறுவடை செய்யப்பட்டது",

    // Disease Detection
    diseaseTitle: "AI பயிர் நோய் கண்டறிதல்",
    diseaseSubtitle: "பாதிக்கப்பட்ட இலையின் புகைப்படத்தை பதிவேற்றி உடனுக்குடன் AI நோயறிதல் பெறுங்கள்.",
    dropzoneTitle: "இலை புகைப்படத்தை இங்கே வைக்கவும்",
    dropzoneSubtitle: "அல்லது உங்கள் போனில் இருந்து தேர்ந்தெடுக்கவும் (JPG, PNG)",
    analyzeLeaf: "இலையை பரிசோதி",
    analyzing: "பரிசோதிக்கப்படுகிறது...",
    diagnosisResult: "AI நோய் கண்டறிதல் முடிவு",
    confidence: "துல்லிய அளவு",
    severity: "பாதிப்பு அளவு",
    treatment: "பரிந்துரைக்கப்படும் சிகிச்சை",
    prevention: "தடுப்பு முறைகள்",

    // Marketplace
    marketplaceTitle: "விவசாயிகள் சந்தைப்பேட்டை",
    marketplaceSubtitle: "விளைபொருட்கள், விதைகள், உரங்கள் மற்றும் விவசாய கருவிகளை நேரடி விற்பனை செய்யுங்கள்.",
    postItem: "விற்பனைக்கு பதிவு செய்",
    searchPlaceholder: "பயிர், விதைகள், ஊர் தேடுக...",
    chatWhatsapp: "வாட்ஸ்அப் அரட்டை",
    callSeller: "விற்பனையாளரை அழை",
    price: "விலை",
    seller: "விற்பனையாளர்",

    // Weather & Advisory
    weatherTitle: "7-நாள் வானிலை & விவசாய ஆலோசனை",
    weatherSubtitle: "நேரலை வானிலை முன்னறிவிப்பு மற்றும் தானியங்கி விவசாய ஆலோசனைகள்.",
    extendedForecast: "7-நாள் விரிவான வானிலை",
    advisoryTips: "ஸ்மார்ட் விவசாய ஆலோசனைகள்",
    wind: "காற்றின் வேகம்",
    rainProb: "மழை வாய்ப்பு",

    // Calculator
    calcTitle: "TNAU உரக் கணக்கீடு & மகசூல் கணிப்பு",
    calcSubtitle: "TNAU பல்கலைக்கழக பரிந்துரைப்படி யூரியா, டிஏபி, பொட்டாஷ் கணக்கீடு.",
    selectCropType: "பயிரைத் தேர்ந்தெடுக்கவும்",
    farmArea: "நில பரப்பளவு (ஏக்கர்)",
    ureaBags: "யூரியா மூட்டைகள் (50கிலோ)",
    dapBags: "டிஏபி மூட்டைகள் (50கிலோ)",
    mopBags: "பொட்டாஷ் மூட்டைகள் (50கிலோ)",
    yieldForecast: "எதிர்பார்க்கப்படும் மகசூல்",
    revenueForecast: "எதிர்பார்க்கப்படும் வருவாய்",
    printCalc: "அச்சிடுக",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("agri_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("agri_lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ta" : "en"));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
