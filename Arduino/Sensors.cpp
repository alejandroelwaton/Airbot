#include "Sensors.h"

//DHT sensor define
#define DHTTYPE DHT22 

// DHT (temperature) sensor pin
const int DHTPin = 4;
DHT dht(DHTPin, DHTTYPE);

// Calibrated sensors resistance values
float Ro_MQ135 = 3259.19; 
float Ro_MQ9   = 42400.0; 

// MQ sensors pins
const int MQ9_PIN = A1;
const int MQ135_PIN = A0;

float readRS_MQ135() {
  return analogRead(MQ135_PIN);
  // float voltage = adcValue * (VREF / ADC_RESOLUTION);
  // voltage = voltage * 2;
  // float rs = (VREF - voltage) * RL_MQ135 / voltage;
  // return rs;
}

float readRS_MQ9() {
   return analogRead(MQ9_PIN);
  // float voltage = adcValue * (VREF / ADC_RESOLUTION);
  // voltage*=2;
  // float rs = (VREF - voltage) * RL_MQ9 / voltage;
  // return rs;
}


void Sensors_t::begin() {
  pinMode(MQ9_PIN, INPUT);
  pinMode(MQ135_PIN, INPUT);
  dht.begin();
}
void Sensors_t::update() {
    mq_135 = readRS_MQ135();
    mq_9 = readRS_MQ9();
    temperature = dht.readTemperature();
    humidity = dht.readHumidity();
}