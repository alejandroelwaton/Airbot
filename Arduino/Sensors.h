#pragma once
#include <Arduino.h>
#include <DHT.h>

// Values for MQ Sensors
#define RL_MQ135 10000.0  // 10kΩ
#define RL_MQ9   10000.0  // 10kΩ
#define ADC_RESOLUTION 4095.0
#define VREF 2.5

//MQ Read Functions
float readRS_MQ135();

float readRS_MQ9();

struct Sensors_t{
public:
    void begin();
    void update();
    float mq_135;
    float mq_9;
    float temperature;
    float humidity;
};
