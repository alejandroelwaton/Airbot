#include "Comunication.h"
#include "APIClient.h"
#include "Sensors.h"
#include "BLEConnect.h"


WiFiConnector_t connector {};
BLEConnection_t BLEConnection {"1"};
APIClient_t httpClient {connector.wifi, "972d658b6f85.ngrok-free.app", 80};


Sensors_t sensors;

const char* deviceID = "1";

//Setup
void setup() {
  Serial.begin(9600);
  BLEConnection.begin();
  while (!BLEConnection.enableWifi){
    BLEConnection.poll();
  }
  BLE.end();
  delay(1000);
  // Add these lines to perform a full reset of the Wi-Fi module
  WiFi.disconnect(); // Disconnect from any network
  delay(500);
  WiFi.end(); // Shut down the module completely
  delay(1000); // Add a small delay for a clean transition
  connector.setWPA(BLEConnection.ssid.c_str(), BLEConnection.pass.c_str());
  connector.begin();
  delay(500);
  sensors.begin();
}

//Loop
void loop() {
  sensors.update();
  httpClient.POSTData(
    sensors.temperature,
    sensors.humidity,
    sensors.mq_9,
    sensors.mq_135
  );
  delay(500);
}
