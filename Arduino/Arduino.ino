#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include <DHT.h>


#define DHTTYPE DHT22 

// Wi-Fi
char ssid[] = ".TigoWiFi-394220476/0";
char pass[] = "WiFi-91963098";

// Sensor
const int DHTPin = 2;

DHT dht(DHTPin, DHTTYPE);

float h;
float t; 



// Server
char serverAddress[] = "192.168.0.8"; // IP del servidor backend en tu red local
int port = 8000;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

void POSTTemperature()
{
  h = dht.readHumidity();
  t = dht.readTemperature();

  StaticJsonDocument<200> doc;
  doc["temp"] = t;
  doc["hum"] = h;

  String output;
  serializeJson(doc, output);

  Serial.print("Enviando JSON: ");
  Serial.println(output);
  // POST con cuerpo JSON
  client.beginRequest();
  client.post("/data");
  client.sendHeader("Content-Type", "application/json");
  client.sendHeader("Content-Length", output.length());
  client.beginBody();
  client.print(output);
  client.endRequest();

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
  Serial.print("Temperatura-> ");
  Serial.println(t);
  Serial.print("Status: ");
  Serial.println(statusCode);
  Serial.print("Respuesta: ");
  Serial.println(response);
}

void setup() {
  pinMode(LEDR, OUTPUT);
  pinMode(LEDB, OUTPUT);
  Serial.begin(9600);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    delay(1000);
    digitalWrite(LEDR, HIGH);
    Serial.println("Conectando...");
  }
  Serial.println("Conectado!");
  digitalWrite(LEDR, LOW);
  digitalWrite(LEDB, HIGH);

  dht.begin();
}

void loop() {
  POSTTemperature();
  delay(500);
}
