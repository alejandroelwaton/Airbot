#include <ArduinoBLE.h>

class BLEConnection_t {
private:
    BLEService robotService;
    BLECharacteristic idCharacteristic;
    BLECharacteristic ssidCharacteristic;
    BLECharacteristic passCharacteristic;
    BLEByteCharacteristic wifiTriggerCharacteristic;
    String robotID;

public:
    BLEConnection_t(const char* id);
    ~BLEConnection_t();
    bool enableWifi = false;
    bool begin();
    void poll();
    void notifyID(String newID);
    void readSSID();
    void readPass();
    String ssid;
    String pass;
};
