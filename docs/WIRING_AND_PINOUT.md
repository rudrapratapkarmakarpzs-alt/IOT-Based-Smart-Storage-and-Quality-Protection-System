# ESP32-S3 Hardware Wiring & Pinout Guide

**Project**: Smart Storage & Quality Protection System for Tribal & Agricultural Produce  
**Brain**: ESP32-S3 Microcontroller with Storage Risk AI Engine  
**Hardware Sensors**: 
- 🌡️ **BMP280**: High-Precision Temperature & Atmospheric Pressure (I2C)
- 💧 **DHT11**: Relative Humidity Sensor (Digital Single-Wire)
- 🖥️ **SSD1306 OLED (0.96")**: 4-Pin Standalone Storage Status Display (I2C)
- 🔔 **Piezo Buzzer & LED**: Audio-Visual Spoilage Risk Actuators

---

## 1. System Pinout Specification

| Component | Pin Function | ESP32-S3 GPIO / Rail | Notes |
| :--- | :--- | :--- | :--- |
| **BMP280 Sensor**<br>*(Temperature & Pressure)* | **VCC** | `3.3V` | High-precision temp sensor (±0.5°C) |
| | **GND** | `GND` | Common Ground |
| | **SCL** | `GPIO 9` (Shared I2C Clock) | Shared with OLED display |
| | **SDA** | `GPIO 8` (Shared I2C Data) | Shared with OLED display (I2C Addr: 0x76 or 0x77) |
| **DHT11 Sensor**<br>*(Relative Humidity)* | **VCC** (Pin 1) | `3.3V` / `5V` | Power supply |
| | **DATA** (Pin 2)| `GPIO 4` | Digital Humidity reading (10kΩ pull-up to 3.3V) |
| | **NC** (Pin 3)  | *Not Connected* | Leave disconnected |
| | **GND** (Pin 4) | `GND` | Common Ground |
| **SSD1306 OLED (0.96")**<br>*(4-Pin I2C Display)* | **GND** (Pin 1) | `GND` | Ground |
| | **VCC** (Pin 2) | `3.3V` | Power (3.3V) |
| | **SCL** (Pin 3) | `GPIO 9` (Shared I2C Clock) | Shared with BMP280 |
| | **SDA** (Pin 4) | `GPIO 8` (Shared I2C Data) | Shared with BMP280 (I2C Addr: 0x3C) |
| **Active Buzzer** | **Positive (+)**| `GPIO 5` | Audible alert on `SPOILAGE RISK` |
| | **Negative (-)**| `GND` | Common Ground |
| **Status Indicator** | **RGB Data** | `GPIO 48` | Onboard WS2812 RGB LED (ESP32-S3 DevKit) |
| **Auxiliary LED** | **Anode (+)** | `GPIO 2` | 220Ω series resistor (Safe: Solid, Warning: 1Hz, Spoilage: 4Hz) |
| | **Cathode (-)** | `GND` | Common Ground |

---

## 2. Complete Circuit Schematic Diagram (ASCII)

Both the **BMP280** and the **4-Pin SSD1306 OLED** share the same hardware I2C bus on **GPIO 8 (SDA)** and **GPIO 9 (SCL)**, each having distinct I2C addresses (`0x76` for BMP280, `0x3C` for OLED).

```text
                               +---------------------------------------+
                               |            ESP32-S3 DevKit            |
                               |                                       |
                   +-----------o 3.3V                                  |
                   |           |                                       |
                   |  +--------o GND                                   |
                   |  |        |                                       |
                   |  |  +-----o GPIO 9 (I2C SCL)                      |
                   |  |  |     |                                       |
                   |  |  |  +--o GPIO 8 (I2C SDA)                      |
                   |  |  |  |  |                                       |
                   |  |  |  |  o GPIO 4 --------------------------+    |
                   |  |  |  |  |                                  |    |
                   |  |  |  |  o GPIO 5 (Buzzer) ----+             |    |
                   |  |  |  |  |                     |             |    |
                   |  |  |  |  o GPIO 2 (LED) ----+  |             |    |
                   |  |  |  |  +------------------|--|-------------|----+
                   |  |  |  |                     |  |             |
===================+==|==|==|=====================|==|=============|=========
3.3V POWER BUS     |  |  |  |                     |  |             |
===================+==|==|==|=====================|==|=============|=========
GND GROUND BUS     |  |  |  |                     |  |             |
======================+==|==|=====================|==|=============|=========
SCL BUS (GPIO 9)         |  |                     |  |             |
=========================+==|=====================|==|=============|=========
SDA BUS (GPIO 8)            |                     |  |             |
============================+=====================|==|=============|=========
                                                  |  |             |
                                                  |  |             |
   +-----------------------+                      |  |             |
   |   SSD1306 OLED (4-Pin)|                      |  |             |
   |   +---------------+   |                      |  |             |
   |   |  128x64 SCREEN|   |                      |  |             |
   |   +---------------+   |                      |  |             |
   |  [GND] [VCC] [SCL] [SDA]                     |  |             |
   +---|-----|-----|-----|-+                      |  |             |
       |     |     |     |                        |  |             |
       v     v     v     v                        |  |             |
      GND   3.3V  SCL   SDA                       |  |             |
                                                  |  |             |
   +-----------------------+                      |  |             |
   |     BMP280 Sensor     |                      |  |             |
   | (High-Precision Temp) |                      |  |             |
   |  [VCC] [GND] [SCL] [SDA]                     |  |             |
   +---|-----|-----|-----|-+                      |  |             |
       |     |     |     |                        |  |             |
       v     v     v     v                        |  |             |
      3.3V  GND   SCL   SDA                       |  |             |
                                                  |  |             |
   +-----------------------+                      |  |             |
   |     DHT11 Sensor      |                      |  |             |
   |  (Relative Humidity)  |                      |  |             |
   |   [1]   [2]   [3] [4] |                      |  |             |
   |   VCC  DATA   NC  GND |                      |  |             |
   +---|------|---------|--+                      |  |             |
       |      |         |                         |  |             |
       |      +---------|-------------------------|--|-------------+
       |      |         |                         |  |     (10k Pull-up to 3.3V)
       v      v         v                         |  |
      3.3V  GPIO 4     GND                        |  |
                                                  |  |
                                                  v  v
                                              +---------+      +-----------+
                                              | LED (2) |      | Buzzer(5) |
                                              | +  220Ω |      |  +     -  |
                                              +-|----|--+      +--|-----|--+
                                                |    |            |     |
                                              GPIO2 GND         GPIO5  GND
```

---

## 3. Sensor Role Allocation in Storage Risk AI

| Measurement | Primary Sensor | Why Selected | Fallback / Role |
| :--- | :--- | :--- | :--- |
| **Temperature (°C)** | **BMP280** | High precision (±0.5°C), low thermal drift, factory calibrated. | Used by Storage Risk AI for biological threshold checks and dew point calculation. |
| **Humidity (% RH)** | **DHT11** | Dedicated capacitive humidity sensing element (20% – 90% RH range). | Used by Storage Risk AI to evaluate mold, moisture equilibrium, and fermentation triggers. |
| **Pressure (hPa)** | **BMP280** | Barometric pressure monitoring (300 – 1100 hPa). | Useful for early weather & monsoon depression alerts (falling pressure indicates humid rain fronts). |
| **Local Display** | **SSD1306 (4-Pin)** | High contrast 0.96" OLED readable under direct sunlight. | Displays produce name, Risk Badge (🟢 SAFE, 🟡 WARN, 🔴 RISK), and action without needing a phone. |

---

## 4. SSD1306 4-Pin OLED Layout & I2C Bus Details

A standard 0.96-inch monochrome I2C OLED breakout has exactly **4 pins**:
1. **GND**: Connects to ESP32-S3 Ground.
2. **VCC**: Connects to ESP32-S3 3.3V power pin.
3. **SCL**: Connects to ESP32-S3 `GPIO 9` (Serial Clock).
4. **SDA**: Connects to ESP32-S3 `GPIO 8` (Serial Data).

> [!TIP]
> **No I2C Bus Conflict**:
> The BMP280 uses I2C address `0x76` (or `0x77`), while the SSD1306 OLED uses `0x3C` (or `0x3D`). Because their addresses are completely distinct, you can connect both SCL pins together to `GPIO 9` and both SDA pins together to `GPIO 8` with zero conflicts.

---

## 5. Bill of Materials (BOM) & Cost Breakdown (INR)

| Item | Component | Specification | Qty | Est. Cost (INR) |
| :--- | :--- | :--- | :---: | :---: |
| 1 | Microcontroller | ESP32-S3-WROOM-1 / DevKit-C | 1 | ₹420 |
| 2 | Temperature Sensor | **BMP280** (I2C Temp & Pressure) | 1 | ₹120 |
| 3 | Humidity Sensor | **DHT11** (Digital Relative Humidity) | 1 | ₹90 |
| 4 | Display | **0.96" SSD1306 OLED (4-Pin I2C)** | 1 | ₹170 |
| 5 | Audio Indicator | 5V Active Piezo Buzzer | 1 | ₹20 |
| 6 | Visual Indicator | 5mm LED + 220Ω Resistor | 1 | ₹5 |
| 7 | Power Management | TP4056 + 18650 Battery Holder | 1 | ₹90 |
| 8 | Rechargeable Battery | 18650 3.7V 2600mAh Li-ion | 1 | ₹160 |
| 9 | Solar Cell *(Optional)*| 5V 2W Mini Solar Panel | 1 | ₹190 |
| 10 | Enclosure & Wires | Perforated storage vent box + Jumper wires | 1 | ₹100 |
| **Total** | **Complete Field System** | | | **₹1,365 (~$16 USD)** |

---

## 6. Testing & Calibration Checklist

1. **I2C Address Scanner**:
   - Run an I2C scanner sketch. You should detect two addresses:
     - `0x3C`: SSD1306 OLED Display
     - `0x76` (or `0x77`): BMP280 Temperature Sensor
2. **DHT11 Pull-up Resistor**:
   - Most DHT11 modules sold on blue PCB breakouts already include an onboard 10kΩ pull-up resistor between VCC and DATA. If using a standalone 4-pin bare DHT11 sensor, add an external 4.7kΩ–10kΩ resistor between Pin 1 (VCC) and Pin 2 (DATA).
3. **Display Output**:
   - When powered on, the OLED immediately displays the produce name (e.g. `MAHUA`), current Temperature, Humidity, and the large Risk status:
     - `[ SAFE ]`
     - `[ WARNING ]`
     - `[ SPOILAGE ]`
