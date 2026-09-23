/**
 * Smart Storage & Quality Protection System - Frontend Application
 * Brain: Storage Risk AI Engine & Produce Vulnerability Curves
 * Designed for Tribal Families, Self-Help Groups (SHGs) & Agronomic Centers
 */

// 1. Agronomic Produce Profiles Database
const PRODUCE_DATABASE = {
  mahua: {
    id: 'mahua',
    name: 'Mahua',
    hindiName: 'महुआ (फूल)',
    category: 'Forest Flower',
    categoryHindi: 'वनोपज फूल',
    icon: '🌰',
    safeTempMin: 18.0,
    safeTempMax: 28.0,
    warningTempMax: 32.0,
    safeHumMin: 40.0,
    safeHumMax: 60.0,
    criticalHum: 65.0,
    safeDaysMax: 30,
    defaultDays: 12,
    threatEn: 'Mahua flowers are rich in sugars and absorb damp air rapidly, causing Aspergillus mold and fermentation if RH exceeds 60%.',
    threatHi: 'महुआ के फूलों में उच्च शर्करा होती है। 60% से अधिक नमी होने पर फफूंद (मोल्ड) और सड़न बहुत तेजी से फैलती है।',
    dryTipEn: 'Dry Mahua on clean mats in shade before bagging. Never pack warm flowers.',
    dryTipHi: 'महुआ को बोरों में भरने से पहले साफ चटाई पर छांव में अच्छी तरह सुखाएं।'
  },
  tamarind: {
    id: 'tamarind',
    name: 'Tamarind',
    hindiName: 'इमली',
    category: 'Tree Fruit / Pulp',
    categoryHindi: 'वनोपज फल/गूदा',
    icon: '🌱',
    safeTempMin: 15.0,
    safeTempMax: 26.0,
    warningTempMax: 30.0,
    safeHumMin: 45.0,
    safeHumMax: 60.0,
    criticalHum: 68.0,
    safeDaysMax: 90,
    defaultDays: 20,
    threatEn: 'High tartaric acid & sugars attract moisture, leading to blackening, liquefaction, and beetle infestation.',
    threatHi: 'इमली की टार्टरिक एसिड और चीनी नमी सोखती है, जिससे इमली काली पड़कर पिघलने लगती है और कीड़े लगते हैं।',
    dryTipEn: 'Press into compact slabs and pack in airtight dry containers or apply traditional salt layer.',
    dryTipHi: 'दबाकर टिकिया बनाएं और वायुरोधी डिब्बों में रखें या पारंपरिक नमक की परत लगाएं।'
  },
  paddy: {
    id: 'paddy',
    name: 'Paddy (Rice)',
    hindiName: 'धान',
    category: 'Grain / Cereal',
    categoryHindi: 'अनाज / धान्य',
    icon: '🌾',
    safeTempMin: 15.0,
    safeTempMax: 28.0,
    warningTempMax: 33.0,
    safeHumMin: 50.0,
    safeHumMax: 65.0,
    criticalHum: 70.0,
    safeDaysMax: 180,
    defaultDays: 35,
    threatEn: 'Moisture above 14% causes grain respiration, heating, aflatoxin mold, and premature sprouting.',
    threatHi: '14% से अधिक नमी होने पर धान में गर्मी पैदा होती है, फफूंद लगती है और दाने अंकुरित होने लगते हैं।',
    dryTipEn: 'Sun dry paddy until grain moisture reaches <13%. Keep bags on wooden pallets off damp floors.',
    dryTipHi: 'धान को धूप में सुखाकर नमी 13% से नीचे लाएं। बोरियों को जमीन पर सीधे न रखकर लकड़ी के तख्तों पर रखें।'
  },
  pulses: {
    id: 'pulses',
    name: 'Pulses (Dal)',
    hindiName: 'दलहन (दाल/चना)',
    category: 'Legumes',
    categoryHindi: 'दलहनी फसलें',
    icon: '🫘',
    safeTempMin: 16.0,
    safeTempMax: 27.0,
    warningTempMax: 32.0,
    safeHumMin: 40.0,
    safeHumMax: 60.0,
    criticalHum: 65.0,
    safeDaysMax: 120,
    defaultDays: 18,
    threatEn: 'Pulse beetle (bruchid) propagation accelerates in humid, warm conditions; seeds get hollowed.',
    threatHi: 'गर्म और नम हवा में घुन (दाल का कीड़ा) तेजी से बढ़ता है और दालों को अंदर से खोखला कर देता है।',
    dryTipEn: 'Aerate pulse bags; mix dry neem leaves or clean dry sand seal to deter bruchid pests.',
    dryTipHi: 'दालों को धूप दिखाएं; घुन से बचाने के लिए सूखे नीम के पत्ते या सूखी बालू की परत का उपयोग करें।'
  },
  medicinal: {
    id: 'medicinal',
    name: 'Medicinal Herbs',
    hindiName: 'औषधीय वनोपज',
    category: 'Forest Herbs & Roots',
    categoryHindi: 'जड़ी-बूटी व वनोपज',
    icon: '🌿',
    safeTempMin: 15.0,
    safeTempMax: 25.0,
    warningTempMax: 30.0,
    safeHumMin: 35.0,
    safeHumMax: 55.0,
    criticalHum: 62.0,
    safeDaysMax: 60,
    defaultDays: 14,
    threatEn: 'Damp air degrades essential active phytoconstituents, volatile oils, and medicinal market value.',
    threatHi: 'अधिक नमी से जड़ी-बूटियों के सक्रिय औषधीय तत्व और प्राकृतिक सुगंध नष्ट हो जाती है।',
    dryTipEn: 'Keep in shade-dried condition inside moisture-proof bags. Avoid direct sunlight during storage.',
    dryTipHi: 'छाया में सुखाकर नमी-रोधी बैगों में रखें। भंडारण के दौरान सीधी धूप और जमीन की सीलन से बचाएं।'
  },
  sal_seeds: {
    id: 'sal_seeds',
    name: 'Sal Seeds',
    hindiName: 'साल बीज',
    category: 'Oilseed',
    categoryHindi: 'तिलहनी वनोपज',
    icon: '🌰',
    safeTempMin: 18.0,
    safeTempMax: 28.0,
    warningTempMax: 32.0,
    safeHumMin: 40.0,
    safeHumMax: 58.0,
    criticalHum: 64.0,
    safeDaysMax: 45,
    defaultDays: 10,
    threatEn: 'High oil content oxidizes quickly; damp seeds turn rancid with high free fatty acids (FFA).',
    threatHi: 'उच्च तेल मात्रा के कारण सीलन वाले साल बीज तुरंत खट्टे (रैंसिड) होकर खराब हो जाते हैं।',
    dryTipEn: 'Decorticate promptly and dry thoroughly. Oil extractors reject seeds with >8% moisture.',
    dryTipHi: 'बीजों को तुरंत छीलकर अच्छी तरह सुखाएं। 8% से अधिक नमी होने पर तेल मिलें कम भाव देती हैं।'
  },
  honey: {
    id: 'honey',
    name: 'Honey',
    hindiName: 'वनोपज शहद',
    category: 'Forest Honey',
    categoryHindi: 'जंगली शहद',
    icon: '🍯',
    safeTempMin: 15.0,
    safeTempMax: 24.0,
    warningTempMax: 30.0,
    safeHumMin: 30.0,
    safeHumMax: 55.0,
    criticalHum: 60.0,
    safeDaysMax: 365,
    defaultDays: 25,
    threatEn: 'Extremely hygroscopic. Absorbs air moisture above 60% RH, activating osmophilic yeast fermentation.',
    threatHi: 'शहद हवा से नमी बहुत तेजी से सोखता है। 60% से अधिक नमी में खमीर उठकर झाग और खट्टापन आ जाता है।',
    dryTipEn: 'Seal containers hermetically. Never leave honey drums open in humid storage rooms.',
    dryTipHi: 'शहद के बर्तनों को हवा-रोधी सील में रखें। नम कमरे में डिब्बे कभी खुले न छोड़ें।'
  }
};

// 2. Bilingual Dictionaries
const I18N = {
  en: {
    appTitle: 'Smart Storage & Quality Protection',
    appSubtitle: 'Tribal Post-Harvest Preservation • ESP32-S3 Storage Risk AI',
    demoMode: 'Interactive Demo',
    githubMode: 'GitHub Cloud Sync',
    liveMode: 'ESP32 Local AP',
    audioBtn: 'Listen Advice',
    aiEngineTag: 'Storage Risk AI Engine',
    liveEval: 'Real-Time Evaluation',
    riskIndex: 'Spoilage Risk Index',
    aiRecomTitle: 'AI Storage Recommendation',
    selectProduce: 'Select Forest / Agricultural Produce',
    selectHint: 'AI adapts risk curves based on crop biology',
    recordTitle: 'Produce Storage Record',
    recordSubtitle: 'Active batch status inside storage container',
    thParameter: 'Parameter',
    thValue: 'Value',
    thStatus: 'Threshold / Status',
    lblProduce: 'Produce',
    lblTemp: 'Temperature',
    lblHum: 'Humidity',
    lblPeriod: 'Storage period',
    lblDew: 'Dew Point',
    lblRisk: 'Risk',
    telemetryTitle: 'Micro-Climate Gauges',
    telemetrySubtitle: 'Sensors: BMP280 (Temp & Pressure) + DHT11 (Humidity)',
    sensorStatus: 'ESP32-S3 Online',
    gaugeTemp: 'Temperature',
    gaugeHum: 'Relative Humidity',
    gaugeDew: 'Dew Point',
    gaugePeriod: 'Storage Period',
    chartTitle: '24-Hour Micro-Climate Trend',
    legHum: 'Humidity (%)',
    legTemp: 'Temp (°C)',
    controlsTitle: 'Field Simulation & Sensor Calibration',
    controlsSubtitle: 'Adjust environmental parameters to see the ESP32-S3 Storage Risk AI react instantly',
    presetSafe: '🟢 Normal / Safe',
    presetWarning: '🟡 Damp / Monsoon',
    presetSpoilage: '🔴 Severe Rot Risk',
    ctrlTemp: 'Simulated Temperature (°C)',
    ctrlHum: 'Simulated Relative Humidity (%)',
    ctrlDays: 'Storage Duration (Days)',
    lblCtrlGh: 'GitHub Internet Sync',
    ctrlIp: 'ESP32-S3 Local AP IP Address',
    connectEsp: 'Connect',
    lblStorageStartDate: 'Stored In Container On:',
    btnDateToday: 'Today',
    lblDaysInStorage: 'Days in Storage',
    offlineTitle: 'ESP32-S3 Offline',
    offlineSub: 'Showing last recorded sensor data from',
    footerText: 'Designed for tribal families, Van Dhan Vikas Kendras (VDVK), and rural grain aggregators to stop fungal decay, eliminate post-harvest distress sales, and preserve fair market value for forest produce.'
  },
  hi: {
    appTitle: 'स्मार्ट भंडारण एवं गुणवत्ता संरक्षण प्रणाली',
    appSubtitle: 'जनजातीय वनोपज संरक्षण • ईएसपी३२-एस३ स्टोरेज रिस्क एआई',
    demoMode: 'प्रदर्शन मोड',
    githubMode: 'गिटहब क्लाउड सिंक',
    liveMode: 'ईएसपी३२ लोकल एपी',
    audioBtn: 'सलाह सुनें',
    aiEngineTag: 'स्टोरेज रिस्क एआई इंजन',
    liveEval: 'रीयल-टाइम मूल्यांकन',
    riskIndex: 'सड़न/खराबी जोखिम सूचकांक',
    aiRecomTitle: 'एआई भंडारण सलाह व निर्देश',
    selectProduce: 'कृषि या वनोपज चुनें',
    selectHint: 'फसल की जैविक संवेदनशीलता के अनुसार एआई नियम बदलते हैं',
    recordTitle: 'उपज भंडारण रिकॉर्ड (Produce Storage Record)',
    recordSubtitle: 'भंडारण कक्ष/कोठार में सक्रिय बैच की वर्तमान स्थिति',
    thParameter: 'पैरामीटर (Parameter)',
    thValue: 'माप/मान (Value)',
    thStatus: 'सुरक्षित सीमा / स्थिति',
    lblProduce: 'उपज (Produce)',
    lblTemp: 'तापमान (Temperature)',
    lblHum: 'नमी (Humidity)',
    lblPeriod: 'भंडारण अवधि (Storage period)',
    lblDew: 'ओस बिंदु (Dew Point)',
    lblRisk: 'जोखिम स्तर (Risk)',
    telemetryTitle: 'मौसम व माइक्रो-क्लाइमेट मीटर',
    telemetrySubtitle: 'ईएसपी३२-एस३ सेंसर (BMP280 तापमान + DHT11 आर्द्रता)',
    sensorStatus: 'ईएसपी३२-एस३ ऑनलाइन',
    gaugeTemp: 'कमरे का तापमान',
    gaugeHum: 'हवा में नमी (आर्द्रता)',
    gaugeDew: 'ओस बिंदु (कंडेनसेशन)',
    gaugePeriod: 'भंडारण के दिन',
    chartTitle: '24-घंटे का तापमान व नमी ग्राफ',
    legHum: 'नमी (%)',
    legTemp: 'तापमान (°C)',
    controlsTitle: 'फील्ड सिमुलेशन एवं सेंसर जांच',
    controlsSubtitle: 'सेंसर मान बदलकर देखें कि स्टोरेज रिस्क एआई तुरंत क्या सलाह देता है',
    presetSafe: '🟢 सामान्य / सुरक्षित',
    presetWarning: '🟡 नम हवा / मानसून',
    presetSpoilage: '🔴 गंभीर सड़न का खतरा',
    ctrlTemp: 'तापमान स्लाइडर (°C)',
    ctrlHum: 'हवा की नमी स्लाइडर (%)',
    ctrlDays: 'भंडारण अवधि (दिन)',
    lblCtrlGh: 'गिटहब इंटरनेट सिंक',
    ctrlIp: 'ईएसपी३२ लोकल एपी आईपी पता',
    connectEsp: 'कनेक्ट करें',
    lblStorageStartDate: 'भंडारण प्रारंभ तिथि:',
    btnDateToday: 'आज',
    lblDaysInStorage: 'भंडारण के दिन',
    offlineTitle: 'ईएसपी३२-एस३ ऑफलाइन',
    offlineSub: 'अंतिम दर्ज सेंसर डेटा समय',
    footerText: 'जनजातीय परिवारों, वन धन विकास केंद्रों और ग्रामीण भंडारण हेतु विशेष निर्मित ताकि उपज की सड़न रुके, संकटकालीन बिक्री से मुक्ति मिले और उपज का पूरा मूल्य मिले।'
  }
};

// 3. Application State
const state = {
  currentLanguage: 'en',
  espIp: '192.168.4.1',
  githubUser: 'rudrapratapkarmakarpzs-alt',
  githubRepo: 'IOT-Based-Smart-Storage-and-Quality-Protection-System',
  githubBranch: 'main',
  githubPath: 'data/telemetry.json',
  selectedProduceId: 'mahua',
  userSelectedProduce: false, // Flag to keep user's crop choice locked
  temperature: 28.4,
  humidity: 64.0,
  pressure: 1013.2,
  storageDays: 12,
  livePollingTimer: null,
  githubPollingTimer: null,
  serialPort: null,
  serialReader: null,
  connectionType: 'searching', // 'wifi', 'usb', 'cloud', 'searching'
  isOnline: false,
  lastOnlineTime: localStorage.getItem('esp32_last_online') || null,
  lastKnownTelemetry: JSON.parse(localStorage.getItem('esp32_last_telemetry') || 'null'),
  missedPolls: 0,
  historyData: []
};

// 4. Storage Risk AI Engine Implementation
function calculateDewPoint(temp, hum) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * temp) / (b + temp)) + Math.log(Math.max(hum, 1) / 100);
  return (b * alpha) / (a - alpha);
}

function evaluateStorageRisk(produceId, temp, hum, days) {
  const produce = PRODUCE_DATABASE[produceId] || PRODUCE_DATABASE.mahua;
  const dewPoint = calculateDewPoint(temp, hum);

  // 1. Humidity Risk (0 - 55 points)
  let hScore = 0;
  if (hum <= produce.safeHumMax) {
    hScore = (hum < produce.safeHumMin) ? 5 : 0;
  } else if (hum <= produce.criticalHum) {
    const ratio = (hum - produce.safeHumMax) / (produce.criticalHum - produce.safeHumMax);
    hScore = 20 + (ratio * 20); // 20 to 40
  } else {
    const excess = hum - produce.criticalHum;
    hScore = Math.min(55, 40 + (excess * 2.5));
  }

  // 2. Temperature Risk (0 - 30 points)
  let tScore = 0;
  if (temp >= produce.safeTempMin && temp <= produce.safeTempMax) {
    tScore = 0;
  } else if (temp > produce.safeTempMax && temp <= produce.warningTempMax) {
    const ratio = (temp - produce.safeTempMax) / (produce.warningTempMax - produce.safeTempMax);
    tScore = 10 + (ratio * 12);
  } else if (temp > produce.warningTempMax) {
    const excess = temp - produce.warningTempMax;
    tScore = Math.min(30, 22 + (excess * 2.5));
  } else {
    tScore = 5;
  }

  // 3. Dew Point / Condensation Risk (0 - 10 points)
  const dewGap = temp - dewPoint;
  let condensationScore = 0;
  if (dewGap < 2.0) condensationScore = 10;
  else if (dewGap < 4.0) condensationScore = 5;

  // 4. Storage Duration Aging (0 - 10 points)
  let durationScore = 0;
  if (days > produce.safeDaysMax) {
    const overDays = days - produce.safeDaysMax;
    durationScore = Math.min(10, (overDays / produce.safeDaysMax) * 8);
  }

  // Total Score (0 - 100)
  const totalScore = Math.min(100, Math.round(hScore + tScore + condensationScore + durationScore));

  // Determine Level & Farmer-Friendly Plain Language Guidance
  let level = 'SAFE';
  let levelClass = 'state-safe';
  let badgeClass = 'badge-safe';
  let symbol = '🟢';
  let statusTextEn = 'SAFE';
  let statusTextHi = 'सुरक्षित (सामान्य)';
  let actionEn = '';
  let actionHi = '';
  let subtextEn = '';
  let subtextHi = '';
  let chipClass = 'chip-low';
  let riskTableTextEn = 'Low';
  let riskTableTextHi = 'कम (सुरक्षित)';

  if (totalScore >= 68 || hum >= produce.criticalHum + 3 || (hum >= produce.criticalHum && temp >= produce.warningTempMax)) {
    // 🔴 SPOILAGE RISK
    level = 'SPOILAGE RISK';
    levelClass = 'state-spoilage';
    badgeClass = 'badge-spoilage';
    symbol = '🔴';
    statusTextEn = 'SPOILAGE RISK';
    statusTextHi = 'सड़न का जोखिम (खतरा)';
    chipClass = 'chip-spoilage';
    riskTableTextEn = 'High (Spoilage Risk)';
    riskTableTextHi = 'उच्च (सड़न का खतरा)';

    if (hum >= produce.criticalHum) {
      actionEn = 'Dry the produce before storage.';
      actionHi = 'भंडारण से पहले उपज को तुरंत सुखाएं।';
      subtextEn = 'Excessive moisture detected! Spread produce on clean mats immediately to prevent mold rot.';
      subtextHi = 'नमी बहुत अधिक है! फफूंद व सड़न रोकने हेतु तुरंत साफ चटाई पर फैलाकर सुखाएं।';
    } else if (temp >= produce.warningTempMax) {
      actionEn = 'Move the produce to a dry storage area.';
      actionHi = 'उपज को तुरंत ठंडे और सूखे कमरे में ले जाएं।';
      subtextEn = 'Dangerous heat level! Thermal stress destroys quality and triggers pest multiplication.';
      subtextHi = 'कमरे में अत्यधिक गर्मी है! तुरंत छायादार व ठंडे स्थान पर स्थानांतरित करें।';
    } else {
      actionEn = 'Improve ventilation and aerate bags.';
      actionHi = 'कमरे में हवा का प्रवाह (वेंटिलेशन) बढ़ाएं और बोरियां पलटें।';
      subtextEn = 'Severe condensation risk. Turn bags or install exhaust air ventilation immediately.';
      subtextHi = 'ओस जमने का गंभीर खतरा। तुरंत बोरियों को पलटें और हवा का संचार बढ़ाएं।';
    }
  } else if (totalScore >= 35 || hum > produce.safeHumMax || temp > produce.safeTempMax) {
    // 🟡 WARNING
    level = 'WARNING';
    levelClass = 'state-warning';
    badgeClass = 'badge-warning';
    symbol = '🟡';
    statusTextEn = 'WARNING';
    statusTextHi = 'चेतावनी (सावधानी आवश्यक)';
    chipClass = 'chip-warning';
    riskTableTextEn = 'Medium (Warning)';
    riskTableTextHi = 'मध्यम (चेतावनी)';

    if (hum > produce.safeHumMax && temp > produce.safeTempMax) {
      actionEn = 'Improve ventilation.';
      actionHi = 'कमरे में हवा का संचार (वेंटिलेशन) बढ़ाएं।';
      subtextEn = 'Both humidity and heat are rising above safe biological storage limits.';
      subtextHi = 'नमी और तापमान दोनों सुरक्षित सीमा से अधिक हैं। खिड़कियां/वेंटिलेशन खोलें।';
    } else if (hum > produce.safeHumMax) {
      actionEn = 'Dry the produce before storage.';
      actionHi = 'उपज में नमी अधिक है - सुखाने की व्यवस्था करें।';
      subtextEn = 'Humidity approaching danger zone. Sun-dry or aerate produce before prolonged storage.';
      subtextHi = 'नमी बढ़ रही है। लंबे समय तक रखने से पहले उपज को धूप या छांव में सुखाएं।';
    } else {
      actionEn = 'Move the produce to a dry storage area.';
      actionHi = 'उपज को ठंडे व सूखे स्थान पर स्थानांतरित करें।';
      subtextEn = 'Storage room temperature is elevated. Provide shading or move to cooler warehouse zone.';
      subtextHi = 'भंडारण कक्ष का तापमान बढ़ गया है। छायादार या ठंडे हिस्से में रखें।';
    }
  } else {
    // 🟢 SAFE
    level = 'SAFE';
    levelClass = 'state-safe';
    badgeClass = 'badge-safe';
    symbol = '🟢';
    statusTextEn = 'SAFE';
    statusTextHi = 'सुरक्षित (सामान्य)';
    chipClass = 'chip-low';
    riskTableTextEn = 'Low';
    riskTableTextHi = 'कम (सामान्य)';
    actionEn = 'Storage condition normal.';
    actionHi = 'भंडारण स्थिति सामान्य और सुरक्षित है।';
    subtextEn = 'Micro-climate is optimal for quality retention. Maintain clean, sealed, or raised pallet storage.';
    subtextHi = 'गुणवत्ता बनाए रखने के लिए तापमान व नमी उत्तम है। स्वच्छता रखें व बोरियों को तख्ते पर रखें।';
  }

  return {
    produce,
    level,
    levelClass,
    badgeClass,
    symbol,
    score: totalScore,
    dewPoint: dewPoint.toFixed(1),
    dewGap: dewGap.toFixed(1),
    statusText: (state.currentLanguage === 'hi') ? statusTextHi : statusTextEn,
    primaryAction: (state.currentLanguage === 'hi') ? actionHi : actionEn,
    secondarySub: (state.currentLanguage === 'hi') ? subtextHi : subtextEn,
    chipClass,
    tableRiskText: (state.currentLanguage === 'hi') ? riskTableTextHi : riskTableTextEn,
    actionEn,
    actionHi
  };
}

// 5. Initialize UI Components
function renderProduceCards() {
  const container = document.getElementById('produce-grid');
  if (!container) return;

  container.innerHTML = '';
  Object.keys(PRODUCE_DATABASE).forEach(key => {
    const p = PRODUCE_DATABASE[key];
    const isSelected = (key === state.selectedProduceId);

    const card = document.createElement('div');
    card.className = `produce-card ${isSelected ? 'active' : ''}`;
    card.id = `produce-btn-${key}`;
    card.onclick = () => selectProduce(key);

    const nameText = (state.currentLanguage === 'hi') ? p.hindiName : p.name;
    const catText = (state.currentLanguage === 'hi') ? p.categoryHindi : p.category;

    card.innerHTML = `
      <div class="produce-icon">${p.icon}</div>
      <div class="produce-name">${nameText}</div>
      <div class="produce-sub">${catText}</div>
    `;

    container.appendChild(card);
  });
}

// Helper: Container Storage Starting Date Manager
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getStorageStartDate(produceId) {
  let stored = localStorage.getItem('storage_start_' + produceId);
  if (!stored) {
    const p = PRODUCE_DATABASE[produceId] || PRODUCE_DATABASE.mahua;
    const defaultDays = p.defaultDays || 12;
    const d = new Date();
    d.setDate(d.getDate() - defaultDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    stored = `${year}-${month}-${day}`;
    localStorage.setItem('storage_start_' + produceId, stored);
  }
  return stored;
}

function calculateDaysFromStartDate(startDateStr) {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
}

function onStorageDateChange(newDateStr) {
  if (!newDateStr) return;
  localStorage.setItem('storage_start_' + state.selectedProduceId, newDateStr);
  const days = calculateDaysFromStartDate(newDateStr);
  state.storageDays = days;

  // Sync range slider
  const sD = document.getElementById('slider-days');
  if (sD) sD.value = days;

  updateDashboard();

  // Send update to ESP32
  fetch(`http://${state.espIp}/api/set-produce?produce=${state.selectedProduceId}&days=${days}`, { cache: 'no-store' })
    .catch(() => {});
  sendSerialCommand(`SET_DAYS:${days}\n`);
}

function setStorageDateToday() {
  const today = getTodayDateString();
  const dateInput = document.getElementById('input-storage-start-date');
  if (dateInput) dateInput.value = today;
  onStorageDateChange(today);
}

function selectProduce(key) {
  state.selectedProduceId = key;
  state.userSelectedProduce = true; // Lock user's selection: incoming telemetry won't override this!

  // Retrieve stored start date for this crop
  const startDate = getStorageStartDate(key);
  const dateInput = document.getElementById('input-storage-start-date');
  if (dateInput) dateInput.value = startDate;

  // Calculate actual elapsed days
  state.storageDays = calculateDaysFromStartDate(startDate);
  const sliderDays = document.getElementById('slider-days');
  if (sliderDays) sliderDays.value = state.storageDays;

  renderProduceCards();
  updateDashboard();

  // Push produce change to ESP32 via HTTP API
  fetch(`http://${state.espIp}/api/set-produce?produce=${key}&days=${state.storageDays}`, { cache: 'no-store' })
    .catch(e => console.log('HTTP produce push notice:', e.message));

  // Push produce change to ESP32 via WebSerial USB if connected
  sendSerialCommand(`SET_PRODUCE:${key}\nSET_DAYS:${state.storageDays}\n`);
}

// 6. Update Dashboard View
function updateDashboard() {
  const p = PRODUCE_DATABASE[state.selectedProduceId] || PRODUCE_DATABASE.mahua;
  const evalResult = evaluateStorageRisk(p.id, state.temperature, state.humidity, state.storageDays);

  // A. Risk Hero Card & Banner
  const riskCard = document.getElementById('risk-card');
  if (riskCard) {
    riskCard.className = `card risk-hero-card ${evalResult.levelClass}`;
  }

  const riskBadge = document.getElementById('risk-badge');
  if (riskBadge) {
    riskBadge.className = `risk-badge-large ${evalResult.badgeClass}`;
  }

  const riskSymbol = document.getElementById('risk-symbol');
  if (riskSymbol) riskSymbol.textContent = evalResult.symbol;

  const riskText = document.getElementById('risk-text');
  if (riskText) riskText.textContent = evalResult.statusText;

  const riskScore = document.getElementById('risk-score');
  if (riskScore) riskScore.textContent = `${evalResult.score}%`;

  const aiSuggestionText = document.getElementById('ai-suggestion-text');
  if (aiSuggestionText) aiSuggestionText.textContent = `“${evalResult.primaryAction}”`;

  const aiSuggestionSub = document.getElementById('ai-suggestion-sub');
  if (aiSuggestionSub) aiSuggestionSub.textContent = evalResult.secondarySub;

  // B. Official Produce Storage Record Table (Requested by User)
  const isHi = (state.currentLanguage === 'hi');

  const tdProduceIcon = document.getElementById('td-produce-icon');
  if (tdProduceIcon) tdProduceIcon.textContent = p.icon;

  const recProduce = document.getElementById('rec-produce');
  if (recProduce) {
    recProduce.textContent = isHi ? `${p.name} (${p.hindiName})` : `${p.name}`;
  }

  const recProduceType = document.getElementById('rec-produce-type');
  if (recProduceType) {
    recProduceType.textContent = isHi ? p.categoryHindi : p.category;
  }

  const recTemp = document.getElementById('rec-temp');
  if (recTemp) recTemp.textContent = `${state.temperature.toFixed(1)}°C`;

  const recTempThresh = document.getElementById('rec-temp-thresh');
  if (recTempThresh) {
    recTempThresh.textContent = isHi ? `सुरक्षित: ${p.safeTempMin} - ${p.safeTempMax}°C` : `Safe: ${p.safeTempMin} - ${p.safeTempMax}°C`;
  }

  const recHum = document.getElementById('rec-hum');
  if (recHum) recHum.textContent = `${Math.round(state.humidity)}%`;

  const recHumThresh = document.getElementById('rec-hum-thresh');
  if (recHumThresh) {
    recHumThresh.textContent = isHi ? `सुरक्षित: ${p.safeHumMin} - ${p.safeHumMax}%` : `Safe: ${p.safeHumMin} - ${p.safeHumMax}%`;
  }

  const recPeriod = document.getElementById('rec-period');
  if (recPeriod) {
    const startDate = getStorageStartDate(state.selectedProduceId);
    recPeriod.textContent = isHi 
      ? `${state.storageDays} दिन (${formatDateLabel(startDate)} से)` 
      : `${state.storageDays} days (Since ${formatDateLabel(startDate)})`;
  }

  const storageAgeDaysEl = document.getElementById('storage-age-days');
  if (storageAgeDaysEl) {
    storageAgeDaysEl.textContent = state.storageDays;
  }

  const recPeriodStatus = document.getElementById('rec-period-status');
  if (recPeriodStatus) {
    const isOver = state.storageDays > p.safeDaysMax;
    recPeriodStatus.textContent = isOver
      ? (isHi ? 'पलटने/निरीक्षण की आवश्यकता' : 'Turnover recommended')
      : (isHi ? 'सुरक्षित सीमा में' : 'Within safe turnover');
    recPeriodStatus.style.color = isOver ? '#f59e0b' : '#a7f3d0';
  }

  const recDew = document.getElementById('rec-dew');
  if (recDew) recDew.textContent = `${evalResult.dewPoint}°C`;

  const recDewStatus = document.getElementById('rec-dew-status');
  if (recDewStatus) {
    const gap = parseFloat(evalResult.dewGap);
    if (gap < 2.0) {
      recDewStatus.textContent = isHi ? 'संक्षेपण (ओस) जोखिम!' : 'Droplet Condensation Risk!';
      recDewStatus.style.color = '#ef4444';
    } else {
      recDewStatus.textContent = isHi ? 'ओस का खतरा नहीं' : 'No Condensation';
      recDewStatus.style.color = '#94a3b8';
    }
  }

  const recRisk = document.getElementById('rec-risk-chip');
  if (recRisk) {
    recRisk.className = `risk-chip ${evalResult.chipClass}`;
    recRisk.textContent = evalResult.tableRiskText;
  }

  const recRiskSummary = document.getElementById('rec-risk-summary');
  if (recRiskSummary) {
    recRiskSummary.textContent = evalResult.primaryAction;
  }

  // Biology Note
  const threatText = document.getElementById('produce-threat-text');
  if (threatText) {
    threatText.textContent = isHi ? p.threatHi : p.threatEn;
  }

  // C. Telemetry Gauges
  const gaugeTempVal = document.getElementById('gauge-temp-val');
  if (gaugeTempVal) gaugeTempVal.innerHTML = `${state.temperature.toFixed(1)}<span class="gauge-unit">°C</span>`;

  const barTemp = document.getElementById('bar-temp');
  if (barTemp) {
    const pct = Math.min(100, Math.max(0, ((state.temperature - 10) / 35) * 100));
    barTemp.style.width = `${pct}%`;
  }

  const gaugeHumVal = document.getElementById('gauge-hum-val');
  if (gaugeHumVal) gaugeHumVal.innerHTML = `${Math.round(state.humidity)}<span class="gauge-unit">%</span>`;

  const barHum = document.getElementById('bar-hum');
  if (barHum) {
    const pct = Math.min(100, Math.max(0, ((state.humidity - 20) / 80) * 100));
    barHum.style.width = `${pct}%`;
  }

  const gaugeDewVal = document.getElementById('gauge-dew-val');
  if (gaugeDewVal) gaugeDewVal.innerHTML = `${evalResult.dewPoint}<span class="gauge-unit">°C</span>`;

  const gaugeDewSub = document.getElementById('gauge-dew-sub');
  if (gaugeDewSub) {
    gaugeDewSub.textContent = isHi
      ? `तापमान अंतर: ${evalResult.dewGap}°C`
      : `Ambient Gap: ${evalResult.dewGap}°C`;
  }

  const gaugePeriodVal = document.getElementById('gauge-period-val');
  if (gaugePeriodVal) {
    gaugePeriodVal.innerHTML = `${state.storageDays}<span class="gauge-unit">${isHi ? 'दिन' : 'days'}</span>`;
  }

  const gaugePeriodSub = document.getElementById('gauge-period-sub');
  if (gaugePeriodSub) {
    const startDate = getStorageStartDate(state.selectedProduceId);
    gaugePeriodSub.textContent = isHi
      ? `प्रारंभ: ${formatDateLabel(startDate)}`
      : `Batch Started: ${formatDateLabel(startDate)}`;
  }

  // D. Sliders Readout Update
  const valCtrlTemp = document.getElementById('val-ctrl-temp');
  if (valCtrlTemp) valCtrlTemp.textContent = `${state.temperature.toFixed(1)} °C`;

  const valCtrlHum = document.getElementById('val-ctrl-hum');
  if (valCtrlHum) valCtrlHum.textContent = `${Math.round(state.humidity)} %`;

  const valCtrlDays = document.getElementById('val-ctrl-days');
  if (valCtrlDays) valCtrlDays.textContent = isHi ? `${state.storageDays} दिन` : `${state.storageDays} days`;

  // Draw Trend Chart
  drawMicroclimateChart();
}

// 7. Slider Input Handler
function onSensorSliderChange() {
  const sliderTemp = document.getElementById('slider-temp');
  const sliderHum = document.getElementById('slider-hum');
  const sliderDays = document.getElementById('slider-days');

  if (sliderTemp) state.temperature = parseFloat(sliderTemp.value);
  if (sliderHum) state.humidity = parseFloat(sliderHum.value);
  if (sliderDays) {
    state.storageDays = parseInt(sliderDays.value, 10);
    // Adjust start date backwards based on slider
    const d = new Date();
    d.setDate(d.getDate() - state.storageDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const adjustedDate = `${year}-${month}-${day}`;
    localStorage.setItem('storage_start_' + state.selectedProduceId, adjustedDate);
    const dateInput = document.getElementById('input-storage-start-date');
    if (dateInput) dateInput.value = adjustedDate;
  }

  updateDashboard();

  // Send updated parameters to ESP32
  fetch(`http://${state.espIp}/api/set-produce?temp=${state.temperature}&humidity=${state.humidity}&days=${state.storageDays}`, { cache: 'no-store' })
    .catch(() => {});
}

// 8. Scenario Presets
function applyPreset(scenario) {
  const p = PRODUCE_DATABASE[state.selectedProduceId];
  if (scenario === 'safe') {
    state.temperature = (p.safeTempMin + p.safeTempMax) / 2;
    state.humidity = (p.safeHumMin + p.safeHumMax) / 2;
    state.storageDays = Math.min(12, p.defaultDays);
  } else if (scenario === 'humidity') {
    state.temperature = p.safeTempMax + 1.5;
    state.humidity = p.criticalHum + 1.0;
    state.storageDays = p.defaultDays + 5;
  } else if (scenario === 'spoilage') {
    state.temperature = p.warningTempMax + 3.0;
    state.humidity = p.criticalHum + 12.0;
    state.storageDays = p.safeDaysMax + 15;
  }

  // Update slider positions
  const sT = document.getElementById('slider-temp');
  const sH = document.getElementById('slider-hum');
  const sD = document.getElementById('slider-days');
  if (sT) sT.value = state.temperature;
  if (sH) sH.value = state.humidity;
  if (sD) sD.value = state.storageDays;

  updateDashboard();
}

// 9. Audio Text-To-Speech (TTS) Advisor for Tribal Accessibility
function speakCurrentAdvice() {
  const p = PRODUCE_DATABASE[state.selectedProduceId];
  const evalResult = evaluateStorageRisk(p.id, state.temperature, state.humidity, state.storageDays);

  if (!('speechSynthesis' in window)) {
    alert('Audio speech synthesis is not supported on this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Stop any pending speech

  const isHi = (state.currentLanguage === 'hi');
  const produceName = isHi ? p.hindiName : p.name;
  const status = evalResult.statusText;
  const action = evalResult.primaryAction;

  let textToSpeak = '';
  if (isHi) {
    textToSpeak = `उपज ${produceName}। भंडारण स्थिति: ${status}। सलाह: ${action}।`;
  } else {
    textToSpeak = `Produce ${produceName}. Storage condition: ${status}. Advice: ${action}`;
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = isHi ? 'hi-IN' : 'en-US';
  utterance.rate = 0.95; // Slightly slower for clear rural comprehension
  utterance.pitch = 1.0;

  // Visual feedback on audio button
  const btn = document.getElementById('btn-audio-speak');
  if (btn) {
    btn.style.transform = 'scale(1.05)';
    btn.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.8)';
    utterance.onend = () => {
      btn.style.transform = 'none';
      btn.style.boxShadow = 'none';
    };
  }

  window.speechSynthesis.speak(utterance);
}

// 10. Language Switcher
function setLanguage(lang) {
  state.currentLanguage = lang;

  // Toggle active button
  const btnEn = document.getElementById('btn-lang-en');
  const btnHi = document.getElementById('btn-lang-hi');
  if (btnEn) btnEn.className = `lang-btn ${lang === 'en' ? 'active' : ''}`;
  if (btnHi) btnHi.className = `lang-btn ${lang === 'hi' ? 'active' : ''}`;

  const dict = I18N[lang] || I18N.en;

  // Update text labels
  const elements = [
    { id: 'txt-app-title', key: 'appTitle' },
    { id: 'txt-app-subtitle', key: 'appSubtitle' },
    { id: 'txt-demo-mode', key: 'demoMode' },
    { id: 'txt-github-mode', key: 'githubMode' },
    { id: 'txt-live-mode', key: 'liveMode' },
    { id: 'txt-audio-btn', key: 'audioBtn' },
    { id: 'txt-ai-engine-tag', key: 'aiEngineTag' },
    { id: 'txt-live-eval', key: 'liveEval' },
    { id: 'txt-risk-index', key: 'riskIndex' },
    { id: 'txt-ai-recom-title', key: 'aiRecomTitle' },
    { id: 'txt-select-produce', key: 'selectProduce' },
    { id: 'txt-select-hint', key: 'selectHint' },
    { id: 'txt-record-title', key: 'recordTitle' },
    { id: 'txt-record-subtitle', key: 'recordSubtitle' },
    { id: 'th-parameter', key: 'thParameter' },
    { id: 'th-value', key: 'thValue' },
    { id: 'th-status', key: 'thStatus' },
    { id: 'lbl-produce', key: 'lblProduce' },
    { id: 'lbl-temp', key: 'lblTemp' },
    { id: 'lbl-hum', key: 'lblHum' },
    { id: 'lbl-period', key: 'lblPeriod' },
    { id: 'lbl-dew', key: 'lblDew' },
    { id: 'lbl-risk', key: 'lblRisk' },
    { id: 'txt-telemetry-title', key: 'telemetryTitle' },
    { id: 'txt-telemetry-subtitle', key: 'telemetrySubtitle' },
    { id: 'txt-sensor-status', key: 'sensorStatus' },
    { id: 'txt-gauge-temp', key: 'gaugeTemp' },
    { id: 'txt-gauge-hum', key: 'gaugeHum' },
    { id: 'txt-gauge-dew', key: 'gaugeDew' },
    { id: 'txt-gauge-period', key: 'gaugePeriod' },
    { id: 'txt-chart-title', key: 'chartTitle' },
    { id: 'txt-leg-hum', key: 'legHum' },
    { id: 'txt-leg-temp', key: 'legTemp' },
    { id: 'txt-controls-title', key: 'controlsTitle' },
    { id: 'txt-controls-subtitle', key: 'controlsSubtitle' },
    { id: 'btn-preset-safe', key: 'presetSafe' },
    { id: 'btn-preset-warning', key: 'presetWarning' },
    { id: 'btn-preset-spoilage', key: 'presetSpoilage' },
    { id: 'lbl-ctrl-temp', key: 'ctrlTemp' },
    { id: 'lbl-ctrl-hum', key: 'ctrlHum' },
    { id: 'lbl-ctrl-days', key: 'ctrlDays' },
    { id: 'lbl-ctrl-gh', key: 'lblCtrlGh' },
    { id: 'lbl-ctrl-ip', key: 'ctrlIp' },
    { id: 'btn-connect-esp', key: 'connectEsp' },
    { id: 'lbl-storage-start-date', key: 'lblStorageStartDate' },
    { id: 'btn-date-today', key: 'btnDateToday' },
    { id: 'lbl-days-in-storage', key: 'lblDaysInStorage' },
    { id: 'txt-offline-title', key: 'offlineTitle' },
    { id: 'txt-footer-text', key: 'footerText' }
  ];

  elements.forEach(item => {
    const el = document.getElementById(item.id);
    if (el && dict[item.key]) {
      el.textContent = dict[item.key];
    }
  });

  renderProduceCards();
  updateDashboard();
}

// 11. Real-Time ESP32 Synchronization & Telemetry Engine

// Helper to format last online timestamp nicely
function formatLastSeenTime(isoStr) {
  if (!isoStr) return state.currentLanguage === 'hi' ? 'कोई पुराना रिकॉर्ड नहीं' : 'Never connected';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  
  const now = new Date();
  const diffSec = Math.floor((now - d) / 1000);
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  if (diffSec < 60) {
    return state.currentLanguage === 'hi' ? `अभी-अभी (${timeStr})` : `Just now (${timeStr})`;
  } else if (diffSec < 3600) {
    const mins = Math.floor(diffSec / 60);
    return state.currentLanguage === 'hi' ? `${mins} मिनट पहले (${timeStr})` : `${mins} min ago (${timeStr})`;
  } else if (diffSec < 86400 && d.getDate() === now.getDate()) {
    return state.currentLanguage === 'hi' ? `आज ${timeStr}` : `Today at ${timeStr}`;
  } else {
    return `${dateStr}, ${timeStr}`;
  }
}

// Update Top Navbar Connection Badge, Health Pill, and Offline Banner
function updateOnlineOfflineUI(isOnline, source = 'wifi') {
  const badge = document.getElementById('connection-badge');
  const dot = document.getElementById('nav-sync-dot');
  const txt = document.getElementById('txt-sync-status');
  const healthPill = document.getElementById('sensor-health-pill');
  const healthDot = document.getElementById('sensor-health-dot');
  const healthTxt = document.getElementById('txt-sensor-status');
  const banner = document.getElementById('offline-telemetry-banner');
  const lastSeenEl = document.getElementById('val-last-seen-time');
  const pingStatus = document.getElementById('esp-ping-status');

  const isHi = (state.currentLanguage === 'hi');

  if (isOnline) {
    state.isOnline = true;
    if (badge) {
      badge.className = `connection-badge ${source === 'usb' ? 'connected-usb' : ''}`;
    }
    if (dot) {
      dot.className = `indicator-dot ${source === 'usb' ? 'dot-usb' : 'dot-live'}`;
    }
    if (txt) {
      txt.textContent = source === 'usb' 
        ? (isHi ? 'ईएसपी३२ ऑनलाइन (USB)' : 'ESP32 Online (USB)')
        : (isHi ? `ईएसपी३२ ऑनलाइन (${state.espIp})` : `ESP32 Online (${state.espIp})`);
    }
    if (healthPill) healthPill.className = 'sensor-health';
    if (healthDot) healthDot.className = 'dot-online';
    if (healthTxt) {
      healthTxt.textContent = source === 'usb'
        ? (isHi ? 'ईएसपी३२-एस३ ऑनलाइन (USB)' : 'ESP32-S3 Online (USB)')
        : (isHi ? 'ईएसपी३२-एस३ ऑनलाइन' : 'ESP32-S3 Online');
    }
    if (banner) banner.style.display = 'none';
    if (pingStatus) {
      pingStatus.textContent = source === 'usb' ? 'Connected (USB 115200)' : `Connected (${state.espIp})`;
      pingStatus.style.color = '#10b981';
    }
  } else {
    // Offline
    state.isOnline = false;
    if (badge) badge.className = 'connection-badge offline';
    if (dot) dot.className = 'indicator-dot dot-offline';
    if (txt) {
      txt.textContent = isHi ? 'ईएसपी३२ ऑफलाइन' : 'ESP32 Offline';
    }
    if (healthPill) healthPill.className = 'sensor-health offline';
    if (healthDot) healthDot.className = 'dot-online';
    if (healthTxt) {
      healthTxt.textContent = isHi ? 'ईएसपी३२-एस३ ऑफलाइन' : 'ESP32-S3 Offline';
    }
    if (banner) {
      banner.style.display = 'flex';
      if (lastSeenEl) {
        lastSeenEl.textContent = formatLastSeenTime(state.lastOnlineTime);
      }
    }
    if (pingStatus) {
      const timeStr = formatLastSeenTime(state.lastOnlineTime);
      pingStatus.textContent = isHi 
        ? `ऑफलाइन (अंतिम सक्रिय: ${timeStr})`
        : `Offline (Last online: ${timeStr})`;
      pingStatus.style.color = '#ef4444';
    }
  }
}

// Central Telemetry Dispatcher: updates sensors & evaluates AI without overwriting user's selected produce
function applyIncomingTelemetry(data, source = 'wifi') {
  state.isOnline = true;
  state.missedPolls = 0;
  state.lastOnlineTime = new Date().toISOString();
  state.lastKnownTelemetry = { ...data, receivedAt: state.lastOnlineTime };
  localStorage.setItem('esp32_last_online', state.lastOnlineTime);
  localStorage.setItem('esp32_last_telemetry', JSON.stringify(state.lastKnownTelemetry));

  if (data.temperature !== undefined) state.temperature = Number(data.temperature);
  if (data.humidity !== undefined) state.humidity = Number(data.humidity);
  if (data.pressure !== undefined) state.pressure = Number(data.pressure);

  // Sync range slider inputs to real readings
  const sT = document.getElementById('slider-temp');
  const sH = document.getElementById('slider-hum');
  if (sT) sT.value = state.temperature;
  if (sH) sH.value = state.humidity;

  updateOnlineOfflineUI(true, source);

  renderProduceCards();
  updateDashboard();
}

// Direct Wi-Fi / SoftAP Polling
function startLivePolling() {
  stopLivePolling();
  pollEsp32Status();
  state.livePollingTimer = setInterval(pollEsp32Status, 2000);
}

function stopLivePolling() {
  if (state.livePollingTimer) {
    clearInterval(state.livePollingTimer);
    state.livePollingTimer = null;
  }
}

function testEsp32Connection() {
  const ipInput = document.getElementById('input-esp-ip');
  if (ipInput && ipInput.value.trim()) {
    state.espIp = ipInput.value.trim();
  }
  const pingStatus = document.getElementById('esp-ping-status');
  if (pingStatus) pingStatus.textContent = `Connecting to ${state.espIp}...`;
  pollEsp32Status();
}

function pollEsp32Status() {
  // If USB is actively connected, skip HTTP polling to avoid conflict
  if (state.serialPort) return;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  fetch(`http://${state.espIp}/api/status`, { cache: 'no-store', signal: controller.signal })
    .then(res => {
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      applyIncomingTelemetry(data, 'wifi');
    })
    .catch(err => {
      clearTimeout(timeoutId);
      state.missedPolls++;
      // If 2 polls fail consecutively, switch UI to offline
      if (state.missedPolls >= 2) {
        updateOnlineOfflineUI(false, 'wifi');
      }
    });
}

// GitHub Cloud Internet Sync
function pollGithubTelemetry(force = false) {
  const pingStatus = document.getElementById('esp-ping-status');
  if (pingStatus && force) pingStatus.textContent = 'Cloud Syncing...';

  const rawUrl = `https://raw.githubusercontent.com/${state.githubUser}/${state.githubRepo}/${state.githubBranch}/${state.githubPath}?t=${Date.now()}`;

  fetch(rawUrl, { cache: 'no-store' })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      applyIncomingTelemetry(data, 'cloud');
    })
    .catch(err => {
      if (pingStatus && force) {
        pingStatus.textContent = 'Cloud file not found (Check Repo)';
      }
    });
}

// WebSerial Direct USB Support (Works on GitHub Pages HTTPS & Offline)
async function connectUsbSerial() {
  if (!navigator.serial) {
    alert('WebSerial is supported on Google Chrome, Microsoft Edge, and Chromium-based browsers on PC/Mac.');
    return;
  }

  try {
    if (state.serialPort) {
      await disconnectUsbSerial();
      return;
    }

    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    state.serialPort = port;

    const btnUsb = document.getElementById('btn-usb-serial');
    if (btnUsb) {
      btnUsb.classList.add('active');
      btnUsb.innerHTML = '<span class="usb-icon">🔌</span><span>Disconnect USB</span>';
    }

    updateConnectionBadge('usb', true);
    stopLivePolling(); // USB gives direct stream, pause HTTP polling

    // Start listening for telemetry lines from ESP32
    readSerialStream(port);
  } catch (err) {
    console.warn('WebSerial connection cancelled or failed:', err);
    updateConnectionBadge('searching', false, 'USB Not Connected');
  }
}

async function disconnectUsbSerial() {
  try {
    if (state.serialReader) {
      await state.serialReader.cancel();
      state.serialReader = null;
    }
    if (state.serialPort) {
      await state.serialPort.close();
      state.serialPort = null;
    }
  } catch (e) {
    console.warn('USB disconnect:', e);
  }
  const btnUsb = document.getElementById('btn-usb-serial');
  if (btnUsb) {
    btnUsb.classList.remove('active');
    btnUsb.innerHTML = '<span class="usb-icon">🔌</span><span>Connect USB Cable</span>';
  }
  startLivePolling();
}

async function sendSerialCommand(cmd) {
  if (!state.serialPort || !state.serialPort.writable) return;
  try {
    const encoder = new TextEncoder();
    const writer = state.serialPort.writable.getWriter();
    await writer.write(encoder.encode(cmd));
    writer.releaseLock();
  } catch (e) {
    console.warn('Serial write error:', e);
  }
}

async function readSerialStream(port) {
  const textDecoder = new TextDecoderStream();
  port.readable.pipeTo(textDecoder.writable).catch(() => {});
  const reader = textDecoder.readable.getReader();
  state.serialReader = reader;

  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        buffer += value;
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Retain incomplete line for next chunk

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('TELEMETRY:')) {
            try {
              const jsonStr = trimmed.substring(10);
              const data = JSON.parse(jsonStr);
              applyIncomingTelemetry(data, 'usb');
            } catch (jsonErr) {
              console.warn('Serial JSON parse error:', jsonErr);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn('Serial stream terminated:', err);
  } finally {
    reader.releaseLock();
  }
}

// 12. Micro-Climate Trend Chart (Native Responsive HTML5 Canvas)
function initHistoryData() {
  state.historyData = [];
  const baseT = 28.4;
  const baseH = 64.0;
  for (let i = 24; i >= 0; i--) {
    const hourLabel = `${24 - i}h ago`;
    const noiseT = (Math.sin(i * 0.4) * 1.6) + ((Math.random() - 0.5) * 0.4);
    const noiseH = (Math.cos(i * 0.35) * 4.2) + ((Math.random() - 0.5) * 1.0);
    state.historyData.push({
      label: hourLabel,
      temp: parseFloat((baseT + noiseT).toFixed(1)),
      hum: parseFloat((baseH + noiseH).toFixed(1))
    });
  }
}

function drawMicroclimateChart() {
  const canvas = document.getElementById('microclimateChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  const paddingLeft = 36;
  const paddingRight = 16;
  const paddingTop = 14;
  const paddingBottom = 24;

  const plotW = w - paddingLeft - paddingRight;
  const plotH = h - paddingTop - paddingBottom;

  // Data ranges
  const minTemp = 15;
  const maxTemp = 40;
  const minHum = 30;
  const maxHum = 95;

  const points = state.historyData;
  if (!points || points.length === 0) return;

  // Background Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.font = '9px sans-serif';
  ctx.fillStyle = '#64748b';

  for (let i = 0; i <= 3; i++) {
    const y = paddingTop + (plotH / 3) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(w - paddingRight, y);
    ctx.stroke();

    // Temp labels
    const tVal = Math.round(maxTemp - ((maxTemp - minTemp) / 3) * i);
    ctx.fillText(`${tVal}°`, 6, y + 3);
  }

  // Draw Humidity Curve (Cyan / Blue)
  ctx.beginPath();
  points.forEach((pt, idx) => {
    const x = paddingLeft + (plotW / (points.length - 1)) * idx;
    const y = paddingTop + plotH - (((pt.hum - minHum) / (maxHum - minHum)) * plotH);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Draw Temperature Curve (Amber)
  ctx.beginPath();
  points.forEach((pt, idx) => {
    const x = paddingLeft + (plotW / (points.length - 1)) * idx;
    const y = paddingTop + plotH - (((pt.temp - minTemp) / (maxTemp - minTemp)) * plotH);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  // Draw Current Point markers at the end
  const lastIdx = points.length - 1;
  const lastX = paddingLeft + plotW;
  const lastHumY = paddingTop + plotH - (((state.humidity - minHum) / (maxHum - minHum)) * plotH);
  const lastTempY = paddingTop + plotH - (((state.temperature - minTemp) / (maxTemp - minTemp)) * plotH);

  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(lastX, lastHumY, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(lastX, lastTempY, 4, 0, Math.PI * 2);
  ctx.fill();

  // X-axis timeline markers
  ctx.fillStyle = '#64748b';
  ctx.fillText('24h ago', paddingLeft, h - 6);
  ctx.fillText('12h ago', paddingLeft + plotW / 2 - 16, h - 6);
  ctx.fillText('Now', w - paddingRight - 22, h - 6);
}

// 13. Window Resize Handler for Canvas
window.addEventListener('resize', () => {
  drawMicroclimateChart();
});

// 14. Initial Bootstrap
document.addEventListener('DOMContentLoaded', () => {
  // If opened directly from ESP32 IP or local network
  if (window.location.hostname && window.location.hostname !== 'localhost' && !window.location.hostname.endsWith('github.io')) {
    state.espIp = window.location.hostname;
    const ipInput = document.getElementById('input-esp-ip');
    if (ipInput) ipInput.value = state.espIp;
  }

  // Auto-detect GitHub Pages URL and repository details
  if (window.location.hostname.endsWith('github.io')) {
    const domainParts = window.location.hostname.split('.');
    if (domainParts.length >= 3) {
      state.githubUser = domainParts[0];
    }
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0 && pathSegments[0] !== 'dashboard') {
      state.githubRepo = pathSegments[0];
    }
    // Attempt initial cloud sync fetch
    pollGithubTelemetry(false);
  }

  // Initialize produce start date picker
  const startDate = getStorageStartDate(state.selectedProduceId);
  const dateInput = document.getElementById('input-storage-start-date');
  if (dateInput) dateInput.value = startDate;
  state.storageDays = calculateDaysFromStartDate(startDate);

  // If cached telemetry exists from previous session, display it
  if (state.lastKnownTelemetry) {
    if (state.lastKnownTelemetry.temperature !== undefined) state.temperature = Number(state.lastKnownTelemetry.temperature);
    if (state.lastKnownTelemetry.humidity !== undefined) state.humidity = Number(state.lastKnownTelemetry.humidity);
    if (state.lastKnownTelemetry.pressure !== undefined) state.pressure = Number(state.lastKnownTelemetry.pressure);
  }

  // Display initial status (offline until first heartbeat)
  updateOnlineOfflineUI(false, 'offline');

  initHistoryData();
  renderProduceCards();
  updateDashboard();

  // Start polling ESP32 directly via Wi-Fi AP / LAN
  startLivePolling();
});
