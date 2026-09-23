# 🌐 Connect ESP32-S3 to GitHub & Access via Internet

This guide explains how to connect your **ESP32-S3 Smart Storage System** to your GitHub account (`Rudrapratap`) so you can access real-time storage telemetry, AI risk evaluation, and produce alerts from anywhere in the world over the Internet.

---

## 🏗️ Architecture Overview

```
 [ESP32-S3 Device]                       [GitHub Cloud]                      [Your Smartphone/PC]
+-----------------------+              +-----------------------+           +-----------------------+
|  BMP280 Temp/Pressure |              |  GitHub Repository    |           |  GitHub Pages         |
|  DHT11 Humidity       | ---HTTPS---> |  data/telemetry.json  | <---CORS- |  https://<user>.      |
|  Storage Risk AI      |   (PUT)      |                       |  (Fetch)  |  github.io/<repo>/    |
|  SSD1306 Display      |              |  (GitHub API Token)   |           |  (Live Cloud Mode)    |
+-----------------------+              +-----------------------+           +-----------------------+
```

1. **GitHub Pages Web Dashboard**:
   - The interactive web dashboard is hosted for free on GitHub Pages.
   - Accessible worldwide via `https://<username>.github.io/<repo-name>/`.
2. **ESP32-S3 Internet Telemetry**:
   - The ESP32-S3 connects to your Wi-Fi router or mobile hotspot.
   - Every 30 seconds, it pushes encrypted telemetry (Temp, Humidity, AI Risk, Advice) over secure HTTPS directly to `data/telemetry.json` in your repository.
3. **Live Sync**:
   - The dashboard on GitHub Pages automatically reads `data/telemetry.json` from `raw.githubusercontent.com` with real-time updates and zero CORS barriers.

---

## 🚀 Step 1: Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new) in your browser.
2. Enter **Repository name**: e.g. `smart-storage-iot-esp32s3` (or any name you prefer).
3. Set visibility to **Public** (required for free GitHub Pages).
4. Do **NOT** check "Initialize this repository with a README" (we already have all files ready locally).
5. Click **Create repository**.

---

## 📤 Step 2: Push Local Code to GitHub

Open PowerShell in this project folder and run:

```powershell
# 1. Initialize git and switch to main branch
git init
git branch -M main

# 2. Add all files and make the initial commit
git add .
git commit -m "Initial commit: ESP32-S3 Smart Storage AI, Dashboard & GitHub Sync"

# 3. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/Rudrapratap/smart-storage-iot-esp32s3.git

# 4. Push code to GitHub
git push -u origin main
```

---

## 🌍 Step 3: Enable GitHub Pages (Instant Hosting)

1. On your GitHub repository page, click **Settings** (gear icon on the top tab).
2. On the left sidebar, click **Pages** (under *Code and automation*).
3. Under **Build and deployment** > **Source**:
   - Select **Deploy from a branch**.
   - Branch: Select **`main`** and folder: **`/ (root)`**.
4. Click **Save**.
5. Wait 30–60 seconds. GitHub Pages will provide your live URL:
   ```
   https://Rudrapratap.github.io/smart-storage-iot-esp32s3/
   ```
   *Opening this link automatically redirects to your beautiful live Smart Storage dashboard!*

---

## 🔑 Step 4: Generate a GitHub Personal Access Token for ESP32

To allow your ESP32-S3 to securely write telemetry to `data/telemetry.json`:

1. Go to [GitHub Token Settings](https://github.com/settings/tokens).
2. Click **Generate new token** > **Generate new token (classic)**.
3. Note: `ESP32-S3 Smart Storage Device`.
4. Expiration: Choose `No expiration` or `90 days`.
5. Under Select Scopes, check:
   - ✅ **`repo`** (Full control of private repositories / write access to repository files).
6. Click **Generate token** at the bottom.
7. **Copy your token** (it starts with `ghp_...`). *Save it somewhere safe!*

---

## ⚙️ Step 5: Configure ESP32-S3 Credentials

1. In the `firmware/SmartStorage_ESP32S3/` folder, copy `config_secrets.example.h` and rename the copy to `config_secrets.h`.
2. Fill in your details:

```cpp
// Wi-Fi Station Credentials (Router or Phone Hotspot)
#define STA_WIFI_SSID       "Your_Home_WiFi_Or_Hotspot"
#define STA_WIFI_PASS       "Your_WiFi_Password"

// GitHub Account Integration
#define GITHUB_USERNAME     "Rudrapratap"
#define GITHUB_REPO         "smart-storage-iot-esp32s3"
#define GITHUB_BRANCH       "main"
#define GITHUB_TOKEN        "ghp_YOUR_COPIED_TOKEN_HERE"

// Enable Syncing
#define GITHUB_SYNC_ENABLED true
#define GITHUB_SYNC_INTERVAL_SEC 30
```

> [!NOTE]
> `config_secrets.h` is listed in `.gitignore`, so your Wi-Fi password and GitHub token will **never** be exposed publicly on GitHub!

---

## 🔌 Step 6: Flash the ESP32-S3 Firmware

1. Open `firmware/SmartStorage_ESP32S3/SmartStorage_ESP32S3.ino` in the Arduino IDE.
2. Select Board: **ESP32S3 Dev Module**.
3. Plug in your ESP32-S3 via USB and click **Upload**.
4. Open the Serial Monitor (`115200` baud):
   - You will see:
     ```
     [WiFi] Access Point Active. SSID: SmartStorage-ESP32S3
     [WiFi] Connecting to Station: Your_Home_WiFi...
     [WiFi] Connected! IP: 192.168.1.xxx
     [GitHub] Telemetry synced to repository successfully!
     ```
   - On the 0.96" SSD1306 OLED display, notice the top right badge changes to:
     - `[IP]` when connected to router.
     - `[GH]` when successfully pushing telemetry to GitHub!

---

## 📱 Step 7: View Your Storage from Anywhere in the World

1. Open your GitHub Pages link on your phone, tablet, or PC:
   ```
   https://Rudrapratap.github.io/smart-storage-iot-esp32s3/
   ```
2. The dashboard detects it is running on GitHub Pages and automatically switches to **GitHub Cloud Sync** mode.
3. Watch the gauges, AI Risk evaluations, and 24-hour charts update automatically as your ESP32-S3 protects your crops!
