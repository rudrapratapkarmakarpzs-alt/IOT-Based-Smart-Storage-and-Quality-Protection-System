# Smart Storage & Quality Protection System (ESP32-S3 + Storage Risk AI)

An IoT and edge-AI post-harvest preservation system designed specifically for tribal collectors, smallholders, and rural warehouse aggregators (Van Dhan Vikas Kendras) to eliminate post-harvest losses and defend fair market value for forest and agricultural produce.

---

## 🌟 Key Features

1. **Storage Risk AI Engine**:
   - Evaluates micro-climate conditions against produce-specific biological curves.
   - Replaces raw numbers with clear, actionable risk classifications:
     - 🟢 **SAFE**: Optimal storage conditions
     - 🟡 **WARNING**: Micro-climate drift detected
     - 🔴 **SPOILAGE RISK**: Conditions favourable for deterioration — take action
2. **Farmer-Friendly Actionable Guidance**:
   - Plain-language directives:
     - *"Dry the produce before storage."*
     - *"Improve ventilation."*
     - *"Move the produce to a dry storage area."*
3. **Produce Knowledge Base**:
   - Pre-configured profiles for **🌰 Mahua**, **🌱 Tamarind**, **🌾 Paddy**, **🫘 Pulses**, **🌿 Medicinal herbs**, **🌰 Sal seeds**, and **🍯 Honey**.
4. **Produce Storage Record Table**:
   - Live batch monitoring parameters: Produce, Temperature, Humidity, Storage period (days), Dew Point, and Risk Index.
5. **Rural Accessibility & Voice Advisor**:
   - Bilingual support: **English** and **हिन्दी (Hindi)**.
   - One-touch **Text-to-Speech (TTS) Voice Advisor** reading recommendations aloud.
6. **Dual Mode Flexibility**:
   - **Interactive Simulation Mode**: Runs in any modern browser without physical hardware connected.
   - **ESP32-S3 Live Mode**: Streams real sensor telemetry and pushes commands over Wi-Fi SoftAP or local network.

---

## 📁 Repository Structure

```text
IOT Based Smart Storage and Quality Protection System/
├── firmware/
│   ├── SmartStorage_ESP32S3.ino       # Main Arduino sketch (WiFi SoftAP, WebServer, Sensors, Actuators)
│   ├── StorageRiskAI.h                # Storage Risk AI engine header
│   └── StorageRiskAI.cpp              # Inference engine, dew point, and produce matrix
├── dashboard/
│   ├── index.html                     # Professional and responsive web dashboard
│   ├── style.css                      # Modern dark/forest theme, glassmorphism, responsive styles
│   └── app.js                         # Telemetry engine, canvas charts, voice advisor & I18N
├── docs/
│   ├── WIRING_AND_PINOUT.md           # Circuit diagram, ESP32-S3 pin mappings, and BOM (₹1,395 / $16)
│   ├── PRODUCE_STORAGE_GUIDE.md       # Agronomic preservation rules for all 7 produce types
│   └── README.md                      # Complete system setup and operational manual
```

---

## 🚀 Quick Start: Running the Dashboard

### Option A: Local Browser (No Hardware Required)
You can test the entire dashboard immediately in any web browser:
1. Open `dashboard/index.html` in your favorite web browser (Chrome, Edge, Firefox, Safari).
2. Alternatively, start a lightweight local web server:
   ```bash
   # Using Python
   cd "dashboard"
   python -m http.server 3000
   ```
3. Open `http://localhost:3000` in your browser.
4. Try clicking different produce items (e.g., Mahua vs. Honey vs. Sal Seeds) and adjust the humidity and temperature sliders to observe how the **Storage Risk AI Engine** responds!

---

## ⚡ Flashing the ESP32-S3 Firmware

### 1. Requirements
- **Hardware**: ESP32-S3-DevKitC-1 + BMP280 (Temperature & Pressure) + DHT11 (Humidity) + 4-Pin SSD1306 OLED (0.96").
- **Software**: Arduino IDE (version 2.0 or higher) or PlatformIO.

### 2. Arduino IDE Setup
1. In Arduino IDE, open **Settings / Preferences**.
2. Add the ESP32 board URL to **Additional Boards Manager URLs**:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
3. Go to **Boards Manager** -> Search for `esp32` by Espressif -> Install version `2.0.14` or `3.0+`.
4. Select Board: **ESP32S3 Dev Module**.
5. Set Board options:
   - USB CDC On Boot: `Enabled`
   - Flash Size: `8MB` or `16MB` (depending on your board)
   - Partition Scheme: `Default 4MB with SPIFFS`

### 3. Open & Upload
1. Open `firmware/SmartStorage_ESP32S3.ino` in Arduino IDE.
2. Connect your ESP32-S3 board via USB-C.
3. Click **Upload**.
4. Open the Serial Monitor at `115200` baud.

### 4. Connecting in the Field
1. The ESP32-S3 automatically creates a local Wi-Fi Access Point:
   - **SSID**: `SmartStorage-ESP32S3`
   - **Password**: `protectproduce`
2. Connect your smartphone, tablet, or laptop to this Wi-Fi network.
3. Open browser and navigate to:
   ```
   http://192.168.4.1
   ```
4. The dashboard will load directly from the device!

---

## 📊 Produce Storage Record Specifications

| Parameter | Value Example | Field Purpose |
| :--- | :--- | :--- |
| **Produce** | 🌰 Mahua (*महुआ*) | Identifies biological profile & threshold limits |
| **Temperature** | 28.4°C | Monitored micro-climate ambient reading |
| **Humidity** | 64% | Relative humidity inside the storage chamber |
| **Storage period**| 12 days | Days elapsed since harvest/intake |
| **Dew Point** | 21.2°C | Calculated moisture condensation threshold |
| **Risk** | 🟢 Low (Safe) / 🟡 Warning / 🔴 Spoilage | Storage Risk AI composite evaluation |

---

## 🛠️ Hardware Bill of Materials (BOM)

Total cost per storage chamber is approximately **₹1,395 INR (~$16 USD)**. See detailed schematics and assembly steps in [docs/WIRING_AND_PINOUT.md](file:///d:/RUDRA%20WORKSHOP/IOT%20Based%20Smart%20Storage%20and%20Quality%20Protection%20System/docs/WIRING_AND_PINOUT.md).
