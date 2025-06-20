# Integración con Arduino IoT - Electricautomaticchile

## 🔌 Arquitectura de Dispositivos IoT

La plataforma integra dispositivos Arduino especializados para el control y monitoreo de la red eléctrica en tiempo real. Cada dispositivo funciona como un nodo inteligente con capacidades de medición, control y comunicación.

## 🛠️ Hardware Requerido

### Componentes Principal del Dispositivo

```
Arduino Uno R3/ESP32 (Procesador principal)
├── ESP32-WROOM-32 (WiFi/Bluetooth)
├── SIM800L (Comunicación GSM/GPRS backup)
├── GPS NEO-6M (Localización anti-fraude)
├── ACS712 (Sensor de corriente)
├── ZMPT101B (Sensor de voltaje)
├── Relé 30A (Control de corte/reconexión)
├── SD Card Module (Almacenamiento local)
├── DS3231 (RTC - Timestamp preciso)
├── LCD 16x2 (Display local)
└── Fuente 12V/2A (Alimentación)
```

### Especificaciones Técnicas

- **Procesador**: ESP32 240MHz dual-core
- **Memoria**: 320KB RAM, 4MB Flash
- **Comunicación**: WiFi 802.11n, GSM 2G/3G, Bluetooth 4.2
- **Sensores**: Corriente (0-30A), Voltaje (0-250V), GPS
- **Precisión**: ±1% corriente, ±0.5% voltaje
- **Rango de Temperatura**: -20°C a +70°C
- **Certificación**: IP65 (resistente al agua)

## 📡 Protocolo de Comunicación

### Estructura de Datos IoT

```typescript
interface IoTDataPacket {
  device_id: string; // ID único del dispositivo
  timestamp: number; // Unix timestamp
  gps_coordinates: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
  };
  electrical_measurements: {
    voltage: number; // Voltios (V)
    current: number; // Amperios (A)
    power: number; // Watts (W)
    energy: number; // kWh acumulado
    frequency: number; // Hz
    power_factor: number; // Factor de potencia
  };
  device_status: {
    relay_state: "ON" | "OFF";
    signal_strength: number; // dBm
    battery_level: number; // %
    temperature: number; // °C
    last_maintenance: number; // Unix timestamp
  };
  security: {
    checksum: string; // Hash MD5 del paquete
    encrypted: boolean;
    signature: string; // Firma digital del dispositivo
  };
}
```

### Protocolo MQTT Seguro

```typescript
// Configuración MQTT con TLS
const mqttConfig = {
  broker: "mqtts://iot.electricautomaticchile.cl:8883",
  clientId: `device_${deviceId}`,
  username: deviceId,
  password: deviceCertificate,
  clean: true,
  connectTimeout: 30000,
  reconnectPeriod: 5000,
  topics: {
    telemetry: `devices/${deviceId}/telemetry`,
    commands: `devices/${deviceId}/commands`,
    status: `devices/${deviceId}/status`,
    alerts: `devices/${deviceId}/alerts`,
  },
};
```

## 🔐 Seguridad del Dispositivo

### Autenticación por Certificado

```cpp
// Código Arduino - Autenticación
#include <WiFiClientSecure.h>
#include <PubSubClient.h>

const char* device_cert = R"(
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAL+...
-----END CERTIFICATE-----
)";

const char* device_key = R"(
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w...
-----END PRIVATE KEY-----
)";

const char* ca_cert = R"(
-----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgITBm...
-----END CERTIFICATE-----
)";

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);

void setupSecureConnection() {
  wifiClient.setCACert(ca_cert);
  wifiClient.setCertificate(device_cert);
  wifiClient.setPrivateKey(device_key);

  mqttClient.setServer("iot.electricautomaticchile.cl", 8883);
  mqttClient.setCallback(onMqttMessage);
}
```

### Validación GPS Anti-Fraude

```cpp
// Validación de movimiento sospechoso
struct GPSLocation {
  float latitude;
  float longitude;
  unsigned long timestamp;
};

GPSLocation lastValidLocation;

bool validateGPSMovement(float lat, float lon) {
  float distance = calculateDistance(
    lastValidLocation.latitude,
    lastValidLocation.longitude,
    lat, lon
  );

  unsigned long timeDiff = millis() - lastValidLocation.timestamp;

  // Si se movió más de 50 metros en menos de 5 minutos
  if (distance > 50.0 && timeDiff < 300000) {
    sendFraudAlert("SUSPICIOUS_MOVEMENT", distance, timeDiff);
    return false;
  }

  return true;
}
```

## ⚡ Control de Corte y Reconexión

### Lógica de Control del Relé

```cpp
#include <EEPROM.h>

const int RELAY_PIN = 12;
const int RELAY_STATE_ADDR = 0;

enum ServiceState {
  SERVICE_ON = 1,
  SERVICE_OFF = 0,
  SERVICE_MAINTENANCE = 2
};

void controlElectricalService(ServiceState state) {
  switch(state) {
    case SERVICE_ON:
      digitalWrite(RELAY_PIN, HIGH);
      EEPROM.write(RELAY_STATE_ADDR, SERVICE_ON);
      logAction("SERVICE_RESTORED");
      break;

    case SERVICE_OFF:
      digitalWrite(RELAY_PIN, LOW);
      EEPROM.write(RELAY_STATE_ADDR, SERVICE_OFF);
      logAction("SERVICE_CUT");
      break;

    case SERVICE_MAINTENANCE:
      // Modo mantenimiento - no cambiar estado físico
      logAction("MAINTENANCE_MODE");
      break;
  }

  EEPROM.commit();
  sendStatusUpdate();
}
```

### Comandos Remotos Seguros

```typescript
// Backend - Envío de comandos al dispositivo
export class IoTDeviceController {
  async sendSecureCommand(deviceId: string, command: IoTCommand) {
    // Validar permisos del usuario
    await this.validateUserPermissions(deviceId, command.type);

    // Encriptar comando
    const encryptedCommand = this.encryptCommand(command, deviceId);

    // Agregar timestamp y firma
    const signedCommand = {
      ...encryptedCommand,
      timestamp: Date.now(),
      signature: this.signCommand(encryptedCommand),
    };

    // Enviar vía MQTT
    await this.mqttClient.publish(
      `devices/${deviceId}/commands`,
      JSON.stringify(signedCommand)
    );

    // Log de auditoría
    await this.logCommand(deviceId, command);
  }

  private encryptCommand(command: IoTCommand, deviceId: string): any {
    const deviceKey = this.getDeviceKey(deviceId);
    const cipher = crypto.createCipher("aes-256-gcm", deviceKey);

    let encrypted = cipher.update(JSON.stringify(command), "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
      encrypted_data: encrypted,
      auth_tag: cipher.getAuthTag().toString("hex"),
      encryption_method: "aes-256-gcm",
    };
  }
}
```

## 📊 Mediciones y Telemetría

### Algoritmo de Medición Precisa

```cpp
#include <ACS712.h>
#include <ZMPT101B.h>

ACS712 currentSensor(ACS712_30A, A0);
ZMPT101B voltageSensor(A1);

struct ElectricalMeasurement {
  float voltage;
  float current;
  float power;
  float energy;
  float frequency;
  float powerFactor;
  unsigned long timestamp;
};

ElectricalMeasurement takeMeasurement() {
  ElectricalMeasurement measurement;

  // Muestreo múltiple para mayor precisión
  float voltageSum = 0, currentSum = 0;
  int samples = 100;

  for(int i = 0; i < samples; i++) {
    voltageSum += voltageSensor.getRmsVoltage();
    currentSum += currentSensor.getCurrentAC();
    delay(1);
  }

  measurement.voltage = voltageSum / samples;
  measurement.current = currentSum / samples;
  measurement.power = measurement.voltage * measurement.current;
  measurement.timestamp = rtc.now().unixtime();

  // Calcular energía acumulada
  static float totalEnergy = 0;
  static unsigned long lastMeasurement = 0;

  if(lastMeasurement > 0) {
    float timeDiff = (measurement.timestamp - lastMeasurement) / 3600.0; // horas
    totalEnergy += measurement.power * timeDiff / 1000.0; // kWh
  }

  measurement.energy = totalEnergy;
  lastMeasurement = measurement.timestamp;

  return measurement;
}
```

### Almacenamiento Local (Backup)

```cpp
#include <SD.h>

void saveToLocalStorage(ElectricalMeasurement measurement) {
  if(!SD.begin(4)) {
    return; // SD no disponible
  }

  File dataFile = SD.open("measurements.csv", FILE_WRITE);

  if(dataFile) {
    // Formato CSV para análisis posterior
    dataFile.print(measurement.timestamp);
    dataFile.print(",");
    dataFile.print(measurement.voltage, 2);
    dataFile.print(",");
    dataFile.print(measurement.current, 3);
    dataFile.print(",");
    dataFile.print(measurement.power, 2);
    dataFile.print(",");
    dataFile.println(measurement.energy, 4);

    dataFile.close();
  }
}
```

## 🔧 Configuración y Mantenimiento

### Over-The-Air Updates (OTA)

```cpp
#include <ArduinoOTA.h>
#include <ESP32httpUpdate.h>

void setupOTA() {
  ArduinoOTA.setHostname(deviceId.c_str());
  ArduinoOTA.setPassword(otaPassword.c_str());

  ArduinoOTA.onStart([]() {
    String type = (ArduinoOTA.getCommand() == U_FLASH) ? "sketch" : "filesystem";
    Serial.println("Start updating " + type);

    // Apagar relé durante actualización por seguridad
    digitalWrite(RELAY_PIN, LOW);
  });

  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
    ESP.restart();
  });

  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    sendErrorAlert("OTA_FAILED", error);
  });

  ArduinoOTA.begin();
}

void checkForUpdates() {
  String updateURL = "https://updates.electricautomaticchile.cl/firmware/";
  updateURL += deviceId + "/latest.bin";

  t_httpUpdate_return ret = httpUpdate.update(updateURL);

  switch(ret) {
    case HTTP_UPDATE_FAILED:
      sendErrorAlert("UPDATE_FAILED", httpUpdate.getLastError());
      break;
    case HTTP_UPDATE_NO_UPDATES:
      Serial.println("No updates available");
      break;
    case HTTP_UPDATE_OK:
      Serial.println("Update successful, restarting...");
      ESP.restart();
      break;
  }
}
```

### Diagnóstico y Autotest

```cpp
struct DiagnosticResult {
  bool wifi_connected;
  bool mqtt_connected;
  bool gps_working;
  bool sensors_ok;
  bool sd_card_ok;
  bool relay_working;
  float signal_strength;
  int free_memory;
};

DiagnosticResult runDiagnostics() {
  DiagnosticResult result = {0};

  // Test WiFi
  result.wifi_connected = (WiFi.status() == WL_CONNECTED);
  result.signal_strength = WiFi.RSSI();

  // Test MQTT
  result.mqtt_connected = mqttClient.connected();

  // Test GPS
  result.gps_working = (gps.satellites.value() > 3);

  // Test sensores
  float testVoltage = voltageSensor.getRmsVoltage();
  float testCurrent = currentSensor.getCurrentAC();
  result.sensors_ok = (testVoltage > 0 && testVoltage < 300 &&
                       testCurrent >= 0 && testCurrent < 35);

  // Test SD Card
  result.sd_card_ok = SD.begin(4);

  // Test relé (solo si está permitido)
  if(allowRelayTest) {
    bool originalState = digitalRead(RELAY_PIN);
    digitalWrite(RELAY_PIN, !originalState);
    delay(100);
    result.relay_working = (digitalRead(RELAY_PIN) != originalState);
    digitalWrite(RELAY_PIN, originalState); // Restaurar estado
  }

  // Memoria libre
  result.free_memory = ESP.getFreeHeap();

  return result;
}
```

## 📋 API de Integración

### Endpoints Backend para IoT

```typescript
// /api/iot/telemetry
export async function POST(request: Request) {
  const { device_id, data, signature } = await request.json();

  // Validar dispositivo y firma
  const device = await validateDevice(device_id, signature);
  if (!device) {
    return Response.json({ error: "Unauthorized device" }, { status: 401 });
  }

  // Procesar datos de telemetría
  await processTelemetryData(device_id, data);

  return Response.json({ status: "ok", timestamp: Date.now() });
}

// /api/iot/command
export async function POST(request: Request) {
  const { device_id, command, user_id } = await request.json();

  // Validar permisos del usuario
  const hasPermission = await validateUserDevicePermission(user_id, device_id);
  if (!hasPermission) {
    return Response.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  // Enviar comando al dispositivo
  await sendDeviceCommand(device_id, command);

  return Response.json({ status: "command_sent" });
}
```

## 🚨 Alertas y Monitoreo

### Sistema de Alertas Críticas

```cpp
enum AlertType {
  POWER_OUTAGE,
  OVERCURRENT,
  UNDERVOLTAGE,
  OVERVOLTAGE,
  DEVICE_TAMPER,
  GPS_FRAUD,
  COMMUNICATION_LOST
};

void sendCriticalAlert(AlertType type, float value = 0) {
  StaticJsonDocument<512> alertDoc;
  alertDoc["device_id"] = deviceId;
  alertDoc["timestamp"] = rtc.now().unixtime();
  alertDoc["alert_type"] = type;
  alertDoc["severity"] = "CRITICAL";
  alertDoc["value"] = value;
  alertDoc["location"]["lat"] = gps.location.lat();
  alertDoc["location"]["lng"] = gps.location.lng();

  String alertJson;
  serializeJson(alertDoc, alertJson);

  // Envío prioritario vía MQTT
  mqttClient.publish(
    (String("alerts/") + deviceId).c_str(),
    alertJson.c_str(),
    true // retained message
  );

  // Backup vía SMS si MQTT falla
  if(!mqttClient.connected()) {
    sendSMSAlert(alertJson);
  }
}
```



### Logs de Depuración

```cpp
void debugLog(String message, int level = 1) {
  if(debugMode && level <= debugLevel) {
    String timestamp = String(rtc.now().unixtime());
    String logEntry = timestamp + " [" + String(level) + "] " + message;

    Serial.println(logEntry);

    // Guardar en SD si está disponible
    if(SD.begin(4)) {
      File logFile = SD.open("debug.log", FILE_WRITE);
      if(logFile) {
        logFile.println(logEntry);
        logFile.close();
      }
    }
  }
}
```

---

**📋 Nota Técnica**: Esta documentación cubre la integración básica. Para implementaciones específicas, consultar con el equipo de IoT de ElectricAutomatic Chile.
