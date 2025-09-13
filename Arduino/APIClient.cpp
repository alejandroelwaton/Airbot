#include "APIClient.h"

APIClient_t::APIClient_t(WiFiClient& wifi_p, char* server_p, int port_p):
    wifi(wifi_p),
    serverAddress(server_p),
    port(port_p),
    client(wifi_p, server_p, port_p)
    {}

void APIClient_t::POSTData(float t, float h, float co, float co2)
{
  StaticJsonDocument<256> doc;
  doc["ID"] = 1;
  doc["temp"] = t;
  doc["hum"] = h;
  doc["co"] = co;     // MQ-9 en ppm
  doc["co2"] = co2;   // MQ-135 en ppm

  String output;
  serializeJson(doc, output);

  Serial.print("Enviando JSON: ");
  Serial.println(output);

  client.post("/data", "application/json", output);

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status: ");
  Serial.println(statusCode);
  Serial.print("Respuesta: ");
  Serial.println(response);
}