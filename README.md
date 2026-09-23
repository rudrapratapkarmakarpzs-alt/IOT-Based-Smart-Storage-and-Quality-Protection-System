# Smart Storage & Quality Protection System (ESP32-S3 + Storage Risk AI)

An IoT and edge-AI post-harvest preservation system designed specifically for tribal collectors, smallholders, and rural warehouse aggregators (Van Dhan Vikas Kendras) to eliminate post-harvest losses and defend fair market value for forest and agricultural produce:
- 🌰 **Mahua**
- 🌱 **Tamarind**
- 🌾 **Paddy**
- 🫘 **Pulses**
- 🌿 **Medicinal / Forest herbs**
- 🌰 **Sal seeds**
- 🍯 **Honey**

---

## 🌟 Key Highlights

1. **Storage Risk AI Engine**:
   - Converts raw sensor values into plain, actionable advice:
     - 🟢 **SAFE**: Storage condition normal
     - 🟡 **WARNING**: High humidity / temperature drift detected
     - 🔴 **SPOILAGE RISK**: Conditions favourable for deterioration — take action
2. **Actionable Tribal Advisory**:
   - *"Dry the produce before storage."*
   - *"Improve ventilation."*
   - *"Move the produce to a dry storage area."*
3. **Produce Storage Record Table**:
   - Displays Produce, Temperature, Humidity, Storage period (days), Dew Point, and Risk index.
4. **Professional & Simple Dashboard**:
   - Earthy modern agri-tech dark aesthetic, microclimate gauges, 24-hour trends, bilingual (English & हिन्दी), and Text-to-Speech audio advisor.
5. **ESP32-S3 Firmware & Internet Cloud Sync**:
   - Direct Wi-Fi SoftAP offline mode (`SmartStorage-ESP32S3`) for rural field use.
   - **GitHub Cloud Sync**: Automatically transmits live encrypted telemetry over HTTPS to your GitHub repository (`data/telemetry.json`).
   - High-precision BMP280 temperature/pressure + DHT11 humidity drivers, 4-pin SSD1306 OLED live display, and LED/piezo warning buzzer.
6. **Global Internet Access via GitHub Pages**:
   - Hosted with 1-click on free GitHub Pages (`https://<username>.github.io/<repo>/`).
   - Monitor storage silos, warehouses, or grain bags in real time from any smartphone anywhere in the world.

---

## 📁 Project Structure

- [`firmware/`](firmware/): Arduino sketches, Storage Risk AI C++ engine (`StorageRiskAI.h` / `StorageRiskAI.cpp`), and secrets template (`config_secrets.example.h`).
- [`dashboard/`](dashboard/): Responsive web dashboard (`index.html`, `style.css`, `app.js`).
- [`data/`](data/): Real-time IoT telemetry storage (`telemetry.json`).
- [`docs/`](docs/): 
  - [**GitHub Pages & Internet Setup Guide**](docs/GITHUB_PAGES_AND_INTERNET_SETUP.md) 🌐
  - [Hardware Wiring & Pinout Guide](docs/WIRING_AND_PINOUT.md) 🔌
  - [Agronomic Produce Storage Guide](docs/PRODUCE_STORAGE_GUIDE.md) 🌾

