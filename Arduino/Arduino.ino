#include "Comunication.h"
#include "APIClient.h"
#include "Sensors.h"
#include "BLEConnect.h"
#include "Activator.h"


WiFiConnector_t connector {};
BLEConnection_t BLEConnection {"1"};
APIClient_t httpClient {connector.wifi, " 04bbec11d220.ngrok-free.app", 80};


Sensors_t sensors;

const char* deviceID = "1";

//Setup
void setup() {
  Serial.begin(9600);
  BLEConnection.begin();
  while (!BLEConnection.enableWifi){
    BLEConnection.poll();
  }
  BLEConnection.terminate();
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
  //TODO:
  // Add the treshold for mild alert, normal alert, extreme alert
  //alert();
  delay(500);
}
