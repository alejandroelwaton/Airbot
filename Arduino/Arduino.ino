#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include <ArduinoBLE.h>

// Values for MQ Sensors
#define RL_MQ135 10000.0  // 10kΩ
#define RL_MQ9   10000.0  // 10kΩ
#define ADC_RESOLUTION 4095.0
#define VREF 3.3

//Bluetooth Connection
BLEService robotService("12345678-1234-1234-1234-123456789abc"); 
BLECharacteristic idCharacteristic("abcdefab-1234-5678-1234-abcdefabcdef", BLERead | BLENotify, 20);

// Calibrated sensors resistance values
float Ro_MQ135 = 3259.19; 
float Ro_MQ9   = 42400.0; 

//DHT sensor define
#define DHTTYPE DHT22 

// DHT (temperature) sensor pin
const int DHTPin = 2;
DHT dht(DHTPin, DHTTYPE);

// MQ sensors pins
const int MQ9_PIN = A0;
const int MQ135_PIN = A1;

//Data sent to api
float h;
float t;
float co_ppm;
float co2_ppm;
const char* deviceID = "1";


//MQ Read Functions
float readRS_MQ135() {
  int adcValue = analogRead(MQ135_PIN);
  float voltage = adcValue * (VREF / ADC_RESOLUTION);
  float rs = (VREF - voltage) * RL_MQ135 / voltage;
  return voltage;
}

float getAlcoholMQ135(float rs) {
  float ratio = rs / Ro_MQ135;
  float m = -0.66;
  float b = 1.15;
  return pow(10, (log10(ratio) - b) / m);
}

float getCO2MQ135(float rs) {
  float ratio = rs / Ro_MQ135;
  float m = -0.42;
  float b = 1.92;
  return pow(10, (log10(ratio) - b) / m);
}

float readRS_MQ9() {
  int adcValue = analogRead(MQ9_PIN);
  float voltage = adcValue * (VREF / ADC_RESOLUTION);
  float rs = (VREF - voltage) * RL_MQ9 / voltage;
  return voltage;
}

float getCOMQ9(float rs) {
  float ratio = rs / Ro_MQ9;
  float m = -0.77;
  float b = 0.36;
  return pow(10, (log10(ratio) - b) / m);
}

float getMethaneMQ9(float rs) {
  float ratio = rs / Ro_MQ9;
  float m = -0.38;
  float b = 0.28;
  return pow(10, (log10(ratio) - b) / m);
}

//Internet Connection
char ssid[] = "Alee";
char pass[] = "tucansito";

//API address
char serverAddress[] = "8b1abc5bb366.ngrok-free.app";
int port = 80;

//WiFi Client
WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

void POSTData(float t, float h, float co, float co2)
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

  client.post("/data", "application/json", output);  // ✅ SOLO la ruta

  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status: ");
  Serial.println(statusCode);
  Serial.print("Respuesta: ");
  Serial.println(response);
}

//Setup
void setup() {
  pinMode(LEDR, OUTPUT);
  pinMode(LEDB, OUTPUT);
  Serial.begin(9600);
  analogReadResolution(12);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    delay(1000);
    digitalWrite(LEDR, HIGH);
    Serial.println("Conectando...");
  }
  Serial.println("Conectado!");
  digitalWrite(LEDR, LOW);
  digitalWrite(LEDB, HIGH);
  //initBLE();
  dht.begin();
}

//Loop
void loop() {
  float rs135 = readRS_MQ135();
  float rs9 = readRS_MQ9();
  t = dht.readTemperature();
  h = dht.readHumidity();
  //co_ppm = getCOMQ9(Ro_MQ9);

  POSTData(t, h, rs9, rs135);
  //BLE.poll();
  delay(500);
}
