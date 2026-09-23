#ifndef CONFIG_SECRETS_H
#define CONFIG_SECRETS_H

// ==============================================================================
// Smart Storage & Quality Protection System - Internet & GitHub Credentials
// Instructions: Copy this file to "config_secrets.h" and enter your credentials.
// NOTE: "config_secrets.h" is ignored by .gitignore to keep your tokens safe.
// ==============================================================================

// 1. Wi-Fi Station Credentials (Router / Mobile Hotspot for Internet Access)
#define STA_WIFI_SSID       "YOUR_WIFI_SSID"
#define STA_WIFI_PASS       "YOUR_WIFI_PASSWORD"

// 2. Wi-Fi SoftAP Credentials (Direct Offline Smartphone Access in Field)
#define AP_WIFI_SSID        "SmartStorage-ESP32S3"
#define AP_WIFI_PASS        "protectproduce"

// 3. GitHub Account Integration
// The ESP32-S3 pushes live telemetry to your GitHub repository or Gist via HTTPS
#define GITHUB_USERNAME     "Rudrapratap"
#define GITHUB_REPO         "smart-storage-iot-esp32s3"
#define GITHUB_BRANCH       "main"
// GitHub Personal Access Token (PAT) with "repo" or "gist" permission
// Generate at: https://github.com/settings/tokens (classic) or fine-grained tokens
#define GITHUB_TOKEN        "ghp_YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"

// Sync Telemetry to GitHub Repository file (data/telemetry.json) or Gist
#define GITHUB_SYNC_ENABLED true
#define GITHUB_SYNC_INTERVAL_SEC 30   // Sync every 30 seconds to stay within API limits

// 4. (Optional) Free Cloud MQTT Broker (HiveMQ Cloud / EMQX) for Sub-Second Live Streaming
#define MQTT_ENABLED        false
#define MQTT_BROKER         "your-cluster.s1.eu.hivemq.cloud"
#define MQTT_PORT           8883
#define MQTT_USER           "your_mqtt_user"
#define MQTT_PASS           "your_mqtt_pass"
#define MQTT_TOPIC_TELEMETRY "smartstorage/esp32s3/telemetry"
#define MQTT_TOPIC_COMMAND   "smartstorage/esp32s3/command"

#endif // CONFIG_SECRETS_H
