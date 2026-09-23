#ifndef STORAGE_RISK_AI_H
#define STORAGE_RISK_AI_H

#include <Arduino.h>

// Risk Level Enumeration
enum RiskLevel {
    RISK_SAFE = 0,       // 🟢 SAFE: Conditions optimal for long-term storage
    RISK_WARNING = 1,    // 🟡 WARNING: High humidity/temperature detected
    RISK_SPOILAGE = 2    // 🔴 SPOILAGE RISK: Deterioration conditions active - take action
};

// Produce Type Enumeration
enum ProduceType {
    PRODUCE_MAHUA = 0,
    PRODUCE_TAMARIND = 1,
    PRODUCE_PADDY = 2,
    PRODUCE_PULSES = 3,
    PRODUCE_MEDICINAL = 4,
    PRODUCE_SAL_SEEDS = 5,
    PRODUCE_HONEY = 6,
    PRODUCE_COUNT = 7
};

// Produce Agronomic Storage Thresholds
struct ProduceProfile {
    const char* id;
    const char* name;
    const char* hindiName;
    const char* icon;
    float safeTempMin;      // °C
    float safeTempMax;      // °C
    float warningTempMax;   // °C
    float safeHumidityMin;  // %
    float safeHumidityMax;  // %
    float criticalHumidity; // %
    int safeStorageDays;    // Max recommended days before routine aeration/turnover
    const char* primaryThreat;
};

// Assessment Result Structure
struct StorageAssessment {
    ProduceType produce;
    RiskLevel riskLevel;
    float riskScore;        // 0 to 100%
    float temperature;
    float humidity;
    float dewPoint;
    int storageDays;
    const char* statusText;
    const char* statusHindi;
    const char* primaryAction;
    const char* primaryActionHindi;
    const char* secondaryTip;
    const char* colorCode;   // Hex color string (e.g. #10B981)
};

class StorageRiskAI {
public:
    StorageRiskAI();
    
    // Core AI inference method
    StorageAssessment evaluate(ProduceType produce, float temperature, float humidity, int storageDays);

    // Profile lookup
    static const ProduceProfile& getProfile(ProduceType produce);
    static ProduceType parseProduce(const String& name);
    static const char* getProduceName(ProduceType produce);
    
    // Utility: Dew point calculation (°C) using Magnus-Tetens formula
    static float calculateDewPoint(float temp, float humidity);
};

#endif // STORAGE_RISK_AI_H
