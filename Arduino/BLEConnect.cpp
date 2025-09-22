#include "BLEConnect.h"
#include <WiFiNINA.h>

BLEConnection_t::BLEConnection_t(const char* id) 
        : robotService(      "19b10000-e8f2-537e-4f6c-d104768a1214"),
          idCharacteristic(  "19b10001-e8f2-537e-4f6c-d104768a1214", BLERead | BLENotify, 20),
          ssidCharacteristic("19b10002-e8f2-537e-4f6c-d104768a1214", BLEWrite, 32),
          passCharacteristic("19b10003-e8f2-537e-4f6c-d104768a1214", BLEWrite, 32),
          wifiTriggerCharacteristic("19b10004-e8f2-537e-4f6c-d104768a1214", BLEWrite),
          robotID(id)
    {}

bool BLEConnection_t::begin() {
    pinMode(LEDG, OUTPUT);
    if (!BLE.begin()) {
        Serial.println("BLE could'nt initalize");
        return false;
    }
    digitalWrite(LEDG, HIGH);

    robotService.addCharacteristic(idCharacteristic);
    robotService.addCharacteristic(ssidCharacteristic);
    robotService.addCharacteristic(passCharacteristic);
    robotService.addCharacteristic(wifiTriggerCharacteristic);
    BLE.addService(robotService);
    BLE.setAdvertisedService(robotService);
    BLE.setLocalName("SensorBot");
    BLE.advertise();
    
    idCharacteristic.writeValue(robotID.c_str());
    
    BLE.advertise();
    Serial.println("BLE ready, published");
    return true;    
}

BLEConnection_t::~BLEConnection_t() {
    BLE.end();
}

void BLEConnection_t::poll() {
    BLEDevice central = BLE.central();
    if (central) {
        notifyID(robotID); 
        readPass();
        readSSID();
        if (wifiTriggerCharacteristic.written())
        {
            enableWifi = true;
            Serial.println("Enabled WIFI");
        }
    }
}


void BLEConnection_t::notifyID(String newID) {
    robotID = newID;
    idCharacteristic.writeValue(robotID.c_str());
}

void BLEConnection_t::readSSID() {
    if (ssidCharacteristic.written()) {
        int len = ssidCharacteristic.valueLength();
        const uint8_t* data = ssidCharacteristic.value();
        ssid = String((const char*)data, len);
    }
}

void BLEConnection_t::readPass() {
    if (passCharacteristic.written()) {
        int len = passCharacteristic.valueLength();
        const uint8_t* data = passCharacteristic.value();
        pass = String((const char*)data, len);
    }
}


void BLEConnection_t::terminate() {
    BLE.end();
    delay(1000);
    WiFi.disconnect();
    delay(500);
    WiFi.end(); 
    delay(1000);
}