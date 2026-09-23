/*
 * ==============================================================================
 * Smart Storage & Quality Protection System for Tribal & Agricultural Produce
 * Microcontroller: ESP32-S3 (ESP32-S3-DevKitC-1 or compatible)
 * Brain: Storage Risk AI Engine
 * 
 * Target Produce: Mahua, Tamarind, Paddy, Pulses, Forest Herbs, Sal Seeds, Honey
 * 
 * Hardware Sensors & Actuators:
 * - Temperature & Pressure Sensor : BMP280 (I2C: SDA=GPIO 8, SCL=GPIO 9, Addr=0x76/0x77)
 * - Relative Humidity Sensor     : DHT11 (Digital Pin: GPIO 4)
 * - Standalone Field Display     : 0.96" SSD1306 4-Pin OLED (I2C: SDA=GPIO 8, SCL=GPIO 9, Addr=0x3C)
 * - Spoilage Risk Buzzer         : Piezo Buzzer on GPIO 5
 * - Status Indicators            : Onboard WS2812 RGB LED (GPIO 48) & LED on GPIO 2
 * ==============================================================================
 */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <mbedtls/base64.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BMP280.h>
#include <DHT.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "StorageRiskAI.h"

// Configuration & Credentials (config_secrets.h is ignored by git for security)
#if __has_include("config_secrets.h")
  #include "config_secrets.h"
#else
  // Fallback defaults if config_secrets.h is not yet created
  #define STA_WIFI_SSID       ""
  #define STA_WIFI_PASS       ""
  #define AP_WIFI_SSID        "SmartStorage-ESP32S3"
  #define AP_WIFI_PASS        "protectproduce"
  #define GITHUB_USERNAME     "Rudrapratap"
  #define GITHUB_REPO         "smart-storage-iot-esp32s3"
  #define GITHUB_BRANCH       "main"
  #define GITHUB_TOKEN        ""
  #define GITHUB_SYNC_ENABLED false
  #define GITHUB_SYNC_INTERVAL_SEC 30
#endif

// Hardware Pin Definitions for ESP32-S3
#define I2C_SDA_PIN     8       // Shared I2C Data Pin (BMP280 + SSD1306 OLED)
#define I2C_SCL_PIN     9       // Shared I2C Clock Pin (BMP280 + SSD1306 OLED)
#define DHT_PIN         4       // DHT11 Humidity Sensor Data Pin
#define DHT_TYPE        DHT11   // Sensor Type: DHT11
#define BUZZER_PIN      5       // Warning Buzzer for Spoilage Risk
#define STATUS_LED_PIN  48      // Onboard WS2812 RGB LED (ESP32-S3 DevKit)
#define AUX_LED_PIN     2       // Auxiliary indicator LED

// OLED Display Configuration (0.96" SSD1306, 128x64, 4-Pin I2C: GND, VCC, SCL, SDA)
#define SCREEN_WIDTH    128
#define SCREEN_HEIGHT   64
#define OLED_RESET      -1
#define OLED_I2C_ADDR   0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// BMP280 Sensor Instance (I2C)
Adafruit_BMP280 bmp; // Uses Wire by default
#define BMP280_I2C_ADDR 0x76 // Alternative address: 0x77

// DHT11 Sensor Instance
DHT dht(DHT_PIN, DHT_TYPE);

// Wi-Fi SoftAP Configuration (Direct Offline Access in Forest/Rural Stores)
const char* AP_SSID = AP_WIFI_SSID;
const char* AP_PASS = AP_WIFI_PASS;

// Station Wi-Fi (Connects to Router / Mobile Hotspot for Internet Access)
const char* STA_SSID = STA_WIFI_SSID;
const char* STA_PASS = STA_WIFI_PASS;

// Web Server instance
WebServer server(80);

// Storage Risk AI Engine
StorageRiskAI riskAI;

// Current State
ProduceType currentProduce = PRODUCE_MAHUA;
float currentTemperature = 28.4f;
float currentHumidity = 64.0f;
float currentPressure = 1013.2f;
int storagePeriodDays = 12;

bool isBmpDetected = false;
bool isDhtDetected = false;
bool isOledDetected = false;

unsigned long lastSensorRead = 0;
unsigned long lastOledUpdate = 0;
unsigned long lastBlinkTime = 0;
bool ledState = false;

// Circular buffer for 24-sample mini-history (hourly / interval samples)
#define HISTORY_SIZE 24
struct HistoryPoint {
    float temp;
    float hum;
    uint8_t risk;
};
HistoryPoint history[HISTORY_SIZE];
int historyIndex = 0;
int historyCount = 0;
unsigned long lastHistoryLog = 0;

// GitHub Cloud Internet Sync State
unsigned long lastGithubSync = 0;
String lastFileSha = "";
bool isGithubConnected = false;

// Base64 Encoding Helper for GitHub API
String encodeBase64(const String& input) {
    size_t outputLen = 0;
    mbedtls_base64_encode(NULL, 0, &outputLen, (const unsigned char*)input.c_str(), input.length());
    unsigned char* output = (unsigned char*)malloc(outputLen + 1);
    if (!output) return "";
    mbedtls_base64_encode(output, outputLen + 1, &outputLen, (const unsigned char*)input.c_str(), input.length());
    output[outputLen] = '\0';
    String result = (char*)output;
    free(output);
    return result;
}

// Push live telemetry over HTTPS to user's GitHub repository (data/telemetry.json)
void syncTelemetryToGitHub() {
#if GITHUB_SYNC_ENABLED
    if (strlen(GITHUB_TOKEN) < 8 || strlen(GITHUB_REPO) == 0) return;
    if (WiFi.status() != WL_CONNECTED) {
        isGithubConnected = false;
        return;
    }

    unsigned long now = millis();
    if (now - lastGithubSync < (GITHUB_SYNC_INTERVAL_SEC * 1000UL)) return;
    lastGithubSync = now;

    WiFiClientSecure client;
    client.setInsecure(); // Skip certificate verification for lightweight embedded IoT TLS

    HTTPClient https;
    String apiEndpoint = "https://api.github.com/repos/" + String(GITHUB_USERNAME) + "/" + String(GITHUB_REPO) + "/contents/data/telemetry.json";

    // Step 1: If file SHA is unknown, fetch it from GitHub
    if (lastFileSha.length() == 0) {
        if (https.begin(client, apiEndpoint)) {
            https.addHeader("User-Agent", "ESP32S3-SmartStorage");
            https.addHeader("Authorization", "Bearer " + String(GITHUB_TOKEN));
            int httpCode = https.GET();
            if (httpCode == 200) {
                String payload = https.getString();
                int shaIndex = payload.indexOf("\"sha\":\"");
                if (shaIndex != -1) {
                    int shaEnd = payload.indexOf("\"", shaIndex + 7);
                    if (shaEnd != -1) {
                        lastFileSha = payload.substring(shaIndex + 7, shaEnd);
                    }
                }
            }
            https.end();
        }
    }

    // Step 2: Format JSON Telemetry Body
    StorageAssessment eval = riskAI.evaluate(currentProduce, currentTemperature, currentHumidity, storagePeriodDays);
    const ProduceProfile& prof = riskAI.getProfile(currentProduce);

    String json = "{\n";
    json += "  \"produceId\": \"" + String(prof.id) + "\",\n";
    json += "  \"produceName\": \"" + String(prof.name) + "\",\n";
    json += "  \"produceHindi\": \"" + String(prof.hindiName) + "\",\n";
    json += "  \"produceIcon\": \"" + String(prof.icon) + "\",\n";
    json += "  \"temperature\": " + String(eval.temperature, 1) + ",\n";
    json += "  \"humidity\": " + String(eval.humidity, 1) + ",\n";
    json += "  \"pressure\": " + String(currentPressure, 1) + ",\n";
    json += "  \"dewPoint\": " + String(eval.dewPoint, 1) + ",\n";
    json += "  \"storageDays\": " + String(eval.storageDays) + ",\n";
    json += "  \"riskLevel\": " + String((int)eval.riskLevel) + ",\n";
    json += "  \"riskLevelText\": \"" + String(eval.statusText) + "\",\n";
    json += "  \"riskLevelHindi\": \"" + String(eval.statusHindi) + "\",\n";
    json += "  \"riskScore\": " + String(eval.riskScore, 1) + ",\n";
    json += "  \"primaryAction\": \"" + String(eval.primaryAction) + "\",\n";
    json += "  \"primaryActionHindi\": \"" + String(eval.primaryActionHindi) + "\",\n";
    json += "  \"safeTempMax\": " + String(prof.safeTempMax, 1) + ",\n";
    json += "  \"safeHumidityMax\": " + String(prof.safeHumidityMax, 1) + ",\n";
    json += "  \"criticalHumidity\": " + String(prof.criticalHumidity, 1) + ",\n";
    json += "  \"bmp280Detected\": " + String(isBmpDetected ? "true" : "false") + ",\n";
    json += "  \"dht11Detected\": " + String(isDhtDetected ? "true" : "false") + ",\n";
    json += "  \"oledDetected\": " + String(isOledDetected ? "true" : "false") + ",\n";
    json += "  \"deviceOnline\": true\n";
    json += "}\n";

    String encoded = encodeBase64(json);

    // Step 3: Send PUT Request to GitHub Contents API
    if (https.begin(client, apiEndpoint)) {
        https.addHeader("User-Agent", "ESP32S3-SmartStorage");
        https.addHeader("Authorization", "Bearer " + String(GITHUB_TOKEN));
        https.addHeader("Content-Type", "application/json");

        String reqBody = "{";
        reqBody += "\"message\":\"Live telemetry update from ESP32-S3\",";
        reqBody += "\"content\":\"" + encoded + "\",";
        reqBody += "\"branch\":\"" + String(GITHUB_BRANCH) + "\"";
        if (lastFileSha.length() > 0) {
            reqBody += ",\"sha\":\"" + lastFileSha + "\"";
        }
        reqBody += "}";

        int httpCode = https.PUT(reqBody);
        if (httpCode == 200 || httpCode == 201) {
            isGithubConnected = true;
            String res = https.getString();
            int shaIndex = res.indexOf("\"sha\":\"");
            if (shaIndex != -1) {
                int shaEnd = res.indexOf("\"", shaIndex + 7);
                if (shaEnd != -1) {
                    lastFileSha = res.substring(shaIndex + 7, shaEnd);
                }
            }
            Serial.println("[GitHub] Telemetry synced to repository successfully!");
        } else {
            Serial.printf("[GitHub] Sync response HTTP %d\n", httpCode);
            if (httpCode == 409) {
                lastFileSha = ""; // SHA mismatch, force refresh next cycle
            }
        }
        https.end();
    }
#endif
}

// Read real sensors (BMP280 for Temp, DHT11 for Humidity) with simulation fallback
void updateSensorReadings() {
    unsigned long now = millis();
    if (now - lastSensorRead < 2000) return; // Sample every 2 seconds
    lastSensorRead = now;

    bool validTemp = false;
    bool validHum = false;

    // 1. Read High-Precision Temperature & Pressure from BMP280
    if (isBmpDetected) {
        float t = bmp.readTemperature();
        float p = bmp.readPressure() / 100.0F; // Convert Pa to hPa
        if (!isnan(t) && t > -40.0f && t < 85.0f) {
            currentTemperature = t;
            currentPressure = p;
            validTemp = true;
        }
    }

    // 2. Read Relative Humidity from DHT11
    if (isDhtDetected) {
        float h = dht.readHumidity();
        if (!isnan(h) && h >= 10.0f && h <= 95.0f) {
            currentHumidity = h;
            validHum = true;
        }
    }

    // 3. Fallback: If hardware sensors not yet wired or disconnected, simulate realistic micro-climate
    if (!validTemp || !validHum) {
        static float simPhase = 0.0f;
        simPhase += 0.05f;
        if (simPhase > 6.28f) simPhase = 0.0f;
        
        if (!validTemp) {
            currentTemperature = 28.4f + (1.2f * sin(simPhase));
        }
        if (!validHum) {
            currentHumidity = 64.0f + (3.5f * cos(simPhase * 0.7f));
        }
    }
}

// Render Status & AI Risk Recommendation onto 4-Pin 0.96" SSD1306 OLED
void updateOledDisplay(const StorageAssessment& eval) {
    if (!isOledDetected) return;

    unsigned long now = millis();
    if (now - lastOledUpdate < 1000) return; // Refresh display every 1 second
    lastOledUpdate = now;

    const ProduceProfile& prof = riskAI.getProfile(currentProduce);

    display.clearDisplay();
    display.setTextColor(SSD1306_WHITE);

    // Header: System & Produce
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("PROD: ");
    display.print(prof.name);
    
    // Top-Right Status Badge
    if (isGithubConnected) {
        display.setCursor(102, 0);
        display.print("[GH]");
    } else if (WiFi.status() == WL_CONNECTED) {
        display.setCursor(102, 0);
        display.print("[IP]");
    }
    display.drawFastHLine(0, 10, 128, SSD1306_WHITE);

    // Line 2: Telemetry Values (BMP280 Temp & DHT11 Humidity)
    display.setCursor(0, 14);
    display.print("T:");
    display.print(eval.temperature, 1);
    display.print((char)247); // Degree symbol
    display.print("C  ");

    display.print("H:");
    display.print((int)round(eval.humidity));
    display.print("%");

    // Line 3: Prominent Risk Status Badge
    display.setTextSize(1);
    display.setCursor(0, 26);
    display.print("AI RISK: ");

    if (eval.riskLevel == RISK_SAFE) {
        display.fillRect(52, 24, 76, 12, SSD1306_WHITE);
        display.setTextColor(SSD1306_BLACK, SSD1306_WHITE);
        display.setCursor(56, 26);
        display.print(" SAFE ");
    } else if (eval.riskLevel == RISK_WARNING) {
        display.fillRect(52, 24, 76, 12, SSD1306_WHITE);
        display.setTextColor(SSD1306_BLACK, SSD1306_WHITE);
        display.setCursor(56, 26);
        display.print(" WARNING ");
    } else {
        display.fillRect(52, 24, 76, 12, SSD1306_WHITE);
        display.setTextColor(SSD1306_BLACK, SSD1306_WHITE);
        display.setCursor(56, 26);
        display.print(" SPOILAGE ");
    }

    display.setTextColor(SSD1306_WHITE);
    display.drawFastHLine(0, 39, 128, SSD1306_WHITE);

    // Line 4: Actionable Advice
    display.setTextSize(1);
    display.setCursor(0, 43);
    if (eval.riskLevel == RISK_SAFE) {
        display.print("Status: Normal");
        display.setCursor(0, 54);
        display.print("Days: ");
        display.print(eval.storageDays);
        display.print(" | Safe");
    } else if (eval.riskLevel == RISK_WARNING) {
        display.print("ACTION: ");
        display.setCursor(0, 54);
        if (eval.humidity > prof.safeHumidityMax) {
            display.print("Dry produce soon!");
        } else {
            display.print("Improve ventilation");
        }
    } else {
        display.print("CRITICAL ACTION:");
        display.setCursor(0, 54);
        display.print("Dry/move produce!");
    }

    display.display();
}

// Log history point every minute for dashboard charting
void recordHistory() {
    unsigned long now = millis();
    if (now - lastHistoryLog < 60000) return;
    lastHistoryLog = now;

    StorageAssessment assessment = riskAI.evaluate(currentProduce, currentTemperature, currentHumidity, storagePeriodDays);
    history[historyIndex].temp = currentTemperature;
    history[historyIndex].hum = currentHumidity;
    history[historyIndex].risk = (uint8_t)assessment.riskLevel;

    historyIndex = (historyIndex + 1) % HISTORY_SIZE;
    if (historyCount < HISTORY_SIZE) historyCount++;
}

// Update alert actuators (LED & Buzzer) based on AI assessment
void updateActuators(const StorageAssessment& assessment) {
    unsigned long now = millis();
    
    if (assessment.riskLevel == RISK_SAFE) {
        digitalWrite(AUX_LED_PIN, HIGH);
        noTone(BUZZER_PIN);
    } 
    else if (assessment.riskLevel == RISK_WARNING) {
        // Warning: 1 Hz Blink
        if (now - lastBlinkTime > 500) {
            lastBlinkTime = now;
            ledState = !ledState;
            digitalWrite(AUX_LED_PIN, ledState ? HIGH : LOW);
        }
        noTone(BUZZER_PIN);
    } 
    else {
        // Spoilage Risk: Rapid 4 Hz Blink + Pulsed Alarm Buzzer
        if (now - lastBlinkTime > 150) {
            lastBlinkTime = now;
            ledState = !ledState;
            digitalWrite(AUX_LED_PIN, ledState ? HIGH : LOW);
            if (ledState) {
                tone(BUZZER_PIN, 2400, 100);
            }
        }
    }
}

// JSON API: Return Current Telemetry and AI Risk Evaluation
void handleApiStatus() {
    StorageAssessment eval = riskAI.evaluate(currentProduce, currentTemperature, currentHumidity, storagePeriodDays);
    const ProduceProfile& prof = riskAI.getProfile(currentProduce);

    String json = "{";
    json += "\"produceId\":\"" + String(prof.id) + "\",";
    json += "\"produceName\":\"" + String(prof.name) + "\",";
    json += "\"produceHindi\":\"" + String(prof.hindiName) + "\",";
    json += "\"produceIcon\":\"" + String(prof.icon) + "\",";
    json += "\"temperature\":" + String(eval.temperature, 1) + ",";
    json += "\"humidity\":" + String(eval.humidity, 1) + ",";
    json += "\"pressure\":" + String(currentPressure, 1) + ",";
    json += "\"dewPoint\":" + String(eval.dewPoint, 1) + ",";
    json += "\"storageDays\":" + String(eval.storageDays) + ",";
    json += "\"riskLevel\":" + String((int)eval.riskLevel) + ",";
    json += "\"riskLevelText\":\"" + String(eval.statusText) + "\",";
    json += "\"riskLevelHindi\":\"" + String(eval.statusHindi) + "\",";
    json += "\"riskScore\":" + String(eval.riskScore, 1) + ",";
    json += "\"primaryAction\":\"" + String(eval.primaryAction) + "\",";
    json += "\"primaryActionHindi\":\"" + String(eval.primaryActionHindi) + "\",";
    json += "\"secondaryTip\":\"" + String(eval.secondaryTip) + "\",";
    json += "\"colorCode\":\"" + String(eval.colorCode) + "\",";
    json += "\"safeTempMax\":" + String(prof.safeTempMax, 1) + ",";
    json += "\"safeHumidityMax\":" + String(prof.safeHumidityMax, 1) + ",";
    json += "\"criticalHumidity\":" + String(prof.criticalHumidity, 1) + ",";
    json += "\"bmp280Detected\":" + String(isBmpDetected ? "true" : "false") + ",";
    json += "\"dht11Detected\":" + String(isDhtDetected ? "true" : "false") + ",";
    json += "\"oledDetected\":" + String(isOledDetected ? "true" : "false");
    json += "}";

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
}

// JSON API: Change current produce or simulated inputs
void handleApiSetProduce() {
    if (server.hasArg("produce")) {
        currentProduce = riskAI.parseProduce(server.arg("produce"));
    }
    if (server.hasArg("days")) {
        storagePeriodDays = server.arg("days").toInt();
    }
    if (server.hasArg("temp")) {
        currentTemperature = server.arg("temp").toFloat();
    }
    if (server.hasArg("humidity")) {
        currentHumidity = server.arg("humidity").toFloat();
    }

    lastOledUpdate = 0; // Trigger immediate OLED redraw
    Serial.print("[HTTP] Produce switched to: ");
    Serial.println(riskAI.getProduceName(currentProduce));

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", "{\"status\":\"ok\"}");
}

// JSON API: Return 24-sample historical record
void handleApiHistory() {
    String json = "{\"history\":[";
    for (int i = 0; i < historyCount; i++) {
        int idx = (historyIndex - historyCount + i + HISTORY_SIZE) % HISTORY_SIZE;
        if (i > 0) json += ",";
        json += "{\"temp\":" + String(history[idx].temp, 1) + ",";
        json += "\"hum\":" + String(history[idx].hum, 1) + ",";
        json += "\"risk\":" + String(history[idx].risk) + "}";
    }
    json += "]}";

    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
}

// Embedded Dashboard Fallback / Landing Page
void handleRoot() {
    StorageAssessment eval = riskAI.evaluate(currentProduce, currentTemperature, currentHumidity, storagePeriodDays);
    const ProduceProfile& prof = riskAI.getProfile(currentProduce);

    String html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1'>";
    html += "<title>Smart Storage & Quality Protection System</title>";
    html += "<style>";
    html += "body{font-family:sans-serif;background:#0c131a;color:#e2e8f0;margin:0;padding:20px;text-align:center}";
    html += ".card{background:#1a232f;border-radius:16px;max-width:540px;margin:20px auto;padding:24px;border:1px solid #334155;box-shadow:0 8px 32px rgba(0,0,0,0.4)}";
    html += ".badge{display:inline-block;padding:8px 20px;border-radius:30px;font-size:1.2rem;font-weight:bold;margin:15px 0;}";
    html += ".safe{background:#10b981;color:#fff}.warning{background:#f59e0b;color:#000}.spoilage{background:#ef4444;color:#fff}";
    html += ".rec{font-size:1.3rem;font-weight:600;color:#f8fafc;background:#0f172a;padding:16px;border-radius:12px;margin:20px 0;border-left:5px solid #10b981}";
    html += "table{width:100%;margin-top:20px;border-collapse:collapse;text-align:left}";
    html += "td,th{padding:10px;border-bottom:1px solid #334155}th{color:#94a3b8}";
    html += "</style></head><body>";
    html += "<div class='card'>";
    html += "<h2>🌾 Smart Storage & Quality Protection</h2>";
    html += "<p style='color:#94a3b8'>ESP32-S3 Storage Risk AI (BMP280 + DHT11 + SSD1306)</p>";
    
    // Risk Badge
    String badgeClass = (eval.riskLevel == RISK_SAFE) ? "safe" : ((eval.riskLevel == RISK_WARNING) ? "warning" : "spoilage");
    html += "<div class='badge " + badgeClass + "'>" + String(eval.statusText) + "</div>";
    
    // AI Suggestion
    html += "<div class='rec'>💡 " + String(eval.primaryAction) + "</div>";
    
    // Produce Storage Record Table
    html += "<h3>📊 Produce Storage Record</h3>";
    html += "<table>";
    html += "<tr><th>Parameter</th><th>Value</th></tr>";
    html += "<tr><td>Produce</td><td>" + String(prof.icon) + " " + String(prof.name) + " (" + String(prof.hindiName) + ")</td></tr>";
    html += "<tr><td>Temperature (BMP280)</td><td>" + String(eval.temperature, 1) + " °C</td></tr>";
    html += "<tr><td>Humidity (DHT11)</td><td>" + String(eval.humidity, 1) + " %</td></tr>";
    html += "<tr><td>Pressure (BMP280)</td><td>" + String(currentPressure, 1) + " hPa</td></tr>";
    html += "<tr><td>Storage period</td><td>" + String(eval.storageDays) + " days</td></tr>";
    html += "<tr><td>Dew Point</td><td>" + String(eval.dewPoint, 1) + " °C</td></tr>";
    html += "<tr><td>Risk Assessment</td><td style='color:" + String(eval.colorCode) + ";font-weight:bold'>" + String(eval.statusText) + " (" + String(eval.riskScore, 0) + "%)</td></tr>";
    html += "</table>";

    html += "<div style='margin-top:24px'><p style='color:#64748b;font-size:0.9rem'>Connect to Full Web Dashboard for live charts, multi-produce switching & voice guidance.</p></div>";
    html += "</div></body></html>";

    server.send(200, "text/html", html);
}

void setup() {
    Serial.begin(115200);
    delay(1000);
    Serial.println("\n=======================================================");
    Serial.println("  Smart Storage & Quality Protection System (ESP32-S3)  ");
    Serial.println("  Sensors: BMP280 (Temp/Press) + DHT11 (Humidity)       ");
    Serial.println("  Display: 4-Pin SSD1306 OLED (I2C SDA:8, SCL:9)        ");
    Serial.println("=======================================================");

    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(AUX_LED_PIN, OUTPUT);
    digitalWrite(AUX_LED_PIN, LOW);
    noTone(BUZZER_PIN);

    // 1. Initialize Shared I2C Bus on GPIO 8 (SDA) and GPIO 9 (SCL)
    Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);
    Serial.println("[I2C] Initialized SDA: GPIO 8, SCL: GPIO 9");

    // 2. Initialize 4-Pin SSD1306 OLED Display (0.96", 128x64)
    if (display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR)) {
        isOledDetected = true;
        Serial.println("[OLED] 4-Pin SSD1306 Display Detected at 0x3C");
        display.clearDisplay();
        display.setTextSize(1);
        display.setTextColor(SSD1306_WHITE);
        display.setCursor(10, 15);
        display.println("Smart Storage AI");
        display.setCursor(10, 32);
        display.println("ESP32-S3 Booting...");
        display.display();
        delay(1200);
    } else {
        Serial.println("[OLED] Display not detected at 0x3C (Running headless)");
    }

    // 3. Initialize BMP280 (High-Precision Temperature & Pressure)
    if (bmp.begin(BMP280_I2C_ADDR)) {
        isBmpDetected = true;
        Serial.println("[BMP280] Temperature Sensor Detected at 0x76");
        bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                        Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                        Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                        Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                        Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */
    } else if (bmp.begin(0x77)) {
        isBmpDetected = true;
        Serial.println("[BMP280] Temperature Sensor Detected at alternate address 0x77");
    } else {
        Serial.println("[BMP280] Sensor not found! Enabling smooth physics simulation fallback.");
    }

    // 4. Initialize DHT11 (Relative Humidity Sensor)
    dht.begin();
    float testH = dht.readHumidity();
    if (!isnan(testH)) {
        isDhtDetected = true;
        Serial.print("[DHT11] Humidity Sensor Active. Initial RH: ");
        Serial.print(testH);
        Serial.println("%");
    } else {
        Serial.println("[DHT11] Sensor initializing or not connected (Simulation fallback enabled)");
    }

    // 5. Initialize Wi-Fi Access Point for standalone field operations
    WiFi.mode(WIFI_AP_STA);
    WiFi.softAP(AP_SSID, AP_PASS);
    IPAddress apIP = WiFi.softAPIP();
    Serial.print("[WiFi] Access Point Active. SSID: ");
    Serial.println(AP_SSID);
    Serial.print("[WiFi] Connect smartphone to AP. IP: http://");
    Serial.println(apIP);

    // Connect to Station if configured
    if (strlen(STA_SSID) > 0) {
        WiFi.begin(STA_SSID, STA_PASS);
        Serial.print("[WiFi] Connecting to Station: ");
        Serial.println(STA_SSID);
    }

    // 6. Configure Web Server REST Endpoints
    server.on("/", HTTP_GET, handleRoot);
    server.on("/api/status", HTTP_GET, handleApiStatus);
    server.on("/api/set-produce", HTTP_GET, handleApiSetProduce);
    server.on("/api/set-produce", HTTP_POST, handleApiSetProduce);
    server.on("/api/history", HTTP_GET, handleApiHistory);
    server.begin();
    Serial.println("[HTTP] Web Server Started. REST Endpoints Active.");
}

// WebSerial and USB Telemetry stream (1-second interval)
unsigned long lastSerialTelemetry = 0;

void handleSerialCommunication() {
    unsigned long now = millis();
    
    // 1. Output clean JSON telemetry stream every 1000ms for WebSerial / PC Dashboard
    if (now - lastSerialTelemetry >= 1000) {
        lastSerialTelemetry = now;
        StorageAssessment eval = riskAI.evaluate(currentProduce, currentTemperature, currentHumidity, storagePeriodDays);
        const ProduceProfile& prof = riskAI.getProfile(currentProduce);

        Serial.print("TELEMETRY:{");
        Serial.print("\"produceId\":\""); Serial.print(prof.id); Serial.print("\",");
        Serial.print("\"produceName\":\""); Serial.print(prof.name); Serial.print("\",");
        Serial.print("\"produceHindi\":\""); Serial.print(prof.hindiName); Serial.print("\",");
        Serial.print("\"produceIcon\":\""); Serial.print(prof.icon); Serial.print("\",");
        Serial.print("\"temperature\":"); Serial.print(eval.temperature, 1); Serial.print(",");
        Serial.print("\"humidity\":"); Serial.print(eval.humidity, 1); Serial.print(",");
        Serial.print("\"pressure\":"); Serial.print(currentPressure, 1); Serial.print(",");
        Serial.print("\"dewPoint\":"); Serial.print(eval.dewPoint, 1); Serial.print(",");
        Serial.print("\"storageDays\":"); Serial.print(eval.storageDays); Serial.print(",");
        Serial.print("\"riskLevel\":"); Serial.print((int)eval.riskLevel); Serial.print(",");
        Serial.print("\"riskLevelText\":\""); Serial.print(eval.statusText); Serial.print("\",");
        Serial.print("\"riskScore\":"); Serial.print(eval.riskScore, 1); Serial.print(",");
        Serial.print("\"primaryAction\":\""); Serial.print(eval.primaryAction); Serial.print("\",");
        Serial.print("\"safeTempMax\":"); Serial.print(prof.safeTempMax, 1); Serial.print(",");
        Serial.print("\"safeHumidityMax\":"); Serial.print(prof.safeHumidityMax, 1); Serial.print(",");
        Serial.print("\"bmp280Detected\":"); Serial.print(isBmpDetected ? "true" : "false"); Serial.print(",");
        Serial.print("\"dht11Detected\":"); Serial.print(isDhtDetected ? "true" : "false"); Serial.print(",");
        Serial.print("\"deviceOnline\":true");
        Serial.println("}");
    }

    // 2. Process incoming commands from WebSerial or Serial Monitor
    if (Serial.available() > 0) {
        String cmd = Serial.readStringUntil('\n');
        cmd.trim();
        if (cmd.startsWith("SET_PRODUCE:")) {
            String pName = cmd.substring(12);
            currentProduce = riskAI.parseProduce(pName);
            lastOledUpdate = 0; // Trigger OLED redraw immediately
            Serial.print("[CMD] Produce switched to: ");
            Serial.println(riskAI.getProduceName(currentProduce));
        } else if (cmd.startsWith("SET_DAYS:")) {
            storagePeriodDays = cmd.substring(9).toInt();
            lastOledUpdate = 0;
        }
    }
}

void loop() {
    server.handleClient();
    updateSensorReadings();
    handleSerialCommunication();
    recordHistory();
    syncTelemetryToGitHub();
    
    StorageAssessment assessment = riskAI.evaluate(currentProduce, currentTemperature, currentHumidity, storagePeriodDays);
    updateActuators(assessment);
    updateOledDisplay(assessment);
}
