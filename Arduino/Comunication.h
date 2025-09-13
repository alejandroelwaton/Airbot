#pragma once
#include <WiFiNINA.h>

class WiFiConnector_t
{
    const char* ssid;
    const char* password;
public:
    WiFiConnector_t();
    void begin();
    void setWPA(const char* ssid, const char* password);
    bool isConnected = false;
    WiFiClient wifi;
};