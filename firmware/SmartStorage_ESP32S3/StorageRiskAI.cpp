#include "StorageRiskAI.h"
#include <math.h>

// Agronomic & Forest Produce Knowledge Database
static const ProduceProfile PROFILES[PRODUCE_COUNT] = {
    // 0: Mahua (Madhuca longifolia) flowers
    {
        "mahua",
        "Mahua",
        "महुआ",
        "🌰",
        18.0f, 28.0f, 32.0f,  // Safe Temp Min/Max, Warning Temp Max
        40.0f, 60.0f, 65.0f,  // Safe RH Min/Max, Critical RH
        30,                   // Safe storage days
        "High sugar content causes rapid fungal rot (Aspergillus) & fermentation if RH > 60%"
    },
    // 1: Tamarind (Tamarindus indica)
    {
        "tamarind",
        "Tamarind",
        "इमली",
        "🌱",
        15.0f, 26.0f, 30.0f,
        45.0f, 60.0f, 68.0f,
        90,
        "High tartaric acid & sugars attract moisture, leading to blackening, stickiness, and beetles"
    },
    // 2: Paddy (Rice grain)
    {
        "paddy",
        "Paddy",
        "धान",
        "🌾",
        15.0f, 28.0f, 33.0f,
        50.0f, 65.0f, 70.0f,
        180,
        "Moisture equilibrium above 14% triggers grain heating, yellowing, aflatoxins, and premature sprouting"
    },
    // 3: Pulses (Gram, Arhar, Moong, Urad)
    {
        "pulses",
        "Pulses",
        "दलहन",
        "🫘",
        16.0f, 27.0f, 32.0f,
        40.0f, 60.0f, 65.0f,
        120,
        "High humidity and warm air accelerate pulse beetle (bruchid) propagation and mold growth"
    },
    // 4: Medicinal / Forest Produce (Chironji, Harra, Bahera, Amla, Roots)
    {
        "medicinal",
        "Medicinal Produce",
        "औषधीय वनोपज",
        "🌿",
        15.0f, 25.0f, 30.0f,
        35.0f, 55.0f, 62.0f,
        60,
        "Damp air degrades essential active phytoconstituents, volatile oils, and medicinal efficacy"
    },
    // 5: Sal Seeds (Shorea robusta)
    {
        "sal_seeds",
        "Sal Seeds",
        "साल बीज",
        "🌰",
        18.0f, 28.0f, 32.0f,
        40.0f, 58.0f, 64.0f,
        45,
        "High oil content oxidizes quickly; damp seeds turn rancid with high free fatty acids"
    },
    // 6: Honey (Wild forest honey)
    {
        "honey",
        "Honey",
        "शहद",
        "🍯",
        15.0f, 24.0f, 30.0f,
        30.0f, 55.0f, 60.0f,
        365,
        "Extremely hygroscopic. Absorbs air moisture above 60% RH, activating osmophilic yeast fermentation"
    }
};

StorageRiskAI::StorageRiskAI() {}

const ProduceProfile& StorageRiskAI::getProfile(ProduceType produce) {
    if (produce < 0 || produce >= PRODUCE_COUNT) {
        return PROFILES[PRODUCE_MAHUA];
    }
    return PROFILES[produce];
}

ProduceType StorageRiskAI::parseProduce(const String& name) {
    String lower = name;
    lower.toLowerCase();
    lower.trim();
    if (lower == "mahua" || lower == "0") return PRODUCE_MAHUA;
    if (lower == "tamarind" || lower == "imli" || lower == "1") return PRODUCE_TAMARIND;
    if (lower == "paddy" || lower == "dhan" || lower == "rice" || lower == "2") return PRODUCE_PADDY;
    if (lower == "pulses" || lower == "dal" || lower == "gram" || lower == "3") return PRODUCE_PULSES;
    if (lower == "medicinal" || lower == "herbs" || lower == "herb" || lower == "4") return PRODUCE_MEDICINAL;
    if (lower == "sal" || lower == "sal_seeds" || lower == "salseeds" || lower == "5") return PRODUCE_SAL_SEEDS;
    if (lower == "honey" || lower == "shahad" || lower == "6") return PRODUCE_HONEY;
    return PRODUCE_MAHUA;
}

const char* StorageRiskAI::getProduceName(ProduceType produce) {
    return getProfile(produce).name;
}

float StorageRiskAI::calculateDewPoint(float temp, float humidity) {
    if (humidity <= 0.0f) humidity = 1.0f;
    if (humidity > 100.0f) humidity = 100.0f;
    // Magnus-Tetens approximation formula
    float a = 17.27f;
    float b = 237.7f;
    float alpha = ((a * temp) / (b + temp)) + logf(humidity / 100.0f);
    float dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
}

StorageAssessment StorageRiskAI::evaluate(ProduceType produce, float temperature, float humidity, int storageDays) {
    const ProduceProfile& prof = getProfile(produce);
    StorageAssessment result;
    result.produce = produce;
    result.temperature = temperature;
    result.humidity = humidity;
    result.storageDays = storageDays;
    result.dewPoint = calculateDewPoint(temperature, humidity);

    // 1. Humidity Risk Component (0 - 55 points)
    float hScore = 0.0f;
    if (humidity <= prof.safeHumidityMax) {
        if (humidity < prof.safeHumidityMin) {
            hScore = 5.0f; // Slightly too dry, low risk
        } else {
            hScore = 0.0f; // Ideal zone
        }
    } else if (humidity <= prof.criticalHumidity) {
        // Warning zone: Linear interpolation between safe max and critical
        float ratio = (humidity - prof.safeHumidityMax) / (prof.criticalHumidity - prof.safeHumidityMax);
        hScore = 20.0f + (ratio * 20.0f); // 20 - 40 points
    } else {
        // Critical zone: Excess beyond critical
        float excess = humidity - prof.criticalHumidity;
        hScore = 40.0f + (excess * 2.0f);
        if (hScore > 55.0f) hScore = 55.0f;
    }

    // 2. Temperature Risk Component (0 - 30 points)
    float tScore = 0.0f;
    if (temperature >= prof.safeTempMin && temperature <= prof.safeTempMax) {
        tScore = 0.0f; // Ideal
    } else if (temperature > prof.safeTempMax && temperature <= prof.warningTempMax) {
        float ratio = (temperature - prof.safeTempMax) / (prof.warningTempMax - prof.safeTempMax);
        tScore = 10.0f + (ratio * 12.0f); // 10 - 22 points
    } else if (temperature > prof.warningTempMax) {
        float excess = temperature - prof.warningTempMax;
        tScore = 22.0f + (excess * 2.5f);
        if (tScore > 30.0f) tScore = 30.0f;
    } else {
        // Cold temperature (less critical for grains, but not ideal for honey crystallization)
        tScore = 5.0f;
    }

    // 3. Dew Point & Condensation Proximity Risk (0 - 10 points)
    // When ambient temp is within 2.5°C of dew point, water droplets condense on produce
    float dewGap = temperature - result.dewPoint;
    float condensationScore = 0.0f;
    if (dewGap < 2.0f) {
        condensationScore = 10.0f;
    } else if (dewGap < 4.0f) {
        condensationScore = 5.0f;
    }

    // 4. Storage Duration Aging Factor (0 - 10 points)
    float durationScore = 0.0f;
    if (storageDays > prof.safeStorageDays) {
        float overDays = (float)(storageDays - prof.safeStorageDays);
        durationScore = (overDays / (float)prof.safeStorageDays) * 8.0f;
        if (durationScore > 10.0f) durationScore = 10.0f;
    }

    // Total Composite Risk Score (0 - 100)
    float totalScore = hScore + tScore + condensationScore + durationScore;
    if (totalScore > 100.0f) totalScore = 100.0f;
    result.riskScore = totalScore;

    // Determine Risk Classification and Actionable Advisory
    if (totalScore >= 68.0f || humidity >= prof.criticalHumidity + 3.0f || (humidity >= prof.criticalHumidity && temperature >= prof.warningTempMax)) {
        // 🔴 SPOILAGE RISK
        result.riskLevel = RISK_SPOILAGE;
        result.statusText = "SPOILAGE RISK";
        result.statusHindi = "खराब होने का खतरा (सड़न का जोखिम)";
        result.colorCode = "#EF4444";

        if (humidity >= prof.criticalHumidity) {
            result.primaryAction = "Dry the produce before storage.";
            result.primaryActionHindi = "भंडारण से पहले उपज को धूप या छांव में तुरंत सुखाएं।";
            result.secondaryTip = "High moisture triggers rapid fungal rot and fermentation. Spread produce on clean mats immediately.";
        } else if (temperature >= prof.warningTempMax) {
            result.primaryAction = "Move the produce to a dry storage area.";
            result.primaryActionHindi = "उपज को तुरंत ठंडे और सूखे भंडारण स्थान पर स्थानांतरित करें।";
            result.secondaryTip = "Severe thermal stress accelerates insect proliferation and oil breakdown.";
        } else {
            result.primaryAction = "Improve ventilation and inspect produce.";
            result.primaryActionHindi = "कमरे में वेंटिलेशन बढ़ाएं और खराब दानों/फूलों को अलग करें।";
            result.secondaryTip = "Condensation risk active. Turn bags or aerate grain bulk.";
        }
    } else if (totalScore >= 35.0f || humidity > prof.safeHumidityMax || temperature > prof.safeTempMax) {
        // 🟡 WARNING
        result.riskLevel = RISK_WARNING;
        result.statusText = "WARNING";
        result.statusHindi = "चेतावनी (निगरानी आवश्यक)";
        result.colorCode = "#F59E0B";

        if (humidity > prof.safeHumidityMax && temperature > prof.safeTempMax) {
            result.primaryAction = "Improve ventilation.";
            result.primaryActionHindi = "कमरे में हवा का संचार (वेंटिलेशन) बढ़ाएं।";
            result.secondaryTip = "Both humidity and heat are elevated. Open air vents or turn on exhaust.";
        } else if (humidity > prof.safeHumidityMax) {
            result.primaryAction = "Dry the produce before storage.";
            result.primaryActionHindi = "उपज में नमी अधिक है - सुखाने की व्यवस्था करें।";
            result.secondaryTip = "Moisture level approaching dangerous thresholds for mold formation.";
        } else {
            result.primaryAction = "Move the produce to a dry storage area.";
            result.primaryActionHindi = "उपज को गर्म स्थान से हटाकर छायादार ठंडे स्थान पर रखें।";
            result.secondaryTip = "Temperature is above recommended preservation limits.";
        }
    } else {
        // 🟢 SAFE
        result.riskLevel = RISK_SAFE;
        result.statusText = "SAFE";
        result.statusHindi = "सुरक्षित (सामान्य स्थिति)";
        result.colorCode = "#10B981";
        result.primaryAction = "Storage condition normal.";
        result.primaryActionHindi = "भंडारण स्थिति सामान्य और सुरक्षित है।";
        result.secondaryTip = "Micro-climate is optimal. Maintain cleanliness and keep containers sealed or raised on wooden pallets.";
    }

    return result;
}
