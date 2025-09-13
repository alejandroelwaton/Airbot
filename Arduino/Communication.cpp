#include "Comunication.h"

WiFiConnector_t::WiFiConnector_t(){}
void WiFiConnector_t::begin(){
    pinMode(LEDR, OUTPUT);
    Serial.println("Connecting to wifi");
    Serial.print("SSID : ");
    Serial.println(ssid);
    Serial.print("Password : ");
    Serial.println(password);

    while (WiFi.begin(ssid, password) != WL_CONNECTED) {
        delay(1000);
        digitalWrite(LEDR, HIGH);
        Serial.println("Connecting...");
    }
    isConnected = true;
    Serial.println("Connected!");
    digitalWrite(LEDR, LOW);
    digitalWrite(LEDB, HIGH);
    pinMode(LEDB, OUTPUT);
}

void WiFiConnector_t::setWPA(const char* ssid_p, const char* password_p)
{
    ssid = ssid_p;
    password = password_p;
    Serial.println("WPA setted");
}
