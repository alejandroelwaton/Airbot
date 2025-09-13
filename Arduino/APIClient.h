#pragma once
#include "Comunication.h"
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>

class APIClient_t {
    char* serverAddress;
    int port = 80;
    WiFiClient& wifi;
    
public:
    APIClient_t(WiFiClient& wifi, char* server_p, int port_p);
    HttpClient client;
    void POSTData(float t, float h, float co, float co2);
};

